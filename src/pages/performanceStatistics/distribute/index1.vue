<template>
	<div class="main">
	    <div style="width: 80%;">
			<DatePicker format="yyyy-MM-dd" v-model='dateTime'  @on-change='changeDate' type="daterange" :options="options2" placement="bottom" placeholder="Select date" style="width: 240px"></DatePicker>       				
	    </div>
		<div style="display: flex;overflow: hidden;position: relative;">
			<div style="width: 48%;margin-right: 2%;">
				<div class="mainTitle">区域统计</div>
				<div style="position: relative;">
					<div v-if='circleShow'>
						<div id='distributeCircleInfo' style="height:650px;"></div>					
					</div>						
					<div v-else style="height: 550px;margin-top: 100px;width: 60%;">
						<img src="@/assets/images/noData.png" alt="" />
						<div style="font-size: 16px;color: #e6e6e6;">暂无数据！</div>
					</div>
					<Spin size="large" fix v-if="spinShow"></Spin>
				</div>
			</div>
			<div style="width: 48%;margin-left: 2%;">
				<div class="mainTitle">配送员统计</div>
				<div style="position: relative;">
					<div v-if='distributeShow'>
						<div id='distributeStaffInfo' style="height:650px;"></div>					
					</div>						
					<div v-else style="height: 550px;width: 60%;margin-top: 100px;">
						<img src="@/assets/images/noData.png" alt="" />
						<div style="font-size: 16px;color: #e6e6e6;">暂无数据！</div>
					</div>
					<Spin size="large" fix v-if="spinShow"></Spin>
				</div>
			</div>
			
			
		</div>
		
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default{
		name:'distribute',
		data(){
			return{
				circleShow:false,
				circleEmptyData:[],
				circleFullData:[],
				circleLabel:[],
				staffEmptyData:[],
				staffFullData:[],
				staffLabel:[],
				distributeShow:false,
				spinShow:false,
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
						this.getStatisticBottle();
					}
				)
				
			},
			staffBottleInfo(){
				if(document.getElementById('distributeStaffInfo')){
					let staffChart = echarts.init(document.getElementById('distributeStaffInfo'),'light');
					let option = {
						    tooltip: {
						        trigger: 'axis',
						        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						        }
						    },
						    legend: {
						        data: ['配送瓶数', '回收瓶数']
						    },
						     color: ['#80e000','#00e1ff'],
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
						            data: this.staffLabel,
						           	axisTick: {
									length: 3
								}
						            
						        },
						        
						    ],
						    series: [
						        {
						            name: '配送瓶数',
						            type: 'bar',
						            stack: 'efBottle',
						            barMaxWidth:30,
						            data:this.staffFullData
						        },
						       
						        {
						            name: '回收瓶数',
						            type: 'bar',
						            stack: 'efBottle',
						            barMaxWidth:30,
						            data: this.staffEmptyData
						        },
						       
						    ]
						};
					staffChart.setOption(option);	
				}
			},
			circleBottleInfo(){
				if(document.getElementById('distributeCircleInfo')){
					let staffChart = echarts.init(document.getElementById('distributeCircleInfo'),'light');
					let option = {
						    tooltip: {
						        trigger: 'axis',
						        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						        }
						    },
						    legend: {
						        data: ['配送瓶数', '回收瓶数']
						    },
						    color: ['#f90','#2b85e4'],
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
						            data: this.circleLabel,
						           	axisTick: {
									length: 3
									},
								
						            
						        },
						        
						    ],
						    series: [
						        {
						            name: '配送瓶数',
						            type: 'bar',
						            stack: 'efBottle',
						            barMaxWidth:30,
						            data:this.circleFullData
						        },
						       
						        {
						            name: '回收瓶数',
						            type: 'bar',
						            stack: 'efBottle',
						            barMaxWidth:30,
						            data: this.circleEmptyData
						        },
						       
						    ]
						};
					staffChart.setOption(option);	
				}
			},			
			getStatisticBottle(){
				 this.spinShow=true;
				 this.staffLabel=[];
				 this.staffEmptyData=[];
				 this.staffFullData=[];
				 this.circleEmptyData=[];
				 this.circleFullData=[];
				 this.circleLabel=[];
				_http.http1('get', `${pathUrls.statisticBottle}?startTime=${this.startTime}&endTime=${this.endTime}`, {					
				}, 'form').then((res) => {
				    this.spinShow=false;
				    this.staffEmptyData=[];
				    this.staffFullData=[];
				    this.circleEmptyData=[];
				    this.circleFullData=[];
				    this.circleLabel=[];
				    if(res.deliverUserBottleNum.length){
				    	for(let item of res.deliverUserBottleNum){
				    		this.staffLabel.push(item.groupName);
				    		this.staffEmptyData.push(item.emptyNum);
				    		this.staffFullData.push(item.fullNum);
				    	}
				    	this.distributeShow=true;
				    	this.$nextTick(
								() => {
									this.staffBottleInfo();
								}
								)
				    }else{
				    	this.distributeShow=false;
				    }
				    if(res.deptBottleNum.length){
				    	for(let item of res.deptBottleNum){
				    		this.circleLabel.push(item.groupName);
				    		this.circleEmptyData.push(item.emptyNum);
				    		this.circleFullData.push(item.fullNum);
				    	}
				    	this.circleShow=true;
				    	this.$nextTick(
								() => {
									this.circleBottleInfo();
								}
								)
				    }else{
				    	this.circleShow=false;
				    }
				    
				    
				    
				    
				})
			}
		},
		mounted(){
			this.dateTime=this.common.getStartEndTime();
			this.startTime=`${this.dateTime[0]}`+' '+'00:00';
			this.endTime=`${this.dateTime[1]}`+' '+'23:59';	
			this.getStatisticBottle();
			
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