<template>
    <div class="faq">
        <el-form :inline="true" :model="queryParams">
            <el-form-item  style="float:right;margin-right: 0">
                <router-link to="/faq/create">
                    <el-button type="primary" icon="plus">添加分类</el-button>
                </router-link>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
            <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
            <el-table-column prop="demo" label="描述" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
                <template scope="scope">{{scope.row.status == 0 ? '开启' : '关闭'}}</template>
            </el-table-column>
            <el-table-column label="操作" class="center" align="center" width="150">
                <template scope="scope">
                    <router-link :to="'/faq/' + scope.row.id" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
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
                this.ajax('faq/get_faq_category_list.php',this.queryParams, function (response) {
                    if (response.data.code == 200) {
                        _this.tableData = response.data.data.list;
                        _this.total = parseInt(response.data.data.count)
                    }
                    _this.loading = false
                })
            },
            handleSizeChange (val) {
                this.queryParams.limit = val;
                this.requestList();
            },
            handleCurrentChange (val) {
                this.queryParams.page = val;
                this.requestList();
            }
        }
    }
</script>

<style>
</style>
