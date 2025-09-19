<template>
	<el-drawer
		style="background-color: #191917;color: white;"
		v-model="visible"
		direction="rtl"
	>
		<div class="image-box">
			<el-image
			 fit="cover" 
			 class="img-item"
			 :src="props.data.imageUrl || props.data.path"
			 :preview-src-list="[props.data.imageUrl || props.data.path]"
			 ></el-image>
		</div>
		<p class="date">NAME:{{props.data.originalName}}</p>
		<p class="date">DATE:{{props.data.createTime}}</p>
		<div class="flexCenter" style="margin-top: 50px;flex-direction: column;">
			<div class="btn-box">
				<el-button type="primary" @click="handelDownload" size="large">下载原图</el-button>
			</div>
			<div class="btn-box">
				<el-button type="danger" @click="delHandler" size="large">删除图片</el-button>
			</div>
		</div>
	</el-drawer>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { deleteResource, showElMsg, showElMsgBox } from '@/api/api';
import store from '@/store/store';

	const visible = defineModel('visible');
	const props = defineProps({
		data: {
			type: Object,
			required:true
		}
	})
	const handelDownload = () => {
		let link = document.createElement('a');
		let url = props.data.imageUrl || props.data.path;
		// 2. 通过 fetch 请求文件，转换为 Blob 格式
		  fetch(url)
		    .then(res => res.blob())  // 将响应体转为 Blob 对象
		    .then(blob => {
		      // 3. 为 <a> 标签生成 Blob 本地 URL
				link.href = URL.createObjectURL(blob)  
		      // 4. 设置下载文件名（这里固定为 'pic'）
				link.download = 'pic'  
		      // 5. 将 <a> 标签插入页面（某些浏览器需要这一步）
				document.body.appendChild(link)  
		      // 6. 模拟点击，触发下载
				link.click();
			  // 关键：下载后清理资源
				URL.revokeObjectURL(link.href)  
			    document.body.removeChild(link)  
		    })
	}
	const delHandler = () => {
		showElMsgBox("确定要删除吗","警告","warning",async () => {
			let data = await deleteResource(props.data.id,store.state.user.id);
			if(data.data.data){
				showElMsg("success","删除成功");
				visible.value = false;
				emit('delete',data.data.data);
			}else {
				showElMsg("error","删除失败");
			}
		})

	}
	const emit = defineEmits(['delete'])
</script>

<style scoped>
	.image-box{
		height: 500px;
		max-height: 600px;
	}
	.img-item{
		width: 100%;
		height: 100%;
	}
	.date{
		font-size: 1.5rem;
		text-align: center;
		margin-top: 30px;
	}
	.btn-box{
		margin-top: 20px;
	}
</style>