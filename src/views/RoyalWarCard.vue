<template>
    <div class="royal-war-card">
        <el-form :inline="true" :model="queryParams">
            <el-form-item >
                <el-input placeholder="名称" v-model="queryParams.name"></el-input>
            </el-form-item>
            <el-form-item >
                <el-input placeholder="外部绑定ID" v-model="queryParams.bindID_1"></el-input>
            </el-form-item>
            <el-form-item  style="float:right;margin-right: 0">
                <router-link :to="{ path:'/royal-war-card/create' }">
                    <el-button type="default" icon="plus">新增</el-button>
                </router-link>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="" label="封面" align="center" width="">
                <template scope="scope">
                    <img class="" :src="scope.row.image_url" style="max-width: 100px" />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="level_name" label="级别" align="center"></el-table-column>
            <el-table-column prop="type_name" label="类型" align="center"></el-table-column>
            <el-table-column prop="holy_water" label="圣水消耗" align="center"></el-table-column>
            <el-table-column prop="bindID_1" label="外部绑定ID" align="center"></el-table-column>
            <el-table-column label="操作" class="center" align="center" width="240">
                <template scope="scope">
                    <router-link :to="{ path:'/royal-war-card/'+ scope.row.id }" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
                    <el-button size="small" type="danger" @click="roomAction('del',scope.row)" :disabled="scope.row.is_delete == 1">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :page-size="queryParams.limit" :page-sizes="[20, 30, 50, 200]"  @size-change="handleSizeChange" :current-page="queryParams.page"  @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

</template>

<script>
	export default {
		data () {
			return {
				queryParams: {
					name:'',
					bindID_1:'',
					page: 1,
					limit: 20,
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
				this.ajax('match/royal_war_card_list.php', this.queryParams, function (response) {
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
							_this.ajax('match/royal_war_card_op.php', {id: row.id,act:'del'}, function (response) {
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
