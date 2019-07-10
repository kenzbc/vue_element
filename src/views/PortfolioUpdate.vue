<template>
    <div class="porfolio-update">
        <el-form ref="porfolioForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">
            <el-form-item label="开始时间：" prop="start_time" >
                <el-date-picker v-model="formData.start_time" type="datetime" placeholder="选择时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" prop="end_time" >
                <el-date-picker v-model="formData.end_time" type="datetime" placeholder="选择时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="选手ID：" prop="playerID" >
                <!--<el-input v-model="formData.playerID" class="large" placeholder="选手ID"></el-input>-->
                <el-select
                        v-model="formData.playerID"
                        filterable
                        remote
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                    <el-option
                            v-for="item in search_star"
                            :key="item.playerID"
                            :label="item.nickname+'('+item.playerID+')'"
                            :value="item.playerID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="位置：" prop="position_name">
                <el-select v-model="formData.position_name" placeholder="请选择位置">
                    <el-option label=ADC value="ADC"></el-option>
                    <el-option label="中单" value="中单"></el-option>
                    <el-option label="上单" value="上单"></el-option>
                    <el-option label="打野" value="打野"></el-option>
                    <el-option label="辅助" value="辅助"></el-option>
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
				},
				formData: {
					act: 'view',
                    teamID:'',
					playerID: '',
					start_time:'',
					end_time:'',
					position_name:'',
				},
				formRules:  {
					name: [{required: true, message: '名称不能为空'}],
					id: [{required: true, message: 'ID不能为空'}],
				},
				search_star: [],
				loading: false,
			}
		},
		mounted () {
			if (this.$route.name === 'portfolio-update') {
				this.requestData({id: this.$route.params.id,act:'view'})
			}
		},
		watch: {
			// 'formData.playerID' (data) {
			// 	this.requestPlayer(data);
			// },
		},
		methods: {
			requestData (params) {
				const _this = this;
				this.ajax('match/career_portfolio_op.php', params, function (response) {
					if (response.data.code == 200) {
						_this.formData = response.data.data;
						//如果结束时间返回0，代表“至今”，前端转换为空
						if(response.data.data.end_time == '0'){
							_this.formData.end_time = ''
                        }
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

				if (_this.$route.name === 'portfolio-update') {
					_this.formData.act = 'edit';
				}else{
					_this.formData.act = 'add';
				}
				_this.formData.teamID = _this.$route.query.teamID;
				if(_this.formData.end_time == ''){
					_this.formData.end_time = '0'
				}
				this.ajax('match/career_portfolio_op.php', this.formData, function (response) {
					if (response.data.code == 200) {
						_this.$message({
							message: response.data.message,
							type: 'success'
						});
						_this.$router.push({path: '/portfolio',query:{teamID:_this.$route.query.teamID}})
					} else {
						_this.$message.error({
							message: response.data.message,
						});
					}
					_this.form.loading = false
				})
			},
			remoteMethod(playerID) {
				const _this = this;
				this.ajax('match/player_information.php',{player_param: playerID}, function (response) {
					_this.search_star = response.data.data;
				})
			},
			// requestPlayer () {
			// 	const _this = this;
			// 	this.ajax('match/player_information.php', {player_param: playerID}, function (response) {
			// 		if (response.data.code == 200) {
			// 			// _this.formData.playerID = response.data.data[0].playerID;
			// 			_this.formData.player_nickname = response.data.data[0].nickname;
			// 		}
			// 	})
			// },
			submit () {
				this.$refs['porfolioForm'].validate((valid) => {
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
