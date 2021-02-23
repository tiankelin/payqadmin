<template>
	<div>
		<div>
			<div class='orderTitle' >订单统计</div>
			<div class='orderContent'>
				<div>
					<span class='itemTitle cancelItem'>今日取消订单:</span><span class='cancelItem itemData'>{{dayCancelCount}}</span>
					<span class='itemTitle totalItem'>今日用户订单:</span><span class='totalItem itemData'>{{dayTotalCount}}</span>
					<span class='itemTitle finishItem'>今日完成订单:</span><span class='finishItem itemData'>{{dayFinishCount}}</span>
					<span class='itemTitle percentItem'>今日订单完结率:</span><span class="percentItem itemData">{{dayfinishLaw}}</span>
				</div>
				<div>
					<span class='itemTitle cancelItem'>本月取消订单:</span><span class='cancelItem itemData'>{{monthCancelCount}}</span>
					<span class='itemTitle totalItem'>本月用户订单:</span><span class='totalItem itemData'>{{monthTotalCount}}</span>
					<span class='itemTitle finishItem'>本月完成订单:</span><span class="finishItem itemData">{{monthFinishCount}}</span>
					<span class='itemTitle percentItem'>本月订单完结率:</span><span class="percentItem itemData">{{monthTotalLaw}}</span>
				</div>
			</div>
		</div>
		<div id='orderData' style="width: 100%;height:400px;">
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'orderData',
		props:{			
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				dayCancelCount:0,
				dayTotalCount:0,
				dayFinishCount:0,
				dayfinishLaw:0,
				monthCancelCount:0,
				monthTotalCount:0,
				monthFinishCount:0,
				monthTotalLaw:0,
				xAxisData:[],
				metaDate:[],	
				monthCheckLaw: ' ',
				dayCheckLaw: ' ',
			}
		},
		methods: {
			toOrderInfo(){
				this.$router.push('/performanceStatistics/order');
			},
			//获取订单统计数据
			getOrderStatData() {
				_http.http3('get', pathUrls.orderStatData, {
					deptId: this.userData.deptId
				}, 'form').then((res) => {
					if(res.code == 0) {
						this.dayCancelCount = res.dayCancelCount;
						this.dayTotalCount = res.dayTotalCount;
						this.dayFinishCount = res.dayFinishCount;
						this.dayfinishLaw = res.dayfinishLaw;
						this.monthCancelCount = res.monthCancelCount;
						this.monthTotalCount = res.monthTotalCount;
						this.monthFinishCount = res.monthFinishCount;
						this.monthTotalLaw = res.monthTotalLaw;
						this.xAxisData = res.xAxisData;
						this.metaDate = res.metaDate;
						this.dayCheckLaw = res.dayCheckLaw;
						this.monthCheckLaw = res.monthCheckLaw;
						this.$emit('dayCheckLaw',this.dayCheckLaw);
						this.$emit('monthCheckLaw',this.monthCheckLaw);
						if(document.getElementById('orderData')) {							
							this.init();
						}

					}
				})
			},
			init() {
				let myChart = echarts.init(document.getElementById('orderData'));
				let option = {
					//					title: {
					//						text: '订单统计'
					//					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['订单取消数', '完成订单数', '订单总数'],
						top: 30
					},

					grid: {
						left: '3%',
						right: '4%',
						bottom: '12%',
						containLabel: true
					},
					//					toolbox: {
					//						feature: {
					//							saveAsImage: {}
					//						}
					//					},
					dataZoom: [
				        {
				            show: true,
				            realtime: true,
				            start: 30,
				            end: 70,
				            fillerColor:"rgba(167,204,204,0.4)",
				        },
				    ],
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.xAxisData,
						axisLabel: {
							show: true,
							textStyle: {
								color: '#000', //更改坐标轴文字颜色
								fontSize: 12 //更改坐标轴文字大小
							}
						},
						axisTick: {
							length: 3
						}

					},
					yAxis: {
						type: 'value',
						axisLabel: {
							show: true,
							textStyle: {
								color: '#000', //更改坐标轴文字颜色
								fontSize: 12 //更改坐标轴文字大小
							},

						},
						min: (value) => {
							return value.min;
						},
						max: (value) => {
							return value.max + 50;
						},
						axisTick: {
							length: 3
						}

					},
					series: [{
							name: '订单取消数',
							type: 'line',
							//							stack: '总量',
							data: this.metaDate[0],
							itemStyle: {
								normal: {
									color: '#fc8a0f', //折点颜色
									lineStyle: {
										color: '#ff9c35' //折线颜色
									}
								}
							}
						},
						{
							name: '完成订单数',
							type: 'line',
							//							stack: '总量',
							data: this.metaDate[1],
							itemStyle: {
								normal: {
									color: '#45e677', //折点颜色
									lineStyle: {
										color: '#45e677' //折线颜色
									}
								}
							}
						},
						{
							name: '订单总数',
							type: 'line',
							//							stack: '总量',
							data: this.metaDate[2],
							itemStyle: {
								normal: {
									color: '#2db7f5', //折点颜色
									lineStyle: {
										color: '#2db7f5' //折线颜色
									}
								}
							}
						}

					]
				};

				myChart.setOption(option);
			}
		},
		mounted() {
			this.getOrderStatData();
			
		}
	}
</script>

<style type="text/css" scoped>
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
	
	.orderContent {
		text-align: left;
		padding-left: 10px;
	}
	
	.orderContent span {
		font-weight: 600;
	}
	
	.itemTitle {
		margin-left: 5px;
	}
	
	.cancelItem {
		color: #ff9c35;
	}
	
	.totalItem {
		color: #2db7f5;
	}
	
	.finishItem {
		color: #45e677
	}
	
	.percentItem {
		color: #ea359996;
	}
	
	.itemData {
		min-width: 40px;
		display: inline-block;
	}
</style>