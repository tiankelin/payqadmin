<template>
  <div class="locusMain" v-show='isSuccess'>
    <div class='topInfo'>
    </div>
    <div id="locusContainer"></div>
    <div class="closeBtn" @click='handleCloseClick'><img src="@/assets/images/backClick.png" /></div>
    <div class="locDate">
      <Date-picker format="yyyy-MM-dd HH:mm" v-model='dateTime' type="datetimerange" placement="bottom-start"
        placeholder="选择日期" style="width: 280px" @on-change='changeDate'></Date-picker>
    </div>
    <div class='defaultInfo' v-show='defaultInfo'>仅展示当天的记录，更多记录可通过选择时间查找。</div>
    <div class='staffAndNum'>
      <span>{{staffType}}:</span>
      <span>{{newStaffName}}</span>
    </div>
    <div class="locusBtn">
      <div class="locusBack">
        <RadioGroup v-model="locusBack" @on-change='changeLocusType'>
          <Radio label="轨迹" style='margin-right: 60px;'></Radio>
          <Radio label="回放"></Radio>
        </RadioGroup>
      </div>
      <div class="playBox" v-show='ds'>
        <Button @click="startAnimation" type="success">播放</Button>
        <Button @click="pauseAnimation" type="warning">暂停</Button>
        <Button @click="resumeAnimation" type="info">继续</Button>
        <Button @click="fastAnimation" type="primary">极速</Button>
      </div>
      <div v-if='showPointDetail' style="width: 280px;">
        <div style="font-weight: 600;text-align: left;padding: 0 20px;"><span class="itemLabel">动作点类型：</span><span
            style="color: #0095FF;">{{pointType}}</span></div>
        <div style="text-align: left;padding: 0 20px;" v-if='pointType=="安检点"'>
          <div class='pointItem'><span class="itemLabel">安检编号：</span><span @click='toInfoClick' style="cursor: pointer;color: #13CE66;">{{checkNum}}</span></div>
          <div class='pointItem'><span class="itemLabel">联系人：</span><span>{{userName}}</span></div>
          <div class='pointItem'><span class="itemLabel">户号：</span><span>{{userAccount}}</span></div>
          <div class='pointItem'><span class="itemLabel">安检人：</span><span>{{checkName}}</span></div>
          <div class='pointItem'><span class="itemLabel">安检时间：</span><span>{{checkTime}}</span></div>
          <div class='pointItem'><span class="itemLabel">安检地址：</span><span>{{checkAdress}}</span></div>
        </div>
        <div style="text-align: left;padding: 0 20px;" v-else-if='pointType=="稽查点"'>
          <div class='pointItem'><span class="itemLabel">稽查人：</span><span>{{auditStaffName}}</span></div>
          <div class='pointItem'><span class="itemLabel">被检人姓名：</span><span>{{managerStaffName}}</span></div>
          <!--<div class='pointItem'><span class="itemLabel">稽查类型名称：</span><span>{{auditTypeName}}</span></div>-->
          <div class='pointItem'><span class="itemLabel">稽查时间：</span><span>{{createTime}}</span></div>
          <div class='pointItem'><span class="itemLabel">稽查地址：</span><span>{{auditAddress}}</span></div>
        </div>
        <div style="text-align: left;padding: 0 20px;" v-else>
          <div class='pointItem'><span class="itemLabel">订单号：</span><span @click='toInfoClick1' style="cursor: pointer;color: #13CE66;">{{orderCode}}</span></div>
          <div class='pointItem'><span class="itemLabel">联系人：</span><span>{{userName}}</span></div>
          <div class='pointItem' v-for='(item,index) in goodsNameList' :key='item.index'><span class="itemLabel">商品：</span><span
              style="margin-right: 10px;">{{item.goodsName}}</span><span>x{{item.number}}</span></div>
          <!--<div class='pointItem'><span class="itemLabel">户号：</span><span>{{userAccount}}</span></div>-->
          <div class='pointItem'><span class="itemLabel">配送员：</span><span>{{staffName}}</span></div>
          <div class='pointItem'><span class="itemLabel">配送时间：</span><span>{{orderFinishTime}}</span></div>
          <div class='pointItem'><span class="itemLabel">用户地址：</span><span>{{orderUserAddress}}</span></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import AMap from 'AMap';
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'personnelLocus',
		props: {
			param: {
				type: Object,
				default: () => {

				}
			}
		},
		data() {
			return {
				goodsNameList:[],
				goodsList:[],
				staffTypeName:'',
				orderFinishTime:'',
				orderUserAddress:'',
				staffName:'',
				orderUserName:'',
				orderCode:'',
				auditTypeName:'',
				createTime:'',
				managerStaffName:'',
				auditStaffName:'',
				auditAddress:'',
				codes:'',
				checkAdress:'',
				checkTime:'',
				checkName:'',
				userAccount:'',
				userName:'',
				checkNum:'',
				showPointDetail:false,
				pointType:'',
				locusBack:'轨迹',
				ds:false,
				isSuccess:false,
				defaultInfo:true,
				userData: (JSON.parse(this.$store.state.userData)),
				lns: '',
				lats: '',
				staffId: '',
				locusPoint: [],
				dateTime:[],
				startTime:null,
				endTime:null,
				staffName:'',
				lineArr:[],
				actionArr:[],
				staffType:''

			}

		},
		methods: {
			toInfoClick1(){
				this.$router.push('/merchandiseOrder/orderInfo' + '/' + this.orderCode + '/1')
			},
			toInfoClick() {
				this.$router.push('/securityRecord/checkInfo' + '/' + this.codes+'/1');
			},
			changeLocusType(val){
				if(val=='轨迹'){
					this.ds=false
//					this.vertical='全部';
				}else{
					this.showPointDetail=false;
					this.ds=true
				}
				this.init();
			},
			changeDate(e) {
				if(e[1].length){
					let ends=e[1].substring(e[1].length-5)
					let wholes=e[1].substring(0,e[1].length-5)
				if(ends=='00:00'){
					wholes=wholes+''+'23:59';
					this.dateTime=[e[0],wholes]
					this.endTime =wholes
				}else{
					this.endTime = e[1]
				}
				this.defaultInfo=false
				this.startTime = e[0]
				}
				else{
				this.defaultInfo=false
				this.startTime = e[0]
				this.endTime = e[1]
				}

				this.getStaffLocus()

			},
			//获取轨迹点
			getStaffLocus() {
				_http.http1('post', pathUrls.getStaffTrajectory, {
					staffId: this.staffId,
					startTime: this.startTime,
					endTime: this.endTime
				}, 'form').then((res) => {
					if(res.code==0){
						this.isSuccess=true;
						if(res.data){
					this.locusPoint=res.data.trajectory;
					this.actionArr=res.data.dataArr;
//					this.actionArr=[{
//						lat: "30.18098922166897",
//						lon: "120.20948420582803",
//						type: "securityCheck",
//						data:{
//							checkerName:'李四',
//							userName: "吴东英",
//							id: 981,
//							checkDate: "2020-05-27 21:50:06",
//							address: "浙江省杭州市滨江区滨安装完路9999"
//						}
//					}]
					}
					this.init()
					}
					if(res.code==500){
						this.isSuccess=false;
						this.$Message['warning']({
							background: true,
							content: '轨迹获取失败!',
							onClose: (() => {
								this.$emit('locusShow', false)
							})
						});

					}



				})
			},
			handleCloseClick() {
				this.$emit('locusShow', false)
			},
			init() {
				let icons='';
				var map = new AMap.Map('locusContainer', {
					resizeEnable: true,
					zoom: 14,
					center: [this.lns, this.lats],
				})
				let icon = require('../../../src/assets/images/locusPerson.png')
				let wSize = 30;
				let hSize = 30;

				if(this.ds||!this.actionArr.length){
					this.marker = new AMap.Marker({
					map: map,
					position: [this.lns, this.lats],
					icon: new AMap.Icon({
						image: icon,
						size: new AMap.Size(60, 60), //图标大小
						imageSize: new AMap.Size(wSize, hSize)
					}),
					offset: new AMap.Pixel(0, -30),
					autoRotation: true,
					angle: 0,
				});
					this.marker.setMap(map);
				}


				var pointMap = new Map();
				var graspRoad;
				var pathParam =this.locusPoint;

					if(!graspRoad) {
					graspRoad = new AMap.GraspRoad()
				}
				this.lineArr=[];

				let pathParamSize = 0;
				if(pathParam.length){
//					console.log(pathParam)
				for(let j=0;j<pathParam.length;j++ ){

					graspRoad.driving(pathParam[j],(error, result)=>{
						// console.log(error, result)
					if(!error) {
						pathParamSize++;
					var path2 = [];
					var newPath = result.data.points;
					var key = "index" + j;
					pointMap.set(key,newPath)

								}
				})
				}


//				console.log(pointMap)
					}

					// 绘制轨迹
				let asynInterval = setInterval(()=>{
					if (pathParamSize == pathParam.length) {
						clearInterval(asynInterval);
						for(let j=0;j<pathParam.length;j++ ){
					var key = "index" + j;
					for(let k=0;k<pointMap.get(key).length;k++){
						this.lineArr.push([pointMap.get(key)[k].x,pointMap.get(key)[k].y])
					}

				}

					pointMap=null;
					var polyline = new AMap.Polyline({
					map: map,
					path: this.lineArr,
					showDir: true,
					strokeColor: "#cc18ec", //线颜色
					// strokeOpacity: 1,     //线透明度
					strokeWeight: 6, //线宽
					// strokeStyle: "solid"  //线样式
				});
				var passedPolyline = new AMap.Polyline({
					map: map,
					// path: lineArr,
					strokeColor: "#4ee298", //线颜色
					// strokeOpacity: 1,     //线透明度
					strokeWeight: 6, //线宽
					// strokeStyle: "solid"  //线样式
				});
				this.marker.on('moving', (e)=> {
					passedPolyline.setPath(e.passedPath);
				});
				map.setFitView();
					}

				},10)

				if(!this.ds){

					this.actionArr.forEach((item,index)=>{
						let bgIcon='';
						let info='';
						let contents='';
						let closeInfos=	`<div style='height:20px;position:absolute;right:2px;top:-5px;color:#40ceff;z-index=1100;font-size:26px;cursor:pointer;' onclick='closeInfo()'>×</div>`;
						if(item.type=='securityCheck'){
							info=`<div>安检点</div>`
//							icons = require('../../../src/assets/images/work.png');
							bgIcon=`<div  style='line-height:20px;font-size:12px;width:20px;height:20px;background:#00f;border-radius:50%;color:#000;font-weight:600;'>${index+1}</div>`;
						}else if(item.type=='order'){
							info=`<div>配送点</div>`
							bgIcon=`<div  style='line-height:20px;font-size:12px;width:20px;height:20px;background:#ffb000;border-radius:50%;color:#000;font-weight:600;'>${index+1}</div>`;
						}else if(item.type=='audit'){
							info=`<div>稽查点</div>`
//							icons = require('../../../src/assets/images/outWork.png');
							bgIcon=`<div  style='line-height:20px;font-size:12px;width:20px;height:20px;background:#43e62f;border-radius:50%;color:#000;font-weight:600;'>${index+1}</div>`;
						}
						contents=`<div style='padding:10px'>${info}${closeInfos}</div>`
						let points=[item.lon,item.lat];
						this.marker = new AMap.Marker({
								map: map,
								position: points,
								content:`${bgIcon}`,
								icon: new AMap.Icon({
									image: icons,
									size: new AMap.Size(40, 40), //图标大小
									imageSize: new AMap.Size(40,40)
								}),
								offset: new AMap.Pixel(-10, -10),
								autoRotation: true,
								angle: 0,
                draggable:true,
                raiseOnDrag:true
							});

						this.marker.datas=item;
						this.showPointDetail=false;
						this.checkAdress='';
						this.checkTime='';
						this.checkName='';
						this.userAccount='';
						this.userName='';
						this.checkNum='';

						this.auditTypeName='';
						this.createTime='';
						this.managerStaffName='';
						this.auditStaffName='';
						this.auditAddress='';

						this.orderFinishTime='';
						this.orderUserAddress='';
						this.distributeTime='';
						this.staffName='';
						this.orderCode='';
						this.goodsNameList=[];
						this.marker.on('click',e=>{
							this.showPointDetail=true;
							let markData=e.target.datas;

							if(markData.type=='securityCheck'){
								this.pointType='安检点';
								this.checkAdress= markData.data.address;
								this.checkTime= markData.data.checkDate;
								this.checkName= markData.data.checkerName;
								this.userAccount= markData.data.userAccountNumber;
								this.userName= markData.data.userName;
								this.codes=markData.data.id;
								let ids = markData.data.id + '';
								let zeroStr = '';
							for(let i = 0; i < 9 - ids.length; i++) {
								zeroStr += '0'
							}
							this.checkNum = 'PASC' + zeroStr + ids;
							}else if(markData.type=='order'){
								this.pointType='配送点';
								this.orderFinishTime=markData.data.orderFinishTime;
								this.orderUserAddress=markData.data.orderUserAddress;
								this.staffName=markData.data.orderDeliveryUserName;
								this.userAccount= markData.data.orderUserAccountNumbers;
								this.userName= markData.data.orderUserName;
								this.orderCode=markData.data.orderCode;
								if(e.target.datas.data.orderBottleSpecification){
									let newGoods=JSON.parse(e.target.datas.data.orderBottleSpecification);
									this.goodsNameList=[];
									if(newGoods.toString()){
										for(let item of newGoods){
											this.goodsList.forEach(items=>{
												if(items.goodsId==item.goodsId){
													this.goodsNameList.push({goodsName:items.goodsName,number:item.number})
												}
										})

										}

									}

								}

							}else{
								this.pointType='稽查点';
								this.auditTypeName=markData.data.auditTypeName;
								this.createTime=markData.data.createTime;
								this.managerStaffName=markData.data.managerStaffName;
								this.auditStaffName=markData.data.auditStaffName;
								this.auditAddress=markData.data.auditAddress;
							}





							var infoWindow = new AMap.InfoWindow({
									content:contents, //使用默认信息窗体框样式，显示信息内容
									offset: new AMap.Pixel(0,-10)
									});
								let that=this;
								infoWindow.open(map, e.target.getPosition());
								window.closeInfo= function(){
									that.showPointDetail=false;
									infoWindow.close();
									}

						})
					})
				}
//				console.log(this.lineArr)
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
			fastAnimation(){
				this.marker.moveAlong(this.lineArr,10000);
			},

		},
		mounted() {
			this.lns = this.param.lns;
			this.lats = this.param.lats;
			this.staffId = this.param.id;
			this.newStaffName=this.param.names;
			this.staffType=this.param.staffType;

			this.getStaffLocus();
			const myDate = new Date();
		    const year = myDate.getFullYear(); // 获取当前年份
		    const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		    const day = myDate.getDate(); // 获取当前日（1-31）
			this.dateTime =[ `${year}-${month}-${day}`+' '+'00:00',`${year}-${month}-${day}`+' '+'23:59'];
			//获取商品列表
			this.common.getGoodsList().then((res)=>{
				this.goodsList=res.data;
			})
			//			console.log(this.lns,this.lats)
//			console.log(this.lineArr)
		}
	}
</script>

<style type="text/css" scoped>
  .locusMain {
    background: #fff;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1201;
    background: 0;
    /*padding: 35px 30px 30px;*/
    box-shadow: 0 2px 4px 0 #40a9ff4a;
  }

  #locusContainer {
    width: 100%;
    height: 100%;
    /*margin: 30px 30px 20px;*/
    z-index: 201;
  }

  .closeBtn {
    color: #000;
    position: absolute;
    left: 10px;
    top: 3px;
    z-index: 1200;
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

  .topInfo {
    width: 100%;
    height: 36px;
    background: #fff;
    box-shadow: 0 2px 4px 0 #40a9ff4a;
  }

  .locDate {
    width: 280px;
    position: absolute;
    right: 0px;
    top: 0;
    z-index: 1100;
    box-shadow: 0 2px 4px 0 #40a9ff4a;
    background: #fff;
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

  .staffAndNum {
    position: absolute;
    left: 50%;
    top: 8px;
    z-index: 1330;
    margin-left: -200px;
    color: #e20cdb;
    font-size: 16px;
    width: 400px;
  }

  .locusBtn {
    position: absolute;
    right: 0px;
    top: 37px;
    z-index: 1000;
    background: #fff;
    padding-bottom: 5px;
    box-shadow: 0 2px 4px 0 #40a9ff4a;
  }

  .locusBack {
    color: #fff;
    background: #28a4bf;
    width: 280px;
    height: 32px;
    line-height: 28px;
    cursor: pointer;
    box-shadow: 0 2px 4px 0 #40a9ff4a;
    margin-bottom: 10px;
  }

  .playBox {
    width: 280px;


  }

  .playBox button {
    height: 28px;
    width: 50px;
    padding: 0;
    margin: 0 2px;
  }

  #locusContainer>>>.amap-info-close {
    display: none;
  }

  .pointItem {
    min-height: 24px;
    line-height: 24px;
  }

  .itemLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    font-weight: 600;
  }
</style>
