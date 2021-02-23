<template>
  <div class="carMain">
    <div class="mapInfoWrap" :class="[isDrawBack?'mapInfoWrap':'changMapInfoWrap']">
      <div class='carContainer' id='carContainer'>

      </div>
      <Spin fix v-if='spinShow' size="large"></Spin>
      <!--下方钢瓶详情-->
      <div :class="[isActive?'bottomInfo':'changBottomInfo']" v-if='showInfo'>
        <div class="titleList">
          <Tabs :animated="false" @on-click='handleChangeTabs' v-model='tabsInfo'>
            <TabPane label="车载瓶详情" tab='bottleInfo'>
              <Table :columns="fullInfoColumn" :data="fullInfoData" :height="[isActive?'150':newHeight]" :loading="loading1"
                ref=tables></Table>
            </TabPane>
            <!--<TabPane label="空瓶详情" tab='bottleInfo'>
							<Table :columns="fullInfoColumn" :data="fullInfoData" :height="[isActive?'150':newHeight]" :loading="loading1"></Table>
						</TabPane>-->
            <TabPane label="异常详情" tab='bottleInfo'>
              <Table :columns="abnorInfoColumn" :data="abnorInfoData" :height="[isActive?'150':newHeight]" tab='bottleInfo'
                :loading="loading1"></Table>
            </TabPane>
            <!--<TabPane label="已完成订单" tab='bottleInfo' v-if='vehicleType==1'>
							<Table :columns="infoColumn" :data="infoData" :height="[isActive?'150':'400']" width="100%" :loading="loading1"></Table>
						</TabPane>
						<TabPane label="未完成订单" tab='bottleInfo' v-if='vehicleType==1'>
							<Table :columns="infoColumn" :data="infoData" :height="[isActive?'150':'400']" :loading="loading1"></Table>
						</TabPane>-->

          </Tabs>
        </div>
        <div class='closeInfo' @click='closeInfoClick'>X</div>
        <div @click='enLargeClick' class="fullScreen"><img src="@/assets/images/fullScreen.png" alt="" /></div>
      </div>
      <div class='drawBack' @click='changeDrawBack'><img src="@/assets/images/right.png" alt="" v-if='isDrawBack' /><img
          src="@/assets/images/left.png" alt="" v-else /></div>
    </div>
    <!--左上侧搜索-->
    <!--<div id="myPageTop" style="position: absolute;left: 0;top:50px;z-index:200;background: #fff;height: 32px;line-height: 32px;">
			<label>地址地区：</label>
			<input type="text" id="tipinput" name='tipinput' style="width: 193px;border:0;border-radius: 4px;height: 26px;" placeholder="请输入关键字" />
		</div>-->
    <div id="tip" style="position: absolute;left: 0;top:50px;z-index:200;background: #fff;height: 32px;line-height: 32px;box-shadow: 0 2px 4px 0 #40a9ff4a;">
      <label>地址地区：</label>
      <input type="text" id="keyword" name="keyword" placeholder="请输入关键字：(选定后搜索)" onfocus='this.value=""' style="width: 193px;border:0;border-radius: 4px;height: 26px;" />
    </div>
    <div class='searchWrapper'>
      <!--<Input v-model="addressInfo" placeholder="请输入地址信息进行搜索" search @on-search='handleSearchArea'>
			<span slot="prepend">地址地区:</span>
			</Input>-->
      <!--<div class='areaInfo' v-if='areaInfoShow'>
				<Table :columns="areaColum" :data="baseData1" :showHeader='false' v-if='baseData1.length' :height="300" row-key="deptId">
					<template slot="online" slot-scope="{row, index} ">
						<span href="javascript:;" style="color: #13CE66;width:40px;display: inline-block;">{{row.onlineCarCount}}</span>
					</template>
					<template slot="outline" slot-scope="{row, index}">
						<span href="javascript:;" style="color: #bbb;width:40px;display: inline-block;">{{row.outlineCarCount}}</span>
					</template>
					<template slot="alline" slot-scope="{row, index}">
						<span href="javascript:;" style="color: #000;width:40px;display: inline-block;">{{row.totalCarCount}}</span>
					</template>
					<template slot="errline" slot-scope="{row, index}">
						<span href="javascript:;" style="color: #f00;width:40px;display: inline-block;">{{row.aberrantCarCount}}</span>
					</template>
				</Table>
				<span class='closeAreaInfo' @click='handleCloseInfo'>X</span>
			</div>-->

    </div>
    <!--右上侧搜索-->
    <div class="searchRight" :class="[isDrawBack?'searchRight':'changSearchRight']">
      <div class='searchTop'>
        <Tree :data="areaData" ref="tree" :render="renderContent" @on-select-change='handleSelect' @on-toggle-expand='toggleExpand'></Tree>
      </div>
      <div class="radioDiv">
        <RadioGroup v-model="isOnLine" type="button" @on-change='handleRadioChange'>
          <Radio label="2">车辆({{totalNum}})</Radio>
          <Radio label="1">在线({{onLineNum}})</Radio>
          <Radio label="0">离线({{outLineNum}})</Radio>
        </RadioGroup>
      </div>
      <div class="searchMiddle">

        <Input v-model="searchKey" placeholder="查询车牌号/配送员" style="width: 182px" @keyup.enter.native="searchClick"
          clearable @on-clear='searchClick' />
        <Button type="primary" @click='searchClick'>搜索</Button>
      </div>

      <div class='searchContent' ref='searchContent' :style="{height:newHight}">
        <Table @on-selection-change='rowSelectionChange' :columns="searchColumn" :data="searchData" :rowClassName="rowClassName"
          @on-row-click='handleRowClick' highlight-row :loading="loading"></Table>

      </div>

    </div>

    <locus v-if='ifShow' :param=param @ifShow='handleShow'></locus>
    <cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>

    <someLocus v-if='someIfShow' @someIfShow='someIfShowMethods' :someLocusArr='someLocusArr'></someLocus>
    <div class="backMap" @click="handleBackClick">

      <img src="@/assets/images/back.png" alt="" />

    </div>
    <div class="reloadMap" @click="handleReloadClick">

      <img src="@/assets/images/reload.png" alt="" />

    </div>
    <div class="someLocus" v-if='someLocusArr.length'><Button type="info" style="height: 28px;line-height: 26px;"
        @click='showSomeLocus'>多车轨迹</Button></div>
  </div>

</template>
<script>
  import AMap from 'AMap'
  import Bus from '@/public/bus';
  import locus from './locus';
  import cylInfo from '@/pages/comComponent/cylinderInfo';
  import _http from '@/public/http';
  import {
    pathUrls
  } from '@/public/path';
  import someLocus from './someLocus';
  export default {
    name: "carMap",

    components: {
      locus,
      cylInfo,
      someLocus
    },
    props: {
      tabsMap: String
    },
    data() {
      return {
        spinShow:false,
        responsibilityCount: 0,
        newHight: '300px',
        someIfShow: false,
        newHeight: 500,
        loading1: false,
        loading: false,
        tags: '',
        infoSee: false,
        isOnLine: '2',
        vehicleType: 1,
        tabsInfo: 1,
        areaInfoShow: false,
        areaColum: [{
            title: '组织名称',
            key: 'name',
            width: 200,
            tree: true,
          },
          {
            title: ' ',
            slot: 'online',

          },
          {
            title: ' ',
            slot: 'outline',

          },
          {
            title: ' ',
            slot: 'alline',

          },
          {
            title: ' ',
            slot: 'errline',
          },
        ],
        areaData: [],
        pagination: {
          pageSize: 1000
        },
        isDrawBack: true,
        isActive: true,
        deptData: [],
        baseData: [],
        baseData1: [],
        addressInfo: '',
        showInfo: false,
        searchColumn: [{
            type: 'selection',
            width: 45,
            align: 'center',
            slot: 'selection'
          },
          {
            title: '类型',
            key: 'carType',
            align: 'center',
            width: '50',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.carType
                },
                style: {},
              }, params.row.carType);

            }

          },
          {
            title: '车牌号',
            key: 'carNumber',
            align: 'center',
            tooltip: true,
            width: '90',

          },
          {
            title: '配送员',
            key: 'staffName',

            align: 'center',
            tooltip: true,

          },
          {
            title: '状态',
            key: 'newFlag',
            width: '40',
            align: 'center'
          },
        ],
        searchData: [],
        fullInfoColumn: [

          {
            title: '序号',
            type: 'index',
            width: '70',
            align: 'center'
          },
          {
            title: '电子标签编码',
            key: 'bottleNfcId',
            sortable: true,
            render: (h, params) => {
              let that = this
              return h('span', {
                style: {
                  color: '#EE6515',
                  cursor: 'pointer'
                },
                on: {
                  click() {
                    that.infoSee = true
                    that.tags = params.row.bottleNfcId
                  }
                }
              }, params.row.bottleNfcId);
            },

            align: 'center'
          },
          {
            title: '钢瓶条码',
            key: 'bottleCode',
            render: (h, params) => {
              let that = this
              return h('span', {
                style: {
                  color: '#1BA060',
                  cursor: 'pointer'
                },
                on: {
                  click() {
                    if (params.row.bottleNfcId) {
                      that.infoSee = true
                      that.tags = params.row.bottleNfcId
                    } else {
                      that.infoSee = true
                      that.tags = params.row.bottleCode
                    }

                  }
                }
              }, params.row.bottleCode);
            },

            sortable: true,
            align: 'center'
          },
          {
            title: '规格',
            key: 'bottleSpecification',

            align: 'center'
          },
          {
            title: '钢瓶状态',
            key: 'newStatus',
            align: 'center',

          },
          {
            title: '流转环节',
            key: 'newFlow',
            align: 'center',

          },
          {
            title: '当前责任人',
            key: 'bottlePersonLiableName',

            tooltip: true,
            align: 'center'
          }
        ],
        abnorInfoColumn: [

          {
            title: '序号',
            type: 'index',
            width: '70',
            align: 'center'
          },
          {
            title: '电子标签编码',
            key: 'bottleNfcId',
            sortable: true,
            render: (h, params) => {
              let that = this
              return h('span', {
                style: {
                  color: '#EE6515',
                  cursor: 'pointer'
                },
                on: {
                  click() {
                    that.infoSee = true
                    that.tags = params.row.bottleNfcId
                  }
                }
              }, params.row.bottleNfcId);
            },

            align: 'center'
          },
          {
            title: '钢瓶条码',
            key: 'bottleCode',
            render: (h, params) => {
              let that = this
              return h('span', {
                style: {
                  color: '#1BA060',
                  cursor: 'pointer'
                },
                on: {
                  click() {
                    if (params.row.bottleNfcId) {
                      that.infoSee = true
                      that.tags = params.row.bottleNfcId
                      //										console.log(that.tags)
                    } else {
                      that.infoSee = true
                      that.tags = params.row.bottleCode
                    }

                  }
                }
              }, params.row.bottleCode);
            },

            sortable: true,
            align: 'center'
          },
          {
            title: '规格',
            key: 'bottleSpecification',

            align: 'center'
          },
          {
            title: '钢瓶状态',
            key: 'newStatus',
            align: 'center',

          },
          {
            title: '流转环节',
            key: 'newFlow',

            align: 'center'
          },
          {
            title: '当前责任人',
            key: 'bottlePersonLiableName',

            tooltip: true,
            align: 'center'
          },
          {
            title: '异常状态',
            key: 'statusMsg',
            tooltip: true,
            align: 'center',

          }
        ],
        infoColumn: [{
            title: ' ',
            key: '',

          },
          {
            title: '序号',
            type: 'index',
            align: 'center',
            width: '70'
          },
          {
            title: '所属组织',
            key: 'orderDeptName',
            width: '120',
            align: 'center',
            tooltip: true,
          },
          {
            title: '企业/商户',
            key: 'orderUserCompanyName',
            width: '100',
            align: 'center',
            tooltip: true,
          },
          {
            title: '用户名',
            key: 'orderUserName',
            width: '120',
            align: 'center',
            tooltip: true,

          },
          {
            title: '地址',
            key: 'orderUserAddress',
            width: '180',
            align: 'center',
            tooltip: true,
          },
          {
            title: '配送员',
            key: 'orderDeliveryUserName',
            width: '90',
            align: 'center'
          },
          {
            title: '订单状态',
            key: 'newStatus',
            width: '100',
            align: 'center'
          },
          {
            title: '订单创建时间',
            key: 'orderCreateTime',
            sortable: true,
            width: '170',
            align: 'center'
          },
          {
            title: '订单完结时间',
            key: 'orderFinishTime',
            width: '170',
            sortable: true,
            align: 'center'
          },
          {
            title: '钢瓶总数',
            key: 'orderBottleQuantity',
            width: '110',
            sortable: true,
            align: 'center'
          },
          {
            title: '50KG',
            key: 'newBottle50KG',
            width: '95',
            sortable: true,
            align: 'center'
          },
          {
            title: '15KG',
            key: 'newBottle15KG',
            width: '95',
            sortable: true,
            align: 'center'
          },
          {
            title: '5KG',
            key: 'newBottle5KG',
            width: '90',
            sortable: true,
            align: 'center'
          },
          {
            title: '订单编号',
            key: 'orderCode',
            width: '170',
            sortable: true,
            align: 'center'
          },
          {
            title: ' ',
            key: '',

          },
        ],
        fullInfoData: [],
        abnorInfoData: [],
        infoData: [],

        ifShow: false,
        userData: (JSON.parse(this.$store.state.userData)),
        deptid: JSON.parse(this.$store.state.userData).deptId,
        markCardArr: [],
        map: '',
        terminalCarNumber: '',
        carBottleCount: 0,
        deliveringCount: '',
        deliveryFinishCount: '',
        vehicleCount: '',
        param: {},
        searchKey: '',
        staffList: [],

        staffpage: 1,
        loadTest: '加载中',
        listLan: false,
        newMarkArr: [],
        carNumber: '',
        deptName: '',
        lastReportTime: '',
        mileage: '',
        staffAccount: '',
        staffName: '',
        staffWorkCode: '',
        terminalRangeStatus: '',
        workStatus: '',
        emptyBottleCount: 0,
        fullBottleCount: 0,
        finishOrderCount: 0,
        undoneOrderCount: 0,
        abnormalCount: 0,
        areaLon: '',
        areaLat: '',
        areaDetail: '',
        carid: '',
        searchLng: '',
        searchLat: '',
        lnglatXY: [],
        onLineNum: 0,
        outLineNum: 0,
        totalNum: 0,
        errorInfo: '',
        someLocusArr: [],
        carPointArr: [],
        offsetTops: null,
        efBottleCount: 0
      }
    },
    watch: {
      'offsetTops': {
        handler(newItems, oldItems) {
          if (newItems) {
            this.newHight = `calc(100% - ${newItems+87+"px"})`;
          } else {
            this.newHight = `calc(100% - 67px)`;
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      toggleExpand() {

        setTimeout(() => {
          this.offsetTops = this.$refs.searchContent.offsetTop - 10;
        }, 300)

      },
      someIfShowMethods(data) {
        this.someIfShow = data;
      },
      showSomeLocus() {
        if (this.someLocusArr.length > 50) {
          this.$Message['warning']({
            background: true,
            content: '最多选择50辆车!',
          });

        } else {
          this.someIfShow = true;
          //					console.log(new Date())
        }

      },
      rowSelectionChange(selection) {
        this.someLocusArr = [];
        let colors = ["#0066cc", "#dc3912", "#ff9900", "#3b3eac", "#990099", "#0099c6", "#dd4477", "#aaaa00",
          "#5574a6", "#385a2c", "#4e0af1", "#22aa99", "#be6219", "#651067", "#e67300", "#8b0707",
          "#6633cc", "#329262", "#b82e2e", "#109618", "#f31df9", "#0ef0a1", "#30ff8f", "#44a1f0",
          "#f03a40", "#43ac46", "#9f5f3f", "#33d4f8", "#ddd310", "#ffc088", "#3c4e9d", "#9410ff",
          "#cbac63", "#8572e3", "#72afff", "#ea747f", "#ff9dd2", "#ffdeaf", "#02c9e7", "#8bd07e",
          "#ffbbe4", "#985dff", "#ff8f9a", "#e7ffa4", "#afffd3", "#9d47ff", "#fff8a7", "#ff9500","#ff4ee8"
        ];

        let i = 0;
        if (selection.length) {
          for (let item of selection) {
            this.carPointArr.forEach(items => {
              let srcUrl = require('../../../src/assets/images/sanlunche.png');
              if (item.id == items.id) {
                if (item.vehicleType == 1) {
                  srcUrl = require('../../../src/assets/images/sanlunche.png');
                } else if (item.vehicleType == 2) {
                  srcUrl = require('../../../src/assets/images/lahuoche.png');
                } else {
                  srcUrl = require('../../../src/assets/images/xiaohuoche.png');
                }
                this.someLocusArr.push({
                  id: item.id,
                  carNumber: item.carNumber,
                  location: [items.location.lon, items.location.lat],
                  vehicleType: item.vehicleType,
                  staffName: item.staffName,
                  onlineFlag: item.onlineFlag,
                  color: colors[i],
                  srcUrl: srcUrl
                })
                i++;
              }
            })

          }
        }

      },
      //刷新地图
      handleReloadClick() {
        this.someLocusArr = [];

        if (this.carid) {

          // if(this.tabsInfo == 0) {
          // 	this.getEmptyFullInfo(this.carid, -1)
          // }
          //					else if(this.tabsInfo == 1) {
          //						this.getEmptyFullInfo(this.carid, 0)
          //					}
          // else if(this.tabsInfo == 1) {
          // 	this.getEmptyFullInfo(this.carid, 2)
          // }
          //					else if(this.tabsInfo == 3) {
          //						this.getOrderInfo(this.carid, 2)
          //					}
          //					else if(this.tabsInfo == 4) {
          //						this.getOrderInfo(this.carid, 1)
          //					}
        }
        if (this.newCarid) {
          this.getInfos();
        }
        this.getMapDept();
        this.getDeptstaffList(this.deptid, this.searchKey, this.isOnLine);
        setTimeout(() => {
          if (this.searchData.length) {
            let _i = this.searchData.findIndex(v => v.id == this.newCarid);
            let classTr = [...document.getElementsByClassName('highlight')];
            classTr.forEach((item) => {
              if (item.className.indexOf('ivu-table-row-highlight') != -1) {
                item.classList.remove('ivu-table-row-highlight')
              }
            })
            if (classTr[_i]) {
              classTr[_i].classList.add("ivu-table-row-highlight")
            }
          }
        }, 1000)
      },

      //返回地图
      handleBackClick() {
        this.deptid = this.userData.deptId;
        this.someLocusArr = [];
        this.newCarid = '';
        this.getStatistical();
        this.areaInfoShow = false;
        this.searchKey = '';
        this.addressInfo = '';
        this.showInfo = false;
        this.isOnLine = '2';
        this.loading = true;

        this.getDeptstaffList(this.deptid, this.searchKey, this.isOnLine);
        this.getMapDept();
      },
      //逆地理编码
      regeocoder(lnglatXY, cb) {

        let that = this
        //逆地理编码
        var geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        geocoder.getAddress(lnglatXY, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            var address = result.regeocode.formattedAddress; //返回地址描述

            that.areaDetail = address;

            typeof cb == 'function' && cb();
          }
        });
      },
      //地理编码
      geocoders(cityAdress) {
        let that = this
        var geocoder = new AMap.Geocoder({
          city: cityAdress
        });
        geocoder.getLocation(cityAdress, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // result中对应详细地理坐标信息
            that.searchLng = result.geocodes[0].location.lng
            that.searchLat = result.geocodes[0].location.lat
            //						console.log(that.searchLng,that.searchLat)
            if (cityAdress) {
              that.loadmap(14, that.searchLng, that.searchLat)
            }
          } else {
            that.loadmap(11, that.userData.lng, that.userData.lat)
          }
        })

      },

      //点击切换在线状态
      handleRadioChange(val) {
        this.loading = true
        this.getDeptstaffList(this.deptid, this.searchKey, this.isOnLine);
         this.getStatistical();
      },
      //递归数据
      getDepts(depts) {

        return depts.map((dept) => {
          dept._showChildren = true;
          dept.expand = false;
          if (dept.deptId == this.userData.deptId) {
            dept.expand = true;
            setTimeout(() => {
              this.offsetTops = this.$refs.searchContent.offsetTop - 10;
            }, 300)

          }
          if (dept.deptId == this.deptid) {
            this.onLineNum = dept.onlineCarCount;
            this.outLineNum = dept.outlineCarCount;
            this.totalNum = dept.totalCarCount;
          }

          if (dept.children && dept.children.length > 0) {
            this.getDepts(dept.children);
          }
          if (dept.children && dept.children.length == 0) {
            delete dept.children;
          }
          dept.value = dept.deptId;
          dept.key = dept.deptId;
          dept.name = dept.deptName;
          if (this.deptid == Number(dept.deptId)) {
            dept.selected = true
          }
          return dept;
        })
      },
      //获取地图右上侧组织搜索
      getMapDept() {
        _http.http2('post', pathUrls.userDept, {}).then((res) => {

          //					if(res.data.deptData.length) {
          //						this.onLineNum = res.data.deptData[0].onlineCarCount
          //						this.outLineNum = res.data.deptData[0].outlineCarCount
          //						this.totalNum = res.data.deptData[0].totalCarCount
          //					}
          this.baseData = this.getDepts(res.data.deptData);
          this.areaData = this.baseData;

        }).catch((res) => {

        })
      },
      //tabs切换
      handleChangeTabs(val) {

        if (val == 0) {
          this.getEmptyFullInfo(this.carid, -1)
        } else if (val == 1) {
          this.getEmptyFullInfo(this.carid, 2)
        }
        //				else if(val == 3) {
        //					this.getOrderInfo(this.carid, 2)
        //				} else if(val == 4) {
        //					this.getOrderInfo(this.carid, 1)
        //				}

      },
      //关联tabs
      handleConClick(val) {
        this.tabsInfo = val
        this.showInfo = true;
        if (val == 0) {
          this.getEmptyFullInfo(this.carid, -1)
        } else if (val == 1) {
          this.getEmptyFullInfo(this.carid, 2)
        }
        //				else if(val == 3) {
        //					this.getOrderInfo(this.carid, 2)
        //				} else if(val == 4) {
        //					this.getOrderInfo(this.carid, 1)
        //				}
      },
      //获取订单信息
      getOrderInfo(carid, queryOrderType) {
        this.loading1 = true;
        _http.http2('post', pathUrls.orderQueryOrdersByCarId, {
          carId: carid,
          queryOrderType: queryOrderType,
        }).then((res) => {
          this.loading1 = false;
          for (let item of res.data) {

            if (item.orderStatus == 1) {
              item.newStatus = '带核定'
            } else if (item.orderStatus == 2) {
              item.newStatus = '配送中'
            } else if (item.orderStatus == 3) {
              item.newStatus = '已完成'
            }
            if (item.orderBottleSpecification) {
              let newNum = JSON.parse(item.orderBottleSpecification);
              item.newBottle15KG = newNum.bottle15KG;
              item.newBottle5KG = newNum.bottle5KG;
              item.newBottle50KG = newNum.bottle50KG;
            }
          }

          this.infoData = res.data

        }).catch((res) => {
          this.loading1 = false;
        })
      },
      //获取轻重瓶信息
      getEmptyFullInfo(carid, fullFlag) {
        this.fullInfoData = [];
        this.abnorInfoData = [];
        if (fullFlag == -1) {
          this.responsibilityCount = 0;
        }
        this.loading1 = true;
        _http.http1('post', pathUrls.deptbottleQueryVehicleBottle + '/' + carid, {
          fullFlag: fullFlag,
        }, 'form').then((res) => {
          this.loading1 = false;
          if (res) {

            for (let item of res.data) {
              switch (item.bottleStatus) {
                case -1:
                  item.newStatus = "删除";
                  break;
                case 1:
                  item.newStatus = "正常";
                  break;
                case 2:
                  item.newStatus = "报废";
                  break;
                case 3:
                  item.newStatus = "注销";
                  break;
                case 4:
                  item.newStatus = "停用";
                  break;
                case 5:
                  item.newStatus = "转出";
                  break;
                case 6:
                  item.newStatus = "回退";
                  break;
              }
              switch (item.bottleFlowInformation) {

                case 1:
                  item.newFlow = "在库";
                  break;
                case 2:
                  item.newFlow = "在途";
                  break;
                case 3:
                  item.newFlow = "在用";
                  break;
                case 4:
                  item.newFlow = "在途";
                  break;
                case 5:
                  item.newFlow = "在库";
                  break;

              }
              this.fullInfoData = res.data
              this.abnorInfoData = res.data
              if (fullFlag == -1) {
                this.responsibilityCount = res.data.length;
              }
            }
          }
        }).catch((res) => {
              this.loading1 = false;
        })
      },
      //点击关闭搜索内容
      handleCloseInfo() {
        this.areaInfoShow = false
      },
      //点击左上方搜索
      //			handleSearchArea(val) {
      //				//				console.log(val)
      //				this.geocoders(val)
      //
      //			},
      //点击地图图标收起右侧搜索
      changeDrawBack() {
        this.isDrawBack = !this.isDrawBack
      },
      //点击放大下方详情
      enLargeClick() {
        this.isActive = !this.isActive
        this.newHeight = window.innerHeight - this.$refs.tables.$el.offsetTop - 95;
      },
      //点击获得右上方选中数据
      handleSelect(data) {

      },
      //自定义tree树形组件
      renderContent(h, {
        root,
        node,
        data
      }) {
        return h('span', {
          style: {

            width: '100%',
            cursor: "pointer",            
						color:this.deptid==node.node.deptId? "#51B5EA" : "#515a6e", //根据选中状态设置样式
						background:this.deptid==node.node.deptId?'#d5e8fc':'',
          },
          on: {
            click: (e) => {
              //							console.log(data)
              this.onLineNum = data.onlineCarCount;
              this.outLineNum = data.outlineCarCount;
              this.totalNum = data.totalCarCount;
              this.deptid = data.deptId;

              //							this.$refs.tree.handleSelect(node.nodeKey);
              this.loading = true
              this.getDeptstaffList(this.deptid, this.searchKey, this.isOnLine);
              this.getStatistical();
              //							this.areaInfoShow = true;
              //							this.baseData1 = this.getDepts([data]);
            }
          },
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'md-home'
              },
              style: {
                marginRight: '8px',
                color: '#51B5EA'
              }
            }),
            h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginBottom: '-6px',
                display: 'inline-block',
                width: '70%',
                marginRight: '5px',
                fontSize: '12px'
              }
            }, data.deptName, ),
            h('span', `(${data.onlineCarCount}/${data.totalCarCount})`),

          ]),

        ])

      },
      //点击表格某行触发
      handleRowClick(row, index) {
        //				console.log(row)
        this.areaInfoShow = false
        this.showInfo = false
        if (row.id) {

          let newArr = []
          for (let item of this.newMarkArr) {
            if (item.id == row.id) {
              newArr.push(item)
            }
          }
          if (newArr.length > 0) {
            //						console.log(newArr)
            this.markCardArr = newArr
            this.newCarid = row.id;
            this.carid = row.id;
            this.newLnglat = [newArr[0].location.lon, newArr[0].location.lat];
            this.newTypes = newArr[0].vehicleType;
            this.newLng = newArr[0].location.lon;
            this.newLat = newArr[0].location.lat;
            this.loadmap(18, newArr[0].location.lon, newArr[0].location.lat);

          } else {
            this.newCarid = '';
            this.$Message['warning']({
              background: true,
              content: '地图上暂无此车辆信息!',
              onClose: (() => {
                this.getStatistical();
              })
            });
          }
        }

      },
      //给指定列表的某一行添加class名
      rowClassName(row, index) {
        if (row) {
          if (row.onlineFlag == false) {
            return 'leaveType highlight';
          }
          return 'highlight';
        }

        return '';
      },

      //点击关闭下方钢瓶信息详情
      closeInfoClick() {
        this.showInfo = false
        this.isActive = true
      },

      //点击搜索
      searchClick() {
        this.markCardArr = this.newMarkArr
        this.loading = true
        this.getDeptstaffList(this.deptid, this.searchKey,this.isOnLine);
        if (this.searchKey == '') {
          this.loadmap(11, this.userData.lng, this.userData.lat)
        }

      },
      //配送员姓名搜索
      getDeptstaffList(id, sname, onlineFlag) {
        this.searchData = [];
        this.loading = true
        _http.http1('post', pathUrls.deptstaffSelect, {
          deptId: id,
          keywords: sname,
          onlineFlag: onlineFlag
        }, 'form').then((res) => {
          this.loading = false
          for (let item of res.data) {
            if (item.vehicleType == 1 && item.onlineFlag) {
              item.carType = require('../../../src/assets/images/sanlunche_2.png');
            } else if (item.vehicleType == 2 && item.onlineFlag) {
              item.carType = require('../../../src/assets/images/lahuoche.png');
            } else if (item.vehicleType == 3 && item.onlineFlag) {
              item.carType = require('../../../src/assets/images/xiaohuoche.png');
            } else if (item.vehicleType == 1 && !item.onlineFlag) {
              item.carType = require('../../../src/assets/images/offLineCar.png');
            } else if (item.vehicleType == 2 && !item.onlineFlag) {
              item.carType = require('../../../src/assets/images/offLineHuo.png');
            } else if (item.vehicleType == 3 && !item.onlineFlag) {
              item.carType = require('../../../src/assets/images/xiaohuoche001.png');
            }



            if (item.onlineFlag == false) {
              item.newFlag = '离线';
            } else {
              item.newFlag = '在线';
            }
          }

          this.searchData = res.data

        }).catch(()=>{
          this.loading = false;
        })
      },
      //获取车辆位置信息
      getStatistical() {
            this.spinShow=true;
        _http.http1('post', pathUrls.userStatistical, {
          deptId: this.deptid,
          onlineFlag:this.isOnLine
        }, 'form').then((res) => {
            this.spinShow=false;
          if (res.data) {
            this.markCardArr = res.data.vehiclePoint;
            this.newMarkArr = res.data.vehiclePoint;
            this.deliveringCount = res.data.deliveringCount;
            this.deliveryFinishCount = res.data.deliveryFinishCount;
            this.vehicleCount = res.data.vehicleCount;
            this.carPointArr = res.data.vehiclePoint;
            if (document.getElementById('carContainer')) {
              this.loadmap(11, this.userData.lng, this.userData.lat);
            }

          }

        }).catch(()=>{
           this.spinShow=false;
        })

      },
      //获取轨迹
      handleClick(id, types, lns, lats, ds, datas, areas) {

        this.param = {
          id,
          types,
          lns,
          lats,
          ds,
          datas,
          areas
        }
        this.ifShow = true

      },
      //加载地图
      loadmap(zoom, lngg, latt) {
        let that = this;
        var map;
        if (lngg) {
          map = new AMap.Map('carContainer', {
            zoom: zoom,
            center: [lngg, latt],
          });
        } else {
          map = new AMap.Map('carContainer', {
            zoom: zoom,
          });
        }

        //输入提示
        var autoOptions = {
          input: "keyword",
        };
        var auto = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
          map: map,

        });

        //构造地点查询类
        AMap.event.addListener(auto, "select", (e) => {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name, () => {
            if (placeSearch.render) {
              placeSearch.render.markerList.clear()
            }

          }); //关键字查询查询
        }); //注册监听，当选中某条记录时会触发
        //加载工具条
        var tool = new AMap.ToolBar({
          offset: new AMap.Pixel(10, 50)
        });
        map.addControl(tool);
        if (that.markCardArr.length) {
          var massMarks = [];
          //海量点根据不同类型显示不同车辆
          let style = [{
              url: require('../../../src/assets/images/sanlunche_2.png'),
              anchor: new AMap.Pixel(6, 6),
              size: new AMap.Size(40, 40)
            },
            {
              url: require('../../../src/assets/images/lahuoche.png'),
              anchor: new AMap.Pixel(6, 6),
              size: new AMap.Size(40, 40)
            }, {
              url: require('../../../src/assets/images/xiaohuoche.png'),
              anchor: new AMap.Pixel(6, 6),
              size: new AMap.Size(65, 40)
            }, {
              url: require('../../../src/assets/images/offLineCar.png'),
              anchor: new AMap.Pixel(6, 6),
              size: new AMap.Size(40, 40)
            }, {
              url: require('../../../src/assets/images/offLineHuo.png'),
              anchor: new AMap.Pixel(6, 6),
              size: new AMap.Size(40, 40)
            }, {
              url: require('../../../src/assets/images/xiaohuoche001.png'),
              anchor: new AMap.Pixel(6, 6),
              size: new AMap.Size(65, 40)
            }
          ];

          for (let i = 0; i < that.markCardArr.length; i++) {
            let sn;
            if (that.markCardArr[i].vehicleType == 1 && that.markCardArr[i].isOnline) {
              sn = 0;
            } else if (that.markCardArr[i].vehicleType == 2 && that.markCardArr[i].isOnline) {
              sn = 1;
            } else if (that.markCardArr[i].vehicleType == 3 && that.markCardArr[i].isOnline) {
              sn = 2;
            } else if (that.markCardArr[i].vehicleType == 1 && !that.markCardArr[i].isOnline) {
              sn = 3;
            } else if (that.markCardArr[i].vehicleType == 2 && !that.markCardArr[i].isOnline) {
              sn = 4;
            } else if (that.markCardArr[i].vehicleType == 3 && !that.markCardArr[i].isOnline) {
              sn = 5;
            }
            var points = {
              lnglat: [that.markCardArr[i].location.lon, that.markCardArr[i].location.lat],
              id: that.markCardArr[i].id,
              types: that.markCardArr[i].vehicleType,
              lns: that.markCardArr[i].location.lon,
              lats: that.markCardArr[i].location.lat,
              style: sn
            };
            massMarks.push(points)
          }
          that.mass = new AMap.MassMarks(massMarks, {
            opacity: 1,
            zIndex: 111,
            cursor: 'pointer',
            style: style
          });

          that.marker = new AMap.Marker({
            content: ' ',
            map: map
          })
          that.mass.setMap(map);
          //标注点弹出车辆详情
          that.getInfos = () => {
            if (that.searchData.length) {
              let _i = that.searchData.findIndex(v => v.id == that.newCarid);
              let classTr = [...document.getElementsByClassName('highlight')];
              classTr.forEach((item) => {
                if (item.className.indexOf('ivu-table-row-highlight') != -1) {
                  item.classList.remove('ivu-table-row-highlight')
                }
              })
              if (classTr[_i]) {
                classTr[_i].classList.add("ivu-table-row-highlight")
              }

            }

            that.showInfo = true;
            that.tabsInfo = 0;
            that.getEmptyFullInfo(that.newCarid, -1);
            //获取车辆详情接口数据

            //								console.log(that.lnglatXY)
            //					that.carGetDetail();
            _http.http1('post', pathUrls.carinfoGetDetails + '/' + that.newCarid, {}, 'form')
              .then((res) => {
                if (res.code == 0) {

                  var datas = JSON.stringify(res.data);

                  that.errorInfo = ''
                  that.carNumber = res.data.carNumber || ''; //车牌号
                  that.deptName = res.data.deptName || ''; //所属组织
                  that.lastReportTime = res.data.lastReportTime || ''; //最近上传时间
                  that.mileage = res.data.mileage || 0; //当日里程
                  that.staffAccount = res.data.staffAccount || ''; //配送员电话
                  that.staffName = res.data.staffName || ''; //配送员姓名
                  that.staffWorkCode = res.data.staffWorkCode || ''; //配送员工号
                  that.terminalRangeStatus = res.data.terminalRangeStatus || ''; //车辆状态
                  that.workStatus = res.data.workStatus || ''; //车辆工作状态
                  that.emptyBottleCount = res.data.emptyBottleCount || 0; //空瓶数
                  that.fullBottleCount = res.data.fullBottleCount || 0; //重瓶数
                  that.efBottleCount = that.emptyBottleCount + that.fullBottleCount; //载瓶数
                  that.efBottleCount = that.efBottleCount < 0 ? 0 : that.efBottleCount;
                  that.finishOrderCount = res.data.finishOrderCount || 0; //已完成订单
                  that.undoneOrderCount = res.data.undoneOrderCount || 0; //未完成订单
                  that.abnormalCount = res.data.abnormalCount || 0; //异常
                  that.areaLon = res.data.lon; //经度
                  that.areaLat = res.data.lat; //纬度
                  that.vehicleType = res.data.vehicleType; //车辆类型
                  //经纬度转具体地址
                  that.lnglatXY = [that.areaLon, that.areaLat];
                  that.regeocoder(that.lnglatXY, () => {
                    //自定义窗体内容及样式
                    let formInfo = '';
                    let src1 = require('../../../src/assets/images/sanlunche_2.png');
                    let psy = require('../../../src/assets/images/psy.png');
                    let gh = require('../../../src/assets/images/gh.png');
                    let sszz = require('../../../src/assets/images/org.png');
                    let tel = require('../../../src/assets/images/tel.png');
                    let lic = require('../../../src/assets/images/lic.png');
                    let time = require('../../../src/assets/images/time.png');
                    let mar = require('../../../src/assets/images/marke.png');
                    let loc = require('../../../src/assets/images/loc.png');
                    if (that.newTypes == 1) {
                      src1 = require('../../../src/assets/images/sanlunche_2.png');
                    } else if (that.newTypes == 2) {
                      src1 = require('../../../src/assets/images/lahuoche.png');
                    } else {
                      src1 = require('../../../src/assets/images/xiaohuoche.png');
                    }

                    let formTop =
                      `<div class='formTop'><img src='${src1}' class='workCar'><span>${that.workStatus}</span><span class='topCard'>${that.carNumber}</span><span>(${that.terminalRangeStatus})</span></div>`;
                    let formContent = '';
                    let formStaffName =
                      `<div class='formStaffName divItem'><img src='${psy}' class='staffImg'>配送员:<span class='staffName'>${that.staffName}</span></div>`;

                    let staffOrgan =
                      `<div class='staffOrgan divItem'>
								<img src='${gh}' class='staffImg'>工号:&nbsp<span class='staffId'>${that.staffWorkCode}</span>
								<img src='${sszz}' class='staffImg'>所属组织:&nbsp<span class='sorgan' title='${that.deptName}'>${that.deptName}</span>
								</div>`
                    let telDistance =
                      `<div class='telDistance divItem'>
								<img src='${tel}' class='staffImg'>联系方式:&nbsp<span class='staffPhone'>${that.staffAccount}</span>
								<img src='${lic}' class='staffImg'>当日里程:&nbsp<span class='staffDistance'>${that.mileage}</span>
								</div>`
                    let upDateTime =
                      `<div class='upDateTime divItem'>
								<img src='${time}' class='staffImg'>最近上传时间:&nbsp<span class='staffTime'>${that.lastReportTime}</span>
								</div>`
                    let staffMarke =
                      `<div class='staffMarke'><img src='${mar}' class='staffImg'><span class='markeText'>[标注]</span><span class='markeText'>[坐标]</span><span>${that.areaDetail}</span></div>`
                    formContent +=
                      `<div class='formContent'>${formStaffName}${staffOrgan}${telDistance}${upDateTime}${staffMarke}</div>`
                    let abnormalDiv = `<div class='itemTop'>${that.abnormalCount}</div>`
                    if (that.abnormalCount > 0) {
                      abnormalDiv = `<div class='itemTop abnorDiv'>${that.abnormalCount}</div>`
                    }
                    let showBottomDiv = '';
                    if (that.vehicleType == 1) {
                      showBottomDiv =
                        `<div class='bottomItem' onclick='handleConClick(3)'>
										<div class='itemTop'>${that.finishOrderCount}</div>
										<div>已完成订单</div>
									</div>
									<div class='bottomItem' onclick='handleConClick(4)'>
										<div class='itemTop'>${that.undoneOrderCount}</div>
										<div>未完成订单</div>
									</div>`
                    }

                    let formBottom =
                      `<div class='formBottom'>
									<div class='bottomItem' onclick='handleConClick(0)'>
										<div class='itemTop' >${that.responsibilityCount}</div>
										<div >车载瓶数</div>
									</div>

									<div class='bottomItem' onclick='handleConClick(1)'>
										${abnormalDiv}
										<div>异常</div>
									</div>

									<div class='bottomItem' onclick='handleClick(${that.newCarid},${that.newTypes},${that.newLng},${that.newLat},false,${datas},"${that.areaDetail}")'>
										<div class='itemTop'><img src='${loc}' class='locImg'></div>
										<div class='locSee' >轨迹</div>
									</div>
								</div>`

                    formInfo += `<div>${formTop}${formContent}${formBottom}</div>`;
                    that.infoWindow = new AMap.InfoWindow({
                      content: formInfo,
                      offset: new AMap.Pixel(-20, 10),

                    });

                    that.infoWindow.open(map, that.newLnglat);
                  })
                } else {
                  that.errorInfo = res.msg;
                  that.$Message['warning']({
                    background: true,
                    content: res.msg,
                  });

                }
              })

          }
          if (that.newCarid) {
            that.getInfos();
          }
          //点击标注点
          that.mass.on('click', function(e) {
            that.newCarid = e.data.id;
            that.carid = e.data.id;
            that.newLnglat = e.data.lnglat;
            that.newLng = e.data.lns;
            that.newLat = e.data.lats;
            that.newTypes = e.data.types;
            that.getInfos();

          })
        }


      },
      handleSee(data) {
        this.infoSee = data
      },
      handleShow(data) {
        this.ifShow = data;
      }

    },

    mounted() {

      if (this.tabsMap.indexOf('车辆') != -1) {
        this.getMapDept();
        this.offsetTops = this.$refs.searchContent.offsetTop;
        this.getStatistical();
        this.getDeptstaffList(this.deptid, this.searchKey, this.isOnLine);
        window.handleClick = this.handleClick;
        window.handleConClick = this.handleConClick;

      }
    },
  }
</script>

<style scoped>
  /*地图左上方搜索*/

  .searchWrapper {
    position: absolute;
    left: 10px;
    top: 40px;
    z-index: 190;
    /*box-shadow: 3px 3px 3px #eee;*/
    background: #fff;
    border-radius: 6px;
  }

  .searchWrapper>>>.ivu-icon-ios-search:before {
    color: #51B5EA;
  }

  .areaInfo {
    position: absolute;
    left: 290px;
    top: 2px;
    width: 420px;
    padding: 20px;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #B4E3FF;
  }

  .areaInfo>>>td {
    height: 36px;
    font-size: 12px;
  }

  .closeAreaInfo {
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
    color: #51B5EA;
  }

  .searchWrapper>>>ul {
    display: none;
  }

  .searchWrapper>>>.ivu-input-group-prepend {
    border: #000000;
  }

  .searchWrapper>>>.ivu-input-group .ivu-input {
    border: 0;
  }

  .searchWrapper>>>.ant-table-thead>tr>th,
  .searchWrapper>>>.ant-table-tbody>tr>td {
    padding: 4px 4px;
    font-size: 12px;
    border-bottom: 1px solid #B4E3FF;
  }

  .searchWrapper>>>.ivu-scroll-container {
    width: 100% !important;
  }

  .searchWrapper>>>.ant-table-thead {
    /*display: none;*/
  }

  /*点击标注点出现弹框*/

  #carContainer>>>.amap-info-close {
    color: #51B5EA;
  }

  #carContainer>>>.amap-info-content {
    min-height: 254px;
    width: 400px;
    padding-right: 10px;
    border-radius: 4px;
  }

  #carContainer>>>.amap-info-sharp {
    margin-left: 40px;
  }

  #carContainer>>>.formTop {
    border-bottom: 2px solid #D0EEFE;
    width: 100%;
    height: 24px;
    color: #51B5EA;
    font-weight: 600;
    font-size: 12px;
  }

  #carContainer>>>.amap-info-close {
    right: 15px !important;
    top: 10px;
    font-size: 18px;
  }

  #carContainer>>>.topCard {
    font-size: 14px;
    margin-left: 70px;
  }

  #carContainer>>>.workCar {
    width: auto;
    height: 24px;
    margin-bottom: -6px;
    margin-right: 5px;
  }

  #carContainer>>>.unWorkNormal {
    color: #ccc;
  }

  #carContainer>>>.unNormalSta {
    color: #f00;
  }

  #carContainer>>>.formContent {
    font-size: 12px;
  }

  #carContainer>>>.staffName {}

  #carContainer>>>.staffImg {
    width: 14px;
    height: 14px;
    margin-bottom: -2px;
    margin-right: 2px;
  }

  #carContainer>>>.staffId {
    /*margin-left: 5px;*/
    /*margin-right: 30px;*/
    width: 130px;
    display: inline-block;
  }

  #carContainer>>>.sorgan {
    /*margin-left: 5px;*/
  }

  #carContainer>>>.staffOrgan {
    width: 380px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #carContainer>>>.telDistance {}

  #carContainer>>>.staffPhone {
    width: 130px;
    display: inline-block;
  }

  #carContainer>>>.staffTime {
    margin-left: 10px;
    font-size: 12px;
  }

  #carContainer>>>.divItem {
    height: 30px;
    line-height: 30px;
  }

  #carContainer>>>.staffMarke {
    margin-top: 10px;
    /*width: 380px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;*/
  }

  #carContainer>>>.markeText {
    font-weight: 600;
    color: #51B5EA;
    margin: 0 3px;
  }

  #carContainer>>>.formBottom {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    font-size: 12px;
  }

  #carContainer>>>.bottomItem {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 62px;
    cursor: pointer;
    font-size: 12px;
  }

  #carContainer>>>.itemTop {
    width: 30px;
    height: 30px;
    background: #51B5EA;
    border-radius: 15px;
    font-size: 12px;
    color: #FFFFFF;
    font-weight: 600;
    line-height: 30px;
    margin-bottom: 6px;
  }

  #carContainer>>>.abnorDiv {
    background: #f00;
  }

  #carContainer>>>.locImg {
    width: 16px;
    height: 16px;
  }

  #carContainer>>>.locSee {
    color: #51B5EA;
    border-bottom: 1px solid #51B5EA;
    cursor: pointer;
  }

  /*下侧车辆详情*/

  .bottomInfo {
    /*width:calc ( 100% - 360px );*/
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 90px;
    background: #fff;
    z-index: 200;
    height: 180px;
    /*box-shadow: 0 0 4px 4px #efefef;*/
    /*padding-bottom: 10px;*/
  }

  .changBottomInfo {
    /*width: 100%;*/
    position: fixed;
    left: 200px;
    bottom: 0px;
    background: #fff;
    top: 67px;
    z-index: 300;
    right: 0;
    /*height:100%;*/
    /*box-shadow: 0 0 4px 4px #efefef;*/
  }

  #carContainer>>>.ivu-tabs-nav .ivu-tabs-tab-active {
    color: #51B5EA;
  }

  #carContainer>>>.ivu-tabs-ink-bar {
    background: #51B5EA;
  }

  .topTitle {
    height: 30px;
    line-height: 30px;
    padding: 5px 15px;
  }

  .closeInfo {
    position: absolute;
    right: 10px;
    top: 8px;
    color: #51B5EA;
    cursor: pointer;
    /*float: right;*/
  }

  .fullScreen {
    position: absolute;
    right: 30px;
    top: 8px;
    cursor: pointer;
  }

  .fullScreen img {
    width: 20px;
    height: 20px;
  }

  .titleList {
    text-align: left;
  }

  .changBottomInfo>>>.ivu-table th,
  .bottomInfo>>>.ivu-table th,
  .searchRight>>>.ivu-table th {
    background: #E2EEFF;
    color: #51B5EA;
    padding: 2px 0;
    font-size: 12px;
  }

  .changBottomInfo>>>.ivu-table th {
    padding: 5px 0;
    font-size: 14px;
  }

  .bottomInfo>>>.ivu-table td {
    height: 32px;
    font-size: 12px;
  }

  .searchRight>>>.ivu-table td {
    height: 40px;
    cursor: pointer;
    font-size: 12px;
  }

  .searchRight>>>.ivu-btn-primary {
    background: #51B5EA;
    border-color: #51B5EA;
    /*border-radius: 16px;*/
  }

  .searchTop {
    text-align: left;
    padding: 10px;
    max-height: 250px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-right: 5px;
  }

  .searchContent {
    padding: 0 5px;
    /*margin-bottom: 20px;
		overflow: hidden;*/
    /*height: calc(100% - 200px);*/
    /*overflow-y: auto;*/
    /*height: 200px;*/
    overflow-y: auto;
    margin-right: 5px;
  }

  .searchContent>>>.ivu-table-overflowY {
    /*min-height: 200px;*/
    /*overflow: auto;*/
    padding-bottom: 20px;
  }

  .newThead {
    background: #E2EEFF;
    color: #51B5EA;
    font-weight: 600;
    width: 250px;
    margin-left: 15px;
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: space-around;
  }

  .searchContent>>>img {
    height: 24px;
    width: auto;
    margin-top: -7px;
  }

  .carMain>>>.ivu-table-cell {
    padding: 0 5px;
  }

  .searchContent>>>.leaveType {
    color: #bbb;
  }

  .searchContent>>>.checkType {
    background: #f00;
  }

  .drawBack {
    position: absolute;
    right: -12px;
    bottom: 400px;
    z-index: 190;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 0 2px 2px #efefef;
    width: 32px;
    height: 32px;
    line-height: 32px;
    padding-right: 5px;
    cursor: pointer;
  }

  .drawBack img {
    width: 20px;
    height: 20px;
    margin-top: 6px;
  }

  .reloadMap {
    position: absolute;
    right: 90px;
    top: 5px;
    cursor: pointer;
  }

  .backMap img,
  .reloadMap img {
    width: 23px;
    height: 23px;
  }

  .someLocus {
    position: absolute;
    right: 130px;
    top: 3px;
    cursor: pointer;
  }

  .backMap {
    position: absolute;
    right: 25px;
    top: 5px;
    cursor: pointer;
  }

  .carMain {
    height: calc(100vh - 10px);
    /*	display: flex;*/
  }

  .mapInfoWrap {
    position: relative;
    width: calc(100% - 320px);
    height: 100%;
    overflow: hidden;
    transition: all 0.7s ease;
  }

  .changMapInfoWrap {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  #carContainer {
    width: 100%;
    height: calc(100% - 60px);
  }

  #changContainer {
    width: 100%;
    height: calc(100% - 60px);
  }

  .searchRight {
    height: calc(100% - 60px);
    background: #fff;
    width: 320px;
    position: absolute;
    right: 0;
    top: 36px;
    z-index: 191;
    transition: all 0.7s ease;
    /*float: right;*/
  }

  .changSearchRight {
    width: 320px;
    right: -320PX;
  }

  .searchMiddle {
    padding: 12px;
    text-align: left;
  }

  .searchMiddle>>>input,
  .searchMiddle>>>span {
    font-size: 12px;
  }

  .radioDiv {
    text-align: left;
    padding-left: 5px;
  }

  .radioDiv>>>label {
    margin: 0 8px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }

  .radioDiv>>>.ivu-radio-group-button .ivu-radio-wrapper-checked {
    color: #51B5EA;
    box-shadow: none;
    border: 1px solid #51B5EA;
  }

  .radioDiv>>>.ivu-radio-wrapper-checked.ivu-radio-focus:before,
  .radioDiv>>>.ivu-radio-wrapper-checked.ivu-radio-focus:after {
    background: 0;
  }

  .radioDiv>>>.ivu-radio-group-button .ivu-radio-wrapper:first-child {
    border-radius: 0
  }

  .radioDiv>>>.ivu-radio-group-button .ivu-radio-wrapper:last-child {
    border-radius: 0
  }

  .searchRight>>>.scollListClass:hover {
    background: #13CE66;
  }

  .searchRight>>>.ivu-btn-primary {
    height: 28px;
  }

  .searchRight>>>.scollListClass {
    height: 32px;
    line-height: 32px;
    padding-left: 20px;
    text-align: left;
    cursor: pointer;
    font-size: 12px;
  }

  .searchRight>>>.ivu-input {
    height: 28px;
  }

  .searchRight>>>.ivu-scroll-container {
    width: 250px;
    padding: 10px 0;
  }

  #carContainer>>>.amap-icon img {
    width: 40px;
    height: 40px;
  }

  #carContainer>>>.bottom-center {
    width: 200px;
  }

  #carContainer>>>.carTitle {
    font-weight: 600;
  }

  #carContainer>>>.carNum {
    padding: 7px 0px 0px 0px;
    /*position: absolute;
		top: 0;
		left:10px;
		background: ;*/
  }

  #carContainer>>>.input-item {
    margin: 5px 0;
  }

  #carContainer>>>.commonLi {
    font-size: 12px;
    line-height: 20px;
  }

  #carContainer>>>.normalLi {
    color: #13CE66;
  }

  #carContainer>>>.warnLi {
    color: #E6A23C;
  }

  #carContainer>>>.errorLi {
    color: #f00;
  }

  #carContainer>>>.locusSee {
    background: #13C2C2;
    border: 0;
    border-radius: 4px;
    padding: 2px 4px;
    cursor: pointer;
    color: #fff;
    font-size: 12px;
  }

  #carContainer>>>.locusSee1 {
    background: #096DD9;
    border: 0;
    border-radius: 4px;
    padding: 2px 4px;
    cursor: pointer;
    color: #fff;
    font-size: 12px;
  }

  #carContainer>>>.infoWrapper {
    height: 300px;
    overflow: hidden;
    /*background: #f00;*/
  }

  #carContainer>>>.contentWrap {
    height: 80%;
    overflow-y: auto;
  }

  #carContainer>>>.btnWrap {
    position: absolute;
    bottom: 5px;
    left: 15px;
  }

  #keyword:focus {
    outline: none !important;
  }
</style>
