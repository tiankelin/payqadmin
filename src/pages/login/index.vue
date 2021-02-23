<template>
	<div class="loginBox">
		<div class='formWrapper'>
			<div class="loginTitle">瓶装燃气智慧管理系统</div>
			<Form>
				<div>
					<Input prefix="ios-contact" placeholder="请输入用户名" style="width: 280px" v-model='user' />
				</div>
				<div style="margin-top: 20px">
					<Input placeholder="请输入密码" style="width: 280px" type="password" v-model="passWord" password @keyup.enter.native="loginClick">
					<Icon type="md-lock" slot="prefix" />
					</Input>
				</div>
			</Form>
			<div class="btnBox">
				<Button @click="loginClick" class='loginBtn' :disabled="isDisabled">登录</Button>
			</div>
			<div class='loginFoot'><span class='logoFoot'></span><span> ©2019-2021瓶安用气（杭州）物联网科技有限公司</span></div>
			<div class='errorInfo' v-text='errInfo'></div>
		</div>
    <div class="qrCode"><div class="send"></div><div class="bind"></div></div>
    <a class="footInfo" target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index">浙ICP备19050877号</a>
	</div>

</template>

<script>
	import _http from '@/public/http'
	import { pathUrls } from '@/public/path'
	export default {
		name: 'login',
		data() {
			return {
				user: '',
				passWord: '',
				errInfo: '',
				isDisabled: false,
				urlArray:[]
			}
		},
		methods: {
			loginClick() {
				this.$store.commit('changeCylInfo', {})
				let reg = "^[ ]+$";
				let re = new RegExp(reg)
				let that = this;
				if(this.user == '' || re.test(this.user)) {
					this.errInfo = '请输入用户名!'
					setTimeout(() => {
						that.errInfo = ''
					}, 1500)
					return false
				}
				if(this.passWord == '' || re.test(this.passWord)) {
					this.errInfo = '请输入密码!'
					setTimeout(() => {
						that.errInfo = ''
					}, 1500)
					return false
				}

				this.isDisabled = true;
				_http.http1('post', pathUrls.login, {
					username: this.user,
					password: this.passWord
				}, 'form').then((res) => {
					//					console.log(res.token);
					if(res.code == 0) {
						this.$store.commit('changeToken', res.token);
						_http.http1('post', pathUrls.convert + '/1', {}, 'form').then((res) => {
							if(res.code == 0) {
								this.$store.commit('changeAllCount', 0)
								this.isDisabled = true;
								this.$store.commit('changeMenu', JSON.stringify(res.data.modules[0].children));
								this.$store.commit('changeMenuId', JSON.stringify(res.data.buttonMenus));
								res.data.staff.deptId=res.data.staff.staffDeptId;
								res.data.staff.lng=res.data.staff.lon;
								this.$store.commit('changeUserData', JSON.stringify(res.data.staff));
								for(let item of res.data.modules[0].children){
									for(let items of item.children){
										this.urlArray.push(items.url)
									}
								}
								this.$store.commit('changeUrlArray',this.urlArray);
								this.$Message['success']({
									background: true,
									content: '	登录成功',
									duration:0.5,
									onClose: (() => {
										let pathUrl = '';
										if(res.data.modules) {
											if(res.data.modules[0].children.length) {
												if(res.data.modules[0].children[0].children){
													pathUrl = res.data.modules[0].children[0].children[0].url;
												}

											}
										}

										if(!pathUrl) {
											pathUrl = '/unfinishedPage'
										}
										this.$router.push(pathUrl);
										this.$store.commit('changeHasStaff', 2);
									})
								});

							} else {
								this.isDisabled = false;
							}
						}).catch((err) => {
							this.isDisabled = false;
						})

					} else {
						this.isDisabled = false;
						this.errInfo = res.msg + '!'
						setTimeout(() => {
							that.errInfo = ''
						}, 1500)
					}
				}).catch((err) => {
					this.isDisabled = false;
				})

			},
			getTitle(menus) {

				return menus.map((menu) => {
					if(menu.children.length > 0) {
						this.getTitle(menu.children);
					}
					menu.title = menu.name;
					return menu;
				})
			},
		},
		mounted() {

		}
	}
</script>
<style scoped>
	.loginBox {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: -webkit-radial-gradient(10% 0, farthest-side ellipse, #2b6e80 20%, #0c3252);
		/*background: -webkit-moz-linea: ;
		-moz-moz-linea: ;
		-ms-moz-linea: ;
		-o-moz-linea: ;
		moz-linea: ;r-gradient(top, #feccb1 0%, #f17432 0%, #ea5507 100%, #fb955e 100%);*/
		/* FF3.6-15 */
		/*background: -webkit-linear-gradient(top, #feccb1 0%, #f17432 0%, #ea5507 100%, #fb955e 100%);*/
		/* Chrome10-25,Safari5.1-6 */
		background: linear-gradient(to bottom, #2b6e80 0%, #2b6e80 0%, #0c3252 100%, #0c3252 100%);
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#2b6e80', endColorstr='#0c3252', GradientType=0)
	}

	.formWrapper {
		width: 365px;
		height: 385px;
		background: #fff;
		/*#FD9733*/
		/*box-shadow: 20px 15px 10px 0px rgba(0, 0, 0, 0.5);*/
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -182px;
		margin-top: -200px;
		/*padding: 12px 17px 0px;*/
		padding-top: 12px;
		border-radius: 3px;
	}

	.loginTitle {
		text-align: center;
		font-weight: 500;
		/*margin-bottom: 20px;*/
		font-size: 14px;
		margin: 15px 0 25px 0;
	}

	.formWrapper>>>.ivu-input {
		margin-bottom: 18px;
		height: 40px;
	}

	.formWrapper>>>.ivu-input-prefix i,
	.formWrapper>>>.ivu-input-suffix i {
		line-height: 40px;
	}

	.btnBox {
		height: 100px;
		background: #D7DDE4;
		margin-top: 18px;
		width: 100%;
	}

	.loginBtn {
		height: 40px;
		width: 340px;
		/*margin-top: 60px;*/
		background: #f53811;
		border: 0;
		border-radius: 6px;
		color: #fff;
		font-weight: 600;
		font-size: 18px;
		margin-top: 20px;
	}

	.loginBtn:hover {
		cursor: pointer;
		background: #f53811;
		color: #fff;
	}

	.loginBtn:focus {
		outline: 0!important;
	}

	.loginFoot {
		text-align: center;
		/*margin-top: 160px;*/
		color: #fff;
		background: #3a87c5;
		height: 58px;
		line-height: 58px;
	}
  .loginFoot span{
    display: inline-block;
    margin-left: 2px;
  }
	.logoFoot {
		display: inline-block;
		background: url('~@/static/logo.png') no-repeat left 2px;
		background-size: 14px 14px;
		width: 14px;
		height: 14px;
		padding-top: 4px;
		margin-right: 2px;
	}

	.formWrapper .ivu-input-prefix {
		background: #08111F;
	}

	.errorInfo {
		color: #f00;
		position: absolute;
		left: 42px;
		bottom: 165px;
		font-family: "微软雅黑";
	}
  .qrCode{
    position: absolute;
    right: 20px;
    bottom: 10px;
    display: flex;
  }
  .qrCode div{
    width: 120px;
    height: 120px;
    /* background: #0095FF; */
    margin:20px;

  }
  .send{
    background:url('../../assets/images/send.png') no-repeat center;
    background-size: 100% 100%;
  }
  .bind{
    background:url('../../assets/images/bind.png') no-repeat center;
    background-size: 100% 100%;
  }
  .footInfo{
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 10px;
    text-align: center;
    color:rgba(255, 255, 255, 0.38);
    cursor: pointer;
  }
</style>
