<template>
  <div class="dynamic-article-list">

    <el-table :data="tableData" border stripe v-loading="loading" :default-expand-all="true">

      <el-table-column prop="list.dynamic_id" label="贴子ID" align="center"></el-table-column>
      <el-table-column prop="list.add_time" label="创建时间" :formatter="this.timeFormatter"
                       align="center"></el-table-column>
      <el-table-column prop="list.title" label="标题" align="center"></el-table-column>
      <el-table-column prop="list.comment_count" label="评论数" align="center"></el-table-column>
      <el-table-column prop="list.praise_count" label="点赞数" align="center"></el-table-column>
      <el-table-column prop="list.view_count" label="访问数" align="center"></el-table-column>
      <el-table-column prop="list.picture_list.length" label="数量" align="center"></el-table-column>

      <el-table-column label="操作" class="center" align="center">
        <template scope="scope">
          <el-button size="small" type="danger" @click="requestAction('open',scope.row)"
                     v-if="scope.row.list.is_hidden == '1'">开启
          </el-button>
          <el-button size="small" type="danger" @click="requestAction('close',scope.row)" v-else>关闭</el-button>
          <a :href="'/match_dynamic_comment_list?dynamic_id=' + scope.row.list.dynamic_id" target="_blank"
             class="el-button--small el-button--primary">评论管理</a>
        </template>
      </el-table-column>
      <el-table-column width="50" type="expand">
        <template scope="scope">
          <!-- element 上传图片按钮 -->
          <el-upload
              ref="upload"
              list-type="picture-card"
              :file-list="form.fileList"
              :action="form.uploadUrl"
              :auto-upload="false"
              name="image"
              accept="*"
              :data="form.uploadData"
              :on-change='changeUpload'
              :before-upload="uploadFileBefore"
              :on-progress="uploadProcess"
              :on-success="uploadFile"
              :on-preview="handlePictureCardPreview"
              :on-remove="oRemove"
              :before-remove="bRemove">
            <i class="el-icon-plus"></i>
          </el-upload>

          <!--图片放大预览-->
          <el-dialog :visible.sync="dialogPreviewVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

          <!-- vueCropper 剪裁图片实现-->
          <el-dialog title="图片剪裁" :visible.sync="dialogCropperVisible" :close-on-click-modal="false" :show-close="false" >
            <div class="cropper-content">
              <div class="cropper" style="text-align:center">
                <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.outputSize"
                    :outputType="option.outputType"
                    :canScale="option.canScale"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :fixed="option.fixed"
                    :fixedNumber="option.fixedNumber"
                    :centerBox="option.centerBox"
                    :infoTrue="option.infoTrue"
                    :fixedBox="option.fixedBox"
                    :enlarge="option.enlarge">
                </vueCropper>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <!--<el-button @click="dialogCropperVisible = false">取 消</el-button>-->
              <el-button @click="clearFiles()">取 消</el-button>
              <el-button type="primary" @click="finish" :loading="form.uploading">确 认</el-button>
            </div>
          </el-dialog>

        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>
	export default {
		data() {
			return {
				form: {
					uploading: false,
					uploadPercentage: 0,
					uploadUrl: '/services/upload_file/upload_image.php',
          uploadData: {
						x:'1',
            y:'1',
            xwidth:'1',
            xheight:'1',
            member_id:''
          },
					fileList: []
				},
				queryParams: {
					action: 'edit',
					matchID: '',
					image_url:'',//原图
					image_url1:'',//缩略图
					picture_ids:'',//删除图片id
          id:'',//贴子id
				},
				tableData: [],
				// total: 0,
				loading: false,
				dialogImageUrl: '',
				dialogPreviewVisible: false,
				dialogCropperVisible: false,

				previews: {},
				// 裁剪组件的基础配置option
				option: {
					img: '', // 裁剪图片的地址
					info: true, // 裁剪框的大小信息
					outputSize: 1, // 裁剪生成图片的质量
					outputType: 'jpg', // 裁剪生成图片的格式
					canScale: true, // 图片是否允许滚轮缩放
					autoCrop: true, // 是否默认生成截图框
					autoCropWidth: 300, // 默认生成截图框宽度
					autoCropHeight: 200, // 默认生成截图框高度
					fixedBox: false, // 固定截图框大小 不允许改变
					fixed: true, // 是否开启截图框宽高固定比例
					fixedNumber: [3, 2], // 截图框的宽高比例
					full: true, // 是否输出原图比例的截图
					canMove:true,//上传图片是否可以移动
					canMoveBox: true, // 截图框能否拖动
					original: false, // 上传图片按照原始比例渲染
					centerBox: true, // 截图框是否被限制在图片里面
					infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
					enlarge: 1,//图片根据截图框输出比例倍数 0-max(建议不要太大不然会卡死的呢)
				},
			}
		},
		computed: {

    },
		watch: {

		},
		mounted() {
			this.requestList()
		},
		methods: {
			requestList(data) {
				this.loading = true
				this.queryParams.action = 'edit',
				this.queryParams.matchID = this.$route.params.id
				this.ajax('match/match_picture.php', this.queryParams, ((response) => {
					this.loading = false
					this.dialogCropperVisible = false
					this.form.fileList = []
					this.tableData = []
					let picture_list = response.data.data.picture_list
					for (let i in picture_list) {
						this.form.fileList.push({
              id: picture_list[i].picture_id,
							name: '',
							url: picture_list[i].image_url1,
							url_big: picture_list[i].image_url,
						});
					}

					let list = response.data.data;
					this.tableData.push({
						list,
					});

					this.queryParams.id = response.data.data.dynamic_id
          this.form.uploadData.member_id = response.data.data.member_id
				}));
			},
			requestAction(type, row) {
        switch (type) {
						case 'open':
						case 'close':
							this.$confirm('确定'+type, '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning',
								center: true
							}).then(({value}) => {
								this.queryParams.action = type
								this.ajax('match/match_picture.php', this.queryParams, (response) => {
									if (response.data.code == 200) {
										this.$message({
											type: 'success',
											message: response.data.message
										})
                    this.requestList();
									} else {
										this.$message.error({
											message: response.data.message,
										})
									}
								})
							}).catch(() => {

							});
							break
						case 'delete_picture':
						  console.log(this.queryParams);
              this.queryParams.action = type;
              this.queryParams.picture_ids = row.id;
              console.log(this.queryParams);
              this.ajax('match/match_picture.php', this.queryParams, (response) => {
                if (response.data.code == 200) {
                  for (let i in this.form.fileList) {
                    if(this.form.fileList[i].id == this.queryParams.picture_ids){
                      this.form.fileList.splice(i,1);
                    }
                  }
                  this.$message({
                    type: 'success',
                    message: response.data.message
                  })
                } else {
                  this.$message.error({
                    message: response.data.message,
                  })
                }
              });
							// this.$confirm('确定'+type, '提示', {
							// 	confirmButtonText: '确定',
							// 	cancelButtonText: '取消',
							// 	type: 'warning',
							// 	center: true
							// }).then(({value}) => {
							// 	this.queryParams.action = type
							// 	this.queryParams.picture_ids = row.id
              //
							// 	this.ajax('match/match_picture.php', this.queryParams, (response) => {
							// 		if (response.data.code == 200) {
							// 			for (let i in this.form.fileList) {
							// 				if(this.form.fileList[i].id == this.queryParams.picture_ids){
							// 					this.form.fileList.splice(i,1);
							// 				}
							// 			}
							// 			this.$message({
							// 				type: 'success',
							// 				message: response.data.message
							// 			})
							// 		} else {
							// 			this.$message.error({
							// 				message: response.data.message,
							// 			})
							// 		}
							// 	})
							// }).catch(() => {
              //
							// });
							break
						case 'insert_picture':
							this.queryParams.action = type
							this.queryParams.image_url = row[0].half_path
							this.queryParams.image_url1 = row[1].half_path
							this.ajax('match/match_picture.php', this.queryParams, (response) => {
								if (response.data.code == 200) {
									this.$message({
										type: 'success',
										message: response.data.message
									})
                  this.form.fileList.push({
                    id: response.data.data.id,
                    name: '',
                    url: this.queryParams.image_url1,
                    url_big: this.queryParams.image_url,
                  });
									this.dialogCropperVisible = false
								} else {
									this.$message.error({
										message: response.data.message,
									})
								}
							})
							break
					}
			},
			timeFormatter(row) {
				return this.moment(row.list.add_time * 1000).format('YYYY-MM-DD HH:mm:ss')
			},
			//图片上传  submit后，上传成功前
			uploadFileBefore() {
				let dpr = this.$refs.cropper.cropInfo.width/this.$refs.cropper.cropW;//计算比例
				this.form.uploadData.x = (this.$refs.cropper.getCropAxis().x1 - this.$refs.cropper.getImgAxis().x1)*dpr;
				this.form.uploadData.y = (this.$refs.cropper.getCropAxis().y1 - this.$refs.cropper.getImgAxis().y1)*dpr
				this.form.uploadData.xwidth = this.$refs.cropper.cropInfo.width
				this.form.uploadData.xheight = this.$refs.cropper.cropInfo.height

				this.form.uploading = true
			},
			uploadFile(response, file, fileList) {
				if (response.code == 200) {
					this.$message({
						message: response.message,
						type: 'success'
					});
					this.requestAction('insert_picture',response.data);//提交IMG的URL参数到接口
				} else {
					this.$message.error({
						message: response.message,
					});
				}
				this.form.uploading = false
			},
			uploadProcess(event, file, fileList) {
				this.form.uploadPercentage = parseInt(event.percent)
			},
      oRemove(file,fileList){
        console.log('删除了');
        this.requestAction('delete_picture',file)
      },
			bRemove(file, fileList) {
			  console.log(file, fileList);
				// this.requestAction('delete_picture',file)
				// return false
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url_big;
				this.dialogPreviewVisible = true;
			},
			// 上传按钮   限制图片大小
			changeUpload(file, fileList) {
				const isLt10M = file.size / 1024 / 1024 < 10
				if (!isLt10M) {
					this.$message.error('上传文件大小不能超过 10MB!')
					return false
				}

				// 上传成功后将图片地址赋值给裁剪框显示图片
				this.$nextTick(() => {
					this.option.img = file.url
					this.dialogCropperVisible = true
				})
			},
      //清空上传列表
      clearFiles(){
	      //this.$refs.upload.clearFiles();//
	      this.dialogCropperVisible = false;
	      this.requestList()
	      // this.form.fileList= this.form.fileList
      },
			// 点击裁剪，这一步是可以拿到处理后的地址
			finish() {
				console.log(this.$refs.cropper.cropInfo,this.$refs.cropper.getImgAxis(),this.$refs.cropper.getCropAxis());
				this.$refs.upload.submit();
			}
		}
	}

</script>

<style>

  .cropper {
    width: auto;
    height: 300px;
  }
  .el-upload-list--picture-card .el-upload-list__item{
    width: 300px;
    height: 200px;
  }
  .el-upload--picture-card{
    width: 300px;
    height: 200px;
    line-height: 200px;
  }
</style>
