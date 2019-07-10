<template>
    <div class="cms-advert-update">
        <el-form ref="cmsAdvertForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">

            <el-form-item
                    :label="'标题（'+items.name+')'"
                    v-for="(items,index) in form.LanguageListOptions"
                    :key="index"
                    v-show="formData.language_id.includes(items.value)"
            >
                <el-input v-if="!items.short_name" v-model="formData.title" class="large" placeholder="限制30字"></el-input>
                <el-input v-else-if="items.short_name == 'en'" v-model="formData.title_en" class="large" placeholder="限制30字"></el-input>
                <el-input v-else v-model="formData.title_tw" class="large" placeholder="限制30字"></el-input>
            </el-form-item>

            <el-form-item
                    :label="'金主（'+items.name+')'"
                    v-for="(items,index) in form.LanguageListOptions"
                    :key="index"
                    v-show="formData.language_id.includes(items.value)"
            >
                <el-input v-if="!items.short_name" v-model="formData.buyer" class="large" placeholder="限制30字"></el-input>
                <el-input v-else-if="items.short_name == 'en'" v-model="formData.buyer_en" class="large" placeholder="限制30字"></el-input>
                <el-input v-else v-model="formData.buyer_tw" class="large" placeholder="限制30字"></el-input>
            </el-form-item>

            <el-form-item label="游戏类型：" prop="gameID">
                <el-checkbox-group v-model="formData.gameID">
                    <el-checkbox-button v-for="item in form.gameIDOptions" :label="item.value" :key="item.value" :disabled="formData.action != 'create'">{{item.name}}</el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="发布渠道：" prop="appid_str">
                <el-checkbox-group v-model="formData.appid_str">
                    <el-checkbox-button v-for="item in form.appIDOptions" :label="item.value" :key="item.value" :disabled="formData.action != 'create'">{{item.name}}</el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="语言：" prop="language_id">
                <el-checkbox-group v-model="formData.language_id">
                    <el-checkbox-button v-for="item in form.LanguageListOptions" :label="item.value" :key="item.value">{{item.name}}</el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="是否投放Ios：">
                <el-radio-group v-model="formData.platform_ios" @change="urlAction('ios',formData.platform_ios)" :disabled="formData.action != 'create'">
                    <el-radio-button label="1">是</el-radio-button>
                    <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="是否投放安卓：">
                <el-radio-group v-model="formData.platform_android" @change="urlAction('android',formData.platform_android)" :disabled="formData.action != 'create'">
                    <el-radio-button label="1">是</el-radio-button>
                    <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="是否投放Web：">
                <el-radio-group v-model="formData.platform_web" @change="urlAction('web',formData.platform_web)" :disabled="formData.action != 'create'">
                    <el-radio-button label="1">是</el-radio-button>
                    <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="位置：" prop="channel_id">
                <el-select v-model="formData.channel_id" placeholder="请选择频道">
                    <el-option label="推荐" value="-1"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="第几条：" prop="position">
                <el-input v-model="formData.position" class="mini" type="number" min="1" placeholder="请输入顺序数字"></el-input>
            </el-form-item>

            <el-form-item label="图片模式：" prop="picture_model">
                <el-select v-model="formData.picture_model" placeholder="选择类型" class="full mini">
                    <el-option label="单图模式" value="0"></el-option>
                    <el-option label="三图模式" value="1"></el-option>
                    <el-option label="大图模式" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="封面图片：" prop="image_url">
                <el-upload
                    class="upload-demo"
                    :action="form.uploadUrl"
                    :data="form.uploadData"
                    :limit="formData.picture_model == 1 ? 3 : 1"
                    :on-exceed="handleExceed"
                    :file-list="form.uploadOptions"
                    :on-success="uploadFile"
                    list-type="picture"
                    name="image"
                    accept="image/*"
                >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                </el-upload>
            </el-form-item>

            <el-form-item label="跳转连接（Ios）：" v-show="ios_show == true" :required="formData.platform_ios == '1'">
                <el-input v-model="formData.famulei_url_ios" class="large"  placeholder="请输入Ios跳转连接" :disabled="formData.platform == '1'||formData.platform == '3'"></el-input>
            </el-form-item>

            <el-form-item label="跳转连接（安卓）：" v-show="android_show == true" :required="formData.platform_android == '1'">
                <el-input v-model="formData.famulei_url_android" class="large"  placeholder="请输入Android跳转连接" :disabled="formData.platform == '2'||formData.platform == '3'"></el-input>
            </el-form-item>

            <el-form-item label="跳转连接（Web）：" v-show="web_show == true" :required="formData.platform_web == '1'">
                <el-input v-model="formData.famulei_url_web" class="large"  placeholder="请输入Web跳转连接" :disabled="formData.platform == '1'||formData.platform == '2'"></el-input>
            </el-form-item>

            <el-form-item label="开始时间：" prop="start_time" required>
                <el-date-picker v-model="formData.start_time" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间"></el-date-picker>
            </el-form-item>

            <el-form-item label="结束时间：" prop="end_time" required>
                <el-date-picker v-model="formData.end_time" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间"></el-date-picker>
            </el-form-item>

            <el-form-item label="权重：" prop="weight_value" >
                <el-input v-model="formData.weight_value" class="mini" type="number" min="1" max="10" placeholder="请输入权重"></el-input>
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
                    uploading: false,
                    uploadPercentage: 0,
                    uploadUrl: '/services/upload_file/upload_image.php',
                    uploadData: {
                        member_id:1
                    },
                    uploadOptions:[],
                    image_url:[],
	                appIDOptions:[],
	                gameIDOptions:[],
	                LanguageListOptions:[]
                },
                formData: {
                    action: 'create',
                    title: '',
                    buyer:'',
                    gameID: [],
	                appid_str:[],
	                language_id:[],
                    channel_id: '-1',
                    position:'1',
                    picture_model:'0',
                    platform_ios:'1',
                    platform_android:'1',
                    platform_web:'1',
                    image_url: [],
                    famulei_url_ios:'',
                    famulei_url_android:'',
                    famulei_url_web:'',
                    start_time: '',
                    end_time:'',
                    weight_value:'1'
                },
                formRules:  {
                    title: [{required: true, message: '名称不能为空'}, {max: 30, message: '名称不能超过30个字'}],
                    buyer: [{required: true, message: '金主不能为空'}],
//                    gameID: [{required: true, message: '至少选1个'}],
//                    image_url: [{required: true, message: '必须上传图片'}]
                },
                loading: false,
                ios_show: true,
                android_show: true,
                web_show: true
            }
        },
        mounted () {
	        this.languageList();
	        this.requestGameList();
	        this.requestThirdPartyList();
            if (this.$route.name === 'cms-advert-update') {
                this.requestData({id: this.$route.params.id})
            }else{
	            this.formData.language_id = ['1'];//create默认选中“中文简体”
            }

        },
        watch: {
	        'formData.start_time' (val) {
		        if (val) {
			        this.formData.start_time = this.moment(val).format('YYYY-MM-DD HH:mm:ss')
		        }
	        },
	        'formData.end_time' (val) {
		        if (val) {
			        this.formData.end_time = this.moment(val).format('YYYY-MM-DD HH:mm:ss')
		        }
	        },
        },
        methods: {
            uploadFileBefore () {
                this.form.uploading = true
            },
            uploadFile (response, file, fileList) {
                let _this = this
                if (response.code == 200) {
                    _this.$message({
                        message: response.message,
                        type: 'success'
                    });
                    fileList.splice(fileList.length-1,fileList.length,{url:response.data[0].half_path});

                    _this.form.uploadOptions = fileList;
                    console.log(_this.form.uploadOptions);
                } else {
                    _this.$message.error({
                        message: response.message,
                    });
                }
                this.form.uploading = false
            },
            uploadProcess (event, file, fileList) {
                this.form.uploadPercentage = parseInt(event.percent)
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`单图和大图模式限制上传1张，三图模式3张。本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            // requestGameList () {
		     //    this.ajax('member/get_game_list.php', {page: 1, limit: 100}, (response) => {
			 //        if (response.data.code == 200) {
				//         this.appid_str = response.data.data.list
			 //        } else {
				//         this.$message.error({
				// 	        message: response.data.message,
				//         })
			 //        }
		     //    })
            // },
	        requestGameList () {
		        const _this = this;
		        _this.loading = true;
		        this.ajax('match/get_game_list.php', {page: 1, limit: 100}, (response) => {
			        if (response.data.code == 200) {
				        // this.game_list = response.data.data.list;
				        let list = response.data.data.list;
				        for (let i in list) {
					        _this.form.gameIDOptions.push({
						        name: list[i].text,
						        value: list[i].value,
					        });
				        }
			        } else {
				        this.$message.error({
					        message: response.data.message,
				        })
			        }
			        _this.loading = false
		        })
	        },
	        requestThirdPartyList () {
		        const _this = this;
		        _this.loading = true;
		        this.ajax('member/third_party_list.php', {page: 1, limit: 100}, (response) => {
			        if (response.data.code == 200) {
				        // this.appid_str = response.data.data.list

				        let list = response.data.data.list;
				        for (let i in list) {
					        _this.form.appIDOptions.push({
						        name: list[i].name,
						        value: list[i].id,
					        });
				        }
			        } else {
				        this.$message.error({
					        message: response.data.message,
				        })
			        }
			        _this.loading = false
		        })
	        },
	        languageList () {
		        const _this = this;
		        _this.loading = true;
		        this.ajax('system/language_list.php', function (response) {
			        if (response.data.code == 200) {
				        let list = response.data.data;
				        for (let i in list) {
					        _this.form.LanguageListOptions.push({
						        name: list[i].display,
						        value: list[i].id,
						        short_name: list[i].short_name,
					        });
					        if (_this.$route.name === 'gift-cate-create') {
						        if (list[i].short_name) {
							        let title = 'title_' + list[i].short_name;
							        eval("_this.formData." + title + "=''");//循环添加name键值
							        let buyer = 'buyer_' + list[i].short_name;
							        eval("_this.formData." + buyer + "=''");//循环添加name键值
						        }
					        }
				        }
			        }
			        _this.loading = false
		        })
	        },
            requestData (params) {
                const _this = this;
                this.ajax('advert_info/edit_advert_info.php', params, function (response) {
                    if (response.data.code == 200) {
                        _this.formData = response.data.data;
                        _this.form.uploadOptions = response.data.data.image_url;
                        _this.formData.action = 'edit';
	                    _this.formData.gameID = _this.formData.gameID.split(',');
	                    _this.formData.appid_str = _this.formData.appid;
	                    _this.formData.language_id = _this.formData.language_id.split(',');
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
            requestUpdate () {
                let _this = this;
                this.form.loading = true;

                if (_this.$route.name === 'cms-advert-update') {
                    _this.action_url = 'advert_info/edit_advert_info.php';
                    _this.formData.action = 'edit';
                }else{
                    _this.action_url = 'advert_info/create_advert_info.php';
	                _this.formData.gameID = _this.formData.gameID.join();
	                _this.formData.appid_str = _this.formData.appid_str.join();
                }
	            _this.formData.language_id = _this.formData.language_id.join();
                _this.form.image_url = [];
                for (var i=0;i<_this.form.uploadOptions.length;i++)
                {
                    _this.form.image_url.push(_this.form.uploadOptions[i].url)
                }
                _this.formData.image_url = _this.form.image_url.join();
	            console.log(_this.formData);
                this.ajax(this.action_url, _this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/cms-advert'})
                    } else {
	                    if (_this.$route.name === 'cms-advert-update') {

	                    }else{
		                    _this.formData.gameID = _this.formData.gameID.split(',');
		                    _this.formData.appid_str = _this.formData.appid_str.split(',');
                        }
	                    _this.formData.language_id = _this.formData.language_id.split(',');

                        _this.$message.error({
                            message: response.data.message,
                        });
//                        _this.form.image_url = [];
//                        _this.formData.image_url = [];
                    }
                    _this.form.loading = false
                })
            },
            urlAction (type,row) {
                const _this = this
                switch (type) {
                    case 'ios':
                        if(row == 0){
                            _this.ios_show = false;
                        }else if(row == 1){
                            _this.ios_show = true;
                        }
                        break;
                    case 'android':
                        if(row == 0){
                            _this.android_show = false;
                        }else if(row == 1){
                            _this.android_show = true;
                        }
                        break;
                    case 'web':
                        if(row == 0){
                            _this.web_show = false;
                        }else if(row == 1){
                            _this.web_show = true;
                        }
                        break;
                }
            },
            submit () {
                this.$refs['cmsAdvertForm'].validate((valid) => {
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
    .el-checkbox-button.is-checked .el-checkbox-button__inner{
        /*color: #20a0ff !important;*/
    }
</style>
