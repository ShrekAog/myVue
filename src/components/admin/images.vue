<template>
  <el-button type="primary" @click="showAdd = true">上传图片</el-button>
  <el-button type="danger" @click="deleteList">批量删除</el-button>
  <div v-if="objects.list.length <= 0" class="flexCenter null">
    <el-empty description="暂无数据"></el-empty>
  </div>
  <div v-else>
    <el-main v-if="isRender">
      <el-table
        :data="objects.list"
        row-key="id"
        class="table"
        show-overflow-tooltip
        @selection-change="selectChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          align="center"
          prop="id"
          label="ID"
          sortable
        ></el-table-column>
        <el-table-column align="center" prop="path" label="图片" width="200">
          <template v-slot="{ row }">
            <el-image
              lazy
              fit="cover"
              class="image"
              :src="row.path"
              :preview-src-list="[row.path]"
              :z-index="1000"
              preview-teleported
            ></el-image>
          </template>
        </el-table-column>
		<el-table-column align="center" prop="path" label="路径">
		</el-table-column>
        <el-table-column
          align="center"
          prop="type"
          label="类型"
          :filters="objects.filters"
          :filter-method="filterHandler"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="originalName"
          label="图片名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="mimeType"
          label="传输类型"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="storeType"
          label="存储方式"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="size"
          label="图片大小"
          sortable
          width="110"
        >
          <template v-slot="{ row }">
            {{
              (row.size / (1024 * 1024)).toFixed(2) <= 0.0
                ? "<1"
                : (row.size / (1024 * 1024)).toFixed(2)
            }}MB
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="上传时间"
        ></el-table-column>
        <el-table-column align="center" prop="status" label="是否启用">
          <template v-slot="{ row }">
            <el-switch @change="update(row)" v-model="row.status"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" @click="deleteImg(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
       
      <div class="pagination flexCenter">
        <el-pagination background layout="prev, pager, next" v-model:current-page="objects.pageInfo.current" :page-size="8" :total="objects.pageInfo.total" @change="changePage"  />
      </div>
    </el-main>
	
	 <my-upload :show="showAdd"
	  @update:visible="showAdd = $event"
	   :stroke-width="10"
		@upload:success="getList"
		:textInside="false"
		 />
  </div>
</template>

<script setup>
import {
  getResourceList,
  updateStatus,
  deleteResource,
  showElMsgBox,
  showElMsg,
  deleteResourceList,
} from "@/api/api";
import { onMounted, reactive, ref } from "vue";
import myUpload from "@/components/admin/adminComponent/uploadComponent.vue";
const objects = reactive({
  list: [],
  filters: [
    { text: "icon", value: "icon" },
    { text: "image", value: "image" },
    { text: "wallpaper", value: "wallpaper" },
  ],
  multipleSelection: [],
  pageInfo:{
    current:1,
    pageSize:8,
    total:0
  }
});
const value = ref("");
const isRender = ref(false);
const isLoading = ref(false);
const showAdd = ref(false);
const myUploadRef = ref();
onMounted(() => {
  getList();
});
async function getList() {
	objects.list = [];
  let { data } = await getResourceList({
    current:objects.pageInfo.current,
    pageSize:objects.pageInfo.pageSize
  });
  const resourceList = data;
  resourceList.data.list.forEach(item => {
	  if(item.type != "icon"){
		  objects.list.push(item)
	  }
  })
  console.log(resourceList)
  objects.pageInfo.total = resourceList.data.total;
  isRender.value = true;
}
function changePage(e){
  objects.pageInfo.current = e;
  getList();
}

function update(row) {
  updateStatus(row);
}
function deleteImg(id) {
  showElMsgBox("确定要删除吗?", "警告", "warning", async () => {
    let { data } = await deleteResource(id);
    if (data.data) {
      showElMsg("success", "操作成功");
    } else {
      showElMsg("error", "操作失败");
    }
    getList();
  });
}
function deleteList() {
  if (objects.multipleSelection.length == 0) {
    showElMsg("warning", "请选择要删除的图片");
    return;
  }
  showElMsgBox("确定要删除选中的图片吗?", "警告", "warning", async () => {
    let { data } = await deleteResourceList(objects.multipleSelection);
    if (data.data) {
      showElMsg("success", "操作成功");
    } else {
      showElMsg("error", "操作失败");
    }
    getList();
  });
}

function filterHandler(value, row, column) {
  const property = column["property"];
  return row[property] === value;
}
function selectChange(e) {
  objects.multipleSelection = [];
  e.forEach((item) => {
    objects.multipleSelection.push(item.id);
  });
}
</script>

<style scoped>
.table {
  overflow: auto;
}
.title {
  font-size: 1.3rem;
  margin-bottom: 15px;
  display: inline-block;
}
.image {
  width: 160px;
  height: 100px;
  border-radius: 5px;
  object-fit: cover;
  min-width: 160px;
  min-height: 100px;
}
.null {
  height: calc(100vh - 360px);
}
.pagination {
  margin-top: 30px;

}
</style>
