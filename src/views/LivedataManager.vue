<template>
    <div class="livedata-manager">
        <el-form :inline="true" :model="queryParams">
            <el-form-item  style="float:right;margin-right: 0">
                <router-link :to="{ path:'/livedata-manager/create' }">
                    <el-button type="default" icon="plus">新增</el-button>
                </router-link>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="id" label="ID" align="center"></el-table-column>
            <el-table-column prop="platform_url" label="URL" align="center"></el-table-column>
            <el-table-column prop="title" label="直播平台" align="center"></el-table-column>
            <el-table-column prop="" label="比赛信息" align="center">
                <template scope="scope">
                    {{scope.row.desc}} matchID:{{scope.row.match_id}}
                </template>
            </el-table-column>
            <el-table-column label="操作" class="center" align="center" width="240">
                <template scope="scope">
                    <router-link :to="{ path:'/livedata-manager/'+ scope.row.id }" tag="el-button" class="el-button--small el-button--primary">编辑</router-link>
                    <!--<el-button size="small" type="danger" @click="roomAction('del',scope.row)" :disabled="scope.row.is_delete == 1">删除</el-button>-->
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
				this.ajax('match/livedata_manager_list.php', this.queryParams, function (response) {
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
