<template>
	<div class="mainBorder">
		<div class='mainHeader'>
		    <span>编辑</span>
		    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="130">
				<FormItem label="角色名称" class='roleName star'>
					<Input v-model="typeForm.roleName" placeholder="请输入角色名称" maxlength="50" show-word-limit/>
				</FormItem>
				<!--<FormItem label="所属组织" class='star'>
					<el-cascader disabled :options="options" :show-all-levels="false" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeOwn" @change='organizeSelected'></el-cascader>
				</FormItem>-->
				<FormItem label="备注" class='remark'>
					<Input v-model="typeForm.remark" placeholder="备注"></Input>
				</FormItem>
				<FormItem label="身份证号是否加密" class='isEncryption'>
					<i-switch v-model="typeForm.isEncryption" size="large" false-color="#ff4949" :true-value='1' :false-value='2'>
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<FormItem label="排序号" class='adrInfo'>
					<Input v-model="typeForm.roleSort" placeholder="请输入排序号"></Input>
				</FormItem>
			</Form>
			<div style="margin-left:200px;margin-bottom: 40px;">
				<Button type="info" style="margin-right: 20px;" @click='powerClick'>功能权限</Button>
				<Button type="warning" @click='baseClick'>例外权限</Button>
			</div>
			<div class="mainBodyButton">
				<Button type="primary" @click='editRoleFuc'>确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>
		</div>
		<powerTree v-if='powerShow' @powerShowChange='powerShowChange' @menuChange='menuChange' :menuIdLis='menuIdList'></powerTree>
		<baseTree v-if='baseShow' @baseShowChange='baseShowChange' @deptChange='deptChange' :deptIdLis='deptIdList'></baseTree>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import Bus from '@/public/bus';
	import { Cascader } from 'element-ui'
	import powerTree from './components/powerTree'
	import baseTree from './components/baseTree'
	export default {
		name: 'editRole',
		components:{
		powerTree,
		baseTree
		},
		data() {
			return {
				baseShow:false,
				powerShow:false,
				baseData: [],
				powerData: [],
				userData: (JSON.parse(this.$store.state.userData)),
				typeForm: {
					roleName: '',
					organizeOwn: '',
					remark: '',
					isEncryption: 1,
					roleSort:0
				},
				menuIdList: [],
				deptIdList: [],
				options: [],
				createTime: ''

			}
		},
		methods: {
			baseClick(){
				//点击显示数据权限
				this.baseShow=true;
			},
			//获取所选组织id集合
			deptChange(data){
				this.deptIdList=data;
			},
			//关闭
			baseShowChange(data){
				this.baseShow=data;
			},
			//获取选中菜单
			menuChange(data){
				this.menuIdList=data
			},
			//关闭
			powerShowChange(data){
				this.powerShow=data;
			},
			//点击打开功能权限
			powerClick(){
				this.powerShow=true;
			},
			//获取详情
			getRoleInfo() {
				_http.http1('post', pathUrls.roleInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					if(res.data) {
						this.typeForm.roleName = res.data.roleName; //角色名称
						this.typeForm.organizeOwn = res.data.deptId; //角色名称
						this.typeForm.remark = res.data.remark; //角色名称
						this.typeForm.isEncryption = res.data.isEncryption; //角色名称
						this.menuIdList = res.data.menuIdList; //菜单权限数组
						this.deptIdList = res.data.deptIdList; //功能权限数组
						this.createTime = res.data.createTime; //创建时间
						this.typeForm.roleSort=res.data.sort||0;
            
					}
					this.getOrganizeList()

				})
			},
			getTitle(menus) {
				return menus.map((menu) => {
					if(menu.children.length > 0) {
						menu.expand = true;
						this.getTitle(menu.children);
					}
					for(let items of this.menuIdList) {
						if(items == menu.menuId) {
							menu.expand = true;
							menu.checked = true
						}
					}
					for(let items1 of this.deptIdList) {
						if(items1 == menu.deptId) {
							menu.expand = true;
							menu.checked = true
						}
					}
					menu.title = menu.name;
					return menu;
				})
			},

			//递归数据
			getLabel(menus) {

				return menus.map((menu) => {
					if(menu.children.length > 0) {
						this.getLabel(menu.children);
					}
					if(menu.children.length == 0) {
						delete menu.children;
					}
					menu.value = menu.deptId;
					menu.label = menu.name
					return menu;
				})
			},
			//获取组织列表
			getOrganizeList() {
				_http.http1('post', pathUrls.deptList, {
					deptId: this.userData.deptId
				}, 'form').then((res) => {
					this.options = this.getLabel(res)

				}).catch((res) => {

				})

			},
			//点击编辑
			editRoleFuc() {
				//				console.log(this.menuIdList)
				//				return false;
				let fData = {
					roleName: this.typeForm.roleName,
					remark: this.typeForm.remark,
					isEncryption: this.typeForm.isEncryption,
					roleId: this.$route.params.id,
					menuIdList: this.menuIdList,
					deptIdList: this.deptIdList,
					createTime: this.createTime,
					sort:this.typeForm.roleSort||0
//					deptId: this.typeForm.organizeOwn,
				}
				if(!fData.roleName) {
					this.$Message['warning']({
						background: true,
						content: '请填写角色名称!',
						duration: 1
					});
					return false
				}
				if(fData.roleName.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '角色名称过长!',
						duration: 1
					});
					return false
				}
//				if(!fData.deptId) {
//					this.$Message['warning']({
//						background: true,
//						content: '请选择组织!',
//						duration: 1
//					});
//					return false
//				}
				if(fData.remark) {
					if(fData.remark.length > 64) {
						this.$Message['warning']({
							background: true,
							content: '备注内容过长!',
							duration: 1
						});
						return false
					}
				}
				_http.http2('post', pathUrls.roleUpdate, fData).then((res) => {

					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.$router.go(-1)
							})
						});
					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
							onClose: (() => {})
						});
					}
				})

				//				console.log(this.menuIdList)

			},
			organizeSelected(value) {
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.organizeOwn = id
				} else {
					this.typeForm.organizeOwn = ''
				}
			},
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			}
		},
		mounted() {

			this.getRoleInfo()

		}

	}
</script>

<style scoped>

	.mainBody>>>.el-cascader {
		width: 80%;
	}

	.mainBody>>>.ivu-input {
		/*width: 80%;*/
	}

	.mainBody>>>.ivu-input-wrapper {
		width: 80%;
	}

	.ivu-form-item {
		margin-bottom: 10px;
		width: 600px;
	}

	.powerTree {
		margin: 0 100px;
	}

	.mainTree {
		display: flex;
		margin-top: 20px;
	}

	.btnWrapper {
		margin-left: 120px;
		margin-top: 20px;
	}

	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
</style>
