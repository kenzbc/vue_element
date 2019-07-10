<template>
    <div class="royal-war-result">
        <el-form :inline="true" :model="queryParams">
            <el-form-item  style="float:right;margin-right: 0">
                <router-link :to="{ path:'/royal-war-result/create' , query: { matchID:  $route.query.matchID}}">
                    <el-button type="default" icon="plus">新增</el-button>
                </router-link>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="" label="第几盘" align="center">
                <template scope="scope">
                    第{{scope.row.the_result}}盘（resultID：{{scope.row.resultID}}）
                </template>
            </el-table-column>
            <el-table-column prop="" label="游戏模式" align="center">
                <template scope="scope">
                    {{scope.row.game_mode == '1'? '1V1' : scope.row.game_mode == '2'?'2V2':'KOF'}}
                </template>
            </el-table-column>
            <el-table-column prop="numberOfGames" label="共几局" align="center"></el-table-column>
            <el-table-column prop="win_teamID" label="胜利方ID" align="center"></el-table-column>
            <el-table-column prop="publish" label="发布状态" align="center">
                <template scope="scope">
                    {{scope.row.publish == '1'? '已发布' : '未发布'}}
                </template>
            </el-table-column>
            <el-table-column label="操作" class="center" align="center" width="240">
                <template scope="scope">
                    <router-link :to="{ path:'/royal-war-result/'+ scope.row.resultID , query: { matchID:  $route.query.matchID}}" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
                    <el-button size="small" type="danger" @click="roomAction('del',scope.row)" :disabled="scope.row.is_delete == 1">删除</el-button>
                    <el-button size="small" type="success" @click="roomAction('publish',scope.row)">发布</el-button>
                </template>
            </el-table-column>
            <el-table-column width="50" type="expand">
                <template slot-scope="scope">
                    <el-row class="row-title">
                        <el-col :span="1" style="text-align: center">局数</el-col>
                        <el-col :span="2" style="text-align: center">战队名称</el-col>
                        <el-col :span="2" style="text-align: center">选手名称</el-col>
                        <el-col :span="1" style="text-align: center">本局结果</el-col>
                        <el-col :span="10" style="text-align: center">卡组</el-col>
                        <el-col :span="1" style="text-align: center">平均费用</el-col>
                        <el-col :span="1" style="text-align: center">皇冠数</el-col>
                        <el-col :span="1" style="text-align: center">丢失皇冠</el-col>
                        <el-col :span="1" style="text-align: center">首牌时间</el-col>
                        <el-col :span="1" style="text-align: center">一塔时间</el-col>
                        <el-col :span="1" style="text-align: center">平均塔血</el-col>
                        <el-col :span="2" style="text-align: center">禁用卡</el-col>
                    </el-row>

                    <el-row v-for="(item,index) in scope.row.record_array">

                        <el-col :span="1" style="text-align: center">
                            第{{item.numberOfGames}}局
                        </el-col>
                        <el-col :span="2" style="text-align: center">
                            <span :class="{'win_blue':item.record_result == '1' && item.color == '2','win_red':item.record_result == '1' && item.color == '1'}">{{item.team_name}}</span>
                        </el-col>
                        <el-col :span="2" style="text-align: center">
                            {{item.nickname}}（ID：{{item.playerID}}）
                        </el-col>
                        <el-col :span="1" style="text-align: center">
                            {{item.record_result == '1'? '胜利': item.record_result == '0'?'平':'负'}}
                        </el-col>
                        <el-col :span="10" style="text-align: center">
                            <img class="" :src="item.device_1_image" style="max-width: 80px" />
                            <img class="" :src="item.device_2_image" style="max-width: 80px" />
                            <img class="" :src="item.device_3_image" style="max-width: 80px" />
                            <img class="" :src="item.device_4_image" style="max-width: 80px" />
                            <img class="" :src="item.device_5_image" style="max-width: 80px" />
                            <img class="" :src="item.device_6_image" style="max-width: 80px" />
                            <img class="" :src="item.device_7_image" style="max-width: 80px" />
                            <img class="" :src="item.device_8_image" style="max-width: 80px" />
                        </el-col>
                        <el-col :span="1" style="text-align: center">
                            {{item.average_cost}}
                        </el-col>
                        <el-col :span="1" style="text-align: center">
                            {{item.crown_number}}
                        </el-col>
                        <el-col :span="1" style="text-align: center">
                            {{item.lose_crown_number}}
                        </el-col>
                        <el-col :span="1" style="text-align: center">
                            {{item.first_brand_time}}
                        </el-col>
                        <el-col :span="1" style="text-align: center">
                            {{item.first_tower_time}}
                        </el-col>
                        <el-col :span="1" style="min-height:10px;text-align: center">
                            {{item.average_tower}}
                        </el-col>
                        <el-col :span="2" style="text-align: center">
                            <img class="" :src="item.ban_image" style="max-width: 80px" />
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </div>

</template>

<script>
	export default {
		data () {
			return {
				queryParams: {
					matchID:'',
					page: 1,
					limit: 20,
				},
				matchData:[],
				tableData: [],
				total: 0,
				loading: false,
				isMounted: false
			}
		},
		watch: {
			queryParams: {
				handler (data,oldData) {
					if (!isNaN(data.page) || !isNaN(data.limit)) {
						data.limit = parseInt(data.limit)
						data.page = parseInt(data.page)
					}
					this.$router.push({
						path: '',
						query: data
					})
				},
				deep: true
			},
			'$route.query' : {
				handler (data) {
					this.requestList()
				},
				deep: true
			}
		},
		mounted () {
			if (!this.isMounted) {
				this.isMounted = true
				let data = this.queryParams
				if (!this.isEmptyObject(this.$route.query)) {
					data = this.$route.query
					this.queryParams = JSON.parse(JSON.stringify(data))
					this.requestList()
				} else {
					this.$router.push({
						path: '',
						query: data
					})
				}
			}
		},
		methods: {
			isEmptyObject(e) {
				for (let t in e) return false;
				return true
			},
			requestList (data) {
				const _this = this
				_this.loading = true
				this.ajax('match/royal_war_result_list.php', this.queryParams, function (response) {
					if (response.data.code == 200) {
						_this.loading = false
						_this.tableData = response.data.data.result_list;
						_this.matchData = response.data.data.match;
					} else {
						_this.$message.error({
							message: response.data.message,
						})
					}
				})
			},
			roomAction (type,row) {
				const _this = this
				switch (type) {
					case 'del':
						this.$confirm('确定删除吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(({ value }) => {
							_this.ajax('match/royal_war_result_op.php', {id: row.resultID,act:'del'}, function (response) {
								if (response.data.code == 200) {
									_this.$message({
										type: 'success',
										message: response.data.message
									})
									_this.requestList()
								} else {
									_this.$message.error({
										message: response.data.message,
									})
								}
								_this.dialog.visible = false
							})
						}).catch(() => {

						});
						break
					case 'publish':
						this.$confirm('确定发布吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(({ value }) => {
							_this.ajax('match/publish_result.php', {resultID: row.resultID,tournament_id:this.matchData.tournamentID}, function (response) {
								if (response.data.success == true) {
									_this.$message({
										type: 'success',
										message: '成功'
									})
									_this.requestList()
								} else {
									_this.$message.error({
										message: response.data.message,
									})
								}
								_this.dialog.visible = false
							})
						}).catch(() => {

						});
						break
				}
			},
			handleSizeChange (val) {
				this.queryParams.limit = val
			},
			handleCurrentChange (val) {
				this.queryParams.page = val
			},
			urlEncode (param, key, encode) {
				if (param == null) return ''
				let paramStr = '';
				let t = typeof (param);
				if (t == 'string' || t == 'number' || t == 'boolean') {
					paramStr += '&' + key + '=' + ((encode === null || encode) ? encodeURIComponent(param) : param);
				} else {
					for (let i in param) {
						let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
						paramStr += urlEncode(param[i], k, encode);
					}
				}
				return paramStr;
			}
		},
		computed: {
			tableQueryParams () {
				let tableQueryParams = {};
				for (let i in this.queryParams) {
					if (this.queryParams[i] !== '') {
						tableQueryParams[i] = this.queryParams[i];
					}
				}
				return tableQueryParams;
			}
		}
	}

</script>

<style>
.win_blue{ color: #00a0e9}
.win_red{ color: #fb7777}
</style>
