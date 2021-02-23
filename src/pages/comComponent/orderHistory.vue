<template>
  <div class="orderMain">
    <div class="orderContent">
      <div class="orderTitle">
        历史购气
      </div>
      <div class="closeWrapper" @click='handleClose'>
        <Icon type="md-close" />
      </div>

      <div>
        <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'
          :rowClassName="rowClassName" ref='table'>
          <template slot-scope="{ row, index }" slot="newStatus">
            <span v-if='row.orderStatus==1&&row.notComplete<=3' style='color:#FFC125'>{{row.newOrderStatus}}</span>
            <span v-else-if='row.orderStatus==2&&row.notComplete<=3' style='color:#5CACEE'>{{row.newOrderStatus}}</span>
            <span v-else-if='row.orderStatus==3&&row.notComplete<=3' style='color:#32CD32'>{{row.newOrderStatus}}</span>
            <span v-else-if='row.orderStatus==-1&&row.notComplete<=3' style='color:#B5B5B5'>{{row.newOrderStatus}}</span>
            <span v-else style='color:#f00'>{{row.newOrderStatus}}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fullBottleTag">
            <span v-if='item.extendBottleNfcId' @click="getBottleDetail(item.extendBottleNfcId)" v-for='item in row.fullExtend'
              :key='item' style="margin: 0 5px;display: inline-block;color:#EE6515;cursor: pointer;" :title='item.extendBottleSpec'>{{item.extendBottleNfcId}}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fullBottleCode">
            <span @click="getBottleDetail(item.extendBottleCode)" v-for='item in row.fullExtend' :key='item' style="margin: 0 5px;display: inline-block;color:#1BA060;cursor: pointer;"
              :title='item.extendBottleSpec'>{{item.extendBottleCode}}</span>
          </template>
          <template slot-scope="{ row, index }" slot="emptyBottleTag">
            <span v-if='item.extendBottleNfcId' @click="getBottleDetail(item.extendBottleNfcId)" v-for='item in row.emptyExtend'
              :key='item' style="margin: 0 5px;display: inline-block;color:#EE6515;cursor: pointer;" :title='item.extendBottleSpec'>{{item.extendBottleNfcId}}</span>
          </template>
          <template slot-scope="{ row, index }" slot="emptyBottleCode">
            <span @click="getBottleDetail(item.extendBottleCode)" v-for='item in row.emptyExtend' :key='item' style="margin: 0 5px;display: inline-block;color:#1BA060;cursor: pointer;"
              :title='item.extendBottleSpec'>{{item.extendBottleCode}}</span>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="info" size="small" @click="getOrderInfo(row.orderId)" style="margin:0 5px">详情</Button>
          </template>
        </Table>
        <div class="pageMain">
          <Page style='width: 45%;white-space: nowrap;' :total="count" show-sizer show-total show-elevator size="small"
            @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
          <div style="line-height: 28px;font-size: 13px;text-align: right;width: 55%;font-weight: 600;">
            <div style="margin: 0 5px;display: inline-block;" v-for='item in specArray' :key='item' v-if='item.bottleSpec&&item.bottleSpec!="null"'>
              {{item.bottleSpec}}：【<span v-if='item.bottleType1num' style="color: #0000FF;">配送:{{item.bottleType1num}}</span>
              <span v-if='item.bottleType2num' style="color: #DB4912;">回收:{{item.bottleType2num}}</span>】
            </div>
          </div>
        </div>

      </div>
    </div>
    <cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>
    <cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylMap from '@/pages/comComponent/cylMaps';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default {

		name: 'orderHistory',
		components: {
			cylMap,
			cylInfo
		},
		props: {
			userId: Number
		},
		data() {
			return {
				specArray: [],
				infoSee: false,
				tags: '',
				startTime: null,
				endTime: null,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				langs: '',
				lats: '',
				addressInfo: false,
				staffNameList: [],
				userData: (JSON.parse(this.$store.state.userData)),
				count: 0,
				curpage: 1,
				pagesSize: 10,
				loading: false,
				dataList: [],

				columns: [
				{
						title: '定位',
						key: 'carType',
						align: 'center',
						width: 75,
						fixed: 'left',
						render: (h, params) => {
							let that = this
							return h('img', {
								attrs: {
									src: params.row.carType
								},
								style: {
									cursor: 'pointer'
								},
								on: {
									click() {
										that.langs = params.row.orderLng
										that.lats = params.row.orderLat
										that.addressInfo = true
									}
								}
							}, params.row.carType);

						}

					},{
						title: '序号',
						key: 'newIndex',
						width: 100,
						align: 'center',
						fixed: 'left',
					},

					{
						title: '地址',
						key: 'orderUserAddress',
						minWidth: 300,
						align: 'center',
						tooltip: true,
						resizable: true,
					},
					{
						title: '订单号',
						key: 'orderCode',
						minWidth: 300,
						align: 'center',
						resizable: true,
					},
					{
						title: '所属组织',
						key: 'orderDeptName',
						minWidth: 300,
						align: 'center',
						tooltip: true,

					},
					{
						title: '客户名称',
						key: 'newOrderUserCompanyName',
						minWidth: 200,
						align: 'center',
						tooltip: true,
						resizable: true,
					},
					{
						title: '联系人',
						key: 'orderUserName',
						minWidth: 140,
						align: 'center',
						resizable: true,
					},

					{
						title: '联系方式',
						key: 'orderUserPhone',
						minWidth: 150,
						align: 'center',
					},
					{
						title: '配送员',
						key: 'orderDeliveryUserName',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '订单状态',
						key: 'newOrderStatus',
						slot: 'newStatus',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '订单创建时间',
						key: 'orderCreateTime',
						minWidth: 180,
						align: 'center',
					},
					{
						title: '订单完结时间',
						key: 'orderFinishTime',
						minWidth: 180,
						align: 'center',
					},

					{
						title: '配送瓶数',
						key: 'fullBottleCount',
						minWidth: 100,
						align: 'center',
					},
					{
						title: '配送瓶电子标签编码',
						key: 'fullBottleTag',
						width: 400,
						align: 'center',
						slot: 'fullBottleTag',
						resizable: true,
					},
					{
						title: '配送瓶钢瓶条码',
						key: 'fullBottleCode',
						width: 400,
						align: 'center',
						slot: 'fullBottleCode',
						resizable: true,
					},
					{
						title: '回收瓶数',
						key: 'emptyBottleCount',
						minWidth: 100,
						align: 'center',
					},
					{
						title: '回收瓶电子标签编码',
						key: 'emptyBottleTag',
						width: 400,
						align: 'center',
						slot: 'emptyBottleTag',
						resizable: true,
					},
					{
						title: '回收瓶钢瓶条码',
						key: 'emptyBottleCode',
						width: 400,
						align: 'center',
						slot: 'emptyBottleCode',
						resizable: true,
					},
					{
						title: '订单来源',
						key: 'newOrderCreateType',
						minWidth: 170,
						align: 'center',
						tooltip: true,
					}, {
						title: '操作',
						slot: 'action',
						fixed: 'right',
						width: 200,
						align: 'center'
					}
				],
			}
		},
		methods: {
			//关闭
			handleClose(){
				this.$emit('orderInfo',false);
			},
			//添加行class
			rowClassName(row, index) {
				if(row.errArr && row.errArr.length) {
					return 'errLine'
				}
				return '';
			},
			getBottleDetail(code) {
				if(code) {
					this.tags = code;
					this.infoSee = true;
				}
			},
			//关闭钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},

			//查看地图定位
			handleAdSee(data) {
				this.addressInfo = data
			},
			//获取订单列表
			getOrderList() {
				this.loading = true;
				this.specArray = [];
				_http.http1('post', pathUrls.queryOrderListByUserId, {
					'page': this.curpage,
					"limit": this.pagesSize,
					"userId": this.userId
				}, 'form').then((res) => {
					this.loading = false;
					for(let [item, index] of new Map(res.data.map((item, i) => [item, i]))) {
						if(item.orderLng) {
							item.carType = require('../../../src/assets/images/ad.png');
						} else {
							item.carType = '';
						}
						if(item.orderStatus == 1) {
							item.newOrderStatus = '订单已分配'
						} else if(item.orderStatus == 2) {
							item.newOrderStatus = '配送中'
						} else if(item.orderStatus == 3) {
							item.newOrderStatus = '订单完成'
						} else if(item.orderStatus == -1) {
							item.newOrderStatus = '订单取消'
							item.orderFinishTime = item.orderCancelTime
						}

						switch(item.orderCreateType) {
							case 1:
								item.newOrderCreateType = '用户触卡';
								break;
							case 2:
								item.newOrderCreateType = '大数据';
								break;
							case 3:
								item.newOrderCreateType = '电话';
								break;
							case 4:
								item.newOrderCreateType = '上门触卡';
								break;
							case 5:
								item.newOrderCreateType = 'APP下单';
								break;
							case 6:
								item.newOrderCreateType = '管理员生成';
								break;
						}
						item.fullExtend = [];
						item.emptyExtend = [];
						if(item.orderExtends) {
							let newExtends = item.orderExtends;
							for(let items of newExtends) {
								if(items.extendBottleType == 1) {
									item.fullExtend.push(items);
								} else {
									item.emptyExtend.push(items);
								}

							}
						}

						item.fullBottleCount = item.fullExtend.length;
						item.emptyBottleCount = item.emptyExtend.length;
						item.newOrderUserCompanyName = item.orderUserCompanyName ? item.orderUserCompanyName : item.orderUserName;
						item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);
					}
					this.dataList = res.data;
					this.count = res.count;
					if(this.dataList.length > 5) {
						this.tableHeight = this.screeHeight - 175;
					} else {
						this.tableHeight = 'auto';
					}
					this.specArray = res.specCount;

				})
			},

			//详情
			getOrderInfo(id) {				
				if(this.$route.path.indexOf('/merchandiseOrder/orderInfo')!=-1){					
					this.$emit('orderInfo',false);
				}
				this.$router.push('/merchandiseOrder/orderInfo' + '/' + id + '/2')
			},

			//改变页数
			pageChange(current) {
				this.curpage = current;
				this.getOrderList();
			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.getOrderList();
			},

		},
		mounted() {
			this.getOrderList()
		}
	}
</script>

<style type="text/css" scoped>
  .orderMain {
    background: rgb(41, 107, 126);
    position: fixed;
    left: 200px;
    top: 65px;
    right: 10px;
    bottom: 10px;
    z-index: 1001;
  }

  .orderTitle {
    height: 35px;
  }

  .orderContent {
    width: calc(100% - 0px);
    height: calc(100% - 0px);
    background: #fff;
    /* border-radius: 4px; */
    padding: 10px;
    /*margin: 5px;*/
    position: relative;
    text-align: left;
  }

  .closeWrapper {
    position: absolute;
    right: 12px;
    top: 0px;
    font-size: 32px;
    cursor: pointer;
    color: #1296db;
    font-weight: 600;
  }

  .pageMain {
    text-align: left;
    margin-top: 10px;
    padding-left: 10px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }

  .orderMain>>>.ivu-table .errLine {
    color: #f00;
  }
</style>
