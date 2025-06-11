<template>
	<div class="start-container">
		<div class="cover">
			<img :src="path" class="background" style="--blur:0px">
		</div>
		
		<div class="login-container">
			<div class="form_parent">
				<h2 class="title">{{title}}</h2>
				<el-form ref="loginFormRef" :model="userForm" :rules="rules" class="form" @submit.prevent>
					<el-form-item label="用户名" prop="username">
						<el-input style="width: 240px;" type="text" v-model="userForm.username" :prefix-icon="User" clearable></el-input>
					</el-form-item>
					<el-form-item label="密    码" prop="password">
						<el-input @keydown.enter="login" style="width: 240px;" type="password" v-model="userForm.password" :prefix-icon="Lock" show-password></el-input>
					</el-form-item>
					<el-form-item>
						<router-link to="/register">注册</router-link>
					</el-form-item>
					<el-button @click="login" type="primary" class="submit">登录</el-button>
				</el-form>
			</div>
			
		</div>
		
	</div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import { onMounted, reactive, ref } from 'vue';
import { userLogin,elNotification,getLoginWallpaperConfig,getResourceById,parseUserToken,getUserRouters } from "@/api/api";
import { User,Lock } from '@element-plus/icons-vue'
import { useStore } from 'vuex';
	const store = useStore();
	const path = ref('')
	const title = ref('网站管理后台')
	const loginFormRef = ref(null)
	const router = useRouter();
	
	const userForm = reactive({
		username:"",
		password:""
	})
	
	const rules = reactive({
		username:[
			{required: true,message: '用户名不能为空',trigger:'blur'}
		],
		password:[
			{required: true,message: '密码不能为空',trigger:'blur'}
		]
	})

	const login = async () => {
		loginFormRef.value.validate(async (valid) => {
			if(valid){
				let {data} = await userLogin(userForm);
				if(data.code == 10000){
					elNotification("登录失败","用户名或密码错误","warning");
					loginFormRef.value.resetFields();
					return;
				}
				store.commit("user/isLogin",true);
				store.commit("user/isToken",data.data.token);
				let type = await parseUserToken(store.state.user.token);
				store.commit("user/updateUserType",type.data.data);
				let routers = await getUserRouters(store.state.user.userType);
				store.commit("user/updateRouters",routers.data.data);
				router.push({path:'/admin'});
				loginFormRef.value.resetFields();
				
			}
		})
		
		
	}
	
	
	const getLoginWallpaper = async () => {
		let {data} = await getLoginWallpaperConfig();
		let select = data.data.value;
		let wallpapaer = await getResourceById(select);
		path.value = wallpapaer.data.data.path;
	}
	
	
	onMounted(() => {
		getLoginWallpaper();
	})
	
</script>

<style scoped>
	.start-container{
		position: relative;
		width: 100vw;
		height: 100vh;
	}
	.cover{
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.background{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		object-fit: cover;
		transform: scale(1.2);
		filter: blur(var(--blur)) brightness(.8);
		transition: filter .3s,transform .3s;
		animation: fade-blur-in 1s cubic-bezier(.25,.46,.45,.94);
	}
	
	.login-container{
		position: absolute;
		top: 0;
		right: 0;
		width: 25%;
		height: 100%;
		background:rgba(255, 255, 255, .9)
	}
	.title{
		width: 100%;
		text-align: center;
		letter-spacing: 2px;
		font-size: 2.2rem;
	}
	.form_parent{
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 200px;
	}
	.form{
		white-space:pre;
		margin-top: 25px;
		min-width: 280px;
	}
	.submit{
		width: 100%;
	}
</style>