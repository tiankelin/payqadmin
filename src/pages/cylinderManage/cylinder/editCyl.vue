<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>编辑</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="140">
				<FormItem label="电子标签编码" class='bottleTag'>
					<Input v-model="typeForm.bottleTag" disabled/>
				</FormItem>
				<FormItem label="钢瓶条码" class='bottleCode star'>
					<Input v-model="typeForm.bottleCode" />
				</FormItem>
				<FormItem label="出厂编号" class='factoryCode star'>
					<Input v-model="typeForm.factoryCode" />
				</FormItem>
				<!--<FormItem label="生产厂家" class='factoryName star'>
					<Input v-model="typeForm.factoryName" />
				</FormItem>-->
				<FormItem label="生产厂家" class='factoryName star'>
					<!--<Input v-model="typeForm.factoryName" placeholder="请输入生产厂家" />-->
					<i-select v-model="typeForm.factoryName" placeholder="请选择生产厂家" style="width: 385px;" filterable>
						<i-option v-for='item in factoryList' :key='item.id' :value='item.bottleManufacturerName'>{{item.bottleManufacturerName}}</i-option>
					</i-select>
				</FormItem>
				<FormItem label="出厂时间" class='factoryTime star'>
					<!--<Input v-model="typeForm.factoryTime"  />-->
					<DatePicker type="month" placeholder="请选择出厂时间" style="width: 385px;" format="yyyy-MM-dd" v-model='typeForm.factoryTime' @on-change="factoryTimeChange" :editable='false'></DatePicker>
					<!--<DatePicker type="datetime" placeholder="请选择出厂时间" style="width: 380px;" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.factoryTime' @on-change="timeChange"></DatePicker>-->
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
						<!--<Option value="5KG">5KG</Option>
						<Option value="15KG">15KG</Option>
						<Option value="50KG">50KG</Option>-->
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
				<!--<FormItem label="建档站点" class='createDeptName star'>
					<Input v-model="typeForm.createDeptName"  />
				</FormItem>-->
				<FormItem label="建档站点" class='createDept star'>
					<!--<Cascader :data="options1" v-model="typeForm.createDept" change-on-select :render-format="format" @on-change='placeSelected'></Cascader>-->

					<el-cascader :show-all-levels="false" style='width: 385px;' :options="options1" :props="{ checkStrictly: true }" clearable v-model="typeForm.createDept" @change='placeSelected' placeholder="请选择建档站点"></el-cascader>
				</FormItem>
				<FormItem label="当前业务状态" class='flowInformation'>
					<!--<Input v-model="typeForm.flowInformation"  />-->
					<i-select v-model="typeForm.flowInformation" style="width: 385px;" placeholder="" disabled>
						<i-option :value="1">在库</i-option>
						<i-option :value="2">在途</i-option>
						<i-option :value="3">在用</i-option>
						<i-option :value="4">在途</i-option>
						<i-option :value="5">在库</i-option>
					</i-select>
				</FormItem>

				<FormItem label="责任人" class='personLiable '>

					<i-select v-if='typeForm.flowInformation==2||typeForm.flowInformation==4' v-model="typeForm.personLiable" style="width: 385px;" placeholder="请选择责任人" label-in-value>
						<i-option v-for="item in staffList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</i-option>
					</i-select>
					<i-select v-else-if='typeForm.flowInformation==1||typeForm.flowInformation==5' v-model="typeForm.personLiable" style="width: 385px;" placeholder="请选择责任人" label-in-value>
						<i-option v-for="item in staffList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</i-option>
					</i-select>
					<Select @change="eleChange" v-else-if='typeForm.flowInformation==3' @blur='selectBlur' :loading="loading1" v-model="typeForm.personLiable" style="width:385px" placeholder='请选择责任人' filterable remote :remote-method="remoteMethod" v-loadmore="loadMore">
						<Option v-for="item in userList" :value="item.userId" :key="item.userId" :label="item.userRealName">
						</Option>
					</Select>

				</FormItem>

				<FormItem label="自有编号" class='factoryCode'>
					<Input v-model="typeForm.ownNumber" placeholder="请输入自有编号" />
				</FormItem>
				<FormItem label="设备品种" class='factoryCode'>
					<Input v-model="typeForm.equipmentVariety" placeholder="请输入设备品种" />
				</FormItem>
				<FormItem label="充装介质" class='factoryCode'>
					<i-select clearable style='width: 385px;' v-model='typeForm.fillingMedium'>
						<i-option  v-for='item in fillMediumList' :key='item.id' :value='item.name'>{{item.name}}</i-option>						
					</i-select>
					<!--<Input v-model="typeForm.fillingMedium" placeholder="请输入充装介质" />-->
				</FormItem>
				<FormItem label="报废时间" class='factoryCode'>
					<DatePicker type="month" style="width: 385px;" format="yyyy-MM-dd" v-model='typeForm.scrapDate' @on-change='scrapDateChange' disabled></DatePicker>
					<!--<DatePicker disabled type="datetime" placeholder="请选择报废时间" style="width: 380px;"  format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.scrapDate' @on-change='scrapDateChange' :editable='false'></DatePicker>-->
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
			<div class="mainBodyButton" v-has='788'>
				<Button type="primary" @click='editCylClick' :disabled="isDisabled">确定</Button>
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
				options1: [],
				factoryList: [],
				staffList: [],
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				typeForm: {
					bottleTag: '',
					bottleCode: '',
					factoryCode: '',
					factoryName: '',
					factoryTime: '',
					lastCheckTime: '',
					nextCheckTime: '',
					specification: '',
					bottleStatus: null,
					checkStatus: null,
					flowInformation: null,
					personLiableName: '',
					createDept: '',
					createDeptName: '',
					ownNumber: null,
					equipmentVariety: '',
					fillingMedium: '',
					scrapDate: '',
					registrationCode: '',
					nominalWorkingPressure: '',
					cylinderVolume: '',
					designWallThickness: '',
					remark: '',
					personLiable: ''
				},
				createDept: '',
				personLiable: '',

				bottleCreateTime: null,
				bottleCreater: null,
				bottleCreaterName: null,
				bottleFullValue: null,
				bottleIsFull: null,
				bottleLastFillingLocation: null,
				bottleLastFillingTime: null,
				bottleTagBindTime: null,
				bottleTagUnbindTime: null,
				bottleTypeId: null,
				bottleUserId: null,
				bottleUpdateTime: null,
				bottleIsNew: null

			}

		},
		methods: {
			eleChange(val) {
				this.typeForm.personLiable = val;
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

			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},

			getBottlemanufacturer() {
				_http.http1('post', pathUrls.bottlemanufacturerSelect, {

				}, 'form').then((res) => {
					this.factoryList = res.data;
				})
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
				if(this.typeForm.flowInformation == 2 || this.typeForm.flowInformation == 4) {
					this.getStaffList(newId,2)
				} else if(this.typeForm.flowInformation == 1 || this.typeForm.flowInformation == 5) {
					this.getStaffList(newId,1)
				} else if(this.typeForm.flowInformation == 3) {
					this.getLiabilityUsers(newId)

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
			scrapDateChange(v) {
				this.typeForm.scrapDate = v;
			},
			//获取详情数据
			getBottleInfo() {
				_http.http1('get', pathUrls.platformInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					if(res.code == 0) {
						let datas = res.platformBottle
						this.typeForm.bottleTag = datas.bottleNfcId; //钢瓶电子标签编码
						this.typeForm.bottleCode = datas.bottleCode; //钢瓶条码
						this.typeForm.factoryCode = datas.bottleFactoryCode; //出厂编号
						this.typeForm.factoryName = datas.bottleManufacturer; //生产厂家
						this.typeForm.factoryTime = datas.bottleFactoryTime; //出厂时间
						this.typeForm.lastCheckTime = datas.bottleLastCheckTime; //上次检测时间
						this.typeForm.nextCheckTime = datas.bottleNextCheckTime; //下次检测时间
						this.typeForm.specification = datas.bottleSpecification; //钢瓶规格
						this.typeForm.bottleStatus = datas.bottleStatus; //钢瓶状态
						this.typeForm.checkStatus = datas.bottleCheckStatus; //钢瓶检测状态
						this.typeForm.flowInformation = datas.bottleFlowInformation; //当前业务状态
						this.createDept = datas.bottleCreateStation; //建档站点id
						this.typeForm.createDept = datas.bottleCreateStation + ''; //建档站点id
						this.typeForm.createDeptName = datas.createDeptName; //建档站点名字

						this.personLiable = datas.bottlePersonLiable;
						this.typeForm.personLiableName = datas.bottlePersonLiableName;
						if(datas.bottleFlowInformation == 1 || datas.bottleFlowInformation == 4) {
							this.typeForm.personLiable = datas.bottlePersonLiable + '';
						} else {
							this.typeForm.personLiable = datas.bottlePersonLiable;
						}

						this.typeForm.ownNumber = datas.ownNumber; //自有编号
						this.typeForm.equipmentVariety = datas.equipmentVariety; //设备品种
						this.typeForm.fillingMedium = datas.fillingMedium; //充装介质
						this.typeForm.scrapDate = datas.scrapDate; //报废时间
						this.typeForm.registrationCode = datas.registrationCode; //登记代码
						this.typeForm.nominalWorkingPressure = datas.nominalWorkingPressure; //公称工作压力
						this.typeForm.cylinderVolume = datas.cylinderVolume; //钢瓶容积
						this.typeForm.designWallThickness = datas.designWallThickness; //设计壁厚
						this.typeForm.remark = datas.remark; //备注

						this.bottleCreateTime = datas.bottleCreateTime;
						this.bottleCreater = datas.bottleCreater;
						this.bottleCreaterName = datas.bottleCreaterName;
						this.bottleFullValue = datas.bottleFullValue;
						this.bottleIsFull = datas.bottleIsFull;
						this.bottleLastFillingLocation = datas.bottleLastFillingLocation;
						this.bottleLastFillingTime = datas.bottleLastFillingTime;
						this.bottleTagBindTime = datas.bottleTagBindTime;
						this.bottleTagUnbindTime = datas.bottleTagUnbindTime;
						this.bottleTypeId = datas.bottleTypeId;
						this.bottleUserId = datas.bottleUserId;
						this.bottleUpdateTime = datas.bottleUpdateTime;
						this.bottleIsNew = datas.bottleIsNew;
						let id = this.typeForm.createDept ? this.typeForm.createDept : this.userData.deptId;

						if(this.typeForm.flowInformation == 2 || this.typeForm.flowInformation == 4) {
							this.getStaffList(id,2)
						} else if(this.typeForm.flowInformation == 1 || this.typeForm.flowInformation == 5) {
							this.getStaffList(id,1)
						} else if(this.typeForm.flowInformation == 3) {
							this.getLiabilityUsers(id)
							var result = this.userList.some(item => {
								if(item.userId == datas.bottlePersonLiable) {
									return true
								}
							})
							if(!result) {
								this.userList.push({
									userId: datas.bottlePersonLiable,
									userRealName: datas.bottlePersonLiableName
								})
							}

						}
					}

				})
			},
			//点击确定
			editCylClick() {
				let fData = {
					bottleDeptId: this.userData.deptId,
					bottleId: Number(this.$route.params.id), //钢瓶id
					bottleNfcId: this.typeForm.bottleTag, //电子标签编码
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
					bottleDeptId: this.typeForm.createDept,
					createDeptName: this.typeForm.createDeptName, //建档站点名字
					bottlePersonLiable: this.typeForm.personLiable, //责任人id
					// bottlePersonLiableName: this.typeForm.personLiableName, //责任人姓名
					bottleCreateTime: this.bottleCreateTime,
					bottleCreater: this.bottleCreater,
					bottleCreaterName: this.bottleCreaterName,
					bottleFullValue: this.bottleFullValue,
					bottleIsFull: this.bottleIsFull,
					bottleLastFillingLocation: this.bottleLastFillingLocation,
					bottleLastFillingTime: this.bottleLastFillingTime,
					bottleTagBindTime: this.bottleTagBindTime,
					bottleTagUnbindTime: this.bottleTagUnbindTime,
					bottleTypeId: this.bottleTypeId,
					bottleUserId: this.bottleUserId,
					bottleUpdateTime: this.bottleUpdateTime,
					bottleIsNew: this.bottleIsNew,
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
				var regExp = /^[0-9a-zA-Z]*$/g
				var regExp1 = /^[0-9a-zA-Z]*$/g
				var regExp2 = /^[0-9a-zA-Z]*$/g
				if(fData.bottleCode == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入钢瓶条码!',
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
				if(!regExp.test(fData.bottleCode)) {
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
				if(!fData.bottleManufacturer) {
					this.$Message['warning']({
						background: true,
						content: '请选择生产厂家!',
						duration: 1
					});
					return false
				}
				if(!fData.bottleFactoryTime) {
					this.$Message['warning']({
						background: true,
						content: '请选择出厂时间!',
						duration: 1
					});
					return false
				}
				if(!fData.bottleLastCheckTime) {
					this.$Message['warning']({
						background: true,
						content: '请选择末次检验时间!',
						duration: 1
					});
					return false
				}
				if(!fData.bottleNextCheckTime) {
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

				if(fData.bottleCheckStatus == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择钢瓶检测状态!',
						duration: 1
					});
					return false
				}
				if(fData.ownNumber && fData.ownNumber.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '自有编号过长!',
						duration: 1
					});
					return false
				}
				if(fData.equipmentVariety && fData.equipmentVariety.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '设备品种过长!',
						duration: 1
					});
					return false
				}
				if(fData.fillingMedium && fData.fillingMedium.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '充装介质过长!',
						duration: 1
					});
					return false
				}
				if(fData.registrationCode && fData.registrationCode.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '登记代码过长!',
						duration: 1
					});
					return false
				}
				if(fData.nominalWorkingPressure && fData.nominalWorkingPressure.length > 16) {
					this.$Message['warning']({
						background: true,
						content: '公称工作压力过长!',
						duration: 1
					});
					return false
				}
				if(fData.cylinderVolume && fData.cylinderVolume.length > 16) {
					this.$Message['warning']({
						background: true,
						content: '钢瓶容积过长!',
						duration: 1
					});
					return false
				}
				if(fData.designWallThickness && fData.designWallThickness.length > 16) {
					this.$Message['warning']({
						background: true,
						content: '设计壁厚过长!',
						duration: 1
					});
					return false
				}
				if(fData.remark && fData.remark.length > 64) {
					this.$Message['warning']({
						background: true,
						content: '备注过长!',
						duration: 1
					});
					return false
				}
					this.isDisabled=true;
				_http.http2('post', pathUrls.platformUpdate, fData).then((res) => {
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
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
		},
		mounted() {
			this.getBottlemanufacturer(this.$store.state.cylAddInfo);
			this.getBottleInfo()
			this.common.getDeptList(this.userData.deptId).then((res) => {
				this.options1 = this.common.getConDept(res.data, 0, 0, 1)
			})
			this.common.getBottleSpecList().then(res => {
				this.specList=res.data;
			})
			this.common.getBottleMediumList().then(res => {
				this.fillMediumList=res.data;
			})
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