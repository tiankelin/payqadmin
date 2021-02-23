<template>
	<div class="mapMain">
		<div id="adContainer"></div>
		<div class="closeBtn" @click='handleCloseClick'><Icon type="md-close" /></div>
	</div>

</template>
<script>
	import AMap from 'AMap'
	export default {
		name: "cylMap",
		props:{
		langs:'',
		lats:''
		},
		data() {
			return {
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

			}
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
		/* margin: 30px 20px 20px; */
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
</style>
