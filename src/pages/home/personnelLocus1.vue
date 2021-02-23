<template>
	<div class="locusMain">
		<div class='topInfo'>
		</div>
		<div id="locusContainer"></div>
		<div class="closeBtn" @click='handleCloseClick'><img src="@/assets/images/backClick.png" /></div>
		<div class="locDate">
			<Date-picker format="yyyy-MM-dd HH:mm" v-model='dateTime' type="datetimerange" placement="bottom-start" placeholder="选择日期" style="width: 280px" @on-change='changeDate'></Date-picker>
		</div>
		<div class='defaultInfo' v-show='defaultInfo'>仅展示当天的记录，更多记录可通过选择时间查找。</div>
		<div class='staffAndNum'>
			<span>配送员：</span>
			<span>{{staffName}}</span>
		</div>
		<div class="playBox">
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
				lineArr:[]
			}

		},
		methods: {
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
				this.lineArr=[];
				_http.http1('post', pathUrls.getStaffTrajectory, {
					staffId: this.staffId,
					startTime: this.startTime,
					endTime: this.endTime
				}, 'form').then((res) => {
					this.locusPoint=res.data;
					if(res.data[0]){
					for(let item of res.data[0]){
						this.lineArr.push([item.x,item.y])
					}	
					}
					
					this.init()
				})
			},
			handleCloseClick() {
				this.$emit('locusShow', false)
			},
			init() {
				var map = new AMap.Map('locusContainer', {
					resizeEnable: true,
					zoom: 14,
					center: [this.lns, this.lats],
				})
				let icon = require('../../../src/assets/images/locusPerson.png')
				let wSize = 30;
				let hSize = 30;
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
			this.staffName=this.param.names;
			
			this.getStaffLocus();
			const myDate = new Date();
		    const year = myDate.getFullYear(); // 获取当前年份
		    const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		    const day = myDate.getDate(); // 获取当前日（1-31）
			this.dateTime =[ `${year}-${month}-${day}`+' '+'00:00',`${year}-${month}-${day}`+' '+'23:59'];
			//			console.log(this.lns,this.lats)
		
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
		right:10px;
		top:0;		
		z-index: 1100;
		box-shadow: 0 2px 4px 0 #40a9ff4a;
		background: #fff;				
	}
	.defaultInfo{
		width: 280px;
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		position: absolute;
		left:50px;
		top:2px;
		z-index: 1100;
		background: #EF8920;
		padding: 0 5px;
		box-shadow: 0 2px 4px 0 #40a9ff4a;
		color:#fff;
		margin-bottom: 10px;
	}
	.staffAndNum{
		position: absolute;
		left:50%;
		top:8px;
		z-index: 1330;
		margin-left: -200px;
		color:#e20cdb;
		font-size: 16px;
		width: 400px;
	}
	.playBox{
		width: 280px;
		background: #fff;
		position: absolute;
		right:10px;
		top:37px;
		z-index: 1000;
	}
	.playBox button{
	    height: 28px;	
	    width: 50px;	
	    padding: 0;
	    margin: 0 2px;
	}
</style>