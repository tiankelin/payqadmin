<template>
  <div class='mainWrapper' v-if='userData.dept.category!=2'>
    <div class=main>

      <div class="topTitle">
        <h3>钢瓶详细信息</h3>
      </div>
      <div class='contentTop'>
        <Form ref="formInline" :model="formInfo" inline :label-width="96">
          <FormItem label="电子标签编码" class='cylTags'>
            <Input v-model="formInfo.cylTags" disabled />
          </FormItem>
          <FormItem label="钢瓶条码">
            <Input v-model="formInfo.cylcodes" disabled />
          </FormItem>
          <!--          <FormItem label="钢瓶ID">
              <Input v-model="formInfo.cylId" disabled/>
          </FormItem>
 -->
          <FormItem label="出厂编号">
            <Input v-model="formInfo.cylNumbers" disabled />
          </FormItem>
          <FormItem label="建档站点" class='cylSites'>
            <Input v-model="formInfo.cylSites" disabled />

          </FormItem>
          <FormItem label="钢瓶规格">
            <Input v-model="formInfo.cylSpecs" disabled />
          </FormItem>
          <FormItem label="流转类型">
            <Select v-model="formInfo.cylCircul" style="width: 150px;" clearable>
              <Option :value="1">在库</Option>
              <Option :value="2">在途</Option>
              <Option :value="3">在用</Option>
            </Select>
          </FormItem>
          <FormItem label="开始时间">
            <DatePicker type="date" placeholder="开始时间" style="width:150px" v-model='startTime' format="yyyy-MM-dd"
              @on-change='changeStartTime'></DatePicker>
          </FormItem>
          <FormItem label="结束时间">
            <DatePicker type="date" placeholder="结束时间" style="width:150px" v-model='endTime' format="yyyy-MM-dd"
              @on-change='changeEndTime'></DatePicker>
          </FormItem>
          <FormItem class='searchForm'>
            <Button type="info" @click='handleSearch'>查询</Button>
          </FormItem>
        </Form>
      </div>
      <div class='contentMiddle'>
        <Table :columns="infoColumn" :data="infoData1" :height="infoHeight" :loading='loading'>
          <template slot-scope="{ row, index }" slot="orderCode">
            <span class='orderCode' :title='row.orderCode' @click='handleOrderInfo(row.orderCode)'>{{row.orderCode}}</span>
          </template>
        </Table>
      </div>
      <div class='contentMiddle'>
        <Table :columns="filColumn" :data="filData" style="margin-top: 5px;" :loading='loading'></Table>
      </div>
      <div style="text-align: left;padding-left: 20px;color: #13C2C2;height: 24px;line-height: 24px;margin-top: 5px;">
        <span style="margin-right: 10px;font-weight: 600;">历史流转</span>
        <i-switch v-model="switchs" size="large" false-color="#67c23a" true-color='#f37979' @on-change='switchChange'>
          <span slot="open">图文</span>
          <span slot="close">表格</span>
        </i-switch>
        <span style="color: #E6A23C;margin-left: 5px;">(默认显示该钢瓶近10条记录)</span>
      </div>

      <div class='contentBottom1' style="display: flex;" v-if='switchs'>
        <!--:class="[item.bottleIsFull==0?'circleCylinderGree':'circleCylinder']"-->
        <div v-for='(item,index) in infoData' :key='item.id' :class="[(item.flowType==4||item.flowType==5||(item.flowType==3&&item.actionType==0))?'circleCylinderGree':'circleCylinder']">
          <div style="width: 120px;height: 130px;background: #fff;border-radius: 20px;padding-top: 10px;" :class="[item.flowType==1||item.flowType==5?'itemStyle1':'commonStyle',item.flowType==3?'itemStyle2':'commonStyle']">
            <!--<div>{{item.bottleTag}}</div>-->
            <div style="font-weight: 600;">{{item.flowPoint?item.flowPoint:item.newFlow}}</div>
            <div>{{item.personLiableName}}<span v-if='item.carNumber'>-</span>{{item.carNumber}}</div>
            <div>{{item.newTime}}</div>
            <div style="　display: -webkit-box;-webkit-box-orient: vertical;　-webkit-line-clamp:2;overflow: hidden;cursor: pointer;padding: 0 2px 0 0;"
              :title="item.address" @click='showMapClick(item)'>
              <img :src="item.carType" alt="" style="height: 16px;width: auto;" />
              {{item.address}}
            </div>
          </div>
          <div v-if='index!=(infoData.length-1)' style="position: absolute;right:-20px;top: 90px;z-index: 100;"><img
              src="../../assets/images/jt.png" alt="" style="width: 40px;height: 40px;" /></div>
        </div>
      </div>
      <div class='contentBottom' v-else>
        <Table :columns="floColumn" :data="infoData" :height="detailHeight" id='tableId'>
          <template slot-scope="{ row, index }" slot="newFlow">
            <span>{{row.flowPoint?row.flowPoint:row.newFlow}}</span>
          </template>
        </Table>
      </div>




      <div class="closeBtn" @click='handleClose'>
        <Icon type="md-close" />
      </div>
      <div class="reloadInfo" @click="reloadClick">
        <img src="@/assets/images/reload.png" alt="" />
      </div>
    </div>
    <cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>

  </div>

</template>

<script>
  import Bus from '@/public/bus';
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylMap from './cylMap';

	export default {
		name: 'cylinderInfo',
		components: {
			cylMap,

		},
		data() {
			return {
        startTime:'',
        endTime:'',
        screeHeight: document.documentElement.clientHeight, // 屏幕高
        detailHeight:'auto',
				loading:false,
        floColumn:[{
						title: '钢瓶流转状态',
						align: 'center',
						key: 'newFlow',
						tooltip: true,
            slot:'newFlow'
					},
					{
						title: '流转时间',
						align: 'center',
						key: 'time',
						tooltip: true,
						sortable: true,

					},
          // {
          // 	title: '动作',
          // 	align: 'center',
          // 	key: 'actionTypeName',
          // 	tooltip: true,


          // },
					{
						title: '责任人',
						align: 'center',
						key: 'personLiableName',
						tooltip: true,
					},
					{
						title: '车牌号',
						align: 'center',
						key: 'carNumber',
						tooltip: true,
					},
					{
						title: '流转地点',
						align: 'center',
						key: 'address',

						tooltip: true,
					}, {
						title: '地图',
						key: 'carType',
						align: 'center',
						width: '75',
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
										that.langs = params.row.lng
										that.lats = params.row.lat
										that.addressInfo = true
									}
								}
							}, params.row.carType);

						}

					},],
				filData:[],
				infoHeight:'auto',
        topArray:[],
        bottomArray:[],
        topCount:1,
        bottomCount:1,
				userData: (JSON.parse(this.$store.state.userData)),
				switchs:true,
				infoData2:[],
        infoData1:[],
				bottleShow:false,
				langs: '',
				lats: '',
				addressInfo: false,
				formInfo: {
					cylTags: '',
					cylcodes: '',
					cylNumbers: '',
					cylSites: "",
					cylSpecs: '',
					cylStatus: '',
					cylCircul: null,
					cylLiable: '',
					dateTime:[],
					cylCircle:0,
					cylCirculName:'',
					cylLiableName:'',
          			cylId:''
				},
				startTime:null,
				endTime:null,
				infoColumn: [

					{
						title: '订单编号',
						align: 'center',
						key: 'orderCode',
						tooltip: true,
						slot:'orderCode'
					},
					{
						title: '联系人',
						align: 'center',
						key: 'orderUserName',

						tooltip: true,
					},
					{
						title: '订单完结时间',
						align: 'center',
						key: 'orderFinishTime',
						tooltip: true,
					},
					{
						title: '地址',
						align: 'center',
						key: 'orderUserAddress',

						tooltip: true,
					},

					{
						title: '联系方式',
						align: 'center',
						key: 'orderUserPhone',
						width:120,
						tooltip: true,
					},
//					{
//						title: '使用天数',
//						align: 'center',
//						key: 'diff',
//						width:90,
//
//					},
					{
						title: '配送员姓名',
						align: 'center',
						key: 'orderDeliveryUserName',

						tooltip: true,
					},
          {
          	title: '操作',
          	align: 'center',
          	key: 'bottleDeliveryStatusName',
            width:100,
          	tooltip: true,
          },

				],
				infoData: [],

				filColumn:[
					{
						title: '充装单位代码',
						key: 'stationCode',
						width: 140,
						align: 'center'
					},
					{
						title: '充装单位名称',
						key: 'stationName',
						minWidth: 280,
						align: 'center'
					},
					{
						title: '秤号',
						key: 'scaleNumber',
						width: 70,
						align: 'center'
					},

					{
						title: '充装开始时间',
						key: 'beginTime',
						width: 170,
						align: 'center',

					},
					{
						title: '充装结束时间',
						key: 'endTime',
						width: 170,
						align: 'center'
					},
//					{
//						title: '工号',
//						key: 'operatorCode',
//						width: 140,
//						align: 'center'
//					},
//					{
//						title: '操作工姓名',
//						key: 'operatorName',
//						// fixed:'right',
//						width: 140,
//						align: 'center'
//					},
					{
						title: '实际同步时间',
						key: 'actualTime',
						width: 170,
						align: 'center',
					},
					{
						title: '充装介质',
						key: 'fillMedium',
						width: 140,
						align: 'center',
					},
					{
						title: '实际充装量',
						key: 'realFill',
						width: 140,
						align: 'center',
					},
					{
						title: '停装模式',
						key: 'stopFillMode',
						width: 140,
						align: 'center',
					},
					{
						title: '充装模式',
						key: 'fillMode',
						width: 140,
						align: 'center',
					},
					{
						title: '设定量',
						key: 'setCapacity',
						width: 140,
						align: 'center',
					},
					{
						title: '充前量',
						key: 'beforeFill',
						width: 140,
						align: 'center',
					},
					{
						title: '充后量',
						key: 'afterFill',
						width: 140,
						align: 'center',
					},
					{
						title: '溢出量',
						key: 'overflow',
						width: 140,
						align: 'center',
					},
     //      {
					// 	title: '数据来源',
					// 	key: 'newDataSource',
					// 	width: 140,
					// 	align: 'center',
					// },
				]

			}
		},
		props: {
			tags: String
		},

		methods: {
      changeEndTime(v){
          this.endTime=v;

      },
      changeStartTime(v){
          this.startTime=v;
      },
      switchChange(v){
        if(!v){
           this.getInfoSearch(this.tags);
        }

      },
      handleSearch(){
      	 this.getInfoSearch(this.tags);
      },
      //订单详情跳转
      handleOrderInfo(v){
         let newPath=this.$route.path;
        if(newPath.indexOf('/merchandiseOrder/orderInfo')!=-1){
          this.$emit('infoSee', false)
        }
        this.$router.push('/merchandiseOrder/orderInfo' + '/' + v + '/1');


      },

      getInfoSearch(bottleCode){
      	 this.infoData=[];
      	_http.http1('post', pathUrls.bottleflowinfoListAll, {
      		bottleCode:bottleCode,
          beginTime: this.startTime?(this.startTime+' 00:00:00'):'',
          endTime: this.endTime?(this.endTime+' 23:59:59'):'',
      		flowType:this.formInfo.cylCircul,

      	}, 'form').then((res) => {
      		this.infoData=[];
      		if(res.code==0){
      			if(res.data.length){
      				for(let item of res.data) {
      				switch(item.flowType) {
      					case 1:
      						item.newFlow = "重瓶在库";

      						break;
      					case 2:
      						item.newFlow = "重瓶在途";

      						break;
      					case 3:
      						item.newFlow = "在用";

      						break;
      					case 4:
      						item.newFlow = "空瓶在途";

      						break;
      					case 5:
      						item.newFlow = "空瓶在库";

      						break;
      				}
              switch(item.actionType) {
              	case 0:
              		item.actionTypeName = "出";
              		break;
              	case 1:
              		item.actionTypeName = "进";
              		break;
              	case 2:
              		item.actionTypeName = "充装";
              		break;

              }
              if(item.flowType==5&&item.actionType==1){
                  item.flowPoint='空瓶在库'
              }
              if(item.flowType==1&&item.actionType==2){
                  item.flowPoint='充装'
              }
              if(item.flowType==1&&item.actionType==1){
                  item.flowPoint='重瓶在库'
              }
              if(item.flowType==2&&item.actionType==1){
                  item.flowPoint='重瓶在途'
              }
              if(item.flowType==2&&item.actionType==0){
                  item.flowPoint='重瓶离车'
              }
              if(item.flowType==3&&item.actionType==1){
                  item.flowPoint='重瓶发出'
              }
              if(item.flowType==3&&item.actionType==0){
                  item.flowPoint='空瓶回收'
              }
              if(item.flowType==4&&item.actionType==1){
                  item.flowPoint='空瓶在途'
              }
              if(item.flowType==4&&item.actionType==0){
                  item.flowPoint='空瓶离车'
              }

      				if(item.time){
      					item.newTime=item.time.substring(0,16);
      				}else{
      					item.newTime=null;
      				}
      				if(item.lng){
      				item.carType = require('../../../src/assets/images/ad.png');
      			}else{
      				item.carType='';
      			}

      			}

      			}
      			this.infoData =res.data;
      			if(this.infoData.length<=5){
      				this.detailHeight='auto'
      			}else{
              if(!this.switchs){
                this.detailHeight=this.screeHeight-document.getElementById('tableId').offsetTop-100;
              }

      			}
      			this.formInfo.cylCircle=this.infoData.length;
      		}

      	})
      },
      //刷新
	      reloadClick(){
            this.getCylinderInfo(this.tags);
	          this.getInfoSearch(this.tags);

	      },
	      //逆地理编码
	      regeocoder(lnglatXY,detail) {

	      	let that = this
	      	//逆地理编码
	      	var geocoder = new AMap.Geocoder({
	      		radius: 1000,
	      		extensions: "all"
	      	});

	      },
      //显示地图
			showMapClick(item){
				if(item.lng){
					this.langs = item.lng;
					this.lats =item.lat;

					this.addressInfo = true;
				}

			},
			handleAdSee(data) {
				this.addressInfo = data
			},
      //获取详情
			getCylinderInfo(bottleCode) {
            this.bottleShow=false;
		        this.topArray=[];
		        this.bottomArray=[];
		        this.filData=[];
		        this.infoData=[];
		        this.loading=true;
				_http.http1('get', pathUrls.bottleGetBottleDetail2 +'?bottleCode='+bottleCode, {

				}, 'form').then((res) => {
            this.loading=false;
            this.topArray=[];
            this.bottomArray=[];
					if(res.code === 0) {
						this.bottleShow=true
						if(res.bottleDetail.bottleInfo) {

							let infos = res.bottleDetail.bottleInfo;

							this.formInfo.cylTags = infos.bottleNfcId;
							this.formInfo.cylcodes = infos.bottleCode;
							this.formInfo.cylNumbers = infos.bottleFactoryCode;
							this.formInfo.cylSites = infos.createDeptName;
							this.formInfo.cylSpecs = infos.bottleSpecification;
							this.formInfo.cylLiable = infos.bottlePersonLiableName;

							this.formInfo.cylLiableName= infos.bottlePersonLiableName;
              this.formInfo.cylId= infos.bottleId;
							switch(infos.bottleStatus) {
								case -1:
									this.formInfo.cylStatus = "删除";
									break;
								case 1:
									this.formInfo.cylStatus = "正常";
									break;
								case 2:
									this.formInfo.cylStatus = "报废";
									break;
								case 3:
									this.formInfo.cylStatus = "注销";
									break;
								case 4:
									this.formInfo.cylStatus = "停用";
									break;
								case 5:
									this.formInfo.cylStatus = "转出";
									break;
								case 6:
									this.formInfo.cylStatus = "回退";
									break;
							}
							switch(infos.bottleFlowInformation) {
								case 1:
									this.formInfo.cylCirculName = "在库";


									break;
								case 2:
									this.formInfo.cylCirculName = "在途";

									break;
								case 3:
									this.formInfo.cylCirculName = "在用";

									break;
								case 4:
									this.formInfo.cylCirculName = "在途";

									break;
								case 5:
									this.formInfo.cylCirculName = "在库";

									break;
							}
						}


            this.bottomCount=this.bottomArray.length;






						if(res.bottleDetail.xkFillInfoList){
              for(let item of res.bottleDetail.xkFillInfoList){
                if(item.dataSource==1){
                  item.newDataSource='数据同步';
                }else if(item.dataSource==2){
                  item.newDataSource='本地上报';
                }else if(item.dataSource==3){
                  item.newDataSource='设备上报';
                }
              }
							this.filData=res.bottleDetail.xkFillInfoList;

						}

//						this.infoData2 =res.bottleDetail.flowInfos;
//						this.formInfo.cylCircle=this.infoData2.length;
						for(let item of res.bottleDetail.orders) {
							item.diff = parseInt((new Date().getTime() - new Date(item.orderFinishTime)) / (1000 * 60 * 60 * 24));
              // item.bottleDeliveryStatusName=item.bottleDeliveryStatus==1?'配送':'回收';
              if(item.bottleDeliveryStatus==1){
                 item.bottleDeliveryStatusName='配送';
              }else if(item.bottleDeliveryStatus==2){
                 item.bottleDeliveryStatusName='回收';
              }
						}
						this.infoData1 = res.bottleDetail.orders;
						if(this.infoData1.length<3){
							this.infoHeight='auto';
						}else{
							this.infoHeight=125;
						}

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
							onClose: (() => {
								this.$emit('infoSee', false)
							})
						});
					}
				})
			},
			handleClose() {
				this.$emit('infoSee', false)
			}
		},
    created(){
      if(this.userData.dept.category!=2){
        this.getCylinderInfo(this.tags)
        this.getInfoSearch(this.tags)
      }
      
    },
		mounted() {
    
			this.bottleShow=false;





		}
	}
</script>

<style type="text/css" scoped>
  .mainWrapper {
    position: fixed;
    left: 200px;
    top: 65px;
    right: 0px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1100;
    height: calc(100vh - 65px);
  }

  .main {
    background: #fff;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    /* margin: 0 0 20px 0; */
    /* border-radius: 4px; */
    overflow-y: auto;
  }

  .topTitle {
    text-align: left;
    height: 30px;
    line-height: 30px;
  }

  .topTitle h3 {
    font-size: 12px;
    margin: 0 20px;
    font-weight: 600;
    color: #51B5EA;
    border-bottom: 1px solid #51B5EA;

  }

  .closeBtn {
    position: absolute;
    right: 35px;
    top: -8px;
    cursor: pointer;
    font-size: 30px;
    color: #1296db;
    font-weight: 600;
  }

  .contentTop {
    text-align: left;
    padding: 10px 0 0 20px;
  }

  .contentMiddle {
    padding: 0 20px;
  }

  .contentBottom>>>th,
  .contentMiddle>>>th {
    font-size: 12px;
    background: #51B5EA;
    color: #fff;
    padding: 4px 0;
  }

  .contentBottom {
    margin-top: 10px;
    padding: 0 20px;
  }

  .contentBottom>>>td,
  .contentMiddle>>>td {
    font-size: 12px;
    height: 32px;
  }

  .contentBottom1 {
    margin: 10px 20px;
    /* padding-bottom:10px;		 */
    overflow: hidden;
    overflow-x: auto;
    min-height: 260px;
  }

  .main>>>.ivu-form-item {
    margin-bottom: 6px;
  }

  .main>>>.ivu-input {
    height: 28px;
  }

  .circleCylinder {
    width: 220px;
    height: 220px;
    background: #fff url('~@/assets/images/qp02.png') no-repeat center;
    background-size: 220px 230px;
    padding: 63px 50px;
    font-size: 12px;
    position: relative;
  }

  .circleCylinderGree {
    width: 220px;
    height: 220px;
    background: #fff url('~@/assets/images/gpgree.png') no-repeat center;
    background-size: 220px 220px;
    padding: 63px 50px;
    font-size: 12px;
    position: relative;
  }

  .main .itemStyle1 {
    color: rgb(69, 175, 34);
  }

  .main .itemStyle2 {
    color: rgb(0, 149, 255);
  }

  .commonStyle {
    color: #cc1abe;
  }

  .searchForm>>>label {
    width: 30px !important;
  }

  .searchForm>>>.ivu-form-item-content {
    margin-left: 30px !important;
  }

  .cylSites>>>.el-cascader {
    line-height: 30px;
  }

  .cylSites>>>.el-input__inner {
    height: 30px;
    line-height: 30px;
  }

  .main>>>.ivu-input[disabled] {
    color: #515a6e;
  }

  .main>>>.ivu-input-wrapper {
    width: 150px;
  }

  .dateLabel>>>.ivu-input-wrapper {
    width: 200px;
  }






  .reloadInfo {
    position: absolute;
    right: 75px;
    top: 5px;
    cursor: pointer;

  }

  .reloadInfo img {
    width: 20px;
    height: 20px;
  }

  .orderCode {
    cursor: pointer;
    color: #3aa72d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: inline-block;
  }
  .cylTags>>>.ivu-form-item-label{
    width: 96px!important;
  }
  .cylTags>>>.ivu-form-item-content{
    margin-left: 96px!important;
  }
</style>
