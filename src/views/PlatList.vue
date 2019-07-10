<template>
    <div class="room-list">
        <el-form :inline="true" :model="formInline">
            <el-form-item  style="float:right;margin-right: 0">
                <el-button :plain="true" @click="roomAction('clear_ssdb')" type="danger">重新生成全部房间列表</el-button>
                <router-link to="/plat/create">
                    <el-button type="default" icon="plus">新增板块</el-button>
                </router-link>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="name" label="板块名称" align="center"></el-table-column>
            <el-table-column prop="demo" label="板块描述" align="center"></el-table-column>
            <el-table-column prop="sorting" label="权重" align="center"></el-table-column>
            <el-table-column label="房间数量" align="center">
                <template scope="scope">
                    <span>{{scope.row.process_num}}/{{scope.row.begin_num}}</span>
                </template>
            </el-table-column>
            <el-table-column label="门票要求" align="center">
                <template scope="scope">
                    <span>{{scope.row.ticket_low}}~{{scope.row.ticket_high}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="tournament_name" label="包含赛事" align="center"></el-table-column>
            <el-table-column prop="room_type" label="房间类型" align="center"></el-table-column>
            <el-table-column label="自动隐藏" align="center">
                <template scope="scope">
                    <span>{{scope.row.is_hidden == 0 ? ' 是':' 否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" class="center" align="center">
                <template scope="scope">
                    <router-link :to="{ path:'/plat/' + scope.row.id }" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
                    <el-button size="small" type="danger" @click="roomAction('close',scope.row)" :disabled="scope.row.status == 1 || scope.row.status == 2">删除</el-button>
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
                    id: '',
                    name: '',
                    demo: '',
                    sorting: '',
                    ticket_low:'',
                    ticket_high:'',
                    tournament_id_string:'',
                    room_type:'',
                    is_hidden:'',
                    page: 1,
                    limit: 15,
                },
                formInline: {

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
                    this.requestList()
                },
                deep: true
            }
        },
        mounted () {
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
            roomTypeFormatter (row) {
                return this.optionsForObject(this.formInline.roomTypeOptions)[row.room_type]
            },
            optionsForObject (arr) {
                let obj = {};
                for (let i = 0; i < arr.length; i++) {
                    obj[arr[i].value] = arr[i].label
                }
                return obj;
            },
            requestList (data) {
                const _this = this
                _this.loading = true
                this.ajax('get_plat_list.php', this.tableQueryParams, function (response) {
                    _this.loading = false
                    _this.total = parseInt(response.data.data.count)
                    _this.tableData = response.data.data.list
                });
            },
            roomAction (type,row) {
                const _this = this
                switch (type) {
                    case 'close':
                        this.$confirm('确认删除', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(({ value }) => {
                            _this.ajax('edit_plat.php', {id: row.id,action:'delete'}, function (response) {
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
                    case 'clear_ssdb':
                        this.$confirm('确认刷缓存？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(({ value }) => {
                            _this.ajax('edit_plat.php', {action:'clear_ssdb'}, function (response) {
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
                }
            },
            handleSizeChange (val) {

                this.queryParams.limit = val
            },
            handleCurrentChange (val) {
                console.log(val,1)
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
    .el-table td.is-center .cell{
        word-wrap: break-word;
    }
</style>
