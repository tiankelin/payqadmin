<template>
	<div class='main conMain'>
		<div class="mainTop">
			<Button type="success" @click='handleChangeAdd' v-has='"sys:dept:save"'>新增</Button>
			<Button type="info" @click='handleChangeEdit' v-has='"sys:dept:update"'>修改</Button>
			<Button type="error" @click='handleChangeDelete' v-has='"sys:dept:delete"'>删除</Button>
		</div>
		<div class="mainContent">
			<Table :columns="columns" :data="data" :loading='loading' row-key="deptId" :height='tableHeight'>
				

			</Table>
		</div>
	</div>

</template>
<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';

	export default {
		name: 'organizManage',
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				loading: false,
				dept_id: '',
				rowData: {},
				userData: (JSON.parse(this.$store.state.userData)),
				data: [],
				data1: [],
				currentChoose: '',
				columns: [{
						title: ' ',
						key: 'id',
						width: 50,
						align: 'center',
						render: (h, params) => {
							let id = params.row.id;
							let flag = false;
							if(this.currentChoose === id) {
								flag = true
							} else {
								flag = false
							}
							let self = this
							return h('div', [
								h('Radio', {
									props: {
										value: flag
									},
									on: {
										'on-change': () => {
											self.currentChoose = id;
											this.dept_id = id;
											this.rowData = params.row;

										}
									}
								})
							])
						}
					},

					{
						title: '组织名称',
						key: 'name',
						tree: true
					},
					{
						title: '组织类别',
						key: 'categoryName',
						width: 140
					},
					{
						title: '组织类型',
						key: 'typeName',
						width: 140
					},
					{
						title: '地址',
						key: 'address',
					},
				
				],
			}
		},
		methods: {
		
			getTitle(menus) {

				return menus.map((menu) => {
					menu._showChildren = false;
					if(menu.deptId == this.userData.deptId) {
						menu._showChildren = true;
					}

					if(menu.children.length > 0) {

						this.getTitle(menu.children);
					}

					if(menu.type == 1) {
						menu.typeName = '燃气公司'
					} else if(menu.type == 2) {
						menu.typeName = '充装站'
					} else if(menu.type == 3) {
						menu.typeName = '供应站/中转站'
					} else if(menu.type == 4) {
						menu.typeName = '管理片区'
					} else if(menu.type == 5) {
						menu.typeName = '门店'
					}

					menu.categoryName = menu.category != 2 ? '燃气公司' : '检测站';
					menu.key = menu.deptId;
					menu.id = menu.deptId;
					return menu;
				})
			},
			//获取组织列表
			getOrganizeList() {
				this.loading = true
				this.common.getDeptList(this.userData.staffDeptId).then(res=>{
				this.loading = false;
				this.data = this.getTitle(res.data);
				this.tableHeight = this.screeHeight - 175;
			}).catch(()=>{
				this.loading = false;
			})

			},
			//添加
			handleChangeAdd() {
				let id = this.dept_id || this.userData.staffDeptId
				this.$router.push({
					path: '/organizManage/addOrganize/' + id
				});
			},
			//编辑
			handleChangeEdit() {

				if(this.dept_id) {
					this.$router.push({
						path: '/organizManage/editOrganize/' + this.dept_id
					});
				} else {

					this.$Message['warning']({
						background: true,
						content: '请选择一条数据!'
					});

				}
			},
			//删除
			handleChangeDelete() {
				if(this.dept_id) {	
						this.$Modal.confirm({
							title: '是否删除？',
							content: '',
							onOk: () => {
								_http.http1('post', pathUrls.deptDelete, {
									deptId: this.dept_id
								}, 'form').then((res) => {	
									if(res.code == 0) {
									this.$Message['success']({
										background: true,
										content: '删除成功!',
										onClose: (() => {
											this.getOrganizeList()
										})
									});

								}
								if(res.code == 500) {
									this.$Message['warning']({
										background: true,
										content: res.msg
									});

								}					
									
								})
							},
						});
					

				} else {

					this.$Message['warning']({
						background: true,
						content: '请选择一条数据!'
					});

				}
			},

		},
		activated() {
			this.getOrganizeList()
		},
		mounted() {
			//			this.getOrganizeList()
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
		padding: 5px 5px 20px 5px;
		height: calc(100vh - 148px);
		overflow-y: auto;
	}
	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	
	.mainContent>>>td {
		height: 40px;
	}
</style>