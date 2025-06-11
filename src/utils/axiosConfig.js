import axios from 'axios';
import { showElMsg,elNotification } from '@/api/api'
import router from '@/router';
import store from '@/store/store'
const baseUrl = "http://192.168.1.220:8080"
const baseUrlWaiWang = "https://api.konosubaz.cn:49327"
let hasShowMessage = false;
const axiosInstance = axios.create({
	baseURL:baseUrlWaiWang,
	timeout:10000
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
		if(!hasShowMessage && !response.data.success){
			hasShowMessage = true;
			if(response.data.code == 10001){
				elNotification("身份过期","请重新登录","warning");
				router.push("/login")
				return;
			}
			if(response.data.code == 10002){
				elNotification("用户无权限","无法修改","error");
				return;
			}
		}
		setTimeout(() => hasShowMessage = false,5000);
		return response;
	},
	err => {
		if(!hasShowMessage){
			hasShowMessage = true;
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
				elNotification("未知用户","用户未授权，请重新登录","warning")
				return;
			}
		}
		setTimeout(() => hasShowMessage = false,5000);
	}
	
)



export default axiosInstance;