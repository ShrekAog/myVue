<template>
	<h2 style="color: red;text-align: center;margin: 20px;">{{route.query.title}}</h2>
	<el-row :gutter="25" v-if="objects.list.length >= 1">
		<el-col :span="6" v-for="(item,index) in objects.list" class="item">
			<el-image
				class="cover"
				:src="item.path"
				loading="lazy"
				:preview-src-list="[item.path]"
				fit="cover"
				:hide-on-click-modal="true"
			>
				<template #placeholder>
					<p style="color: red;text-align: center;">正在加载</p>
				</template>
			</el-image>
		</el-col>
	</el-row>
	<el-empty v-else description="数据为空" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import { getListByClassifyId } from '@/api/api';
import { onMounted, reactive } from 'vue';
const objects = reactive({
	list:[]
})
const route = useRoute();
const list = async () => {
	let {data} = await getListByClassifyId(route.query.id);
	objects.list = data.data;
}
onMounted(() => {
	list();
})
</script>

<style scoped>
	.cover{
		border-radius: 5px;
		width: 100%;
		height: 100%;
	}
	.item{
		margin: 15px 0;
		height: 280px;
	}
</style>