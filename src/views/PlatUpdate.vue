<template>
    <div class="faq-create">
        <el-form ref="bannerForm" :model="formData" label-position="right" label-width="120px" :rules="formRules">
            <el-form-item label="板块名称：" prop="name" required>
                <el-input v-model="formData.name" class="mini" placeholder="请输入板块名称"></el-input>
                <span class="tip">最多可输入5个字</span>
            </el-form-item>
            <el-form-item label="板块描述：" prop="demo">
                <el-input v-model="formData.demo" class="mini" placeholder="请输入板块描述"></el-input>
                <span class="tip">描述最多可输入10个字</span>
            </el-form-item>

            <el-form-item label="文本颜色：" prop="text_color">
                <el-switch
                        v-model="formData.text_color"
                        width="80"
                        on-text="白色"
                        off-text="设计色"
                        on-color="#13ce66"
                        off-color="#ff4949"
                        on-value="1"
                        off-value="0">
                </el-switch>
                <span class="tip">默认文本颜色为设计默认色</span>
            </el-form-item>

            <el-form-item label="板块封面：" prop="cover_url">
                <el-input type="text" v-model="formData.cover_url" class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" :on-success="uploadFile" accept="image/*" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append">
                        <el-button type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <span class="tip">支持JPG,PNG</span>
                <img v-if="formData.cover_url" class="preview-image" :src="formData.cover_url"/>
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>

            <!--<el-form-item label="门票："  prop="ticket_low" required>-->
                <!--<el-col :span="2">-->
                    <!--<el-input v-model="formData.ticket_low" type="number" min="0" placeholder="" style="width: 100%;" ></el-input>-->
                <!--</el-col>-->
                <!--<el-col class="line" :span="1" align="center">-</el-col>-->
                <!--<el-col :span="2">-->
                    <!--<el-input v-model="formData.ticket_high" type="number" min="0" placeholder="" style="width: 100%;"></el-input>-->
                <!--</el-col>-->
            <!--</el-form-item>-->
            <el-form-item label="最低门票："  prop="ticket_low" required>
                <el-col :span="2">
                <el-input v-model="formData.ticket_low" type="number" min="0" placeholder="" ></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="最高门票："  prop="ticket_high" required>
                <el-col :span="2">
                    <el-input v-model="formData.ticket_high" type="number" min="0" placeholder="" ></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="房间类型：" prop="room_type" required>
                <el-checkbox-group v-model="formData.room_type">
                    <el-checkbox-button v-for="item in form.roomTypeOptions" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="包含赛事：" prop="tournament_id_string" required>
                <el-select v-model="formData.tournament_id_string" multiple filterable placeholder="请选择" class="tournament">
                    <el-option v-for="item in form.tournamentSelectOptions" :key="item.value" :label="item.label" :value="item.value">
                        <img :src="item.icon"/>{{item.label}}
                    </el-option>
                </el-select>
                <span class="tip">多选</span>
            </el-form-item>
            <el-form-item label="自动隐藏：">
                <el-radio-group v-model="formData.is_hidden">
                    <el-radio-button label="0">是</el-radio-button>
                    <el-radio-button label="1">否</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="权重：" prop="sorting" >
                <el-input v-model="formData.sorting" type="number" min="0" class="mini" placeholder="设置权重值"></el-input>
                <span class="tip">数值越大权重越高</span>
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
//                checkedCities1: ['1', '2'],
                form: {
                    loading: false,
                    uploading: false,
                    uploadPercentage: 0,
                    uploadUrl: this.HOST + 'upload_image.php',
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
                    tournamentSelect:[],
                    tournamentSelectOptions: []
                },
                formData: {
                    id:'',
                    name:'',
                    demo: '',
                    text_color:'0',
                    cover_url:'',
                    ticket_low:'0',
                    ticket_high:'0',
                    room_type:[],
                    tournament_id_string:[],
                    is_hidden: 1,
                    sorting:'',
                    action:''
                },
                formRules: {
                    name: [{required: true, message: '名称不能为空'}, {max: 5, message: '不能超过5个字'}],
                    demo: [ {max: 10, message: '不能超过10个字'}],
                    ticket_low: [{required: true, message: '最低门票数不能为空'}],
                    ticket_high: [{required: true, message: '最高门票数不能为空'}],
                    room_type: [{required: true, message: '至少选1个'}],
                    tournament_id_string: [{required: true, message: '至少选1个'}]
                }

            }
        },
        watch:{
            'form.tournamentSelect' (data) {
//                this.form.selectMatchListDate = [];
                this.formData.tournament_id_string = data;
            }
        },
        mounted () {
            if (this.$route.name === 'plat-update') {
//                this.formData.action = 'update'
                this.requestData({id: this.$route.params.id});
                this.requestTournamentList();
            }else{
                this.requestTournamentList();
            }
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
                    _this.formData.cover_url = response.data.image_url
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
            requestData (params) {
                const _this = this;
                this.ajax('edit_plat.php', params, function (response) {
                    if (response.data.code == 200) {
                        let data = response.data.data
                        for (let key in _this.formData) {
                            if (data[key]) _this.formData[key] = data[key]
                        }
                        _this.formData.sku_id = data.sku_id
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
                let _api = this.$route.name === 'plat-create' ? 'create_plat.php' : 'edit_plat.php'
                this.formData.id = this.$route.params.id;
                this.formData.room_type = this.formData.room_type.join();
                this.formData.tournament_id_string = this.formData.tournament_id_string.join();

                this.formData.action = this.$route.name === 'plat-create' ? '' : 'edit'
                this.ajax(_api, 'post', this.formData, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        _this.$router.push({path: '/plat'})
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        });
                    }
                    _this.form.loading = false
                })
            },
            requestTournamentList () {
                const _this = this;
                this.ajax('get_tournament_list.php', function (response) {
                    if (response.data.code == 200) {
                        for (let i in response.data.data.list) {
                            _this.form.tournamentSelectOptions.push({
                                icon: response.data.data.list[i].image,
                                label: response.data.data.list[i].short_name,
                                value: response.data.data.list[i].tournamentID
                            })
                        }
                    }
                })
            },
            selectTournament () {
                let tournamentObj = {}
                for (let i in this.form.tournamentSelectOptions) {
                    tournamentObj[this.form.tournamentSelectOptions[i].value] = this.form.tournamentSelectOptions[i]
                }
                let selectTournament = []
                for (let i in this.form.tournamentSelect) {
                    selectTournament.push(tournamentObj[this.form.tournamentSelect[i]])
                }
                return selectTournament
            },
            submit () {
                this.$refs['bannerForm'].validate((valid) => {
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
