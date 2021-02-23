<template>
	<div class="main">
		<div class='mainTop'>新增</div>
		<div class="mainContent">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="180">
				<FormItem label="客户类型" class='userType star'>
					<Select v-model="typeForm.userType" style="width: 300px;" placeholder="请选择客户类型" @on-change='userTypeChange'>
						<!--<Option value="居民用户" key="1">居民用户</Option>
						<Option value="小微商户" key="2">小微商户</Option>
						<Option value="商业用户" key="3">商业用户</Option>
						<Option value="工业用户" key="4">工业用户</Option>-->
						<Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="名单类型" class='listType'>
					<Select v-model="typeForm.listType" style="width: 300px;" placeholder="请选择名单类型" @on-change='listTypeChange' clearable>
						<Option :value="1" key="1">白名单</Option>
						<!--<Option :value="2" key="2">黑名单</Option>-->
					</Select>

				</FormItem>

				<FormItem label="安检周期(天)" class='secCircle star'>
					<Input v-model="typeForm.secCircle" type="number" />
				</FormItem>
				<!--<FormItem label="每单必检" class='stars'>
					<i-switch v-model="typeForm.maskCheck" size="large" false-color="#ff4949" :true-value='1' :false-value='0'>
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>-->
				<FormItem>
					<Button type="success" @click='addrulesUser'>用户</Button>
					<Button type="primary" @click='addrulesFuc'>确定</Button>
					<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
				</FormItem>
			</Form>
		</div>
		<div class='userInfoWrapper' v-if='transShow'>
			<div class="userInfoContent">
				<Transfer :titles='titles' :data="datas" :target-keys="targetKeys" :list-style="listStyle" :render-format="renders" filterable @on-change="handleChange">
				</Transfer>
				<div class="bottomBtn">
					<Button type="primary" @click='enterFuc'>确定</Button>
					<Button style="margin-left: 8px" @click='backClick'>返回</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'addRules',
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				userTypeList: [],
				transShow: false,
				typeForm: {
					listType: null,
					userType: '',
					secCircle: '',
					maskCheck: 1
				},
				datas: [],
				targetKeys: [],
				listStyle: {
					width: '260px',
					height: '350px',
					marginBottom: '10px'
				},
				titles: ['标准', '黑名单']
			}
		},
		methods: {
			//改变用户类型
			userTypeChange(v) {
				//				console.log(v)
			},
			//改变名单类型
			listTypeChange(v) {
				//				console.log(v)
			},

			//获取用户接口
			getUserListType() {
				this.datas = []
				_http.http3('get', pathUrls.userListType, {
					listType: this.typeForm.listType,
					userType: this.typeForm.userType

				}, 'form').then((res) => {
					//					console.log(res.data.standardList)
					for(let item of res.data.standardList) {
						this.datas.push({
							key: item.userId,
							label: item.userRealName
						})
					}
				}).catch((res) => {

				})
			},
			handleChange(newTargetKeys) {
				this.targetKeys = newTargetKeys;
				//				console.log(this.targetKeys)
			},
			renders(item) {
				return item.label
			},
			//点击添加	
			addrulesFuc() {
				let fData = {
					listType: this.typeForm.listType, //名单类型
					userType: this.typeForm.userType, //用户类型
					checkPeriod: this.typeForm.secCircle, //安检周期
					userIds: this.targetKeys.length ? this.targetKeys : null //用户数组
				}
				if(fData.userType == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择客户类型!',
						duration: 0.7
					});
					return false
				}
				//				if(fData.listType == '') {
				//					this.$Message['warning']({
				//						background: true,
				//						content: '请选择名单类型!',
				//						duration: 0.7
				//					});
				//					return false
				//				}

				if(fData.checkPeriod == 0) {
					this.$Message['warning']({
						background: true,
						content: '请填写安检周期!',
						duration: 0.7
					});
					return false
				}
				if(fData.checkPeriod < 0) {
					this.$Message['warning']({
						background: true,
						content: '安检周期不能为负数!',
						duration: 0.7
					});
					return false
				}
				if(fData.checkPeriod > 365) {
					this.$Message['warning']({
						background: true,
						content: '安检周期不能超过365天!',
						duration: 0.7
					});
					return false
				}
				_http.http2('post', pathUrls.ruleSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
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
				})
			},
			//返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//点击弹出用户弹框
			addrulesUser() {
				if(this.typeForm.listType == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择名单类型!',
						duration: 0.7
					});
					return false
				}
				if(this.typeForm.userType == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择客户类型!',
						duration: 0.7
					});
					return false
				}
				if(this.typeForm.secCircle == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写安检周期!',
						duration: 0.7
					});
					return false
				}
				let newType = this.typeForm.listType == 1 ? '白名单' : '黑名单'
				this.titles = ['标准', newType]
				this.getUserListType()
				this.transShow = true

			},
			//勾选用户后确定
			enterFuc() {
				this.transShow = false
			},
			//弹框消失
			backClick() {
				this.transShow = false
			},
		},
		mounted() {
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.userTypeList = res.data;
			})
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		overflow: hidden;
		padding-right: 10px;
	}
	
	.mainTop {
		background: #fff;
		height: 44px;
		line-height: 44px;
		text-align: left;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
		margin-bottom: 10px;
	}
	
	.mainContent {
		background: #fff;
		/*height: 500px;*/
		border-radius: 4px;
		text-align: left;
		padding: 30px 20px 20px 0;
		height: calc(100vh - 130px);
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
	
	.mainContent>>>.ivu-input {
		width: 300px;
	}
	
	.mainContent button {
		margin: 0 15px;
	}
	
	.userInfoWrapper {
		position: absolute;
		left: 200px;
		top: 65px;
		z-index: 100;
		background: rgba(0, 0, 0, .3);
		/*width:calc( 100% - 210px);*/
		width: 100%;
		height: 100%;
	}
	
	.userInfoContent {
		width: 650px;
		height: 425px;
		background: #fff;
		position: absolute;
		left: 50%;
		margin-left: -470px;
		margin-top: -350px;
		top: 50%;
		padding-top: 20px;
		border-radius: 4px;
	}
	
	.userInfoContent>>>.ivu-transfer-list-header {
		background: #E2EEFF;
		color: #51B5EA;
		font-weight: 600;
	}
	
	.bottomBtn {
		/*margin-top: 0px;*/
	}
	
	.bottomBtn button {
		height: 30px;
	}
	
	.userInfoContent>>>.ivu-input-icon {
		color: #51B5EA;
	}
	
	.userInfoContent>>>.ivu-transfer-list-content-item {
		text-align: left;
	}
	
	.userInfoContent>>>.demo-spin-icon-load {
		animation: ani-demo-spin 1s linear infinite;
	}
	
	.userInfoContent>>>.ivu-switch-inner {
		left: 34px;
	}
</style>