<template>
  <div class="infoMain">
        <h3 class="messageTitle">{{messageTitle}}</h3>
         <div class="typeClass"><span>{{messageTime}}</span><span>{{messageTypeName}}</span></div>
        <div class="infoContent">
        		<!--<div class="backBtn" @click="handleBack"><img src="@/assets/images/backClick.png" alt="" /></div>-->
        		<div v-html='turn(messageContent)'>
        				<!--{{messageContent}}-->
        				<!--<div v-for='item in newContent' :key='item' v-if='item' class="contentList">{{item}}</div>-->
        		</div>

        </div>
  </div>
</template>
<script>
import _http from '@/public/http';
import { pathUrls } from '@/public/path';
export default {
  name: 'messageInfo',
  data () {
    return {
    	newContent:[],
     	messageTitle:'',
      messageContent:'',
      messageTypeName:'',
      messageTime:''
    }
  },
  methods: {
  	turn(data) {
         return data.replace(/(\r\n|\n|\r)/gm, "<br/>");
		},
		handleBack(){
			this.$router.go(-1);
		},
		getMessageInfo(){
      		_http.http1('get', pathUrls.messageinfoInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
      				if(res){
      					let datas=res.messageInfo;
      					this.messageType=datas.messageType;
      					this.receiveType=datas.receiveType;
      					this.messageTitle=datas.title;
								this.messageContent=datas.content;
								this.messageTime=datas.createTime;
								switch(datas.messageType){
      							case 0:
								this.messageTypeName = "系统消息";
								break;
								case 1:
								this.messageTypeName = "业务消息";
								break;
								case 2:
								this.messageTypeName = "通知";
								break;
								case 3:
								this.messageTypeName = "公告";
								break;
      						}
//								this.newContent=datas.content.split('#')

      				}
      				      		})
      	},

  },
  mounted () {
			this.getMessageInfo()
  },

}
</script>
<style  type="text/css" scoped>
  .infoMain{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #fff;
    z-index: 1000;
    padding: 20px;
  }
  .infoContent{
    text-align: left;
    width: 1000px;
    margin:0 auto;
    height:calc(100% - 20px );
    background:#d1dbdc26;
    padding: 20px;
    position: relative;
    color: #000;
    font-size: 18px;
    font-family:"楷体";
    overflow-y: auto;
  }
  .backBtn{
  	position: absolute;
  	left: 0px;
  	top: -30px;
  	cursor: pointer;
  }
  .typeClass{
  	/*position: absolute;
  	right:10px;
  	top: -20px;*/
  	font-size: 14px;

  	width: 1000px;
  	margin:0 auto;
  }
  .typeClass span{
  	margin: 0 30px;
  }
  .messageTitle{
  	font-size: 18px;
  	min-height: 30px;
  	line-height: 30px;
  	/*background:#b2e4160a;*/
  	width: 1000px;
  	margin:0 auto;
  	color: #333;

  }
  .contentList{
  	line-height: 24px;
  }
  .contentList:before{
  	content: '•';
  }

</style>
