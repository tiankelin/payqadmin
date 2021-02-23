<template>
	<div class='main conMain'>
		<div class="mainTop">
			<Form :model="formSearch" inline :label-width="70">
				<FormItem label="时间">
					<DatePicker placement="bottom-start" type="datetimerange" style="width: 270px" @on-change="timeChange" format="yyyy-MM-dd HH:mm" v-model='dateTime'></DatePicker>
				</FormItem>
				<FormItem>						
						<Button type="primary" @click='handleSearch'>查询</Button>
				</FormItem>		
			</Form>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>
				
			</Table>
			<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import expandRow from './table-expand.vue';
	export default{
		name:'accountBook',
		components: {
		 	expandRow
		 },
		data(){
			return{
				
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				userData: (JSON.parse(this.$store.state.userData)),
				count: 0,
				curpage: 1,
				pagesSize: 10,
				dateTime:[],
				dataList: [],
				startTime: '',
				endTime: '',
				columns: [
					{
						title: '所属组织',
						key: 'orgName',						
						align: 'center',
						minWidth:300,
					},
					{
						title: '员工',
						key: 'staffName',
						minWidth:150,
						align: 'center'
					},
					{
						title: '车牌号',
						key: 'currentCarNumber',
						minWidth:150,
						align: 'center'
					},
					{
						title: '交接类型',
						key: 'handoverTypeName',
						minWidth:120,
						align: 'center'
					},
					{
						title: '交接对象',
						key: 'objName',
						minWidth:150,
						align: 'center'
					},{
						title: '地址',
						key: 'address',
						minWidth:300,
						align: 'center'
					},{
						title: '创建时间',
						key: 'createTime',
						minWidth:180,
						align: 'center'
					},{
                        type: 'expand',
                        title:'交接拓展信息',
                       	align: 'center',                       	
                       	width:130,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    entityList: params.row.handoverExtInfoEntityList,
                                    
                                },
                                on:{
				                  getVal:(val)=>{				                      	
				                    	
				                    	
				                    	
				                  }
				                }

                            })
                        }
                    }
					
					]
			}
		},
		methods:{
			//获取账本列表
			handoverarchivesList(){
				this.loading = true;
				this.dataList=[];
				this.count=0;
				_http.http1("post", pathUrls.handoverarchivesList, {
					page: this.curpage,
					limit: this.pagesSize,					
					startTime: this.startTime,
					endTime: this.endTime,
					
				}, 'form').then((res) => {
					this.loading = false;
					for(let item of res.data){
						if(item.handoverType==1){
							item.handoverTypeName='充装站'
						}else if(item.handoverType==2){
							item.handoverTypeName='配送员'
						}else if(item.handoverType==3){
							item.handoverTypeName='中转站'
						}
						if(item.handoverExtInfoEntityList.length){
							item.handoverExtInfoEntityList.forEach(items=>{
								switch(items.actionType){
									case 1:
									items.actionTypeName = "给";									
									break;
									case 2:
									items.actionTypeName = "回";									
									break;
									case 3:
									items.actionTypeName = "押";									
									break;
									case 4:
									items.actionTypeName = "退";									
									break;
								}
							})
						}
					}
					this.dataList = res.data;
					this.count = res.count;
					if(this.dataList.length) {
						this.tableHeight = this.screeHeight-200;					
					} else {
						this.tableHeight='auto';
						
					}
				})
			},
			//查询
			handleSearch(){
				this.curpage=1;
				this.handoverarchivesList()
			},
			//改变页数
			pageChange(current) {
				this.curpage = current;
				this.handoverarchivesList()
				
			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.handoverarchivesList()
				
							},
			//改变时间	
			timeChange(e) {
				if(e[1].length){
					let ends=e[1].substring(e[1].length-5)
					let wholes=e[1].substring(0,e[1].length-5)
				if(ends=='00:00'){
					wholes=wholes+''+'23:59';
					this.dateTime=[e[0],wholes]
					this.endTime =wholes
				}else{
					this.endTime = e[1]
				}

				this.startTime = e[0]
				}
				else{

				this.startTime = e[0]
				this.endTime = e[1]
				}
								
				this.defaultInfo = false;				
			},
		},
		mounted(){
			this.handoverarchivesList()
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		background: #FFFFFF;
		position: relative;
		min-height: calc(100% - 10px);	
	}
	
	.mainTop {
		padding: 10px;
		width: 100%;
		text-align: left;
	}
	
	.mainTop>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding:0 10px 20px;		
	}
	
	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
	}
	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	.mainTop>>>.ivu-cascader .ivu-cascader-menu{
		background: #fff!important;
	}
	.mainContent>>>.ivu-table-expanded-cell{
		background: #e6c3181c!important;
		padding:10px 50px!important;

	}
	.mainContent>>>.ivu-icon-ios-arrow-forward:after{
		/*content: '展开'!important;*/
	}
</style>