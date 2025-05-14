<template>
	<el-dialog :model-value="props.show" @update:model-value="emit('update:visible',$event)" :close-on-click-modal="false">
	  <template #header>
	    <el-text class="title">新增图片</el-text>
	  </template>
	  <el-form-item label="图片类型" required label-position="top">
	    <el-select v-model="value" placeholder="请选择图片类型">
	      <el-option
	        v-for="item in objects.types"
	        :key="item.value"
	        :label="item.label"
	        :value="item.value"
	      >
	      </el-option>
	    </el-select>
	  </el-form-item>
	 
	 <el-row v-if="value=='wallpaper'">
		 <el-col :span="24">
		 	<el-form-item label="分类" label-position="top">
				<el-select v-model="wallpaperValue" placeholder="请选择分类">
					<el-option v-for="item in objects.wallpaperTypes" :key="item.value" :label="item.label" :value="item.value">
						
					</el-option>
				</el-select>
			</el-form-item>
		 </el-col>
	 </el-row>
	
	 
	 
	 <el-upload
	 	ref="elUploadRef"
	 	:style="uploadStyle"
	 	drag
	 	:on-change="getFile"
		:on-exceed="reCover"
	 	:auto-upload="false"
		:limit="1"
	 	
	 >
	 	<el-icon class="el-icon--upload"><upload-filled /></el-icon>
	 	<el-progress :text-inside="props.textInside" :stroke-width="props.strokeWidth"  :percentage="progressSchedule">
	 		
	 	</el-progress>
	 	<div>
	 		<el-text type="primary">
	 			点击或者拖拽上传
	 		</el-text>
	 	</div>
	 </el-upload>
	 
	 
	  <template #footer>
	    <el-button type="primary" @click="upload" :loading="isLoading"
	      >确定</el-button
	    >
	  </template>
	</el-dialog>
	
	
	
</template>

<script setup>
	import { computed, reactive, ref } from "vue";
	import { uploadImg,showElMsg } from "@/api/api";
import { ElUpload } from "element-plus";
	const elUploadRef = ref()
	const progressSchedule = ref(0)
	const isLoading = ref(false)
	const value = ref('')
	const wallpaperValue = ref('')
	const objects = reactive({
		mfile:{},
		fileList:[],
		types: [
		  { value: "image", label: "image" },
		  { value: "icon", label: "icon" },
		  { value: "wallpaper", label: "wallpaper" }
		],
		wallpaperTypes:[
			{ value: "1", label: "动漫" },
			{ value: "2", label: "风景" },
		]
	})
	const props = defineProps({
		width:{
			type:String,
			required:false,
			default:'100%'
		},
		strokeWidth:{
			type:Number,
			required:false,
			default:25
		},
		textInside:{
			type:Boolean,
			required:false,
			default:true
		},
		show:{
			type:Boolean,
			required:true,
			default:false
		}
	})
	
	const uploadStyle = computed(() => {
		return{
			width:props.width
		}
	})
	
	const reCover = (files) => {
		elUploadRef.value.clearFiles();
		elUploadRef.value.handleStart(files[0])
	}
	
	function getFile(file){
		objects.mfile = file.raw;
	}
	
	function uploadHandle(){
		if(Object.keys(objects.mfile).length === 0){
			showElMsg("warning", "请选择要上传的文件");
			isLoading.value = false;
			return;
		}
		const formData = new FormData();
		formData.append("file",objects.mfile);
		formData.append("type",value.value);
		if(!wallpaperValue == ''){
			formData.append("classify",wallpaperValue.value);
		}
		uploadImg(formData,(uploadProgress) => {
			progressSchedule.value = Math.round((uploadProgress.loaded * 100) / uploadProgress.total);
		}).then((res) => {
			if(res.data.success){
				reset();
				showElMsg("success","上传成功");
				emit("upload:success",res.data.data);
			}
			emit("update:visible",false);
			
		})
		
	}
	function reset(){
		progressSchedule.value = 0;
		elUploadRef.value.clearFiles();
		isLoading.value = false;
		value.value = "";
	}
	
	function upload() {
	  if (value.value == "") {
		  showElMsg("warning", "请选择图片类型");
	      return;
	  }
	  if(wallpaperValue.value == "" && value.value == "wallpaper"){
		  showElMsg("warning","请选择分类");
		  return;
	  }
	  isLoading.value = true;
	  uploadHandle();
	}
	
	const emit = defineEmits(["update:visible","upload:success"]);
	
	defineExpose({
		uploadHandle,
		reset
	})
</script>

<style scoped>
</style>