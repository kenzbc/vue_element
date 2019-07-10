<template>
    <div class="mlog-list">
        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="id" label="id" align="center" width="100"></el-table-column>
            <el-table-column prop="add_time_txt" label="创建时间" align="center" width=""></el-table-column>
            <el-table-column label="创建人" align="center" width="">
                <template scope="scope">
                    {{scope.row.op_name}}({{scope.row.op_id}})
                </template>
            </el-table-column>
            <el-table-column prop="status_txt" label="任务状态" align="center"></el-table-column>
            <el-table-column prop="total" label="数据条数" align="center"></el-table-column>

            <el-table-column label="操作" class="center" align="center" width="240">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="roomAction('download',scope.row)" :disabled="scope.row.status == 2 || scope.row.status == 3">下载</el-button>
                    <!--<a :href="scope.row.url" tag="el-button" class="el-button&#45;&#45;small el-button&#45;&#45;primary" :disabled="scope.row.status == 2 || scope.row.status == 3">下载</a>-->
                    <el-button size="small" type="danger" @click="roomAction('cancel',scope.row)" :disabled="scope.row.status == 1 || scope.row.status == 3">取消</el-button>
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
                    act: 'getExportList',
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
                this.ajax('mlog_list', this.tableQueryParams, function (response) {
                    _this.loading = false
                    _this.tableData = response.data.data.list
	                _this.total = parseInt(response.data.data.count)
                });
            },
            roomAction (type,row) {
                const _this = this
                switch (type) {
                    case 'cancel':
                        this.$confirm('确定取消吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(({ value }) => {
                            _this.ajax('mlog_list', {id: row.id,act:'cancelExport'}, function (response) {
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
