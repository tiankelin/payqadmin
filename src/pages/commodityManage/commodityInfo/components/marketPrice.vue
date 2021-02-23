<template>
	<div class='marketPriceMain'>
		<div class='marketPriceContent'>
			<Icon type="md-close" class='closeBtn' @click='closeClick' />
			<div class='marketTitle'>设置市场报价</div>
			<div class='marketInfo'>
				<div><span>组织：</span><span>{{userData.dept.name}}</span></div>
				<div><span>商品名称：</span><span>{{rowData.goodsName}}</span></div>
				<div><span>商品类型：</span><span>{{rowData.goodsTypeName}}</span></div>
			</div>
			<div>
				<div class="itemWrapper">
					<div style="background:#8CC5FF;" class='itemList'>
						<div class='priceTitle'>呼叫中心定价</div>
						<div style="text-align: left;">
							<Form inline :label-width="70" class="formList" v-for='(item,index) in newTypeList' :key='index'>
								<FormItem :label='item.name+"："'>
									<InputNumber :min='0' :max='99999' v-model='item.centerPrice' style='width:200px;' />元
								</FormItem>
							</Form>
						</div>
					</div>
					<div style=" background: #8CC5FF;" class='itemList'>
						<div class='priceTitle'>线上定价</div>
						<div style="text-align: left;">
							<Form inline :label-width="70" class="formList" v-for='(item,index) in newTypeList' :key='index'>
								<FormItem :label='item.name+"："'>
									<InputNumber :min='0' :max='99999' v-model='item.otherPrice' style='width:200px;' />元
								</FormItem>

							</Form>
						</div>
					</div>
				</div>
			</div>
			<div class='btnWrapper'>
				<Button type="primary" @click='saveAndUpdateClick' v-has='948'>确定</Button>
				<Button @click='priceBackClick'>返回</Button >
			</div>
		</div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		name: 'marketPrice',
		props: {
			rowData: Object
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				newTypeList: [],
				priceList: []
			}
		},
		methods: {
			//获取价格
			getOrggoodspriceList() {
				_http.http1('post', pathUrls.orggoodspriceList, {
					orgId: this.userData.deptId,
					goodsId: this.rowData.goodsId,
				}, 'form').then((res) => {
					this.priceList = res.data;
				})
			},
			//确定
			saveAndUpdateClick() {
				let orgGoodsPriceList = [];
				for(let item of this.newTypeList) {
					if((item.centerPrice || item.otherPrice) && item.id) {
						orgGoodsPriceList.push({
							orgId: this.userData.deptId,
							goodsId: this.rowData.goodsId,
							userType: item.userType,
							centerPrice: item.centerPrice,
							otherPrice: item.otherPrice,
							id: item.id
						})
					}
					if((item.centerPrice || item.otherPrice) && !item.id) {
						orgGoodsPriceList.push({
							orgId: this.userData.deptId,
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
							content: '添加成功!',
							onClose: (() => {
								this.$emit('showMarket', false);
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
			//关闭
			closeClick() {
				this.$emit('showMarket', false);
			},
			//返回
			priceBackClick() {
				this.$emit('showMarket', false);
			},
			//删除
			remove(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.orggoodspriceDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',

								});
								this.getOrggoodspriceList();
							}

						})
					},

				});
			},

		},
		created(){
			this.getOrggoodspriceList();	
		},
		mounted() {
//						this.remove(26)
							
			this.newTypeList = [{
				userType: 0,
				centerPrice: null,
				name: '挂牌价',
				otherPrice: null
			}]
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				
				for(let item of res.data) {
					this.newTypeList.push({
						userType: item.id,
						name: item.typeName.slice(0, 2) + '价',
						centerPrice: null,
						otherPrice: null
					});
				}
				
				setTimeout(()=>{
					for(let item of this.newTypeList) {
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
				

			})
		}
	}
</script>

<style type="text/css" scoped>
	.marketPriceMain {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 1004;
	}
	
	.marketPriceContent {
		position: relative;
		width: calc(100% - 210px);
		height: calc(100% - 86px);
		background: #fff;
		margin-top: 65px;
		margin-left: 200px;
		padding: 10px;
		text-align: left;
	}
	
	.closeBtn {
		position: absolute;
		right: 5px;
		top: 5px;
		font-size: 26px;
		cursor: pointer;
		color: #51b5ea;
	}
	
	.marketTitle {
		color: #333;
		font-size: 16px;
	}
	
	.marketInfo {
		display: flex;
		background: #efdf207a;
		color: #000;
		margin: 5px 0 10px;
	}
	
	.marketInfo div {
		margin: 5px 20px;
	}
	
	.itemWrapper {
		display: flex;
		justify-content: space-around;
		min-height: 250px;
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
		width: auto;
	}
	
	.itemList {
		width: 48%;
		padding: 10px 20px;
	}
	
	.itemList span {
		padding-left: 10px;
	}
	
	.btnWrapper {
		position: fixed;
		right: 90px;
		bottom: 90px;
		z-index: 1200;
	}
	
	.btnWrapper button {
		margin: 0 10px;
	}
	
	.marketPriceMain>>>.ivu-input-number-handler-wrap {
		display: none;
	}
</style>