<template>
	<div class="main">
		<div id="my_container"></div>
		<div class='adressInfo'>
			<div class="adress">地址：{{ruleForm.addr}}</div>
			<div class="inpuBox">
				<label for="">
				经度：<input type="" name="" id="" :value="ruleForm.long" />
			</label>
				<label for="">
				纬度：<input type="" name="" id="" :value="ruleForm.lat" />
			</label>
			</div>
		
		</div>
		<div>
			<Input v-model="addressInfo" placeholder="请输入地址信息进行搜索" search @on-search='handleSearchArea'>
			<span slot="prepend">地址地区:</span>
			</Input>
		</div>
		<div class="closeBtn" @click='handleClose'>X</div>
	</div>

</template>
<script>
	import AMap from 'AMap'
	import Bus from '@/public/bus';
	export default {
		name: "aMap",
		props:{
		langs:'',
		lats:''
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				ruleForm: {
					name: '',
					phone: '',
					addr: '',
					long: '',
					lat: '',
					start_work_time: '',
					end_work_time: '',
				},
			}
		},
		mounted() {
			this.init()
			

		},
		created() {

		},
		methods: {
			//点击地图搜索
			handleSearchArea(){
				
			},
			//点击关闭
			handleClose() {
				this.$emit('isShow', false)
				this.$emit('mapData', this.ruleForm)
			},
			//地图
			init() {
			if(this.langs!=''){
				var map = new AMap.Map('my_container', {
					resizeEnable: true,
					zoom: 14,
					center: [this.langs, this.lats]
				})	
			}else{
					var map = new AMap.Map('my_container', {
					resizeEnable: true,
					zoom: 14,
					center: [this.userData.lng, this.userData.lat]
				})	
			}
		
				AMap.plugin('AMap.Geolocation', function() { //异步加载插件
					var geolocation = new AMap.Geolocation()
					zoomToAccuracy: true,
						map.addControl(geolocation)
				})
				var geocoder, marker;

				function regeocoder(lnglatXY, that) {
					AMap.plugin('AMap.Geocoder', function() {
						var geocoder = new AMap.Geocoder({
							radius: 1000,
							extensions: "all"
						});
						geocoder.getAddress(lnglatXY, function(status, result) {
							if(status === 'complete' && result.info === 'OK') {
								var address = result.regeocode.formattedAddress;
								that.ruleForm.addr = address
							}
						});
						if(!marker) {
							marker = new AMap.Marker();
							map.add(marker);
						}
						marker.setPosition(lnglatXY);
					})
				}
				var that = this
				map.on('click', function(e) {
					var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];
					regeocoder(lnglatXY, that)
					that.ruleForm.long = e.lnglat.getLng()
					that.ruleForm.lat = e.lnglat.getLat()
//					console.log(that.ruleForm)
				});
			},
		},
	}
</script>

<style scoped>
	.main {
		position: fixed;
		width: calc(100% - 210px);
		height:calc(100% - 65px);
		left: 200px;
		top: 65px;
		z-index: 101;
		background: #fff;
	}
	
	#my_container {
		width: calc(100% - 40px);
		height: calc(100% - 50px);
		z-index: 100;
		margin: 30px 20px 20px;
	}
	
	.adressInfo {
		z-index: 101;
		position: absolute;
		left: 20px;
		top: 30px;
		background: #fff;
		color: #000;
		width: auto;
		height: 60px;
		padding: 0 10px;
		box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
	}
	
	.inpuBox {
		display: flex;
	}
	
	.inpuBox input {
		width: 80px;
		margin-right: 15px;
		background: 0;
		border: 0;
		outline: 0;
	}
	
	.adress {
		height: 30px;
		text-align: left;
		line-height: 30px;
	}
	
	.closeBtn {
		position: absolute;
		right: 5px;
		top: 2px;
		z-index: 102;
		color: #000;
		font-size: 20px;
		cursor: pointer;
	}
</style>