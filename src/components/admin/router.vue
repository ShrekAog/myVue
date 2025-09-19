<template>
	<el-row>
		<el-col :span="24">
			<el-button type="primary" @click="addFormShow = true">新增根菜单</el-button>
		</el-col>
	</el-row>
	<el-main class="main" v-if="isRender && objects.list.length > 0">
		<el-table class="table" :data="objects.list" row-key="id" show-overflow-tooltip>
			<el-table-column align="center" prop="id" label="ID" sortable></el-table-column>
			<el-table-column align="center" prop="text" label="名称"></el-table-column>
			<el-table-column align="center" prop="icon" label="图标">
				<template v-slot="{ row }">
					
					<i class="iconfont" v-html="row.iconPath"></i>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="path" label="路径"></el-table-column>
			<el-table-column align="center" prop="level" label="根菜单">
				<template v-slot="{ row }">
					<span>{{row.level == 1 ? '是' : '否'}}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" prop="parentId" label="父节点">
				<template v-slot="{ row }">
					<span>{{row.parentId}}</span>
				</template>
			</el-table-column> -->
			<el-table-column align="center" prop="permissionsId" label="权限">
				<template v-slot="{ row }">
					<span>{{row.permissionId == 1 ? '管理员' : '普通用户'}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="permissionsId" label="排序标记">
				<template v-slot="{ row }">
					<span>{{row.sortOrder}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="createTime" label="创建时间">
				<template v-slot="{ row }">
					<span>{{row.createTime}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="updateTime" label="修改时间">
				<template v-slot="{ row }">
					<span>{{row.updateTime}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="updateBy" label="修改人">
				<template v-slot="{ row }">
					<span>{{row.updateBy == null ? '暂无' : row.updateBy}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="isHidden" label="启用">
				<template v-slot="{ row }">
					<el-switch 
						:model-value="!row.isHidden"
						@update:model-value="(val) => {row.isHidden = val ? 0 : 1;updateRouter(row)}"
					/>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="280">
				<template v-slot="{ row }">
					<div class="flexCenter">
						<template v-if="row.parentId === 0">
							<el-button type="primary" size="small" @click="showAddChildren(row)">新增子菜单</el-button>
						</template>
						<el-button type="primary" size="small" @click="getRowData(row)">修改</el-button>
						<el-button type="danger" size="small" @click="remove(row)">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
	</el-main>
	<el-empty v-if="objects.list.length == 0" description="暂无数据" style="height: 100%;" />
	
	
	
	<el-dialog v-model="updateFormShow" :close-on-click-modal="false"  @close="closeDiglog('update')">
		<template #header>
			<div class="dialog-title">
				<span>修改路由</span>
			</div>
			<el-alert title="编辑路由，请注意路径格式" :closable="false" type="warning" show-icon />
		</template>
		
		<el-form v-model="objects.routerData" class="form">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="展示名称" label-position="top" required>
						<el-input v-model="objects.routerData.text"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="路径" label-position="top" required>
						<el-input v-model="objects.routerData.path"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="排序标记" label-position="top" required>
						<template #label>
							排序标记
							<el-tooltip placement="top" effect="dark" content="路由菜单的排序">
								<el-icon class="tip-icon"><WarningFilled /></el-icon>
							</el-tooltip>
						</template>
						<el-input v-model="objects.routerData.sortOrder"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="访问权限" label-position="top" required>
						<el-select @change="selectChange" v-model="objects.selectData.value" :placeholder="objects.routerData.permissionId == 1 ? '管理员' : '普通用户'">
							<el-option v-for="item in objects.selectData.permission.options" 
							:key="item.value" 
							:label="item.label" 
							:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="根菜单" label-position="top">
						<el-select placeholder="是" disabled></el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="父节点" label-position="top">
						<el-select placeholder="0" disabled></el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="创建时间" label-position="top">
						<el-input :placeholder="objects.routerData.createTime" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="修改时间" label-position="top">
						<el-input :placeholder="objects.routerData.updateTime" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="修改人员" label-position="top">
						<el-input v-model="objects.routerData.updateBy" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="图片路径" label-position="top">
						<!-- <el-input v-model="objects.routerData.iconPath"></el-input> -->
						<el-select v-model="objects.routerData.iconPath" placeholder="请选择图标">
							<el-option v-for="item in icons" :key="item" :label="item" :value="item">
								<i class="iconfont" v-html="item"></i>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<div>
				<el-button type="primary" @click="updateRouterHandler" :loading="isUploading">确定</el-button>
			</div>
		</template>
	</el-dialog>
	
	<!-- 增加 -->
	<el-dialog v-model="addFormShow" :close-on-click-modal="false" @close="closeDiglog('add')">
		<template #header>
			<div class="dialog-title">
				<span>新增路由</span>
			</div>
			<el-alert title="新增路由,请注意路由格式" :closable="false" type="warning" show-icon />
		</template>
		<el-form :model="objects.addrouterData" :rules="objects.addFormRules" ref="addFormRef">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="展示名称" label-position="top" required prop="text">
						<el-input v-model="objects.addrouterData.text"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="路由路径" label-position="top" required prop="path">
						<el-input v-model="objects.addrouterData.path"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="图片路径" label-position="top" required prop="iconPath">
						<template #label>
							图片路径
							<el-tooltip placement="top" effect="dark" content="图片的网络路径">
								<el-icon class="tip-icon"><WarningFilled /></el-icon>
							</el-tooltip>
						</template>
						<el-input v-model="objects.addrouterData.iconPath"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="路由权限" label-position="top" required prop="permissionId">
						<el-select @change="selectChange" v-model="objects.addrouterData.permissionId" placeholder="请选择角色">
							<el-option v-for="item in objects.selectData.permission.options"
							:key="item.value" 
							:label="item.label" 
							:value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="排序标记" label-position="top" required prop="sortOrder">
						<template #label>
							排序标记
							<el-tooltip placement="top" effect="dark" content="路由菜单的排序">
								<el-icon class="tip-icon"><WarningFilled /></el-icon>
							</el-tooltip>
						</template>
						<el-input v-model="objects.addrouterData.sortOrder"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<div>
				<el-button type="primary" @click="addRouterHandle" :loading="isUploading">确定</el-button>
			</div>
		</template>
	</el-dialog>

	<!-- 添加子菜单抽屉组件 -->
	<add-children-router
		:visible="childrenDrawerVisible"
		@update:visible="childrenDrawerVisible = $event"
		:parent-id="currentParentId"
		:parent-path="currentParentPath"
		:parent-text="currentParentText"
		@success="getList"
	/>
</template>

<script setup>
	import { getRouterList,
	updateRouter,
	addRouter,
	removeRouter,
	showElMsg,showElMsgBox,
} from "@/api/api"
	import { onMounted, reactive, ref } from "vue";
	import AddChildrenRouter from './adminComponent/addChildrenRouter.vue'
import { useStore } from "vuex";
	const icons = reactive([
		'&#xe602;',//首页
		'&#xe892;',//设置
		'&#xeaf1;',//菜单
		'&#xec53;',//引擎
		'&#xe657;',//资源
		'&#xe71b;',//资源分类
		'&#xe64a;',//图库
		'&#xe613;',//图标
		
		])
	const objects = reactive({
		list:[],
		routerData:{},
		addrouterData:{
			permissionId:'',
			level:1,
			parentId:0,
			isHidden:0
		},
		selectData:{
			value:null,
			permission:{
				index:1,
				options:[
					{value:1,label:"管理员"},
					{value:2,label:"普通用户",disabled:false}
				]
			}
		},
		addFormRules:{
			text:[
				{required:true,message:'请输入路由名称'},
				{min:2,max:6,message:'长度在2~5之间',trigger:'blur'}
			],
			path:[
				{required:true,message:'请输入路由路径'}
			],
			iconPath:[
				{required:true,message:'请输入图片路径'}
			],
			permissionId:[
				{required:true,message:'请选择路由权限'}
			],
			sortOrder:[
				{required:true,message:'请输入排序编号'},
				{min:1,max:3,message:'长度在1~100之间'}
			]
		}
	})
	const store = useStore();
	const addFormRef = ref()
	const isRender = ref(false)
	const updateFormShow = ref(false)
	const addFormShow = ref(false)
	const isUploading = ref(false)

	const childrenDrawerVisible = ref(false)
	const currentParentId = ref(0)
	const currentParentPath = ref('')
	const currentParentText = ref('')

	onMounted(() => {
		getList();
	})
	async function getList(){
		let {data:{data}} = await getRouterList();
		console.log(data)
		objects.list = data;
		isRender.value = true;
	}
	function getRowData(row){
		objects.routerData = row;
		updateFormShow.value = true;
	}
	function updateRouterHandler(){
		isUploading.value = true;
		objects.routerData.updateBy = 'admin'
		updateRouter(objects.routerData)
		.then((res) => {
			if(res.data.success){
				getList();
				showElMsg("success","修改成功");
			}
		})
		.catch(() => showElMsg("error","修改失败"))
		.finally(() => {
			updateFormShow.value = false;
			isUploading.value = false;
		})
	}
	function remove(row){
		showElMsgBox("确定删除吗?","警告","warning",async ()=>{
			let {data} = await removeRouter(row.id);
			if(data.data){
				showElMsg("success","操作成功");
				getList();
			}
		})
	}
	function closeDiglog(diglog){
		if(diglog == 'update'){
			updateFormShow.value = false;
		}
		if(diglog == 'add'){
			addFormShow.value = false;
			objects.addrouterData = {};
			addFormRef.value.resetFields();
		}
	}
	function selectChange(e){
		objects.routerData.permissionId = e;
	}
	
	
	function addRouterHandle(){
		addFormRef.value.validate(async(valid) => {
			if(valid){
				let {data} = await addRouter(objects.addrouterData);
				if(!data.data){
					showElMsg("error","操作失败");
				}
				closeDiglog('add');
				getList();
			}else {
				showElMsg("error","操作失败")
			}
		})
	}
	function showAddChildren(row) {
		currentParentId.value = row.id
		childrenDrawerVisible.value = true
		currentParentPath.value = row.path
		currentParentText.value = row.text
	}
</script>

<style scoped>
	.main{
		padding: 0;
	}
	.icon{
		width: 40px;
		height: 40px;
	}
	.table{
		font-size: .8rem;
	}
	.form{
		padding: 3rem;
		padding-top: 0;
	}
	.dialog-title{
		width: 100%;
		display: flex;
		align-items: center;
		font-size: 1.4rem;
		letter-spacing: 1px;
		color: black;
		height: 60px;
		border-bottom: 1px #eeeeee solid;
		margin-bottom: 10px;
	}
	.tip-icon{
		font-size: 15px;
		margin-left: 0px;
	}
	.uploader{
		border: 1px dashed #eeeeee;
		border-radius: 6px;
		width: 50px;
		height: 50px;
		cursor: pointer;
		position: relative;
		transition: border .3s;
	}
	.uploader-icon{
		color: var(--white);
	}
	.uploader:hover{
		border: 1px dashed deepskyblue;
	}
	.upload-img{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 6px;
	}
	
</style>