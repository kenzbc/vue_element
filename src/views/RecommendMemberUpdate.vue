<template>
    <div class="recommend-member-update">
        <el-form ref="recommendForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">

            <el-form-item label="用户id：" prop="member_id" required>
                <el-input v-model="formData.member_id" class="large" type="" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="用户昵称：" prop="nickname" required>
                <el-input v-model="formData.nickname" class="large" type="" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="appid ：" >
                <el-select placeholder="appid " v-model="formData.appid" class="full mini">
                    <el-option v-for="item in formInline.appIDOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="游戏类型：" required>
                <el-select placeholder="游戏类型" v-model="formData.gameID" class="full mini">
                    <el-option v-for="item in formInline.gameIDOptions" :key="item.gameID" :label="item.name" :value="item.gameID"></el-option>
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
                    member_id:'',
	                nickname:'',
                },
                formData: {
                    act: 'view',
                    id:'',
                    member_id:'',
                    nickname: '',
	                appid:'0',
                    gameID:'',
                },
                formRules:  {
	                member_id: [{required: true, message: '用户ID不能为空'}],
	                nickname: [{required: true, message: '昵称不能为空'}],
                    gameID: [{required: true, message: '游戏类型不能为空'}],
                },
	            formInline: {
		            appIDOptions: [

		            ],
		            gameIDOptions: [

		            ],
	            },
                loading: false,
            }
        },
        watch :{
	        'formData.member_id' (data) {
		        this.requestNickName(data);
	        },
        },
        mounted () {
            console.log(this.$route);
            if (this.$route.name === 'recommend-member-update') {
                this.requestData({id: this.$route.params.id,act:'view'})
            }else{
	            this.requestList()
            }
        },
        methods: {
	        requestList(){
		        const _this = this;
		        this.ajax('member/recommend_member_list.php', function (response) {
			        if (response.data.code == 200) {
				        _this.formInline.appIDOptions = response.data.data.apps;
				        _this.formInline.gameIDOptions = response.data.data.games;
			        } else {
				        _this.$message.error({
					        message: response.data.message,
				        })
			        }
		        })
            },
            requestData (params) {
                const _this = this;
                this.ajax('member/recommend_member_op.php', params, function (response) {
                    if (response.data.code == 200) {
	                    _this.formData.id = response.data.data.id;
                        _this.formData.member_id = response.data.data.member_id;
	                    _this.formData.nickname = response.data.data.nickname;
	                    _this.formData.appid = response.data.data.appid;
	                    _this.formData.gameID = response.data.data.gameID;
	                    //
	                    _this.formInline.appIDOptions = response.data.data.apps;
	                    _this.formInline.gameIDOptions = response.data.data.games;
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

                if (_this.$route.name === 'recommend-member-update') {
                    _this.formData.act = 'edit';
                }else{
                    _this.formData.act = 'add';
                }

                this.ajax('member/recommend_member_op.php', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/recommend-member'})
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        });
                    }
                    _this.form.loading = false
                })
            },
	        requestNickName (member_id) {
		        const _this = this;
		        this.ajax('member/get_member.php', {member_id: member_id}, function (response) {
			        if (response.data.code == 200) {
				        _this.formData.nickname = response.data.data.nickname;
			        }
		        })
	        },
            submit () {
                this.$refs['recommendForm'].validate((valid) => {
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
