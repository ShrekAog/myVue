<template>
	<div class="notes">
		<div class="notes-content">
			<el-card shadow="always" v-if="userInfo != null">
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
					今天不开心
					<div class="notes-image" :class="{'grid-1':indexz == 1,
					'grid-2':indexz == 2,
					'grid-3':indexz == 3,
					'grid-4':indexz == 4,
					'grid-9':indexz >= 5}">
						<el-image v-for="i in indexz" :src="userInfo.avatar" class="img" fit="cover"></el-image>
					</div>
				</template>
				<template #footer>
					写什么好呢！！！！！
				</template>
			</el-card>
		</div>
	</div>
</template>

<script setup>
import { getAssetsImageFile } from '@/utils/getAssetsFile';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { onMounted, ref } from 'vue';
import { getUserInfoById } from '@/api/api';
import { useStore } from 'vuex';
	const vditor = ref(null);
	const indexz = ref(9);
	const userInfo = ref(null);
	const store = useStore();
	const getUser = async () => {
		if(!store.state.isLogin){
			let {data} = await getUserInfoById(1);
			userInfo.value = data.data;
		}else {
			//todo
		}
		
	}
	onMounted(() => {
		getUser();
		
		
		/* vditor.value = new Vditor('vditor',{
			width:'50vw',
			height:'50vh',
			toolbar:[
				'emoji', //表情,
				'headings', //标题,
				'bold', //加粗
				'italic', //斜体
				'strike', //删除线
				'|', 
				'list',  //无序列表
				'ordered-list',  //有序列表
				'check',  //任务列表
				'outdent',  //列表反向缩进
				'indent',  //列表缩进
				'|',
				'quote', //引用
				'line',  //分割线
				'code',  //代码块
				'inline-code',  //行内代码
				'insert-before',  //起始插入行
				'insert-after',  //末尾插入行
				'|',
				'upload', //上传
				'table', //表格
				'|',
				'undo', //撤销
				'redo', //重做
				'|',
				'link', //链接
				'edit-mode', //切换编辑模式
				'fullscreen', //全屏
				'outline', //大纲
				'export' //导出
			],
			after: () => {
				console.log("渲染完成")
				vditor.value.setTheme('dark','dark')
			},
			
		}) */
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