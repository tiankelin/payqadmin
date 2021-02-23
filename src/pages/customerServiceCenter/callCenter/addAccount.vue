<template>
	<div class="accountMain">
		<div class="accountContent">
			<div class="closeWrapper" @click='handleClose'>
				<Icon type="md-close" />
			</div>
			<div>
				<h4 class="accountTitle">添加客户</h4>
				<div style="padding: 15px 10px;">
					<Form :label-width="110" class="typeForm">
						<FormItem label="所属组织" class='star'>
							<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" v-model="organize" @change='organizeSelected'>
							</el-cascader>
						</FormItem>
						<FormItem label="客户类型" class='star'>
							<Select v-model="userType" placeholder="客户类型" @on-change='changeUserType' label-in-value>
								<Option v-for="item in userTypeList" :value="item.id" :key="item.id" :tag='item'>{{ item.typeName }}</Option>
							</Select>
						</FormItem>
						<FormItem label="用气子类型" v-if='!isResident'>
							<Select v-model="gasSubType" placeholder='请选择用气子类型' clearable>
								<Option v-for="item in subTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
							</Select>
						</FormItem>
						<FormItem label="企业/商户名称" v-if='!isResident'>
							<Input v-model="userCompanyName" placeholder="企业/商户名称" />
						</FormItem>
						<FormItem label="客户姓名" class='star'>
							<Input v-model="userRealName" placeholder="客户姓名" />
						</FormItem>
						<FormItem label="有证无证" v-if='!isResident'>
							<Select v-model="hasCert" clearable>
								<Option :value='0'>无证</Option>
								<Option :value='1'>有证</Option>
							</Select>
						</FormItem>
						<FormItem label="身份证号码">
							<Input v-model="userIdCardNumber" placeholder="身份证号码" />
						</FormItem>
						<FormItem label="联系方式" class='star'>
							<Input v-model="userPhoneNumber" placeholder="联系方式" />
						</FormItem>
						<FormItem label="开户人" class='star'>
							<Select v-model="accountHolder" label-in-value @on-change='selectHolder'>
								<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
							</Select>
						</FormItem>
						<FormItem label="用气地址" class='star' style='display: block;width: 100%;'>
							<div style="display: flex;width:96%;">
								<Select v-model="province" @on-change='selectProvince' label-in-value placeholder='请选择省份' style='width: 14%;margin-right: 1%;'>
									<Option v-for="item in provinceList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
								</Select>
								<Select v-model="city" @on-change='selectCity' label-in-value placeholder='请选择城市' style='width: 14%;margin-right: 1%;'>
									<Option v-for="item in cityList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
								</Select>
								<Select v-model="area" @on-change='selectArea' label-in-value placeholder='请选择县区' style='width: 14%;margin-right: 1%;'>
									<Option v-for="item in areaList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
								</Select>
								<Select v-model="street" label-in-value @on-change='selectStreet' placeholder='请选择街道' style='width: 14%;margin-right: 1%;'>
									<Option v-for="item in streetList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
								</Select>
								<Input v-model="userAddress" placeholder='请输入详细地址' style='width: 40%;'></Input>
							</div>
						</FormItem>
						<FormItem label="允许使用钢瓶" class='star allowClass' v-if='userType'>
							<Select multiple v-model='allowedGoods' disabled placeholder='商品名称'>
								<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
							</Select>
						</FormItem>
						<FormItem label="最大占用瓶" class='star maxOccupied' style='width: 96%;' v-if='userType'>
							<div style='display: flex;width: 100%;justify-content: space-between;'>
								<div v-for='item in maxOccupiedNumber' :key='item.goodsId' style="">
									<Select v-model='item.goodsId' disabled placeholder='商品名称'>
										<Option v-for="items in newSizeList" :value="items.goodsId" :key="items.goodsId">{{ items.goodsName }}</Option>
									</Select>
									<Input v-model="item.number" placeholder='数量' disabled/>
								</div>
							</div>

						</FormItem>
					</Form>
					<div class="mainBodyButton">
						<Button type="primary" @click='addAccountClick' :disabled="isDisabled">确定</Button>
						<Button style="margin-left: 8px" @click='handleClose'>返回</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'addAccount',
		data() {
			return {
				hasCert: '',
				isDisabled: false,
				maxOccupiedNumber: [],
				allowedGoods: [],
				isResident: false,
				staffNameList: [],
				accountHolder: '',
				detailAddress: '',
				street: '',
				area: '',
				city: '',
				province: '',
				streetList: [],
				areaList: [],
				cityList: [],
				provinceList: [],
				subTypeList: [],
				userTypeList: [],
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				organize: '',
				userType: '',
				gasSubType: '',
				userCompanyName: '',
				userRealName: '',
				userIdCardNumber: '',
				userPhoneNumber: '',
				userAddress: '',
				newSizeList: []
			}
		},
		methods: {
			//获取商品信息列表
			getGoodsList() {
				this.newSizeList = [];
				_http.http1('post', pathUrls.deptgoodsList, {
					'isGas': 2
				}, 'form').then((res) => {
					this.newSizeList = res.data;
				})
			},
			changeUserType(v) {
				this.allowedGoods = [];
				if(v) {
					if(v.tag.detailType == 1) {
						this.isResident = true;
						this.gasSubType = null;
						this.userCompanyName = null;
						this.hasCert = null;
					} else {
						this.gasSubType =1;
						this.isResident = false;
					}
					if(v.tag.allowedGoods) {
						let allowedGoods = JSON.parse(v.tag.allowedGoods);
						this.maxOccupiedNumber = allowedGoods;
						for(let item of allowedGoods) {
							this.allowedGoods.push(item.goodsId)
						}
					}

				} else {
					this.isResident = false;
				}
			},
			//选中组织下拉框
			organizeSelected(value) {
				if(value.length) {
					let id = value[value.length - 1];
					this.organize = id;
					this.common.getStaffName(this.organize).then(res => {
						this.staffNameList = res.data;
					});
					this.common.getUserTypeList(this.organize).then((res) => {
						this.userTypeList = res.data;
					})
				}
			},
			//用气地址接口
			getAreaInfo(cCode, areaLis) {
				_http.http1('post', pathUrls.cityInfo, {
					'parentCode': cCode
				}, 'form').then((res) => {

					this[areaLis] = res.data;
				})
			},
			//改变省
			selectProvince(v) {
				this.getAreaInfo(this.province, "cityList");
				this.city = '';
				this.area = '';
				this.street = '';
				this.detailAddress = '';
			},
			//改变市
			selectCity(v) {
				this.getAreaInfo(this.city, 'areaList');
				this.area = '';
				this.street = '';
				this.detailAddress = '';
			},
			//改变区
			selectArea(v) {
				this.getAreaInfo(this.area, 'streetList');
				this.street = '';
				this.detailAddress = '';
			},
			//用气子类型（商业、小微商业）接口
			getSubType() {
				_http.http1('post', pathUrls.subType, {
					'userType': 0
				}, 'form').then((res) => {
					this.subTypeList = res.data;
				})
			},
			addAccountClick() {
				let newCompanyName='';
					if(!this.isResident){
						newCompanyName=this.userCompanyName?this.userCompanyName:this.userRealName;
					}else{
					    newCompanyName='';	
					}
				let subData = {
					'hasCert': this.hasCert,
					'userDeptId': this.organize, //组织id
					'userOrderType': this.userType, //用气类型
					'userGasSubType': this.gasSubType, //用气子类型
					'userCompanyName':newCompanyName, //企业商户名称
					'userRealName': this.userRealName, //客户姓名
					'userIdCardNumber': this.userIdCardNumber, //身份证号码
					'userPhoneNumber': this.userPhoneNumber, //联系电话
					//地址
					'userProvinceCode': this.province, //省份编码
					'userCityCode': this.city, //城市编码
					'userAreaCode': this.area, //区域编码
					'userStreetCode': this.street, //街道编码
					'userAddress': this.userAddress, //详细地址
					'userOpeningStaff': this.accountHolder, //开户人
					'userExtendEntity': {
						'allowGoods': JSON.stringify(this.allowedGoods),
						'maxOccupiedNumber': JSON.stringify(this.maxOccupiedNumber)
					},
					'countType': '1', //结算方式
					'taskList': []
				}
				
				if(subData.userDeptId == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择所属组织!',

					});
					return false
				}
				if(!subData.userOrderType) {
					this.$Message['warning']({
						background: true,
						content: '请选择客户类型!',

					});
					return false
				}
				//				if(!this.isResident && !subData.userGasSubType) {
				//					this.$Message['warning']({
				//						background: true,
				//						content: '请选择用气子类型!',
				//					});
				//					return false
				//				}
				//				if(!this.isResident && !subData.userCompanyName) {
				//					this.$Message['warning']({
				//						background: true,
				//						content: '请填写企业/商户名称!',
				//					});
				//					return false
				//				}
				//				if(!this.isResident && subData.userCompanyName.length > 32) {
				//					this.$Message['warning']({
				//						background: true,
				//						content: '企业/商户名称内容过长!',
				//
				//					});
				//
				//					return false
				//				}
				if(subData.userRealName == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写客户姓名!',

					});
					return false
				}
				if(subData.userRealName.length > 13) {
					this.$Message['warning']({
						background: true,
						content: '客户姓名过长!',

					});
					return false
				}
				//				if(subData.userIdCardNumber == '') {
				//					this.$Message['warning']({
				//						background: true,
				//						content: '请填写身份证号码!',
				//
				//					});
				//					return false
				//				}
				if(subData.userIdCardNumber && !this.common.checkIDCard(subData.userIdCardNumber)) {
					this.$Message['warning']({
						background: true,
						content: '请填写正确的身份证号码!',

					});
					return false
				}

				if(!subData.userPhoneNumber) {
					this.$Message['warning']({
						background: true,
						content: '请填写联系方式!',

					});
					return false
				}
				if(subData.userPhoneNumber && subData.userPhoneNumber.length > 12) {
					this.$Message['warning']({
						background: true,
						content: '请填写正确的联系方式!',

					});
					return false
				}
				if(!subData.userOpeningStaff) {
					this.$Message['warning']({
						background: true,
						content: '请选择开户人!',

					});
					return false
				}
				if(!subData.userProvinceCode) {
					this.$Message['warning']({
						background: true,
						content: '请选择所属省份!',

					});
					return false
				}
				if(!subData.userCityCode) {
					this.$Message['warning']({
						background: true,
						content: '请选择所属城市!',

					});
					return false
				}
				if(!subData.userAreaCode) {
					this.$Message['warning']({
						background: true,
						content: '请选择所属区县!',

					});
					return false
				}
				if(this.streetList.length && !subData.userStreetCode) {
					this.$Message['warning']({
						background: true,
						content: '请选择所属街道!',

					});
					return false
				}
				if(!subData.userAddress) {
					this.$Message['warning']({
						background: true,
						content: '请输入详细地址!',

					});
					return false
				}
				this.isDisabled = true;
				_http.http2('post', pathUrls.userWebOpeningUser, subData).then((res) => {
					if(res.code === 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
								this.$emit('closeAccount', 1);

							})
						});

					}
					if(res.code === 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						})
					}
					if(res.code != 0) {
						this.isDisabled = false;

					}
				}).catch(err => {
					this.isDisabled = false;
				})

			},
			//关闭
			handleClose() {
				this.$emit('closeAccount', 2);
			}
		},
		mounted() {
			this.organize = this.userData.deptId + '';
			this.common.getDeptList(this.userData.deptId).then((res) => {
				this.options = this.common.getConDept(res.data)
			})
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.userTypeList = res.data;
			})
			this.getSubType();
			this.province = Number(this.userData.dept.provinceCode); //所属省份
			this.city = Number(this.userData.dept.cityCode); //所属市
			this.area = Number(this.userData.dept.areaCode); //所属区县
			this.getAreaInfo(0, 'provinceList');
			if(this.userData.dept.provinceCode) {
				this.getAreaInfo(Number(this.userData.dept.provinceCode), "cityList");
			}
			if(this.userData.dept.cityCode) {
				this.getAreaInfo(Number(this.userData.dept.cityCode), 'areaList');
			}
			if(this.userData.dept.areaCode) {
				this.getAreaInfo(Number(this.userData.dept.areaCode), 'streetList');
			}
			this.common.getStaffName(this.userData.deptId).then(res => {
				this.staffNameList = res.data;
			});
			this.getGoodsList();
		}
	}
</script>

<style type="text/css" scoped>
	.accountMain {
		background: rgb(41, 107, 126);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
	}
	
	.accountContent>>>.el-cascader {
		width: 100%;
	}
	
	.accountContent {
		width: 100%;
		height: 100%;
		background: #fff;
		/* border-radius: 4px; */
		padding-top: 10px;
		/* padding: 10px; */
		/* margin: 10px; */
		position: relative;
		text-align: left;
	}
	
	.closeWrapper {
		position: absolute;
		right: 12px;
		top: 0px;
		font-size: 32px;
		cursor: pointer;
		color: #1296db;
		font-weight: 600;
	}
	
	.accountTitle {
		margin: 0 11px;
	}
	
	.accountContent>>>.ivu-form-item {
		/*margin-bottom: 12px;*/
		width: 48%;
		display: inline-block;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	/* .maxOccupied>>>.ivu-form-item-content{
    margin-left: 0!important;
  } */
</style>