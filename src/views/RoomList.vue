<template>
  <div class="room-list">
    <div class="filter-container">
      <el-select placeholder="房间类型" v-model="queryParams.status" style="width: 100px" class="filter-item">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="item in formInline.roomStatusOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-input placeholder="房间ID" v-model="queryParams.id" style="width: 100px" @keydown.enter="request"
                class="filter-item"></el-input>
      <el-input placeholder="房间名称" v-model="queryParams.name" style="width: 100px" @keydown.enter="request"
                class="filter-item"></el-input>
      <el-select placeholder="渠道" v-model="formInline.third_party" multiple size="5" collapse-tags clearable
                 class="filter-item">
        <el-option v-for="item in formInline.roomThirdPartyOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-select placeholder="房间类型" v-model="queryParams.type" size="5" clearable class="filter-item">
        <el-option v-for="item in formInline.roomTypeOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-select placeholder="是否必开" v-model="queryParams.is_must_open" size="5" clearable class="filter-item">
        <el-option v-for="item in formInline.isRequiredOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-select placeholder="分配方案" v-model="queryParams.assign_plan" size="5" clearable class="filter-item">
        <el-option v-for="item in formInline.distributionOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-date-picker placeholder="房间截至时间" v-model="queryParams.at_end_time" size="10"
                      class="filter-item"></el-date-picker>

      <router-link to="/room/create" class="filter-item-right ">
        <el-button type="primary" icon="plus">创建房间</el-button>
      </router-link>
    </div>
    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="roomID" label="房间ID" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="房间名称" width="100"></el-table-column>
      <el-table-column label="创建时间 - 截至时间" align="center" width="250">
        <template slot-scope="scope">
          <span>{{scope.row.add_time | datetime('MM-DD HH:mm:ss')}}</span> - <span>{{scope.row.at_end_time | datetime('MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" :formatter="this.roomTypeFormatter" width="75"
                       align="center"></el-table-column>
      <el-table-column prop="price" label="门票" align="center" width="75"></el-table-column>
      <el-table-column prop="join_num" label="人数上限" align="center" width="90"></el-table-column>
      <el-table-column prop="is_must_open" label="是否必开" width="75" :formatter="this.isMustOpenFormatter"
                       align="center"></el-table-column>
      <el-table-column label="规则" align="center">
        <template slot-scope="scope">
          <div class="room-list-rule">
            <span class="count">次数：{{scope.row.times}}</span>
            <span class="amount">{{scope.row.prize_type == 1 ? '果子' : (scope.row.prize_type == 2 ? '门票': '其他')}}：{{scope.row.prize_amount}}</span>
            <span class="people">人数：{{scope.row.prize_num}}{{scope.row.prize_range == 2 ? ' %':' 人'}}</span>
            <span class="assign">方案：{{scope.row.assign_plan == 1 ? '均分' : '梯度'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="渠道" width="70" align="center">
        <template slot-scope="scope">{{thirdPartyString(scope.row.thirdParty)}}</template>
      </el-table-column>
      <el-table-column label="操作" class="center" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="warning" :plain="scope.row.cms_rec == 1" @click="roomAction('rec',scope.row)"
                     :loading="actionLoading.rec[scope.row.roomID]"
                     :disabled="scope.row.status == 1 || scope.row.status == 2">{{scope.row.cms_rec == 1 ?
            '取消推荐':'推荐房间'}}
          </el-button>
          <el-button size="small" type="success" :plain="scope.row.is_top == 1" @click="roomAction('is_top',scope.row)"
                     :loading="actionLoading.rec[scope.row.roomID]" :disabled="scope.row.cms_rec == 0">
            {{scope.row.top_time >= 1 ? '取消置顶':'置顶房间'}}
          </el-button>
          <router-link
              :to="{ path:'/room/match/' + scope.row.roomID ,query: { room_id:  scope.row.roomID, room_name:  scope.row.name, room_type:  scope.row.type}}"
              tag="el-button" class="el-button--small el-button--info">比赛管理
          </router-link>
          <router-link :to="{ path:'/room/' + scope.row.roomID }" tag="el-button"
                       class="el-button--small el-button--primary"
                       :class="{'is-disabled': scope.row.status == 1 || scope.row.status == 2}"
                       :disabled="scope.row.status == 1 || scope.row.status == 2">编辑
          </router-link>
          <el-button size="small" type="danger" @click="roomAction('close',scope.row)"
                     :disabled="scope.row.status == 1 || scope.row.status == 2">关闭
          </el-button>
          <!--<el-button size="small" type="success" @click="roomAction('copy',scope.row)">复制</el-button>-->
          <router-link :to="{ path:'/room/' + scope.row.roomID ,query: { type:  'copy'}}" tag="el-button"
                       class="el-button--small el-button--primary"
                       :class="{'is-disabled': scope.row.status == 1 || scope.row.status == 2}"
                       :disabled="scope.row.status == 1 || scope.row.status == 2">复制
          </router-link>
        </template>
      </el-table-column>
      <el-table-column width="50" type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="房间名称">
              <span>{{scope.row.name}}</span>
            </el-form-item>
            <el-form-item label="房间描述">
              <span>{{scope.row.room_desc}}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="所选赛事">
              <span>{{scope.row.tournament_list.join(' ') }}</span>
            </el-form-item>
            <el-form-item label="奖金总额">
              <span>{{scope.row.prize_type != 2 ? scope.row.prize_amount : scope.row.prize_desc}}（{{scope.row.prize_type == 1 ? '果子' : (scope.row.prize_type == 2 ? '门票': '其他')}}）</span>
            </el-form-item>
            <el-form-item label="中奖范围">
              <span>{{scope.row.prize_num}}{{scope.row.prize_range == 2 ? ' %':' 人'}}（{{scope.row.prize_range == 1 ? '固定人数' : '固定比例'}}）</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="所选比赛">
              <div class="select-match-list">
                <div class="item" v-for="item in scope.row.match_list">
                  <div class="info"><span>ID：{{item.matchID}}</span> <span class="team-name">{{item.team_name_a}}</span>
                    <img :src="item.team_image_thumb_a" class="team-icon"> <span class="vs">vs</span> <img
                        :src="item.team_image_thumb_b" class="team-icon"> <span
                        class="team-name">{{item.team_name_b}}</span></div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="分配范围">
              <div>{{scope.row.assign_plan == 1 ? '均分' : '梯度'}}</div>
              <table class="assign-plan-table" v-if="scope.row.assign_plan == 2">
                <thead>
                <tr>
                  <th width="80">#</th>
                  <th width="100">人数</th>
                  <th width="150">人均分配金额</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in scope.row.assign_plan_rule">
                  <td>{{index+1}}</td>
                  <td>{{item.num}}</td>
                  <td>{{item.amount}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>

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
				actionLoading: {
					rec: {}
				},
				queryParams: {
					status: '0',
					id: '',
					name: '',
					type: '',
					is_must_open: '',
					assign_plan: '',
					at_end_time: '',
					third_party: '',
					page: 1,
					limit: 15,

				},
				formInline: {
					roomStatusOptions: [
						{
							value: '0',
							label: '进行中'
						},
						{
							value: '1',
							label: '已关闭'
						},
						{
							value: '2',
							label: '已结算'
						},
						{
							value: '4',
							label: '已截至'
						},
						{
							value: '5',
							label: '结算中'
						}
					],
					third_party: [],
					roomThirdPartyObject: {},
					roomThirdPartyOptions: [],
					roomTypeOptions: [
						{
							value: '1',
							label: '新人'
						},
						{
							value: '2',
							label: '活动'
						},
						{
							value: '3',
							label: '日赛'
						},
						{
							value: '4',
							label: '周赛'
						},
						{
							value: '5',
							label: 'SOLO'
						},
						{
							value: '6',
							label: '名人'
						},
						{
							value: '7',
							label: '毒奶'
						}
					],
					isRequiredOptions: [
						{
							value: '1',
							label: '必开'
						},
						{
							value: '0',
							label: '非必开'
						}
					],
					distributionOptions: [
						{
							value: '1',
							label: '均分'
						},
						{
							value: '2',
							label: '梯度'
						}
					]
				},
				tableData: [],
				total: 0,
				loading: false,
				paginationShow: true,
				isMounted: false

			}
		},
		watch: {
			'formInline.third_party'(data) {
				this.queryParams.third_party = data.join()
			},
			// 'queryParams.status'(){
			//     this.queryParams.page = 1;
			// },
			queryParams: {
				handler(data, oldData) {
					if (data.at_end_time) {
						this.queryParams.at_end_time = this.moment(data.at_end_time).format('YYYY-MM-DD')
					}
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
				this.requestRoomThirdPartyList()
			}
		},
		methods: {
			thirdPartyString(ids) {
				let list = ids.split(',')
				let arr = []
				for (let i in list) {
					arr.push(this.formInline.roomThirdPartyObject[list[i]])
				}
				return arr.join()
			},
			requestRoomThirdPartyList() {
				this.ajax('member/third_party_list.php', {page: 1, limit: 100}, (response) => {
					if (response.data.code == 200) {
						let list = response.data.data.list
						for (let i in list) {
							this.formInline.roomThirdPartyOptions.push({
								label: list[i].name,
								value: list[i].id
							})
							this.formInline.roomThirdPartyObject[list[i].id] = list[i].name
						}
					} else {
						this.$message.error({
							message: response.data.message,
						})
					}
				})
			},
			isEmptyObject(e) {
				for (let t in e) return false;
				return true
			},
			requestList(data) {
				// const _this = this
				this.loading = true
				this.ajax('get_room_list.php', this.tableQueryParams, (response) => {
					this.loading = false
					this.paginationShow = true;
					this.total = parseInt(response.data.data.count)
					this.tableData = response.data.data.list
				});
			},
			roomAction(type, row) {
				const _this = this
				switch (type) {
					case 'close':
						this.$prompt('关闭理由', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							inputPattern: /^\S{0,10}$/,
							inputErrorMessage: '不超过10个字'
						}).then(({value}) => {
							_this.ajax('close_room.php', {roomID: row.roomID, message: value}, function (response) {
								console.log(value)
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
					case 'copy':
						this.$confirm('确定要复制这个房间吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							_this.ajax('edit_room.php', {roomID: row.roomID}, function (response) {
								if (response.data.code == 200) {
									_this.$router.push({
										path: '/room/' + response.data.data.roomID,
										query: {type: "copy"}
									})
								} else {
									_this.$message.error({
										message: response.data.message,
									})
								}
							})
						})
						break
					case 'rec':
						let rec = row.cms_rec == 1 ? 0 : 1
						_this.actionLoading.rec[row.roomID] = true
						_this.ajax('edit_room.php', {roomID: row.roomID, 'action': 'is_rec', rec: rec}, function (response) {
							_this.actionLoading.rec[row.roomID] = false
							if (response.data.code == 200) {
								row.cms_rec = rec
								_this.$message({
									type: 'success',
									message: response.data.message
								});
							} else {
								_this.$message.error({
									message: response.data.message,
								});
							}
						});
						break
					case 'is_top':
						let is_top = row.is_top == 1 ? 0 : 1
						_this.actionLoading.rec[row.roomID] = true
						_this.ajax('edit_room.php', {roomID: row.roomID, 'action': 'is_top', top: is_top}, function (response) {
							_this.actionLoading.rec[row.roomID] = false
							if (response.data.code == 200) {
								row.is_top = is_top
								_this.$message({
									type: 'success',
									message: response.data.message
								});
							} else {
								_this.$message.error({
									message: response.data.message,
								});
							}
						});
						break
				}
			},
			roomTypeFormatter(row) {
				return this.optionsForObject(this.formInline.roomTypeOptions)[row.type]
			},
			isMustOpenFormatter(row) {
				return this.optionsForObject(this.formInline.isRequiredOptions)[row.is_must_open]
			},
			prizeFormatter(row) {
				const prizeType = ['果子', '门票', '其他'];
				return prizeType[row.prize_type - 1] + '：' + row.prize_amount
			},
			prizeRangeFormatter(row) {
				const prizeRange = ['人数', '比例']
				return prizeRange[row.prize_range - 1] + '：' + row.prize_num + (row.prize_range == 1 ? '' : '%')
			},
			assignPlanFormatter(row) {

				const assignPlan = ['均分', '梯度'];
				return assignPlan[row.assign_plan - 1]
			},
			optionsForObject(arr) {
				let obj = {};
				for (let i = 0; i < arr.length; i++) {
					obj[arr[i].value] = arr[i].label
				}
				return obj;
			},
			handleSizeChange(val) {

				this.queryParams.limit = val
			},
			handleCurrentChange(val) {
				console.log(val, 1)
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
			}
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
