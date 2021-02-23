<template>
  <div class="main conMain">
    <div class='mainTop'>
      <Form :model="formSearch" inline :label-width="75">
        <FormItem label="联系人">
          <Input v-model="formSearch.userName" placeholder="请输入联系人"></Input>
        </FormItem>
        <FormItem label="联系方式">
          <Input v-model="formSearch.userPhone" placeholder="请输入联系方式"></Input>
        </FormItem>
        <FormItem label="处理状态">
          <Select v-model="formSearch.status" style="width:186px" clearable placeholder="请选择状态">
            <Option :value='1'>待处理</Option>
            <Option :value='2'>处理中</Option>
            <Option :value='3'>处理完成</Option>
            <Option :value='-1'>取消求助</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="求助时间">
          <DatePicker type="datetimerange" style="width: 186px" @on-change="timeChange" placeholder='求助时间区间' v-model='formSearch.dateTime'></DatePicker>
        </FormItem> -->
        <FormItem label="开始时间">
          <DatePicker style='width: 186px;' type="datetime" placeholder="求助开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker style='width: 186px;' type="datetime" placeholder="求助结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click='handleSearch'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="info" size="small" @click="getHelpInfo(row.helpId)">详情</Button>
        </template>
      </Table>
      <div class="pageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage'></Page>
      </div>
    </div>
    <cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylMap from '@/pages/comComponent/cylMaps';
	export default {
		name: 'helpList',
		components: {
			cylMap
		},
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				langs: '',
				lats: '',
				addressInfo: false,
				formSearch:{
				userName:'',
				userPhone:'',
				status:'',
				dateTime:''
				},
				startTime:null,
				endTime:null,
				userData: (JSON.parse(this.$store.state.userData)),
				count: 0,
				curpage: 1,
				pagesSize: 10,
				loading: false,
				dataList: [],
				columns: [
//				{
//						title: '地图',
//						key: 'carType',
//						align: 'center',
//						width: '75',
//						fixed:'left',
//						render: (h, params) => {
//							let that = this
//							return h('img', {
//								attrs: {
//									src: params.row.carType
//								},
//								style: {
//									cursor: 'pointer'
//								},
//								on: {
//									click() {
//										that.langs = params.row.helpLng
//										that.lats = params.row.helpLat
//										that.addressInfo = true
//									}
//								}
//							}, params.row.carType);
//
//						}
//
//					},
						{
						title: '联系人',
						key: 'helpUserName',
						minWidth: 140,
						align: 'center',
						fixed:'left'
						},
            {
            title: '联系方式',
            key: 'helpUserPhone',
            minWidth: 160,
            align: 'center',
            },
						{
						title: '求助地址',
						key: 'helpUserAddress',
						minWidth: 300,
						align: 'center',
						tooltip: true,
						},

						{
						title: '销售员',
						key: 'helpDeliveryUserName',
						minWidth: 140,
						align: 'center',

						},
						{
						title: '客户名称',
						key: 'helpUserCompanyName',
						minWidth: 200,
						align: 'center',
						tooltip: true,
						},
						{
						title: '客户类型',
						key: 'userTypeName',
						minWidth: 150,
						align: 'center',

						},


						{
						title: '处理状态',
						key: 'newHelpStatus',
						minWidth: 140,
						align: 'center',

						},
						{
						title: '求助发起时间',
						key: 'helpCreateTime',
						minWidth: 180,
						align: 'center',

						},
						{
						title: '处理时间',
						key: 'helpHandleTime',
						minWidth: 180,
						align: 'center',

						},
						{
						title: '操作',
						slot: 'action',
						fixed: 'right',
						width: 120,
						align: 'center'
					}
				]
			}
		},
		methods: {
      //改变结束时间
        changeEndTime(v){
        	if(v){
        		let ends=v.substring(v.length-8);
        		let starts=v.substring(0,11);
        		if(ends=='00:00:00'){
        			this.endTime=starts+'23:59:59';
        		}else{
        			this.endTime=v;
        		}
        	}
        },
      //改变起始时间
        changeStartTime(v){
            this.startTime=v;

        },
			//查看地图定位
			handleAdSee(data) {
				this.addressInfo = data
			},
			getHelpList(){
				this.loading = true;
				_http.http1('post', pathUrls.userhelpList, {
					'page': this.curpage,
					"limit": this.pagesSize,
					'userName': this.formSearch.userName,
					'userPhone': this.formSearch.userPhone,
					'status': this.formSearch.status,
					'startTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
					'endTime':this.endTime?(this.common.conformatDat(this.endTime,true)):'',
				}, 'form').then((res) => {
					this.loading = false;
					for(let item of res.data){
						if(item.helpLng){
							item.carType = require('../../../../src/assets/images/ad.png');
						}else{
							item.carType='';
						}
						if(item.helpStatus==1){
							item.newHelpStatus='待处理'
						}else if(item.helpStatus==2){
							item.newHelpStatus='处理中'
						}else if(item.helpStatus==3){
							item.newHelpStatus='处理完成'
						}else if(item.helpStatus==-1){
							item.newHelpStatus='取消求助'
						}
            item.helpUserCompanyName=item.helpUserCompanyName?item.helpUserCompanyName:item.helpUserName;
					}
					this.dataList = res.data;
					this.count = res.count;
					if(this.dataList.length> 10) {
							this.tableHeight=this.screeHeight-240;
						} else {
					    this.tableHeight='auto';

						}

				})
			},
		//改变页数
			pageChange(current) {
				this.curpage = current;
				this.getHelpList();
			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.getHelpList();
			},
		//改变时间
			timeChange(v) {
				this.startTime = v[0];
				this.endTime = v[1];
			},
			//查询
			handleSearch(){
				this.curpage=1;
				this.getHelpList();
			},
			//详情
			getHelpInfo(id){
				this.$router.push('/helpList/helpInfo' + '/' + id)
			}
		},
		activated() {
				this.getHelpList();
      },
		mounted() {
			// this.getHelpList()
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
  }

  .mainContent>>>.ivu-table th {
    background: #E2EEFF;
    color: #51B5EA;
  }
</style>
