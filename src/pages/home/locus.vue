<template>
  <div class="main">
    <div class='topInfo'>
    </div>
    <div id="container"></div>
    <div v-show='locShow'>
      <div class="getInfoWrapper">
        <div class="locusBack">
          <RadioGroup v-model="locusBack" @on-change='changeLocusType'>
            <Radio label="上下瓶点" style='margin-right: 60px;'></Radio>
            <Radio label="轨迹回放"></Radio>
          </RadioGroup>
        </div>
        <div class="playBox" v-show='ds'>
          <Button @click="startAnimation" type="success">播放</Button>
          <Button @click="pauseAnimation" type="warning">暂停</Button>
          <Button @click="resumeAnimation" type="info">继续</Button>
          <Button @click="fastAnimation" type="primary">极速</Button>
        </div>

      </div>
      <div class="bottleInfo" v-if='bottleDetailShow'>
        <div style="text-align: center;color: #e20cdb;"><span>上下瓶点详细信息</span><span style="color: #2fadf7;">(序号{{sortNum}})</span></div>
        <div class="infoItem" v-for='(item,index) in bottleDetail' :key='index'>
          <div><span class='infoLabel'>电子标签编码：</span><span @click='seeInfoClick(item.bottleTag)' style="cursor: pointer;color: #67C23A;">{{item.bottleTag}}</span></div>
          <div><span class='infoLabel'>规格：</span><span>{{item.spec}}</span></div>
          <div><span class='infoLabel'>时间：</span><span>{{item.time}}</span></div>
          <div><span class='infoLabel'>动作：</span><span>{{item.action}}</span></div>
          <div><span class='infoLabel'>来源或去向：</span><span>{{item.sourceOrDestination}}</span></div>
        </div>

      </div>
      <div class='defaultInfo' v-show='defaultInfo'>仅展示当天的记录，更多记录可通过选择时间查找。</div>

      <div class="locDate">
        <Date-picker format="yyyy-MM-dd HH:mm" v-model='dateTime' type="datetimerange" placement="bottom-start"
          placeholder="选择日期" style="width: 280px" @on-change='changeDate'></Date-picker>
      </div>

      <div class='staffAndNum'>
        <span>配送员：</span>
        <span style="margin-right: 30px;">{{carDatas.staffName}}</span>
        <span>车牌号：</span>
        <span>{{carDatas.carNumber}}</span>
      </div>
      <div class="bottleContent"></div>
      <div class="closeBtn" @click='handleCloseClick'><img src="@/assets/images/backClick.png" /></div>

      <div class='checkAction' v-show='!ds'>
        <RadioGroup v-model="vertical" vertical @on-change='actionChange'>
          <Radio label="全部" style='height: 28px;'>
            <span style="display: inline-block;width: 12px;height:12px;border-radius: 6px;background: #F0F2F5;"></span>
            <span style="margin-right: 28px;">总计</span>
            <span style="">({{totalNum}})</span>
          </Radio>
          <Radio label="上瓶点" style='height: 28px;'>
            <span style="display: inline-block;width: 12px;height:12px;border-radius:6px;background: #0f0;"></span>
            <span style="margin-right: 14px;">上瓶点</span>
            <span style=""> ({{upNum}})</span>
          </Radio>
          <Radio label="下瓶点" style='height: 28px;'>
            <span style="display: inline-block;width: 12px;height:12px;border-radius: 6px;background: #f00;"></span>
            <span style="margin-right: 14px;">下瓶点</span>
            <span style="">({{downNum}})</span>
          </Radio>
          <Radio label="上下瓶点" style='height: 28px;'>
            <span style="display: inline-block;width: 12px;height:12px;border-radius: 6px;background: #0f0;background-image: linear-gradient(to right, transparent 50%, #f00 0);"></span>
            <span>上下瓶点</span>
            <span style="">({{upDownNum}})</span>
          </Radio>
        </RadioGroup>
      </div>
    </div>
    <cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
  </div>

</template>
<script>
  import AMap from 'AMap';
  import cylInfo from '@/pages/comComponent/cylinderInfo';
  import Bus from '@/public/bus';
  import _http from '@/public/http';
  import {
    pathUrls
  } from '@/public/path';
  export default {
    name: "locus",
    components: {
      cylInfo
    },
    props: {
      param: {
        type: Object,
        default: () => {

        }
      }
    },
    data() {
      return {
        bottleDetailShow: false,
        vertical: '全部',
        tags: '',
        infoSee: false,
        defaultInfo: true,
        locusBack: '上下瓶点',
        locShow: false,
        carId: '',
        types: null,
        userData: (JSON.parse(this.$store.state.userData)),
        dateTime: [],
        startTime: null,
        endTime: null,
        lns: '',
        lats: '',
        ds: true,
        marker: '',
        lineArr: [],
        arrs: [],
        arr2: [],
        actionPoint: [],
        pathParamList: [],
        upPoint: [],
        downPoint: [],
        upDownPoint: [],
        copyPoint: [],
        objAccount: [],
        newAccount: [],
        carDatas: {},
        carArea: '',
        clickBottleInfo: [],
        bottleDetail: [],
        totalNum: 0,
        upNum: 0,
        downNum: 0,
        upDownNum: 0,
        sortNum: null
      }

    },
    mounted() {
      this.$Spin.show();
      this.carId = this.param.id;
      this.types = this.param.types;
      this.lns = this.param.lns;
      this.lats = this.param.lats;
      this.ds = false;
      this.carDatas = this.param.datas;
      this.carArea = this.param.areas;

      let that = this;
      this.getTrajectory();
      const myDate = new Date();
      const year = myDate.getFullYear(); // 获取当前年份
      const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
      const day = myDate.getDate(); // 获取当前日（1-31）
      this.dateTime = [`${year}-${month}-${day}` + ' ' + '00:00', `${year}-${month}-${day}` + ' ' + '23:59'];
      if (this.param.types) {
        this.$Spin.hide();
      }
      window.seeInfoClick = this.seeInfoClick

    },
    methods: {
      //排序
      compare(property) {
        return function(a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2
        }
      },
      rad(d) {
        return d * Math.PI / 180.0;
      },
      //两点经纬度转距离
      getDistance(lat1, lng1, lat2, lng2) {
        var radLat1 = this.rad(lat1);
        var radLat2 = this.rad(lat2);
        var a = radLat1 - radLat2;
        var b = this.rad(lng1) - this.rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10;
        //输出为米
        //          var distance = s;
        //          var distance_str = "";
        //
        //          if (parseInt(distance) >= 1) {
        //              distance_str = distance.toFixed(1) + "km";
        //          } else {
        //              distance_str = distance * 1000 + "m";
        //          }
        //s=s.toFixed(4);
        //          console.info('lyj 距离是', s);
        //          console.info('lyj 距离是', distance_str);
        return s;
      },
      actionChange(v) {
        this.init()
      },
      handleSee(data) {
        this.infoSee = data
      },
      seeInfoClick(tags) {
        this.infoSee = true
        this.tags = tags

      },
      changeLocusType(val) {
        if (val == '上下瓶点') {
          this.ds = false
          this.vertical = '全部';
        } else {
          this.bottleDetailShow = false;
          this.ds = true
        }
        this.init()
      },
      changeDate(e) {
        if (e[1].length) {
          let ends = e[1].substring(e[1].length - 5)
          let wholes = e[1].substring(0, e[1].length - 5)
          if (ends == '00:00') {
            wholes = wholes + '' + '23:59';
            this.dateTime = [e[0], wholes]
            this.endTime = wholes
          } else {
            this.endTime = e[1]
          }
          this.defaultInfo = false
          this.startTime = e[0]
        } else {
          this.defaultInfo = false
          this.startTime = e[0]
          this.endTime = e[1]
        }
        this.vertical = '全部';
        this.getTrajectory()

      },
      handleCloseClick() {
        this.$emit('ifShow', false)
      },
      getTrajectory() {
        this.arrs = [];
        //				this.copyPoint=[];
        //				this.downPoint=[];
        //				this.upPoint=[];
        //				this.upDownPoint=[];

        //				this.lineArr = []
        _http.http1('post', pathUrls.getTrajectory + '/' + this.carId, {
          startTime: this.startTime,
          endTime: this.endTime
        }, 'form').then((res) => {
          this.arrs = res.data.trajectory
          this.actionPoint = res.data.actionPoint
          this.copyPoint = res.data.actionPoint
          this.init()
          this.locShow = true
        })
      },
      init() {
        let that = this;
        var map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 18,
          center: [this.lns, this.lats],
          //					layers: [new AMap.TileLayer.Satellite()],
        })

        let icon = require('../../../src/assets/images/lahuoche.png')
        //				let icons = require('../../../src/assets/images/redIcon.png')
        let icons = '';
        let wSize = 30;
        let hSize = 30;
        let lSize = 0;
        let rSize = -30;
        if (this.types == 1) {
          icon = require('../../../src/assets/images/sanlunche.png')
          wSize = 54;
          hSize = 30;
          lSize = -27;
          rSize = -15;
        } else if (this.types == 2) {
          icon = require('../../../src/assets/images/lahuoche.png');
          wSize = 40;
          hSize = 40;

        } else {
          icon = require('../../../src/assets/images/xiaohuoche.png');
          wSize = 65;
          hSize = 40;
        }
        this.marker = new AMap.Marker({
          map: map,
          position: [this.lns, this.lats],
          icon: new AMap.Icon({
            image: icon,
            size: new AMap.Size(60, 60), //图标大小
            imageSize: new AMap.Size(wSize, hSize)
          }),
          offset: new AMap.Pixel(lSize, rSize),
          autoRotation: true,
          angle: 0,
        });
        //				if(this.ds == false) {

        //				}
        var pointMap = new Map();
        var graspRoad;
        var pathParam = this.arrs;

        if (!graspRoad) {
          graspRoad = new AMap.GraspRoad()
        }
        that.lineArr = [];

        let pathParamSize = 0;
        if (pathParam.length) {

          for (let j = 0; j < pathParam.length; j++) {

            graspRoad.driving(pathParam[j], function(error, result) {
              pathParamSize++;
              var path2;
              var newPath;
              var key;
              if (!error) {
                path2 = [];
                newPath = result.data.points;
                key = "index" + j;
                pointMap.set(key, newPath)

              } else {
                path2 = [];
                newPath = [];
                key = "index" + j;
                pointMap.set(key, newPath)
              }
            })
          }

        }

        // 绘制轨迹
        let asynInterval = setInterval(() => {
          that.objAccount = [];
          if (pathParamSize == pathParam.length) {
            clearInterval(asynInterval);
            for (let j = 0; j < pathParam.length; j++) {
              var key = "index" + j;
              for (let k = 0; k < pointMap.get(key).length; k++) {
                that.lineArr.push([pointMap.get(key)[k].x, pointMap.get(key)[k].y])
              }

            }

            for (let j = 0; j < that.actionPoint.length; j++) {
              let points = this.actionPoint[j].point.split(',');
              let distance = [];
              if (that.lineArr.length) {
                for (let i = 0; i < that.lineArr.length; i++) {
                  let distances = that.getDistance(points[1], points[0], that.lineArr[i][1], that.lineArr[i][0]);
                  distance.push({
                    point: [that.lineArr[i][0], that.lineArr[i][1]].toString(),
                    distance: distances
                  })
                }
                distance.sort(that.compare("distance"))
                that.objAccount.push({
                  data: that.actionPoint[j].data,
                  point: distance[0].point
                })
              }


            }

            //轨迹查询显示上下瓶点
            if (!this.ds) {
              //				console.log(that.objAccount);
              let maps = {};
              that.newAccount = [];
              that.objAccount.forEach(item => {
                //					for(let i=0;i<that.objAccount.length;i++){
                let dataItem = item;
                let pointI = dataItem.point.split(',');

                if (!maps[pointI]) {
                  that.newAccount.push({
                    data: dataItem.data,
                    point: dataItem.point,
                    points: [pointI],
                    datas: [dataItem.data],
                    newData: []
                  });
                  maps[pointI] = pointI;
                } else {
                  //						for(let k=0;k<that.newAccount.length;k++){
                  that.newAccount.forEach(items => {
                    let dj = items;
                    let pointK = dj.point.split(',');
                    if (pointK[0] == pointI[0] && pointK[1] == pointI[1]) {
                      dj.points.push(pointK)
                      dj.datas.push(dataItem.data)
                      //			              	break;
                    }
                  })
                  //						}

                }
              })

              //				}


              for (let i = 0; i < that.newAccount.length; i++) {
                let datas = that.newAccount[i].datas;
                let bDeCount = 0;
                let bDfCount = 0;
                let bUeCount = 0;
                let bUfCount = 0;

                let dCount = 0;
                let uCount = 0;

                let bDeBottles = [];
                let bDfBottles = [];
                let bUeBottles = [];
                let bUfBottles = [];

                let dBottles = [];
                let uBottles = [];
                datas.map(item => {
                  bDeCount += item.bottleDown.emptyBottle.count;
                  bDfCount += item.bottleDown.fullBottle.count;
                  bUeCount += item.bottleUp.emptyBottle.count;
                  bUfCount += item.bottleUp.fullBottle.count;

                  dCount += item.bottleDown.emptyBottle.count + item.bottleDown.fullBottle.count;
                  uCount += item.bottleUp.emptyBottle.count + item.bottleUp.fullBottle.count;

                  bDeBottles = bDeBottles.concat(item.bottleDown.emptyBottle.bottles);
                  bDfBottles = bDfBottles.concat(item.bottleDown.fullBottle.bottles);
                  bUeBottles = bUeBottles.concat(item.bottleUp.emptyBottle.bottles);
                  bUfBottles = bUfBottles.concat(item.bottleUp.fullBottle.bottles);

                  dBottles = dBottles.concat(item.bottleDown.fullBottle.bottles, item.bottleDown.emptyBottle.bottles);
                  uBottles = uBottles.concat(item.bottleUp.fullBottle.bottles, item.bottleUp.emptyBottle.bottles);
                })
                that.newAccount[i].newData = {
                  bottleDown: {
                    efBottle: {
                      count: dCount,
                      bottles: dBottles
                    },
                    emptyBottle: {
                      count: bDeCount,
                      bottles: bDeBottles
                    },
                    fullBottle: {
                      count: bDfCount,
                      bottles: bDfBottles
                    }
                  },
                  bottleUp: {
                    efBottle: {
                      count: uCount,
                      bottles: uBottles
                    },
                    emptyBottle: {
                      count: bUeCount,
                      bottles: bUeBottles
                    },
                    fullBottle: {
                      count: bUfCount,
                      bottles: bUfBottles
                    }
                  }
                }
              }

              //				console.log(that.newAccount);
              let j = 0;
              let k = 0;
              let l = 0;
              let m = 0;
              if (that.vertical == '全部') {
                that.totalNum = 0;
                that.upNum = 0;
                that.downNum = 0;
                that.upDownNum = 0;
              }

              for (let i = 0; i < that.newAccount.length; i++) {

                let bDe = that.newAccount[i].newData.bottleDown.emptyBottle //下空瓶
                let bDf = that.newAccount[i].newData.bottleDown.fullBottle //下重瓶
                let bUe = that.newAccount[i].newData.bottleUp.emptyBottle //上空瓶
                let bUf = that.newAccount[i].newData.bottleUp.fullBottle //上重瓶
                let bgIcon = '';

                if (that.vertical == '全部') {

                  if ((bDe.count != 0 || bDf.count != 0) && (bUe.count == 0 && bUf.count == 0)) {
                    //							icons = require('../../../src/assets/images/red1.png');
                    j++;
                    that.totalNum++;
                    that.downNum++;
                    bgIcon =
                      `<div  style='line-height:20px;font-size:12px;width:20px;height:20px;background:#f00;border-radius:10px;color:#fff;font-weight:600;'>${j}</div>`;
                  } else if ((bUe.count != 0 || bUf.count != 0) && (bDe.count == 0 && bDf.count == 0)) {
                    //							icons = require('../../../src/assets/images/blue.png')
                    j++;
                    that.totalNum++;
                    that.upNum++;
                    bgIcon =
                      `<div style='line-height:20px;font-size:12px;width:20px;height:20px;background:#0f0;border-radius:10px;color:#000;font-weight:600;'>${j}</div>`;

                  } else if ((bDe.count != 0 || bDf.count != 0) && (bUe.count != 0 || bUf.count != 0)) {
                    //							icons = require('../../../src/assets/images/redBlue.png')
                    j++;
                    that.totalNum++;
                    that.upDownNum++;
                    bgIcon =
                      `<div style='line-height:20px;font-size:12px;width:20px;font-weight:600;height:20px;background:#0f0;border-radius:10px;color:#000;background-image: linear-gradient(to right, transparent 50%, #f00 0);'>${j}</div>`;
                  }
                } else if (that.vertical == '上瓶点') {

                  if ((bUe.count != 0 || bUf.count != 0) && (bDe.count == 0 && bDf.count == 0)) {
                    k++;
                    bgIcon =
                      `<div style='line-height:20px;font-size:12px;width:20px;height:20px;background:#0f0;border-radius:10px;color:#000;font-weight:600;'>${k}</div>`;
                  }
                } else if (that.vertical == '下瓶点') {

                  if ((bDe.count != 0 || bDf.count != 0) && (bUe.count == 0 && bUf.count == 0)) {
                    l++;
                    bgIcon =
                      `<div style='line-height:20px;font-size:12px;width:20px;height:20px;background:#f00;border-radius:10px;color:#fff;font-weight:600;'>${l}</div>`;
                  }

                } else if (that.vertical == '上下瓶点') {

                  if ((bDe.count != 0 || bDf.count != 0) && (bUe.count != 0 || bUf.count != 0)) {
                    m++;
                    bgIcon =
                      `<div style='line-height:20px;font-size:12px;width:20px;font-weight:600;height:20px;background:#0f0;border-radius:10px;color:#000;background-image: linear-gradient(to right, transparent 50%, #f00 0);'>${m}</div>`;
                  }
                }



                let points = that.newAccount[i].point.split(',')
                if (points[0] != this.lns || points[1] != this.lats) {

                  this.marker = new AMap.Marker({
                    map: map,
                    position: points,
                    content: `${bgIcon}`,
                    icon: new AMap.Icon({
                      image: icons,
                      size: new AMap.Size(0, 0), //图标大小
                      imageSize: new AMap.Size(0, 0)
                    }),
                    offset: new AMap.Pixel(-10, -10),
                    autoRotation: true,
                    angle: 0,
                    draggable:true,
                    raiseOnDrag:true
                  });
                  this.marker.datas = that.newAccount[i].newData;
                  if (j) {
                    this.marker.sortNum = j;
                  } else if (k) {
                    this.marker.sortNum = k;
                  } else if (l) {
                    this.marker.sortNum = l;
                  } else {
                    this.marker.sortNum = m;
                  }

                  that.clickBottleInfo = []
                  that.bottleDetailShow = false;
                  this.marker.on('click', function(e) {
                    if (e.target.sortNum) {
                      that.sortNum = e.target.sortNum;
                    }

                    that.bottleDetailShow = true;
                    that.bottleDetail = [];
                    //上重瓶数量及瓶编号
                    //								let ufc = e.target.datas.bottleUp.fullBottle.count;
                    //								let ufBottle = e.target.datas.bottleUp.fullBottle.bottles;
                    let ufc = e.target.datas.bottleUp.efBottle.count;
                    let ufBottle = e.target.datas.bottleUp.efBottle.bottles;
                    let ufbInfo = '';
                    let ufbList = ''
                    if (ufBottle.length > 0) {

                      for (let item of ufBottle) {
                        item.totals = ufBottle.length;
                        item.action = '上瓶';
                        ufbList +=
                          `<span onclick='seeInfoClick("${item.bottleTag}")'>${item.bottleTag?item.bottleTag:''}</span>`;
                      }
                      that.bottleDetail = that.bottleDetail.concat(ufBottle)
                    }

                    ufbInfo += `<div class='ufbItem'>${ufbList}</div>`

                    //上轻瓶数量及瓶编号
                    //								let uec = e.target.datas.bottleUp.emptyBottle.count;
                    //								let ueBottle = e.target.datas.bottleUp.emptyBottle.bottles;
                    //								let uebInfo = '';
                    //								let uebList = '';
                    //								if(ueBottle.length > 0) {
                    //
                    //									for(let item of ueBottle) {
                    //										item.totals=ueBottle.length;
                    //										item.action='上空瓶';
                    //										uebList += `<span onclick='seeInfoClick("${item.bottleTag}")'>${item.bottleTag}</span>`;
                    //									}
                    //									that.bottleDetail=that.bottleDetail.concat(ueBottle)
                    //								}
                    //								uebInfo += `<div class='uebItem'>${uebList}</div>`

                    //下重瓶数量及瓶编号
                    //								let dfc = e.target.datas.bottleDown.fullBottle.count;
                    //								let dfBottle = e.target.datas.bottleDown.fullBottle.bottles;
                    let dfc = e.target.datas.bottleDown.efBottle.count;
                    let dfBottle = e.target.datas.bottleDown.efBottle.bottles;
                    let dfbInfo = '';
                    let dfbList = '';
                    if (dfBottle.length > 0) {

                      for (let item of dfBottle) {
                        item.totals = dfBottle.length;
                        item.action = '下瓶';
                        dfbList +=
                          `<span onclick='seeInfoClick("${item.bottleTag}")'>${item.bottleTag?item.bottleTag:''}</span>`;
                      }
                      that.bottleDetail = that.bottleDetail.concat(dfBottle)
                    }
                    dfbInfo += `<div class='dfbItem'>${dfbList}</div>`

                    //下轻瓶数量及瓶编号
                    //								let dec = e.target.datas.bottleDown.emptyBottle.count;
                    //								let deBottle = e.target.datas.bottleDown.emptyBottle.bottles;
                    //								let debInfo = '';
                    //								let debList = '';
                    //								if(deBottle.length > 0) {
                    //
                    //									for(let item of deBottle) {
                    //										item.totals=deBottle.length;
                    //										item.action='下空瓶';
                    //										debList += `<span onclick='seeInfoClick("${item.bottleTag}")'>${item.bottleTag}</span>`;
                    //									}
                    //									that.bottleDetail=that.bottleDetail.concat(deBottle)
                    //								}
                    //								debInfo += `<div class='debItem'>${debList}</div>`
                    let info = '';
                    let upFullCount = `<div class='countTitle'><span class='counts'>上瓶数量:</span>${ufc}</div>`;
                    //								let upEmptyCount = `<div class='countTitle'><span class='counts'>上轻瓶数量:</span>${uec}</div>`;
                    let downFullCount = `<div class='countTitle'><span class='counts'>下瓶数量:</span>${dfc}</div>`;
                    //								let downEmptyCount = `<div class='countTitle'><span class='counts'>下轻瓶数量:</span>${dec}</div>`;
                    let closeInfos =
                      `<div style='height:20px;position:absolute;right:2px;top:-5px;color:#40ceff;z-index=1100;font-size:26px;cursor:pointer;' onclick='closeInfo()'>×</div>`;
                    info +=
                      `<div class='infoMain'>${upFullCount}${ufbInfo}${downFullCount}${dfbInfo}${closeInfos}</div>`;
                    var infoWindow = new AMap.InfoWindow({
                      content: info, //使用默认信息窗体框样式，显示信息内容
                      offset: new AMap.Pixel(0, -10)

                    });

                    infoWindow.open(map, e.target.getPosition());

                    window.closeInfo = function() {
                      that.bottleDetailShow = false;
                      infoWindow.close()
                    }
                  })

                }

              }
            }
            pointMap = null;
            var polyline = new AMap.Polyline({
              map: map,
              path: that.lineArr,
              showDir: true,
              strokeColor: "#28F", //线颜色
              // strokeOpacity: 1,     //线透明度
              strokeWeight: 6, //线宽
              // strokeStyle: "solid"  //线样式
            });
            var passedPolyline = new AMap.Polyline({
              map: map,
              // path: lineArr,
              strokeColor: "#AF5", //线颜色
              // strokeOpacity: 1,     //线透明度
              strokeWeight: 6, //线宽
              // strokeStyle: "solid"  //线样式
            });
            that.marker.on('moving', function(e) {
              //					let nlns=e.passedPath[e.passedPath.length-1].R;
              //					let nlas=e.passedPath[e.passedPath.length-1].Q;
              //					that.newAccount.forEach(item=>{
              //						let points=item.point.split(',');
              //						if(nlns==points[0]&&nlas==points[1]){
              //							console.log(points)
              //						}
              //					})
              passedPolyline.setPath(e.passedPath);
            });
            map.setFitView();
          }

        }, 10)
      },
      startAnimation() {
        this.marker.moveAlong(this.lineArr, 1000);
      },
      pauseAnimation() {
        this.marker.pauseMove();
      },
      resumeAnimation() {

        this.marker.resumeMove();

      },
      stopAnimation() {
        this.marker.stopMove();
      },
      fastAnimation() {
        this.marker.moveAlong(this.lineArr, 10000);
      },

    },
  }
</script>

<style scoped>
  .main {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 201;
    background: 0;
    /*padding: 35px 30px 30px;*/
    box-shadow: 0 2px 4px 0 #40a9ff4a;
  }

  #container {
    width: 100%;
    height: 100%;
    /*margin: 30px 30px 20px;*/
    z-index: 201;
  }

  .getInfoWrapper {
    position: absolute;
    right: 0;
    top: 36px;
    background: #fff;
    z-index: 1000;
    padding-bottom: 5px;

  }

  .locusBack {
    color: #fff;
    background: #28a4bf;
    /*z-index: 1000;*/
    width: 280px;
    height: 32px;
    line-height: 28px;
    cursor: pointer;
    /*border-radius: 6px;*/
    box-shadow: 0 2px 4px 0 #40a9ff4a;
    /*position: absolute;
		right: 0;
		top:68px;
		z-index: 2000;*/
    margin-bottom: 10px;
  }

  .playBox {
    width: 280px;
    /*position: absolute;
		right: 0px;
		top: 100px;
		z-index: 1000;*/
    background: #fff;

  }

  /*.playBox>>>.ivu-btn-success{
		background: 0;
		border: 0;
		color: #0079fb;
	}*/
  .playBox button {
    height: 28px;
    width: 50px;
    padding: 0;
  }

  .closeBtn {
    color: #000;
    position: absolute;
    left: 10px;
    top: 3px;
    z-index: 1050;
    cursor: pointer;
    /*background: #ddebf1;*/
    width: 30px;
    height: 28px;
    line-height: 28px;
    /*box-shadow: 0px 3px 3px #c8c8c8;*/
  }

  .closeBtn img {
    width: 28px;
    height: auto;
  }

  .locDate {
    width: 280px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1100;
    box-shadow: 0 2px 4px 0 #40a9ff4a;
    background: #fff;
  }

  .checkAction {
    position: absolute;
    right: 283px;
    top: 38px;
    background: #fff;
    z-index: 300;
    box-shadow: 0 2px 4px 0 #40a9ff4a;
    text-align: left;
    width: 140px;
    padding: 0 0 0 5px;
  }

  .checkAction>>>.ivu-radio-wrapper {
    margin: 0;
  }

  #container>>>.amap-icon img {
    /*width: 40px;*/
    /*height: 40px;*/
  }

  #container>>>.infoMain {
    padding: 5px 0 0 0;
    font-size: 12px;
    max-height: 400px;
    overflow-y: auto;
  }

  #container>>>.amap-info-content {
    /*padding:10px 20px;*/
    /*border: 1px solid #ccc;*/
    /*width: 300px;*/
  }

  #container>>>.amap-info-close {
    right: 5px !important;
  }

  #container>>>.countTitle {
    font-weight: 600;
    font-size: 14px;

    margin-bottom: 2px;
    color: #40c1ff;
  }

  #container>>>.counts {
    padding-right: 4px;
    color: #333;
  }

  #container>>>.ufbItem,
  #container>>>.uebItem,
  #container>>>.dfbItem,
  #container>>>.debItem {
    line-height: 20px;
    display: flex;
    flex-wrap: wrap;
    max-width: 240px;
  }

  #container>>>.ufbItem {
    color: #13CE66;
  }

  #container>>>.ufbItem span {
    padding-left: 5px;
    cursor: pointer;
  }

  #container>>>.uebItem {
    color: #13C2C2;

  }

  #container>>>.uebItem span {
    padding-left: 5px;
    cursor: pointer;
  }

  #container>>>.dfbItem {
    color: #f00;
  }

  #container>>>.dfbItem span {
    padding-left: 5px;
    cursor: pointer;
  }

  #container>>>.debItem {
    color: #8CC5FF;
  }

  #container>>>.debItem span {
    padding-left: 5px;
    cursor: pointer;
  }

  .defaultInfo {
    width: 280px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    position: absolute;
    left: 50px;
    top: 2px;
    z-index: 1100;
    background: #EF8920;
    padding: 0 5px;
    box-shadow: 0 2px 4px 0 #40a9ff4a;
    color: #fff;
    margin-bottom: 10px;
  }

  #container>>>.amap-info-close {
    color: #51b5ea;
    display: none;
  }

  .topInfo {
    width: 100%;
    height: 36px;
    background: #fff;
    box-shadow: 0 2px 4px 0 #40a9ff4a;
  }

  .staffAndNum {
    position: absolute;
    left: 50%;
    top: 8px;
    z-index: 1050;
    margin-left: -200px;
    color: #e20cdb;
    font-size: 16px;
    width: 400px;
  }

  .bottleInfo {
    position: absolute;
    right: 0;
    top: 83px;
    background: #FFFFFF;
    width: 280px;
    z-index: 1080;
    padding: 10px;
    text-align: left;
    box-shadow: 0 2px 4px 0 #40a9ff4a;
    max-height: calc(100% - 175px);
    overflow-y: auto;
  }

  .infoItem {
    font-size: 14px;
    margin-bottom: 5px;
    border-bottom: 1px dotted #dcdee2;
    color: #ff5e00;
  }

  .infoLabel {
    width: 105px;
    display: inline-block;
    text-align: right;
    font-weight: 600;
    color: #007cff;

  }
</style>
