<template>
	<div id="container">
		<div class="photo-box">
			<div class="left">
				<h2>{{title}}</h2>
				<div class="flexBetWeen" style="height: 60px;">
					<h3>MYOBJECTS</h3>
					<el-icon class="setting-icon" @click="router.push({path:'photos/photosSetting'})">
						<Setting />
					</el-icon>
				</div>
				<div class="classify">
					<div class="item" @click="getData(item,index)" v-for="(item,index) in FyList" :key="item.id"
						:class="{active: index == activeIndex}">
						<el-image class="album-list-image" fit="cover" :src="item.cover"></el-image>

						<el-tooltip class="box-item" effect="dark" :content="item.title"
							placement="bottom">
							<el-text line-clamp="1" style="color: white;font-size: 1.6rem;">{{item.title}}</el-text>
						</el-tooltip>
					</div>
				</div>
				<div class="lfooter flexCenter" style="flex-direction: column;">
					<p>已加载照片:{{photoList.length}}</p>
					<p>总照片:{{pageInfo.total}}</p>
				</div>
				<div class="flexCenter" style="margin-top: 20px;">
					<el-button type="primary" @click="uploadBtnHandler">上传图片</el-button>
				</div>
			</div>
			<div class="right">
				<div class="rtitle">
					<div class="mult-select-btns">
						<template v-if="selectIds.length <= 0 && isMultSelect">
							<el-text type="primary" style="margin-right: 7px;">点击图片即可选中</el-text>
						</template>
						<template v-if="selectIds.length >= 1">
							<el-text type="primary" style="margin-right: 7px;">已选择:{{selectIds.length}}张图片</el-text>
							<el-button type="danger" @click="multRemove">删除全部</el-button>
						</template>

						<el-button type="primary" class="multSelect"
							@click="multSelectHandler">{{selectText}}</el-button>
					</div>

				</div>

				<div id="grid-container">
					<RecycleScroller ref="scrollerRef" style="height: 100%;" @scroll-end="updateScrollData"
						:items="photoList" :item-size="470" :gridItems="5" :itemSecondarySize="405" :buffer="600"
						v-slot="{ item }">

						<virtual-list-photo-item @click="photoCardHandler(item)"
							:class="{'card-item-select':isMultSelect && selectIds.includes(item.id)}" :key="item.id"
							:item="item" />

					</RecycleScroller>
				</div>



			</div>
		</div>
	</div>
	<drawer v-model:visible="drawerVisible" :data="photoItem" @delete="fetchPhotoList(currentId,true)" />
	<resourceUpload v-if="resourceUploadVisible" v-model:visible="resourceUploadVisible" :first-item="firstItem"
		@success="fetchPhotoList(currentId,true)" />
</template>

<script setup>
	import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
	import {
		RecycleScroller
	} from 'vue-virtual-scroller'

	import VirtualList from 'vue-virtual-list-v3';
	import virtualListPhotoItem from './virtualListPhotoItem.vue';
	import {
		nextTick,
		onMounted,
		ref
	} from 'vue';
	import {
		getclassFyListById,
		getResourceByClassifyId,
		getNoteResourceByUserId,
		deleteResourceList,
		showElMsg,
		showElMsgBox
	} from '@/api/api';
	import store from '@/store/store';
	import drawer from './photoDrawer.vue';
	import resourceUpload from './uploadResource.vue';
	import {
		useRouter
	} from 'vue-router';
	const router = useRouter();
	const scrollerRef = ref(null);

	//基础
	const title = ref("PHOTOS");
	const activeIndex = ref(0);
	const currentId = ref(0);

	//列表数据
	const FyList = ref([]);
	const photoList = ref([]);
	const pageInfo = ref({
		current: 1,
		pagesize: 30,
		total: 0
	})

	//弹窗
	const drawerVisible = ref(false);
	const resourceUploadVisible = ref(false);

	//操作数据
	const photoItem = ref({});
	const firstItem = ref({});

	//多选
	const isMultSelect = ref(false);
	const selectText = ref('多选');
	const selectIds = ref([]);


	const fetchPhotoList = async (classifyId, isRefresh = false) => {
		console.log(classifyId)
		const params = {
			classifyId,
			current: pageInfo.value.current,
			pageSize: pageInfo.value.pagesize
		};
		const data = await getResourceByClassifyId(params);
		if (isRefresh) {
			photoList.value = data.data.data.list;
		} else {
			photoList.value = [...photoList.value, ...data.data.data.list];
		}
		pageInfo.value.total = data.data.data.total;

	}


	const getClassFyList = async () => {
		let data = await getclassFyListById(store.state.user.id);
		let noteResource = data.data.data.filter(item => item.title == "说说和日志的照片");
		FyList.value.push(noteResource[0]);
		data.data.data.forEach(item => {
			if (item.title != "说说和日志的照片") {
				FyList.value.push(item);
			}
		});
		firstItem.value = FyList.value[0];
		currentId.value = firstItem.value.id;

		fetchPhotoList(currentId.value, true);
	}

	const updateScrollData = () => {
		if (photoList.value.length >= pageInfo.value.total) return;
		pageInfo.value.current++;
		fetchPhotoList(currentId.value, false);
	}

	const getData = async (item, index) => {
		scrollerRef.value.$el.scrollTop = 0;
		currentId.value = item.id;
		pageInfo.value.current = 1;
		activeIndex.value = index;
		firstItem.value = item;
		fetchPhotoList(currentId.value, true);
	}
	const photoCardHandler = async (item) => {
		if (isMultSelect.value) {
			const index = selectIds.value.findIndex(selected => selected == item.id);
			if (index == -1) {
				selectIds.value.push(item.id);
			} else {
				selectIds.value.splice(index, 1);
			}
			console.log(selectIds.value)
			return;
		}
		drawerVisible.value = true;
		photoItem.value = item;
	}

	const multSelectHandler = () => {
		selectIds.value = [];
		isMultSelect.value = !isMultSelect.value;
		isMultSelect.value ? selectText.value = "取消" : selectText.value = "多选"
	}
	const multRemove = async () => {
		if (selectIds.length <= 0) return;
		showElMsgBox("确定要删除吗?", "警告", "warning", async () => {
			let {
				data
			} = await deleteResourceList(selectIds.value);
			if (data.data) {
				showElMsg("success", "删除成功");
				fetchPhotoList(currentId.value, true);
			}
			multSelectHandler();
		})

	}
	const uploadBtnHandler = () => {
		resourceUploadVisible.value = !resourceUploadVisible.value;
	}

	onMounted(() => {
		getClassFyList();
	})
</script>

<style scoped lang="scss">
	#container {
		width: 100vw;
		height: 100vh;
		background-color: #191917;
	}

	.photo-box {
		display: flex;
	}

	.left {
		min-width: 460px;
		height: 100vh;
		background-color: #010101;
		border-radius: 30px;
		padding: 0 30px;
		padding-top: 30px;

		.album-list-image {
			width: 120px;
			min-width: 120px;
			height: 90px;
			margin-right: 7px;
		}
	}

	h2 {
		color: white;
		font-size: 4rem;
		line-height: 130px;
		border-bottom: 1px white solid;
	}

	h3,
	.setting-icon {
		color: white;
	}

	.setting-icon {
		font-size: 1.6rem;
		cursor: pointer;
	}

	.classify {
		color: white;
		max-height: 600px;
		overflow-y: auto;
		user-select: none;
	}

	.classify::-webkit-scrollbar {
		display: none;
	}

	.item {
		display: flex;
		align-items: center;
		cursor: pointer;
		padding-left: 30px;
		font-size: 1.6rem;
		height: 100px;
		background-color: #0f0f0f;
		border-radius: 20px;
		margin: 20px 0;
		transition: background .45s ease;
	}

	.item:hover {
		background-color: #004264;
	}

	.item.active {
		background-color: #00aaff;
	}

	.lfooter {
		color: white;
		font-size: 1.8rem;
		letter-spacing: .9px;
		margin-top: 30px;
	}

	.right {
		width: 100vw;
		height: 100vh;
		display: block
	}

	.rtitle {
		position: relative;
		min-height: 120px;
		background-color: #0f0f0f;
		box-shadow: 0 2px 12px rgba(255, 255, 255, 0.1);
	}

	.mult-select-btns {
		position: absolute;
		right: 15px;
		bottom: 15px;
	}

	#grid-container {
		height: 80vh;
		overflow-y: auto;
	}

	.card-item-select {
		border: 1px #00aaff solid;
	}

	:deep(.vue-recycle-scroller__item-view:hover .item-wrapper .card-img) {
		transform: scale(1.2);
		cursor: pointer;
	}
</style>