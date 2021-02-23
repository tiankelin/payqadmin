<!--<template>
	<div class='main'>
		<div class="mainTop">
			<Input v-model="userName" placeholder="请输入用户名" style="width: 200px" />
			<Button type="primary" @click='handleSearch'>查询</Button>
			<Button type="success" @click='handleAdd'>新增</Button>
			<Button type="error" @click='handleSomeDelete'>批量删除</Button>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="tableData" :loading="loading"></Table>
			<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange'></Page>
			</div>

		</div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		name:'staffName',
		data(){
			return{
				
			}
		},
		methods:{
			
		},
		mounted(){
			
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		padding-right: 10px;
	}
	
	.mainTop {
		background: #fff;
		height: 48px;
		line-height: 48px;
		text-align: left;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
		margin-bottom: 10px;
	}
	
	.mainTop button {
		margin-right: 10px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;
		min-height: 400px;
	}
	
	.mainContent>>>td {
		height: 40px;
	}
	
	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
	}
	.mainContent>>>.ivu-table th {
	background: #E2EEFF;
	color: #51B5EA;
	
}
</style>-->-->