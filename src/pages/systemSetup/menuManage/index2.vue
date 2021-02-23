<template>
	<div class='main conMain'>
		<div class="mainTop">
			<Button type="success" @click='handleChangeAdd' v-has='15' style="margin-right: 46px;">新增</Button>
			<!--<Button type="info" @click='handleChangeEdit'>修改</Button>-->
			<!--<Button type="error" @click='handleChangeDelete'>删除</Button>-->
			<!--<Button type="warning" @click='handleChangeHide'>显示&隐藏</Button>-->
		</div>
		<div class="mainContent">
			<!--<a-table :columns="columns" :dataSource="data" :rowSelection="{type:'radio',onChange:onSelectChange}" :pagination="pagination" :loading='loading'/>-->
			<!--<Table :columns="columns" :data="data" :loading='loading' row-key="menuId" />-->
			<tree-grid :items='data' :columns='columns' @on-row-click='rowClick' @on-selection-change='selectionClick' @on-sort-change='sortClick' :style='{height:tableHeight}'></tree-grid>
			<Spin size="large" fix v-if="spinShow"></Spin>
		</div>
	</div>

</template>
<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import TreeGrid from '@/pages/comComponent/TreeGrid'
	export default {
		name: 'menuManager',
		components: {
			TreeGrid
		},
		data() {
			return {	
				tableHeight:'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				spinShow:false,
				menuId: '',
				currentChoose: '',
				data: [],
				columns: [{
						title: '菜单名称',
						key: 'name',
						align: 'left',
						width: '200',

					},
					{
						title: '菜单ID',
						key: 'menuId',
						align: 'center',
						width: '80'

					},
//					{
//						title: '图标',
//						key: 'icon',
//						align: 'center',
//						width: '150'
//					},
					{
						title: '类型',
						key: 'type1',
						align: 'center',
						width: '80',
					},
					{
						title: '排序号',
						key: 'orderNum',
						align: 'center',
						width: '80'
					},
					{
						title: '菜单URL',
						key: 'url',
						align: 'center',
						width: '200'

					},
					{
						title: '授权标识',
						key: 'perms',
						align: 'center',
						width: '200'

					},
					{
						title: '显示或隐藏',
						key: 'isHide',
						align: 'center',
						width: '120'

					}, {
						title: '操作',
						type: 'action',
						actions: [{
							type: 'info',
							text: '编辑',

						}, {
							type: 'error',
							text: '删除'
						}],
						width: '130',
					}
				],

			}
		},
		methods: {
			rowClick(data, event, index, text) {					
				//				console.log(event)
				if(text == '编辑') {	
					this.handleChangeEdit(data.menuId)
				} else if(text == '删除') {
					this.handleChangeDelete(data.menuId)
				}
			},
			getTitle(menus) {

				return menus.map((menu) => {
					if(menu.children&&menu.children.length > 0) {
						this.getTitle(menu.children);
					}
					//					if(menu.children.length == 0) {
					//						delete menu.children;
					//					}
					if(menu.type == 0) {
						menu.type1 = '目录'
					} else if(menu.type == 1) {
						menu.type1 = '菜单'
					} else {
						menu.type1 = '按钮'
					}

					menu.id = menu.menuId;
					menu.isHide = menu.showHide == 1 ? '显示' : '隐藏'

					return menu;
				})
			},

			//获取菜单列表
			getMenuList() {
				this.spinShow=true;
				_http.http3('get', pathUrls.menuTree, {}).then((res) => {
					this.spinShow=false;
					if(res.data&&res.data.length){
						this.data = this.getTitle(res.data[0].children)
					}
					
					this.tableHeight=this.screeHeight-150 +'px';
				})
			},
			//添加
			handleChangeAdd() {
				this.$router.push({
					path: '/menuManage/addMenu'
				});
			},
			//编辑
			handleChangeEdit(id) {
				this.$router.push({
					path: '/menuManage/editMenu/' + id
				});

			},
			//删除
			handleChangeDelete(id) {
				//				if(this.menuId) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http1('post', pathUrls.menuDelete, {
							menuId: id
						}, 'form').then((res) => {
							this.$Message['success']({
								background: true,
								content: '删除成功!'
							});
							this.getMenuList()
						}).catch((res) => {

						})
					},

				});

			},
		},
		activated() {
			this.getMenuList()
		},
		mounted() {
			// this.getMenuList()
		}
	}
</script>
<style scoped>
	.main {
		margin-right: 10px;
		min-height: calc(100% - 10px);
		background: #fff;
	}
	
	.mainTop {
		background: #fff;
		height: 48px;
		line-height: 48px;
		text-align: right;
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
		padding: 10px;
		position: relative;
	}
	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	/*.mainContent>>>td {
		height: 40px;
	}
	.mainContent>>>thead th{
	background: #E2EEFF;
	color: #51B5EA;
	}*/
	.mainContent>>> tbody{
		height: 500px!important;
		overflow-y: auto;
	}
</style>