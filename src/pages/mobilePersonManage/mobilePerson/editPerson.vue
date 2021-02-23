<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>编辑</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="120">
				<div style="display: flex;">
					<FormItem label="所属组织" class='star' style='position: relative;'>
						<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeOwn" @change='organizeSelected' style="width: 380px;"></el-cascader>
					</FormItem>
					<div style="height: 32px;padding-top: 4px;line-height: 32px;color: #F29100;" v-if='deptNotice'>
						<Icon type="md-alert" style='font-size: 20px;'/>
						<i>组织已改变，请重新分配角色！</i>
					</div>
				</div>
				<div style="display: flex;">
					<FormItem label="账号类型" class='star'>
						<Select v-model="typeForm.staffType" style="width: 380px;" @on-change='typeChange'>
							<Option :value='1'>平台端</Option>
							<Option :value='2'>移动端</Option>
							<Option :value='3'>平台+移动端</Option>
						</Select>
					</FormItem>
					<div style="height: 32px;padding-top: 4px;line-height: 32px;color: #F29100;" v-if='typeNotice'>
						<Icon type="md-alert" style='font-size: 20px;'/>
						<i>账号类型已改变，请重新分配角色！</i>
					</div>
				</div>
				<FormItem label="姓名" class='staffName star'>
					<Input v-model="typeForm.staffName" placeholder="请输入姓名" />
				</FormItem>
				<FormItem label="工号" class='staffWorkCode'>
					<Input v-model="typeForm.staffWorkCode" placeholder="请输入工号" />
				</FormItem>
				<FormItem label="手机号" class='staffAccount star' v-if='typeForm.staffType!=1'>
					<Input v-model="typeForm.staffAccount" placeholder="请输入手机号" />
				</FormItem>
				<FormItem label="手机号" class='staffAccount' v-else>
					<Input v-model="typeForm.staffAccount" placeholder="请输入手机号" />
				</FormItem>
				<FormItem label="密码" class='staffPassword'>
					<Input v-model="typeForm.staffPassword" placeholder="请输入密码" />
				</FormItem>
        <FormItem label="坐席号" v-if='typeForm.staffType==1||typeForm.staffType==3'>
            <Input v-model="typeForm.seatCode" placeholder="坐席号" />
        </FormItem>
				<FormItem label="配送车车牌号" class='staffCarNum' v-if='showCarNum'>
					<Select v-model="typeForm.staffCarNum" style="width: 380px;" multiple>
						<Option v-for="item in staffCarNumList" :value="item.carNumber" :key="item.carNumber">{{ item.carNumber }}</Option>
					</Select>
				</FormItem>
				<FormItem label="建档时间" class='dateTime ' v-if='showCarNum'>
					<DatePicker type="datetime" placeholder="请选择建档时间" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.dateTime' @on-change="timeChange" style="width: 380px;"></DatePicker>
				</FormItem>
				<FormItem label="证件号码" class='staffIdCardNumber'>
					<Input v-model="typeForm.staffIdCardNumber" placeholder="请输入证件号码" disabled/>
				</FormItem>
				<FormItem label="住址" class='staffAddress'>
					<Input v-model="typeForm.staffAddress" placeholder="请输入住址" />
				</FormItem>
				<FormItem label="创建时间" class='dateTime'>
					<Input v-model="typeForm.staffCreateTime" disabled/>
				</FormItem>
				<FormItem label="头像" class='staffFace'>
					<Upload :on-success='handleUploadSuccess' :show-upload-list="false" type="drag" :action="fileUrl">
						<div style="margin-top:25px">
							<Icon type="ios-cloud-upload" size="52" style="color: #3399ff" v-if='!typeForm.staffFace'></Icon>
							<!-- <p>Click or drag files here to upload</p> -->
							<img :src="typeForm.staffFace" alt="" style="width: 100px;height: 100px;position: absolute;left: 0;top:0" />
						</div>
					</Upload>
				</FormItem>

				<FormItem label="资质证件信息" class='certificateInfo' br/>
				<Form ref="formInfo" :model="formInfo" :label-width="120" class='formInfo' style="position: relative;">
					<i style="position: absolute;left:120px;top:-24px;font-size: 12px;color: #E85A15;">燃气从业人员资格证！</i>
					<FormItem v-for="(item, index) in formInfo.items" v-if="item.status" :key="index">
						<Row>
							<Col span="4" offset="1"> 证件编号
							</Col>
							<Col span="19">
							<Input type="text" v-model="item.idCode" placeholder="请输入证件编号"></Input>
							</Col>
							<!--<Col span="4" offset="1">
								<Button @click="handleRemove(index)">删除</Button>
								</Col>-->
						</Row>
						<Row style='margin: 10px 0;'>
							<Col span="4" offset="1"> 有效期限
							</Col>
							<Col span="19">
							<!--<Input type="text" v-model="item.activeLife" placeholder="请输入有效期限"></Input>-->

							<DatePicker ref='dataTime' type="date" placeholder="请选择有效期限" format="yyyy-MM-dd" v-model='item.activeLife' style='width: 300px;'></DatePicker>
							</Col>

						</Row>
						<Row>
							<Col span="4" offset="1"> 图片
							</Col>
							<Col span="19">
							<Upload ref="upload" :on-success='handleUploadSuccess1' :show-upload-list="false" type="drag" :action="fileUrl">
								<div style="margin-top:25px">
									<Icon type="ios-camera" size="52" style="color: #3399ff" v-if='!item.cerPic'></Icon>
									<img :src="item.cerPic" alt="" style="width: 100px;height: 100px;position: absolute;left: 0;top:0" />
								</div>
							</Upload>
							</Col>

						</Row>
						<Row>
							<Col span="4" offset="1" style="margin-top: 10px;">
							<Button @click="handleRemove(index)" v-if='index!=0'>删除</Button>
							</Col>
						</Row>
					</FormItem>
					<FormItem>
						<Row>
							<Col span="12">
							<Button type="dashed" long @click="handleAdd" icon="md-add" style="margin-left: 15px;">添加</Button>
							</Col>
						</Row>
					</FormItem>
				</Form>
				</FormItem>
			</Form>
			<div class="mainBodyButton">
				<Button type="primary" @click='editUserFuc' :disabled="isDisabled">确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';

	export default {
		name: 'addPerson',
		data() {
			return {
				deptNotice:false,
				typeNotice:false,
				defaultId:'',
				defaultType:'',
				isDisabled: false,
				fileUrl: pathUrls.fileUpload,
				//				fileUrl: 'https://source.payq-iot.com:8089/file/upload',
				//				fileUrl: 'https://sys.payq-iot.com:8089/file/upload',
				index: 1,
				formInfo: {
					items: [{
						idCode: '',
						activeLife: '',
						cerPic: '',
						index: 1,
						status: 1
					}]
				},

				newPosName: '',
				newCars: [],
				newDepid: '',
				showCarNum: true,

				staffCarNumList: [],
				userData: (JSON.parse(this.$store.state.userData)),
				typeForm: {
					organizeOwn: '',
					staffName: '',
					staffWorkCode: '',
					staffAccount: '',
					staffPassword: '',
					postName: [],
					staffIdCardNumber: '',
					staffAddress: '',
					staffFace: '',
					dateTime: '',
					staffCarNum: [],
					staffCreateTime: '',
					staffType: null,
          seatCode:''

				},
				options: [],
				pUrls: pathUrls.fileUpload,
				staffIdentityName: '',
				newEntryTime: '',
				carId: null,
				deliveryNum: null,
				staffAreaCode: null,
				staffBindBottleCount: 0,
				staffCityCode: null,
				staffDeptName: null,
				staffOnDuty: null,
				staffProvinceCode: null,
				staffStatus: null,
				staffStreetCode: null,
				staffUpdateTime: null,
				workStatus: null,
				newCertList: [],
				staffIdentityType: null,

			}
		},

		methods: {
			typeChange(v){
				if(v!=this.defaultType&&this.defaultType!=3&&v){
					this.typeNotice=true;
				}else{
					this.typeNotice=false;
				}

			},
			//资质证件信息上传图片成功
			handleUploadSuccess1(response, file, fileList) {
				//				console.log(response, file, fileList)
				for(let i = 0; i < this.formInfo.items.length; i++) {
					if(this.$refs.upload[i].fileList.length) {
						let len = this.$refs.upload[i].fileList.length;
						//						console.log(i, this.$refs.upload)
						this.formInfo.items[i].cerPic = this.$refs.upload[i].fileList[len - 1].response.data.src;
					}

				}
			},
			//资质证件信息删除
			handleRemove(index) {
				this.formInfo.items[index].status = 0;
				this.formInfo.items.splice(index, 1);
				this.index--;
			},
			//资质证件信息添加
			handleAdd() {
				if(this.index < 5) {
					this.index++;
					this.formInfo.items.push({
						idCode: '',
						activeLife: '',
						cerPic: '',
						index: this.index,
						status: 1
					});
				} else {
					this.$Message['warning']({
						background: true,
						content: '最多支持5个证件!',
						duration: 1
					});
					return false
				}

			},

			//获取配送车车牌号
			getStaffCarNum(id) {
				_http.http1('post', pathUrls.getCarNumber, {
					deptId: id
				}, 'form').then((res) => {
					this.staffCarNumList = res.data;

					if(this.newCars.length && id == this.newDepid) {
						for(let item of this.newCars) {
							this.staffCarNumList.push({
								'carNumber': item
							})
						}
					}
					//					console.log(this.staffCarNumList)
				})
			},

			//获取详情
			getMobilePersonInfo() {
				this.newCars = [];
				this.typeForm.postName = [];
				_http.http1('get', pathUrls.deptstaffInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					//					console.log(res.deptStaff)
					this.typeForm.organizeOwn = res.deptStaff.staffDeptId + ''; //所属组织
          this.typeForm.seatCode=res.deptStaff.seatCode;
					this.newDepid = res.deptStaff.staffDeptId + '';
					this.typeForm.staffName = res.deptStaff.staffName; //姓名
					this.typeForm.staffWorkCode = res.deptStaff.staffWorkCode; //工号
					this.typeForm.staffAccount = res.deptStaff.staffAccount; //手机号
					this.typeForm.staffPassword = res.deptStaff.staffPassword; //密码
					if(res.deptStaff.staffIdentity) {
						let newPost = res.deptStaff.staffIdentity.split(','); //角色名称
						newPost.forEach(items => {
							items = +items;
							this.typeForm.postName.push(items);
						})
					}
					this.defaultId=res.deptStaff.staffDeptId;
					this.defaultType=res.deptStaff.staffType;
					this.newPosName = res.deptStaff.staffIdentity;
					this.staffIdentityName = res.deptStaff.staffIdentityName; //角色名称汉字
					this.typeForm.staffIdCardNumber = res.deptStaff.staffIdCardNumber; //证件号码
					this.typeForm.staffFace = res.deptStaff.staffFace; //员工照片
					this.typeForm.staffAddress = res.deptStaff.staffAddress; //住址
					this.typeForm.dateTime = res.deptStaff.staffEntryTime; //建档时间
					this.newEntryTime = res.deptStaff.staffEntryTime;
					this.typeForm.staffCarNum = res.deptStaff.carNumbers ? res.deptStaff.carNumbers.split(",") : []; //配送车车牌号
					this.newCars = res.deptStaff.carNumbers ? res.deptStaff.carNumbers.split(",") : [];
					this.typeForm.staffCreateTime = res.deptStaff.staffCreateTime; //建档时间

					this.carId = res.deptStaff.carId;
					this.deliveryNum = res.deptStaff.deliveryNum;
					this.staffAreaCode = res.deptStaff.staffAreaCode;
					this.staffBindBottleCount = res.deptStaff.staffBindBottleCount;
					this.staffCityCode = res.deptStaff.staffCityCode;
					this.staffDeptName = res.deptStaff.staffDeptName;
					this.staffOnDuty = res.deptStaff.staffOnDuty;
					this.staffProvinceCode = res.deptStaff.staffProvinceCode;
					this.staffStatus = res.deptStaff.staffStatus;
					this.staffStreetCode = res.deptStaff.staffStreetCode;
					this.staffUpdateTime = res.deptStaff.staffUpdateTime;
					this.workStatus = res.deptStaff.workStatus;
					this.newCertList = res.deptStaff.certList; //资质证件信息
					if(this.newCertList.length) {
						this.formInfo.items = [];
						this.index = this.newCertList.length;
						for(let i = 0; i < this.newCertList.length; i++) {

							this.formInfo.items.push({
								idCode: this.newCertList[i].certCode,
								activeLife: this.newCertList[i].expiryDate,
								cerPic: this.newCertList[i].certPic,
								index: i + 1,
								status: 1
							})
						}
					}
					this.staffIdentityType = res.deptStaff.staffIdentityType

					//					if(this.staffIdentityType == 1) {
					//						this.showCarNum = true
					this.getStaffCarNum(this.typeForm.organizeOwn)
					//					} else {
					//						this.showCarNum = false
					//					}
					this.typeForm.staffType = res.deptStaff.staffType;

				})
			},
			//点击编辑
			editUserFuc() {
				let certList = [];
				for(let item of this.formInfo.items) {
					certList.push({
						certCode: item.idCode,
						certPic: item.cerPic,
						expiryDate: item.activeLife ? this.common.conformatDat(item.activeLife) : ''

					})
				}
				let fData = {
					staffId: this.$route.params.id,
					staffDeptId: this.typeForm.organizeOwn, //组织厂家

					staffName: this.typeForm.staffName, //姓名
					staffWorkCode: this.typeForm.staffWorkCode, //工号
					staffAccount: this.typeForm.staffAccount, //手机号
					staffPassword: this.typeForm.staffPassword, //密码
					staffIdentity: this.typeForm.postName.toString(), //角色名称
					staffIdCardNumber: this.typeForm.staffIdCardNumber, //证件号码
					staffAddress: this.typeForm.staffAddress, //住址
					staffFace: this.typeForm.staffFace, //员工照片
					staffCreateTime: this.typeForm.staffCreateTime, //创建时间
					certList: certList, //资质证件信息
					carId: this.carId,
					deliveryNum: this.deliveryNum,
					staffAreaCode: this.staffAreaCode,
					staffBindBottleCount: this.staffBindBottleCount,
					staffCityCode: this.staffCityCode,
					staffDeptName: this.staffDeptName,
					staffOnDuty: this.staffOnDuty,
					staffProvinceCode: this.staffProvinceCode,
					staffStatus: this.staffStatus,
					staffStreetCode: this.staffStreetCode,
					staffUpdateTime: this.staffUpdateTime,
					workStatus: this.workStatus,
					staffType: this.typeForm.staffType,
          seatCode:this.typeForm.seatCode
				}
				fData.carNumbers = this.typeForm.staffCarNum.toString(); //配送车车牌号
				fData.staffEntryTime = this.typeForm.dateTime ? this.common.conformatDat(this.typeForm.dateTime, true) : ''; //建档时间
				//				console.log(fData)
				if(fData.staffDeptId == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择所属组织!',
						duration: 1
					});
					return false
				}
				if(fData.staffType == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择账号类型!',
						duration: 1
					});
					return false
				}

				if(fData.staffName == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入姓名!',
						duration: 1
					});
					return false
				}
				if(fData.staffName.length > 15) {
					this.$Message['warning']({
						background: true,
						content: '姓名内容过长!',
						duration: 1
					});
					return false
				}

				if(fData.staffWorkCode && fData.staffName.length > 16) {
					this.$Message['warning']({
						background: true,
						content: '工号内容过长!',
						duration: 1
					});
					return false
				}
				if(fData.staffType==2||fData.staffType==3) {
					if(!this.common.isPoneAvailable1(fData.staffAccount)) {
					this.$Message['warning']({
						background: true,
						content: '请输入正确的手机号!',
						duration: 1
					});
					return false
				}
				}
				if(fData.staffAccount && !this.common.isPoneAvailable1(fData.staffAccount)) {
					this.$Message['warning']({
						background: true,
						content: '请输入正确的手机号!',
						duration: 1
					});
					return false
				}

				if(fData.staffAddress && fData.staffAddress.length > 100) {
					this.$Message['warning']({
						background: true,
						content: '住址内容过长!',
						duration: 1
					});
					return false
				}
				for(let item of fData.certList) {

					if(item.certCode && item.certCode.length > 15) {
						this.$Message['warning']({
							background: true,
							content: '证件编号内容过长!',
							duration: 1
						});
						return false
					}
				}
				this.isDisabled = true;
				_http.http2('post', pathUrls.deptstaffUpdate, fData).then((res) => {
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
						});
					}
					if(res.code != 0) {
						this.isDisabled = false;
					}
				}).catch(err => {
					this.isDisabled = false;
				})
				//			console.log(fData)
			},

			timeChange(v) {
				this.typeForm.dateTime = v;

			},
			//上传图片成功
			handleUploadSuccess(res, file) {
				//				console.log(res.data.src)
				this.typeForm.staffFace = res.data.src
			},

			//选中组织下拉框
			organizeSelected(value) {

				if(value.length) {
					let id = value[value.length - 1];
					if(id != this.newDepid) {
						this.showCarNum = false;
						//						this.typeForm.postName = '';
						this.typeForm.staffCarNum = [];
					} else {
						this.typeForm.staffCarNum = this.newCars;
						//						this.typeForm.postName = this.newPosName;
						if(this.staffIdentityType == 1) {
							this.showCarNum = true;
							this.getStaffCarNum(id);
						} else {
							this.showCarNum = false
						}
					}
					this.typeForm.organizeOwn = id;
					if(id!=this.defaultId){
						this.deptNotice=true;
					}else {
					this.deptNotice=false;
				}

				} else {
					this.deptNotice=false;
				}

			},
			handleBackClick() {
				this.$router.go(-1)
			}
		},
		mounted() {
			this.common.getDeptList(this.userData.staffDeptId).then((res) => {
				this.options = this.common.getConDept(res.data, 0, 0, 1)
			})

			this.getMobilePersonInfo()

		}

	}
</script>

<style scoped>
	.ivu-form-item {
		margin-bottom: 10px;
		width: 500px;
	}

	.mainBorder>>>.ivu-upload {
		width: 100px;
		height: 100px;
		vertical-align: middle;
	}

	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}

	.certificateInfo {
		margin-bottom: 0;
	}
</style>
