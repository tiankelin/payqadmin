<template>
	<div class="main">
		<div style="width: 80%;">
			<DatePicker format="yyyy-MM-dd" v-model='dateTime'  @on-change='changeDate' type="daterange" :options="options2" placement="bottom" placeholder="Select date" style="width: 240px"></DatePicker>       				
		</div>
		<div style="display: flex;overflow: hidden;position: relative;">
			<div style="width: 48%;margin-right: 2%;">
				<div class="mainTitle">区域统计</div>
				<div style="position: relative;">
					<div v-if='checkCircleShow'>
						<div id='checkCircleInfo' style="height:700px;"></div>					
					</div>						
					<div v-else style="height: 610px;margin-top: 80px;width: 60%;">
						<img src="@/assets/images/noData.png" alt="" />
						<div style="font-size: 16px;color: #e6e6e6;">暂无数据！</div>
					</div>
					<Spin size="large" fix v-if="spinShow"></Spin>
				</div>
			</div>
			<div style="width: 48%;margin-left: 2%;">
				<div>
					<div class="mainTitle">区域人员安检统计</div>
					<div style="position: relative;">
						<div v-if='checkNameShow'>
							<div id='checkNameInfo' style="height:450px;"></div>					
						</div>						
						<div v-else style="height: 375px;margin-top: 80px;width: 60%;">
							<img src="@/assets/images/noData.png" alt="" />
							<div style="font-size: 16px;color: #e6e6e6;">暂无数据！</div>
						</div>
						<Spin size="large" fix v-if="spinShow"></Spin>
					</div>
					<div class="mainTitle">客户类型统计</div>
					<div style="position: relative;">
						<div v-if='typeUserShow'>
							<div id='typeUserInfo' style="height:240px;"></div>					
						</div>						
						<div v-else style="height: 160px;margin-top: 80px;width: 60%;">
							<img src="@/assets/images/noData.png" alt="" />
							<div style="font-size: 16px;color: #e6e6e6;">暂无数据！</div>
						</div>
						<Spin size="large" fix v-if="spinShow"></Spin>
					</div>
					
					
					
					
				</div>
				
			</div>
			
		</div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default{
		name:'check',
		data(){
			return{
				checkCircleData:[],
				checkCircleLabel:[],
				checkCircleShow:false,
				typeUserData:[],
				typeUserLabel:[],
				typeUserShow:false,
				checkNameData:[],
				checkNameLabel:[],
				spinShow:false,
				checkNameShow:false,
				startTime:'',
				endTime:'',
				dateTime:[],
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
						this.getStatisticSecurity();
					}
				)
				
			},
			typeUserInfo(){
				if(document.getElementById('typeUserInfo')){
					let staffChart = echarts.init(document.getElementById('typeUserInfo'),'light');
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
				        top: '0%',
				        containLabel: true,
						data:this.typeUserLabel
//						this.originDayLabel
					},
					color: ['#dcbc46','#67c23a','#0f0','#00f'],
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
						data:this.typeUserData
//						this.originDayData

					}]
				};
				staffChart.setOption(option);
				}
			},
			checkNameInfo(){
				if(document.getElementById('checkNameInfo')){
					let staffChart = echarts.init(document.getElementById('checkNameInfo'),'light');
					let option = {
						    tooltip: {
						        trigger: 'axis',
						        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						        }
						    },
//						    legend: {
//						        data: ['重瓶数', '空瓶数']
//						    },
						    color: ['#55e1ff'],
						    grid: {
						        left: '3%',
						        right: '4%',
						        bottom: '3%',
						        containLabel: true
						    },
						    xAxis: [
						        {
						            type: 'value',
						            axisTick: {
											length: 3
									}
						           
						        },
						        
						    ],
						    yAxis: [
						        {
						             type: 'category',
						            data: this.checkNameLabel,
						           	axisTick: {
									length: 3
								}
						            
						        },
						        
						    ],
						    series: [
						        {
						            name: '安检数量',
						            type: 'bar',
						            stack: 'efBottle',
						            barMaxWidth:30,
						            data:this.checkNameData
						        },
//						       
//						        {
//						            name: '空瓶数',
//						            type: 'bar',
//						            stack: 'efBottle',
//						            barMaxWidth:30,
//						            data: this.circleEmptyData
//						        },
						       
						    ]
						};
					staffChart.setOption(option);	
				}
			},
			checkCircleInfo(){
				if(document.getElementById('checkCircleInfo')){
					let staffChart = echarts.init(document.getElementById('checkCircleInfo'),'light');
					let option = {
						    tooltip: {
						        trigger: 'axis',
						        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						        }
						    },
//						    legend: {
//						        data: ['重瓶数', '空瓶数']
//						    },
						    color: ['#2fa212'],
						    grid: {
						        left: '3%',
						        right: '4%',
						        bottom: '3%',
						        containLabel: true
						    },
						    xAxis: [
						        {
						            type: 'value',
						            axisTick: {
											length: 3
									}
						           
						        },
						        
						    ],
						    yAxis: [
						        {
						             type: 'category',
						            data: this.checkCircleLabel,
						           	axisTick: {
									length: 3
								}
						            
						        },
						        
						    ],
						    series: [
						        {
						            name: '安检数量',
						            type: 'bar',
						            stack: 'efBottle',
						            barMaxWidth:30,
						            data:this.checkCircleData
						        },
//						       
//						        {
//						            name: '空瓶数',
//						            type: 'bar',
//						            stack: 'efBottle',
//						            barMaxWidth:30,
//						            data: this.circleEmptyData
//						        },
						       
						    ]
						};
					staffChart.setOption(option);	
				}
			},
			getStatisticSecurity(){
					this.spinShow=true;
					this.checkNameData=[];
					this.checkNameLabel=[];
					this.typeUserLabel=[];
					this.typeUserData=[];
					this.checkCircleData=[];
					this.checkCircleLabel=[];
				_http.http1('get', `${pathUrls.statisticSecurity}?startTime=${this.startTime}&endTime=${this.endTime}`, {					
				}, 'form').then((res) => {
					this.spinShow=false;
					this.checkNameData=[];
					this.checkNameLabel=[];
					this.typeUserLabel=[];
					this.typeUserData=[];
					this.checkCircleData=[];
					this.checkCircleLabel=[];
					if(res.deptNum.length){
				    	for(let item of res.deptNum){
				    		this.checkCircleLabel.push(item.groupName);
				    		this.checkCircleData.push(item.groupNum);
				    		
				    	}
				    	this.checkCircleShow=true;
				    	this.$nextTick(
								() => {
									this.checkCircleInfo();
								}
								)
				    }else{
				    	this.checkCircleShow=false;
				    }
					if(res.checkNameNum.length){
				    	for(let item of res.checkNameNum){
				    		this.checkNameLabel.push(item.groupName);
				    		this.checkNameData.push(item.groupNum);
				    		
				    	}
				    	this.checkNameShow=true;
				    	this.$nextTick(
								() => {
									this.checkNameInfo();
								}
								)
				    }else{
				    	this.checkNameShow=false;
				    }
				    
				    if(res.userTypeNum.length){
				    	for(let item of res.userTypeNum){
				    		this.typeUserLabel.push(item.groupName);
				    		this.typeUserData.push({
				    			name:item.groupName,
								value:item.groupNum
				    		});
				    		
				    	}
				    	this.typeUserShow=true;
				    	this.$nextTick(
								() => {
									this.typeUserInfo();
								}
								)
				    }else{
				    	this.typeUserShow=false;
				    }
					
				})
			}
		},
		mounted(){
			this.dateTime=this.common.getStartEndTime();
			this.startTime=`${this.dateTime[0]}`+' '+'00:00';
			this.endTime=`${this.dateTime[1]}`+' '+'23:59';	
			this.getStatisticSecurity();
		}
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
</style>