<template>
	<div class="container">
		<div class="cover">
			<img style="--blur" class="background" :src="wallObj"/>
		</div>
		<div class="gray"></div>
		<h1 class="title">
			{{easy.output}}
			<span class="breath">|</span>
		</h1>
	</div>
	<Router-View />
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
		let data = yiyan('d,i,k');
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
		height: 40vh;
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
		font-size: 2.8rem;
		letter-spacing: 2px;
		color: var(--white);
	}
	.breath{
		opacity: .8;
		display: inline-block;
		transform: translateY(-7px);
		transition: opacity .3s, transform .3s;
		animation: separator-breath .7s infinite alternate;
	}
</style>