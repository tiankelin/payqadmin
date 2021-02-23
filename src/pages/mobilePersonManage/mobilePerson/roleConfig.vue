<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>分配角色 ——</span>
			<span style="color: rgb(22, 194, 19);font-weight: 600;">{{$route.params.staffName}}</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<div style="margin-left: 20px;display: flex;overflow: hidden;height: 100%;">
				<div>
					<Transfer :data="allPositionList" :target-keys="targetKeys" @on-change="handleChange" :titles='titles' :list-style="listStyle"></Transfer>
				</div>

				<div style=" width:calc( 100% - 565px );height:100%;overflow-y:auto;margin-left: 10px;border-radius: 6px;">
					<div style="padding-left: 20px;">
						<i-switch v-model="switchType" size="large" false-color="#ff4949" @on-change='switchChange'>
							<span slot="open">功能权限</span>
							<span slot="close">数据权限</span>
						</i-switch>
					</div>
					<div style="position: relative;width: 100%;display: flex;" v-if='switchType'>
						<div style="width: 34%;" v-if='webData.length'>
							<el-tree check-strictly :default-checked-keys='webCheckedKey' :default-expanded-keys="['0']" :data="webData" show-checkbox node-key="id" ref="webTree" highlight-current :props="defaultProps">
							</el-tree>
						</div>

						<div style="width: 32%;" v-if='sendData.length'>
							<el-tree check-strictly :default-checked-keys='sendCheckedKey' :default-expanded-keys="['1']" :data="sendData" show-checkbox node-key="id" ref="sendTree" highlight-current :props="defaultProps">
							</el-tree>
						</div>
						<div style="width: 30%;" v-if='bindData.length'>

							<el-tree check-strictly :default-checked-keys='bindCheckedKey' :default-expanded-keys="['2']" :data="bindData" show-checkbox node-key="id" ref="bindTree" highlight-current :props="defaultProps">
							</el-tree>
						</div>
						<Spin fix v-if='loading'></Spin>
					</div>
					<div v-else style="position: relative;width: 100%;">
						<div style="height: 30px;line-height: 30px;">
							<RadioGroup v-model="dataScope">
								<Radio :label="0" disabled>默认设置</Radio>
								<Radio :label="1" disabled>本组织</Radio>
								<Radio :label="2" disabled>本组织及下级组织</Radio>
								<Radio :label="3" disabled>自定义</Radio>
							</RadioGroup>
						</div>
						<div v-if='dataScope==3'>
							<el-tree check-strictly :default-checked-keys='deptWebCheckedKey' :default-expanded-keys="[userData.staffDeptId]" :data="deptWebData" show-checkbox node-key="id" ref="deptWebTree" highlight-current :props="defaultProps">
							</el-tree>
						</div>
						<Spin fix v-if='loading1'></Spin>
					</div>
				</div>
			</div>
			<!--<div class="mainBodyButton">
				<Button type="primary" :disabled="isDisabled" @click='handleSave'>确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>-->
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import { Tree } from 'element-ui';
	Vue.component(Tree.name, Tree);
	export default {
		name: 'roleConfig',
		data() {
			return {
				dataScope:0,
				loading1: false,
				deptWebData: [],
				deptWebCheckedKey: [],
				switchType: true,
				allPositionList: [],
				differentData: [],
				bindData: [],
				sendData: [],
				webData: [],
				bindCheckedKey: [],
				sendCheckedKey: [],
				webCheckedKey: [],
				loading: false,
				userData: (JSON.parse(this.$store.state.userData)),
				listStyle: {
					width: '240px',
					height: '400px'
				},
				titles: ['待选角色', '已选角色'],
				isDisabled: false,
				targetKeys: [],

			}
		},
		methods: {
			//功能数据权限切换
			switchChange(v) {
				if(!v) {
					this.getStaffData()
				}
			},
			//获取信息
			getStaffData() {
				this.loading1 = true;
				this.deptWebData = [];
				this.deptWebCheckedKey = [];
				_http.http3('get', pathUrls.deptDataPermission, {
					staffId: this.$route.params.id,
				}, 'form').then((res) => {
					this.dataScope=res.data.dataScope;
					this.loading1 = false;
					this.deptWebData = this.getMenus(res.data.dataPermissionLevelDtoList, 'name', 'deptId', 4);
					
					
				}).catch(() => {
					this.loading1 = false;
				})
			},
			//获取信息
			getStaffMenus() {
				this.loading = true;
				this.allPositionList = [];
				this.targetKeys = [];
				this.webData = [];
				this.sendData = [];
				this.bindData = [];
				this.webCheckedKey = [];
				this.sendCheckedKey = [];
				this.bindCheckedKey = [];
				_http.http3('get', pathUrls.staffMenus, {
					staffId: this.$route.params.id,
				}, 'form').then((res) => {
					this.loading = false;
					if(res.webMenus) {
						this.webData = this.getMenus(res.webMenus, 'name', 'menuId', 0);
					}
					if(res.songQiXiaMenus) {
						this.sendData = this.getMenus(res.songQiXiaMenus, 'moduleName', 'moduleId', 1);
					}
					if(res.bangPingXia) {
						this.bindData = this.getMenus(res.bangPingXia, 'moduleName', 'moduleId', 2);
					}
					if(res.allPositionList) {
						for(let item of res.allPositionList) {
							this.allPositionList.push({
								key: item.positionId,
								label: item.positionName
							})
						}
					}

					if(res.positionList) {
						for(let item of res.positionList) {
							this.targetKeys.push(item.positionId)
						}
					}

				}).catch(() => {
					this.loading = false;
				})
			},
			//返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//改变穿梭框
			handleChange(newTargetKeys, direction, moveKeys) {

				this.targetKeys = newTargetKeys;
				let fData = {
					staffId: this.$route.params.id,
					positionIds: this.targetKeys
				}
				_http.http2('post', pathUrls.staffAssignRoles, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '保存成功!',
							onClose: (() => {
								this.getStaffMenus()
								if(!this.switchType) {
									this.getStaffData()
								}

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
			//递归数据
			getMenus(menus, name, id, type) {

				return menus.map((menu) => {
					if(type == 1||type == 2){
						menu.children=menu.modules;
					}
					if(menu.children.length > 0) {
						this.getMenus(menu.children, name, id, type);
					}
					if(menu.checked) {
						if(type == 0) {
							this.webCheckedKey.push(menu[id]);
						} else if(type == 1) {
							this.sendCheckedKey.push(menu[id]);
						} else if(type == 2) {
							this.bindCheckedKey.push(menu[id]);
						}

					}
					if(menu.check && type == 4) {
						this.deptWebCheckedKey.push(menu[id]);

					}
					menu.disabled = true;
					menu.title = menu[name];
					menu.label = menu[name];
					menu.id = menu[id];

					return menu;
				})
			},

		},
		mounted() {
			this.getStaffMenus()

		}

	}
</script>

<style scoped type="text/css">
	.mainBody>>>.ivu-transfer-list-header {
		background: #E2EEFF;
		color: #51B5EA;
	}
	
	.mainBody>>>.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
		border-color: #fff!important;
	}
	
	.mainBody>>>.el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner::before {
		background-color: #fff!important;
	}
	
	.mainBody>>>.el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
		background-color: #0d79e9!important;
		border-color: #0d79e9!important;
	}
	
	.mainBody>>>.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
		background-color: #0d79e9!important;
	}
	/*.mainBodyButton{
		left: 350px;
	}*/
	
	.mainBody>>>.ivu-switch-large {
		width: 80px!important;
	}
	
	.mainBody>>>.ivu-switch-large.ivu-switch-checked:after {
		left: 58px!important;
	}
	.mainBody>>>.ivu-radio-disabled .ivu-radio-inner:after{
		background-color: #0d79e9!important;
	}
</style>