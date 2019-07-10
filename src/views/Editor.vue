<template>
    <div>
        <el-upload
                :on-success="handleSuccess"
                :max-size="2048"
                multiple
                :action="this.HOST + 'upload_image.php'"
        >
            <el-button type="primary" icon="picture">选择图片</el-button>
        </el-upload>
        <quill-editor
                v-model="content"
                :options="editorOption"
                ref="QuillEditor">
        </quill-editor>
    </div>
</template>
<script>
	import {quillEditor} from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	// 工具栏配置
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['blockquote', 'code-block'],

		[{'header': 1}, {'header': 2}],               // custom button values
		[{'list': 'ordered'}, {'list': 'bullet'}],
		[{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
		[{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
		[{'direction': 'rtl'}],                         // text direction

		[{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
		[{'header': [1, 2, 3, 4, 5, 6, false]}],

		[{'color': []}, {'background': []}],          // dropdown with defaults from theme
		[{'font': []}],
		[{'align': []}],
		['link', 'image', 'video'],
		['clean']                                         // remove formatting button
	];
    export default {
        data() {
            return {
	            formData: {
		            id: '',
		            content: '',
		            cate_id:'',
		            title:'',
		            language_id:[],
		            action: 'edit'
	            },
	            content: '',
	            editorOption: {
		            modules: {
			            toolbar: {
				            container: toolbarOptions,  // 工具栏
				            handlers: {
					            'image': function (value) {
						            if (value) {
							            alert('自定义图片')
						            } else {
							            this.quill.format('image', false);
						            }
					            }
				            }
			            }
		            }
	            }
            }
        },
        methods: {
	        handleSuccess (res) {
		        // 获取富文本组件实例
		        let quill = this.$refs.QuillEditor.quill
		        // 如果上传成功
		        if (res) {
			        // 获取光标所在位置
			        let length = quill.getSelection().index;
			        // 插入图片，res为服务器返回的图片链接地址
			        quill.insertEmbed(length, 'image', res)
			        // 调整光标到最后
			        quill.setSelection(length + 1)
		        } else {
			        // 提示信息，需引入Message
			        Message.error('图片插入失败')
		        }
	        },
        },
        computed:{
            editor() {
                // return this.$refs.myTextEditor.quill
            }
        },
        components: {
	        quillEditor
        },
        mounted(){

        },
        watch:{
            // 'value'(newVal, oldVal) {
            //     if (this.editor) {
            //         if (newVal !== this.content) {
            //             this.content = newVal
            //         }
            //     }
            // },
        }
    }

</script>