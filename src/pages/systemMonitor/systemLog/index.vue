<template>
	<div class="main">
		<div class="mainTop">
			<Input v-model="userKey" placeholder="用户名、用户操作" style="width: 200px"></Input>
			<Button type="primary" @click='handleSearch'>查询</Button>
			<!--<Button type="success" @click='handleExport'>导出</Button>-->
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="tableData" :loading="loading" ref="table" highlight-row :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="params">
					<Button type="info" size="small" @click="paramsInfo(row.params)">参数详情</Button>
				</template>
			</Table>
			<div class="pageMain">
				<Page :page-size="pagesSize" :page-size-opts='sizeOpts' :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
			</div>
		</div>
		<Modal draggable v-model="modals" title="系统日志请求参数">
			<p style="padding:0 10px;word-break:break-all;word-wrap:break-word">{{params}}</p>
		</Modal>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		name: 'systemLog',
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				sizeOpts: [10, 20, 30, 40],
				params: '',
				modals: false,
				userKey: '',
				loading: false,
				pagesSize: 10,
				curpage: 1,
				count: 0,
				tableData: [{}],
				columns: [{
						title: 'ID',
						key: 'id',
						align: 'center',
						minWidth: 90,
						fixed: 'left'
					},
					{
						title: '用户名',
						key: 'username',
						align: 'center',
						minWidth: 160
					},
					{
						title: '用户操作',
						key: 'operation',
						align: 'center',
						minWidth: 180
					},
					{
						title: '请求方法',
						key: 'method',
						align: 'center',
						minWidth: 450,
						tooltip: true
					},
					{
						title: '请求参数',
						key: 'params',
						align: 'center',
						slot: 'params',
						minWidth: 140,

					},
					{
						title: '执行时长(毫秒)',
						key: 'time',
						align: 'center',
						minWidth: 140
					},
					{
						title: 'IP地址',
						key: 'ip',
						align: 'center',
						minWidth: 170
					},
					{
						title: '创建时间',
						key: 'createDate',
						align: 'center',
						minWidth: 180
					},
				],

			}
		},
		methods: {
			//导出
			handleExport() {},
			//查看参数详情
			paramsInfo(params) {
				this.params = params;
				this.modals = true;
			},
			//获取系统日志列表
			getSystemLogList() {
				this.loading = true;
				_http.http1('post', pathUrls.sysLogList, {
					'page': this.curpage,
					"limit": this.pagesSize,
					'key': this.userKey
				}, 'form').then((res) => {
					this.loading = false;
					this.tableData = res.data;
					this.count = res.count;
					if(this.tableData.length > 10) {
						this.tableHeight = this.screeHeight - 200;
					} else {
						this.tableHeight = 'auto';
					}
				})
			},
			//点击搜索
			handleSearch() {
				this.curpage = 1;
				this.getSystemLogList();
			},
			//改变页数
			pageChange(current) {
				this.curpage = current;
				this.getSystemLogList();
			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.getSystemLogList();
			},

		},
		mounted() {
			this.getSystemLogList()
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		min-height: calc(100% - 10px);
		background: #fff;
	}
	
	.mainTop {
		background: #fff;
		height: 48px;
		line-height: 48px;
		text-align: left;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
		
	}
	
	.mainTop button {
		margin-right: 10px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;
	}
	/*.mainContent>>>td {
		height: 40px;
	}*/
	
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