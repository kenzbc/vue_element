<template>
    <div class="banner-update">
        <el-form ref="bannerForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">
            <el-form-item label="轮播图名称：" prop="title">
                <el-input v-model="formData.title" class="mini" placeholder="请输入名称"></el-input>
            </el-form-item>

            <el-form-item label="显示类型：" prop="type">
                <el-select v-model="formData.type" placeholder="请选择类型" :disabled="formData.action != 'create'">
                    <el-option label="房间封面" value="0"></el-option>
                    <el-option label="大厅轮播" value="1"></el-option>
                    <el-option label="购物页轮播" value="2"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="轮播图：" prop="image_url">
                <el-input type="text" v-model="formData.image_url" readonly class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" accept="image/*" :on-success="uploadFile" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append" >
                        <el-button  type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <img v-if="formData.image_url" class="preview-image" :src="formData.image_url" />
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>

            <el-form-item label="跳转连接（APP）：">
                <el-input v-model="formData.app_url" class="large"  placeholder="请输入APP跳转连接"></el-input>
                <span class="tip">有跳转需求可填，格式：famulei://</span>
            </el-form-item>

            <el-form-item label="跳转链接（WEB）：">
                <el-input v-model="formData.web_url" class="large" placeholder="请输入WEB跳转链接"></el-input>
            </el-form-item>

            <el-form-item label="排序：" prop="sort">
                <el-input v-model="formData.sort" class="mini" type="number" min="0" placeholder="请输入排序"></el-input>
            </el-form-item>

            <el-form-item label="发布渠道：" prop="thirdParty">
                <el-select v-model="form.thirdParty" multiple placeholder="请选择渠道" filterable style="width: 600px;">
                    <el-option v-for="item in thirdParty" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
                    uploadUrl: this.HOST + 'upload_image.php',
                    thirdParty: []
                },
                formData: {
                    action: 'create',
                    type: '',
                    title: '',
                    image_url: '',
                    app_url: '',
                    web_url:'',
                    sort: 0,
                    thirdParty: ''
                },
                formRules:  {
                    title: [{required: true, message: '名称不能为空'}],
                    type: [{required: true, message: '类型不能为空'}],
                    image_url: [{required: true, message: '必须上传图片'}],
                    thirdParty: [{required: true, message: '至少选择一个发布渠道'}],
                },
                thirdParty: []
            }
        },
        mounted () {
            this.requestRoomThirdPartyList()
            if (this.$route.name === 'banner-update') {
                this.formData.action = 'update'
                this.requestData({banner_id: this.$route.params.id})
            }
        },
        watch: {
            'form.thirdParty' (data) {
                this.formData.thirdParty = data.join()
            }
        },
        methods: {
            requestRoomThirdPartyList () {
                this.ajax('member/third_party_list.php', {page: 1, limit: 100}, (response) => {
                    if (response.data.code == 200) {
                        this.thirdParty = response.data.data.list
                    } else {
                        this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
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
            requestData (params) {
                this.ajax('create_edit_cover.php', params, (response) => {
                    if (response.data.code == 200) {
                        let data = response.data.data.list
                        this.formData = {
                            banner_id: data.id,
                            action: 'update',
                            type: data.type,
                            title: data.name,
                            image_url: data.image_url,
                            app_url: data.go_url_app,
                            web_url: data.go_url_web,
                            sort: data.sorting,
                            thirdParty: data.thirdParty
                        }
                        this.form.thirdParty = this.formData.thirdParty.length ? this.formData.thirdParty.split(',') : []
                    } else {
                        this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
            requestUpdate () {
                let _this = this
                this.form.loading = true
                this.ajax('create_edit_cover.php', 'post', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/banner'})
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
