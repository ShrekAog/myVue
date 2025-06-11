<template>
	<el-dialog 
	:close-on-press-escape="false"
	:close-on-click-modal="false"
	:model-value="visible"
	@click="resetStatus"
	@update:model-value="emit('update:visible',$event)"
	width="40%"
	style="min-width: 300px;min-height: 600px;position: relative;"
	>	
		<h2 class="title">写说说</h2>
		<div class="main-container">
			<div class="flexCenter">
				<el-input class="area" @click.stop @focus="isFocus = true" v-model="txt" type="textarea" resize="none" :show-word-limit="true" :autosize="{minRows:3,maxRows:7}"></el-input>
				<div class="upimg">
					
					<el-upload
						@click.stop="isFocus = true"
						class="flexCenter"
						:auto-upload="false"
						:show-file-list="false"
						:on-change="photoChange"
						accept=".jpg,.jpeg,.png"
					>
						<el-icon size="30">
							<Camera />
						</el-icon>
					</el-upload>
				</div>
				<div class="upvideo">
					<el-upload
						@click.stop="isFocus = true"
						class="flexCenter"
						:auto-upload="false"
						:show-file-list="false"
						:on-change="videoChange"
						accept=".mp4"
					>
						<el-icon size="30">
							<VideoCamera />
						</el-icon>
					</el-upload>
					
				</div>
			</div>
			<div class="el-box" :class="{'active':isFocus}" @click.stop>
				<el-icon size="20" class="emoji-box" @click.stop="emojiVisible = !emojiVisible">
					<Orange />
				</el-icon>
				<div class="flexCenter">
					可见范围:   
					<el-dropdown trigger="click" @command="getPub" style="cursor: pointer;">
						<span>
							{{isPublicText}}
							<el-icon>
								<arrow-down />
							</el-icon>
						</span>
						<template #dropdown>
							<el-dropdown-item command="0">私密</el-dropdown-item>
							<el-dropdown-item command="1">公开</el-dropdown-item>
						</template>
					</el-dropdown>
					<el-button type="primary" @click="sendNote" style="margin-left: 10px;">发表</el-button>
				</div>
			</div>
			<emojiPicker 
			@click.stop 
			class="picker" 
			v-show="emojiVisible"
			:native="true"
			:hide-search="true" 
			theme="auto" 
			:display-recent="true"  
			@select="emoji"  
			:static-texts="{skinTone:'选择肤色'}"
			:group-names="groupNames"
			/>
		</div>
		<div class="resource-box">
			<div class="close" v-if="list.length >= 1" @click="list = [],fileUrl = []">
				<div>
					图片:{{list.length}} / 9
				</div>
				<el-icon :size="20">
					<Close />
				</el-icon>
			</div>
			<div class="list" v-if="list.length >= 1" :class="{'grid-1':list.length == 1,
						'grid-2':list.length == 2,
						'grid-3':list.length == 3,
						'grid-4':list.length == 4,
						'grid-9':list.length >= 5}">
				<template v-for="(item,index) in fileUrl">
					<vue3-video-play v-if="list[index].type.startsWith('video/')" :src="item" :controlBtns="videoControllerBtns" />
					<el-image v-else class="img" :src="item" fit="cover" :preview-src-list="fileUrl" :initial-index="index"></el-image>
				</template>
			</div>
		</div>
	</el-dialog>
	
</template>

<script setup>
	/* import Vditor from 'vditor';
	import 'vditor/dist/index.css'; */
	import emojiPicker from 'vue3-emoji-picker'
	import 'vue3-emoji-picker/css'
	import { onMounted, ref } from 'vue'
	import { showElMsg } from '@/api/api'
	const txt = ref('')
	const isFocus = ref(false)
	const emojiVisible = ref(false)
	const vditor = ref(null);
	const list = ref([]);
	const fileUrl = ref([]);
	const isPublic = ref(1);
	const isPublicText = ref('公开')
	const groupNames = ref({
		smileys_people: "微笑 & 人",
		animals_nature: "动物 & 自然",
		food_drink: "食物 & 饮品",
		activities: "活动",
		travel_places: "旅游",
		objects: "办公 & 工具",
		symbols: "符号",
		flags: "标志",
		recent: "最近使用"
	})
	const videoControllerBtns = ref([
		'audioTrack', //音轨切换按钮
		'quality',	//视频质量切换按钮
		//'speedRate',	//速率切换按钮
		'volume',	//音量
		//'setting',	//设置
		//'pip',	//画中画按钮
		//'pageFullScreen'	//网页全屏按钮
		//'fullScreen'	//全屏按钮
	])
	
	const publishObj = ref({
		
	})
	
	const emoji = (emoji) => {
		console.log(emoji.i)
		txt.value += emoji.i;
	}
	const photoChange = (file) => {
		if(list.value.length == 9){
			alert("超出文件上限");
			return;
		}
		if(file.raw.type.startsWith('image/')){
			list.value.push(file.raw);
			fileUrl.value.push(URL.createObjectURL(file.raw));
		}else {
			alert("只能选择图片文件");
		}
	
	}
	const videoChange = (file) => {
		if(list.value.length == 9){
			alert("超出文件上限")
			return;
		}
		if(file.raw.type.startsWith('video/')){
			list.value.push(file.raw);
			fileUrl.value.push(URL.createObjectURL(file.raw));
		}else {
			alert("只能选择视频文件");
		}
		
	}
	const resetStatus = () => {
		if(list.value.length <= 0){
			isFocus.value = false;
		}
		if(txt.value.length > 0){
			isFocus.value = true;
		}
		emojiVisible.value = false; 
	}
	
	const getPub = (e) => {
		console.log(e)
		if(e == 1){
			isPublicText.value = "公开";
			isPublic.value = 1;
		}else{
			isPublicText.value = "私密";
			isPublic.value = 0
		}
	}
	const sendNote = () => {
		if(txt.value.length <= 0){
			showElMsg("info","内容不能为空");
			return;
		}
	}



	const props = defineProps({
		visible:Boolean
	})
	const emit = defineEmits(["update:visible"]);
	
	onMounted(() => {
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
	.main-container{
		position: relative;
	}
	.title{
		text-align: center;
		margin-bottom: 9px;
	}
	.active{
		height: 40px !important;
	}
	.el-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px #eee solid;
		height: 0px;
		overflow: hidden;
		padding: 0 5px;
		transition: height .3s ease;
	}
	.emoji-box{
		cursor: pointer;
	}
	.picker{
		min-width: 390px;
		position: absolute;
		left: 15px;
		bottom: -313px;
		z-index: 200;
	}
	.upimg,
	.upvideo{
		cursor: pointer;
		min-width: 50px;
		height: 73px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px #eee solid;
	}
	.resource-box{
		margin-top: 7px;
	}
	.close{
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
	}
	.list{
		display: grid;
		grid-template-columns: repeat(3, minmax(100px, 1fr));
		grid-row-gap: 5px;
		grid-column-gap: 5px;
	}
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