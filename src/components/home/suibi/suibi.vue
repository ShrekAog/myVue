<template>
	<div class="notes">
		<div class="notes-content">
			<el-button v-if="store.state.user.isLogin" type="primary" size="small" @click="whiteVisible = true" style="margin-bottom: 10px;">写说说</el-button>
			<h3 v-else style="text-align: center;font-size: 13px;">
				请先登录
			</h3>
				<template v-for="(item,index) in list.data" :key="item.id" v-if="list">
					<el-card shadow="always" style="margin-bottom: 10px;">
						<template #header>
							<div style="display: flex;">
								<el-avatar v-if="userInfo.avatar != null" :src="userInfo.avatar" shape="square"></el-avatar>
								<el-avatar v-else :src="getAssetsImageFile('avatar.png')" shape="square"></el-avatar>
								<div class="header-nick">
									<el-text>{{userInfo.nickName}}</el-text>
								</div>
							</div>
						</template>
						<template #default>
							<p class="notes-text">
								{{item.content}}
							</p>
							
							<div class="notes-image" :class="{'grid-1':list.data[index].resources.length == 1,
							'grid-2':list.data[index].resources.length == 2,
							'grid-3':list.data[index].resources.length == 3,
							'grid-4':list.data[index].resources.length == 4,
							'grid-9':list.data[index].resources.length >= 5}">
								
								<template v-for="(itemc,indexc) in item.resources">
									<el-image
									fit="cover"
									class="img"
									v-if="itemc.path.slice(itemc.path.lastIndexOf('.') + 1) != 'mp4'"
									:src="itemc.path"
									:preview-src-list="item.previewList"
									:initial-index="indexc"
									>
										<template #placeholder>
											<h4 style="color: red;text-align: center;">正在加载...</h4>
										</template>
									</el-image>
									<vue3-video-play loop auto-play v-else :src="itemc.path" :controlBtns="videoControllerBtns" />
								</template>
							</div>
								
							
						</template>
						<template #footer>
							<div class="flexBetWeen">
								<el-text>{{item.createTime}}</el-text>
								<el-button type="danger" @click="delNote(item.id)">删除</el-button>
							</div>
						</template>
					</el-card>
				</template>
				<el-empty v-else description="暂无数据"></el-empty>
				<div class="pagination flexCenter" v-if="list">
				  <el-pagination background layout="prev, pager, next" v-model:current-page="pageInfo.current" :page-size="5" :total="pageInfo.total" @change="changePage" />
				</div>
		</div>
		<p style="text-align: center;font-size: 12px;margin-top: -80px;padding-bottom: 40px;">到底啦</p>
	</div>
	<whiteNote :visible="whiteVisible" @update:visible="whiteVisible = $event" @getNote="getNoteData"></whiteNote>
	
</template>

<script setup>
	import Vue3VideoPlay from 'vue3-video-play'
	import 'vue3-video-play/dist/style.css'
import { getAssetsImageFile } from '@/utils/getAssetsFile';
import whiteNote from "@/components/home/suibi/whiteNote.vue"
import { onMounted, reactive, ref } from 'vue';
import { getUserInfoById,getNoteByUserId,showElMsgBox,delNoteById, showElMsg } from '@/api/api';
import { useStore } from 'vuex';
	const userInfo = ref({});
	const store = useStore();
	let list = ref();
	const whiteVisible = ref(false);
	const previewList = reactive([]); //用户预览图片
	const videoControllerBtns = ref([
		'audioTrack', //音轨切换按钮
		'quality',	//视频质量切换按钮
		//'speedRate',	//速率切换按钮
		'volume',	//音量
		//'setting',	//设置
		//'pip',	//画中画按钮
		//'pageFullScreen',	//网页全屏按钮
		'fullScreen'	//全屏按钮
	])
	const pageInfo = reactive({
		current:1,
		pageSize:5,
		total:0
	})
	
	
	async function changePage(e){
		pageInfo.current = e;
		getNoteData();
	}
	
	
	const getNoteData = async () => {
		
		if(!store.state.user.isLogin){
			let data = await getUserInfoById(1);
			userInfo.value = data.data;
		}else {
			getUser();
			let {data} = await getNoteByUserId({
				userId:store.state.user.id,
				current:pageInfo.current,
				pageSize:pageInfo.pageSize
			})
			
			list.value = data.data;
			if(!list.value){
				return;
			}
			for(let i = 0 ; i < list.value.data.length ; i++){
				list.value.data[i].previewList = [];
				for(let j = 0 ; j < list.value.data[i].resources.length ; j++){
					let type = list.value.data[i].resources[j].path.slice(list.value.data[i].resources[j].path.lastIndexOf('.') + 1 );
					if(type != "mp4"){
						list.value.data[i].previewList.push(list.value.data[i].resources[j].path);
					}
				}
			}
			console.log(list.value)
			pageInfo.total = list.value.total;
		}
		
	}
	const getUser = async () => {
		let res = await getUserInfoById(store.state.user.id);
		userInfo.value = res.data.data;
		
	}
	const noteAll = async () => {
		/* let {data} = await getNoteAll();
		list.value = data.data; */
	}
	const delNote = (id) => {
		showElMsgBox("确定要删除吗?","警告","warning",async () => {
			let data = await delNoteById(id);
			if(data.data.data){
				showElMsg("success","删除成功");
				getNoteData();
			}else{
				showElMsg("error","未知错误");
			}
		})
	}
	onMounted(() => {
		getNoteData();
	})
	
</script>

<style scoped>
	.notes{
		background-image: 
		linear-gradient(90deg, rgba(60, 10, 30, .05) 5%, white 0), 
		linear-gradient(1turn, rgba(60, 10, 30, .05) 5%, white 0);
		background-size: 20px 20px;
		
	}
	.notes-content{
		width: 70%;
		max-width: 750px;
		margin: 0 auto;
		border-radius: 15px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
		background: white;
		position: relative;
		top: -120px;
		padding: 15px 15px 35px;
	}
	.header-nick{
		margin-left: 10px;
		transform: translateY(-7px);
	}
	:deep(.el-card__header){
		border: 0;
	}
	:deep(.el-card__body){
		padding-top: 0;
	}
	.notes-text{
		padding: 0px 5px 7px;
	}
	.notes-image{
		display: grid;
		/* grid-template-columns: repeat(3, minmax(100px, 1fr)); */
		grid-row-gap: 4px;
		grid-column-gap: 4px;
	}fr
	.grid-1 {
	  grid-template-columns: repeat(1, 1fr);
	}
	.grid-2 {
	  grid-template-columns: repeat(2, 1fr);
	 
	}
	.grid-3 {
	  grid-template-columns: repeat(3, 1fr);
	}
	.grid-4 {
	  grid-template-columns: repeat(2, 1fr);
	}
	.grid-9 {
	  grid-template-columns: repeat(3, 1fr);
	}
	.img{
		width: 100%;
		height: 100%;
		min-height: 180px;
	}
	:deep(.d-player-wrap){
		width: 100%;
		height: 100%;
		min-height: 180px;
	}
</style>