<template>
	<div class="main conMain">	
		<div class="mainContent">
		 	<Table :columns="columns" :data="dataList" border :loading='loading' highlight-row :height='tableHeight'>
		 		<template slot-scope="{ row, index }" slot="centerPrice">
		 			<div>
		 				<div v-for='item in row.newPriceArr' :key='item.userTypeName' style="min-width: 100px;float: left;padding: 5px 0;">
		 					<span style="display: inline-block;width: 50px;" :style="{color:item.userTypeName=='挂牌'?'rgb(0, 67, 255)':''}">{{item.userTypeName?item.userTypeName.slice(0,2):'未知'}}价:</span>
		 					<InputNumber v-model='item.centerPrice' style="width: 60px;margin:0 4px;" :min='0'/>
		 				</div>
		 			</div>
					
				</template>
				<template slot-scope="{ row, index }" slot="otherPrice" style="background: #0095FF;">
		 			<div style="background: #0095FF;">
		 				<div v-for='item in row.newPriceArr' :key='item.userTypeName' style="min-width: 100px;float: left;padding:5px 0;">
		 					<span style="display: inline-block;width: 50px;" :style="{color:item.userTypeName=='挂牌'?'rgb(0, 67, 255)':''}">{{item.userTypeName?item.userTypeName.slice(0,2):'未知'}}价:</span>
		 					<InputNumber v-model='item.otherPrice' style="width: 60px;margin:0 4px;" :min='0'/>
		 				</div>
		 			</div>					
				</template>
				<template slot-scope="{ row, index }" slot="action">
					<Button type="info" size='small' @click='edit(row)' v-has='975'>保存</Button>
				</template>
		 	</Table>
		 </div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';	
	import expandRow from './table-expand.vue';
	export default {
		name: 'priceList',		
		 components: {
		 	expandRow
		 },
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				defaultPriceArr:[],
				options:[],
				userData: (JSON.parse(this.$store.state.userData)),	
			    dataList:[],
				loading:false,
				columns:[{
                        type: 'expand',
                        
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row,
                                    options:this.options
                                },
                                on:{
				                  getVal:(val)=>{				                      	
				                    	this.getPriceList(params.index);
				                    	
				                    	
				                  }
				                }

                            })
                        }
                    },
//                  {
//						title: '序号',
//						type: 'index',
//						width: 70,
//						align: 'center',
//					},
					{
                        title: '商品名称',
                        key: 'goodsName',
                        width:160,
                        align: 'center',
                    },{
                        title: '呼叫中心定价',
                        key: 'centerPrice',
                        slot:'centerPrice',
                        align: 'center',
                        
                        
                    },{
                        title: '线上定价',
                        key: 'otherPrice',
                        slot:'otherPrice',
                        align: 'center',
                    },{
						title: '操作',
						key: 'action',
						width: 150,	
						align: 'center',
						slot:'action',
					}],
                userTypeList:[] ,
                newTypeList:[]
			}
		},
		methods: {
			edit(row){				
				let orgGoodsPriceList = [];
				row.newPriceArr.forEach(item=>{

					if((item.centerPrice || item.otherPrice) && item.orgPriceId) {
						orgGoodsPriceList.push({
							orgId: this.userData.deptId,
							goodsId: row.goodsId,
							userType: item.userType,
							centerPrice: item.centerPrice,
							otherPrice: item.otherPrice,
							id: item.orgPriceId
						})
					}
					if((item.centerPrice || item.otherPrice) && !item.orgPriceId) {
						orgGoodsPriceList.push({
							orgId: this.userData.deptId,
							goodsId: row.goodsId,
							userType: item.userType,
							centerPrice: item.centerPrice,
							otherPrice: item.otherPrice,
						})
					}

				})
				
				let fData = {
					orgGoodsPriceList: orgGoodsPriceList
				}	
				
				this.$Modal.confirm({
					title: '是否定价？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.batchSaveOrUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '定价成功!',
							onClose: (() => {
								this.getPriceList();
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						});
					}

				})
					},
				});
				
					
				
			},
		//获取列表
			getPriceList(index) {
				this.loading = true
				this.dataList=[];
				_http.http1('post', pathUrls.orggoodspriceGoodsPriceList, {					
				}, 'form').then((res) => {
					this.loading = false;
					if(res.code==0){
					  this.dataList = res.data.currentGoodsPrice;
					  this.tableHeight=this.screeHeight-95;
//						let newData=res.data;
						if(index||index==0){
							this.dataList[index]._expanded=true;							
						}
							this.dataList.forEach(item=>{
								item.newPriceArr=[];
								item.defaultPriceArr=[];
								if(item.priceArr){									
										this.newTypeList.forEach(items=>{
											item.priceArr.forEach(itemPrice=>{
											if(items.userTypeName==itemPrice.userTypeName){
													item.newPriceArr.push({
														centerPrice: itemPrice.centerPrice,
														otherPrice: itemPrice.otherPrice,
														userTypeName: items.userTypeName,
														userType:items.userType,
														orgPriceId:itemPrice.orgPriceId
													})
													item.defaultPriceArr.push({
														centerPrice:0,
														otherPrice:0,
														userTypeName: items.userTypeName,
														userType:items.userType,
														orgPriceId:null
													})
												}
										
										
										})
										
											
										
									})
								}
								
								if(item.subArr){
									item.subArr.forEach(itemPrice=>{
										if(itemPrice.goodsPriceArr&&itemPrice.goodsPriceArr[0].priceArr){
											itemPrice.goodsPriceArr[0].newPriceArr=[];
											this.newTypeList.forEach(items=>{
												itemPrice.goodsPriceArr[0].priceArr.forEach(itemArr=>{
													if(items.userTypeName==itemArr.userTypeName){
														itemPrice.goodsPriceArr[0].newPriceArr.push({
															centerPrice: itemArr.centerPrice,
															otherPrice: itemArr.otherPrice,
															userTypeName: itemArr.userTypeName,
															userType:itemArr.userType,
															orgPriceId:itemArr.orgPriceId
													})
													}
												})
												
											})
										}
									})
								}
								
								
								
								if(!item.subArr){
									item.subArr=[];
								}
							})
							

					}
					
					
				})
			},
		},
		created(){
			this.newTypeList = [{					
					centerPrice: 0,
					userTypeName: '挂牌',
					otherPrice: 0,
					userType:0
				}]
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
					if(res.code==0){
						for(let item of res.data){
							this.newTypeList.push({					
								centerPrice: 0,
								userTypeName:item.typeName,
								otherPrice: 0,
								userType:item.id
							})
						}
					}
					
					
			})
		
		
		},
		mounted() {
			this.common.getDeptList(this.userData.deptId).then((res) => {
			
			if(res.data[0].children){
			 		this.options = this.common.getConDept(res.data[0].children, 0, 0, 1)
			 	}else{
			 		this.options=[];
			 	}
		})

			
			this.getPriceList();
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		background: #FFFFFF;
		min-height: calc(100% - 10px);
	}
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding:10px;
		/*min-height: 400px;*/
	}
	
	.mainContent>>>td {
		height: 40px;
	}
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	.mainContent>>>.ivu-input{
		height: 26px;
		/*background: #4bfb48;*/
	}
	.mainContent>>>.ivu-table-expanded-cell{
		/*background: #10d53b8a!important;*/
		padding: 0!important;
		
		min-height: 40px!important;
	}
	.mainContent>>>.ivu-input-number-handler-wrap {
		display: none;
	}
</style>