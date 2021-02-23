<template>
	<div class="main">
		<div id="adContainer"></div>
		<div class="closeBtn" @click='handleCloseClick'>X</div>
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
			   AMap.convertFrom(lnglat, 'gps', function (status, result) {
			        if (result.info === 'ok') {
			        	console.log(result.locations[0])
			        	let newLngLat=[result.locations[0].lng,result.locations[0].lat]
			            that.map = new AMap.Map('adContainer', {
							zoom: 15,
							center: newLngLat,
						});
						let icon = require('../../../../src/assets/images/ad2.png');
						let marker = new AMap.Marker({
							icon: icon,
							position: newLngLat,
				      });
						marker.setMap(that.map);
			    	};
				
				});
			
			}
		},
		
		mounted() {	
			this.loadmap()
		},
	}
</script>

<style scoped>
	.main {
		position: absolute;
		width: calc(100% - 210px);
		height: calc(100vh - 120px);
		left: 200px;
		top: 65px;
		z-index: 101;
		background:#fff;
	}
	
	#adContainer {
		width: calc(100% - 40px);
		height: calc(100% - 50px);
		z-index: 100;
		margin: 30px 20px 20px;
	}
	
	.closeBtn {
		position: absolute;
		right: 7px;
		top: 2px;
		z-index: 102;
		color: #000;
		font-size: 20px;
		cursor: pointer;
		color: #51B5EA;
	}
	.main>>>img{
		width: 40px;
		height: auto;
	}
</style>