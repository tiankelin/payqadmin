<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>新增</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form :label-width="120">
				<FormItem label='消息类型' class='star'>
					<Select style="width: 200px;" v-model='messageType' placeholder='请选择消息类型'>
						<Option :value='0'>系统消息</Option>
						<Option :value='1'>业务消息</Option>
						<Option :value='2'>通知</Option>
						<Option :value='3'>公告</Option>
					</Select>
				</FormItem>
				<!--<FormItem label="消息触发时间">
						<DatePicker type="datetime" placeholder="请选择消息触发时间" style="width: 200px;" format="yyyy-MM-dd HH:mm:ss" v-model='gmtTrigger'></DatePicker>
					</FormItem>-->
				<!-- 	<FormItem label='接收类型' class='star'>
						<i-switch v-model="receiveType" size="large" false-color="#ff4949" :true-value='1' :false-value='2'  style='width: 75px;' class='switchType'>
							<span slot="open">app接收</span>
							<span slot="close">web接收</span>
					</i-switch>	
					</FormItem> -->

				<FormItem label="消息标题" class='star'>
					<Input style="width: 600px;" v-model='messageTitle' placeholder="请输入消息标题" />
				</FormItem>
				<FormItem label="消息内容" class='star'>
					<Input style="width: 600px;" type="textarea" :rows="10" placeholder="请输入消息内容" v-model='messageContent' />
					<span style="position: absolute;left:608px;top:-4px;font-size: 18px;cursor: pointer;color: #f00;">
							<Tooltip content="点击回车键切换下一条!" theme="light" >!</Tooltip>
						</span>
				</FormItem>

			</Form>
			<div class="mainBodyButton">
				<Button type="primary" @click="handleSave">确定</Button>
				<Button style="margin-left: 8px" @click="handleBackClick">返回</Button>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'messageAdd',
		data() {
			return {
				messageType: null,
				receiveType: 2,
				messageTitle: '',
				messageContent: '',
				gmtTrigger: ''

			}
		},
		methods: {
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//确定
			handleSave() {
				let fData = {
					messageType: this.messageType,
					receiveType: this.receiveType,
					title: this.messageTitle,
					content: this.messageContent
				}
				if(!fData.messageType && fData.messageType != 0) {
					this.$Message['warning']({
						background: true,
						content: '请选择消息类型!',
						duration: 1
					});
					return false
				}
				if(!fData.title) {
					this.$Message['warning']({
						background: true,
						content: '请输入消息标题!',
						duration: 1
					});
					return false
				}
				if(fData.title.length > 100) {
					this.$Message['warning']({
						background: true,
						content: '消息标题过长!',
						duration: 1
					});
					return false
				}
				if(!fData.content) {
					this.$Message['warning']({
						background: true,
						content: '请输入消息内容!',
						duration: 1
					});
					return false
				}
				// console.log(fData)
				_http.http2('post', pathUrls.messageinfoSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
								let counts = this.$store.state.unReadCount;
								if(fData.receiveType == 2) {
									this.$store.commit('changeUnReadCount', counts + 1)
								}

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
				})
			}
		},
		mounted() {

		}
	}
</script>

<style type="text/css" scoped>
	.mainBody>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	
	.mainBody>>>.ivu-switch-checked:after {
		left: 52px!important;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
</style>