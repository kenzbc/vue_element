<template>
    <div class="royal-war-card-update">
        <el-form ref="royalWarCardForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">

            <el-form-item label="名称：" prop="name" >
                <el-input v-model="formData.name" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="英文：" prop="en_name" >
                <el-input v-model="formData.en_name" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="繁体：" prop="complex_name" >
                <el-input v-model="formData.complex_name" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="封面：" prop="image_url">
                <el-input type="text" v-model="formData.image_url" readonly class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" accept="image/*" :on-success="uploadFile" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append" >
                        <el-button  type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <img v-if="formData.image_url" class="preview-image" :src="formData.image_url" />
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>
            <el-form-item label="外部绑定ID：" prop="bindID_1" >
                <el-input v-model="formData.bindID_1" class="large" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="类型：" prop="type" >
                <el-select v-model="formData.type" placeholder="请选择类型">
                    <el-option label="兵种" value="1"></el-option>
                    <el-option label="建筑" value="2"></el-option>
                    <el-option label="法术" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="级别：" prop="level" >
                <el-select v-model="formData.level" placeholder="请选择级别">
                    <el-option label="普通卡" value="1"></el-option>
                    <el-option label="稀有卡" value="2"></el-option>
                    <el-option label="史诗卡" value="3"></el-option>
                    <el-option label="传奇卡" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="圣水数：" prop="holy_water" >
                <el-input v-model="formData.holy_water" class="mini" type="number" min="0" max="10" placeholder="请输入圣水数"></el-input>
                <span class="tip">可选范围0-10</span>
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
					uploadUrl: this.HOST + 'upload_image.php',
				},
				formData: {
					act: 'view',
					name:'',
					en_name: '',
					complex_name:'',
					image_url:'',
					bindID_1:'',
					type:'',
					level:'',
					holy_water:'1',
				},
				formRules:  {
					name: [{required: true, message: '名称不能为空'}],
					image_url: [{required: true, message: '封面不能为空'}],
					type: [{required: true, message: '类型不能为空'}],
					level: [{required: true, message: '级别不能为空'}],
					holy_water: [{required: true, message: '圣水数不能为空'}],
				},
				loading: false,
			}
		},
		mounted () {
			if (this.$route.name === 'royal-war-card-update') {
				this.requestData({id: this.$route.params.id,act:'view'})
			}
		},
		watch: {
			'formData.has_data' (data) {
				this.hasData(data);
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
					_this.formData.image_url = response.data.image_url
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
				this.ajax('match/royal_war_card_op.php', params, function (response) {
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
				let _this = this
				this.form.loading = true;

				if (_this.$route.name === 'royal-war-card-update') {
					_this.formData.act = 'edit';
				}else{
					_this.formData.act = 'add';
				}
				this.ajax('match/royal_war_card_op.php', this.formData, function (response) {
					if (response.data.code == 200) {
						_this.$message({
							message: response.data.message,
							type: 'success'
						});
						_this.$router.push({path: '/royal-war-card'})
					} else {
						_this.$message.error({
							message: response.data.message,
						});
					}
					_this.form.loading = false
				})
			},
			submit () {
				this.$refs['royalWarCardForm'].validate((valid) => {
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
