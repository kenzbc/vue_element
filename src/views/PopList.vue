<template>
    <div class="room-list">
        <el-form :inline="true" :model="formInline">
            <el-form-item  style="float:right;margin-right: 0">
                <router-link to="/pop/create">
                    <el-button type="primary" icon="plus">新增弹窗</el-button>
                </router-link>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="id" label="弹窗ID" align="center"></el-table-column>
            <el-table-column prop="title" label="弹窗标题" align="center"></el-table-column>
            <el-table-column label="app图片">
                <template scope="scope"><img :src="scope.row.app_image_url" style="max-width: 250px;" ></template>
            </el-table-column>
            <el-table-column label="web图片" align="center">
                <template scope="scope"><img :src="scope.row.image_url" style="max-width: 250px;" ></template>
            </el-table-column>
            <el-table-column prop="start_time" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="end_time" label="结束时间" align="center"></el-table-column>
            <el-table-column prop="type" label="显示频率" align="center"></el-table-column>
            <el-table-column label="操作" class="center" align="center">
                <template scope="scope">
                    <router-link :to="{ path:'/pop/' + scope.row.id }" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
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
                    title: '',
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
            requestList (data) {
                const _this = this
                _this.loading = true
                this.ajax('get_pop_up_list.php', this.tableQueryParams, function (response) {
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
                            _this.ajax('edit_pop_up.php', {pop_id: row.id,action:'delete'}, function (response) {
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
                }
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

</style>
