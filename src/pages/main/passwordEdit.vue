<template>
	<div class="editMain">
		<div class="editContent">
			<div class="closeWrapper" @click='handleClose'>
				<Icon type="md-close" />
			</div>
			<div>
				<h3 class="instructTitle">修改密码</h3>
				<div style="padding:10px;">
					<div>
						<Form :label-width="90">
							<FormItem label="修改方式" class='star'>
			                  <Select  style="width:240px;" placeholder="请选择修改方式" v-model='passwdType' >
			                      <Option :value='1'>旧密码修改</Option>
			                      <!--<Option :value='2'>验证码修改</Option>-->
			                  </Select>
							</FormItem>
							<FormItem v-if='passwdType==1' label="旧密码" class='star'>
								<Input type="text" style="width:240px;" placeholder="旧密码" v-model='oldPasswd'/>
							</FormItem>	
							<FormItem v-if='passwdType==2' label="验证码" class='star'>
								<Input type="text" style="width:240px;" placeholder="验证码" v-model='passwdCode'/>
							</FormItem>	
							<FormItem label="新密码" class='star'>
								<Input type="text" style="width:240px;" placeholder="新密码" v-model='newPasswd'/>
							</FormItem>	
						</Form>
					</div>
					<div style="font-size: 12px;font-style:italic;color: #EE6515;margin:5px 0;">修改密码后会自动退出登录！</div>
					<div style="text-align: center;">
						
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
	export default{
		name:'passwordEdit',
		data(){
			return{
				newPasswd:'',
				passwdCode:'',
				oldPasswd:'',
				passwdType:1,
				userData: (JSON.parse(this.$store.state.userData)),
			}
		},
		methods:{
			handleEnter() {
				let fData = {
					type: this.passwdType,
					oldPasswd: this.oldPasswd,
					newPasswd:this.newPasswd,
				}
				if(!fData.oldPasswd) {
					this.$Message['warning']({
						background: true,
						content: '请输入旧密码',
					});
					return false;
				}
				if(!fData.newPasswd) {
					this.$Message['warning']({
						background: true,
						content: '请输入新密码',
					});
					return false;
				}
				if(fData.newPasswd.length>24) {
					this.$Message['warning']({
						background: true,
						content: '新密码过长',
					});
					return false;
				}
				_http.http2('post', pathUrls.webResetPwd, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '密码修改成功!',
							onClose: (() => {
								this.$emit('closeEdit',1);

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
				this.$emit('closeEdit',0);
			}
		},
		mounted(){
			
		}
	}
</script>

<style type="text/css" scoped>
	.editMain {
		background: rgba(0, 0, 0, .5);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
	}
	
	.editContent {
		width: 450px;
		min-height: 200px;
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
	
	.editContent>>>.ivu-form-item {
		margin-bottom: 12px;
	}
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
</style>