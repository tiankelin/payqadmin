<template>
	<div class="userMain">
    <div class="mainContenter" :class="[expand?'mainContenter':'changeMainContainer']">
        <div id="userContainer"></div>
        <div class='drawBack' @click='changeDrawBack'><img src="@/assets/images/right.png" alt="" v-if='expand' /><img src="@/assets/images/left.png" alt="" v-else/></div>
    </div>
    <div class="stationUser" :class="[expand?'stationUser':'expandUser']">

    </div>
		<div class="countWrapper"><span>用户总数：</span>{{userCount}}</div>
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
		name: "userMap",
		props:{
			tabsMap:String
		},
		data(){
			return{
				userData: (JSON.parse(this.$store.state.userData)),
				userArr:[],
				userCount:0,
        expand:true,
			}
		},
		components: {

		},
		methods:{
      changeDrawBack() {
      	this.expand = !this.expand;
      },
			handleBackClick(){
				this.getStatistical()
			},
			//获取用户位置信息
			getStatistical() {
				_http.http2('get', pathUrls.userBottle, {}).then((res) => {
					this.userArr=res.data.userPoint
					if(this.userArr.length){
					for(let item of this.userArr){
            if(!item.color){
              item.color='#f00';
            }

					}
					}

					this.userCount=res.data.userPoint.length
//					console.log(this.userArr)
					if(document.getElementById('userContainer')){
						this.loadmap()
					}

				})

			},

			loadmap() {
				var map;
				let that=this;
				if(this.userData.lng){
					map = new AMap.Map('userContainer', {
					zoom: 12,
					center: [this.userData.lng,this.userData.lat],
				});
				}else{
					map = new AMap.Map('userContainer', {
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

		    var pointSimplifierIns = new PointSimplifier({
		        map: map, //关联的map
		        compareDataItem: function(a, b, aIndex, bIndex) {
		            //数据源中靠后的元素优先，index大的排到前面去
		            return aIndex > bIndex ? -1 : 1;
		        },
		        getPosition: function(dataItem) {
		            //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
		//          console.log(dataItem)
		            let position=[dataItem.location.lon,dataItem.location.lat]
		            return position;
		        },
		        getHoverTitle: function(dataItem, idx) {
		            //返回数据项的Title信息，鼠标hover时显示
		            return '用户名: ' + dataItem.userRealName;
		        },
		        renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
		        renderOptions: {
		            //点的样式
		            pointStyle: {
		                fillStyle: '#f00',
		                width:16,
		                height:16
		            },

		          getGroupId: function(item, idx) {

		                return item.color;
		            },
		            groupStyleOptions: function(gid) {

							let newStyle={
								pointStyle: {

		                    //宽度
		                    width: 16,
		                    //高度
		                    height: 16,
		                    //定位点为中心
		                    offset: ['-50%', '-50%'],
		                    fillStyle: `${gid}`,
		                    // strokeStyle: null
		                }
							}
		                return newStyle;
		            }
		    },
//		    maxChildrenOfQuadNode:1,
		    autoSetFitView:false
		    });
			var data=that.userArr;
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
	if(this.tabsMap.indexOf('用户')!=-1){
	this.getStatistical()
}
}
}</script>

<style scoped>
	.userMain {
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
	#userContainer {
		width: 100%;
		height: calc(100% - 60px);
	}
  .stationUser {
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

  .expandUser {
  	width: 280px;
  	right:-280px;
  	/*transition: all 0.7s ease;*/

  }
	#userContainer>>>.amap-icon img {
		width: 10px;
		height: 10px;
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
