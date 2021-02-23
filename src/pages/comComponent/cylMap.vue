<template>
	<div class="mapMain">
		<div id="adContainer"></div>
		<div class="closeBtn" @click='handleCloseClick'><Icon type="md-close" /></div>
		<!-- <div class="adressDetail" v-if='adressDetail'>{{adressDetail}}</div> -->
	</div>

</template>
<script>
	import AMap from 'AMap'
	export default {
		name: "cylMap",
		props:{
		langs:'',
		lats:'',
		// adressDetail:''
		},
		data() {
			return {
        adressDetail:''
//				userData: (JSON.parse(this.$store.state.userData)),
			}
		},

		methods: {
			handleCloseClick() {
				this.$emit('addressInfo',false)
			},

			loadmap(){
				let that = this
				var lnglat = [that.langs,that.lats];
				    // 坐标转换
//			   AMap.convertFrom(lnglat, 'gps', function (status, result) {
//			        if (result.info === 'ok') {
//			        	console.log(result.locations[0])
			        	let newLngLat=lnglat
			            that.map = new AMap.Map('adContainer', {
							zoom: 15,
							center: newLngLat,
						});
						let icon = require('../../../src/assets/images/ad2.png');
						let marker = new AMap.Marker({
							icon: icon,
							position: newLngLat,
				      });
						marker.setMap(that.map);
//			    	};
//
//				});
			},
      //逆地理编码
      regeocoder(lnglatXY) {

      	let that = this
      	//逆地理编码
      	var geocoder = new AMap.Geocoder({
      		radius: 1000,
      		extensions: "all"
      	});
      	geocoder.getAddress(lnglatXY, function(status, result) {
      		if(status === 'complete' && result.info === 'OK') {
      			var address = result.regeocode.formattedAddress; //返回地址描述

      			that.adressDetail = address;
      		}
      	});
      },
		},
		created(){
      // let lnglatXY=[this.langs,this.lats];
      // this.regeocoder(lnglatXY)
    },
		mounted() {
			this.loadmap()

		},
	}
</script>

<style scoped>
	.mapMain {
		position: fixed;
		/* width: calc(100% - 210px);
		height: calc(100vh - 75px); */
		left: 200px;
		top: 65px;
		bottom: 10px;
		right: 10px;
		z-index: 101;
		background:#fff;
		padding: 30px 20px 20px;
	}

	#adContainer {
	width:100%;
	height: 100%;
	z-index: 100;
	}

	.closeBtn {
		position: absolute;
		right: 25px;
		top: -8px;
		z-index: 102;
		color: #000;
		font-size: 30px;
		cursor: pointer;
		color: #1296db;
		font-weight: 600;
	}
	.mapMain>>>img{
		width: 40px;
		height: auto;
	}
	.adressDetail{
		position: absolute;
		top: 30px;
		left:20px;
		z-index: 102;
		background: #fff;
		padding: 10px;
		box-shadow: 0 2px 16px 0 #67c23a5c;
		border-radius: 2px;
	}
</style>
