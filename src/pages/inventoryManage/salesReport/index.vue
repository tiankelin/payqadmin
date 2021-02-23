<template>
	<div class="main conMain">
		<div class='mainTop conMainTop'>
			<Form inline :label-width="70">
				<div>
					<FormItem label="区域">
						<!--<Cascader :data="options" placeholder="区域" style='width: 300px;' clearable change-on-select @on-change='changeCascader' :render-format="format"></Cascader>-->
						<el-cascader collapse-tags :show-all-levels="false" style='width: 280px;' :options="options" :props="{expandTrigger:'hover',multiple: true,checkStrictly: true }" clearable @change='changeCascader' placeholder="区域"></el-cascader>
					</FormItem>
					<FormItem label="配送员">
						<Select v-model="staffIds" filterable style="width:280px;" clearable placeholder="配送员" multiple :max-tag-count='1'>
							<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
						</Select>
					</FormItem>
				</div>

				<FormItem label="开始时间">
					<DatePicker style='width: 280px;' type="date" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd" @on-change='changeStartTime'></DatePicker>
				</FormItem>
				<FormItem label="结束时间">
					<DatePicker style='width:280px;' type="date" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd" @on-change='changeEndTime'></DatePicker>
				</FormItem>
				<FormItem class='formButton'>
					<Button type="primary" @click="handleSearch">查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent conMainContent">
			<div class="topLabel">
				<div><span class="itemLabel">营业额</span><span class="itemNum">{{turnover}}</span><span>元</span></div>
				<div><span class="itemLabel">实收</span><span class="itemNum">{{income}}</span><span>元</span></div>
				<div><span class="itemLabel">签单</span><span class="itemNum">{{sign}}</span><span>元</span></div>
			</div>
			<div style="display: flex;width: 100%;">
				<div class="leftLabel">库存</div>
				<div style="width: calc(100% - 100px );">
					<Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>

					</Table>

				</div>
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
				income:0,
				sign:0,
				turnover:0,
				deptIds:[],
				endTime: '',
				startTime: '',
				staffNameList: [],
				options: [],
				staffIds:[],
				screeHeight: document.documentElement.clientHeight, // 屏幕高				
				loading: false,
				tableHeight: 'auto',
				dataList: [{
						goodsName: '14.5型普通气',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 5,
						stock: 0
					},
					{
						goodsName: '14.5型进口气',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
					{
						goodsName: '50型普通气',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 5,
						stock: 0
					},
					{
						goodsName: '50型普通气（两相）',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 5,
						stock: 0
					},
					{
						goodsName: '50型进口气',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
					{
						goodsName: '50型进口气（两相）',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
					{
						goodsName: '15KG丙烷',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
					{
						goodsName: '钢瓶（小瓶）',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
					{
						goodsName: '钢瓶（大瓶）',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
					{
						goodsName: '钢瓶（两相）',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 5,
						stock: 0
					},
					{
						goodsName: '民用胶管',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
					{
						goodsName: '金属波纹管',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
					{
						goodsName: '小流量低压阀',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
					{
						goodsName: '大流量低压阀',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
					{
						goodsName: '大流量中压阀',
						wareHousing: 10,
						salesVolumes: 5,
						returns: 0,
						stock: 0
					},
				],
				userData: (JSON.parse(this.$store.state.userData)),
				columns: [{
					title: '商品品名 ',
					key: 'goodsName',
					minWidth: 130,
					align: 'center'
				}, {
					title: '入库 ',
					key: 'inventory',
					
					align: 'center'
				}, {
					title: '出库 ',

					
					align: 'center',
					children: [{
						title: '销售数量 ',
						key: 'salesCount',
						align: 'center'
					}, {
						title: '退回 ',
						key: 'returnedCount',
						align: 'center'
					}]
				}, {
					title: '库存 ',
					key: 'reserve',
					
					align: 'center'
				}]
			}
		},
		methods: {
			handleSearch() {
			this.getReportList()
			},
			getReportList(){
				this.loading=true;
				_http.http2("post", pathUrls.accountingStatistics, {
					staffIds:this.staffIds,
					deptIds:this.deptIds,
					startTime:this.startTime?this.common.conformatDat(this.startTime):'',
					endTime:this.endTime?this.common.conformatDat(this.endTime):''
				}).then(res=>{
					this.loading=false;
					if(res.data&&res.data.goods){
						for(let item of res.data.goods){
							item.returnedCount=item.outOfStock.returnedCount;
							item.salesCount=item.outOfStock.salesCount;
						}
						this.dataList=res.data.goods;
						this.turnover=res.data.turnover;
						this.income=res.data.income;
						this.sign=res.data.sign;
					}
					
				}).catch(()=>{
					this.loading=false;
				})
			},
			//改变组织
			changeCascader(value) {
				let depts = [];
				if(value.length) {
					for(let item of value) {
						let id = item[item.length - 1];
						depts.push(id)
						
					}
					this.deptIds=depts;
				} else {
					depts = [this.userData.deptId];
					this.deptIds=[];
				}
				
				this.common.getStaffQueryByAuth(depts).then(res => {
					this.staffNameList = res.data
				})
			},

		},
		activated() {

		},
		mounted() {
			let dateTime=this.common.getStartEndTime();
			this.startTime=dateTime[0];
			this.endTime=dateTime[1];
			this.getReportList()
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data, 0, 0, 1)
			})
			this.common.getQueryStaffList(this.userData.deptId).then((res) => {
				this.staffNameList = res.data
			})
			this.tableHeight = this.screeHeight - 220;
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
		padding: 0 10px 20px;
	}
	
	.conWrapper>>>.ivu-form-item-content {
		margin-left: 10px !important;
	}
	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
		border-color: #d2d3d4;
		padding: 4px 0;
	}
	
	.mainContent>>>.ivu-table th:first-child {
		border-bottom: 0;
	}
	
	.mainContent>>>.ivu-table td {
		height: 40px;
	}
	
	.leftLabel {
		width: 100px;
		background: #E2EEFF;
		color: #51B5EA;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #d2d3d4;
		border-right: 0;
	}
	
	.topLabel {
		background: #E2EEFF;
		border: 1px solid #d2d3d4;
		border-bottom: 0;
		display: flex;
	}
	
	.topLabel div {
		flex: 1;
		height: 30px;
		line-height: 30px;
		border-right: 1px solid #d2d3d4;
		text-align: left;
		padding-left: 20px;
	}
	
	.itemLabel {
		font-weight: 600;
		color: #51B5EA;
	}
	
	.itemNum {
		margin: 0 10px 0 20px;
		font-weight: 600;
		font-style: italic;
	}
	
	.formButton {
		/*float: right;*/
	}
	
	.formButton>>>.ivu-form-item-content {
		margin-left: 50px!important;
	}
	
	.mainTop>>>.el-cascader {
		line-height: 32px;
	}
</style>