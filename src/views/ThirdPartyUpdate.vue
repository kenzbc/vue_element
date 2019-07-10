<template>
    <div class="third-party-update">
        <el-form ref="redBagForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">

            <el-form-item label="名称：" prop="name" >
                <el-input v-model="formData.name" class="large" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="绑定圈子id：" prop="circle_id" >
                <el-input v-model="formData.circle_id" class="large" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="绑定官方号id：" prop="star_id" >
                <el-input v-model="formData.star_id" class="large" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="绑定问答圈子id：" prop="qa_circle_id" >
                <el-input v-model="formData.qa_circle_id" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="分享默认图：" prop="share_image" >

                    <img class="cover-list-image" :src="formData.share_image" />
                <el-table-column label="图片" align="center" >
                    <template scope="scope">
                        <img class="cover-list-image" :src="formData.share_image" />
                    </template>
                </el-table-column>
                <el-input type="text" v-model="formData.share_image"    readonly class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo"  :action="form.uploadUrl" :show-file-list="false" name="image" accept="image/*" :on-success="uploadFile" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append" >
                        <el-button  type="primary"   icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
            </el-form-item>
            <el-form-item label="水印默认图：" prop="water_image" >

                    <img class="cover-list-image" :src="formData.water_image" />
                <el-table-column label="图片" align="center" >
                    <template scope="scope">
                        <img class="cover-list-image" :src="formData.water_image" />

                    </template>
                </el-table-column>
                <el-input type="text" v-model="formData.water_image" readonly  class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" accept="image/*" :on-success="uploadFile1" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append" >
                        <el-button  type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
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
                    act: 'view',
                    name: '',
                    id:'',
                    water_image:'',
                    share_image:'',
                },
                formRules:  {
                    name: [{required: true, message: '名称不能为空'}],
                    id: [{required: true, message: 'ID不能为空'}],
                },
                loading: false,
            }
        },
        mounted () {
            if (this.$route.name === 'third-party-update') {
                this.requestData({id: this.$route.params.id,act:'view'})
            }
        },
        watch: {

        },
        methods: {
            requestData (params) {
                const _this = this;
                this.ajax('member/third_party_op.php', params, function (response) {
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

                    _this.formData.share_image = response.data.image_url
                } else {
                    _this.$message.error({
                        message: response.message,
                    });
                }
                this.form.uploading = false
            },
            uploadFile1 (response, file, fileList) {
                let _this = this
                if (response.code == 200) {
                    _this.$message({
                        message: response.message,
                        type: 'success'
                    });

                    _this.formData.water_image = response.data.image_url
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
            requestUpdate () {
                let _this = this
                this.form.loading = true;

                if (_this.$route.name === 'third-party-update') {
                    _this.formData.act = 'edit';
                }else{
                    _this.formData.act = 'add';
                }

                this.ajax('member/third_party_op.php', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/third-party'})
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        });
                    }
                    _this.form.loading = false
                })
            },
            submit () {
                this.$refs['redBagForm'].validate((valid) => {
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
    .cover-list-image{
        max-width: 300px;
    }
</style>
