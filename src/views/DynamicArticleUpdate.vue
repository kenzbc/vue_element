<template>
    <div class="dynamic-article-update">
        <el-form ref="dynamicArticleForm" :model="formData" label-position="right" label-width="180px" :rules="formRules">

            <el-form-item label="用户昵称：" prop="broadcast_id" required>
                <el-select
                        v-model="formData.broadcast_id"
                        filterable
                        remote
                        placeholder="请输入关键词"
                        :remote-method="searchMember"
                        :loading="form.loading">
                    <el-option
                            v-for="item in formSearch.searchMember"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="封面图片：" prop="cover_url" required>
                <el-input type="text" v-model="formData.cover_url" class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" :on-success="uploadFile" :data="{htype:'1'}" accept=".jpg,.jpeg,.png,.JPG,.JPEG" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append">
                        <el-button type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <span class="tip">图片尺寸，长宽2：1</span>
                <img v-if="formData.cover_url" class="preview-image" :src="formData.cover_url"/>
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>

            <el-form-item label="文章标题：" prop="title">
                <el-input v-model="formData.title" type="text" placeholder="（限30个字）" class="large"></el-input>
            </el-form-item>

            <el-form-item label="是否在圈子列表显示：">
                <el-radio-group v-model="formData.is_circle_list">
                    <el-radio-button label="0">显示</el-radio-button>
                    <el-radio-button label="1">不显示</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="语言：" prop="language_id" required>
                <el-radio-group v-model="formData.language_id">
                    <el-radio-button v-for="item in form.LanguageListOptions" :label="item.value" :key="item.value">{{item.name}}</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="圈子ID：" prop="circle_id" required>
                <el-select
                        v-model="formData.circle_id"
                        filterable
                        remote
                        placeholder="请输入关键词"
                        :remote-method="searchCircle"
                        :loading="form.loading">
                    <el-option
                            v-for="item in formSearch.searchCircle"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="文章导语：" prop="summary">
                <el-input v-model="formData.summary" type="text" placeholder="选填（限50个字）" class="large"></el-input>
            </el-form-item>

            <el-form-item label="文章内容：" required style="max-width: 1000px;">
                <!--<quill-editor v-model="formData.content_html"-->
                              <!--ref="myQuillEditor"-->
                              <!--:options="editorOption">-->
                <!--</quill-editor>-->
                <div id="editor_toolbar" class="toolbar"></div>
                <div id="editor_text" class="text"></div>
                <!--<div id="editor" style="height: 100vh"></div>-->
            </el-form-item>

            <el-form-item label="发布时间：" prop="add_time">
                <el-date-picker v-model="formData.add_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>

            <el-form-item label="来源设备：" prop="device">
                <el-select
                        v-model="formData.device"
                        filterable
                        remote
                        clearable
                        placeholder="请输入关键词"
                        :remote-method="searchPhone"
                        :loading="form.loading">
                    <el-option
                            v-for="item in formSearch.searchPhone"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="关闭自动显示评论：">
                <el-radio-group v-model="formData.close_auto_show_comment">
                    <el-radio-button label="0">否</el-radio-button>
                    <el-radio-button label="1">是</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="动态分类：">
                <el-radio-group v-model="formData.dynamic_type">
                    <el-radio-button label="0">音频</el-radio-button>
                    <el-radio-button label="1">视频</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="音频标题：" prop="audio.audio_title" v-show="formData.dynamic_type == '0'">
                <el-input v-model="formData.audio.audio_title" type="text" placeholder="" class="large"></el-input>
            </el-form-item>

            <el-form-item label="音频文件：" prop="audio.audio_url" v-show="formData.dynamic_type == '0'">
                <!--<el-input v-model="formData.audio.audio_url" type="text" placeholder="" class="large"></el-input>-->
                <el-input type="text" v-model="formData.audio.audio_url" class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" :data="{file_type:'audio'}" name="image" :on-success="uploadFileAudio" accept="" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append">
                        <el-button type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择文件</el-button>
                    </el-upload>
                </el-input>
            </el-form-item>

            <el-form-item label="音频时长（秒）：" prop="audio.seconds" v-show="formData.dynamic_type == '0'">
                <el-input v-model="formData.audio.seconds" type="number" min="0" class="mini"></el-input>
            </el-form-item>

            <el-form-item label="视频链接：" prop="video.url" v-show="formData.dynamic_type == '1'">
                <el-input v-model="formData.video.url" type="text" placeholder="请输入视频链接，目前支持mp4和m3u8的url" class="large"></el-input>
            </el-form-item>

            <el-form-item label="视频封面：" prop="video.image_url" v-show="formData.dynamic_type == '1'">
                <el-input type="text" v-model="formData.video.image_url" class="large" placeholder="请选择图片">
                    <el-upload class="upload-demo" :action="form.uploadUrl" :show-file-list="false" name="image" :on-success="uploadFileVideo" accept="image/*" :on-progress="uploadProcess" :before-upload="uploadFileBefore" slot="append">
                        <el-button type="primary" icon="picture" :loading="form.uploading" :disabled="form.loading || form.uploading">选择图片</el-button>
                    </el-upload>
                </el-input>
                <img v-if="formData.video.image_url" class="preview-image" :src="formData.video.image_url"/>
                <el-progress :text-inside="true" :stroke-width="15" :percentage="form.uploadPercentage" v-if="form.uploading" class="large" style="margin-top: 10px"></el-progress>
            </el-form-item>

            <el-form-item label="视频时长（秒）：" prop="video.seconds" v-show="formData.dynamic_type == '1'">
                <el-input v-model="formData.video.seconds" type="number" min="0" class="mini"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit" :disabled="form.loading || form.uploading" :loading="form.loading">提交</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
	import Editor from 'wangeditor'
	import 'wangeditor/release/wangEditor.min.css'
	export default {
        data () {
            return {
                form:{
                    loading: false,
	                uploading: false,
	                uploadPercentage: 0,
	                uploadUrl: this.HOST + 'upload_image.php',
	                LanguageListOptions:[],
                },
                formData:{
                    // action: 'create',
	                dynamic_id:'',//编辑时必填
	                broadcast_id:'',
	                cover_url:'',
	                cover_url_thumb:'',
	                title:'',
	                is_circle_list:'1',
	                language_id:'1',
	                circle_id:'',
	                summary:'',
	                content_html:'',
	                add_time:'',
	                device:'',
	                close_auto_show_comment:'0',
	                dynamic_type:'0',
	                audio:{
		                audio_title : '',
                        audio_url : '',
		                seconds:''
                    },
	                video:{
		                url : '',
                        image_url : '',
		                seconds : ''
	                },
                },
                formRules:{
	                title: [{required: true, message: '标题必选'}, {max: 30, message: '不能超过30个字'}],
	                summary: [{max: 50, message: '不能超过50个字'}],
                },
	            formSearch:{
                	form:{
		                action: '',
                        query:''
                    },
                	searchMember:[],
		            searchCircle:[],
		            searchPhone:[],
                },
	            editor_emoji : [
		            {
			            alt: '爱你s', src: '//img1.famulei.com/common/images/emoji/emoji_saini.png'
		            }, {
			            alt: '奥特曼s', src: '//img1.famulei.com/common/images/emoji/emoji_saoteman.png'
		            }, {
			            alt: '拜拜s', src: '//img1.famulei.com/common/images/emoji/emoji_sbaibai.png'
		            }, {
			            alt: '白眼s', src: '//img1.famulei.com/common/images/emoji/emoji_sbaiyan.png'
		            }, {
			            alt: '宝宝s', src: '//img1.famulei.com/common/images/emoji/emoji_sbaobao.png'
		            }, {
			            alt: '悲伤s', src: '//img1.famulei.com/common/images/emoji/emoji_sbeishang.png'
		            }, {
			            alt: '鄙视s', src: '//img1.famulei.com/common/images/emoji/emoji_sbishi.png'
		            }, {
			            alt: '闭嘴s', src: '//img1.famulei.com/common/images/emoji/emoji_sbizui.png'
		            }, {
			            alt: '馋嘴s', src: '//img1.famulei.com/common/images/emoji/emoji_scanzui.png'
		            }, {
			            alt: '羊驼s', src: '//img1.famulei.com/common/images/emoji/emoji_scaonima.png'
		            }, {
			            alt: '吃惊s', src: '//img1.famulei.com/common/images/emoji/emoji_schijing.png'
		            }, {
			            alt: '呆s', src: '//img1.famulei.com/common/images/emoji/emoji_sdai.png'
		            }, {
			            alt: '大哭s', src: '//img1.famulei.com/common/images/emoji/emoji_sdaku.png'
		            }, {
			            alt: '蛋糕s', src: '//img1.famulei.com/common/images/emoji/emoji_sdangao.png'
		            }, {
			            alt: '大笑s', src: '//img1.famulei.com/common/images/emoji/emoji_sdaxiao.png'
		            }, {
			            alt: 'doges', src: '//img1.famulei.com/common/images/emoji/emoji_sdoge.png'
		            }, {
			            alt: '浮云s', src: '//img1.famulei.com/common/images/emoji/emoji_sfuyun.png'
		            }, {
			            alt: '给力s', src: '//img1.famulei.com/common/images/emoji/emoji_sgeili.png'
		            }, {
			            alt: 'goods', src: '//img1.famulei.com/common/images/emoji/emoji_sgood.png'
		            }, {
			            alt: '拍手s', src: '//img1.famulei.com/common/images/emoji/emoji_sguzhang.png'
		            }, {
			            alt: '哈哈s', src: '//img1.famulei.com/common/images/emoji/emoji_shaha.png'
		            }, {
			            alt: '害羞s', src: '//img1.famulei.com/common/images/emoji/emoji_shaixiu.png'
		            }, {
			            alt: '汗s', src: '//img1.famulei.com/common/images/emoji/emoji_shan.png'
		            }, {
			            alt: '哈欠s', src: '//img1.famulei.com/common/images/emoji/emoji_shaqian.png'
		            }, {
			            alt: '黑线s', src: '//img1.famulei.com/common/images/emoji/emoji_sheixian.png'
		            }, {
			            alt: '囧s', src: '//img1.famulei.com/common/images/emoji/emoji_sheng.png'
		            }, {
			            alt: '话筒s', src: '//img1.famulei.com/common/images/emoji/emoji_shuatong.png'
		            }, {
			            alt: '互粉s', src: '//img1.famulei.com/common/images/emoji/emoji_shufen.png'
		            }, {
			            alt: '好囧s', src: '//img1.famulei.com/common/images/emoji/emoji_sjiong.png'
		            }, {
			            alt: '挤眼s', src: '//img1.famulei.com/common/images/emoji/emoji_sjiyan.png'
		            }, {
			            alt: '可爱s', src: '//img1.famulei.com/common/images/emoji/emoji_skeai.png'
		            }, {
			            alt: '可怜s', src: '//img1.famulei.com/common/images/emoji/emoji_skelian.png'
		            }, {
			            alt: '口水s', src: '//img1.famulei.com/common/images/emoji/emoji_skoushui.png'
		            }, {
			            alt: '酷s', src: '//img1.famulei.com/common/images/emoji/emoji_sku.png'
		            }, {
			            alt: '困s', src: '//img1.famulei.com/common/images/emoji/emoji_skun.png'
		            }, {
			            alt: '来s', src: '//img1.famulei.com/common/images/emoji/emoji_slai.png'
		            }, {
			            alt: '蜡烛s', src: '//img1.famulei.com/common/images/emoji/emoji_slazhu.png'
		            }, {
			            alt: '泪s', src: '//img1.famulei.com/common/images/emoji/emoji_slei.png'
		            }, {
			            alt: '礼物s', src: '//img1.famulei.com/common/images/emoji/emoji_sliwu.png'
		            }, {
			            alt: '喵喵s', src: '//img1.famulei.com/common/images/emoji/emoji_smiaomiao.png'
		            }, {
			            alt: '哼s', src: '//img1.famulei.com/common/images/emoji/emoji_sheng.png'
		            }, {
			            alt: '鼓掌s', src: '//img1.famulei.com/common/images/emoji/emoji_sguzhang.png'
		            }, {
			            alt: '挤眼s', src: '//img1.famulei.com/common/images/emoji/emoji_sjiyan.png'
		            }, {
			            alt: '兔子s', src: '//img1.famulei.com/common/images/emoji/emoji_stuzi.png'
		            }, {
			            alt: '怒骂s', src: '//img1.famulei.com/common/images/emoji/emoji_snuma.png'
		            }, {
			            alt: '吐血s', src: '//img1.famulei.com/common/images/emoji/emoji_stuxue.png'
		            }, {
			            alt: '阴险s', src: '//img1.famulei.com/common/images/emoji/emoji_syinxian.png'
		            }, {
			            alt: '心s', src: '//img1.famulei.com/common/images/emoji/emoji_sxin.png'
		            }, {
			            alt: '钱s', src: '//img1.famulei.com/common/images/emoji/emoji_sqian.png'
		            }, {
			            alt: '微笑s', src: '//img1.famulei.com/common/images/emoji/emoji_sweixiao.png'
		            }, {
			            alt: '弱s', src: '//img1.famulei.com/common/images/emoji/emoji_sruo.png'
		            }, {
			            alt: '委屈s', src: '//img1.famulei.com/common/images/emoji/emoji_sweiqu.png'
		            }, {
			            alt: '威武s', src: '//img1.famulei.com/common/images/emoji/emoji_sweiwu.png'
		            }, {
			            alt: '嘻嘻s', src: '//img1.famulei.com/common/images/emoji/emoji_sxixi.png'
		            }, {
			            alt: '怒s', src: '//img1.famulei.com/common/images/emoji/emoji_snu.png'
		            }, {
			            alt: '脑残s', src: '//img1.famulei.com/common/images/emoji/emoji_snaocan.png'
		            }, {
			            alt: '赞s', src: '//img1.famulei.com/common/images/emoji/emoji_szan.png'
		            }, {
			            alt: '笑crys', src: '//img1.famulei.com/common/images/emoji/emoji_sxiaocry.png'
		            }, {
			            alt: 'oks', src: '//img1.famulei.com/common/images/emoji/emoji_sok.png'
		            }, {
			            alt: '嘘s', src: '//img1.famulei.com/common/images/emoji/emoji_sxu.png'
		            }, {
			            alt: '围观s', src: '//img1.famulei.com/common/images/emoji/emoji_sweiguan.png'
		            }, {
			            alt: '钟s', src: '//img1.famulei.com/common/images/emoji/emoji_szhong.png'
		            }, {
			            alt: '晕s', src: '//img1.famulei.com/common/images/emoji/emoji_syun.png'
		            }, {
			            alt: '生病s', src: '//img1.famulei.com/common/images/emoji/emoji_sshengbin.png'
		            }, {
			            alt: '挖鼻s', src: '//img1.famulei.com/common/images/emoji/emoji_swabi.png'
		            }, {
			            alt: '神马s', src: '//img1.famulei.com/common/images/emoji/emoji_sshenma.png'
		            }, {
			            alt: '猪头s', src: '//img1.famulei.com/common/images/emoji/emoji_szhutou.png'
		            }, {
			            alt: '思考s', src: '//img1.famulei.com/common/images/emoji/emoji_ssikao.png'
		            }, {
			            alt: '熊猫s', src: '//img1.famulei.com/common/images/emoji/emoji_sxiongmao.png'
		            }, {
			            alt: '右哼哼s', src: '//img1.famulei.com/common/images/emoji/emoji_syouhengheng.png'
		            }, {
			            alt: '努力s', src: '//img1.famulei.com/common/images/emoji/emoji_snuli.png'
		            }, {
			            alt: '抓狂s', src: '//img1.famulei.com/common/images/emoji/emoji_szhuakuang.png'
		            }, {
			            alt: 'nos', src: '//img1.famulei.com/common/images/emoji/emoji_sno.png'
		            }, {
			            alt: '耶s', src: '//img1.famulei.com/common/images/emoji/emoji_sye.png'
		            }, {
			            alt: '太开心s', src: '//img1.famulei.com/common/images/emoji/emoji_staikaixin.png'
		            }, {
			            alt: '亲亲s', src: '//img1.famulei.com/common/images/emoji/emoji_sqinqin.png'
		            }, {
			            alt: '鲜花s', src: '//img1.famulei.com/common/images/emoji/emoji_sxianhua.png'
		            }, {
			            alt: '伤心s', src: '//img1.famulei.com/common/images/emoji/emoji_sshangxin.png'
		            }, {
			            alt: '左哼哼s', src: '//img1.famulei.com/common/images/emoji/emoji_szuohengheng.png'
		            }, {
			            alt: '色s', src: '//img1.famulei.com/common/images/emoji/emoji_sse.png'
		            }, {
			            alt: '偷笑s', src: '//img1.famulei.com/common/images/emoji/emoji_stouxiao.png'
		            }, {
			            alt: '疑问s', src: '//img1.famulei.com/common/images/emoji/emoji_syiwen.png'
		            }, {
			            alt: '睡s', src: '//img1.famulei.com/common/images/emoji/emoji_sshui.png'
		            }, {
			            alt: '失望s', src: '//img1.famulei.com/common/images/emoji/emoji_sshiwang.png'
		            }, {
			            alt: '衰s', src: '//img1.famulei.com/common/images/emoji/emoji_sshuai.png'
		            }, {
			            alt: '吐s', src: '//img1.famulei.com/common/images/emoji/emoji_stu.png'
		            }, {
			            alt: '吃瓜s', src: '//img1.famulei.com/common/images/emoji/emoji_chiguas.png'
		            }
	            ],//赛高小子
	            editor_emoji1 : [
		            {
			            alt: '鄙视', src: '//img1.famulei.com/common/images/emoji/emoji_bishi.png'
		            }, {
			            alt: '呆', src: '//img1.famulei.com/common/images/emoji/emoji_dai.png'
		            }, {
			            alt: '大哭', src: '//img1.famulei.com/common/images/emoji/emoji_daku.png'
		            }, {
			            alt: '大笑', src: '//img1.famulei.com/common/images/emoji/emoji_daxiao.png'
		            }, {
			            alt: '鼓掌', src: '//img1.famulei.com/common/images/emoji/emoji_guzhang.png'
		            }, {
			            alt: '害羞', src: '//img1.famulei.com/common/images/emoji/emoji_haixiu.png'
		            }, {
			            alt: '汗', src: '//img1.famulei.com/common/images/emoji/emoji_han.png'
		            }, {
			            alt: '可爱', src: '//img1.famulei.com/common/images/emoji/emoji_keai.png'
		            }, {
			            alt: '困', src: '//img1.famulei.com/common/images/emoji/emoji_kun.png'
		            }, {
			            alt: '脑残', src: '//img1.famulei.com/common/images/emoji/emoji_naocan.png'
		            }, {
			            alt: '努力', src: '//img1.famulei.com/common/images/emoji/emoji_nuli.png'
		            }, {
			            alt: '钱', src: '//img1.famulei.com/common/images/emoji/emoji_qian.png'
		            }, {
			            alt: '偷笑', src: '//img1.famulei.com/common/images/emoji/emoji_touxiao.png'
		            }, {
			            alt: '吐血', src: '//img1.famulei.com/common/images/emoji/emoji_tuxue.png'
		            }, {
			            alt: '微笑', src: '//img1.famulei.com/common/images/emoji/emoji_weixiao.png'
		            }, {
			            alt: '鲜花', src: '//img1.famulei.com/common/images/emoji/emoji_xianhua.png'
		            }, {
			            alt: '疑问', src: '//img1.famulei.com/common/images/emoji/emoji_yiwen.png'
		            }, {
			            alt: '晕', src: '//img1.famulei.com/common/images/emoji/emoji_yun.png'
		            }, {
			            alt: '赞', src: '//img1.famulei.com/common/images/emoji/emoji_zan.png'
		            }, {
			            alt: 'doge', src: '//img1.famulei.com/common/images/emoji/emoji_doge.png'
		            }, {
			            alt: '熊猫', src: '//img1.famulei.com/common/images/emoji/emoji_xiongmao.png'
		            }, {
			            alt: '礼物', src: '//img1.famulei.com/common/images/emoji/emoji_liwu.png'
		            }, {
			            alt: '吃惊', src: '//img1.famulei.com/common/images/emoji/emoji_chijing.png'
		            }, {
			            alt: '亲亲', src: '//img1.famulei.com/common/images/emoji/emoji_qinqin.png'
		            }, {
			            alt: '泪', src: '//img1.famulei.com/common/images/emoji/emoji_lei.png'
		            }, {
			            alt: '嘻嘻', src: '//img1.famulei.com/common/images/emoji/emoji_xixi.png'
		            }, {
			            alt: '色', src: '//img1.famulei.com/common/images/emoji/emoji_se.png'
		            }, {
			            alt: '阴险', src: '//img1.famulei.com/common/images/emoji/emoji_yinxian.png'
		            }, {
			            alt: '宝宝', src: '//img1.famulei.com/common/images/emoji/emoji_baobao.png'
		            }, {
			            alt: '抓狂', src: '//img1.famulei.com/common/images/emoji/emoji_zhuakuang.png'
		            }, {
			            alt: '威武', src: '//img1.famulei.com/common/images/emoji/emoji_weiwu.png'
		            }, {
			            alt: '拜拜', src: '//img1.famulei.com/common/images/emoji/emoji_baibai.png'
		            }, {
			            alt: 'no', src: '//img1.famulei.com/common/images/emoji/emoji_no.png'
		            }, {
			            alt: '喵喵', src: '//img1.famulei.com/common/images/emoji/emoji_miaomiao.png'
		            }, {
			            alt: '耶', src: '//img1.famulei.com/common/images/emoji/emoji_ye.png'
		            }, {
			            alt: '挖鼻', src: '//img1.famulei.com/common/images/emoji/emoji_wabi.png'
		            }, {
			            alt: '猪头', src: '//img1.famulei.com/common/images/emoji/emoji_zhutou.png'
		            }, {
			            alt: '失望', src: '//img1.famulei.com/common/images/emoji/emoji_shiwang.png'
		            }, {
			            alt: '闭嘴', src: '//img1.famulei.com/common/images/emoji/emoji_bizui.png'
		            }, {
			            alt: '蛋糕', src: '//img1.famulei.com/common/images/emoji/emoji_dangao.png'
		            }, {
			            alt: '蜡烛', src: '//img1.famulei.com/common/images/emoji/emoji_lazhu.png'
		            }, {
			            alt: '话筒', src: '//img1.famulei.com/common/images/emoji/emoji_huatong.png'
		            }, {
			            alt: '爱你', src: '//img1.famulei.com/common/images/emoji/emoji_aini.png'
		            }, {
			            alt: 'ok', src: '//img1.famulei.com/common/images/emoji/emoji_ok.png'
		            }, {
			            alt: '怒骂', src: '//img1.famulei.com/common/images/emoji/emoji_numa.png'
		            }, {
			            alt: '哈哈', src: '//img1.famulei.com/common/images/emoji/emoji_haha.png'
		            }, {
			            alt: '羊驼', src: '//img1.famulei.com/common/images/emoji/emoji_caonima.png'
		            }, {
			            alt: '囧', src: '//img1.famulei.com/common/images/emoji/emoji_jiong.png'
		            }, {
			            alt: '哼', src: '//img1.famulei.com/common/images/emoji/emoji_heng.png'
		            }, {
			            alt: '挤眼', src: '//img1.famulei.com/common/images/emoji/emoji_jiyan.png'
		            }, {
			            alt: '围观', src: '//img1.famulei.com/common/images/emoji/emoji_weiguan.png'
		            }, {
			            alt: '吐', src: '//img1.famulei.com/common/images/emoji/emoji_tu.png'
		            }, {
			            alt: '兔子', src: '//img1.famulei.com/common/images/emoji/emoji_tuzi.png'
		            }, {
			            alt: '怒', src: '//img1.famulei.com/common/images/emoji/emoji_nu.png'
		            }, {
			            alt: '思考', src: '//img1.famulei.com/common/images/emoji/emoji_sikao.png'
		            }, {
			            alt: '笑cry', src: '//img1.famulei.com/common/images/emoji/emoji_xiaocry.png'
		            }, {
			            alt: '太开心', src: '//img1.famulei.com/common/images/emoji/emoji_taikaixin.png'
		            }, {
			            alt: '衰', src: '//img1.famulei.com/common/images/emoji/emoji_shuai.png'
		            }, {
			            alt: '左哼哼', src: '//img1.famulei.com/common/images/emoji/emoji_zuohengheng.png'
		            }, {
			            alt: '睡', src: '//img1.famulei.com/common/images/emoji/emoji_shui.png'
		            }, {
			            alt: '生病', src: '//img1.famulei.com/common/images/emoji/emoji_shengbin.png'
		            }, {
			            alt: '钟', src: '//img1.famulei.com/common/images/emoji/emoji_zhong.png'
		            }, {
			            alt: 'good', src: '//img1.famulei.com/common/images/emoji/emoji_good.png'
		            }, {
			            alt: '可怜', src: '//img1.famulei.com/common/images/emoji/emoji_kelian.png'
		            }, {
			            alt: '来', src: '//img1.famulei.com/common/images/emoji/emoji_lai.png'
		            }, {
			            alt: '哈欠', src: '//img1.famulei.com/common/images/emoji/emoji_haqian.png'
		            }, {
			            alt: '嘘', src: '//img1.famulei.com/common/images/emoji/emoji_xu.png'
		            }, {
			            alt: '给力', src: '//img1.famulei.com/common/images/emoji/emoji_geili.png'
		            }, {
			            alt: '右哼哼', src: '//img1.famulei.com/common/images/emoji/emoji_youhengheng.png'
		            }, {
			            alt: '奥特曼', src: '//img1.famulei.com/common/images/emoji/emoji_aoteman.png'
		            }, {
			            alt: '浮云', src: '//img1.famulei.com/common/images/emoji/emoji_fuyun.png'
		            }, {
			            alt: '弱', src: '//img1.famulei.com/common/images/emoji/emoji_ruo.png'
		            }, {
			            alt: '馋嘴', src: '//img1.famulei.com/common/images/emoji/emoji_canzui.png'
		            }, {
			            alt: '黑线', src: '//img1.famulei.com/common/images/emoji/emoji_heixian.png'
		            }, {
			            alt: '酷', src: '//img1.famulei.com/common/images/emoji/emoji_ku.png'
		            }, {
			            alt: '互粉', src: '//img1.famulei.com/common/images/emoji/emoji_hufen.png'
		            }, {
			            alt: '心', src: '//img1.famulei.com/common/images/emoji/emoji_xin.png'
		            }, {
			            alt: '悲伤', src: '//img1.famulei.com/common/images/emoji/emoji_beishang.png'
		            }, {
			            alt: '白眼', src: '//img1.famulei.com/common/images/emoji/emoji_baiyan.png'
		            }, {
			            alt: '伤心', src: '//img1.famulei.com/common/images/emoji/emoji_shangxin.png'
		            }, {
			            alt: '委屈', src: '//img1.famulei.com/common/images/emoji/emoji_weiqu.png'
		            }, {
			            alt: '神马', src: '//img1.famulei.com/common/images/emoji/emoji_shenma.png'
		            }, {
			            alt: '口水', src: '//img1.famulei.com/common/images/emoji/emoji_koushui.png'
		            }
	            ],//伐木累
	            editor_emoji2 : [
		        {
			        alt: '爱红包', src: '//img1.famulei.com/common/images/emoji/emoji_laihongbao.png'
		        }, {
			        alt: '拜年了', src: '//img1.famulei.com/common/images/emoji/emoji_lbainianle.png'
		        }, {
			        alt: '悲催', src: '//img1.famulei.com/common/images/emoji/emoji_lbeicui.png'
		        }, {
			        alt: '被电', src: '//img1.famulei.com/common/images/emoji/emoji_lbeidian.png'
		        }, {
			        alt: '崩溃', src: '//img1.famulei.com/common/images/emoji/emoji_lbengkui.png'
		        }, {
			        alt: '别烦我', src: '//img1.famulei.com/common/images/emoji/emoji_lbiefanwo.png'
		        }, {
			        alt: '冰桶挑战', src: '//img1.famulei.com/common/images/emoji/emoji_lbingtongtiaozhan.png'
		        }, {
			        alt: '不好意思', src: '//img1.famulei.com/common/images/emoji/emoji_lbuhaoyisi.png'
		        }, {
			        alt: '不想上班', src: '//img1.famulei.com/common/images/emoji/emoji_lbuxiangshangban.png'
		        }, {
			        alt: '采访', src: '//img1.famulei.com/common/images/emoji/emoji_lcaifang.png'
		        }, {
			        alt: '吃货', src: '//img1.famulei.com/common/images/emoji/emoji_lchihuo.png'
		        }, {
			        alt: '吃元宵', src: '//img1.famulei.com/common/images/emoji/emoji_lchiyuanxiao.png'
		        }, {
			        alt: '传火炬', src: '//img1.famulei.com/common/images/emoji/emoji_lchuanhuoju.png'
		        }, {
			        alt: '大红灯笼', src: '//img1.famulei.com/common/images/emoji/emoji_ldahongdenglong.png'
		        }, {
			        alt: '带感', src: '//img1.famulei.com/common/images/emoji/emoji_ldaigan.png'
		        }, {
			        alt: '带着微博去旅行', src: '//img1.famulei.com/common/images/emoji/emoji_ldaizheweiboqulvxing.png'
		        }, {
			        alt: '大南瓜', src: '//img1.famulei.com/common/images/emoji/emoji_ldanangua.png'
		        }, {
			        alt: '德国加油', src: '//img1.famulei.com/common/images/emoji/emoji_ldeguojiayou.png'
		        }, {
			        alt: '得瑟', src: '//img1.famulei.com/common/images/emoji/emoji_ldese.png'
		        }, {
			        alt: '得意地笑', src: '//img1.famulei.com/common/images/emoji/emoji_ldeyidexiao.png'
		        }, {
			        alt: '夺冠感动', src: '//img1.famulei.com/common/images/emoji/emoji_lduoguangandong.png'
		        }, {
			        alt: '发表言论', src: '//img1.famulei.com/common/images/emoji/emoji_lfabiaoyanlun.png'
		        }, {
			        alt: '发礼物', src: '//img1.famulei.com/common/images/emoji/emoji_lfaliwu.png'
		        }, {
			        alt: '放鞭炮', src: '//img1.famulei.com/common/images/emoji/emoji_lfangbianpao.png'
		        }, {
			        alt: '放电抛媚', src: '//img1.famulei.com/common/images/emoji/emoji_lfangdianpaomei.png'
		        }, {
			        alt: '发红包', src: '//img1.famulei.com/common/images/emoji/emoji_lfanghongbao.png'
		        }, {
			        alt: '放假啦', src: '//img1.famulei.com/common/images/emoji/emoji_lfangjiala.png'
		        }, {
			        alt: '非常汗', src: '//img1.famulei.com/common/images/emoji/emoji_lfeichanghan.png'
		        }, {
			        alt: '飞个吻', src: '//img1.famulei.com/common/images/emoji/emoji_lfeigewen.png'
		        }, {
			        alt: '肥皂', src: '//img1.famulei.com/common/images/emoji/emoji_lfeizao.png'
		        }, {
			        alt: '福到啦', src: '//img1.famulei.com/common/images/emoji/emoji_lfudaole.png'
		        }, {
			        alt: '复活节', src: '//img1.famulei.com/common/images/emoji/emoji_lfuhuojie.png'
		        }, {
			        alt: '赶火车', src: '//img1.famulei.com/common/images/emoji/emoji_lganhuoche.png'
		        }, {
			        alt: '给劲', src: '//img1.famulei.com/common/images/emoji/emoji_lgeijin.png'
		        }, {
			        alt: '光棍节', src: '//img1.famulei.com/common/images/emoji/emoji_lguanggunjie.png'
		        }, {
			        alt: '冠军诞生', src: '//img1.famulei.com/common/images/emoji/emoji_lguanjundansheng.png'
		        }, {
			        alt: '过年啦', src: '//img1.famulei.com/common/images/emoji/emoji_lguonianla.png'
		        }, {
			        alt: '拍手', src: '//img1.famulei.com/common/images/emoji/emoji_lguzhang.png'
		        }, {
			        alt: '好爱哦', src: '//img1.famulei.com/common/images/emoji/emoji_lhaoaio.png'
		        }, {
			        alt: '好棒', src: '//img1.famulei.com/common/images/emoji/emoji_lhaobang.png'
		        }, {
			        alt: '好激动', src: '//img1.famulei.com/common/images/emoji/emoji_lhaojidong.png'
		        }, {
			        alt: '好囧', src: '//img1.famulei.com/common/images/emoji/emoji_lhaojiong.png'
		        }, {
			        alt: '好喜欢', src: '//img1.famulei.com/common/images/emoji/emoji_lhaoxihuan.png'
		        }, {
			        alt: '喝多了', src: '//img1.famulei.com/common/images/emoji/emoji_lheduole.png'
		        }, {
			        alt: 'hold住', src: '//img1.famulei.com/common/images/emoji/emoji_lholdzhu.png'
		        }, {
			        alt: '红包拿来', src: '//img1.famulei.com/common/images/emoji/emoji_lhongbaonalai.png'
		        }, {
			        alt: '欢乐购车季', src: '//img1.famulei.com/common/images/emoji/emoji_lhuanlegoucheji.png'
		        }, {
			        alt: '会员一周年', src: '//img1.famulei.com/common/images/emoji/emoji_lhuiyuanyizhounian.png'
		        }, {
			        alt: '互相膜拜', src: '//img1.famulei.com/common/images/emoji/emoji_lhuxiangmobai.png'
		        }, {
			        alt: '互相拍砖', src: '//img1.famulei.com/common/images/emoji/emoji_lhuxiangpaizhuan.png'
		        }, {
			        alt: '江南style', src: '//img1.famulei.com/common/images/emoji/emoji_ljiangnanstyle.png'
		        }, {
			        alt: '加油啊', src: '//img1.famulei.com/common/images/emoji/emoji_ljiayoua.png'
		        }, {
			        alt: '杰克逊', src: '//img1.famulei.com/common/images/emoji/emoji_ljiekexun.png'
		        }, {
			        alt: '挤火车', src: '//img1.famulei.com/common/images/emoji/emoji_ljihuoche.png'
		        }, {
			        alt: '奥运金牌', src: '//img1.famulei.com/common/images/emoji/emoji_ljinpai.png'
		        }, {
			        alt: '金元宝', src: '//img1.famulei.com/common/images/emoji/emoji_ljinyuanbao.png'
		        }, {
			        alt: '纠结', src: '//img1.famulei.com/common/images/emoji/emoji_ljiujie.png'
		        }, {
			        alt: '巨汗', src: '//img1.famulei.com/common/images/emoji/emoji_ljuhan.png'
		        }, {
			        alt: '抠鼻屎', src: '//img1.famulei.com/common/images/emoji/emoji_lkoubishi.png'
		        }, {
			        alt: '躁狂症', src: '//img1.famulei.com/common/images/emoji/emoji_lkuangzaozheng.png'
		        }, {
			        alt: '困死了', src: '//img1.famulei.com/common/images/emoji/emoji_lkunsile.png'
		        }, {
			        alt: '啦啦啦啦', src: '//img1.famulei.com/common/images/emoji/emoji_llalalala.png'
		        }, {
			        alt: '雷锋', src: '//img1.famulei.com/common/images/emoji/emoji_lleifeng.png'
		        }, {
			        alt: '泪流满面', src: '//img1.famulei.com/common/images/emoji/emoji_lleiliumanmian.png'
		        }, {
			        alt: '立志青年', src: '//img1.famulei.com/common/images/emoji/emoji_llizhiqingnian.png'
		        }, {
			        alt: '龙啸', src: '//img1.famulei.com/common/images/emoji/emoji_llongxiao.png'
		        }, {
			        alt: '路过这儿', src: '//img1.famulei.com/common/images/emoji/emoji_lluguo.png'
		        }, {
			        alt: '马上拜年', src: '//img1.famulei.com/common/images/emoji/emoji_lmashangbainian.png'
		        }, {
			        alt: '玫瑰', src: '//img1.famulei.com/common/images/emoji/emoji_lmeigui.png'
		        }, {
			        alt: '没人疼', src: '//img1.famulei.com/common/images/emoji/emoji_lmeirenteng.png'
		        }, {
			        alt: '萌翻', src: '//img1.famulei.com/common/images/emoji/emoji_lmengfan.png'
		        }, {
			        alt: '膜拜了', src: '//img1.famulei.com/common/images/emoji/emoji_lmobaile.png'
		        }, {
			        alt: '牛', src: '//img1.famulei.com/common/images/emoji/emoji_lniu.png'
		        }, {
			        alt: '噢耶', src: '//img1.famulei.com/common/images/emoji/emoji_louye.png'
		        }, {
			        alt: '拍照', src: '//img1.famulei.com/common/images/emoji/emoji_lpaizhao.png'
		        }, {
			        alt: '拍砖', src: '//img1.famulei.com/common/images/emoji/emoji_lpaizhuan.png'
		        }, {
			        alt: '霹雳', src: '//img1.famulei.com/common/images/emoji/emoji_lpili.png'
		        }, {
			        alt: '平安果', src: '//img1.famulei.com/common/images/emoji/emoji_lpinganguo.png'
		        }, {
			        alt: '葡萄牙队加油', src: '//img1.famulei.com/common/images/emoji/emoji_lputaoyajiayou.png'
		        }, {
			        alt: '瞧瞧', src: '//img1.famulei.com/common/images/emoji/emoji_lqiaoqiao.png'
		        }, {
			        alt: '亲一口', src: '//img1.famulei.com/common/images/emoji/emoji_lqinyikou.png'
		        }, {
			        alt: '丘比特', src: '//img1.famulei.com/common/images/emoji/emoji_lqiubite.png'
		        }, {
			        alt: '求关注', src: '//img1.famulei.com/common/images/emoji/emoji_lqiuguanzhu.png'
		        }, {
			        alt: '求红包', src: '//img1.famulei.com/common/images/emoji/emoji_lqiuhongbao.png'
		        }, {
			        alt: '七夕', src: '//img1.famulei.com/common/images/emoji/emoji_lqixi.png'
		        }, {
			        alt: '去旅行', src: '//img1.famulei.com/common/images/emoji/emoji_lqulvxing.png'
		        }, {
			        alt: '群体围观', src: '//img1.famulei.com/common/images/emoji/emoji_lquntiweiguan.png'
		        }, {
			        alt: '撒花', src: '//img1.famulei.com/common/images/emoji/emoji_lsahua.png'
		        }, {
			        alt: '蛇年快乐', src: '//img1.famulei.com/common/images/emoji/emoji_lsheniankuaile.png'
		        }, {
			        alt: '收藏', src: '//img1.famulei.com/common/images/emoji/emoji_lshoucang.png'
		        }, {
			        alt: '耍花灯', src: '//img1.famulei.com/common/images/emoji/emoji_lshuahuadeng.png'
		        }, {
			        alt: '甩甩手', src: '//img1.famulei.com/common/images/emoji/emoji_lshuaishuaishou.png'
		        }, {
			        alt: '奥运铜牌', src: '//img1.famulei.com/common/images/emoji/emoji_ltongpai.png'
		        }, {
			        alt: '同意', src: '//img1.famulei.com/common/images/emoji/emoji_ltongyi.png'
		        }, {
			        alt: '偷乐', src: '//img1.famulei.com/common/images/emoji/emoji_ltoule.png'
		        }, {
			        alt: '推荐', src: '//img1.famulei.com/common/images/emoji/emoji_ltuijian.png'
		        }, {
			        alt: '吐血2', src: '//img1.famulei.com/common/images/emoji/emoji_ltuxue.png'
		        }, {
			        alt: '微博三岁啦', src: '//img1.famulei.com/common/images/emoji/emoji_lweibosansuila.png'
		        }, {
			        alt: '微公益爱心', src: '//img1.famulei.com/common/images/emoji/emoji_lweigongyiaixin.png'
		        }, {
			        alt: '下班', src: '//img1.famulei.com/common/images/emoji/emoji_lxiaban.png'
		        }, {
			        alt: '吓到了', src: '//img1.famulei.com/common/images/emoji/emoji_lxiadaole.png'
		        }, {
			        alt: '想一想', src: '//img1.famulei.com/common/images/emoji/emoji_lxiangyixiang.png'
		        }, {
			        alt: '笑哈哈', src: '//img1.famulei.com/common/images/emoji/emoji_lxiaohaha.png'
		        }, {
			        alt: '西班牙队加油', src: '//img1.famulei.com/common/images/emoji/emoji_lxibanyajiayou.png'
		        }, {
			        alt: '喜得金牌', src: '//img1.famulei.com/common/images/emoji/emoji_lxidejinpai.png'
		        }, {
			        alt: '羞嗒嗒', src: '//img1.famulei.com/common/images/emoji/emoji_lxiudada.png'
		        }, {
			        alt: '许愿', src: '//img1.famulei.com/common/images/emoji/emoji_lxuyuan.png'
		        }, {
			        alt: '要礼物', src: '//img1.famulei.com/common/images/emoji/emoji_lyaoliwu.png'
		        }, {
			        alt: '意大利队加油', src: '//img1.famulei.com/common/images/emoji/emoji_lyidalijiayou.png'
		        }, {
			        alt: '奥运银牌', src: '//img1.famulei.com/common/images/emoji/emoji_lyinpai.png'
		        }, {
			        alt: '右边亮了', src: '//img1.famulei.com/common/images/emoji/emoji_lyoubianliangle.png'
		        }, {
			        alt: '有鸭梨', src: '//img1.famulei.com/common/images/emoji/emoji_lyouyali.png'
		        }, {
			        alt: '圆蛋快乐', src: '//img1.famulei.com/common/images/emoji/emoji_lyuandankuaile.png'
		        }, {
			        alt: '元宵快乐', src: '//img1.famulei.com/common/images/emoji/emoji_lyuanxiaokuaile.png'
		        }, {
			        alt: '月儿圆', src: '//img1.famulei.com/common/images/emoji/emoji_lyueeryuan.png'
		        }, {
			        alt: '愚人节', src: '//img1.famulei.com/common/images/emoji/emoji_lyurenjie.png'
		        }, {
			        alt: '赞啊', src: '//img1.famulei.com/common/images/emoji/emoji_lzana.png'
		        }, {
			        alt: '招财', src: '//img1.famulei.com/common/images/emoji/emoji_lzhaocai.png'
		        }, {
			        alt: '震惊', src: '//img1.famulei.com/common/images/emoji/emoji_lzhengjing.png'
		        }, {
			        alt: '真v5', src: '//img1.famulei.com/common/images/emoji/emoji_lzhenweiwu.png'
		        }, {
			        alt: '中箭', src: '//img1.famulei.com/common/images/emoji/emoji_lzhongjian.png'
		        }, {
			        alt: '转发', src: '//img1.famulei.com/common/images/emoji/emoji_lzhuanfa.png'
		        }, {
			        alt: '走你', src: '//img1.famulei.com/common/images/emoji/emoji_lzouni.png'
		        }, {
			        alt: '最右', src: '//img1.famulei.com/common/images/emoji/emoji_lzuiyou.png'
		        }
	        ],//小花狸
            }
        },
        mounted () {
	        this.languageList();
	        this.searchInit();
	        // this.searchPhone();
            if (this.$route.name === 'dynamic-article-update') {
                this.requestData({dynamic_id: this.$route.params.id})
            }
            //创建编辑器
	        this.editor = new Editor("#editor_toolbar","#editor_text");
	        this.editor.customConfig.onchange = (html) => {
		        this.formData.content_html = html
	        }
	        this.editor.customConfig.zIndex = 100
	        this.editor.customConfig.uploadImgServer = this.HOST + 'upload_image.php'
	        this.editor.customConfig.uploadFileName = 'image'
	        this.editor.customConfig.uploadImgHeaders = {
		        // 'Accept': '*/*',
		        // 'Authorization':'Bearer ' + token    //头部token
	        }
	        this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024 // 将图片大小限制为 10M
	        this.editor.customConfig.uploadImgMaxLength = 20 // 限制一次最多上传 20 张图片
	        this.editor.customConfig.emotions =[//配置表情
		        {
			        title: '赛高小子',
			        type: 'image',
			        content: this.editor_emoji
		        },
		        {
			        title: '伐木累',
			        type: 'image',
			        content: this.editor_emoji1
		        },
		        {
			        title: '小花狸',
			        type: 'image',
			        content: this.editor_emoji2
		        }
            ]
            this.editor.customConfig.menus = [//菜单
                'head', // 标题
                'bold', // 粗体
                'fontSize', // 字号
                'fontName', // 字体
                'italic', // 斜体
                'underline', // 下划线
                'strikeThrough', // 删除线
                'foreColor', // 文字颜色
                'backColor', // 背景颜色
                'link', // 插入链接
                'list', // 列表
                // 'justify', // 对齐方式
                'quote', // 引用
                'hr',//自定义分割线
                'emoticon', // 表情
                'image', // 插入图片
                // 'table', // 表格
                'video', // 插入视频
                'code', // 插入代码
                'undo', // 撤销
                'redo' // 重复
            ]
	        this.editor.customConfig.uploadImgHooks = {
		        before: function (xhr, editor, files) {
			        // 图片上传之前触发
			        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

			        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
			        // return {
			        //     prevent: true,
			        //     msg: '放弃上传'
			        // }
		        },
		        success: function (xhr, editor, result) {
			        // 图片上传并返回结果，图片插入成功之后触发
			        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
			        this.imgUrl=Object.values(result.data).toString()
		        },
		        fail: function (xhr, editor, result) {
			        // 图片上传并返回结果，但图片插入错误时触发
			        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
		        },
		        error: function (xhr, editor) {
			        // 图片上传出错时触发
			        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
		        },
		        timeout: function (xhr, editor) {
			        // 图片上传超时时触发
			        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
		        },

		        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
		        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
		        customInsert: function (insertImg, result, editor) {
			        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
			        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

			        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
			        let url = Object.values(result.data)      //result.data就是服务器返回的图片名字和链接
			        JSON.stringify(url)    //在这里转成JSON格式
			        insertImg(url)
			        // result 必须是一个 JSON 格式字符串！！！否则报错
		        }
	        }
	        this.editor.create()
        },
        watch: {
            'formData.broadcast_id' (data) {
                this.searchMember(data);
            },
        },
        methods: {
            requestData (params) {
                this.ajax('dynamic/article_info.php', params, (response)=> {
                    if (response.data.code == 200) {

	                    response.data.data.broadcast_id = response.data.data.member_id;
	                    response.data.data.add_time = this.moment(response.data.data.add_time*1000).format('YYYY-MM-DD HH:mm:ss')
                        //
	                    if(response.data.data.video.video_url){
		                    response.data.data.dynamic_type = '1'
	                    }else{
		                    response.data.data.dynamic_type = '0'
	                    }
                        //语音
	                    response.data.data.audio = {
		                    audio_title : response.data.data.sound.audio_title || '',
		                    audio_url : response.data.data.sound.audio_url || '',
		                    seconds : response.data.data.sound.seconds || ''
                        }

                        //视频
	                    response.data.data.video = {
		                    url : response.data.data.video.video_url || '',
		                    image_url : response.data.data.video.image_url || '',
		                    seconds : response.data.data.video.seconds || ''
                        }

	                    this.formData = response.data.data;
	                    this.editor.txt.html(response.data.data.content_html)
                    } else {
                        this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
            requestUpdate () {
                let _this = this
                this.form.loading = true
                if (_this.$route.name === 'dynamic-article-update') {
	                _this.formData.dynamic_id = _this.$route.params.id
                }
                this.ajax('dynamic/save_article.php','post',this.formData, (response)=> {
                    if (response.data.code == 200) {
                        this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        this.$router.push({path: '/dynamic-article-list'})
                    } else {
                        this.$message.error({
                            message: response.data.message,
                        });
                    }
                    this.form.loading = false
                })
            },
            searchMember(query) {
	            this.formSearch.form.action = 'member';
	            this.formSearch.form.query = query;
                this.ajax('_search',this.formSearch.form,(response)=> {
                    this.formSearch.searchMember = response.data.list;
                })
            },
	        searchCircle(query) {
		        this.formSearch.form.action = 'circle_list';
		        this.formSearch.form.op = 'no_qa';
		        this.formSearch.form.query = query;
		        this.formSearch.form.limit = '20';
		        this.ajax('_search',this.formSearch.form,(response)=> {
			        this.formSearch.searchCircle = response.data.list;
		        })
		        return Promise.resolve(/* 这里是需要返回的数据*/)
	        },
	        searchPhone(query) {
		        this.formSearch.form.action = 'phone_model_device';
		        this.formSearch.form.query = query;
		        this.formSearch.form.limit = '20';
		        this.ajax('_search',this.formSearch.form,(response)=> {
			        this.formSearch.searchPhone = response.data.list;
		        })
		        return Promise.resolve(/* 这里是需要返回的数据*/)
	        },
	        searchInit(){
		        this.searchCircle().then(val => {
			        this.searchPhone();
		        });
	        },
	        languageList () {
		        this.loading = true;
		        this.ajax('system/language_list.php', (response)=> {
			        if (response.data.code == 200) {
				        let list = response.data.data;
				        for (let i in list) {
					        this.form.LanguageListOptions.push({
						        name: list[i].display,
						        value: list[i].id,
						        short_name: list[i].short_name,
					        });
				        }
			        }
			        this.loading = false
		        })
	        },
            //图片上传
	        uploadFileBefore () {
		        this.form.uploading = true
	        },
	        uploadFile (response, file, fileList) {
		        if (response.code == 200) {
			        this.$message({
				        message: response.message,
				        type: 'success'
			        });
			        this.formData.cover_url = response.data.image_url;
			        this.formData.cover_url_thumb = response.data.resize_image_url;
		        } else {
			        this.$message.error({
				        message: response.message,
			        });
		        }
		        this.form.uploading = false
	        },
	        uploadFileAudio (response, file, fileList) {
		        if (response.code == 200) {
			        this.$message({
				        message: response.message,
				        type: 'success'
			        });
			        this.formData.audio.audio_url = response.data.image_url
		        } else {
			        this.$message.error({
				        message: response.message,
			        });
		        }
		        this.form.uploading = false
	        },
	        uploadFileVideo (response, file, fileList) {
		        if (response.code == 200) {
			        this.$message({
				        message: response.message,
				        type: 'success'
			        });
			        this.formData.video.image_url = response.data.image_url
		        } else {
			        this.$message.error({
				        message: response.message,
			        });
		        }
		        this.form.uploading = false
	        },
	        uploadProcess (event, file, fileList) {
		        this.form.uploadPercentage = parseInt(event.percent)
	        },
            submit () {
                this.$refs['dynamicArticleForm'].validate((valid) => {
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
    .toolbar{
        border:1px solid #dcdfe6;
        border-radius: 6px 6px 0 0;
    }
    .text{
        border:1px solid #dcdfe6;
        border-top: 0;
        border-radius: 0 0 6px 6px;
    }
    .text img{
        max-width: 100%;
    }
    .text #tmpVedio0{
        min-height: 520px;
    }
</style>
