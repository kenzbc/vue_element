<template>
    <div class="order-list">
        <el-form :inline="true" :model="queryParams">
            <el-form-item >
                <el-input placeholder="搜索相关数据" v-model="queryParams.keyword" :icon="keywordIcon('keyword')" :on-icon-click="clearInputText">
                    <el-select v-model="queryParams.param_name" slot="prepend" placeholder="请选择" style="width: 110px">
                        <el-option label="订单号" value="order_id"></el-option>
                        <el-option label="支付单号" value="trade_no"></el-option>
                        <el-option label="用户名" value="member_nickname"></el-option>
                        <el-option label="用户ID" value="member_id"></el-option>
                        <el-option label="商品名称" value="sku_name"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>

            <div style="">
                <el-form-item>
                    <el-input placeholder="起始金额" v-model="queryParams.min_amount" type="number" min="0" style="width:150px;"></el-input>
                </el-form-item>
                <el-form-item>-</el-form-item>
                <el-form-item>
                    <el-input placeholder="结束金额" v-model="queryParams.max_amount" type="number" min="0" style="width:150px;"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-select v-model="queryParams.pay_type" placeholder="支付方式" size="5" clearable>
                        <el-option :label="item" :value="index" v-for="(item,index) in selectOptions.pay_type" :key="index"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-select v-model="queryParams.order_source" placeholder="平台" size="5" clearable>
                        <el-option :label="item" :value="index" v-for="(item,index) in selectOptions.order_source" :key="index"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-select v-model="queryParams.order_status" placeholder="充值状态" size="5" clearable>
                        <el-option :label="item" :value="index" v-for="(item,index) in selectOptions.order_status" :key="index"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-select placeholder="渠道" v-model="formInline.third_party" size="15" clearable>
                        <el-option v-for="item in formInline.roomThirdPartyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-date-picker v-model="datetime" type="datetimerange" placeholder="选择时间范围" :picker-options="pickerOptions2"></el-date-picker>
                </el-form-item>
            </div>

        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="order_id" label="订单号" width="160" align="center"></el-table-column>
            <el-table-column label="用户" align="center" width="120">
                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>用户名：{{ scope.row.member_nickname }}</p>
                        <p>ID：{{ scope.row.member_id }}</p>
                        <p>手机： {{ scope.row.member_mobile }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag>{{ scope.row.member_nickname }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="sku_name" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="final_amount" label="订单金额" align="center" ></el-table-column>
            <el-table-column prop="diamond_number" label="充值钻石" align="center" ></el-table-column>
            <el-table-column prop="first_prize" label="首充钻石" align="center" ></el-table-column>
            <el-table-column prop="pmt_rule_diamond_number" label="促销钻石" align="center" ></el-table-column>
            <el-table-column prop="pay_time" label="充值时间" align="center"></el-table-column>
            <el-table-column label="平台" align="center" >
                <template scope="scope">{{optionsFormat('order_source',scope.row.order_source)}}</template>
            </el-table-column>
            <el-table-column label="充值状态" align="center" >
                <template scope="scope">{{optionsFormat('order_status',scope.row.order_status)}}</template>
            </el-table-column>
            <el-table-column label="渠道" align="center">
                <template slot-scope="scope">{{thirdPartyString(scope.row.appid)}}</template>
            </el-table-column>
            <el-table-column prop="trade_no" label="第三方支付单号" align="center" width="150"></el-table-column>
            <el-table-column label="支付方式" align="center" >
                <template scope="scope">
                    <el-tag type="info">{{optionsFormat('pay_type',scope.row.pay_type)}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" class="center" align="center" >
                <template scope="scope">
                    <el-button size="small" type="info" @click="roomAction('mark',scope.row)" :disabled="scope.row.order_status >= 5">标记退款</el-button>
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
                actionLoading: {
                },
                selectOptions: {
                    order_source: {1:'IOS',2:'安卓',3:'PC',4:'H5'},
                    pay_type: {1:'余额',2:'微信',3:'支付宝',4:'掌盟',5:'苹果',6:'微信H5'},
                    order_status: ['待支付','已支付','待发货','交易完成','申请退款','标记退款','退款中','已退款']
                },
                datetime:'',
                pickerOptions2: {
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
                queryParams: {
                    param_name: 'order_id',
                    keyword: '',
                    min_amount: '',
                    max_amount: '',
                    pay_type: '',
                    order_status: '',
                    order_source: '',
                    begin_time: '',
                    end_time: '',
	                appid:'',
                    page: 1,
                    limit: 15,
                },
	            formInline: {
		            third_party: '',
		            roomThirdPartyObject: {},
		            roomThirdPartyOptions: [],
	            },
                tableData: [],
                total: 0,
                loading: false
            }
        },
        watch: {
	        'formInline.third_party' (data) {
		        this.queryParams.appid = data
	        },
            datetime (data) {
                this.queryParams.begin_time = data[0] ? this.moment(data[0]).format('YYYY-MM-DD HH:mm:ss') : ''
                this.queryParams.end_time = data[0] ? this.moment(data[1]).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            queryParams: {
                handler (data,old) {
                    console.log(data.param_name,old.param_name)
                    this.requestList()
                },
                deep: true
            }
        },
        mounted () {
            this.requestList();
	        this.requestRoomThirdPartyList()
        },
        methods: {
	        thirdPartyString (ids) {
		        let list = ids.split(',')
		        let arr = []
		        for (let i in list) {
			        arr.push(this.formInline.roomThirdPartyObject[list[i]])
		        }
		        return arr.join()
	        },
	        requestRoomThirdPartyList () {
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
            requestList () {
                const _this = this
                _this.loading = true
                this.ajax('recharge_order_list.php','POST',this.tableQueryParams, function (response) {
                    if (response.data.code == 200) {
                        _this.tableData = response.data.data.list
                        _this.total = parseInt(response.data.data.count)
                    }
                    _this.loading = false
                })
            },
            roomAction (type,row) {
                const _this = this
                switch (type) {
                    case 'mark':
                        this.$confirm('确定要标记退款吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            _this.ajax('mark_refund.php', {order_id: row.order_id}, function (response) {
                                if (response.data.code == 200) {
                                    _this.$message({
                                        type: 'success',
                                        message: response.data.message
                                    });
                                    _this.requestList()
                                } else {
                                    _this.$message.error({
                                        message: response.data.message,
                                    });
                                }
                                _this.dialog.visible = false
                            });
                        })
                        break
                }
            },
            handleSizeChange (val) {
                this.queryParams.limit = val;
                this.requestList();
            },
            handleCurrentChange (val) {
                this.queryParams.page = val;
                this.requestList();
            },
            clearInputText () {
                console.log(event)
                this.queryParams.keyword = ''
            },
            keywordIcon (key) {
                return this.queryParams[key].length ? 'circle-close' : 'edit'
            },
            optionsFormat (type,key) {
                return this.selectOptions[type][key]
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
