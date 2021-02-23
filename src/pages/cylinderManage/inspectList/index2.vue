<template>
  <div class="main conMain">
    <div class='mainTop'>
      <Form :model="formSearch" inline :label-width="75">
        <FormItem label="检测状态">
        <Select v-model="formSearch.checkStatus" style="width:186px" clearable placeholder="请选择钢瓶检测状态">
        <Option :value="1">超期待检</Option>
        <Option :value="2">送检</Option>
						<Option :value="3">已检</Option>
        <Option :value="4">即将到期</Option>
        </Select>
        </FormItem>
        <FormItem>
					<Button type="primary" @click='handleSearch' style="margin-right: 20px;">查询</Button>
          <Button type="warning" @click='handleExport' >批量导出</Button>
				</FormItem>
      </Form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading="loading" highlight-row :height='tableHeight'>

      </Table>
      <div class="pageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
      </div>
    </div>
    <cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default{
		name:'inspectList',
		components: {
			cylInfo,
		},
		data(){
			return{
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				tags:'',
				infoSee: false,
				pagesSize: 10,
				curpage: 1,
				count: 0,
				dataList:[],
				sizeOpts: [10, 20, 50, 100, 200],
				loading:false,
				formSearch:{
					checkStatus:null
				},
				columns:[
					{
//						bottleTag
						title: '电子标签编码',
						key: 'bottleTag',
						minWidth: 200,
						align: 'center',
						fixed:'left',
						render: (h, params) => {
							let that=this
							return h('span', {
								style: {
									color: '#EE6515',
									cursor: 'pointer'
								},
								on:{
									click(){
										that.infoSee=true
										that.tags=params.row.bottleTag
//										console.log(that.tags)
									}
								}
							}, params.row.bottleTag);
						},

					},
					{
						title: '钢瓶条码',
						key: 'bottleCode',
						align: 'center',
            minWidth:200,
						render: (h, params) => {
							let that=this
							return h('span', {
								style: {
									color: '#1BA060',
									cursor: 'pointer'
								},
									on:{
									click(){
										if(params.row.bottleNfcId){
										that.infoSee=true
										that.tags=params.row.bottleNfcId
										}else{
										that.infoSee=true
										that.tags=params.row.bottleCode
										}


									}
								}
							}, params.row.bottleCode);
						},

					},
          {
          	title: '出厂编号',
          	key: '',
          	align: 'center',
          	minWidth:200,
          },{
          	title: '规格',
          	key: '',
          	align: 'center',
          	minWidth:140,
          },{
          	title: '送检站点信息',
          	key: '',
          	align: 'center',
          	minWidth:200,
          },{
          	title: '送检时间',
          	key: 'createTime',
          	align: 'center',
          	minWidth:180,
          },
          {
          	title: '送检人',
          	key: '',
          	align: 'center',
            minWidth:160,
          },
          {
          	title: '运输车牌号',
          	key: '',
          	align: 'center',
            minWidth:160,
          },
          {
          	title: '运输司机',
          	key: '',
          	align: 'center',
            minWidth:160,
          },
          {
          	title: '检验单位',
          	key: 'checkDeptName',
          	align: 'center',
            minWidth:300,
          },
          {
          	title: '检验状态',
          	key: 'checkStatusName',
          	align: 'center',
          	tooltip:true,
          	minWidth:120,
          },
					{
						title: '下次检验时间',
						key: '',
						align: 'center',
            minWidth:180,
					},
          

				]

			}
		},
		methods:{
      handleExport(){

      },

			getPlatformbottlechecklog(){
				this.loading = true
				this.dataList=[];
				this.count=0;
				_http.http1('post', pathUrls.platformbottlechecklog, {
					'page': this.curpage,
					"limit": this.pagesSize,
				}, 'form').then((res) => {
					this.loading = false;
					if(res.code==0){
						if(res.data){
							for(let item of res.data) {

						if(item.bottleCheckStatus==1){
							item.checkStatusName='超期待检';
						}else if(item.bottleCheckStatus==2){
							item.checkStatusName='送检';
						}else if(item.bottleCheckStatus==4){
							item.checkStatusName='即将到期';
						}
					}
						}
						this.dataList=res.data;
						this.count=res.count;
						if(this.dataList.length>10){
								this.tableHeight=this.screeHeight -240;
							}else{
								this.tableHeight='auto';
							}
					}
				})
			},
			//查看钢瓶详情
			handleSee(data){
				this.infoSee = data
			},
			//页数改变
			pageChange(current) {
				this.curpage = current
				this.getPlatformbottlechecklog()


			},
			//条数改变
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getPlatformbottlechecklog()


			},
		},
		mounted(){
			this.getPlatformbottlechecklog()
		}
	}
</script>

<style type="text/css" scoped>
  .main {
    margin-right: 10px;
    min-height: calc(100% - 10px);
    background: #fff;

  }

  .mainTop {
    padding: 10px;
    width: 100%;
    text-align: left;
  }

  .mainTop>>>.ivu-form-item {
    margin-bottom: 0px;
  }

  .mainContent {
    background: #fff;
    border-radius: 4px;
    padding: 0 10px 20px;
  }

  .mainContent>>>td {
    height: 40px;
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
</style>
