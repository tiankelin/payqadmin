<template>
	<div class="inspectMain">
		<div class='inspectTitle' >巡查统计</div>
		<div class='inspectData'>
			<div style="color: #1890FF;" class="inspecDataContent">
				<span style="background: rgb(47, 220, 84);color: #fff;">{{inspectDayCount}}</span>
				<span style="background: rgb(214, 166, 57);color: #fff;">{{inspectMonthCount}}</span>
			</div>
			<div class="dataLabel">
				<span>今日巡查数</span>
				<span>本月巡查数</span>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'inspectData',
		data() {
			return {
				inspectDayCount:0,
				inspectMonthCount:0
			}
		},
		methods: {
			toInspectInfo(){
				this.$router.push('/performanceStatistics/inspect');
			},
			getInspectInfo(){
				_http.http1('get', pathUrls.statAuditInfo, {					
				}, 'form').then((res) => {
					if(res.data){
						this.inspectDayCount=res.data.dayAuditCount;
						this.inspectMonthCount=res.data.monthAditCount;
					}
				})
			}
		},
		mounted() {
			this.getInspectInfo();
		}
	}
</script>

<style type="text/css" scoped>
	.inspectTitle {
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
	
	.inspectData {
		text-align: left;
		margin-left: 20px;
	}
	
	.inspectData span {
		display: inline-block;
		width: 100px;
		text-align: center;
		margin-right: 40px;
		margin-bottom: 10px;
		font-size: 16px;
		height: 26px;
		line-height: 26px;
	}
	.inspecDataContent span{
		border-radius: 20px;
		
	}
</style>