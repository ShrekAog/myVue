import { parseUserToken } from '@/api/api'
import { createRouter, createWebHistory } from 'vue-router'
import nProgress from 'nprogress'
import { parse } from 'vue/compiler-sfc'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
	{
		path: '/:catchAll(.*)',
		name: '404',
		component: () => import('../components/404.vue')
	},
    {
      path: '/',
      component: () => import('../views/home.vue'),
	  children:[{
			path: '/',
			name: 'index',
			component: () => import('../components/index.vue')
		},
		{
			path: '/content',
			name: 'content',
			component: () => import('../views/content.vue'),
			children:[{
				path: '/suibi',
				name: 'suibi',
				component: () => import('../components/suibi.vue')
			}]
		},
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
				title: '搜索引擎',
				role:['admin','user']
			},
			component: () => import('../components/admin/engine.vue')
		},{
			path: 'index',
			name: 'adminIndex',
			meta:{
				role:['admin','user']
			},
			component: () => import('../components/admin/index.vue')
		},{
			path: 'router',
			name: 'router',
			meta:{
				title: '路由管理',
				role:['admin','user']
			},
			component: () => import('../components/admin/router.vue')
		},{
			path: 'images',
			name: 'images',
			meta:{
				title: '图库',
				role:['admin','user']
			},
			component: () => import('../components/admin/images.vue'),
		},{
			path: 'images/classify',
			name: 'classify',
			meta:{
				title: '资源分类',
				role:['admin','user']
			},
			component: () => import('../components/admin/classify/classify.vue'),
		},{
			path: 'images/icon',
			name: 'icon',
			meta:{
				title:"图标库",
				role:['admin','user']
			},
			component: () => import('../components/admin/icon.vue')
		},{
			path: 'images/classify/list',
			name: 'classifyList',
			meta:{
				title:'资源分类',
				role:['admin','user']
			},
			component: () => import('../components/admin/classify/classifyImageList.vue'),
		},
		{
			path: 'config',
			name: '配置',
			meta:{
				title:'设置',
				role:['admin','user']
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

router.beforeEach(async (to,from,next) => {
	
	nProgress.start();
	if(to.path.startsWith("/admin")){
		//没有token
		if(!localStorage.getItem("token")){
			next({path:"/login"});
			return;
		}
		
		const parseToken = await parseUserToken(localStorage.getItem("token"));
		if(parseToken.data.success){
			const requiredRoles = to.meta.role || [];
			const userType = parseToken.data.data == 1 ? 'admin' : 'user';
			if(requiredRoles.includes(userType) && includesRouter(to.path)){
				next();
			}else{
				if(!localStorage.getItem("router")){
					next({path:"/login"})
				}else{
					if(to.name == "classifyList"){
						next(); //资源分类列表
						return;
					}
					next({path:'/admin/index'})
				}
			}
		}else{
			next({path:"/login"})
		}
	}else {
		next();
	}
	
})
router.afterEach(() => {
	nProgress.done();
})

//判断用户通过url路由跳转时是否具备该页面权限
const includesRouter = (path) => {
	const userRouter = JSON.parse(localStorage.getItem("router"));
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

export default router
