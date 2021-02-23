<template>
	<div>
		<div class='orderTitle' >配送统计</div>
		<div style="width: 100%;">
			<div id='dayState' style="width: 100%;height:250px;"></div>
			<div id='dayState1' style="width: 100%;height:250px;"></div>
		</div>
		
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'distributeData',
		
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				dayRet: [],
				dayLabel: [],
				monthRet: [],
				monthLabel: [],
				
			}
		},
		methods: {
			toDistributeInfo(){
				this.$router.push('/performanceStatistics/distribute');
			},
		//获取配送统计
			getBottleDayState() {
				_http.http3('get', pathUrls.bottleNumStat, {
					deptId: this.userData.deptId,
					type: 'day'
				}, 'form').then((res) => {
					if(res.code == 0) {
						for(let item of res.ret) {
							if(this.dayRet.length<3){
								this.dayLabel.push(item.name);
								this.dayRet.push(item)
							}
							if(item.name=='日安检数量'){
								this.$emit('dayCheckCount',item.value)
							}
							if(item.name=='日充装数量'){
								this.$emit('dayFillCount',item.value)
							}
							
							
						}						
//						this.dayRet = res.ret;
						if(document.getElementById('dayState')) {
							this.dayState();							
						}
					}
				})
			},
			getBottleMonthState() {
				_http.http3('get', pathUrls.bottleNumStat, {
					deptId: this.userData.deptId,
					type: 'month'
				}, 'form').then((res) => {
					if(res.code == 0) {
						for(let item of res.ret) {
							if(this.monthRet.length<3){
								this.monthLabel.push(item.name);
								this.monthRet.push(item);
							}	
							if(item.name=='月安检数量'){
								this.$emit('monthCheckCount',item.value)
							}
							if(item.name=='月充装数量'){
								this.$emit('monthFillCount',item.value)
							}
						}
					
						if(document.getElementById('dayState1')) {
							this.dayState1();
						}
					}
				})
			},
			dayState() {
				let dayChart = echarts.init(document.getElementById('dayState'));
				let option = {
					title: {
				        text: '日统计',	
				        left: 'center'
				    },
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}: {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						left: 10,
						data: this.dayLabel
					},
					color: ['#67eaf7', '#45e677', '#f3a61a','#dcbc46','#0f0','#00f'],
					series: [{
						name: '日统计',
						type: 'pie',
						radius: ['45%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: this.dayRet

					}]
				};
				dayChart.setOption(option);
			},
			dayState1() {
				let dayChart = echarts.init(document.getElementById('dayState1'));
				let option = {
					title: {
				        text: '月统计',	
				        left: 'center'
				    },
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}: {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						left: 10,
						data: this.monthLabel
					},
					color: ['#15a0ff', '#0e9237', '#ffca35','#f0f','#00f','#aaf'],
					series: [{
						name: '月统计',
						type: 'pie',
						radius: ['45%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: this.monthRet
					}]
				};
				dayChart.setOption(option);
			},
		},
		mounted() {
			this.getBottleDayState();
			this.getBottleMonthState();
		}
	}
</script>

<style type="text/css" scoped>
.checkData span {
		display: inline-block;
		width: 100px;
		text-align: center;
		margin-right: 40px;
		margin-bottom: 10px;
		font-size: 18px;
	}
.orderTitle {
		text-align: center;
		font-size: 16px;
		font-weight: 600;
		color: #fff;
		margin-bottom: 15px;
		cursor: pointer;
		background: #0089ff;
		width: 100px;
		height: 30px;
		line-height: 30px;
		border-radius: 15px;
	}	
</style>