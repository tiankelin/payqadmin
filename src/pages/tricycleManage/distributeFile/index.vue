<template>
  <div class="main conMain">
    <div class='mainTop'>
      <Form :model="formSearch" inline :label-width="70">
        <FormItem label="所属组织">
          <Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format"
            style="width:170px" placeholder="所属组织"></Cascader>
        </FormItem>
        <FormItem label="车牌号">
          <Input v-model="formSearch.carNum" placeholder="车牌号"></Input>
        </FormItem>
        <FormItem label="配送员">
          <!--<Input v-model="formSearch.driver"></Input>-->
          <Select v-model="formSearch.driver" style="width:170px" filterable clearable placeholder="配送员">
            <Option v-for="item in staffList" :value="item.staffId" :key="item.staffId">{{item.staffName}}</Option>

          </Select>
        </FormItem>
        <FormItem label="是否启用">
          <Select v-model="formSearch.isAble" style="width:170px" clearable placeholder="是否启用">
            <Option :value="1">是</Option>
            <Option :value="0">否</Option>
          </Select>
        </FormItem>


        <!-- <FormItem label="时间">
          <Date-picker format="yyyy-MM-dd" v-model='formSearch.dateTime' type="daterange" placement="bottom-start"
            placeholder="选择日期" @on-change="timeChange" style="width:186px"></Date-picker>
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
          <Button type="success" @click='handleAdd' style="margin-right: 30px;" v-has='826'>新增</Button>
          <Button type="primary" @click='handleSearch'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <!--<div class='defaultInfo' v-show='defaultInfo'>仅展示近三天的记录，更多记录可通过选择时间查找。</div>-->
    <div class="mainContent">
      <Table border :columns="columns" :data="tableData" :loading="loading" highlight-row :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="carNum">
          <span @click="toRecord" style="color: #13CE66;cursor: pointer;">{{row.carNumber}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="perCylinder">
          <Button type="success" size="small" @click="seeInfo(row.carNumber)">车载钢瓶</Button>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button size="small" type="info" style="margin-right: 10px;" @click='editClick(row.id)' v-has='827'>编辑</Button>
          <Button size="small" type="error" @click='deleteClick(row)' v-has='829'>删除</Button>
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
		name: 'distributeFile',
			components: {
			resCylinder
		},
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				keyWord:'carNumber',
				bottleBindInfo:false,
				conKeys:'',
				loading: false,
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				staffList: [],
				formSearch: {
					organize: '',
					driver: '',
					isAble: null,
					dateTime: '',
					carNum: '',

				},
				columns: [
					{
						title: '车牌号',
						slot: 'carNum',
						minWidth: 130,
						align: 'center',
						fixed:'left',
					},
					{
						title: '所属组织',
						key: 'deptName',
						minWidth: 300,
						align: 'center'
					},
          {
          	title: '配送员',
          	key: 'staffName',
          	minWidth: 150,
          	align: 'center'
          },
          {
          	title: '车辆类型',
          	key: 'newType',
          	minWidth: 140,
          	align: 'center'
          },
					{
						title: '车辆编号',
						key: 'vehicleNumber',
						minWidth: 140,
						align: 'center',
					},



					{
						title: '购置时间',
						key: 'acquisitionTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '是否启用',
						key: 'newAlive',
						minWidth: 120,
						align: 'center'
					},
					{
						title: '配送员工号',
						key: 'workCode',
						minWidth: 140,
						align: 'center'
					},
					{
						title: '所载气瓶数',
						key: 'bottleCount',
						minWidth: 140,
						align: 'center'
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
						minWidth: 220,
						align: 'center'
					}, {
						title: '生产厂家',
						key: 'carFactory',
						minWidth: 300,
						align: 'center'
					},
					{
						title: '型号',
						key: 'carModel',
						minWidth: 120,
						align: 'center'
					},
					{
						title: '创建时间',
						key: 'createTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '操作',
						key: 'action',
						width: 150,
						align: 'center',
						fixed: 'right',
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
			this.$router.push('/distributeFile/editFile' + '/' +id)
			},
			//点击车牌号跳转到上下瓶
			toRecord(){
			this.$router.push('/tricycleManage/tricycleRecord')
			},
			//关闭
			bindBottleSee(data){
				this.bottleBindInfo=data
			},
			//查看责任钢瓶详情
			seeInfo(id) {
				this.bottleBindInfo=true
				this.conKeys=id
//				console.log(this.conKeys)
			},
			//删除
			deleteClick(row) {
        console.log(row)
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
            let fData = {
              status:-1,
            	id:row.id,
            	deptId:row.deptId,
            	carNumber:row.carNumber,
            	carFactory:row.carFactory,
            	carModel:row.carModel,
            	terminalCode:row.terminalCode,
            	acquisitionTime:row.acquisitionTime,
            	isActive:row.isActive,
            	status:-1,
            	vehicleType: 1,
            	carRange:row.carRange,
            	vehicleNumber:row.vehicleNumber,
            	createTime:row.createTime,
            	carStatus:row.carStatus,
            	createrId:row.createrId,
            	onlineFlag:row.onlineFlag,
            	rfId:row.rfId,
            	staffId:row.staffId,
            	staffName: row.staffName,
            	workCode: row.workCode
            }
						_http.http2('post', pathUrls.carinfoUpdate,fData

						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});

								this.getCarInfoList()
							}

						}).catch((res) => {

						})
					},
					onCancel: () => {}
				});
			},
			//获取配送车档案列表信息
			getCarInfoList() {
				this.tableData = []
				this.loading = true
				let that = this
				_http.http3('get', pathUrls.carinfoList, {
						terminalType: 4,
						page: this.curpage,
						limit: this.pagesSize,
						deptId: this.formSearch.organize,
						staffId: this.formSearch.driver,
						isActive: this.formSearch.isAble,
						startTime:this.startTime?(this.common.conformatDat(this.startTime,true)):'',
						endTime: this.endTime?(this.common.conformatDat(this.endTime,true)):'',
						carNumber: this.formSearch.carNum
					})
					.then(res=> {
						//成功的回调
						if(res) {
							that.loading = false;
							that.count = res.count
							for(let item of res.data) {
								if(item.vehicleType == 1) {
									item.newType = '配送三轮车'
								} else if(item.vehicleType == 2) {
									item.newType = '箱式货车'
								} else if(item.vehicleType == 3) {
									item.newType = '敞开式货车'
								} else {
									item.newType = '其他'
								}
								item.newAlive = item.isActive == 0 ? "否" : "是";
                let newCount=item.bottleCount.substring(0,1);
                if(newCount=='-'){
                      item.bottleCount='0瓶'
                }
							}
							that.tableData = res.data
							if(this.tableData.length > 10) {
                this.tableHeight=this.screeHeight-240;
						} else {
                 this.tableHeight='auto';

					}

						}
					})
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
					let id = value[value.length - 1];
					this.formSearch.organize=id;
//					this.getQueryStaffList(id);
				} else {
					this.formSearch.organize = '';
//					this.getQueryStaffList(this.userData.deptId);
				}

			},

			//获取司机
			getQueryStaffList(id) {
				let that = this;
				this.staffList = []
				_http.http1('post', pathUrls.driverInfo, {
						deptId:id,
						carType: 4
					}, "form")
					.then(function(res) {
						//成功的回调
						if(res) {
							that.staffList = res.data

						}
					})
			},
			//改变时间选择器
			timeChange(v) {
				this.defaultInfo = false;
				if(v.length) {
					this.startTime = v[0];
					this.endTime = v[1];
				} else {
					this.startTime = '';
					this.endTime = '';
				}

			},
			//改变页数
			pageChange(current) {
				this.curpage = current

				this.getCarInfoList()

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize

				this.getCarInfoList()

			},
			//新增
			handleAdd() {
				this.$router.push('/distributeFile/addFile')
			},
			//查询
			handleSearch() {
				this.curpage = 1;

				this.getCarInfoList()
			}

		},
		mounted() {
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.getQueryStaffList(this.userData.deptId)
		},

		 activated() {
				this.getCarInfoList()
      },
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
    padding: 10px;
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
