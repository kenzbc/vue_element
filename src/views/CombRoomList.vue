<template>
    <div class="match-room-list">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-radio-group v-model="queryParams.status">
                    <el-radio-button label="">全部</el-radio-button>
                    <el-radio-button label="0">进行中</el-radio-button>
                    <el-radio-button label="1">已关闭</el-radio-button>
                    <el-radio-button label="2">已结算</el-radio-button>
                    <el-radio-button label="4">已截止</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-date-picker placeholder="房间截止时间" v-model="queryParams.at_end_time"></el-date-picker>
            </el-form-item>

            <el-form-item  style="float:right;margin-right: 0">
                <router-link to="/comb-room/create">
                    <el-button type="primary" icon="plus">创建组合</el-button>
                </router-link>
            </el-form-item>

        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="group_id" label="ID" width="60" align="center"></el-table-column>
            <el-table-column prop="group_name" label="组合名称" align="center"></el-table-column>
            <el-table-column prop="at_end_time" label="截止时间"  align="center"></el-table-column>
            <el-table-column prop="room_num" label="使用此自定义组合的房间" align="center" >
                <template scope="scope">
                    <router-link v-if="scope.row.room_num" :to="'/comb-room/order/' + scope.row.group_id" tag="el-button" class="el-button--small">{{scope.row.room_num + '个参与房间'}}</router-link>
                    <span v-else>暂无参与房间</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" class="center" align="center" >
                <template scope="scope">
                    <router-link :to="'/comb-room/' + scope.row.group_id" tag="el-button" class="el-button--small el-button--primary" :class="{'is-disabled': scope.row.status == 1 || scope.row.status == 2}" :disabled="scope.row.status == 1 || scope.row.status == 2">编辑</router-link>
                    <el-button size="small" type="danger" @click="roomAction('close',scope.row)" :disabled="scope.row.status == 1 || scope.row.status == 2">关闭</el-button>
                    <router-link :to="'/comb-room/comb/' + scope.row.group_id" tag="el-button" class="el-button--small el-button--info" :class="{'is-disabled': scope.row.status == 1 || scope.row.status == 2}" :disabled="scope.row.status == 1 || scope.row.status == 2">比赛管理</router-link>
                    <!--<el-button size="small" type="success" @click="roomAction('finish',scope.row)" :disabled="scope.row.status == 1 || scope.row.status == 2">结算</el-button>-->
                </template>
            </el-table-column>
            <el-table-column width="80" type="expand">
                <template scope="scope">
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="所选赛事">
                            <span>{{scope.row.tournament_list.join(' ') }}</span>
                        </el-form-item>
                    </el-form>
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="所选比赛">
                            <div class="select-match-list">
                                <div class="item" v-for="item in scope.row.match_list">
                                    <div class="info"><span>ID：{{item.matchID}}</span> <span class="team-name">{{item.team_name_a}}</span> <img :src="item.team_image_thumb_a" class="team-icon"> <span class="vs">vs</span> <img :src="item.team_image_thumb_b" class="team-icon"> <span class="team-name">{{item.team_name_b}}</span></div>
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination :page-size="queryParams.limit" :page-sizes="[10, 15, 30, 50, 200]"  @size-change="handleSizeChange" :current-page="queryParams.page"  @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                actionLoading: {
                    rec: {}
                },
                queryParams: {
                    status: '0',
                    at_end_time: '',
                    page: 1,
                    limit: 15,
                },
                formInline: {
                    roomTypeOptions: [
                        {
                            value: '1',
                            label: '新人'
                        },
                        {
                            value: '2',
                            label: '活动'
                        },
                        {
                            value: '3',
                            label: '日赛'
                        },
                        {
                            value: '4',
                            label: '周赛'
                        },
                        {
                            value: '5',
                            label: 'SOLO'
                        },
                        {
                            value: '6',
                            label: '名人'
                        },
                        {
                            value: '7',
                            label: '毒奶'
                        }
                    ],
                    isRequiredOptions: [
                        {
                            value: '1',
                            label: '必开'
                        },
                        {
                            value: '0',
                            label: '非必开'
                        }
                    ],
                    distributionOptions: [
                        {
                            value: '1',
                            label: '均分'
                        },
                        {
                            value: '2',
                            label: '梯度'
                        }
                    ]
                },
                tableData: [],
                total: 0,
                loading: false,
                isMounted: false
            }
        },
        watch: {
            queryParams: {
                handler (data,oldData) {
                    console.log('queryParams')
                    if (data.at_end_time) {
                        this.queryParams.at_end_time = this.moment(data.at_end_time).format('YYYY-MM-DD')
                    }
                    if (!isNaN(data.page) || !isNaN(data.limit)) {
                        data.limit = parseInt(data.limit)
                        data.page = parseInt(data.page)
                    }
                    this.$router.push({
                        path: '',
                        query: data
                    })

                },
                deep: true
            },
            '$route.query' : {
                handler (data) {
                    console.log('$route.query',this.$route.query)
                    this.requestList()
                },
                deep: true
            }
        },
        mounted () {
            console.log('mounted')
            if (!this.isMounted) {
                this.isMounted = true
                let data = this.queryParams
                if (!this.isEmptyObject(this.$route.query)) {
                    data = this.$route.query
                    this.queryParams = JSON.parse(JSON.stringify(data))
                    this.requestList()
                } else {
                    this.$router.push({
                        path: '',
                        query: data
                    })
                }
            }
        },
        methods: {
            isEmptyObject(e) {
                for (let t in e) return false;
                return true
            },
            requestList (data) {
                const _this = this
                _this.loading = true
                this.ajax('get_combination_list.php', this.tableQueryParams, function (response) {
                    _this.loading = false
                    _this.total = parseInt(response.data.data.count)
                    _this.tableData = response.data.data.list
                });
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

                            _this.ajax('close_combination.php', 'post', {groupID: row.group_id,message:value}, function (response) {
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

                        });
                        break
//                    case 'finish':
//                        this.$confirm('确定要结算这个房间吗？', '提示', {
//                            confirmButtonText: '确定',
//                            cancelButtonText: '取消',
//                            type: 'warning'
//                        }).then(() => {
//                            _this.ajax('settlement.php', {roomID: row.roomID}, function (response) {
//                                if (response.data.code == 200) {
//                                    _this.$message({
//                                        type: 'success',
//                                        message: response.data.message
//                                    })
//                                    _this.requestList()
//                                } else {
//                                    _this.$message.error({
//                                        message: response.data.message,
//                                    })
//                                }
//                                _this.dialog.visible = false
//                            })
//                        })
//                        break
                    case 'rec':
                        let rec = row.cms_rec == 1 ? 0 : 1
                        _this.actionLoading.rec[row.roomID] = true
                        _this.ajax('edit_room.php', {roomID: row.roomID,'action': 'is_rec', rec: rec}, function (response) {
                            _this.actionLoading.rec[row.roomID] = false
                            if (response.data.code == 200) {
                                row.cms_rec = rec
                                _this.$message({
                                    type: 'success',
                                    message: response.data.message
                                });
                            } else {
                                _this.$message.error({
                                    message: response.data.message,
                                });
                            }
                        });
                        break
                }
            },
            roomTypeFormatter (row) {
                return this.optionsForObject(this.formInline.roomTypeOptions)[row.type]
            },
            isMustOpenFormatter (row) {
                return this.optionsForObject(this.formInline.isRequiredOptions)[row.is_must_open]
            },
            prizeFormatter (row) {
                const prizeType = ['果子', '门票', '其他'];
                return prizeType[row.prize_type - 1] + '：' + row.prize_amount
            },
            prizeRangeFormatter(row) {
                const prizeRange = ['人数', '比例']
                return prizeRange[row.prize_range - 1] + '：' + row.prize_num + (row.prize_range == 1 ? '' : '%')
            },
            assignPlanFormatter(row) {
                const assignPlan = ['均分', '梯度'];
                return assignPlan[row.assign_plan - 1]
            },
            optionsForObject (arr) {
                let obj = {};
                for (let i = 0; i < arr.length; i++) {
                    obj[arr[i].value] = arr[i].label
                }
                return obj;
            },
            handleSizeChange (val) {
                this.queryParams.limit = val
            },
            handleCurrentChange (val) {
                this.queryParams.page = val
            },
            urlEncode (param, key, encode) {
                if (param == null) return ''
                let paramStr = '';
                let t = typeof (param);
                if (t == 'string' || t == 'number' || t == 'boolean') {
                    paramStr += '&' + key + '=' + ((encode === null || encode) ? encodeURIComponent(param) : param);
                } else {
                    for (let i in param) {
                        let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                        paramStr += urlEncode(param[i], k, encode);
                    }
                }
                return paramStr;
            }
        },
        computed: {
            tableQueryParams () {
                let tableQueryParams = {};
                for (let i in this.queryParams) {
                    if (this.queryParams[i] !== '') {
                        tableQueryParams[i] = this.queryParams[i];
                    }
                }
                return tableQueryParams;
            }
        }
    }

</script>

<style>

</style>
