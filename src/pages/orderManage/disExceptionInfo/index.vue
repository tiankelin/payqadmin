<template>
  <div class="main conMain">
    <div class="mainTop">
      <Form :model="formSearch" inline :label-width="70">
        <FormItem label="员工姓名" class='personName'>
          <Select v-model="formSearch.personName" style="width:170px" clearable placeholder="请选择员工" filterable>
            <Option :value='item.staffId' v-for='item in staffList' :key='item.staffId'>{{item.staffName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="电子标签编码" class='bottleTag'>
          <Input v-model="formSearch.bottleTag" style="width:170px" placeholder='电子标签编码'/>
        </FormItem>
        <FormItem label="钢瓶条码">
          <Input v-model="formSearch.bottleCode" style="width:170px" placeholder='钢瓶条码'/>
        </FormItem>
        <FormItem label="异常细类" class='personName'>
          <Select v-model="formSearch.errDetailType" style="width:220px" clearable placeholder="请选择异常细类" filterable>
            <!--  <Option :value='10'>app扫无档案瓶</Option>
						<Option :value='11'>完成订单无档案瓶</Option>
            <Option :value='12'>app扫重瓶</Option>
            <Option :value='13'>app扫空瓶</Option>
            <Option :value='14'>完成订单重瓶</Option>
            <Option :value='15'>完成订单空瓶</Option>
            <Option :value='16'>用户两次配送距离超过阀值</Option>
 -->
            <Option :value='20'>无档瓶回收</Option>
            <Option :value='24'>异常瓶配送</Option>
            <Option :value='30'>空瓶重复回收</Option>
            <Option :value='31'>重瓶重复发出</Option>
            <Option :value='32'>配送用户地址相差过大</Option>
            <Option :value='34'>无充装配送</Option>
            <Option :value='61'>责任人异常</Option>
          </Select>
        </FormItem>
        <FormItem label="开始时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
        <!-- <FormItem label="时间">
          <Date-picker format="yyyy-MM-dd HH:mm" v-model='formSearch.dateTime' type="datetimerange" placement="bottom-start"
            placeholder="选择日期" @on-change="timeChange" style="width:275px"></Date-picker>
        </FormItem> -->
        <FormItem>
          <Button type="primary" @click='handleSearch'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading="loading" highlight-row :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="errPic">
          <div><img :src="item" alt="" v-for='item in row.errPic' :key='item' v-if='item' style="height: 60px;width: auto;margin-top: 5px;margin-right: 5px;" /></div>
        </template>
      </Table>
      <div class="pageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
      </div>
    </div>
    <cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
    <cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	import cylMap from '@/pages/comComponent/cylMaps';
	export default{
		name:'disExceptionInfo',
		components: {
			cylInfo,
			cylMap
		},
		data(){
			return {
				
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				langs: '',
				lats: '',
				addressInfo: false,
				staffList:[],
				userData: (JSON.parse(this.$store.state.userData)),
				startTime:null,
				endTime:null,
				formSearch:{
					personName:'',
					dateTime:[],
          errDetailType:'',
          bottleTag:'',
          bottleCode:''
				},
				tags:'',
				infoSee: false,
				sizeOpts: [10, 20, 50, 100, 200],
				pagesSize: 10,
				curpage: 1,
				count: 0,
				dataList:[],
				loading:false,
				columns:[{
						title: '定位',
						key: 'carType',
						align: 'center',
						width: '75',
						fixed: 'left',
						render: (h, params) => {
							let that = this
							return h('img', {
								attrs: {
									src: params.row.carType
								},
								style: {
									cursor: 'pointer'
								},
								on: {
									click() {
										that.langs = params.row.errLng
										that.lats = params.row.errLat

										that.addressInfo = true
									}
								}
							}, params.row.carType);

						}

					},
					{
						title: '异常地点',
						key: 'errAddress',
						align: 'center',
						minWidth:400,
            tooltip:true
						},
						{
						title: '员工姓名',
						key: 'staffName',
						align: 'center',
						minWidth:150
						},
						{
						title: '电子标签编码',
						key: 'bottleTag',
						align: 'center',
						minWidth:200,
						render: (h, params) => {
							let that=this
							return h('span', {
								style: {
									color: '#ee6515',
									cursor: 'pointer'
								},
									on:{
									click(){
										that.infoSee=true
										that.tags=params.row.bottleTag
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

										that.infoSee=true
										that.tags=params.row.bottleCode
									}
								}
							}, params.row.bottleCode);
						},

					},
						{
						title: '异常描述',
						key: 'errDesc',
						align: 'center',
						minWidth:350
						},
            {
            title: '异常细类',
            key: 'errDetailTypeName',
            align: 'center',
            minWidth:250
            },
//						{
//						title: '异常图片',
//						key: 'errPic',
//						align: 'center',
//						minWidth:250,
//						slot:'errPic'
//						},
						{
						title: '异常原因',
						key: 'errReason',
						align: 'center',
						minWidth:350
						},
//						{
//						title: '异常等级',
//						key: 'errLevel',
//						align: 'center',
//						width:140
//						},
						{
						title: '终端编号',
						key: 'terminalCode',
						align: 'center',
						minWidth:140
						},
						{
						title: '载体名称',
						key: 'carrierName',
						align: 'center',
						minWidth:200
						},



						{
						title: '异常处理状态',
						key: 'newErrStatus',
						align: 'center',
						minWidth:140
						},

					{
						title: '异常类型',
						key: 'newErrType',
						align: 'center',
						minWidth:140
						},
						{
						title: '异常来源',
						key: 'newErrSource',
						align: 'center',
						minWidth:120
						},
						{
						title: '创建时间',
						key: 'createTime',
						align: 'center',
						minWidth:180
						},

				]
			}
		},
		methods:{
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
			//查询
			handleSearch(){
				this.curpage=1;
				this.getErrorinfoList();
			},
			//异常列表
			getErrorinfoList(){
					this.loading = true;
					this.count=0;
				_http.http1('post', pathUrls.errorinfoList, {
					'page': this.curpage,
					"limit": this.pagesSize,
					"staffId":this.formSearch.personName,
					'startTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
					'endTime': this.endTime?(this.common.conformatDat(this.endTime,true)):'',
					'errSource':6,
          'errDetailType':this.formSearch.errDetailType,
          'bottleCode':this.formSearch.bottleCode,
          'bottleTag':this.formSearch.bottleTag
//					'errType':1,
					// 'errLevel':1
				}, 'form').then((res) => {
					this.loading = false;

						for(let item of res.data){
							item.newErrSource=item.errSource==6?'app':'';

							switch(item.errType){
								case 1:
									item.newErrType = "订单异常";
									break;
								case 3:
									item.newErrType = "入户安检异常";
									break;
								case 4:
									item.newErrType = "出入库检测异常";
									break;
								case 5:
									item.newErrType = "用户存储异常";
									break;
								// case 6:
								// 	item.newErrType = "订单异常";
								// 	break;
							}

              switch(item.errDetailType){
              	case 20:
              		item.errDetailTypeName = "无档瓶回收";
              		break;
              	case 24:
              		item.errDetailTypeName = "异常瓶配送";
              		break;
              	case 25:
              		item.errDetailTypeName = "异常瓶配送";
              		break;
              	case 26:
              		item.errDetailTypeName = "异常瓶配送";
              		break;
              	case 27:
              		item.errDetailTypeName = "异常瓶配送";
              		break;
              	case 28:
              		item.errDetailTypeName = "异常瓶配送";
              		break;
                case 29:
                	item.errDetailTypeName = "异常瓶配送";
                	break;
                case 200:
                	item.errDetailTypeName = "异常瓶配送";
                	break;
                case 201:
                	item.errDetailTypeName = "异常瓶配送";
                	break;
                case 203:
                	item.errDetailTypeName = "异常瓶配送";
                	break;
              	case 30:
              		item.errDetailTypeName = "空瓶重复回收";
              		break;
              	case 31:
              		item.errDetailTypeName = "重瓶重复发出";
              		break;
                case 32:
                  item.errDetailTypeName = "配送用户地址相差过大";
                  break;
                 case 34:
                  item.errDetailTypeName = "无充装配送";
                  break;
                 case 61:
                  item.errDetailTypeName = "责任人异常";
                  break;
                 case 63:
                  item.errDetailTypeName = "责任人异常";
                  break;
              }

							if(item.errLng) {
								item.carType = require('../../../../src/assets/images/ad.png');
							}
							else {
								item.carType = '';
							}
							if(item.errStatus==1){
								item.newErrStatus='待处理'
							}else if(item.errStatus==2){
								item.newErrStatus='系统处理'
							}else{
								item.newErrStatus='人工处理'
							}
						}
						this.dataList=res.data;
						this.count=res.count;
						if(this.dataList.length > 10) {
              this.tableHeight=this.screeHeight -240;
					} else {
						this.tableHeight ='auto';

					}

				})
			},
			//改变时间选择器
				timeChange(e) {
					if(e[1].length){
					let ends=e[1].substring(e[1].length-5)
					let wholes=e[1].substring(0,e[1].length-5)
				if(ends=='00:00'){
					wholes=wholes+''+'23:59';
					this.formSearch.dateTime=[e[0],wholes]
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


				},
		//查看钢瓶详情
			handleSee(data){
				this.infoSee = data
			},
			//页数改变
			pageChange(current) {
				this.curpage = current
				this.getErrorinfoList();


			},
			//条数改变
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getErrorinfoList();


			},
		},
		mounted(){
			this.getErrorinfoList();
			this.common.getStaffList(this.userData.deptId).then((res)=>{
				this.staffList=res.data;
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
  .bottleTag>>>.ivu-form-item-content{
  	margin-left: 98px!important;
  }
  .bottleTag>>>.ivu-form-item-label{
  	width: 98px!important;
  }
</style>
