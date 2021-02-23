<template>
	<div class="mainBorder">
		<div class='mainHeader'>
		    <span>编辑</span>
		    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="120">
				<FormItem label="所属组织" class='organize star'>

					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organize" @change='organizeSelected' style="width:380px;"></el-cascader>
					<!--<Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>-->

				</FormItem>
				<!--<FormItem label="车辆编号" class='vehicleNumber star'>
					<Input v-model="typeForm.vehicleNumber" placeholder="车辆编号" />
				</FormItem>-->
				<FormItem label="车辆类型" class='carType star'>
					<Select v-model="typeForm.carType" style="width: 380px;">
						<Option :value="2">箱式货车</Option>
						<Option :value="3">敞开式货车</Option>
						<Option :value="4">其他</Option>
					</Select>
				</FormItem>
				<FormItem label="车牌号" class='carName star'>
					<Input v-model="typeForm.carName" placeholder="车牌号" />
				</FormItem>
				<!--<FormItem label="所属组织" class='star'>
					<el-cascader :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeOwn" @change='organizeSelected'></el-cascader>
				</FormItem>-->
				<FormItem label="生产厂家" class='factory star'>
					<Input v-model="typeForm.factory" placeholder="生产厂家" />
				</FormItem>
				<FormItem label="型号" class='disType star'>
					<Input v-model="typeForm.disType" placeholder="型号" />
				</FormItem>

				<FormItem label="智能终端" class='terminalCode'>
					<Select v-model="typeForm.terminalCode" style="width: 380px;" multiple>
						<Option v-for="item in terList" :value="item.value" :key="item.value">{{item.name}}</Option>
						<!--<Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>-->
					</Select>
				</FormItem>
				<FormItem label="购置时间" class='dateTime'>
					<DatePicker type="datetime" placeholder="请选择购置时间" style="width: 380px;" v-model='typeForm.dateTime' format="yyyy-MM-dd HH:mm:ss" @on-change="timeChange" :editable='false'></DatePicker>
				</FormItem>
				<!--<FormItem label="所載气瓶数" class='bottleCount'>
					<Input v-model="typeForm.bottleCount" placeholder="所載气瓶数" />
				</FormItem>-->
				<FormItem label="配送员">
					<Select v-model="typeForm.staffPerson" filterable style="width:380px;" label-in-value @on-change='changePerson'>
						<Option v-for="item in staffPersonList" :value="item.staffId" :key="item.staffId" :tag='item.staffWorkCode'>{{ item.staffName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="押运员">
					<Select v-model="typeForm.escortStaff" filterable style="width:380px;">
						<Option v-for="item in escortStaffList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="运输单位" class='transPort' br/>
				<Form ref="formInfo" :model="formInfo" :label-width="180">
					<FormItem label="单位名称" class='corporateName'>
						<Input v-model="formInfo.corporateName" placeholder="请输入单位名称" />
					</FormItem>
					<FormItem label="联系人" class='connectName'>
						<Input v-model="formInfo.connectName" placeholder="请输入联系人" />
					</FormItem>
					<FormItem label="联系方式" class='phone'>
						<Input v-model="formInfo.phone" placeholder="请输入联系方式" />
					</FormItem>
				</Form>

				</FormItem>
				<FormItem label="是否启用" class='isActive'>
					<i-switch v-model="typeForm.isActive" size="large" false-color="#ff4949">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<FormItem label="电子围栏" class='eleFence'>
					<Button type="success" @click='addfileFuc'>编辑围栏</Button>
				</FormItem>
			
			</Form>
      <div class="mainBodyButton" v-has='913'>
         <Button type="primary" @click='editfileFuc' :disabled="isDisabled">确定</Button>
         <Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
      </div>
		</div>
		<eleMap v-if='eleShow' @eleShow='handleEleClick' @pathArrs='getPathArrs' :newPath='pathArrs'></eleMap>
	</div>
</template>

<script>
	import eleMap from '@/pages/comComponent/eleMap';
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'editFileD',
		components: {
			eleMap
		},
		data() {
			return {
				isDisabled:false,
				formInfo: {
					corporateName: '',
					connectName: '',
					phone: ''
				},
				eleShow: false,
				terList: [],
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				typeForm: {
					organize: '',
					vehicleNumber: '',
					carType: null,
					carName: '',
					factory: '',
					disType: '',
					terminalCode: [],
					bottleCount: '',
					isActive: true,
					dateTime: '',
					staffPerson: '',
					escortStaff: '',

				},
				newTerid: [],
				newCode: [],
				newTerid: [],
				pathArrs: [],
				vehicleNumber: '',
				bottleCount: '',
				carStatus: null,
				createTime: null,
				createrId: null,
				onlineFlag: null,
				rfId: null,
				staffId: null,
				workCode: null,
				newDateTime: '',
				timeChanges: false,
				escortStaffList: [],
				staffPersonList: [],
				terminalUserCode:''

			}
		},
		methods: {
			changePerson(v){
				if(v){

					this.terminalUserCode=v.tag
				}
			},
			//获取配送员
			getStaffName(c) {
				_http.http1('post', pathUrls.queryCurrentDeptStaff, {
					deptId: c,
//					carType: 6
				}, 'form').then((res) => {
					//        console.log(res);
					this.staffPersonList = res.data;
				})
			},
			//获取押运员接口
			getEscortStaff(c) {
				_http.http1('post', pathUrls.queryEscortStaff, {
					deptId: c

				}, 'form').then((res) => {
					//        console.log(res);
					this.escortStaffList = res.data;
				})
			},
			//编辑围栏
			addfileFuc() {
				this.eleShow = true
			},
			//显示地图
			handleEleClick(data) {
				this.eleShow = false
			},
			//接收地图围栏数据
			getPathArrs(data) {
				if(data.length) {
					this.pathArrs = data
				}

			},
			
			//选中组织下拉框
			organizeSelected(value) {
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.organize = id
					if(id != this.newDepid) {
						this.typeForm.terminalCode = []
					} else {
						this.typeForm.terminalCode = this.newTerid
					}
					this.getTerminals(id)
					this.getEscortStaff(id)
					this.getStaffName(id)
				}
			},
			timeChange(v) {
				this.typeForm.dateTime = v
				this.timeChanges = true
			},
			//获取智能终端
			getTerminals(deptId) {
				_http.http1('post', pathUrls.getTerminal, {
					deptId: deptId,
					terminalType: 6
				}, 'form').then((res) => {
					this.terList = res.data
					if(this.newCode.length && deptId == this.newDepid) {
						for(let item of this.newCode) {
							this.terList.push({
								'name': item,
								'value': item
							})
						}
					}

				})
			},
			//获取详情
			getFileList() {
				this.newCode = [];
				_http.http1('get', pathUrls.getCarinfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					let datas = res.carInfo
					this.typeForm.organize = datas.deptId + '';
					this.newDepid = datas.deptId + '';
					this.typeForm.carType = datas.vehicleType;
					this.typeForm.carName = datas.carNumber;
					this.typeForm.factory = datas.carFactory;
					this.typeForm.disType = datas.carModel;
					this.typeForm.terminalCode = JSON.parse(datas.terminalCode);
					this.newTerid = JSON.parse(datas.terminalCode);
					this.newCode = JSON.parse(datas.terminalCode);
					this.typeForm.dateTime = datas.acquisitionTime;
					this.newDateTime = datas.acquisitionTime;
					this.typeForm.isActive = datas.isActive == 1 ? true : false;
					this.pathArrs = datas.carRange ? JSON.parse(datas.carRange)[0] : [];
					this.bottleCount = datas.bottleCount;
					this.vehicleNumber = datas.vehicleNumber;
					this.createTime = datas.createTime;
					this.carStatus = datas.carStatus;
					this.createrId = datas.createrId;
					if(datas.transportDept){
					let newTransportDept = JSON.parse(datas.transportDept);
					this.formInfo.corporateName = newTransportDept.transportDeptName;
					this.formInfo.connectName = newTransportDept.contacts;
					this.formInfo.phone = newTransportDept.telephone;
					}


					this.onlineFlag = datas.onlineFlag;
					this.rfId = datas.rfId;
					this.staffId = datas.staffId;
					//					this.staffName = datas.staffName;
					this.workCode = datas.workCode;
					this.getTerminals(this.typeForm.organize)
					this.getEscortStaff(this.typeForm.organize)
					this.getStaffName(this.typeForm.organize)
					this.typeForm.staffPerson = datas.staffId;
					this.typeForm.escortStaff = datas.supercargoId;
					if(datas.terminalUserCode){
					this.terminalUserCode=datas.terminalUserCode;
					}

				})
			},

			editfileFuc() {
				let transportDept = {
					"transportDeptName": this.formInfo.corporateName,
					"contacts": this.formInfo.connectName,
					"telephone": this.formInfo.phone
				}
				let fData = {
					id: this.$route.params.id,
					deptId: this.typeForm.organize, //所属平台id
					carNumber: this.typeForm.carName, //车牌号
					carFactory: this.typeForm.factory, //生产厂家
					carModel: this.typeForm.disType, //型号
					terminalCode: JSON.stringify(this.typeForm.terminalCode), //智能终端
					acquisitionTime: this.timeChanges == true ? this.typeForm.dateTime : this.newDateTime, //购置时间
					isActive: this.typeForm.isActive == true ? 1 : 0, //是否启用
          			status: this.typeForm.isActive == true ? 1 : 0, //是否启用
					vehicleType: this.typeForm.carType, //车辆类型
					carRange:this.pathArrs.length?JSON.stringify([this.pathArrs]):JSON.stringify([[this.pathArrs]]), //围栏数组
					vehicleNumber: this.vehicleNumber, //车辆编号
					createTime: this.createTime, //创建时间
					carStatus: this.carStatus,
					createrId: this.createrId,
					onlineFlag: this.onlineFlag,
					rfId: this.rfId,
					
					workCode: this.workCode,
					bottleCount: this.bottleCount,
					transportDept: JSON.stringify(transportDept), //运输单位
					staffId: this.typeForm.staffPerson, //配送员
					supercargoId: this.typeForm.escortStaff, //押运员
					terminalUserCode:this.terminalUserCode
				}


				if(fData.deptId == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择所属组织!',
						duration: 1
					});
					return false
				}
				if(fData.vehicleType == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择车辆类型!',
						duration: 1
					});
					return false
				}
				if(fData.carNumber == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写车牌号!',
						duration: 1
					});
					return false
				}
				if(fData.carNumber.length > 8) {
					this.$Message['warning']({
						background: true,
						content: '车牌号过长!',
						duration: 1
					});
					return false
				}
				var regExp = /^[\u4E00-\u9FA5A-Za-z0-9-]+$/
				if(!regExp.test(fData.carNumber)) {
					this.$Message['warning']({
						background: true,
						content: '车牌号不能包含特殊字符!',
						duration: 1
					});
					return false;
				}
				if(fData.carFactory == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写生产厂家!',
						duration: 1
					});
					return false
				}
				if(fData.carFactory.length > 35) {
					this.$Message['warning']({
						background: true,
						content: '生产厂家内容过长!',
						duration: 1
					});
					return false
				}
				if(fData.carModel == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写型号',
						duration: 1
					});
					return false
				}
				if(fData.carModel.length > 35) {
					this.$Message['warning']({
						background: true,
						content: '型号内容过长!',
						duration: 1
					});
					return false
				}
				if(transportDept.transportDeptName&&transportDept.transportDeptName.length>32){
					this.$Message['warning']({
						background: true,
						content: '单位名称内容过长!',
						duration: 1
					});
					return false
				}
				if(transportDept.contacts&&transportDept.contacts.length>15){
					this.$Message['warning']({
						background: true,
						content: '联系人姓名过长!',
						duration: 1
					});
					return false
				}
				if(transportDept.telephone){
				if(!this.common.isPoneAvailable(transportDept.telephone)) {
					this.$Message['warning']({
						background: true,
						content: '请输入正确的联系方式!',
						duration: 1
					});
					return false
				}
				}
				this.isDisabled=true;
				_http.http2('post', pathUrls.carinfoUpdate, fData).then((res) => {
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
			handleBackClick() {
				this.$router.go(-1)
			},

		},
		mounted() {
			this.common.getDeptList(this.userData.deptId).then((res) => {
			this.options = this.common.getConDept(res.data, 0, 0, 1)
		})

			this.getFileList()
		}
	}
</script>

<style type="text/css" scoped>
	
	.ivu-form-item {
		margin-bottom: 10px;
		width: 500px;
	}

	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}

	.transPort {
		margin-bottom: 0;
	}
</style>
