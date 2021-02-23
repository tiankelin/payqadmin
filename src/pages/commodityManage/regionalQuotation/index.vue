<template>
	<div class="main">
		<div class="mainTop">
			<Form :model="formSearch" inline :label-width="70">
				<FormItem label="使用范围">
					<Cascader :data="options" clearable v-model="formSearch.organize" change-on-select @on-change='changeCascader' :render-format="format" style="width:300px"></Cascader>
				</FormItem>
				<!--<FormItem label="商品类型">
					<Select clearable v-model="formSearch.goodsType" style="width:300px" placeholder="请选择商品类型">
						<Option :value='item.id' :key='item.id' v-for='item in typeList'>{{item.goodsTypeName}}</Option>						
					</Select>									
				</FormItem>								-->
			</Form>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="priceList" :loading='loading' ref="table">
				<template slot-scope="{ row, index }" slot="action">					
					<Button type="warning" size="small" @click="quotedPriceMethod(row)" style="margin:0 10px;">报价</Button>					
				</template>
			</Table>
		</div>
		<setupPrice v-if='showSetup' @showSetup='showSetupMethods' :deptName='deptName' :rowData='rowData' :deps="deps"></setupPrice>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import setupPrice from './components/setupPrice';
	export default{
		name:'regionalQuotation',
		components:{
			setupPrice	
		},
		data(){
			return{
			deps:null,
			rowData:{},
			deptName:'',
			loading:false,	
			showSetup:false,
			typeList:[],
			userData: (JSON.parse(this.$store.state.userData)),
			options: [],
			formSearch:{
				goodsType:'',
				organize:''
			},
			priceList:[],
				columns:[{
						title: '商品名称',
						key: 'newGoodsName',
						align: 'center',
						tooltip: true
				},			
					{
						title: '商品分类',
						key: 'goodsTypeName',
						align: 'center',
						width: 120
					},{
						title: '商品规格',
						key: 'goodsSpec',
						align: 'center',
						tooltip: true
					},{
						title: '型号细分',
						key: 'goodsModelName',
						align: 'center',
						tooltip: true
					},{
						title: '营销渠道',
						key: 'newMarketChannel',
						align: 'center',						
					},
					{
						title: '描述',
						key: 'goodsDesc',
						align: 'center',						
					},
					{
						title: '操作',
						slot: 'action',
						width: 120,
						align: 'center'
					}]
			}
		},
		methods:{
			//获取商品信息列表
			getGoodsList() {
				this.loading = true
				_http.http1('post', pathUrls.deptgoodsList, {
				}, 'form').then((res) => {
					this.loading = false;
					if(res.code == 0) {
						for(let item of res.data){
							if(item.goodsAlias){
							item.newGoodsName=`${item.goodsName} (${item.goodsAlias})`;
							}else{
							item.newGoodsName=item.goodsName							
							}
							if(item.marketChannel==1){
								item.newMarketChannel='呼叫中心'
							}
							else if(item.marketChannel==2){
								item.newMarketChannel='线上渠道'
							}
							
						}
						this.priceList = res.data;
					
					}
				})
			},
			quotedPriceMethod(row){
				this.rowData=row;
				if(!this.formSearch.organize){
					this.$Message['warning']({
						background: true,
						content: '请先选择使用范围!',					
					});
					return false
				}else{
					this.showSetup=true;
				}
				
				
			},
			showSetupMethods(data){
				this.showSetup=data
			},
			//获取商品类型
			getGoodsTypeList(){
			_http.http1('post', pathUrls.goodstypeList, {				
			}, 'form').then((res) => {	
			this.typeList=res.data;
			})
				},
		//自定义组织输入框显示内容
			format(labels, selectedData) {
				
				const index = labels.length - 1;
				if(labels){
					this.deptName=labels[index];	
				}
				
				const data = selectedData[index] || false;
				return labels[index];
			},
			//改变组织下拉
			changeCascader(value, selectedData) {
				if(value.length) {
					this.formSearch.organize = value[value.length - 1]
					this.deps=value[value.length - 1];
				} else {
					this.formSearch.organize = ''
				}

			},	
		},
		mounted(){
			this.common.getOrganizeList(this.userData.deptId).then((res) => {				
				if(res[0].children){
					this.options = this.common.getLabel(res[0].children)	
				}
				
			})
			this.getGoodsTypeList()
			this.getGoodsList()
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
		background: #fff;
		height: 48px;
		line-height: 48px;
		text-align: left;
		padding: 10px 0 0 10px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 5px 10px 20px;
	}
	
	.mainContent>>>td {
		height: 40px;
	}
	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	.mainTop>>>.ivu-cascader .ivu-cascader-menu{
		background: #fff!important;
	}	
</style>