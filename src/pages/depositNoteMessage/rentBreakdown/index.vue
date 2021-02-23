<template>
  <div class="main conMain">
    <div class='mainTop conMainTop'>
      <Form inline :label-width="70">
        <FormItem label="订单起止时间" class='orderTime'>
          <DatePicker style='width: 180px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"></DatePicker>
          <span style="margin: 0 10px;">至</span>
          <DatePicker style='width: 180px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"></DatePicker>
        </FormItem>
        <FormItem label="客户名称">
          <Input type='text' style='width: 180px;' v-model='userName' placeholder="客户名称" />
        </FormItem>
        <FormItem label="操作员">
          <Input type='text' style='width: 180px;' v-model='operator' placeholder="操作员" />
        </FormItem>
        <FormItem label="是否在用">
          <Select style="width:180px" clearable placeholder="是否在用" v-model='isUse'>
            <Option :value='1'>是</Option>
            <Option :value='0'>否</Option>
          </Select>
        </FormItem>

        <FormItem class='conWrapper'>
          <Button type="primary" @click='handleSearch'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent conMainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'
        :rowClassName="rowClassName">

      </Table>
      <div class="pageMain conPageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
      </div>
    </div>
    <div>
        <!-- <h3>汇总</h3> -->
        <div class="summary">
          <div class="summaryTitle">汇总：</div>
          <div class="summaryItem"><span>收押金额：</span><span>111</span></div>
          <div class="summaryItem"><span>已使用月数：</span><span>222</span></div>
          <div class="summaryItem"><span>累计收入：</span><span>333</span></div>
          <div class="summaryItem"><span>押金余额：</span><span>444</span></div>
          <div class="summaryItem"><span>退押金额：</span><span>555</span></div>
        </div>

    </div>
  </div>
</template>

<script>
  import _http from '@/public/http';
  import { pathUrls } from '@/public/path';
  export default {
    name:'rentBreakdown',
    data(){
      return{
        startTime:null,
        endTime:null,
        operator:null,
        userName:null,
        isUse:null,
        pagesSize: 10,
        screeHeight: document.documentElement.clientHeight, // 屏幕高
        sizeOpts: [10, 20, 50, 100, 200],
        curpage: 1,
        count: 0,
        loading: false,
        tableHeight: 'auto',
        dataList: [],
        options: [],
        userData: (JSON.parse(this.$store.state.userData)),
        columns:[{
          title: '序号',
          key: 'newIndex',
          width: 100,
          fixed:'left',
          align: 'center'
        },{
          	title: '钢瓶规格',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '客户编号',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '客户名称',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '押瓶时间',
          	key: 'bottleSpec',
          	minWidth: 170,
          	align: 'center'
          },{
          	title: '押金单编号',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '操作员',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '收押金额',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '已使用月数',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '当期收入',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '累计收入',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '押金余额',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '是否在用',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },{
          	title: '退瓶时间',
          	key: 'bottleSpec',
          	minWidth: 170,
          	align: 'center'
          },{
          	title: '退押金额',
          	key: 'bottleSpec',
          	minWidth: 150,
          	align: 'center'
          },],
        }
      },
      methods:{
        //改变页数
        pageChange(current) {
        	this.curpage = current;
        	this.getBreakDownList();

        },
        //改变条数
        pageSizeChange(pageSize) {
        	this.pagesSize = pageSize;
        	this.curpage = 1;
        	this.getBreakDownList();

        },

        //查询
        handleSearch() {
        	this.curpage = 1;
        	this.getBreakDownList();
        },
        getBreakDownList(){
          this.tableHeight = this.screeHeight - 240;
        },
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

  .mainTop {
    padding: 10px 10px 0;
    width: 100%;
    text-align: left;
  }

  .mainTop>>>.ivu-form-item {
    margin-bottom: 8px;
  }
  .orderTime>>>.ivu-form-item-label{
    width: 100px!important;
  }
  .orderTime>>>.ivu-form-item-content{
    margin-left: 100px!important;
  }
  .conWrapper>>>.ivu-form-item-content {
  	margin-left:10px !important;
  }
  .mainContent {
    background: #fff;
    border-radius: 4px;
    padding:0 10px;
  }

  .pageMain {
    text-align: left;
    margin-top: 10px;
    padding-left: 10px;
    display: flex;
  }
  .summary{
    display: flex;
    margin: 0 10px;
    justify-content: flex-end;
  }
  .summaryItem{
    margin-right:30px;
  }
  .summaryItem:last-child{
    margin-right:0;
  }
  .summaryTitle{
    font-weight: 600;
  }
</style>
