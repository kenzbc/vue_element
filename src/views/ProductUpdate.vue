<template>
    <div class="product-update">
        <el-form ref="bannerForm" :model="formData" label-position="right" label-width="120px" :rules="formRules">
            <el-form-item label="商品名称：" prop="sku_name">
                <el-input v-model="formData.sku_name" class="mini" placeholder="请输入商品名称（限10个字）"></el-input>
            </el-form-item>

            <el-form-item label="商品描述：" prop="sku_desc">
                <el-input v-model="formData.sku_desc" class="mini" placeholder="请输入商品描述（限16个字）"></el-input>
            </el-form-item>

            <el-form-item label="适用类型：" :prop="formData.sku_type == 0 ? 'iap_spu_id' : 'sku_type'">
                <el-input placeholder="绑定苹果商店中的商品ID" v-model="formData.iap_spu_id" class="mini" v-show="formData.sku_type == 0">
                    <el-select v-model="formData.sku_type" placeholder="选择类型" slot="prepend" class="mini-select">
                        <el-option label="IOS" value="0"></el-option>
                        <el-option label="安卓/web" value="1"></el-option>
                    </el-select>
                </el-input>
                <el-select v-model="formData.sku_type" placeholder="选择类型" class="full mini" v-show="formData.sku_type != 0">
                    <el-option label="IOS" value="0"></el-option>
                    <el-option label="安卓/web" value="1"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="商品图片：" prop="sku_image">
                <el-input type="text" v-model="formData.sku_image" readonly class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" :on-success="uploadFile" accept="image/*" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append">
                        <el-button type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <img v-if="formData.sku_image" class="preview-image" :src="formData.sku_image"/>
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>

            <el-form-item label="商品价格：" prop="sku_price">
                <el-input v-model="formData.sku_price" class="mini" type="number" min="0" placeholder="请输入商品价格"></el-input>
            </el-form-item>

            <el-form-item label="等额钻石：" prop="diamond_number">
                <el-input v-model="formData.diamond_number" class="mini" type="number" min="0" placeholder="请输入等额钻石"></el-input>
                <span class="tip">购买商品后获得的钻石</span>
            </el-form-item>

            <el-form-item label="首充奖励：">
                <el-input v-model="formData.first_prize" class="mini" type="number" min="0" placeholder="请输入首充奖励的钻石数量"></el-input>
                <span class="tip">默认为0，无首充奖励</span>
            </el-form-item>

            <el-form-item label="首充描述：" prop="first_desc" v-if="formData.first_prize > 0">
                <el-input v-model="formData.first_desc" class="mini" placeholder="请输入首充描述"></el-input>
            </el-form-item>

            <el-form-item label="排序：" prop="sort">
                <el-input v-model="formData.sort" class="mini" type="number" min="0" placeholder="请输入排序"></el-input>
            </el-form-item>

            <el-form-item label="渠道：" prop="appid">
                <el-select v-model="formData.appid" placeholder="选择渠道" class="full mini">
                    <el-option :label="item.name" :value="item.id" v-for="(item,index) in selectOptions" :key="index"></el-option>
                </el-select>
            </el-form-item>

            <!--<el-form-item label="语言：" prop="language_id">-->
                <!--<el-select v-model="formData.language_id" placeholder="选择语言" class="full mini">-->
                    <!--<el-option :label="item.display" :value="item.id" v-for="(item,index) in form.LanguageListOptions" :key="index"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->

            <el-form-item>
                <el-button type="primary" @click="submit" :disabled="form.loading || form.uploading" :loading="form.loading">提交</el-button>
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
	            selectOptions:{},
                formData: {
                    action: 'create',
                    iap_spu_id: '',
                    sku_type: '0',
                    sku_desc: '',
                    sku_name: '',
                    sku_image: '',
                    sku_price: '',
                    diamond_number: '',
                    first_prize: 0,
                    first_desc: '',
                    sort: 100,
	                appid:'',
	                // language_id:''
                },
                formRules: {
                    sku_name: [{required: true, message: '商品名称不能为空'}, {max: 10, message: '商品名称不能超过10个字'}],
                    sku_desc: [{required: false, message: '商品描述不能为空'}, {max: 16, message: '商品名称不能超过16个字'}],
                    sku_type: [{required: true, message: '必须选择一个类型'}],
                    // iap_spu_id: [{required: true, message: '商品ID不能为空'}],
                    sku_image: [{required: true, message: '必须上传商品图片'}],
                    sku_price: [{required: true, message: '商品价格不能为空'}],
                    first_desc: [{required: true, message: '首充描述不能为空'}],
                    diamond_number: [{required: true, message: '等额钻石不能为空'}],
	                appid:[{required: true, message: '渠道不能为空'}]
                }
            }
        },
        mounted () {
            if (this.$route.name === 'product-update') {
                this.formData.action = 'update'
                this.requestData({sku_id: this.$route.params.id})
            }
	        this.categoryList();
	        // this.languageList();
        },
        methods: {
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
	        categoryList () {
		        const _this = this
		        _this.loading = true
		        this.ajax('member/third_party_list.php',{page: 1, limit: 100}, function (response) {
			        if (response.data.code == 200) {
				        _this.selectOptions = response.data.data.list
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
            requestData (params) {
                const _this = this;
                this.ajax('edit_product.php', params, function (response) {
                    if (response.data.code == 200) {
                        let data = response.data.data
                        for (let key in _this.formData) {
                            if (data[key]) _this.formData[key] = data[key]
                        }
                        _this.formData.sku_id = data.sku_id
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
                let _api = this.$route.name === 'product-create' ? 'create_product.php' : 'edit_product.php'
                this.ajax(_api, 'post', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/product'})
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

        }
    }
</script>

<style>

</style>
