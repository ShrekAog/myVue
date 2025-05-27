<template>
	<el-dialog
		:width="dialog"
		style="background-color: #eee;"
		:model-value="visible"
		@update:model-value="emit('update:visible',$event)"
	>
		<div class="info-container">
			<div class="avatar-box">
				<el-avatar class="avatar" :src="user.avatar" shape="circle" :size="140" fit="cover"></el-avatar>
			</div>
			<div class="info-box">
				<p style="font-size: 16px;font-weight: 600;">{{user.nickName}}</p>
				<p style="font-size: 12px;color: #ccc;">通行证ID:{{user.id}}</p>
				<p style="font-size: 12px;color: #ccc;">手机:{{user.phoneNumber}}</p>
				<p style="font-size: 12px;color: #ccc;">邮箱:{{user.email}}</p>
				<p style="margin-top: 15px;">{{user.introduction}}</p>
			</div>
		</div>
		
		<div class="main">
			<div class="main-title">
				<p style="padding: 0 15px;">编辑资料</p>
			</div>
			<div class="main-info">
				<div class="main-avatar flexCenter">
					<div style="text-align: center;cursor: pointer;">
						<el-avatar class="avatar" :src="user.avatar" shape="circle" :size="140" fit="cover"></el-avatar>
						<p style="color: #00aaff;font-size: 18px;margin-top: 15px;">修改头像</p>
					</div>					
				</div>
				
				<el-form :model="user" class="form">
					<el-form-item label="昵称" label-width="60px">
						<el-input class="input" v-model="userInfo.nickName"></el-input>
						<span class="edit">{{nickNameLength}}/20</span>
					</el-form-item>
				</el-form>
				
			</div>
		</div>
		
	</el-dialog>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { getUserInfoByToken} from "@/api/api";
	
	const user = ref(null);
	const userInfo = ref({
		nickName:''
	});
	
	const dialog = ref('800px');
	const nickNameLength = ref(0);
	
	const info = async () => {
		let {data} = await getUserInfoByToken(localStorage.getItem("token"));
		user.value = data.data;
		console.log(user.value);
	}
	onMounted(() => {
		info();
		window.onresize = () => {
			if(props.visible){
				setDialogWidth();
			}
			
		}
	})
	
	
	const calculateNickNameLength = (nickName,size) => {
	  let length = 0;
	  let result = '';
	  for (let char of nickName) {
	    const regex = /[\u4e00-\u9fa5]/;
	    if (regex.test(char)) {
	      length += 2; // 中文字符算2个长度
	    } else {
	      length += 1; // 其他字符算1个长度
	    }
		if(length <= size){
			result += char
		} else {
			break;
		}
	  }
	  userInfo.value.nickName = result;
	  return length;
	}
	watch(() => userInfo.value.nickName,(New,old) => {
		nickNameLength.value = calculateNickNameLength(New,20);
	});
	
	
	
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
		visible:Boolean
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
		height: 45px;
	}
	.edit{
		position: absolute;
		font-size: 14px;
		right: 10px;
		top: 5px;
		color: #ccc;
	}
	.main >>> .el-form-item__label{
		font-size: 16px;
		line-height: 45px;
		color: #999;
	}
	@media(min-width:784px){
		.main-info{
			padding: 40px 30px 100px;
		}
		.form{
			padding: 80px 110px;
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
</style>