<template>
    <div class="red-bag-list">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-select placeholder="请选择" v-model="queryParams.where_type" size="5" clearable>
                    <el-option v-for="item in formInline.whereTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="搜索相关数据" v-model="queryParams.where_content" @keydown.enter="request"></el-input>
            </el-form-item>

            <el-form-item>
                <el-select placeholder="红包类型" v-model="queryParams.red_type" size="5" clearable>
                    <el-option v-for="item in formInline.redTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select placeholder="状态" v-model="queryParams.status" size="5" clearable>
                    <el-option v-for="item in formInline.statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select placeholder="设备" v-model="queryParams.platform" size="3" clearable>
                    <el-option v-for="item in formInline.platformOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select placeholder="货币" v-model="queryParams.currency_type" size="3" clearable>
                    <el-option v-for="item in formInline.currency_typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item  style="float:right;margin-right: 0">
                <router-link to="/red-bag/create">
                    <el-button type="default" icon="plus">创建红包</el-button>
                </router-link>
            </el-form-item>

        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="id" label="红包ID" align="center"></el-table-column>
            <el-table-column prop="ssdb_key" label="红包ssdb_key" align="center"></el-table-column>
            <el-table-column label="发布人" align="center">
                <template scope="scope">
                    <el-tooltip placement="top" effect="light">
                        <div slot="content">ID:{{scope.row.member_id}}<br/>手机{{scope.row.mobile}}</div>
                        <el-button type="info">{{scope.row.nickname}}</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column prop="diamond" label="金额" align="center"></el-table-column>
            <el-table-column prop="" label="货币" align="center">
                <template scope="scope">
                    {{scope.row.currency_type == '1' ? '钻石' : '果子'}}
                </template>
            </el-table-column>
            <el-table-column prop="number" label="红包数量" align="center"></el-table-column>
            <el-table-column label="类型" align="center">
                <template scope="scope">
                    <el-tooltip placement="top" effect="light" :disabled="scope.row.type != '3'">
                        <div slot="content">口令:{{scope.row.display_password == '0' ? scope.row.password : '******'}}</div>
                        <el-button type="info">{{scope.row.red_type}}</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="add_time" label="发布时间" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="this.statusFormatter" align="center"></el-table-column>
            <el-table-column prop="platform" label="设备" :formatter="this.platformFormatter" align="center"></el-table-column>
            <el-table-column label="操作" class="center" align="center">
                <template scope="scope">
                    <router-link :to="{ path:'/red-bag/' + scope.row.ssdb_key }" tag="el-button" class="el-button--small el-button--primary">修改</router-link>
                    <router-link :to="{ path:'/red-bag/info/' + scope.row.ssdb_key }" tag="el-button" class="el-button--small el-button--primary">查看</router-link>
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
                    rec: {}
                },
                queryParams: {
                    where_type: '',
                    where_content: '',
                    red_type: '',
                    status: '',
                    platform: '',
                    currency_type: '',
                    page: 1,
                    limit: 15,

                },
                formInline: {
                    whereTypeOptions: [
                        {
                            value: '1',
                            label: '订单号'
                        },
                        {
                            value: '2',
                            label: '手机号'
                        },
                        {
                            value: '3',
                            label: '用户名'
                        },
                        {
                            value: '4',
                            label: '用户ID'
                        }
                    ],
                    redTypeOptions: [
                        {
                            value: '1',
                            label: '拼手气红包'
                        },
                        {
                            value: '2',
                            label: '普通红包'
                        },
                        {
                            value: '3',
                            label: '口令红包'
                        }
                    ],
                    statusOptions: [
                        {
                            value: '0',
                            label: '可以领取'
                        },
                        {
                            value: '1',
                            label: '领取结束'
                        },
                        {
                            value: '2',
                            label: '红包过期'
                        }
                    ],
                    platformOptions: [
                        {
                            value: '1',
                            label: 'android'
                        },
                        {
                            value: '2',
                            label: 'ios'
                        },
                        {
                            value: '3',
                            label: 'admin'
                        }
                    ],
                    currency_typeOptions: [
                        {
                            value: '1',
                            label: '钻石'
                        },
                        {
                            value: '2',
                            label: '果子'
                        },

                    ]
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

	            this.ajax('welfare/red_bag_list.php', this.tableQueryParams, ((response) => {
		            this.loading = false
		            this.total = parseInt(response.data.data.count)
		            this.tableData = response.data.data.list
	            }));
            },
            statusFormatter (row) {
                return this.optionsForObject(this.formInline.statusOptions)[row.status]
            },
            platformFormatter (row) {
                return this.optionsForObject(this.formInline.platformOptions)[row.platform]
            },
            currency_typeOptions (row) {
                return this.optionsForObject(this.formInline.currency_typeOptions)[row.currency_type]
            },
            optionsForObject (arr) {
                let obj = {};
                for (let i = 0; i < arr.length; i++) {
                    obj[arr[i].value] = arr[i].label
                }
                return obj;
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
