<template>
	<div class="userMain">
		<div id="userContainer">

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
				userCount:0
			}
		},
		components: {

		},
		methods:{
			handleBackClick(){
				this.getStatistical()
			},
			//获取用户位置信息
			getStatistical() {
				_http.http3('get', pathUrls.userBottle, {
            deptId:231
        }).then((res) => {
					this.userArr=res.data.userPoint
					this.userCount=res.data.userPoint.length
//					console.log(this.userArr)
					this.loadmap()
				}).catch((res) => {

				})

			},

			loadmap() {
				var map;
				if(this.userData.lng){
					map = new AMap.Map('userContainer', {
					zoom: 8,
					center: [this.userData.lng,this.userData.lat],
				});
				}else{
					map = new AMap.Map('userContainer', {
					zoom: 12,

				});
				}

					if(this.userArr.length){
						let style = [{
					        url: require('../../../src/assets/images/yd.png'),
					        anchor: new AMap.Pixel(6, 6),
					        size: new AMap.Size(15, 15)
					    }
					    ];
				// var massMarks = [];
				for(let i=0;i<this.userArr.length;i++){
					let points={lnglat: [this.userArr[i].location.lon, this.userArr[i].location.lat],userId:this.userArr[i].userId};
					  // massMarks.push(points)
					let icon = require('../../../src/assets/images/qp.png');
					let marker = new AMap.Marker({
						icon: icon,
						position: [this.userArr[i].location.lon, this.userArr[i].location.lat],
            icon: new AMap.Icon({
            	image: icon,
            	size: new AMap.Size(60, 60), //图标大小
            	imageSize: new AMap.Size(20, 20)
            }),
            draggable:true,
            raiseOnDrag:true
					});
          marker.data=this.userArr[i].userId;
					marker.setMap(map);
          marker.on('click', function(e) {
            console.log(e.target.data)
          })
}

			   // this.mass = new AMap.MassMarks(massMarks, {
				  //          opacity:0.8,
				  //          zIndex: 111,
				  //          cursor:'pointer',
				  //          style:style
				  //    });
				  //    this.mass.on('click',function(e){
				  // 			console.log(e.data.userId)
				  // 			console.log(e.data.lnglat)
				  //    })
//				that.marker = new AMap.Marker({content:''})
				     // this.mass.setMap(map);
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
	}

	#userContainer {
		width: 100%;
		height: calc(100% - 60px);
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
</style>
