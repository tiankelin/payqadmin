<template>
	<div class="cylMain">
		<div id="cylContainer">
		</div>
		<div class="countWrapper"><span>占用瓶总数：</span>{{bottleCount}}</div>
		<div class="backMap" @click="handleBackClick">
			<img src="@/assets/images/back.png" alt="" />
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
		props: {
			tabsMap: String
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				cylArr: [],
				bottleCount: 0
			}
		},
		methods: {
			handleBackClick() {
				this.getStatistical()
			},
			//获取钢瓶位置信息
			getStatistical() {
				this.cylArr = []
				_http.http2('get', pathUrls.bottleStatistical, {}).then((res) => {
					this.cylArr = res.data.bottlePoint
					this.bottleCount = res.data.bottleCount;
					for(let item of this.cylArr){
			            if(!item.color){
			              item.color='#1890ff';
			            }

					}
					//					console.log(this.cylArr)
					if(document.getElementById('cylContainer')) {
						this.loadmap()
					}

				}).catch((res) => {

				})

			},
			loadmap() {
				let that = this;
				var map;
				if(this.userData.lng) {
					map = new AMap.Map('cylContainer', {
						zoom: 12,
						center: [this.userData.lng, this.userData.lat],
					});
				} else {
					map = new AMap.Map('cylContainer', {
						zoom: 12,
					});
				}
				map.addControl(new AMap.ToolBar({
					liteStyle: true
				}))
				AMapUI.loadUI(['misc/PointSimplifier'], function(PointSimplifier) {

					if(!PointSimplifier.supportCanvas) {
						alert('当前环境不支持 Canvas！');
						return;
					}
					//启动页面
					initPage(PointSimplifier);
				});

				function initPage(PointSimplifier) {
					let url = require('../../../src/assets/images/qp.png');
					var pointSimplifierIns = new PointSimplifier({
						map: map, //关联的map
						compareDataItem: function(a, b, aIndex, bIndex) {
							//数据源中靠后的元素优先，index大的排到前面去
							return aIndex > bIndex ? -1 : 1;
						},
						getPosition: function(dataItem) {
							//返回数据项的经纬度，AMap.LngLat实例或者经纬度数组

							let position = [dataItem.location.lon, dataItem.location.lat]
							return position;
						},
						getHoverTitle: function(dataItem, idx) {
							//返回数据项的Title信息，鼠标hover时显示
              // console.log(dataItem)
							// return '钢瓶经纬度：' + dataItem.location.lon+ ','+dataItem.location.lat;
							// return ''
						},
						renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
						renderOptions: {
							//点的样式
							pointStyle: {
								fillStyle: '#f00',
								width: 12,
								height: 32,
								// strokeStyle: 'rgba(0,0,255,.5)',
							},
							getGroupId: function(item, idx) {

								return item.color;
							},
							groupStyleOptions: function(gid) {

								let newStyle = {
									pointStyle: {

										//宽度
										width: 18,
										//高度
										height: 18,
										//定位点为中心
										offset: ['-50%', '-50%'],
										strokeStyle: 'rgba(0,0,255,.5)',
										fillStyle: `${gid}`,
										content: function(ctx, x, y, width, height) {
											//绘制一个钢瓶
											// ctx.moveTo(x, y);
											// ctx.lineTo(x + width / 3, y);
											// ctx.lineTo(x + (width / 3), y + height / 12);
											// ctx.lineTo(x + (width / 3) * 2, y + height / 12);
											// ctx.lineTo(x + (width / 3) * 2, y);
											// ctx.lineTo(x + width, y);
											// ctx.lineTo(x + width, y + height / 4);
											// ctx.lineTo(x + width + (width / 4), y + height / 4);
											// ctx.lineTo(x + width + (width / 4), y + height - height / 12);
											// ctx.lineTo(x + width + (width / 12), y + height);
											// ctx.lineTo(x - (width / 12), y + height);
											// ctx.lineTo(x - (width / 4), y + height - height / 12);
											// ctx.lineTo(x - (width / 4), y + height / 4);
											// ctx.lineTo(x, y + height / 4);
											// ctx.lineTo(x, y);
                      //绘制三角
                         ctx.moveTo(x+width/2, y);
                         ctx.lineTo(x+width, y+height);
                         ctx.lineTo(x, y+height);
										}
										// strokeStyle: null
									}
								}
								return newStyle;
							},
              // drawQuadTree: true,
              // drawShadowPoint:true,
						},
						//		    maxChildrenOfQuadNode:1,
						autoSetFitView: false,
            // maxDepthOfQuadTree:100000,
            // maxChildrenOfQuadNode:100
					});
					var data = that.cylArr;
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
			if(this.tabsMap.indexOf('占用瓶') != -1) {
				this.getStatistical()

				//			this.loadmap()
			}
		}
	}
</script>

<style type="text/css" scoped>
	.cylMain {
		height: calc(100vh - 10px);
	}

	#cylContainer {
		width: 100%;
		height: calc(100% - 60px);
	}

	#cylContainer>>>.amap-icon img {
		width: 30px;
		height: 30px;
	}

	.countWrapper {
		position: absolute;
		left: 50%;
		top: 36px;
		background: #1890ff;
		width: 150px;
		margin-left: -75px;
		box-shadow: 0px 3px 3px #c8c8c8;
		color: #fff;
		height: 28px;
		line-height: 28px;
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
</style>
