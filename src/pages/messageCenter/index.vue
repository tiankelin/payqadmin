<template>
  <div class="messageMain">
        <h2  class="messageTitle">消息中心</h2>
        <div class="backBtn" @click="handleBack"><Icon type="md-arrow-back" />返回</div>
        <div class="messageContent">

        		<Tabs :animated="false"  @on-click='tabsClick' v-model='tabsCheck' >
							<TabPane label="未读消息" name='0'>
									 <List border	v-if='messageList.length' :loading='loading' class='classList'>
									 	 <ListItem v-for='item in messageList' :key='item' @click="handleDetail(item)">
                       <div @click="handleDetail(item)" style="width: 85%;cursor: pointer;">
                        <ListItemMeta avatar="./static/img/notice.png" :title="item.title" :description="`${item.content?item.content.substring(0,20):''}...`" />
						           </div>
                        <template slot="action">
						                <li @click="handleDetail(item)">
						                    <a href="javascript:void(0);">详情</a>
						                </li>
						                <li @click="handleDelete(item)">
						                    <a href="javascript:void(0);">删除</a>
						                </li>
						            </template>
       								</ListItem>

									 </List>
									 <List border	v-else>
									 		<div style="text-align: center;height: 80px;line-height: 80px;color: #747B8B;font-size: 16px;">暂无数据！</div>
									 </List>
							</TabPane>
							<TabPane label="已读消息" name='1'>
									<List border v-if='messageList.length' :loading='loading' class='classList'>
									 	 <ListItem v-for='item in messageList' :key='item' >
                       <div @click="handleDetail(item)" style="width: 85%;cursor: pointer;">
									 		 <ListItemMeta  avatar="./static/img/notice.png" :title="item.title" :description="`${item.content?item.content.substring(0,20):''}...`" />
                       </div>
						            <template slot="action">
						                <li @click="handleDetail(item)">
						                    <a href="javascript:void(0);">详情</a>
						                </li>
						                <li @click="handleDelete(item)">
						                    <a href="javascript:void(0);">删除</a>
						                </li>
						            </template>

       								</ListItem>

									 </List>
									 <List border	v-else>
									 		<div style="text-align: center;height: 80px;line-height: 80px;color: #747B8B;font-size: 16px;">暂无数据！</div>
									 </List>
							</TabPane>
						</Tabs>
						<div class="pageMain">
								<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
						</div>


        </div>
  </div>
</template>
<script>
import _http from '@/public/http';
import { pathUrls } from '@/public/path';
export default {
  name: 'messageCenter',
  data () {
    return {
    	loading:false,
    	pagesSize:10,
			curpage:1,
			count:0,
      checkChangeFir:true,
      checkChangeSec:false,
      messageList:[],
      isRead:0,
      tabsCheck:0
    }
  },
  methods: {
		handleBack(){
			this.$router.go(-1);
		},
  	//删除
      	handleDelete(v){
      		this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {

						_http.http2('post', pathUrls.messageinfoDelete,
							JSON.stringify([v.messageId])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.getMessageList()
							}

						})
					},

				});
      	},
  	//详情
  	handleDetail(v){
  		if(this.isRead==0){
  			_http.http2('post', `${pathUrls.messageinfoMsgRead}?messageId=${v.messageId}`,

						).then((res) => {
									if(res.code==0){
										this.getMessageList()
									}
						})
  		}

//		this.$router.push('/messageCenter/messageInfo' + '/' + v.messageId);
  		window.open(`#/messageCenter/messageInfo/${v.messageId}`,'_blank')
  	},
  	tabsClick(v){
  		this.curpage=1;
  		this.isRead=v;


  		this.getMessageList();
  	},
  	//改变页数
			pageChange(current) {
				this.curpage = current
				this.getMessageList()

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getMessageList()

			},
  	//获取消息列表
      		getMessageList(){
      				this.loading=true;
      			_http.http1("post", pathUrls.messageinfoList, {
      				page: this.curpage,
							limit: this.pagesSize,
							messageIsRead:this.isRead
      			}, 'form').then((res) => {
      				this.loading=false;
      				if(res.code==0){
      					this.count=res.count;
      					if(this.isRead==0){
      						this.$store.commit('changeUnReadCount', res.count);

      					}
      					for(let item of res.data){
      						switch(item.messageType){
      							case 0:
								item.messageTypeName = "系统消息";
								break;
								case 1:
								item.messageTypeName = "业务消息";
								break;
								case 2:
								item.messageTypeName = "通知";
								break;
								case 3:
								item.messageTypeName = "公告";
								break;
      						}
      						if(item.receiveType==1){
      							item.receiveTypeName='app接收'
      						}else{
      							item.receiveTypeName='web接收'
      						}
      					}
      					this.messageList=res.data;
      				}
      			})
      		},

  },
  created(){

     this.isRead=this.$route.params.id;
  },
	activated() {

				this.getMessageList();
      },
  mounted () {
    this.tabsCheck=this.$route.params.id;

  },

}
</script>
<style  type="text/css" scoped>
  .messageMain{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #fff;
    z-index: 1000;
    padding:20px 20px 10px;
  }
  .messageTitle{
  	font-size: 18px;
  	height: 30px;
  	line-height: 30px;
  	/*background:#b2e4160a;*/
  	width: 1000px;
  	margin:0 auto;
  	color: #333;
  }
  .messageContent{
    text-align: left;
    width: 1000px;
    margin:0 auto;
    height: 100%;
    background:#b2e4160a;
    padding:20px 20px 0;


  }

  .messageMain>>>.ivu-tabs-nav .ivu-tabs-tab{
		height: 32px;
		border-radius:2px;
		background:#e3f8fbb5;
		color: #333;
	}
	.messageMain>>>.ivu-tabs-ink-bar{
		display: none;
	}
	.messageMain>>>.ivu-tabs-tab-active{
		background:#51B5EA!important;
		color: #fff!important;
		margin-bottom: 4px;
	}
  .messageMain>>>.ivu-tabs-bar{
  	/*margin-bottom: 4px!important;*/
  }
	.messageMain>>>.ivu-list-item{
		/*padding: 6px 0!important;*/
	}
	.pageMain{
		margin-top: 10px;
	}
	.backBtn{
  	/*position: absolute;
  	left: 164px;
  	top: 18px;*/
  	cursor: pointer;
  	width: 1000px;
  	margin: 0 auto;
  	text-align: left;
  	font-size: 16px;

  }
  .classList{
  	max-height:calc( 100vh - 200px );
  	overflow-y: auto;

  }
</style>
