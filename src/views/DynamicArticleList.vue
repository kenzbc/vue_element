<template>
    <div class="dynamic-article-list">
        <el-form :inline="true" :model="formInline">

            <el-form-item>
                <el-input placeholder="贴子ID" v-model="queryParams.dynamic_id"></el-input>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="文章标题" v-model="queryParams.title"></el-input>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="圈子ID" v-model="queryParams.circle_id"></el-input>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="用户ID" v-model="queryParams.member_id"></el-input>
            </el-form-item>

            <el-form-item>
                <el-select placeholder="选择语言" v-model="queryParams.language_string" size="" clearable>
                    <el-option v-for="item in formInline.languageOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item  style="float:right;margin-right: 0">
                <el-button size="" type="primary" @click="requestList">查询</el-button>
                <router-link to="/dynamic-article/create">
                    <el-button type="default" icon="plus">创建文章</el-button>
                </router-link>
            </el-form-item>

        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="dynamic_id" label="贴子ID" align="center"></el-table-column>
            <el-table-column prop="add_time" label="发布时间" :formatter="this.timeFormatter" align="center"></el-table-column>
            <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
            <el-table-column prop="nickname" label="作者" align="center"></el-table-column>
            <el-table-column prop="diamond_number" label="用户打赏（钻石）" align="center"></el-table-column>

            <el-table-column label="操作" class="center" align="center">
                <template scope="scope">
                    <router-link :to="{ path:'/dynamic-article/' + scope.row.dynamic_id }" tag="el-button" class="el-button--small el-button--primary">修改</router-link>
                    <el-button size="small" type="danger" @click="requestAction('delete',scope.row)">删除</el-button>
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
	                circle_id: '',
	                dynamic_id: '',
	                member_id: '',
	                title: '',
	                language_string: '',
                    page: 1,
                    limit: 15,
                },
                formInline: {
                    languageOptions: []
                },
                tableData: [],
                total: 0,
                loading: false,
            }
        },
        watch: {
	        // 'queryParams.language_string' (data) {
		     //    this.requestList()
	        // },
	        queryParams: {
		        // handler (data) {
			     //    this.requestList()
		        // },
		        // immediate: true,
		        // deep: true
	        }
        },
        mounted () {
	        this.requestLanguageList();
	        this.requestList()
        },
        methods: {
	        requestLanguageList () {
	           this.ajax('system/language_list.php', (response) => {
	               if (response.data.code == 200) {
	               	console.log(response.data);
	                let list = response.data.data;
	                for (let i in list) {
	        	        this.formInline.languageOptions.push({
	        		        label: list[i].display,
	        		        value: list[i].id
	        	        })
	                }
	                console.log(this.formInline.languageOptions);
	               } else {
	                this.$message.error({
	        	        message: response.data.message,
	                })
	               }
	           })
	        },
            requestList (data) {
                this.loading = true
	            this.ajax('dynamic/article_list.php', this.queryParams, ((response) => {
		            this.loading = false
		            this.total = parseInt(response.data.data.count)
		            this.tableData = response.data.data.list
                console.log(this.tableData);
	            }));
            },
	        requestAction (type,row) {
		        const _this = this
		        switch (type) {
			        case 'delete':
				        this.$prompt((row.language_id == '3' ? '（中文繁体）' : row.language_id == '2' ? '（English）' : '（中文简体）' )+ '删除理由', '提示', {
					        confirmButtonText: '确定',
					        cancelButtonText: '取消',
					        inputPattern: /^\S{0,30}$/,
					        inputErrorMessage: '不超过30个字'
				        }).then(({ value }) => {
					        _this.ajax('dynamic/del_article.php', {dynamic_id: row.dynamic_id,reason:value}, function (response) {
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
	        timeFormatter (row) {
		        return this.moment(row.add_time*1000).format('YYYY-MM-DD HH:mm:ss')
	        },
            handleSizeChange (val) {
                this.queryParams.limit = val
	            this.requestList();
            },
            handleCurrentChange (val) {
                this.queryParams.page = val
	            this.requestList();
            }
        }
    }

</script>

<style>

</style>
