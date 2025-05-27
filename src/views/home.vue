<template>
	<!-- el过度动画 -->
	<transition name="el-fade-in-linear">
		<div class="toolbar-content flexBetWeen" v-if="!isPhone">
			<div class="toolbar-title">
				<el-image fit="cover" :src="logo" style="height: 55px;" />
			</div>
			<div>
				<ul class="scroll-menu">
					<li>
						<div class="my-menu" @click="go('/')">
							<span>🏡 首页</span>
						</div>
					</li>
					<li>
						<div class="my-menu">
							<span>💖 家</span>
						</div>
					</li>
					<li>
						<div class="my-menu" @click="go('/suibi')">
							<span>🏖 随笔</span>
						</div>
					</li>
					<li>
						<div class="my-menu">
							<span>📒 记录</span>
						</div>
					</li>
					<li>
						<div class="my-menu">
							<span>📸 相册</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="phone-toolbar" v-else>
			<div class="phone-menu">
				<el-image @click="clickDrawer" class="phone-menu-img" fit="cover" :src="getAssetsImageFile('/index/phone_menu.png')"></el-image>
			</div>
			<el-drawer
			    v-model="isDrawer"
			    direction="rtl"
				:show-close="false"
				size="70%"
				class="phone-drawer"
			  >
			    <template #header>
					<div class="drawer-header">
						<el-image class="header-cover" fit="cover" :src="getAssetsImageFile('/index/bg1.jpg')"></el-image>
						<div class="header-mask"></div>
						<div class="header-content">
							<div class="drawer-title">
								<p>
									{{easy.output}}
									<span class="separator">|</span>
								</p>
							</div>
						</div>
					</div>
					
				</template>
				<template #default>
					<h1>{{easy.output}}</h1>
				</template>
			</el-drawer>
		</div>
	</transition>
	<!-- 横屏遮罩 -->
	<div class="info" v-if="isOrien"></div>
	<div id="mian-container">
		<RouterView />
	</div>
</template>

<script setup>
	import {ref,onMounted,onBeforeMount, reactive} from 'vue'
	import { RouterView, useRouter } from 'vue-router'
	import logo from '@/assets/home/logo.png'
	import { getAssetsImageFile } from '@/utils/getAssetsFile'
	import EasyTyper from 'easy-typer-js'
	import axios from 'axios'
	const router = useRouter();
	let isPhone = ref(false);
	let isDrawer = ref(false);
	let isOrien = ref(false);
	let easy = reactive({
		output:'',
		type:"custom",
		isEnd:false,
		speed:130,
		backSpeed:0,
		sleep:0,
		singleBack:false,
		sentencePause:false
	});
	onBeforeMount(() => {
		if(window.innerWidth <= 784){
			isPhone.value = true;
		}else {
			isPhone.value = JSON.parse(localStorage.getItem("isPhone"));
		}
	})
	onMounted(() => {
		init();
	})
	function init(){
		document.title = "星辰万里"
		resize();
		isOrientation();
	}
	const go = (path) => {
		router.push({path:path})
	}
	function resize(){
		window.addEventListener("resize",() => {
			if(window.innerWidth <= 784){
				isPhone.value = true;
			} else {
				isPhone.value = false;
			}
			localStorage.setItem("isPhone",isPhone.value);
		})
	}
	function orientation(){
		window.addEventListener("orientationchange",() => {
			isOrientation();
		})
	}
	function clickDrawer(){
		isDrawer.value = true;
		axios.get("https://v1.hitokoto.cn/?c=i&c=j")
		.then(({data}) => {
			console.log(data.hitokoto);
			initTyped(data.hitokoto)
		})
		.catch(err => {
			initTyped("为美好的世界献上祝福吧!")
		})
	}
	function initTyped(input){
		const typed = new EasyTyper(easy,input);
	}
	function isOrientation(){
		
		if(window.orientation != 0 && isPhone.value){
			ElMessageBox.alert("请将设备旋转到横屏模式","提示");
			isOrien.value = true;
		} else {
			isOrien.value = false;
		}
	}
</script>


<style scoped>
	.toolbar-content{
		width: 100%;
		height: 60px;
		color: var(--white);
		position: fixed;
		z-index: 100;
		user-select: none;
		transition: background .3s ease-in-out;
	}
	.toolbar-content:hover{
		background: rgba(0, 0, 0, .6);
	}
	.toolbar-title{
		margin:10px 0 0 30px;
	}
	.scroll-menu{
		display: flex;
		margin-right: 40px;
	}
	.scroll-menu > li{
		list-style: none;
		margin: 0 12px;
		font-size: 15px;
		height: 60px;
		line-height: 60px;
		position: relative;
		cursor: pointer;
	}
	.scroll-menu > li > .my-menu::after{
		content: '';
		position: absolute;
		display: block;
		bottom: 0;
		width: 100%;
		max-width: 0;
		height: 6px;
		background-color: var(--themeBackground);
		transition: max-width .25s ease-in-out;
	}
	.scroll-menu > li:hover .my-menu span{
		color: var(--themeBackground);
	}
	.scroll-menu > li:hover > .my-menu::after{
		max-width: 100%;
	}
	.phone-toolbar{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		height: 60px;
		display: flex;
		flex-direction: row;
		justify-content: end;
	}
	.phone-menu{
		width: 50px;
		height: 100%;
		margin-right: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.phone-menu-img{
		width: 35px;
		height: 35px;
	}
	.drawer-header{
		position: relative;
	}
	.header-cover > :deep(.el-image__inner){
		transition: transform .3s;
		animation:drawer-up-in 5s infinite alternate;
	}
	.header-mask{
		position: absolute;
		top: 0;
		width: 100%;
		height: calc(100% - 5px);
		background-image: radial-gradient(transparent 0,rgba(0,0,0,.5) 100%),
		radial-gradient(transparent 50%,rgba(0,0,0,.5) 150%);
	}
	.header-content{
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.drawer-title{
		display: flex;
		align-items: center;
		color: var(--white);
		font-size: .6rem;
		letter-spacing: 2px;
		max-width: 85%;
	}
	.drawer-title > p{
		position: relative;
	}
	.separator{
		position: absolute;
		bottom: -3.5px;
		display: inline-block;
		font-size: 1rem;
		transition: opacity .3s;
		animation: separator-breath .7s infinite alternate;
	}
	:deep(.el-drawer__header){
		padding: 0;
	}
	.info{
		position: fixed;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, .6);
		user-select: none;
		z-index: 1001;
	}
	
	@media screen and (max-width:785px) {
		.toolbar-content{
			justify-content: end;
		}
	}
	#mian-container{
		background-color: #eee;
	}
	

</style>