<template>
    <div class="daka-type-update">
        <el-form ref="DakaTypeForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">

            <el-form-item label="选手卡类型名称：" prop="name" >
                <el-input v-model="formData.name" class="large" placeholder=""></el-input>
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
                },
                formData: {
                    act: 'view',
                    name: '',
                },
                formRules:  {
                    name: [{required: true, message: '名称不能为空'}],
                },
                loading: false,
            }
        },
        mounted () {
            if (this.$route.name === 'daka-type-update') {
                this.requestData({id: this.$route.params.id,act:'view'})
            }
        },
        watch: {

        },
        methods: {

            requestData (params) {
                const _this = this;
                this.ajax('match/daka_type_op.php', params, function (response) {
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

                if (_this.$route.name === 'daka-type-update') {
                    _this.formData.act = 'edit';
                }else{
                    _this.formData.act = 'add';
                }

                this.ajax('match/daka_type_op.php', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/daka-type'})
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        });
                    }
                    _this.form.loading = false
                })
            },
            submit () {
                this.$refs['DakaTypeForm'].validate((valid) => {
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
