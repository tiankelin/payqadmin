<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>编辑</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form :label-width="120">
				<FormItem label="终端编码" class='stars'>
					<Input style="width: 380px;" v-model='terminalCode' disabled />
				</FormItem>
				<FormItem label="所属组织" class='star'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="organize" @change='organizeSelected' style="width: 380px;"></el-cascader>
				</FormItem>
				<FormItem label="配送员姓名" class='stars'>
					<Input style="width: 380px;" v-model='terminalUserName' disabled />
				</FormItem>
				<FormItem label="关联车牌号" class='stars'>
					<Input style="width: 380px;" v-model='terminalCarNumber' disabled />
				</FormItem>
				<FormItem label="终端厂家" class='stars'>
					<Input style="width: 380px;" v-model='terminalFactory' placeholder="请输入终端厂家" />
				</FormItem>
				<FormItem label="终端型号" class='star'>
					<Input style="width: 380px;" v-model='terminalModel' placeholder="请输入终端厂家" />
				</FormItem>
				<FormItem label="终端类型" class='star'>
					<Select style="width: 380px;" v-model='terminalCategory' placeholder='请选择终端类型' @on-change='typeChange' label-in-value>
						<Option :value='item.typeId' v-for='item in terminalTypeList' :key='item.typeId' :tag='item.typeCategory'>{{item.typeName}}</Option>
					</Select>

				</FormItem>
				<FormItem label="钢瓶数" class='stars'>
					<Input style="width: 380px;" v-model='bottleCount' disabled />
				</FormItem>
				<FormItem label="创建时间" class='stars'>
					<Input style="width: 380px;" v-model='terminalCreateTime' disabled />
				</FormItem>
				<FormItem label="修改时间" class='stars'>
					<Input style="width: 380px;" v-model='terminalUpdateTime' disabled />
				</FormItem>
				<FormItem label="关联RFID" class='stars'>
					<Input style="width: 380px;" v-model='terminalRfId' placeholder="请输入关联RFID">
					<span slot="prepend" v-model='preRFID'>{{preRFID}}</span>
					</Input>
				</FormItem>
				<FormItem label="当前运行状态" class='stars'>
					<Input style="width: 380px;" v-model='workStatusName' disabled />
				</FormItem>
				<FormItem label="位置" v-if='terminalRangeLng' class='stars'>
					<Button type='warning' @click='getAddress'>地图</Button>
				</FormItem>
				<FormItem label="上传图片" class='stars'>
					<div class="demo-upload-list" v-for="(item,index) in uploadListPic" :key="index">
						<template v-if="item.status === 'finished'">
							<img :src="item.url">
							<div class="demo-upload-list-cover">
								<Icon type="ios-eye-outline" @click.native="handleView(item.name,item.url)"></Icon>
								<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
							</div>
						</template>
						<template v-else>
							<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
						</template>
					</div>
					<Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" type="drag" :action="fileUrl" style="display: inline-block;width:58px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload">
						<div style="width: 58px;height:58px;line-height: 58px;">
							<Icon type="ios-camera" size="20"></Icon>
						</div>
					</Upload>
					<Modal title="图片" v-model="visible" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>
						<div class="rotateModal" @click='handleRotate' title='旋转'>
						
						</div>
						<img :src="imgUrl" v-if="visible" ref='imgModal' class="imgModal">
					</Modal>
				</FormItem>
				<FormItem label="上传视频" class='stars'>
					<div class="demo-upload-list" v-for="(item,index) in uploadListVideo" :key="index">
						<template v-if="item.status === 'finished'">
							<video controls="controls" :src="item.url" style="height: 58px;width:58px;"></video>
							<div class="demo-upload-list-cover">
								<Icon type="ios-eye-outline" @click.native="handleViewVideo(item.name,item.url)"></Icon>
								<Icon type="ios-trash-outline" @click.native="handleRemoveVideo(item)"></Icon>
							</div>
						</template>
						<template v-else>
							<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
						</template>
					</div>
					<Upload :max-size="50 * 1024" ref="uploadVideo" :show-upload-list="false" :default-file-list="defaultListVideo" :on-success="handleSuccessVideo" :format="['ogg','webm','mp4']" type="drag" :action="fileUrl" style="display: inline-block;width:58px;" :on-format-error="handleFormatErrorVideo" :on-exceeded-size="handleMaxSizeVideo" :before-upload="handleBeforeUploadVideo">
						<div style="width: 58px;height:58px;line-height: 58px;">
							<Icon type="ios-camera" size="20"></Icon>
						</div>
					</Upload>
					<Modal title="视频" v-model="visibleVideo" class-name="vertical-center-modal" width='800'>
						<video controls="controls" v-if='visibleVideo' :src="imgUrl" style="width: auto;height:auto;max-height: 500px;max-width: 768px;"></video>
					</Modal>
				</FormItem>
			</Form>
			<div class="mainBodyButton" v-has='784'>
				<Button type="primary" @click="handleSave" :disabled="isDisabled">确定</Button>
				<Button style="margin-left: 8px" @click="handleBackClick">返回</Button>
			</div>
		</div>
		<cylMap v-if='addressInfo' :langs='terminalRangeLng' :lats='terminalRangeLat' @addressInfo='handleAdSee'></cylMap>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylMap from '@/pages/comComponent/cylMaps';
	export default {
		name: 'terFileEdit',
		components: {
			cylMap
		},
		data() {
			return {
				rotateIndex: 0,
				terminalVideo: [],
				terminalPic: [],
				defaultListVideo: [],
				visibleVideo: false,
				uploadListVideo: [],
				fileUrl: pathUrls.fileUpload,
				defaultList: [],
				imgName: '',
				imgUrl: '',
				visible: false,
				uploadListPic: [],
				isDisabled: false,
				addressInfo: false,
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				terminalTypeList: [],
				terminalCode: '',
				organize: '',
				terminalFactory: null,
				terminalModel: '',
				terminalCategory: '',
				terminalRfId: '',
				preRFID: '',
				bottleCount: null,
				terminalCarNumber: null,
				terminalCreateTime: null,
				terminalDeptName: null,
				terminalDeviceId: null,
				terminalDownlinkProtocol: null,
				terminalId: null,
				terminalRange: null,
				terminalRangeLat: null,
				terminalRangeLng: null,
				terminalType: null,
				terminalUplinkProtocol: null,
				terminalUserCode: null,
				terminalUserName: null,
				workStatus: null,
				terminalUpdateTime: null,
				workStatusName: null
			}
		},
		methods: {
			handleCancel() {
				this.rotateIndex = 0;
			},
			handleRotate() {
				this.rotateIndex = this.rotateIndex + 1;
				this.$refs.imgModal.style.transform = 'rotate(' + 90 * this.rotateIndex + 'deg)';						
			},
			handleView(name, url) {
				this.imgName = name;
				this.visible = true;
				this.imgUrl = url;
			},
			handleRemove(file) {
				const fileList = this.$refs.upload.fileList;
				this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
				this.uploadListPic = this.$refs.upload.fileList;

			},
			handleSuccess(res, file, fileList) {
				this.uploadListPic = this.$refs.upload.fileList;
				file.url = res.data.src;
				file.name = res.data.name;

			},
			handleFormatError(file) {
				this.$Notice.warning({
					//					title: 'The file format is incorrect',
					//					desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
					desc: '格式错误'
				});
			},
			handleBeforeUpload() {
				this.uploadListPic = this.$refs.upload.fileList;
			},
			handleMaxSize(file) {
				this.$Notice.warning({
					//					title: 'Exceeding file size limit',
					//					desc: 'File  ' + file.name + ' is too large, no more than 2M.'
					desc: '文件过大'
				});
			},
			handleSuccessVideo(res, file, fileList) {
				this.uploadListVideo = this.$refs.uploadVideo.fileList;
				file.url = res.data.src;
				file.name = res.data.name;

			},
			handleViewVideo(name, url) {
				this.imgName = name;
				this.visibleVideo = true;
				this.imgUrl = url;
			},
			handleRemoveVideo(file) {
				const fileList = this.$refs.uploadVideo.fileList;
				this.$refs.uploadVideo.fileList.splice(fileList.indexOf(file), 1);
				this.uploadListVideo = this.$refs.uploadVideo.fileList;
			},
			handleFormatErrorVideo(file) {
				this.$Notice.warning({
					desc: '格式错误'
				});
			},
			handleMaxSizeVideo(file) {
				this.$Notice.warning({
					desc: '视频大小最多不超过50M'
				});
			},
			handleBeforeUploadVideo() {
				this.uploadListVideo = this.$refs.uploadVideo.fileList;
			},

			getAddress() {
				if(this.terminalRangeLng) {
					this.addressInfo = true;
				}
			},
			//查看地图定位
			handleAdSee(data) {
				this.addressInfo = data
			},
			//获取详情
			getFileInfo() {
				this.uploadListPic = [];
				this.uploadListVideo = [];
				_http.http1('get', pathUrls.deptterminalInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					if(res) {
						let data = res.deptTerminal;
						this.terminalCode = data.terminalCode;
						this.organize = data.terminalDeptId + '';
						this.terminalFactory = data.terminalFactory;
						this.terminalModel = data.terminalModel;
						this.terminalCategory = data.terminalCategory;
						if(data.terminalRfId) {
							this.terminalRfId = data.terminalRfId.substring(1, data.terminalRfId.length);
						}

						this.terminalType = data.terminalType;
						if(data.terminalType == 6) {
							this.preRFID = 'D'
						}
						if(data.terminalType == 5) {
							this.preRFID = 'A'
						}
						if(data.terminalType == 4) {
							this.preRFID = 'C'
						}

						if(data.terminalPic) {
							let newPic = JSON.parse(data.terminalPic)
							if(newPic.length) {
								newPic.forEach((item, index) => {
									this.defaultList.push({
										url: item
									});
									this.uploadListPic = this.defaultList;
								})

							}
						}
						if(data.terminalVideo) {
							let newVideo = JSON.parse(data.terminalVideo)
							if(newVideo.length) {
								newVideo.forEach((item, index) => {
									this.defaultListVideo.push({
										url: item
									});
									this.uploadListVideo = this.defaultListVideo;
								})

							}
						}

						this.bottleCount = data.bottleCount;
						this.terminalCarNumber = data.terminalCarNumber;

						this.terminalCreateTime = data.terminalCreateTime;

						this.terminalDeptName = data.terminalDeptName;
						this.terminalDeviceId = data.terminalDeviceId;
						this.terminalDownlinkProtocol = data.terminalDownlinkProtocol;

						this.terminalId = data.terminalId;

						this.terminalRange = data.terminalRange;
						this.terminalRangeLat = data.terminalRangeLat;
						this.terminalRangeLng = data.terminalRangeLng;

						this.terminalUplinkProtocol = data.terminalUplinkProtocol;
						this.terminalUserCode = data.terminalUserCode;
						this.terminalUserName = data.terminalUserName;
						this.terminalUpdateTime = data.terminalUpdateTime;
						this.workStatus = data.workStatus;
						if(data.workStatus == 1) {
							this.workStatusName = '配送中';
						} else if(data.workStatus == 2) {
							this.workStatusName = '空车';
						} else if(data.workStatus == 3) {
							this.workStatusName = '未工作';
						} else {
							this.workStatusName = '未知状态';
						}

					}
				})
			},
			//改变终端类型
			typeChange(v) {

				if(v) {
					if(v.tag == 6) {
						this.preRFID = 'D'
					}
					if(v.tag == 5) {
						this.preRFID = 'A'
					}
					if(v.tag == 4) {
						this.preRFID = 'C'
					}
					this.terminalType = v.tag;
				} else {
					this.terminalType = null;
				}
			},
			//获取终端类型
			getTerminalTypeList() {
				_http.http1('post', pathUrls.terminaltypeList, {
					'page': 1,
					"limit": 10000,
				}, 'form').then((res) => {
					this.terminalTypeList = res.data;

				})
			},
			//改变组织
			organizeSelected(value) {
				if(value.length) {
					let id = value[value.length - 1];
					this.organize = id;

				} else {
					this.organize = null;

				}

			},
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//确定
			handleSave() {
				this.terminalPic = [];
				this.terminalVideo = [];

				for(let item of this.uploadListPic) {
					this.terminalPic.push(item.url);
				}
				for(let item of this.uploadListVideo) {
					this.terminalVideo.push(item.url);
				}
				let fData = {
					terminalCode: this.terminalCode, //终端编码
					terminalDeptId: this.organize, //组织
					terminalFactory: this.terminalFactory, //厂家
					terminalModel: this.terminalModel, //终端型号
					terminalCategory: this.terminalCategory, //终端类型
					terminalRfId: this.terminalRfId ? (this.preRFID + this.terminalRfId) : null, //终端类型

					terminalType: this.terminalType,
					terminalId: this.terminalId,
					bottleCount: this.bottleCount,
					terminalCarNumber: this.terminalCarNumber,
					terminalCreateTime: this.terminalCreateTime,
					terminalDeptName: this.terminalDeptName,
					terminalDeviceId: this.terminalDeviceId,
					terminalDownlinkProtocol: this.terminalDownlinkProtocol,
					terminalRange: this.terminalRange,
					terminalRangeLat: this.terminalRangeLat,
					terminalRangeLng: this.terminalRangeLng,
					terminalUplinkProtocol: this.terminalUplinkProtocol,
					terminalUserCode: this.terminalUserCode,
					terminalUserName: this.terminalUserName,
					terminalUpdateTime: this.terminalUpdateTime,
					workStatus: this.workStatus,
					terminalPic: JSON.stringify(this.terminalPic),
					terminalVideo: JSON.stringify(this.terminalVideo),
				}
				if(!fData.terminalDeptId) {
					this.$Message['warning']({
						background: true,
						content: '请选择组织!'
					});
					return false
				}
				if(!fData.terminalFactory) {
					this.$Message['warning']({
						background: true,
						content: '请输入终端厂家!'
					});
					return false
				}
				if(fData.terminalFactory.length > 64) {
					this.$Message['warning']({
						background: true,
						content: '厂家名称过长!'
					});
					return false
				}
				if(!fData.terminalModel) {
					this.$Message['warning']({
						background: true,
						content: '请输入终端型号!'
					});
					return false
				}
				if(fData.terminalModel.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '终端型号过长!'
					});
					return false
				}
				if(!fData.terminalCategory) {
					this.$Message['warning']({
						background: true,
						content: '请选择终端类型!'
					});
					return false
				}
				this.isDisabled = true;
				_http.http2('post', pathUrls.deptterminalUpdate, fData).then((res) => {
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
			}
		},
		mounted() {

			this.getFileInfo();
			this.getTerminalTypeList();
			this.common.getDeptList(this.userData.deptId).then((res) => {
				this.options = this.common.getConDept(res.data, 0, 0, 1)
			})
			setTimeout(() => {
				this.uploadListPic = this.$refs.upload.fileList;
				this.uploadListVideo = this.$refs.uploadVideo.fileList;
			}, 400)

		}

	}
</script>

<style type="text/css" scoped>
	.mainBody>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	
	.stars>>>.ivu-form-item-label:after {
		content: "*";
		color: #fff;
		padding-right: 2px;
	}
	
	.mainBody>>>.ivu-input-group-prepend {
		background: 0;
		color: #000;
	}
	
	.demo-upload-list {
		display: inline-block;
		width: 60px;
		height: 60px;
		text-align: center;
		line-height: 60px;
		border: 1px solid transparent;
		border-radius: 4px;
		overflow: hidden;
		background: #fff;
		position: relative;
		margin-right: 4px;
	}
	
	.demo-upload-list img {
		width: 100%;
		height: 100%;
	}
	
	.demo-upload-list-cover {
		display: none;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, .6);
	}
	
	.demo-upload-list:hover .demo-upload-list-cover {
		display: block;
	}
	
	.demo-upload-list-cover i {
		color: #fff;
		font-size: 16px;
		cursor: pointer;
		margin: 0 2px;
	}
</style>