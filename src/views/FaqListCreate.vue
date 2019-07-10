<template>
    <div class="faq-list-create">
        <el-form ref="faqForm" :model="formData" label-position="right" label-width="120px">

            <el-form-item
                :label="'标题（'+items.name+')'"
                v-for="(items,index) in form.LanguageListOptions"
                :key="index"
                v-show="formData.language_id.includes(items.value)"
            >
                <el-input v-if="!items.short_name" v-model="formData.title" class="large" placeholder="请输入标题名称"></el-input>
                <el-input v-else-if="items.short_name == 'en'" v-model="formData.title_en" class="large" placeholder="请输入标题名称"></el-input>
                <el-input v-else v-model="formData.title_tw" class="large" placeholder="请输入标题名称"></el-input>
            </el-form-item>

            <el-form-item label="内容（中文简体)：" v-show="formData.language_id.includes('1')" required style="max-width: 1000px;">
                <div id="editor_toolbar" class="toolbar"></div>
                <div id="editor_text" class="text"></div>
            </el-form-item>

            <el-form-item label="内容（English)：" v-show="formData.language_id.includes('2')" required style="max-width: 1000px;">
                <div id="editor_toolbarEN" class="toolbar"></div>
                <div id="editor_textEN" class="text"></div>
            </el-form-item>

            <el-form-item label="内容（中文繁体)：" v-show="formData.language_id.includes('3')" required style="max-width: 1000px;">
                <div id="editor_toolbarTW" class="toolbar"></div>
                <div id="editor_textTW" class="text"></div>
            </el-form-item>

            <el-form-item label="类别：">
                <el-select v-model="formData.cate_id" placeholder="选择类型" class="full mini">
                    <el-option :label="item.name" :value="item.id" v-for="(item,index) in form.selectOptions" :key="index"></el-option>
                </el-select>
            </el-form-item>

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
	import Editor from 'wangeditor'
	import 'wangeditor/release/wangEditor.min.css'

	export default {
        data () {
            return {
                form: {
                    loading: false,
	                LanguageListOptions:[],
	                selectOptions:{},
                },

                formData: {
                    id: '',
                    content: '',
	                content_en: '',
	                content_tw: '',
                    cate_id:'',
                    title:'',
	                title_en:'',
	                title_tw:'',
	                language_id:['1'],
                    action: 'edit'
                },
            }
        },
        mounted () {
            this.categoryList();
	        this.languageList();

	        //创建编辑器
	        this.editor = new Editor("#editor_toolbar","#editor_text");
	        this.editor.customConfig.onchange = (html) => {
		        this.formData.content = html
	        }
	        this.editor.customConfig.zIndex = 101
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
			        content: this.emoji('emoji_score')
		        },
		        {
			        title: '伐木累',
			        type: 'image',
			        content: this.emoji('emoji_famulei')
		        },
		        {
			        title: '小花狸',
			        type: 'image',
			        content: this.emoji('emoji_xiaohuali')
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
	        //创建编辑器EN
	        this.editorEN = new Editor("#editor_toolbarEN","#editor_textEN");
	        this.editorEN.customConfig.onchange = (html) => {
		        this.formData.content_en = html
	        }
	        this.editorEN.customConfig.zIndex = 100
	        this.editorEN.customConfig.uploadImgServer = this.HOST + 'upload_image.php'
	        this.editorEN.customConfig.uploadFileName = 'image'
	        this.editorEN.customConfig.uploadImgHeaders = {
	        }
	        this.editorEN.customConfig.uploadImgMaxSize = 10 * 1024 * 1024 // 将图片大小限制为 10M
	        this.editorEN.customConfig.uploadImgMaxLength = 20 // 限制一次最多上传 20 张图片
	        this.editorEN.customConfig.emotions =[//配置表情
		        {
			        title: '赛高小子',
			        type: 'image',
			        content: this.emoji('emoji_score')
		        },
		        {
			        title: '伐木累',
			        type: 'image',
			        content: this.emoji('emoji_famulei')
		        },
		        {
			        title: '小花狸',
			        type: 'image',
			        content: this.emoji('emoji_xiaohuali')
		        }
	        ]
	        this.editorEN.customConfig.menus = [//菜单
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
	        this.editorEN.customConfig.uploadImgHooks = {
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
	        this.editorEN.create()
	        //创建编辑器TW
	        this.editorTW = new Editor("#editor_toolbarTW","#editor_textTW");
	        this.editorTW.customConfig.onchange = (html) => {
		        this.formData.content_tw = html
	        }
	        this.editorTW.customConfig.zIndex = 99
	        this.editorTW.customConfig.uploadImgServer = this.HOST + 'upload_image.php'
	        this.editorTW.customConfig.uploadFileName = 'image'
	        this.editorTW.customConfig.uploadImgHeaders = {
	        }
	        this.editorTW.customConfig.uploadImgMaxSize = 10 * 1024 * 1024 // 将图片大小限制为 10M
	        this.editorTW.customConfig.uploadImgMaxLength = 20 // 限制一次最多上传 20 张图片
	        this.editorTW.customConfig.emotions =[//配置表情
		        {
			        title: '赛高小子',
			        type: 'image',
			        content: this.emoji('emoji_score')
		        },
		        {
			        title: '伐木累',
			        type: 'image',
			        content: this.emoji('emoji_famulei')
		        },
		        {
			        title: '小花狸',
			        type: 'image',
			        content: this.emoji('emoji_xiaohuali')
		        }
	        ]
	        this.editorTW.customConfig.menus = [//菜单
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
	        this.editorTW.customConfig.uploadImgHooks = {
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
	        this.editorTW.create()
            //
	        if (this.$route.name === 'faq-list-update') {
		        this.requestData({id: this.$route.params.id})
	        }
        },
        methods: {
            categoryList () {
                this.loading = true
                this.ajax('faq/get_faq_category_list.php',this.tableQueryParams, (response) => {
                    if (response.data.code == 200) {
                        this.form.selectOptions = response.data.data.list
                    }
                    this.loading = false
                })
            },
	        languageList () {
		        this.loading = true;
		        this.ajax('system/language_list.php', (response) => {
			        if (response.data.code == 200) {
				        let list = response.data.data;
				        for (let i in list) {
					        this.form.LanguageListOptions.push({
						        name: list[i].display,
						        value: list[i].id,
						        short_name: list[i].short_name,
					        });
					        if (this.$route.name === 'gift-cate-create') {
						        if (list[i].short_name) {
							        let title = 'title_' + list[i].short_name;
							        eval("this.formData." + title + "=''");//循环添加name键值
						        }
					        }
				        }
			        }
			        this.loading = false
		        })
	        },
            requestData (params) {
                this.ajax('faq/get_faq.php', params, (response) => {
                    if (response.data.code == 200) {
                        let data = response.data.data
                        for (let key in this.formData) {
                            if (data[key]) this.formData[key] = data[key]
                        }
	                    this.editor.txt.html(response.data.data.content)
	                    this.editorEN.txt.html(response.data.data.content_en)
	                    this.editorTW.txt.html(response.data.data.content_tw)
                    } else {
                        this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
            requestUpdate () {
                this.form.loading = true;
                let _api = this.$route.name === 'faq-list-create' ? 'faq/create_faq.php' : 'faq/edit_faq.php';
	            this.formData.language_id = this.formData.language_id.join();
                this.ajax(_api, 'post', this.formData, (response) => {
                    if (response.data.code == 200) {
                        this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                        this.$router.push({path: '/faq-list'})
                    } else {
	                    this.formData.language_id = this.formData.language_id.split(',');
                        this.$message.error({
                            message: response.data.message,
                        });
                    }
                    this.form.loading = false
                })
            },
            submit () {
                this.$refs['faqForm'].validate((valid) => {
                    if (valid) {
                        this.requestUpdate()
                    } else {
                        return false;
                    }
                });
            },

        },
    }
</script>

<style>
    .toolbar{
        border:1px solid #dcdfe6;
        border-radius: 6px 6px 0 0;
        position: relative;
        z-index: 98;
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
