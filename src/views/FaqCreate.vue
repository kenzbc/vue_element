<template>
    <div class="faq-create">
        <el-form ref="bannerForm" :model="formData" label-position="right" label-width="160px" :rules="formRules">
            <!--<el-form-item label="分类名称：" prop="name">-->
                <!--<el-input v-model="formData.name" class="mini" placeholder="请输入分类名称"></el-input>-->
            <!--</el-form-item>-->

            <el-form-item
                    :label="'分类名称（'+items.name+')'"
                    v-for="(items,index) in form.LanguageListOptions"
                    :key="index"
                    v-show="formData.language_id.includes(items.value)"
            >
                <el-input v-if="!items.short_name" v-model="formData.name" class="large" placeholder="请输入分类名称"></el-input>
                <el-input v-else-if="items.short_name == 'en'" v-model="formData.name_en" class="large" placeholder="请输入分类名称"></el-input>
                <el-input v-else v-model="formData.name_tw" class="large" placeholder="请输入分类名称"></el-input>
            </el-form-item>

            <!--<el-form-item label="分类描述：" prop="demo">-->
                <!--<el-input v-model="formData.demo" class="mini" placeholder="请输入分类描述"></el-input>-->
            <!--</el-form-item>-->

            <el-form-item
                    :label="'分类描述（'+items.name+')'"
                    v-for="(items,index) in form.LanguageListOptions"
                    :key="index"
                    v-show="formData.language_id.includes(items.value)"
            >
                <el-input v-if="!items.short_name" v-model="formData.demo" class="large" placeholder="请输入分类描述"></el-input>
                <el-input v-else-if="items.short_name == 'en'" v-model="formData.demo_en" class="large" placeholder="请输入分类描述"></el-input>
                <el-input v-else v-model="formData.demo_tw" class="large" placeholder="请输入分类描述"></el-input>
            </el-form-item>

            <el-form-item label="分类ID：" prop="id">
                <el-input v-model="formData.id" class="mini" placeholder="" disabled></el-input>
            </el-form-item>

            <el-form-item label="状态：">
                <el-select v-model="formData.status" placeholder="选择类型" class="full mini">
                    <el-option label="开启" value="0"></el-option>
                    <el-option label="关闭" value="1"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="分类图标：" prop="image_url">
                <el-input type="text" v-model="formData.image_url" readonly class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" :on-success="uploadFile" accept="image/*" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append">
                        <el-button type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <img v-if="formData.image_url" class="preview-image" :src="formData.image_url"/>
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>

            <el-form-item label="排序：" prop="sorting">
                <el-input v-model="formData.sorting" class="mini" type="number" min="0" placeholder="请输入排序"></el-input>
            </el-form-item>

            <el-form-item label="语言：" prop="language_id">
                <el-checkbox-group v-model="formData.language_id">
                    <el-checkbox-button v-for="item in form.LanguageListOptions" :label="item.value" :key="item.value">{{item.name}}</el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>

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
	                LanguageListOptions:[],
                    uploading: false,
                    uploadPercentage: 0,
                    uploadUrl: this.HOST + 'upload_image.php'
                },
                formData: {
                    id:'',
                    name: '',
                    demo: '',
                    status:'',
                    image_url:'',
                    sorting: '',
	                language_id:[],
                },
                formRules: {
                    sku_name: [{required: true, message: '商品名称不能为空'}, {max: 10, message: '商品名称不能超过10个字'}],
                    sku_desc: [{required: false, message: '商品描述不能为空'}, {max: 16, message: '商品名称不能超过16个字'}],
                    sku_type: [{required: true, message: '必须选择一个类型'}],
                    iap_spu_id: [{required: true, message: '商品ID不能为空'}],
                    sku_image: [{required: true, message: '必须上传商品图片'}],
                    sku_price: [{required: true, message: '商品价格不能为空'}],
                    first_desc: [{required: true, message: '首充描述不能为空'}],
                    diamond_number: [{required: true, message: '等额钻石不能为空'}],
                }
            }
        },
        mounted () {
	        this.languageList();
        	if (this.$route.name === 'faq-update') {
//                this.formData.action = 'update'
                this.requestData({id: this.$route.params.id})
            }else{
		        this.formData.language_id = ['1'];//create默认选中“中文简体”
            }
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
                    _this.formData.image_url = response.data.image_url
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
	        languageList () {
		        const _this = this;
		        _this.loading = true;
		        this.ajax('system/language_list.php', function (response) {
			        if (response.data.code == 200) {
				        let list = response.data.data;
				        for (let i in list) {
					        _this.form.LanguageListOptions.push({
						        name: list[i].display,
						        value: list[i].id,
						        short_name: list[i].short_name,
					        });
					        if (_this.$route.name === 'gift-cate-create') {
						        if (list[i].short_name) {
							        let name = 'name_' + list[i].short_name;
							        eval("_this.formData." + name + "=''");//循环添加name键值
							        let demo = 'demo_' + list[i].short_name;
							        eval("_this.formData." + demo + "=''");//循环添加name键值
						        }
					        }
				        }
				        console.log(_this.formData);

			        }
			        _this.loading = false
		        })
	        },
            requestData (params) {
                const _this = this;
                this.ajax('faq/get_faq_category.php', params, function (response) {
                    if (response.data.code == 200) {
                        // let data = response.data.data;
                        // for (let key in _this.formData) {
                        //     if (data[key]) _this.formData[key] = data[key]
                        // }
                        // _this.formData.sku_id = data.sku_id
	                    _this.formData = response.data.data;
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
            requestUpdate () {
                let _this = this;
                this.form.loading = true;
                let _api = this.$route.name === 'faq-create' ? 'faq/create_faq_category.php' : 'faq/edit_faq_category.php';
	            this.formData.language_id = this.formData.language_id.join();
                this.ajax(_api, 'post', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/faq'})
                    } else {
	                    _this.formData.language_id = _this.formData.language_id.split(',');
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
