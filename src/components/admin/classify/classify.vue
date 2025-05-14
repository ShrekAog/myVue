<template>
	<el-row>
		<el-col :span="24">
			<el-button type="primary" style="margin-right: 15px;" @click="visible = true;data = {}; mode='add'">新增分类</el-button>
			<el-switch v-model="isShow"></el-switch>
		</el-col>
	</el-row>
	<el-row :gutter="16" v-if="isShow" align="middle">
		<el-col class="col" :span="8" v-for="item in objects.list" :key="item.id">
			<el-card class="cover" @click="router.push({name:'classifyList',query:{id:item.id,title:item.title}})">
			    <template #header>{{item.title}}</template>
				<el-image :src="item.cover">
					<template #placeholder>
						<p style="color: red;text-align: center;">正在加载</p>
					</template>
				</el-image>
			    <template #footer>{{item.introduction}}</template>
			</el-card>
		</el-col>
	</el-row>
	<el-table :data="objects.list" v-else stripe show-overflow-tooltip>
		<el-table-column label="ID" prop="id" align="center">
			
		</el-table-column>
		<el-table-column label="标题" prop="title" align="center">
			
		</el-table-column>
		<el-table-column label="类型" prop="type" align="center">
			
		</el-table-column>
		<el-table-column label="封面" prop="cover" align="center">
			<template v-slot="{ row }">
				<el-image class="table_cover" :src="row.cover">
					<template #placeholder>
						<p style="color: red;text-align: center;">正在加载</p>
					</template>
				</el-image>
			</template>
		</el-table-column>
		<el-table-column label="分类" prop="classify" align="center">
			
		</el-table-column>
		<el-table-column label="简介" prop="introduction" align="center">
			
		</el-table-column>
		<el-table-column label="状态" prop="status" align="center">
			<template v-slot="{ row }">
				<el-switch :model-value="row.status" @update:model-value="(val) => {row.status = val;updateClassify(row)}"></el-switch>
			</template>
		</el-table-column>
		<el-table-column label="创建时间" prop="createTime" align="center">
			
		</el-table-column>
		<el-table-column label="操作" align="center">
			<template v-slot="{ row }">
				<el-button type="primary" @click="visible = true;data = row;mode = 'edit'">修改</el-button>
				<el-button type="danger" @click="del(row.id)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	  
	<classifyCom :visible="visible" :data="data" @update:visible="visible = $event;list()" :mode="mode" />
	
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getfyList,updateClassify,showElMsgBox,deleteClassify } from '@/api/api';
import { useRouter } from 'vue-router';
import classifyCom from '../adminComponent/updateClassify.vue'
	const router = useRouter();
	const isShow = ref(false);
	
	const visible = ref(false);
	const data = ref({});
	const mode = ref('');
	
	const objects = reactive({
		list:[]
	})
	
	const list = async () => {
		let {data} = await getfyList();
		objects.list = data.data;
		
	}
	
	const del = (id) => {
		showElMsgBox("确定要删除吗?","警告","warning",async () => {
			await deleteClassify(id)
			list();
		})
	}
	
	onMounted(()=>{
		list();
	})
	
</script>

<style scoped>
	.cover{
		cursor: pointer;
	}
	.table_cover{
		
	}
	.col{
		margin-top: 25px;
	}
</style>