<template>
	<div class="main conMain">
		<div class="mainTop">
			<Button type="success" @click='vipUserAdd' style="margin-right: 60px;" v-has='1033'>新增</Button>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="tableData" :loading="loading" :height='tableHeight' highlight-row>
				<template slot-scope="{ row, index }" slot="action">
					<Button type="primary" size="small" style="margin-right: 10px;" @click='setRules(row.userId,row.userRealName)' v-has='1034'>配置</Button>
					<Button type="error" size="small" @click='vipUserDelete(row.userId)' v-has='1035'>删除</Button>
				</template>
			</Table>
		</div>
		<div class="checkUserMain" v-if='showUserCheck'>
			<div class='checkUserContent'>
				<div class="contentTitle">添加Vip用户</div>
				<div class="contentInfo">
					<!--<Select v-model="userName" style="width:230px" placeholder='请选择用户' filterable>
						<Option v-for="item in userList" :value="item.userId" :key="item.userId">{{ item.userRealName }}</Option>
					</Select>-->
					<Select @blur='selectBlur' :loading="loading1" v-model="userName" style="width:230px" placeholder='请选择用户' filterable remote :remote-method="remoteMethod" v-loadmore="loadMore">
						<Option v-for="item in userList" :value="item.userId" :key="item.userId" :label="item.userRealName">
						</Option>
					</Select>

					<div class="btnWrapper">
						<Button type="primary" @click='vipAddClick'>确定</Button>
						<Button @click="handleBackClick">返回</Button>
					</div>
				</div>

			</div>

		</div>
		<Spin size="large" class='spinShow' v-if="spinShow"></Spin>
		<div v-if="endShow" class='endShow'>用户已全部加载!</div>
		<vipIndex v-if='rulesShow' @rulesShow='rulesShowMethods' :vipUserName='vipUserName' :vipUserId='vipUserId'></vipIndex>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import vipIndex from './vipIndex';
	import { Select, Option } from 'element-ui';
	import directives from '@/public/directives';
	export default {
		name: 'vipUser',
		components: {
			vipIndex,
			Select,
			Option
		},
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				conKey: 0,
				keyName: null,
				copyList: [],
				loading1: false,
				endShow: false,
				spinShow: false,
				isLoad: true,
				curpage: 1,
				pageSize: 20,
				vipUserId: null,
				vipUserName: '',
				rulesShow: false,
				userName: null,
				showUserCheck: false,
				userList: [],
				loading: false,
				tableData: [],
				columns: [{
					title: '序号',
					type: 'index',
					width: 100,
					align: 'center',
					fixed:'left'
				},{
					title: '客户名称',
					key: 'userName',
					minWidth: 250,
					align: 'center',
				},{
					title: '联系人',
					key: 'userRealName',
					minWidth: 140,
					align: 'center',
				}, {
					title: '户号',
					key: 'userAccountNumbers',
					minWidth: 160,
					align: 'center',
				}, {
					title: '身份证号码',
					key: 'userIdCardNumber',
					minWidth: 200,
					align: 'center',
				}, {
					title: '联系方式',
					key: 'userPhoneNumber',
					minWidth: 160,
					align: 'center',
				}, {
					title: '地址',
					key: 'userAddress',
					minWidth: 300,
					align: 'center',
					tooltip: true
				},   {
					title: '创建时间',
					key: 'userCreateTime',
					minWidth: 180,
					align: 'center',
				}, {
					title: '操作',
					slot: 'action',
					fixed: 'right',
					width: 200,
					align: 'center'
				}]
			}
		},
		methods: {
			selectBlur() {
				this.conKey = 0;
				this.userList = this.copyList;
			},
			remoteMethod(query) {
				this.keyName = query;
				this.conKey = 0;
				if(query.trim() !== '') {
					this.loading1 = true;
					//					let asa = [];
					//					setTimeout(() => {
					//						this.userList = this.userList.filter(item => {
					//							if(item.userRealName.indexOf(query) > -1) {
					//								this.loading1 = false;
					//								asa.push(item);
					//							}
					//							return item.userRealName.indexOf(query) > -1;
					//						});
					//						if(asa.length == 0) {
					this.curpage = 1;
					_http.http1('post', pathUrls.userGasUserlist, {
						'page': this.curpage,
						"limit": 100,
						'userIdentity': 1,
						'userName': query
					}, 'form').then((res) => {
						this.conKey = 1;
						this.loading1 = false;
						this.userList = res.data;
					})
					//						}
					//					}, 200);

				} else {
					this.userList = this.copyList;
				}
			},
			loadMore() {
				if(this.conKey == 0) {
					if(this.isLoad) {
						this.curpage++;
						this.getUserList();
					} else {
						this.endShow = true;
						setTimeout(() => {
							this.endShow = false;
						}, 1000)
					}
				}

			},
			rulesShowMethods(data) {
				this.rulesShow = data;
			},
			//配置
			setRules(id, name) {
				this.vipUserId = id;
				this.vipUserName = name;
				this.rulesShow = true;
			},
			//删除
			vipUserDelete(id) {
				let fData = {
					userId: id,
					checkListType: 0
				}
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						this.updateUserVipInfo(-1, fData, '删除成功!');
					},

				});

			},
			//添加删除封装
			updateUserVipInfo(types, fData, contents) {
				_http.http3('get', pathUrls.updateUserVipInfo, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: contents,
							onClose: (() => {
								if(types == 1) {
									this.showUserCheck = false;
								}
								this.getVipUserList();
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
			//确定
			vipAddClick() {
				let fData = {
					userId: this.userName,
					checkListType: 1
				}
				if(!this.userName) {
					this.$Message['warning']({
						background: true,
						content: '请选择用户!',
					});
					return false
				}
				this.updateUserVipInfo(1, fData, '添加成功!')
			},
			//返回
			handleBackClick() {
				this.showUserCheck = false;
			},
			//新增vip
			vipUserAdd() {
				this.showUserCheck = true;
			},
			//获取vip用户列表
			getVipUserList() {
				this.loading = true;
				_http.http1('post', pathUrls.getVipUserList, {
					'checkListType': 1
				}, 'form').then((res) => {
					this.loading = false;
					this.tableData = res.data;
					if(this.tableData.length > 10) {
             this.tableHeight=this.screeHeight-200;
						} else {
						this.tableHeight ='auto';

					}
				})
			},
			//获取客户信息列表
			getUserList() {
				this.isLoad = true;
				if(this.curpage != 1) {
					this.spinShow = true;
				}

				_http.http1('post', pathUrls.userGasUserlist, {
					'page': this.curpage,
					"limit": this.pageSize,
					'userIdentity': 1,
					//					'userName':this.keyName

				}, 'form').then((res) => {
					this.spinShow = false;

					if(res.data.length) {
						for(let item of res.data) {
							this.userList.push({
								userId: item.userId,
								userRealName: item.userRealName
							})
						}
						let hash = {}; 
						this.userList = this.userList.reduce((preVal, curVal) => {   
							hash[curVal.userId] ? '' : hash[curVal.userId] = true && preVal.push(curVal);    
							return preVal 
						}, [])
						this.copyList = this.userList;
						if(res.data.length < 20) {
							this.isLoad = false;
						}
					} else {
						this.isLoad = false;
					}
				})
			}
		},
		mounted() {
			this.getVipUserList();
			this.getUserList()
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		min-height: calc(100% - 10px);
		background: #fff;
	}

	.mainTop {
		background: #fff;
		height: 48px;
		line-height: 48px;
		text-align: right;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
	}

	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 5px 10px 20px;
	}

	.mainContent>>>td {
		height: 40px;
	}

	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}

	.checkUserMain {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		/*background: rgba(0, 0, 0, .2);*/
		background-color: rgba(55, 55, 55, .6);
		z-index: 1000;
	}

	.checkUserContent {
		background: #fff;
		width: 280px;
		height: 220px;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -140px;
		margin-top: -110px;
	}

	.contentTitle {
		text-align: center;
		line-height: 40px;
		height: 40px;
		color: #fff;
		background: #2b85e4;
	}

	.contentInfo {
		text-align: left;
		padding: 25px;
	}

	.btnWrapper {
		text-align: center;
		margin-top: 70px;
	}

	.btnWrapper button {
		height: 28px;
		margin: 0 10px;
	}

	.checkUserMain>>>.el-select,
	.checkUserMain>>>.el-input.is-focus,
	.checkUserMain>>>.el-input__inner {
		height: 32px;
		line-height: 32px;
	}

	.checkUserMain>>>.el-input__icon {
		line-height: 32px;
	}

	.endShow {
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -115px;
		margin-top: 184px;
		width: 230px;
		height: 34px;
		background: #fff;
		z-index: 3000;
		line-height: 34px;
		font-size: 12px;
		text-align: left;
		padding-left: 22px;
		color: #E6A23C;
	}

	.spinShow {
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		padding-left: 100px;
		text-align: center;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -115px;
		margin-top: 184px;
		width: 230px;
		height: 34px;
		background: #fff;
		z-index: 3000;
	}
</style>
