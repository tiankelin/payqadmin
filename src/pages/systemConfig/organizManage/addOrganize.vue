<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>新增</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="150">
				<FormItem label="上级组织" class='star organizeUnit'>
					<!--<Input v-model="typeForm.organizeUnit" placeholder="选择组织" disabled class='organizeUnit'></Input>-->
					<el-cascader style='width: 380px;' ref="cascaderAddr" :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeUnit" @change='organizeSelected'></el-cascader>
				</FormItem>
				<FormItem label="组织名称" class='orgName star'>
					<Input v-model="typeForm.organizeName" placeholder="请输入组织名称" style='width: 380px;' />
				</FormItem>
				<FormItem label="组织类别" class='orgType star' v-if='typeForm.organizeUnit==1'>
					<Select v-model="typeForm.organizeType" style='width: 380px;'>
						<Option :value="1" key="1">燃气公司</Option>
						<Option :value="2" key="2">检测站</Option>
					</Select>
				</FormItem>
				<FormItem label="组织类型" class='orgType star' v-if='typeForm.organizeType==1'>
					<Select v-model="typeForm.orgType" @on-change='changeOrgType' style='width: 380px;'>
						<Option :value="1" key="1">燃气公司</Option>
						<Option :value="2" key="2">充装站</Option>
						<Option :value="3" key="3">供应站/中转站</Option>
						<Option :value="4" key="4">管理片区</Option>
						<Option :value="5" key="5">门店</Option>
					</Select>
				</FormItem>
				<!--<FormItem label="责任人" class='orgPerson'>
					<Select v-model="typeForm.orgPerson" style='width: 380px;'>
						<Option v-for="item in personList" :value="item.userId" :key="item.userId">{{ item.username }}</Option>
					</Select>
					
				</FormItem>-->
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
							<!--<Input v-model="typeForm.seeMap" placeholder="查看地图"  class="seeMap" @click='seeMapClick' style="cursor: pointer;"></Input>-->
						</div>
						<Input v-model="typeForm.longitude" placeholder="经度" disabled></Input>
						<Input v-model="typeForm.latitude" placeholder="纬度" disabled></Input>
					</div>
				</FormItem>
				<FormItem label="经纬度" v-else>
					<div class='fllexForm'>
						<div @click='seeMapClick' class='mapLook'>
							查看地图
							<!--<Input v-model="typeForm.seeMap" placeholder="查看地图"  class="seeMap" @click='seeMapClick' style="cursor: pointer;"></Input>-->
						</div>
						<Input v-model="typeForm.longitude" placeholder="经度"></Input>
						<Input v-model="typeForm.latitude" placeholder="纬度"></Input>
					</div>
				</FormItem>
				<FormItem label="详细地址" class='adrInfo'>
					<Input v-model="typeForm.adressInfo" placeholder="详细地址" style='width: 380px;' />
				</FormItem>
				<FormItem label="排序号" class='adrInfo star'>
					<Input v-model="typeForm.orderNum" placeholder="请输入排序号" style='width: 380px;' />
				</FormItem>
				<FormItem label="是否显示地图" class='adrInfo'>
					<i-switch v-model="typeForm.mapDisplay" size="large" false-color="#ff4949" :true-value='1' :false-value='0'>
						<span slot="open">呈现</span>
						<span slot="close">隐藏</span>
					</i-switch>
				</FormItem>
				<FormItem label="公司简称(首字母)" class='adrInfo star' v-if='typeForm.organizeUnit==1'>
					<Input v-model="typeForm.acronym" placeholder="请输入首字母简写" @on-keyup="typeForm.acronym=typeForm.acronym.replace(/^ +| +$/g,'')" style='width: 380px;' />
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
				<FormItem label="钢瓶到期时间" class='adrInfo' v-if='typeForm.organizeUnit==1'>
					<!--<DatePicker type="datetime" placeholder="请选择到期时间" style="width: 380px;" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.expirationDate'></DatePicker>-->
					<InputNumber :min='0' v-model="typeForm.expirationDate" style='width: 380px;' />
				</FormItem>
				<!--<FormItem label="未安检客户报警天数" class='adrInfo' v-if='typeForm.organizeUnit==1'>
					<InputNumber :min='0' v-model="typeForm.userCheckExpireDateNum"  style='width: 380px;'/>
				</FormItem>-->
				<FormItem label="网格化用户颜色配置" class='adrInfo'>
					<Input type="text" style="width:100px;" v-model="typeForm.colorPicker" readonly />
					<color-Picker v-model="typeForm.colorPicker" @on-change='colorChange' />
				</FormItem>

			</Form>
			<div class="mainBodyButton">
				<Button type="primary" @click='addOrgaFuc' :disabled="isDisabled">确定</Button>
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
	//	import Bus from '@/public/bus';
	// import { Cascader } from 'element-ui'
	export default {
		name: 'addOrganize',
		components: {
			aMap
		},
		data() {
			return {
				isDisabled: false,
				fileUrl: pathUrls.fileUpload,

				cityData: [],
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				isShow: false,
				typeForm: {
					colorPicker: '#1890ff',
					organizeName: '',
					organizeUnit: '',
					unitPrice: 0,
					province: null,
					city: null,
					country: null,
					street: null,
					seeMap: '',
					longitude: '',
					latitude: '',
					adressInfo: null,
					orgType: null,
					orgPerson: '',
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
				this.typeForm.contractSeal = res.data.src;
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

			//获取详情接口
			getOrganizeInfo(id) {
				_http.http1('get', pathUrls.deptInfo + '/' + id, {}, 'form').then((res) => {
					let datas = res.dept;
					this.typeForm.organizeUnit = datas.deptId; //组织部门
					this.typeForm.province = Number(datas.provinceCode); //省
					this.typeForm.city = Number(datas.cityCode); //市
					this.typeForm.country = Number(datas.areaCode); //区
					this.typeForm.street = Number(datas.streetCode); //街道
					this.typeForm.longitude = datas.lng; //经度
					this.typeForm.latitude = datas.lat; //纬度
					this.typeForm.adressInfo = datas.address; //详细地址
					this.getAreaInfo(0, 'provinceList');
					this.getAreaInfo(Number(datas.provinceCode), 'cityList');
					this.getAreaInfo(Number(datas.cityCode), 'countryList');
					this.getAreaInfo(Number(datas.areaCode), 'streetList');
					if(datas.color) {
						this.typeForm.colorPicker = datas.color;
					}

				})
			},
			//地图
			getMapData(data) {
				if(data.long) {
					this.typeForm.longitude = data.long
					this.typeForm.latitude = data.lat
					this.typeForm.adressInfo = data.addr

				}
			},
			//地图显示隐藏
			handleIsShow(data) {
				this.isShow = data
			},

			//获取部门责任人数据
			getPersonList(id) {
				_http.http1('post', pathUrls.userResponsibl, {
					deptId: id
				}, 'form').then((res) => {
					this.personList = res.data

				}).catch((res) => {

				})
			},

			//新增组织接口调取
			addOrgaFuc() {
				let fData = {
					parentId: this.typeForm.organizeUnit,
					name: this.typeForm.organizeName,
					//					parentId: (this.typeForm.organizeUnit).pop(),
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
					mapDisplay: this.typeForm.mapDisplay,
					contractStamp: this.typeForm.contractSeal,
					nameAbbr: this.typeForm.acronym,
					orderNum: this.typeForm.orderNum,
					bottleExpierDateNum: this.typeForm.expirationDate,
					category: this.typeForm.organizeType,
					color: this.typeForm.colorPicker
					//					userCheckExpireDateNum:this.typeForm.userCheckExpireDateNum
				}

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
				if(!fData.address) {
					if(fData.address.length > 100) {
						this.$Message['warning']({
							background: true,
							content: '详细地址过长!',
							duration: 1
						});
						return false
					}

				}
				if(this.typeForm.organizeUnit == 1) {
					if(this.typeForm.acronym == '') {
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
				_http.http2('post', pathUrls.deptSave, fData).then((res) => {
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
					if(res.code != 0) {
						this.isDisabled = false;
					}
				}).catch(err => {
					this.isDisabled = false;
				})

			},

			//选中组织下拉框
			organizeSelected(value) {
				//				console.log(this.$refs['cascaderAddr'])
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.organizeUnit = id
					this.getOrganizeInfo(id);
					//					this.getPersonList(id)
				}
			},
			//点击调取地图
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
					this.getAreaInfo(this.typeForm.city, 'countryList')
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
					this[areaLis] = res.data;
					if(!this.typeForm.longitude) {
						for(let item of res.data) {
							if(this.typeForm.street) {
								if(this.typeForm.street == item.areaCode) {
									this.typeForm.longitude = item.lng;
									this.typeForm.latitude = item.lat;
								}
							} else {
								if(this.typeForm.country) {
									if(this.typeForm.country == item.areaCode) {
										this.typeForm.longitude = item.lng;
										this.typeForm.latitude = item.lat;
									}
								} else {
									if(this.typeForm.city) {
										if(this.typeForm.city == item.areaCode) {
											this.typeForm.longitude = item.lng;
											this.typeForm.latitude = item.lat;
										}
									}
								}

							}

						}
					}

				}).catch((res) => {

				})
			}

		},
		mounted() {
			this.getOrganizeInfo(this.$route.params.id);
			this.common.getDeptList(this.userData.staffDeptId).then((res) => {
				this.options = this.common.getConDept(res.data,0,0,1)
			})

		}
	}
</script>

<style scoped>
	.mainBody>>>.organizeUnit input {
		cursor: pointer;
		background: 0;
		color: #000;
	}
	
	.mainBody>>>.ivu-input {
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
		/*width: 600px;*/
	}
	
	.mainBorder>>>.ivu-upload {
		width: 100px;
		height: 100px;
		vertical-align: middle;
	}
</style>