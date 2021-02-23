<template>
	<div class="main">
		<div class='mainTop'>
			<Form :model="formSearch" inline :label-width="70">

				<FormItem label="用户姓名">
					<Input v-model="formSearch.userName" placeholder="请输入用户姓名"></Input>
				</FormItem>
				<FormItem label="身份证号">
					<Input v-model="formSearch.cardIdNumber" placeholder="请输入身份证号"></Input>
				</FormItem>

				<FormItem label="手机号码" class='phone'>
					<Input v-model="formSearch.phone" placeholder="请输入手机号码"></Input>
				</FormItem>

				<FormItem>
					<Button type="primary" @click='handleSearch'>查询</Button>
				</FormItem>
			</form>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading'>
				<template slot-scope="{ row, index }" slot="action">
					<Button type="info" size="small" @click="handleClose(row.bottleId)">注销</Button>
				</template>
			</Table>
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
		name: 'closeAnAccount',
		data() {
			return {
				count: 0,
				curpage: 1,
				pagesSize: 10,
				dataList: [{}],
				loading: false,
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch: {
					userName: '',
					cardIdNumber: '',
				},
				columns:[{
					    title: '序号',
						type: 'index',
						width: 70,
						align: 'center',
					},{
					    title: '用户姓名',
						type: 'index',
						width: 140,
						align: 'center',
					},
					{
					    title: '用户姓名',
						type: 'index',
						width: 140,
						align: 'center',
					},
				]
			}
		},
		methods: {
			//查询
			handleSearch() {

			},
			//注销
			handleClose(id) {

			},
			//改变页数
			pageChange(current) {
				this.curpage = current

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize

			},
		},
		mounted() {

		}
	}
</script>

<style type="text/css" scoped>
.main {
		margin-right: 10px;
		background: #FFFFFF;
	}
	
	.mainTop {
		padding: 10px;
		width: 100%;
		text-align: left;
	}
	.mainTop >>>.ivu-input-wrapper{
		width: 170px;
	}
	.mainTop>>>.ivu-form-item {
		margin-bottom: 8px;
	}
		
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;
		min-height: 400px;
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
</style>