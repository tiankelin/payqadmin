<template>
	<div class="main conMain">
		<div class='mainTop conMainTop'>
			<Form inline :label-width="70">
				<FormItem label="所属组织">
					<Cascader :data="options" placeholder="所属组织" style='width: 200px;' clearable change-on-select @on-change='changeCascader' :render-format="format"></Cascader>
				</FormItem>
				<FormItem label="操作人">
					<Select v-model="staffId" filterable style="width:200px;" clearable>
						<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="交接人">
					<Select v-model="objId" filterable style="width:200px;" clearable>
						<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="状态">
					<Select v-model='status' style='width: 200px;' clearable>
						<Option :value='1'>待接收</Option>
						<Option :value='2'>已完成</Option>
						<Option :value='3'>已取消</Option>
					</Select>
				</FormItem>

				<FormItem class='conWrapper'>
					<Button type="primary" @click='handleSearch'>查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent conMainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="status">
					<span v-if='row.status==1' style="color: #f00;">{{row.statusStr}}</span>
					<span v-else-if='row.status==2' style="color: #0fb70e;">{{row.statusStr}}</span>
					<span v-else-if='row.status==3' style="color: #969595;">{{row.statusStr}}</span>
				</template>
				<template slot-scope="{ row, index }" slot="action">
					<div style="display: inline-block;margin-right: 10px;" v-if='row.status==1'>
						<Button type="info" size="small" @click="handleReceive(row.id)" v-has='"issueAccount-receive"'>完成</Button>
					</div>
					<div style="display: inline-block;" v-if='row.status==1'>
						<Button type="warning" size="small" @click="handleCancel(row.id)" v-has='"issueAccount-cancel"'>取消</Button>
					</div>

				</template>
				<template slot-scope="{ row, index }" slot="issueInfo">
					<Button type="warning" size="small" @click="getIssueInfo(row.issueInfo)">交接信息</Button>
				</template>
			</Table>
			<div class="pageMain conPageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
			</div>
		</div>
		<issueInfo @closeInfo='closeInfoMethod' v-if='closeInfo' :issueInfoArray='issueInfoArray'></issueInfo>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import issueInfo from './issueInfo';
	export default {
		name: 'index',
		components: {
			issueInfo
		},
		data() {
			return {
				issueInfoArray: [],
				closeInfo: false,
				staffNameList: [],
				objId: '',
				staffId: '',
				status: null,
				organize: '',
				pagesSize: 10,
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				sizeOpts: [10, 20, 50, 100, 200],
				curpage: 1,
				count: 0,
				loading: false,
				tableHeight: 'auto',
				dataList: [],
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				columns: [{
					title: '所属组织',
					key: 'deptName',
					minWidth: 300,
					align: 'center'
				}, {
					title: '操作人',
					key: 'staffName',
					minWidth: 150,
					align: 'center'
				}, {
					title: '交接人',
					key: 'objName',
					minWidth: 150,
					align: 'center'
				}, {
					title: '完成时间',
					key: 'receiveTime',
					minWidth: 180,
					align: 'center'
				}, {
					title: '商品总数',
					key: 'bottleCount',
					minWidth: 120,
					align: 'center'
				}, {
					title: '交接信息',
					key: 'issueInfo',
					minWidth: 120,
					align: 'center',
					slot: 'issueInfo'
				}, {
					title: '创建时间',
					key: 'createTime',
					minWidth: 180,
					align: 'center'
				},{
					title: '动作类型',
					key: 'actionName',
					minWidth: 120,
					align: 'center'
				}, {
					title: '状态',
					key: 'statusStr',
					minWidth: 120,
					align: 'center',
					slot: 'status'
				}, {
					title: '操作',
					slot: 'action',
					fixed: 'right',
					width: 150,
					align: 'center'
				}]
			}
		},
		methods: {
			closeInfoMethod(data) {
				this.closeInfo = data;
			},
			getIssueInfo(info) {
				if(info) {
					this.issueInfoArray = JSON.parse(info);
					this.closeInfo = true;
				}

			},
			//接收取消
			handleAction(status, id) {
				let title = '';
				let content = '';
				title = status == 2 ? '是否完成？' : "是否取消？";
				content = status == 2 ? "已完成!" : "已取消!";
				this.$Modal.confirm({
					title: title,
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.updateStatus, {
							id: id,
							status: status
						}).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: content,
									onClose: (() => {
										this.getGoodsissuearchivesList();
									})
								});

							}
							if(res.code == 500) {
								this.$Message['warning']({
									background: true,
									content: res.msg,
								});
							}

						})
					},
					onCancel: () => {}
				});
			},
			//接收
			handleReceive(id) {
				this.handleAction(2, id);
			},
			//取消
			handleCancel(id) {
				this.handleAction(3, id);
			},
			//获取列表
			getGoodsissuearchivesList() {
				this.loading = true;
				_http.http1("post", pathUrls.goodsissuearchivesList, {
					page: this.curpage,
					limit: this.pagesSize,
					deptId: this.organize,
					objId: this.objId,
					staffId: this.staffId,
					status: this.status,
				}, 'form').then((res) => {
					if(res.data) {
						this.loading = false;
						for(let item of res.data) {
							item.receiveTime = item.receiveTime ? item.receiveTime : '--';
						}
						this.dataList = res.data;
						if(this.dataList.length > 10) {
							this.tableHeight = this.screeHeight - 235;
						} else {
							this.tableHeight = 'auto';
						}
						this.count = res.count;
					}

				}).catch(() => {
					this.loading = false;
				})
			},
			//改变页数
			pageChange(current) {
				this.curpage = current;
				this.getGoodsissuearchivesList();

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.curpage = 1;
				this.getGoodsissuearchivesList();

			},

			//查询
			handleSearch() {
				this.curpage = 1;
				this.getGoodsissuearchivesList();
			},
			//改变组织
			changeCascader(value) {
				if(value.length) {
					let id = value[value.length - 1];
					this.organize = id;
					this.common.getStaffName(id).then((res) => {
						this.staffNameList = res.data
					})

				} else {
					this.organize = null;
					this.common.getQueryStaffList(this.userData.deptId).then((res) => {

						this.staffNameList = res.data;
					})
				}

			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
		},
		activated() {
			this.getGoodsissuearchivesList()
		},
		mounted() {
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.common.getQueryStaffList(this.userData.deptId).then((res) => {
				this.staffNameList = res.data
			})
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		min-height: calc(100% - 10px);
		background: #fff;
		position: relative;
	}

	.mainTop>>>.ivu-cascader .ivu-cascader-menu {
		background: #fff !important;
	}

	.mainTop {
		padding: 10px 10px 0;
		width: 100%;
		text-align: left;
	}

	.mainTop>>>.ivu-form-item {
		margin-bottom: 8px;
	}

	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;
	}

	.conWrapper>>>.ivu-form-item-content {
		margin-left: 10px !important;
	}

	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
		display: flex;
	}
</style>
