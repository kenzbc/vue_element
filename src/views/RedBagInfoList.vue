<template>
    <div class="red-bag-info-list">
        <el-form :inline="true">
            <el-form-item style="float:right;margin-right: 0">
                <el-button type="default" icon="arrow-left" @click="back">返回</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border stripe v-loading="loading">
            <el-table-column align="center" prop="nickname" label="领取人"></el-table-column>
            <el-table-column align="center" prop="diamond" label="金额">
                <template scope="scope">
                    {{scope.row.diamond}}{{scope.row.is_best == 1 ? '【最佳】' : ''}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="add_time" label="时间"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                queryParams: {
                    page: 1,
                    limit: 15,
                },
                tableData: [],
                loading: false
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
            }
        },
        mounted () {
            this.requestList()
        },
        methods: {

            back () {
                this.$router.back();
            },
            requestList () {

                let _this = this;

                _this.loading = true;
                this.ajax('welfare/red_bag_detail.php', {order_id: this.$route.params.id}, function (response) {
                    _this.loading = false
                    _this.tableData = response.data.data.list
                });

            },
        }
    }
</script>

<style>
</style>
