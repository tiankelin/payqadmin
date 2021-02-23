<template>
	<div class="callCenterMain">
		<div class="callCenterTop">
			<div class="telTitle">
				<span>电话：</span>
				<Input @keyup.enter.native="handleSearch(1)" type="text" style="width: 200px;font-size: 16px;" v-model='userPhone' @on-keyup="userPhone=userPhone.replace(/\s+/g,'')" placeholder='电话' />
				<Button @click='handleSearch(1)' type="info">查询</Button>
			</div>

			<div class="telRight">
				<i-switch v-model='switchs' size="large" false-color="#ff4949" :true-value='1' :false-value='0' style='margin-bottom: 4px;' @on-change='switchChange'>
					<span slot="open">置闲</span>
					<span slot="close">置忙</span>
				</i-switch>
				<span class="telLabel">等待数</span><span class="weitCount">{{$store.state.waitCount}}</span>
				<Icon type="md-close" class='iconClose' @click='handleClose' />
			</div>

		</div>
		<div class="callCenterContent">
			<div class="callCenterContentLeft">
				<div class="contentLeftTop">
					<div>今日第<span style="color: #722ED1;padding: 0 4px;">{{callNumber}}</span>个来电</div>
					<div><span>来电号码：</span><span style="color:#f68104;">{{newPhone}}</span></div>
					<div><span>今日来电次数</span><span style="color: #0089FF;padding: 0 4px;">{{countTimes}}</span></div>
					<div><span class="telLabel">来电时间：</span><i>{{callTime}}</i></div>
				</div>

				<div style="text-align: center; margin: 5px 0;">
					<div>关联电话</div>
					<Table border :columns="leftColumns" :data="liftList" :loading='loading' :height='userHeight'>
						<!-- <template slot-scope="{ row, index }" slot="action"> -->
						<!-- 		<div style="font-size: 18px;cursor: pointer;color: #f00;">
								<Icon type="md-close" />
							</div> -->
						<!--<Button type='error' size='small'>删除</Button>-->
						<!-- </template> -->
					</Table>
				</div>
				<!--<div class="contentLeftInfo">
					<div><span class="infoLabel">关联地址：</span><span></span></div>
				</div>-->
				<div class="contentLeftInfo">
					<div><span class="infoLabel">客户名称：</span><span>{{userNames}}</span></div>
					<div><span class="infoLabel">户号：</span><span>{{userAccountNumbers}}</span></div>
					<div><span class="infoLabel">客户类型：</span><span>{{userTypeName}}</span></div>
				</div>
				<div class="contentLeftInfo">
					<div><span class="infoLabel">最近订气：</span><span>{{lastOrderTime}}</span></div>
					<div><span class="infoLabel">订气总数：</span><span>{{totalOrder}}</span></div>
					<div><span class="infoLabel">最近安检：</span><span>{{lastCheckTime}}</span></div>
				</div>
				<div class="contentLeftInfo">
					<div><span class="infoLabel">所属组织：</span><span>{{deptName}}</span></div>
					<div><span class="infoLabel">联系人：</span><span>{{userRealName}}</span></div>
					<div><span class="infoLabel">电话：</span><span>{{userPhoneNumber}}</span></div>
				</div>
				<div class="contentLeftInfo">
					<div><span class="infoLabel">开户日期：</span><span>{{openingTime}}</span></div>
					<div><span class="infoLabel">证件号码：</span><span>{{userIdCardNumber}}</span></div>
					<div><span class="infoLabel">销售员：</span><span>{{userSalespersonName}}</span></div>
				</div>
				<div class="contentLeftInfo">
					<div style="width: 100%;"><span class="infoLabel">所在区域：</span><span>{{region}}</span></div>

				</div>
				<div class="contentLeftInfo">
					<div style="width: 100%;"><span class="infoLabel">联系地址：</span><span>{{userAddress}}</span></div>
				</div>
				<div style="margin:8px 0;">
					<Button type="info" size='small' style="margin-right: 40px;" @click='accountAddClick' v-if='!userId&&(userName||userPhone||userAddresses)'>添加客户</Button>
					<Button type="warning" size='small' @click="orderGoodsClick" v-if='userId'>订购商品</Button>
				</div>
				<div>
					<Table border :columns="gasColumns" :data="gasList" :height="orderHeight" :loading='loading'>
						<template slot-scope="{ row, index }" slot="orderCode">
							<span @click="handleSeeOrderInfo(row)" v-if='row.orderCode' style="color:#c810e7;cursor: pointer;">{{row.orderCode}}</span>
						</template>
						<template slot-scope="{ row, index }" slot="action">
							<Button v-if='row.orderStatus==1||row.orderStatus==2' type='error' size='small' style='margin-right: 10px;' @click='handleCancel(row.orderId)'>                     取消
                </Button>
							<Button type='info' size='small' v-if='row.orderStatus==1||row.orderStatus==2' @click='handleOrderTransfer(row.orderId)'>转派</Button>
						</template>
					</Table>
				</div>
			</div>
			<div class="callCenterContentRight">
				<div class="contentRightTitle">快捷查询栏
					<!--<Button type='info' size='small' @click='callPhone(5,this.userPhone)' v-if='newPhone' style='margin-left: 20px;'>回拨</Button>-->
				</div>
				<div class="searchInput">
					<div style="margin-bottom: 10px;">
						<span style="width: 70px;display: inline-block;text-align: right;">客户名称：</span>
						<Input placeholder='客户名称-联系人-接收人' type="text" style="width: 170px;" v-model='userName' @on-keyup="userName=userName.replace(/\s+/g,'')" />
						<Button size='small' @click='handleSearch(1)'>查询</Button>
					</div>
					<!--<div style="margin: 10px 0;">
            <span style="width: 70px;display: inline-block;text-align: right;">电话：</span>
            <Input type="text" style="width: 170px;" v-model='userPhone' @on-keyup="userPhone=userPhone.replace(/\s+/g,'')"
              placeholder='电话' />
            <Button size='small' @click='handleSearch(1)'>查询</Button>
          </div>-->
					<div>
						<span style="width: 70px;display: inline-block;text-align: right;">地址：</span>
						<Input type="text" style="width: 170px;" v-model='userAddresses' @on-keyup="userAddresses=userAddresses.replace(/\s+/g,'')" placeholder='地址' />
						<Button size='small' @click='handleSearch(1)'>查询</Button>
					</div>
				</div>
				<div style="text-align: center;margin: 10px 10px 0;font-weight: 600;">联系信息</div>
				<div class="contentRightInfo">
					<div @click='listClick(item,index)' :class="{checkList:index+1==clickId}" class="rightInfoList" :style='{"boxShadow":index%2==0?"0 1px 8px 0 #40a9ff4a":"0 1px 8px 0 #ea47ea4a"}' v-for='(item,index) in rightInfoList' :key='item'>
						<div class="listItem"><span>客户名称：</span><span :title='item.userName'>{{item.userName}}</span></div>
						<div style="display: flex;justify-content: space-between;line-height: 24px;">
							<div><span>联系人：</span><span>{{item.userRealName}}</span></div>
							<div><span>电话：</span><span>{{item.userPhoneNumber}}</span></div>
						</div>
						<div class="listItem"><span>组织：</span><span :title='item.deptName'>{{item.deptName}}</span></div>
						<div class="listItem" style="line-height: 24px;" :title='item.userAddress'><span>地址：</span><span>{{item.userAddress}}</span></div>
					</div>
					<Spin size="large" fix v-if="spinShow"></Spin>
				</div>
			</div>
		</div>
		<addAccount v-if='closeAccount' @closeAccount='closeAccountMethod'></addAccount>
		<orderGoods v-if='closeOrderGoods' @closeOrderGoods='closeOrderGoodsMethod' :userId='userId' :clickId='clickId' :userInfo='userInfo'></orderGoods>
		<orderTransfer v-if='closeorderTransfer' @closeorderTransfer='closeorderTransferMethod' :userDeptId='userDeptId' :clickId='clickId' :orderId='orderId'></orderTransfer>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import addAccount from './addAccount';
	import orderGoods from './orderGoods';
	import orderTransfer from './orderTransfer';
	import { sendWSPush } from '@/public/websocket';
	export default {
		name: 'callCenter',
		components: {
			addAccount,
			orderGoods,
			orderTransfer
		},
		data() {
			return {
        userSalesperson:null,
				userInfo:{},
				userDeptId: '',
				orderId: null,
				closeorderTransfer: false,
				userData: (JSON.parse(this.$store.state.userData)),
				callNumber: 0,
				switchs: 1,
				countTimes: 0,
				callTime: '',
				newPhone: '',
				userHeight: 'auto',
				orderHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				loading: false,
				userId: null,
				closeOrderGoods: false,
				closeAccount: false,
				tableHeight: 'auto',
				spinShow: false,
				userAddress: null,
				region: null,
				userSalespersonName: null,
				userIdCardNumber: null,
				openingTime: null,
				deptName: null,
				userRealName: null,
				userPhoneNumber: null,
				lastCheckTime: null,
				totalOrder: 0,
				lastOrderTime: null,
				userTypeName: null,
				userNames: null,
				userAccountNumbers: null,
				userName: '',
				userPhone: '',
				userAddresses: '',
				clickId: 1,
				rightInfoList: [],
				liftList: [],
				leftColumns: [
					//				{
					//					type: 'selection',
					//					width: 60,
					//					align: 'center',
					//					slot: 'selection',
					//				},
					{
						title: '电话',
						key: 'receiverPhone',
						align: 'center',
					}, {
						title: '联系人',
						key: 'receiverName',
						align: 'center',
					},
					//				{
					//					title: '操作',
					//					slot: 'action',
					//					width: 120,
					//					align: 'center'
					//				}
				],

				gasColumns: [{
						title: '订单号',
						key: 'orderCode',
						align: 'center',
						minWidth: 210,
						slot: 'orderCode'
					},
					//				{
					//					title: '市价',
					//					key: 'marketPrice',
					//					align: 'center',
					//				}, {
					//					title: '特价',
					//					key: 'bargainPrice',
					//					align: 'center',
					//				},
					//				{
					//					title: '优惠',
					//					key: 'bargainPrice',
					//					align: 'center',
					//				},
					//				{
					//					title: '数量',
					//					key: 'bargainPrice',
					//					align: 'center',
					//				},
					{
						title: '配送费',
						key: 'deliveryFee',
						align: 'center',
					}, {
						title: '上楼费',
						key: 'upstairsFee',
						align: 'center',
					}, {
						title: '服务费',
						key: 'serviceFee',
						align: 'center',
					}, {
						title: '应收金额',
						key: 'orderMoney',
						align: 'center',
					}, {
						title: '实收金额',
						key: 'orderActualCost',
						align: 'center',
					},
					{
						title: '状态',
						key: 'newStatus',
						align: 'center',
					},
					{
						title: '操作',
						align: 'center',
						slot: 'action',
						minWidth: 70
					},
				],
				gasList: []

			}
		},
		watch: {
			"$store.state.phone": {
				handler(newItems, oldItems) {
					this.newPhone = newItems;
					if(newItems) {
						this.userPhone = newItems;
						this.handleSearch(1);
					}
				},
				deep: true,
				immediate: true
			},
			"$store.state.countObject": {
				handler(newItems, oldItems) {
					if(newItems && newItems.length) {
						let countObject = JSON.parse(newItems)
						this.callNumber = countObject.count;

						this.countTimes = countObject.number;
						this.callTime = countObject.time;
					}

				},
				deep: true,
				immediate: true
			},
		},
		methods: {
			//转派
			handleOrderTransfer(id) {
				this.orderId = id;
				this.closeorderTransfer = true;
			},
			closeorderTransferMethod(data) {
				this.closeorderTransfer = false;
				if(data) {
					this.handleSearch(data);
				}
			},
			//订单取消
			handleCancel(id) {
				this.$Modal.confirm({
					title: '是否取消订单？',
					content: '',
					onOk: () => {
						_http.http2('post', `${pathUrls.orderCancel}/${id}`, ).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '订单取消成功!',
									onClose: (() => {
										this.handleSearch(1);
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
			switchChange(v) {

				this.callPhone(7, v);
			},
			callPhone(type, values) {
				function getHandledValue(num) {
					return num < 10 ? '0' + num : num
				};
				let timestamp = Date.parse(new Date());
				let d = new Date()
				let year = d.getFullYear()
				let month = getHandledValue(d.getMonth() + 1)
				let date = getHandledValue(d.getDate())
				let hours = getHandledValue(d.getHours())
				let minutes = getHandledValue(d.getMinutes())
				let second = getHandledValue(d.getSeconds())
				let resStr = ''
				resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
				// console.log({"from":"0","type":type,"payload":{"id":timestamp,"data":{'idleFlag':values+''}},"to":"0","time":resStr})
				if(type == 7) {
					sendWSPush({
						"from": "0",
						"type": type,
						"payload": {
							"id": timestamp,
							"data": {
								'idleFlag': values + ''
							}
						},
						"to": "0",
						"time": resStr
					})
				}
				if(type == 5) {
					sendWSPush({
						"from": "0",
						"type": type,
						"payload": {
							"id": timestamp,
							"data": {
								'phone': values
							}
						},
						"to": "0",
						"time": resStr
					})
				}
				// sendWSPush({"from":"0","type":type,"payload":{"id":timestamp,"data":{keys:values}},"to":"0","time":resStr})
			},
			handleSeeOrderInfo(row) {
				this.$router.push('/merchandiseOrder/orderInfo' + '/' + row.orderCode + '/1')

			},
			orderGoodsClick() {
				this.closeOrderGoods = true;
			},
			closeOrderGoodsMethod(data) {
				this.closeOrderGoods = false;
				if(data) {
					this.handleSearch(data);
				}
			},
			accountAddClick() {
				this.closeAccount = true;
			},
			closeAccountMethod(data) {
				this.closeAccount = false;
				if(data == 1) {
					this.handleSearch(1)
				}
			},
			handleSearch(i) {
				if(this.userPhone || this.userName || this.userAddresses) {
					this.spinShow = true;
					this.loading = true;
					this.getInfoBase();
					_http.http1("post", pathUrls.userFuzzyQueryUser, {
						userPhone: this.userPhone,
						userName: this.userName,
						userAddress: this.userAddresses
					}, 'form').then((res) => {
						this.loading = false;
						this.spinShow = false;
						this.rightInfoList = res.data;
						if(this.rightInfoList.length) {
							let item = this.rightInfoList[i - 1];
							this.clickId = i;
							this.getInfoCommon(item);
						}
					}).catch(err => {
						this.loading = false;
						this.spinShow = false;
					})
				}

			},
			listClick(item, index) {
				this.clickId = index + 1;
				this.getInfoBase();
				this.getInfoCommon(item);

			},
			getInfoBase() {
				this.userInfo={};
				this.gasList = [];
				this.liftList = [];
				this.userAddress = null;
        this.userSalesperson=null;
				this.region = null;
				this.userSalespersonName = null;
				this.userIdCardNumber = null;
				this.openingTime = null;
				this.deptName = null;
				this.userRealName = null;
				this.userPhoneNumber = null;
				this.lastCheckTime = null;
				this.totalOrder = 0;
				this.lastOrderTime = null;
				this.userTypeName = null;
				this.userNames = null;
				this.userAccountNumbers = null;
				this.userId = null;
			},
			getInfoCommon(item) {
        this.userSalesperson=item.userSalesperson;
				this.userAddress = item.userAddress;
				this.region = item.region;
				this.userSalespersonName = item.userSalespersonName;
				this.userIdCardNumber = item.userIdCardNumber;
				this.openingTime = item.openingTime;
				this.deptName = item.deptName;
				this.userRealName = item.userRealName;
				this.userPhoneNumber = item.userPhoneNumber;
				this.lastCheckTime = item.lastCheckTime;
				this.totalOrder = item.totalOrder;
				this.lastOrderTime = item.lastOrderTime;
				this.userTypeName = item.userTypeName;
				this.userNames = item.userName;
				this.userAccountNumbers = item.userAccountNumbers;
				this.liftList = item.receiverList;
				this.userId = item.userId;
				this.userDeptId = item.userDeptId;
				this.userInfo={
					userName:this.userNames,
					userRealName:this.userRealName,
					userPhoneNumber:this.userPhoneNumber,
					deptName:this.deptName,
					userAddress:this.userAddress,
					userDeptId:this.userDeptId,
          userSalesperson:this.userSalesperson
				};
				for(let items of item.orderList) {
					if(items.orderOtherCost) {
						let newCost = JSON.parse(items.orderOtherCost);
						items.serviceFee = newCost.serviceFee;
						items.deliveryFee = newCost.deliveryFee;
						items.upstairsFee = newCost.upstairsFee;
					}
					if(items.orderStatus == 1) {
						items.newStatus = '待配送';
					} else if(items.orderStatus == 2) {
						items.newStatus = '配送中';
					} else if(items.orderStatus == 3) {
						items.newStatus = '已完成';
					} else if(items.orderStatus == -1) {
						items.newStatus = '已取消';
					}

				}
				this.gasList = item.orderList;
				if(this.gasList.length > 5) {
					let lens = 40;
					if(this.liftList.length) {
						lens = 32 * this.liftList.length;
					} else {
						lens = 40;
					}
					this.orderHeight = this.screeHeight - 420 - lens;
				} else {
					this.orderHeight = 'auto';
				}
			},
			handleClose() {
				this.$router.go(-1);
			}
		},
		mounted() {

		}
	}
</script>

<style type="text/css" scoped>
	.callCenterMain {
		background: #fff;
		min-height: calc(100% - 10px);
		margin-right: 10px;
		position: relative;
	}
	
	.callCenterTop {
		border-bottom: 1px solid #ccc;
		height: 44px;
		margin: 0 10px;
		padding-top: 5px;
		text-align: left;
		color: #000;
	}
	
	.telTitle {
		font-size: 18px;
		color: #000;
		float: left;
		line-height: 32px;
		height: 32px;
		font-weight: 500;
		/*font-family: "微软雅黑";*/
	}
	
	.telTitle>>>.ivu-input {
		font-size: 16px;
		color: #0a0ebc;
	}
	
	.telRight {
		float: right;
		margin-top: 5px;
	}
	
	.telLabel {
		margin: 0 10px 0 30px;
	}
	
	.weitCount {
		color: #f00;
	}
	
	.iconClose {
		font-size: 24px;
		color: #1296db;
		cursor: pointer;
		margin-left: 60px;
	}
	
	.callCenterContent {
		display: flex;
		text-align: left;
	}
	
	.callCenterContentLeft {
		width: calc(100% - 320px);
		/*background:#ADC6FF;*/
		padding: 10px 20px 0;
	}
	
	.callCenterContentRight {
		width: 320px;
		background: #3be8140a;
	}
	
	.contentLeftTop {
		display: flex;
		justify-content: space-between;
	}
	
	.contentLeftTop div {
		/* min-width: 240px; */
		line-height: 24px;
	}
	
	.contentLeftInfo {
		display: flex;
		justify-content: space-between;
	}
	
	.contentLeftInfo div {
		width: 30%;
		line-height: 24px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.infoLabel {
		display: inline-block;
		width: 75px;
		text-align: right;
	}
	
	.callCenterMain>>>.ivu-table td {
		height: 32px;
	}
	
	.contentRightTitle {
		font-weight: 600;
		padding: 10px;
	}
	
	.searchInput>>>.ivu-input {
		height: 28px;
	}
	
	.contentRightInfo {
		position: relative;
		height: calc(100vh - 270px);
		overflow: hidden;
		overflow-y: auto;
	}
	
	.rightInfoList {
		border-radius: 4px;
		min-height: 90px;
		width: 290px;
		margin: 10px auto 10px;
		padding: 8px;
		cursor: pointer;
	}
	
	.checkList {
		background: #2b85e4;
		color: #fff;
	}
	
	.callCenterMain>>>.ivu-table-cell {
		padding: 0 4px;
	}
	
	.listItem {
		line-height: 24px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>