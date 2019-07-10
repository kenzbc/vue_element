<template>
    <div class="portfolio-list">
        <el-form :inline="true" :model="queryParams">
            <el-form-item  style="float:right;margin-right: 0">
                <router-link :to="{ path:'/portfolio/create', query: { teamID:  this.$route.query.teamID} }">
                    <el-button type="default" icon="plus">新增</el-button>
                </router-link>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="" label="时间范围" align="center" width="">
                <template scope="scope">
                    {{scope.row.start_time}}~{{scope.row.end_time == '0'? '至今': scope.row.end_time}}
                </template>
            </el-table-column>
            <el-table-column prop="player_nickname" label="选手名称" align="center" width=""></el-table-column>
            <el-table-column prop="playerID" label="选手ID" align="center"></el-table-column>
            <el-table-column prop="position_name" label="位置" align="center"></el-table-column>
            <el-table-column label="操作" class="center" align="center" width="240">
                <template scope="scope">
                    <router-link :to="{ path:'/portfolio/'+ scope.row.id, query: { teamID:  $route.query.teamID} }" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
                    <el-button size="small" type="danger" @click="roomAction('del',scope.row)" :disabled="scope.row.is_delete == 1">删除</el-button>
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
                queryParams: {
	                teamID:'',
	                page: 1,
	                limit: 20,
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
            requestList (data) {
                const _this = this
                _this.loading = true
	            this.ajax('match/career_portfolio_list.php', this.queryParams, function (response) {
		            if (response.data.code == 200) {
			            _this.loading = false
			            _this.tableData = response.data.data.list;
			            _this.total = parseInt(response.data.data.count)
		            } else {
			            _this.$message.error({
				            message: response.data.message,
			            })
		            }
	            })
            },
            roomAction (type,row) {
                const _this = this
                switch (type) {
                    case 'del':
                        this.$confirm('确定删除吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(({ value }) => {
                            _this.ajax('match/career_portfolio_op.php', {id: row.id,act:'del'}, function (response) {
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
	                case 'download':
		                this.$confirm('确定下载吗？', '提示', {
			                confirmButtonText: '确定',
			                cancelButtonText: '取消',
			                type: 'warning'
		                }).then(({ value }) => {
			                location.href = row.url;
		                }).catch(() => {

		                });
		                break
                }
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
