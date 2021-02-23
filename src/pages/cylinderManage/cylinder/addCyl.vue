<template>
	<div class="main">
		<div class='mainTop'>新增</div>
		<div class="mainContent">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="120">
				<FormItem label="电子标签编码" class='bottleTag star'>
					<Input v-model="typeForm.bottleTag" placeholder="请输入电子标签编码" />
				</FormItem>
				<!--<FormItem label="所属组织" class='organize'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organize" @change='organizeSelected' placeholder="请选择组织"></el-cascader>
				</FormItem>-->
				<FormItem label="钢瓶条码" class='bottleCode star'>
					<Input v-model="typeForm.bottleCode" placeholder="请输入钢瓶条码" />
				</FormItem>
				<FormItem label="出厂编号" class='factoryCode star'>
					<Input v-model="typeForm.factoryCode" placeholder="请输入出厂编号" />
				</FormItem>
				<FormItem label="生产厂家" class='factoryName star'>
					<Input v-model="typeForm.factoryName" placeholder="请输入生产厂家" />
				</FormItem>
				<FormItem label="出厂时间" class='factoryTime star'>
					<DatePicker type="datetime" placeholder="请选择出厂时间" style="width: 380px;" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.factoryTime' @on-change="factoryTimeChange" :editable='false'></DatePicker>
				</FormItem>
				<FormItem label="末次检验时间" class='lastCheckTime star'>
					<DatePicker type="datetime" placeholder="请选择末次检验时间" style="width: 380px;" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.lastCheckTime' @on-change="lastCheckTimeChange" :editable='false'></DatePicker>
				</FormItem>
				<FormItem label="下次检验时间" class='nextCheckTime star'>
					<DatePicker type="datetime" placeholder="请选择下次检验时间" style="width: 380px;" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.nextCheckTime' @on-change="nextCheckTimeChange" :editable='false'></DatePicker>
				</FormItem>
				<FormItem label="钢瓶规格" class='specification star'>
					<Select v-model="typeForm.specification" style="width: 380px;" placeholder="请选择钢瓶规格">
						<Option value="5KG">5KG</Option>
						<Option value="15KG">15KG</Option>
						<Option value="50KG">50KG</Option>
					</Select>
				</FormItem>
				<FormItem label="钢瓶状态" class='bottleStatus star'>
					<Select v-model="typeForm.bottleStatus" style="width: 380px;" placeholder="请选择钢瓶状态">
						<Option :value="-1">删除</Option>
						<Option :value="1">正常</Option>
						<Option :value="2">报废</Option>
						<Option :value="3">注销</Option>
						<Option :value="4">停用</Option>
						<Option :value="5">转出</Option>
						<Option :value="6">回退</Option>
					</Select>
				</FormItem>
				<FormItem label="钢瓶检测状态" class='checkStatus star'>
					<Select v-model="typeForm.checkStatus" style="width: 380px;" placeholder="请选择钢瓶检测状态">
						<i-option :value="1">超期待检</i-option>
						<i-option :value="2">送检</i-option>
						<i-option :value="3">检验合格</i-option>
						<i-option :value="4">即将到期</i-option>
						<i-option :value="5">检验不合格</i-option>
					</Select>
				</FormItem>
				<FormItem label="建档站点" class='createDept star'>
					<Cascader :data="options1" v-model="typeForm.createDept" change-on-select :render-format="format" @on-change='placeSelected'></Cascader>

					<!--<el-cascader :show-all-levels="false" :options="options1" :props="{ checkStrictly: true }" clearable v-model="typeForm.createDept" @change='placeSelected' placeholder="请选择建档站点"></el-cascader>-->
				</FormItem>
				<FormItem label="当前业务状态" class='flowInformation star'>
					<Select v-model="typeForm.flowInformation" style="width: 380px;" placeholder="请选择当前业务状态">
						<Option value="1">重瓶在库</Option>
						<Option value="2">重瓶在途</Option>
						<Option value="3">在用</Option>
						<Option value="4">空瓶在途</Option>
						<Option value="5">空瓶在库</Option>
					</Select>
				</FormItem>

				<FormItem label="责任人" class='personLiable star'>
					<Select v-model="typeForm.personLiable" style="width: 380px;" placeholder="请选择责任人" label-in-value @on-change='staffChange'>
						<!--<Option value="1">重瓶在库</Option>-->
						<Option v-for="item in staffList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
					</Select>
				</FormItem>
				<FormItem>
					<!--<Button type="primary" @click='addCylClick'>确定</Button>-->
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
		name: 'addCyl',
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				options1: [],
				staffList: [],
				typeForm: {
					bottleTag: '',
					bottleCode: '',
					factoryCode: '',
					factoryName: '',
					factoryTime: '',
					lastCheckTime: '',
					nextCheckTime: '',
					specification: '',
					bottleStatus: '',
					checkStatus: '',
					flowInformation: '',
					personLiable: '',
					createDept: ''
				},
				personLiableName: '',
				createDeptName: ''

			}

		},
		methods: {
			//改变出厂时间
			factoryTimeChange(v) {
				this.typeForm.factoryTime = v
			},
			//上次检验时间
			lastCheckTimeChange(v) {
				this.typeForm.lastCheckTime = v
			},
			//下次检验时间
			nextCheckTimeChange(v) {
				this.typeForm.nextCheckTime = v
			},
			//点击确定	
			addCylClick() {
				let fData = {
					bottleNfcId: this.typeForm.bottleTag, //电子标签编码
					bottleCode: this.typeForm.bottleCode, //钢瓶条码
					bottleFactoryCode: this.typeForm.factoryCode, //出厂编号
					bottleManufacturer: this.typeForm.factoryName, //生产厂家
					bottleFactoryTime: this.typeForm.factoryTime, //出厂时间
					bottleLastCheckTime: this.typeForm.lastCheckTime, //上次检验时间
					bottleNextCheckTime: this.typeForm.nextCheckTime, //下次检验时间
					bottleSpecification: this.typeForm.specification, //钢瓶规格
					bottleStatus: this.typeForm.bottleStatus, //钢瓶状态
					bottleCheckStatus: this.typeForm.checkStatus, //钢瓶检测状态
					bottleFlowInformation: this.typeForm.flowInformation, //当前业务状态
					bottleCreateStation: this.typeForm.createDept, //建档站点id
					bottleDeptId: this.typeForm.createDept, //建档站点id
					createDeptName: this.createDeptName, //建档站点名字
					bottlePersonLiable: this.typeForm.personLiable, //责任人id
					bottlePersonLiableName: this.personLiableName, //责任人姓名					
				}
				
				if(fData.bottleNfcId == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写电子标签编码!',
						duration: 1
					});
					return false
				}
				if(fData.bottleNfcId.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '电子标签编码内容过长!',
						duration: 1
					});
					return false
				}
				var regExp = /^[0-9a-zA-Z]*$/g
				var regExp1 = /^[0-9a-zA-Z]*$/g
				var regExp2 = /^[0-9a-zA-Z]*$/g
				if(!regExp.test(fData.bottleNfcId)) {
					this.$Message['warning']({
						background: true,
						content: '电子标签编码不合法!',
						duration: 1
					});
					return false;
				}
				if(fData.bottleCode == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写钢瓶条码!',
						duration: 1
					});
					return false
				}
				if(fData.bottleCode.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '钢瓶条码内容过长!',
						duration: 1
					});
					return false
				}
				if(!regExp1.test(fData.bottleCode)) {
					this.$Message['warning']({
						background: true,
						content: '钢瓶条码不合法!',
						duration: 1
					});
					return false;
				}
				if(fData.bottleFactoryCode == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写出厂编号!',
						duration: 1
					});
					return false
				}
				
				if(fData.bottleFactoryCode.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '出厂编号内容过长!',
						duration: 1
					});
					return false
				}
				if(!regExp2.test(fData.bottleFactoryCode)) {
					this.$Message['warning']({
						background: true,
						content: '出厂编号不合法!',
						duration: 1
					});
					return false;
				}
				if(fData.bottleManufacturer == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写生产厂家!',
						duration: 1
					});
					return false
				}
				if(fData.bottleFactoryTime == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择出厂时间!',
						duration: 1
					});
					return false
				}
				if(fData.bottleLastCheckTime == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择末次检验时间!',
						duration: 1
					});
					return false
				}
				if(fData.bottleNextCheckTime == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择下次检验时间!',
						duration: 1
					});
					return false
				}
				if(fData.bottleSpecification == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择钢瓶规格!',
						duration: 1
					});
					return false
				}
				if(fData.bottleStatus == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择钢瓶状态!',
						duration: 1
					});
					return false
				}
				if(fData.bottleCheckStatus == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择钢瓶检测状态!',
						duration: 1
					});
					return false
				}
				if(fData.bottleCreateStation == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择建档站点!',
						duration: 1
					});
					return false
				}
				if(fData.bottleFlowInformation == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择当前业务状态!',
						duration: 1
					});
					return false
				}

				if(fData.bottlePersonLiable == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择责任人!',
						duration: 1
					});
					return false
				}
				_http.http2('post', pathUrls.deptbottleSave, fData).then((res) => {
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
			//责任人改变
			staffChange(v) {
				if(v) {
					this.personLiableName = v.label
				} else {
					this.personLiableName = ''
				}

			},
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
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
					this.options1 = this.getTitle(res)
				})

			},
			//当前业务状态改变
			flowChange(v) {
//				if(v == 1 || v == 5) {
//					if(this.typeForm.createDept) {
//						this.getUnStaffList(this.typeForm.createDept)
//					}
//				} else {
//					if(this.typeForm.createDept) {
//						this.getStaffList(this.typeForm.createDept)
//					}
//				}
			},
			//获取责任人列表(配送员)
			getStaffList(id) {
				_http.http1('post', pathUrls.driverInfo, {
					deptId: id
				}, 'form').then((res) => {
					if(res.code === 0) {
						this.staffList = res.data
					}
				})
			},
			//获取责任人列表(非配送员)
			getUnStaffList(id) {
				_http.http1('post', pathUrls.queryStationStaff, {
					deptId: id
				}, 'form').then((res) => {
					if(res.code === 0) {
						this.staffList = res.data
					}
				})
			},
			//选中建档站点的下拉框		
			placeSelected(value, selectedData) {
				this.typeForm.personLiable = ''
				if(value.length) {
					let id = value[value.length - 1]
					let idName = selectedData[value.length - 1]
					this.typeForm.createDept = id
					this.createDeptName = idName.label
					this.getStaffList(id)
				} else {
					this.getStaffList(this.userData.deptId)
					this.createDeptName = ''
					this.typeForm.createDept = ''
				}
			},

			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
		},
		mounted() {
			this.getOrganizeList()
			this.getStaffList(this.userData.deptId)
		}
	}
</script>

<style type="text/css" scoped>
	.main {
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
		padding: 10px 20px 20px 0;
		overflow-y: auto;
		height: calc(100vh - 130px);
	}
	
	.mainContent>>>.el-input__inner {
		height: 32px;
		line-height: 32px;
	}
	
	.mainContent>>>.el-input__icon {
		line-height: 32px;
	}
	
	.ivu-form-item {
		margin-bottom: 10px;
		width: 500px;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
</style>