<template>
	<div class="main">
		<div class='topInfo'></div>
		<div id="someContainer">
        <Spin fix v-if='loading' size="large"></Spin>
    </div>
		<div class="closeBtn" @click='handleCloseClick' v-if='showInfos'><img src="@/assets/images/backClick.png" /></div>
		<div class="locDate" v-if='showInfos'>
			<Date-picker format="yyyy-MM-dd HH:mm" v-model='dateTime' type="datetimerange" placement="bottom-start" placeholder="选择日期" style="width: 280px" @on-change='changeDate'></Date-picker>
		</div>
		<div class="carInfosScroll" v-if='showInfos'>
			<div class='carInfos'>
				<div class="carInfoTitle">
					<span style="width: 30px;">颜色</span>
					<span style="width: 30px;">类型</span>
					<span style="width: 80px;">车牌号</span>
					<span style="width: 80px;">配送员</span>
				</div>
				<div>
					<div v-for='item in someLocusArr' :key='item.id' class='carInfoContent'>
						<span style="height: 22px;width: 30px;"><span :style="{background:item.color}" style="width: 20px;height: 10px;margin:auto;border-radius: 2px;"></span></span>
						<span style="width: 30px;"><img :src="item.srcUrl" alt="" style="margin-bottom: -4px;display: inline-block;width:auto;height: 20px;"/></span>
						<span style="width: 80px;" :style="{color:item.color}" :title='item.carNumber'>{{item.carNumber}}</span>
						<span style="width: 80px;" :style="{color:item.color}" :title='item.staffName'>{{item.staffName}}</span>
					</div>
				</div>

			</div>
		</div>
		<div class="playBox" v-if='showInfos'>
			<Button @click="startAnimation" type="success">播放</Button >
			<Button @click="pauseAnimation" type="warning">暂停</Button >
			<Button @click="resumeAnimation" type="info">继续</Button >
			<Button @click="fastAnimation" type="primary">极速</Button >
		</div>
	</div>
</template>

<script>
	import AMap from 'AMap';
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'someLocus',
		props:{
			someLocusArr:Array
		},
		data(){
			return{
				showInfos:false,
				userData: (JSON.parse(this.$store.state.userData)),
				dateTime: [],
				startTime:null,
				endTime:null,
				locusArr:[],
				allCarData:[],
				markers:[],
				lineArr:[],
				carIds:[],
        loading:false
			}
		},
		methods:{
			compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
  			 },
			//切换日期
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

				this.startTime = e[0]
				}
				else{

				this.startTime = e[0]
				this.endTime = e[1]
				}
				this.pauseAnimation()
//				this.getTrajectory()
				this.getTrajectories()
			},
			//关闭轨迹地图
			handleCloseClick() {
				this.$emit('someIfShow', false)
			},
			//加载地图
			init() {
				this.markers=[];
				var map = new AMap.Map('someContainer', {
					resizeEnable: true,
					zoom: 14,
					center: [this.userData.lng,this.userData.lat],
				})
				let icon = require('../../../src/assets/images/lahuoche.png')
				let icons='';
				let wSize = 30;
				let hSize = 30;
        let lSize = 0;
        let rSize = -30;
				this.someLocusArr.forEach((item,index)=>{
					if(item.vehicleType == 1) {
					// icon = require('../../../src/assets/images/sanlunche_2.png')
					icon = require('../../../src/assets/images/sanlunche.png')
					wSize = 42;
					hSize = 24;
					lSize= -21;
					rSize = -12;
				} else if(item.vehicleType == 2) {
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
					position: item.location,
					icon: new AMap.Icon({
						image: icon,
						size: new AMap.Size(60, 60), //图标大小
						imageSize: new AMap.Size(wSize, hSize)
					},),
					offset: new AMap.Pixel(lSize, rSize),
					autoRotation: true,
					angle: 0,
				});
				this.marker.staffName=item.staffName;
				this.marker.on('click', (e) => {
					this.infoWindow = new AMap.InfoWindow({
						content:e.target.staffName,
						offset: new AMap.Pixel(10, -10),

					});
					this.infoWindow.open(map,item.location);

				})
				this.markers.push({marker:this.marker,index:index});
				})

			this.lineArr=[]	;

			this.allCarData.forEach((eveData,index)=>{

				var graspRoad;
				var pathParams =eveData;

					if(!graspRoad) {
					graspRoad = new AMap.GraspRoad()
				}
				let lineArr=[];

			function getNewLocus(info){
				return new Promise((resolve, reject) => {
						graspRoad.driving(info, function(error, result){
							if(result){
							let newsPoints=result.data.points;
							 resolve(newsPoints);

							}
							if(error){
								let newsPoints=[];
							 	resolve(newsPoints);
//								reject(error)
							}

				})
				})
			}
			let promises = pathParams.map((item) => {
			  	return getNewLocus(item);
			});

			Promise.all(promises).then((allData) => {
				  if(allData.length){
				  		allData.forEach(points=>{
				  			points.forEach(its=>{
				  				lineArr.push([its.x,its.y]);

				  			})
				  		})
					  }else{
					  	      lineArr=[];
					  }
				this.lineArr.push({lineArr:lineArr,index:index});

				 let colors=this.someLocusArr[index].color;

				  var polyline = new AMap.Polyline({
					map: map,
					path: lineArr,
					showDir: true,
					strokeColor:colors, //线颜色
					// strokeOpacity: 1,     //线透明度
					strokeWeight: 6, //线宽
					// strokeStyle: "solid"  //线样式
				});

				var passedPolyline = new AMap.Polyline({
					map: map,
					// path: lineArr,
					strokeColor: "#17bf11", //线颜色
					// strokeOpacity: 1,     //线透明度
					strokeWeight: 6, //线宽
					 strokeStyle: "solid"  //线样式
				});

					let that=this;

						this.markers[index].marker.on('moving', function(e) {
//						console.log(this.lineArr)
						let passPath=e.passedPath.length
						let newLngLat=[e.passedPath[passPath-1].lng,e.passedPath[passPath-1].lat];
						passedPolyline.setPath(e.passedPath);

//					that.infoWindow = new AMap.InfoWindow({
//						content:e.target.staffName,
//						offset: new AMap.Pixel(10, -10),
//
//					});
//					that.infoWindow.open(map,newLngLat);
                   if(that.markers[index].marker){
                   	that.markers[index].marker.on('click', (ea) => {
					that.infoWindow = new AMap.InfoWindow({
						content:ea.target.staffName,
						offset: new AMap.Pixel(10, -10),

					});
					that.infoWindow.open(map,newLngLat);

				})
                   }

				});


//				map.setFitView();

//						this.markers[index].marker.moveAlong(lineArr, 1000);





//				this.marker.moveAlong(lineArr, 1000);


				}).catch((err) => {



				})
			})





			},
			startAnimation() {
				this.markers.forEach(item=>{
					this.lineArr.forEach(items=>{
						if(item.index==items.index){
							item.marker.moveAlong(items.lineArr, 1000);
						}
					})
				})


			},
			pauseAnimation() {
				this.markers.forEach(item=>{
					this.lineArr.forEach(items=>{
						if(item.index==items.index){
							item.marker.pauseMove(items.lineArr, 1000);
						}
					})
				})

			},
			resumeAnimation() {
				this.markers.forEach(item=>{
					this.lineArr.forEach(items=>{
						if(item.index==items.index){
							item.marker.resumeMove(items.lineArr, 1000);
						}
					})
				})

			},
//			stopAnimation() {
//				this.markers.forEach(item=>{
//					this.lineArr.forEach(items=>{
//						if(item.index==items.index){
//							item.marker.stopMove(items.lineArr, 1000);
//						}
//					})
//				})
//			},
			fastAnimation(){
				this.markers.forEach(item=>{
					this.lineArr.forEach(items=>{
						if(item.index==items.index){
							item.marker.moveAlong(items.lineArr, 10000);
						}
					})
				})
			},
			getTrajectory() {
				let that=this;
				this.markers=[];
				function getAllCarData(id,index){
					return new Promise((resolve, reject) => {
						_http.http1('post', pathUrls.getTrajectory + '/' + id, {
							startTime: that.startTime,
							endTime: that.endTime
				}, 'form').then((res) => {
					if(res.code==0){
						resolve(res.data.trajectory);
					}else{
						resolve([])
					}

				})
					})

				}
				let promises = this.someLocusArr.map((item, index) => {
			  	return getAllCarData(item.id,index);
			});

				Promise.all(promises).then((allData) => {
					this.allCarData=allData;
					this.init();
					this.showInfos=true;

				})




			},
			getTrajectories(){
				this.allCarData=[];
        this.showInfos=true;
        this.loading=true;
				_http.http2('post', pathUrls.getTrajectories,{
							startTime: this.startTime,
							endTime: this.endTime,
							ids:this.carIds
				}).then((res) => {
           this.loading=false;
					let newData=res.data.sort(this.compare('carId'));
					for(let item of newData){
						this.allCarData.push(item.trajectory)
					}
					this.init();

				}).catch(()=>{
           this.loading=false;
        })
			},
		},
		mounted(){
			this.carIds=[];
			this.someLocusArr=this.someLocusArr.sort(this.compare('id'));
			for(let item of this.someLocusArr){
				this.carIds.push(item.id);
			}
//			this.getTrajectory();
			this.getTrajectories();

			const myDate = new Date();
		    const year = myDate.getFullYear(); // 获取当前年份
		    const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		    const day = myDate.getDate(); // 获取当前日（1-31）
			this.dateTime =[ `${year}-${month}-${day}`+' '+'00:00',`${year}-${month}-${day}`+' '+'23:59'];
		}
	}
</script>

<style type="text/css" scoped>
.main {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 201;
		background:#fff;
		/*padding: 35px 30px 30px;*/
		box-shadow: 0 2px 4px 0 #40a9ff4a;
	}
#someContainer{
		width: 100%;
		height: 100%;
		/*margin: 30px 30px 20px;*/
		z-index: 201;
	}
.topInfo{
	width: 100%;
	height:36px;
	background: #fff;
	box-shadow: 0 2px 4px 0 #40a9ff4a;
	}
	.closeBtn {
		color: #000;
		position: absolute;
		left: 10px;
		top:3px;
		z-index: 1200;
		cursor: pointer;
		/*background: #ddebf1;*/
		width: 30px;
		height: 28px;
		line-height: 28px;
		/*box-shadow: 0px 3px 3px #c8c8c8;*/
	}
	.closeBtn img{
		width: 28px;
		height: auto;
	}
	.locDate {
		width: 280px;
		position: absolute;
		right:0;
		top:0;
		z-index: 1100;
		box-shadow: 0 2px 4px 0 #40a9ff4a;
		background: #fff;

	}
	.carInfosScroll{
		height: calc(100% - 128px);
		width: 320px;
		overflow-y: auto;

		position: absolute;
		left: 0;
		top:36px;
		z-index: 1100;
	}
	.carInfos{
		position: absolute;
		left: 0;
		top:0;
		z-index: 1100;
		box-shadow: 0 2px 4px 0 #40a9ff4a;
		background: #fff;
		width:100%;
		/*min-height: 100px;*/
		padding: 10px;


	}
	.carInfoTitle {
		background:#E2EEFF;
		color: #51B5EA;
		font-weight: 600;
	}
	.carInfoTitle span{
		display: inline-block;
		margin: 0 5px;

	}
	.carInfoContent{
		margin: 4px 0;
		border-bottom: 1px solid #eee;

	}
	.carInfoContent span{
		display: inline-block;
		margin: 0 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

	}
	.playBox{
		width: 280px;
	    position: absolute;
		right: 0px;
		top: 36px;
		z-index: 1000;
		background: #fff;
		padding-bottom: 5px;

	}
	.playBox button{
	    height: 28px;
	    width: 50px;
	    padding: 0;
	}
</style>
