<template>
  <div class="mainBorder">
    <div class='mainHeader'>
      <span>详情</span>
      <Icon type="md-close" class='closeIcon' @click='handleBackClick' />
    </div>
    <div class="mainBody">
      <section ref="newPrint">
        <div :class="showShodow?'startContent':newContent" class="formContent">
          <div class='formTitle'>区域自查单</div>
          <div class='sameBox'>
            <div><span>客户名称：</span><span>{{userName}}</span></div>
            <div><span>联系方式：</span><span>{{userPhoneNumber}}</span></div>
          </div>
          <div class='sameBox'>
            <div><span>巡查时间：</span><span>{{createTime}}</span></div>
            <div><span>客户地址：</span><span>{{userAddress}}</span></div>
          </div>
          <div class='sameBox'>
            <div><span>客户末次服务人员：</span><span>{{lastStaffName}}</span></div>
             <div><span>审核人：</span><span>{{reviewerName}}</span></div>
          </div>
          <div class='tableHead'>
            <div  class="headLeft">类别</div>
            <div  class="headRight">巡查内容</div>
          </div>
          <div class="tableContent">
            <div class="contentItem" v-if='lastInspection'>
              <div class="userInspection">
                <div style="margin: auto 0;">上次巡查记录</div>
              </div>
              <div class="userInspectionInfo">
                <div style="border-bottom: 1px solid #eee;display: flex;">
                  <div style="border-right:1px solid #eee ;padding: 2px;min-width: 65px;display: flex;">
                    <div style="margin: auto 0;">巡查结论</div>
                  </div>
                  <div style="padding-left: 2px;">{{lastInspection.conclusion}}</div>
                </div>

                <div style="display: flex;border-bottom: 1px solid #eee;">
                  <div style="border-right:1px solid #eee ;padding: 2px;min-width: 65px;display: flex;">
                    <div style="margin: auto 0;">图片影像</div>
                  </div>
                  <div style="padding-left: 2px;">
                    <div style="position: relative;padding-top: 5px;">
                      <div>
                        <viewer :images="lastInspection.lastRealTimeArray" style='text-align: center;'>
                          <div v-if='src.substring(src.length-3)!="mp4"' style="display: inline-block;padding-top: 5px;"
                            v-for="src in lastInspection.lastRealTimeArray" :key="src">
                            <img :src="src" style="height:80px ;width: auto;margin: 0 5px;cursor: pointer;">
                            <Icon type="md-download" @click='down(src)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;"
                              v-if='showShodow' />
                          </div>
                        </viewer>
                        <div v-if='items.substring(items.length-3)=="mp4"' v-for='(items,vindex) in lastInspection.lastRealTimeArray'
                          :key='vindex' style="display: inline-block;">
                          <video controls="controls" :src="items" style="height: 80px;width:80px;"></video>
                          <Icon type="md-download" @click='downRow(items,vindex)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;"
                            v-if='showShodow' />
                        </div>
                      </div>
                      <Spin fix v-if='spinShow'>
                        <Icon type="ios-loading" size=20 class="demo-spin-icon-load" style='margin-right: 6px;'></Icon>
                        <div>下载中...</div>
                      </Spin>
                    </div>
                  </div>
                </div>
                <div style="border-bottom: 1px solid #eee;display: flex;">
                  <div style="border-right:1px solid #eee ;padding: 2px;min-width: 65px;display: flex;">
                    <div style="margin: auto 0;">溯源信息</div>
                  </div>
                  <div style="padding-left: 2px;">
                    <viewer :images="lastInspection.sourceArray" style='text-align: center;'>
                      <div style="display: inline-block;padding-top: 5px;" v-for="src in lastInspection.sourceArray"
                        :key="src">
                        <img :src="src" style="height:80px ;width: auto;margin: 0 5px;cursor: pointer;">
                        <Icon type="md-download" @click='down(src)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;"
                          v-if='showShodow' />
                      </div>
                    </viewer>
                  </div>

                </div>
              </div>
            </div>
            <div class="contentItem">
              <div class="userInspection">
                <div style="margin: auto 0;">本次巡查情况</div>
              </div>
              <div  class="userInspectionInfo">

                <div style="display: flex;border-bottom: 1px solid #eee;">
                  <div style="border-right:1px solid #eee ;padding: 2px;min-width: 65px;display: flex;">
                    <div style="margin: auto 0;">图片影像</div>
                  </div>
                  <div style="padding-left: 2px;">
                    <div style="position: relative;padding-top: 5px;">
                      <div>
                        <viewer :images="realTimeArray" style='text-align: center;'>
                          <div v-if='src.substring(src.length-3)!="mp4"' style="display: inline-block;padding-top: 5px;"
                            v-for="src in realTimeArray" :key="src">
                            <img :src="src" style="height:80px ;width: auto;margin: 0 5px;cursor: pointer;">
                            <Icon type="md-download" @click='down(src)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;"
                              v-if='showShodow' />
                          </div>
                        </viewer>
                        <div v-if='items.substring(items.length-3)=="mp4"' v-for='(items,vindex) in realTimeArray'
                          :key='vindex' style="display: inline-block;">
                          <video controls="controls" :src="items" style="height: 80px;width:80px;"></video>
                          <Icon type="md-download" @click='downRow(items,vindex)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;"
                            v-if='showShodow' />
                        </div>
                      </div>
                      <Spin fix v-if='spinShow'>
                        <Icon type="ios-loading" size=20 class="demo-spin-icon-load" style='margin-right: 6px;'></Icon>
                        <div>下载中...</div>
                      </Spin>
                    </div>
                  </div>
                </div>
                <div style="border-bottom: 1px solid #eee;display: flex;">
                  <div style="border-right:1px solid #eee ;padding: 2px;min-width: 65px;display: flex;">
                    <div style="margin: auto 0;">溯源信息</div>
                  </div>
                  <div style="padding-left: 2px;">
                    <viewer :images="sourceArray" style='text-align: center;'>
                      <div style="display: inline-block;padding-top: 5px;" v-for="src in sourceArray"
                        :key="src">
                        <img :src="src" style="height:80px ;width: auto;margin: 0 5px;cursor: pointer;">
                        <Icon type="md-download" @click='down(src)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;"
                          v-if='showShodow' />
                      </div>
                    </viewer>
                  </div>

                </div>
              </div>
            </div>
            <div class="contentItem1">
              <div style="border-right: 1px solid #eee;width: 132px;display: flex;">
                <div style="margin: auto 0;">本次巡查结论</div>
              </div>
              <div style="min-height: 28px;line-height: 28px;">{{conclusion}}</div>
            </div>
            <div class="contentItem1">
              <div style="border-right: 1px solid #eee;width: 132px;display: flex;">
                <div style="margin: auto 0;">巡查人员姓名</div>
              </div>
              <div style="height: 28px;line-height: 28px;">{{inspectors}}</div>
            </div>
          </div>
          <div class='auditTimeBox'><span>巡查时间：</span><span>{{createTime}}</span></div>
        </div>
      </section>
      <div class="btnBox">
        <div>
          <Button @click='prePageClick1' type="warning" style="margin: 0 5px;font-size: 24px;" title="上一条">
            <Icon type="md-arrow-back" /></Button>
          <Button @click='nextPageClick1' type="warning" style="margin: 0 5px;font-size: 24px;" title='下一条'>
            <Icon type="md-arrow-forward" /></Button>
        </div>
        <div style="margin-top: 10px;">
          <Button type="success" @click='print' style="margin: 0 5px;font-size: 24px;" title='打印' v-has='1040'>
            <Icon type="ios-print" /></Button>
          <Button @click='handleBackClick' style="margin: 0 5px;font-size: 24px;background: #59a533;border-color: #59a533;"
            type="warning" title="返回">
            <Icon type="ios-redo" /></Button>
        </div>

      </div>
      <div class="btnWrapper">
        <Button @click='prePageClick' type="info" style="margin: 0 5px;font-size: 24px;float: left;" title="上一条">
          <Icon type="md-arrow-back" /></Button>
        <Button @click='nextPageClick' type="info" style="margin: 0 5px;font-size: 24px;float: right;" title='下一条'>
          <Icon type="md-arrow-forward" /></Button>
      </div>
    </div>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import Print from '@/plugs/print';
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
		name: 'inspectionInfo',
		data() {
			return {
        conclusion:"",
        sourceArray:[],
        realTimeArray:[],
        lastInspection:'',

				imgUrl: '',
				visible: false,
				showShodow: true,
				userName: '',
				userPhoneNumber: '',
				userAddress: '',
				createTime: '',
        lastStaffName:'',
        reviewerName:'',
        inspectSearch:{},
				inspectors:'',
				auditId:'',
        userId:'',
			}
		},
		methods: {

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
					elink.download = `视频${index+1}.mp4`;
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
				this.downloadIamge(this.imgUrl, '图片')
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
			//查看图片
			viewPic(url) {
				this.visible = true;
				this.imgUrl = url;
			},
			//上下条接口获取
			auditPreNext(type,userId){
          let fData=this.inspectSearch;
              fData.directionType=type;
              fData.userId=userId;
              fData.createTime=this.createTime;
				_http.http2('post',pathUrls.getLastOrNextInfo,fData).then((res) => {
					if(res.data){

						this.userName=null;
						this.userPhoneNumber=null;
						this.userAddress=null;
            this.lastStaffName=null;
						this.createTime=null;
						this.reviewerName=null;
						this.inspectors=null;
            this.userId=null;
            this.sourceArray=[];
						this.auditId=res.data.id;
            this.realTimeArray=[];
            this.lastInspection='';
						this.$router.replace('/inspectionList/inspectionInfo' + '/' + this.auditId)

						this.userName=res.data.userName;
						this.userPhoneNumber=res.data.userPhoneNumber;
						this.userAddress=res.data.userAddress;
						this.createTime=res.data.createTime;
            this.lastStaffName=res.data.lastStaffName;
            this.reviewerName=res.data.reviewerName;
						this.inspectors=res.data.inspectors;
            this.userId=res.data.userId;
            if(res.data.sourceInfo){
              this.sourceArray=JSON.parse(res.data.sourceInfo);
            }
            if(res.data.realTimeInfo){
              this.realTimeArray=JSON.parse(res.data.realTimeInfo);
            }
            if(res.data.lastUserInspection){
              let lastInspection=res.data.lastUserInspection;
              if(lastInspection.sourceInfo){
                  lastInspection.sourceArray=JSON.parse(lastInspection.sourceInfo);
              }
              if(lastInspection.realTimeInfo){
                  lastInspection.lastRealTimeArray=JSON.parse(lastInspection.realTimeInfo);
              }
              this.lastInspection=lastInspection;
            }
					}
          if(res.code == 500) {
          	this.$Message['warning']({
          		background: true,
          		content: res.msg,
          	});
          }
				})
			},
			//同一用户人上一条
			prePageClick() {
				this.auditPreNext(1,this.userId);
			},
			//同一用户下一条
			nextPageClick() {
				this.auditPreNext(2,this.userId);
			},
			//返回
			handleBackClick() {
				this.$router.go(-1);
			},
			//不同用户上一条
			prePageClick1() {
				this.auditPreNext(1,'');
			},
			//不同用户下一条
			nextPageClick1() {
				this.auditPreNext(2,'');
			},
			//打印
			print() {
				this.showShodow = false;
				this.showEdit=false;
				setTimeout(() => {

					this.$print(this.$refs.newPrint)
				}, 100)
				setTimeout(() => {
					this.showShodow = true;
					this.showEdit=true;
				}, 300)
			},
			//获取详情
			getInspectInfo() {
				_http.http1('get', pathUrls.deptuserinspectionInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
						if(res.data){
						this.userName=res.data.userName;
						this.userPhoneNumber=res.data.userPhoneNumber;
						this.userAddress=res.data.userAddress;
						this.createTime=res.data.createTime;
            this.lastStaffName=res.data.lastStaffName;
            this.reviewerName=res.data.reviewerName;
						this.inspectors=res.data.inspectors;
            this.conclusion=res.data.conclusion;
            this.auditId=res.data.id;
            this.userId=res.data.userId;
            if(res.data.sourceInfo){
              this.sourceArray=JSON.parse(res.data.sourceInfo);
            }
            if(res.data.realTimeInfo){
              this.realTimeArray=JSON.parse(res.data.realTimeInfo);
            }
            if(res.data.lastUserInspection){
              let lastInspection=res.data.lastUserInspection;
              if(lastInspection.sourceInfo){
                  lastInspection.sourceArray=JSON.parse(lastInspection.sourceInfo);
              }
              if(lastInspection.realTimeInfo){
                  lastInspection.lastRealTimeArray=JSON.parse(lastInspection.realTimeInfo);
              }
              this.lastInspection=lastInspection;
            }
						}

				})
			}
		},
		mounted() {
			this.getInspectInfo();
      if(this.$store.state.inspectSearch){
        this.inspectSearch=JSON.parse(this.$store.state.inspectSearch);
        
      }

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

  .formTitle {
    width: 100%;
    text-align: center;
    color: #000;
    font-size: 18px;
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
    margin-top: 18px;
    color: #51B5EA;
    display: flex;
    height: 32px;
    line-height: 30px;
    border: 1px solid #eee;
    font-weight: 600;
  }

  .auditTimeBox {
    text-align: right;
    margin-top: 20px;
  }
  .headLeft{
    width:132px ;
    padding-left: 3px;
    border-right: 1px solid #eee;
  }
  .headRight{
    padding-left: 3px;
    width: calc(100% - 138px);
  }
  .tableContent{
    border: 1px solid #eee;
  }
  .contentItem{
    display: flex;
  }
  .contentItem1{
    display: flex;
    border-bottom: 1px solid #eee;
  }
  .userInspection{
    width:132px ;
    padding-left: 3px;
    border-right:1px solid #eee;
    display: flex;
    border-bottom:1px solid #eee;
  }
  .userInspectionInfo{
    padding-left: 3px;
    width: calc(100% - 132px);
  }
</style>
