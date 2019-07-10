<template>
    <div class="match-room-order-list">
        <el-form :inline="true">
            <el-form-item>
                <el-radio-group v-model="queryParams.status">
                    <el-radio-button label="-1">全部</el-radio-button>
                    <el-radio-button label="1">已关闭</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="房间ID" v-model="queryParams.id" @keydown.enter="request"></el-input>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="房间名称" v-model="queryParams.name" @keydown.enter="request"></el-input>
            </el-form-item>

            <el-form-item style="float:right;margin-right: 0">
                <el-button type="default" icon="arrow-left" @click="back">返回</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe v-loading="loading">
            <el-table-column align="center" prop="roomID" label="房间ID" width=""></el-table-column>
            <el-table-column align="center" prop="add_time" label="创建时间" width="145"></el-table-column>
            <el-table-column align="center" prop="name" label="房间名称" width=""></el-table-column>
            <el-table-column align="center" prop="at_end_time" label="截止时间" width=""></el-table-column>
            <el-table-column align="center" prop="price" label="门票价格" width=""></el-table-column>
            <el-table-column align="center" prop="join_num" label="人数上限" width=""></el-table-column>
            <el-table-column align="center" label="创建人" width="">
                <template scope="scope">
                    <span>{{scope.row.member_name}}({{scope.row.member_id}})</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="secret_key" label="房间口令"></el-table-column>
            <el-table-column align="center" label="奖金总额">
                <template scope="scope">
                    <span>{{scope.row.prize_type != 2 ? scope.row.prize_amount : scope.row.prize_desc}}（{{scope.row.prize_type == 1 ? '果子' : (scope.row.prize_type == 2 ? '门票': '其他')}}）</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="中奖范围">
                <template scope="scope">
                    <span>{{scope.row.prize_num}}{{scope.row.prize_range == 2 ? ' %':' 人'}}（{{scope.row.prize_range == 1 ? '固定人数' : '固定比例'}}）</span>                </template>
            </el-table-column>
            <el-table-column align="center" label="分配范围">
                <template scope="scope">
                    <div>{{scope.row.assign_plan == 1 ? '均分' : '梯度'}}</div>
                    <table class="assign-plan-table" v-if="scope.row.assign_plan == 2">
                        <thead>
                        <tr>
                            <th width="80">#</th>
                            <th width="100">人数</th>
                            <th width="150">人均分配金额</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,index) in scope.row.assign_plan_rule">
                            <td>{{index+1}}</td>
                            <td>{{item.num}}</td>
                            <td>{{item.amount}}</td>
                        </tr>
                        </tbody>
                    </table>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" class="center">
                <template scope="scope">
                    <router-link :to="{ path:'/room/' + scope.row.roomID, query: { group_id: scope.row.group_id} }" tag="el-button" class="el-button--small el-button--primary" :class="{'is-disabled': scope.row.status == 1 || scope.row.status == 2}" :disabled="scope.row.status == 1 || scope.row.status == 2">编辑</router-link>
                    <el-button size="small" type="danger" @click="roomAction('close',scope.row)" :disabled="scope.row.status == 1 || scope.row.status == 2">关闭</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination :page-size="queryParams.limit" :page-sizes="[10, 15, 30, 50, 200]"  @size-change="handleSizeChange" :current-page="queryParams.page"  @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

        <el-dialog :title="dialog.title" v-model="dialog.visible" size="tiny">
            <div class="message">{{dialog.message}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="dialog.callback">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                roomID: 0,
                actionLoading: {
                    rec: {}
                },
                dialog: {
                    title: '操作确认',
                    message: '确定要进行此操作吗？',
                    visible: false,
                    callback () {}
                },
                queryParams: {
                    status: '-1',
                    groupID: '',
                    id: '',
                    name: '',
                    type: '',
                    page: 1,
                    limit: 15,
                },
                tableData: [],
                member_info:'',
                loading: false,
                total: 0,
                tableRowClass(row, index) {
                    if (row.status === '匹配失败') {
                        return 'fail';
                    }
                    return '';
                }
            }
        },
        mounted () {
            this.queryParams.groupID = this.$route.params.id
            this.requestList()
        },
        watch: {
            queryParams: {
                handler (data,oldData) {
                    this.requestList()
                },
                deep: true
            }
        },
        methods: {
            back () {
                this.$router.back();
            },
            requestList () {
                let _this = this;
                _this.loading = true;
                this.ajax('get_room_list.php', this.queryParams, function (response) {
                    _this.loading = false
                    _this.tableData = response.data.data.list
                    _this.member_info = response.data.data.list.member_name
                    _this.total = response.data.data.total
                });
            },
            handleSizeChange (val) {
                this.queryParams.limit = val
            },
            handleCurrentChange (val) {
                this.queryParams.page = val
            },
            roomAction (type,row) {
                const _this = this
                switch (type) {
                    case 'close':
                        this.$prompt('关闭理由', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            inputPattern: /^\S{0,10}$/,
                            inputErrorMessage: '不超过10个字'
                        }).then(({ value }) => {
                            _this.ajax('close_room.php', {roomID: row.roomID,message:value}, function (response) {
                                console.log(value)
                                if (response.data.code == 200) {
                                    _this.$message({
                                        type: 'success',
                                        message: response.data.message
                                    })
                                    _this.requestList()
                                } else {
                                    _this.$message.error({
                                        message: response.data.message,
                                    })
                                }
                                _this.dialog.visible = false
                            })
                        }).catch(() => {
//                            this.$message({
//                                type: 'info',
//                                message: '取消输入'
//                            });
                        });
                        break
                }
            },
        }
    }
</script>

<style>
    .match-player-team .el-col-12,
    .match-player-expand .el-col-12 {
        width: 49%;
    }

    .match-player-team .el-col-12:nth-child(2),
    .match-player-expand .el-col-12:nth-child(2) {
        margin-left: 2%;
    }

    .el-card.match-player {
        margin: 0 5px 10px 5px;
    }

    .match-player-team .el-col-12 {
        padding: 0 5px;
        line-height: 40px;
        font-weight: bold;
        font-size: 16px;
    }

    .el-card.match-player .content {
        padding: 0;
        line-height: 26px;
        font-size: 12px;
    }

    .el-card.match-player .content .name {
        padding: 0 10px;
        font-size: 14px;
        text-align: center;
    }

    .el-card.match-player .content .posAndPos {
        background-color: #475669;
        color: #fff;
        padding: 0 10px;
        height: 26px;
    }

    .el-card.match-player .content .posAndPos > span {
        display: inline-block;
    }

    .el-card.match-player .content .posAndPos .pos {
        float: left;
    }

    .el-card.match-player .content .posAndPos .score {
        float: right;
    }

    .el-card.match-player .el-card__body {
        padding: 0;
    }

    .el-card.match-player .el-card__body img {
        width: 100%;
        background-color: #e2e2e2;
        min-height: 123px;
    }
</style>
