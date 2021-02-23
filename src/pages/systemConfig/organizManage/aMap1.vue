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
		<div class="searchWrapper">
			<Input v-model="addressInfo" placeholder="请输入地址信息进行搜索" search @on-search='handleSearchArea'>
			<span slot="prepend">地址地区:</span>
			</Input>
		</div>
		<div class="closeBtn" @click='handleClose'><Icon type="md-close"/></div>
	</div>

</template>
<script>
	import AMap from 'AMap'
	import Bus from '@/public/bus';
	export default {
		name: "aMap",
		props: {
			langs: '',
			lats: ''
		},
		data() {
			return {
				addressInfo: '',
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
				searchLng: '',
				searchLat: ''
			}
		},

		methods: {
			//地理编码
			geocoders(cityAdress) {
				let that = this
				var geocoder = new AMap.Geocoder({
					city: cityAdress
				});
				geocoder.getLocation(cityAdress, function(status, result) {
					if(status === 'complete' && result.info === 'OK') {
						// result中对应详细地理坐标信息
						that.ruleForm.long =result.geocodes[0].location.lng
						that.ruleForm.lat = result.geocodes[0].location.lat
//						that.searchLng = result.geocodes[0].location.lng
//						that.searchLat = result.geocodes[0].location.lat
						if(cityAdress) {
							that.init([that.ruleForm.long,that.ruleForm.lat])
						}
					} else {
						that.init([that.userData.lng, that.userData.lat])
					}
				})

			},

			//点击左上方搜索
			handleSearchArea(val) {
				this.ruleForm.addr=val
				this.geocoders(val)
			},
			//点击关闭
			handleClose() {
				this.$emit('isShow', false)
				this.$emit('mapData', this.ruleForm)
			},
			//地图
			init(newLngLat) {
				var map = new AMap.Map('my_container', {
					resizeEnable: true,
					zoom: 14,
					center: newLngLat
				})
				let icon = require('../../../../src/assets/images/ad.png');
				let marker = new AMap.Marker({
					icon: icon,
					position: newLngLat,
				});
				marker.setMap(map);
				var geocoder;
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
						marker.setPosition(lnglatXY);

					})
				}
				var that = this
				map.on('click', function(e) {
					var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];
					regeocoder(lnglatXY, that)
					that.ruleForm.long = e.lnglat.getLng()
					that.ruleForm.lat = e.lnglat.getLat()

				});

			},
		},
		mounted() {
			if(this.langs != '') {
				this.newLngLat = [this.langs, this.lats];
				this.ruleForm.long =this.langs;
				this.ruleForm.lat =this.lats;
			} else {
				this.newLngLat = [this.userData.lon, this.userData.lat];
				this.ruleForm.long =this.userData.lon;
				this.ruleForm.lat =this.userData.lat;
			}
			this.init(this.newLngLat)

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
		z-index: 102;
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
		width: 90px;
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
		right: 0px;
		top: -8px;
		z-index: 102;
		color:#1296db;
		font-size: 30px;
		cursor: pointer;
	}

	.searchWrapper {
		position: absolute;
		top: 90px;
		left: 20px;
		z-index: 1000;
	}
	.searchWrapper>>>input{
		width:240px;
	}
</style>
