<template>
	<div class="mainBorder">
		<div class='mainHeader'>
		    <span>详情</span>
		    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
		</div>
		<div class="mainBody">
			<section ref="newPrint">
				<div :class="showShodow?'startContent':newContent" class="formContent">
					<div class='formTitle'>瓶装燃气用户巡查信息表</div>
					<div class='sameBox'>
						<div><span>被检人姓名：</span><span>{{managerStaffName}}</span></div>
						<div><span>被检人联系方式：</span><span>{{managerStaffPhone}}</span></div>
					</div>
					<div class='sameBox'>
						<div><span>巡查时间：</span><span>{{auditTime}}</span></div>
						<div><span>巡查地址：</span><span>{{address}}</span></div>
					</div>
					<div class='tableHead'>
						<div style="width:40px ;padding-left: 3px;border-right: 1px solid #eee;">序号</div>
						<div style="width:92px ;padding-left: 3px;border-right: 1px solid #eee;">巡查项目</div>
						<div style="padding-left: 3px;width: calc(100% - 142px);">巡查内容</div>
					</div>
					<div class="tableContent" style="border: 1px solid #eee;">
						<div style="display: flex;" v-for='(item,index) in auditArr' :key='index'>
							<div style="width:40px ;padding-left: 3px;border-right:1px solid #eee;display: flex;border-bottom: 1px solid #eee;">
								<div style="margin: auto 0;">{{index+1}}</div>
							</div>
							<div style="width:92px ;padding-left: 3px;border-right:1px solid #eee;display: flex;border-bottom:1px solid #eee;">
								<div style="margin: auto 0;">{{item.auditTypeName}}</div>
							</div>
							<div style="padding-left: 3px;width: calc(100% - 132px);">
								<div style="border-bottom: 1px solid #eee;display: flex;">
									<div style="border-right:1px solid #eee ;padding: 2px;min-width: 60px;display: flex;">
										<div style="margin: auto 0;">内容</div>
									</div>
									<div style="padding-left: 2px;">{{item.auditDetail}}</div>
								</div>
								<div style="border-bottom: 1px solid #eee;display: flex;">
									<div style="border-right:1px solid #eee ;padding: 2px;min-width: 60px;display: flex;">
										<div style="margin: auto 0;">图片</div>
									</div>
									<div style="padding-left: 2px;">
										<!-- <div style="text-align: center;padding-top: 5px;">
											<img v-if='item.newPic' @click='viewPic(items)' :src="items" alt="" v-for='items in item.newPic'  style="height:80px ;width: auto;margin: 0 5px;cursor: pointer;" />
										</div> -->
                    <viewer :images="newPic" style='text-align: center;'>
                       <div style="display: inline-block;padding-top: 5px;" v-for="src in item.newPic" :key="src">
                         <img  :src="src"  style="height:80px ;width: auto;margin: 0 5px;cursor: pointer;">
                         <Icon type="md-download" @click='down(src)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;" v-if='showShodow'/>
                       </div>
                    </viewer>
									</div>
								<!-- 	<Modal title="View Image" v-model="visible" style="height: 10px;width: 10px;text-align: center;">
										<img :src="imgUrl" v-if="visible" style="width:auto;height:250px;">
										<Icon type="md-download" @click='down' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 24px;" />
									</Modal> -->
								</div>
								<div style="display: flex;border-bottom: 1px solid #eee;">
									<div style="border-right:1px solid #eee ;padding: 2px;min-width: 60px;display: flex;">
										<div style="margin: auto 0;">视频</div>
									</div>
									<div style="padding-left: 2px;">
										<div style="position: relative;padding-top: 5px;">
											<div>
												<div v-if='item.newVideo' v-for='(items,vindex) in item.newVideo' :key='vindex' style="display: inline-block;">
													<video controls="controls" :src="items" style="height: 80px;width:80px;"></video>
													<Icon type="md-download" @click='downRow(items,vindex)' style="cursor: pointer;color: #51B5EA;margin-right:2px;font-size: 18px;" v-if='showShodow' />
												</div>
											</div>
											<Spin fix v-if='spinShow'>
												<Icon type="ios-loading" size=20 class="demo-spin-icon-load" style='margin-right: 6px;'></Icon>
												<div>下载中...</div>
											</Spin>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div style="display: flex;border-bottom: 1px solid #eee;">
							<div style="border-right: 1px solid #eee;width: 132px;display: flex;">
								<div style="margin: auto 0;padding-left: 10px;">巡查建议</div>
							</div>
							<div style="min-height: 40px;">{{auditSuggest}}</div>
						</div>
						<div style="display: flex;border-bottom: 1px solid #eee;">
							<div style="border-right: 1px solid #eee;width: 132px;display: flex;">
								<div style="margin: auto 0;padding-left:10px;">巡查人员姓名</div>
							</div>
							<div style="height: 28px;line-height: 28px;">{{auditStaffName}}</div>
						</div>
						<div style="display: flex;">
							<div style="border-right: 1px solid #eee;width: 132px;display: flex;">
								<div style="margin: auto 0;padding-left:10px;">巡查描述</div>
							</div>
							<div style="min-height: 40px;">
								<div v-if='showEdit' style="height: 100%;">
									<Input type="textarea" v-model='auditConclusion' style="width: 400px;margin:4px;" :autosize="{minRows: 2,maxRows: 6}"/>
									<Button type="info" size='small' @click='handleEdit' v-has='1039'>保存</Button>
								</div>
								<div v-else style="max-width:500px ;overflow: hidden;">{{auditConclusion}}</div>
							</div>
						</div>
						
					</div>
					<div class='auditTimeBox'><span>巡查时间：</span><span>{{auditTime}}</span></div>
				</div>
			</section>
			<div class="btnBox">
				<div>
					<Button @click='prePageClick1' type="warning" style="margin: 0 5px;font-size: 24px;" title="上一条"><Icon type="md-arrow-back" /></Button>
					<Button @click='nextPageClick1' type="warning" style="margin: 0 5px;font-size: 24px;" title='下一条'><Icon type="md-arrow-forward" /></Button>
				</div>
				<div style="margin-top: 10px;">
					<Button type="success" @click='print' style="margin: 0 5px;font-size: 24px;" title='打印' v-has='1040'><Icon type="ios-print" /></Button>
					<Button @click='handleBackClick' style="margin: 0 5px;font-size: 24px;background: #59a533;border-color: #59a533;" type="warning" title="返回"><Icon type="ios-redo" /></Button>
				</div>

			</div>
			<div class="btnWrapper">
				<Button @click='prePageClick' type="info" style="margin: 0 5px;font-size: 24px;float: left;" title="上一条"><Icon type="md-arrow-back" /></Button>
				<Button @click='nextPageClick' type="info" style="margin: 0 5px;font-size: 24px;float: right;" title='下一条'><Icon type="md-arrow-forward" /></Button>
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
		name: 'seeInfo',
		data() {
			return {
				showEdit:true,
				auditArr:[],
				imgUrl: '',
				visible: false,
				showShodow: true,
				managerStaffName: '',
				managerStaffPhone: '',
				address: '',
				auditTime: '',
				auditConclusion:'',
				auditStaffName:'',
				auditId:'',
				auditSuggest:''
			}
		},
		methods: {
			handleEdit(){
				let fData={
					id:this.auditId,
					auditConclusion:this.auditConclusion
				}


				_http.http2('post', pathUrls.auditinfoUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '结论修改成功!',
							onClose: (() => {
								this.getInspectInfo()
						})
						});
					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						});
					}
				})
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
			//查看图片
			viewPic(url) {
				this.visible = true;
				this.imgUrl = url;
			},
			//上下条接口获取
			auditPreNext(type){
				_http.http1('post',`${pathUrls.auditPreNext}/${type}/${this.auditId}`, 'form').then((res) => {
					if(res.auditInfo){
						this.auditArr=[];
						this.managerStaffName=null;
						this.managerStaffPhone=null;
						this.address=null;
						this.auditTime=null;
						this.auditConclusion=null;
						this.auditSuggest=null;
						this.auditStaffName=null;
						this.auditId=res.auditInfo.id;
						this.$router.replace('/inspectInfor/seeInfo' + '/' + this.auditId)
						if(res.auditInfo.checkContent){
								let newInfo= JSON.parse(res.auditInfo.checkContent);
								if(newInfo.toString()){
									for(let item of newInfo){
										if(item.auditPic){
											item.newPic=item.auditPic.split(',');
										}else{
											item.newPic=[];
										}
										if(item.auditVoide){
											item.newVideo=item.auditVoide.split(',');
										}else{
											item.newVideo=[];

										}
//										item.newVideo=["https://source.payq-iot.com/upload/file/202005151342471191.mp4","https://source.payq-iot.com/upload/file/202005151342471191.mp4"]
									}
									this.auditArr=newInfo;

								}
							}
						this.managerStaffName=res.auditInfo.managerStaffName;
						this.managerStaffPhone=res.auditInfo.managerStaffPhone;
						this.address=res.auditInfo.auditAddress;
						this.auditTime=res.auditInfo.createTime;
						this.auditConclusion=res.auditInfo.auditConclusion;
						this.auditSuggest=res.auditInfo.auditSuggest;
						this.auditStaffName=res.auditInfo.auditStaffName;

					}else{
						let contents='';
						if(type==2||type==3){
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
			//同一被检人上一条
			prePageClick() {
				this.auditPreNext(3);
			},
			//同一被检人下一条
			nextPageClick() {
				this.auditPreNext(4);
			},
			//返回
			handleBackClick() {
				this.$router.go(-1);
			},
			//不同被检人上一条
			prePageClick1() {
				this.auditPreNext(2);
			},
			//不同被检人下一条
			nextPageClick1() {
				this.auditPreNext(1);
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
				_http.http1('get', pathUrls.auditinfoInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
						if(res.auditInfo){
							if(res.auditInfo.checkContent){
								let newInfo= JSON.parse(res.auditInfo.checkContent);
								if(newInfo.toString()){
									for(let item of newInfo){
										if(item.auditPic){
											item.newPic=item.auditPic.split(',');
										}else{
											item.newPic=[];
										}
										if(item.auditVoide){
											item.newVideo=item.auditVoide.split(',');
										}else{
											item.newVideo=[];

										}
//										item.newVideo=["https://source.payq-iot.com/upload/file/202005151342471191.mp4","https://source.payq-iot.com/upload/file/202005151342471191.mp4"]
									}
									this.auditArr=newInfo;

								}
							}
						this.managerStaffName=res.auditInfo.managerStaffName;
						this.managerStaffPhone=res.auditInfo.managerStaffPhone;
						this.address=res.auditInfo.auditAddress;
						this.auditTime=res.auditInfo.createTime;
						this.auditConclusion=res.auditInfo.auditConclusion;
						this.auditStaffName=res.auditInfo.auditStaffName;
						this.auditId=res.auditInfo.id;
						}

				})
			}
		},
		mounted() {
			this.getInspectInfo()
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
</style>
