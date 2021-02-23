<template>
  <div class="main conMain">
    <!-- <div style="background: rgba(0,0,0,.1);position:absolute;left: 50%;top: 50%;width: 200px;height: 150px;margin-left: -100px;margin-top: -75px;z-index: 100;">
        <div><span>责任瓶数：</span><span></span></div>
        <div v-for="item in dutybottle">
          <div><span></span><span></span></div>
        </div>
    </div> -->
    <div class='mainTop'>
      <Form :model="formSearch" inline :label-width="70">
        <FormItem label="所属组织">
          <Cascader :data="options" clearable change-on-select @on-change='changeCascader' style="width:170px;"
            :render-format="format" placeholder="所属组织"></Cascader>
        </FormItem>
        <FormItem label="车牌号">
          <Input v-model="formSearch.carNum" style="width:170px" placeholder="车牌号"></Input>
        </FormItem>
        <FormItem label="配送员">
          <Select v-model="formSearch.driver" filterable style="width:170px;" clearable placeholder="配送员">
            <Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="车辆类型">
          <Select v-model="formSearch.carType" clearable style="width:170px" placeholder="车辆类型">
            <!--<Option value="1">配送三轮车</Option>-->
            <Option value="2">箱式货车</Option>
            <Option value="3">敞开式货车</Option>
            <Option value="4">其他</Option>
          </Select>
        </FormItem>
        <FormItem label="是否启用" >
          <Select v-model="formSearch.isAble" clearable style="width:170px" placeholder="是否启用">
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
        </FormItem>

        <!-- <FormItem label="时间">
          <Date-picker v-model='formSearch.dateTime' type="daterange" placement="bottom-start" placeholder="选择时间"
            @on-change="timeChange" style="width:170px"></Date-picker>
        </FormItem> -->
        <FormItem label="开始时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="success" @click='handleAdd' v-has='912' style="margin-right: 20px;">新增</Button>
          <Button type="primary" @click='handleSearch'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <!--<div class='defaultInfo' v-show='defaultInfo'>仅展示近三天的记录，更多记录可通过选择时间查找。</div>-->
    <div class="mainContent">
      <Table border :columns="columns" :data="tableData" :loading='loading' highlight-row :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="perCylinder">
          <Button type="success" size="small" @click="seeInfo(row.carNumber)">车载钢瓶</Button>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="info" size="small" @click="editClick(row.id)" style="margin-right: 10px;" v-has='913'>编辑</Button>
          <Button type="error" size="small" @click="deleteClick(row)" v-has='914'>删除</Button>
        </template>
      </Table>
      <div class="pageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage'></Page>
      </div>

    </div>
    <resCylinder v-if='bottleBindInfo' :conKeys='conKeys' @bindBottleSee='bindBottleSee' :keyWord='keyWord'></resCylinder>
  </div>
</template>
<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import resCylinder from '@/pages/comComponent/responsibleCylinder.vue';
	export default {
		name: 'dangerousFile',
		components: {
			resCylinder
		},
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				keyWord: 'carNumber',
				bottleBindInfo: false,
				conKeys: '',
				loading: false,
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				staffNameList: [],
				formSearch: {
					organize: '',
					driver: '',
					carType: '',
					isAble: '',
					dateTime: '',
					carNum: '',
				},
				columns: [
					{
						title: '车牌号',
						key: 'carNumber',
						align: 'center',
						minWidth: 130,
						fixed:'left'
					},
					{
						title: '所属组织',
						key: 'deptName',
						align: 'center',
						//          fixed: 'left',
						minWidth: 300
					},
          {
          	title: '配送员',
          	key: 'staffName',
          	align: 'center',
          	minWidth: 150
          },
          {
          	title: '车辆类型',
          	key: 'newVehicleType',
          	align: 'center',
          	minWidth: 140
          },
					{
						title: '车辆编号',
						key: 'vehicleNumber',
						align: 'center',
						minWidth: 140
					},



					{
						title: '运输单位单位名称',
						key: 'transportDeptName',
						align: 'center',
						minWidth: 150
					},
					{
						title: '运输单位联系人',
						key: 'contacts',
						align: 'center',
						minWidth: 150
					},
					{
						title: '运输单位联系方式',
						key: 'telephone',
						align: 'center',
						minWidth: 150
					},
					{
						title: '押运员姓名',
						key: 'supercargoName',
						align: 'center',
						minWidth: 150
					},

					{
						title: '购置时间',
						key: 'acquisitionTime',
						align: 'center',
						minWidth: 180
					},
					{
						title: '是否启用',
						key: 'newActive',
						align: 'center',
						minWidth: 100
					},
					{
						title: '配送员工号',
						key: 'workCode',
						align: 'center',
						minWidth: 150
					},
					{
						title: '所载气瓶数',
						key: 'bottleCount',
						align: 'center',
						minWidth: 140
					},
					{
						title: '车载钢瓶',
						slot: 'perCylinder',
						minWidth: 110,
						align: 'center',
					},
					{
						title: '智能配送终端',
						key: 'terminalCode',
						align: 'center',
						minWidth: 200
					}, {
						title: '生产厂家',
						key: 'carFactory',
						align: 'center',
						minWidth: 300
					},
					{
						title: '型号',
						key: 'carModel',
						align: 'center',
						minWidth: 150
					},
					{
						title: '创建时间',
						key: 'createTime',
						align: 'center',
						minWidth: 180
					},
					{
						title: '操作',
						key: 'action',
						fixed: 'right',
						width: 150,
						align: 'center',
						slot:'action',

					}
				],

				tableData: [],
				count: 0,
				curpage: 1,
				pagesSize: 10,
				startTime: '',
				endTime: '',
				defaultInfo: true
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
			//编辑
			editClick(id){
			this.$router.push('/dangerousFile/editFileD' + '/' + id);
			},
			//关闭
			bindBottleSee(data) {
				this.bottleBindInfo = data
			},
			//查看责任钢瓶详情
			seeInfo(id) {
				this.bottleBindInfo = true
				this.conKeys = id
//				console.log(this.conKeys)
			},
			//删除
			deleteClick(row) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
              let fData = {
              	id:row.id,
                status:-1,
              	deptId:row.deptId,
              	carNumber:row.carNumber,
              	carFactory:row.carFactory,
              	carModel:row.carModel,
              	terminalCode:row.terminalCode,
              	acquisitionTime:row.acquisitionTime,
              	isActive:row.isActive,

              	vehicleType:row.vehicleType,
              	carRange:row.carRange,
              	vehicleNumber:row.vehicleNumber,
              	createTime:row.createTime ,
              	carStatus:row.carStatus,
              	createrId:row.createrId,
              	onlineFlag:row.onlineFlag ,
              	rfId:row.rfId,

              	workCode:row.workCode,
              	bottleCount:row.bottleCount ,
              	transportDept:row.transportDept,
              	staffId:row.staffId,
              	supercargoId:row.supercargoId,
              	terminalUserCode:row.terminalUserCode,
              }
						_http.http2('post', pathUrls.carinfoUpdate,fData

						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.loading = true;
								this.getDangerousList();
							}

						}).catch((res) => {

						})
					},
					onCancel: () => {}
				});
			},

			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			getDangerousList() {
				this.tableData = [];
				this.loading = true;
				_http.http1('post', pathUrls.carinfoList, {
					page: this.curpage,
					limit: this.pagesSize,
					deptId: this.formSearch.organize,
					staffId: this.formSearch.driver,
					vehicleType: this.formSearch.carType,
					carNumber: this.formSearch.carNum,
					startTime:this.startTime?(this.common.conformatDat(this.startTime,true)):'',
					endTime: this.endTime?(this.common.conformatDat(this.endTime,true)):'',
					isActive: this.formSearch.isAble,
					terminalType: 6
				}, 'form').then((res) => {
					this.loading = false;
					this.count = res.count;

						for(let item of res.data) {
							if(item.vehicleType == 1) {
								item.newVehicleType = '配送三轮车'
							} else if(item.vehicleType == 2) {
								item.newVehicleType = '箱式货车'
							} else if(item.vehicleType == 3) {
								item.newVehicleType = '敞开式货车'
							} else {
								item.newVehicleType = '其他'
							}
							if(item.isActive == 1) {
								item.newActive = '是'
							} else {
								item.newActive = '否'
							}
							if(item.transportDept){
							let transportDept=JSON.parse(item.transportDept);
								item.transportDeptName=transportDept.transportDeptName;
								item.contacts=transportDept.contacts;
								item.telephone=transportDept.telephone;
								}
							let newCount=item.bottleCount.substring(0,1);
							if(newCount=='-'){
							      item.bottleCount='0瓶'
							}
						}
						this.tableData = res.data;
						if(this.tableData.length > 10) {
                this.tableHeight=this.screeHeight-240;
						} else {
                this.tableHeight='auto';

					}

				})
			},
			changeCascader(value, selectedData) {
				if(value.length) {
					this.formSearch.organize = value[value.length - 1]
				} else {
					this.formSearch.organize = ''
				}

			},

			//改变时间选择器
			timeChange(v) {
				this.defaultInfo = false;
				this.startTime = v[0];
				this.endTime = v[1];
			},
			//改变页数
			pageChange(current) {
				this.curpage = current;
				this.loading = true;
				this.getDangerousList();
			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.loading = true;
				this.getDangerousList();
			},
			//新增
			handleAdd() {
				this.$router.push('/dangerousFile/addFileD')
			},
			//查询
			handleSearch() {
				this.curpage = 1;
				this.loading = true;
				this.getDangerousList();
			},
			//司机信息获取
			getStaffName(c) {
				_http.http1('post', pathUrls.driverInfo, {
					deptId: c,
					carType: 6
				}, 'form').then((res) => {
					//        console.log(res);
					this.staffNameList = res.data;
				})
			},
		},
		activated() {
				this.getDangerousList();
      },
		mounted() {
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.getStaffName(this.userData.deptId);

		}
	}
</script>
<style type="text/css" scoped>
  .main {
    margin-right: 10px;
    background: #FFFFFF;
    position: relative;
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

  .defaultInfo {
    width: 300px;
    text-align: left;
    padding-left: 5px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    margin: 0 0 0px 10px;
    background: #EF8920;
    color: #fff;
    box-shadow: 0px 2px 2px #c8c8c8;
  }

  .mainTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
  }
</style>
