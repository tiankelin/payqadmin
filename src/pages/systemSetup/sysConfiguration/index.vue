<template>
	<div class="main">
		<div class="mainTop">
			<Button type="success" @click="handleAdd" style="margin-right: 20px;">新增</Button>
			<!--<Button type="error" @click="handleFilDelete">批量删除</Button>-->
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading'   highlight-row :height='tableHeight'>
					<template slot-scope="{ row, index }" slot="action">
						<Button type="info" size="small" @click="handleEdit(row.configId)" style="margin-right: 10px;">编辑</Button>
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
		name:'sysConfiguration',
		data(){
			return{
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
				title: '配置ID',
				key: 'configId',
				align: 'center',
        width:100
				},{
				title: '配置值',
				key: 'configValue',
				align: 'center',
         width:200
				},{
				title: '备注',
				key: 'configRemarks',
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
		//改变页数
		pageChange(current) {
			this.curpage = current
			this.getConfigList()

		},
		//改变条数
		pageSizeChange(pageSize) {
			this.pagesSize = pageSize
			this.getConfigList()

		},
		handleAdd(){
			this.$router.push('/sysConfiguration/configAdd');
		},
		//编辑
      	handleEdit(id){
      		this.$router.push('/sysConfiguration/configEdit' + '/' + id);
      	},
		//获取列表
		getConfigList(){
  			this.loading=true;
  			_http.http1("post", pathUrls.sysconfigList, {
  				page: this.curpage,
          		limit: this.pagesSize,
  			}, 'form').then((res) => {
  				this.loading=false;
  				this.dataList=res.data;
  				this.count=res.count;
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
								this.getConfigList()
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
				this.getConfigList()
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
		text-align: right;
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
