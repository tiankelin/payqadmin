<template>
	<div class="inspectionMain">
		<div class="inspectionContent">
			<div class="inspectionTitle">钢瓶分配</div>
			<div style="padding:0 20px;text-align: left;">
				<div style="border-bottom:1px solid #ddd;font-weight: 600;height: 30px;line-height: 30px;">钢瓶条码</div>
				<div style="max-height:250px;overflow-y: auto;">
					<span v-for='(item,index) in inspectData' :key='index' style="margin:2px 5px;display: inline-block;width: 95px;color:#d800ff">
						{{item}}
					</span>
				</div>

			</div>
			<div style="text-align: left;padding: 5px 20px 0;" class="stationWrapper">
				<Form  inline :label-width="60" style="border-top:1px solid #ddd;padding-top: 10px;">
					<FormItem label="检测站">
						<Select v-model="checkStation" style="width:220px" clearable placeholder="请选择检测站">
							<Option :value="item.deptId" v-for='item in checkStationList' :key='item.deptId'>{{item.name}}</Option>

						</Select>
					</FormItem>
				</Form>
			</div>
			<div class="btnWrapper">
				<Button type="primary" @click='handSendCheck'>确定</Button>
				<Button  @click='handleBackClick'>取消</Button>
			</div>
		</div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default{
		name:'sendInspection',
		props:{
			inspectData:Array
		},
		data(){
			return{
				checkStation:'',
				checkStationList:[]
			}
		},
		methods:{
			//保存
			handSendCheck(){
				let bottleCodes=[];
				for(let item of this.inspectData){
					bottleCodes.push(item.bottleCode)
				}
				let subData={
					bottleCodes:this.inspectData,
					deptId:this.checkStation
				}
				if(!subData.deptId){
					this.$Message['warning']({
							background: true,
							content:'请选择检测站',
						});
						return false;
				}


				_http.http2('post', pathUrls.platformBottleCheck, subData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '送检成功!',
							onClose: (() => {
								this.$emit('inspectShowUpdate',true)
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						});
					}
				})
			},
			//获取检测站列表
			getDeptStationList(){
				_http.http1('post', pathUrls.deptStationList, {

				}, 'form').then((res) => {
					if(res.code==0){
						this.checkStationList=res.data;
					}

				})
			},
			//取消
			handleBackClick(){
				this.$emit('inspectShow',false)
			}
		},
		created(){
			this.getDeptStationList()
		},
		mounted(){

//			console.log(this.inspectData)

		}
	}
</script>

<style type="text/css" scoped>
	.inspectionMain{
		position: absolute;
		left: 0;
		top: 0;
		right:0;
		bottom:0;
		background: rgba(0,0,0,.4);
		z-index: 1000;
	}
	.inspectionContent{
		width: 478px;
		min-height: 300px;
		background: #fff;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -230px;
		margin-top: -180px;
		padding-bottom: 50px;


	}
	.inspectionTitle{
		height: 30px;
		line-height: 30px;
		background: #0095FF;color: #fff;
		text-align: center;
		font-weight: 600;

	}
	.btnWrapper{
		position: absolute;
		left: 0;
		bottom: 0;
		height: 50px;
		text-align: right;
		width: 100%;
	}
	.btnWrapper button{
		margin-right: 15px;
	}
	.stationWrapper>>>.ivu-form-item{
		margin-bottom: 10px;
	}
</style>
