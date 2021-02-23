<template>
	<div class="main conMain">
		<div class='mainTop'>
			<Form :model="formSearch" inline :label-width="70">
				<FormItem label="所属组织">
					<Cascader :data="options" clearable placeholder="所属组织" change-on-select @on-change='changeCascader' style="width: 186px;" :render-format="format"></Cascader>
				</FormItem>
				<FormItem label="是否启用">
					<Select v-model="formSearch.isActive" clearable style="width:186px" placeholder="是否启用">
						<Option value="1">是</Option>
						<Option value="0">否</Option>
					</Select>
				</FormItem>
				<FormItem label="门禁状态">
					<Select v-model="formSearch.accessCtrlStatus" clearable style="width:186px" placeholder="门禁状态">
						<Option value="1">只出</Option>
						<Option value="2">只入</Option>
						<Option value="3">出入</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Button type="success" @click='handleAdd' v-has='915' style="margin-right: 20px;">新增</Button>
					<Button type="primary" @click='handleSearch'>查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="tableData" :loading="loading" highlight-row :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="action">
					<Button size="small" type="info" style="margin-right: 10px;" @click='editClick(row.id)' v-has='916'>编辑</Button>
					<Button size="small" type="error" @click='deleteClick(row.id)' v-has='917'>删除</Button>
				</template>
			</Table>
			<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
			</div>
		</div>
	</div>
</template>
<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'accessFile',
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				loading: false,
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				formSearch: {
					organize: '',
					accessCtrlStatus: '',
					isActive: ''
				},
				columns: [{
						title: '门禁名称',
						key: 'accessCtrlName',
						align: 'center',
						minWidth: 200,
						fixed: 'left'
					},
					{
						title: '门禁类型',
						key: 'accessCtrlType',
						//						fixed: 'left',
						align: 'center',
						minWidth: 120
					},
					{
						title: '所属组织',
						key: 'deptName',
						align: 'center',
						minWidth: 350
					},

					{
						title: '厂商',
						key: 'accessCtrlFactory',
						align: 'center',
						minWidth: 220
					},
					{
						title: '型号',
						key: 'accessCtrlModel',
						align: 'center',
						minWidth: 150
					},
					{
						title: '购置时间',
						key: 'acquisitionTime',
						align: 'center',
						minWidth: 180
					},
					{
						title: '是否启用',
						key: 'isActive',
						align: 'center',
						minWidth: 100
					},
					{
						title: '门禁状态',
						key: 'accessCtrlStatus',
						align: 'center',
						minWidth: 100
					},
					{
						title: '责任人',
						key: 'personLiableName',
						align: 'center',
						minWidth: 150
					},
					{
						title: '创建人',
						key: 'createrName',
						align: 'center',
						minWidth: 130
					}, {
						title: '创建时间',
						key: 'createTime',
						align: 'center',
						minWidth: 180
					}, {
						title: '更新时间',
						key: 'updateTime',
						align: 'center',
						minWidth: 180
					},

					{
						title: '工作状态',
						key: 'newOnline',
						align: 'center',
						minWidth: 120
					},

					{
						title: '操作',
						key: 'action',
						width: 150,
						fixed: 'right',
						align: 'center',
						slot: 'action',

					}
				],
				tableData: [{
					deptName: '',
					createTime: '',
					updateTime: '',
					createrName: '',
					personLiableName: '',
					accessCtrlStatus: '',
					isActive: '',
					acquisitionTime: '',
					accessCtrlModel: '',
					accessCtrlFactory: '',
					accessCtrlName: '',
					accessCtrlType: ''
				}],
				count: 0,
				curpage: 1,
				pagesSize: 10,
				startTime: '',
				endTime: '',
				defaultInfo: true,
				baseURL: ''
			}
		},
		methods: {
			//删除
			deleteClick(id) {
				this.handleOneDel(id)
			},
			//编辑
			editClick(id) {
				this.$router.push('/accessFile/editFileA' + '/' + id)
			},
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			handleOneDel(id) {
				let a = [];
				a.push(id);
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {

						_http.http4('delete', pathUrls.accessDelete, [id]).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.loading = true;
								this.getAccessList();
							}

						}).catch((res) => {

						})
					},
					onCancel: () => {}
				});

			},
			getAccessList() {
				this.tableData = [];
				this.loading = true
				_http.http1('post', pathUrls.accessShow, {
					page: this.curpage,
					limit: this.pagesSize,
					accessCtrlStatus: this.formSearch.accessCtrlStatus,
					isActive: this.formSearch.isActive,
					deptId: this.formSearch.organize,
				}, 'form').then((res) => {
					this.loading = false;
					//					console.log(res.data);
					this.count = res.count;

					for(let item of res.data) {
						if(item.accessCtrlType == 1) {
							item.accessCtrlType = '充装台门禁'
						} else if(item.accessCtrlType == 2) {
							item.accessCtrlType = '轻瓶库门禁'
						} else if(item.accessCtrlType == 3) {
							item.accessCtrlType = '重瓶库门禁'
						} else {
							item.accessCtrlType = ''
						}
						if(item.isActive == 1) {
							item.isActive = '是'
						} else {
							item.isActive = '否'
						}
						if(item.accessCtrlStatus == 1) {
							item.accessCtrlStatus = '只出'
						} else if(item.accessCtrlStatus == 2) {
							item.accessCtrlStatus = '只入'
						} else {
							item.accessCtrlStatus = '出入'
						}
						item.newOnline = item.isOnline == 1 ? '在线' : '离线'
					}
					//						console.log(res);
					this.tableData = res.data;
					if(this.tableData.length > 10) {
						this.tableHeight = this.screeHeight - 235;
					} else {
						this.tableHeight = 'auto';

					}

				})
			},
			changeCascader(value, selectedData) {
				//				console.log(value, selectedData);
				if(value.length) {
					this.formSearch.organize = value[value.length - 1];
				} else {
					this.formSearch.organize = '';
				}
			},

			//改变页数
			pageChange(current) {
				this.curpage = current
				this.loading = true;
				this.getAccessList();
			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.loading = true;
				this.getAccessList();
			},
			//新增
			handleAdd() {
				this.$router.push('/accessFile/addFileA')
			},
			//查询
			handleSearch() {
				this.curpage = 1
				this.loading = true;
				this.getAccessList();
			}
		},
		activated() {
			this.getAccessList();
		},
		mounted() {
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
		}
	}
</script>
<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		background: #FFFFFF;
		min-height: calc(100% - 10px);
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
	
	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
	}
	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	
	.defaultInfo {
		width: 300px;
		text-align: left;
		padding-left: 5px;
		height: 24px;
		line-height: 24px;
		font-size: 12px;
		margin: 0 0 0px 10px;
		background: #EF8920;
		color: #fff;
		box-shadow: 0px 2px 2px #c8c8c8;
	}
	
	.mainTop>>>.ivu-cascader .ivu-cascader-menu {
		background: #fff!important;
	}
</style>