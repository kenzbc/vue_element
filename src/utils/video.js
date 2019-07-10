import { Quill } from 'vue-quill-editor'

// 源码中是import直接倒入，这里要用Quill.import引入
const BlockEmbed = Quill.import('blots/block/embed')
const Link = Quill.import('formats/link')

const ATTRIBUTES = ['height', 'width']
class Video extends BlockEmbed {
	static create (value) {
		const node = super.create(value)
		// 添加video标签所需的属性
		// node.setAttribute('controls', 'controls')
		// node.setAttribute('type', 'video/mp4')
		// node.setAttribute('src', this.sanitize(value))
		//iframe
		let video_params = {
			video_tx : '//v.qq.com/x',//腾讯视频
			video_youku : '//v.youku.com',//优酷视频
			video_url : this.sanitize(value),
			video_src : this.sanitize(value),
		};
		if (video_params.video_url.includes(video_params.video_tx)) {
			//截取腾讯视频地址
			var video_url_html = video_params.video_url.substr(0,video_params.video_url.lastIndexOf('.html'));
			var video_url_id = video_url_html.substr(video_url_html.lastIndexOf('/')+1,video_url_html.length);
			video_params.video_src = 'https://v.qq.com/iframe/player.html?vid='+video_url_id+'&tiny=0&auto=0';
		}else if(video_params.video_url.includes(video_params.video_youku)){
			//截取优酷视频地址
			var video_url_html = video_params.video_url.substr(0,video_params.video_url.lastIndexOf('?'));
			var video_url_id = video_url_html.substr(video_url_html.lastIndexOf('/id_')+4,video_url_html.length);
			video_params.video_src = 'https://player.youku.com/embed/'+video_url_id;
			//https://v.youku.com/v_show/id_XNDA3MjQxNTg3Mg==?tdsourcetag=s_pctim_aiomsg&qq-pf-to=pcqq.c2c
			//http://player.youku.com/player.php/sid/XNDA3MjQxNTg3Mg==/v.swf
			//<iframe height=498 width=510 src='http://player.youku.com/embed/XNDA3MjQxNTg3Mg==' frameborder=0 'allowfullscreen'></iframe>
		}
		node.setAttribute('frameborder', '0');
		node.setAttribute('width', '100%');
		node.setAttribute('allowfullscreen', 'allowfullscreen');
		node.setAttribute('src', video_params.video_src);
		node.setAttribute('video_url', video_params.video_url);
		return node
	}
	
	static formats (domNode) {
		return ATTRIBUTES.reduce((formats, attribute) => {
			if (domNode.hasAttribute(attribute)) {
				formats[attribute] = domNode.getAttribute(attribute)
			}
			return formats
		}, {})
	}
	
	static sanitize (url) {
		return Link.sanitize(url) // eslint-disable-line import/no-named-as-default-member
	}
	
	static value (domNode) {
		return domNode.getAttribute('src')
	}
	
	format (name, value) {
		if (ATTRIBUTES.indexOf(name) > -1) {
			if (value) {
				this.domNode.setAttribute(name, value)
			} else {
				this.domNode.removeAttribute(name)
			}
		} else {
			super.format(name, value)
		}
	}
	
	html () {
		const { video } = this.value()
		return `<a href="${video}">${video}</a>`
	}
}
Video.blotName = 'video' // 这里不用改，楼主不用iframe，直接替换掉原来，如果需要也可以保留原来的，这里用个新的blot
Video.className = 'ql-video'
Video.tagName = 'iframe' // 用video标签替换iframe

export default Video