<template>
	<div class="main conMain">
		<div class='mainTop conMainTop'>
			<Form inline :label-width="100">
				<FormItem label="电子标签编码">
					<Input style='width: 150px;' placeholder="电子标签编码" v-model="bottleNfcId" @on-keyup="bottleNfcId=bottleNfcId.replace(/\s+/g,'')" />
				</FormItem>
				<FormItem label="钢瓶条码">
					<Input style='width: 150px;' placeholder="钢瓶条码" v-model="bottleCode" @on-keyup="bottleCode=bottleCode.replace(/\s+/g,'')" />
				</FormItem>
				<FormItem label="出厂编号">
					<Input style='width: 150px;' placeholder="出厂编号" v-model="bottleFactoryCode" @on-keyup="bottleFactoryCode=bottleFactoryCode.replace(/\s+/g,'')" />
				</FormItem>
				<FormItem label="钢瓶规格">
					<Select v-model="bottleSpecification" placeholder="钢瓶规格" style="width:150px" clearable>
						<Option v-for='item in specList' :key='item' :value='item'>{{item}}</Option>
						<!--<Option value="YSP35.5">YSP35.5</Option>
            <Option value="YSP118">YSP118</Option>
            <Option value="YSP118-2">YSP118-2</Option>-->
					</Select>
				</FormItem>
				<FormItem label="钢瓶检验状态">
					<Select v-model="bottleCheckStatus" placeholder="钢瓶检验状态" style="width:150px" clearable>
						<Option :value="3">检验合格</Option>
						<Option :value="5">检验不合格</Option>

					</Select>
				</FormItem>
				<FormItem label="收瓶人">
					<Input style='width: 150px;' placeholder="收瓶人" v-model="receiverName" @on-keyup="receiverName=receiverName.replace(/\s+/g,'')" />
				</FormItem>
				<FormItem label="收瓶站点">
					<Cascader :data="options" placeholder="收瓶站点" style='width: 150px;' clearable change-on-select @on-change='changeCascader' :render-format="format"></Cascader>
				</FormItem>

				<FormItem label="收瓶开始时间">
					<DatePicker style='width: 150px;' type="date" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd" @on-change='changeStartTime'></DatePicker>
				</FormItem>
				<FormItem label="收瓶结束时间">
					<DatePicker style='width: 150px;' type="date" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd" @on-change='changeEndTime'></DatePicker>
				</FormItem>

				<FormItem class='conWrapper'>
					<Button type="primary" @click='handleSearch'>查询</Button>
					<Button type="warning" @click='handleExport' style="margin:0 20px;" v-has='"inventoryList-export"'>批量导出</Button>
					<Button type="info" @click='handleSomeEdit' v-has='"inventoryList-batchUpdate"'>批量修改</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent conMainContent">
			<Table @on-select="handleSelectRow" @on-select-cancel="handleCancelRow" @on-select-all="handleSelectAll" @on-select-all-cancel="handleSelectAll" ref="purchaseTable" border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>
			</Table>
			<div class="pageMain conPageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
				<div style="line-height: 26px;margin-left: 20px;color: #0014ff;" v-if='selectedSum'>
					<span>已选中</span>
					<span style="color: #FF0000;font-weight: 600;">{{selectedSum}}</span>
					<span>项</span>
				</div>
			</div>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
		<batchUpdate v-if='batchShow' :selectIds='selectIds' @batch='batchMethod'></batchUpdate>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	import batchUpdate from './batchUpdate';
	export default {
		name: 'inventoryList',
		components: {
			cylInfo,
			batchUpdate
		},
		data() {
			return {
				specList: [],
				selectIds: [],
				batchShow: false,
				selectedSum: 0,
				selectedIds: new Set(), //选中的合并项的id
				bottleNfcId: '',
				bottleCode: '',
				bottleFactoryCode: '',
				bottleSpecification: '',
				bottleCheckStatus: '',
				receiverName: '',
				tags: '',
				infoSee: false,

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
				dataList: [],
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				columns: [{
						type: 'selection',
						width: 80,
						align: 'center',
						fixed: 'left'
					},
					{
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
						title: '钢瓶条码/企业自有编号',
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
						title: '钢瓶规格',
						key: 'bottleSpecification',
						minWidth: 120,
						align: 'center'
					},
					{
						title: '收瓶人',
						key: 'receiverName',
						minWidth: 150,
						align: 'center'
					},
					{
						title: '收瓶站点',
						key: 'receiverDeptName',
						minWidth: 350,
						align: 'center'
					}, {
						title: '收瓶时间',
						key: 'receiverTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '检验单位',
						key: 'checkDepartment',
						align: 'center',
						minWidth: 200,
					},

					// {
					// 	title: '运输车牌号',
					// 	key: 'transportCarNumber',
					// 	minWidth: 200,
					// 	align: 'center'
					// },
					// {
					// 	title: '运输司机',
					// 	key: 'transportStaffName',
					// 	minWidth: 200,
					// 	align: 'center'
					// },
					// {
					// 	title: '检验单位',
					// 	key: 'bottleActiveCount',
					// 	minWidth: 300,
					// 	align: 'center'
					// },
					// {
					// 	title: '检验状态',
					// 	key: 'checkStatus',
					// 	minWidth: 140,
					// 	align: 'center'
					// },
					{
						title: '末次检验时间',
						key: 'bottleLastCheckTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '下次检验时间',
						key: 'bottleNextCheckTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '制造单位',
						key: 'bottleMaufacturer',
						minWidth: 300,
						align: 'center'
					},

					{
						title: '制造年月',
						key: 'bottleFactoryTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '报废年月',
						key: 'scrapDate',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '外观是否合格',
						key: 'newBottleAppearnceIsNormal',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '瓶阀是否合格',
						key: 'newBottleValveIsNormal',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '钢瓶检验状态',
						key: 'newBottleCheckStatus',
						minWidth: 140,
						align: 'center'
					},
				]
			}
		},
		methods: {
			//导出
			handleExport() {
				//       	 ?deptId=${this.userData.deptId}
				let urlData = `deptId=${this.organize?this.organize:this.userData.deptId}&bottleNfcId=${this.bottleNfcId}&bottleCode=${this.bottleCode}&
				bottleFactoryCode=${this.bottleFactoryCode}&bottleSpecification=${this.bottleSpecification?this.bottleSpecification:''}&bottleCheckStatus=${this.bottleCheckStatus?this.bottleCheckStatus:''}&
				receiverName=${this.receiverName}&startTime=${this.startTime?(this.common.conformatDat(this.startTime)+' 00:00:00'):''}&
				endTime=${this.endTime?(this.common.conformatDat(this.endTime)+' 23:59:59'):''}`
				window.location.href = `${pathUrls.acceptancelogExportList}?${urlData}`;
			},
			//批量修改
			handleSomeEdit() {
				let newSelectedIds = [...this.selectedIds];
				this.selectIds = newSelectedIds;
				if(this.selectIds.length) {
					this.batchShow = true;
				} else {
					this.$Message['warning']({
						background: true,
						content: "请先选择修改项!"
					});
				}
			},
			batchMethod(data) {
				this.batchShow = false;
				if(data == 2) {
					this.getAcceptancelogList();
					this.selectedIds.clear();
					this.selectedSum = 0;
				}

			},
			// cy 全选和取消全选时触发
			handleSelectAll(selection) {
				// 取消全选 数组为空
				if(selection.length === 0) {
					// cy 若取消全选，删除保存在selectedIds里和当前table数据的id一致的数据，达到，当前页取消全选的效果
					// 当前页的table数据
					let data = this.$refs.purchaseTable.data

					data.forEach((item) => {
						if(this.selectedIds.has(item.id)) {
							this.selectedIds.delete(item.id)
						}
					})
				} else {
					selection.forEach(item => {
						this.selectedIds.add(item.id)
					})
				}
				//同步
				this.selectedSum = this.selectedIds.size
				// console.log(this.selectedIds)
			},

			//  选中某一行
			handleSelectRow(selection, row) {
				this.selectedIds.add(row.id)
				this.selectedSum = this.selectedIds.size
			},
			//  取消某一行
			handleCancelRow(selection, row) {
				this.selectedIds.delete(row.id)
				this.selectedSum = this.selectedIds.size
			},
			setChecked() {
				// 找到绑定的table的ref对应的dom，找到table的objData对象，objData保存的是当前页的数据
				let objData = this.$refs.purchaseTable.objData
				// console.log(objData)
				for(let index in objData) {
					// cy 设置审批状态为拒绝的采购单的默认勾选状态为 禁止
					// if (objData[index].bottleCode === '3057333334') {
					//   objData[index]._isDisabled = true
					// }
					if(this.selectedIds.has(objData[index].id)) {
						// console.log(index,objData[index].bottleCode)

						// cy 弊端 每次切换select都会触发table的on-select事件
						// this.$refs.purchaseTable.toggleSelect(index) // 在保存选中的ids的set合集里找与当前页数据id一样的行，使用toggleSelect（index），将这一行选中
						// cy 改进
						objData[index]._isChecked = true

					}
				}
			},
			updateMethods(data) {
				this.inspectShow = false;
				this.getExpiringSoonBottleList();
				this.selectedIds.clear();
				this.selectedSum = 0;
			},

			getAcceptancelogList() {
				this.loading = true;
				_http.http1("post", pathUrls.acceptancelogList, {
					page: this.curpage,
					limit: this.pagesSize,
					bottleNfcId: this.bottleNfcId,
					bottleCode: this.bottleCode,
					bottleFactoryCode: this.bottleFactoryCode,
					bottleSpecification: this.bottleSpecification,
					bottleCheckStatus: this.bottleCheckStatus,
					receiverName: this.receiverName,
					deptId: this.organize,
					startTime: this.startTime ? (this.common.conformatDat(this.startTime) + ' 00:00:00') : '',
					endTime: this.endTime ? (this.common.conformatDat(this.endTime) + ' 23:59:59') : '',

				}, 'form').then((res) => {
					this.loading = false;
					if(res.code == 0) {
						for(let item of res.data) {
							item.checkStatus = '已检';
							// item.newBottleCheckStatus=item.bottleCheckStatus==true?'检验合格':'检验不合格';
							if(item.bottleCheckStatus == 3) {
								item.newBottleCheckStatus = '检验合格';
							} else if(item.bottleCheckStatus == 5) {
								item.newBottleCheckStatus = '检验不合格';
							}
							item.newBottleAppearnceIsNormal = item.bottleAppearnceIsNormal == true ? '合格' : '不合格';
							item.newBottleValveIsNormal = item.bottleValveIsNormal == true ? '合格' : '不合格';
						}
						this.dataList = res.data;
						this.count = res.count;

						if(this.dataList.length > 10) {
							this.tableHeight = this.screeHeight - 280;
						} else {
							this.tableHeight = 'auto';
						}
					}
					setTimeout(() => {
						this.setChecked()
					}, 50)
				})
			},
			//关闭钢瓶详情
			handleSee(data) {
				this.infoSee = data
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
				this.curpage = current;
				this.getAcceptancelogList();

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.curpage = 1;
				this.getAcceptancelogList();

			},

			//查询
			handleSearch() {
				this.curpage = 1;
				this.getAcceptancelogList();
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
			this.getAcceptancelogList();
		},

		mounted() {
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.common.getBottleSpecList().then(res => {
				this.specList = res.data;
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
		margin-left: 10px !important;
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