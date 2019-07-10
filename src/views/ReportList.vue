<template>
  <div class="report-list">
    <el-form :inline="true" :model="formInline">
      <el-form-item>
        <el-input placeholder="举报ID" v-model="queryParams.group" @keydown.enter="request"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="工单号" v-model="queryParams.id" @keydown.enter="request"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="举报类型" v-model="queryParams.report_type" size="5" clearable>
          <el-option :label="item.label" :value="item.value" v-for="(item,index) in formInline.reportReasonOptions"
                     :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="处理结果" v-model="queryParams.process_result" size="5" clearable>
          <el-option :label="item.label" :value="item.value" v-for="(item,index) in formInline.processResultOptions"
                     :key="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="group" label="举报ID" align="center" width=""></el-table-column>
      <el-table-column label="被举报人" align="center">
        <template scope="scope">{{scope.row.be_report_member_name}}（{{scope.row.broadcast_id}}）</template>
      </el-table-column>
      <el-table-column label="举报类型" align="center">
        <template scope="scope">{{scope.row.report_type == '1' ? '贴子' : scope.row.report_type == '2' ? '回复' :
          scope.row.report_type == '3' ? '私信' : scope.row.report_type == '4' ? '赛评预测' : scope.row.report_type == '5' ? '赛评预测回复' : scope.row.report_type}}（{{scope.row.object_id}}）
        </template>
      </el-table-column>
      <el-table-column prop="reason_desc" label="举报内容" align="center">
        <template scope="scope">
          {{scope.row.report_type == '1' ? scope.row.content.title : scope.row.report_type == '2' ?
          scope.row.content.content : scope.row.report_type == '3' ? '' : scope.row.report_type}}
        </template>
      </el-table-column>
      <el-table-column label="处理人" align="center">
        <template scope="scope">{{scope.row.admin_id == '0' || !scope.row.admin_id ? '' :
          scope.row.admin_name+'（'+scope.row.admin_id+'）'}}
        </template>
      </el-table-column>
      <el-table-column prop="deal_time" label="处理时间" align="center" width=""></el-table-column>
      <el-table-column prop="" label="状态" align="center" width="100">
        <template scope="scope">{{scope.row.report_status == '0' ? '未处理' : scope.row.report_status == '1' ? '已处理' :
          scope.row.report_status}}
        </template>
      </el-table-column>
      <el-table-column prop="" label="处理结果" align="center" width="120">
        <template scope="scope">{{scope.row.process_result == '0' ? '未操作' : scope.row.process_result == '1' ? '驳回' :
          scope.row.process_result == '2' ? '仅删除' : scope.row.process_result == '3' ? '删除并禁言' : scope.row.process_result
          == '4' ? '删除并封号' : scope.row.process_result == '5' ? '封号' : scope.row.process_result}}
        </template>
      </el-table-column>
      <el-table-column prop="process_desc" label="处理原因" align="center" width=""></el-table-column>
      <el-table-column label="操作" class="center" align="center" width="150">
        <template scope="scope">
          <router-link :to="{ path:'/report/' + scope.row.id,query:{group:scope.row.group} }" tag="el-button"
                       class="el-button--small el-button--primary" v-show="scope.row.report_status != 1">处理
          </router-link>
          <el-badge :value="scope.row.count" :max="10" class="item">
            <el-button size="small" type="danger" @click="reportAction('link',scope.row)"
                       :disabled="scope.row.report_status == '1' || scope.row.report_type == '3'">查看
            </el-button>
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column width="50" type="expand">
        <template slot-scope="scope">
          <!--<el-table ref="multipleTable" tooltip-effect="dark" :data="scope.row.children" border stripe @selection-change="handleSelectionChange">-->
          <el-table :data="scope.row.children" border stripe>
            <el-table-column prop="id" label="工单号" align="center" width=""></el-table-column>
            <el-table-column label="举报人" align="center" width="">
              <template scope="scope">{{scope.row.member_name}}（{{scope.row.member_id}}）</template>
            </el-table-column>
            <el-table-column prop="" label="举报理由" align="center" width="">
              <template scope="scope">
                {{scope.row.report_reason == '1' ? '不友善行为' : scope.row.report_reason == '2' ? '垃圾或有害信息' :
                scope.row.report_reason == '3' ? '涉嫌侵权' : scope.row.report_reason == '4' ? '不实信息' :
                scope.row.report_reason == '5' ? '其他' : scope.row.report_reason}}
                {{scope.row.reason_desc !== '' ? '(理由：'+ scope.row.reason_desc +')' : ''}}
              </template>
            </el-table-column>
            <el-table-column label="截图" align="center" width="200px">
              <template scope="scope">
                <p v-if="scope.row.report_type !== '3'">-</p>
                <p v-else v-for="(item,index) in scope.row.upload_image" :key="index">
                  <a :href="item" target="_blank"
                     style="display: block; max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item}}</a>
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="add_time" label="提交时间" align="center" width=""></el-table-column>
            <el-table-column prop="app_name" label="举报来源" align="center" width=""></el-table-column>
            <el-table-column prop="" label="果子奖励" align="center" width="130">
              <template scope="scope">
                <el-button size="small" type="warning" @click="reportAction('guozi',scope.row)"
                           v-show="scope.row.add_guozi_status == '0'">奖励果子
                </el-button>
                <p v-show="scope.row.add_guozi_status !== '0'">已奖励{{scope.row.guozi}}果子</p>
              </template>
            </el-table-column>
          </el-table>
          <div style="width: 200px; margin-top: 20px; float: right">
            <el-button type="warning" @click="reportAction('guozi_all',scope.row)">批量奖励果子</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="批量奖励果子" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="可选举报人：">
          <el-checkbox-group v-model="guoziFormActive">
            <el-checkbox v-for="item in guoziFormOptions" :label="item.id" :key="item.id">
              {{item.member_name}}（{{item.member_id}}）
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="奖励果子数量：">
          <el-input v-model="guoziFormNum" type="number" min="5" class="mini"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="reportDialog()">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination :page-size="queryParams.limit" :page-sizes="[10, 15, 30, 50, 200]" @size-change="handleSizeChange"
                   :current-page="queryParams.page" @current-change="handleCurrentChange"
                   layout="total, sizes, prev, pager, next, jumper" :total="total"
                   v-if="paginationShow"></el-pagination>
  </div>

</template>

<script>
	export default {
		data() {
			return {
				dialogFormVisible: false,
				guoziFormOptions: [],
				guoziFormActive: [],
				guoziFormNum: '5',
				queryParams: {
					report_reason: '',
					report_status: '',
					process_result: '',
					page: 1,
					limit: 15,
				},
				formInline: {
					reportReasonOptions: [
						{
							value: '0',
							label: '全部'
						},
						{
							value: '1',
							label: '贴子'
						},
						{
							value: '2',
							label: '回复'
						},
						{
							value: '3',
							label: '私信'
						},
						{
							value: '4',
							label: '赛评预测'
						},
						{
							value: '5',
							label: '赛评预测回复'
						},
					],
					reportStatusOptions: [
						{
							value: '0',
							label: '未处理'
						},
						{
							value: '1',
							label: '已处理'
						},
					],
					processResultOptions: [
						{
							value: '0',
							label: '未操作'
						},
						{
							value: '1',
							label: '驳回'
						},
						{
							value: '2',
							label: '仅删除'
						},
						{
							value: '3',
							label: '删除并禁言'
						},
						{
							value: '4',
							label: '删除并封号'
						},
						{
							value: '5',
							label: '封号'
						},
					],
				},
				tableData: [],
				total: 0,
				loading: false,
				paginationShow: true,
				isMounted: false
			}
		},
		watch: {
			// 'queryParams.group' (data) {
			// 	this.queryParams.page = '1';
			// },
			// 'queryParams.id' (data) {
			// 	this.queryParams.page = '1';
			// },
			// 'queryParams.report_type' (data) {
			// 	this.queryParams.page = '1';
			// },
			// 'queryParams.process_result' (data) {
			// 	this.queryParams.page = '1';
			// },
			queryParams: {
				handler(data, oldData) {
					// console.log(data.page,oldData.page);
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
			'$route.query': {
				handler(data) {
					console.log(data);
					this.requestList()
				},
				deep: true
			}
		},
		mounted() {
			if (!this.isMounted) {
				this.isMounted = true
				let data = this.queryParams
				if (!this.isEmptyObject(this.$route.query)) {
					data = this.$route.query
					this.queryParams = JSON.parse(JSON.stringify(data))
					this.paginationShow = false;
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
			requestList(data) {
				// const _this = this
				this.loading = true
				this.ajax('system/report_list.php', this.tableQueryParams, (response) => {
					this.loading = false;
					this.paginationShow = true;
					this.total = parseInt(response.data.data.count);
					this.tableData = response.data.data.list
				});
			},
			reportAction(type, row) {
				const _this = this
				switch (type) {
					case 'link':
						window.open(row.report.redirect_url);
						break;
					case 'guozi':
						this.$prompt('果子数量', '奖励果子', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							inputValue: '5',
							inputPattern: /^[1-9]+\d*$/,
							inputErrorMessage: '果子数为正整数'
						}).then(({value}) => {
							//确认后执行
							const _this = this;
							_this.loading = true;
							this.ajax('system/report_op.php', {act: 'guozi', id_string: row.id, guozi: value}, function (response) {
								_this.loading = false;
								if (response.data.code == '200') {
									_this.$message({
										type: 'success',
										message: response.data.message
									});
									_this.requestList();//奖励完刷新列表
								} else {
									_this.$message({
										type: 'info',
										message: response.data.message
									});
								}
							});
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '取消'
							});
						});
						break;
					case 'guozi_all':
						//批量果子奖励
						const _this = this;
						_this.loading = true;
						this.ajax('system/report_reward_list.php', {group: row.group}, function (response) {
							_this.loading = false;
							console.log(response.data);
							if (response.data.code == '200') {
								if (response.data.data.list.length > 0) {
									//调用批量奖励弹窗
									_this.guoziFormActive = [];//每次清空
									_this.dialogFormVisible = true;
									_this.guoziFormOptions = response.data.data.list;
								} else {
									_this.$message({
										type: 'info',
										message: '全都奖励过了！'
									});
								}
							} else {
								_this.$message({
									type: 'info',
									message: response.data.message
								});
							}
						});
						break;
				}
			},
			reportDialog() {
				const _this = this;
				if (_this.guoziFormNum > 500) {
					_this.$message({
						type: 'info',
						message: '最多500'
					});
				} else {
					_this.loading = true;
					this.ajax('system/report_op.php', {
						act: 'guozi',
						id_string: _this.guoziFormActive.join(','),
						guozi: _this.guoziFormNum
					}, function (response) {
						_this.loading = false;
						if (response.data.code == '200') {
							_this.$message({
								type: 'success',
								message: response.data.message
							});
							_this.dialogFormVisible = false;
							_this.requestList();//奖励完刷新列表
						} else {
							_this.$message({
								type: 'info',
								message: response.data.message
							});
						}
					});
				}

			},
			handleSizeChange(val) {
				this.queryParams.limit = val
			},
			handleCurrentChange(val) {
				this.queryParams.page = val
			},
			urlEncode(param, key, encode) {
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
			},
		},
		computed: {
			tableQueryParams() {
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
