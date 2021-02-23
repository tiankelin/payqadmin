<template>
	<div class='main conMain'>
		<div class="mainTop">
			<Input v-model="userName" placeholder="请输入账号" style="width: 200px;" />
			<Button type="primary" @click='handleSearch'>查询</Button>
			<span style="padding-left: 20px;color: #51B5EA;font-weight: 600;font-size: 14px;">{{depTitle}}</span>
			<Button type="success" @click='handleAdd' style="float: right;margin-top: 8px;margin-right: 27px;" v-has='"sys:user:save"'>新增</Button>
			<!--<Button type="error" @click='handleSomeDelete'>批量删除</Button>-->
		</div>
		<div class="mainContent">
			<div style="display: flex;justify-content: space-between;">
				<div class='deptTree' :style="{height:tableHeight1}">
					<Tree :data="baseData" ref="tree" :render="renderContent" @on-select-change='handleSelect'></Tree>
				</div>

				<div style='width: 82%;'>
					<Table border :columns="columns" :data="tableData" :loading="loading" highlight-row :height='tableHeight'>
						<template slot-scope="{ row, index }" slot="action">
							<Button size="small" type="info" style="margin-right: 10px;" @click='editClick(row.userId)' v-has='"sys:user:update"'>编辑</Button>
							<Button size="small" type="error" @click='deleteClick(row.userId)' v-has='"sys:user:delete"'>删除</Button>
						</template>
					</Table>
					<div class="pageMain">
						<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
					</div>
				</div>
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
		name: 'userManage',
		components: {
			pagination,

		},
		data() {
			return {
				tableHeight1:'auto',
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				depTitle: '',
				depId: null,
				userData: (JSON.parse(this.$store.state.userData)),
				baseData: [],
				loading: false,
				pagesSize: 10,
				curpage: 1,
				count: 0,
				userName: '',
				columns: [{
						title: '账号',
						key: 'username',
						align: 'center',
						tooltip: true,
						width:200,
						fixed:'left'
					},
					{
						title: '工号',
						key: 'userCode',
						align: 'center',
						tooltip:true,
						width:160
					},
					{
						title: '联系方式',
						key: 'mobile',
						align: 'center',
						tooltip:true,
						width:160
					},
					{
						title: '组织部门',
						key: 'deptName',
						align: 'center',
						tooltip: true,
						width:250
					},
					{
						title: '角色',
						key: 'roleNames',
						align: 'center',
						minWidth: 250,
						tooltip: true,
					},
					{
						title: '状态',
						key: 'status1',
						align: 'center',

						width: 70
					},
//					{
//						title: '创建时间',
//						key: 'createTime',
//						align: 'center',
//						tooltip: true,
//					},

					{
						title: '操作',
						key: 'action',
						width: 140,
						align: 'center',
						slot: 'action',
						fixed:'right'

					}
				],
				tableData: []
			}
		},
		methods: {
			//删除
			deleteClick(id) {
				this.handleOneDel(id)
			},
			//编辑
			editClick(id) {
				this.$router.push('/userManage/editUser' + '/' + id)
			},
			//获取组织
			getOrganize() {
				_http.http2('get', pathUrls.organizationList + '?deptId=' + this.userData.deptId, {}, "form")
					.then((res) => {
						if(res) {
							this.baseData = this.getDepts(res);
							this.tableHeight1=this.screeHeight-150+'px';
						}
					})
			},

			//递归数据
			getDepts(depts) {
				return depts.map((dept) => {
					    dept.expand = false;
					if(dept.deptId==this.userData.deptId){
						dept.expand = true;
					}

					if(dept.children.length > 0) {
						this.getDepts(dept.children);
					}
					if(dept.children.length == 0) {
						delete dept.children;
					}
					dept.title = dept.name;

					return dept;
				})
			},

			//自定义tree树形组件
			renderContent(h, {
				root,
				node,
				data
			}) {
				return h('span', {
					style: {
						width: '100%',
						cursor: "pointer",
						color: node.node.selected ? "#51B5EA" : "#515a6e", //根据选中状态设置样式
					},
				}, [
					h('span', [
						h('Icon', {
							props: {
								type: 'md-home'
							},
							style: {
								marginRight: '4px',
								color: '#51B5EA'
							}
						}),
						h('span', {
							style: {
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								marginBottom: '-6px',
								display: 'inline-block',
								width: '80%',
								fontSize: '12px'
							}
						}, data.name)

					]),

				])

			},
			handleSelect(v) {
				if(v.length) {
					this.depId = v[0].deptId;
					this.depTitle = v[0].name;
				} else {
					this.depId = null;
					this.depTitle = '';
				}
				this.curpage = 1;
				this.getUserList();
			},
			pageChange(current) {
				this.curpage = current
				this.loading = true
				this.getUserList()
			},
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.loading = true
				this.curpage = 1;
				this.getUserList()
			},
			//获取用户列表接口
			getUserList() {
				// this.tableData = []
				this.loading = true
				_http.http1('post', pathUrls.userList, {
					'page': this.curpage,
					"limit": this.pagesSize,
					"username": this.userName,
					'deptId': this.depId
				}, 'form').then((res) => {
					this.loading = false
					for(let item of res.data) {
						if(item.status == 1) {
							item.status1 = '正常'
						} else {
							item.status1 = '禁用'
						}
					}
					this.tableData = res.data;
					this.count = res.count;
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

				}).catch((res) => {

				})

			},
			//查询
			handleSearch() {
				this.loading = true
				this.curpage = 1;
				this.getUserList()
			},
			//新增
			handleAdd() {
				this.$store.commit('changeDeps', this.depId || this.userData.deptId + '');
				this.$router.push('/userManage/addUser')
			},
			//批量删除
			handleSomeDelete() {

			},
			//点击删除
			handleOneDel(userId) {

				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {

						_http.http2('post', pathUrls.userDelete,
							JSON.stringify([userId])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});

								this.getUserList()
							}

						}).catch((res) => {

						})
					},
					onCancel: () => {}
				});

			}
		},
		activated() {
				this.getUserList();
      },
		mounted() {

//			this.getUserList()
			this.getOrganize()
		}

	}
</script>
<style scoped>
	.main {
		margin-right: 10px;
		background: #fff;
		min-height: calc(100% - 10px);
	}

	.mainTop {
		height: 48px;
		line-height: 48px;
		text-align: left;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
		/*margin-bottom: 10px;*/
	}

	.mainTop button {
		margin-right: 10px;
	}

	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;
	}

	.deptTree {
		width: 18%;
		text-align: left;
		/*height: 500px;*/
		overflow-y: auto;
		overflow-x: hidden;
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
