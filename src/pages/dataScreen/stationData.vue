<template>
	<div style="display: flex;justify-content: space-between;">
		<div style="width: 30%;">
			<div class='stationTitle' >安检统计</div>	
			<div class='checkData'>
				<div style="color: #1890FF;" class="checkDataContent">
					<span style="background: #ff0;">{{dayCheckCount}}</span>
					<span style="background: #f0f;color: #fff;">{{monthCheckCount}}</span>
					<!--<span style="background:rgb(0, 255, 243);">{{dayCheckLaw}}</span>
					<span style="background:rgb(255, 118, 0);color: #fff;">{{monthCheckLaw}}</span>-->
				</div>
				<div class="dataLabel">
					<span>今日安检数</span>
					<span>本月安检数</span>
					<!--<span>今日安检率</span>
					<span>本月安检率</span>-->
				</div>
				
				<!--<div style="text-align: center;box-shadow:inset 0 0 40px #60f97382;width: 90px;height: 80px;border-radius: 40px;margin-right: 20px;">
					<div style="height: 40px;line-height: 40px;">{{dayCheckCount}}</div>
					<div>今日安检数</div>
				</div>
				
				<div style="text-align: center;box-shadow:inset 0 0 40px #60f97382;width: 90px;height: 80px;border-radius: 40px;">
					<div style="height: 40px;line-height: 40px;">{{monthCheckCount}}</div>
					<div>本月安检数</div>
				</div>-->
			</div>
		</div>
		<div style="width: 30%;">
			<div class='stationTitle' >巡查统计</div>
			<div class='checkData'>
				<div style="color: #1890FF;" class="checkDataContent">
					<span style="background: rgb(47, 220, 84);color: #fff;">{{inspectDayCount}}</span>
					<span style="background: rgb(214, 166, 57);color: #fff;">{{inspectMonthCount}}</span>				
				</div>
				<div>
					<span>今日巡查数</span>
					<span>本月巡查数</span>
				</div>
			</div>
		</div>
		<div style="width: 35%;">     			
			<div class='stationTitle'>充装统计</div>	
			<div class='checkData'>
				<div style="color: #1890FF;" class="checkDataContent">
					<span style="background: rgb(117, 86, 239);color: #fff;">{{dayFillCount}}</span>
					<span style="background:rgb(0, 173, 255);color: #fff;">{{monthFillCount}}</span>					
				</div>
				<div><span>今日充装数</span><span>本月充装数</span></span></div>
			</div>
		</div>		
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'stationData',
		props:{
			dayCheckLaw:String,
			monthCheckLaw:String,
			dayCheckCount:Number,
			monthCheckCount:Number,
			dayFillCount:Number,
			monthFillCount:Number
		},
		data(){
			return{
				inspectDayCount:0,
				inspectMonthCount:0,
				userData: (JSON.parse(this.$store.state.userData)),
				dayRet: [],
				dayLabel: [],
				monthRet: [],
				monthLabel: [],
			}
		},
		methods:{
			getInspectInfo(){
				_http.http1('get', pathUrls.statAuditInfo, {					
				}, 'form').then((res) => {
					if(res.data){
						this.inspectDayCount=res.data.dayAuditCount;
						this.inspectMonthCount=res.data.monthAditCount;
					}
				})
			},
			toCheckInfo(){
				this.$router.push('/performanceStatistics/check');
			},
		},
		mounted(){
			this.getInspectInfo();
		}
	}
</script>

<style type="text/css" scoped>
.stationTitle {
		text-align: center;
		font-size: 16px;
		font-weight: 600;
		color: #fff;
		margin-bottom: 20px;
		cursor: pointer;
		background: #0089ff;
		width: 100px;
		height: 30px;
		line-height: 30px;
		border-radius: 15px;
	}	
.checkData{
	text-align: left;
	margin-left: 20px;
}	
.checkData span {
		display: inline-block;
		width: 100px;
		text-align: center;
		margin-right: 40px;
		margin-bottom: 10px;
		font-size: 16px;
		height: 26px;
		line-height: 26px;
	}	
.dataLabel span{
	
}	
.checkDataContent span{
	border-radius: 20px;
}
</style>