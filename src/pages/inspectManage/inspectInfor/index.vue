<template>
  <div class='main conMain'>
    <div class="mainTop">
      <Form :model="formSearch" inline :label-width="96">
        <!--<FormItem label="巡查地址">
					<Input v-model="formSearch.auditAddress" placeholder="请输入巡查地址" style="width:170px"></Input>
				</FormItem>-->
        <FormItem label="巡查人员组织">
          <Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format"
            style="width:170px"></Cascader>
        </FormItem>
        <FormItem label="巡查人员姓名">
          <Select v-model="formSearch.auditStaffId" clearable style="width:170px">
            <Option v-for="item in auditStaffList" :value="item.staffId" :key="item.staffId">{{item.staffName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="被检人姓名">
          <Select v-model="formSearch.managerStaffId" style="width:170px" clearable>
            <Option v-for="item in staffList" :value="item.staffId" :key="item.staffId">{{item.staffName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="被检人联系方式" class='managerStaffPhone'>
          <Input v-model="formSearch.managerStaffPhone" placeholder="请输入被检人联系方式" style="width:170px"></Input>
        </FormItem>
        <!--<FormItem label=" 整改状态">
					<Select v-model="formSearch.rectifyStatus" clearable placeholder="请选择整改状态" style="width: 170px;">
						<Option :value="1">未整改</Option>
						<Option :value="2">已整改</Option>
					</Select>
				</FormItem>-->
        <FormItem label="巡查项目">
          <Input v-model="formSearch.auditDetail" placeholder="请输入巡查项目" style="width:170px"></Input>
        </FormItem>
        <!--<FormItem label="创建时间">
					<Date-picker format="yyyy-MM-dd" v-model='formSearch.dateTime' type="daterange" placement="bottom-start" placeholder="选择日期" @on-change="timeChange" style="width:170px"></Date-picker>
				</FormItem>-->
        <FormItem label="创建开始时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="创建结束时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click='handleSearch'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="tableData" :loading="loading" :rowClassName="rowClassName" highlight-row
        :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="auditType">
          <div style="display: flex;justify-content: center;">
            <span>{{row.auditTypeNames.toString()}}</span>

          </div>
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <!--<Button type="warning" @click='handleChecked(row.id)' size='small' v-show='row.rectifyCheck==1' v-has='927'>审核1</Button>
					<Button type="warning" @click='handleChecked1(row.id)' size='small' v-show='row.rectifyCheck!=1&&row.checkStatus==1' v-has='9218'>审核2</Button>-->
          <Button type="info" size="small" @click="handleSee(row.id)" style="background:#68a949;border-color:#68a949;">详情</Button>
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
  import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import cylMap from '@/pages/comComponent/cylMaps';
	export default {
		name: 'inspectInfor',
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
				options: [],
				inspectId: '',
				userData: (JSON.parse(this.$store.state.userData)),
				loading: false,
				pagesSize: 10,
				curpage: 1,
				count: 0,
				tableData: [],
				staffList: [],
				auditStaffList: [],
				formSearch: {
					auditAddress: '',
					managerStaffId: '',
					auditStaffId: '',
					managerStaffPhone: '',
					rectifyStatus: '',
					dateTime: '',
					auditDetail: '',
					organize: ''
				},

				startTime: '',
				endTime: '',
				columns: [{
						title: '定位地址',
						key: 'carType',
						align: 'center',
						width: '120',
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
										that.langs = params.row.auditLon
										that.lats = params.row.auditLat

										that.addressInfo = true
									}
								}
							}, params.row.carType);

						}

					}, {
						title: '巡查地址',
						key: 'auditAddress',
						align: 'center',
						minWidth: 350,
						tooltip: true
					},{
						title: ' 巡查人员组织',
						key: 'auditDeptName',
						align: 'center',
						minWidth: 350
					}, {
						title: ' 巡查人员姓名',
						key: 'auditStaffName',
						align: 'center',
						minWidth: 150
					},  {
						title: '被检人姓名',
						key: 'managerStaffName',
						align: 'center',
						minWidth: 150
					}, {
						title: ' 被检人联系方式',
						key: 'managerStaffPhone',
						align: 'center',
						minWidth: 150
					}, {
						title: ' 巡查项目',
						align: 'center',
						slot: 'auditType',
						minWidth: 300
					},
					{
						title: ' 创建时间',
						key: 'createTime',
						align: 'center',
						minWidth: 180
					},
					//
					{
						title: '操作',
						key: 'action',
						width: 120,
						align: 'center',
						fixed: 'right',
						slot: 'action',
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
			//添加行class
			rowClassName(row, index) {
				if(!row.auditConclusion) {
					return 'checkConclusion'
				} else {
					return '';
				}

			},
			//查看地图定位
			handleAdSee(data) {
				this.addressInfo = data
			},
			//查看详情
			handleSee(id) {
				this.$router.push('/inspectInfor/seeInfo' + '/' + id);
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
					this.formSearch.organize = value[value.length - 1]
				} else {
					this.formSearch.organize = ''
				}

			},

			//获取管理人员数据
			getManageStaffs() {
				_http.http2('get', pathUrls.manageStaffs + '?deptId=' + this.userData.deptId, {}, "form")
					.then((res) => {
						if(res) {
							this.staffList = res.data
						}
					})
			},
			//获取巡查人员数据
			getAuditStaffs() {
				_http.http2('get', pathUrls.auditStaffs + '?deptId=' + this.userData.deptId, {}, "form")
					.then((res) => {
						if(res) {
							this.auditStaffList = res.data
						}
					})
			},
			//查询
			handleSearch() {
				this.curpage = 1
				this.getInspectInforList()
			},

			//获取巡查类型列表
			getInspectInforList() {
				this.loading = true
				_http.http1('post', pathUrls.auditinfoList, {
					'deptId': this.formSearch.organize, //所属组织id
					'page': this.curpage,
					"limit": this.pagesSize,
					'auditAddress': this.formSearch.auditAddress,
					'managerStaffId': this.formSearch.managerStaffId,
					'managerStaffPhone': this.formSearch.managerStaffPhone,
					'rectifyStatus': this.formSearch.rectifyStatus,
					'auditStaffId': this.formSearch.auditStaffId,
					'startTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
		      'endTime': this.endTime?(this.common.conformatDat(this.endTime,true)):'',
					'auditTypeName': this.formSearch.auditDetail
				}, 'form').then((res) => {
					this.loading = false
					for(let item of res.data) {
						item.auditTypeNames = [];
						if(item.auditLon) {
							item.carType = require('../../../../src/assets/images/ad.png');
						} else {
							item.carType = '';
						}
						let newContent = JSON.parse(item.checkContent)
						if(newContent.length) {
							newContent.forEach(cons => {
								item.auditTypeNames.push(cons.auditTypeName);
							})
							item.auditTypes = newContent

							item.auditDetail = newContent[0].auditDetail
						}

					}
					this.tableData = res.data

					this.count = res.count
					if(this.tableData.length > 10) {
						this.tableHeight = this.screeHeight - 280;
					} else {
						this.tableHeight = 'auto';
					}

				})
			},

			pageChange(current) {
				this.curpage = current
				this.loading = true
				this.getInspectInforList()

			},
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.loading = true
				this.getInspectInforList()
			},
		},
		activated() {
			this.getInspectInforList();
		},
		mounted() {
			this.getManageStaffs()
			this.getAuditStaffs()
			// this.getInspectInforList()
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
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

  .managerStaffPhone>>>.ivu-form-item-label {
    width: 110px !important;
  }

  .managerStaffPhone>>>.ivu-form-item-content {
    margin-left: 110px !important;
  }

  /*.main>>>.ivu-table .checkConclusion td{
		color: #F00;
	}*/
</style>
