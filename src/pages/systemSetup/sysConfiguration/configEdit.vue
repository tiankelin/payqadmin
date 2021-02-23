<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>编辑</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form :label-width="120">

				<FormItem label="配置值" class='star'>
					<!--<Input style="width:400px;" v-model='configValue' placeholder="请输入配置值"/>-->
					<InputNumber style="width:400px;" v-model='configValue' placeholder="请输入配置值" :min='0' :max='100000' />
				</FormItem>
				<FormItem label="备注" class='star'>
					<Input style="width: 400px;" type="text" placeholder="请输入备注" v-model='configRemarks' />

				</FormItem>

			</Form>
			<div class="mainBodyButton">
				<Button type="primary" @click="handleSave" :disabled="isDisabled">确定</Button>				
				<Button style="margin-left: 8px" @click="handleBackClick">返回</Button>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'configEdit',
		data() {
			return {
				isDisabled:false,
				configRemarks: '',
				configValue: '',
				configId: ''
			}
		},
		methods: {
			//获取详情
			getConfigInfo() {
				_http.http1('get', pathUrls.sysconfigInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					if(res.code == 0) {
						this.configValue = res.sysConfig.configValue;
						this.configRemarks = res.sysConfig.configRemarks;
						this.configId = res.sysConfig.configId;
					}

				})
			},
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//确定
			handleSave() {
				this.isDisabled=true;
				let fData = {
					configRemarks: this.configRemarks,
					configValue: this.configValue,
					configId: this.configId
				}

				if(!fData.configValue) {
					this.$Message['warning']({
						background: true,
						content: '请输入配置值!',

					});
					return false
				}

				if(!fData.configRemarks) {
					this.$Message['warning']({
						background: true,
						content: '请输入备注!',
						duration: 1
					});
					return false
				}

				_http.http2('post', pathUrls.sysconfigUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.$router.go(-1);

							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						});
					}
					if(res.code != 0){
						this.isDisabled=false;
					}
				}).catch(err=>{
						this.isDisabled=false;
				})
			}
		},
		mounted() {
			this.getConfigInfo()
		}
	}
</script>

<style type="text/css" scoped>
	.mainBody>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
</style>