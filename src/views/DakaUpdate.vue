<template>
    <div class="daka-update">
        <el-form ref="DakaForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">
            <el-form-item label="选手卡SKU：" prop="sku" required>
                <el-input v-model="formData.sku" class="large" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="选手卡类型：" required class="select-tournament">
                <el-select v-model="formData.card_type" filterable placeholder="请选择" class="tournament">
                    <el-option v-for="item in form.card_type_options" :key="item.value" :label="item.label" :value="item.value">
                        {{item.label}}
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="卡片名称：" prop="daka_name" required>
                <el-input v-model="formData.daka_name" class="large" type="" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="卡面：" prop="pic_url" required>
                <el-input type="text" v-model="formData.pic_url" readonly class="large" placeholder="请选择图标">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" accept="image/*" :on-success="uploadFileIcon" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append" >
                        <el-button  type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <img v-if="formData.pic_url" class="preview-image" :src="formData.pic_url" />
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>

            <el-form-item label="卡背：" prop="pic_bg_url" required>
                <el-input type="text" v-model="formData.pic_bg_url" readonly class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" accept="image/*" :on-success="uploadFile" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append" >
                        <el-button  type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <img v-if="formData.pic_bg_url" class="preview-image" :src="formData.pic_bg_url" />
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
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
	                card_type_options: [],
                },
                formData: {
                    act: 'view',
                    id:'',
	                sku:'',
	                card_type:'',
	                daka_name: '',
	                pic_url:'',
	                pic_bg_url:'',
                },
                formRules:  {
	                sku: [{required: true, message: '名称不能为空'}],
                    price: [{required: true,min:0, message: '必须为正数数字值'}],
                    sorting_weight: [{required: true,min:0, message: '必须为正数数字值'}],
                },
                loading: false,
            }
        },
        mounted () {
            if (this.$route.name === 'daka-update') {
                this.requestData({id: this.$route.params.id,act:'view'})
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
                    _this.formData.pic_url = response.data.image_url
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
                    _this.formData.pic_bg_url = response.data.image_url
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
                this.ajax('match/daka_type_list.php', function (response) {
                    if (response.data.code == 200) {
                        for (let i in response.data.data.list) {
                            _this.form.card_type_options.push({
                                label: response.data.data.list[i].name,
                                value: response.data.data.list[i].id
                            })
                        }
                    }
                })
            },
            requestData (params) {
                const _this = this;
                this.ajax('match/daka_op.php', params, function (response) {
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

                if (_this.$route.name === 'daka-update') {
                    _this.formData.act = 'edit';
                }else{
                    _this.formData.act = 'add';
                }

                this.ajax('match/daka_op.php','post', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/daka'})
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        });
                    }
                    _this.form.loading = false
                })
            },
            submit () {
                this.$refs['DakaForm'].validate((valid) => {
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
