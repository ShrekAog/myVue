<template>
	<el-drawer
		:model-value="visible"
		@update:model-value="emit('update:visible',$event)"
		direction="rtl"
		title="修改分类信息"
		size="500px"
	>
		
		<el-form :model="data" class="form">
			<el-form-item label-position="top" label="标题">
				<el-input v-model="data.title"></el-input>
			</el-form-item>
			<el-form-item label-position="top" label="类型">
				<el-input v-model="data.type"></el-input>
			</el-form-item>
			<el-form-item label-position="top" label="封面">
				<el-tooltip raw-content placement="top" content="请填写封面<span style='color:red'>URL地址</span>">
					<el-input v-model="data.cover"></el-input>
				</el-tooltip>
			</el-form-item>
			<el-form-item label-position="top" label="分类">
				<el-input v-model="data.classify"></el-input>
			</el-form-item>
			<el-form-item label-position="top" label="简介介绍">
				<el-input v-model="data.introduction"></el-input>
			</el-form-item>
			<div class="flexCenter">
				<el-button type="primary" style="width: 50%;" @click="update">{{props.mode == 'add' ? '新增' : '修改'}}</el-button>
			</div>
		</el-form>
		
		
	</el-drawer>
</template>

<script setup>
import { onMounted } from 'vue';
import { updateClassify,insertClassify } from '@/api/api';

	const props = defineProps({
		visible:Boolean,
		data:Object,
		mode:String //新增或者修改eidt add
	})
	
	const update = () =>{
		if(props.mode == 'add'){
			insertClassify(props.data);
		}else {
			updateClassify(props.data);
		}
		emit('update:visible',false);
	}
	
	const emit = defineEmits(['update:visible'])
	
	
</script>

<style scoped>
</style>