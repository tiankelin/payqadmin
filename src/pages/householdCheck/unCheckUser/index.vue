<template>
	<div class="main">
		<div class="mainTop">
			<Form :model="formSearch" inline :label-width="70">
				<FormItem label="所属组织">
					<Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format" style="width:200px"></Cascader>
				</FormItem>
				<FormItem label="查看" class='seeDays'>
					<InputNumber :min='0' style="width: 80px;" v-model='formSearch.unCheckDays' @on-change='dayChange' />
					<span>天未安检的客户资料</span>
					<RadioGroup v-model="buttonDate" type="button" size='small' @on-change='radioChange'>
						<Radio :label="30">近一个月</Radio>
						<Radio :label="90">近三个月</Radio>
						<Radio :label="180">近半年</Radio>
						<Radio :label="365">近一年</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="客户类型" class='userType'>
					<Select v-model="formSearch.userType" style="width:150px" clearable placeholder="请选择客户类型">
						<Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
					</Select>
				</FormItem>
				<FormItem class='formButton'>
					<Button type="primary" @click='handleSearch' style="margin-right: 20px;">查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading="loading" highlight-row :height='tableHeight'>

			</Table>
			<div class="pageMain conPageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'unCheckUser',
		data() {
			return {
				sizeOpts: [10, 20, 50, 100, 200],
				curpage: 1,
				count: 0,
				pagesSize: 10,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch: {
					organize: '',
					unCheckDays: 180,
					userType: ''
				},
				options: [],
				dataList: [],
				loading: false,
				userTypeList: [],
				buttonDate: 180,
				columns: [{
					title: '序号',
					type: 'index',
					width: 100,
					align: 'center',

				}, {
					title: '所属组织',
					align: 'center',
					key: 'deptName',
					minWidth: 300
				}, {
					title: '客户类型',
					align: 'center',
					key: 'userOrderTypeName',
					minWidth: 140
				}, {
					title: '户号',
					align: 'center',
					key: 'userAccountNumbers',
					minWidth: 180
				}, {
					title: '联系人',
					align: 'center',
					key: 'userRealName',
					minWidth: 160
				}, {
					title: '用气地址',
					align: 'center',
					key: 'userAddress',
					tooltip: true,
					minWidth: 300
				}, {
					title: '联系方式',
					align: 'center',
					key: 'userPhoneNumber',
					minWidth: 150
				}, {
					title: '最后安检时间',
					align: 'center',
					key: 'userLastCheckTime',
					minWidth: 180
				}, ]
			}
		},
		methods: {
			//改变页数
			pageChange(current) {
				this.curpage = current;
				this.getNoCheckList();

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.curpage = 1;
				this.getNoCheckList();

			},
			dayChange(v) {
				this.buttonDate = v;
			},
			//查询
			handleSearch() {
				this.curpage = 1;
				this.getNoCheckList();
			},
			//获取列表
			getNoCheckList() {
				this.loading = true
				this.dataList = [];
				_http.http1('post', pathUrls.noCheckList, {
					'page': this.curpage,
					'limit': this.pagesSize,
					'userDeptId': this.formSearch.organize,
					'userOrderType': this.formSearch.userType,
					'noCheckDayNum': this.formSearch.unCheckDays
				}, 'form').then((res) => {
					this.loading = false;
					this.dataList = res.data;
					this.count = res.count;
					if(this.dataList.length > 10) {
						this.tableHeight = this.screeHeight - 235;
					} else {
						this.tableHeight = 'auto';
					}
				}).catch(() => {
					this.loading = false;
				})
			},
			//天数切换
			radioChange(v) {
				this.formSearch.unCheckDays = v;
				this.getNoCheckList();
			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				//				console.log(labels, selectedData)
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			//组织切换
			changeCascader(value, selectedData) {
				if(value.length) {
					this.formSearch.organize = value[value.length - 1];

				} else {
					this.formSearch.organize = '';

				}
			},
		},
		mounted() {
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.userTypeList = res.data;
			})
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.getNoCheckList()
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
		padding: 15px 10px 10px;
		width: 100%;
		text-align: left;
	}
	
	.mainTop>>>.ivu-form-item {
		margin-bottom: 0px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 0 10px 10px;
	}
	
	.mainContent>>>td {
		height: 45px;
		border-bottom: 1px solid #e8eaec!important;
	}
	
	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
		display: flex;
	}
	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
		/*border-color: #f3f3f3;*/
	}
	
	.mainTop>>>.ivu-cascader .ivu-cascader-menu {
		background: #fff!important;
	}
	
	.seeDays button {
		padding: 0 8px;
		margin: 0 3px;
	}
	
	.formButton>>>.ivu-form-item-content {
		margin-left: 10px!important;
	}
</style>