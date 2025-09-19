<template>
	<div class="container flexCenter">
		<div class="cover">
			<img class="bg" :src="wallObj"/>
		</div>
		<transition name="up">
			<div v-if="show" id="loginAndRegister" class="in-up" :class="{'active':isRegister}">
				<div class="from-container up-container">
					<div class="from flexCenter">
						<h1>注册</h1>
						<input @blur="checkName" placeholder="用户名" v-model="registerForm.username" />
						<span class="err" v-show="checkUsername">*用户名已存在</span>
						<input placeholder="密码" type="password" v-model="registerForm.password" />
						<el-button type="primary" @click="register">注册</el-button>
					</div>
				</div>
				<div class="from-container in-container">
					<div class="from flexCenter">
						<h1>登录</h1>
						<input placeholder="用户名" v-model="userfrom.username" />
						<input placeholder="密码" type="password" v-model="userfrom.password" @keyup.enter="login" />
						<el-text type="primary">忘记密码？</el-text>
						<el-button type="primary" @click="login">登录</el-button>
					</div>
				</div>
				<div class="overlay-container">
					<div class="overlay">
						<div class="overlay-left panel flexCenter">
							<h1>已有账号?</h1>
							<p>请登录</p>
							<button class="panel-btn" @click="isRegister = false">登录</button>
						</div>
						<div class="overlay-right panel flexCenter">
							<h1>没有账号?</h1>
							<p>立即注册吧</p>
							<button class="panel-btn" @click="isRegister = true">注册</button>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
	import { onMounted, ref,reactive } from "vue";
	import { getResourceByList,yiyan,userLogin, showElMsg,getUserRouters,checkUsernameExist,userRegister } from "@/api/api";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	const store = useStore();
	const router = useRouter();
	const show = ref(false)
	const list = ref([]);
	const wallObj = ref('');
	const isRegister = ref(false);
	const checkUsername = ref(false);
	const userfrom = ref({
		username:'',
		password:''
	})
	const registerForm = reactive({
		username:"",
		password:""
	})
	onMounted(() => {
		wallpaper();
		show.value = true;
	})

	const wallpaper = async () => {
		let {data} = await getResourceByList();
		data.data.forEach(item => {
			if(item.type == "wallpaper"){
				list.value.push(item);
			}
		})
		wallObj.value = list.value[Math.floor(Math.random() * list.value.length)].path;
	}
	const login = async () => {
		if(userfrom.value.username.length <= 0 || userfrom.value.password <= 0){
			return;
		}
		let {data} = await userLogin(userfrom.value);
		if(!data.success){
			showElMsg("error",data.message)
		}else{
			store.commit("user/login",{
				isLogin:true,
				token:data.data.token,
				userType:data.data.userType,
				id:data.data.id
			});
			showElMsg("success","登录成功");
			router.push({path:"/"});
		}
		
		userfrom.value.username = '';
		userfrom.value.password = '';
	}
	const checkName = async () => {
		let {data} = await checkUsernameExist(registerForm.username);
		if(data.data){
			checkUsername.value = true;
		}else {
			checkUsername.value = false;
		}
	}
	
	const register = async () => {
		if(registerForm.username && registerForm.password){
			if(checkUsername.value){
				return;
			}
			let {data} = await userRegister(registerForm);
			if(data.data){
				showElMsg("success","注册成功");
				registerForm.username = '';
				registerForm.password = '';
				isRegister.value = false;
			}
		}
	}
	
	
</script>

<style scoped>
	.container{
		position: relative;
		width: 100vw;
		height: 100vh;
	}
	.cover{
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.bg{
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: brightness(.8);
	}
	#loginAndRegister{
		transition: transform .5s ease-in-out;
	}
	.up-enter-active{
		animation: home-login-up .5s;
	}
	.in-up{
		opacity: .9;
		position: relative;
		border-radius: 10px;
		box-shadow: 0 15px 30px rgba(255, 255, 255, .15),0 10px 10px rgba(255, 255, 255, .15);
		overflow: hidden;
		width: 750px;
		max-width: 100%;
		min-height: 450px;
		margin: 10px;
	}
	.in-up p{
		font-size: 14px;
		letter-spacing: 1px;
		margin: 20px 0 30px 0;
	}
	.from-container{
		position: absolute;
		height: 100%;
		opacity: 1;
	}
	.up-container{
		opacity: 0;
		width: 50%;
		transition: transform .5s,opacity .5s ease-in-out;
	}
	.in-container{
		width: 50%;
		transition: transform .5s ease-in-out;
	}
	.from-container > div{
		background-color: white;
		flex-direction: column;
		height: 100%;
		padding: 0 20px;
	}
	h1{
		margin: 12px 0;
	}
	.from > input{
		width:100%;
		background: #eee;
		padding: 12px 15px;
		margin: 10px 0;
		border: 0;
		outline: none;
	}
	.from > .err{
		position: absolute;
		top: 224px;
		left: 30px;
		color: red;
		font-size: 13px;
	}
	.from > span{
		cursor: pointer;
		margin: 10px 0;
	}
	.from > button{
		min-width: 120px;
	}
	.in-up.active .up-container{
		transform: translateX(100%);
		opacity: 1;
	}
	.in-up.active .in-container{
		transform: translateY(100%);
	}
	.overlay-container{
		position: absolute;
		left: 50%;
		width: 50%;
		height: 100%;
		overflow: hidden;
		transition: transform .4s ease-in-out;
	}
	.overlay{
		background: linear-gradient(90deg, #ff4b2b, #ff416c);
		color: white;
		width: 200%;
		height: 100%;
		position: relative;
		left: -100%;
	}
	.panel{
		position: absolute;
		width: 50%;
		height: 100%;
		flex-direction: column;
		transition: transform .8s ease-in-out;
	}
	.panel-btn{
		cursor: pointer;
		padding: 10px 30px;
		border-radius: 15px;
		background: transparent;
		outline: none;
		border: 1px white solid;
		font-size: 16px;
		letter-spacing: 2px;
		color: white;
		transition: transform .2s linear;
	}
	.panel-btn:hover{
		transform: scale(1.1);
	}
	.overlay-left{
		transform: translateY(-20%);
	}
	.overlay-right{
		right: 0;
		transform: translateY(0);
	}
	.in-up.active .overlay-container{
		transform: translateX(-100%);
	}
	.in-up.active .overlay-left{
		transform: translateY(0);
	}
	.in-up.active .overlay-right{
		transform: translateY(20%);
	}
	.in-up.active .overlay{
		transform: translateX(50%);
	}
</style>