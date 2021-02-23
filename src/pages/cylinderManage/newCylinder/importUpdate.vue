<template>
	<div class="importMain">
		<div class="importContent">
			<div class="closeWrapper" @click='handleClose'>
				<Icon type="md-close" />
			</div>
			<div>
				<h3 class="instructTitle">钢瓶导入更新</h3>
				<div style="padding:10px;">
					<div>
						<Form :label-width="90">
							<FormItem label="检测站" class='star'>
								<Select style="width:300px;" placeholder="检测站" v-model='testStation' @on-change='stationChange' clearable>
									<Option v-for='item in testList' :key='item.deptId' :value='item.deptId'>{{item.name}}</Option>
								</Select>
							</FormItem>
							<FormItem label="更新时间" class='star'>
								<DatePicker @on-change='changeTime' style='width: 300px;' type="date" placeholder="更新时间" v-model='updateTime' format="yyyy-MM-dd">
								</DatePicker>
							</FormItem>
							<div style="font-size: 12px;font-style:italic;color: #EE6515;margin:5px 0 10px 0;">选择检测站时需同时选择更新时间！</div>
							<FormItem v-show='!(testStation&&!updateTime)'>
								<Upload :data='updateData' :action="fileUrl1" :show-upload-list='false' :on-success='importSuccess1' :headers="{'Authorization':'Bearer_'+token}">
									<Button type="warning">导入更新</Button>
								</Upload>
							</FormItem>
						</Form>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'importUpdate',
		data() {
			return {
				token:(this.$store.state.token),
				fileUrl1: pathUrls.bottleBatchUpdate,
				testStation: '',
				testList: [],
				updateTime: '',
				userData: (JSON.parse(this.$store.state.userData)),
				updateData:{
					
				},
			}
		},
		methods: {
			
			changeTime(v){
				this.updateData.time=this.updateTime?(this.common.conformatDat(this.updateTime)):'';				
			},
			stationChange(v){
				this.updateData.deptId=v?this.testStation:'';
			},			
			importSuccess1(response, file, fileList) {
				console.log(response)
				if(response.code==0){
					this.$Message['success']({
					background: true,
					content:'更新成功',
					onClose: (() => {
//						this.$emit('closeUpdate', 1);
					})
				});
				}
				if(response.code == 500) {
						this.$Message['warning']({
							background: true,
							content: response.msg,
						});
				}

			},
			//获取检测站
			getTeststationList() {
				_http.http1("post", pathUrls.depTtestStationList, {
					needGasCompany:1
				},'form').then(res => {
					this.testList = res.data;
				})
			},
			handleClose() {
				this.$emit('closeUpdate', 0);
			}
		},
		mounted() {
			this.getTeststationList();
		}
	}
</script>

<style type="text/css" scoped>
	.importMain {
		background: rgba(0, 0, 0, .5);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
	}
	
	.importContent {
		width: 440px;
		min-height: 220px;
		background: #fff;
		border-radius: 4px;
		padding: 10px;
		margin: 150px auto 0;
		position: relative;
		text-align: left;
	}
	
	.closeWrapper {
		position: absolute;
		right: 12px;
		top: -3px;
		font-size: 28px;
		cursor: pointer;
		color: #1296db;
		font-weight: 600;
	}
	
	.importContent>>>.ivu-form-item {
		margin-bottom: 12px;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	
</style>