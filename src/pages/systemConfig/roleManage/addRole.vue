<template>
	<div class="mainBorder">
		<div class='mainHeader'>
		    <span>新增</span>
		    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="130">
				<FormItem label="角色名称" class='roleName star'>
					<Input v-model="typeForm.roleName" placeholder="请输入角色名称" maxlength="50" show-word-limit/>
				</FormItem>
				<!--<FormItem label="所属组织" class='star'>
					<el-cascader :options="options" :show-all-levels="false" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeOwn" @change='organizeSelected'></el-cascader>
				</FormItem>-->
				<FormItem label="备注" class='remark'>
					<Input v-model="typeForm.remark" placeholder="备注"></Input>
				</FormItem>
				<FormItem label="身份证号是否加密" class='isEncryption'>
					<!--<Select v-model="typeForm.isEncryption" style="width: 200px;">
						<Option :value="1" key="1">是</Option>
						<Option :value="2" key="2">否</Option>
					</Select>-->
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
				<Button type="primary" @click='addRoleFuc'>确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>
			
		</div>
		<powerTree v-if='powerShow' @powerShowChange='powerShowChange' @menuChange='menuChange'></powerTree>
		<baseTree v-if='baseShow' @baseShowChange='baseShowChange' @deptChange='deptChange'></baseTree>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';	
	import { Cascader } from 'element-ui'
	import powerTree from './components/powerTree'
	import baseTree from './components/baseTree'
	export default {
		name: 'addRole',
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
			
			//
			
			//递归数据
			getLabel(menus) {

				return menus.map((menu) => {
					if(menu.children.length > 0) {
						this.getLabel(menu.children);
					}
						if(menu.children.length==0){
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
		
			//点击添加
			addRoleFuc() {
				this.typeForm.organizeOwn=this.userData.deptId;
				let fData = {
					roleName: this.typeForm.roleName,
//					deptId:this.typeForm.organizeOwn,
					remark: this.typeForm.remark,
					isEncryption: this.typeForm.isEncryption,
					menuIdList: this.menuIdList,
					deptIdList: this.deptIdList,
					sort:this.typeForm.roleSort||0
				}
				
				if(!fData.roleName){
					this.$Message['warning']({
						background: true,
						content: '请填写角色名称!',
						duration: 1
					});
					return false
				}
				if(fData.roleName.length>32){
					this.$Message['warning']({
						background: true,
						content: '角色名称过长!',
						duration: 1
					});
					return false
				}
//				if(!fData.deptId){
//					this.$Message['warning']({
//						background: true,
//						content: '请选择组织!',
//						duration: 1
//					});
//					return false
//				}
				if(fData.remark){
				if(fData.remark.length>64){
					this.$Message['warning']({
						background: true,
						content: '备注内容过长!',
						duration: 1
					});
					return false
				}	
				}
				_http.http2('post', pathUrls.roleSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '	添加成功',
							onClose: (() => {
								this.$router.go(-1)
							})
						});
					}
					if(res.code ==500){
							this.$Message['warning']({
							background: true,
							content:res.msg,
							onClose: (() => {
							})
						});
					}
	

				})

				//				console.log(this.menuIdList)

			},
			organizeSelected(value) {
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.organizeOwn = id					
				}else{
					this.typeForm.organizeOwn =''	
				}
			},
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			}
		},
		mounted() {
//			this.getOrganizeList()
			

		}

	}
</script>

<style scoped>
	
	.mainBody>>>.el-cascader {
		width: 80%;
	}
	/*.mainContent>>>.ivu-input {
		width: 80%;
	}*/
	
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

	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}

</style>