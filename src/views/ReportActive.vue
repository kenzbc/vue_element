<template>
    <div class="room-list">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-radio-group v-model="queryParams.type">
                    <el-radio-button label="5">活跃用户留存情况</el-radio-button>
                    <el-radio-button label="6">新用户留存情况</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-select placeholder="渠道" v-model="formInline.appid" size="15" clearable>
                    <el-option v-for="item in formInline.roomThirdPartyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  style="float:right;margin-right: 0">
                <el-button type="primary" @click="dialogFormVisible = true">导出表格</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="导出表格" :visible.sync="dialogFormVisible">
            <el-form :model="formExcel">
                <el-form-item label="时间范围">
                    <el-date-picker v-model="datetime" type="daterange" placeholder="选择时间范围" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="reportExcel()">确 定</el-button>
            </div>
        </el-dialog>
        <el-table :data="tableData5" border stripe v-loading="loading" :class="{ active: queryParams.type == 5 }">
            <el-table-column prop="date_name" label="日期" width="" align="center"></el-table-column>
            <el-table-column prop="active_user" label="活跃用户数" width="" align="center"></el-table-column>
            <el-table-column label="次日留存" align="center">
                <el-table-column prop="active_1_retention" label="留存数" align="center"></el-table-column>
                <el-table-column prop="active_1_retention_rate" label="留存率" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="3日留存" align="center">
                <el-table-column prop="active_3_retention" label="留存数" align="center"></el-table-column>
                <el-table-column prop="active_3_retention_rate" label="留存率" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="7日留存" align="center">
                <el-table-column prop="active_7_retention" label="留存数" align="center"></el-table-column>
                <el-table-column prop="active_7_retention_rate" label="留存率" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="15日留存" align="center">
                <el-table-column prop="active_15_retention" label="留存数" align="center"></el-table-column>
                <el-table-column prop="active_15_retention_rate" label="留存率" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="30日留存" align="center">
                <el-table-column prop="active_30_retention" label="留存数" align="center"></el-table-column>
                <el-table-column prop="active_30_retention_rate" label="留存率" align="center"></el-table-column>
            </el-table-column>
        </el-table>
        <el-table :data="tableData6" border stripe v-loading="loading" :class="{ active: queryParams.type == 6 }">
            <el-table-column prop="date_name" label="日期" width="" align="center"></el-table-column>
            <el-table-column prop="new_user" label="新增用户数" width="" align="center"></el-table-column>
            <el-table-column label="次日留存" align="center">
                <el-table-column prop="new_1_retention" label="留存数" align="center"></el-table-column>
                <el-table-column prop="new_1_retention_rate" label="留存率" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="3日留存" align="center">
                <el-table-column prop="new_3_retention" label="留存数" align="center"></el-table-column>
                <el-table-column prop="new_3_retention_rate" label="留存率" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="7日留存" align="center">
                <el-table-column prop="new_7_retention" label="留存数" align="center"></el-table-column>
                <el-table-column prop="new_7_retention_rate" label="留存率" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="15日留存" align="center">
                <el-table-column prop="new_15_retention" label="留存数" align="center"></el-table-column>
                <el-table-column prop="new_15_retention_rate" label="留存率" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="30日留存" align="center">
                <el-table-column prop="new_30_retention" label="留存数" align="center"></el-table-column>
                <el-table-column prop="new_30_retention_rate" label="留存率" align="center"></el-table-column>
            </el-table-column>
        </el-table>
        <el-pagination :page-size="queryParams.limit" :page-sizes="[10, 15, 30, 50, 200]"  @size-change="handleSizeChange" :current-page="queryParams.page"  @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

</template>

<script>
    export default {
        data () {
            return {
                dialogFormVisible: false,
                formExcel: {
                    stime: '',
                    etime: ''
                },
                datetime:'',
                actionLoading: {
                    rec: {}
                },
                queryParams: {
	                appid:'',
                    type: 5,
                    page: 1,
                    limit: 15,
                },
                formInline: {
	                appid:'',
	                roomThirdPartyObject: {},
	                roomThirdPartyOptions:[{
		                label:'全部',
		                value:'',
                    }],
                    roomTypeOptions: [],
                    isRequiredOptions: [],
                    distributionOptions: []
                },
                tableData1: [],
                tableData2: [],
                tableData3: [],
                tableData4: [],
                tableData5: [],
                tableData6: [],
                total: 0,
                loading: false,
                isMounted: false

            }
        },
        watch: {
	        'formInline.appid' (data) {
		        this.queryParams.appid = data
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
            },
            datetime (data) {
                this.formExcel.stime = data[0] ? this.moment(data[0]).format('YYYYMMDD') : ''
                this.formExcel.etime = data[0] ? this.moment(data[1]).format('YYYYMMDD') : ''
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
            reportExcel(){
                var reportExcelLink = "http://"+window.location.host+"/services/fantasy/fantasy_report.php?appid="+this.tableQueryParams.appid+"&type="+this.tableQueryParams.type+"&page="+this.tableQueryParams.page+"&limit="+this.tableQueryParams.limit+"&stime="+this.formExcel.stime+"&etime="+this.formExcel.etime+"&act=export"
                console.log(reportExcelLink);
                window.open(reportExcelLink)
//                const _this = this;
//                _this.loading = true;
//                this.ajax('fantasy_report.php', 'get', {
//                    type: this.tableQueryParams.type,
//                    page: this.tableQueryParams.page,
//                    limit: this.tableQueryParams.limit,
//                    stime: this.formExcel.stime,
//                    etime: this.formExcel.etime,
//                    act: 'export'
//                }, function (response) {
//                    _this.loading = false
//
//                });
            },
            requestList (data) {
                const _this = this
                _this.loading = true
                this.ajax('fantasy_report.php', this.tableQueryParams, function (response) {
                    ///services/fantasy/fantasy_role.php
                    _this.loading = false;
                    _this.total = parseInt(response.data.data.count);
                    if(_this.queryParams.type == 5){
                        _this.tableData5 = response.data.data.list
                    }else if(_this.queryParams.type == 6){
                        _this.tableData6 = response.data.data.list
                    }
                    //渠道获取
	                let apps = response.data.data.apps;
	                _this.formInline.roomThirdPartyOptions = [];
	                for (let i in response.data.data.apps) {
		                _this.formInline.roomThirdPartyOptions.push({
			                label: apps[i].name,
			                value: apps[i].id
		                });
		                _this.formInline.roomThirdPartyObject[apps[i].id] = apps[i].name
	                }
                });
            },
            handleSizeChange (val) {
                this.queryParams.limit = val
            },
            handleCurrentChange (val) {
                this.queryParams.page = val
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

<style scoped="">
    .room-list .el-table{ display: none;}
    .room-list .el-table.active{ display: block;}
</style>
