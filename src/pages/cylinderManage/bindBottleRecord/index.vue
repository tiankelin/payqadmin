<template>
	<div class="main conMain">
		<div class='mainTop'>
			<Form :model="formSearch" inline :label-width="96">
				<FormItem label="所属组织">
					<Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format" style="width:200px"></Cascader>
				</FormItem>
				<!--  <FormItem label="时间">
          <Date-picker format="yyyy-MM-dd HH:mm" v-model='formSearch.dateTime' type="datetimerange" placement="bottom-end"
            placeholder="选择日期" @on-change="timeChange" style="width:280px"></Date-picker>
        </FormItem> -->
				<FormItem label="绑定开始时间">
					<DatePicker style='width: 170px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss" @on-change='changeStartTime'></DatePicker>
				</FormItem>
				<FormItem label="绑定结束时间">
					<DatePicker style='width: 170px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss" @on-change='changeEndTime'></DatePicker>
				</FormItem>
				<FormItem class='formItemButton'>
					<Button type="primary" @click='handleSearch' style="margin-right: 20px;">查询</Button>
					<Button type="warning" @click='handlExport' style="margin-right: 20px;" v-has='1016'>批量导出</Button>
				</FormItem>
			</Form>

		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading="loading" highlight-row :height='tableHeight'>

			</Table>
			<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
			</div>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default {
		name: "bindBottleRecord",
		components: {
			cylInfo,
		},
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				sizeOpts: [10, 20, 50, 100, 200],
				formSearch: {
					organize: '',
					dateTime: []
				},
				startTime: '',
				endTime: '',
				pagesSize: 10,
				curpage: 1,
				count: 0,
				dataList: [],
				loading: false,
				tags: '',
				infoSee: false,
				columns: [{
						//						bottleTag
						title: '电子标签编码',
						key: 'logBottleNfcId',
						width: 140,
						align: 'center',
						render: (h, params) => {
							let that = this
							return h('span', {
								style: {
									color: '#EE6515',
									cursor: 'pointer'
								},
								on: {
									click() {
										that.infoSee = true
										that.tags = params.row.logBottleNfcId
										//										console.log(that.tags)
									}
								}
							}, params.row.logBottleNfcId);
						},

					},
					{
						title: '钢瓶条码',
						key: 'logBottleThreeId',
						align: 'center',
						render: (h, params) => {
							let that = this
							return h('span', {
								style: {
									color: '#1BA060',
									cursor: 'pointer'
								},
								on: {
									click() {

										that.infoSee = true
										that.tags = params.row.logBottleThreeId

									}
								}
							}, params.row.logBottleThreeId);
						},

					},
					{
						title: '所属组织',
						key: 'logDeptName',
						align: 'center',
						minWidth: 240,
						tooltip: true
					},
					{
						title: '绑瓶员工',
						key: 'logStaffName',
						align: 'center',

					},
					{
						title: '绑定时间',
						key: 'logCreateTime',
						align: 'center',

					},

				]
			}
		},
		methods: {
			//改变结束时间
			changeEndTime(v) {
				if(v) {
					let ends = v.substring(v.length - 8);
					let starts = v.substring(0, 11);
					if(ends == '00:00:00') {
						this.endTime = starts + '23:59:59';
					} else {
						this.endTime = v;
					}
				}
			},
			//改变起始时间
			changeStartTime(v) {
				this.startTime = v;

			},
			handlExport() {
				window.location.href = `${pathUrls.bindBottleLogExportList}
							?startTime=${this.startTime?this.common.conformatDat(this.startTime,true):''}
							&endTime=${this.endTime?this.common.conformatDat(this.endTime,true):''}
							&deptId=${this.formSearch.organize?this.formSearch.organize:this.userData.deptId}`;

			},
			getBottleRccord() {
				this.loading = true
				this.dataList = [];
				_http.http1('post', pathUrls.deptbottlebindlogList, {
					'deptId': this.formSearch.organize,
					'page': this.curpage,
					'limit': this.pagesSize,
					'startTime': this.startTime ? (this.common.conformatDat(this.startTime, true)) : '',
					'endTime': this.endTime ? (this.common.conformatDat(this.endTime, true)) : '',
				}, 'form').then((res) => {
					this.loading = false;
					this.dataList = res.data;
					this.count = res.count;
					if(this.dataList.length > 10) {
						this.tableHeight = this.screeHeight - 220;
					} else {
						this.tableHeight = 'auto';

					}
				})
			},
			//改变时间选择器
			timeChange(e) {

				if(e[1].length) {
					let ends = e[1].substring(e[1].length - 5)
					let wholes = e[1].substring(0, e[1].length - 5)
					if(ends == '00:00') {
						wholes = wholes + '' + '23:59';
						this.formSearch.dateTime = [e[0], wholes]
						this.endTime = wholes
					} else {
						this.endTime = e[1]
					}

					this.startTime = e[0]
				} else {

					this.startTime = e[0]
					this.endTime = e[1]
				}

			},
			//查看钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},
			//页数改变
			pageChange(current) {
				this.curpage = current
				this.getBottleRccord()
			},
			//条数改变
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getBottleRccord()

			},
			handleSearch() {
				this.curpage = 1;
				this.getBottleRccord()
			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				//				console.log(labels, selectedData)
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			changeCascader(value, selectedData) {
				if(value.length) {
					this.formSearch.organize = value[value.length - 1]
				} else {
					this.formSearch.organize = ''
				}

			},
		},
		mounted() {
			this.getBottleRccord()
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
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
		padding: 10px;
		width: 100%;
		text-align: left;
	}
	
	.mainTop>>>.ivu-form-item {
		margin-bottom: 0px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 0 10px 20px;
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
	
	.mainTop>>>.ivu-cascader .ivu-cascader-menu {
		background: #fff !important;
	}
	
	.formItemButton>>>.ivu-form-item-label {
		width: 20px!important;
	}
	
	.formItemButton>>>.ivu-form-item-content {
		margin-left: 20px!important;
	}
</style>