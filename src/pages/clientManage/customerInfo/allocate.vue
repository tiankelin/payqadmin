<template>
	<div class='allocation'>
			<div class='allocationContent'>
				<Form :model="formAllocate" inline :label-width="80">
					<FormItem label="配送员" class='star'>
						<Select v-model="formAllocate.staffName" filterable style="width:200px;">
							<Option v-for="item in staList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
						</Select>
					</FormItem>
					<FormItem label="完善内容" class='stars'>
						<Input type="textarea" style="width: 200px;" v-model='formAllocate.remarks'/>
					</FormItem>
					<FormItem>
						<Button type="primary" @click='enterClick'>确定</Button>
						<Button type="info" @click='handleCancel' style="margin-left: 10px;">取消</Button>
					</FormItem>
				</Form>
			</div>
		</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'allocate',
		props:{
			newDeps:String,
			newIds:Number
		},
		data(){
			return{
				formAllocate:{
					staffName:'',	
					remarks:''
				},
				staList:[],
			}
		},
		methods:{
			//分配接口获取
			getAllocation(arr) {
				_http.http2('post', pathUrls.userAllocation, JSON.stringify({
					'ids': arr.toString(),
					'staffId': this.formAllocate.staffName,
					'remarks':this.formAllocate.remarks
				})).then((res) => {					
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '分配成功!',
							onClose: (() => {
								this.$emit('allocateShow',false);
								this.$emit('isSuccess',true);
								this.formAllocate.staffName = '';																
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
			enterClick(){
				if(!this.formAllocate.staffName) {
					this.$Message['warning']({
						background: true,
						content: '请选择配送员!',						
					});
					return false
				}
				this.getAllocation([this.newIds])
			},
			handleCancel(){
				this.$emit('allocateShow',false);
			},
			//获取修改人员列表
			getQueryStaffList(id) {
				this.staList = []
				_http.http1('post', pathUrls.deptStaff, {
						deptId: id,
					}, "form")
					.then((res) => {
						//成功的回调
						if(res) {
							this.staList = res.data
							

						}
					})
			},
		},
		mounted(){
			this.getQueryStaffList(this.newDeps);			
		}
	}
</script>

<style type="text/css" scoped>
	.allocation {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .4);
		z-index: 1000;
	}
	.allocationContent {
		width: 340px;
		height: 190px;
		background: #fff;
		position: absolute!important;
		left: 50%;
		top: 50%;
		margin-left: -170px;
		margin-top: -100px;
		padding: 20px;
		text-align: left;
		border-radius: 4px;
	}	
	.allocationContent>>>.ivu-form-item {
		margin-bottom: 15px;
	}
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	.stars>>>.ivu-form-item-label:after {
		content: "*";
		color: #fff;
		padding-right: 2px;
	}
</style>