<template>
	<div class='mainBorder'>
		<div class='mainHeader'>
			<span>详情</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :label-width="120">
				<FormItem label="联系人">
					<Input v-model="typeForm.helpUserName" readonly/>
				</FormItem>
				<FormItem label="销售员">
					<Input v-model="typeForm.helpDeliveryUserName" readonly/>
				</FormItem>
				<FormItem label="客户名称">
					<Input v-model="typeForm.helpUserCompanyName" readonly/>
				</FormItem>
				<FormItem label="客户类型">
					<Input v-model="typeForm.helpUserOrderType" readonly/>
				</FormItem>
				<FormItem label="求助地址">
					<Input v-model="typeForm.helpUserAddress" readonly/>
				</FormItem>
				<FormItem label="联系方式">
					<Input v-model="typeForm.helpUserPhone" readonly/>
				</FormItem>
				<FormItem label="处理人">
					<Input v-model="typeForm.helpProcessingUserName" readonly/>
				</FormItem>
				<FormItem label="处理状态">
					<Input v-model="typeForm.helpStatus" readonly/>
				</FormItem>
				<FormItem label="求助时间">
					<Input v-model="typeForm.helpCreateTime" readonly/>
				</FormItem>
				<FormItem label="处理时间">
					<Input v-model="typeForm.helpHandleTime" readonly/>
				</FormItem>
				<FormItem label="完成时间">
					<Input v-model="typeForm.helpFinishTime" readonly/>
				</FormItem>
				<FormItem label="求助地址">
					<Input v-model="typeForm.helpUserAddress" readonly/>
				</FormItem>
				<FormItem label="图片">
					<div style="display: flex;">
						<img @click='viewSign(item)' :src="item" alt="" v-for='item in helpScenePic' :key='item' v-if='item' style="cursor:pointer;height:60px;width: auto;margin-left:20px;">
						<Modal title="View Image" v-model="visible" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide>
							<div style="position: absolute;right:60px;top:10px;cursor: pointer;">
								<Icon type="md-sync" size='30' @click='handleRotate' />
							</div>
							<img :src="imgUrl" v-if="visible" ref='imgModal' class="imgModal">

						</Modal>
					</div>
				</FormItem>
				<FormItem label="视频">
					<div>
						<video controls="controls" :src="item" v-for='item in helpSceneVideo' :key='item' v-if='item' style="height: 80px;width:80px;margin-left: 20px;"></video>
					</div>

				</FormItem>

			</Form>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'helpList',
		data() {
			return {
				typeForm: {
					rotateIndex:0,
					helpUserName: '',
					helpDeliveryUserName: '',
					helpUserCompanyName: '',
					helpUserOrderType: '',
					helpUserAddress: '',
					helpUserPhone: '',
					helpProcessingUserName: '',
					helpStatus: '',
					helpCreateTime: '',
					helpHandleTime: '',
					helpFinishTime: '',
					helpUserAddress: '',

				},
				helpScenePic: [],
				helpSceneVideo: [],
				visible: false,
				imgUrl: ''
			}
		},
		methods: {
			handleCancel(){
				this.rotateIndex=0;
			},
			handleRotate(){
				this.rotateIndex=this.rotateIndex+1;
				this.$refs.imgModal.style.transform='rotate('+ 90*this.rotateIndex +'deg)';
			},
			viewSign(url) {
				this.visible = true;
				this.imgUrl = url;
			},
			//获取求助单详情信息
			getHelpInfo() {
				_http.http1('get', pathUrls.userhelpInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					this.typeForm.helpUserName = res.userHelp.helpUserName;
					this.typeForm.helpDeliveryUserName = res.userHelp.helpDeliveryUserName;
					this.typeForm.helpUserCompanyName = res.userHelp.helpUserCompanyName;
					this.typeForm.helpUserCompanyName = res.userHelp.helpUserCompanyName ? res.userHelp.helpUserCompanyName : res.userHelp.helpUserName;
					this.typeForm.helpUserOrderType = res.userHelp.helpUserOrderTypeName;
					this.typeForm.helpUserAddress = res.userHelp.helpUserAddress;

					this.typeForm.helpUserPhone = res.userHelp.helpUserPhone;
					this.typeForm.helpProcessingUserName = res.userHelp.helpProcessingUserName;
					this.typeForm.helpStatus = res.userHelp.helpStatus;
					this.typeForm.helpCreateTime = res.userHelp.helpCreateTime;
					this.typeForm.helpHandleTime = res.userHelp.helpHandleTime;
					this.typeForm.helpFinishTime = res.userHelp.helpFinishTime;
					this.typeForm.helpUserAddress = res.userHelp.helpUserAddress;

					if(res.userHelp.helpScenePic) {
						res.userHelp.helpScenePic = res.userHelp.helpScenePic.replace(/\[|]/g, '');
						this.helpScenePic = res.userHelp.helpScenePic.split(',');
					}
					if(res.userHelp.helpSceneVideo) {
						res.userHelp.helpSceneVideo = res.userHelp.helpSceneVideo.replace(/\[|]/g, '');
						this.helpSceneVideo = res.userHelp.helpSceneVideo.split(',');
						console.log(this.helpSceneVideo)
					}
				})
			},
			//返回
			handleBackClick() {
				this.$router.go(-1);
			},
		},
		mounted() {
			this.getHelpInfo()
		}
	}
</script>

<style type="text/css" scoped>
	.ivu-form-item {
		margin-bottom: 10px;
		width: 500px;
	}
</style>