<template>
    <div class="correctionMain">
        <div class="correctionContent">
            <div class="closeWrapper" @click='handleClose'><Icon type="md-close" /></div>
            <h3 class="correctionTitle">纠错</h3>
            <div>
                <div style="padding:10px 0;"><Button type='success' size='small' style='width: 150px;' @click='handleCorrectionAdd'>添加</Button></div>
                <div class="correctionList">
                    <div v-for='(item,index) in bottleInfoList' :key='item' style="margin-bottom: 10px;">
                        <span>电子标签码：</span>
                        <Input @on-keyup="item.bottleTag=item.bottleTag.replace(/\s+/g,'')" v-model='item.bottleTag'
                        style='width: 200px;margin-right: 20px;' placeholder='电子标签码'/>
                        <span>钢瓶条码：</span>
                        <Input v-model='item.bottleCode'  @on-keyup="item.bottleCode=item.bottleCode.replace(/\s+/g,'')"
                        style='width: 200px;margin-right: 10px;' placeholder='钢瓶条码'/>
                        <Button type='error' size='small' @click='handleCorrectionDelete(index)' v-if='index!=0'>删除</Button>
                    </div>
                </div>
            </div>
            <div  class="mainBodyButton">
            	<Button type="primary" @click='handleCorrectionSave' :disabled="isDisabled">确定</Button>
            	<Button style="margin-left: 8px" @click='handleClose'>返回</Button>
            </div>
        </div>
    </div>
</template>

<script>
  import _http from '@/public/http';
  import { pathUrls } from '@/public/path';
    export default{
      name:'errorCorrection',
      data(){
        return{
          isDisabled:false,
          bottleInfoList:[{
            bottleTag:'',
            bottleCode:''
          }]
        }
      },
      methods:{
        //关闭
        handleClose(){
        	this.$emit('correction',1);
        },
        //添加
        handleCorrectionAdd(){
            this.bottleInfoList.push({
              bottleTag:'',
              bottleCode:''
            })
          },
        //删除
        handleCorrectionDelete(index){
          this.bottleInfoList.splice(index,1);
        },
        //保存
        handleCorrectionSave(){
            let bottleInfoList=[];
            for(let item of this.bottleInfoList){
                if(item.bottleTag&&item.bottleCode){
                    bottleInfoList.push(item);
                }
            }
            if(bottleInfoList.length<this.bottleInfoList.length){
                  this.$Message['warning']({
                  	background: true,
                  	content:'电子标签码或钢瓶条码不能为空！',
                  });
                  return false;
              }
              let fData={
                  bottleInfoList:JSON.stringify(bottleInfoList)
              }
              this.isDisabled=true;
              _http.http1('post', pathUrls.batchCorrection, fData,'form').then((res) => {

              	if(res.code == 0) {
              		this.$Message['success']({
              			background: true,
              			content: '纠错成功!',
              			onClose: (() => {
              				this.$emit('correction',2);
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
      mounted(){

      }
    }
</script>

<style type="text/css" scoped>
 .correctionMain{
   position: absolute;
   left: 0;
   top: 0;
   right: 0;
   bottom: 0;
   background:#fff;
   z-index: 300;

 }
 .correctionContent{
   position: relative;
   text-align: left;
   padding: 10px 20px;

 }
 .closeWrapper{
 	position: absolute;
 	right: 12px;
 	top:0px;
 	font-size: 32px;
 	cursor: pointer;
 	color:#1296db;
 	font-weight: 600;
 }
 .correctionList{
  height:calc( 100vh - 170px );
  overflow: hidden;
  overflow-y: auto;

   }
</style>
