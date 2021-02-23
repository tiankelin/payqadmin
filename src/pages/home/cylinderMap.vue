<template>
	<div class="cylMain">
    <div style="position: relative;width: 100%;height: 100%;">
      <div id="cylContainer">

      </div>
      <Spin fix v-if='loading' size="large"></Spin>
    </div>

		<div class="countWrapper"><span>占用瓶总数：</span>{{bottleCount}}</div>
		<div class="backMap" @click="handleBackClick">
			<img src="@/assets/images/back.png" alt="" />
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
	</div>
</template>

<script>
	import AMap from 'AMap'
	import Bus from '@/public/bus';
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default {
		name: "cylinderMap",
		props: {
			tabsMap: String
		},
		components: {
			cylInfo,
		},
		data() {
			return {
        loading:false,
				tags: '',
				infoSee: false,
				userData: (JSON.parse(this.$store.state.userData)),
				cylArr: [],
				bottleCount: 0,
				showIcon: {}
			}
		},
		methods: {
			handleSee(data) {
				this.infoSee = data
			},
			getBottleInfo(id) {
				this.infoSee = true;
				this.tags = id;
			},
			handleBackClick() {
				this.getStatistical()
			},
			//获取钢瓶位置信息
			getStatistical() {
				this.cylArr = [];
        this.loading=true;
				_http.http2('get', pathUrls.bottleStatistical, {}).then((res) => {
          this.loading=false;
					this.cylArr = res.data.bottlePoint
					this.bottleCount = res.data.bottleCount;
					this.showIcon = res.data.showIcon;
					if(document.getElementById('cylContainer')) {
						this.loadmap()
					}

				}).catch(()=>{
          this.loading=false;
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
					var groupStyleMap = that.showIcon;
					for(let key in groupStyleMap) {
						groupStyleMap[key].pointStyle = {
							content: PointSimplifier.Render.Canvas.getImageContent(
								groupStyleMap[key].bottleIcon,
								function onload() {
									//图片加载成功，重新绘制一次
									if(pointSimplifierIns&&pointSimplifierIns.renderLater){
									  pointSimplifierIns.renderLater();
									}

								},
								function onerror(e) {
									alert('图片加载失败！');

								}
							),

						}

					}
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
							// return '钢瓶经纬度：' + dataItem.location.lon+ ','+dataItem.location.lat;
							return ''
						},
						renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,

						renderOptions: {
							//点的样式
							pointStyle: {
								fillStyle: '#f00',
								width: 24,
								height: 24,

								// strokeStyle: 'rgba(0,0,255,.5)',
							},
							getGroupId: function(item, idx) {

								return item.bottleOccupyDeptId;
							},
							groupStyleOptions: function(gid) {
								return groupStyleMap[gid];

							},

						},
						autoSetFitView: false,

					});

					var data = that.cylArr;
					//设置数据源，data需要是一个数组
					pointSimplifierIns.setData(data);

					//监听事件
					pointSimplifierIns.on('pointClick', function(e, record) {
						let LngLat = [record.data.location.lon, record.data.location.lat];
						let info = '';
						if(record.data.bottleRfId||record.data.bottleCode){
							if(record.data.bottleRfId){
								info +=
							`<div style='cursor:pointer;padding-right:10px' onclick='getBottleInfo("${record.data.bottleRfId}")'>
							<span style='display:inline-block;width:100px;text-align:right;'>电子标签编码：</span>	
							<span style='color:#fb5100;'>${record.data.bottleRfId}</span>
							</div>`
							}
							if(record.data.bottleCode){
								info +=
							`<div style='cursor:pointer;padding-right:10px' onclick='getBottleInfo("${record.data.bottleCode}")'>
							<span style='display:inline-block;width:100px;text-align:right;'>钢瓶条码：</span>									
							<span style='color:#1ba060;'>${record.data.bottleCode}</span>
							</div>`
							}
							
						var infoWindow = new AMap.InfoWindow({
							content: `${info}` //使用默认信息窗体框样式，显示信息内容
						});
						infoWindow.open(map, LngLat);
						}

					});
				}

			}
		},
		mounted() {
			window.getBottleInfo = this.getBottleInfo;
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
