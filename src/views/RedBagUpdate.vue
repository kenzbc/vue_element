<template>
    <div class="red-bag-update">
        <el-form ref="redBagForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">

            <el-form-item label="红包货币：" prop="type">
                <el-select v-model="formData.currency_type" placeholder="请选择类型" :disabled="formData.action != 'create'">
                    <el-option label="钻石" value="1"></el-option>
                    <el-option label="果子" value="2"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布人：" prop="member_id">
                <el-select
                        v-model="formData.member_id"
                        filterable
                        remote
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading"
                        :disabled="formData.action != 'create'">
                    <el-option
                            v-for="item in search_star"
                            :change="memberDiamond"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                    </el-option>
                </el-select>
                <span class="tip" v-if="formData.action == 'create'">余额：{{formData.currency_type == '1' ? diamond_num : guozi_num}}</span>
            </el-form-item>

            <el-form-item :label="formData.type == '2' ? '单个金额：' : '总金额：'" prop="diamond">
                <el-input v-model="formData.diamond" class="mini" type="number" min="0"  placeholder="必须整数" :disabled="formData.action != 'create'"></el-input>
            </el-form-item>

            <el-form-item label="红包类型：" prop="type">
                <el-select v-model="formData.type" placeholder="请选择类型" :disabled="formData.action != 'create'">
                    <el-option label="拼手气红包" value="1"></el-option>
                    <el-option label="普通红包" value="2"></el-option>
                    <el-option label="口令红包" value="3"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="红包个数：" prop="number">
                <el-input v-model="formData.number" class="mini" type="number" min="0" placeholder="必须整数" :disabled="formData.action != 'create'"></el-input>
            </el-form-item>

            <el-form-item label="口令：" prop="password">
                <el-input v-model="formData.password" class="mini" placeholder="仅限10个字" :disabled="formData.type != '3'"></el-input>
            </el-form-item>

            <el-form-item label="是否隐藏口令：" prop="display_password">
                <el-switch
                        v-model="formData.display_password"
                        active-text="隐藏"
                        inactive-text="显示"
                        active-value="true"
                        inactive-value="false"
                        :disabled="formData.action != 'create' || formData.type != '3'">
                </el-switch>

            </el-form-item>

            <el-form-item label="描述：" prop="desc">
                <el-input v-model="formData.desc" class="large" placeholder="仅限20个字"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit" :disabled="form.loading || form.uploading" :loading="form.loading">提交</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    export default {
        data () {
            return {
                form: {
                    loading: false
                },
                formData: {
                    action: 'create',
	                currency_type:'2',
                    member_id: '',
                    diamond: '',
                    type: '1',
                    number: '',
                    password:'',
                    desc: '',
                    display_password:'0',
                    return_data_desc:'0'
                },
                formRules:  {
                    member_id: [{required: true, message: '请选择一个用户'}],
                    diamond: [{required: true, message: '不能为空'}],
                    type: [{required: true, message: '类型不能为空'}],
                    number: [{required: true, message: '红包数量不能为空'}],
                },
                action_url:'',
                action_form:'',
                search_form:'',
                search_star: [],
                list: [],
	            diamond_num:'0',
	            guozi_num:'0',
                loading: false
            }
        },
        mounted () {
            if (this.$route.name === 'red-bag-update') {
                this.requestData({order_id: this.$route.params.id})
            }
//            this.list = this.search_star.map(item => {
//                return { value: item, label: item };
//            });
        },
        watch: {
            'formData.member_id' (data) {
                this.money_num = '0';
                this.memberDiamond(data);
            }
        },
        methods: {
            requestData (params) {
                const _this = this;
                this.ajax('welfare/edit_red_bag.php', params, function (response) {
                    if (response.data.code == 200) {
                        _this.formData = response.data.data;
                        _this.formData.action = 'edit';
                        if (_this.$route.name === 'red-bag-update') {
                            _this.formData.member_id = response.data.data.member_nickname
                        }
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
            requestUpdate () {
                let _this = this
                this.form.loading = true
                if (_this.$route.name === 'red-bag-update') {
                    _this.action_url = 'welfare/edit_red_bag.php';
                    _this.action_form = this.formData;
                    _this.action_form = {
                        order_id: _this.$route.params.id,
                        action: 'edit',
                        password: _this.formData.password,
                        desc: _this.formData.desc
                    }
                }else{
                    _this.action_url = 'welfare/create_red_bag.php';
                    _this.action_form = this.formData;
                }
                this.ajax(this.action_url, this.action_form, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/red-bag'})
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        });
                    }
                    _this.form.loading = false
                })
            },
            remoteMethod(query) {
                const _this = this;
                this.search_form = {
                    action: 'member',
                    query: query
                };
                this.ajax('_search',this.search_form, function (response) {
                    _this.search_star = response.data.list;
                })

            },
            memberDiamond(member_id){
                const _this = this;
                this.ajax('member/get_member.php',{member_id: member_id}, function (response) {
                    _this.diamond_num = response.data.data.diamond
	                _this.guozi_num = response.data.data.guozi1
                })
            },
            submit () {
                this.$refs['redBagForm'].validate((valid) => {
                    if (valid) {
                        this.requestUpdate()
                    } else {
                        return false;
                    }
                });
            },

        }
    }
</script>

<style>
</style>
