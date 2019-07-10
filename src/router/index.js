import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '../views/index.vue'

import RoomList from '../views/RoomList.vue'
import RoomUpdate from '../views/RoomUpdate.vue'
import RoomMatchList from '../views/RoomMatchList.vue'

import MatchRoomList from '../views/MatchRoomList.vue'
import MatchRoomUpdate from '../views/MatchRoomUpdate.vue'
import MatchRoomOrderList from '../views/MatchRoomOrderList.vue'

import CombRoomList from '../views/CombRoomList.vue'
import CombRoomUpdate from '../views/CombRoomUpdate.vue'
import CombRoomOrderList from '../views/CombRoomOrderList.vue'

import BannerList from '../views/BannerList.vue'
import BannerUpdate from '../views/BannerUpdate.vue'

import ProductList from '../views/ProductList.vue'
import ProductUpdate from '../views/ProductUpdate.vue'

import PromotionalList from '../views/PromotionalList.vue'
import PromotionalUpdate from '../views/PromotionalUpdate.vue'

import OrderList from '../views/OrderList.vue'

import Faq from '../views/Faq.vue'
import FaqCreate from '../views/FaqCreate.vue'
import FaqList from '../views/FaqList.vue'
import FaqListCreate from '../views/FaqListCreate.vue'
import FaqUser from '../views/FaqUser.vue'
import Editor from '../views/Editor.vue'

import Report from '../views/Report.vue'
import ReportActive from '../views/ReportActive.vue'

import PopList from '../views/PopList.vue'
import PopUpdate from '../views/PopUpdate.vue'

import PlatList from '../views/PlatList.vue'
import PlatUpdate from '../views/PlatUpdate.vue'

import RedBagList from '../views/RedBagList.vue'
import RedBagUpdate from '../views/RedBagUpdate.vue'
import RedBagInfoList from '../views/RedBagInfoList.vue'

import CmsAdvert from '../views/CmsAdvert.vue'
import CmsAdvertUpdate from '../views/CmsAdvertUpdate.vue'

import ThirdParty from '../views/ThirdParty.vue'
import ThirdPartyUpdate from '../views/ThirdPartyUpdate.vue'

import Gift from '../views/Gift.vue'
import GiftUpdate from '../views/GiftUpdate.vue'

import GiftCate from '../views/GiftCate.vue'
import GiftCateUpdate from '../views/GiftCateUpdate.vue'

import RecommendMember from '../views/RecommendMember.vue'
import RecommendMemberUpdate from '../views/RecommendMemberUpdate.vue'

import Daka from '../views/Daka.vue'
import DakaUpdate from '../views/DakaUpdate.vue'

import DakaType from '../views/DakaType.vue'
import DakaTypeUpdate from '../views/DakaTypeUpdate.vue'

import Mlog from '../views/Mlog.vue'

import TeamHistory from '../views/TeamHistory.vue'
import TeamHistoryUpdate from '../views/TeamHistoryUpdate.vue'
import PlayerHistory from '../views/PlayerHistory.vue'
import PlayerHistoryUpdate from '../views/PlayerHistoryUpdate.vue'

import Portfolio from '../views/Portfolio.vue'
import PortfolioUpdate from '../views/PortfolioUpdate.vue'
import Career from '../views/Career.vue'
import CareerUpdate from '../views/CareerUpdate.vue'

import RoyalWarCard from '../views/RoyalWarCard.vue'
import RoyalWarCardUpdate from '../views/RoyalWarCardUpdate.vue'
import RoyalWarResult from '../views/RoyalWarResult.vue'
import RoyalWarResultUpdate from '../views/RoyalWarResultUpdate.vue'

import LivedataManager from '../views/LivedataManager.vue'
import LivedataManagerUpdate from '../views/LivedataManagerUpdate.vue'
import ReportList from '../views/ReportList.vue'
import ReportUpdate from '../views/ReportUpdate.vue'

import DynamicArticleList from '../views/DynamicArticleList.vue'
import DynamicArticleUpdate from '../views/DynamicArticleUpdate.vue'

import PictureList from '../views/PictureList.vue'
import PictureCommentList from '../views/PictureCommentList.vue'

Vue.use(VueRouter);

const router = new VueRouter({
    base: '',
    routes: [
        {path: '/', redirect: '/index'},
        {path: '/index', name:'index',component: Index},

        {path: '/room', name:'room-list',component: RoomList},
        {path: '/room/create',name: 'room-create', component: RoomUpdate},
        {path: '/room/:id',name:'room-update', component: RoomUpdate},

        {path: '/room/match/:id', name:'room-match-list', component: RoomMatchList},
        {path: '/match-room/match/:id', name:'match-room-match-list', component: RoomMatchList},
        {path: '/comb-room/comb/:id', name:'comb-room-match-list', component: RoomMatchList},

        {path: '/match-room', name:'match-room-list',component: MatchRoomList},
        {path: '/match-room/create', name:'match-room-create',component: MatchRoomUpdate},
        {path: '/match-room/:id', name:'match-room-update',component: MatchRoomUpdate},
        {path: '/match-room/order/:id', name:'match-room-order-list',component: MatchRoomOrderList},

        {path: '/comb-room', name:'comb-room-list',component: CombRoomList},
        {path: '/comb-room/create', name:'comb-room-create',component: CombRoomUpdate},
        {path: '/comb-room/:id', name:'comb-room-update',component: CombRoomUpdate},
        {path: '/comb-room/order/:id', name:'comb-room-order-list',component: CombRoomOrderList},

        {path: '/banner', name:'banner-list',component: BannerList},
        {path: '/banner/create',name: 'banner-create', component: BannerUpdate},
        {path: '/banner/:id',name:'banner-update', component: BannerUpdate},

        {path: '/product', name:'product-list',component: ProductList},
        {path: '/product/create',name: 'product-create', component: ProductUpdate},
        {path: '/product/:id',name:'product-update', component: ProductUpdate},

        {path: '/promotional', name:'promotional-list',component: PromotionalList},
        {path: '/promotional/create',name: 'promotional-create', component: PromotionalUpdate},
        {path: '/promotional/:id',name:'promotional-update', component: PromotionalUpdate},

        {path: '/order', name:'order-list',component: OrderList},

        {path: '/faq', name:'faq',component: Faq},
        {path: '/faq/create',name: 'faq-create', component: FaqCreate},
        {path: '/faq/:id',name:'faq-update', component: FaqCreate},
        {path: '/faq-list', name:'faq-list',component: FaqList},
        {path: '/faq-list/create',name: 'faq-list-create', component: FaqListCreate},
        {path: '/faq-list/:id',name: 'faq-list-update', component: FaqListCreate},
        {path: '/faq-user', name:'faq-user',component: FaqUser},
        {path: '/editor', name:'editor',component: Editor},

        {path: '/report', name:'report',component: Report},
        {path: '/report-active', name:'report-active',component: ReportActive},

        {path: '/pop', name:'pop',component: PopList},
        {path: '/pop/create',name: 'pop-create', component: PopUpdate},
        {path: '/pop/:id',name:'pop-update', component: PopUpdate},

        {path: '/plat', name:'plat',component: PlatList},
        {path: '/plat/create',name: 'plat-create', component: PlatUpdate},
        {path: '/plat/:id',name:'plat-update', component: PlatUpdate},

        {path: '/red-bag', name:'red-bag',component: RedBagList},
        {path: '/red-bag/create', name:'red-bag-create',component: RedBagUpdate},
        {path: '/red-bag/:id', name:'red-bag-update',component: RedBagUpdate},
        {path: '/red-bag/info/:id', name:'red-bag-info-list', component: RedBagInfoList},

        {path: '/cms-advert', name:'cms-advert',component: CmsAdvert},
        {path: '/cms-advert/create', name:'cms-advert-create',component: CmsAdvertUpdate},
        {path: '/cms-advert/:id', name:'cms-advert-update',component: CmsAdvertUpdate},

        {path: '/third-party', name:'third-party',component: ThirdParty},
        {path: '/third-party/create', name:'third-party-create',component: ThirdPartyUpdate},
        {path: '/third-party/:id', name:'third-party-update',component: ThirdPartyUpdate},

        {path: '/gift', name:'gift',component: Gift},
        {path: '/gift/create', name:'gift-create',component: GiftUpdate},
        {path: '/gift/:id', name:'gift-update',component: GiftUpdate},

        {path: '/gift-cate', name:'gift-cate',component: GiftCate},
        {path: '/gift-cate/create', name:'gift-cate-create',component: GiftCateUpdate},
        {path: '/gift-cate/:id', name:'gift-cate-update',component: GiftCateUpdate},

        {path: '/recommend-member', name:'recommend-member',component: RecommendMember},
        {path: '/recommend-member/create', name:'recommend-member-create',component: RecommendMemberUpdate},
        {path: '/recommend-member/:id', name:'recommend-member-update',component: RecommendMemberUpdate},
	
	    {path: '/daka', name:'daka',component: Daka},
	    {path: '/daka/create', name:'daka-create',component: DakaUpdate},
	    {path: '/daka/:id', name:'daka-update',component: DakaUpdate},
	
	    {path: '/daka-type', name:'daka-type',component: DakaType},
	    {path: '/daka-type/create', name:'daka-type-create',component: DakaTypeUpdate},
	    {path: '/daka-type/:id', name:'daka-type-update',component: DakaTypeUpdate},
	
	    {path: '/mlog', name:'mlog',component: Mlog},
	
	    {path: '/team-history', name:'team-history',component: TeamHistory},
	    {path: '/team-history/create', name:'team-history-create',component: TeamHistoryUpdate},
	    {path: '/team-history/:id', name:'team-history-update',component: TeamHistoryUpdate},
	    {path: '/player-history', name:'player-history',component: PlayerHistory},
	    {path: '/player-history/create', name:'player-history-create',component: PlayerHistoryUpdate},
	    {path: '/player-history/:id', name:'player-history-update',component: PlayerHistoryUpdate},
     
	    {path: '/portfolio', name:'portfolio',component: Portfolio},
	    {path: '/portfolio/create', name:'portfolio-create',component: PortfolioUpdate},
	    {path: '/portfolio/:id', name:'portfolio-update',component: PortfolioUpdate},
	    {path: '/career', name:'career',component: Career},
	    {path: '/career/create', name:'career-create',component: CareerUpdate},
	    {path: '/career/:id', name:'career-update',component: CareerUpdate},
	
	    {path: '/royal-war-card', name:'royal-war-card',component: RoyalWarCard},
	    {path: '/royal-war-card/create', name:'royal-war-card-create',component: RoyalWarCardUpdate},
	    {path: '/royal-war-card/:id', name:'royal-war-card-update',component: RoyalWarCardUpdate},
	
	    {path: '/royal-war-result', name:'royal-war-result',component: RoyalWarResult},
	    {path: '/royal-war-result/create', name:'royal-war-result-create',component: RoyalWarResultUpdate},
	    {path: '/royal-war-result/:id', name:'royal-war-result-update',component: RoyalWarResultUpdate},
	
	    {path: '/livedata-manager', name:'livedata-manager',component: LivedataManager},
	    {path: '/livedata-manager/create', name:'livedata-manager-create',component: LivedataManagerUpdate},
	    {path: '/livedata-manager/:id', name:'livedata-manager-update',component: LivedataManagerUpdate},
	
	    {path: '/report-list', name:'report-list',component: ReportList},
	    {path: '/report/:id',name:'report-update', component: ReportUpdate},
	
	    {path: '/dynamic-article-list', name:'dynamic-article-list',component: DynamicArticleList},
	    {path: '/dynamic-article/create', name:'dynamic-article-create',component: DynamicArticleUpdate},
	    {path: '/dynamic-article/:id', name:'dynamic-article-update',component: DynamicArticleUpdate},
	
	    {path: '/picture-list/:id', name:'picture-list',component: PictureList},
	    {path: '/picture-comment-list/:id', name:'picture-comment-list',component: PictureCommentList},
    ]
});

export default router