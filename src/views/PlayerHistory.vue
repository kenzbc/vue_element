<template>
    <div class="player-history-list">
        <el-form :inline="true" :model="queryParams">
            <el-form-item  style="float:right;margin-right: 0">
                <el-button type="primary" @click="roomAction('refresh',$route.query)">一键采集</el-button>
            </el-form-item>
            <el-form-item  style="float:right;margin-right: 0">
                <router-link :to="{ path:'/player-history/create', query: { playerID:  this.$route.query.playerID} }">
                    <el-button type="default" icon="plus">新增</el-button>
                </router-link>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="match_time" label="比赛时间" align="center" width=""></el-table-column>
            <el-table-column prop="ranking" label="名次" align="center" width=""></el-table-column>
            <el-table-column prop="tournament_name" label="赛事" align="center"></el-table-column>
            <el-table-column prop="" label="比赛" align="center">
                <template scope="scope">
                    {{scope.row.team_name_a}} {{scope.row.team_a_win}}：{{scope.row.team_b_win}} {{scope.row.team_name_b}}
                </template>
            </el-table-column>
            <el-table-column prop="reward" label="奖金" align="center"></el-table-column>
            <el-table-column label="操作" class="center" align="center" width="240">
                <template scope="scope">
                    <router-link :to="{ path:'/player-history/'+ scope.row.id, query: { playerID:  $route.query.playerID} }" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
                    <el-button size="small" type="danger" @click="roomAction('del',scope.row)" :disabled="scope.row.is_delete == 1">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--<el-pagination :page-size="queryParams.limit" :page-sizes="[10, 15, 30, 50, 200]"  @size-change="handleSizeChange" :current-page="queryParams.page"  @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>-->
    </div>

</template>

<script>
	export default {
		data () {
			return {
				queryParams: {
					playerID:'',
				},
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

				this.ajax('match/player_history.php', this.queryParams, function (response) {
					if (response.data.code == 200) {
						_this.loading = false
						_this.tableData = response.data.data.list;
						_this.total = parseInt(response.data.data.count)
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
							_this.ajax('match/player_history_op.php', {id: row.id,act:'del'}, function (response) {
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
					case 'refresh':
						this.$confirm('确定采集吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(({ value }) => {
							_this.ajax('match/player_history_op.php', {playerID: row.playerID,act:'refresh'}, function (response) {
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

</style>
