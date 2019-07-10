<template>
    <!--<div id="app" class="container">-->
    <div id="app">
        <div class="app-wrapper">
            <div class="tags-navbar tags-view-container">
                <div class="tags-view-container tags-navbar">
                    <div class="scroll-container tags-view-wrapper" ref="scrollContainer">
                        <div class="scroll-wrapper" v-if="cmsFrom">
                            <img src="./assets/images/logo_1.png"  class="logo"/>
                            <font class="title">幻联赛后台管理</font>
                        </div>
                        <div style="float: right; margin-right: 20px; cursor: pointer;" @click="backCMSBtn()">返回CMS</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-container">
            <div class="scroll-container sidebar-container">
                <div class="scroll-wrapper">
                    <div role="menubar" class="el-menu">
                        <div class="menu-wrapper">
                            <el-menu :default-active="navActive" mode="horizontal" @select="handleSelect" router background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
                                <el-menu-item :index="item.path" :key="index" :class="{'is-active':fullPath.indexOf(item.name) == 0}" v-for="(item,index) in navList" style="width: 100%">{{item.name}}</el-menu-item>
                            </el-menu>
                        </div>
                    </div>
                </div>
            </div>
            <div class="app-main">
                <div class="app-container calendar-list-container">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <!--<el-menu :default-active="navActive" mode="horizontal" @select="handleSelect" router>-->
            <!--<el-menu-item :index="item.path" :key="index" :class="{'is-active':fullPath.indexOf(item.name) == 0}" v-for="(item,index) in navList">{{item.name}}</el-menu-item>-->
            <!--<el-menu-item index="/index_admin" style="float: right">返回CMS</el-menu-item>-->
        <!--</el-menu>-->
        <!--<router-view></router-view>-->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                navList: [
//                    {path: '/room', name: '房间管理'},
//                    {path: '/banner', name: '轮播管理'},
                ],
                role:[],
                cms_link: '/index_admin',
                navActive: '1',
              cmsFrom:true
            }
        },
        created:function(){
            this.cmsFrom = false
            if(this.$route.name === 'red-bag'){
                this.navList = [
                    {path: '/red-bag',name: '红包管理'}
                ]
            }else if(this.$route.name === 'cms-advert'){
                this.navList = [
                    {path: '/cms-advert',name: 'CMS广告管理'}
                ]
            }else if(this.$route.name === 'recommend-member'){
                this.navList = [
                    {path: '/recommend-member',name: '推荐关注管理'}
                ]
            }else if(this.$route.name === 'gift' || this.$route.name === 'gift-cate'){
                this.navList = [
                    {path: '/gift',name: '礼物管理'},
                    {path: '/gift-cate',name: '礼物分类管理'}
                ]
            }else if(this.$route.name === 'daka' || this.$route.name === 'daka-type'){
	            this.navList = [
		            {path: '/daka',name: '卡片管理'},
		            {path: '/daka-type',name: '卡片类型管理'}
	            ]
            }else if(this.$route.name === 'mlog'){
	            this.navList = [
		            {path: '/mlog',name: '报表导出记录'}
	            ]
            }else if(this.$route.name === 'report-list' || this.$route.name === 'report-update'){
	            this.navList = [
		            {path: '/report-list',name: '举报管理'}
	            ]
            }else if(this.$route.name === 'team-history' || this.$route.name === 'team-history-create' || this.$route.name === 'team-history-update' || this.$route.name === 'player-history' || this.$route.name === 'player-history-create' || this.$route.name === 'player-history-update' || this.$route.name === 'portfolio' || this.$route.name === 'portfolio-create' || this.$route.name === 'portfolio-update' || this.$route.name === 'career' || this.$route.name === 'career-create' || this.$route.name === 'career-update'){
	            this.navList = [
	            ]
            }else if(this.$route.name === 'royal-war-card' || this.$route.name === 'royal-war-card-create' || this.$route.name === 'royal-war-card-update' || this.$route.name === 'royal-war-result' || this.$route.name === 'royal-war-result-create' || this.$route.name === 'royal-war-result-update') {
	            this.navList = [
		            {path: '/royal-war-card', name: '卡牌管理'}
	            ]
            }else if(this.$route.name === 'livedata-manager' || this.$route.name === 'livedata-manager-create' || this.$route.name === 'livedata-manager-update'){
	            this.navList = [
		            {path: '/livedata-manager', name: '实时数据管理'}
	            ]
            }else if(this.$route.name === 'dynamic-article-list' || this.$route.name === 'dynamic-article-create' || this.$route.name === 'dynamic-article-update'){
	            this.navList = [
		            {path: '/dynamic-article-list', name: '贴子_文章'}
	            ]
            }else if(this.$route.name === 'picture-list'){
	            this.navList = [
		            {path: '/picture-list/'+this.$route.params.id, name: '图集管理'}
	            ]
            }else{
                this.ajax('fantasy_role.php', (response) => {
                    if(response.data.data){
                    	this.cmsFrom = true
                        this.navList = response.data.data;
                        for(var i=0;i<this.navList.length;i++){
                            this.role.unshift(this.navList[i].path);
                        }
                    }else{
                        location.href = '/index_admin';
                    }
                });
            }
        },
        computed: {
            fullPath() {
//            	var PATH = this.$route.path;
//                this.navList.forEach(function(item){
//                    if (item.path == PATH) {
//                        console.log(item.name);
//                    }
//                });
                return this.$route.fullPath
            }
        },
        mounted () {
//            this.roleList()
        },
        methods: {
            handleSelect(key, keyPath) {
//                console.log(key, keyPath);
                if (key === '/index_admin') {
                    location.href = '/index_admin';
                }
            },
	        backCMSBtn () {
		        var HOST = location.host;
		        var HOST_url = '';
		        if ( HOST.indexOf('dev-admin') >= 0 || HOST.indexOf('localhost') >= 0) {
			        HOST_url = 'dev-';
		        } else if (HOST.indexOf('staging-admin') >= 0) {
			        HOST_url = 'staging-';
		        }
		        var HOST_pathname = 'http://' + HOST_url + 'admin.famulei.com';
		        location.href = HOST_pathname + this.cms_link;
            }
        }
    }
</script>

<style lang="stylus" >
    @import './style/index.styl'
    .app-main {
        padding-top: 58px;
    }
    .app-wrapper {
        @include clearfix;
        position: relative;
        /*height: 100%;*/
        width: 100%;
    }
    .tags-navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        background-color: #304156;
        position: fixed;
        z-index: 1001;
        width: 100%;
        color:white;

    }

    .scroll-container {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: $menuBg;
        .scroll-wrapper {
            position: absolute;
            /*width: 100%!important;*/
        }
    }

    .tags-view-container {
        .logo {
            display: inline-block;
            transition: width 0.28s;
            width: 35px!important;
            height: 35px;
            margin-right: 10px;
            margin-left: 10px;
            vertical-align: sub;
        }
        .title{
            font-size: 20px;
            font-weight: bold;
            vertical-align: super;
        }
        .navbar {
            height: 50px;
            line-height: 50px;
            border-radius: 0px !important;
            background-color: #304156;
            position: fixed;
            top: 0;
            right: 0;
            z-index: 1001;
            width: 0;
            color:white;

            .errLog-container {
                display: inline-block;
                vertical-align: top;
                color:white;
            }
            .right-menu {
                color:white;
                float: right;
                height: 100%;
                &:focus{
                    outline: none;
                }
                .right-menu-item {
                    display: inline-block;
                    margin: 0 8px;
                    color:white;
                }
                .screenfull {
                    height: 20px;
                    color:white;
                }
                .international{
                    vertical-align: top;
                    color:white;
                }
                .theme-switch {
                    vertical-align: 15px;
                    color:white;
                }
                .avatar-container {
                    height: 50px;
                    margin-right: 30px;
                    .avatar-wrapper {
                        cursor: pointer;
                        margin-top: 5px;
                        position: relative;
                        .user-avatar {
                            width: 40px;
                            height: 40px;
                            border-radius: 10px;
                            color:white;
                        }
                        .el-icon-caret-bottom {
                            position: absolute;
                            right: -20px;
                            top: 25px;
                            font-size: 12px;
                            color:white;
                        }
                    }
                }
            }
        }
        .tags-view-wrapper {
            background: #304156;
            height: 50px;
            border-bottom: 1px solid #d8dce5;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
            .tags-view-item {
                display: inline-block;
                position: relative;
                height: 26px;
                line-height: 26px;
                border: 1px solid #495060;
                color: #fff;
                background: #495060;
                padding: 0 8px;
                font-size: 12px;
                margin-left: 5px;
                margin-top: 4px;
                vertical-align: super;
                &:first-of-type {
                    margin-left: 15px;
                }
                &.active {
                    background-color: #42b983;
                    color: #fff;
                    border-color: #42b983;
                    &::before {
                        content: '';
                        background: #fff;
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        position: relative;
                        margin-right: 2px;
                    }
                }
            }
        }
        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 2;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
            li {
                margin: 0;
                padding: 7px 16px;
                cursor: pointer;
                &:hover {
                    background: #eee;
                }
            }
        }
    }
</style>

<style lang="stylus">
    //reset element css of el-icon-close

</style>