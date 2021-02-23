<template>
	<div class='main conMain'>
		<div class="mainTop">
			<Form :model="formSearch" inline :label-width="70">
				<!--<FormItem label="所属组织">
					<Cascader :data="options" clearable v-model="formSearch.organize" change-on-select @on-change='changeCascader' :render-format="format" style="width:186px"></Cascader>
				</FormItem>-->
				<FormItem label="异常来源">
					<Select v-model="formSearch.errSource" style="width:186px" clearable>
						<Option :value="1">小黄车</Option>
						<Option :value="2">危化车</Option>
						<Option :value="3">充装站</Option>
						<Option :value="4">检测站</Option>
						<Option :value="5">库存门禁</Option>
						<Option :value="6">app</Option>
					</Select>
				</FormItem>

				<!--<FormItem label="异常等级">
					<Select v-model="formSearch.errLevel" style="width:186px" clearable>
						<Option :value="1">一级</Option>
						<Option :value="2">二级</Option>
						<Option :value="3">三级</Option>

					</Select>
				</FormItem>-->
				<FormItem>
					<Button type="primary" @click='handleSearch'>查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="tableData" :loading="loading" highlight-row :height='tableHeight'>

			</Table>
			<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
			</div>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
		<cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylMap from '@/pages/comComponent/cylMaps';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default {
		name: 'abnormalStatistics',
		components: {
			cylMap,
			cylInfo

		},
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				tags:'',
				infoSee: false,
				langs:'',
				lats:'',
				addressInfo:false,
				userData: (JSON.parse(this.$store.state.userData)),
				options:[],
				formSearch:{
					errSource:'',
					organize:''
				},
				sizeOpts: [10, 20, 50, 100, 200],
				pagesSize: 10,
				curpage: 1,
				count: 0,
				tableData: [{
					errSource: '小黄车'
				}],
				columns:[{
						title: '位置',
						key: 'carType',
						align: 'center',
						width: '75',
						fixed:'left',
						render: (h, params) => {
							let that=this
							return h('img', {
								attrs: {
									src: params.row.carType
								},
								style: {
									cursor:'pointer'
								},
										on:{
									click(){
										that.langs=params.row.errLng
										that.lats=params.row.errLat
										that.addressInfo=true
									}
								}
							}, params.row.carType);

						}

					},{
						title: '所属组织',
						key: 'orgName',
						width: 250,
						align: 'center'
				},{
						title: '异常来源',
						key: 'newErrSource',
						width: 120,
						align: 'center'
				},
//				{
//						title: '异常类型',
//						key: 'errType',
//						width: 120,
//						align: 'center'
//				},
//				{
//						title: '异常等级',
//						key: 'errLevel',
//						width: 120,
//						align: 'center'
//				},
				{
						title: '异常描述',
						key: 'errDesc',
						minWidth: 350,
						align: 'center'
				},
				{
						title: '电子标签编码',
						key: 'bottleTag',
						align: 'center',
						width:200,
						render: (h, params) => {
							let that=this
							return h('span', {
								style: {
									color: '#ee6515',
									cursor: 'pointer'
								},
									on:{
									click(){
										that.infoSee=true
										that.tags=params.row.bottleTag
									}
								}
							}, params.row.bottleTag);
						},
						},

					{
						title: '钢瓶条码',
						key: 'bottleCode',
						align: 'center',
						width:200,
						render: (h, params) => {
							let that=this
							return h('span', {
								style: {
									color: '#1BA060',
									cursor: 'pointer'
								},
									on:{
									click(){

										that.infoSee=true
										that.tags=params.row.bottleCode
									}
								}
							}, params.row.bottleCode);
						},

					},
				{
						title: '终端编号',
						key: 'terminalCode',
						width: 140,
						align: 'center'
				},{
						title: '载体名称',
						key: 'carrierName',
						width: 280,
						align: 'center'
				},{
						title: '员工姓名',
						key: 'staffName',
						width: 140,
						align: 'center'
				},{
						title: '异常原因',
						key: 'errReason',
						minWidth:350,
						align: 'center'
				},{
						title: '异常地点',
						key: 'errAddress',
						width: 350,
						align: 'center'
				},{
						title: '异常处理状态',
						key: 'newErrStatus',
						width: 150,
						align: 'center'
				},{
						title: '备注',
						key: 'remarks',
						width: 150,
						align: 'center'
				},{
						title: '创建时间',
						key: 'createTime',
						width: 170,
						align: 'center'
				}]

			}
		},
		methods: {
			//查看钢瓶详情
			handleSee(data){
				this.infoSee = data
			},
			//查看地图定位
			handleAdSee(data) {
				this.addressInfo = data
			},
			handleSearch(){
				this.curpage=1;
				this.getErrorList()
			},
		//获取异常统计数据
			getErrorList(){
				this.loading = true;
				this.tableData=[];
				_http.http3('get', pathUrls.errorinfoList, {
					'errSource':this.formSearch.errSource,
					'page': this.curpage,
					"limit": this.pagesSize,
					})
					.then((res)=> {
						this.loading = false;
						for(let item of res.data){
							if(item.errLng) {
								item.carType = require('../../../src/assets/images/ad.png');
							}
							else {
								item.carType = '';
							}
							switch(item.errSource) {
							case 1:
								item.newErrSource = "小黄车";
								break;
							case 2:
								item.newErrSource = "危化车";
								break;
							case 3:
								item.newErrSource = "充装站";
								break;

							case 4:
								item.newErrSource = "检测站";
								break;

							case 5:
								item.newErrSource = "库存门禁";
								break;

							case 6:
								item.newErrSource = "app";
								break;
							}
							if(item.errStatus==1){
								item.newErrStatus='待处理'
							}else if(item.errStatus==2){
								item.newErrStatus='系统处理'
							}else{
								item.newErrStatus='人工处理'
							}
						}
						this.tableData=res.data;
						this.count=res.count;
						if(this.tableData.length > 10) {
              this.tableHeight=this.screeHeight-200;
					} else {
						this.tableHeight ='auto';

					}
					})
			},
		//改变页数
			pageChange(current) {
				this.curpage = current
				this.getErrorList()
			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getErrorList()

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
			this.getErrorList();
			this.common.getOrganizeList(this.userData.deptId).then((res)=>{
				this.options=this.common.getLabel(res)
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
		padding: 10px;
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

	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
	}

	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
	}
	.mainTop>>>.ivu-cascader .ivu-cascader-menu{
		background: #fff!important;
	}
</style>
