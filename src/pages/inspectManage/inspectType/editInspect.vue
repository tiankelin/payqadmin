<template>
	<div class="main">
		<div class='mainTop'>编辑</div>
		<div class="mainContent">
			<Form ref="typeForm" :model="typeForm" :label-width="180">
				
				<FormItem label="所属组织" class='inspectOrganize star'>
					<el-cascader :options="options" :show-all-levels="false" :props="{ checkStrictly: true }" clearable v-model="typeForm.inspectOrganize" @change='organizeChange' style='width: 300px;'></el-cascader>
					<!--<Cascader :data="options" v-model="typeForm.inspectOrganize" change-on-select :render-format="format" @on-change='organizeChange' style='width: 300px;'></Cascader>-->
				</FormItem>
				<FormItem label="被检角色类型" class='postType star'>
					<Select v-model="typeForm.postType" style="width: 300px;">
						<Option :value="1" key="1">配送</Option>
						<Option :value="2" key="2">库管</Option>
						<Option :value="3" key="3">管理</Option>
						<Option :value="4" key="4">充装</Option>
						<Option :value="5" key="5">稽查</Option>
						<Option :value="6" key="6">押运</Option>
						<Option :value="0" key="0">其他</Option>
					</Select>
				</FormItem>
				<FormItem label="稽查项目" class='inspectName star'>
					<Input v-model="typeForm.inspectName" />
				</FormItem>
				<FormItem>
					<Button type="primary" @click='editInspectFuc'>确定</Button>
					<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
				</FormItem>
			</Form>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'addInspect',
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				typeForm: {
					inspectName: '',
					inspectOrganize: '',
					postType:null
				},
				createTime:''
			}
		},
		methods: {
			//获取详情
			getTypeInfo(){
				_http.http1('get', pathUrls.audittypeInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					if(res.code==0){
						this.typeForm.inspectName=res.auditType.auditTypeName;//稽查项目
						this.typeForm.inspectOrganize=res.auditType.deptId+'';//所属组织
						this.createTime=res.auditType.createTime;//创建时间
						this.typeForm.postType=res.auditType.positionType;
					}
				})
			},
			//点击确定
			editInspectFuc() {
				let fData = {
					auditTypeName: this.typeForm.inspectName,
					deptId: this.typeForm.inspectOrganize,
					id:this.$route.params.id,
					createTime:this.createTime,
					positionType:this.typeForm.postType
				}
				if(fData.deptId == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择组织!',
						duration: 1
					});
					return false
				}
				if(fData.positionType==null) {
					this.$Message['warning']({
						background: true,
						content: '请选择岗位类型!',
						duration: 1
					});
					return false
				}
				if(fData.auditTypeName == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写稽查项目!',
						duration: 1
					});
					return false
				}
				if(fData.auditTypeName.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '稽查项目过长!',
						duration: 1
					});
					return false
				}
				
				_http.http2('post', pathUrls.audittypeUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.$router.go(-1);
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg
						});

					}
				})

			}, //返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//递归数据
			getTitle(menus) {
				return menus.map((menu) => {
					if(menu.children.length > 0) {
						this.getTitle(menu.children);
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
				_http.http1('post', pathUrls.organizationList, {
					deptId: this.userData.deptId
				}, 'form').then((res) => {
					this.options = this.getTitle(res)
				})

			},

			//改变组织
			organizeChange(value) {
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.inspectOrganize = id
				} else {
					this.typeForm.inspectOrganize = ''
				}
			}
		},
		mounted() {
			this.getOrganizeList()
			this.getTypeInfo()
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
		height: calc(100vh - 140px);
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	
	.mainContent>>>.ivu-input {
		width: 300px;
	}
	
	.mainContent button {
		margin: 0 15px;
	}
	.mainContent>>>.el-input__inner {
		height: 32px;
		line-height: 32px;
	}
	
	.mainContent>>>.el-input__icon {
		line-height: 32px;
	}
</style>