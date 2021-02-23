<template>
	<div  class="main conMain">
		<div  class="mainTop">


			<Row type="flex" justify="start" class="code-row-bg">
				<Col span="4">
				<legend class="conLabel">流转类型:</legend>
				<Select v-model="flowType" style="width:160px" clearable  @on-change='flowTypeChange'>
					<Option v-for="item in circulationTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
				</Col>
				<Col span="4">
				<legend class="conLabel">电子标签编码:</legend>
				<Input v-model="bottleTag" class="conInput" @on-keyup="bottleTag=bottleTag.replace(/\s+/g,'')"/>
				</Col>
				<Col span="4">
				<legend class="conLabel">&nbsp;钢瓶条码:</legend>
				<Input v-model="bottleCode" class="conInput" @on-keyup="bottleCode=bottleCode.replace(/\s+/g,'')"/>
				</Col>
				<!--<Col span="4">
				<legend class="conLabel">是否满瓶:</legend>
				<Select v-model="bottleIsFull" style="width:160px" clearable>
					<Option v-for="item in isFullList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
				</Col>-->
				<Col span="4" >
				<legend class="conLabel">&nbsp;当前责任人:</legend>
				<Input v-model="personLiableName" class="conInput" @on-keyup="personLiableName=personLiableName.replace(/\s+/g,'')"/>
				</Col>
				<Col span="4">
				<legend class="conLabel">&nbsp;</legend>
				<Button type="primary"  style="text-align: right;"  @click="searchClick()">查询</Button>
				</Col>
			</Row>

		</div>
		<!--<div class='defaultInfo' v-show='defaultInfo'>仅展示近三天的记录，更多记录可通过选择时间查找。</div>-->
		<div class="mainContent">
			<Table  border ref="selection" :columns="columns" :data="dataList" :loading="loading" highlight-row :height='tableHeight'></Table>
			<Page class='pageBox' :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total size="small" @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>

	</div>
</template>
<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	import Bus from '@/public/bus';

	export default {
		name: 'cylinderCirculation',
			components: {
			cylInfo,

		},

		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				perShow:false,
				loading:false,

				langs:'',
				lats:'',
				addressInfo:false,
				tags:'',
				infoSee: false,
				defaultInfo: true,
				personLiableName: '',
				flowType: '',
				bottleTag: '',
				bottleCode: '',
				address: '',
				bottleIsFull: '',
				carNumber: '',
				pageTotal: 0,
				pageNum: 1,
				pageSize: 10,
				startTime: '',
				endTime: '',
				circulationTypeList: [{
						value: '1',
						label: '在库'
					},
					{
						value: '2',
						label: '在途'
					},
					{
						value: '3',
						label: '在用'
					},
//					{
//						value: '4',
//						label: '空瓶在途'
//					},
//					{
//						value: '5',
//						label: '空瓶在库'
//					}
				],
				isFullList: [{
						value: '0',
						label: '空瓶'
					},
					{
						value: '1',
						label: '满瓶'
					}
				],
				columns: [
					{
						title: '当前责任人',
						key: 'bottlePersonLiableName',
						align: 'center'
					},
					{
						title: '流转类型',
						key: 'flowType',
						align: 'center'
					},
					{
						title: '电子标签编码',
						key: 'bottleNfcId',
						align: 'center',
						render: (h, params) => {
							let that=this
							return h('span', {
								style: {
									color: '#EE6515',
									cursor: 'pointer'
								},
								on:{
									click(){
										that.infoSee=true
										that.tags=params.row.bottleNfcId
									}
								}
							}, params.row.bottleNfcId);
						},

					},
					{
						title: '钢瓶条码',
						key: 'bottleCode',
						align: 'center',
						render: (h, params) => {
							let that=this
							return h('span', {
								style: {
									color: '#1BA060',
									cursor: 'pointer'
								},
									on:{
									click(){
//										if(params.row.bottleNfcId){
//										that.infoSee=true
//										that.tags=params.row.bottleNfcId
//										}else{
										that.infoSee=true
										that.tags=params.row.bottleCode
//										}


									}
								}
							}, params.row.bottleCode);
						},

					},




//					{
//						title: '是否满瓶',
//						key: 'bottleIsFull',
//						width: 100,
//						align: 'center'
//					},
					{
						title: '时间',
						key: 'bottleFlowTime',
						align: 'center'
					},

				],
				dataList: []
			}
		},
		methods: {
			flowTypeChange(v){
				if(v){
					this.perShow=true;
				}else{
					this.perShow=false;
				}

			},
		//点击新增
			addClick(){
				this.$router.push('/cylinderCirculation/addCirculate')
			},

		//查看钢瓶详情
			handleSee(data){
				this.infoSee = data
			},
		//改变页数
			handlePage(value) {
				this.pageNum = value;
				this.loading=true
				this.getMessage();
			},
		//改变内容条数
			handlePageSize(value) {
				this.pageSize = value;
				this.loading=true
				this.getMessage();
			},
		//点击查询
			searchClick() {
				this.pageNum = 1;
				this.loading=true
				this.getMessage();
			},
		//改变时间
			timeChange(v) {
				this.defaultInfo = false;
				this.startTime = v[0];
				this.endTime = v[1];
			},
		//获取流转列表
			getMessage() {
				this.loading=true
				_http.http1("post", pathUrls.bottleflowinfoList, {
					page: this.pageNum,
					limit: this.pageSize,
					bottleCode: this.bottleCode,
					bottleTag: this.bottleTag,
					personLiableName: this.personLiableName,
					flowType: this.flowType,
					bottleIsFull: this.bottleIsFull,
				}, 'form').then((res) => {
					this.loading=false
//					console.log(res);
					this.dataList = res.data;
					this.pageTotal = res.count;
					if(this.dataList.length > 10) {
              this.tableHeight=this.screeHeight-220;
					} else {
              this.tableHeight='auto';
					}
					for(let item of this.dataList) {
						if(item.bottleFlowInformation == 1) {
							item.flowType = '在库';
						} else if(item.bottleFlowInformation == 2) {
							item.flowType = '在途';
						} else if(item.bottleFlowInformation == 3) {
							item.flowType = '在用';
						} else if(item.bottleFlowInformation == 4) {
							item.flowType = '在途';
						} else if(item.bottleFlowInformation == 5) {
							item.flowType = '在库';
						}
						item.bottleIsFull = item.bottleIsFull == 1 ? '满瓶' : '空瓶';
						item.carType = require('../../../../src/assets/images/ad.png');
					}
				})
			}
		},
		mounted() {
			   this.getMessage();
		}
	}
</script>
<style type="text/css" scoped>
	.main {
		background-color: #FFFFFF;
		padding: 10px 10px;
		margin-right: 10px;
		min-height: calc( 100% - 10px );
	}

	.cc {
		color: #DB4912;
	}

	.mainTop {
		text-align: left;
		margin-bottom: 10px;
		/* border-bottom: 1px solid #e5e5e5; */
	}

	.conInput {
		width: 160px;
	}

	.conLabel {
		font-size: 14px;
		color: #515a6e;
		vertical-align: middle;
		/*line-height: 10px;*/
		padding: 10px 0 0;
	}

	.defaultInfo {
		width: 300px;
		text-align: left;
		padding-left: 5px;
		height: 24px;
		line-height: 24px;
		font-size: 12px;
		margin: 0 0 6px 0;
		background: #EF8920;
		color: #fff;
		box-shadow: 0px 2px 2px #c8c8c8;

	}
	.main>>>.ivu-table th {
	background: #E2EEFF;
	color: #51B5EA;
}
	.main>>>.ivu-page{
		text-align: left;
	}
	.pageBox{
	margin-top: 10px;
	}
</style>
