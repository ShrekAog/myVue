<template>
	<div>
		<el-dialog v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" align-center>
			<div id="container" class="flexCenterCol">
				<el-progress :percentage="props.data" type="circle" :width="200" />
				<el-text type="danger" style="margin-top: 15px;">请不要刷新该页面，上传完成后将自动关闭</el-text>
			</div>
		</el-dialog>
	</div>
</template>

<script setup>
	const visible = defineModel("visible");
	const props = defineProps({
		data:{
			type: Number,
			required: true
		}
	})
</script>

<style scoped>
	#container{
		height: 600px;
	}
</style>