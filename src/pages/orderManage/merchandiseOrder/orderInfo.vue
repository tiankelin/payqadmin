<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>详情</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :label-width="130" :model='typeForm'>
				<FormItem label="订单号" :class='[errorList.length?"errorColor":""]'>
					<Input v-model="typeForm.orderCode" readonly />
					
				</FormItem>

				<FormItem label="安检编号" v-if='typeForm.checkCode'>
					<Input v-model="typeForm.checkCode" readonly style="width: 292px;" />
					<Button type="info" size='small' @click='toInfoClick(typeForm.checkCode)'>安检详情</Button>
				</FormItem>
				<FormItem label="组织名称">
					<Input v-model="typeForm.orderDeptName" readonly/>
					
				</FormItem>
				<FormItem label="客户名称">
					<!--<Input v-model="typeForm.orderUserCompanyName" readonly style="cursor: pointer;"/>-->
					<span @click='handleToUserInfo' style="cursor: pointer;color: #0079FB;font-weight: 600;margin-right: 10px;">{{typeForm.orderUserCompanyName}}</span>
					<Button type="info" size='small' @click='handleOrderHistory()'>历史购气</Button>
				</FormItem>
				<FormItem label="联系人">
					<Input v-model="typeForm.orderUserName" readonly/>
				</FormItem>
				<FormItem label="接收人姓名">
					<Input v-model="typeForm.orderReceiverName" readonly />
				</FormItem>
				<FormItem label="接收人身份证号">
					<Input v-model="typeForm.orderReceiverIdCardNumber" readonly />
				</FormItem>
				<FormItem label="接收人联系方式">
					<Input v-model="typeForm.orderReceiverPhone" readonly />
				</FormItem>

				<FormItem label="地址">
					<Input v-model="typeForm.orderUserAddress" readonly/>
				</FormItem>
				<FormItem label="配送员">
					<Input v-model="typeForm.orderDeliveryUserName" readonly />
				</FormItem>

				<div>
					<FormItem label="商品名称" v-for='(formItem,index) in goodsForm' :key='index'>
						<Select style="width: 276px;" v-model='+formItem.goodsId' disabled>
							<Option v-for='item in goodsList' :key='item.goodsId' :value='item.goodsId'>{{item.goodsName}}</Option>
						</Select>
						<InputNumber :min='0' :max='1000' style="width: 90px;" v-model='formItem.goodsCount' disabled/>
					</FormItem>
				</div>
				<FormItem label="订单来源">
					<Input v-model="typeForm.newOrderCreateType" readonly/>
				</FormItem>
				<FormItem label="创建时间">
					<Input v-model="typeForm.datetime" readonly/>
				</FormItem>

				<FormItem label="订单完结时间" v-if='orderStatus==3'>
					<Input v-model="typeForm.orderFinishTime" readonly/>
				</FormItem>
				<FormItem label="订单取消时间" v-if='orderStatus==-1'>
					<Input v-model="typeForm.orderCancelTime" readonly/>
				</FormItem>
				<FormItem label="用户签名" v-if='orderUserSign' style='margin-bottom: 0;'>
					<img :src="orderUserSign" alt="" style="width: 40px;height: 40px;cursor: pointer;" @click='viewPic(orderUserSign)' />
				</FormItem>
				<FormItem label="应收金额">
					<Input v-model="typeForm.orderMoney" readonly/>
				</FormItem>
				<FormItem label="实收金额">
					<Input v-model="typeForm.orderMoney" readonly/>
				</FormItem>
				<!--<FormItem>
					<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
				</FormItem>-->
			</Form>
			<div>
				<div style="margin-left: 38px;">
					<span style="margin-right: 20px;">配送瓶数</span>
					<span style="color: #2DB7F5;font-size: 16px;">{{fullBottleCount}}</span>
				</div>
				<div style="margin-left:120px;" v-for='item in fullExtend' :key='item.extendId' class="btnTag">
					<div style="margin-bottom:8px">
						<span style="margin-right: 6px;">电子标签编码：</span>
						<Button v-if='item.extendBottleNfcId' type="warning" style="height: 26px;min-width: 110px;padding: 0 5px;font-size: 12px;" @click='handleBottleInfo(item.extendBottleNfcId)'>{{item.extendBottleNfcId}}</Button>
						<span v-else style="display: inline-block;width: 110px;height: 26px;"></span>

						<span style="margin:0 6px;">钢瓶条码：</span>
						<Button v-if='item.extendBottleCode' type="info" style="height: 26px;min-width: 110px;padding: 0 5px;font-size: 12px;" @click='handleBottleInfo(item.extendBottleCode)'>{{item.extendBottleCode}}</Button>
						<span v-else style="display: inline-block;width: 110px;height: 26px;"></span>

						<span style="margin-left: 6px;margin-right: 6px;">钢瓶规格：</span>
						<span>{{item.extendBottleSpec}}</span>
					</div>

				</div>
			</div>
			<div>
				<div style="margin-left: 38px;">
					<span style="margin-right: 20px;">回收瓶数</span>
					<span style="color: #2DB7F5;font-size: 16px;">{{emptyBottleCount}}</span>
				</div>
				<div style="margin-left:120px;" v-for='item in emptyExtend' :key='item.extendId' class="btnTag">
					<div style="margin-bottom:8px">
						<span style="margin-right: 6px;">电子标签编码：</span>
						<Button type="warning" v-if='item.extendBottleNfcId' style="height: 26px;min-width: 110px;font-size: 12px;" @click='handleBottleInfo(item.extendBottleNfcId)'>{{item.extendBottleNfcId}}</Button>
						<span v-else style="display: inline-block;width: 110px;height: 26px;"></span>
						<span style="margin:0 6px;">钢瓶条码：</span>

						<Button type="info" v-if='item.extendBottleCode' style="height: 26px;min-width: 110px;font-size: 12px;" @click='handleBottleInfo(item.extendBottleCode)'>{{item.extendBottleCode}}</Button>
						<span v-else style="display: inline-block;width: 110px;height: 26px;"></span>

						<span style="margin-left: 6px;margin-right: 6px;">钢瓶规格：</span>
						<span>{{item.extendBottleSpec}}</span>
					</div>

				</div>
			</div>
			<div style="margin-left: 38px;">
				<div>异常情况：</div>
				<div style="margin-left:82px;" v-for='item in errorList' :key='item.id' class="btnTag">
					<div style="margin-bottom:8px">
						<span style="margin-right: 6px;">电子标签编码：</span>
						<Button type="warning" v-if='item.bottleTag' style="height: 26px;min-width: 110px;font-size: 12px;" @click='handleBottleInfo(item.bottleTag)'>{{item.bottleTag}}</Button>
						<span v-else style="display: inline-block;width: 110px;height: 26px;"></span>
						<span style="margin:0 6px;">钢瓶条码：</span>
						<Button type="info" v-if='item.bottleCode' style="height: 26px;min-width: 110px;font-size: 12px;" @click='handleBottleInfo(item.bottleCode)'>{{item.bottleCode}}</Button>
						<span v-else style="display: inline-block;width: 110px;height: 26px;"></span>

						<span style="margin-left: 6px;margin-right: 6px;">异常描述：</span>
						<span style="color: #f00;">{{item.errDesc}}</span>
						<span style="margin-left: 6px;margin-right: 6px;">异常原因：</span>
						<span style="color: #f00;">{{item.errReason}}</span>
					</div>

				</div>
			</div>

		</div>
		<Modal title="用户签名" v-model="visible" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>
			<div class="rotateModal" @click='handleRotate' title='旋转'>
			
			</div>		
			<img :src="imgUrl" v-if="visible" ref='imgModal'  class="imgModal">
		</Modal>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
		<orderHistory v-if='orderInfo' @orderInfo='orderInfoMethod' :userId='userId'></orderHistory>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	import orderHistory from '@/pages/comComponent/orderHistory.vue';
	export default {
		name: 'orderAdd',
		components: {
			cylInfo,
			orderHistory
		},
		data() {
			return {
				rotateIndex:0,
				userId: '',
				orderInfo: false,
				pathIndex: 0,
				errorList: [],
				goodsIndex: 1,
				goodsForm: [{
					goodsId: null,
					goodsCount: 0
				}],
				goodsList: [],
				visible: false,
				userData: (JSON.parse(this.$store.state.userData)),
				typeForm: {
					orderCode: '',
					orderDeptName: '',
					orderUserCompanyName: '',
					orderUserName: '',
					orderUserAddress: '',
					orderDeliveryUserName: '',
					bottle5KG: 0,
					bottle15KG: 0,
					bottle50KG: 0,
					newOrderCreateType: '',
					datetime: '',
					orderMoney: '',
					orderFinishTime: null,
					orderCancelTime: null,
					checkCode: null,
					orderUserSign: '',
					orderReceiverName: '',
					orderReceiverIdCardNumber: '',
					orderReceiverPhone: ''

				},
				userList: [],
				phoneList: [],
				staffNameList: [],
				orderStatus: 1,
				newExtends: [],
				fullBottleCount: 0,
				tags: '',
				infoSee: false,
				fullExtend: [],
				emptyExtend: [],
				emptyBottleCount: 0
			}
		},
		watch: {
			$route(newRoute) {
				this.getOrderInfo()

			}
		},
		methods: {
			handleCancel(){
				this.rotateIndex=0;
			},
			handleRotate(){
				this.rotateIndex=this.rotateIndex+1;
				this.$refs.imgModal.style.transform='rotate('+ 90*this.rotateIndex +'deg)';
			},
			handleToUserInfo(){
				let id=this.userId;
				this.$router.push(`/customerInfo/seeAccount/${id}/2`);
			},
			orderInfoMethod(data) {
				this.orderInfo = data;
			},
			//历史购气
			handleOrderHistory() {
				this.orderInfo = true;
			},
			//查看钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},
			handleBottleInfo(code) {
				this.infoSee = true
				this.tags = code
			},
			viewPic(url) {
				this.visible = true;
				this.imgUrl = url;
			},
			toInfoClick(code) {
				let searchData = {
					'checkTypeId': '',
					'deptId': '', //所属片区id
					'checkerId': '', //安检员
					'checkStatus': '', //审核状态
					'userType': '', //用户类型
					'userName': '', //客户名称
					'address': '', //客户地址
					'startTime': '', //起始时间
					'endTime': '', //结束时间
					'checkNum': '',
					'startTime': '', //起始时间
					'endTime': '', //结束时间
					'userPhone': ''
				}
				this.$store.commit('changeCheckInfo', JSON.stringify(searchData))
				this.$router.push('/securityRecord/checkInfo' + '/' + code+'/1')
			},
			//获取订单信息详情
			getOrderInfo() {
				let newParams = '';
				if(this.$route.params.type == '1') {
					newParams = '/' + this.$route.params.id + '?type=1';
				} else {
					newParams = '/' + this.$route.params.id;
				}
				this.errorList = [];
				this.typeForm.orderCode = null; //订单号
				this.typeForm.checkCode = null; //安检编号
				this.typeForm.orderDeptName = null; //组织名称
				this.typeForm.orderUserCompanyName = null; //商户名称
				this.typeForm.orderUserName = null; //用户名
				this.typeForm.orderReceiverName = null; //接收人
				this.typeForm.orderReceiverPhone = null; //接收电话
				this.typeForm.orderReceiverIdCardNumber = null; //接收人id
				this.typeForm.orderUserAddress = null; //地址
				this.typeForm.orderDeliveryUserName = null; //配送员
				this.typeForm.datetime = null; //创建时间
				this.typeForm.orderMoney = null; //应收金额
				this.typeForm.orderFinishTime = null; //完结时间
				this.typeForm.orderCancelTime = null; //取消时间
				this.orderStatus = null; //订单状态
				this.orderUserSign = null; //用户签名
				_http.http1('get', pathUrls.orderInfo + newParams, {}, 'form').then((res) => {
					if(res.order.errorList) {
						this.errorList = res.order.errorList;
					}
					this.userId=res.order.orderUserId;
					this.typeForm.orderCode = res.order.orderCode; //订单号
					this.typeForm.checkCode = res.order.checkCode; //安检编号
					this.typeForm.orderDeptName = res.order.orderDeptName; //组织名称
					this.typeForm.orderUserCompanyName = res.order.orderUserCompanyName ? res.order.orderUserCompanyName : res.order.orderUserName; //商户名称
					this.typeForm.orderUserName = res.order.orderUserName; //用户名
					this.typeForm.newOrderCreateType = null;
					//接收人证件号
					if(res.order.receiverInfoEntity) {
						let receivers = res.order.receiverInfoEntity;
						this.typeForm.orderReceiverName = receivers.receiverName; //接收人
						this.typeForm.orderReceiverPhone = receivers.receiverPhone; //接收电话
						this.typeForm.orderReceiverIdCardNumber = receivers.idCard; //接收人id
					}
					this.typeForm.orderUserAddress = res.order.orderUserAddress; //地址
					this.typeForm.orderDeliveryUserName = res.order.orderDeliveryUserName; //配送员
					this.typeForm.datetime = res.order.orderCreateTime; //创建时间
					this.typeForm.orderMoney = res.order.orderMoney; //应收金额
					this.typeForm.orderFinishTime = res.order.orderFinishTime; //完结时间
					this.typeForm.orderCancelTime = res.order.orderCancelTime; //取消时间
					this.orderStatus = res.order.orderStatus; //订单状态
					this.orderUserSign = res.order.orderUserSign; //用户签名
					this.goodsForm = [];
					this.newExtends = [];
					this.fullExtend = [];
					this.emptyExtend = [];
					switch(res.order.orderCreateType) {
						case 1:
							this.typeForm.newOrderCreateType = '用户触卡';
							break;
						case 2:
							this.typeForm.newOrderCreateType = '大数据';
							break;
						case 3:
							this.typeForm.newOrderCreateType = '电话';
							break;
						case 4:
							this.typeForm.newOrderCreateType = '上门触卡';
							break;
						case 5:
							this.typeForm.newOrderCreateType = 'APP下单';
							break;
						case 6:
							this.typeForm.newOrderCreateType = '管理员生成';
							break;
					}
					if(res.order.orderDetailsList && res.order.orderDetailsList.length) {
						this.goodsForm = res.order.orderDetailsList;
					}
					if(res.order.orderExtends) {
						this.newExtends = res.order.orderExtends;
						for(let item of this.newExtends) {
							if(item.extendBottleType == 1) {
								//								item.extendBottleCode='3057333334'
								this.fullExtend.push(item);
							} else {
								this.emptyExtend.push(item);
							}

						}
						this.fullBottleCount = this.fullExtend.length;
						this.emptyBottleCount = this.emptyExtend.length;
					}

				})
			},
			//返回
			handleBackClick() {
				// if(this.$route.params.type == '2'){
				// 	this.$router.push('/orderManage/merchandiseOrder');
				// }else{
				// 	this.$router.push('/householdCheck/securityRecord');
				// }

				this.$router.go(-1)
				// if(this.$route.path.indexOf('/merchandiseOrder/orderInfo')!=-1){
				//   this.pathIndex++;
				// }else{
				//   this.pathIndex=0;
				// }
				//  console.log(this.pathIndex)
				// if(this.pathIndex>1){
				//   console.log(this.pathIndex)
				//   this.$router.push('/orderManage/merchandiseOrder');
				// }

				// window.history.go(-1)
			},

		},

		mounted() {
			//获取商品列表
			this.common.getGoodsList().then((res) => {
				this.goodsList = res.data;
			})
			this.getOrderInfo()
		}
	}
</script>

<style type="text/css" scoped>
	.ivu-form-item {
		margin-bottom: 10px;
		width: 500px;
	}
	
	.mainBody>>>.ivu-select-disabled,
	.mainBody>>>.ivu-select-selection {
		background-color: #fff;
		color: #515a6e;
	}
	
	.mainBody>>>.ivu-input-number-disabled,
	.mainBody>>>.ivu-input-number-input {
		background-color: #fff;
		color: #515a6e;
	}
	
	.btnTag>>>.ivu-btn {
		padding: 0 10px!important;
	}
	
	.mainBody>>>.errorColor .ivu-input {
		color: #f00;
	}
	
</style>