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
						<i class="iconfont menu-icon flexCenter" v-if="item.iconPath != ''" v-html="item.iconPath"></i>
					<span>{{ item.text }}</span>
				</template>	
				<el-menu-item v-for="children in item.children" :key="children.index" :index="children.path">
						<i class="iconfont menu-icon flexCenter" v-if="children.iconPath != ''" v-html="children.iconPath"></i>
					<template #title>
						<span>{{children.text}}</span>
					</template>
				</el-menu-item>
			</el-sub-menu>
			<el-menu-item v-else :key="item.index" :index="item.path">
				<i class="iconfont menu-icon flexCenter" v-if="item.iconPath != ''" v-html="item.iconPath"></i>
				<template #title>
					<span>{{ item.text}}</span>
				</template>
			</el-menu-item>
		</template>
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
	.logo-image {
	  width: 50px !important;
	  height: 50px !important;
	  object-fit: cover;
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
	}
	.menu-icon{
		margin-right: 10px;
		font-size: 18px;
		color: white;
	}
	:deep(.el-menu--collapse){
		.menu-icon{
			width: 100%;
			margin: 0;
		}
	}
	


</style>
