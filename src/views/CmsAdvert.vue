<template>
    <div class="cms-advert-list">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-date-picker v-model="datetime" type="datetimerange" placeholder="选择时间范围" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-select placeholder="状态" v-model="queryParams.status" size="3" clearable>
                    <el-option v-for="item in formInline.statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="权重" v-model="queryParams.weight_value" type="number" min="1" style="width:150px;"></el-input>
            </el-form-item>

            <el-form-item>
                <el-select placeholder="游戏类型" v-model="queryParams.gameID" size="5" clearable>
                    <el-option v-for="item in formInline.gameIDOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-select placeholder="渠道" v-model="queryParams.appid" size="5" clearable class="filter-item">
                <el-option v-for="item in formInline.ThirdPartyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>

            <el-form-item>
                <el-select placeholder="投放端" v-model="queryParams.platform" size="3" clearable>
                    <el-option v-for="item in formInline.platformOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="广告投放商" v-model="queryParams.buyer" type="" style="width:150px;"></el-input>
            </el-form-item>

            <el-form-item  style="float:right;margin-right: 0">
                <router-link to="/cms-advert/create">
                    <el-button type="default" icon="plus">创建广告</el-button>
                </router-link>
            </el-form-item>

        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="id" label="ID" align="center" width="85"></el-table-column>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>

            <el-table-column prop="buyer" label="广告投放商" align="center"></el-table-column>
            <el-table-column prop="game_name" label="游戏类型" align="center" width="100"></el-table-column>
            <el-table-column prop="app_name" label="渠道" align="center"></el-table-column>
            <el-table-column label="位置" align="center">
                <template scope="scope">{{scope.row.channel_name}} 第{{scope.row.position}}条</template>
            </el-table-column>
            <el-table-column prop="status_name" label="状态" align="center" width="100"></el-table-column>
            <el-table-column prop="start_time" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="end_time" label="结束时间" align="center"></el-table-column>
            <el-table-column prop="" label="投放端" align="center" width="85">
                <template scope="scope">{{scope.row.platform == 1 ? 'Android': scope.row.platform == 2 ? 'Ios' : 'Web'}}</template>
            </el-table-column>
            <el-table-column prop="click_num" label="点击量" align="center" width="85"></el-table-column>
            <el-table-column prop="" label="权重" align="center" width="85">
                <template scope="scope">{{scope.row.weight_value}}/{{scope.row.weight_count}}</template>
            </el-table-column>

            <el-table-column label="操作" class="center" align="center" width="240">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="roomAction('edit',scope.row)"  :disabled="scope.row.status == 2 || scope.row.status == 3">修改</el-button>
                    <el-button size="small" type="warning" @click="roomAction('stop',scope.row)" :disabled="scope.row.status == -1 || scope.row.status == 2 || scope.row.status == 3">{{scope.row.status == 0 ? '暂停':'恢复'}}</el-button>
                    <el-button size="small" type="danger" @click="roomAction('end',scope.row)"  :disabled="scope.row.status == 2 || scope.row.status == 3">终止</el-button>
                </template>
            </el-table-column>
            <el-table-column width="80" type="expand">
                <template scope="scope">
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="最后操作人">
                            <span>{{scope.row.admin_name}}</span>
                        </el-form-item>
                        <el-form-item label="操作时间">
                            <span>{{scope.row.update_time}}</span>
                        </el-form-item>
                        <el-form-item label="操作内容">
                            <span>{{scope.row.operate_name}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination :page-size="queryParams.limit" :page-sizes="[10, 15, 30, 50, 200]"  @size-change="handleSizeChange" :current-page="queryParams.page"  @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

</template>

<script>
    export default {
        data () {
            return {
                queryParams: {
                    start_time: '',
                    end_time: '',
                    status: '',
                    weight_value: '',
                    gameID:'',
	                appid:'',
                    platform:'',
                    buyer:'',
                    page: 1,
                    limit: 15,
                },
                formInline: {
                    statusOptions: [
                        {
                            value: '-1',
                            label: '未开始'
                        },
                        {
                            value: '0',
                            label: '进行中'
                        },
                        {
                            value: '1',
                            label: '暂停'
                        },
                        {
                            value: '2',
                            label: '终止'
                        },
                        {
                            value: '3',
                            label: '已结束'
                        }
                    ],
                    gameIDOptions: [],
	                ThirdPartyOptions: [],
                    platformOptions: [
                        {
                            value: '1',
                            label: '安卓'
                        },
                        {
                            value: '2',
                            label: 'Ios'
                        },
                        {
                            value: '3',
                            label: 'Web'
                        }
                    ],
                },
                datetime:'',
                pickerOptions: {
                    shortcuts: [{
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() - end.getHours()*3600*1000 - end.getMinutes()*600*100 - end.getSeconds()*1000);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1 - start.getHours()*3600*1000 - start.getMinutes()*600*100 - start.getSeconds()*1000);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近7天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() - end.getHours()*3600*1000 - end.getMinutes()*600*100 - end.getSeconds()*1000);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 - start.getHours()*3600*1000 - start.getMinutes()*600*100 - start.getSeconds()*1000);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                tableData: [],
                total: 0,
                loading: false,
                isMounted: false,
                edit_data:''
            }
        },
        watch: {
            datetime (data) {
                this.queryParams.start_time = data[0] ? this.moment(data[0]).format('YYYY-MM-DD HH:mm:ss') : ''
                this.queryParams.end_time = data[0] ? this.moment(data[1]).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            queryParams: {
                handler (data,oldData) {
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
                this.requestGameList();
	            this.requestThirdPartyList()
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
                this.ajax('advert_info/get_advert_list.php', this.tableQueryParams, function (response) {
                    _this.loading = false
                    _this.total = parseInt(response.data.data.count);
                    _this.tableData = response.data.data.list

                });
            },
	        requestGameList () {
		        this.ajax('match/get_game_list.php', {page: 1, limit: 100}, (response) => {
			        if (response.data.code == 200) {
				        let list = response.data.data.list;
				        for (let i in list) {
					        this.formInline.gameIDOptions.push({
						        label: list[i].text,
						        value: list[i].value
					        })
				        }
			        } else {
				        this.$message.error({
					        message: response.data.message,
				        })
			        }
		        })
	        },
            requestThirdPartyList () {
		        this.ajax('member/third_party_list.php', {page: 1, limit: 100}, (response) => {
			        if (response.data.code == 200) {
				        let list = response.data.data.list;
				        for (let i in list) {
					        this.formInline.ThirdPartyOptions.push({
						        label: list[i].name,
						        value: list[i].id
					        })
				        }
			        } else {
				        this.$message.error({
					        message: response.data.message,
				        })
			        }
		        })
	        },
            roomAction (type,row) {
                const _this = this
                switch (type) {
                    case 'edit':
                        _this.$router.push({path:'/cms-advert/' + row.id});
                        break
                    case 'stop':
                        console.log(row);
                        this.$confirm(row.status == 0 ? '暂停':'恢复', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(({ value }) => {
                            if(row.status == 1){
                                _this.edit_data={
                                    id: row.id,
                                    action:'edit',
                                    status:0,
                                    op:1
                                }
                            }else{
                                _this.edit_data={
                                    id: row.id,
                                    action:'edit',
                                    status:1,
                                    op:1
                                }
                            }
                            _this.ajax('advert_info/edit_advert_info.php', _this.edit_data, function (response) {
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
                        break;
                    case 'end':
                        this.$confirm('终止投放不可逆，确定要终止投放该条广告么？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(({ value }) => {
                            _this.ajax('advert_info/edit_advert_info.php', {id: row.id,action:'edit',status:2,op:1}, function (response) {
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
                console.log(val,1)
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
