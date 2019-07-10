<template>
    <div class="banner-list">
        <el-form :inline="true" :model="queryParams">
            <el-form-item>
                <el-radio-group v-model="queryParams.type">
                    <el-radio-button label="">全部</el-radio-button>
                    <el-radio-button label="0">房间封面</el-radio-button>
                    <el-radio-button label="1">大厅轮播</el-radio-button>
                    <el-radio-button label="2">购物页轮播</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item  style="float:right;margin-right: 0">
                <router-link to="/banner/create">
                    <el-button type="primary" icon="plus">添加轮播</el-button>
                </router-link>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="sorting" label="排序"  align="center"></el-table-column>
            <el-table-column prop="id" label="轮播ID"  align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="center" ></el-table-column>
            <el-table-column label="图片" align="center" >
                <template scope="scope">
                    <a :href="scope.row.image_url" target="_blank"><img class="cover-list-image" :src="scope.row.image_url" /></a>
                </template>
            </el-table-column>
            <el-table-column label="类型" align="center" >
                <template scope="scope">{{scope.row.type == 0 ? '房间封面' : (scope.row.type == 1 ? '大厅轮播' : '购物页轮播')}}</template>
            </el-table-column>
            <el-table-column prop="add_time" label="添加时间" align="center" wdith="100"></el-table-column>
            <el-table-column label="操作" class="center" align="center" width="150">
                <template scope="scope">
                    <router-link :to="'/banner/' + scope.row.id" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
                    <el-button size="small" type="danger" @click="roomAction('delete',scope.row)">删除</el-button>
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
                    type: '',
                    page: 1,
                    limit: 10,
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
                this.ajax('search_cover_list.php',this.queryParams, function (response) {
                    if (response.data.code == 200) {
                        _this.tableData = response.data.data.list;
                        _this.total = parseInt(response.data.data.count)
                    }
                    _this.loading = false
                })
            },
            roomAction (type,row) {
                const _this = this
                switch (type) {
                    case 'delete':
                        this.$confirm('确定要删除这个轮播吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            _this.ajax('create_edit_cover.php', {action: 'del',banner_id: row.id}, function (response) {
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
    .cover-list-image {
        height: 55px;
        width: auto;
        display: block;
        margin: 5px auto;
        vertical-align: middle;
    }
</style>
