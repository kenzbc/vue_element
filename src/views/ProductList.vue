<template>
    <div class="product-list">
        <el-form :inline="true" :model="queryParams">
            <el-form-item>
                <el-select placeholder="渠道" v-model="formInline.appid" size="15" clearable>
                    <el-option v-for="item in formInline.roomThirdPartyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <!--<el-form-item>-->
                <!--<el-select placeholder="选择语言" v-model="formInline.language_id" size="" clearable>-->
                    <!--<el-option v-for="item in formInline.LanguageListOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item  style="float:right;margin-right: 0">
                <router-link to="/product/create">
                    <el-button type="primary" icon="plus">添加商品</el-button>
                </router-link>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="sort" label="排序" width="100" align="center"></el-table-column>
            <el-table-column prop="sku_id" label="商品ID" width="100" align="center"></el-table-column>
            <el-table-column prop="sku_name" label="商品名称" align="center"></el-table-column>
            <el-table-column label="描述" align="center" style="width: 300px;">
                <template scope="scope">
                    {{scope.row.first_prize > 0 ? scope.row.sku_desc + '，' : scope.row.sku_desc}}
                    {{scope.row.first_prize > 0 ? '（首充）' + scope.row.first_desc : ''}}
                </template>
            </el-table-column>
            <el-table-column prop="sku_price" label="商品价格" align="center"></el-table-column>
            <el-table-column label="类型" align="center" wdith="100">
                <template scope="scope">{{scope.row.sku_type == 0 ? 'IOS' : '安卓/web'}}</template>
            </el-table-column>
            <el-table-column prop="third_str_name" label="渠道" width="70" align="center"></el-table-column>
            <el-table-column prop="iap_spu_id" label="内购商品规则" width="" align="center"></el-table-column>
            <!--<el-table-column prop="language_name" label="语言" width="100" align="center">-->
            <!--</el-table-column>-->
            <el-table-column label="操作" class="center" align="center" width="150">
                <template scope="scope">
                    <router-link :to="'/product/' + scope.row.sku_id" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
                    <el-button size="small" type="danger" @click="actionRequest('delete',scope.row)">删除</el-button>
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
	                appid:'',
	                // language_id:'',
                    page: 1,
                    limit: 15,
                },
	            formInline: {
		            appid: '',
		            // language_id:'',
		            roomThirdPartyOptions: [],
		            // LanguageListOptions:[]
	            },
                tableData: [],
                total: 0,
                loading: false
            }
        },
        watch: {
	        'formInline.appid' (data) {
		        this.queryParams.appid = data
	        },
	        // 'formInline.language_id' (data) {
		     //    this.queryParams.language_id = data
	        // },
            queryParams: {
                handler (data) {
                    this.requestList()
                },
                deep: true
            }
        },
        mounted () {
            this.requestList();
	        this.requestRoomThirdPartyList();
	        // this.requestLanguageList();
        },
        methods: {
            requestList () {
                const _this = this
                _this.loading = true
                this.ajax('get_product_list.php',this.queryParams, function (response) {
                    if (response.data.code == 200) {
                        _this.tableData = response.data.data.list;
                        _this.total = parseInt(response.data.data.count)
                    }
                    _this.loading = false
                })
            },
	        requestRoomThirdPartyList () {
		        this.ajax('member/third_party_list.php', {page: 1, limit: 100}, (response) => {
			        if (response.data.code == 200) {
				        let list = response.data.data.list;
				        for (let i in list) {
					        this.formInline.roomThirdPartyOptions.push({
						        label: list[i].name,
						        value: list[i].id
					        });
					        // this.formInline.roomThirdPartyObject[list[i].id] = list[i].name
				        }
			        } else {
				        this.$message.error({
					        message: response.data.message,
				        })
			        }
		        })
	        },
	        // requestLanguageList () {
		     //    this.ajax('system/language_list.php', (response) => {
			 //        if (response.data.code == 200) {
			 //        	console.log(response.data);
				//         let list = response.data.data;
				//         for (let i in list) {
				// 	        this.formInline.LanguageListOptions.push({
				// 		        label: list[i].display,
				// 		        value: list[i].id
				// 	        })
				//         }
				//         console.log(this.formInline.LanguageListOptions);
			 //        } else {
				//         this.$message.error({
				// 	        message: response.data.message,
				//         })
			 //        }
		     //    })
	        // },
            actionRequest (type,row) {
                const _this = this
                switch (type) {
                    case 'delete':
                        this.$confirm('确定要删除这个商品吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            _this.ajax('edit_product.php', {action: 'del', sku_id: row.sku_id}, function (response) {
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
        }
    }
</script>

<style>
</style>
