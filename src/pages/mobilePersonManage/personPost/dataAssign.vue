<template>
	<div class=mainBorder>
		<div class='mainHeader'>
			数据配置 ——
			<span style="color: rgb(22, 194, 19);font-weight: 600;">{{$route.params.roleName}}</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<div style="height: 30px;line-height: 30px;">
				<RadioGroup v-model="radioStatus" @on-change='radioChange'>
					<Radio :label="0">默认设置</Radio>
					<Radio :label="1">本组织</Radio>
					<Radio :label="2">本组织及下级组织</Radio>
					<Radio :label="3">自定义</Radio>
				</RadioGroup>
			</div>
			<div class="explain" v-if='radioStatus==0'>
				<span class="explainLabel">默认数据权限：</span>
				<span class="explainInfo">权限的数据范围为仅本人产生的数据；App用户可以搜索本组织客户</span>
			</div>
			<div class="explain"v-if='radioStatus==1'>
				<span class="explainLabel">本组织数据权限：</span>
				<span class="explainInfo">可以查看本组织产生的数据和自己 产生的数据</span>
			</div>
			<div class="explain" v-if='radioStatus==2'>
				<span class="explainLabel">本组织及下级组织数据权限：</span>
				<span class="explainInfo">可以查看本组织和下级组织产生的数据和自己产生的数据</span>
			</div>
			<div class="explain" v-if='radioStatus==3'>
				<span class="explainLabel">自定义数据权限：</span>
				<span class="explainInfo">左边为有哪些组织有该角色；选择该组织的角色,右边展示数据权限范围；勾选组织选择可以查询的数据权限</span>
			</div>
			<div style="height:calc(100% - 60px );display: flex;" v-if='radioStatus==3'>
				<div class="leftTree conTreeBody">
					<Tree :render="renderContent" check-strictly :data="data" node-key="id" ref="tree" highlight-current>
					</Tree>
					<Spin fix v-if='loading'></Spin>
				</div>
				<div class="conTreeBody"  v-if='rightData.length'>
					<div>数据权限范围</div>
					<Tree show-checkbox :data="rightData" node-key="id" ref="rightTree" highlight-current>
					</Tree>
					<Spin fix v-if='loading1'></Spin>
				</div>
			</div>
			
			
			
			<div class="mainBodyButton">
				<Button type="primary" @click='handleDataSave' style="margin-right: 30px;" :disabled="isDisabled">确定</Button>
				<Button type="" @click='handleBackClick'>返回</Button>
			</div>
		</div>

	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import { Tree } from 'element-ui';

	Vue.component(Tree.name, Tree);
	export default {
		name: 'moduleAssign',

		data() {
			return {
				rightData: [],
				radioStatus: 0,
				selectArr: [],
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				userData: (JSON.parse(this.$store.state.userData)),
				data: [],
				loading: false,
				loading1:false,
				isDisabled: false,
				deptIds: [],
				currentChoose: '',
				checkPositionId: ''
			}

		},
		methods: {
			//自定义时获取左侧下级组织树
			getSubDeptPositionTree() {
				this.loading = true;
				_http.http3('get', pathUrls.subDeptPositionTree, {
					"positionId": this.$route.params.id
				}).then(res => {
					this.loading = false;
					this.data = this.common.getConDept(res.data,2,1,2,this.currentChoose)
				}).catch(() => {
					this.loading = false;
				})
			},
			//自定义tree树形组件
			renderContent(h, {
				root,
				node,
				data
			}) {
				let id = data.deptId;
				let flag = false;
				if(this.currentChoose === id) {
					flag = true
				} else {
					flag = false
				}
				let self = this;
				return h('span', {
					style: {
						width:'100%',
						display: 'inline-block',
						cursor: "pointer",
						color: node.node.selected ? "#51B5EA" : "#515a6e", //根据选中状态设置样式
						padding:'0 4px'
					},
					on: {
						click: (e) => {
							this.currentChoose = node.node.selected ? '' : data.deptId;
								
							if(!node.node.selected) {
								this.checkPositionId = data.positionId;
								this.loading1=true;
								this.rightData = [];
								_http.http3('get', pathUrls.deptPositionDataTree, {
									positionId:this.checkPositionId
								}).then(res => {
									this.loading1=false;
									if(res.data.dataPermissionLevelDtoList){
										this.rightData = this.common.getConDept(res.data.dataPermissionLevelDtoList,2,1)
									}
									
								}).catch(() => {
									this.loading1=false;
								})
							} else {
								this.checkPositionId = '';
								this.rightData = [];
							}
						}
					},
				}, [
					h('span', [
//						h('Radio', {
//							props: {
//								value: flag
//							},
//							on: {
//								'on-change': () => {
//									self.currentChoose = id;
//									
//								}
//							}
//						}),
					h('Icon', {
							props: {
								type: 'md-document'
							},
							style: {
								marginRight: '4px',
								color: '#51B5EA'
							}
						}),
						h('span', {

							style: {
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								marginBottom: '-6px',
								display: 'inline-block',
								marginRight: '10px',
							}
						}, data.name, ),
						h('span', {
							style: {
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								marginBottom: '-6px',
								display: 'inline-block',
								color: data.hasDataPermission ? "#16c213" : "#f00",
								fontSize: '12px'
							}
						}, data.hasDataPermission ? '已配置' : '未配置', ),
					]),

				])

			},
		//单选框改变	
			radioChange(v) {
				if(v == 3) {
					this.getSubDeptPositionTree()
				}
			},
		//保存
			handleDataSave() {
				let fData = {
					positionId: this.$route.params.id,
					dataScope: this.radioStatus
				}

				if(this.radioStatus == 3) {
					if(this.$refs.rightTree) {
						let checkData = this.$refs.rightTree.getCheckedAndIndeterminateNodes();
						this.deptIds = [];
						if(checkData.length) {
							checkData.forEach(item => {
								this.deptIds.push(item.deptId)
							})

						}
					}
					if(this.deptIds.length==0){
						this.$Message['warning']({
							background: true,
							content:'请选择数据权限范围!',
						});
						return false;
					}
					
					fData.deptIds = this.deptIds;
					fData.deptId = this.userData.staffDeptId;
					fData.subPositionId = this.checkPositionId
					fData.subDeptId = this.currentChoose
				}
				let urls = this.radioStatus == 3 ? pathUrls.dataPermissionSave : pathUrls.changePositionDataPermission;
				this.isDisabled = true;
				_http.http2('post', urls, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '配置成功!',
							onClose: (() => {
								this.isDisabled = false;
								if(this.radioStatus == 3) {
									
									this.getSubDeptPositionTree()
								} else {
									this.$router.go(-1)
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


			//返回上一级
			handleBackClick() {
				this.$router.go(-1)
			},

		},
		mounted() {
			this.radioStatus = Number(this.$route.params.positionDataScope);
			if(this.radioStatus == 3) {
				this.getSubDeptPositionTree()
			}
		}
	}
</script>

<style type="text/css" scoped>
	.mainBody {
		padding-left: 20px;
	}
	
	.configMain {
		width: 33%;
		height: 100%;
		border: 1px solid #DCDEE2;
		margin: 0 1%;
		position: relative;
		border-radius: 6px;
		overflow: hidden;
	}
	
	.configTitle {
		text-align: center;
		line-height: 30px;
		font-weight: 600;
	}
	
	.mainBodyButton {
		bottom: 40px;
	}
	
	.mainBody>>>td {
		height: 40px;
	}
	
	.mainBody>>>.ivu-table-overflowY {
		overflow-x: hidden;
	}
	
	.mainBody>>>.ivu-checkbox-disabled.ivu-checkbox-checked .ivu-checkbox-inner {
		border-color: #2d8cf0;
		background-color: #2d8cf0;
		color: #fff;
	}
	.conTreeBody{
		position: relative;
		height: calc(100% -80px );
		overflow-y: auto;
		overflow-x: hidden;
		width: 50%;
	}

	.leftTree>>>.ivu-tree-title{
		padding: 0!important;
	}
	.explain{
		line-height: 30px;
	}
	.explainLabel{
		font-weight: 600;
	}
	.explainInfo{
		color:#0b26fa;
	}
</style>