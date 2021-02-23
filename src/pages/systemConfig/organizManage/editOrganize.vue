<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>编辑</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="150">
				<FormItem label="上级组织" class='star' v-if='topId'>
					<!--<Input v-model="typeForm.organizeUnit" placeholder="选择组织" disabled class='organizeUnit'></Input>-->
					<el-cascader style='width:380px' :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeUnit" @change='organizeSelected'></el-cascader>
				</FormItem>
				<FormItem label="上级组织" class='star' v-else>
					<Input v-model="typeForm.organizeUnit1" disabled class='organizeUnit' style='width:380px' />
				</FormItem>
				<FormItem label="组织名称" class='orgName star'>
					<Input v-model="typeForm.organizeName" placeholder="请输入组织名称" maxlength="50" show-word-limit style='width:380px' />
				</FormItem>
				<FormItem label="组织类别" class='orgType star' v-if='typeForm.organizeUnit==1||typeForm.organizeUnit1=="平台"'>
					<Select v-model="typeForm.organizeType" style='width: 380px;'>
						<Option :value="1" key="1">燃气公司</Option>
						<Option :value="2" key="2">检测站</Option>
					</Select>
				</FormItem>
				<FormItem label="组织类型" class='orgType star' v-if='typeForm.organizeType==1'>
					<Select v-model="typeForm.orgType" @on-change='changeOrgType ' style='width:380px'>
						<Option :value="1" key="1">燃气公司</Option>
						<Option :value="2" key="2">充装站</Option>
						<Option :value="3" key="3">供应站/中转站</Option>
						<Option :value="4" key="4">管理片区</Option>
						<Option :value="5" key="5">门店</Option>
					</Select>
				</FormItem>
				<FormItem label="责任人" class='orgPerson'>
					<Select v-model="typeForm.orgPerson" style='width:380px'>
						<Option v-for="item in personList" :value="item.staffId" :key="item.staffId">{{ item.staffName}}</Option>
					</Select>
				</FormItem>
				<!--<FormItem label="液化气销售单价" class='uniPrice'>
					<Input v-model="typeForm.unitPrice" placeholder="人民币（元）"></Input>
				</FormItem>-->
				<FormItem label="所属省份">
					<Select v-model="typeForm.province" style="width:380px" @on-change='selectProvince' label-in-value>
						<Option v-for="item in provinceList" :value="item.areaCode" :key="item.areaCode" :tag='{"lng":item.lng,"lat":item.lat}'>{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="所属市">
					<Select v-model="typeForm.city" style="width:380px" @on-change='selectCity' label-in-value clearable>
						<Option v-for="item in cityList" :value="item.areaCode" :key="item.areaCode" :tag='{"lng":item.lng,"lat":item.lat}'>{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="所属区县">
					<Select v-model="typeForm.country" style="width:380px" @on-change='selectCountry' label-in-value clearable>
						<Option v-for="item in countryList" :value="item.areaCode" :key="item.areaCode" :tag='{"lng":item.lng,"lat":item.lat}'>{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="所属街道">
					<Select v-model="typeForm.street" style="width:380px" label-in-value @on-change='selectStreet' clearable>
						<Option v-for="item in streetList" :value="item.areaCode" :key="item.areaCode" :tag='{"lng":item.lng,"lat":item.lat}'>{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="经纬度" class='star' v-if='mustLng'>
					<div class='fllexForm'>
						<div @click='seeMapClick' class='mapLook'>
							查看地图

						</div>
						<!--<div>
							<Input v-model="typeForm.seeMap" placeholder="查看地图"  class="seeMap"></Input>
							<div  @click='seeMapClick' class='mapDev'></div>
						</div>-->
						<Input v-model="typeForm.longitude" placeholder="经度" disabled />
						<Input v-model="typeForm.latitude" placeholder="纬度" disabled />
					</div>
				</FormItem>
				<FormItem label="经纬度" v-else>
					<div class='fllexForm'>
						<div @click='seeMapClick' class='mapLook'>
							查看地图

						</div>
						<!--<div>
							<Input v-model="typeForm.seeMap" placeholder="查看地图"  class="seeMap"></Input>
							<div  @click='seeMapClick' class='mapDev'></div>
						</div>-->
						<Input v-model="typeForm.longitude" placeholder="经度" />
						<Input v-model="typeForm.latitude" placeholder="纬度" />
					</div>
				</FormItem>
				<FormItem label="详细地址" class='adrInfo'>
					<Input v-model="typeForm.adressInfo" placeholder="详细地址" style='width:380px' />
				</FormItem>
				<FormItem label="排序号" class='adrInfo star'>
					<Input v-model="typeForm.orderNum" placeholder="请输入排序号" style='width:380px' />
				</FormItem>
				<FormItem label="是否显示地图" class='adrInfo'>
					<i-switch v-model="typeForm.mapDisplay" size="large" false-color="#ff4949" :true-value='1' :false-value='0'>
						<span slot="open">呈现</span>
						<span slot="close">隐藏</span>
					</i-switch>
				</FormItem>
				<FormItem label="公司简称(首字母)" class='adrInfo star' v-if='typeForm.organizeUnit==1||typeForm.organizeUnit1=="平台"'>
					<Input v-model="typeForm.acronym" placeholder="请输入首字母简写" @on-keyup="typeForm.acronym=typeForm.acronym.replace(/^ +| +$/g,'')" style='width:380px' />
				</FormItem>
				<FormItem label="合同章" class='staffFace' v-if='typeForm.organizeUnit==1'>
					<Upload :on-success='handleUploadSuccess' :show-upload-list="false" type="drag" :action="fileUrl">
						<div style="margin-top:25px">
							<Icon type="ios-cloud-upload" size="52" style="color: #3399ff;" v-if='!typeForm.contractSeal'></Icon>
							<!-- <p>Click or drag files here to upload</p> -->
							<img :src="typeForm.contractSeal" alt="" style="width: 100px;height: 100px;position: absolute;left: 0;top:0" />
						</div>
					</Upload>
				</FormItem>
				<FormItem label="钢瓶到期时间" class='adrInfo' v-if='typeForm.organizeUnit==1||typeForm.organizeUnit1=="平台"'>
					<!--<DatePicker type="datetime" placeholder="请选择到期时间" style="width: 380px;" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.expirationDate'></DatePicker>-->
					<InputNumber :min='0' v-model="typeForm.expirationDate" style='width: 380px;' />
				</FormItem>
				<FormItem label="网格化用户颜色配置" class='adrInfo'>
					<Input type="text" style="width:100px;" v-model="typeForm.colorPicker" readonly />
					<ColorPicker v-model="typeForm.colorPicker" @on-change='colorChange' />
				</FormItem>
				<!--<FormItem label="未安检客户报警天数" class='adrInfo' v-if='typeForm.organizeUnit==1||typeForm.organizeUnit1=="平台"'>
					<InputNumber :min='0' v-model="typeForm.userCheckExpireDateNum"  style='width: 380px;'/>
				</FormItem>-->

			</Form>
			<div class="mainBodyButton">
				<Button type="primary" @click='handleEditClick' :disabled="isDisabled">确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>
		</div>
		<aMap v-if='isShow' :langs='typeForm.longitude' :lats='typeForm.latitude' @isShow='handleIsShow' @mapData='getMapData'></aMap>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import {
		pathUrls
	} from '@/public/path';
	import aMap from './aMap1';
	import Bus from '@/public/bus';
	// import { Cascader } from 'element-ui'
	export default {
		name: 'editOrganize',
		components: {
			aMap
		},
		data() {
			return {
				isDisabled: false,
				fileUrl: pathUrls.fileUpload,
				//				fileUrl: 'https://sys.payq-iot.com:8089/file/upload',
				//				fileUrl: 'https://source.payq-iot.com:8089/file/upload',
				newDep: '',
				topId: false,
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				isShow: false,
				typeForm: {
					colorPicker: '#1890ff',
					organizeName: '',
					organizeUnit: '',
					organizeUnit1: '',
					unitPrice: '',
					province: '',
					city: '',
					country: '',
					street: '',
					seeMap: '',
					longitude: '',
					latitude: '',
					adressInfo: '',
					orgType: null,
					orgPerson: null,
					orderNum: 0,
					mapDisplay: 0,
					acronym: '',
					contractSeal: '',
					expirationDate: null,
					organizeType: 1,
					userCheckExpireDateNum: null
				},
				provinceList: [],
				cityList: [],
				countryList: [],
				streetList: [],
				personList: [],
				fdeptId: '',
				fname: '',
				nameArr: [],
				mustLng: true
			}
		},
		methods: {
			//改变网格化管理颜色配置
			colorChange(v) {
				if(v) {} else {
					this.typeForm.colorPicker = '#1890ff';
				}

			},
			//合同章上传成功
			handleUploadSuccess(res, file) {
				//				console.log(res.data.src)
				this.typeForm.contractSeal = res.data.src
			},
			//改变组织类型
			changeOrgType(v) {
				if(v == 4) {
					this.mustLng = false;
					this.typeForm.longitude = '';
					this.typeForm.latitude = '';
				} else {
					this.mustLng = true;
				}
			},
			//地图
			getMapData(data) {
				if(data.long) {
					this.typeForm.longitude = data.long
					this.typeForm.latitude = data.lat

				}
				if(data.addr) {
					this.typeForm.adressInfo = data.addr
				}
			},
			//地图显示隐藏
			handleIsShow(data) {
				this.isShow = data
			},

			//获取部门责任人数据
			getPersonList(id) {
				_http.http1('post', pathUrls.staffGetResponsible, {
					deptId: id
				}, 'form').then((res) => {
					this.personList = res.data

				}).catch((res) => {

				})
			},
			//点击修改按钮
			handleEditClick() {
				let fData = {
					deptId: this.$route.params.id,
					name: this.typeForm.organizeName,
					bottlePrice: this.typeForm.unitPrice,
					provinceCode: this.typeForm.province,
					cityCode: this.typeForm.city,
					areaCode: this.typeForm.country,
					streetCode: this.typeForm.street,
					lng: this.typeForm.longitude,
					lat: this.typeForm.latitude,
					address: this.typeForm.adressInfo,
					type: this.typeForm.orgType,
					responsible: this.typeForm.orgPerson,
					orderNum: this.typeForm.orderNum,
					mapDisplay: this.typeForm.mapDisplay,
					contractStamp: this.typeForm.contractSeal,
					nameAbbr: this.typeForm.acronym,
					bottleExpierDateNum: this.typeForm.expirationDate,
					category: this.typeForm.organizeType,
					color: this.typeForm.colorPicker
					//userCheckExpireDateNum:this.typeForm.userCheckExpireDateNum
				}
				if(this.topId == true) {
					fData.parentId = this.typeForm.organizeUnit
				} else {
					fData.parentId = this.fdeptId
				}
				//				console.log(fData)
				if(fData.parentId == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择上级组织!',
						duration: 1
					});
					return false
				}
				if(fData.name == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写组织名称!',
						duration: 1
					});
					return false
				}
				if(fData.name.length > 50) {
					this.$Message['warning']({
						background: true,
						content: '组织名称内容过长!',
						duration: 1
					});
					return false
				}
				if(fData.category == 1 && fData.type == null) {
					this.$Message['warning']({
						background: true,
						content: '请选择组织类型!',
						duration: 1
					});
					return false
				}
				if(this.mustLng && !fData.lng) {
					this.$Message['warning']({
						background: true,
						content: '经纬度不能为空!',
						duration: 1
					});
					return false
				}
				if(this.typeForm.organizeUnit == 1 || this.typeForm.organizeUnit1 == '平台') {
					if(!this.typeForm.acronym) {
						this.$Message['warning']({
							background: true,
							content: '公司简称请输入首字母!',
							duration: 1
						});
						return false
					}

					if(!this.common.judgeZm(this.typeForm.acronym)) {
						this.$Message['warning']({
							background: true,
							content: '首字母简写格式错误!',
							duration: 1
						});
						return false
					}
					if(this.typeForm.acronym.length > 10) {
						this.$Message['warning']({
							background: true,
							content: '首字母简写过长!',
							duration: 1
						});
						return false
					}
				}
				this.isDisabled = true;
				_http.http2('post', pathUrls.deptUpdate, fData).then((res) => {
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
			//获取详情接口
			getOrganizeInfo(id) {
				_http.http1('get', pathUrls.deptInfo + '/' + id, {}, 'form').then((res) => {
					this.getAreaInfo(0, 'provinceList')
					let datas = res.dept;
					//this.typeForm.userCheckExpireDateNum=datas.userCheckExpireDateNum;
					if(datas.color) {
						this.typeForm.colorPicker = datas.color;
					}

					this.typeForm.organizeType = datas.category;
					this.typeForm.expirationDate = datas.bottleExpierDateNum;
					this.typeForm.contractSeal = datas.contractStamp;
					this.typeForm.acronym = datas.nameAbbr;
					this.typeForm.organizeName = datas.name; //组织名称
					this.newDep = datas.parentId;
					this.typeForm.organizeUnit = datas.parentId; //组织部门
					this.typeForm.orgType = datas.type; //组织类型
					this.typeForm.longitude = datas.lng; //经度
					this.typeForm.latitude = datas.lat; //纬度
					if(this.typeForm.orgType == 4) {
						this.mustLng = false;
						this.typeForm.longitude = '';
						this.typeForm.latitude = '';
					} else {
						this.mustLng = true;
						this.typeForm.longitude = datas.lng;
						this.typeForm.latitude = datas.lat;
					}
					this.typeForm.orgPerson = datas.responsible + ''; //部门责任人
					this.typeForm.unitPrice = datas.bottlePrice; //单价
					this.typeForm.province = Number(datas.provinceCode); //省
					this.typeForm.city = Number(datas.cityCode); //市
					this.typeForm.country = Number(datas.areaCode); //区
					this.typeForm.street = Number(datas.streetCode); //街道

					this.fdeptId = datas.parentId;
					this.typeForm.adressInfo = datas.address; //详细地址
					this.typeForm.orderNum = datas.orderNum; //排序号
					this.typeForm.mapDisplay = datas.mapDisplay ? 1 : 0;
					this.getAreaInfo(Number(datas.provinceCode), 'cityList');
					this.getAreaInfo(Number(datas.cityCode), 'countryList');
					this.getAreaInfo(Number(datas.areaCode), 'streetList');
					if(this.fdeptId != 0) {
						this.getFname();
					} else {
						this.typeForm.organizeUnit1 = '平台';
					}

					this.getPersonList(datas.deptId)

				}).catch((res) => {

				})
			},
			//递归数据
			getTitle(menus) {
				//				this.nameArr=[]	;
				return menus.map((menu) => {
					if(menu.children.length > 0) {
						this.getTitle(menu.children);
					}
					if(menu.children.length == 0) {
						delete menu.children;
					}
					menu.value = menu.deptId;
					menu.label = menu.name

					if(this.fname == menu.name) {
						this.nameArr.push(menu.name)

					} else {

					}

					return menu;
				})
			},
			//获取上级部门
			getFname() {
				_http.http1('get', pathUrls.deptInfo + '/' + this.fdeptId, {}, 'form').then((res) => {
					if(res.dept) {
						this.fname = res.dept.name
					}

					this.getOrganizeList()

				})
			},
			//获取组织列表
			getOrganizeList() {
				_http.http3('get', pathUrls.deptTree, {
					deptId: this.userData.deptId
				}).then((res) => {
					this.options = this.getTitle(res.data)
					if(this.nameArr.length) {
						this.topId = true
					} else {
						this.topId = false;
						this.typeForm.organizeUnit1 = this.fname || '平台';
					}
				}).catch((res) => {

				})

			},
			//选中组织下拉框
			organizeSelected(value) {

				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.organizeUnit = id

				}
			},
			//点击查看地图
			seeMapClick() {
				this.isShow = true
			},
			//改变省
			selectProvince(v) {
				this.getAreaInfo(this.typeForm.province, "cityList");
				this.typeForm.city = '';
				this.typeForm.country = '';
				this.typeForm.street = '';
				this.typeForm.adressInfo = '';
				if(v) {
					this.typeForm.longitude = v.tag.lng;
					this.typeForm.latitude = v.tag.lat;
				}
			},
			//改变市
			selectCity(v) {

				this.typeForm.country = '';
				this.typeForm.street = '';
				this.typeForm.adressInfo = '';
				if(v) {
					this.getAreaInfo(this.typeForm.city, 'countryList');
					this.typeForm.longitude = v.tag.lng;
					this.typeForm.latitude = v.tag.lat;
				} else {
					this.typeForm.longitude = '';
					this.typeForm.latitude = '';
				}
			},
			//改变县
			selectCountry(v) {

				this.typeForm.street = '';
				this.typeForm.adressInfo = '';
				if(v) {
					this.getAreaInfo(this.typeForm.country, 'streetList');
					this.typeForm.longitude = v.tag.lng;
					this.typeForm.latitude = v.tag.lat;
				} else {
					this.typeForm.longitude = '';
					this.typeForm.latitude = '';
				}
			},
			//改变街道
			selectStreet(v) {
				if(v) {
					this.typeForm.longitude = v.tag.lng;
					this.typeForm.latitude = v.tag.lat;
				} else {
					this.typeForm.longitude = '';
					this.typeForm.latitude = '';
				}
			},
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},

			//获取省市区
			getAreaInfo(cCode, areaLis) {
				_http.http1('post', pathUrls.cityInfo, {
					'parentCode': cCode
				}, 'form').then((res) => {
					this[areaLis] = res.data

				})
			}

		},
		mounted() {

			Bus.$off('isShow').$on('isShow', (data) => {
				this.isShow = data
			})
			Bus.$off('mapData').$on('mapData', (data) => {

				if(data.long) {
					this.typeForm.longitude = data.long
					this.typeForm.latitude = data.lat
					this.typeForm.adressInfo = data.addr

				}
			})

			this.getOrganizeInfo(this.$route.params.id)

		}

	}
</script>

<style scoped>
	.mainContent>>>.organizeUnit input {
		cursor: pointer;
		background: 0;
		color: #000;
	}
	
	.mainContent>>>.ivu-input {
		/*width: 80%;*/
		background: 0;
		color: #000;
	}
	
	.fllexForm {
		display: flex;
	}
	
	.fllexForm>>>.ivu-input-wrapper {
		width: 147px !important;
		margin-right: 20px;
	}
	
	.seeMap>>>.ivu-input[disabled] {
		cursor: pointer !important;
	}
	
	.mapLook {
		margin-right: 10px;
		cursor: pointer;
		color: #66B1FF;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	
	.mainBody>>>.ivu-form-item {
		margin-bottom: 12px;
	}
	
	.mainBody>>>.el-radio__inner {
		border: 0;
		background-color: inherit;
		background: #f00;
		border: 1px solid #f00;
	}
	
	.mainBody>>>.el-radio__input.is-checked .el-radio__inner {
		background: none;
	}
	
	.mainBody>>>.el-radio {
		height: 100%;
		width: 150px;
		position: absolute;
	}
	
	.mainBody>>>.ivu-upload {
		width: 100px;
		height: 100px;
		vertical-align: middle;
	}
</style>