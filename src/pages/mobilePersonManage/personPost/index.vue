<template>
	<div class='main conMain'>
		<div class="mainTop">
			<Form inline :label-width="80">
				<FormItem class='deptTitle'>
					<span style="color: #51B5EA;font-weight: 600;font-size: 14px;display: inline-block;min-width: 200px;">{{deptTitle}}</span>
				</FormItem>
				<FormItem label="角色名称" class='personName'>
					<Input @on-keyup="positionName=positionName.replace(/\s+/g,'')" v-model="positionName" placeholder="请输入角色名称" style="width:170px" />
				</FormItem>
				<FormItem>
					<Button type="primary" @click='handleSearch'>查询</Button>
					<Button type="success" @click='handleAdd' v-has='844'>新增</Button>
				</FormItem>
			</Form>

			<!--<Button type="error" @click='handleSomeDelete' v-has='846'>批量删除</Button>-->
		</div>
		<div class="mainContent">
			<div style="display: flex;justify-content: space-between;">
				<div class='deptTree' :style="{height:tableHeight1}">
					<Tree :data="baseData" ref="tree" :render="renderContent"></Tree>
					<Spin fix v-if='loading1'></Spin>
				</div>
				<div style='width: 80%;'>
					<Table border :columns="columns" :data="dataList" :loading='loading' @on-selection-change='selectChange' highlight-row :height='tableHeight'>
						<template slot-scope="{ row, index }" slot="deptNames">
							<Button size="small" @click="handleValueInfo(row.deptNames,row.positionName)" style="margin-right: 10px;">
							关联组织
						</Button>
						</template>
						<template slot-scope="{ row, index }" slot="action">
							<Button type="info" size="small" style="margin-right: 5px;background: #ab2ce4;border-color: #ab2ce4;" @click="dataAssign(row.positionId,row.positionName,row.positionDataScope)" v-has='924'>数据配置</Button>
							<Button type="warning" size="small" style="margin-right: 5px" @click="moduleAssign(row.positionId,row.positionName)" v-has='924'>功能配置</Button>
							<Button type="info" size="small" style="margin-right: 5px" @click="edit(row.positionId)" v-has='845'>编辑</Button>
							<Button type="error" size="small" @click="remove(row.positionId,row.positionStatus,row.positionExtends)" v-has='846'>删除</Button>
						</template>
					</Table>
					<div class="pageMain">
						<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
					</div>
				</div>

			</div>

		</div>
		<Modal draggable v-model="modals" :title="title">
			<p style="padding:0 10px;text-align: left;max-height:500px;overflow-y: auto;">
				<span v-for='item in params' :key='item' style="color: #0d900c;display: block;">{{item}}</span></p>
		</Modal>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		name: 'personPost',
		data() {
			return {
				title: '',
				params: '',
				modals: false,
				deptTitle: '',
				currentChoose: '',
				loading1: false,
				tableHeight1: 'auto',
				userData: (JSON.parse(this.$store.state.userData)),
				baseData: [],
				positionName: '',
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				selectArr: [],
				count: 0,
				curpage: 1,
				pagesSize: 10,
				dataList: [],
				loading: false,
				columns: [
					//				{
					//						type: 'selection',
					//						width: 60,
					//						align: 'center',
					//					},
					{
						title: '序号',
						//						type: 'index',
						width: 70,
						align: 'center',
						key: 'newIndex'
					},
					{
						title: '角色名称',
						key: 'positionName',
						align: 'center',
						minWidth: 160,
					},

					{
						title: '下级是否继承该角色',
						key: 'newPositionExtends',
						align: 'center',
						minWidth:150,
					},
					{
						title: '关联组织',
						key: 'deptNames',
						align: 'center',
						minWidth:100,
						slot: 'deptNames'
					},
					{
						title: '权限范围',
						key: 'newPositionDataScope',
						align: 'center',
						minWidth:140,						
					},
					{
						title: '创建人',
						key: 'positionCreateStaffName',
						align: 'center',
						minWidth: 140,
					},
					{
						title: '创建时间',
						key: 'positionCreateTime',
						align: 'center',
						minWidth: 175,
					},
					{
						title: '操作',
						slot: 'action',
						width: 300,
						align: 'center'
					}
				]
			}
		},
		methods: {
			//查看关联组织
			handleValueInfo(params, name) {
				if(params) {
					this.params = params.split(',');
				}
				this.params = params.split(',');
				this.modals = true;
				this.title = name + '——' + '关联组织'
			},
		
			//自定义tree树形组件
			renderContent(h, {
				root,
				node,
				data
			}) {
				return h('span', {
					style: {
						display: 'inline-block',
						width: '100%',
						cursor: "pointer",
						color:this.currentChoose==node.node.deptId ? "#51B5EA" : "#515a6e", //根据选中状态设置样式
						background:this.currentChoose==node.node.deptId?'#d5e8fc':'',
						padding: '0 4px'
					},
					on: {
						click: (e) => {								
							this.currentChoose =data.deptId;
							this.deptTitle=data.name;
							this.curpage = 1;
							this.getPersonPostList();

						}
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
								//								width: '80%',
								fontSize: '12px'
							}
						}, data.name)

					]),

				])

			},
			//查询
			handleSearch() {
				this.curpage=1;
				this.getPersonPostList();
			},
			//数据配置
			dataAssign(id, roleName, positionDataScope) {
				this.$router.push({
					path: `/personPost/dataAssign/${id}/${roleName}/${positionDataScope}`
				})
			},
			//
			selectChange(selection) {
				this.selectArr = []
				//				console.log(selection)
				if(selection) {
					for(let item of selection) {
						this.selectArr.push(item.positionId)
					}

				}
			},
			//删除
			remove(id, positionStatus, positionExtends) {
				if(positionStatus) {
					this.$Message['warning']({
						background: true,
						content: '非自建角色不能删除！'
					});
				} else {
					this.$Modal.confirm({
						title: positionExtends ? '下级继承的角色也会一并删除，是否继续？' : '是否继续？',
						content: '',
						onOk: () => {
							_http.http1('post', pathUrls.deptPositionDelete, {
									positionId: id
								},
								'form').then((res) => {
								if(res.code == 0) {
									this.$Message['success']({
										background: true,
										content: '删除成功!',
										onClose: (() => {
											this.getPersonPostList()
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

				}

			},

			//模块分配
			moduleAssign(id, roleName) {
				this.$router.push({
					path: `/personPost/moduleAssign/${id}/${roleName}`
				})
			},
			//获取移动人员岗位列表
			getPersonPostList() {
				this.loading = true
				this.selectArr = []
				_http.http1('post', pathUrls.positionList, {
					'page': this.curpage,
					"limit": this.pagesSize,
					"positionName": this.positionName,
					"deptId": this.currentChoose ? this.currentChoose :this.userData.deptId
				}, 'form').then((res) => {
					this.loading = false
					for(let [item, index] of new Map(res.data.list.map((item, i) => [item, i]))) {
						item.newPositionExtends = item.positionExtends ? "继承" : '不继承';
						item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);
						item.newPositionStatus = item.positionStatus ? '上级分配' : '自己创建';
						if(item.positionDataScope===0){
							item.newPositionDataScope='默认设置';
						}else if(item.positionDataScope===1){
							item.newPositionDataScope='本组织';
						}else if(item.positionDataScope===2){
							item.newPositionDataScope='本组织及下级组织';
						}else if(item.positionDataScope===3){
							item.newPositionDataScope='自定义';
						}
					}
					this.dataList = res.data.list;
					this.count = res.data.totalCount;
					if(this.dataList.length > 10) {
						this.tableHeight = this.screeHeight - 200;
					} else {
						this.tableHeight = 'auto';
					}
				})
			},
			//新增
			handleAdd() {
				let id = this.currentChoose ? this.currentChoose : this.userData.staffDeptId;
				this.$router.push('/personPost/addPost' + '/' + id);
			},
			//编辑
			edit(id) {
				this.$router.push('/personPost/editPost' + '/' + id);
			},
			//批量删除
			handleSomeDelete() {
				if(!this.selectArr.length) {
					this.$Message['warning']({
						background: true,
						content: '请选择删除项!',
						duration: 1
					});
					return false
				} else {
					this.$Modal.confirm({
						title: '是否删除？',
						content: '',
						onOk: () => {
							_http.http2('post', pathUrls.deptstaffpositionDelete,
								JSON.stringify(this.selectArr)
							).then((res) => {
								if(res.code == 0) {
									this.$Message['success']({
										background: true,
										content: '删除成功!',
										onClose: (() => {
											this.selectArr = []
											this.getPersonPostList()
										})
									});

								}

							})
						},

					});
				}
			},
			//改变页数
			pageChange(current) {
				this.curpage = current
				this.getPersonPostList()
			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getPersonPostList()
			},
		},
		activated() {
			this.getPersonPostList();

		},
		mounted() {
			// this.getPersonPostList()
			this.loading1 = true;
			this.deptTitle = this.userData.dept.name;
			this.common.getDeptList(this.userData.staffDeptId).then((res) => {
				this.loading1 = false;
				this.baseData = this.common.getConDept(res.data, 1, 0, 0, this.userData.staffDeptId)
				this.tableHeight1 = this.screeHeight - 150 + 'px';
			}).catch(() => {
				this.loading1 = false;
			})
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
		padding: 10px 10px 0;
		text-align: left;
	}
	
	.mainTop>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	
	.mainTop button {
		margin-right: 20px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 0 10px 20px;
	}
	/*.mainContent>>>td {
		height: 40px;
	}*/
	
	.deptTree {
		width: 20%;
		text-align: left;
		/*height: 500px;*/
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
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
	
	.mainContent>>>.ivu-table-cell {
		padding: 0 9px;
	}
	
	.mainContent>>>.ivu-tree-title {
		padding: 0!important;
	}
	
	.deptTitle>>>.ivu-form-item-content {
		margin-left: 0!important;
	}
</style>