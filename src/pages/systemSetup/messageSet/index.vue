<template>
    <div class="main">
			<div class="mainTop">
		        <Form :model="formSearch" inline :label-width="75">
		        	<FormItem label="消息类型">
		              <Select style="width: 200px;" v-model='messageType' placeholder='请选择消息类型' clearable>
		              	<Option :value='0'>系统消息</Option>
		              	<Option :value='1'>业务消息</Option>
		              	<Option :value='2'>通知</Option>
		              	<Option :value='3'>公告</Option>
		              </Select>
		        	</FormItem>
		         <!-- <FormItem label="接收类型">
		              <Select style="width: 200px;" v-model='receiveType' placeholder='请选择接收类型' clearable>
		              	<Option :value='1'>app接收</Option>
		              	<Option :value='2'>web接收</Option>
		              </Select>
		          </FormItem> -->
		          <FormItem >
		                <Button type="primary" @click='handleSearch' style='margin-right: 20px;'>查询</Button>
		                <Button type="success" @click='handleAdd'>新增</Button>
		          </FormItem>
		        </Form>


			</div>
			<div class="mainContent">
				<Table border :columns="columns" :data="dataList" :loading='loading'   highlight-row :height='tableHeight'>
					<template slot-scope="{ row, index }" slot="action">
						<Button type="info" size="small" @click="handleEdit(row.messageId)" style="margin-right: 10px;">编辑</Button>
						<Button type="error" size="small" @click="handleDelete(row)">删除</Button>
					</template>
				</Table>
				<div class="pageMain">
					<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
				</div>
			</div>
    </div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
    export default{
      name:'messageSet',
      data(){
        return{
          receiveType:null,
          messageType:null,
          tableHeight: 'auto',
          screeHeight: document.documentElement.clientHeight, // 屏幕高
        	sizeOpts: [10, 20, 50, 100, 200],
        	pagesSize:10,
        	curpage:1,
        	count:0,
        	loading:false,
			dataList:[{
				messageType:''
			}],
			columns:[{
				title: '消息类型',
				key: 'messageTypeName',
				align: 'center',
			},{
				title: '接收类型',
				key: 'receiveTypeName',
				align: 'center',
        width:110
			},{
				title: '消息标题',
				key: 'title',
				align: 'center',
        minWidth:140,
        tooltip:true
			},{
				title: '创建时间',
				key: 'createTime',
				align: 'center',
			},{
				title: '更新时间',
				key: 'updateTime',
				align: 'center',
			},{
				title: '操作',
				slot: 'action',
				fixed: 'right',
				width: 150,
				align: 'center'
					}]
        }
      },
      methods:{
        handleSearch(){
          this.curpage=1;
          this.getMessageList();
        },

      	//删除
      	handleDelete(v){
         
      		let id=v.messageId;
      		let isRead=v.msgIsRead;
      		this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {

						_http.http2('post', pathUrls.messageinfoMsgDel,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								let counts=this.$store.state.unReadCount;
								if(isRead==0&&v.receiveType==2){
									this.$store.commit('changeUnReadCount',counts-1)
								}

								this.getMessageList()
							}

						})
					},

				});
      	},
      	//编辑
      	handleEdit(id){
      		this.$router.push('/messageSet/messageEdit' + '/' + id)
      	},
      	//获取消息列表
      		getMessageList(){
      				this.loading=true;
      			_http.http1("post", pathUrls.messageinfoQueryList, {
      				page: this.curpage,
              limit: this.pagesSize,
              receiveType:this.receiveType,
              messageType:this.messageType
//					messageIsRead:1
      			}, 'form').then((res) => {
      				this.loading=false;
      				if(res.code==0){
      					this.count=res.count;

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
      					this.dataList=res.data;
                if(this.dataList.length > 10) {
                	if(this.screeHeight > 1050) {
                		this.tableHeight = 770;
                	} else if(this.screeHeight <= 1050 && this.screeHeight > 900) {
                		this.tableHeight = 680;
                	} else if(this.screeHeight <= 900 && this.screeHeight > 850) {
                		this.tableHeight = 536;
                	} else if(this.screeHeight <= 850) {
                		this.tableHeight = 460;
                	}
                } else {

                	this.tableHeight = 48 * this.dataList.length + 56;
                	if(!this.dataList.length){
                		this.tableHeight=100
                	}
                }
      				}
      			})
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
			handleAdd(){
				this.$router.push('/messageSet/messageAdd')
			}
      },
      activated() {
				this.getMessageList()
      },
      mounted(){

      }
    }
</script>

<style type="text/css" scoped>
    .main {
		margin-right: 10px;
		background: #FFFFFF;
		min-height: calc(100% - 10px);
	}

	.mainTop {
		padding: 10px 10px 0;
		width: 100%;
		text-align: left;
	}

	.mainTop>>>.ivu-input-wrapper {
		width: 150px;
	}

	.mainTop>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;
	}

	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
		display: flex;
	}

	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
</style>
