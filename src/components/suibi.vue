<template>
	<span>666</span>
</template>

<script setup>

import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { onMounted, ref } from 'vue';
	
	const vditor = ref();
	
	onMounted(() => {
		/* vditor.value = new Vditor('vditor',{
			width:'50vw',
			height:'50vh',
			toolbar:[
				'emoji', //表情,
				'headings', //标题,
				'bold', //加粗
				'italic', //斜体
				'strike', //删除线
				'|', 
				'list',  //无序列表
				'ordered-list',  //有序列表
				'check',  //任务列表
				'outdent',  //列表反向缩进
				'indent',  //列表缩进
				'|',
				'quote', //引用
				'line',  //分割线
				'code',  //代码块
				'inline-code',  //行内代码
				'insert-before',  //起始插入行
				'insert-after',  //末尾插入行
				'|',
				'upload', //上传
				'table', //表格
				'|',
				'undo', //撤销
				'redo', //重做
				'|',
				'link', //链接
				'edit-mode', //切换编辑模式
				'fullscreen', //全屏
				'outline', //大纲
				'export' //导出
			],
			after: () => {
				console.log("渲染完成")
				vditor.value.setTheme('dark','dark')
			},
			
		}) */
	})
	const zz = () => {
		let x = vditor.value.getValue();
		console.log(x)
	}
</script>

<style scoped>
	#vditor{
		position: absolute;
		top: 60px;
	}
</style>