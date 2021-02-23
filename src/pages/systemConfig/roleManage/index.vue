<template>
	<div class='main conMain'>
		<div class="mainTop">
			<Input v-model="roleName" placeholder="请输入角色名称" style="width: 200px"></Input>
			<Button type="primary" @click='handleSearch'>查询</Button>
			<Button type="success" @click='handleAdd' v-has='"sys:role:save"'>新增</Button>
			<!--<Button type="error" @click='handleSomeDelete'>批量删除</Button>-->
		</div>
		<div class="mainContent conMainContent">
			<Table border :columns="columns" :data="tableData" :loading="loading" highlight-row :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="action">
					<Button size="small" type="info" style="margin-right: 10px;" @click='editClick(row.roleId)' v-has='"sys:role:update"'>编辑</Button>
					<Button size="small" type="error" @click='deleteClick(row.roleId)' v-has='"sys:role:delete"'>删除</Button>
				</template>
			</Table>
			<div class="pageMain conPageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
			</div>

		</div>
	</div>
</template>
<script>
	import pagination from '@/pages/comComponent/pagination'
	import Bus from '@/public/bus'
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		name: 'roleManage',
		components: {
			pagination,

		},
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				loading: false,
				pagesSize: 10,
				curpage: 1,
				count: 0,
				roleName: '',
				columns: [
					//				{
					//						type: 'selection',
					//						width: 60,
					//						align: 'center'
					//					},
					//					{
					//						title: '角色ID',
					//						key: 'roleId',
					//						align: 'center',
					//						width: 80,
					//					},
					{
						title: '排序',
						key: 'sort',
						align: 'center',
						width:80
					},
					{
						title: '角色名称',
						key: 'roleName',
						align: 'center'
					},
//					{
//						title: '所属组织',
//						key: 'deptName',
//						align: 'center',
//						render: (h, params) => {
//							return h('span', {
//								attrs: {
//									title: params.row.deptName
//								},
//								style: {
//									display: 'inline-block',
//									width: '100%',
//									overflow: 'hidden',
//									textOverflow: 'ellipsis',
//									whiteSpace: 'nowrap'
//								},
//							}, params.row.deptName);
//
//						}
//					},
					{
						title: '备注',
						key: 'remark',
						align: 'center'
					},
					{
						title: '创建时间',
						key: 'createTime',
						align: 'center'
					},
					{
						title: '身份证号是否加密',
						key: 'isEncryption',
						align: 'center'
					},
					{
						title: '操作',
						key: 'action',
						width: 150,
						align: 'center',
						slot:'action'
					}
				],
				tableData: [],
			}
		},
		methods: {
			//删除
			deleteClick(id) {
				this.handleOneDel(id)
			},
			//编辑
			editClick(id) {
				this.$router.push('/roleManage/editRole' + '/' + id)
			},
			pageChange(current) {
				this.curpage = current
				this.loading = true
				this.getRoleList()
			},
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.loading = true
				this.getRoleList()
			}, //获取角色列表接口
			getRoleList() {
				this.tableData = []
				this.loading = true
				_http.http1('post', pathUrls.roleList, {
					'page': this.curpage,
					"limit": this.pagesSize,
					"roleName": this.roleName
				}, 'form').then((res) => {
					this.loading = false
					for(let item of res.data) {
						if(item.isEncryption == 1) {
							item.isEncryption = '加密'
						} else {
							item.isEncryption = '明文'
						}
						if(!item.sort){
							item.sort=0;
						}
					}
					this.tableData = res.data
					this.count = res.count
					if(this.tableData.length > 10) {
							if(this.screeHeight > 1050) {
							this.tableHeight = 800;
						} else if(this.screeHeight <= 1050 && this.screeHeight > 900) {
							this.tableHeight = 700;
						} else if(this.screeHeight <= 900 && this.screeHeight > 850) {
							this.tableHeight = 536;
						} else if(this.screeHeight <= 850) {
							this.tableHeight = 460;
						}
						} else {

						this.tableHeight = 40 * this.tableData.length + 56;
						if(!this.tableData.length){
							this.tableHeight=100

						}
					}
				})

			},
			//查询
			handleSearch() {
				this.loading = true
				this.curpage = 1;
				this.getRoleList()
			},
			//新增
			handleAdd() {
				this.$router.push('/roleManage/addRole')
			},
			//批量删除
			handleSomeDelete() {

			},
			//点击删除
			handleOneDel(deptId) {

				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {

						_http.http2('post', pathUrls.roleDelete,
							JSON.stringify([deptId])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.loading = true
								this.getRoleList()
							}

						}).catch((res) => {

						})
					},
					onCancel: () => {}
				});

			}

		},
		activated() {
				this.getRoleList();
      },
		mounted() {
//			this.getRoleList()

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
		margin-bottom: 10px;
	}

	.mainTop button {
		margin-right: 10px;
	}

	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;

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
</style>
