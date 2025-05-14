<template>
  <el-drawer
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    title="新增子菜单"
    direction="rtl"
    size="500px"
    :close-on-click-modal="false"
    @close="closeDrawer"
    class="custom-drawer"
  >
    <template #header>
      <div class="drawer-header">
        <h3>新增子菜单</h3>
        <p class="drawer-subtitle">为 "{{ props.parentText }}" 添加子菜单</p>
      </div>
    </template>

    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-position="top"
      class="drawer-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="父路由名称">
            <el-input :value="props.parentText" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="父路由路径">
            <el-input :value="props.parentPath" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="展示名称" required prop="text">
            <el-input v-model="formData.text" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由路径" required prop="path">
            <el-input v-model="formData.path" placeholder="请输入路由路径"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="图片路径" required prop="iconPath">
            <template #label>
              图片路径
              <el-tooltip placement="top" effect="dark" content="图片的网络路径">
                <el-icon class="tip-icon"><WarningFilled /></el-icon>
              </el-tooltip>
            </template>
            <el-input v-model="formData.iconPath" placeholder="请输入图片路径"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由权限" required prop="permissionId">
            <el-select v-model="formData.permissionId" placeholder="请选择角色">
              <el-option
                v-for="item in permissionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="排序标记" required prop="sortOrder">
            <template #label>
              排序标记
              <el-tooltip placement="top" effect="dark" content="路由菜单的排序">
                <el-icon class="tip-icon"><WarningFilled /></el-icon>
              </el-tooltip>
            </template>
            <el-input v-model="formData.sortOrder" placeholder="请输入排序编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import { WarningFilled } from "@element-plus/icons-vue";
import { addRouter, showElMsg } from "@/api/api";

const props = defineProps({
  visible: Boolean,
  parentId: Number,
  parentPath: {
    type: String,
    default: "",
  },
  parentText: {
    type: String,
    default: "",
  },

});

const emit = defineEmits(["update:visible", "success"]);

const formRef = ref(null);
const loading = ref(false);

const formData = reactive({
  text: "",
  path: "",
  iconPath: "",
  permissionId: "",
  sortOrder: "",
  parentId: 0,
  level: 2,
  isHidden: 0,
});

const permissionOptions = [
  { value: 1, label: "管理员" },
  { value: 2, label: "普通用户" },
];

const rules = {
  text: [
    { required: true, message: "请输入菜单名称" },
    { min: 2, max: 6, message: "长度在2~6之间", trigger: "blur" },
  ],
  path: [{ required: true, message: "请输入路由路径" }],
  iconPath: [{ required: true, message: "请输入图片路径" }],
  permissionId: [{ required: true, message: "请选择路由权限" }],
  sortOrder: [
    { required: true, message: "请输入排序编号" },
    { min: 1, max: 3, message: "长度在1~3之间" },
  ],
};

const closeDrawer = () => {
  emit("update:visible", false);
  formRef.value?.resetFields();
};

const submitForm = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        formData.parentId = props.parentId;
        formData.path = props.parentPath + '/' + formData.path;
        const { data } = await addRouter(formData);
        if (data.data) {
          showElMsg("success", "添加成功");
          emit("success");
          closeDrawer();
        } else {
          showElMsg("error", "添加失败");
        }
      } catch (error) {
        showElMsg("error", "操作失败");
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.tip-icon {
  margin-left: 4px;
  font-size: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-select) {
  width: 100%;
}

.custom-drawer :deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 20px 20px 0;
}

.drawer-header {
  padding-bottom: 15px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.drawer-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.drawer-subtitle {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.drawer-form {
  padding: 20px;
}

.drawer-form :deep(.el-form-item__label) {
  font-weight: 500;
}

.drawer-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

.drawer-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.drawer-footer {
  padding: 10px 20px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.drawer-form :deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: var(--el-fill-color-light);
}

.drawer-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.drawer-form :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.drawer-form :deep(.el-row) {
  margin-bottom: 8px;
}

.drawer-form :deep(.el-row:last-child) {
  margin-bottom: 0;
}

.drawer-form :deep(.el-col) {
  padding-bottom: 8px;
}
</style>
