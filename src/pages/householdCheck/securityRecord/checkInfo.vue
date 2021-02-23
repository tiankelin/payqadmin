<template>
  <div class="mainBorder">
    <div class='mainHeader'>
      <span>详情</span>
      <Icon type="md-close" class='closeIcon' @click='handleBackClick' />
    </div>
    <div class="mainBody">
      <section ref="print">
        <div :class="showShodow?'startContent':newContent" class="formContent">
          <div class='formTitle'>瓶装燃气用户入户安检表</div>
          <div class="reportCode"><span>报告编号：</span><span>{{checkCode}}</span></div>
          <div class='sameBox'>
            <div><span>检查项目：</span><span>{{checkItem}}</span></div>
            <div><span>安检类型：</span><span>{{userTypeName}}</span></div>
          </div>
          <div class='sameBox'>
            <div><span>检查日期：</span><span>{{checkDate}} </span></div>
            <div><span>户号：</span><span>{{userAccountNumber}}</span></div>
          </div>
          <div class='sameBox'>
            <div><span>户主名称：</span><span>{{userName}}</span></div>
            <div class="adressWrapper"><span>地址：</span><span :title='address'>{{address}}</span></div>
          </div>
          <div class='tableHead' style="text-align: center;">
            <div style="width:96px ;padding-left: 3px;">类别</div>
            <!--<div style="width:50px ;border-left:1px solid #eee;border-right:1px solid #eee;padding-left: 3px;">序号</div>-->
            <div style="width:75px ;padding-left: 3px;border-left:1px solid #eee;">检查项</div>
            <div style="width:471px ;padding-left: 3px;border-left:1px solid #eee;">检查内容</div>
            <div style="width:74px ;border-left:1px solid #eee;border-right:1px solid #eee;padding-left: 3px;">检查情况</div>
            <!-- <div style="width:120px ;padding-left: 3px;">备注</div> -->
          </div>

          <div class="checkContent" v-if='newLastList.length'>
            <div style="width:90px;text-align: center;border-bottom: 1px solid #eee;display: flex;border-right:1px solid #eee;"
              class='sameItem'>
              <div style="margin: auto 0;">上次安检内容</div>
            </div>
            <div>
              <div v-if='checkList&&checkList.length' style="display: flex;" v-for='(items,indexs) in lastListArr' :key='indexs'>

                <!--<div style="width:50px ;border-right:1px solid #eee;border-bottom: 1px solid #eee;padding-left: 3px;">{{indexs+1}}</div>-->
                <div style="width:70px ;border-right:1px solid #eee;border-bottom: 1px solid #eee;padding-left: 3px;display: flex;">
                  <div style="margin: auto 0;">{{items.typeName}}</div>
                </div>
                <div style="width: 498px;">
                  <div style="width:100%;display: flex;line-height:24px ;" :class='{"oneLine":(items.typeName.length>4&&items.typeName.length<9&&items.data.length==1&&item.typeContent.length<27),"twoLine":(items.typeName.length>8&&items.data.length==1&&item.typeContent.length<27)}'
                    v-for='(item,index) in items.data' :key="item.typeId">
                    <div style="width:474px ;border-right:1px solid #eee;border-bottom: 1px solid #eee;padding-left: 3px;">{{item.typeContent}}</div>
                    <div style="width:74px ;border-bottom: 1px solid #eee;padding-left: 3px;">
                      <Icon type="md-checkmark" style='font-size: 16px;' v-if='item.checked' />
                    </div>
                    <!-- <div style="width:120px ;border-bottom: 1px solid #eee;padding-left: 3px;"></div> -->
                  </div>
                </div>


              </div>
              <div v-else style="width: 580px;min-height: 24px;border-bottom: 1px solid #eee;"></div>
            </div>

          </div>


          <div class="checkContent">
            <div style="width:90px;text-align: center;border-bottom: 1px solid #eee;display: flex;border-right:1px solid #eee;"
              class='sameItem'>
              <div style="margin: auto 0;">本次安检内容</div>
            </div>
            <div>
              <div v-if='checkList&&checkList.length' style="display: flex;" v-for='(items,indexs) in listArr' :key='indexs'>

                <!--<div style="width:50px ;border-right:1px solid #eee;border-bottom: 1px solid #eee;padding-left: 3px;">{{indexs+1}}</div>-->
                <div style="width:70px ;border-right:1px solid #eee;border-bottom: 1px solid #eee;padding-left: 3px;display: flex;">
                  <div style="margin: auto 0;">{{items.typeName}}</div>
                </div>
                <div style="width: 498px;">
                  <div style="width:100%;display: flex;line-height: 24px;" :class='{"oneLine":(items.typeName.length>4&&items.typeName.length<9&&items.data.length==1&&item.typeContent.length<27),"twoLine":(items.typeName.length>8&&items.data.length==1&&item.typeContent.length<27)}'
                    v-for='(item,index) in items.data' :key="item.typeId">
                    <div style="width:474px ;border-right:1px solid #eee;border-bottom: 1px solid #eee;padding-left: 3px;">{{item.typeContent}}{{items.data.length}}</div>
                    <div style="width:74px ;border-bottom: 1px solid #eee;padding-left: 3px;">
                      <Icon type="md-checkmark" style='font-size: 16px;' v-if='item.checked' />
                    </div>
                    <!-- <div style="width:120px ;border-bottom: 1px solid #eee;padding-left: 3px;"></div> -->
                  </div>
                </div>


              </div>
              <div v-else style="width: 580px;min-height: 24px;border-bottom: 1px solid #eee;"></div>
            </div>

          </div>



          <div class='picContent' v-if='newLastPic.length'>
            <div style="width:87px ;text-align: center;display: flex;">
              <div style="margin: auto 0;" class='sameItem'>上次现场图片</div>
            </div>
            <div style="width:572px;min-height: 80px;border-left:1px solid #eee;">

              <viewer :images="newLastPic" style='text-align: center;'>
                <div style="display: inline-block;padding-top: 5px;" v-for="src in newLastPic" :key="src">
                  <img :src="src" style="height:80px ;width: auto;margin: 0 5px;cursor: pointer;">
                  <Icon type="md-download" @click='down(src)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;"
                    v-if='showShodow' />
                </div>

              </viewer>
            </div>
            <!--  <div style="width:110px;padding: 0  4px;">
              <div>
                <div></div>
              </div>
            </div> -->
          </div>

          <div class='picContent'>
            <div style="width:87px ;text-align: center;display: flex;">
              <div style="margin: auto 0;" class='sameItem'>本次现场图片</div>
            </div>
            <div style="width:572px;min-height: 80px;border-left:1px solid #eee;">


              <viewer :images="newPic" style='text-align: center;'>
                <div style="display: inline-block;padding-top: 5px;" v-for="src in newPic" :key="src">
                  <img :src="src" style="height:80px ;width: auto;margin: 0 5px;cursor: pointer;">
                  <Icon type="md-download" @click='down(src)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;"
                    v-if='showShodow' />
                </div>
              </viewer>
            </div>
            <!--     <div style="width:110px;padding: 0  4px;">
              <div>
                <div></div>
              </div>
            </div> -->
          </div>
          <div class='picContent' v-if='newLastVideo.length'>
            <div style="width:87px ;text-align: center;display: flex;">
              <div style="margin: auto 0;" class='sameItem'>上次现场视频</div>
            </div>
            <div style="width:572px;min-height: 80px;border-left:1px solid #eee;text-align: center;">
              <div style="position: relative;">
                <div>
                  <div v-if='newLastVideo' v-for='(item,index) in newLastVideo' :key='item' style="display: inline-block;padding-top: 5px;">
                    <video controls="controls" :src="item" style="height: 80px;width:80px;"></video>
                    <Icon type="md-download" @click='downRow(item,index)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;"
                      v-if='showShodow' />
                  </div>
                </div>
                <Spin fix v-if='spinShow'>
                  <Icon type="ios-loading" size=20 class="demo-spin-icon-load" style='margin-right: 6px;'></Icon>
                  <div>下载中...</div>
                </Spin>
              </div>
            </div>
            <!-- <div style="width:110px;padding: 0 4px;">
              <div>
                <div></div>
              </div>
            </div> -->
          </div>
          <div class='picContent'>
            <div style="width:87px ;text-align: center;display: flex;">
              <div style="margin: auto 0;" class='sameItem'>本次现场视频</div>
            </div>
            <div style="width:572px;min-height: 80px;border-left:1px solid #eee;text-align: center;">
              <div style="position: relative;">
                <div>
                  <div v-if='newVideo' v-for='(item,index) in newVideo' :key='item' style="display: inline-block;padding-top: 5px;">
                    <video controls="controls" :src="item" style="height: 80px;width:80px;"></video>
                    <Icon type="md-download" @click='downRow(item,index)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;"
                      v-if='showShodow' />
                  </div>
                </div>
                <Spin fix v-if='spinShow'>
                  <Icon type="ios-loading" size=20 class="demo-spin-icon-load" style='margin-right: 6px;'></Icon>
                  <div>下载中...</div>
                </Spin>
              </div>
            </div>
            <!-- <div style="width:110px;padding: 0 4px;">
              <div>
                <div></div>
              </div>
            </div> -->
          </div>
          <div class='picContent'>
            <div style="width:87px ;text-align: center;display: flex;">
              <div style="margin: auto 0;" class='sameItem'>备注</div>
            </div>
            <div style="width:571px;min-height: 36px;border-left:1px solid #eee;">
              <div class="sameItem">{{checkRemark}}</div>
            </div>
          </div>
          <div class='picContent'>
            <div style="width:87px ;text-align: center;display: flex;">
              <div style="margin: auto 0;" class='sameItem'>检查人</div>
            </div>
            <div style="width:571px;height: 36px;border-left:1px solid #eee;line-height: 36px;">
              <div class="sameItem">{{checkerName}}</div>
            </div>
          </div>
          <div class='picContent'>
            <div style="width:87px ;text-align: center;display: flex;">
              <div style="margin: auto 0;" class='sameItem'>用户签字</div>
            </div>
            <div style="width:243px ;text-align: center;display: flex;border-right: 1px solid #eee ;border-left:1px solid #eee;">
              <div class='sameItem'><img @click='viewSign(userSign)' :src="userSign" alt="" v-if='userSign' style='height: 64px;width: auto;margin-left: 10px;display: inline-block;cursor: pointer;' /></div>
              <Modal title="用户签名" v-model="visible1" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>
                <div class="rotateModal" @click='handleRotate' title='旋转'>
							
								</div>	
                <img :src="imgUrl" v-if="visible1" class="imgModal" ref='imgModal'>
              </Modal>
            </div>
            <div style="width:86px ;text-align: center;display: flex;">
              <div style="margin: auto 0;" class='sameItem'>联系方式</div>
            </div>
            <div style="width:243px;height: 70px;border-left:1px solid #eee;line-height: 70px;">
              <div class="sameItem">{{userPhone}}</div>
            </div>
          </div>
          <div class='picContent'>
            <div style="width:87px ;text-align: center;display: flex;">
              <div style="margin: auto 0;" class='sameItem'>审核人</div>
            </div>
            <div style="width:242px ;text-align: center;display: flex;border-right: 1px solid #eee ;border-left:1px solid #eee;">
              <div style="margin: auto 0;" class='sameItem'>{{auditor1Name}}</div>
            </div>
            <div style="width:86px ;text-align: center;display: flex;">
              <div style="margin: auto 0;" class='sameItem'>抽样复查人</div>
            </div>
            <div style="width:242px;height: 70px;border-left:1px solid #eee;line-height: 70px;">
              <div>{{auditor2Name}}</div>
            </div>
          </div>
          <div class='checkTimeBox'><span>检查时间：</span><span>{{checkDate}}</span></div>
        </div>
      </section>
      <div class="btnBox">
        <div>
          <Button @click='prePageClick1' type="warning" style="margin: 0 5px;font-size: 24px;" title="上一条" v-if='$route.params.type==1'>
            <Icon type="md-arrow-back" /></Button>
          <Button @click='nextPageClick1' type="warning" style="margin: 0 5px;font-size: 24px;" title='下一条' v-if='$route.params.type==1'>
            <Icon type="md-arrow-forward" /></Button>
          <Button @click='handleBackClick' style="margin: 0 5px;font-size: 24px;background: #59a533;border-color: #59a533;"
            type="warning" title="返回">
            <Icon type="ios-redo" /></Button>
        </div>
        <div style="margin-top: 10px;">
          <Button type="success" @click='print' v-has='1037'>打印</Button>
          <div style="display: inline-block;" v-has='872'>
            <Button type="info" @click='examClick' v-if='checkNum==0'>审核</Button>
          </div>
          <div style="display: inline-block;" v-has='873'>
            <Button type="info" @click='examClick' v-if='checkNum==2'>抽样复查</Button>
          </div>
          <div style="display: inline-block;" v-has='"checkInfo-reallocate"'>
            <Button type="info" style="background: #1534e6b5;border-color: #1534e6b5;" @click='reallocateClick(checkNum)' v-if='(checkNum==1||checkNum==4)&&!isReallocate'>重新分配</Button>
          </div>
        </div>

      </div>
      <div class="btnWrapper">
        <Button @click='prePageClick' type="info" style="margin: 0 5px;font-size: 24px;float: left;" title="上一条">
          <Icon type="md-arrow-back" /></Button>
        <Button @click='nextPageClick' type="info" style="margin: 0 5px;font-size: 24px;float: right;" title='下一条'>
          <Icon type="md-arrow-forward" /></Button>
      </div>
    </div>
    <auditCheck v-if='examShow' :examId='examId' :checkNum='checkNum' :itemShow='itemShow' @examShow='examShowMethods'
      @uploadData='uploadDataMethods'></auditCheck>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import Print from '@/plugs/print';
	import auditCheck from './auditCheck';
  import Viewer from 'v-viewer';
  import 'viewerjs/dist/viewer.css';
  Vue.use(Viewer);

  Viewer.setDefaults({
      inline: false,
      button: true,
      navbar: false,
      title: false,
      toolbar: true,
      tooltip: true,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: true,
      transition: true,
      fullscreen: true,
      keyboard: true,
      // url: 'data-source'

  });
	Vue.use(Print)
	export default {
		'name': 'checkInfo',
		components:{
			auditCheck
		},
		data() {
			return {
				rotateIndex:0,
        isReallocate:0,
        checkRemark:null,
				lastListArr:[],
				listArr:[],
				examShow:false,
				spinShow: false,
				checkContentId: [],
				showShodow: true,
				userData: (JSON.parse(this.$store.state.userData)),
				checkList: [],
				checkItem: '',
				checkType: '',
				checkDate: '',
				userAccountNumber: '',
				userName: '',
				address: '',
				checkResult: '',
				otherIssue: '',
				checkerName: '',
				auditor1Name: '',
				auditor2Name: '',
				newPic: [],
				imgUrl: '',
				visible: false,
				visible1: false,
				newVideo: [],
				userSign: null,
				checkCode: null,
				newList: [],
				userTypeName:'',
				checkNum:(this.$store.state.checkInfo.checkNum),
				lastCheckContentId:[],
				newLastPic:[],
				newLastVideo:[],
				comCheckContentId:[],
				comNewPic:[],
				comNewVideo:[],
				examId:null,
				newLastList:[]
		
			}
		},
		created(){

		},
		methods: {
			handleCancel(){
				this.rotateIndex=0;
			},
			handleRotate(){
				this.rotateIndex=this.rotateIndex+1;
				this.$refs.imgModal.style.transform='rotate('+ 90*this.rotateIndex +'deg)';
			},
      //重新分配
      reallocateClick(checkNum){
         let createBasis= checkNum==1?3:4;
        this.$Modal.confirm({
        					title: '是否重新分配？',
        					content: '',
        					onOk: () => {
        						_http.http1('post', pathUrls.securitycheckWebReallocate,{
                      id:this.$route.params.id,
                      createBasis:createBasis
                    },'form'

        						).then((res) => {
        							if(res.code == 0) {
        								this.$Message['success']({
        									background: true,
        									content: '分配成功!',
                          onClose: (() => {
                          			this.getSecuritycheckInfo()
                          	})
        								});


        							}

        						}).catch((res) => {

        						})
        					},
        					onCancel: () => {}
        				});
      },

			//分页顺序下一条
			nextPageClick1(){
				this.preNextInfo(2,2);
			},
			//分页顺序上一条
			prePageClick1(){
				this.preNextInfo(1,2);
			},
			//同一用户下一条
			nextPageClick() {
				this.preNextInfo(2,1);
			},
			//同一用户上一条
			prePageClick() {

				this.preNextInfo(1,1);
			},
			//上下条数据获取
			preNextInfo(type,clickType) {
					let fData={};
					if(JSON.stringify(this.$store.state.checkInfo)=='{}'){

					}else{
						fData=JSON.parse(this.$store.state.checkInfo);
					}

						fData.checkId=this.examId;
						if(clickType==1){
							fData.userAccountNumber=this.userAccountNumber;
						}
						else{
							delete fData.userAccountNumber;
						}
            if(!fData.checkTypeId){
               delete fData.checkTypeId;
            }
						delete fData.checkNum;
						fData.queryType=type;

				_http.http1('post',pathUrls.webQueryCheckInfo,fData, 'form').then((res) => {
					if(res.data) {
					this.comCheckContentId=[];
					this.comNewPic=[];
					this.comNewVideo=[];
					this.newLastVideo=[];
					this.newLastPic=[];
					this.lastCheckContentId=[];
					this.newPic=[];
					this.newVideo=[];
					this.checkContentId=[];
					this.checkItem =null;
					this.checkType = null;
					this.userTypeName=null;
					this.checkDate = null;
					this.userAccountNumber =null;
					this.userName =null;
					this.address = null;
					this.checkResult =null;
					this.otherIssue = null;
					this.checkerName =null;
					this.userPhone = null;
					this.auditor1Name = null;
					this.auditor2Name =null;
					this.checkNum=0;
					this.userSign=null;
          this.checkRemark=null;
          this.isReallocate=null;

					let checkInfo = res.data;
          this.checkRemark=checkInfo.checkRemark;
					this.examId=checkInfo.id;
					this.checkItem = checkInfo.checkItem;
					this.checkType = checkInfo.checkType;
					this.userTypeName=checkInfo.userTypeName;
					this.checkDate = checkInfo.checkDate;
					this.userAccountNumber = checkInfo.userAccountNumber;
					this.userName = checkInfo.userName;
					this.address = checkInfo.address;
					this.checkResult = checkInfo.checkResult;
					this.otherIssue = checkInfo.otherIssue;
					this.checkerName = checkInfo.checkerName;
					this.userPhone = checkInfo.userPhone;
					this.auditor1Name = checkInfo.auditor1Name;
					this.auditor2Name = checkInfo.auditor2Name;
					this.checkNum=checkInfo.isCheck;
          this.isReallocate=checkInfo.isReallocate;
					if(checkInfo.checkContent) {
						this.checkContentId = checkInfo.checkContent.split(",");
						//				this.checkContentId=['76','77']
					}

					this.userSign = checkInfo.userSign;
					let ids = checkInfo.id + '';
					let zeroStr = '';
					for(let i = 0; i < 9 - ids.length; i++) {
						zeroStr += '0'
					}
					this.checkCode = 'PASC' + zeroStr + ids;

					if(checkInfo.scenePic) {
						this.newPic = checkInfo.scenePic.split(",");
					}
					if(checkInfo.sceneVideo) {
						this.newVideo = checkInfo.sceneVideo.split(",");
//						this.newVideo = ['https://source.payq-iot.com/upload/file/202003181511174726.mp4', 'https://source.payq-iot.com/upload/file/202003181511174726.mp4']
					}
					if(checkInfo.lastCheckContent){
						this.lastCheckContentId=checkInfo.lastCheckContent.split(",");
					}
					if(checkInfo.lastScenePic) {
						this.newLastPic = checkInfo.lastScenePic.split(",");
					}
					if(checkInfo.lastSceneVideo) {
						this.newLastVideo = checkInfo.lastSceneVideo.split(",");
//						this.newVideo = ['https://source.payq-iot.com/upload/file/202003181511174726.mp4', 'https://source.payq-iot.com/upload/file/202003181511174726.mp4']
					}
					this.getCheckInfo()
//					this.comCheckContentId=[...new Set([...this.lastCheckContentId,...this.checkContentId])];
//					this.comNewPic=[...this.newLastPic,...this.newPic];
//					this.comNewVideo=[...this.newLastVideo,...this.newVideo];
//						this.examId = res.data.id;
						this.$router.replace('/securityRecord/checkInfo' + '/' + this.examId+'/1')
					}else{
						let contents='';
						if(type==1){
							contents='已经到顶了!';
						}else{
							contents='已经到底了!';
						}
						this.$Message['warning']({
								background: true,
								content:contents,
							});
							return false
					}
				})

			},
			//刷新
			uploadDataMethods(data){
				if(data){
					this.getSecuritycheckInfo();
				}
			},
			//关闭审核弹框
			examShowMethods(data){
				this.examShow=data;
			},
			//点击审批
			examClick(){

				this.examShow=true;
				if(this.checkNum==0){
					this.itemShow=true;
				}else{
					this.itemShow=false;
				}
			},
			//视频下载
			downRow(url, index) {
				this.spinShow = true;
				let that = this
				let oReq = new XMLHttpRequest();
				oReq.open("GET", `${url}`, true);
				oReq.responseType = "blob";
				//oReq.withCredentials = true;//如果跨域
				oReq.onload = function(oEvent) {
					that.spinShow = false;
					let content = oReq.response;
					let elink = document.createElement('a');
					elink.download = `现场视频${index+1}.mp4`;
					elink.style.display = 'none';
					let blob = new Blob([content])
					elink.href = URL.createObjectURL(blob);
					document.body.appendChild(elink);
					elink.click();
					document.body.removeChild(elink);
				};
				oReq.send();
			},
			//图片下载
			down(url) {
        this.imgUrl=url;
				this.downloadIamge(this.imgUrl, '现场图片')
			},
			downloadIamge(imgsrc, name) { // 下载图片地址和图片名
				var image = new Image()
				// 解决跨域 Canvas 污染问题
				image.setAttribute('crossOrigin', 'anonymous')
				image.onload = function() {
					var canvas = document.createElement('canvas')
					canvas.width = image.width
					canvas.height = image.height
					var context = canvas.getContext('2d')
					context.drawImage(image, 0, 0, image.width, image.height)
					var url = canvas.toDataURL('image/jpeg') // 得到图片的base64编码数据
					var a = document.createElement('a') // 生成一个a元素
					var event = new MouseEvent('click') // 创建一个单击事件
					a.download = name || 'photo' // 设置图片名称
					a.href = url // 将生成的URL设置为a.href属性
					a.dispatchEvent(event) // 触发a的单击事件
				}
				image.src = imgsrc
			},
			//获取详情
			getSecuritycheckInfo() {
					let newUrl=pathUrls.securitycheckInfo;
					if(this.$route.params.type==1){
							newUrl=pathUrls.securitycheckInfo;
					}else{
							newUrl=pathUrls.securitycheckGetInfoByUserId;
					}
				_http.http1('get', newUrl + '/' + this.$route.params.id, {}, 'form').then((res) => {
					let checkInfo = res.securityCheck;
					this.examId=checkInfo.id;
					this.checkItem = checkInfo.checkItem;
					this.checkType = checkInfo.checkType;
					this.userTypeName=checkInfo.userTypeName;
					this.checkDate = checkInfo.checkDate;
					this.userAccountNumber = checkInfo.userAccountNumber;
					this.userName = checkInfo.userName;
					this.address = checkInfo.address;
					this.checkResult = checkInfo.checkResult;
					this.otherIssue = checkInfo.otherIssue;
					this.checkerName = checkInfo.checkerName;
					this.userPhone = checkInfo.userPhone;
					this.auditor1Name = checkInfo.auditor1Name;
					this.auditor2Name = checkInfo.auditor2Name;
					this.checkNum=checkInfo.isCheck;
          this.checkRemark=checkInfo.checkRemark;
          this.isReallocate=checkInfo.isReallocate;
					if(checkInfo.checkContent) {
						this.checkContentId = checkInfo.checkContent.split(",");
						//				this.checkContentId=['76','77']
					}

					this.userSign = checkInfo.userSign;
					let ids = checkInfo.id + '';
					let zeroStr = '';
					for(let i = 0; i < 9 - ids.length; i++) {
						zeroStr += '0'
					}
					this.checkCode = 'PASC' + zeroStr + ids;
					this.getCheckInfo()
					if(checkInfo.scenePic) {
						this.newPic = checkInfo.scenePic.split(",");
					}
					if(checkInfo.sceneVideo) {
						this.newVideo = checkInfo.sceneVideo.split(",");
//						this.newVideo = ['https://source.payq-iot.com/upload/file/202003181511174726.mp4', 'https://source.payq-iot.com/upload/file/202003181511174726.mp4']
					}
					if(checkInfo.lastCheckContent){
						this.lastCheckContentId=checkInfo.lastCheckContent.split(",");
					}
					if(checkInfo.lastScenePic) {
						this.newLastPic = checkInfo.lastScenePic.split(",");
					}
					if(checkInfo.lastSceneVideo) {
						this.newLastVideo = checkInfo.lastSceneVideo.split(",");
//						this.newVideo = ['https://source.payq-iot.com/upload/file/202003181511174726.mp4', 'https://source.payq-iot.com/upload/file/202003181511174726.mp4']
					}
//					this.comCheckContentId=[...new Set([...this.lastCheckContentId,...this.checkContentId])];
//					this.comNewPic=[...this.newLastPic,...this.newPic];
//					this.comNewVideo=[...this.newLastVideo,...this.newVideo];
				})
			},
			//打印
			print() {
				this.showShodow = false;
				setTimeout(() => {
					this.$print(this.$refs.print)
				}, 100)
				setTimeout(() => {
					this.showShodow = true;
				}, 300)

			},
			//返回
			handleBackClick() {
				this.$router.go(-1);
			},
			//获取安检项详情
			getCheckInfo() {
				this.newList=[];
				this.newLastList=[];
				this.listArr=[];
				this.lastListArr=[]
				let nameObj={};
				let lastNameObj={};
				_http.http1('get', pathUrls.checkTypeList + '?securityCheckId=' + this.examId, {}, 'form').then((res) => {
					if(res.checkTypeList) {
						res.checkTypeList.forEach((item) => {
							item.checked = false;
							if(this.checkContentId) {
								if(this.checkContentId.indexOf(item.typeId + '') != -1 || this.checkContentId.indexOf(item.typeContent) != -1) {
									item.checked = true
									this.newList.push(item);


								}

							}
							if(this.lastCheckContentId) {
								if(this.lastCheckContentId.indexOf(item.typeId + '') != -1 || this.lastCheckContentId.indexOf(item.typeContent) != -1) {
									item.checked = true
									this.newLastList.push(item);
								}
							}

						})

						for(let item of this.newList){
							if(!nameObj[item.typeName]){
							        this.listArr.push({
							            typeName:item.typeName,
							            data: [item]
							        });
							        nameObj[item.typeName] = item;
							    }else{
							    	for(let items of this.listArr){
							    		if(items.typeName == item.typeName){
								                items.data.push(item);
								                break;
								            }
							    	}


							    }
						}


						for(let item of this.newLastList){
							if(!lastNameObj[item.typeName]){
							        this.lastListArr.push({
							            typeName:item.typeName,
							            data: [item]
							        });
							        lastNameObj[item.typeName] = item;
							    }else{
							    	for(let items of this.lastListArr){
							    		if(items.typeName == item.typeName){
								                items.data.push(item);
								                break;
								            }
							    	}


							    }
						}



					}
					this.checkList = res.checkTypeList;
					//					console.log(this.checkList);
					//					console.log(this.checkContentId);

				})
			},
			//查看图片
			viewPic(url) {
				this.visible = true;
				this.imgUrl = url;
			},
			//查看签名
			viewSign(url) {
				this.visible1 = true;
				this.imgUrl = url;
			}
		},
		mounted() {

			this.getSecuritycheckInfo()

		}
	}
</script>

<style type="text/css" scoped>
  .mainBody {
    padding: 10px 40px 20px 40px;
    overflow-y: auto;
    position: relative;
  }

  .formContent {
    width: 700px;
    height: auto;
    border: 1px solid #dcdee2;
    /*margin: auto;*/
    margin-left: 10px;
    padding: 20px;
  }

  .startContent {
    box-shadow: 0 2px 12px 0 #40a9ff75;
  }

  .newContent {
    box-shadow: none;
  }

  .formTitle {
    width: 100%;
    text-align: center;
    color: #000;
    font-size: 18px;
  }

  .reportCode {
    text-align: right;
  }

  .sameBox {
    display: flex;
  }

  .sameBox div {
    width: 50%;
    height: 20px;
    line-height: 20px;
    margin: 3px 0;
  }

  .tableHead {
    background: #E2EEFF;
    /* margin-top: 18px; */
    color: #51B5EA;
    display: flex;
    height: 32px;
    line-height: 30px;
    border: 1px solid #eee;
    font-weight: 600;
  }

  .tableHead div {
    /*margin: 0 2px;*/
    /*padding: 0 4px;*/
  }

  .checkContent {
    display: flex;
    font-size: 12px;
    border: 1px solid #eee;
    border-top: 0;
    border-bottom: 0;
  }

  .sameItem {
    padding-left: 3px;
    /*margin: 0 2px;*/
    /*padding: 0 4px;*/
  }

  .itemWrape {
    /*margin: 0 4px;*/
  }

  .itemWrape div {
    border-bottom: 1px solid #eee;
    padding: 4px;
  }

  .picContent {
    display: flex;
    font-size: 12px;
    border: 1px solid #eee;
    border-top: 0;
  }

  .checkTimeBox {
    text-align: right;
    margin-top: 20px;
  }

  .btnBox {
    position: absolute;
    top: 20px;
    left: 800px;
    text-align: center;
    min-width: 200px;
  }

  .btnBox button {
    margin: 0 10px;
    height: 28px;
    line-height: 26px;
    padding: 0 12px;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  .btnWrapper {
    width: 680px;
    position: absolute;
    top: 20px;
    left: 60px;
  }

  .btnWrapper button {
    margin: 0 10px;
    height: 28px;
    line-height: 26px;
    padding: 0 12px;
  }

  .oneLine {
    line-height: 40px !important;
  }

  .twoLine {
    line-height: 60px !important;
  }

  .adressWrapper {
    height: auto !important;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
