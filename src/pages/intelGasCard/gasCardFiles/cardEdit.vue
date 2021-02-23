<template>
  <div class="mainBorder">
    <div class='mainHeader'>
      <span>编辑</span>
      <Icon type="md-close" class='closeIcon' @click='handleBackClick' />
    </div>
    <div class="mainBody">
      <Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="120">
        <FormItem label="订气卡编号" class='star'>
          <Input v-model="typeForm.cardCode" placeholder="请输入订气卡编号" readonly />
        </FormItem>
        <FormItem label="卡类型">
          <Select v-model="typeForm.cardType" style="width:380px" placeholder="请选择卡类型">
            <Option value='用户识别卡'>用户识别卡</Option>
            <Option value='智能用气卡'>智能用气卡</Option>
          </Select>
        </FormItem>
        <FormItem label="组织" class='star'>
          <el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeOwn"
            @change='organizeSelected' style="width: 380px;"></el-cascader>
        </FormItem>
        <FormItem label="厂家">
          <Input v-model="typeForm.cardManufacturer" placeholder="请输入厂家" />
        </FormItem>
        <FormItem label="型号">
          <Input v-model="typeForm.cardModel" placeholder="请输入型号" />
        </FormItem>
        <FormItem label="发放状态" class='star'>
          <Select v-model="typeForm.cardStatus" style="width:380px" placeholder="请选择发放状态">
            <Option :value='0'>未发放</Option>
            <Option :value='1'>已发放</Option>
            <Option :value='-1'>停用</Option>
          </Select>
        </FormItem>
        <FormItem label="发放时间">
          <DatePicker type="datetime" placeholder="请选择发放时间" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.dateTime'
            @on-change="timeChange" style="width: 380px;"></DatePicker>
        </FormItem>
        <FormItem label="求助对象">
          <Select v-model="typeForm.objectHelp" style="width:380px" placeholder="请选择求助对象" filterable clearable>
            <Option :value='item.staffId' v-for='item in objectList' :key='item.staffId'>{{item.staffName}}</Option>
          </Select>
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
          <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess"
            :format="['jpg','jpeg','png']" :max-size="2048" type="drag" :action="fileUrl" style="display: inline-block;width:58px;"
            :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload">
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
          <Upload :max-size="50 * 1024" ref="uploadVideo" :show-upload-list="false" :default-file-list="defaultListVideo"
            :on-success="handleSuccessVideo" :format="['ogg','webm','mp4']" type="drag" :action="fileUrl" style="display: inline-block;width:58px;"
            :on-format-error="handleFormatErrorVideo" :on-exceeded-size="handleMaxSizeVideo" :before-upload="handleBeforeUploadVideo">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="视频" v-model="visibleVideo" class-name="vertical-center-modal" width='800'>
            <video controls="controls" v-if='visibleVideo' :src="imgUrl" style="width: auto;height:auto;max-height: 500px;max-width: 768px;"></video>
          </Modal>
        </FormItem>
      </Form>
      <div class="mainBodyButton" v-has='620'>
        <Button type="primary" @click='editCardFuc' :disabled="isDisabled">确定</Button>
        <Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
      </div>
    </div>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'cardAdd',
		data(){
			return{
				rotateIndex: 0,
        defaultListVideo:[],
        cardPic:[],
        cardVideo:[],
        visibleVideo: false,
        uploadListVideo: [],
        fileUrl: pathUrls.fileUpload,
        defaultList: [],
        imgName: '',
        imgUrl: '',
        visible: false,
        uploadListPic: [],
        isDisabled: false,
			objectList:[],
			userData: (JSON.parse(this.$store.state.userData)),
			options:[],
			typeForm:{
				cardCode:null,
				cardType:null,
				organizeOwn:null,
				cardManufacturer:null,
				cardModel:null,
				cardStatus:null,
				dateTime:null,
				objectHelp:null

			},
			cardBuyCount:null,
			cardCreateTime:null,
			cardDistributionSource:null,
			cardDistributionWorkCode:null,
			cardIsBind:null,
			cardObsoleteTime:null,
			cardRange:null,
			cardSpecification:null,
			cardUpdateTime:null,
			cardUserAddress:null,
			cardUserId:null,
			cardUserName:null,
			cardUserPhone:null,
			userAccountNumbers:null
			}
		},
		methods:{
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
      handleBeforeUpload () {
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
			//改变时间
			timeChange(v) {
				this.typeForm.dateTime = v;
			},
			//获取详情
			getCardInfo(){
					this.objectList=[];
				_http.http1('get', pathUrls.deptcardInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					this.typeForm.cardCode=res.deptCard.cardCode;//订气卡编号
					this.typeForm.cardType=res.deptCard.cardType;//订气卡卡类型
					this.typeForm.organizeOwn=res.deptCard.cardDeptId+'';//组织
					this.typeForm.cardManufacturer=res.deptCard.cardManufacturer;//厂家
					this.typeForm.cardModel=res.deptCard.cardModel;//型号
					this.typeForm.cardStatus=res.deptCard.cardStatus;//发放状态
					this.typeForm.dateTime=res.deptCard.cardIssueTime;//发放时间
					this.typeForm.objectHelp=res.deptCard.staffId;//求助对象
					this.cardBuyCount=res.deptCard.cardBuyCount;
					this.cardCreateTime=res.deptCard.cardCreateTime;
					this.cardDistributionSource=res.deptCard.cardDistributionSource;
					this.cardDistributionWorkCode=res.deptCard.cardDistributionWorkCode;
					this.cardIsBind=res.deptCard.cardIsBind;
					this.cardObsoleteTime=res.deptCard.cardObsoleteTime;
					this.cardRange=res.deptCard.cardRange;
					this.cardSpecification=res.deptCard.cardSpecification;
					this.cardUpdateTime=res.deptCard.cardUpdateTime;
					this.cardUserAddress=res.deptCard.cardUserAddress;
					this.cardUserId=res.deptCard.cardUserId;
					this.cardUserName=res.deptCard.cardUserName;
					this.cardUserPhone=res.deptCard.cardUserPhone;
					this.userAccountNumbers=res.deptCard.userAccountNumbers;
            if(res.deptCard.cardPic){
                let newPic=JSON.parse(res.deptCard.cardPic)
                if(newPic.length){
                  newPic.forEach((item,index)=>{
                    this.defaultList.push({
                      url:item
                    });
                    this.uploadListPic=this.defaultList;
                  })

                }
            }
            if(res.deptCard.cardVideo){
                let newVideo=JSON.parse(res.deptCard.cardVideo)
                if(newVideo.length){
                  newVideo.forEach((item,index)=>{
                    this.defaultListVideo.push({
                      url:item
                    });
                    this.uploadListVideo=this.defaultListVideo;
                  })

                }
            }
					this.common.getStaffList(this.typeForm.organizeOwn).then((res)=>{
							this.objectList=res.data;
						})
				})

			},
			//点击确定
			editCardFuc(){
        this.cardPic=[];
        this.cardVideo=[];
       
        for(let item of this.uploadListPic){
           this.cardPic.push(item.url);
        }
        for(let item of this.uploadListVideo){
           this.cardVideo.push(item.url);
        }
				let fData={
					cardId:this.$route.params.id,//用气卡id
					cardCode:this.typeForm.cardCode,//订气卡编号
					cardType:this.typeForm.cardType,//卡类型
					cardDeptId:this.typeForm.organizeOwn,//组织
					cardManufacturer:this.typeForm.cardManufacturer,//厂家
					cardModel:this.typeForm.cardModel,//型号
					cardStatus:this.typeForm.cardStatus,//发放状态
					cardIssueTime:this.typeForm.dateTime?this.common.conformatDat(this.typeForm.dateTime,true):null,//发放时间
					staffId:this.typeForm.objectHelp,//求助对象

					cardBuyCount:this.cardBuyCount,
					cardCreateTime:this.cardCreateTime,
					cardDistributionSource:this.cardDistributionSource,
					cardDistributionWorkCode:this.cardDistributionWorkCode,
					cardIsBind:this.cardIsBind,
					cardObsoleteTime:this.cardObsoleteTime,
					cardRange:this.cardRange,
					cardSpecification:this.cardSpecification,
					cardUpdateTime:this.cardUpdateTime,
					cardUserAddress:this.cardUserAddress,
					cardUserId:this.cardUserId,
					cardUserName:this.cardUserName,
					cardUserPhone:this.cardUserPhone,
					userAccountNumbers:this.userAccountNumbers,
          cardPic:JSON.stringify(this.cardPic),
          cardVideo:JSON.stringify(this.cardVideo)

				}
				if(!fData.cardCode){
					this.$Message['warning']({
						background: true,
						content: '请填写订气卡编号!'
					});
					return false
				}
				if(!this.common.judgeNum(fData.cardCode)){
					this.$Message['warning']({
						background: true,
						content: '订气卡编号不合法!'
					});
					return false
				}
				if(fData.cardCode.length>30){
					this.$Message['warning']({
						background: true,
						content: '订气卡编号过长!'
					});
					return false
				}
				if(!fData.cardDeptId){
					this.$Message['warning']({
						background: true,
						content: '请填写组织!'
					});
					return false
				}
				if(fData.cardManufacturer){
				if(fData.cardManufacturer.length>64){
					this.$Message['warning']({
						background: true,
						content: '厂家名字过长!'
					});
					return false
				}
				}
				if(!this.common.judgeNum(fData.cardModel)){
					this.$Message['warning']({
						background: true,
						content: '输入型号不合法!'
					});
					return false
				}
				if(fData.cardModel){
				if(fData.cardModel.length>28){
					this.$Message['warning']({
						background: true,
						content: '型号过长!'
					});
					return false
				}
				}
           this.isDisabled = true;
				_http.http2('post', pathUrls.deptcardUpdate, fData).then((res) => {
          
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '编辑成功!',
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
			//返回
			handleBackClick(){
				this.$router.go(-1);
			},
			//改变组织
			organizeSelected(value){
				let newId;
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.organizeOwn = id;
					newId=id;
				}else{
					newId=this.userData.deptId;
				}
				this.objectList=[];
				this.common.getStaffList(newId).then((res)=>{
						this.objectList=res.data;
					})
			},
		},
		mounted(){
			this.common.getDeptList(this.userData.deptId).then((res) => {
			this.options = this.common.getConDept(res.data, 0, 0, 1)
		})
			this.getCardInfo()
      setTimeout(()=>{
        this.uploadListPic = this.$refs.upload.fileList;
        this.uploadListVideo = this.$refs.uploadVideo.fileList;       
      },400)
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
