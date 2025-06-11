<template>
	<el-dialog
		top="4vh"
		:width="dialog"
		style="background-color: #eee;"
		:model-value="visible"
		@update:model-value="emit('update:visible',$event)"
	>
		<div class="info-container">
			<div class="avatar-box">
				<el-avatar class="avatar" :src="data.avatar" shape="circle" :size="140" fit="cover"></el-avatar>
			</div>
			<div class="info-box">
				<p style="font-size: 16px;font-weight: 600;">{{data.nickName}}</p>
				<p style="font-size: 12px;color: #ccc;">通行证ID:{{data.id}}</p>
				<p style="font-size: 12px;color: #ccc;">手机:{{data.phoneNumber}}</p>
				<p style="font-size: 12px;color: #ccc;">邮箱:{{data.email}}</p>
				<p style="margin-top: 15px;max-width: 80%;">{{data.introduction}}</p>
			</div>
		</div>
		
		<div class="main">
			<div class="main-title">
				<p style="padding: 0 15px;">编辑资料</p>
			</div>
			<div class="main-info">
				<div class="main-avatar flexCenter">
					<div style="text-align: center;cursor: pointer;">
						<el-avatar class="avatar" :src="data.avatar" shape="circle" :size="140" fit="cover"></el-avatar>
						<p style="color: #00aaff;font-size: 18px;margin-top: 15px;">修改头像</p>
					</div>					
				</div>
				
				<el-form :model="data" class="form">
					<el-form-item label="昵称" label-width="60px">
						<el-input class="input" v-model="data.nickName"></el-input>
						<span class="edit">{{nickNameLength}}/20</span>
					</el-form-item>
					<el-form-item label="性别" label-width="60px">
						<el-radio-group v-model="data.gender" class="radio-group">
							<el-radio :value="1">男</el-radio>
							<el-radio :value="2">女</el-radio>
							<el-radio :value="0">保密</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="简介" label-width="60px">
						<el-input class="input" type="textarea" :rows="5" resize="none" v-model="data.introduction"></el-input>
						<span class="edit-textarea">{{introductionLength}}/150</span>
					</el-form-item>
					<div class="flexCenter">
						<el-button type="primary" style="min-width:160px;" @click="update">保存</el-button>
					</div>
				</el-form>
				
			</div>
		</div>
		
	</el-dialog>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { getUserInfoByToken, showElMsg, updateUser} from "@/api/api";
import { useStore } from "vuex";
	const store = useStore();
	const user = ref({});
	const dialog = ref('800px');
	const nickNameLength = ref(0);
	const introductionLength = ref(0);
	onMounted(() => {
		window.onresize = () => {
			if(props.visible){
				setDialogWidth();
			}
			
		}
	})
	
	const update = async () => {
		let {data} = await updateUser(props.data);
		if(data.data){
			showElMsg("success","修改成功");
			emit("update:visible",false);
		}
	}
	
	const calculateNickNameLength = (val,size) => {
		let length = 0;
		let result = '';
		const regex = /[\u4e00-\u9fa5]/;
		for (let char of val) {
			let charLength = regex.test(char) ? 2 : 1;
			if(length + charLength > size){
				break;
			}
			length += charLength;
			result += char;
			
		}
		
		return {length,result};
	}
	watch(() => user.value.nickName,(New,old) => {
		let {length,result} = calculateNickNameLength(New,20);
		nickNameLength.value = length;
		user.value.nickName = result;
	});
	watch(() => user.value.introduction,(New,old) => {
		let {length,result} = calculateNickNameLength(New,150);
		introductionLength.value = length;
		user.value.introduction = result;
	})
	
	
	
	const setDialogWidth = () => {
		
		let val = document.body.clientWidth;
		const def = 800;
		if(val < def){
			dialog.value = "90%";
		}else {
			dialog.value = "800px";
		}
	}
	const props = defineProps({
		visible:Boolean,
		data:{
			type: Object,
			required: true
		}
	})
	const emit = defineEmits(["update:visible"])
</script>

<style scoped>
	.info-container{
		height: 10rem;
		display: flex;
		align-items: center;
		background-color: white;
		height: 180px;
	}
	.avatar-box{
		padding: 0 15px;
		text-align: center;
	}
	.info-box{
		flex-grow: 1;
		padding-top: 20px;
		height: inherit;
	}
	.avatar{
		cursor: pointer;
		border: 2px #464646 solid;
	}
	
	.main{
		margin-top: 20px;
		background-color: white;
	}
	.main-title{
		font-size: 18px;
		padding: 15px;
		border-bottom: 1px #ebebeb solid;
	}
	
	.input{
		position: relative;
		min-height: 45px;
	}
	.edit{
		position: absolute;
		font-size: 14px;
		right: 10px;
		top: 5px;
		color: #ccc;
	}
	.edit-textarea{
		position: absolute;
		font-size: 14px;
		right: 6px;
		bottom: 15px;
		color: #ccc;
	}
	:deep(.el-form-item__label){
		font-size: 16px;
		line-height: 45px;
		color: #999;
	}
	@media(min-width:784px){
		.main-info{
			padding: 0 30px;
		}
		.form{
			padding: 80px 90px;
		}
	}
	@media(max-width:784px){
		.form{
			padding: 30px 20px;
		}
		.main-info{
			padding-top: 20px;
		}
	}
	.radio-group{
		margin-top: 7px;
	}
</style>