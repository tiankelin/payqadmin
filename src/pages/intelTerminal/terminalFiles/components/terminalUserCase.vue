<template>
	<div class="userMain">
		<div class="userContent">		
			<div class="closeWrapper" @click='handleClose'><Icon type="md-close" /></div>
			<div>
				<h3 class="userTitle">使用情况</h3>
				<div style="padding: 15px 10px;">
					<Form :label-width="120">
						<FormItem label="终端ID">
							<Input style="width: 380px;" v-model='carId' placeholder="终端ID"/>
						</FormItem>
						<FormItem label="使用者">
							<Input style="width: 380px;" v-model='userName' placeholder="使用者"/>
						</FormItem>
						<FormItem label="是否人脸识别">
							<Input style="width: 380px;" v-model='faceCheck' placeholder="是否人脸识别"/>
						</FormItem>
						<FormItem label="起始时间">
							<Input style="width: 380px;" v-model='startDate' placeholder="起始时间"/>
						</FormItem>
						<FormItem label="结束时间">
							<Input style="width: 380px;" v-model='endDate' placeholder="结束时间"/>
						</FormItem>
						<FormItem label="使用时长">
							<Input style="width: 380px;" v-model='duration' placeholder="使用时长"/>
						</FormItem>
					</Form>	
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'terminalUserCase',
		props:{
			terId:String
		},
		data(){
			return{
				carId:'',
				userName:'',
				faceCheck:'否',
				startDate:'',
				endDate:'',
				duration:''
			}
		},
		methods:{		
			//关闭
			handleClose(){
				this.$emit('closeUserCase',false);
			},
			getUserCaseInfo(){
				
				_http.http1('get', pathUrls.terminalUseInfo + '/?terminalId=' + this.terId, {}, 'form').then((res) => {
					if(res.code==0){
						this.carId=res.useInfo.carId;
						this.userName=res.useInfo.userName;
						this.faceCheck=res.useInfo.faceCheck==2?'否':'是';
						this.duration=res.useInfo.duration;
						this.startDate=res.useInfo.startDate;
						this.endDate=res.useInfo.endDate;
					}
				})
				
			}
		},
		mounted(){
			this.getUserCaseInfo()
		}
	}
</script>

<style type="text/css" scoped>
	.userMain{
		background:rgb(41, 107, 126);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		
	}
	.userContent{
		width:100%;
		height:100%;
		background: #fff;
		/* border-radius: 4px; */
		padding-top: 10px;
		/* margin: 10px; */
		position: relative;
		text-align: left;
	}
	.closeWrapper{
		position: absolute;
		right: 12px;
		top:0px;
		font-size: 32px;
		cursor: pointer;
		color:#1296db;
		font-weight: 600;
	}
	.userTitle{
		margin: 0 11px;
	}
</style>