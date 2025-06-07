import { ElMessage, ElNotification } from 'element-plus';
import axiosInstance from '@/utils/axiosConfig';
import router from '@/router';

// a	动画
// b	漫画
// c	游戏
// d	文学
// e	原创
// f	来自网络
// g	其他
// h	影视
// i	诗词
// j	网易云
// k	哲学
// l	抖机灵

export const yiyan = (params = '') => {
	const url = new URL("https://international.v1.hitokoto.cn/");
	const keys = params.split(',');
	keys.forEach(key => {
		if(key){
			url.searchParams.append('c',key)
		}
	})
	return axiosInstance.get(url);
}

export const elNotification = (title,message,type) => {
	ElNotification({
		title:title,
		message:message,
		type:type
	})
}

export const showElMsg = (type,message) => {
	ElMessage({
		type:type,
		message:message
	})
}

export const showElMsgBox = (message,title,type,callback) => {
	ElMessageBox.confirm(
		message,
		title,
		{
			confirmButtonText:'确定',
			cancelButtonText:'取消',
			type:type
		}
	).then(() => {
		callback();
	})
}

//admin start login
export const userLogin = async (userForm) => {
	return axiosInstance.post("/api/users/login",userForm);
}
export const userRegister = async (registerForm) => {
	return axiosInstance.post("/api/users/register",registerForm);
}
export const checkUsernameExist = async (username) => {
	return axiosInstance.get("/api/users/checkUsername",{params:{username:username}});
}

//admin end login

//admin start user
export const parseUserToken = async (token) => {
	return axiosInstance.get("/api/users/parseUserToken",{params:{token:token}})
}

export const getUserInfoByToken = async (token) => {
	return axiosInstance.get("/api/users/getUserInfo",{params:{token:token}})
}

export const getUserInfoById = async (id) => {
	return axiosInstance.get(`/api/users/getUserInfo/${id}`);
}

export const updateUser = async (user) => {
	return axiosInstance.put("/api/users/update",user);
}

export const outLogin = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("router");
	router.push({path:'/login'})
}


//admin end user


//admin start router

//根据用户类型获取路由列表
export const getUserRouters = async (userType) => {
	return await axiosInstance.get(`/api/users/routers/${userType}`);
}
//获取所有路由菜单
export const getRouterList = async () => {
	return await axiosInstance.get("/api/users/router/getRouterList");
}
//更新路由菜单
export const updateRouter = async (router) => {
	return await axiosInstance.put("/api/users/routers/updateRouter",router)
}
//新增根路由
export const addRouter = async (router) => {
	return await axiosInstance.put("/api/users/router/addRouter",router)
}
export const updateRouterStatus = async (router) => {
	return await axiosInstance.put("/api/users/router/updateRouterStatus",router)
}
//删除路由表
export const removeRouter = async (id) => {
	return await axiosInstance.delete("/api/users/router/removeRouter",{
		params:{
			id:id
		}
	})
}
//admin end router


//admin start resource

//获取所有资源
export const getResourceList = async (params) => {
	return await axiosInstance.get("/api/resource/list",{params:params});
}
export const getResourceByList = async () => {
	return await axiosInstance.get("/api/resource/byList");
}

//获取单个资源
export const getResourceById = async (id) => {
	return await axiosInstance.get("/api/resource/getOne",{params:{id:id}})
}

//上传图片
export const uploadImg = (formData,onUploadPro) => {
	return axiosInstance.post("/api/resource/upload",formData,{
		timeout:0,
		onUploadProgress:(progressEvent) => {
			onUploadPro(progressEvent)
		}
	})
}
//根据资源对象修改status
export const updateStatus = async (resource) => {
	return await axiosInstance.put('/api/resource/updateStatus',resource)
}
//根据ID删除资源
export const deleteResource = async (id) => {
	return await axiosInstance.delete('/api/resource/delete',{
		params:{
			id:id
		}
	})
}
//删除多个
export const deleteResourceList = async (list) => {
	return await axiosInstance.delete('/api/resource/deleteList',{data:list})
}

//admin end resource

//admin start engine

//获取引擎列表
export const getEngineList = async () => {
	return await axiosInstance.get('/api/engine/list')
}
//修改引擎数据
export const putEngine = async (engine) => {
	return await axiosInstance.put('/api/engine/put',engine)
}
//删除引擎
export const deleteEngine = async (id) => {
	return await axiosInstance.delete('/api/engine/del',{params:{
		id:id
	}})
}

//admin end engine

//admin start classify

//获取目录
export const getfyList = async () => {
	return await axiosInstance.get('/api/classify/classifyList')
}

export const getstatusList = async () => {
	return await axiosInstance.get('/api/classify/getStatusList')
}

//修改目录
export const updateClassify = async (resourcePath) => {
	return await axiosInstance.put('/api/classify/update',resourcePath)
}

//删除目录
export const deleteClassify = async (id) => {
	return await axiosInstance.delete('/api/classify/delete',{params:{id:id}})
}

//新增目录
export const insertClassify = async (resourcePath) => {
	return await axiosInstance.post('/api/classify/insert',resourcePath)
}

//根据目录id获取所有分类
export const getListByClassifyId = async (id) => {
	return await axiosInstance.get(`/api/classify/getClassifyListById/${id}`)
}

// admin end classify




//config
export const getConfigList = async () => {
	return await axiosInstance.get('/api/config/list')
}

export const getWallpaperConfig = async () => {
	return await axiosInstance.get('/api/config/wallpaperList')
}

export const getLoginWallpaperConfig = async () => {
	return await axiosInstance.get('/api/config/getLoginWallpaperConfig');
}

export const getRegisterWallpaperConfig = async () => {
	return await axiosInstance.get('/api/config/getRegisterWallpaperConfig')
}

export const updateWallpaperConfig = async (value) => {
	return await axiosInstance.put('/api/config/updateWallpaperConfig',null,{params:{value:value}})
	
}
export const updateLoginWallpaperConfig = async (value) => {
	return await axiosInstance.put('/api/config/updateLoginWallpaperConfig',null,{params:{value:value}})
	
}
export const updateRegisterWallpaperConfig = async (value) => {
	return await axiosInstance.put('/api/config/updateRegisterWallpaperConfig',null,{params:{value:value}})
}
