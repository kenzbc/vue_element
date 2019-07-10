<template>
    <div class="promotional-list">
        <el-form :inline="true" :model="queryParams">
            <!--<el-form-item>-->
                <!--<el-radio-group v-model="queryParams.type">-->
                    <!--<el-radio-button label="">全部</el-radio-button>-->
                    <!--<el-radio-button label="0">未开始</el-radio-button>-->
                    <!--<el-radio-button label="1">进行中</el-radio-button>-->
                    <!--<el-radio-button label="2">已结束</el-radio-button>-->
                <!--</el-radio-group>-->
            <!--</el-form-item>-->

            <el-form-item  style="float:right;margin-right: 0">
                <router-link to="/promotional/create">
                    <el-button type="primary" icon="plus">添加活动</el-button>
                </router-link>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="pmt_id" label="ID" width="100" align="center"></el-table-column>
            <el-table-column prop="pmt_id" label="活动名称" align="center"></el-table-column>
            <el-table-column prop="pmt_desc" label="活动描述" align="center"></el-table-column>
            <el-table-column label="状态" align="center" wdith="100">
                <template scope="scope">{{scope.row.status == 0 ? '未开始' : (scope.row.status == 1 ? '进行中' : '已结束')}}</template>
            </el-table-column>
            <el-table-column prop="start_time" label="开始时间" align="center" wdith="150"></el-table-column>
            <el-table-column prop="end_time" label="结束时间" align="center" wdith="150"></el-table-column>
            <el-table-column label="操作" class="center" align="center" width="150">
                <template scope="scope">
                    <router-link :to="'/promotional/' + scope.row.pmt_id" tag="el-button" class="el-button--small el-button--primary" v-if="scope.row.status != 2">编辑</router-link>
                    <router-link :to="'/promotional/' + scope.row.pmt_id" tag="el-button" class="el-button--small el-button--success" v-else>查看</router-link>
                    <el-button size="small" type="danger" @click="roomAction('delete',scope.row)" :disabled="scope.row.status == 2">删除</el-button>
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
                },
                queryParams: {
//                    status: '',
                    page: 1,
                    limit: 15,
                },
                tableData: [],
                total: 0,
                loading: false
            }
        },
        watch: {
            queryParams: {
                handler (data) {
                    this.requestList()
                },
                deep: true
            }
        },
        mounted () {
            this.requestList();
        },
        methods: {
            requestList () {
                const _this = this
                _this.loading = true
                this.ajax('get_promotional_activities_list.php',this.queryParams, function (response) {
                    if (response.data.code == 200) {
                        _this.tableData = response.data.data.list
                        _this.total = parseInt(response.data.data.count)
                    }
                    _this.loading = false
                })
            },
            roomAction (type,row) {
                const _this = this
                switch (type) {
                    case 'delete':
                        this.$confirm('确定要删除这个活动吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            _this.ajax('edit_promotional_activity.php', {action: 'del',pmt_id: row.pmt_id}, function (response) {
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
                        })
                        break
                }
            },
            handleSizeChange (val) {
                this.queryParams.limit = val;
                this.requestList();
            },
            handleCurrentChange (val) {
                this.queryParams.page = val;
                this.requestList();
            }
        },
        computed: {
        }
    }
</script>

<style>
</style>
