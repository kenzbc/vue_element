import Vue from 'vue'
import Vuex from 'vuex'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style.css'
import App from './App.vue'

import router from './router'

import axios from 'axios'
import moment from 'moment'
import 'moment/locale/zh-cn'
import $ from 'jquery'
import qs from 'qs'

import emoji from './utils/emoji.js'
import VueCropper from 'vue-cropper'

Vue.use(Vuex)
Vue.use(ElementUI)
//表情
Vue.use(emoji);
//图片裁剪
Vue.use(VueCropper)

const HOST = '/services/fantasy/';

Vue.prototype.axios = axios
Vue.prototype.ajax = function () {
	let _host = HOST
	let _params = {}
	let _method = 'get'
	let _then = null
	let _catch = null
	for (let i = 1;i < arguments.length;i++) {
		if (typeof arguments[i] === 'string') {
			_method = arguments[i]
		} else if (typeof arguments[i] === 'object') {
			_params = arguments[i]
		} else if (typeof arguments[i] === 'function' && !_then) {
			_then = arguments[i]
		} else if (typeof arguments[i] === 'function' && !_catch) {
			_catch = arguments[i]
		}
	}
	if(arguments[0].indexOf('faq/') == 0 || arguments[0].indexOf('welfare/') == 0 || arguments[0].indexOf('member/') == 0 || arguments[0].indexOf('match/') == 0 || arguments[0].indexOf('advert_info/') == 0 || arguments[0].indexOf('system/') == 0 || arguments[0].indexOf('dynamic/') == 0){
		_host = '/services/'
		// _host = 'https://staging-admin.famulei.com/services/'
	}else if(arguments[0].indexOf('_search') == 0 || arguments[0].indexOf('mlog_list') == 0){
		_host = '/'
	}
	let _config = {
		method: _method,
		url: arguments[0],
		baseURL: _host,
		headers: {
			'Request-Type': 'json',
			'X-Requested-With': 'XMLHttpRequest'
		},
		withCredentials: true
	}
	if (_method === 'get') {
		_config.params = _params
	} else {
		_config.data = qs.stringify(_params)
	}
	
	axios(_config).then(function (response) {
		if (response.data.code === '100') {
			location.href = location.protocol + '//' + location.host + '/login'
		} else {
			if (_then) _then(response)
		}
	}).catch(_catch)
};
Vue.prototype.ajax = function () {
    let _host = HOST
    let _params = {}
    let _method = 'get'
    let _then = null
    let _catch = null
    for (let i = 1;i < arguments.length;i++) {
        if (typeof arguments[i] === 'string') {
            _method = arguments[i]
        } else if (typeof arguments[i] === 'object') {
            _params = arguments[i]
        } else if (typeof arguments[i] === 'function' && !_then) {
            _then = arguments[i]
        } else if (typeof arguments[i] === 'function' && !_catch) {
            _catch = arguments[i]
        }
    }
    if(arguments[0].indexOf('faq/') == 0 || arguments[0].indexOf('welfare/') == 0 || arguments[0].indexOf('member/') == 0 || arguments[0].indexOf('match/') == 0 || arguments[0].indexOf('advert_info/') == 0 || arguments[0].indexOf('system/') == 0 || arguments[0].indexOf('dynamic/') == 0){
        _host = '/services/'
        // _host = 'https://staging-admin.famulei.com/services/'
    }else if(arguments[0].indexOf('_search') == 0 || arguments[0].indexOf('mlog_list') == 0){
        _host = '/'
    }
    let _config = {
        method: _method,
        url: arguments[0],
        baseURL: _host,
        headers: {
            'Request-Type': 'json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
    }
    if (_method === 'get') {
        _config.params = _params
    } else {
        _config.data = qs.stringify(_params)
    }

    axios(_config).then(function (response) {
        if (response.data.code === '100') {
            location.href = location.protocol + '//' + location.host + '/login'
        } else {
            if (_then) _then(response)
        }
    }).catch(_catch)
};

Vue.prototype.moment = moment
Vue.prototype.$ = $
Vue.prototype.HOST = HOST

Vue.filter('datetime', function (value, format) {
    let type = ''
    if (typeof value ==='number') {
        type = 'X'
    }
    return moment(value, type).format(format || 'YYYY-MM-DD HH:mm:ss')
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
