<template>
    <div class="team-history-update">
        <el-form ref="teamHistoryForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">
            <el-form-item label="是否有数据：">
                <el-radio-group v-model="formData.has_data">
                    <el-radio-button label="1">是</el-radio-button>
                    <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="比赛ID：" prop="matchID">
                <!--<el-input v-model="formData.matchID" class="large" placeholder="填写比赛ID，若无数据，可填0"></el-input>-->
                <el-select
                        v-model="formData.matchID"
                        filterable
                        remote
                        placeholder="填写比赛ID，若无数据，为0"
                        :remote-method="remoteMethod"
                        :disabled="formData.has_data == '0'"
                        :loading="loading">
                    <el-option
                            v-for="item in search_star"
                            :key="item.matchID"
                            :label="item.matchID"
                            :value="item.matchID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="赛事ID：" prop="tournament_id" >
                <el-input v-model="formData.tournament_id" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="赛事名称：" prop="tournament_name" >
                <el-input v-model="formData.tournament_name" class="large" placeholder="根据matchID自动获取，手动则完整填写赛事名称"></el-input>
            </el-form-item>
            <el-form-item label="队伍A：" prop="team_name_a" >
                <el-input v-model="formData.team_name_a" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="队伍A比分：" prop="team_a_win" >
                <el-input v-model="formData.team_a_win" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="队伍B：" prop="team_name_b" >
                <el-input v-model="formData.team_name_b" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="队伍B比分：" prop="team_b_win" >
                <el-input v-model="formData.team_b_win" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="时间：" prop="match_time" >
                <el-date-picker v-model="formData.match_time" type="datetime" placeholder="选择时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="名次：" prop="ranking" >
                <el-input v-model="formData.ranking" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="奖金：" prop="reward" >
                <el-input v-model="formData.reward" class="large" placeholder=""></el-input>
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
					matchID: '',
					has_data:'1',
					tournament_id:'',
					tournament_name:'',
					team_name_a:'',
					team_a_win:'',
					team_name_b:'',
					team_b_win:'',
					match_time:'',
					ranking:'',
					reward:'',
				},
				formRules:  {
					matchID: [{required: true, message: '比赛ID不能为空'}],
					tournament_id: [{required: true, message: '赛事ID不能为空'}],
					tournament_name: [{required: true, message: '赛事名称不能为空'}],
					team_name_a: [{required: true, message: '队伍A名称不能为空'}],
					team_name_b: [{required: true, message: '队伍B名称不能为空'}],
					team_a_win: [{required: true, message: '队伍A比分不能为空'}],
					team_b_win: [{required: true, message: '队伍B比分不能为空'}],
					match_time: [{required: true, message: '时间不能为空'}],
				},
				search_star: [],
				loading: false,
			}
		},
		mounted () {
			if (this.$route.name === 'team-history-update') {
				this.requestData({id: this.$route.params.id,act:'view'})
			}
		},
		watch: {
			'formData.has_data' (data) {
				this.hasData(data);
			},
		},
		methods: {
			requestData (params) {
				const _this = this;
				this.ajax('match/team_history_op.php', params, function (response) {
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

				if (_this.$route.name === 'team-history-update') {
					_this.formData.act = 'edit';

				}else{
					_this.formData.act = 'add';
					_this.formData.teamID = _this.$route.query.teamID;
				}
				_this.formData.teamID = _this.$route.query.teamID;
				this.ajax('match/team_history_op.php', this.formData, function (response) {
					if (response.data.code == 200) {
						_this.$message({
							message: response.data.message,
							type: 'success'
						});
						_this.$router.push({path: '/team-history',query:{teamID:_this.$route.query.teamID}})
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

					_this.formData.team_name_a = response.data.data[0].team_short_name_a;
					_this.formData.team_name_b = response.data.data[0].team_short_name_b;
					_this.formData.team_a_win = response.data.data[0].team_a_win;
					_this.formData.team_b_win = response.data.data[0].team_b_win;
					_this.formData.tournament_id = response.data.data[0].tournamentID;
					_this.formData.tournament_name = response.data.data[0].short_name;
					_this.formData.match_time = response.data.data[0].start_time;
				})
			},
			hasData(data){
				if(data == '0'){
					this.formData.matchID = '0'
                }
            },
			submit () {
				this.$refs['teamHistoryForm'].validate((valid) => {
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
