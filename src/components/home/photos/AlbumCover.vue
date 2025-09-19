<template>
	<div>
		<el-dialog v-model="visible" width="600px">
			<div id="photo-list">
				<!-- <div class="title">
					<el-alert title="Info alert" type="info" show-icon :closable="false" />
				</div> -->
				<div class="list-wrapper" v-if="props.data.length >= 1">
					<el-image class="image" lazy v-for="item in props.data" @click="updateCover(item)" fit="cover" :src="item.path" />
				</div>
				<el-empty v-else />
			</div>
		</el-dialog>
	</div>
</template>

<script setup>
	import {
		onMounted
	} from 'vue';
	import {
		showElMsg,
		updateClassify
	} from '@/api/api';

	const visible = defineModel('visible');
	const props = defineProps({
		data: {
			type: Array,
			required: true
		},
		album: {
			type: Object,
			required: true
		}
	})
	const emit = defineEmits(['success']);

	const updateCover = async (item) => {
		let obj = {
			id: props.album.id,
			cover: item.path
		}
		let data = await updateClassify(obj);
		if (data.data.data) {
			showElMsg("success", "修改成功");
			visible.value = !visible.value;
			emit('success');
		}
	}


	onMounted(() => {
		console.log(props.album.id)
	})
</script>

<style scoped>
	.list-wrapper {
		max-height: 500px;
		overflow-y: auto;
		display: grid;
		grid-template-columns: repeat(4, minmax(120px, 220px));
		grid-gap: 10px;
	}
	.image{
		height: 120px;
	}
</style>