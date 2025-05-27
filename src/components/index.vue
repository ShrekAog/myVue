<template>
	<div class="start-container">
		<div class="cover" :class="[{focus:isFocus}]">
			<img style="--blur:0px" class="background" :src="path" />
			<div class="gray"></div>
		</div>
		<main id="main">

			<div class="time-container" :class="[{focus:isFocus}]">
				<div class="time">
					<span>{{status.times.hours}}</span>
					<span class="separator">:</span>
					<span>{{status.times.minutes}}</span>
				</div>
				<div class="lunar">
					<span>
						{{status.lunar.lunarYear}}
						({{status.lunar.lunarYearShengXiao}}) 年
					</span>
					<span>{{status.lunar.lunarMonthInChinese}}月</span>
					<span>{{status.lunar.lunarDayInChinese}}</span>
				</div>
				<div class="date">
					<span>{{status.times.month}}月</span>
					<span>{{status.times.date}}日</span>
					<span>{{dayList[status.times.day]}}</span>
				</div>
			</div>
			<div class="mask" v-if="isFocus" @click="isFocus = false,isEngine = false"></div>
			<div class="search-input" v-if="status.list.length >= 1" :class="[{focus:isFocus}]">
				<div class="all-el">
					<div class="logo" @click="isEngine = !isEngine,isFocus = true">
						<el-image class="engine-logo" fit="cover" :src="status.list[status.defaultEngine.index].resource.path"></el-image>
					</div>
					<input @focus="isFocus = true,isEngine = true" v-model="status.defaultEngine.txt" class="main-input"
						type="text" placeholder="请输入内容" :disabled="loading" @keyup.enter="search(status.list[status.defaultEngine.index])" />
					<div class="search-logo" @click="search(status.list[status.defaultEngine.index])">
						<el-image class="search-img" fit="cover" :src="getAssetsImageFile('index/engine-icon/search.png')"></el-image>
					</div>
				</div>
				<transition name="engine">
					<div class="engine-choose" v-if="isEngine">
						<div class="engine" :class="[{choose:status.defaultEngine.index == index}]"
							@click="getSelectIndex(index)" v-for="(item,index) in status.list">
							<el-image fit="cover" class="engine-icon" :src="item.resource.path"></el-image>
							<span>{{item.engineName}}</span>
						</div>
					</div>
				</transition>
			</div>
		</main>
	</div>
</template>

<script setup>
	import { getAssetsImageFile } from '@/utils/getAssetsFile';
	import { getEngineList,getListByClassifyId,getWallpaperConfig, showElMsg } from '@/api/api'
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from 'vue';
	import { Lunar } from 'lunar-javascript';
	let path = ref('');
	let timer = reactive({});
	let isFocus = ref(false);
	let isEngine = ref(false);
	let loading = ref(true);
	const dayList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
	const status = reactive({
		defaultEngine: {
			index: 0,
			txt: ''
		},
		times: {
			hours: '',
			minutes: '',
			month: '',
			date: '',
			day: ''
		},
		lunar: {
			lunarYear: '',
			lunarYearShengXiao: '',
			lunarMonthInChinese: '',
			lunarDayInChinese: ''
		},
		list:[],
		wapaperList:[]

	})
	onMounted(() => {
		init();
		timer = setInterval(getDate, 1000);
		setTimeout(() => {
			loading.value = false;
			ElMessage({
				message: '欢迎您，祝您愉快每一天!',
				type: 'info',
				offset: 50,
				duration: 3000
			});
		}, 1000);
	})

	function init() {
		getWallpaperList(2);
		getDate();
		getList();
	}
	async function getList(){
		let {data}  = await getEngineList();
		status.list = data.data.filter(item => item.hidden == 0);
	}

	function getDate() {
		let now = new Date();
		const lunar = Lunar.fromDate(new Date());
		status.times.hours = String(now.getHours()).padStart(2, '0');
		status.times.minutes = String(now.getMinutes()).padStart(2, '0');
		status.times.month = String(now.getMonth() + 1).padStart(2, '0');
		status.times.date = now.getDate();
		status.times.day = now.getDay();
		//console.log(now.getSeconds())


		status.lunar.lunarYear = lunar.getYearInGanZhi();
		status.lunar.lunarYearShengXiao = lunar.getYearShengXiao();
		status.lunar.lunarMonthInChinese = lunar.getMonthInChinese();
		status.lunar.lunarDayInChinese = lunar.getDayInChinese();
	}

	function getSelectIndex(index) {
		status.defaultEngine.index = index;
	}

	function search(item) {
		if(status.defaultEngine.txt.length <= 0){
			return;
		}
		let searchTxt = item.path + status.defaultEngine.txt;
		window.open(searchTxt);
		
	}
	
	const getWallpaperList = async (id) => {
		let { data } = await getWallpaperConfig();
		let data2 = await getListByClassifyId(data.data.value);
		if(!data2.data.data){
			showElMsg("warning","壁纸为空!");
			return;
		}
		status.wapaperList = data2.data.data;
		path.value = status.wapaperList[Math.floor(Math.random() * status.wapaperList.length)].path;
	}
	

	onUnmounted(() => {
		clearInterval(timer)
	})
</script>

<style scoped>
	.engine-enter-active {
		animation: fade-engine-up-in .3s;
	}

	.engine-leave-active {
		animation: fade-engine-out .3s;
	}

	.start-container {
		width: 100vw;
		height: 100vh;
		position: relative;
	}

	.cover {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1.2);
		filter: blur(calc(var(--blur))) brightness(.8);
		transition: filter .3s, transform .3s;
		animation: fade-blur-in 1s cubic-bezier(.25, .46, .45, .94);
	}

	.gray {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: radial-gradient(transparent 0, rgba(0, 0, 0, .5) 100%), radial-gradient(transparent 50%, rgba(0, 0, 0, .5) 150%);
	}

	#main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		color: var(--white);
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}

	.time-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		user-select: none;
		cursor: pointer;
		opacity: 1;
		transform: translateY(-180px);
		transition: transform .3s, opacity .3s;
		animation: fade-time-up-in .7s;
	}

	.time-container>.time {
		font-size: 4.5rem;
		text-shadow: 0 0 8px rgba(0, 0, 0, .5);
	}

	.time>.separator {
		opacity: .8;
		margin: 0 5px;
		display: inline-block;
		transform: translateY(-7px);
		transition: opacity .3s, transform .3s;
		animation: separator-breath .7s infinite alternate;
	}

	.time-container>.lunar {
		font-size: 0.9rem;
		opacity: .7;
		text-shadow: 0 0 8px rgba(0, 0, 0, .5);
	}

	.time-container>.date {
		font-size: 1.5rem;
		text-shadow: 0 0 8px rgba(0, 0, 0, .5);
	}

	.date>span {
		margin: 0 2px;
	}

	.search-input {
		position: absolute;
		max-width: 680px;
		width: calc(100% - 60px);
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.search-input>.all-el {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 42px;
		background: rgba(0, 0, 0, .5);
		border-radius: 30px;
		backdrop-filter: blur(10px);
		opacity: 1;
		transition: opacity .3s, transform .3s, background .3s;
		animation: fade-search-up-in .7s;
	}

	.all-el>.logo,
	.search-logo {
		width: 60px;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: 30px;
		transition: background .3s;
	}

	.engine-logo {
		width: 25px;
		height: 25px;
	}
	.search-img{
		width: 25px;
		height: 25px;
	}

	.engine-choose,
	.engine {
		display: flex;
		background-color: rgba(255, 255, 255, .19);
	}

	.engine-choose {
		position: absolute;
		width: 100%;
		top: 25px;
		user-select: none;
		flex-wrap: wrap;
		padding: 5px;
		backdrop-filter: blur(10px) saturate(1.25);
		border-radius: 10px;
	}

	.engine {
		width: calc(33.33333% - 10px);
		height: 40px;
		margin: 5px;
		align-items: center;
		border-radius: 7px;
		cursor: pointer;
		padding: 0 10px;
		transition: background-color .3s, box-shadow .3s;
	}

	.engine-icon {
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}

	.engine:hover {
		background: rgba(255, 255, 255, .5);
		box-shadow: 0 0 0 2px rgba(255, 255, 255, .5);
	}

	.choose {
		position: relative;
		background-color: rgba(255, 255, 255, .5);
	}

	.choose::before {
		content: '';
		position: absolute;
		top: -4px;
		left: -4px;
		right: -4px;
		bottom: -4px;
		border-radius: 11px;
		border: 2px solid rgba(255, 255, 255, .19);
	}

	.all-el>.logo:hover {
		background-color: rgba(0, 0, 0, .5);
	}

	.all-el>.search-logo:hover {
		background-color: rgba(0, 0, 0, .5);
	}

	.all-el>.main-input {
		width: 100%;
		height: 100%;
		background: none;
		border: none;
		outline: none;
		color: var(--white);
		font-size: 17px;
		padding: 0 5px;
	}

	.all-el>.main-input::placeholder {
		color: var(--white);
		text-align: center;
		letter-spacing: 2px;
		font-size: 15px;
	}


	/* 获取焦点 */
	.focus>.background {
		filter: blur(calc(var(--blur) + 10px)) brightness(.6);
		transform: scale(1.3);
	}

	.focus.time-container {
		transform: translateY(-210px);
	}

	.focus>.all-el {
		transform: translateY(-30px);
	}

	.focus>.all-el>.main-input::placeholder {
		opacity: 0;
	}
</style>