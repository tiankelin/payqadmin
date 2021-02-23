<template>
	<div class="main">
		<div class="mainTop">
			<Button type="success" style="margin-right: 40px;" @click="handleAdd" v-has='1018'>新增</Button>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading'   highlight-row :height='tableHeight'>
					<template slot-scope="{ row, index }" slot="action">
						<Button type="info" size="small" @click="handleEdit(row.id)" style="margin-right: 10px;" v-has='1020'>编辑</Button>
						
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
		name:'cylinderManufacturer',
		data(){
			return{
				tableHeight: 'auto',
		      	screeHeight: document.documentElement.clientHeight, // 屏幕高
		    	sizeOpts: [10, 20, 50, 100, 200],
		    	pagesSize:10,
		    	curpage:1,
		    	count:0,
		    	loading:false,
				dataList:[{newIndex:1
					
				}],
				columns:[{
					title: '序号',
					key: 'newIndex',
					width:100,
					align: 'center',
					fixed:'left'
					},{
					title: '厂家名称',
					key: 'bottleManufacturerName',
					align: 'center',
					minWidth:250,
					},{
					title: '代号',
					key: 'codeName',
					align: 'center',
					width:140,
					},{
					title: '曾用名1',
					key: 'oldNameOne',
					align: 'center',
					width:160,
					},{
					title: '曾用名2',
					key: 'oldNameTwo',
					align: 'center',
					width:160,
					},{
					title: '国别',
					key: 'country',
					align: 'center',
					width:160,
					},{
					title: '许可证',
					key: 'licence',
					align: 'center',
					width:200,
					},{
					title: '许可证级别',
					key: 'licenceLevel',
					align: 'center',
					width:200,
					},{
					title: '创建时间',
					key: 'createTime',
					align: 'center',
					width:170,
					},{
					title: '更新时间',
					key: 'updateTime',
					align: 'center',
					width:170,
					},{
					title: '操作',
					slot: 'action',
					fixed: 'right',
					width: 120,
					align: 'center'
					}]

				}
		},
		methods:{
		//改变页数
		pageChange(current) {
			this.curpage = current
			this.getManufacturerList()

		},
		//改变条数
		pageSizeChange(pageSize) {
			this.pagesSize = pageSize
			this.getManufacturerList()

		},
		//新增
		handleAdd(){
			this.$router.push('/cylinderManufacturer/manufacturerAdd');
		},	
		//列表
		getManufacturerList(){
				this.loading=true;
      			_http.http1("post", pathUrls.bottlemanufacturerList, {
      				    page: this.curpage,
              		limit: this.pagesSize,             
      			}, 'form').then((res) => {
      				this.loading=false;
      				if(res.data){
      					for(let [item, index] of new Map(res.data.map((item, i) => [item, i]))) {
      					item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);
      				}
      				}      				
      				this.dataList=res.data;
      				this.count=res.count;
      				if(this.dataList.length>10){
							this.tableHeight=this.screeHeight -180;
						}else{
							this.tableHeight='auto';
						}
      			})
		},
	
      	//编辑
      	handleEdit(id){
      		this.$router.push('/cylinderManufacturer/ManufacturerEdit' + '/' + id)
      	},
		},
		activated() {
				this.getManufacturerList()
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