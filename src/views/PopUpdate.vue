<template>
    <div class="faq-create">
        <el-form ref="bannerForm" :model="formData" label-position="right" label-width="120px" :rules="formRules">
            <el-form-item label="弹窗标题：" prop="title" required>
                <el-input v-model="formData.title" class="mini" placeholder="请输入弹窗标题"></el-input>
                <span class="tip">标题最多可输入30个字</span>
            </el-form-item>
            <el-form-item label="弹窗描述：" prop="desc" required>
                <el-input type="textarea" v-model="formData.desc" class="mini" placeholder="请输入弹窗标题"></el-input>

                <span class="tip">描述最多可输入200个字</span>
            </el-form-item>
            <el-form-item label="弹窗图标（APP）：" prop="app_image_url">
                <el-input type="text" v-model="formData.app_image_url" class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" :on-success="uploadFile_app" accept="image/*" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append">
                        <el-button type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <img v-if="formData.app_image_url" class="preview-image" :src="formData.app_image_url"/>
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>
            <el-form-item label="弹窗图标（WEB）：" prop="image_url" required>
                <el-input type="text" v-model="formData.image_url" class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" :on-success="uploadFile" accept="image/*" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append">
                        <el-button type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <span class="tip">图片尺寸，长宽2：1</span>
                <img v-if="formData.image_url" class="preview-image" :src="formData.image_url"/>
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>

            <el-form-item label="弹窗链接（APP）：" prop="jump_url_app">
                <el-input v-model="formData.jump_url_app" class="mini" placeholder="请输入APP跳转链接"></el-input>
                <span class="tip">格式famulei://</span>
            </el-form-item>
            <el-form-item label="弹窗链接（WEB）：" prop="jump_url_web">
                <el-input v-model="formData.jump_url_web" class="mini" placeholder="请输入WEB跳转链接"></el-input>
                <span class="tip">格式http://</span>
            </el-form-item>

            <el-form-item label="交互按钮文案：" prop="button_txt" required>
                <el-input v-model="formData.button_txt" class="mini" placeholder="请输入交互按钮文案"></el-input>
                <span class="tip">文案最多可输入6个字</span>
            </el-form-item>

            <el-form-item label="开始时间：" prop="start_time" required>
                <el-date-picker v-model="formData.start_time" type="datetime" placeholder="选择开始时间"></el-date-picker>
            </el-form-item>

            <el-form-item label="结束时间：" prop="end_time" required>
                <el-date-picker v-model="formData.end_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>

            <el-form-item label="显示频次：" prop="type" required>
                <el-select v-model="formData.type" placeholder="选择类型" class="full mini">
                    <el-option label="每启动app显示一次" value="0"></el-option>
                    <el-option label="每天显示一次" value="1"></el-option>
                    <el-option label="仅显示一次" value="2"></el-option>
                </el-select>
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
                    uploadUrl: this.HOST + 'upload_image.php'
                },
                formData: {
                    pop_id:'',
                    title:'',
                    desc: '',
                    app_image_url:'',
                    image_url: '',
                    jump_url_app:'',
                    jump_url_web:'',
                    button_txt:'',
                    start_time: '',
                    end_time:'',
                    type:'',
                    action:''
                },
                formRules: {
                    title: [{required: true, message: '弹窗标题不能为空'}, {max: 30, message: '弹窗标题不能超过30个字'}],
                    desc: [{required: true, message: '弹窗描述不能为空'}, {max: 200, message: '弹窗描述不能超过200个字'}],
                    image_url: [{required: true, message: '必须上传WEB图片'}],
                    button_txt: [{required: true, message: '文案不能为空'}, {max: 6, message: '文案不能超过6个字'}],
                    start_time: [{required: true, message: '开始时间不能为空'}],
                    end_time: [{required: true, message: '结束时间不能为空'}],
                    type: [{required: true, message: '类型不能为空'}]
                }
            }
        },
        watch:{
//            'formData.start_time' (val) {
//                if (val) {
//                    this.formData.start_time = this.moment(val).format('YYYY-MM-DD HH:mm:ss')
//                }
//            },
        },
        mounted () {
            if (this.$route.name === 'pop-update') {
//                this.formData.action = 'update'
                this.requestData({pop_id: this.$route.params.id})
            }
        },
        methods: {
            uploadFileBefore () {
                this.form.uploading = true
            },

            uploadFile_app (response, file, fileList) {
                let _this = this
                if (response.code == 200) {
                    _this.$message({
                        message: response.message,
                        type: 'success'
                    });
                    _this.formData.app_image_url = response.data.image_url
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
            requestData (params) {
                const _this = this;
                this.ajax('edit_pop_up.php', params, function (response) {
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
                let _api = this.$route.name === 'pop-create' ? 'create_pop_up.php' : 'edit_pop_up.php'
                this.formData.pop_id = this.$route.params.id;
                this.formData.action = this.$route.name === 'pop-create' ? '' : 'edit'
                this.ajax(_api, 'post', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/pop'})
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
