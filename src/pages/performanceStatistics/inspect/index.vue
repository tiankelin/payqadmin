<template>
	<div class="main">
		<div style="width: 80%;">
			<DatePicker format="yyyy-MM-dd" v-model='dateTime'  @on-change='changeDate' type="daterange" :options="options2" placement="bottom" placeholder="Select date" style="width: 240px"></DatePicker>       				
		</div>
		<div style="display: flex;overflow: hidden;position: relative;">
			<div style="width: 48%;margin-right: 2%;">
				<div class="mainTitle">被检人统计</div>
				<div style="position: relative;">
					<div v-if='manageAuditShow'>
						<div id='manageAuditStaffInfo' style="height:700px;"></div>					
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
					<div class="mainTitle">稽查人统计</div>
					<div style="position: relative;">
						<div v-if='auditShow'>
							<div id='auditStaffInfo' style="height:450px;"></div>					
						</div>						
						<div v-else style="height: 375px;margin-top: 80px;width: 60%;">
							<img src="@/assets/images/noData.png" alt="" />
							<div style="font-size: 16px;color: #e6e6e6;">暂无数据！</div>
						</div>
						<Spin size="large" fix v-if="spinShow"></Spin>
					</div>
					<div class="mainTitle">被检类型统计</div>
					<div style="position: relative;">
						<div v-if='typeAuditShow'>
							<div id='typeAuditInfo' style="height:240px;"></div>					
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
		name:'inspect',
		data(){
			return{
				typeAuditShow:false,
				auditStaffLabel:[],
				auditStaffData:[],
				auditShow:false,
				manageAuditShow:false,
				spinShow:false,
				manageAuditStaffData:[],
				manageAuditStaffLabel:[],
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
						this.getStatisticAudit();
					}
				)
				
			},
			
			manageAuditStaffInfo(){
				if(document.getElementById('manageAuditStaffInfo')){
					let staffChart = echarts.init(document.getElementById('manageAuditStaffInfo'),'light');
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
						    color: ['#00e1ff'],
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
						            data: this.manageAuditStaffLabel,
						           	axisTick: {
									length: 3
								}
						            
						        },
						        
						    ],
						    series: [
						        {
						            name: '稽查数量',
						            type: 'bar',
						            stack: 'efBottle',
						            barMaxWidth:30,
						            data:this.manageAuditStaffData
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
			auditStaffInfo(){
				if(document.getElementById('auditStaffInfo')){
					let staffChart = echarts.init(document.getElementById('auditStaffInfo'),'light');
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
						    color: ['#80e000'],
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
						            data: this.auditStaffLabel,
						           	axisTick: {
									length: 3
								}
						            
						        },
						        
						    ],
						    series: [
						        {
						            name: '稽查数量',
						            type: 'bar',
						            stack: 'efBottle',
						            barMaxWidth:30,
						            data:this.auditStaffData
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
			typeAuditInfo(){
				if(document.getElementById('typeAuditInfo')){
					let staffChart = echarts.init(document.getElementById('typeAuditInfo'),'light');
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
						data:this.typeAuditLabel
//						this.originDayLabel
					},
					color: ['#8841fb','#67c23a','#0f0','#00f'],
//					color: ['#67eaf7', '#45e677', '#f3a61a','#dcbc46','#0f0','#00f'],
					series: [{
						name: '被检类型统计',
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
						data:this.typeAuditData
//						this.originDayData

					}]
				};
				staffChart.setOption(option);
				}
			},
			getStatisticAudit(){
				 this.spinShow=true;
				 this.manageAuditStaffData=[];
				 this.manageAuditStaffLabel=[];
				 this.auditStaffLabel=[];
				 this.auditStaffData=[];
				 this.typeAuditLabel=[];
				 this.typeAuditData=[];
				_http.http1('get', `${pathUrls.statisticAudit}?startTime=${this.startTime}&endTime=${this.endTime}`, {					
				}, 'form').then((res) => {
					this.spinShow=false;
					this.manageAuditStaffData=[];
					this.manageAuditStaffLabel=[];
					this.auditStaffLabel=[];
				    this.auditStaffData=[];
				    this.typeAuditLabel=[];
				    this.typeAuditData=[];
					if(res.manageAuditStaffNum.length){
				    	for(let item of res.manageAuditStaffNum){
				    		this.manageAuditStaffLabel.push(item.groupName);
				    		this.manageAuditStaffData.push(item.groupNum);
				    		
				    	}
				    	this.manageAuditShow=true;
				    	this.$nextTick(
								() => {
									this.manageAuditStaffInfo();
								}
								)
				    }else{
				    	this.manageAuditShow=false;
				    }
				    if(res.auditStaffNum.length){
				    	for(let item of res.auditStaffNum){
				    		this.auditStaffLabel.push(item.groupName);
				    		this.auditStaffData.push(item.groupNum);
				    		
				    	}
				    	this.auditShow=true;
				    	this.$nextTick(
								() => {
									this.auditStaffInfo();
								}
								)
				    }else{
				    	this.auditShow=false;
				    }
				    if(res.typeAuditStaffNum.length){
							for(let item of res.typeAuditStaffNum){
								this.typeAuditLabel.push(item.groupName);
				 				this.typeAuditData.push({
				 					name:item.groupName,
									value:item.groupNum
				 				})
							}
							
							this.typeAuditShow=true;
							this.$nextTick(
								() => {
									this.typeAuditInfo();
								}
							)
						} else{
							this.typeAuditShow=false;
						}
						
				    
				    
				})
			}
		},
		mounted(){
			this.dateTime=this.common.getStartEndTime();
			this.startTime=`${this.dateTime[0]}`+' '+'00:00';
			this.endTime=`${this.dateTime[1]}`+' '+'23:59';	
			this.getStatisticAudit();
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