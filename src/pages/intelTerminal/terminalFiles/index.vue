<template>
	<div class="main conMain">
		<div class='mainTop'>
			<Form :model="formSearch" inline :label-width="70">
				<FormItem label="所属组织">
					<Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format" style="width:186px"></Cascader>
				</FormItem>
				<FormItem label="终端编码">
					<Input v-model="formSearch.terminalCode" placeholder="请输入终端编码"></Input>
				</FormItem>
				<FormItem label="终端型号">
					<Input v-model="formSearch.terminalModel" placeholder="请输入终端型号"></Input>
				</FormItem>

				<FormItem label="终端类型">
					<!--<Input v-model="formSearch.terminalType" placeholder="请选择终端类型"></Input>-->
					<Select v-model="formSearch.terminalType" style="width:186px" clearable placeholder="请选择终端类型">
						<Option v-for="item in terminalList" :value="item.typeId" :key="item.typeId">{{item.typeName}}</Option>
					</Select>
				</FormItem>

				<FormItem label="车牌号">
					<Input v-model="formSearch.carNum" placeholder="请输入车牌号"></Input>
				</FormItem>
				<FormItem label="配送员工号" class='staffNum'>
					<Input v-model="formSearch.staffNum" placeholder="请输入配送员工号"></Input>
				</FormItem>

			</form>
			<div class="btnWrapper">
				<Button type="info" @click='handleAnalysis' style="margin-right: 30px;" v-has='1005'>设备上报分析</Button>
				<Button type="warning" @click='handleFileEdit' style="margin-right: 30px;" v-has='784'>批量修改</Button>
				<Button type="success" @click='handleAdd' style="margin-right: 30px;" v-has='782'>新增</Button>
				<Button type="primary" @click='handleSearch'>查询</Button>
			</div>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight' @on-select="handleSelectRow" @on-select-cancel="handleCancelRow" @on-select-all="handleSelectAll" @on-select-all-cancel="handleSelectAll" ref="purchaseTables">
				<template slot-scope="{ row, index }" slot="action">
					<Button type="success" size="small" style="margin-right: 5px" @click="handleReport(row.terminalId)" v-has='1023'>上报</Button>
					<Button type="primary" size="small" style="margin-right: 5px" @click='handleUserCase(row.terminalId)' v-has='1024'>使用情况</Button>
					<!-- <Button type="warning" size="small" style="margin-right: 5px" @click='handleInstruct(row.terminalId)'>下发</Button> -->
					<Button type="info" size="small" style="margin-right: 5px" @click="handleEdit(row.terminalId)" v-has='784'>编辑</Button>
					<Button type="error" size="small" @click="handleDelete(row.terminalId)" v-has='783'>删除</Button>
				</template>
			</Table>
			<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
				<div style="line-height: 26px;margin-left: 20px;color: #0014ff;" v-if='selectedSum'>已选中<span style="color: #FF0000;font-weight: 600;">{{selectedSum}}</span>项</div>
			</div>
		</div>
		<terminalReport v-if='closeReport' @closeReport='closeReportMethod' :terId='terId'></terminalReport>
		<terminalUserCase v-if='closeUserCase' @closeUserCase='closeUserCaseMethod' :terId='terId'></terminalUserCase>
		<instructionIssue v-if='closeInstruct' @closeInstruct='closeInstructMethod' :terId='terId'></instructionIssue>
		<filUpdate v-if='closeFil' @closeFil='closeFilMethod' :terArray='newSelectData'></filUpdate>
		<reportAnalysis v-if='closeAnalysis' @closeAnalysis='closeAnalysisMethod'></reportAnalysis>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import terminalReport from './components/terminalReport';
	import terminalUserCase from './components/terminalUserCase';
	import instructionIssue from './components/instructionIssue';
	import filUpdate from './components/filUpdate';
	import reportAnalysis from './components/reportAnalysis';
	export default {
		name: 'terminalFiles',
		components: {
			terminalReport,
			terminalUserCase,
			instructionIssue,
			reportAnalysis,
			filUpdate
		},
		data() {
			return {
				closeAnalysis: false,
				closeFil: false,
				selectedIds: new Set(), //选中的合并项的id
				selectedSum: 0, //选中的总数量
				newSelectData: [],
				closeInstruct: false,
				closeUserCase: false,
				terId: '',
				closeReport: false,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				count: 0,
				curpage: 1,
				pagesSize: 10,
				dataList: [],
				loading: false,
				options: [],
				terminalList: [],
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch: {
					terminalModel: '',
					organize: '',
					terminalType: '',
					terminalCode: '',
					staffNum: '',
					carNum: ''

				},
				columns: [{
						type: 'selection',
						width: 60,
						align: 'center',
						fixed: 'left'

					},
					{
						title: '序号',
						//						type: 'index',
						key: 'newIndex',
						width: 100,
						align: 'center',
						fixed: 'left'
					},
					{
						title: '所属组织',
						key: 'terminalDeptName',
						minWidth: 350,
						align: 'center',
					},
					{
						title: '终端编码',
						key: 'terminalCode',
						minWidth: 170,
						align: 'center',
					},
					{
						title: '终端型号',
						key: 'terminalModel',
						minWidth: 170,
						align: 'center',
					}, {
						title: '终端类型',
						key: 'newTerType',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '关联车牌号',
						key: 'terminalCarNumber',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '配送员工号',
						key: 'terminalUserCode',
						minWidth: 140,
						align: 'center',
					},

					{
						title: '责任人',
						key: 'terminalUserName',
						minWidth: 170,
						align: 'center',
					},

					{
						title: '创建时间',
						key: 'terminalCreateTime',
						minWidth: 180,
						align: 'center',
					},
					{
						title: '修改时间',
						key: 'terminalUpdateTime',
						minWidth: 180,
						align: 'center',
					}, {
						title: '当前运行状态',
						key: 'newWorkStatus',
						minWidth: 130,
						align: 'center',
					},
					{
						title: '读取状态',
						key: 'newTerminalReadStatus',
						minWidth: 180,
						align: 'center',
					},
					{
						title: '操作',
						slot: 'action',
						fixed: 'right',
						width: 270,
						align: 'center'
					}
				]
			}
		},
		methods: {
			//设备上报分析
			handleAnalysis() {
				this.closeAnalysis = true;
			},
			//关闭分析
			closeAnalysisMethod(data) {
				this.closeAnalysis = data;
			},

			//批量修改关闭
			closeFilMethod(data) {
				if(data == 1) {
					this.selectedIds = new Set(); //选中的合并项的id
					this.selectedSum = 0; //选中的总数量
					this.newSelectData = [];
					this.getTerminalList();
				}
				this.closeFil = false;
			},
			// cy 全选和取消全选时触发
			handleSelectAll(selection) {
				// 取消全选 数组为空
				if(selection.length === 0) {
					// cy 若取消全选，删除保存在selectedIds里和当前table数据的id一致的数据，达到，当前页取消全选的效果
					// 当前页的table数据
					let data = this.$refs.purchaseTables.data

					data.forEach((item) => {
						if(this.selectedIds.has(item.terminalId)) {
							this.selectedIds.delete(item.terminalId)
						}
					})
				} else {
					selection.forEach(item => {
						this.selectedIds.add(item.terminalId)
					})
				}
				//同步
				this.selectedSum = this.selectedIds.size
				// console.log(this.selectedIds)
			},

			//  选中某一行
			handleSelectRow(selection, row) {
				this.selectedIds.add(row.terminalId)
				this.selectedSum = this.selectedIds.size
			},
			//  取消某一行
			handleCancelRow(selection, row) {
				this.selectedIds.delete(row.terminalId)
				this.selectedSum = this.selectedIds.size
			},
			setChecked() {
				// 找到绑定的table的ref对应的dom，找到table的objData对象，objData保存的是当前页的数据
				let objData = this.$refs.purchaseTables.objData
				// console.log(objData)
				for(let index in objData) {
					// cy 设置审批状态为拒绝的采购单的默认勾选状态为 禁止
					// if (objData[index].bottleCode === '3057333334') {
					//   objData[index]._isDisabled = true
					// }
					if(this.selectedIds.has(objData[index].terminalId)) {
						// console.log(index,objData[index].bottleCode)

						// cy 弊端 每次切换select都会触发table的on-select事件
						// this.$refs.purchaseTables.toggleSelect(index) // 在保存选中的ids的set合集里找与当前页数据id一样的行，使用toggleSelect（index），将这一行选中
						// cy 改进
						objData[index]._isChecked = true

					}
				}
			},
			//删除
			handleDelete(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.deptterminalDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getTerminalList()
									})
								});

							}

						})
					},

				});
			},
			//打开下发
			handleInstruct(id) {
				this.terId = id;
				this.closeInstruct = true;
			},
			//关闭下发
			closeInstructMethod(data) {
				this.closeInstruct = data;
			},
			//打开上报页
			handleUserCase(id) {
				this.terId = id;
				this.closeUserCase = true;
			},
			//关闭使用情况
			closeUserCaseMethod(data) {
				this.closeUserCase = data;
			},
			//打开上报页
			handleReport(id) {

				this.terId = id;
				this.closeReport = true;

			},
			//关闭上报页面
			closeReportMethod(data) {
				this.closeReport = data;
			},
			//编辑
			handleEdit(id) {
				this.$router.push('/terminalFiles/terFileEdit/' + id);
			},
			//新增
			handleAdd() {
				this.$router.push('/terminalFiles/terFileAdd');
			},
			//获取终端类型列表
			getTerminalTypeList() {
				_http.http1('post', pathUrls.terminaltypeList, {
					'deptId': this.userData.deptId
				}, 'form').then((res) => {
					this.terminalList = res.data
				})
			},
			//获取终端档案列表
			getTerminalList() {
				this.loading = true

				_http.http1('post', pathUrls.terminalList, {
					'page': this.curpage,
					"limit": this.pagesSize,
					"terminalModel": this.formSearch.terminalModel, //终端型号
					"deptId": this.formSearch.organize, //所属组织
					"terminalType": this.formSearch.terminalType, //终端类型
					"terminalCode": this.formSearch.terminalCode, //终端编码
					"terminalCarNumber": this.formSearch.carNum, //车牌号
					"workCode": this.formSearch.staffNum, //配送员工号
				}, 'form').then((res) => {
					this.loading = false
					if(res.code == 0) {
						for(let [item, index] of new Map(res.data.map((item, i) => [item, i]))) {
							if(item.workStatus == 0) {
								item.newWorkStatus = '离线'
							} else {
								item.newWorkStatus = '在线'
							}
							if(item.terminalType == 4) {
								item.newTerType = '小黄车终端'
							} else if(item.terminalType == 5) {
								item.newTerType = '充装站终端'
							} else if(item.terminalType == 6) {
								item.newTerType = '危化车终端'
							}
							item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);
							item.newTerminalReadStatus=item.terminalReadStatus==0?'异常':'正常';
						}
						this.dataList = res.data;
						this.count = res.count;
						if(this.dataList.length > 10) {
							this.tableHeight = this.screeHeight - 280;
						} else {
							this.tableHeight = 'auto';
						}
						setTimeout(() => {
							this.setChecked()
						}, 50)
					}

				})
			},
			//批量修改
			handleFileEdit() {

				let newSelectedIds = [...this.selectedIds];

				this.newSelectData = newSelectedIds;
				if(!this.newSelectData.length) {
					this.$Message['warning']({
						background: true,
						content: '请先选择修改项!',
					});
				} else {
					this.closeFil = true;
				}

			},

			//查询
			handleSearch() {
				this.curpage = 1;
				this.selectedIds = new Set(); //选中的合并项的id
				this.selectedSum = 0; //选中的总数量
				this.newSelectData = [];
				this.getTerminalList()
			},
			//改变页数
			pageChange(current) {
				this.curpage = current
				this.getTerminalList()

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getTerminalList()
			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				//				console.log(labels, selectedData)
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			changeCascader(value, selectedData) {
				this.formSearch.organize = ''

				if(value.length) {
					this.formSearch.organize = value[value.length - 1]
				} else {
					this.formSearch.organize = ''
				}

			},

		},
		activated() {
			this.getTerminalList()
		},
		mounted() {
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.getTerminalTypeList()

		}
	}
</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		background: #FFFFFF;
		min-height: calc(100% - 10px);
		position: relative;
	}
	
	.mainTop {
		padding: 10px;
		width: 100%;
		text-align: left;
	}
	
	.mainTop>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	
	.staffNum>>>label {
		width: 82px!important;
	}
	
	.staffNum>>>.ivu-form-item-content {
		margin-left: 82px!important;
	}
	
	.btnWrapper {
		text-align: right;
		padding-right: 20px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 0px 10px 20px;
	}
	
	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
		display: flex;
	}
	
	.main>>>.ivu-table td {
		height: 44px;
	}
	
	.main>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	
	.mainTop>>>.ivu-cascader .ivu-cascader-menu {
		background: #fff!important;
	}
</style>