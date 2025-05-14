<template>
	<div class="start-container">
		<div class="cover">
			<img :src="path" class="background" style="--blur:0px">
		</div>
		
		<div class="register-container">
			<div class="form_parent">
				<h2 class="title">{{title}}</h2>
				<el-form ref="registerRef" :model="registerForm" :rules="rules" class="form" @submit.prevent>
					<el-form-item label="用户名" prop="username" style="position: relative;">
						<el-input @blur="checkName" style="width: 240px;" type="text" v-model.trim="registerForm.username" :prefix-icon="User" clearable></el-input>
						<p v-if="checkUsername" style="position: absolute;top: 1.5rem;color: #f56c6c;font-size: 12px;" class=".el-form-item__error">用户名已存在</p>
					</el-form-item>
					
					<el-form-item label="密    码" prop="password">
						<el-input style="width: 240px;" type="password" v-model.trim="registerForm.password" :prefix-icon="Lock" show-password></el-input>
					</el-form-item>
					
					<el-form-item>
						<router-link to="/login">登录</router-link>
					</el-form-item>
					<el-button @click="register" type="primary" class="submit">注册</el-button>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getRegisterWallpaperConfig,getResourceById,userRegister,checkUsernameExist,elNotification } from '@/api/api';
import { User,Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
	const path = ref('')
	const title = ref('管理后台注册页面')
	const router = useRouter();
	const checkUsername = ref(false);
	const registerRef = ref(null);
	const registerForm = reactive({
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
	onMounted(()=>{
		init()
	})
	const init = async () => {
		await getRegisterConfig();
	}
	const getRegisterConfig = async () => {
		let {data} = await getRegisterWallpaperConfig();
		let resource = await getResourceById(data.data.value);
		path.value = resource.data.data.path;
	}
	
	const register = async () => {
		registerRef.value.validate(async (valid) => {
			if(valid){
				if(!checkUsername.value){
					
					let {data} = await userRegister(registerForm);
					if(data.data){
						registerRef.value.resetFields();
						elNotification("注册成功","3秒后跳转至登录页","success");
						setTimeout(() => {
							router.push({path:'/login'});
						},3000)
					}
				}
				
				
			}
		})
	}
	const checkName = async () => {
		let {data} = await checkUsernameExist(registerForm.username);
		if(data.data){
			checkUsername.value = true;
		}else {
			checkUsername.value = false;
		}
	}
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
	
	.register-container{
		position: absolute;
		top: 0;
		right: 0;
		width: 25%;
		height: 100vh;
		background-color: white;
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