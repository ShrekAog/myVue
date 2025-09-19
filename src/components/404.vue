<template>
	<el-result title="404" sub-title="请检查您的访问路径">
		<template #icon>
			<el-image :src="getAssetsImageFile('404.png')"></el-image>
		</template>
	</el-result>
</template>

<script setup>
	import { useRoute, useRouter } from 'vue-router';
	import { getAssetsImageFile } from '@/utils/getAssetsFile';
	import { onMounted, reactive, ref,h } from 'vue';
	import { ElNotification } from 'element-plus';
	const router = useRouter();
	const remaining = ref(5);
	
	onMounted(() => {
		ElNotification({
			title:"即将跳转",
			dangerouslyUseHTMLString:true,
			message:`<div id="duration"><span style="color:red">${remaining.value}秒后进行跳转</span>`,
			duration:0,
			showClose:false
		});
	})
	const notificationDuration = (duration) => {
		let div = document.querySelector("#duration")
		div.querySelector('span').remove();
		div.insertAdjacentHTML('beforeend',`<span style="color:red">${duration}秒后进行跳转</span`)
	}
	const interval = setInterval(() => {
		if(remaining.value <= 1){
			clearInterval(interval);
			router.back();
		}else {
			remaining.value--;
			notificationDuration(remaining.value);
		}
	},1000)
</script>

<style scoped>
</style>