<template>
    <div class="promotional-update">
        <el-form ref="bannerForm" :model="formData" label-position="right" label-width="120px" :rules="formRules">
            <el-form-item label="活动名称：" prop="pmt_name">
                <el-input v-model="formData.pmt_name" class="mini" placeholder="请输入活动名称" :readonly="formData.status == 2"></el-input>
            </el-form-item>

            <el-form-item label="活动描述：" prop="pmt_desc">
                <el-input v-model="formData.pmt_desc" class="large" placeholder="请输入活动描述" :readonly="formData.status == 2"></el-input>
            </el-form-item>

            <el-form-item label="开始时间：" prop="start_time">
                <el-date-picker v-model="formData.start_time" type="datetime" placeholder="选择开始时间" :readonly="formData.status == 2"></el-date-picker>
            </el-form-item>

            <el-form-item label="结束时间：" prop="end_time">
                <el-date-picker v-model="formData.end_time" type="datetime" placeholder="选择结束时间" :readonly="formData.status == 2"></el-date-picker>
            </el-form-item>

            <!--<el-form-item label="语言：" prop="language_id">-->
                <!--<el-select v-model="formData.language_id" placeholder="选择语言" class="full mini">-->
                    <!--<el-option :label="item.display" :value="item.id" v-for="(item,index) in form.LanguageListOptions" :key="index"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->

            <el-form-item label="添加商品：" prop="sort">
                <div class="promotional-product-detail">
                    <el-row class="row-title">
                        <el-col :span="3" class="product">商品</el-col>
                        <el-col :span="2" class="number">赠送数量</el-col>
                        <el-col :span="6" class="desc">促销描述</el-col>
                    </el-row>

                    <el-row v-for="(item,index) in formData.product_list" class="product-row-item" :key="index">
                        <el-col :span="3">
                            <el-form-item :prop="'product_list.' + index + '.sku_id'" :rules="{required: true, message: '必须选择商品', trigger: 'blur'}">
                                <el-select v-model="item.sku_id" placeholder="请选择商品" :disabled="formData.status == 2">
                                    <el-option-group  v-for="(productType,index) in productList" :label="productType.label" :key="index">
                                        <el-option v-for="(product,index) in productType.options" :key="index" :label="product.sku_id + ' # '+ product.sku_name" :value="product.sku_id"></el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item :prop="'product_list.' + index + '.diamond_number'" :rules="{required: true, message: '必须输入钻石数量', trigger: 'blur'}">
                                <el-input v-model="item.diamond_number" min="0" type="number" class="center" placeholder="赠送钻石数量" :readonly="formData.status == 2"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :prop="'product_list.' + index + '.rule_desc'" :rules="{required: true, message: '促销描述不能为空', trigger: 'blur'}">
                                <el-input v-model="item.rule_desc" min="0" type="text" placeholder="请输入促销描述" :readonly="formData.status == 2"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" v-if="formData.status != 2">
                            <el-button type="danger" icon="minus" class="action-btn" @click="minusItem" :disabled="index==0"></el-button>
                            <el-button type="success" icon="plus" class="action-btn" @click="plusItem" v-if="index == formData.product_list.length - 1"></el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit" :disabled="form.loading || form.uploading" :loading="form.loading" v-if="formData.status != 2">提交</el-button>
                <router-link to="/promotional" v-else><el-button type="default">返回</el-button></router-link>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                form: {
                    loading: false,
	                // LanguageListOptions:{},
                    uploading: false,
                    uploadPercentage: 0,
                    uploadUrl: this.HOST + 'upload_image.php'
                },
                formData: {
                    action: 'create',
                    pmt_name: '',
                    pmt_desc: '',
                    start_time: '',
                    end_time: '',
	                // language_id:'',
                    status: '',
                    product_list: [{
                        sku_id: '',
                        diamond_number: '',
                        rule_desc: ''
                    }]
                },
                productList: [
                    {label: 'IOS',options:[]},
                    {label: '安卓/WEB',options:[]}
                ],
                formRules: {
                    pmt_name: [{required: true, message: '活动名称不能为空'}],
                    pmt_desc: [{required: true, message: '商品描述不能为空'}],
                    start_time: [{required: true, message: '开始时间不能为空'}],
                    end_time: [{required: true, message: '结束时间不能为空'}]
                }
            }
        },
        mounted () {
            if (this.$route.name === 'promotional-update') {
                this.formData.action = 'update'
                this.requestData({pmt_id: this.$route.params.id})
            }
            this.requestProductList();
	        // this.languageList();
        },
	    watch: {
		    // 'formData.language_id' (data) {
			 //    this.productList = [
				//     {label: 'IOS',options:[]},
				//     {label: '安卓/WEB',options:[]}
			 //    ];
			 //    this.requestProductList();
		    // },
	    },
        methods: {
            requestProductList () {
                let _this = this
                this.ajax('get_product_list.php',{page:1,limit:999}, function (response) {
                    if (response.data.code == 200) {
                        for (let i in response.data.data.list) {
                            _this.productList[response.data.data.list[i].sku_type].options.push(response.data.data.list[i])
                        }
                    }
                    _this.loading = false
                })
            },
	        // languageList () {
		     //    const _this = this;
		     //    _this.loading = true;
		     //    this.ajax('system/language_list.php', function (response) {
			 //        if (response.data.code == 200) {
				//         _this.form.LanguageListOptions = response.data.data
			 //        }
			 //        _this.loading = false
		     //    })
	        // },
            uploadFileBefore () {
                this.form.uploading = true
            },
            uploadFile (response, file, fileList) {
                let _this = this
                if (response.code == 200) {
                    _this.$message({
                        message: response.message,
                        type: 'success'
                    });
                    _this.formData.sku_image = response.data.image_url
                } else {
                    _this.$message.error({
                        message: response.message,
                    });
                }
                this.form.uploading = false
            },
            uploadProcess (event, file, fileList) {
                this.form.uploadPercentage = parseInt(event.percent)
            },
            requestData (params) {
                const _this = this;
                this.ajax('edit_promotional_activity.php', params, function (response) {
                    if (response.data.code == 200) {
                        let data = response.data.data.mdiamon_pmt
                        for (let key in _this.formData) {
                            if (data[key]) _this.formData[key] = data[key]
                        }
                        _this.formData.pmt_id = data.pmt_id
                        let rule = response.data.data.mdiamon_rule_list
                        let product_list = []
                        for (let i in rule) {
                            product_list.push({
                                sku_id: rule[i].sku_id,
                                rule_desc: rule[i].rule_desc,
                                diamond_number: rule[i].diamond_number,
                            })
                        }
                        _this.formData.product_list = product_list
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
            requestUpdate () {
                let _this = this
                this.form.loading = true
                let _api = this.$route.name === 'promotional-create' ? 'create_promotional_activity.php' : 'edit_promotional_activity.php'
                this.ajax(_api, 'post', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/promotional'})
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        });
                    }
                    _this.form.loading = false
                })
            },
            submit () {
                this.$refs['bannerForm'].validate((valid) => {
                    if (valid) {
                        this.requestUpdate()
                    } else {
                        return false;
                    }
                });
            },
            minusItem () {
                this.formData.product_list.splice(this.formData.product_list.length - 1, 1);
            },
            plusItem () {
                this.formData.product_list.push({
                    sku_id: '',
                    diamond_number: '',
                    rule_desc: ''
                })
            },
        }
    }
</script>

<style>
    .promotional-update .promotional-product-detail {

    }
    .promotional-update .promotional-product-detail .product-row-item {
        margin-bottom: 22px;
    }
    .promotional-update .promotional-product-detail .el-row .el-col {
        margin-right: 15px;
    }
    .promotional-update .promotional-product-detail .row-title .el-col {
        text-align: center;
    }
</style>
