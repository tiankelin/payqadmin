<template>
	<div class="staffMain">
		<div class='staffTitle'>配送员配送统计</div>
		<div>
			<div style="position: absolute;left:150px;top: 0;">
				<Label style="width: 80px;">配送员</Label>
				<Select style="height: 28px;line-height: 28px;width: 200px;" placeholder='请选择配送员' @on-change='staffChange' filterable v-model='selectStaff'>
					<Option v-for='item in staffNameList' :value='item.staffId' :key='item.staffId'>{{item.staffName}}</Option>				
				</Select>
			</div>
			<div style="display: flex;justify-content: space-around;margin-top: 25px;">
				<div class="itemContent">
					<div>{{dayCancel}}</div>
					<div>昨日取消订单数</div>
					<div>{{monthCancel}}</div>
					<div>本月取消订单数</div>
				</div>
				<div class="itemContent">
					<div>{{dayFinish}}</div>
					<div>昨日完成订单数</div>
					<div>{{monthFinish}}</div>
					<div>本月完成订单数</div>
				</div>
				<div class="itemContent">
					<div>{{dayTotal}}</div>
					<div>昨日订单总数</div>
					<div>{{monthTotal}}</div>
					<div>本月订单总数</div>
				</div>
				<div class="itemContent">
					<div>{{dayBottle}}</div>
					<div>昨日配送钢瓶数</div>
					<div>{{monthBottle}}</div>
					<div>本月配送钢瓶数</div>
				</div>
				<div class="itemContent">
					<div>{{dayRecovery}}</div>
					<div>昨日回收钢瓶数</div>						
					<div>{{monthRecovery}}</div>
					<div>本月回收钢瓶数</div>							
				</div>
				<div class="itemContent">
					<div>{{dayCheck}}</div>
					<div>昨日安检数</div>
					<div>{{monthCheck}}</div>
					<div>本月安检数</div>
				</div>
			</div>
						
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'staffData',
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),				
				staffNameList:[],
				dayCancel:0,
				dayFinish:0,
				dayTotal:0,
				dayBottle:0,
				dayRecovery:0,
				dayCheck:0,				
				monthCancel:0,				
				monthFinish:0,				
				monthTotal:0,				
				monthBottle:0,				
				monthRecovery:0,				
				monthCheck:0,
				selectStaff:''
				
			}
		},
		methods: {
			staffChange(v){
				this.selectStaff=v;
				this.staffId=v;
				this.getStaffData('day');
				this.getStaffData('month');
			},
			//获取配送员配送统计
			getStaffData(type){
				this.dayCancel=0;	
				this.dayFinish=0;	
				this.dayTotal=0;
				this.dayBottle=0;
				this.dayRecovery=0;
				this.dayCheck=0;
				this.monthCancel=0;	
				this.monthFinish=0;	
				this.monthTotal=0;
				this.monthBottle=0;
				this.monthRecovery=0;
				this.monthCheck=0;
				_http.http3('get', pathUrls.staffStat, {
					staffId:this.selectStaff,
					type:type,
//					startTime:'2019-01-01',
//					endTime:'2020-4-29'
				}, 'form').then((res) => {
					if(res.data){
						if(type=='day'){
							this.dayCancel=res.data.cancelQuantity||0;	
							this.dayFinish=res.data.finishQuantity||0;	
							this.dayTotal=res.data.total||0;
							this.dayBottle=res.data.bottleCount||0;
							this.dayRecovery=res.data.recoveryCount||0;
							this.dayCheck=res.data.checkQuantity||0;
					}
						if(type=='month'){
							this.monthCancel=res.data.cancelQuantity||0;	
							this.monthFinish=res.data.finishQuantity||0;	
							this.monthTotal=res.data.total||0;
							this.monthBottle=res.data.bottleCount||0;
							this.monthRecovery=res.data.recoveryCount||0;
							this.monthCheck=res.data.checkQuantity||0;
					}	
						
					}
					
				})
				
			},
			//企业员工姓名接口
			getStaffName() { 
				_http.http1('post', pathUrls.deptStaff, {
					'deptId':this.userData.deptId
				}, 'form').then((res) => {
					this.selectStaff=res.data[0].staffId;
					this.staffNameList = res.data;
					this.getStaffData('day');
					this.getStaffData('month');
				})
			},

		},
		mounted() {
			
			this.getStaffName();
		}
	}
</script>

<style type="text/css" scoped>
	.staffMain{
		position: relative;
	}
	.dayTitle{
		color: #1ebb23;
		font-weight:600;
		
	}
	.monthTitle{
		color:#E20CDB;
		font-weight:600;
	}
	.staffTitle {
		text-align: left;
		font-size: 18px;
		font-weight: 600;
		color: #000;
		margin-bottom: 10px;
	}
	.staffMain>>>.ivu-select-single,.staffMain>>>.ivu-select-selection{
		height: 30px;
		line-height: 30px;
	}
	.itemContent{
		/*background: #ccc;*/
		border-radius:50%;
		padding: 18px;
		width: 135px;
		height: 135px;
		box-shadow:inset 0 0 40px #60f97382;
	}
</style>