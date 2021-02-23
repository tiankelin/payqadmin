<template>
	<div class="main">
		<div class="mainTop">
        <Form :model="formSearch" inline :label-width="75">
          <FormItem label="所属组织">
          	<Cascader :data="options" clearable  change-on-select @on-change='changeCascader' :render-format="format" style="width:175px"></Cascader>
          </FormItem>
        	<FormItem label="是否启用">
              <Select style="width: 90px;" v-model='isActive'  clearable>
              	<Option :value='0'>否</Option>
              	<Option :value='1'>是</Option>
              </Select>
        	</FormItem>
         <FormItem label="商户名称">
              <Input type='text' placeholder='请输入商户名称' v-model='companyName' style="width:150px"/>
         </FormItem>
          <FormItem label="用户姓名">
               <Input type='text' placeholder='请输入用户姓名' v-model='userName' style="width:150px"/>
          </FormItem>
          <FormItem class='btnWrapper'>
                <Button type="primary" @click='handleSearch' style='margin-right: 20px;'>查询</Button>
                <Button type="success" @click='handleAdd'>新增</Button>
          </FormItem>
        </Form>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading'   highlight-row :height='tableHeight'>
					<template slot-scope="{ row, index }" slot="action">
						<Button type="info" size="small" @click="handleEdit(row.id)" style="margin-right: 10px;">编辑</Button>						
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
		name:'intelligentPrediction',
		data(){
			return{
        userData: (JSON.parse(this.$store.state.userData)),
        userName:'',
        companyName:'',
        isActive:null,
        organize:'',
        options:[],
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
				title: '商户名称',
				key: 'userCompanyName',
				align: 'center',
        minWidth:250
				},{
				title: '用户姓名',
				key: 'userName',
				align: 'center',
       width:140
				},{
				title: '规格',
				key: 'spec',
				align: 'center',
        width:140
				},{
				title: '每次配送量',
				key: 'numUnit',
				align: 'center',
        width:140
				},{
				title: '每天用量',
				key: 'dailyNum',
				align: 'center',
        width:140
				},{
				title: '配送员姓名',
				key: 'staffName',
				align: 'center',
        width:140
				},{
				title: '组织名称',
				key: 'deptName',
				align: 'center',
        minWidth:250
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
      //自定义组织输入框显示内容
      format(labels, selectedData) {
      	//				console.log(labels, selectedData)
      	const index = labels.length - 1;
      	const data = selectedData[index] || false;
      	return labels[index];
      },
      changeCascader(value, selectedData) {
      	if(value.length) {
      		this.organize = value[value.length - 1]
      	} else {
      		this.organize = ''
      	}

      },
      //查询
     handleSearch(){
        this.curpage=1;
        this.getPredictionList();
     },
		//改变页数
		pageChange(current) {
			this.curpage = current
			this.getPredictionList()

		},
		//改变条数
		pageSizeChange(pageSize) {
			this.pagesSize = pageSize;
      this.curpage=1;
			this.getPredictionList();

		},
		handleAdd(){
			this.$router.push('/intelligentPrediction/predictionAdd');
		},
		//编辑
      	handleEdit(id){
      		this.$router.push('/intelligentPrediction/predictionEdit' + '/' + id);
      	},
		//获取列表
		getPredictionList(){
  			this.loading=true;
  			_http.http1("post", pathUrls.ordertaskList, {
  				page: this.curpage,
          limit: this.pagesSize,
          userName:this.userName,
          companyName:this.companyName,
          deptId:this.organize,
          isActive:this.isActive
  			}, 'form').then((res) => {
  				this.loading=false;
  				this.dataList=res.data;
  				this.count=res.count;
  				if(this.dataList.length > 10) {
               this.tableHeight = this.screeHeight - 200;
                } else {
                	this.tableHeight = 'auto';
                }
  			})
		},

		},
		activated() {
				this.getPredictionList()
      },
		mounted(){
      this.common.getOrganizeList(this.userData.deptId).then((res)=>{
      	this.options=this.common.getLabel(res)
      })
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
  .btnWrapper>>>.ivu-form-item-content{
    margin-left: 20px!important;

  }
</style>
