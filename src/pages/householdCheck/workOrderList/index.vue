<template>
  <div class="main conMain">
    <div class='mainTop conMainTop'>
      <Form inline :label-width="70">
        <FormItem label="所属组织">
          <Cascader :data="options" placeholder="所属组织" style='width:186px;' clearable change-on-select @on-change='changeCascader'
            :render-format="format"></Cascader>
        </FormItem>
        <FormItem label="客户名称">
          <Input style='width:186px;' placeholder="客户名称" v-model="userName" @on-keyup="userName=userName.replace(/\s+/g,'')" />
        </FormItem>
        <FormItem label="联系方式">
          <Input style='width:186px;' placeholder="联系方式" v-model="userPhone" @on-keyup="userPhone=userPhone.replace(/\s+/g,'')" />
        </FormItem>
        <FormItem label="安检员">
          <Select v-model="staffId" filterable style="width:186px;" placeholder="安检员" clearable>
            <Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
          </Select>
        </FormItem>

        <FormItem class='conWrapper'>
          <Button type="primary" @click='handleSearch'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent conMainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>

      </Table>
      <div class="pageMain conPageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
      </div>
    </div>

  </div>
</template>

<script>
  import _http from '@/public/http';
  import { pathUrls } from '@/public/path';

  export default{
      name:'workOrderList',

      data(){
        return{
          langs: '',
          lats: '',
          addressInfo: false,
          organize:'',
          pagesSize: 10,
          screeHeight: document.documentElement.clientHeight, // 屏幕高
          sizeOpts: [10, 20, 50, 100, 200],
          curpage:1,
          count:0,
          loading:false,
          tableHeight:'auto',
          dataList:[],
          options:[],
          userData: (JSON.parse(this.$store.state.userData)),
          userName:'',
          userPhone:'',
          staffId:'',
          staffNameList:[],
          columns:[


          {
          	title: '工单编号',
          	key: 'newWorkOrderId',
          	minWidth: 180,
          	align: 'center',
            fixed:'left'
          },
          {
          	title: '客户名称',
          	key: 'userName',
          	minWidth: 260,
          	align: 'center',
            tooltip:true
          },
          {
          	title: '客户类型',
          	key: 'userTypeName',
          	minWidth: 140,
          	align: 'center',
          },
          // {
          // 	title: '联系人',
          // 	key: 'userName',
          // 	minWidth: 160,
          // 	align: 'center',
          // },
          {
          	title: '联系方式',
          	key: 'userPhone',
          	minWidth: 160,
          	align: 'center',
          },
					{
						title: '所属组织',
						key: 'deptName',
						minWidth: 350,
						align: 'center',
            tooltip:true
					},
          {
          	title: '客户地址',
          	key: 'userAddress',
          	minWidth: 300,
          	align: 'center',
          	tooltip: true,
          },
          {
          	title: '上次安检日期',
          	key: 'lastCheckTime',
          	minWidth: 180,
          	align: 'center',
          },
					 {
						title: '安检员',
						key: 'checkerName',
						minWidth: 160,
						align: 'center',
					},
          {
          	title: '执行状态',
          	key: 'newWorkOrderStatus',
          	minWidth: 160,
          	align: 'center',
          },
          {
          	title: '关联单号',
          	key: 'checkCode',
          	minWidth: 180,
          	align: 'center',
          },
          {
          	title: '执行日期',
          	key: 'execDate',
          	minWidth: 180,
          	align: 'center',
          },
          {
          	title: '执行人',
          	key: 'enforcerName',
          	minWidth: 150,
          	align: 'center',
          },

          {
          	title: '工单生成依据',
          	key: 'newCreateBasis',
          	minWidth: 150,
          	align: 'center',
          },
          {
          	title: '工单来源',
          	key: 'newWorkOrderSource',
          	minWidth: 150,
          	align: 'center',
          },
          {
          	title: '创建人',
          	key: 'createrName',
          	minWidth: 150,
          	align: 'center',
          },
          {
          	title: '创建日期',
          	key: 'createTime',
          	minWidth: 180,
          	align: 'center',
          },


          ]
        }
      },
      methods:{
        //获取列表
          getWorkOrderList(){
            this.loading = true;
            _http.http1("post", pathUrls.securityWorkOrderList, {
            	page: this.curpage,
            	limit: this.pagesSize,
              deptId: this.organize,
              staffId:this.staffId,
              userName:this.userName,
              userPhone:this.userPhone
            }, 'form').then((res) => {
                this.loading = false;
                if(res.code==0){
                  for(let item of res.data) {

                  	if(item.checkLng) {
                  		item.carType = require('../../../../src/assets/images/ad.png');
                  	} else {
                  		item.carType = '';
                  	}

                  	if(item.isCheck == 0) {
                  		item.newCheck = '未审核'
                  	} else if(item.isCheck == 1) {
                  		item.newCheck = '审核未通过'
                  	} else if(item.isCheck == 2) {
                  		item.newCheck = '审核已通过'
                  	} else if(item.isCheck == 3) {
                  		item.newCheck = '抽样复查通过'
                  	} else {
                  		item.newCheck = '抽样复查驳回'
                  	}
                      item.newIsReallocate=item.isReallocate==1?'是':'否';
                      item.newCreateType=item.createType==1?'手动创建':'自动创建';
                  	let ids = item.orderNo + '';
                  	let zeroStr = '';
                  	for(let i = 0; i < 9 - ids.length; i++) {
                  		zeroStr += '0'
                  	}

                  	item.checkCode =item.orderNo?('PASC' + zeroStr + ids):'';

                    item.newWorkOrderStatus=item.workOrderStatus==1?'已检':'未检';
                    item.newWorkOrderSource=item.workOrderSource==1?'手动创建':'自动创建';
                    item.newWorkOrderId='GD'+item.workOrderId;
                    item.lastCheckTime=item.lastCheckTime?this.common.conformatDat(item.lastCheckTime):'';
                    switch(item.createBasis){
                      case 1:
                            item.newCreateBasis = "电话";
                            break;
                      case 2:
                            item.newCreateBasis = "超期未检";
                            break;
                      case 3:
                            item.newCreateBasis = "审核未通过";
                            break;
                      case 4:
                            item.newCreateBasis = "抽样复查驳回";
                            break;
                      case 5:
                            item.newCreateBasis = "自提";
                            break;
                      case 6:
                            item.newCreateBasis = "大数据";
                            break;
                      case 7:
                            item.newCreateBasis = "触卡";
                            break;
                      case 8:
                            item.newCreateBasis = "代客下单";
                            break;
                      case 9:
                            item.newCreateBasis = "App订单";
                            break;
                      case 10:
                            item.newCreateBasis = "管理员新增";
                            break;
                    }


                  }
                this.dataList = res.data;
                this.count = res.count;

                if(this.dataList.length>10){
                		this.tableHeight=this.screeHeight -235;
                	}else{
                		this.tableHeight='auto';
                	}
                }
            })
          },
        //改变页数
        	pageChange(current) {
        		this.curpage = current;
            this.getWorkOrderList();

        	},
        //改变条数
        	pageSizeChange(pageSize) {
        		this.pagesSize = pageSize;
            this.curpage=1;
            this.getWorkOrderList();

        	},
        //查询
        	handleSearch(){
            this.curpage=1;
            this.getWorkOrderList();
        	},
        //改变组织
        	changeCascader(value){
        		if(value.length) {
        			let id = value[value.length - 1];
        			this.organize = id;

        		}else{
        			this.organize =null;

        		}

        	},
        //自定义组织输入框显示内容
        	format(labels, selectedData) {
        		const index = labels.length - 1;
        		const data = selectedData[index] || false;
        		return labels[index];
        	},
      },
      activated() {
        this.getWorkOrderList();
      },
      mounted(){
        this.common.getDeptList(this.userData.deptId).then((res)=>{
        	this.options=this.common.getConDept(res.data)
        })
        this.common.getQueryStaffList(this.userData.deptId).then((res) => {
        	this.staffNameList = res.data
        })
      }
    }
</script>

<style type="text/css" scoped>
  .main {
    margin-right: 10px;
    min-height: calc(100% - 10px);
    background: #fff;
  }

  .mainTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
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

  .conWrapper>>>.ivu-form-item-content {
    margin-left: 10px !important;
  }

  .pageMain {
    text-align: left;
    margin-top: 10px;
    padding-left: 10px;
    display: flex;
  }
</style>
