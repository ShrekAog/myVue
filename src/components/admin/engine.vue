<template>
	<el-main v-if="objects.list.length >= 1">
		<el-table :data="objects.list" row-key="id" show-overflow-tooltip stripe>
			<el-table-column type="selection"></el-table-column>
			<el-table-column
			  align="center"
			  prop="id"
			  label="ID"
			  width="150"
			  sortable
			></el-table-column>
			<el-table-column align="center" prop="engineName" label="名称"></el-table-column>
			<el-table-column align="center" label="图片" width="200">
				<template v-slot="{ row }">
					<el-image class="image" :src="row.resource == null ? '' : row.resource.path"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="path" align="center" label="跳转路径"></el-table-column>
			<el-table-column align="center" label="启用">
				<template v-slot="{ row }">
					<el-switch :model-value="!row.hidden" @update:model-value="(val) => {row.hidden = val ? 0 : 1;putEngine(row)}"></el-switch>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作">
				<template v-slot="{ row }">
					<el-button type="primary" @click="visible = true,rowData = row">修改</el-button>
					<el-button type="danger" @click="del(row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		
		<update-engine :visible="visible" :rowData="rowData" @update:visible="visible = $event">
			
		</update-engine>
		
		
	</el-main>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getEngineList,putEngine,showElMsgBox,deleteEngine } from '@/api/api';
import updateEngine from './adminComponent/updateEngine.vue'

	const objects = reactive({
		list:[],
	})
	const visible = ref(false)
	const rowData = ref({})
	const show = ref(false)
	
	async function getList(){
		let {data} = await getEngineList();
		
		objects.list = data.data;
		console.log(objects.list)
	}
	onMounted(()=>{
		getList();
	})
	function del(id){
		showElMsgBox("确定要删除吗?","警告","warning",() => {
			deleteEngine(id);
			getList();
		})
	}
	
</script>
<style scoped>
	.image{
		width: 70px;
		height: 70px;
	}
</style>