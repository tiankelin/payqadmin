<template>
  <div class="main conMain">
    <div class='mainTop'>
      <Form :model="formSearch" inline :label-width="96">
        <FormItem label="所属组织">
          <Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format"
            style="width:170px"></Cascader>
        </FormItem>
        <FormItem label="联系人">
          <Input v-model="formSearch.userName" placeholder="请输入联系人" style="width:170px" />
        </FormItem>
        <FormItem label="联系方式">
          <Input v-model="formSearch.userPhone" placeholder="请输入联系方式" style="width:170px" />
        </FormItem>
        <FormItem label="客户地址">
          <Input v-model="formSearch.userAddress" placeholder="请输入客户地址" style="width:170px" />
        </FormItem>
        <FormItem label="客户类型">
          <Select v-model="formSearch.userType" style="width:170px" clearable placeholder="请选择客户类型">
            <Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="安检项">
          <Select  style="width:186px" clearable placeholder="请选择安检项名称" @on-change='nameChange'>
      					<Option v-for="item in nameList" :value="item" :key="item">{{item}}</Option>
      				</Select>
          <Select v-model="formSearch.checkTypeId" style="width:170px" clearable placeholder="请选择安检项详情">
            <Option v-for="item in securityList" :value="item.typeId" :key="item.typeId">{{item.typeContent}}</Option>
          </Select>
        </FormItem> -->
        <FormItem label="安检人">
          <Select v-model="formSearch.securityWorker" style="width:170px" clearable placeholder="请选择安检员" filterable>
            <Option v-for="item in staffList" :value="item.staffId" :key="item.staffId">{{item.staffName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="审核状态">
          <Select v-model="formSearch.checkStatus" style="width:170px" clearable placeholder="请选择审核状态">
            <!--<Option value='0'>未审核</Option>
						<Option value='1'>审核未通过</Option>
						<Option value='2'>审核已通过</Option>
						<Option value='3'>审核驳回</Option>-->
            <Option value='0'>未审核</Option>
            <Option value='1'>审核不通过</Option>
            <Option value='2'>审核通过</Option>
            <Option value='3'>抽样复查通过</Option>
            <Option value='4'>抽样复查驳回</Option>
          </Select>
        </FormItem>
        <FormItem label="是否有效安检">
          <Select v-model="formSearch.isMustCheck" style="width:170px" clearable placeholder="是否有效安检">   
          	<Option value='1'>是</Option>      
            <Option value='0'>否</Option>
                  
          </Select>
        </FormItem>
        <FormItem label="检查开始时间">
          <DatePicker style='width: 170px;' type="date" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="检查结束时间">
          <DatePicker style='width: 170px;' type="date" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>


        <!--<FormItem label="检查日期">
					<Date-picker format="yyyy-MM-dd" v-model='formSearch.dateTime' type="daterange" placement="bottom-start" placeholder="选择日期" @on-change="timeChange" style="width:186px"></Date-picker>
				</FormItem>-->

        <FormItem>
          <Button type="primary" @click='handleSearch'>查询</Button>
        </FormItem>
      </Form>

    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' :rowClassName="rowClassName" highlight-row
        :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="orderCode">
          <Button type="warning" size="small" @click="handleSeeOrderInfo(row)" v-if='row.orderCode'>{{row.orderCode}}</Button>
          <span v-else></span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="info" size="small" style="margin-right: 5px" @click="handleInfo(row)">详情</Button>
          <!--<Button type="warning" size="small" @click="examClick(row.id,row.isCheck)" v-show='row.isCheck==0' v-has='872'>审核</Button>
					<Button type="warning" size="small" @click="examClick(row.id,row.isCheck)" v-show='row.isCheck==2' v-has='873'>抽样复查</Button>-->
        </template>
      </Table>
      <div class="pageMain" style="position: relative;">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage'></Page>
        <div style="position: absolute;right:10px;top: 0;">
          <div style="display: inline-block;" v-if='startTime&&endTime'>
            <span>{{startTime?(common.conformatDat(startTime)):''}}</span>
            <span v-if='startTime&&endTime'>到</span>
            <span>{{endTime?(common.conformatDat(endTime)):''}}</span>
            <span v-if='startTime&&!endTime'>之后</span>
            <span v-if='!startTime&&endTime'>之前</span>
          </div>
          <span>安检用户：</span><span style="color: #1EBB23;">{{monthUser}}</span>
          <!-- <span style="margin-left: 20px;">本月安检异常用户：</span><span style="color:#FF0000;">{{errorUser}}</span> -->
        </div>
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
		name: 'securityRecord',
		components: {
			cylMap
		},
		data() {
			return {
				isMustCheck:null,
				nameList: [],
				securityList: [],
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				monthUser: 0,
				errorUser: 0,
				langs: '',
				lats: '',
				addressInfo: false,
				userTypeList: [],			
				staffList: [],
				formSearch: {
					organize: '',
					securityWorker: '',
					checkStatus: '',
					userType: '',
					userName: '',
					userAddress: '',
					dateTime: [],
					userPhone: '',
					userCheckContent: '',
					checkTypeId: null
				},
				count: 0,
				curpage: 1,
				pagesSize: 10,
				dataList: [],
				options: [],
				loading: false,
				userData: (JSON.parse(this.$store.state.userData)),
				startTime: '',
				endTime: '',
				columns: [{
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
										that.langs = params.row.checkLng
										that.lats = params.row.checkLat

										that.addressInfo = true
									}
								}
							}, params.row.carType);

						}

					},
					{
						title: '所属组织',
						key: 'deptName',
						minWidth: 350,
						align: 'center',
            tooltip:true
					},
					{
						title: '联系人',
						key: 'userName',
						minWidth: 160,
						align: 'center',
					}, {
						title: '联系方式',
						key: 'userPhone',
						minWidth: 160,
						align: 'center',
					},
					{
						title: '客户地址',
						key: 'address',
						minWidth: 300,
						align: 'center',
						tooltip: true,
					}, {
						title: '客户类型',
						key: 'userTypeName',
						minWidth: 140,
						align: 'center',
					},{
						title: '安检人',
						key: 'checkerName',
						minWidth: 160,
						align: 'center',
					}, {
						title: '审核状态',
						key: 'newCheck',
						minWidth: 140,
						align: 'center',
					},{
						title: '检查日期',
						key: 'checkDate',
						minWidth: 180,
						align: 'center',
					},  {
						title: '安检单编号',
						key: 'checkCode',
						minWidth: 180,
						align: 'center',
					}, {
						title: '订单号',
						key: 'orderCode',
						minWidth: 300,
						align: 'center',
						slot: 'orderCode'
					}, {
						title: '户号',
						key: 'userAccountNumber',
						minWidth: 170,
						align: 'center',
					},   {
						title: '审核人',
						key: 'auditor1Name',
						minWidth: 160,
						align: 'center',
					}, {
						title: '审核时间',
						key: 'audit1Time',
						minWidth: 180,
						align: 'center',
					}, {
						title: '抽样复查人',
						key: 'auditor2Name',
						minWidth: 160,
						align: 'center',
					}, {
						title: '抽样复查时间',
						key: 'audit2Time',
						minWidth: 180,
						align: 'center',
					},{
						title: '备注',
						key: 'checkRemark',
						minWidth:300,
						align: 'center',
            tooltip:true
					}, {
						title: '是否重新分配',
						key: 'newIsReallocate',
						minWidth:140,
						align: 'center',

					},{
						title: '是否有效安检',
						key: 'newIsMustCheck',
						minWidth:140,
						align: 'center',

					},
          {
						title: '操作',
						slot: 'action',
						fixed: 'right',
						width: 120,
						align: 'center'
					}
				],

			}
		},
		methods: {
			//改变起始时间
	      changeEndTime(v){
	          this.endTime=v;
	      },
	    //改变结束时间
	      changeStartTime(v){
	          this.startTime=v;
	      },
			nameChange(v) {
				if(v) {
					this.getSecurityTypeList(v)
				} else {
					this.securityList = [];
					this.formSearch.checkTypeId = '';
				}

			},
	
			//安检项
			getSecurityTypeList(v) {
				_http.http1('post', pathUrls.querySecurityTypeList, {
					// typeName:v,
				}, 'form').then((res) => {
					this.securityList = res.data;
				})
			},
			//查看地图定位
			handleAdSee(data) {
				this.addressInfo = data
			},
			handleSeeOrderInfo(row) {
				this.$router.push('/merchandiseOrder/orderInfo' + '/' + row.orderCode + '/1')

			},

			rowClassName(row, index) {
				if(row.isCheck == 1) {
					return 'firstCheck';
				}
				if(row.isCheck == 2) {
					return 'disPass';
				}
				if(row.isCheck == 3) {
					return 'auditor2Name';
				}
				if(row.isCheck == 4) {
					return 'warnClass';
				}
				return '';
			},
	
			//获取安检记录列表
			getSecuritycheckList() {
				this.loading = true;
				this.dataList = [];
				this.monthUser = 0;
				this.errorUser = 0;
				_http.http1('post', pathUrls.securitycheckList, {
					'page': this.curpage,
					"limit": this.pagesSize,
					'deptId': this.formSearch.organize, //所属片区id
					'checkerId': this.formSearch.securityWorker, //安检员
					'checkStatus': this.formSearch.checkStatus, //审核状态
					'userType': this.formSearch.userType, //用户类型
					'userName': this.formSearch.userName, //客户名称
					'address': this.formSearch.userAddress, //客户地址
					'startTime':this.startTime?(this.common.conformatDat(this.startTime)+' 00:00:00'):'',
		       'endTime': this.endTime?(this.common.conformatDat(this.endTime)+' 23:59:59'):'',
					'userPhone': this.formSearch.userPhone,
					'checkTypeId': this.formSearch.checkTypeId,
					'isMustCheck':this.formSearch.isMustCheck
				}, 'form').then((res) => {
					this.loading = false
					for(let item of res.data) {

						if(item.checkLng) {
							item.carType = require('../../../../src/assets/images/ad.png');
						} else {
							item.carType = '';
						}
						if(item.isMustCheck==1){
							item.newIsMustCheck='是';
						}else{
							item.newIsMustCheck='否';
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
						let ids = item.id + '';
						let zeroStr = '';
						for(let i = 0; i < 9 - ids.length; i++) {
							zeroStr += '0'
						}
						item.checkCode = 'PASC' + zeroStr + ids;
					}
					this.dataList = res.data;
					this.count = res.count;
					this.monthUser = res.checkCount.checkUserNumber;
					this.errorUser = res.checkCount.errUserNumber;
					if(this.dataList.length > 10) {
						this.tableHeight=this.screeHeight-320;
					} else {
						this.tableHeight='auto';
					}
				})
			},
			//查看详情
			handleInfo(row) {
				let searchData = {
					'checkTypeId': this.formSearch.checkTypeId,
					'deptId': this.formSearch.organize, //所属片区id
					'checkerId': this.formSearch.securityWorker, //安检员
					'checkStatus': this.formSearch.checkStatus, //审核状态
					'userType': this.formSearch.userType, //用户类型
					'userName': this.formSearch.userName, //客户名称
					'address': this.formSearch.userAddress, //客户地址
					'startTime':this.startTime?(this.common.conformatDat(this.startTime)+' 00:00:00'):'',
		      'endTime': this.endTime?(this.common.conformatDat(this.endTime)+' 23:59:59'):'',
					'checkNum': row.isCheck,					
					'userPhone': this.formSearch.userPhone
				}
				this.$store.commit('changeCheckInfo', JSON.stringify(searchData))
				this.$router.push('/securityRecord/checkInfo' + '/' + row.id+'/1')
			},

			//改变时间选择器
			timeChange(v) {

				if(v[0]) {
					this.startTime = v[0] + ' ' + '00:00';
					this.endTime = v[1] + ' ' + '23:59';
				} else {
					this.startTime = '';
					this.endTime = '';
				}

			}, //查询
			handleSearch() {
				this.curpage = 1
				this.getSecuritycheckList()
			},
			//改变页数
			pageChange(current) {
				this.curpage = current
				this.getSecuritycheckList()
			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getSecuritycheckList()

			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				//				console.log(labels, selectedData)
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			changeCascader(value, selectedData) {
				if(value.length) {
					let id= value[value.length - 1];
					this.formSearch.organize=id; 
					this.common.getStaffName(id).then((res) => {
							this.staffList = res.data
			})
				} else {
					this.formSearch.organize = '';
					this.common.getStaffName(this.userData.deptId).then((res) => {
							this.staffList = res.data
			})
				}

			},

		},
		activated() {
			this.getSecuritycheckList();
		},
		mounted() {
			this.formSearch.dateTime = this.common.getNowMonth();
			this.startTime = `${this.formSearch.dateTime[0]}`;
			this.endTime = `${this.formSearch.dateTime[1]}`;
			this.common.getQueryStaffList(this.userData.deptId).then((res) => {
				this.staffList = res.data
			})
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.userTypeList = res.data;
			})

//			this.getSecurityTypeList()
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
    padding: 10px;
    width: 100%;
    text-align: left;
  }

  .mainTop>>>.ivu-form-item {
    margin-bottom: 8px;
  }

  .cardNumber>>>label {
    width: 82px !important;
  }

  .cardNumber>>>.ivu-form-item-content {
    margin-left: 82px !important;
  }

  .btnWrapper {
    text-align: right;
    padding-right: 20px;
  }

  .mainContent {
    background: #fff;
    border-radius: 4px;
    padding: 0 10px 20px;
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

  .mainContent>>>td {
    height: 44px;
  }

 
  .main>>>.ivu-table .firstCheck td {
    color: #f00;
  }

  .main>>>.ivu-table .auditor2Name td {
    color: #13CE66;
  }

  .main>>>.ivu-table .disPass td {
    color: #409EFF;
  }

  .main>>>.ivu-table .warnClass td {
    color: #f3771e;
  }

  .mainTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
  }
</style>
