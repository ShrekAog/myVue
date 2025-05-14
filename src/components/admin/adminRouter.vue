<template>
  <el-container>
    <el-header style="padding: 0; margin: 5px" class="flexCenter">
      <div class="header-content">
        <div v-if="!isCollapse" class="title flexCenter">
          {{ title }}
        </div>
        <img v-else
          :src="getAssetsImageFile('index/admin_logo.png')"
          class="logo-image flexCenter" />
      </div>
    </el-header>
    <el-main class="main">
      <el-menu
        v-if="isRender"
        mode="vertical"
        router
        :default-active="router.path"
        background-color="#121e2d"
        text-color="#8fa6bf"
        class="my-el-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
		<template v-for="item in status.routers" :key="item.id">
			<el-sub-menu v-if="item.children.length > 0" :index="item.id + ' '">
				<template #title>
					<el-image
					  v-if="item.iconPath != ''"
					  class="item-icon"
					  :src="item.iconPath"
					></el-image>
					<span>{{ item.text }}</span>
				</template>	
				<el-menu-item v-for="children in item.children" :key="children.index" :index="children.path">
					<template #title>
						<el-image
						  v-if="children.iconPath != ''"
						  class="item-icon"
						  :src="children.iconPath"
						></el-image>
						<span>{{children.text}}</span>
					</template>
				</el-menu-item>
			</el-sub-menu>
			<el-menu-item v-else :key="item.index" :index="item.path">
				<template #title>
					<el-image
					  v-if="item.iconPath != ''"
					  class="item-icon"
					  :src="item.iconPath"
					></el-image>
					<span>{{ item.text}}</span>
				</template>
			</el-menu-item>
		</template>
		
        <!-- <el-menu-item
          class="menu-item"
          v-for="(item, index) in status.routers"
          :key="index"
          :index="item.path"
        >
          <template #title>{{ item.text }}</template>
          <el-image
            v-if="item.iconPath !== undefined"
            class="item-icon"
            :src="item.iconPath"
          ></el-image>
        </el-menu-item> -->
      </el-menu>
    </el-main>
  </el-container>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getUserRouters,parseUserToken } from "@/api/api";
import { useRoute, useRouter } from "vue-router";
import { getAssetsImageFile } from "@/utils/getAssetsFile";
const isRender = ref(false);
const title = ref("后台管理系统");
const router = useRouter();
const route = useRoute();
const status = reactive({
  routers: [],
});

onMounted(() => {
  getRouters();
});
async function getRouters() {
	let userRes = await parseUserToken(localStorage.getItem("token"));
	let {data: { data },} = await getUserRouters(userRes.data.data);
	status.routers = data;
	console.log(data)
	let currentRouter = localStorage.getItem("router");
	let currentRouterData = currentRouter ? JSON.parse(currentRouter) : null;
	
	//判断旧路由菜单与新路由菜单是否一致，不一致更新本地菜单
	if(JSON.stringify(data) != JSON.stringify(currentRouterData)){
		localStorage.setItem("router",JSON.stringify(data))
	}
	isRender.value = true;
}

defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.header-content {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  width: 50px !important;
  height: 50px !important;
  transition: none !important;
  object-fit: cover;
}

.menu-item {
	user-select: none;
}

.title {
  width: 100%;
  height: 100%;
  letter-spacing: 2px;
  font-size: 1.2rem;
  white-space: nowrap;
}

:deep(.el-header) {
  border-bottom: 1px #192a3f solid;
  height: 80px;
  padding: 0 !important;
  margin: 5px !important;
}
.main {
  padding: 0;
  overflow: hidden;
}
.my-el-menu {
  border: none;
  height: calc(100vh - 80px);
  overflow-y: auto;
  overflow-x: hidden;
}

.my-el-menu::-webkit-scrollbar {
  width: 6px;
}

.my-el-menu::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
}

.my-el-menu::-webkit-scrollbar-track {
  background: transparent;
}

.item-icon {
  width: 25px;
  height: 25px;
  line-height: 0px;
  margin-right: 10px;
}
.item-style {
  display: flex;
  align-items: center;
  width: 100%;
}

:deep(.el-menu--collapse) {
  .el-menu-item {
    display: flex;
    justify-content: center;
    padding: 0 20px !important;
  }

  .item-icon {
    margin: 0;
    width: 20px;
    height: 20px;
  }

  .item-style {
    display: none;
  }
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 56px;
}
</style>
