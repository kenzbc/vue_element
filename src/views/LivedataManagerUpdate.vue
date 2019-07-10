<template>
    <div class="livedata-manager-update">
        <el-form ref="LivedataManagerForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">

            <el-form-item label="直播平台：" prop="title" >
                <el-input v-model="formData.title" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="比赛ID：" prop="match_id" >
                <!--<el-input v-model="formData.match_id" class="large" placeholder=""></el-input>-->
                <el-col :span="8">
                <el-select
                        v-model="formData.match_id"
                        filterable
                        remote
                        placeholder="填写比赛ID"
                        :remote-method="remoteMethod"
                        :loading="loading">
                    <el-option
                            v-for="item in search_star"
                            :key="item.matchID"
                            :label="item.matchID"
                            :value="item.matchID">
                    </el-option>
                </el-select>
                </el-col>
                <el-col class="line" :span="2" align="center">比赛双方:</el-col>
                <el-col :span="5">
                    <el-input v-model="formInformation.team_a_name" class="" placeholder="" readonly ></el-input>
                </el-col>
                <el-col class="line" :span="2" align="center">VS</el-col>
                <el-col :span="5">
                    <el-input v-model="formInformation.team_b_name" class="" placeholder="" readonly ></el-input>
                </el-col>
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
                    id:'',
					title:'',
					match_id: '',

				},
                formInformation:{
	                team_a_name:'',
	                team_b_name:''
                },
				formRules:  {
					title: [{required: true, message: '直播平台不能为空'}],
					match_id: [{required: true, message: '比赛ID不能为空'}],
				},
				search_star: [],
				loading: false,
			}
		},
		mounted () {
			if (this.$route.name === 'livedata-manager-update') {
				this.requestData({id: this.$route.params.id,act:'view'})
			}
		},
		watch: {
			'formData.match_id' (data) {
				this.remoteMethod(data);
			},
		},
		methods: {
			requestData (params) {
				const _this = this;
				this.ajax('match/livedata_manager_op.php','post', params, function (response) {
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

				if (_this.$route.name === 'livedata-manager-update') {
					_this.formData.act = 'edit';
				}else{
					_this.formData.act = 'add';
				}
				this.ajax('match/livedata_manager_op.php','post', this.formData, function (response) {
					if (response.data.code == 200) {
						_this.$message({
							message: response.data.message,
							type: 'success'
						});
						_this.$router.push({path: '/livedata-manager'})
					} else {
						_this.$message.error({
							message: response.data.message,
						});
					}
					_this.form.loading = false
				})
			},
			remoteMethod(query) {
				const _this = this;
				this.ajax('match/match_information.php',{match_param: query}, function (response) {
					_this.search_star = response.data.data;
					_this.formInformation.team_a_name = response.data.data[0].team_short_name_a;
					_this.formInformation.team_b_name = response.data.data[0].team_short_name_b;
				})
			},
			submit () {
				this.$refs['LivedataManagerForm'].validate((valid) => {
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
