<template>
    <div class="faq-list">
        <el-form :inline="true" :model="queryParams">
            <el-form-item >
                <el-select v-model="queryParams.cate_id" placeholder="类型" size="5" clearable>
                    <el-option :label="item.name" :value="item.id" v-for="(item,index) in selectOptions" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-input placeholder="FAQ标题" v-model="queryParams.title" :icon="keywordIcon('keyword')" :on-icon-click="clearInputText">
                </el-input>
            </el-form-item>
            <el-form-item style="float:right;margin-right: 0">
                <router-link to="/faq-list/create">
                    <el-button type="primary" icon="plus">添加</el-button>
                </router-link>
            </el-form-item>

        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="id" label="ID" width="" align="center"></el-table-column>

            <el-table-column prop="name" label="FAQ分类" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" align="center" width=""></el-table-column>
            <el-table-column prop="add_time" label="时间" align="center" width=""></el-table-column>

            <el-table-column label="操作" class="center" align="center" width="">
                <template scope="scope">
                    <router-link :to="'/faq-list/' + scope.row.id" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
                    <el-button size="small" type="danger" @click="roomAction('delete',scope.row)" >删除</el-button>
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
                selectOptions: {
                },
                datetime:'',
                queryParams: {
                    cate_id: '',
                    name:'',
                    id: '',
                    title: '',
                    page: 1,
                    limit: 15,
                },
                tableData: [],
                total: 0,
                loading: false
            }
        },
        watch: {
//            datetime (data) {
//                this.queryParams.begin_time = data[0] ? this.moment(data[0]).format('YYYY-MM-DD HH:mm:ss') : ''
//                this.queryParams.end_time = data[0] ? this.moment(data[1]).format('YYYY-MM-DD HH:mm:ss') : ''
//            },
            queryParams: {
                handler (data,old) {
                    console.log(data.param_name,old.param_name)
                    this.requestList()
                },
                deep: true
            }
        },
        mounted () {
            this.categoryList();
            this.requestList();
        },
        methods: {
            categoryList () {
                const _this = this
                _this.loading = true
                this.ajax('faq/get_faq_category_list.php',this.tableQueryParams, function (response) {
                    if (response.data.code == 200) {
                        _this.selectOptions = response.data.data.list
//                        _this.total = parseInt(response.data.data.count)
                    }
                    _this.loading = false
                })
            },
	        roomAction (type,row) {
		        const _this = this
		        switch (type) {
			        case 'delete':
				        this.$confirm('确定要删除这个问答吗？', '提示', {
					        confirmButtonText: '确定',
					        cancelButtonText: '取消',
					        type: 'warning'
				        }).then(() => {
					        _this.ajax('faq/edit_faq.php', {id:row.id,action: 'delete'}, function (response) {
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
			        case 'finish':
				        this.$confirm('确定要标记处理这个问题吗？', '提示', {
					        confirmButtonText: '确定',
					        cancelButtonText: '取消',
					        type: 'warning'
				        }).then(() => {
					        _this.ajax('faq/edit_faq_feedback.php', {id:row.id,action: 'process'}, function (response) {
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
			        case 'handle':
				        this.$confirm('确定要发送留言处理这个问题吗？', '提示', {
					        confirmButtonText: '确定',
					        cancelButtonText: '取消',
					        type: 'warning'
				        }).then(() => {
					        _this.ajax('faq/edit_faq_feedback.php', {id:row.id,action: 'process',message:row.message,member_id:row.member_id}, function (response) {
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
            requestList () {
                const _this = this
                _this.loading = true
                this.ajax('faq/get_faq_list.php',this.tableQueryParams, function (response) {
                    if (response.data.code == 200) {
                        _this.tableData = response.data.data.list
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
            },
            clearInputText () {
                console.log(event)
                this.queryParams.keyword = ''
            },
            keywordIcon (key) {
//                return this.queryParams[key].length ? 'circle-close' : 'edit'
            },
            optionsFormat (type,key) {
                return this.selectOptions[type][key]
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
