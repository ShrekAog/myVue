import { createRouter, createWebHistory } from 'vue-router'
import nProgress from 'nprogress'
import {checkTokenIsExpired,elNotification,showElMsg} from "@/api/api"
import store from '@/store/store'

const Routes404 = [
	{
		path: '/:catchAll(.*)',
		name: '404',
		component: () => import('../components/404.vue')
	}
]

const photosRoutes = [
	{
		path:'photos',
		name: 'photos',
		component: () => import('../components/home/photos/photos.vue'),
	},
	{
		path: 'photos/photosSetting',
		name: 'photosSetting',
		component: () => import('../components/home/photos/photosSetting.vue')
	},
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
	...Routes404,
    {
      path: '/',
      component: () => import('../views/home.vue'),
	  children:[
		{
			path: '/',
			name: 'index',
			component: () => import('../components/index.vue')
		},
		{
			path: '/homelogin',
			name: 'homeLogin',
			component: () => import('../components/home/login.vue')
		},
		{
			path: '/content',
			name: 'content',
			component: () => import('../views/content.vue'),
			children:[{
				path: '/suibi',
				name: 'suibi',
				component: () => import('../components/home/suibi/suibi.vue')
			}]
		},
		...photosRoutes
		
	  ]
    },
	{
		path: '/admin',
		name: 'admin',
		redirect: '/admin/index',
		meta:{
			title: '首页'
		},
		component: () => import('../components/admin/admin.vue'),
		children:[{
			path: 'engine',
			name: 'engine',
			meta:{
				title: '搜索引擎'
			},
			component: () => import('../components/admin/engine.vue')
		},{
			path: 'index',
			name: 'adminIndex',
			component: () => import('../components/admin/index.vue')
		},{
			path: 'router',
			name: 'router',
			meta:{
				title: '路由管理'
			},
			component: () => import('../components/admin/router.vue')
		},{
			path: 'images',
			name: 'images',
			meta:{
				title: '图库'
			},
			component: () => import('../components/admin/images.vue'),
		},{
			path: 'images/classify',
			name: 'classify',
			meta:{
				title: '资源分类'
			},
			component: () => import('../components/admin/classify/classify.vue'),
		},{
			path: 'images/icon',
			name: 'icon',
			meta:{
				title:"图标库"
			},
			component: () => import('../components/admin/icon.vue')
		},{
			path: 'images/classify/list',
			name: 'classifyList',
			meta:{
				title:'资源分类'
			},
			component: () => import('../components/admin/classify/classifyImageList.vue'),
		},
		{
			path: 'config',
			name: '配置',
			meta:{
				title:'设置'
			},
			component: () => import('../components/admin/config.vue')
		}
	  ],
	},{
		  path: '/login',
		  name: 'login',
		  meta:{
		  	title:'登录'
		  },
		  component: () => import('../components/admin/login.vue')
	  },{
		  path: '/register',
		  name: 'rigister',
		  meta:{
			  title:'注册'
		  },
		  component: () => import('../components/admin/register.vue')
	  }
  ],
})

const whiteList = ['/','/homelogin'];

router.beforeEach(async (to,from,next) => {
	
	nProgress.start();
	
	
	
	let token = store.state.user.token;
	let isExpired = await checkToken();
	
	
	if(whiteList.includes(to.path)){
		next();
		return;
	}
	
	if(!token || isExpired){
		elNotification("警告","请先登录","warning")
		next({path:'/homelogin'});
		return;
	}
	next();
	
	/* if(to.path.startsWith("/admin")){
		let isExpired = await checkToken();
		if(isExpired){
			console.log("令牌已过期或不存在");
			next({path:"/login"});
			return;
		}
		//没有菜单 说明第一次登录后台
		if(store.state.user.routers <= 0){
			next({path:"/login"});
			return;
		}
		
		const parseToken = store.state.user.userType;
		if(parseToken){
			
			const userType = parseToken == 1 ? 'admin' : 'user';
			if(includesRouter(to.path)){
				next();
			}else{
				if(!store.state.user.routers){
					next({path:"/login"})
				}else{
					if(to.name == "classifyList"){
						next(); //资源分类列表
						return;
					}
					next({path:`/admin/index`})
				}
			}
		}else{
			next({path:"/login"})
		}
	}else {
		next();
	} */
})
router.afterEach(() => {
	nProgress.done();
})

//判断用户通过url路由跳转时是否具备该页面权限
const includesRouter = (path) => {
	const userRouter = store.state.user.routers;
	if(userRouter){
		return userRouter.some(item => {
			if(item.path == path){
				return true;
			}
			if(item.children && item.children.length >= 1){
				return item.children.some(chil => chil.path == path);
			}
		})
	}
	return false;
}
const checkToken = async () => {
		if(!store.state.user.token){ return null };
		let data = await checkTokenIsExpired(store.state.user.token);
		//被servlet拦截过期之后data为undefined，因为走不到springboot异常捕获。
		if(!data){
			store.commit("user/outLogin");
			return true;
		}
		
		if(data.data.data){
			store.commit("user/outLogin");
			return true;
		}
		return false;
	}

export default router
