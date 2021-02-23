<template>
	<div class="orderTransferMain">
		<div class="orderTransferContent">
			<div class="closeWrapper" @click='handleClose'>
				<Icon type="md-close" />
			</div>
			<div>
				<h3 class="instructTitle">订单转派</h3>
				<div style="padding:10px;">
					<div>
						<Form :label-width="90">
							<FormItem label="被转派人员">
								<Select v-model="staffId" filterable style="width:220px;" placeholder="请选择被转派人员" clearable>
									<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
								</Select>
							</FormItem>
						</Form>
					</div>
					<div style="text-align: center;margin-top: 50px;">
						<Button type="primary" @click='handleEnter'>确定</Button>
						<Button style="margin-left: 20px;" @click='handleClose'>返回</Button>
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
		name: 'orderTransfer',
		props: {
			clickId: Number,
			userDeptId: String,
			orderId: Number
		},
		data() {
			return {
				staffId: '',
				userData: (JSON.parse(this.$store.state.userData)),
				staffNameList: []
			}
		},
		methods: {

			handleEnter() {
				let fData = {
					orderId: this.orderId,
					staffId: this.staffId
				}
				if(!fData.staffId) {
					this.$Message['warning']({
						background: true,
						content: '请选择被转派人员',
					});
					return false;
				}
				_http.http2('post', pathUrls.webOrderTransfer, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '转派成功!',
							onClose: (() => {
								this.$emit('closeorderTransfer', this.clickId);

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
			handleClose() {
				this.$emit('closeorderTransfer', null);
			}
		},
		mounted() {
			this.common.getDeliveryStaff(this.userDeptId).then((res) => {
				this.staffNameList = res.data
			})
		}
	}
</script>

<style type="text/css" scoped>
	.orderTransferMain {
		background: rgba(0, 0, 0, .5);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
	}
	
	.orderTransferContent {
		width: 400px;
		min-height: 200px;
		background: #fff;
		border-radius: 4px;
		padding: 10px;
		margin: 120px auto 0;
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
	
	.orderTransferContent>>>.ivu-form-item {
		margin-bottom: 12px;
	}
</style>