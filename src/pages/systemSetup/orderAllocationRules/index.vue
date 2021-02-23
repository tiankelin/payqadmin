<template>
	<div class="main">
		<div class="mainTop">
         <Row>
                <Col span="4" type="flex" justify="start" class="code-row-bg">
                    <legend class="conLabel">&nbsp;所属组织</legend>
                    <Cascader :data="options" clearable  change-on-select @on-change='changeCascader' :render-format="format" style="width:175px" v-model='orgArray'></Cascader>
                </Col>
                <Col span="3">
                    <legend class="conLabel">&nbsp;分配规则</legend>
                    <Select style="width:120px;" v-model='allocationRule' >
                    	<Option :value='1'>实时分配</Option>
                    	<Option :value='2'>在岗分配</Option>
                      <Option :value='3'>时段分配</Option>
                    </Select>
                </Col>
                <Col span="4">
                    <legend class="conLabel">&nbsp;允许取消时间(≤60分钟)</legend>
                    <InputNumber :min='0' :max='60' style='width:160px' v-model='allocationCancelTime' placeholder='默认3分钟,最大60分钟'/>
                </Col>
                <Col span="4" v-if='allocationRule==3'>
                    <legend class="conLabel">&nbsp;订单分配起始时间</legend>
                    <TimePicker type="time" placeholder="起始时间" style="width: 168px" v-model='allocationStartTime'></TimePicker>
                </Col>
                <Col span="5" v-if='allocationRule==3'>
                    <legend class="conLabel">&nbsp;订单分配结束时间</legend>
                    <TimePicker type="time" placeholder="结束时间" style="width: 168px" v-model='allocationEndTime'></TimePicker>
                </Col>
                <Col span="3">
                    <legend class="conLabel">&nbsp;</legend>
                     <Button type="info" @click='handleSave'>保存</Button>
                </Col>
            </Row>
<!--        <Form :model="formSearch" inline :label-width="75">
          <FormItem label="所属组织">
          	<Cascader :data="options" clearable  change-on-select @on-change='changeCascader' :render-format="format" style="width:175px"></Cascader>
          </FormItem>
        	<FormItem label="分配规则">
              <Select style="width:120px;" v-model='allocationRule'  clearable>
              	<Option :value='1'>实时分配</Option>
              	<Option :value='2'>在岗分配</Option>
                <Option :value='3'>时段分配</Option>
              </Select>
        	</FormItem>
          <FormItem label="允许取消时间（最大60分钟）" class='allowForm'>
              <Input type='text' style='width:90px'/>
          </FormItem>
          <FormItem class='btnWrapper'>
                <Button type="info" @click='handleSave'>保存</Button>
          </FormItem>
        </Form> -->
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
		name:'orderAllocationRules',
		data(){
			return{
        fDatas:{},
        orgArray:[],
        allocationCancelTime:null,
        allocationEndTime:null,
        allocationStartTime:null,
        allocationRule:'',
        userData: (JSON.parse(this.$store.state.userData)),

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
				{
				title: '客户类型',
				key: 'userType',
				align: 'center',
        // width:140
				},{
				title: '是否自动分配',
				key: 'isAutoAllocationName',
				align: 'center',
        // width:140
				},{
				title: '创建时间',
				key: 'careteTime',
				align: 'center',
        // width:170
				},{
				title: '创建时间',
				key: 'careteTime',
				align: 'center',
        // width:170
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
        console.log(selectedData)
      	if(value.length) {
      		this.organize = value[value.length - 1];
          this.fDatas=selectedData[selectedData.length - 1];
      	} else {
      		this.organize = '';
          this.fDatas=this.userData.dept;
      	}

      },
      //保存
     handleSave(){
        let fData=this.fDatas;
            fData.allocationRule=this.allocationRule;
            if(this.allocationCancelTime){
              fData.allocationCancelTime=this.allocationCancelTime;
            }else{
              fData.allocationCancelTime=3;
            }

          if(this.allocationRule==3){
            if(!this.allocationStartTime){
              this.$Message['warning']({
              	background: true,
              	content: '订单分配起始时间不能为空!',
              });
              return false;
            }
            if(!this.allocationEndTime){
              this.$Message['warning']({
              	background: true,
              	content: '订单分配结束时间不能为空!',
              });
              return false;
            }
            fData.allocationStartTime=this.allocationStartTime;
            fData.allocationEndTime=this.allocationEndTime;
          }

        _http.http2('post', pathUrls.deptUpdate, fData).then((res) => {
        	if(res.code == 0) {
        		this.$Message['success']({
        			background: true,
        			content: '保存成功!',
        		});

        	}
        	if(res.code == 500) {
        		this.$Message['warning']({
        			background: true,
        			content: res.msg,
        		});
        	}
        })
     },
		//改变页数
		pageChange(current) {
			this.curpage = current
			this.getOrderrulesList()

		},
		//改变条数
		pageSizeChange(pageSize) {
			this.pagesSize = pageSize;
      this.curpage=1;
			this.getOrderrulesList();

		},

		//编辑
      	handleEdit(id){
      		this.$router.push('/orderAllocationRules/allocationRulesEdit' + '/' + id);
      	},
		//获取列表
		getOrderrulesList(){
  			this.loading=true;
  			_http.http1("post", pathUrls.orderrulesList, {
  				page: this.curpage,
          limit: this.pagesSize,
  			}, 'form').then((res) => {
  				this.loading=false;
          for(let item of res.data){
              item.isAutoAllocationName=item.isAutoAllocation==1?'自动':'手动';
          }
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
				this.getOrderrulesList()
      },
		mounted(){
      
      this.fDatas=this.userData.dept;
      this.orgArray=[this.userData.deptId+''];
      this.allocationRule=this.userData.dept.allocationRule;
      this.allocationCancelTime=this.userData.dept.allocationCancelTime;
      this.allocationStartTime=this.userData.dept.allocationStartTime;
       this.allocationEndTime=this.userData.dept.allocationEndTime;
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
  .allowForm>>>.ivu-form-item-content{
    margin-left: 200px!important;
  }
  .allowForm>>>.ivu-form-item-label{
    width:200px!important;
  }
  .mainTop>>>.ivu-input-number-handler-wrap{
    display: none;
  }
</style>
