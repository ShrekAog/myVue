<template>
	<div class="notes">
		<div class="notes-content">
			<el-button type="primary" size="small" @click="whiteVisible = true">写说说</el-button>
			<template v-for="item in list">
				<el-card shadow="always" v-if="userInfo != null">
					<template #header>
						{{item}}
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
						<div class="notes-image" :class="{'grid-1':indexz == 1,
						'grid-2':indexz == 2,
						'grid-3':indexz == 3,
						'grid-4':indexz == 4,
						'grid-9':indexz >= 5}">
							<el-image v-for="i in indexz" :src="userInfo.avatar" class="img" fit="cover"></el-image>
						</div>
					</template>
					<template #footer>
						<el-text>{{item.createTime}}</el-text>
					</template>
				</el-card>
			</template>
			<el-empty v-if="list.length <= 0" description="暂无数据"></el-empty>
		</div>
	</div>
	<whiteNote :visible="whiteVisible" @update:visible="whiteVisible = $event"></whiteNote>
	
</template>

<script setup>
import { getAssetsImageFile } from '@/utils/getAssetsFile';
import whiteNote from "@/components/whiteNote.vue"
import { onMounted, ref } from 'vue';
import { getUserInfoById,getNoteAll } from '@/api/api';
import { useStore } from 'vuex';
	const indexz = ref(9);
	const userInfo = ref({});
	const store = useStore();
	const list = ref([]);
	const whiteVisible = ref(false);
	
	
	
	
	
	
	
	
	
	const getUser = async () => {
		if(!store.state.isLogin){
			let {data} = await getUserInfoById(1);
			userInfo.value = data.data;
		}else {
			//todo
		}
		
	}
	const noteAll = async () => {
		let {data} = await getNoteAll();
		list.value = data.data;
	}
	onMounted(() => {
		getUser();
		noteAll();
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
	.notes-text{
		padding: 0px 5px 7px;
	}
	.notes-image{
		display: grid;
		grid-template-columns: repeat(3, minmax(100px, 1fr));
		grid-row-gap: 4px;
		grid-column-gap: 4px;
	}
	.grid-1 {
	  grid-template-columns: repeat(1, 1fr);
	}
	.grid-2 {
	  grid-template-columns: repeat(2, 1fr);
	  max-width: 600px;
	}
	.grid-3 {
	  grid-template-columns: repeat(3, 1fr);
	}
	.grid-4 {
	  grid-template-columns: repeat(2, 1fr);
	  max-width: 600px;
	}
	.grid-9 {
	  grid-template-columns: repeat(3, 1fr);
	}
	.img{
		border-radius: 3px;
		max-width: 500px;
	}
	
</style>