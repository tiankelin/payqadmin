<template>
	<div class="main conMain">
		<div class="mainTop">
			<Form inline :label-width="96">
				<FormItem label="充装单位名称">
					<Select v-model='organize' filterable clearable style='width: 220px;' class='organizeStyle'>
						<Option v-for='item in fillList' :key='item.deptId' :value='item.deptId' :title='item.name'>{{item.name}}</Option>
					</Select>
				</FormItem>
				<FormItem label="电子标签编码">
					<Input v-model="bottleTag" class="conInput" @on-keyup="bottleTag=bottleTag.replace(/\s+/g,'')" />
				</FormItem>
				<FormItem label="钢瓶条码">
					<Input v-model="barcode" class="conInput" @on-keyup="barcode=barcode.replace(/\s+/g,'')" />
				</FormItem>
				<FormItem label="钢瓶规格">
					<Select clearable style='width: 170px;' v-model='bottleSpec'>
						<Option v-for='item in specList' :key='item' :value='item'>{{item}}</Option>
						<!--<Option value='YSP35.5'>YSP35.5</Option>
						<Option value='YSP118'>YSP118</Option>
						<Option value='YSP118-2'>YSP118-2</Option>-->
					</Select>
				</FormItem>
				<FormItem label="操作工姓名">
					<Input v-model="operatorName" class="conInput" @on-keyup="operatorName=operatorName.replace(/\s+/g,'')" />
				</FormItem>

				<FormItem label="工号" v-if='organize'>
					<Input v-model="operatorCode" class="conInput" @on-keyup="operatorCode=operatorCode.replace(/\s+/g,'')" />
				</FormItem>
				<FormItem label="秤号" v-if='organize'>
					<Input v-model="scaleNumber" class="conInput" @on-keyup="scaleNumber=scaleNumber.replace(/\s+/g,'')" />
				</FormItem>
				<FormItem label="充装模式">
					<Select clearable style='width: 170px;' v-model='fillMode'>
						<Option value='总量'>总量</Option>
						<Option value='补气'>补气</Option>
					</Select>
				</FormItem>
				<FormItem label="停装模式">
					<Select clearable style='width: 170px;' v-model='stopFillMode'>
						<Option value='自动'>自动</Option>
						<Option value='未扫码押阀'>未扫码押阀</Option>
						<Option value='人工取消'>人工取消</Option>
					</Select>
				</FormItem>
				<FormItem label="充装介质">
					<Select clearable style='width: 170px;' v-model='fillMedium'>
						<Option v-for='item in fillMediumList' :key='item.id' :value='item.name'>{{item.name}}</Option>
					</Select>
				</FormItem>
				<FormItem label="充装开始时间">
					<DatePicker style='width: 170px;' type="datetime" placeholder="充装开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss" @on-change='changeStartTime'></DatePicker>
				</FormItem>
				<FormItem label="充装结束时间">
					<DatePicker style='width: 170px;' type="datetime" placeholder="充装结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss" @on-change='changeEndTime'></DatePicker>
				</FormItem>
				<FormItem class='labelNone'>
					<Button type="primary" @click="searchClick()">查询</Button>
				</FormItem>

			</Form>
		</div>
		<div class='defaultInfo' v-show='defaultInfo'>仅展示近三天的记录，更多记录可通过选择时间查找。</div>
		<div style="margin-top: 10px;" class="mainContent">
			<Table border ref="selection" :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'></Table>
			<Page :page-size-opts='sizeOpts' class='pageBox' size='small' :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total placement="top" @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
	</div>
</template>
<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default {
		name: 'fillRecord',
		components: {
			cylInfo,
		},
		data() {
			return {
				fillMediumList: [],
				specList: [],
				bottleSpec: '',
				fillMedium: '',
				stopFillMode: '',
				fillMode: '',
				operatorCode: '',
				scaleNumber: '',
				fillList: [],
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				dateTime: [],
				sizeOpts: [10, 20, 50, 100, 200],
				tags: '',
				infoSee: false,
				loading: false,
				organize: '',
				bottleTag: '',
				barcode: '',
				pageTotal: 0,
				pageNum: 1,
				pageSize: 10,
				operatorName: '',
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				columns: [{
						title: '序号',
						//						type: 'index',
						width: 100,
						align: 'center',
						key: 'newIndex',
						fixed: 'left'
					},
					{
						title: '充装单位代码',
						key: 'stationCode',
						minWidth: 140,
						align: 'center'
					},
					{
						title: '充装单位名称',
						key: 'stationName',
						minWidth: 350,
						align: 'center'
					},

					{
						title: '电子标签编码',
						key: 'bottleTag',
						align: 'center',
						minWidth: 150,
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
										that.tags = params.row.bottleTag
										//										console.log(that.tags)
									}
								}
							}, params.row.bottleTag);
						},

					},
					{
						title: '钢瓶条码',
						key: 'barcode',
						tooltip: true,
						align: 'center',
						minWidth: 150,
						render: (h, params) => {
							let that = this
							return h('span', {
								style: {
									color: '#1BA060',
									cursor: 'pointer'
								},
								on: {
									click() {
										if(params.row.bottleTag) {
											that.infoSee = true
											that.tags = params.row.bottleTag
										} else {
											that.infoSee = true
											that.tags = params.row.barcode
										}

									}
								}
							}, params.row.barcode);
						},

					},
					{
						title: '钢瓶规格',
						key: 'spec',
						minWidth: 120,
						align: 'center'
					},
					{
						title: '秤号',
						key: 'scaleNumber',
						minWidth: 70,
						align: 'center'
					},
					{
						title: '充装开始时间',
						key: 'beginTime',
						minWidth: 180,
						align: 'center',

					},
					{
						title: '充装结束时间',
						key: 'endTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '工号',
						key: 'operatorCode',
						minWidth: 140,
						align: 'center'
					},
					{
						title: '操作工姓名',
						key: 'operatorName',
						// fixed:'right',
						minWidth: 140,
						align: 'center'
					},
					{
						title: '实际同步时间',
						key: 'createTime',
						minWidth: 180,
						align: 'center',
					},
					{
						title: '充装介质',
						key: 'fillMedium',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '实际充装量',
						key: 'realFill',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '停装模式',
						key: 'stopFillMode',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '充装模式',
						key: 'fillMode',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '设定量',
						key: 'setCapacity',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '充前量',
						key: 'beforeFill',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '充后量',
						key: 'afterFill',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '溢出量',
						key: 'overflow',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '异常类型',
						key: 'errorTypeName',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '是否正常',
						key: 'newErrorResult',
						minWidth: 120,
						align: 'center',
						fixed:'right'
					},
					// {
					// 	title: '数据来源',
					// 	key: 'newDataSource',
					// 	minWidth: 140,
					// 	align: 'center',
					// },
				],
				dataList: [],
				startTime: '',
				endTime: '',
				defaultInfo: true,
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
			//查看钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},
			//递归数据
			getTitle(menus) {
				return menus.map((menu) => {
					if(menu.children.length > 0) {
						this.getTitle(menu.children);
					}
					if(menu.type == 2) {
						this.fillList.push(menu);
					}
					menu.value = menu.deptId;
					menu.label = menu.name;
					return menu;
				})
			},

			changeCascader(value, selectedData) {
				if(value.length) {
					this.organize = value[value.length - 1]
				} else {
					this.organize = ''
				}

			},
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},

			searchClick() {
				this.loading = true;
				this.pageNum = 1;
				this.getMessage();
			},
			timeStart(v) {
				//				console.log(v);
			},
			timeEnd(v) {
				//				console.log(v)
			},
			handlePage(value) {
				this.loading = true;
				this.pageNum = value;
				this.getMessage();
			},
			handlePageSize(value) {
				this.loading = true;
				this.pageSize = value;
				this.getMessage();
			},
			getMessage() {
				this.loading = true;
				this.dataList = [];
				this.pageTotal = 0;
				_http.http1("post", pathUrls.xkfillinfo, {
					page: this.pageNum,
					limit: this.pageSize,
					deptId: this.organize,
					startTime: this.startTime ? (this.common.conformatDat(this.startTime, true)) : '',
					endTime: this.endTime ? (this.common.conformatDat(this.endTime, true)) : '',
					rfId: this.bottleTag,
					operatorName: this.operatorName,
					barcode: this.barcode,
					bottleSpec: this.bottleSpec,
					fillMedium: this.fillMedium,
					stopFillMode: this.stopFillMode,
					fillMode: this.fillMode,
					operatorCode: this.operatorCode,
					scaleNumber: this.scaleNumber,
				}, 'form').then((res) => {
					this.loading = false;
					this.dataList = res.data;
					this.pageTotal = res.count;
					this.dataList.forEach((item, index) => {
						item.fillMedium = item.fillMedium ? item.fillMedium : '液化石油气';
						item.stopFillMode = item.stopFillMode ? item.stopFillMode : '自动';
						item.overflow = item.overflow ? item.overflow : '0.10';
						item.fillMode = item.fillMode ? item.fillMode : '总量';
						item.newErrorResult=item.errorResult?'正常':'异常';
						if(!item.operatorName && item.stationCode == '33010901175' && Number(item.scaleNumber) < 8 && Number(item.scaleNumber) > 0) {
							switch(Number(item.operatorCode)) {
								case 1:
									item.operatorName = "李天坤";
									break;
								case 2:
									item.operatorName = "郑书龙";
									break;
								case 3:
									item.operatorName = "葛志勇";
									break;
								case 4:
									item.operatorName = "王岳峰";
									break;
								case 5:
									item.operatorName = "王炳印";
									break;
								case 6:
									item.operatorName = "潘书庆";
									break;
								case 7:
									item.operatorName = "张永皇";
									break;
								case 8:
									item.operatorName = "徐增礼";
									break;
								case 9:
									item.operatorName = "戴银军";
									break;
								case 10:
									item.operatorName = "何金凤";
									break;
								case 11:
									item.operatorName = "曹立军";
									break;
							}
						}
						item.newIndex = (this.pageNum - 1) * this.pageSize + (index + 1);
						if(item.dataSource == 1) {
							item.newDataSource = '数据同步';
						} else if(item.dataSource == 2) {
							item.newDataSource = '本地上报';
						} else if(item.dataSource == 3) {
							item.newDataSource = '设备上报';
						}

					})
					if(this.dataList.length > 10) {
						this.tableHeight = this.screeHeight - 340;
					} else {
						this.tableHeight = 'auto';
					}
				}).catch(()=>{
					this.loading = false;
				})
			}

		},
		mounted() {
      this.startTime=this.common.getDayDate(2,false)+' '+'00:00:00';
      this.endTime=this.common.getDayDate(0,false)+' '+'23:59:59';
			this.common.getBottleSpecList().then(res => {
				this.specList = res.data;
			})
			this.common.getBottleMediumList().then(res => {
				this.fillMediumList = res.data;
			})
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.getTitle(res.data)
			})
			this.getMessage();
		}
	}
</script>
<style type="text/css" scoped>
	.main {
		background-color: #FFFFFF;
		padding: 10px;
		margin-right: 10px;
		min-height: calc( 100% - 10px);
	}

	.mainTop>>>.ivu-form-item {
		margin-bottom: 8px;
	}

	.conInput {
		width: 170px;
	}

	.conLabel {
		font-size: 14px;
		color: #515a6e;
		vertical-align: middle;
		/*line-height: 10px;*/
		padding: 10px 0 0;
	}

	.mainTop {
		text-align: left;
		/* border-bottom: 1px solid #e5e5e5; */
	}

	.main>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
		border-color: #f3f3f3;
		padding: 5px 0;
	}

	.defaultInfo {
		width: 300px;
		text-align: left;
		padding-left: 5px;
		height: 24px;
		line-height: 24px;
		font-size: 12px;
		margin-top: 6px;
		background: #EF8920;
		color: #fff;
		box-shadow: 0px 2px 2px #c8c8c8;
	}

	.main>>>.ivu-page {
		text-align: left;
	}

	.pageBox {
		margin-top: 10px;
	}

	.main>>>.ivu-cascader .ivu-cascader-menu {
		background: #fff!important;
	}

	.organizeStyle>>>.ivu-select-dropdown {
		width: 203px;
	}

	.organizeStyle>>>.ivu-select-item {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.labelNone>>>.ivu-form-item-label {
		width: 20px!important;
	}

	.labelNone>>>.ivu-form-item-content {
		margin-left: 20px!important;
	}
</style>
