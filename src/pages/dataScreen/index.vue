<template>
	<div class='main'>
		<div style="display: flex;justify-content: space-between;width: 100%;height:550px;">
			<div style="width: 60%;">
				<orderData 
					@dayCheckLaw='dayCheckLawData'
					@monthCheckLaw='monthCheckLawData'
					>					
				</orderData>
			</div>
			<div style="height: 100%;width: 35%;">
				<distributeData 
					@dayCheckCount='getDayCheckCount'
					@monthCheckCount='getMonthCheckCount'
					@dayFillCount='getDayFillCount'
					@monthFillCount='getMonthFillCount'
					 ></distributeData>					
			</div>
		</div>	
		<div style="margin-top: 10px;">
			<stationData 
				:dayCheckLaw='dayCheckLaw' 
				:monthCheckLaw='monthCheckLaw'
				:dayCheckCount='dayCheckCount'
				:monthCheckCount='monthCheckCount'
				:dayFillCount='dayFillCount'
				:monthFillCount='monthFillCount'
				>
			</stationData>
		</div>
		<!--<div style="margin-top: 10px;">			
			<inspectData></inspectData>		
		</div>-->
			
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import orderData from './orderData';
	import distributeData from './distributeData';
//	import inspectData from './inspectData';
	import stationData from './stationData';
	export default {
		name: 'dataScreen',
		components:{
			orderData,
			distributeData,			
			stationData
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),				
				xAxisData: [],
				metaDate: [],				
				monthCheckLaw:'0%',
				dayCheckLaw:'0%',
				dayCheckCount:0,
				monthCheckCount:0,
				dayFillCount:0,
				monthFillCount:0	

			}
		},
		methods: {
			//月充装数
			getMonthFillCount(data){
				this.monthFillCount=data;
			},
			//日充装数
			getDayFillCount(data){
				this.dayFillCount=data;
			},
			//月安检数
			getMonthCheckCount(data){
				this.monthCheckCount=data;
			},
			//日安检数
			getDayCheckCount(data){
				this.dayCheckCount=data;
			},
			//日安检率
			dayCheckLawData(data){
				this.dayCheckLaw=data;
			},
			//月安检率
			monthCheckLawData(data){
				this.monthCheckLaw=data;
			},		
		},
		mounted() {
					
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		background: #FFFFFF;
		height: 100%;
		padding: 10px;
		overflow-x: hidden;
	}
	
	
</style>