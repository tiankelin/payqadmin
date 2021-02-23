<template>
	<div class="setMain">
		<div class="setContent">
			<Icon type="md-close" class='closeBtn' @click='closeClick' />
			<div class='setTitle'>设置区域报价</div>
			<div class='setInfo'>
				<div><span>使用范围：</span><span>{{deptName}}</span></div>
				<div><span>商品名称：</span><span>{{rowData.goodsName}}</span></div>
				<div><span>商品类型：</span><span>{{rowData.goodsTypeName}}</span></div>
			</div>
			<div>
				<div class='totalPriceTitle'>总公司定价</div>
				<div class="itemWrapper">
					<div style="background: #DDEBF1;" class='itemList'>
						<div class='priceTitle'>呼叫中心定价</div>
						<div style="text-align: left;">
							<div v-for='(item,index) in newTypeList' :key='index' style="display: inline-block;width: 250px;min-width:40%;">
								<span>{{item.name}}：</span>
								<span v-if='item.centerPrice' style="display: inline-block;min-width: 35px;text-align: center;">{{item.centerPrice}}</span>
								<span v-else style="display: inline-block;min-width: 35px;text-align: center;">---</span>元
							</div>
							
						</div>
					</div>
					<div style="background: #DDEBF1;" class='itemList'>
						<div class='priceTitle'>线上定价</div>
						<div style="text-align: left;">
							<div v-for='(item,index) in newTypeList' :key='index' style="display: inline-block;width: 250px;min-width:40%;">
								<span>{{item.name}}：</span>
								<span v-if='item.otherPrice' style="display: inline-block;min-width: 35px;text-align: center;">{{item.otherPrice}}</span>
								<span v-else style="display: inline-block;min-width: 35px;text-align: center;">---</span>元
							</div>
							
						</div>
					</div>
				</div>
				<div class="itemWrapper">
					<div style="background:#8CC5FF;" class='itemList'>
						<div class='priceTitle'>呼叫中心定价</div>
						<div style="text-align: left;">
							<Form inline :label-width="70" class='formList' >
								<FormItem :label='item.name+"："' v-for='(item,index) in marketPriceList' :key='index' style='display: block;'>
									<InputNumber :min='0' :max='99999' v-model='item.centerPrice' style='width:250px;'/>元
								</FormItem>	
								
							</Form>
						</div>
					</div>
					<div style=" background: #8CC5FF;" class='itemList'>
						<div class='priceTitle'>线上定价</div>
						<div style="text-align: left;">
							<Form inline :label-width="70" class='formList'>
								<FormItem :label='item.name+"："' v-for='(item,index) in marketPriceList' :key='index' style='display: block;'>
									<InputNumber :min='0' :max='99999' v-model='item.otherPrice' style='width:250px;'/>元
								</FormItem>
								
							</Form>
						</div>
					</div>
				</div>
			</div>
			<div class='btnWrapper'>
				<Button type="primary" @click='saveAndUpdateClick'>确定</Button>
				<Button @click='priceBackClick'>返回</Button>
			</div>
		</div>

	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		name: 'setupPrice',
		props: {
			deptName:String,
			rowData:Object,
			deps:Number
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),		
				newTypeList:[],
				marketPriceList:[],
				priceList:[],
				regionalPriceList:[]
			}
		},
		methods: {
			//获取价格
			getOrggoodspriceList(dept,list) {
				_http.http1('post', pathUrls.orggoodspriceList, {
					orgId:dept,
					goodsId: this.rowData.goodsId,
				}, 'form').then((res) => {					
					this[list]= res.data;				
				})
			},
			//关闭
			closeClick() {
				this.$emit('showSetup', false)
			},
			//返回
			priceBackClick(){
				this.$emit('showSetup', false)
			},
			//确定
			saveAndUpdateClick() {
				let orgGoodsPriceList = [];				
				for(let item of this.marketPriceList) {
					if((item.centerPrice || item.otherPrice) && item.id) {
						orgGoodsPriceList.push({
							orgId: this.deps,
							goodsId: this.rowData.goodsId,
							userType: item.userType,
							centerPrice: item.centerPrice,
							otherPrice: item.otherPrice,
							id: item.id
						})
					}
					if((item.centerPrice || item.otherPrice) && !item.id) {
						orgGoodsPriceList.push({
							orgId: this.deps,
							goodsId: this.rowData.goodsId,
							userType: item.userType,
							centerPrice: item.centerPrice,
							otherPrice: item.otherPrice,
						})
					}

				}				
				let fData = {
					orgGoodsPriceList: orgGoodsPriceList
				}
				_http.http2('post', pathUrls.batchSaveOrUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '定价成功!',
							onClose: (() => {
								this.$emit('showSetup', false);
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
		},
		created(){
			this.getOrggoodspriceList(this.userData.deptId,'priceList')
			this.getOrggoodspriceList(this.deps,'regionalPriceList')	
		},
		mounted() {
					
			this.newTypeList=[{userType:0,centerPrice:null,name:'挂牌价',otherPrice:null}];
			this.marketPriceList=[{userType:0,centerPrice:null,name:'挂牌价',otherPrice:null}];
			this.common.getUserTypeList(this.userData.deptId).then((res)=>{
				for(let item of res.data){
					this.newTypeList.push({
						userType:item.id,
						name:item.typeName.slice(0,2)+'价',
						centerPrice:null,
						otherPrice:null
					});
					this.marketPriceList.push({
						userType:item.id,
						name:item.typeName.slice(0,2)+'价',
						centerPrice:null,
						otherPrice:null
					});
				}
				setTimeout(()=>{
				for(let item of this.newTypeList){
					if(this.priceList.length) {
						this.priceList.forEach(pri => {
							if(item.userType == pri.userType) {
								item.id = pri.id;
								item.centerPrice = pri.centerPrice;
								item.otherPrice = pri.otherPrice;
							}
						})
					}
				}	
				},300)
				setTimeout(()=>{
				for(let item of this.marketPriceList){
					if(this.regionalPriceList.length) {
						this.regionalPriceList.forEach(pri => {
							if(item.userType == pri.userType) {
								item.id = pri.id;
								item.centerPrice = pri.centerPrice;
								item.otherPrice = pri.otherPrice;
							}
						})
					}
				}	
				},300)
				
		})
		}
	}
</script>

<style type="text/css " scoped>
	.setMain {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .4);
		z-index: 1004;
	}
	
	.setContent {
		position: relative;
		width: calc(100% - 210px);
		height: calc(100% - 86px);
		background: #fff;
		margin-top: 65px;
		margin-left: 200px;
		padding: 10px;
		text-align: left;
		overflow-y: auto;
	}
	
	.closeBtn {
		position: absolute;
		right: 5px;
		top: 5px;
		font-size: 26px;
		cursor: pointer;
		color: #51b5ea;
	}
	
	.setTitle {
		color: #333;
		font-size: 16px;
	}
	
	.setInfo {
		display: flex;
		background: #efdf207a;
		color: #000;
		margin: 5px 0 10px;
	}
	
	.setInfo div {
		margin: 5px 20px;
	}
	
	.itemWrapper {
		display: flex;
		justify-content: space-around;
		min-height: 200px;
		margin-bottom: 10px;	
	}
	
	.priceTitle {
		color: #333;
		line-height: 20px;
		height: 30px;
		font-weight: 600;
		font-size: 16px;
	}
	
	.formList>>>.ivu-input-wrapper {
		width:auto;
	}
	
	.totalPriceTitle {
		color: #000;
		font-size: 18px;
	}
	
	.itemList {
		width: 48%;
		padding: 10px 20px;
	}
	.btnWrapper {
		position: fixed;
		right: 90px;
		bottom: 90px;
		z-index: 1200;
		/*background: #fff;
		border-radius: 4px;
		box-shadow: 0 2px 16px 0 #dcdee2;
		height: 40px;
		padding-top: 4px;*/
	}
	
	.btnWrapper button {
		margin: 0 10px;
		
	}
	.setMain>>>.ivu-input-number-handler-wrap {
		display: none;
	}
</style>