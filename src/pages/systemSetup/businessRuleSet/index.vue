<template>
	<div class="main conMain">
		<div class="mainTop conMainTop">
			<Button type="success" @click="handleAdd" style="margin-right: 20px;">新增</Button>
			<!--<Button type="error" @click="handleFilDelete">批量删除</Button>-->
		</div>
		<div class="mainContent conMainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading'   highlight-row :height='tableHeight'>
					<template slot-scope="{ row, index }" slot="action">
						<Button type="info" size="small" @click="handleEdit(row.id)" style="margin-right: 10px;">编辑</Button>
						<!-- <Button type="error" size="small" @click="handleDelete(row)">删除</Button> -->
					</template>
          <template slot-scope="{ row, index }" slot="value">
            <span v-if='row.valueType!="jsonArr"'>{{row.value}}</span>
          	<Button v-else type="warning" size="small" @click="handleValueInfo(row.value)" style="margin-right: 10px;">json值</Button>
          </template>
			</Table>
			<div class="pageMain conPageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
			</div>
		</div>
    <Modal draggable v-model="modals" title="json数据类型对应内容">
    	<p style="padding:0 10px;word-break:break-all;word-wrap:break-word">{{params}}</p>
    </Modal>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'businessRuleSet',
		data(){
			return{
        params:'',
        modals:false,
				tableHeight:'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				pagesSize:10,
	        	curpage:1,
	        	count:0,
	        	loading:false,
				dataList:[],
				columns:[
//				{
//				type: 'selection',
//				width: 60,
//				align: 'center',
//				},
{
				title: '规则id',
				key: 'id',
				align: 'center',
        minWidth: 120,
				},
				{
				title: '规则名称',
				key: 'ruleName',
				align: 'center',
        minWidth: 250,
				},{
				title: '数据类型',
				key: 'valueType',
				align: 'center',
        minWidth: 120,
				},{
				title: '模块类型',
				key: 'moduleTypeName',
				align: 'center',
        minWidth: 120,
				},{
				title: '模块名称',
				key: 'moduleName',
				align: 'center',
        minWidth: 200,
				},{
				title: '配置编码',
				key: 'code',
				align: 'center',
        minWidth: 200,
				},{
				title: '数据名称',
				key: 'valueName',
				align: 'center',
        minWidth: 300,
				},{
				title: '数据内容',
				key: 'value',
				align: 'center',
        minWidth:300,
        slot:'value'
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
    //查看参数详情
    handleValueInfo(params) {
    	this.params = params;
    	this.modals = true;
    },
		//改变页数
		pageChange(current) {
			this.curpage = current
			this.getDeptrulesList()

		},
		//改变条数
		pageSizeChange(pageSize) {
			this.pagesSize = pageSize;
			this.curpage=1;
			this.getDeptrulesList()

		},
		handleAdd(){
			this.$router.push('/businessRuleSet/businessRuleSetAdd');
		},
		//编辑
      	handleEdit(id){
      		this.$router.push('/businessRuleSet/businessRuleSetEdit' + '/' + id);
      	},
		//获取列表
		getDeptrulesList(){
  			this.loading=true;
  			this.dataList=[];
  			// this.count=0;
  			_http.http1("post", pathUrls.deptrulesList, {
  				page: this.curpage,
          limit: this.pagesSize,
  			}, 'form').then((res) => {
  				this.loading=false;
          for(let item of res.data){
              if(item.moduleType==0){
                item.moduleTypeName='其他';
              }else if(item.moduleType==1){
                item.moduleTypeName='web';
              }else if(item.moduleType==2){
                item.moduleTypeName='app';
              }

          }
  				this.dataList=res.data;
  				this.count=res.count;
  				if(this.dataList.length > 10) {
                	this.tableHeight=this.screeHeight-200;
               } else {
                	this.tableHeight ='auto';
                }
  			}).catch(()=>{
          this.loading=false;
        })
		},
		//删除
      	handleDelete(v){
      		let id=v.configId;
      		this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {

						_http.http2('post', pathUrls.sysconfigDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.getDeptrulesList()
							}

						})
					},

				});
      	},

		//批量删除
		handleFilDelete(){

		}
		},
		activated() {
				this.getDeptrulesList()
      },
		mounted(){

		}
	}
</script>

<style type="text/css" scoped>
.main {
		margin-right: 10px;
		min-height: calc(100% - 10px);
		background: #fff;
	}
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;
	}


</style>
