<template>
	<!-- 外层包装层：负责间距和整体尺寸 -->
	<div class="item-wrapper">
		<div class="card-item" @click="emit('click')">
			<div class="card-image-box">
				<el-image 
					fit="cover" 
					lazy 
					class="card-img" 
					:src="props.item.path"
				>
					<template #placeholder>
						<el-skeleton animated>
							<template #template>
								<el-skeleton-item variant="image" style="min-height: 450px;"></el-skeleton-item>
							</template>
						</el-skeleton>
					</template>
				</el-image>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
	item: {
		type: Object,
		required: true
	}
});

const emit = defineEmits(['click']);
</script>

<style scoped>
.item-wrapper {
	margin: 10px; 
	overflow: hidden;
}

.card-item {
	height: 450px; 
	background-color: rgba(255, 255, 255, 1);
}

.card-image-box {
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.card-img {
	width: 100%;
	height: 100%;
	transition: transform 1.2s ease;
}
</style>