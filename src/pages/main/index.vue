<template>
	<div class="mainWrapper">
		<div class="layout ">
			<Layout style="background: 0;">
				<Header>
					<Menu mode="horizontal" theme="dark" active-name="1">
						<div class="layout-logo">瓶安用气</div>
						<div class="layout-nav">

							<MenuItem name="1" style='float:right;margin-left: 50px;'>
							<Icon type="layui-icon-auz"></Icon>

							<Dropdown placement="bottom">
								<div class="userWrapper">
									<!--<img :src="userData.avatar" class="userPic">-->
									<Icon type="md-person" size="20" />
									<a href="javascript:void(0)" style="color:#fff;font-weight: 600;margin-left: 4px;">
										{{userData.staffName}}
									</a>
								</div>
								<DropdownMenu slot="list">
									<div @click='handleExit'>
										<DropdownItem>退出</DropdownItem>
									</div>
								</DropdownMenu>
								<DropdownMenu slot="list">
									<div @click='handleEditPassword'>
										<DropdownItem>修改密码</DropdownItem>
									</div>
								</DropdownMenu>
							</Dropdown>
							</MenuItem>

							<MenuItem name="2" style='float:right'>
							<Icon type="layui-icon-auz"></Icon>

							<Dropdown placement="bottom" @on-click='messageClick'>
								<Badge :count="counts">
									<Icon type="ios-notifications-outline" size="20" style='color:#fff;font-weight: 600;'></Icon>
									<a href="#" class="demo-badge" style="color:#fff;font-weight: 600;">消息中心</a>
								</Badge>
								<DropdownMenu slot="list">
									<DropdownItem name='0'>
										<Badge dot :count="counts">未读消息 </Badge>
									</DropdownItem>
									<DropdownItem name='1'>已读消息</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							<div class="point point-flicker" v-if='counts'> </div>
							</MenuItem>
						</div>
					</Menu>
				</Header>
				<Layout style="background: 0;">
					<Sider hide-trigger class='sliderMenu'>

						<Menu theme="dark" width="auto" :active-name='activeName' :open-names="openName" accordion ref='side_menu'>
							<Submenu :name="'a'+item.menuId+'b'" v-for='item in slideMenu' :key="item.menuId">
								<template slot="title">
									<Icon :type="item.icon" /> {{item.name}}
								</template>

								<MenuItem :name="'a'+items.menuId+'b'" :to="items.url" v-for='items in item.children' :key="items.menuId">{{items.name}}</MenuItem>
							</Submenu>
						</Menu>

					</Sider>
					<Layout :style="{padding: '0',background: '0'}">
						<Breadcrumb :style="{margin: '0','textAlign':'left',background:'0'}">
							<BreadcrumbItem style='color:#fff'>{{$store.state.pathName}}</BreadcrumbItem>
						</Breadcrumb>
						<Content :style="{padding: '0', background:'0',overflow:'auto'}" class='mainContent'>
							<!--<router-view></router-view>-->
							<keep-alive :max="1">
								<router-view v-if="$route.meta.keepAlive"></router-view>
							</keep-alive>
							<router-view v-if="!$route.meta.keepAlive"></router-view>
						</Content>
					</Layout>
				</Layout>
			</Layout>
			<passwordEdit v-if='closeEdit' @closeEdit='closeEditMethod'></passwordEdit>
		</div>
	</div>
</template>
<script>
	import passwordEdit  from  "./passwordEdit";
	import _http from '@/public/http';
	import { createSocket, sendWSPush } from '@/public/websocket';
	// sendWSPush(data);
	// 接收消息
	// 在需要的时候卸载监听事件，比如离开页面
	// window.removeEventListener('onmessageWS', getsocketData)
	import { pathUrls } from '@/public/path';
	import { service } from '@/public/http';
	var client;
	export default {
		name: 'commenMain',
		components:{
			passwordEdit
		},
		data() {
			return {
				closeEdit:false,
				urlObj: {},
				counts: 0,
				arrArray: [],
				slideMenu: [{}],
				userData: (JSON.parse(this.$store.state.userData)),
				activeName: 'a894b',
				openName: ['a893b'],
				showIdArr: [],
				
			}
		},
		methods: {
			closeEditMethod(data){
				this.closeEdit=false;
				if(data==1){
					this.getMessageList();
				}
			},
			//修改密码
			handleEditPassword(){
				this.closeEdit=true;
			},
			//websocket连接	
			getsocketData() {
				createSocket('wss://sys.payq-iot.com:8999/callCenter/' + this.userData.staffId);
				const getsocketData = e => { // 创建接收消息函数
					const data = e && e.detail.data
					let newData = JSON.parse(data)
//					console.log(newData)
					if(newData.type == 1) {
						this.$store.commit('changeWaitCount', 0)
						this.$store.commit('changeWaitCount', newData.payload.data.waitCount)
						this.$store.commit('changeCountObject', '{}')
						this.$store.commit('changeCountObject', JSON.stringify(newData.payload.data))
						this.$store.commit('changePhone', '')
						this.$store.commit('changePhone', newData.payload.data.lastPhone)
					}
					if(newData.type == 6) {
						this.$store.commit('changeWaitCount', 0)
						this.$store.commit('changeWaitCount', newData.payload.data.waitCount)
					}
					if(newData.type == 3) {
						this.$store.commit('changeCountObject', '{}')
						this.$store.commit('changeCountObject', JSON.stringify(newData.payload.data))
						this.$store.commit('changePhone', '')

						this.$store.commit('changePhone', newData.payload.data.phone)

						if(this.$route.path != '/customerServiceCenter/callCenter') {
							this.$Notice.info({
								title: '来电提醒',
								desc: '',
								duration: 3,
								render: h => {
									return h('span', {
										style: {
											fontSize: '16px'
										},
									}, [
										h('span', [
											h('span', {
												style: {
													color: "#00f", //根据选中状态设置样式

												}
											}, this.$store.state.phone, ),
											h('span', ' 来电，三秒后跳转到呼叫中心！'),

										]),

									])
								},
								onClose: () => {
									this.$router.push('/customerServiceCenter/callCenter')
								}
							});
						} else {
							this.$Notice.info({
								title: '来电提醒',
								desc: '',
								duration: 3,
								render: h => {
									return h('span', {
										style: {
											fontSize: '16px'
										},
									}, [
										h('span', [
											h('span', {
												style: {
													color: "#00f", //根据选中状态设置样式

												}
											}, this.$store.state.phone, ),
											h('span', ' 来电!'),

										]),

									])
								},
							});
						}
					};
					if(newData.type == 5) {
						this.$Notice.info({
							title: '拨叫提醒',
							desc: '',
							duration: 5,
							render: h => {
								return h('span', {
									style: {
										fontSize: '16px'
									},
								}, [
									h('span', [
										h('span', {
											style: {
												color: "#09a31e", //根据选中状态设置样式

											}
										}, newData.payload.data.phone + ' ', ),
										h('span', newData.payload.data.msg),

									]),

								])
							},
						});
					}

				}
				// 注册监听事件
				window.addEventListener('onmessageWS', getsocketData);
			},
			//mqtt连接 
			mqttMethods() {
				// 连接选项
				const options = {
					connectTimeout: 4000, // 超时时间
					// 认证信息
					clientId: 'payq_web_' + this.userData.userId,
					username: 'payq_' + this.userData.userId,
					password: '123456',
					reconnectPeriod: 10000,
					keepalive: 100
				}
				client = mqtt.connect('ws:server.payq-iot.com:8081/mqtt', options)
				client.on('connect', (e) => {
					console.log('成功连接服务器')

					// 订阅一个主题
					client.subscribe('payq_web', {
						qos: 1
					}, (error) => {
						if(!error) {
							console.log('订阅成功')
							// 发布消息
							// client.publish('payq_web', 'Hello EMQ', { qos: 1, rein: false }, (error) => {
							//     cosnole.log(error || '发布成功')
							// })
						}
					})
				})

				if(!client.connected) {
					console.log('客户端未连接')
				}
				client.on('reconnect', (error) => {
					console.log('正在重连:', error)

				})
				//接收消息
				client.on('message', (topic, message) => {
					//		 	console.log('in message');
					if(topic === 'payq_web') {
						let messageArr = JSON.parse(message.toString());
						//DOSOMETHING
					}
				})
				client.on('error', (error) => {
					console.log('连接失败:', error)
				})
				//连接断开
				//		client.end();
			},
			//获取消息列表
			getMessageList() {
				_http.http1("post", pathUrls.messageinfoList, {
					page: 1,
					limit: 100000,
					messageIsRead: 0
				}, 'form').then((res) => {
					if(res.code == 0) {
						this.counts = res.count;
						this.$store.commit('changeUnReadCount', res.count)
					}
				})
			},
			//前往消息中心
			messageClick(v) {
				this.$router.push(`/messageCenter/${v}`)
			},
			//退出登录 
			handleExit() {
				sessionStorage.clear();
				//				client.end();
				this.$router.push('/login');
				window.location.reload()
				//				window.location.href='/';
			},
			//递归获取菜单数据
			getNewMenu(menus) {
				return menus.map((menu) => {
					if(menu.children) {
						this.getNewMenu(menu.children);
					}
					menu.newUrl = '';
					menu.icons = '';
					if(menu.type == 1) {
						this.urlObj[menu.url] = ['a' + menu.parentId + 'b', 'a' + menu.menuId + 'b']
						
					}
					return menu;
				})
			},

		},
		created() {
			this.getMessageList();
			this.slideMenu = JSON.parse(this.$store.state.menuData);
			this.slideMenu = this.getNewMenu(this.slideMenu);
			this.showIdArr = JSON.parse(this.$store.state.menuArray);
			this.arrArray = [];
			let mapUserInfo = [];
			for(let item of this.showIdArr) {
				if(item.perms == 'home-carMap' || item.menuId == '980') {
					this.arrArray.push('车辆')
				}
				if(item.perms == 'home-cylinder' || item.menuId == '981') {
					this.arrArray.push('占用瓶')
				}
				if(item.perms == 'home-user' || item.menuId == '982') {
					this.arrArray.push('用户')
				}
				if(item.perms == 'home-person' || item.menuId == '983') {
					this.arrArray.push('员工')
				}
				if(item.perms == 'home-station' || item.menuId == '984') {
					this.arrArray.push('场站')
				}
				if(item.perms == 'personnelMap-personInfo' || item.perms == 'userMap-userInfo') {
					mapUserInfo.push(item.perms)
				}
			}
			this.$store.commit('changeHomeMenu', JSON.stringify(this.arrArray))
			this.$store.commit('changeMapUserInfo', JSON.stringify(mapUserInfo))
			this.urlObj['/cylinderManage/cylinder'] = this.urlObj['/cylinderManage/newCylinder'];
			
			
			const _url = this.urlObj,
				{
					path
				} = this.$route;
			if(_url[path]) {
				this.activeName = _url[path][1];
				this.openName = [_url[path][0]];
			}
		},
		watch: {
			"$store.state.unReadCount": {
				handler(newItems, oldItems) {
					this.counts = newItems;
				},
				deep: true,
				immediate: true
			},
			$route(newRoute) {
				const _url = this.urlObj;
				if(newRoute.path == '/performanceStatistics/order' || newRoute.path == '/dataScreen' ||
					newRoute.path == '/performanceStatistics/distribute' || newRoute.path == '/performanceStatistics/check') {
					this.path = newRoute.path;
					this.activeName = _url[this.path][1];
					this.openName = _url[this.path][0];

				}
				if(newRoute.path.indexOf('/securityRecord/checkInfo') != -1) {
					this.activeName = _url['/householdCheck/securityRecord'][1];
					this.openName = _url['/householdCheck/securityRecord'][0];
				}
				if(newRoute.path.indexOf('/merchandiseOrder/orderInfo') != -1) {
					this.activeName = _url['/orderManage/merchandiseOrder'][1];
					this.openName = _url['/orderManage/merchandiseOrder'][0];
				}
				if(newRoute.path.indexOf('/customerInfo/seeAccount') != -1) {
					this.activeName = _url['/clientManage/customerInfo'][1];
					this.openName = _url['/clientManage/customerInfo'][0];
				}
				if(newRoute.path.indexOf('/mobilePerson/editPerson') != -1) {
					this.activeName = _url['/mobilePersonManage/mobilePerson'][1];
					this.openName = _url['/mobilePersonManage/mobilePerson'][0];
				}
				this.path = newRoute.path;
				if(_url[this.path]) {
					this.activeName = _url[this.path][1];
					this.openName = _url[this.path][0];
				}
				this.$nextTick(() => {
					this.$refs.side_menu.updateOpened();
					this.$refs.side_menu.updateActiveName();
				})
			}
		},
		mounted() {
			if(this.userData.staffId) {
				this.getsocketData()
			}
			// this.mqttMethods();
		}
	}
</script>
<style scoped>
	.mainWrapper {
		width: 100%;
		height: 100%;
	}
	
	.mainWrapper>>>.layout {
		background: -webkit-radial-gradient(10% 0, farthest-side ellipse, #2b6e80 20%, #0c3252);
		background: linear-gradient(to bottom, #2b6e80 0%, #2b6e80 0%, #0c3252 100%, #0c3252 100%);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#2b6e80', endColorstr='#0c3252', GradientType=0);
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		top: 0;
	}
	
	.layout {
		/*border: 1px solid #d7dde4;*/
		/*background: #f00;*/
		position: relative;
		/* border-radius: 4px; */
		overflow: hidden;
	}
	
	.layout-logo {
		width: auto;
		height: auto;
		border-radius: 3px;
		float: left;
		position: relative;
		top: 0px;
		left: 20px;
		color: #fff;
		font-size: 18px;
	}
	
	.layout-nav {
		width: 420px;
		margin: 0 auto;
		margin-right: 20px;
	}
	
	.ivu-layout-header {
		background: 0;
		height: 44px;
		line-height: 44px;
	}
	
	.userWrapper {
		display: flex;
		align-items: center;
	}
	
	.userPic {
		width: 30px;
		height: 30px;
		border-radius: 15px;
		margin-right: 5px;
	}
	
	.mainContent {
		height: calc(100vh - 65px);
		/*background: #fff;*/
	}
	
	.mainWrapper>>>.ivu-menu-dark {
		background: 0
	}
	
	.mainWrapper>>>.ivu-layout-sider {
		background: 0;
		margin-top: 5px;
	}
	
	.sliderMenu>>>.ivu-icon-ios-arrow-down:before {
		/*content: "" !important;*/
	}
	
	.mainWrapper>>>.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
		background: #266375;
	}
	
	.mainWrapper>>>.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active {
		background: #266375 !important;
	}
	
	.mainWrapper>>>.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
		background: 0;
	}
	
	.mainWrapper>>>.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
		background: rgba(0, 0, 0, 0.07);
	}
	
	.mainWrapper>>>.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
		color: #fff;
	}
	
	.mainWrapper>>>a.ivu-menu-item {
		padding: 6px 12px 6px 30px;
	}
	
	.mainWrapper>>>.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
		background: rgba(0, 0, 0, 0.07);
	}
	
	.mainWrapper>>>.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover {
		background: rgba(0, 0, 0, 0.07);
	}
	
	.mainWrapper>>>.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover {
		background: rgba(0, 0, 0, 0.07);
	}
	
	.mainWrapper>>>.ivu-breadcrumb>span {
		color: #fff;
	}
	
	.mainWrapper>>>::-webkit-scrollbar {
		width: 0px;
		background-color: #909399;
	}
	/* 滚动槽 */
	
	.mainWrapper>>>::-webkit-scrollbar-track {
		border-radius: 4px;
	}
	
	.mainWrapper>>>::-webkit-scrollbar-thumb {
		background-color: #909399;
	}
	/*sliderMenu ivu-layout-sider*/
	
	.sliderMenu {
		background: 0;
		height: calc(100vh - 65px);
		overflow-y: auto;
		scrollbar-color: transparent transparent;
		scrollbar-arrow-color: #296B7E;
		/* 设置滚动条上的箭头颜色  */
		scrollbar-base-color: #296B7E;
		/* 设置滚动条的底色 */
		scrollbar-track-color: #51B5EA;
		/* 设置滚动条块的背景色 */
		scrollbar-shadow-color: #296B7E;
		/* 设置箭头和滚动条右侧和底边的颜色 */
	}
	
	.mainWrapper>>>.ivu-layout {
		padding: 0;
	}
	
	.mainContent>>>::-webkit-scrollbar {
		width: 17px;
		background-color: #296B7E;
		/*height: 17px;*/
	}
	
	.mainContent>>>::-webkit-scrollbar-track {
		border-radius: 4px;
	}
	
	.mainContent>>>::-webkit-scrollbar-thumb {
		background-color: #51B5EA;
		/*height: 20px;*/
	}
	/*.sliderMenu>>>.ivu-menu-vertical .ivu-menu-submenu-title{*/
	/*padding: 10px 30px 10px 24px;}*/
	
	.mainWrapper>>>.ivu-badge-count {
		/*background:rgb(255, 0, 0,.4);*/
		top: 8px;
		right: -10px;
	}
	
	.point {
		width: 16px;
		height: 16px;
		background-color: #f00;
		position: absolute;
		right: -35px;
		top: 24px;
		border-radius: 50%;
	}
	/* 设置动画前颜色 */
	
	.point-flicker:after {
		background-color: #f00;
	}
	/* 设置动画后颜色 */
	
	.point-flicker:before {
		background-color: rgba(0, 168, 253, 0.2);
	}
	/* 设置动画 */
	
	.point-flicker:before,
	.point-flicker:after {
		content: '';
		width: 28px;
		height: 28px;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -14px;
		margin-top: -14px;
		border-radius: 50%;
		/* CSS3 animation 属性 网址 */
		/* https://www.w3school.com.cn/cssref/pr_animation.asp */
		animation: warn 1.5s ease-out 0s infinite;
	}
	/* @keyframes 规则用于创建动画。在 @keyframes 中规定某项 CSS 样式，就能创建由当前样式逐渐改为新样式的动画效果。 */
	
	@keyframes warn {
		0% {
			transform: scale(0.5);
			opacity: 1;
		}
		30% {
			opacity: 1;
		}
		100% {
			transform: scale(1.2);
			opacity: 0;
		}
	}
</style>