<template>
	<div class="main conMain">
		<div class='mainTop conMainTop'>
			<Form inline :label-width="96">
				<FormItem label="所属组织">
					<Cascader :data="options" placeholder="所属组织" style='width: 170px;' clearable change-on-select @on-change='changeCascader' :render-format="format"></Cascader>
				</FormItem>
				<FormItem label="责任人">
					<Select v-model="staffId" filterable style="width:170px;" clearable placeholder="责任人">
						<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="联系方式">
					<Input type="text" style="width: 170px;" placeholder="联系方式" />
				</FormItem>
				<FormItem label="工号">
					<Input type="text" style="width: 170px;" placeholder="工号" />
				</FormItem>
				<FormItem label="统计开始时间">
					<DatePicker style='width: 170px;' type="date" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd" @on-change='changeStartTime'></DatePicker>
				</FormItem>
				<FormItem label="统计结束时间">
					<DatePicker style='width: 170px;' type="date" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd" @on-change='changeEndTime'></DatePicker>
				</FormItem>
			</Form>
		</div>
		<div class='defaultInfo'>说明：统计时间默认展示当月统计情况。商业包含商业用户和小微商业用户。</div>
		<div class="mainContent conMainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight' :span-method="handleSpan">

			</Table>
			<div class="footMain" :class='[showPadding?"footMainPadding":""]'>
				<Table  border :columns="columns" :data="dataList1" :loading='loading' :span-method="handleSpan" :show-header='false'>

				</Table>
			</div>

		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'index',
		data() {
			return {
				showPadding:false,
				endTime: '',
				startTime: '',
				staffNameList: [],
				options: [],
				staffId: '',
				screeHeight: document.documentElement.clientHeight, // 屏幕高				
				loading: false,
				tableHeight: 'auto',
				dataList1: [{
					time: '合计',
					'15KG': 5
				}],
				dataList: [{
					'time': '11月1日',
					'15KG': 5
				}, {
					'time': '11月2日',
					'15KG': 10
				}],
				userData: (JSON.parse(this.$store.state.userData)),
				columns: [{
					title: '时间 ',
					key: 'time',
					align: 'center',
					minWidth: 150
				}, {
					title: '操作 ',
					key: 'action',
					align: 'center',
					minWidth: 110,
					render: (h, params) => {
						return h('div', {
							style: {
								textAlign: 'left'
							}
						}, [
							h('div', {
								style: {
									borderBottom: '1px solid #e8eaec',
									padding: '4px',

								}
							}, '入库商品'),
							h('div', {
								style: {
									borderBottom: '1px solid #e8eaec',
									padding: '4px'
								}
							}, '退回商品'),
							h('div', {
								style: {
									borderBottom: '1px solid #e8eaec',
									padding: '4px'
								}
							}, '出库（回款/回瓶）'),
							h('div', {
								style: {
									display: 'flex',
									//												justifyContent:'center',
								}
							}, [
								h('div', {
									style: {
										borderRight: '1px solid #e8eaec',
										flex: '1',
										lineHeight: '88px',
										paddingLeft: '4px'
									}
								}, '库存（待回款）'),
								h('div', {
									style: {
										flex: '0.5',
									}
								}, [
									h('div', {
										style: {
											borderBottom: '1px solid #e8eaec',
											padding: '4px'
										}
									}, '已销售'),
									h('div', {
										style: {
											borderBottom: '1px solid #e8eaec',
											padding: '4px'
										}
									}, '待销售'),
									h('div', {
										style: {
											padding: '4px'
										}
									}, '总额')
								])
							])
						])
					}
				}, {
					title: '液化气 ',
					key: 'action',
					align: 'center',
					children: [{
						title: '10KG',
						key: '10KG',
						align: 'center',
						children: [{
							title: '居民',
							key: '10KG',
							align: 'center',
							render: (h, params) => {
								return h('div', {}, [
									h('div', {}, [
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex'
											}
										}, [h('div', {
											style: {
												flex: '1',
												padding: '4px',
												borderRight: '1px solid #e8eaec'
											}
										}, '123'), h('div', {
											style: {
												flex: '1',
												padding: '4px'
											}
										}, '456')]),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex'
											}
										}, [h('div', {
											style: {
												flex: '1',
												padding: '4px',
												borderRight: '1px solid #e8eaec'
											}
										}, '123'), h('div', {
											style: {
												flex: '1',
												padding: '4px'
											}
										}, '456')]),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												padding: '4px'
											}
										}, 12)
									])
								])
							},
						}, {
							title: '商业',
							key: '10KG',
							align: 'center',
							render: (h, params) => {
								return h('div', {}, [
									h('div', {}, [
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex'
											}
										}, [h('div', {
											style: {
												flex: '1',
												padding: '4px',
												borderRight: '1px solid #e8eaec'
											}
										}, '123'), h('div', {
											style: {
												flex: '1',
												padding: '4px'
											}
										}, '456')]),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex'
											}
										}, [h('div', {
											style: {
												flex: '1',
												padding: '4px',
												borderRight: '1px solid #e8eaec'
											}
										}, '123'), h('div', {
											style: {
												flex: '1',
												padding: '4px'
											}
										}, '456')]),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												padding: '4px'
											}
										}, 12)
									])
								])
							},
						}]
					}, {
						title: '15KG',
						key: '15KG',
						align: 'center',
						children: [{
							title: '居民',
							key: '15KG',
							align: 'center',
							render: (h, params) => {
								return h('div', {}, [
									h('div', {}, [
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),

										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												padding: '4px'
											}
										}, 12)
									])
								])
							},
						}, {
							title: '商业',
							key: '15KG',
							align: 'center',
							render: (h, params) => {
								return h('div', {}, [
									h('div', {}, [
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex'
											}
										}, [h('div', {
											style: {
												flex: '1',
												padding: '4px',
												borderRight: '1px solid #e8eaec'
											}
										}, '123'), h('div', {
											style: {
												flex: '1',
												padding: '4px'
											}
										}, '456')]),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex'
											}
										}, [h('div', {
											style: {
												flex: '1',
												padding: '4px',
												borderRight: '1px solid #e8eaec'
											}
										}, '123'), h('div', {
											style: {
												flex: '1',
												padding: '4px'
											}
										}, '456')]),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												padding: '4px'
											}
										}, 12)
									])
								])
							},
						}]
					}, {
						title: '50KG',
						key: '50KG',
						align: 'center',
						children: [{
							title: '商业',
							key: '50KG',
							align: 'center',
							render: (h, params) => {
								return h('div', {}, [
									h('div', {}, [
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex'
											}
										}, [h('div', {
											style: {
												flex: '1',
												padding: '4px',
												borderRight: '1px solid #e8eaec'
											}
										}, '123'), h('div', {
											style: {
												flex: '1',
												padding: '4px'
											}
										}, '456')]),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex'
											}
										}, [h('div', {
											style: {
												flex: '1',
												padding: '4px',
												borderRight: '1px solid #e8eaec'
											}
										}, '123'), h('div', {
											style: {
												flex: '1',
												padding: '4px'
											}
										}, '456')]),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												padding: '4px'
											}
										}, 12)
									])
								])
							},
						}]
					}]
				}, {
					title: '丙烷 ',
					key: 'action',
					align: 'center',
					children: [{
						title: '10KG',
						key: '10KG',
						align: 'center',

						children: [{
							title: '居民',
							key: '10KG',
							align: 'center',
							render: (h, params) => {
								return h('div', {}, [
									h('div', {}, [
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),

										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												padding: '4px'
											}
										}, 12),
										h('div', {
											style: {
												padding: '4px'
											}
										}, 12)
									])
								])
							},
						}, {
							title: '商业',
							key: '10KG',
							align: 'center',
							render: (h, params) => {
								return h('div', {}, [
									h('div', {}, [
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex',

											}
										}, [h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												padding: '4px',
												flex: '1'
											}
										}, 3)]),
										h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex',

											}
										}, [h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												padding: '4px',
												flex: '1'
											}
										}, 3)]), h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex',

											}
										}, [h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												padding: '4px',
												flex: '1'
											}
										}, 3)]), h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex',

											}
										}, [h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												padding: '4px',
												flex: '1'
											}
										}, 3)]), h('div', {
											style: {
												borderBottom: '1px solid #e8eaec',
												display: 'flex',

											}
										}, [h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												padding: '4px',
												flex: '1'
											}
										}, 3)]), h('div', {
											style: {
												//																borderBottom:'1px solid #e8eaec',
												display: 'flex',

											}
										}, [h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												borderRight: '1px solid #e8eaec',
												padding: '4px',
												flex: '1'
											}
										}, 3), h('div', {
											style: {
												padding: '4px',
												flex: '1'
											}
										}, 3)]),
									])
								])
							},
						}]
					}, {
						title: '15KG',
						key: '15KG',
						align: 'center',
						children: [{
							title: '居民',
							key: '15KG',
							align: 'center',
						}, {
							title: '商业',
							key: '15KG',
							align: 'center',
						}]
					}, {
						title: '50KG',
						key: '50KG',
						align: 'center',
						children: [{
							title: '商业',
							key: '50KG',
							align: 'center',
						}]
					}]
				}, {
					title: '钢瓶 ',
					key: 'action',
					align: 'center',
					children: [{
						title: '10KG',
						key: '10KG',
						align: 'center',
					}, {
						title: '15KG',
						key: '15KG',
						align: 'center',
					}, {
						title: '50KG',
						key: '50KG',
						align: 'center',
					}]
				}, ]
			}
		},
		methods: {
			//改变起始时间
			changeEndTime(v) {
				this.endTime = v;
			},
			//改变结束时间
			changeStartTime(v) {
				this.startTime = v;
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
			handleSpan({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if(columnIndex === 2) {
					return [1, 2];
				}
				if(columnIndex === 3) {
					return [1, 2];
				}
				if(columnIndex === 5) {
					return [1, 2];
				}
				if(columnIndex === 6) {
					return [1, 2];
				}
				if(columnIndex === 8) {
					return [1, 3];
				}

			}
		},
		activated() {

		},
		mounted() {
			this.tableHeight = this.screeHeight - 410;
			let bodyHight=this.tableHeight-117;
				if(bodyHight>this.dataList.length*180){
					this.showPadding=false;
				}else{
					this.showPadding=true;
				}
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.common.getQueryStaffList(this.userData.deptId).then((res) => {
				this.staffNameList = res.data
			})
			let dateTime = this.common.getNowMonth();
			this.startTime = `${dateTime[0]}`;
			this.endTime = `${dateTime[1]}`;
			
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
	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
		border-color: #0d9ee126;
	}
	
	.mainContent>>>.ivu-table-cell {
		padding: 0;
	}
	
	.conWrapper>>>.ivu-form-item-content {
		margin-left: 10px !important;
	}
	.footMain {		
		border-right: 1px solid #e8eaec;
		border-bottom: 1px solid #e8eaec;
	}
	.footMainPadding{
		padding-right: 17px;
	}
	.footMain>>>.ivu-table-row td {
		background: #a8b3b926;
	}
	
	.footMain>>>.ivu-table-row td:first-child {
		font-weight: 600;
	}
	
	.defaultInfo {
		width: 420px;
		text-align: left;
		padding-left: 5px;
		height: 24px;
		line-height: 24px;
		font-size: 12px;
		margin-top: 6px;
		background: #EF8920;
		color: #fff;
		box-shadow: 0px 2px 2px #c8c8c8;
		margin-left: 10px;
	}
</style>