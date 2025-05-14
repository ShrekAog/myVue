<template>
	<el-drawer
		:model-value="visible"
		@update:model-value="emit('update:visible',$event)"
		direction="rtl"
		title="修改引擎信息"
		size="500px"
	>
	
	<el-form :model="rowData" class="form">
		<el-form-item label-position="top" label="ID">
			<el-input v-model="rowData.id" disabled></el-input>
		</el-form-item>
		<el-form-item label-position="top" label="名称">
			<el-input v-model="rowData.engineName"></el-input>
		</el-form-item>
		<el-form-item label-position="top" label="图片">
			<div class="flexCenter" style="width: 100%;">
				<el-image class="icon" :src="rowData.resource == null ? '' : rowData.resource.path" @click="show = true" fit="cover"></el-image>
				<my-upload :show="show" :stroke-width="15" @update:visible="show = $event" :textInside="false" @upload:success="updateFile"></my-upload>
			</div>
		</el-form-item>
		<el-form-item label-position="top" label="跳转路径">
			<el-input v-model="rowData.path"></el-input>
		</el-form-item>
		<div class="flexCenter" style="width: 100%;">
			<el-button type="primary" style="color:white;margin-top: 50px;width: 30%;" @click="putEngine(rowData);emit('update:visible',false)">确定</el-button>
		</div>
	</el-form>
		
		
	</el-drawer>
</template>

<script setup>
	import { ref } from 'vue';
	import { putEngine,getResourceById, deleteResource } from '@/api/api';
	import myUpload from './uploadComponent.vue';
	const props = defineProps({
		visible:Boolean,
		rowData:Object
	})
	
	const updateFile = async (id) => {
		let {data} = await getResourceById(id);
		if(props.rowData.resource != null){
			await deleteResource(props.rowData.resource.id);
		}
		props.rowData.resource = data.data;
		props.rowData.resourceId = id;
		
		let data2 = await putEngine(props.rowData);
	}
	
	const emit = defineEmits(["update:visible"]);
	const show = ref(false)
</script>

<style scoped>
	*{
		color: black;
	}
	.form{
		padding: 30px;
	}
	.icon{
		width: 150px;
		height: 100px;
		border: 1px #ffaa00 solid;
		cursor: pointer;
	}
</style>