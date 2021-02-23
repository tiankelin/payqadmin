<template>

	<div class="mainBorder">
		<div class='mainHeader'>
			<span>新增</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="140">

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
					<!--<Input v-model="typeForm.factoryName" placeholder="请输入生产厂家" />-->
					<i-select v-model="typeForm.factoryName" placeholder="请选择生产厂家" style="width: 385px;" filterable>
						<i-option v-for='item in factoryList' :key='item.id' :value='item.bottleManufacturerName'>{{item.bottleManufacturerName}}</i-option>
					</i-select>
				</FormItem>
				<FormItem label="出厂时间" class='factoryTime star'>
					<DatePicker type="month" placeholder="请选择出厂时间" style="width: 385px;" format="yyyy-MM-dd" v-model='typeForm.factoryTime' @on-change="factoryTimeChange" :editable='false'></DatePicker>
				</FormItem>
				<FormItem label="末次检验时间" class='lastCheckTime star'>
					<DatePicker type="datetime" placeholder="请选择末次检验时间" style="width: 385px;" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.lastCheckTime' @on-change="lastCheckTimeChange" :editable='false'></DatePicker>
				</FormItem>
				<FormItem label="下次检验时间" class='nextCheckTime star'>
					<DatePicker type="datetime" placeholder="请选择下次检验时间" style="width: 385px;" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.nextCheckTime' @on-change="nextCheckTimeChange" :editable='false'></DatePicker>
				</FormItem>
				<FormItem label="钢瓶规格" class='specification star'>
					<i-select v-model="typeForm.specification" style="width: 385px;" placeholder="请选择钢瓶规格">
						<i-option v-for='item in specList' :key='item' :value='item'>{{item}}</i-option>
						<!--<i-option value="YSP35.5">YSP35.5</i-option>
						<i-option value="YSP118">YSP118</i-option>
						<i-option value="YSP118-2">YSP118-2</i-option>-->
					</i-select>
				</FormItem>
				<FormItem label="钢瓶状态" class='bottleStatus star'>
					<i-select v-model="typeForm.bottleStatus" style="width: 385px;" placeholder="请选择钢瓶状态">
						<i-option :value="-1">删除</i-option>
						<i-option :value="1">正常</i-option>
						<i-option :value="2">报废</i-option>
						<i-option :value="3">注销</i-option>
						<i-option :value="4">停用</i-option>
						<i-option :value="5">转出</i-option>
						<i-option :value="6">回退</i-option>
					</i-select>
				</FormItem>
				<FormItem label="钢瓶检测状态" class='checkStatus star'>
					<i-select v-model="typeForm.checkStatus" style="width: 385px;" placeholder="请选择钢瓶检测状态">
						<i-option :value="1">超期待检</i-option>
						<i-option :value="2">送检</i-option>
						<i-option :value="3">检验合格</i-option>
						<i-option :value="4">即将到期</i-option>
						<i-option :value="5">检验不合格</i-option>
					</i-select>
				</FormItem>
				<FormItem label="建档站点" class='createDept star'>
					<!--<Cascader :data="options1" v-model="typeForm.createDept" change-on-select :render-format="format" @on-change='placeSelected'></Cascader>-->

					<el-cascader :show-all-levels="false" style='width: 385px;' :options="options1" :props="{ checkStrictly: true }" clearable v-model="typeForm.createDept" @change='placeSelected' placeholder="请选择建档站点"></el-cascader>
				</FormItem>
				<FormItem label="当前业务状态" class='flowInformation star'>
					<i-select v-model="typeForm.flowInformation" style="width: 385px;" placeholder="请选择当前业务状态" @on-change='flowTypeChange'>
						<i-option :value="1">在库</i-option>
						<i-option :value="2">在途</i-option>
						<i-option :value="3">在用</i-option>
						<!--<i-option value="4">空瓶在途</i-option>
						<i-option value="5">空瓶在库</i-option>-->
					</i-select>
				</FormItem>

				<FormItem label="责任人" class='personLiable'>
					<i-select clearable v-if='typeForm.flowInformation==2' v-model="typeForm.personLiable" style="width: 385px;" placeholder="请先选择责任人" label-in-value @on-change='staffChange' filterable>
						<i-option v-for="item in staffList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</i-option>
					</i-select>
					<i-select clearable v-else-if='typeForm.flowInformation==1' v-model="typeForm.personLiable" style="width: 385px;" placeholder="请先选择责任人" label-in-value @on-change='staffChange' filterable>
						<i-option v-for="item in staffList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</i-option>
					</i-select>
					<Select clearable @change="eleChange" v-else-if='typeForm.flowInformation==3' @blur='selectBlur' :loading="loading1" v-model="typeForm.personLiable" style="width:385px" placeholder='请先选择责任人' filterable remote :remote-method="remoteMethod" v-loadmore="loadMore">
						<Option v-for="item in userList" :value="item.userId" :key="item.userId" :label="item.userRealName">
						</Option>
					</Select>
					<i-select clearable v-else v-model="typeForm.personLiable" style="width: 385px;" placeholder="请先选择责任人" label-in-value @on-open-change='staffOpenChange'>

					</i-select>
				</FormItem>

				<FormItem label="自有编号" class='factoryCode'>
					<Input v-model="typeForm.ownNumber" placeholder="请输入自有编号" />
				</FormItem>
				<FormItem label="设备品种" class='factoryCode'>
					<Input v-model="typeForm.equipmentVariety" placeholder="请输入设备品种" readonly/>
				</FormItem>
				<FormItem label="充装介质">
					<i-select clearable style='width: 385px;' v-model='typeForm.fillingMedium'>
						<i-option  v-for='item in fillMediumList' :key='item.id' :value='item.name'>{{item.name}}</i-option>						
					</i-select>
					<!--<Input v-model="typeForm.fillingMedium" placeholder="请输入充装介质" />-->
				</FormItem>
				<FormItem label="报废时间" class='factoryCode'>
					<DatePicker type="month" style="width: 385px;" format="yyyy-MM-dd" v-model='typeForm.scrapDate' @on-change='scrapDateChange' readonly></DatePicker>
					<!--<Input v-model="typeForm.scrapDate" readonly/>-->
				</FormItem>
				<FormItem label="登记代码" class='factoryCode'>
					<Input v-model="typeForm.registrationCode" placeholder="请输入登记代码" />
				</FormItem>
				<FormItem label="公称工作压力(MPa)" class='factoryCode'>
					<Input v-model="typeForm.nominalWorkingPressure" placeholder="请输入公称工作压力" />
				</FormItem>
				<FormItem label="钢瓶容积(L)" class='factoryCode'>
					<Input v-model="typeForm.cylinderVolume" placeholder="请输入钢瓶容积" />
				</FormItem>
				<FormItem label="设计壁厚(mm)" class='factoryCode'>
					<Input v-model="typeForm.designWallThickness" placeholder="请输入设计壁厚" />
				</FormItem>

				<FormItem label="钢瓶备注" class='factoryCode'>
					<Input v-model="typeForm.remark" placeholder="请输入钢瓶备注" />
				</FormItem>
			</Form>
			<div class="mainBodyButton">
				<Button type="primary" @click='addCylClick' :disabled="isDisabled">确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>

		</div>

	</div>

</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import { Select, Option } from 'element-ui';
	import directives from '@/public/directives';
	export default {
		name: 'addCyl',
		components: {
			Select,
			Option
		},
		data() {
			return {
				fillMediumList:[],
				specList:[],
				isDisabled:false,
				userList: [],
				isLoad: true,
				curpage: 1,
				pageSize: 20,
				copyList: [],
				conKey: 0,
				loading1: false,
				keyWords: '',
				factoryList: [],
				bottleOptions: [],
				loading: false,
				bottleTags: '',

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
					flowInformation: null,
					personLiable: '',
					createDept: '',

					ownNumber: null,
					equipmentVariety: '液化石油气钢瓶',
					fillingMedium: '液化石油气',
					scrapDate: '',
					registrationCode: '',
					nominalWorkingPressure: '',
					cylinderVolume: '',
					designWallThickness: '',
					remark: ''

				},
				personLiableName: '',
				createDeptName: '',

			}

		},
		methods: {
			staffOpenChange(){
				if(this.typeForm.createDept&&this.typeForm.flowInformation){
					
				}else{
					this.$Message['warning']({
						background: true,
						content: '请先选择建档站点及当前业务状态!',
						
					});
					
				}
			},
			eleChange(val) {
				this.typeForm.personLiable = val;
				let obj = {};
				obj = this.userList.find((item) => { //遍历list的数据
					return item.userId === val; //筛选出匹配数据
				});
				this.personLiableName = obj.userRealName;
			},
			selectBlur() {
				this.conKey = 0;
				this.userList = this.copyList;
			},
			remoteMethod(query) {
				let newId = this.typeForm.createDept ? this.typeForm.createDept : this.userData.deptId;
				this.keyWords = query;
				this.conKey = 0;
				if(query.trim() !== '') {
					this.loading1 = true;
					this.curpage = 1;
					_http.http2('post', pathUrls.getLiabilityUsers, {
						'page': this.curpage,
						"limit": 100,
						'deptId': newId,
						'keyWords': query
					}).then((res) => {
						this.conKey = 1;
						this.loading1 = false;
						this.userList = res.data;
					})

				} else {
					this.userList = this.copyList;
				}
			},
			loadMore() {
				let newId = this.typeForm.createDept ? this.typeForm.createDept : this.userData.deptId;
				if(this.conKey == 0) {
					if(this.isLoad) {
						this.curpage++;
						this.getLiabilityUsers(newId);
					}
				}

			},
			//改变流转状态
			flowTypeChange(v) {
				this.staffList = [];
				this.userList = [];
				this.curpage = 1;
				let id = this.typeForm.createDept ? this.typeForm.createDept : this.userData.deptId;
				if(v == 1||v == 2) {
					this.getStaffList(id,v)
				} else if(v == 3) {
					this.getLiabilityUsers(id)
				}
			},
			//获取钢瓶厂家
			getBottlemanufacturer() {
				_http.http1('post', pathUrls.bottlemanufacturerSelect, {

				}, 'form').then((res) => {
					this.factoryList = res.data;
				})
			},
			//改变报废时间
			scrapDateChange(v) {
				this.typeForm.scrapDate = v;
			},

			//改变出厂时间
			factoryTimeChange(v) {
				if(v) {
					this.typeForm.factoryTime = this.common.getLastDay(v);
					this.typeForm.scrapDate = this.common.getLastDay(v, 12);
				} else {
					this.typeForm.factoryTime = '';
					this.typeForm.scrapDate = '';
				}

			},
			//上次检测时间
			lastCheckTimeChange(v) {
				//				this.typeForm.lastCheckTime = v;
				if(v) {
					this.typeForm.lastCheckTime = v;
					let newTime = Number(v.substring(0, 4)) + 4;
					let endsTime = v.substring(4, v.length)
					this.typeForm.nextCheckTime = newTime + endsTime;
				} else {
					this.typeForm.lastCheckTime = '';
					this.typeForm.nextCheckTime = '';
				}

			},
			//下次检测时间
			nextCheckTimeChange(v) {
				this.typeForm.nextCheckTime = v
			},
			//点击确定
			addCylClick() {
				let fData = {
					//					bottleNfcId: this.typeForm.bottleTag, //电子标签编码
					bottleCode: this.typeForm.bottleCode, //钢瓶条码
					bottleFactoryCode: this.typeForm.factoryCode, //出厂编号
					bottleManufacturer: this.typeForm.factoryName, //生产厂家
					bottleFactoryTime: this.typeForm.factoryTime ? this.common.conformatDat(this.typeForm.factoryTime, true) : null, //出厂时间
					bottleLastCheckTime: this.typeForm.lastCheckTime ? this.common.conformatDat(this.typeForm.lastCheckTime, true) : null, //上次检测时间
					bottleNextCheckTime: this.typeForm.nextCheckTime ? this.common.conformatDat(this.typeForm.nextCheckTime, true) : null, //下次检测时间
					bottleSpecification: this.typeForm.specification, //钢瓶规格
					bottleStatus: this.typeForm.bottleStatus, //钢瓶状态
					bottleCheckStatus: this.typeForm.checkStatus, //钢瓶检测状态
					bottleFlowInformation: this.typeForm.flowInformation, //当前业务状态
					bottleCreateStation: this.typeForm.createDept, //建档站点id
					bottleDeptId: this.typeForm.createDept, //建档站点id
					//					createDeptName: this.createDeptName, //建档站点名字
					bottlePersonLiable: this.typeForm.personLiable, //责任人id
					bottlePersonLiableName: this.personLiableName, //责任人姓名

					ownNumber: this.typeForm.ownNumber, //自有编号
					equipmentVariety: this.typeForm.equipmentVariety, //设备品种
					fillingMedium: this.typeForm.fillingMedium, //充装介质
					scrapDate: this.typeForm.scrapDate ? this.common.conformatDat(this.typeForm.scrapDate, true) : null, //报废时间
					registrationCode: this.typeForm.registrationCode, //登记代码
					nominalWorkingPressure: this.typeForm.nominalWorkingPressure, //公称工作压力
					cylinderVolume: this.typeForm.cylinderVolume, //钢瓶容积
					designWallThickness: this.typeForm.designWallThickness, //设计壁厚
					remark: this.typeForm.remark, //备注
				}

				var regExp1 = /^[0-9a-zA-Z]*$/g
				var regExp2 = /^[0-9a-zA-Z]*$/g

				if(fData.bottleCode == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写钢瓶条码!',
						
					});
					return false
				}
				if(fData.bottleCode.length > 64) {
					this.$Message['warning']({
						background: true,
						content: '钢瓶条码内容过长!',
						
					});
					return false
				}
				if(!regExp1.test(fData.bottleCode)) {
					this.$Message['warning']({
						background: true,
						content: '钢瓶条码不合法!',
						
					});
					return false;
				}
				if(fData.bottleFactoryCode == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写出厂编号!',
						
					});
					return false
				}

				if(fData.bottleFactoryCode.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '出厂编号内容过长!',
						
					});
					return false
				}
				if(!regExp2.test(fData.bottleFactoryCode)) {
					this.$Message['warning']({
						background: true,
						content: '出厂编号不合法!',
						
					});
					return false;
				}
				if(fData.bottleManufacturer == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择生产厂家!',
						
					});
					return false
				}
				if(fData.bottleFactoryTime == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择出厂时间!',
						
					});
					return false
				}
				if(fData.bottleLastCheckTime == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择末次检验时间!',
						
					});
					return false
				}
				if(fData.bottleNextCheckTime == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择下次检验时间!',
						
					});
					return false
				}
				if(fData.bottleSpecification == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择钢瓶规格!',
						
					});
					return false
				}
				if(fData.bottleStatus == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择钢瓶状态!',
						
					});
					return false
				}
				if(fData.bottleCheckStatus == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择钢瓶检测状态!',
						
					});
					return false
				}
				if(fData.bottleCreateStation == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择建档站点!',
						
					});
					return false
				}
				if(fData.bottleFlowInformation == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择当前业务状态!',
						
					});
					return false
				}

				if(fData.ownNumber && fData.ownNumber.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '自有编号过长!',
						
					});
					return false
				}
				if(fData.equipmentVariety && fData.equipmentVariety.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '设备品种过长!',
						
					});
					return false
				}
				if(fData.fillingMedium && fData.fillingMedium.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '充装介质过长!',
						
					});
					return false
				}
				if(fData.registrationCode && fData.registrationCode.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '登记代码过长!',
						
					});
					return false
				}
				if(fData.nominalWorkingPressure && fData.nominalWorkingPressure.length > 16) {
					this.$Message['warning']({
						background: true,
						content: '公称工作压力过长!',
						
					});
					return false
				}
				if(fData.cylinderVolume && fData.cylinderVolume.length > 16) {
					this.$Message['warning']({
						background: true,
						content: '钢瓶容积过长!',
						
					});
					return false
				}
				if(fData.designWallThickness && fData.designWallThickness.length > 16) {
					this.$Message['warning']({
						background: true,
						content: '设计壁厚过长!',
						
					});
					return false
				}
				if(fData.remark && fData.remark.length > 64) {
					this.$Message['warning']({
						background: true,
						content: '备注过长!',
						
					});
					return false
				}
				this.isDisabled=true;
				_http.http2('post', pathUrls.platformSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
								this.$store.commit('changeCylInfo', JSON.stringify(fData));
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
					if(res.code != 0) {
						this.isDisabled = false;
					}
				}).catch(err => {
					this.isDisabled = false;
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

			//获取责任人列表(配送员)
			getStaffList(id,type) {
				_http.http1('post', pathUrls.driverInfo, {
					deptId: id,
					staffType:type
				}, 'form').then((res) => {
					if(res.code === 0) {
						this.staffList = res.data
					}
				})
			},

			//获取责任人列表(在用状态责任人)
			getLiabilityUsers(id) {
				this.isLoad = true;

				_http.http2('post', pathUrls.getLiabilityUsers, {
					deptId: id,
					page: this.curpage,
					limit: 20,
					keyWords: this.keyWords
				}).then((res) => {

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
			},
			//选中建档站点的下拉框
			placeSelected(value) {
				this.staffList = [];
				this.userList = [];
				this.curpage = 1;
				this.typeForm.personLiable = ''
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.createDept = id

				} else {

					this.createDeptName = ''
					this.typeForm.createDept = ''
				}
				let newId = this.typeForm.createDept ? this.typeForm.createDept : this.userData.deptId;
				if(this.typeForm.flowInformation == 2) {
					this.getStaffList(newId,2)
				} else if(this.typeForm.flowInformation == 1) {
					this.getStaffList(newId,1)
				} else if(this.typeForm.flowInformation == 3) {
					this.getLiabilityUsers(newId)
				}
			},

			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
		},
		mounted() {
			this.common.getBottleSpecList().then(res => {
				this.specList=res.data;
			})	
			this.common.getBottleMediumList().then(res => {
				this.fillMediumList=res.data;
			})
			this.getBottlemanufacturer(this.$store.state.cylAddInfo);
			if(this.$store.state.cylAddInfo.length) {
				let newData = JSON.parse(this.$store.state.cylAddInfo);
				this.typeForm.factoryName = newData.bottleManufacturer; //生产厂家
				this.typeForm.factoryTime = newData.bottleFactoryTime; //出厂时间
				this.typeForm.lastCheckTime = newData.bottleLastCheckTime; //上次检测时间
				this.typeForm.nextCheckTime = newData.bottleNextCheckTime; //下次检测时间
				this.typeForm.specification = newData.bottleSpecification; //钢瓶规格
				this.typeForm.bottleStatus = newData.bottleStatus; //钢瓶状态
				this.typeForm.checkStatus = newData.bottleCheckStatus; //钢瓶检测状态
				this.typeForm.flowInformation = newData.bottleFlowInformation; //当前业务状态
				this.typeForm.createDept = newData.bottleCreateStation; //建档站点id
				this.typeForm.personLiable = newData.bottlePersonLiable; //责任人id
				this.typeForm.equipmentVariety = newData.equipmentVariety; //设备品种
				this.typeForm.fillingMedium = newData.fillingMedium; //充装介质
				this.typeForm.scrapDate = newData.scrapDate; //报废时间
				this.typeForm.registrationCode = newData.registrationCode; //登记代码
				this.typeForm.nominalWorkingPressure = newData.nominalWorkingPressure; //公称工作压力
				this.typeForm.cylinderVolume = newData.cylinderVolume; //钢瓶容积
				this.typeForm.designWallThickness = newData.designWallThickness; //设计壁厚
				this.typeForm.remark = newData.remark; //备注

			}

			this.common.getDeptList(this.userData.deptId).then((res) => {
				this.options1 = this.common.getConDept(res.data,0,0,1)
			})
			let id = this.typeForm.createDept ? this.typeForm.createDept : this.userData.deptId;
			if(this.typeForm.flowInformation == 2) {
				this.getStaffList(id,2)
			} else if(this.typeForm.flowInformation == 1) {
				this.getStaffList(id,1)
			} else if(this.typeForm.flowInformation == 3) {
				this.getLiabilityUsers(id)
			}

		}
	}
</script>

<style type="text/css" scoped>
	.ivu-form-item {
		margin-bottom: 10px;
		width: 525px;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
</style>