<template>
	<div>
		<el-dialog
		top="4vh"
		style="padding: 0;height: 90vh;overflow: hidden;"
		width="95%"
		v-model="visible"
		@close="close"
		:close-on-press-escape="false"
		>
			<template #header>
				<div style="padding: 10px;">
					<el-text>上传照片(H5)</el-text>
				</div>
			</template>
			<template #default>
				<div id="container">
					<el-text style="padding-right: 7px;">上传至</el-text>
					<el-dropdown size="large" trigger="click" max-height="250" @command="change">
						<div class="drop-box">
							<el-image class="drop-img" fit="cover" :src="activeList.cover"></el-image>
							<el-text line-clamp="1" style="margin-left:8px;">{{activeList.title}}</el-text>
						</div>
						<template #dropdown>
						      <el-dropdown-menu>
						        <el-dropdown-item :command="item" v-for="item in flList" :key="item.id">
									<div class="drop-item-box">
										<el-image class="drop-item-img" fit="cover" :src="item.cover"></el-image>
										<div class="drop-item-content-box">
											<el-text truncated line-clamp="1">{{item.title}}</el-text>
											<el-text style="width: 100%;">{{item.total}}张</el-text>
										</div>
										
									</div>
								</el-dropdown-item>
						      </el-dropdown-menu>
						    </template>
					</el-dropdown>
				</div>
				
				<div id="up-main">
					<div class="up-mod">
						<div class="flexCenter upload-main" :class="{'active':upFileList.length >= 1}" style="height: 100%;">
							<el-upload
							class="flexCenterCol"
							v-model:file-list="upFileList"
							:auto-upload="false"
							:list-type="upFileList.length <= 0 ? 'text' : 'picture-card'"
							multiple
							:on-change="changeHandler"
							:before-remove="beforeRemoveHandler"
							:limit="30"
							:on-exceed="limitHandler"
							
							>
								<template #default>
									<div class="clik-box flexCenter" v-if="upFileList.length <= 0">
										<el-icon class="image-icon">
											<el-icon><Picture /></el-icon>
										</el-icon>
										<el-text class="image-icon-text">选择照片或视频</el-text>
									</div>
									<div v-else>
										<el-icon style="font-size: 1.4rem;">
											<Plus />
										</el-icon>
									</div>
								</template>
								<template #file="{file,index}">
									
									<div class="file-list">
										<div class="file-list-btns flexCenter">
											<el-icon v-if="file.videoUrl" class="btns-icon" @click="btnsPlayVideoHandler(file)">
												<VideoPlay />
											</el-icon>
											<el-icon v-else class="btns-icon" @click="btnsPreviewHandler(file)">
												<ZoomIn />
											</el-icon>
											<el-icon class="btns-icon" @click="btnsDeleteHandler(index)">
												<Delete />
											</el-icon>
										</div>
										
										<el-image
											class="file-list-image" 
											:src="file.url" 
											fit="cover">
											<template #error>
												<el-skeleton animated style="width: 100%;height: 100%;">
													<template #template>
														<el-skeleton-item variant="image" style="width: 100%;height: 100%;"></el-skeleton-item>
													</template>
												</el-skeleton>
											</template>
										</el-image>
										
										 <el-image-viewer v-if="previewVisible" @close="previewVisible = false" :url-list="previewList" />
											
										
										<el-tooltip
											effect="dark"
											:content="file.name.substring(0,file.name.lastIndexOf('.'))",
											placement="bottom"
										>
											<el-text 
											ref="textEdigRef"
											contenteditable 
											@blur="edigHandler(index,$event)"
											@keyup.enter.prevent="edigHandler(index,$event)"
											class="file-list-image-name" 
											line-clamp="1"	>
												{{file.name.substring(0,file.name.lastIndexOf('.'))}}
											</el-text>
										</el-tooltip>
									</div>
								</template>
								<template #tip>
									<div class="flexCenter" style="flex-direction: column;">
										<div>
											<el-text size="small">上传限制为1~30张/单个文件不得超过100MB/总文件不得超过500MB</el-text>
										</div>
										<div v-if="upFileList.length <= 0">
											<el-text>按住Shift可多选</el-text>
										</div>
									</div>
								</template>
							</el-upload>
						</div>
						
						<div class="up-mod-footer" v-if="upFileList.length >= 1">
							<div class="flexBetWeen" style="height: 100%;">
								<div class="f-left-upload flexCenter">
									<el-button type="primary" class="f-left-upload-btn" @click="uploadHandler">
										<el-icon class="upload-icon">
											<UploadFilled />
										</el-icon>
										开始上传
									</el-button>
									<el-upload
										v-model:file-list="upFileList"
										@change="changeHandler"
										:show-file-list="false"
										list-type="picture"
										:auto-upload="false"
									>
										<el-button type="info" class="f-left-continue-btn">
											继续添加
										</el-button>
									</el-upload>
									<el-button @click="upFileList = []" type="warning" class="f-left-continue-btn">
										移除列表
									</el-button>
									<el-text style="padding-left: 15px;">
										共{{upFileList.length}}张照片和视频（上传过程中请不要刷新页面）
									</el-text>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</el-dialog>
	</div>
	<el-dialog v-model="videoDialog">
		<vue3-video-play v-if="videoDialog" autoPlay :src="videoUrl" :controlBtns="videoControllerBtns" width="100%" height="100%" />
	</el-dialog>
	<myProgress v-model:visible="progressVisible" :data="uploadProgressSchedule" />
</template>

<script setup>
import Vue3VideoPlay from 'vue3-video-play'
import 'vue3-video-play/dist/style.css'
import { nextTick, onMounted, ref } from 'vue';
import { showElMsg,getclassFyListById,getResourceCountByClassifyId,uploadImgList } from '@/api/api';
import store from '../../../store/store';
import myProgress from '../../progress.vue'
	const props = defineProps({
			/**
			 * 显示的相册，默认第一册
			 */
			firstItem:{
				type: Object,
				required:false
			}
		})
	const visible = defineModel("visible");
	const id = ref(0);
	const flList = ref([]);
	const activeList = ref([]);
	const upFileList = ref([]);
	const videoDialog = ref(false);
	const videoUrl = ref('');
	const previewVisible = ref(false);
	const previewList = ref([]);
	const videoControllerBtns = [
	  'audioTrack',  // 音轨切换按钮
	  'quality',     // 视频质量切换按钮
	  'speedRate',   // 速率切换按钮
	  'volume',      // 音量
	  'setting',     // 设置
	  //'pip',         // 画中画按钮
	  'pageFullScreen',  // 网页全屏按钮
	  'fullScreen'   // 全屏按钮
	];
	const uploadProgressSchedule = ref(0);
	const progressVisible = ref(false);
	
	const getClassifyByUserIdAndCount = async () => {
		let data = await getclassFyListById(store.state.user.id);
		for(const item of data.data.data){
			let data = await getResourceCountByClassifyId(item.id);
			item.total = data.data.data;
			flList.value.push(item);
		}
		activeList.value = props.firstItem || flList.value[0];
		console.log(activeList.value);
		
	}
	
	const change = (e) => {
		activeList.value = e;
	}
	const changeHandler = async (file,fileList) => {
		let size = Number(file.size / 1024 / 1024);
		let sizeMB = size.toFixed(2);
		let maxSize = 500;
		if(sizeMB > maxSize){
			showElMsg("warning",`单张图片限制在${maxSize}MB以内`);
			let index = fileList.indexOf(file);
			fileList.splice(index,1);
			return false;
		}
		
		
		if(file.raw.type.includes("video")){
			await getVideoCover(file);
			upFileList.value = [...fileList];
		}else {
			upFileList.value = fileList;
		}
	}
	
	const btnsPlayVideoHandler = (file) => {
		
		videoDialog.value = true;
		videoUrl.value = file.videoUrl;
	}
	const btnsPreviewHandler = (file) => {
		previewList.value = [file.url];
		previewVisible.value = true;
	}
	const btnsDeleteHandler = (index) => {
		upFileList.value.splice(index, 1);
		
	}
	const beforeRemoveHandler = () => {
		if (window.event.key == "Backspace" || window.event.key == "Delete") {
		    return false;
		}
	}
	
	const uploadHandler = async () => {
		progressVisible.value = true;
		let fileList = upFileList.value.map(item => item.raw);
		const formData = new FormData();
	
		upFileList.value.forEach((file,index) => {
			formData.append(`resource[${index}].uid`,file.uid);
			formData.append(`resource[${index}].name`,file.name);
			formData.append(`resource[${index}].file`,file.raw);
		})
		formData.append("userId",store.state.user.id);
		formData.append("classify",activeList.value.id);
		formData.append("type","wallpaper");
		let data = await uploadImgList(formData,onUploadPro => {
			uploadProgressSchedule.value = Math.round((onUploadPro.loaded * 100) / onUploadPro.total);
		});
		console.log(data)
		if(data.data.data.length <= 0){
			showElMsg("success","上传失败");
		}else {
			showElMsg("success","上传成功");
			emit('success');
		}
		console.log(data.data.data.length)
		visible.value = false;
		progressVisible.value = false;
		uploadProgressSchedule.value = 0;
	}
	const close = () => {
		upFileList.value = [];
	}
	
	const getVideoCover = (file) => {
		return new Promise((resolve, reject) => {
			const video = document.createElement("video");
			video.src = file.url || URL.createObjectURL(file.raw);
			video.crossOrigin = "anonymous";
			video.currentTime = 1;
		
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
		
			// 视频可播放时（成功分支）
			video.oncanplay = () => {
				canvas.width = video.videoWidth || 320;
				canvas.height = video.videoHeight || 240;
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const videoFirstImgSrc = canvas.toDataURL("image/png");
		
				file.videoUrl = file.url;
				file.url = videoFirstImgSrc;
				video.remove();
				canvas.remove();
				resolve(file.url);
			};
		
			// 视频加载错误（失败分支）
			video.onerror = (err) => {
				video.remove();
				canvas.remove();
				reject(err); // 失败时抛出错误
			};
		  });
	};
	
	const edigHandler = async (index,event) => {
		
		let file = upFileList.value[index];
		let fileName = file.name.substring(0,file.name.lastIndexOf('.'));
		let text = event.target.textContent.trim();
		
		if(text == fileName) return;
		if(text == ''){
			event.target.textContent = fileName;
		}else {
			file.name = text + file.name.substring(file.name.lastIndexOf('.'));
			showElMsg("success","修改成功");
		}
	}
	
	const limitHandler = () => {
		showElMsg("warning","最多只能选择30张")
	}
	
	
	onMounted(() => {
		getClassifyByUserIdAndCount();
	})
	const emit = defineEmits(['success'])
	
</script>

<style scoped>
	:deep(.el-dialog__header){
		padding-bottom: 0;
	}
	#container{
		display: flex;
		align-items: center;
		height: 60px;
		background-color: #F5F5F5;
		padding: 0 10px;
	}
	.drop-box{
		display: flex;
		align-items: center;
		width: 240px;
		height: 50px;
		padding: 4px;
		border: 1px solid #e0e0e0;
	}
	.drop-img{
		width: 80px;
		height: 40px;
	}
	.drop-item-img{
		width: 80px;
		height: 60px;
	}
	.drop-item-box{
		display: flex;
		align-items: center;
		width: 200px;
		height: 60px;
	}
	.drop-item-content-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-top: 10px;
		margin-left: 7px;
	}
	
	#up-main{
		height: 75vh;
		min-height: 400px;
	}
	.up-mod{
		height: 100%;
	}
	.clik-box{
		width: 220px;
		height: 50px;
		background-color: #00aaff;
	}
	.image-icon{
		font-size: 2.2rem;
		color: white;
	}
	.image-icon-text{
		font-size: 1.2rem;
		color: white;
		padding-left: 8px;
	}
	
	.up-mod-footer{
		padding: 10px;
		height: 60px;
		background-color: #f0f0f0;
	}
	.f-left-upload{
		height: 100%;
	}
	.upload-icon{
		font-size: 1.7rem;
		padding-right: 7px;
	}
	.f-left-upload-btn,.f-left-continue-btn{
		height: 100%;
		margin: 0 10px;
		color: white;
		border: 0;
		outline: none;
		font-size: 1.1rem;
	}
	.f-left-continue-btn{
		height: 40px;
		letter-spacing: 1px;
	}
	.upload-main.active{
		display: block;
		overflow-y: auto;
		padding: 30px;
	}
	
	.file-list{
		position: relative;
		width: 100%;
		height: 100%;
	}
	.file-list-image{
		position: absolute;
		top: 0;
		width: 100%;
		height: 80%;
	}
	.file-list-btns{
		position: absolute;
		width: 100%;
		height: 80%;
		background-color: rgb(0, 0, 0,.6);
		z-index: 1;
		opacity: 0;
		transition: opacity .5s ease;
	}
	.file-list-btns:hover{
		opacity: 1;
	}
	.btns-icon{
		font-size: 1.4rem;
		color: white;
		cursor: pointer;
		margin: 0 5px;
	}
	.file-list-image-name{
		width: 100%;
		height: 16%;
		position: absolute;
		bottom: 0;
	}
</style>