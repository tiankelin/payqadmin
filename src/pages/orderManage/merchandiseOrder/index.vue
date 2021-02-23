<template>
  <div class="main conMain">

    <div class='mainTop'>
      <Form :model="formSearch" inline :label-width="75">
        <FormItem label="所属组织">
          <Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format"
            style="width:186px"></Cascader>
        </FormItem>
        <FormItem label="联系人">
          <Input v-model="formSearch.userName" placeholder="请输入用户姓名"></Input>
        </FormItem>
        <!--<FormItem label="企业/商户">
        	<Input v-model="formSearch.companyName" placeholder="请输入企业/商户"></Input>
        </FormItem>-->
        <FormItem label="联系方式">
          <Input v-model="formSearch.userPhone" placeholder="请输入联系方式"></Input>
        </FormItem>
         <FormItem label="客户类型">
          <Select v-model="formSearch.userType" style="width:186px" clearable placeholder="请选择客户类型">
            <Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="配送员">
          <Select v-model="formSearch.deliveryUserId" filterable style="width:186px;" placeholder="请选择配送员" clearable>
            <Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="订单状态">
          <Select v-model="formSearch.orderStatus" style="width:186px" clearable placeholder="请选择订单状态">
            <Option :value='1'>待配送</Option>
            <!--<Option :value='2'>配送中</Option>-->
            <Option :value='3'>已完成</Option>
            <Option :value='-1'>已取消</Option>
          </Select>
        </FormItem>

        <FormItem label="订单来源">
          <Select v-model="formSearch.orderCreateType" style="width:186px" clearable placeholder="请选择订单来源">
            <Option :value='1'>用户触卡</Option>
            <Option :value='2'>大数据</Option>
            <Option :value='3'>电话</Option>
            <Option :value='4'>上门触卡</Option>
            <!--<Option :value='5'>APP下单</Option>-->
            <Option :value='6'>管理员生成</Option>
          </Select>
        </FormItem>


        <FormItem label="地址">
          <Input v-model="formSearch.orderAddress" placeholder="请输入地址"></Input>
        </FormItem>
        <!-- <FormItem label="完成时间" class='dateLabel'>
          <Date-picker format="yyyy-MM-dd HH:mm" v-model='formSearch.dateTime' type="datetimerange" placement="bottom-start"
            placeholder="选择日期" @on-change="timeChange" style="width:186px"></Date-picker>
        </FormItem> -->
        <FormItem label="开始时间">
          <DatePicker style='width: 186px;' type="datetime" placeholder="订单完成开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker style='width: 186px;' type="datetime" placeholder="订单完成结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click='handleSearch' style="margin-right: 20px;">查询</Button>
          <Button type="success" @click='handleAdd' v-has='634' style="margin-right: 20px;">新增</Button>
          <Button type="warning" @click='handlExport' v-has='1028'>一键导出</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent">
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
          <Button type="primary" size="small" @click="orderFinished(row.orderId)" v-if='row.orderStatus==1||row.orderStatus==2'
            v-has='801'>完成</Button>
          <Button type="info" size="small" @click="getOrderInfo(row.orderId)" style="margin:0 5px" v-has='633'>详情</Button>
          <Button type="warning" size="small" @click="orderCancel(row.orderId)" v-if='row.orderStatus==1' v-has='929'>取消</Button>
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
    <cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>
    <cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylMap from '@/pages/comComponent/cylMaps';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
   // import { dragTable } from '@/public/dragtable'
	export default {
		name: 'merchandiseOrder',
		components: {
			cylMap,
			cylInfo
		},
		data() {
			return {
				userTypeList:[],
				specArray:[],
				infoSee:false,
				tags: '',
				startTime:null,
				endTime:null,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				langs: '',
				lats: '',
				addressInfo: false,
				staffNameList: [],
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				count: 0,
				curpage: 1,
				pagesSize: 10,
				loading: false,
				dataList: [],
				formSearch: {
					organize: '',
					orderStatus: '',
					orderCreateType: '',
					deliveryUserId: '',
					userName: '',
					companyName: '',
					userPhone: '',
					orderAddress: '',
					dateTime:[],
					userType:''
				},
				columns: [{
          title: '序号',
          key: 'newIndex',
          width: 100,
          align: 'center',
          fixed:'left',
        },
          {
						title: '定位',
						key: 'carType',
						align: 'center',
						width: 75,
						fixed:'left',
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

					},
          {
          	title: '订单号',
          	key: 'orderCode',
          	width: 300,
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
						width: 200,
						align: 'center',
						tooltip: true,
            resizable: true,
					},
					{
						title: '联系人',
						key: 'orderUserName',
						width: 140,
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
						title: '客户类型',
						key: 'userTypeName',
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
          		title: '地址',
          		key: 'orderUserAddress',
          		width: 300,
          		align: 'center',
          		tooltip: true,
              resizable: true,
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
//					{
//						title: '钢瓶总数',
//						key: 'orderBottleQuantity',
//						width: 140,
//						align: 'center',
//					},
//					{
//						title: '50KG',
//						key: 'bottle50KG',
//						width: 100,
//						align: 'center',
//					},
//					{
//						title: '15KG',
//						key: 'bottle15KG',
//						width: 100,
//						align: 'center',
//					},
//					{
//						title: '5KG',
//						key: 'bottle5KG',
//						width: 100,
//						align: 'center',
//					},
					{
						title: '配送瓶数',
						key: 'fullBottleCount',
						minWidth: 100,
						align: 'center',
					},
					{
						title: '配送瓶电子标签编码',
						key: 'fullBottleTag',
						width: 320,
						align: 'center',
						slot:'fullBottleTag',
            resizable: true,
					},
					{
						title: '配送瓶钢瓶条码',
						key: 'fullBottleCode',
						width: 320,
						align: 'center',
						slot:'fullBottleCode',
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
						width:320,
						align: 'center',
						slot:'emptyBottleTag',
            resizable: true,
					},
					{
						title: '回收瓶钢瓶条码',
						key: 'emptyBottleCode',
						width:320,
						align: 'center',
						slot:'emptyBottleCode',
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
      //改变结束时间
        changeEndTime(v){
        	if(v){
        		let ends=v.substring(v.length-8);
        		let starts=v.substring(0,11);
        		if(ends=='00:00:00'){
        			this.endTime=starts+'23:59:59';
        		}else{
        			this.endTime=v;
        		}
        	}
        },
      //改变起始时间
        changeStartTime(v){
            this.startTime=v;

        },
			//添加行class
			rowClassName(row, index) {
				if(row.errArr&&row.errArr.length) {
					return 'errLine'
				}
				return '';
			},
			getBottleDetail(code){
				if(code){
					this.tags=code;
					this.infoSee=true;
				}
			},
			//关闭钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},
		//导出订单
			handlExport(){
//				window.location.href=`${pathUrls.orderDetailExportList}
//							?finishStartTime=${this.startTime?this.common.conformatDat(this.startTime,true):''}
//							&finishEndTime=${this.endTime?this.common.conformatDat(this.endTime,true):''}
//							&deptId=${this.formSearch.organize?this.formSearch.organize:this.userData.deptId}
//							&orderStatus=${this.formSearch.orderStatus}
//							&orderCreateType=${this.formSearch.orderCreateType}
//							&deliveryUserId=${this.formSearch.deliveryUserId}
//							&userName=${this.formSearch.userName}
//							&companyName=${this.formSearch.companyName}
//							&userPhone=${this.formSearch.userPhone}
//							&orderAddress=${this.formSearch.orderAddress}`;
			_http.http5('get', pathUrls.orderDetailExportList, {
           'deptId': this.formSearch.organize,
           'orderStatus': this.formSearch.orderStatus,
           'orderCreateType': this.formSearch.orderCreateType,
           'deliveryUserId': this.formSearch.deliveryUserId,
           'userName': this.formSearch.userName,
           'companyName': this.formSearch.companyName,
           'userPhone': this.formSearch.userPhone,
           'orderAddress': this.formSearch.orderAddress,
           'finishStartTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
           'finishEndTime':this.endTime?(this.common.conformatDat(this.endTime,true)):''
         }).then(res=>{
                      if (res) {
                                const xlsx = 'application/vnd.ms-excel'
                                const blob = new Blob([res], { type: 'application/vnd.ms-excel'})
                                let url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
                                a.href = url
                                a.download = 'fileName.xls'
                                a.click()
                                window.URL.revokeObjectURL(url);
                                a.remove()
                              } else {
                                this.$message.error('导出失败')
                              }
         })
			},

			//查看地图定位
			handleAdSee(data) {
				this.addressInfo = data
			},
			//获取订单列表
			getOrderList() {
				this.loading = true;
				this.specArray=[];
				_http.http1('post', pathUrls.orderList, {
					'page': this.curpage,
					"limit": this.pagesSize,
					'deptId': this.formSearch.organize,
					'orderStatus': this.formSearch.orderStatus,
					'orderCreateType': this.formSearch.orderCreateType,
					'deliveryUserId': this.formSearch.deliveryUserId,
					'userName': this.formSearch.userName,
					'orderUserType': this.formSearch.userType,
					'companyName': this.formSearch.companyName,
					'userPhone': this.formSearch.userPhone,
					'orderAddress': this.formSearch.orderAddress,
					'finishStartTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
					'finishEndTime':this.endTime?(this.common.conformatDat(this.endTime,true)):''
				}, 'form').then((res) => {
					this.loading = false;
					for(let [item, index] of new Map(res.data.map((item, i) => [item, i]))) {
						if(item.orderLng){
							item.carType = require('../../../../src/assets/images/ad.png');
						}else{
							item.carType='';
						}
						if(item.orderStatus == 1) {
							item.newOrderStatus = '订单已分配'
						} else if(item.orderStatus == 2) {
							item.newOrderStatus = '配送中'
						} else if(item.orderStatus == 3) {
							item.newOrderStatus = '订单完成'
						} else if(item.orderStatus == -1) {
							item.newOrderStatus = '订单取消'
							item.orderFinishTime=item.orderCancelTime
						}
						if(item.orderBottleSpecification) {
							let newSpecification = JSON.parse(item.orderBottleSpecification)
							item.bottle5KG = newSpecification.bottle5KG
							item.bottle15KG = newSpecification.bottle15KG
							item.bottle50KG = newSpecification.bottle50KG
						} else {
							item.bottle5KG = 0
							item.bottle15KG = 0
							item.bottle50KG = 0
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
							item.fullExtend=[];
							item.emptyExtend=[];
							if(item.orderExtends){
								let newExtends=item.orderExtends;
								for(let items of newExtends){
							if(items.extendBottleType==1){
								item.fullExtend.push(items);
							}else{
								item.emptyExtend.push(items);
							}

						}
							}

							item.fullBottleCount=item.fullExtend.length;
							item.emptyBottleCount=item.emptyExtend.length;
							item.newOrderUserCompanyName=item.orderUserCompanyName?item.orderUserCompanyName:item.orderUserName;
              item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);
					}
					this.dataList = res.data;
					this.count = res.count;
					if(this.dataList.length > 10) {
						this.tableHeight=this.screeHeight-300;
					} else {
						this.tableHeight='auto';
					}
					this.specArray=res.specCount;

				}).catch(()=>{
					this.loading = false;
				})
			},
			//点击完成
			orderFinished(id) {
				this.$Modal.confirm({
					title: '是否完成？',
					content: '',
					onOk: () => {
						_http.http1('get', `${pathUrls.finishOrder}/${id}`, 'form').then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '已完成订单!',
									onClose: (() => {
										this.getOrderList()
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
			//点击取消
			orderCancel(id){
			this.$Modal.confirm({
					title: '是否取消？',
					content: '',
					onOk: () => {
						_http.http1('get', `${pathUrls.orderCancel}/${id}`, 'form').then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '订单已取消!',
									onClose: (() => {
										this.getOrderList()
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
			//详情
			getOrderInfo(id) {
				this.$router.push('/merchandiseOrder/orderInfo' + '/' + id+'/2')
			},
			//查询
			handleSearch() {
				this.curpage = 1;
				this.getOrderList();
			},
			//新增
			handleAdd() {
				this.$router.push('/merchandiseOrder/orderAdd');
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
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				//				console.log(labels, selectedData)
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			changeCascader(value, selectedData) {
				if(value.length) {
					 let id= value[value.length - 1];
					    this.formSearch.organize=id;
              this.common.getStaffName(id).then((res) => {
             	     this.staffNameList = res.data
             })
				} else {
					   this.formSearch.organize = '';
             this.common.getStaffName(this.userData.deptId).then((res) => {
             	    this.staffNameList = res.data
             })
				}

			},
		},
		activated() {
				this.getOrderList();
      },
		mounted() {
      // let dom = this.$refs.table.$refs.header.getElementsByTagName("th");
      // dragTable(this,dom);
			this.formSearch.dateTime=this.common.getStartEndTime(true);
			this.startTime=this.formSearch.dateTime[0];
			this.endTime=this.formSearch.dateTime[1];
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.common.getQueryStaffList(this.userData.deptId).then((res) => {
				this.staffNameList = res.data
			})
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.userTypeList = res.data;
			})
			// this.getOrderList()
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
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }

  .mainContent>>>.ivu-table td {
    height: 40px;
  }

  /* .mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	} */
  .mainTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
  }

  .main>>>.ivu-table .errLine {
    color: #f00;
    /*background: #f00;*/
  }
</style>
