<template>
    <div class="gift-cate-update">
        <el-form ref="giftForm" :model="formData" label-position="right" label-width="160px" :rules="formRules">

            <el-form-item
                    :label="'礼物名称（'+items.name+')'"
                    v-for="(items,index) in form.LanguageListOptions"
                    :key="index"
                    v-show="formData.language_id.includes(items.value)"
            >
                <el-input v-if="!items.short_name" v-model="formData.name" class="large" placeholder=""></el-input>
                <el-input v-else-if="items.short_name == 'en'" v-model="formData.name_en" class="large" placeholder=""></el-input>
                <el-input v-else v-model="formData.name_tw" class="large" placeholder=""></el-input>
            </el-form-item>


            <el-form-item label="战队ID：" prop="team_id" >
                <el-input v-model="formData.team_id" class="large" placeholder=""></el-input>
            </el-form-item>

            <!--<el-form-item label="语言：" prop="language_id">-->
                <!--<el-select v-model="formData.language_id" placeholder="选择语言" multiple class="full mini">-->
                    <!--<el-option :label="item.name" :value="item.value" v-for="(item,index) in form.LanguageListOptions" :key="index"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->

            <el-form-item label="语言：" prop="language_id">
                <el-checkbox-group v-model="formData.language_id">
                    <el-checkbox-button v-for="item in form.LanguageListOptions" :label="item.value" :key="item.value">{{item.name}}</el-checkbox-button>
                </el-checkbox-group>
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
                    loading: false,
	                LanguageListOptions:[]
                },
                formData: {
                    act: 'view',
                    name: '',
	                name_en: '',
	                name_tw: '',
                    team_id:'',
	                language_id:[],
                },
                formRules:  {
                    // name: [{required: true, message: '名称不能为空'}],
                },
                loading: false,
            }
        },
        mounted () {
	        this.languageList();
            if (this.$route.name === 'gift-cate-update') {
                this.requestData({id: this.$route.params.id,act:'view'})
            }else{
	            this.formData.language_id = ['1'];//create默认选中“中文简体”
            }
        },
        methods: {
            requestData (params) {
                const _this = this;
                this.ajax('match/gift_cate_op.php', params, function (response) {
                    if (response.data.code == 200) {
                        _this.formData = response.data.data;
                        _this.formData.act = 'edit';
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
	        languageList () {
		        const _this = this;
		        _this.loading = true;
		        this.ajax('system/language_list.php', function (response) {
			        if (response.data.code == 200) {
				        // _this.form.LanguageListOptions = response.data.data

				        let list = response.data.data;
				        for (let i in list) {
					        _this.form.LanguageListOptions.push({
						        name: list[i].display,
						        value: list[i].id,
						        short_name: list[i].short_name,
					        });
					        if (_this.$route.name === 'gift-cate-create') {
						        if (list[i].short_name) {
							        let name = 'name_' + list[i].short_name;
							        eval("_this.formData." + name + "=''");//循环添加name键值
						        }
					        }
				        }
				        console.log(_this.formData);

			        }
			        _this.loading = false
		        })
	        },
            requestUpdate () {
            	console.log(this.formData);
                let _this = this
                this.form.loading = true;

                if (_this.$route.name === 'gift-cate-update') {
                    _this.formData.act = 'edit';
                }else{
                    _this.formData.act = 'add';
                }
	            this.formData.language_id = this.formData.language_id.join();
                this.ajax('match/gift_cate_op.php', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/gift-cate'})
                    } else {
	                    _this.formData.language_id = _this.formData.language_id.split(',');
                        _this.$message.error({
                            message: response.data.message,
                        });
                    }
                    _this.form.loading = false
                })
            },
            submit () {
                this.$refs['giftForm'].validate((valid) => {
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
