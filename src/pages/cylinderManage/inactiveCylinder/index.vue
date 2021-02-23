<template>
	<div class="main conMain">
		<div class='mainTop conMainTop'>
			<Form inline :label-width="80">
				<FormItem label="建档站点">
					<Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format" style="width:178px"></Cascader>
				</FormItem>
				<FormItem label="充装次数≥">
					<InputNumber type="number" style="width: 62px;height: 28px;line-height: 28px;" :min='1' v-model='fillNumber' />
				</FormItem>
				<FormItem label="订单次数≥">
					<InputNumber type="number" style="width: 62px;height: 28px;line-height: 28px;" :min='1' v-model='orderNumber' />
				</FormItem>
				<FormItem label="开始时间">
					<DatePicker style='width: 150px;' type="date" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd" @on-change='changeStartTime'></DatePicker>
				</FormItem>
				<FormItem label="结束时间">
					<DatePicker style='width: 150px;' type="date" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd" @on-change='changeEndTime'></DatePicker>
				</FormItem>
				<FormItem>
					<RadioGroup v-model="buttonDate" type="button" size='small' @on-change='monthClick'>
						<Radio :label="1">近一个月</Radio>
						<Radio :label="3">近三个月</Radio>
						<Radio :label="6">近半年</Radio>
						<Radio :label="12">近一年</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem class='conWrapper'>
					<Button type="primary" @click='handleSearch'>查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent conMainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>

			</Table>
			<div class="pageMain conPageMain">
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
		name: 'inactiveCylinder',
		components: {
			cylInfo,
		},
		data() {
			return {
				tags: '',
				infoSee: false,
				buttonDate: 3,
				fillNumber: 1,
				orderNumber: 1,
				organize: '',
				startTime: '',
				endTime: '',
				pagesSize: 10,
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				sizeOpts: [10, 20, 50, 100, 200],
				curpage: 1,
				count: 0,
				loading: false,
				tableHeight: 'auto',
				dataList: [{
					bottleCode: 8777100492
				}],
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				columns: [{
						title: '电子标签编码',
						key: 'bottleNfcId',
						minWidth: 200,
						align: 'center',
						fixed: 'left',
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
										that.tags = params.row.bottleNfcId
									}
								}
							}, params.row.bottleNfcId);
						},
					},
					{
						title: '钢瓶条码',
						key: 'bottleCode',
						minWidth: 200,
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
										that.tags = params.row.bottleCode
									}
								}
							}, params.row.bottleCode);
						},
					},

					{
						title: '出厂编号',
						key: 'bottleFactoryCode',
						minWidth: 200,
						align: 'center',

					},
					{
						title: '建档站点',
						key: 'createDeptName',
						minWidth: 300,
						align: 'center',
						tooltip: true,

					},

					{
						title: '规格',
						key: 'bottleSpecification',
						minWidth: 120,
						align: 'center'
					},

					{
						title: '充装次数',
						key: 'bottleActiveCount',
						minWidth: 170,
						align: 'center'
					},

				]
			}
		},
		methods: {
			getActiveBottle() {
				this.loading = true;
				_http.http1("post", pathUrls.bottleStatActiveBottle, {
					page: this.curpage,
					limit: this.pageSize,
					startTime: this.startTime ? (this.common.conformatDat(this.startTime) + ' 00:00:00') : '',
					endTime: this.endTime ? (this.common.conformatDat(this.endTime) + ' 23:59:59') : '',
					fill: 1,
					fillNumber: 1,
					deptId: this.organize,
				}, 'form').then((res) => {
					this.loading = false;
					if(res.code == 0) {
						this.dataList = res.data;
						this.count = res.count;

						if(this.dataList.length > 10) {
							this.tableHeight = this.screeHeight - 240;
						} else {
							this.tableHeight = 'auto';
						}
					}

				})
			},
			//关闭钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},
			//时间快捷键
			monthClick(v) {
				const end = new Date();
				const start = new Date();
				this.endTime = end;
				if(v == 12) {
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
				} else {
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * v);
				}
				this.startTime = start;
			},
			//改变起始时间
			changeEndTime(v) {
				this.endTime = v;
				this.buttonDate = 0;

			},
			//改变结束时间
			changeStartTime(v) {
				this.startTime = v;
				this.buttonDate = 0;
			},
			//改变页数
			pageChange(current) {
				this.curpage = current

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.curpage = 1;

			},

			//查询
			handleSearch() {
				this.curpage = 1;
				this.getActiveBottle();
			},
			//改变组织
			changeCascader(value) {
				if(value.length) {
					let id = value[value.length - 1];
					this.organize = id;

				} else {
					this.organize = null;

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
			this.getActiveBottle();
		},

		mounted() {
			const end = new Date();
			const start = new Date();
			this.endTime = end;
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3);
			this.startTime = start;
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
	
	.mainTop>>>.ivu-cascader .ivu-cascader-menu {
		background: #fff!important;
	}
	
	.mainTop {
		padding: 10px 10px 0;
		width: 100%;
		text-align: left;
	}
	
	.mainTop>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	
	.mainTop>>>.ivu-input-number-input {
		height: 28px;
		line-height: 28px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;
	}
	
	.conWrapper>>>.ivu-form-item-content {
		margin-left: 10px!important;
	}
	
	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
		display: flex;
	}
	
	.mainTop>>>.ivu-input-number-handler-wrap {
		display: none;
	}
</style>