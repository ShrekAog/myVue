<template>
	<div id="container">
		<div class="main">
			<div class="bg">
				<video class="video" src="../../../assets/image/bg.mp4" autoplay muted loop></video>
				<div class="user-info">
					<div style="display: flex;">
						<el-image class="avatar" fit="cover" :src="userInfo.avatar"></el-image>
						<div>
							<p class="uname">{{ userInfo.nickName }}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="content-wrap">
				<div class="content-list-wrap">
					<div style="padding: 80px;">
						<el-tabs @tab-change="tabHandler" v-model="activeName">
							<el-tab-pane label="相册" name="photo"></el-tab-pane>
							<el-tab-pane label="视频" name="video"></el-tab-pane>
						</el-tabs>
						<div v-if="!isList">
							<el-button v-if="activeName == 'photo'" type="primary" class="create-btn"
								@click="cardHandler('photo', null, false)">新建相册</el-button>
							<el-button v-else type="primary" class="create-btn">上传视频</el-button>

							<div class="items">
								<template v-for="item in list" :key="item.id">
									<!-- //相册列表 -->
									<template v-if="activeName == 'photo'">
										<el-card @click="photosHandler(item)" class="card" :body-style="{ padding: '0' }">
											<div class="photo-card-warpper">
												<el-icon @click.stop="cardHandler('photo', item)" class="setting-icon">
													<SetUp />
												</el-icon>
												<el-image class="media-cover" :src="item.cover" fit="cover"></el-image>
												<el-text class="photo-count">{{ item.count }}</el-text>
											</div>
											<template #footer>
												<el-text>{{ item.title }}</el-text>
											</template>
										</el-card>
									</template>
									<!-- //视频列表 -->
									<template v-if="activeName == 'video'">
										<el-card class="card" :body-style="{ padding: '0' }">
											<div class="video-card-warpper">
												<div class="play-overlay"></div>
												<el-image class="media-cover" fit="cover" :src="item.cover"></el-image>
												<el-icon @click="cardHandler('video', item)" class="video-icon">
													<VideoPlay />
												</el-icon>
											</div>
											<template #footer>
												<el-text>{{ item.originalName }}</el-text>
											</template>
										</el-card>
									</template>
								</template>
							</div>
						</div>

						<template v-else>
							<div class="photo-list-grid">
								<div class="album">
									<el-image class="album-cover" fit="cover" :src="classifyItem.cover" />
									<div class="album-content">
										<div>
											<el-text class="album-title">{{ classifyItem.title }}</el-text>
											<el-text class="album-count">/{{ classifyItem.count }}张</el-text>
										</div>
										<div class="album-btns flexCenter">
											<el-button class="album-upload" type="primary"
												@click="resourceUploadVisible = true">
												<el-icon class="image-icon">
													<el-icon>
														<Picture />
													</el-icon>
												</el-icon>
												上传照片
											</el-button>
											<el-button type="info" @click="upAlbumCover">
												编辑相册封面
											</el-button>
											<el-button type="danger" @click="albumRemoveHandler">
												删除相册
											</el-button>
										</div>
									</div>
								</div>


								<div class="photo-list">
									<template v-if="dataList.length >= 1">
										<div class="photo-list-wrap">
											<template v-for="item in dataList" :key="item.id">
												<el-card v-if="!item.cover" class="card" :body-style="{ padding: '0' }">
													<div class="ph-position" @mouseover="item.isFocus = true"
														@mouseout="item.isFocus = false">
														<el-image :preview-src-list="[item.path]" lazy
															class="ph-list-img" fit="cover" :src="item.path" />
														<el-dropdown @command="phPositionDropHandler($event, item)"
															v-show="item.isFocus" class="setting-drop" trigger="click"
															:teleported="false">
															<el-icon class="setting-icon">
																<Setting />
															</el-icon>
															<template #dropdown>
																<el-dropdown-menu>
																	<el-dropdown-item command="delete">
																		<el-icon>
																			<Delete />
																		</el-icon>
																		删除
																	</el-dropdown-item>
																	<el-dropdown-item>
																		<el-icon>
																			<Delete />
																		</el-icon>
																		功能暂定
																	</el-dropdown-item>
																</el-dropdown-menu>
															</template>
														</el-dropdown>
													</div>
													<template #footer>
														{{ item.createTime }}
													</template>
												</el-card>
												<el-card v-else class="card" :body-style="{ padding: '0' }">
													<div class="video-card-warpper" style="height:160px"
														@mouseover="item.isFocus = true"
														@mouseout="item.isFocus = false">
														<div class="play-overlay" style="height: 160px;"></div>
														<el-image style="height: 160px;" class="media-cover" fit="cover"
															:src="item.cover"></el-image>
														<el-icon @click="cardHandler('video', item)" class="video-icon">
															<VideoPlay />
														</el-icon>
														<el-dropdown @command="phPositionDropHandler($event, item)"
															v-show="item.isFocus" class="setting-drop" trigger="click"
															:teleported="false">
															<el-icon class="setting-icon">
																<Setting />
															</el-icon>
															<template #dropdown>
																<el-dropdown-menu>
																	<el-dropdown-item command="delete">
																		<el-icon>
																			<Delete />
																		</el-icon>
																		删除
																	</el-dropdown-item>
																	<el-dropdown-item>
																		<el-icon>
																			<Delete />
																		</el-icon>
																		功能暂定
																	</el-dropdown-item>
																</el-dropdown-menu>
															</template>
														</el-dropdown>
													</div>
													<template #footer>
														<el-text>{{ item.originalName }}</el-text>
													</template>
												</el-card>
											</template>
										</div>
										<div class="flexCenter">
											<el-pagination @current-change="handleCurrentChange"
												@size-change="handleSizeChange" background
												layout="sizes, prev, pager, next" hide-on-single-page
												v-model:current-page="pageInfo.current"
												v-model:page-size="pageInfo.pagesize" :page-sizes="[10, 20, 30]"
												:total="pageInfo.total" />
										</div>
									</template>
									<el-empty v-else :description="'暂无内容，快去上传吧！'" />
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
		</div>
		<mfooter />
	</div>

	<!-- //上传 -->
	<resourceUpload v-if="resourceUploadVisible" v-model:visible="resourceUploadVisible" :firstItem="classifyItem"
		@success="upSuccess" />
	<!-- //浏览视频 -->
	<el-dialog v-model="videoVisible" :close-on-click-modal="false">
		<vue3-video-play v-if="videoVisible" loop auto-play :src="videoUrl" width="100%" height="100%" />
	</el-dialog>
	<!-- 相册部分信息 -->
	<transition name="fade">
		<div v-if="isDialog" class="classify-overlay">
			<div class="classify-update">
				<el-icon class="close-icon" @click="close">
					<Close />
				</el-icon>
				<div class="flexCenterCol" style="margin-top: 30px;">
					<el-text>{{ isDialogText }}</el-text>
					<div style="margin-top: 15px;">
						<el-form-item label="名称:">
							<el-input v-model="updateItem.title" maxlength="30" show-word-limit />
						</el-form-item>
						<el-form-item label="描述:">
							<el-input resize="none" :rows="5" type="textarea" v-model="updateItem.introduction"
								maxlength="200" show-word-limit></el-input>
						</el-form-item>
						<el-form-item v-if="isDialogText == '新增相册'" label="类别:">
							<el-dropdown style="width: 100%;" @command="dropHandler">
								<el-input disabled type="text" v-model="updateItem.type" />
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item command="动漫">动漫</el-dropdown-item>
										<el-dropdown-item command="风景">风景</el-dropdown-item>
										<el-dropdown-item command="聚会">聚会</el-dropdown-item>
										<el-dropdown-item command="动物">动物</el-dropdown-item>
										<el-dropdown-item command="其他">其他</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</el-form-item>

					</div>
				</div>
				<div class="footer-btn">
					<el-button type="primary" @click="updateFy">确定</el-button>
					<el-button type="info" @click="close">取消</el-button>
				</div>
			</div>
		</div>
	</transition>
	<album-cover-item v-if="isAlbumCover" v-model:visible="isAlbumCover" :album="classifyItem" :data="dataList"
		@success="reloadList" />
</template>

<script setup>
import albumCoverItem from './AlbumCover.vue';
import resourceUpload from './uploadResource.vue';
import mfooter from "@/components/footer.vue"
import Vue3VideoPlay from 'vue3-video-play'
import 'vue3-video-play/dist/style.css'
import {
	onMounted,
	reactive,
	ref
} from 'vue';
import {
	deleteClassify,
	deleteResource,
	getResourceByClassifyId,
	getResourceCountByClassifyId,
	getResourceVideoListById,
	getUserInfoById,
	getVideoCover,
	getclassFyListById,
	insertClassify,
	showElMsg,
	showElMsgBox,
	updateClassify
} from '@/api/api';
import store from '@/store/store';
const userInfo = ref({});
const list = ref([]);
const dataList = ref([]);
const classifyItem = ref({});
const activeName = ref('photo');
const videoUrl = ref('');
//显示照片列表
const isList = ref(false);
//相册编辑
const isDialog = ref(false);
const isDialogText = ref('');
//预览视频
const videoVisible = ref(false);
//上传图片
const resourceUploadVisible = ref(false);
//编辑相册封面
const isAlbumCover = ref(false);
const updateItem = reactive({
	id: '',
	title: '',
	introduction: ''
})
const pageInfo = ref({
	current: 1,
	pagesize: 30,
	total: 0
})
const init = () => {
	getUserInfo();
	getClassifyByUserId();
}
const getUserInfo = async () => {
	let data = await getUserInfoById(store.state.user.id);
	userInfo.value = data.data.data;
}
const tabHandler = () => {
	isList.value = false;
	dataList.value = [];
	if (activeName.value == "video") {
		getResourceVideoList();
	} else {
		getClassifyByUserId();
	}
}

const getData = async () => {
	dataList.value = [];
	let params = {
		classifyId: classifyItem.value.id,
		current: pageInfo.value.current,
		pageSize: pageInfo.value.pagesize
	}
	let {
		data: {
			data
		}
	} = await getResourceByClassifyId(params);

	pageInfo.value.total = data.total;
	dataList.value = await addVideoCover(data.list);
}

const handleCurrentChange = (newCurrent) => {
	pageInfo.value.current = newCurrent;
	getData();
}
const handleSizeChange = (newSize) => {
	const maxPage = Math.ceil(pageInfo.value.total / newSize);
	if (pageInfo.value.current > maxPage) {
		pageInfo.value.current = 1;
	}
	getData();
}


const getClassifyByUserId = async () => {
	let data = await getclassFyListById(store.state.user.id);
	list.value = data.data.data;
	list.value.forEach(async item => {
		let data = await getResourceCountByClassifyId(item.id);
		item.count = data.data.data;
	})
}

const getResourceVideoList = async () => {
	let data = await getResourceVideoListById(store.state.user.id);
	list.value = data.data.data;
	list.value.forEach(async item => {
		let data = await getVideoCover(item.path)
		item.cover = data;
	})
}

const cardHandler = (type, item, update = true) => {
	if (type == "photo") {
		isDialog.value = !isDialog.value;
		if (update) {
			isDialogText.value = "编辑相册信息";
			updateItem.id = item.id;
			updateItem.title = item.title;
			updateItem.introduction = item.introduction;
		} else {
			isDialogText.value = "新增相册";
		}

	} else {
		videoUrl.value = item.path;
		videoVisible.value = true;
	}
}

const photosHandler = async (item) => {
	isList.value = !isList.value;
	activeName.value = '';
	classifyItem.value = item;
	let data = await getResourceByClassifyId({
		classifyId: item.id,
		current: pageInfo.value.current,
		pageSize: pageInfo.value.pagesize
	});
	dataList.value = data.data.data.list;
	// dataList.value = await addVideoCover(data.data.data.list);
	pageInfo.value.total = data.data.data.total;

}

const addVideoCover = async (list) => {
	for (const item of list) {
		if (item.mimeType.startsWith('video/')) {
			let data = await getVideoCover(item.path);
			item.cover = data;
		}
	}
	return list;
}

const upSuccess = () => {
	resourceUploadVisible.value = !resourceUploadVisible.value;
	getData();
}


const updateFy = async () => {
	if (updateItem.title == '' || updateItem.introduction == '') {
		showElMsg("warning", "内容不能为空");
		return;
	}
	if (updateItem.title.length > 30 || updateItem.introduction.length > 200) {
		showElMsg("warning", "超过最大字数限制");
		return;
	}
	if (isDialogText == '新增相册' && updateItem.type == null) {
		showElMsg("warning", "类别不能为空");
		return;
	}

	let success;
	if (isDialogText.value == "新增相册") {
		console.log("新增");
		updateItem.userId = store.state.user.id;
		let {
			data: {
				data
			}
		} = await insertClassify(updateItem);
		success = data;
	} else {
		console.log("编辑");
		let {
			data: {
				data
			}
		} = await updateClassify(updateItem);
		success = data;
	}
	if (success) {
		showElMsg("success", "操作成功");
	}
	close();
	getClassifyByUserId();

	/* let data = await updateClassify(updateItem);
	if(data.data.data){
		showElMsg("success","操作成功");
		close();
		getClassifyByUserId();
	} */
}
const dropHandler = (e) => {
	updateItem.type = e;
}
const albumRemoveHandler = () => {
	showElMsgBox("删除相册会一并删除全部照片,确定删除吗?", "警告", "warning", async () => {
		let {
			data: {
				data
			}
		} = await deleteClassify(classifyItem.value.id);
		if (data) {
			showElMsg("success", "删除成功");
		} else {
			showElMsg("error", "删除失败");
		}
		reloadList();
	})
}
const phPositionDropHandler = async (e, item) => {
	if (e == "delete") {
		let {
			data: {
				data
			}
		} = await deleteResource(item.id, store.state.user.id);
		if (data) {
			showElMsg("success", "删除成功");
		} else {
			showElMsg("error", "删除失败");
		}
		getData();
	}
}

const close = () => {
	isDialog.value = !isDialog.value;
	updateItem.id = '';
	updateItem.title = '';
	updateItem.type = '';
	updateItem.introduction = '';
}

const upAlbumCover = () => {
	isAlbumCover.value = !isAlbumCover.value
}
const reloadList = () => {
	isList.value = !isList.value;
	getClassifyByUserId();
	activeName.value = "photo";
}


onMounted(() => {
	init();
})
</script>

<style scoped lang="scss">
#container {
	position: relative;
	width: 100vw;
	overflow: auto;
	background-color: rgba(199, 199, 199, .5);
}

.main {
	margin-bottom: 15px;
}

.bg {
	position: relative;
	width: 100vw;
	height: 400px;
	filter: brightness(.8);
}

.video {
	width: 100%;
	min-width: 450px;
	height: 100%;
	object-fit: cover;
	object-position: center 30%;
}

.user-info {
	width: 1200px;
	margin: 0 auto;
	transform: translateY(-100px);
}

.avatar {
	width: 120px;
	height: 120px;
	border: 3px solid white;
	border-radius: 3px;
}

.uname {
	color: white;
	font-size: 1.2rem;
	margin-left: 10px;
}

.content-wrap {
	display: flex;
	justify-content: center;
	width: 100%;
	min-height: 800px;
	overflow: auto;

	.content-list-wrap {
		width: 1640px;
		background-color: white;
	}

	.create-btn {
		margin-bottom: 7px;
	}
}

.items {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 15px 35px;

	.photo-card-warpper {
		position: relative;
		overflow: hidden;

		.setting-icon {
			position: absolute;
			top: 10px;
			right: 10px;
			font-size: 1.5rem;
			color: white;
			z-index: 1;
			cursor: pointer;
		}

		.media-cover {
			width: 100%;
			height: 200px;
			transition: transform .7s ease;
		}

		.media-cover:hover {
			transform: scale(1.3);
		}

		.photo-count {
			position: absolute;
			right: 10px;
			bottom: 10px;
			color: red;
			font-size: 1.5rem;
		}
	}
}

/* .card {
		width: 200px;
	} */

.media-cover {
	width: 100%;
	height: 200px;
}

.video-card-warpper {
	position: relative;
	height: 200px;

	.play-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .4);
		z-index: 1;
	}
}



.video-icon {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	color: white;
	font-size: 2.2rem;
	cursor: pointer;
	z-index: 2;
}


.classify-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, .4);
	z-index: 2;
}

.classify-update {
	position: relative;
	width: 25%;
	height: 460px;
	min-height: 300px;
	color: white;
	backdrop-filter: blur(40px);
	background-color: rgba(255, 255, 255, .8);
	border-radius: 10px;
	padding: 15px;
	z-index: 999;
}

.fade-enter-active {
	animation: setting-dialog-up .3s;
}

.fade-leave-active {
	animation: setting-dialog-out .3s;
}

.close-icon {
	position: absolute;
	right: 10px;
	top: 10px;
	font-size: 1.5rem;
	color: black;
	cursor: pointer;
}

.footer-btn {
	position: absolute;
	bottom: 10px;
	right: 5px;
}

.photo-list-grid {
	width: 100%;

	.image-icon {
		font-size: 1.5rem;
		padding-right: 15px;
	}

	.album {
		display: flex;

		.album-cover {
			width: 80px;
			height: 80px;
			border-radius: 5px;
		}

		.album-content {
			min-width: 250px;
			margin-left: 12px;

			.album-title {
				font-size: 1.5rem;
				letter-spacing: 1px;
				color: #000;
			}
		}

		.album-btns {
			margin-top: 15px;
		}

	}

	.photo-list {

		/* height: 1000px;
			overflow-y: auto; */
		.photo-list-wrap {
			margin: 15px 0;
			display: grid;
			grid-gap: 10px;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

			.ph-position {
				position: relative;
			}

			.card {
				width: 200px;
			}

			.ph-list-img {
				width: 100%;
				height: 160px;

			}

		}
	}

}

.setting-drop {
	cursor: pointer;
	position: absolute;
	top: 5px;
	right: 5px;
	z-index: 999;
}

.setting-icon {
	font-size: 1.3rem;
	color: white;
}
</style>