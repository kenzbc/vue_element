<template>
    <div class="gift-update">
        <el-form ref="giftForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">

            <!--<el-form-item label="礼物名称：" prop="name" >-->
                <!--<el-input v-model="formData.name" class="large" placeholder=""></el-input>-->
            <!--</el-form-item>-->

            <el-form-item
                    :label="'礼物名称（'+items.name+')'"
                    v-for="(items,index) in form.LanguageListOptions"
                    :key="index"
                    v-show="formData.language_id.includes(items.value)"
            >
                <el-input v-if="!items.short_name" v-model="formData.name" class="large" placeholder=""></el-input>
                <el-input v-else-if="items.short_name == 'en'" v-model="formData.name_en" class="large" placeholder=""></el-input>
                <el-input v-else v-model="formData.name_tw" class="large" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="图标：" prop="icon" required>
                <el-input type="text" v-model="formData.icon" readonly class="large" placeholder="请选择图标">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" accept="image/*" :on-success="uploadFileIcon" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append" >
                        <el-button  type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <img v-if="formData.icon" class="preview-image" :src="formData.icon" />
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>

            <el-form-item label="图片：" prop="image_url" required>
                <el-input type="text" v-model="formData.image_url" readonly class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" accept="image/*" :on-success="uploadFile" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append" >
                        <el-button  type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <img v-if="formData.image_url" class="preview-image" :src="formData.image_url" />
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>

            <el-form-item label="分类：" required class="select-tournament">
                <el-select v-model="formData.cate_id" filterable placeholder="请选择" class="tournament">
                    <el-option v-for="item in form.cate_id_options" :key="item.value" :label="item.label" :value="item.value">
                        {{item.label}}
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="价格：" prop="price" required>
                <el-input v-model="formData.price" class="mini" type="number" placeholder="" min="0"></el-input>
            </el-form-item>

            <el-form-item label="价格单位：" required>
                <el-select v-model="formData.type" placeholder="选择类型" class="full mini">
                    <el-option label="钻石" value="0"></el-option>
                    <!--<el-option label="果子" value="1"></el-option>-->
                </el-select>
            </el-form-item>

            <el-form-item label="额外收益：" prop="exp" >
                <el-input v-model="formData.exp" class="mini" type="number" placeholder="" min="0"></el-input>
            </el-form-item>

            <el-form-item label="权重：" prop="sorting_weight" required>
                <el-input v-model="formData.sorting_weight" class="mini" type="number" placeholder="" min="0"></el-input>
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
                    uploading: false,
                    uploadPercentage: 0,
                    uploadUrl: this.HOST + 'upload_image.php',
                    cate_id_options: [],
	                LanguageListOptions:[]
                },
                formData: {
                    act: 'view',
                    name: '',
                    icon:'',
                    image_url:'',
                    cate_id:'',
                    price:'1',
                    type:'0',
                    exp:'0',
                    sorting_weight:'1',
	                language_id:[],
                },
                formRules:  {
                    name: [{required: true, message: '名称不能为空'}, {max: 5, message: '名称不能超过5个字'}],
                    price: [{required: true,min:0, message: '必须为正数数字值'}],
                    sorting_weight: [{required: true,min:0, message: '必须为正数数字值'}],
                },
                loading: false,
            }
        },
        mounted () {
	        this.languageList();
            if (this.$route.name === 'gift-update') {
                this.requestData({id: this.$route.params.id,act:'view'})
            }else{
	            this.formData.language_id = ['1'];//create默认选中“中文简体”
            }
            this.requestCateList();
        },
        methods: {
            uploadFileBefore () {
                this.form.uploading = true
            },
            uploadFileIcon (response, file, fileList) {
                let _this = this
                if (response.code == 200) {
                    _this.$message({
                        message: response.message,
                        type: 'success'
                    });
                    _this.formData.icon = response.data.image_url
                } else {
                    _this.$message.error({
                        message: response.message,
                    });
                }
                this.form.uploading = false
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
            requestCateList () {
                const _this = this;
                this.ajax('match/gift_cate_list.php', function (response) {
                    if (response.data.code == 200) {
                        for (let i in response.data.data.list) {
                            _this.form.cate_id_options.push({
                                label: response.data.data.list[i].name,
                                value: response.data.data.list[i].id
                            })
                        }
                    }
                })
            },
	        languageList () {
		        const _this = this;
		        _this.loading = true;
		        this.ajax('system/language_list.php', function (response) {
			        if (response.data.code == 200) {
				        // _this.form.LanguageListOptions = response.data.data

				        let list = response.data.data;
				        for (let i in list) {
					        _this.form.LanguageListOptions.push({
						        name: list[i].display,
						        value: list[i].id,
						        short_name: list[i].short_name,
					        });
					        // if (_this.$route.name === 'gift-cate-create') {
						     //    if (list[i].short_name) {
							 //        let name = 'name_' + list[i].short_name;
							 //        eval("_this.formData." + name + "=''");//循环添加name键值
						     //    }
					        // }
				        }
				        console.log(_this.formData);

			        }
			        _this.loading = false
		        })
	        },
            requestData (params) {
                const _this = this;
                this.ajax('match/gift_op.php', params, function (response) {
                    if (response.data.code == 200) {
                        _this.formData = response.data.data;
                        _this.formData.act = 'edit';
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
            requestUpdate () {
                let _this = this
                this.form.loading = true;

                if (_this.$route.name === 'gift-update') {
                    _this.formData.act = 'edit';
                }else{
                    _this.formData.act = 'add';
                }
	            _this.formData.language_id = _this.formData.language_id.join();
                this.ajax('match/gift_op.php', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/gift'})
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
                this.$refs['giftForm'].validate((valid) => {
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
