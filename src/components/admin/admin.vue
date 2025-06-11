<template>
  <el-container>
    <el-aside :class="['aside', isCollapse ? 'collapse' : '']" :width="isCollapse ? '64px' : '256px'">
      <adminRouter :is-collapse="isCollapse"/>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title || '当前页面' }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="30" :src="userInfo.avatar" />
              <span class="username">{{userInfo.nickName || userInfo.username}}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="visible = true">个人信息</el-dropdown-item>
                <el-dropdown-item divided @click="outLogin">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
  
  <user-info-component :data="userInfo" :visible="visible" @update:visible="visible = $event">
	  
  </user-info-component>
  
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";
import { Fold, Expand } from '@element-plus/icons-vue'
import adminRouter from "./adminRouter.vue";
import userInfoComponent from "./userinfo/info.vue";
import { onMounted, reactive, ref } from 'vue'
import {getUserInfoByToken,outLogin} from '@/api/api'
import { useStore } from "vuex";

const store = useStore();
const route = useRoute()
const isCollapse = ref(false)
const userInfo = ref({})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const user = async () => {
	let {data} = await getUserInfoByToken(store.state.user.token);
	userInfo.value = data.data;
}

// userinfoChildren
const visible = ref(false)


onMounted(()=>{
	user();
})
</script>

<style scoped>
.aside {
  width: 256px;
  height: 100vh;
  background-color: #121e2d;
  transition: width 0.3s;
  overflow: hidden;
}

.aside.collapse {
  width: 64px;
}

.header {
  width: 100%;
  min-height: 60px;
  background: white;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #303133;
}
.collapse-btn:hover {
  color: var(--el-color-primary);
}
.header-right {
  display: flex;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}
.username {
  font-size: 14px;
  color: #303133;
}
:deep(.el-breadcrumb__inner) {
  color: #303133;
}
:deep(.el-breadcrumb__inner.is-link:hover) {
  color: var(--el-color-primary);
}
.main {
  width: 100%;
  height: calc(100vh - 60px);
  padding: 5px;
}
.aside,
.main {
  color: var(--white);
}
</style>
