<template>
	<div class="orderGoodsMain">
		<div class="orderGoodsContent">
			<div class="closeWrapper" @click='handleClose'>
				<Icon type="md-close" />
			</div>
			<div>
				<h3 class="instructTitle">电话下单</h3>
				<div style="padding:0 10px 10px;">
					<div class="infoMain">
						<div>
							<span class="itemLabel">客户名称：</span>
							<span>{{userInfo.userName}}</span>
						</div>
						<div style="display: flex;">
							<div style="width: 50%;">
								<span class="itemLabel">联系人：</span>
								<span>{{userInfo.userRealName}}</span>
							</div>
							<div style="width: 50%;">
								<span class="itemLabel">联系方式：</span>
								<span>{{userInfo.userPhoneNumber}}</span>
							</div>

						</div>
						<div>
							<span class="itemLabel">所属组织：</span>
							<span>{{userInfo.deptName}}</span>
						</div>
						<div>
							<span class="itemLabel">地址：</span>
							<span>{{userInfo.userAddress}}</span>
						</div>
					</div>
					<div>
						<Form :label-width="80" class="formBox">
							<FormItem label="销售员" class='star'>
								<Select v-model="deliveryUserId" filterable style="width:200px;">
									<Option v-for="item in staList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
								</Select>
								<span class="infoDesc">请核对信息，选择正确的销售员！</span>
							</FormItem>
							<FormItem label="商品">
								<Button type="info" long @click="addGoods" icon="md-add" style="width: 200px;">添加</Button>
							</FormItem>
							<!--<div class="formBox">-->
								<FormItem label="商品名称" v-for='(formItem,index) in goodsForm' :key='index'>
									<Select clearable style="width: 200px;" @on-open-change='changeGoods(formItem.goodsId,index)' v-model='formItem.goodsId'>
										<Option v-for='item in goodsList' :key='item.goodsId' :value='item.goodsId'>{{item.goodsName}}</Option>
									</Select>
									<InputNumber :min='1' :max='formItem.maxNumber' style="width: 90px;" v-model='formItem.count' />
									<Button type="warning" style="height: 30px;line-height: 30px;" @click='deleteGoods(index)' v-if='index!=0'>删除</Button>
								</FormItem>

							<!--</div>-->
						</Form>
					</div>
					<div style="text-align: center;margin-top: 10px;">
						<Button type="primary" @click='handleEnter'>确定</Button>
						<Button style="margin-left: 40px;" @click='handleClose'>返回</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'orderGoods',
		props: {
			userId: Number,
			clickId: Number,
			userInfo: Object
		},
		data() {
			return {
				deliveryUserId:'',
				staList:[],
				goodsIndex: 1,
				goodsForm: [{
					index: 1,
					goodsId: null,
					count: 1,
					maxNumber: 100000
				}],
				goodsList: []
			}
		},
		methods: {
			//获取商品列表气-非气
			getGoodsByUserId() {
				_http.http1('post', pathUrls.getGoodsByUserId, {
					'userId': this.userId,
				}, 'form').then(res => {
					this.goodsList = res.data;

				})

			},

			changeGoods(v, index) {

				if(v) {
					this.goodsForm[index].goodsId = v;
					let lens = this.goodsForm.length;
					let newGoodsForm = this.goodsForm;
					for(let i = 0; i < lens; i++) {
						if(newGoodsForm[i].goodsId == v && i != index) {
							this.goodsForm[index].goodsId = null
							this.$Message['warning']({
								background: true,
								content: '商品重复，请重新选择!',

							});
							return false
						}
					}
					this.goodsList.forEach(item => {
						if(v == item.goodsId) {
							if(item.maxNumber) {
								this.goodsForm[index].count = 1;
								this.goodsForm[index].maxNumber = item.maxNumber;
							} else {
								this.goodsForm[index].maxNumber = 100000;
							}

						}
					})

				} else {
					this.goodsForm[index].goodsId = null;
				}
			},
			//删除商品
			deleteGoods(index) {
				this.goodsForm.splice(index, 1);
				this.goodsIndex--;
			},
			//添加商品
			addGoods() {
				let len = this.goodsList.length;
				if(this.goodsIndex < len) {
					this.goodsIndex++;
					this.goodsForm.push({
						yzoccindex: this.goodsIndex,
						goodsId: null,
						count: 1,
						maxNumber: 100000
					})
				} else {
					this.$Message['warning']({
						background: true,
						content: `最多添加${len}种商品!`,

					});
					return false
				}

			},
			handleEnter() {
				let goodsInfo = [];
				for(let item of this.goodsForm) {
					if(item.count > 0 && item.goodsId) {
						goodsInfo.push({
							goodsId: item.goodsId,
							number: item.count
						})
					}
				}
				if(goodsInfo.length != this.goodsForm.length) {
					this.$Message['warning']({
						background: true,
						content: '请添加商品及数量',
					});
					return false;
				}
				let fData = {
					userId: this.userId,
					goodsInfo: JSON.stringify(goodsInfo),
					deliveryUserId:this.deliveryUserId
				}
				_http.http1('post', pathUrls.orderWebCreateOrder, fData, 'form').then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
								this.$emit('closeOrderGoods', this.clickId);

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
			handleClose() {
				this.$emit('closeOrderGoods', null);
			}
		},
		mounted() {
      this.deliveryUserId=this.userInfo.userSalesperson;
			this.getGoodsByUserId()
			this.common.getStaffName(this.userInfo.userDeptId).then(res=>{
				this.staList = res.data
			})
		}
	}
</script>

<style type="text/css" scoped>
	.orderGoodsMain {
		background: rgba(0, 0, 0, .5);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
	}
	
	.orderGoodsContent {
		width: 550px;
		/*min-height: 400px;*/
		/*max-height: 600px;*/
		background: #fff;
		border-radius: 4px;
		padding: 10px;
		margin: 80px auto 0;
		position: relative;
		text-align: left;
		overflow-y: auto;
	}
	
	.formBox {
		height: 300px;
		overflow-y: auto;
	}
	
	.closeWrapper {
		position: absolute;
		right: 12px;
		top: -3px;
		font-size: 28px;
		cursor: pointer;
		color: #1296db;
		font-weight: 600;
	}
	
	.orderGoodsContent>>>.ivu-form-item {
		margin-bottom: 12px;
	}
	
	.itemLabel {
		min-width: 70px;
		display: inline-block;
		text-align: right;
		font-weight: 600;
	}
	
	.infoMain {
		border-bottom: 1px solid #ccc;
		line-height: 26px;
		margin-bottom: 10px;
	}
	.infoDesc{
		color: #E49C2E;
		font-size: 12px;
		margin-left: 20px;
	}
</style>