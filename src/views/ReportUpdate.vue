<template>
    <div class="report-list-update">
        <el-form ref="reportUpdateForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">

            <el-row type="flex" class="row-bg">
                <el-col :span="6">
                    <el-form-item label="被举报人：" prop="">
                        <el-input v-model="formData.be_report_member_name" class="mini" :disabled="formData.act !== 'create'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="被举报人id：" prop="">
                        <el-input v-model="formData.broadcast_id" class="mini" :disabled="formData.act !== 'create'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" class="row-bg">
                <el-col :span="6">
                    <el-form-item label="举报类型：" prop="">
                        <el-select v-model="formData.report_type" placeholder="举报类型" class="full mini" :disabled="formData.act !== 'create'">
                            <el-option :label="item.label" :value="item.value" v-for="(item,index) in form.reportTypeOptions" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="类型id：" prop="">
                        <el-input v-model="formData.object_id" class="mini" :disabled="formData.act !== 'create'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="举报内容：" prop="">
                <el-input v-model="formData.content" class="large" :disabled="formData.act !== 'create'"></el-input>
            </el-form-item>

            <el-form-item label="处理结果：" prop="process_result">
                <el-select v-model="formData.process_result" placeholder="选择处理结果" class="full mini" v-if="formData.report_type !== '3'">
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) in form.processResultOptions" :key="index"></el-option>
                </el-select>
                <el-select v-model="formData.process_result" placeholder="选择处理结果" class="full mini" v-else>
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) in form.processResultOptions2" :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="有效期：" prop="ban_time" v-show="formData.process_result == 3">
                <el-input v-model="formData.ban_time" class="mini" type="number" min="1" placeholder="单位为小时"></el-input>
                <span class="tip">单位为“小时”,0为永久</span>
            </el-form-item>

            <el-form-item label="处理理由(cn)：" prop="process_desc">
                <el-input v-model="formData.process_desc" class="large" placeholder="限30个字，填写后用户将收到你的处理理由"></el-input>
            </el-form-item>
            <el-form-item label="处理理由(en)：" prop="process_desc_en">
                <el-input v-model="formData.process_desc_en" class="large" placeholder="限90个字，填写后用户将收到你的处理理由"></el-input>
            </el-form-item>
            <el-form-item label="处理理由(tw)：" prop="process_desc_tw">
                <el-input v-model="formData.process_desc_tw" class="large" placeholder="限30个字，填写后用户将收到你的处理理由"></el-input>
            </el-form-item>

            <!--<el-form-item label="多语言：" prop="language_id" required>-->
                <!--<el-select v-model="formData.language_id" placeholder="多语言" class="full mini">-->
                    <!--<el-option :label="item.display" :value="item.id" v-for="(item,index) in form.languageIdOptions" :key="index"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->

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
					reportTypeOptions:[
						{
							value: '1',
							label: '贴子'
						},
						{
							value: '2',
							label: '回复'
						},
						{
							value :'3',
							label: '私信'
						},
                    ],
					processResultOptions: [
						{
							value: '0',
							label: '未操作'
						},
						{
							value: '1',
							label: '驳回/不处理'
						},
						{
							value: '2',
							label: '仅删除'
						},
						{
							value: '3',
							label: '删除并禁言'
						},
						{
							value: '4',
							label: '删除并封号'
						},
					],
					processResultOptions2:[
						{
							value: '0',
							label: '未操作'
						},
						{
							value: '1',
							label: '驳回/不处理'
						},
						{
							value: '5',
							label: '封号'
						},
                    ],
					reportReasonOptions: [
						{
							value: '0',
							label: '未选'
						},
						{
							value: '1',
							label: '不友善行为'
						},
						{
							value: '2',
							label: '垃圾或有害信息'
						},
						{
							value :'3',
							label: '涉嫌侵权'
						},
						{
							value :'4',
							label: '不实信息'
						},
						{
							value :'5',
							label: '其他'
						}
					],
					// languageIdOptions:{}
				},
				formData: {
					act: 'view',
                    id:'',
					process_result: '',
					ban_time:'',
					report_reason:'',
					process_desc:'',
					process_desc_en:'',
					process_desc_tw:''
                    // language_id:'1'
				},
				formRules:  {
					process_result: [{required: true, message: '处理结果不能为空'}],
					report_reason: [{required: true, message: '举报理由不能为空'}],
					// process_desc: [{max: 30, message: '不能超过30个字'}],
					// language_id: [{required: true, message: '多语言不能为空'}],
				},
				loading: false,
			}
		},
		mounted () {
			// this.languageIdList();
            this.requestData({id: this.$route.params.id,group: this.$route.query.group,act:'view'})//
		},
		watch: {

		},
		methods: {
			// languageIdList(){
			// 	const _this = this;
			// 	_this.loading = true;
			// 	this.ajax('system/language_list.php', function (response) {
			// 		if (response.data.code == 200) {
			// 			_this.form.languageIdOptions = response.data.data
			// 		}
			// 		_this.loading = false
			// 	})
			// },
			requestData (params) {
				const _this = this;
				this.ajax('system/report_op.php', params, function (response) {
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
			requestUpdate () {
				let _this = this;
				if(this.formData.process_result == '0'){
					_this.$message.error({
						message: '处理结果不能选未操作'
					});
					return false
                }
				_this.formData.act = 'edit';
				this.form.loading = true;
				this.ajax('system/report_op.php', this.formData , (response) => {
					if (response.data.code == 200) {
						this.$message({
							message: response.data.message,
							type: 'success'
						});
						this.$router.go(-1)
						// this.$router.push({path: '/report-list'})
					} else {
						this.$message.error({
							message: response.data.message,
						});
					}
					_this.form.loading = false
				})
			},
			submit () {
				this.$refs['reportUpdateForm'].validate((valid) => {
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
