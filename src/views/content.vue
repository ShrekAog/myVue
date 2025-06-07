<template>
	<div class="container">
		<div class="cover">
			<img style="--blur" class="background" :src="wallObj"/>
		</div>
		<div class="gray"></div>
		<h1 class="title">
			<div>
				<h3 class="title_h3">
					{{easy.output}}
					<span class="breath">|</span>
				</h3>
			</div>
		</h1>
		<div class="bannerYun1"></div>
		<div class="bannerYun2"></div>
	</div>
	<Router-View />
	<el-footer style="height: 200px;background-color: red;"></el-footer>
</template>

<script setup>
	import { RouterView } from "vue-router";
	import EasyTyper from 'easy-typer-js'
	import { onMounted,reactive, ref } from "vue";
	import axiosInstance from "@/utils/axiosConfig";
import { getResourceByList, getResourceList,yiyan } from "@/api/api";
	const easy = reactive({
		output:'',
		type:"custom",
		isEnd:false,
		speed:130,
		backSpeed:0,
		sleep:0,
		singleBack:false,
		sentencePause:false
	});
	
	const list = ref([]);
	const wallObj = ref('');
	
	const initTyped = (input) => {
		new EasyTyper(easy,input);
	}
	const initText = () => {
		let data = yiyan('i');
		data
		.then( ({data}) => {
			initTyped(data.hitokoto)
		})
		.catch(err => {
			initTyped("为美好的世界献上祝福吧!")
		})
	}
	
	const wallpaper = async () => {
		let {data} = await getResourceByList();
		data.data.forEach(item => {
			if(item.type == "wallpaper"){
				list.value.push(item);
			}
		})
		wallObj.value = list.value[Math.floor(Math.random() * list.value.length)].path;
	}
	
	
	onMounted(() => {
		initText();
		wallpaper();
	})
</script>

<style scoped>
	.container{
		position: relative;
		width: 100vw;
		height: 50vh;
	}
	.cover{
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
	}
	.background{
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(calc(var(--blur))) brightness(.8);
	}
	.gray{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: radial-gradient(transparent 0,rgba(0,0,0,.5) 100%),radial-gradient(transparent 50%,rgba(0,0,0,.5) 150%);
	}
	.title{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		font-size: 18px;
		letter-spacing: 2px;
		background-color: rgba(0, 0, 0, .5);
		padding:0 10px;
		border-radius: 10px;
		color: var(--white);
	}
	.title_h3{
		margin: 15px 0;
	}
	.breath{
		font-size: 20px;
		opacity: .8;
		display: inline-block;
		transform: translateY(-3px);
		transition: opacity .3s, transform .3s;
		animation: separator-breath .4s infinite alternate;
	}
	
	.bannerYun1{
		position: absolute;
		bottom: 0;
		width: 200%;
		height: 84px;
		background: var(--bannerYun);
		
	}
	.bannerYun2{
		height: 100px;
		width: 400%;
		background: var(--bannerYun2);
	}
	.bannerYun1,.bannerYun2{
		position: absolute;
		bottom: 0;
		background-repeat: repeat-x;
		animation: bannerYun 120s linear infinite;
	}
</style>