<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>{{statusCode==1?'编辑':'详情'}}</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form :label-width="130" v-has='"depositNoteInfo-info"'>
				<FormItem label="押金单号">
					<Input type="text" v-model='depositNumber' />
				</FormItem>
				<FormItem label="图片" style='margin-bottom: 0;'>
					<div v-if='statusCode==1'>
						<div class="demo-upload-list" v-for="(item,index) in depositPicList" :key="index">
							<template v-if="item.status === 'finished'">
								<img :src="item.url">
								<div class="demo-upload-list-cover">
									<Icon type="ios-eye-outline" @click.native="handleViewPicform(item.url)"></Icon>
									<Icon type="ios-trash-outline" @click.native="handleRemovePicform(item)"></Icon>
								</div>
							</template>
							<template v-else>
								<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
							</template>
						</div>
						<Upload v-show='depositPicList.length<1' ref="depositPic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessForm" :format="['jpg','jpeg','png']" :max-size="2048" type="drag" :action="fileUrl" style="display: inline-block;width:48px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
							<div style="width: 48px;height:48px;line-height: 48px;">
								<Icon type="ios-camera" size="20"></Icon>
							</div>
						</Upload>
					</div>
					<img v-for='item in depositPicList' :key='item' v-else :src="item.url" alt="" style="width: 40px;height: 40px;cursor: pointer;margin-right: 10px;" @click='viewPic(item.url)' />

				</FormItem>
				<FormItem label="户号">
					<Input readonly type="text" v-model='userAccountNumbers' />
				</FormItem>
				<FormItem label="客户名称">
					<span @click='handleToUserInfo' style="cursor: pointer;color: #0079FB;font-weight: 600;margin-right: 10px;">
						{{userName}}
					</span>
					<!--<Button type="info" size='small' @click='handleOrderHistory()'>历史购气</Button>-->
				</FormItem>
				<FormItem label="客户类型">
					<Input readonly type="text" v-model='userTypeName' />
				</FormItem>
				<FormItem label="联系方式">
					<Input readonly type='text' v-model='userPhone' />
				</FormItem>
				<FormItem label="总数量">
					<Input type='text' v-model='goodsCount' />
				</FormItem>
				<FormItem label="商品描述">
					<Select v-model="goodsId" placeholder='请选择钢瓶' v-if='statusCode==1'>
						<Option v-for="item in goodsSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
					</Select>
					<Input readonly type='text' v-model='goodsName' v-else/>
				</FormItem>

				<FormItem label="总押金">
					<InputNumber :min='0' v-model='pledgePrice' v-if='statusCode==1' />
					<Input type="text" readonly v-model='pledgePrice' v-else/>
				</FormItem>
				<FormItem label="备注">
					<Input type='text' v-model='remark' />
				</FormItem>
				<FormItem label="押瓶组织">
					<Input readonly type='text' v-model='deptName' />
				</FormItem>
				<FormItem label="押金登记时间">
					<Input readonly type='text' v-model='createTime' />
				</FormItem>

				<FormItem label="单据状态">
					<Input readonly type='text' v-model='newStatus' />
				</FormItem>
				<FormItem label="不通过原因">
					<Input readonly type='text' v-model='notPassReason' />
				</FormItem>
				<FormItem label="押瓶审核人">
					<Input readonly type='text' v-model='auditStaffName' />
				</FormItem>
				<FormItem label="押瓶审核时间">
					<Input readonly type='text' v-model='checkTime' />
				</FormItem>
				<FormItem label="退瓶审核人">
					<Input readonly type='text' v-model='returnAuditStaffName' />
				</FormItem>
				<FormItem label="退瓶审核时间">
					<Input readonly type='text' v-model='returnCheckTime' />
				</FormItem>
				<FormItem label="押瓶经办人">
					<Input readonly type='text' v-model='staffName' />
				</FormItem>
				<FormItem label="押瓶开始时间">
					<DatePicker type="date" placeholder="押瓶开始时间" v-model='beginTime' format="yyyy-MM-dd" v-if='statusCode==1'></DatePicker>
					<Input readonly type='text' v-model='beginTime' v-else/>

				</FormItem>
				<!--<FormItem label="收款人">
					<Input readonly type='text' v-model='moneyStaffName' />
				</FormItem>-->
				<FormItem label="退押/撤销经办人">
					<Input readonly type='text' v-model='returnStaffName' />
				</FormItem>
				<FormItem label="退押/撤销时间">
					<Input readonly type='text' v-model='endTime' />
				</FormItem>
			</Form>
			<div class="mainBodyButton">

				<div style="text-align: center;">
					<div style="display: inline;" v-has='"depositNoteInfo-revoke"'>
						<Button type="error" @click="handleRevoke()" style="margin:0 5px;" v-if='statusCode==1'>撤销</Button>
					</div>
					<div style="display: inline;" v-has='"depositNoteInfo-chargingAudit"'>
						<Button type="warning" @click="handleCheck()" style="margin:0 5px;" v-if='statusCode==1'>押瓶审核</Button>
					</div>
					<div style="display: inline" v-has='"depositNoteInfo-withdrawalAudit"'>
						<Button style="margin:0 5px;" type="warning" @click="handleCheck()" v-if='statusCode==2'>退瓶审核</Button>
					</div>
					<div style="display: inline" v-if='statusCode==1'>
						<!-- <Button type="primary" @click='editCylClick' v-if='editShow' style="margin:0 5px">编辑</Button> -->
						<Button type="primary" @click='addCylClick' :disabled="isDisabled" style="margin:0 5px">确定</Button>
						<Button style="margin:0 5px" @click='handleBackClick'>返回</Button>
					</div>

				</div>

			</div>
		</div>
		<Modal title="押金单图片" v-model="visible" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>
			<div class="rotateModal" @click='handleRotate' title='旋转'>
			
			</div>		
			<img :src="imgUrl" v-if="visible" ref='imgModal'  class="imgModal">
		</Modal>
		<orderHistory v-if='orderInfo' @orderInfo='orderInfoMethod' :userId='userId'></orderHistory>
		<refundReview v-if='reviewShow' @review='reviewMethod' :reviewType='actionType' :noteId='infoId'></refundReview>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import orderHistory from '@/pages/comComponent/orderHistory.vue';
	import refundReview from './refundReview';
	export default {
		name: 'editNote',
		components: {
			orderHistory,
			refundReview
		},
		data() {
			return {
				fileUrl: pathUrls.fileUpload,
				reviewShow: false,
				actionType: '',
				depositPicList: [],
				notPassReason: '',
				statusCode: null,
				infoId: '',
				userId: '',
				depositNumber: '',
				depositPic: '',
				userAccountNumbers: '',
				userName: '',
				userTypeName: '',
				userPhone: '',
				goodsCount: '',
				goodsName: '',
				pledgePrice: '',
				remark: '',
				deptName: '',
				createTime: '',
				newStatus: '',
				auditStaffName: '',
				checkTime: '',
				returnAuditStaffName: '',
				returnCheckTime: '',
				staffName: '',
				beginTime: '',
				moneyStaffName: '',
				returnStaffName: '',
				endTime: '',
				isDisabled: false,
				userId: '',
				orderInfo: false,
				visible: false,
				userData: (JSON.parse(this.$store.state.userData)),
				imgUrl: '',
				goodsSizeList: [],
				goodsId: '',
				rotateIndex:0
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
			handleFormatError(file) { //限制图片格式
				this.$Notice.warning({
					title: '图片格式不正确',
					desc: '图片格式不正确, 请选择 jpg 或者 png.'
				});
			},
			handleMaxSize(file) { //限制图片尺寸
				this.$Notice.warning({
					title: '图片尺寸过大',
					desc: '上传图片过大, 不要超过2M.'
				});
			},
			//押瓶表单上传成功钩子
			handleSuccessForm(res, file, fileList) {
				this.depositPicList = fileList;
				file.url = res.data.src;
				file.name = res.data.name;

			},
			//押瓶表单图片放大
			handleViewPicform(url) {
				this.visible = true;
				this.imgUrl = url;
			},
			//删去押瓶表单图片
			handleRemovePicform(file) {
				const fileList = this.depositPicList;
				fileList.splice(fileList.indexOf(file), 1);

			},
			//获取商品信息列表
			getGoodsList() {
				this.goodsSizeList = [];
				_http.http1('post', pathUrls.deptgoodsList, {
					'isGas': 2
				}, 'form').then((res) => {
					if(res.code == 0) {
						this.goodsSizeList = res.data;
					} else {
						this.goodsSizeList = [];
					}

				})
			},
			reviewMethod(data) {
				this.reviewShow = false;
				if(data == 2) {
					this.getBottlePledgeReturnInfo()
				}
			},
			//撤销
			handleRevoke() {
				this.$Modal.confirm({
					title: '是否撤销？',
					content: '',
					onOk: () => {
						let fData = {
							status: -1,
							id: this.infoId,
							actionType: 1,
						}
						_http.http2('post', pathUrls.bottlePledgeReturnAudit, fData).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '撤销成功!',
									onClose: (() => {
										this.getBottlePledgeReturnInfo()
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

				});
			},
			//审核
			handleCheck() {
				this.reviewShow = true;
			},
			//编辑
			addCylClick() {
				this.isDisabled = true;
				let newDepositPic = [];
				for(let item of this.depositPicList) {
					newDepositPic.push(item.url)
				}
				let fData = {
					id: this.infoId,
					depositNumber: this.depositNumber,
					beginTime: this.beginTime ? this.common.conformatDat(this.beginTime) : '',
					goodsId: this.goodsId,
					pledgePrice: this.pledgePrice,
					depositPic: newDepositPic.toString(),
					remark: this.remark
				}
				if(!fData.depositNumber) {
					this.$Message['warning']({
						background: true,
						content: '请输入押金单号!',
					});
					return false
				}
				_http.http2('post', pathUrls.bottlePledgeReturnUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.isDisabled = false;
								//								this.$router.go(-1);
								//								this.editShow = true;
								this.getBottlePledgeReturnInfo();
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						});
					}
					if(res.code != 0) {
						this.isDisabled = false;
					}
				}).catch(err => {
					this.isDisabled = false;
				})
			},
			getBottlePledgeReturnInfo() {
				this.statusCode == null;
				this.depositPicList = [];
				this.pledgePrice = '';
				this.beginTime = '';
				this.remark = '';
				//				let newPath=pathUrls.bottlePledgeReturnInfo;
				//					if(this.$route.params.type==2){
				//						newPath=pathUrls.bottlePledgeReturnInfoDetail;
				//					}
				//					if(this.$route.params.type==1){
				//						newPath=pathUrls.bottlePledgeReturnInfo;
				//					}
				_http.http1('get', pathUrls.bottlePledgeReturnInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					if(res.code == 0) {
						let datas = res.data;
						//						let entity = res.data.pledgeNoAuditLogEntity;
						this.depositNumber = datas.depositNumber;
						this.goodsId = datas.goodsId;
						this.userAccountNumbers = datas.userAccountNumbers;
						this.userName = datas.userName;
						this.userTypeName = datas.userTypeName;
						this.userPhone = datas.userPhone;
						this.goodsCount = datas.goodsCount;
						this.goodsName = datas.goodsName;
						this.actionType = datas.actionType;
						this.remark = datas.remark;
						this.deptName = datas.deptName;
						this.createTime = datas.createTime;
						this.newStatus = '';
						if(datas.actionType === 0 && datas.status === 0) {
							this.newStatus = '押瓶未审核';
							this.statusCode = 1;
						} else if(datas.actionType === 0 && datas.status === 1) {
							this.newStatus = '押瓶通过';
						} else if(datas.actionType === 0 && datas.status === 2) {
							this.newStatus = '押瓶不通过';
						} else if(datas.actionType === 1 && datas.status === 0) {
							this.newStatus = '退瓶未审核';
							this.statusCode = 2;
						} else if(datas.actionType === 1 && datas.status === 1) {
							this.newStatus = '退瓶通过';
						} else if(datas.actionType === 1 && datas.status === 2) {
							this.newStatus = '退瓶不通过';
						} else if(datas.status === -1) {
							this.newStatus = '撤销';
						}
						this.checkTime = datas.checkTime;
						this.returnCheckTime = datas.returnCheckTime;
						this.staffName = datas.staffName;
						this.beginTime = datas.beginTime;
						this.moneyStaffName = datas.moneyStaffName;
						this.returnStaffName = datas.returnStaffName;
						this.endTime = datas.endTime;
						this.userId = datas.userId;
						this.infoId = datas.id;
						this.auditStaffName = datas.auditStaffName;
						this.returnAuditStaffName = datas.returnAuditStaffName;
						this.notPassReason = datas.notPassReason;
						this.pledgePrice = datas.pledgePrice;
						this.depositPic = datas.depositPic;
						if(datas.depositPic) {
							let depositPic = datas.depositPic.split(',');
							for(let item of depositPic) {
								this.depositPicList.push({
									url: item,
									showProgress: false,
									status: "finished",
									percentage: 100
								})
							}

						}
					}
				})
			},

			handleToUserInfo() {
				let id = this.userId;
				this.$router.push(`/customerInfo/seeAccount/${id}/2`);
			},
			orderInfoMethod(data) {
				this.orderInfo = data;
			},
			//历史购气
			handleOrderHistory() {
				this.orderInfo = true;
			},

			viewPic(url) {
				this.visible = true;
				this.imgUrl = url;
			},
			//返回
			handleBackClick() {
				this.$router.go(-1);
			},

		},

		mounted() {
			this.getGoodsList()
			this.getBottlePledgeReturnInfo()
		}
	}
</script>

<style type="text/css" scoped>
	.ivu-form-item {
		margin-bottom: 10px;
		width: 500px;
	}
	
	.mainBody>>>.ivu-select-disabled,
	.mainBody>>>.ivu-select-selection {
		background-color: #fff;
		color: #515a6e;
	}
	
	.mainBody>>>.ivu-input-number-disabled,
	.mainBody>>>.ivu-input-number-input {
		background-color: #fff;
		color: #515a6e;
	}
	
	.mainBody>>>.ivu-date-picker {
		width: 100%;
	}
	
	.mainBody>>>.ivu-input-number {
		width: 100%;
	}
	
	.btnTag>>>.ivu-btn {
		padding: 0 10px!important;
	}
	
	.mainBody>>>.errorColor .ivu-input {
		color: #f00;
	}
	
	.demo-upload-list {
		display: inline-block;
		width: 50px;
		height: 50px;
		text-align: center;
		line-height: 50px;
		border: 1px solid transparent;
		border-radius: 4px;
		overflow: hidden;
		background: #fff;
		position: relative;
		margin-right: 4px;
	}
	
	.demo-upload-list img {
		width: 100%;
		height: 100%;
	}
	
	.demo-upload-list-cover {
		display: none;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, .6);
	}
	
	.demo-upload-list:hover .demo-upload-list-cover {
		display: block;
	}
	
	.demo-upload-list-cover i {
		color: #fff;
		font-size: 16px;
		cursor: pointer;
		margin: 0 2px;
	}
	
	
</style>