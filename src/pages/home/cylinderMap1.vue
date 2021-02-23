<template>
	<div class="cylMain">
    <div class="countWrapper"><span>钢瓶总数：</span>{{bottleCount}}</div>
    <div class="backMap" @click="handleBackClick">
    	<img src="@/assets/images/back.png" alt="" />
    </div>
    <div class="mainContenter" :class="[expand?'mainContenter':'changeMainContainer']">
        <div id="cylContainer"></div>
        <div class='drawBack' @click='changeDrawBack'><img src="@/assets/images/right.png" alt="" v-if='expand' /><img src="@/assets/images/left.png" alt="" v-else/></div>
    </div>
    <div class="stationCylinder" :class="[expand?'stationCylinder':'expandCylinder']">
        
    </div>
	</div>
</template>

<script>
	import AMap from 'AMap'
	import Bus from '@/public/bus';
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: "cylinderMap",
		props:{
			tabsMap:String
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				cylArr: [],
				bottleCount:0,
        expand:true,
			}
		},
		methods: {
      changeDrawBack() {
      	this.expand = !this.expand;
      },
			handleBackClick(){
				this.getStatistical()
			},
			//获取钢瓶位置信息
			getStatistical() {
				this.cylArr = []
				_http.http2('get', pathUrls.bottleStatistical, {}).then((res) => {
					this.cylArr = res.data.bottlePoint
					this.bottleCount=res.data.bottleCount
					//					console.log(this.cylArr)
					this.loadmap()
				}).catch((res) => {

				})

			},
			loadmap() {
        let that=this;
				var map;
				if(this.userData.lng){
					map = new AMap.Map('cylContainer', {
					zoom: 12,
					center: [this.userData.lng, this.userData.lat],
				});
				}else{
					map = new AMap.Map('cylContainer', {
					zoom: 12,
				});
				}
        map.addControl(new AMap.ToolBar({liteStyle:true}))
				AMapUI.loadUI(['misc/PointSimplifier'], function(PointSimplifier) {

							    if (!PointSimplifier.supportCanvas) {
							        alert('当前环境不支持 Canvas！');
							        return;
							    }
						    //启动页面
						    initPage(PointSimplifier);
						});
						function initPage(PointSimplifier) {
                let url=require('../../../src/assets/images/qp.png');
						    var pointSimplifierIns = new PointSimplifier({
						        map: map, //关联的map
						        compareDataItem: function(a, b, aIndex, bIndex) {
						            //数据源中靠后的元素优先，index大的排到前面去
						            return aIndex > bIndex ? -1 : 1;
						        },
						        getPosition: function(dataItem) {
						            //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组

						            let position=[dataItem.location.lon,dataItem.location.lat]
						            return position;
						        },
						        getHoverTitle: function(dataItem, idx) {
						            //返回数据项的Title信息，鼠标hover时显示
						            return '钢瓶经纬度：' + dataItem.location.lon+ ','+dataItem.location.lat;
						        },
						        renderOptions: {
						                //点的样式
						                pointStyle: {
						                    fillStyle: '#f00',
						                    width:28,
						                    height:28,
                                content:PointSimplifier.Render.Canvas.getImageContent(url,

                                               function onload() {

                                                    //图片加载成功，重新绘制一次

                                                    pointSimplifierIns.renderLater();

                                                },

                                                // function onerror(e) {

                                                //     alert('图片加载失败！');

                                                // }
                                                )
						                },

						        },
				//		    maxChildrenOfQuadNode:1,
						    autoSetFitView:false
						    });
							var data=that.cylArr;
						    //设置数据源，data需要是一个数组
						    pointSimplifierIns.setData(data);

						    //监听事件
						    pointSimplifierIns.on('pointClick pointMouseover pointMouseout', function(e, record) {
						//      console.log(e.type, record);
						    });
						}



			}
		},
		mounted() {
			if(this.tabsMap.indexOf('占用瓶')!=-1){
			this.getStatistical()

			//			this.loadmap()
		}
		}
	}
</script>

<style type="text/css" scoped>
	.cylMain {
		height: calc(100vh - 10px);
    width: 100%;
	}
  .mainContenter{
  	position: relative;
  	width: calc( 100% - 280px);
  	height: 100%;
  	overflow: hidden;
  	transition: all 0.5s ease;
  }
  .changeMainContainer{
  	position: relative;
  	width: 100%;
  	overflow: hidden;
  }
	#cylContainer {
		width: 100%;
		height: calc(100% - 60px);
		background: #fff;
	}
  .stationCylinder {
  	position: absolute;
  	right: 0;
  	top:36px;
  	z-index: 400;
  	background: #fff;
  	width: 280px;
  	height: 100%;
  	padding: 5px 10px 10px;
  	text-align: left;
  	box-shadow: rgba(64, 169, 255, 0.29) 0px 2px 4px 0px;
  	transition: all 0.5s ease;
  }

  .expandCylinder {
  	width: 280px;
  	right:-280px;
  	/*transition: all 0.7s ease;*/

  }
	#cylContainer>>>.amap-icon img {
		width: 30px;
		height: 30px;
	}
	.countWrapper{
		position: absolute;
		left:50%;
		top:36px;
		background:#1890ff;
		width: 150px;
		margin-left: -75px;
		box-shadow: 0px 3px 3px #c8c8c8;
		color: #fff;
		height: 28px;
		line-height: 28px;
    z-index: 100;
	}
	.backMap img {
		width: 23px;
		height: 23px;
	}

	.backMap {
		position: absolute;
		right: 25px;
		top: 5px;
		cursor: pointer;
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
</style>
