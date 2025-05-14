<template>
	<el-row>
		<el-col :span="6">
			<el-tooltip placement="top" effect="dark" :content="objects.wallpaper.title">
				<el-form-item label="主页壁纸">
					<el-select @change="updateWallpaper" v-model="objects.wallpaper.value" :placeholder="objects.wallpaper.plac">
						<el-option
						v-for="item in objects.wallpaper.options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-tooltip>
		</el-col>
		
		<el-col :span="6">
			<el-tooltip placement="top" effect="dark" :content="objects.loginpaper.title">
				<el-form-item label="登录页壁纸">
					<el-select @change="updateLoginWallpaper" v-model="objects.loginpaper.value" :placeholder="objects.loginpaper.plac">
						<el-option
						v-for="item in objects.loginpaper.options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-tooltip>
		</el-col>
		
		<el-col :span="6">
			<el-tooltip placement="top" effect="dark" :content="objects.registerpaper.title">
				<el-form-item label="注册页壁纸">
					<el-select @change="updateRegistWallpaper" v-model="objects.registerpaper.value" :placeholder="objects.registerpaper.plac">
						<el-option
						v-for="item in objects.loginpaper.options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-tooltip>
		</el-col>
	</el-row>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { getstatusList,
getWallpaperConfig,
updateWallpaperConfig,
getLoginWallpaperConfig,
getResourceByList,
updateLoginWallpaperConfig,
getRegisterWallpaperConfig,
updateRegisterWallpaperConfig,
elNotification,
  showElMsg } from '@/api/api'
	const objects = reactive({
		byList:[],
		wallpaper:{
			value:'',
			plac:'',
			title:'',
			options:[]
		},
		loginpaper:{
			value:'',
			plac:'',
			title:'',
			options:[]
		},
		registerpaper:{
			value:'',
			plac:'',
			title:'',
			options:[]
		}
	})
	
	//主页壁纸
	const wallpaperList = async () => {
		let {data} = await getstatusList();
		data.data.forEach(item => {
			objects.wallpaper.options.push({
				value:item.id,
				label:item.classify
			})
		})
	}
	//主页配置
	const getPaperConfig = async () => {
		let {data} = await getWallpaperConfig();
		objects.wallpaper.title = data.data.description;
		const paperValue = objects.wallpaper.options.find(item => item.value == data.data.value);
		if(paperValue){
			objects.wallpaper.plac = paperValue.label;
		}
	}
	
	const loginWallpaperConfig = async () => {
		let {data} = await getLoginWallpaperConfig();
		objects.loginpaper.title = data.data.description;
		const placLogin = objects.loginpaper.options.find(item => item.value == data.data.value);
		if(placLogin){
			objects.loginpaper.plac = placLogin.label;
		}
	}
	
	const registerWallpaperConfig = async () => {
		let {data} = await getRegisterWallpaperConfig();
		
		objects.registerpaper.title = data.data.description;
		const placRegister = objects.loginpaper.options.find(item => item.value == data.data.value);
		if(placRegister){
			objects.registerpaper.plac = placRegister.label;
		}
	}
	
	const getByWallpaperList = async () => {
		let {data} = await getResourceByList();
		objects.byList = data.data;
		objects.byList.forEach(item => {
			if(item.type == 'wallpaper'){
				objects.loginpaper.options.push({
					value:item.id,
					label:item.originalName
				})
			}
		})
	}
	//修改主页配置
	const updateWallpaper = async () => {
		let {data} = await updateWallpaperConfig(objects.wallpaper.value);
		console.log(data)
		if(data.success){
			showElMsg("success","修改成功");
		}
	}
	const updateLoginWallpaper = async () => {
		let {data} = await updateLoginWallpaperConfig(objects.loginpaper.value);
		if(data.success){
			showElMsg("success","修改成功");
		}
	}
	const updateRegistWallpaper = async () => {
		let {data} = await updateRegisterWallpaperConfig(objects.registerpaper.value);
		if(data.success){
			showElMsg("success","修改成功");
		}
	}
	
	
	
	
	
	
	const init = async () => {
		await wallpaperList();
		await getByWallpaperList();
		getPaperConfig();
		loginWallpaperConfig();
		registerWallpaperConfig();
	}
	
	onMounted(() => {
		init();
	})
</script>

<style scoped>
</style>