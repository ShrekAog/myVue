import axios from 'axios';
import { showElMsg,elNotification } from '@/api/api'
import router from '@/router';
import store from '@/store/store'
import loginVue from '@/components/home/login.vue';
const baseUrl = "http://192.168.1.220:8080"
const baseUrlWaiWang = "https://api.konosubaz.cn:49327"
let hasShowMessage = false;
const axiosInstance = axios.create({
	baseURL:baseUrl,
	timeout:5000
})
axiosInstance.interceptors.request.use(
	config => {
		// console.log(config)
		const token = store.state.user.token;
		if(token){
			config.headers["Authorization"] = token
		}
		return config
	},
	err => {
		console.log(err)
	}
)
axiosInstance.interceptors.response.use(
	response => {
		 // console.log(response)
		console.log("正常访问:" + response.config.url)
		if(!hasShowMessage && !response.data.success){
			hasShowMessage = true;
			//令牌过期
			console.log(response)
			if(response.data.code == 10001){
				if(store.state.user.token){
					elNotification("身份过期","请重新登录","warning");
				}
				store.commit("user/outLogin");
				// router.push("/login")
				return;
			}
			if(response.data.code == 10002){
				elNotification("用户无权限","无法修改","error");
				console.log("无权限访问:" + response.config.url);
				return;
			}
		}
		setTimeout(() => hasShowMessage = false,5000);
		return response;
	},
	err => {
		console.log(err)
		if(!hasShowMessage){
			hasShowMessage = true;
			if(err.code == "ECONNABORTED"){
				showElMsg("error","请求超时");
				return;
			}
			if(err.message == "Network Error"){
				showElMsg("error","连接服务器超时");
				return;
			}
			if(err.response == null){
				showElMsg("error","内部服务器错误");
				return;
			}
			if(err.response.data.message){
				showElMsg("error",err.response.data.message);
				return;
			}
			if(err.response.data.code == 500){
				showElMsg("error","内部服务器错误");
				return;
			}
			if(err.status == 403){
				console.log("无法访问："+ err.config.url)
				elNotification("暂无权限",`用户无权限，请联系管理员`,"error")
				return;
			}
		}
		setTimeout(() => hasShowMessage = false,5000);
	}
	
)



export default axiosInstance;