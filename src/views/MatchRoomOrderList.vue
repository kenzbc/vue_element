<template>
    <div class="match-room-order-list">
        <el-form :inline="true">
            <el-form-item>
                <el-input placeholder="订单号" v-model="queryParams.order_id" @keydown.enter="request"></el-input>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="用户ID" v-model="queryParams.member_param" @keydown.enter="request"></el-input>
            </el-form-item>

            <el-form-item style="float:right;margin-right: 0">
                <el-button type="default" icon="arrow-left" @click="back">返回</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe v-loading="loading">
            <el-table-column align="center" prop="id" label="订单号" width="250"></el-table-column>
            <el-table-column align="center" prop="add_time" label="参与时间" width="200"></el-table-column>
            <el-table-column align="center" prop="type" label="奖池类型" width="250"> </el-table-column>
            <el-table-column align="center" prop="name" label="组合名称"></el-table-column>
            <el-table-column align="center" label="参与用户">
                <template scope="scope">
                    {{ scope.row.nickname }}（ID：{{ scope.row.member_id }}）
                </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="匹配状态">
                <template scope="scope">
                    <el-tag :type="scope.row.status == '匹配成功' ? 'success' : 'danger'" :hit="true">{{ scope.row.status }}{{scope.row.contrast_id}}</el-tag>
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
                dialog: {
                    title: '操作确认',
                    message: '确定要进行此操作吗？',
                    visible: false,
                    callback () {}
                },
                queryParams: {
                    page: 1,
                    limit: 15,
                    member_param: '',
                    room_id: '',
                    order_id: ''
                },
                tableData: [],
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
            this.queryParams.room_id = this.$route.params.id
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
                this.ajax('get_room_order_list.php', this.queryParams, function (response) {
                    _this.loading = false
                    _this.tableData = response.data.data.list
                    _this.total = response.data.data.total
                });
            },
            handleSizeChange (val) {
                this.queryParams.limit = val
            },
            handleCurrentChange (val) {
                this.queryParams.page = val
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
