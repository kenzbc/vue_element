<template>
    <div class="faq-list">
        <el-form :inline="true" :model="queryParams">
            <el-form-item >
                <el-select placeholder="是否处理" v-model="queryParams.status" size="5" clearable>
                    <el-option :label="item.label" :value="index" v-for="(item,index) in formInline.faqTypeOptions" :key="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-select placeholder="渠道id" v-model="queryParams.appid" size="8" clearable>
                    <el-option :label="item.name" :value="item.id" v-for="(item,index) in formInline.appIdList" :key="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-select placeholder="类型" v-model="queryParams.cate_id" size="5" clearable>
                    <el-option :label="item.name" :value="item.id" v-for="(item,index) in formInline.faqCategory" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-input placeholder="姓名" v-model="queryParams.name" :icon="keywordIcon('keyword')" :on-icon-click="clearInputText"></el-input>
            </el-form-item>
            <el-form-item >
                <el-input placeholder="联系方式" v-model="queryParams.email" :icon="keywordIcon('keyword')" :on-icon-click="clearInputText"></el-input>
            </el-form-item>
            <el-form-item >
                <el-select placeholder="多语言" v-model="queryParams.language_id" size="5" clearable>
                    <el-option :label="item.display" :value="item.id" v-for="(item,index) in formInline.languageIdList" :key="item.id"></el-option>
                </el-select>
            </el-form-item>

        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="id" label="ID" width="" align="center"></el-table-column>
            <el-table-column label="渠道" align="center">

                <template scope="scope">
                    <li v-for="(item,index) in formInline.appIdList" v-if="item.id==scope.row.appid">{{item.name}}</li>

                </template>
            </el-table-column>

            <el-table-column prop="add_time" label="提交时间" align="center"></el-table-column>
            <el-table-column prop="name" label="用户名" align="center" width=""></el-table-column>
            <el-table-column prop="member_id" label="用户ID" align="center" width=""></el-table-column>
            <el-table-column prop="email" label="联系方式" align="center" width=""></el-table-column>
            <el-table-column prop="category_name" label="问题分类" align="center" width=""></el-table-column>
            <el-table-column prop="content" label="表单内容" align="center" width=""></el-table-column>
            <el-table-column label="状态" align="center">
                <template scope="scope">{{scope.row.is_delete == 1 ? '已删除' : scope.row.status == 0 ? '未处理' : '已处理'}}</template>
            </el-table-column>
            <el-table-column label="操作" class="center" align="center">
                <template scope="scope">
                    <div v-if="scope.row.is_delete == 1">
                        <el-button size="small" type="success" @click="roomAction('handle',scope.row)" disabled="" >标记处理</el-button>
                        <el-button size="small" type="danger" @click="roomAction('close',scope.row)" :disabled="scope.row.is_delete == 1">已经删除</el-button>
                    </div>
                    <div v-else>
                        <el-button size="small" type="success"  @click="open3(scope.row)" :disabled="scope.row.status == 1" >标记处理</el-button>
                        <el-button size="small" type="danger" @click="roomAction('close',scope.row)" >删除</el-button>
                    </div>


                </template>
            </el-table-column>
            <el-table-column width="80" type="expand">
                <template scope="scope">
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="姓名">
                            <span>{{scope.row.name}}</span>
                        </el-form-item>
                    </el-form>
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="邮箱">
                            <span>{{scope.row.email}}</span>
                        </el-form-item>
                    </el-form>
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="分类">
                            <span>{{scope.row.category_name}}</span>
                        </el-form-item>
                    </el-form>
                    <el-form label-position="left" inline class="table-expand">

                        <el-form-item label="内容" style="width: 100%;">
                            {{scope.row.content}}
                            <div>
                                <a v-for="item in scope.row.image_url" :href="item" target="_blank">
                                    <img :src="item" style=" display: inline-block; width: 50px;height: 50px; float: left;">
                                </a>
                            </div>
                        </el-form-item>


                    </el-form>
                    <el-form label-position="left" inline class="table-expand">

                        <el-form-item label="处理留言" style="width: 100%;">
                            {{scope.row.message}}

                        </el-form-item>


                    </el-form>

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
                formInline: {
                    faqTypeOptions: [
                        {
                            value: '0',
                            label: '未处理'
                        },
                        {
                            value: '1',
                            label: '已处理'
                        },
                        {
                            value :'2',
                            label: '已经删除'
                        }
                    ],
                    faqCategory: {},
                    appIdList:{},
                    languageIdList:{}
                },
                datetime:'',
                queryParams: {
                    cate_id: '',
                    status: 0,
                    name: '',
                    email:'',
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
            this.appIdList();
	        this.languageIdList();
        },
        methods: {
            categoryList () {
                const _this = this
                _this.loading = true
                this.ajax('faq/get_faq_category_list.php', function (response) {
                    if (response.data.code == 200) {
                        _this.formInline.faqCategory = response.data.data.list
                    }
                    _this.loading = false
                })
            },
            appIdList(){
                const _this = this
                _this.loading = true
                this.ajax('faq/get_app_list.php', function (response) {
                    if (response.data.code == 200) {
                        _this.formInline.appIdList = response.data.data.list
                    }
                    _this.loading = false
                })
            },
	        languageIdList(){
		        const _this = this;
		        _this.loading = true;
		        this.ajax('system/language_list.php', function (response) {
			        if (response.data.code == 200) {
				        _this.formInline.languageIdList = response.data.data
			        }
			        _this.loading = false
		        })
	        },
            requestList () {
                const _this = this
                _this.loading = true
                this.ajax('faq/get_faq_feedback_list.php',this.tableQueryParams, function (response) {
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
                    case 'close':
                        this.$confirm('确定要删除这个问题吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            _this.ajax('faq/edit_faq_feedback.php', {id:row.id,action: 'delete'}, function (response) {
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
            },
            open3(data) {
                this.$prompt('请输入留言', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                	//多语言后去除
                    // if(value){
                    //     value=value +" 若任有问题可联系在线客服"
                    // }else{
                    //
                    //     value=   "您提交的问题，编号为"+data['id']+"，客服已处理，感谢您的反馈！若任有问题可联系 在线客服"
                    //
                    // }
                    this.$message({
                        type: 'success',
                        message:   value
                    });
                    data['message']=value
                    this.roomAction('handle',data)
                }).catch(() => {

                });
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


