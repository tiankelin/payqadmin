<template>
	<div class="main">
		<div style="">
			 <DatePicker format="yyyy-MM-dd" v-model='dateTime'  @on-change='changeDate' type="daterange" :options="options2" placement="bottom" placeholder="Select date" style="width: 240px"></DatePicker>        
		</div>
		<div style="display: flex;overflow: hidden;position: relative;">
			<div style="width: 65%;margin-right: 5%;">
				
				<div class="mainTitle">区域统计</div>
				<div style="position: relative;">
					<div v-if='orderShow'>
						<div id='circleInfo' style="height:650px;"></div>					
					</div>						
					<div v-else style="height: 600px;margin-top: 50px;width: 80%;">
						<img src="@/assets/images/noData.png" alt="" />
						<div style="font-size: 16px;color: #e6e6e6;">暂无数据！</div>
					</div>
					<Spin size="large" fix v-if="spinShow"></Spin>
				</div>
			</div>
			<div style="width: 40%;">
				<div class="mainTitle">来源统计</div>
				<!--<div style="position: absolute;right: 20%;top:100px;">日统计</div>-->
				<div style="position: relative;">	
					<div v-if='originData.length'>
						<div id='originInfo' style="height:335px;"></div>
					</div>					
					<div v-else style="height: 290px;margin-top: 50px;">
						<img src="@/assets/images/noData.png" alt="" />
						<div style="font-size: 16px;color: #e6e6e6;">暂无数据！</div>
					</div>
					<Spin size="large" fix v-if="spinShow"></Spin>
				</div>
				<div class="mainTitle">客户类型统计</div>	
				<div style="position: relative;">
					<div v-if='typeData.length'>
						<div id='userTypeInfo' style="height:335px;"></div>	
					</div>
					<div v-else style="height: 290px;margin-top: 50px;">
						<img src="@/assets/images/noData.png" alt="" />
						<div style="font-size: 16px;color: #e6e6e6;">暂无数据！</div>
					</div>
					<Spin size="large" fix v-if="spinShow"></Spin>
				</div>
			</div>
			<!--<div style="position: absolute;left: 25%;top:0;width: 100px;">
				<i-switch v-model="dayOrMonth" size="large" false-color="#ff4949" :true-value='1' :false-value='0' style='width: 70px;' @on-change='switchChange'>
					<span slot="open">月统计</span>
					<span slot="close">日统计</span>
				</i-switch>
			</div>-->
			
		</div>
		
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'order',
		data(){
			return{		
				orderShow:false,
				spinShow:false,
				 typeData:[],
				 typeLabel:[],
				 originData:[],
				 originLabel:[],	
				 circleData:[],
				 circleLabel:[],
				 dateTime:[],
				 startTime:'',
				 endTime:'',
				 options2: {
                    shortcuts: [
                        {
                            text: '近一周',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                console.log()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '近一月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },

                    ]
               },
				
			}
		},
		methods:{
			changeDate(v){				
				if(v[0]){
					let newDates=[v[0]+' '+'00:00',v[1]+' '+'23:59']
					this.startTime=v[0]+' '+'00:00';
					this.endTime=v[1]+' '+'23:59';
				}else{
					let newTimes=this.common.getStartEndTime();
					this.startTime=`${newTimes[0]}`+' '+'00:00';
					this.endTime=`${newTimes[1]}`+' '+'23:59';
				}
				this.$nextTick(
					() => {
						this.statisticOrderInfo();
					}
				)
				
			},
			statisticOrderInfo(){
					this.spinShow=true;
					this.circleLabel=[];
					this.circleData=[];
					this.typeData=[];
					this.typeLabel=[];
					this.originData=[];
					this.originLabel=[];
					
				_http.http1('get', `${pathUrls.statisticOrder}?startTime=${this.startTime}&endTime=${this.endTime}`, {					
				}, 'form').then((res) => {
						this.spinShow=false;						
						if(res.deptOrderNum.length){
							
							for(let item of res.deptOrderNum){
								this.circleLabel.push(item.groupName);
								this.circleData.push(item.groupNum)								
							}	
							this.orderShow=true;							
							this.$nextTick(
								() => {
									this.pieCircleInfo();
								}
								)
						
						}else{
							this.orderShow=false;
						}
						if(res.orderTypeNum.length){
							for(let item of res.orderTypeNum){
								this.originLabel.push(item.groupName);
				 				this.originData.push({
				 					name:item.groupName,
									value:item.groupNum
				 				})
							}
							this.$nextTick(
								() => {
									this.pieOriginInfo();
								}
							)
						}
												  
						 if(res.userTypeNum.length){
							for(let item of res.userTypeNum){
								this.typeLabel.push(item.groupName);
				 				this.typeData.push({
				 					name:item.groupName,
									value:item.groupNum
				 				})
							}
							this.$nextTick(
								() => {
									this.userTypeInfo();
								}
							)
						} 
							

				})
			},

			pieCircleInfo() {
				if(document.getElementById('circleInfo')){
					let dayChart = echarts.init(document.getElementById('circleInfo'),'light');
				let option = {
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'shadow'
				        }
				    },
				    color: ['#80e000'],
				    grid: {
				    	top:'1%',
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis: {
				        type: 'value',	
				        minInterval: 1,
				        boundaryGap: [0, 0.01],
				        axisTick: {
							length: 3
						}
				    },
				    yAxis: {
				        type: 'category',
				        data:this.circleLabel,	
				        axisLabel : {
                            formatter: '{value}',
                            textStyle: {
                                color: '#000'
                            }
                       },
                       axisTick: {
							length: 3
						}
                       
				    },
				    series: [   
				        {         
				        	 name: '订单数',
				            type: 'bar',
				            data:this.circleData,
				            barMaxWidth:30
				        }
				    ]
};
				dayChart.setOption(option);
				}
				
			},
			pieOriginInfo() {
				if(document.getElementById('originInfo')){
					let dayChart = echarts.init(document.getElementById('originInfo'),'light');
				let option = {
//					title: {
//				        text: '日统计',	
//				        left: 'center'
//				    },
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}:{c} ({d}%)'
					},
					legend: {
						orient: 'horizontal',
						left: '3%',
				        right: '4%',
				        top: '9%',
				        containLabel: true,
						data:this.originLabel
//						this.originDayLabel
					},
					color: ['#8841fb','#67c23a','#0f0','#00f'],
//					color: ['#67eaf7', '#45e677', '#f3a61a','#dcbc46','#0f0','#00f'],
					series: [{
						name: '来源统计',
						type: 'pie',
						radius: ['45%', '65%'],
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
						data:this.originData
//						this.originDayData

					}]
				};
				dayChart.setOption(option);
				}
				
			},
			userTypeInfo() {
				if(document.getElementById('userTypeInfo')){
					let dayChart = echarts.init(document.getElementById('userTypeInfo'),'light');
				let option = {
//					title: {
//				        text: '月统计',	
//				        left: 'center'
//				    },
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}:{c} ({d}%)'
					},
					legend: {
						orient: 'horizontal',
						left: '3%',
				        right: '4%',
				        top: '9%',
				        containLabel: true,
						data:this.typeLabel
					},
//					color: ['#67eaf7', '#45e677', '#f3a61a','#dcbc46','#0f0','#00f'],
					series: [{
						name: '客户类型统计',
						type: 'pie',
						radius: ['45%', '65%'],
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
						data:this.typeData

					}]
				};
				dayChart.setOption(option);
				}
				
			},
		},
		mounted(){			
			this.dateTime=this.common.getStartEndTime();
			this.startTime=`${this.dateTime[0]}`+' '+'00:00';
			this.endTime=`${this.dateTime[1]}`+' '+'23:59';			
			this.statisticOrderInfo();
			
		},

	}
</script>

<style type="text/css" scoped>
	.main{
		margin-right: 10px;
		background: #FFFFFF;
		min-height: calc(100% - 10px);
		padding: 10px;
	}
	.mainTitle{
		text-align: left;
		font-size: 16px;
		font-weight:600;
		margin-bottom:5px;
	}
	.main>>>.ivu-switch-large,.main>>>.ivu-switch-checked:after{
		left: 48px;
	}
</style>