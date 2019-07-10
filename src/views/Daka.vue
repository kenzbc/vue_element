<template>
    <div class="daka-list">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input placeholder="选手卡SKU" v-model="queryParams.sku" @keydown.enter="request"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select placeholder="选手卡类型" v-model="queryParams.card_type" size="8">
                    <el-option label="全部" value=""></el-option>
                    <!--<el-option v-for="item in formInline.roomStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
                    <el-option v-for="item in formInline.card_type_options" :key="item.value" :label="item.label" :value="item.value">
                        {{item.label}}
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe  v-loading="loading">
            <el-table-column prop="id" label="id" align="center" width="100"></el-table-column>
            <el-table-column prop="sku" label="选手卡SKU" align="center" width=""></el-table-column>
            <el-table-column prop="cate_name" label="选手卡类型" align="center" width=""></el-table-column>
            <el-table-column prop="daka_name" label="卡片名称" align="center"></el-table-column>
            <el-table-column prop="pic_url" label="卡面" align="center" width="250">
                <template scope="scope">
                    <img class="" :src="scope.row.pic_url" style="max-width: 200px;" />
                </template>
            </el-table-column>
            <el-table-column prop="pic_bg_url" label="卡背" align="center" width="250">
                <template scope="scope">
                    <img class="" :src="scope.row.pic_bg_url" style="max-width: 200px;" />
                </template>
            </el-table-column>

            <el-table-column label="操作" class="center" align="center" width="240">
                <template scope="scope">
                    <router-link :to="{ path:'/daka/' + scope.row.id }" tag="el-button" class="el-button--small el-button--primary">修改</router-link>
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
                    page: 1,
                    limit: 15,
                },
	            formInline: {
		            card_type_options: []
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
	        this.requestCateList();
        },
        methods: {
            isEmptyObject(e) {
                for (let t in e) return false;
                return true
            },
            requestList (data) {
                const _this = this
                _this.loading = true
                this.ajax('match/daka_list.php', this.tableQueryParams, function (response) {
                    _this.loading = false
                    _this.total = parseInt(response.data.data.count)
                    _this.tableData = response.data.data.list

                });
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
                            _this.ajax('match/daka_op.php', {id: row.id,act:'del'}, function (response) {
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
	        requestCateList () {
		        const _this = this;
		        this.ajax('match/daka_type_list.php', function (response) {
			        if (response.data.code == 200) {
				        for (let i in response.data.data.list) {
					        _this.formInline.card_type_options.push({
						        label: response.data.data.list[i].name,
						        value: response.data.data.list[i].id
					        })
				        }
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
