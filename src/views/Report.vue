<template>
    <div class="room-list">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-radio-group v-model="queryParams.type">
                    <el-radio-button label="1">流水收入总表</el-radio-button>
                    <el-radio-button label="2">分支付方式统计表</el-radio-button>
                    <el-radio-button label="3">分渠道统计表</el-radio-button>
                    <el-radio-button label="4">周充值用户分群</el-radio-button>
                </el-radio-group>
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
        <el-table :data="tableData1" border stripe v-loading="loading" :class="{ active: queryParams.type == 1 }">
            <el-table-column prop="date_name" label="日期" width="" align="center"></el-table-column>
            <el-table-column prop="active_user" label="活跃用户数" width="" align="center"></el-table-column>
            <el-table-column prop="pay_user" label="充值用户数" width="" align="center"></el-table-column>
            <el-table-column prop="pay_amount" label="充值总额（元）" width="" align="center"></el-table-column>
            <el-table-column prop="ARPU1" label="收入ARPU（充值总额/充值用户数）" width="" align="center"></el-table-column>
            <el-table-column prop="ARPU2" label="收入ARPU（充值总额/活跃用户数）" width="" align="center"></el-table-column>
            <el-table-column prop="pay_rate" label="付费渗透率" width="" align="center"></el-table-column>
        </el-table>
        <el-table :data="tableData2" border stripe v-loading="loading" :class="{ active: queryParams.type == 2 }">
            <el-table-column prop="date_name" label="日期" width="" align="center"></el-table-column>
            <el-table-column prop="pay_user" label="总充值用户数" width="" align="center"></el-table-column>
            <el-table-column prop="pay_amount" label="充值总额（元）" width="" align="center"></el-table-column>
            <el-table-column label="支付方式1：支付宝" align="center">
                <el-table-column prop="alipay_user" label="充值用户数" align="center"></el-table-column>
                <el-table-column prop="alipay_amount" label="充值总额" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="支付方式2：微信支付" align="center">
            <el-table-column prop="wxpay_user" label="充值用户数" align="center"></el-table-column>
            <el-table-column prop="wxpay_amount" label="充值总额" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="支付方式3：iOS支付" align="center">
                <el-table-column prop="ios_pay_user" label="充值用户数" align="center"></el-table-column>
                <el-table-column prop="ios_pay_amount" label="充值总额" align="center"></el-table-column>
            </el-table-column>
        </el-table>
        <el-table :data="tableData3" border stripe v-loading="loading" :class="{ active: queryParams.type == 3 }">
            <el-table-column prop="date_name" label="日期" width="" align="center"></el-table-column>
            <el-table-column prop="active_user" label="活跃用户数" width="" align="center"></el-table-column>
            <el-table-column prop="pay_user" label="充值用户数" width="" align="center"></el-table-column>
            <el-table-column prop="pay_amount" label="充值总额（元）" width="" align="center"></el-table-column>
            <el-table-column label="渠道1：iOS" align="center">
                <el-table-column prop="ios_active_user" label="渠道活跃人数" align="center"></el-table-column>
                <el-table-column prop="ios_pay_user" label="渠道充值人数" align="center"></el-table-column>
                <el-table-column prop="ios_pay_amount" label="渠道收入总额" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="渠道2：安卓端" align="center">
                <el-table-column prop="android_active_user" label="渠道活跃人数" align="center"></el-table-column>
                <el-table-column prop="android_pay_user" label="渠道充值人数" align="center"></el-table-column>
                <el-table-column prop="android_pay_amount" label="渠道收入总额" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="渠道3：PC端" align="center">
                <el-table-column prop="pc_active_user" label="渠道活跃人数" align="center"></el-table-column>
                <el-table-column prop="pc_pay_user" label="渠道充值人数" align="center"></el-table-column>
                <el-table-column prop="pc_pay_amount" label="渠道收入总额" align="center"></el-table-column>
            </el-table-column>
        </el-table>
        <el-table :data="tableData4" border stripe v-loading="loading" :class="{ active: queryParams.type == 4 }">
            <el-table-column prop="date_name" label="日期" width="" align="center"></el-table-column>
            <el-table-column prop="seven_day_active_user" label="7天活跃人数" width="" align="center"></el-table-column>
            <el-table-column prop="seven_day_pay_user" label="7天充值用户数" width="" align="center"></el-table-column>
            <el-table-column label="小R用户：7日内累计充值金额为1~49元" align="center">
                <el-table-column prop="pay_user_1" label="用户数" align="center"></el-table-column>
                <el-table-column prop="pay_user_rate_1" label="用户占比" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="中小R用户：7日内累计充值金额为50~199元" align="center">
                <el-table-column prop="pay_user_2" label="用户数" align="center"></el-table-column>
                <el-table-column prop="pay_user_rate_2" label="用户占比" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="中R用户：7日内累计充值金额为200~999元" align="center">
                <el-table-column prop="pay_user_3" label="用户数" align="center"></el-table-column>
                <el-table-column prop="pay_user_rate_3" label="用户占比" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="大R用户：7日内累计充值金额为1000元及以上" align="center">
                <el-table-column prop="pay_user_4" label="用户数" align="center"></el-table-column>
                <el-table-column prop="pay_user_rate_4" label="用户占比" align="center"></el-table-column>
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
                    type: 1,
                    page: 1,
                    limit: 15
                },
                formInline: {
                    roomTypeOptions: [

                    ],
                    isRequiredOptions: [

                    ],
                    distributionOptions: [

                    ]
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
                var reportExcelLink = "http://"+window.location.host+"/services/fantasy/fantasy_report.php?type="+this.tableQueryParams.type+"&page="+this.tableQueryParams.page+"&limit="+this.tableQueryParams.limit+"&stime="+this.formExcel.stime+"&etime="+this.formExcel.etime+"&act=export"
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
                const _this = this;
                _this.loading = true;
                this.queryParams.stime = '';
                this.queryParams.etime = '';
                this.queryParams.act = '';
                this.ajax('fantasy_report.php', this.tableQueryParams, function (response) {
                    ///services/fantasy/fantasy_role.php
                    _this.loading = false
                    _this.total = parseInt(response.data.data.count)
                    if(_this.queryParams.type == 1){
                        console.log(_this.queryParams.type);
                        _this.tableData1 = response.data.data.list
                    }else if(_this.queryParams.type == 2){
                        _this.tableData2 = response.data.data.list
                    }else if(_this.queryParams.type == 3){
                        _this.tableData3 = response.data.data.list
                    }else if(_this.queryParams.type == 4){
                        _this.tableData4 = response.data.data.list
                    }else if(_this.queryParams.type == 5){
                        _this.tableData5 = response.data.data.list
                    }else if(_this.queryParams.type == 6){
                        _this.tableData6 = response.data.data.list
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
