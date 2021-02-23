<template>
  <div class="main conMain">
    <div class="mainTop">
      <Form inline :label-width="98">
        <FormItem label="建档站点">
          <Cascader :data="createPlaceList" clearable change-on-select :render-format="format" @on-change='changeCascader'
            style="width:170px"></Cascader>
        </FormItem>
        <FormItem label="电子标签编码">
          <Input v-model="bottletag" style="width:170px" placeholder='电子标签编码'/>
        </FormItem>
        <FormItem label="钢瓶条码">
          <Input v-model="bottleCode" style="width:170px" placeholder='钢瓶条码'/>
        </FormItem>
        <FormItem label="出厂编号">
          <Input v-model="bottleFactoryCode" style="width:170px" placeholder='出厂编号'/>
        </FormItem>
        <FormItem label="规格">
          <Select v-model="bottleSize" style="width:170px" clearable>
          	<Option v-for='item in specList' :key='item' :value='item'>{{item}}</Option>
            <!--<Option value="YSP35.5">YSP35.5</Option>
            <Option value="YSP118">YSP118</Option>
            <Option value="YSP118-2">YSP118-2</Option>-->
          </Select>
        </FormItem>
        <FormItem label="钢瓶检测状态">
          <Select v-model="bottleCheckStatus" style="width:170px" clearable>
            <Option :value="1">超期待检</Option>
            <Option :value="2">送检</Option>
            <Option :value="3">检验合格</Option>
            <Option :value="4">即将到期</Option>
            <Option :value="5">检验不合格</Option>
          </Select>
        </FormItem>
        <FormItem label="当前业务状态">
          <Select v-model="taskStatus" style="width:170px" clearable>
            <Option value="1">在库</Option>
            <Option value="2">在途</Option>
            <Option value="3">在用</Option>
            <!--<Option value="4">空瓶在途</Option>
						<Option value="5">空瓶在库</Option>-->
          </Select>
        </FormItem>

        <FormItem label="钢瓶状态">
          <Select v-model="bottleStatus" style="width:170px" clearable>
            <Option :value="-1">删除</Option>
            <Option :value="1">正常</Option>
            <Option :value="2">报废</Option>
            <Option :value="3">注销</Option>
            <Option :value="4">停用</Option>
            <Option :value="5">转出</Option>
            <Option :value="6">回退</Option>
          </Select>
        </FormItem>
        <FormItem label="建档开始时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="建档开始时间" v-model='startCreateTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartCreateTime'></DatePicker>
        </FormItem>
        <FormItem label="建档结束时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="建档结束时间" v-model='endCreateTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndCreateTime'></DatePicker>
        </FormItem>
        <FormItem label="出厂开始时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="出厂开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="出厂结束时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="出厂结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
        <!--<FormItem label="责任人">
					<Input v-model="personLiableName" style="width:170px"/>
				</FormItem>	-->

       <!-- <FormItem label="建档时间">
          <DatePicker v-model="recordTime" type="datetimerange" style="width: 170px" @on-change="recordChange" format="yyyy-MM-dd HH:mm"
            :editable='false'></DatePicker>
        </FormItem>
        <FormItem label="出厂时间">
          <DatePicker v-model="factoryTime" type="datetimerange" style="width: 170px" @on-change="factoryChange" format="yyyy-MM-dd HH:mm"
            :editable='false'></DatePicker>
        </FormItem>
 -->
        <FormItem>
          <Button type="warning" @click='toNewFile' style="margin-right: 20px;">新档案</Button>
          <!--<Button type="success" @click="addClick" v-has='786' style="margin:0 20px;">新增</Button>-->
          <Button type="primary" @click="searchClick">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <!--<Button type="info" size="small" style="margin-right: 10px" @click="edit(row.bottleId)" v-has='788'>编辑</Button>-->
          <Button type="info" size="small" style="margin-right: 10px" @click="handleBindHistory(row.bottleId)" v-has='"newCylinder-bindHistory"'>绑定历史</Button>
          <Button type="success" size="small" style="margin-right: 10px" @click="handleUnbindClick(row.bottleId)"
            v-show='row.bottleNfcId' v-has='1014'>解绑</Button>
          <Button type="info" size="small" style="margin-right: 10px" @click="edit(row.bottleId)" v-has='788'>编辑</Button>
          <Button type="warning" size="small" @click="remove(row.bottleId)" v-has='787' style="margin-right: 10px">注销</Button>
          <Button type="error" size="small" @click="deleteBottle(row.bottleId)" v-has='1015'>删除</Button>
        </template>
      </Table>
      <div class="pageMain">
        <Page size="small" :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer
          show-total placement="top" @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
      </div>

    </div>
    <cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
    <bindHistory v-if='bindHistory' @bindHistory='bindHistoryMethod' :bottleId='bindBottleId'></bindHistory>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
  import bindHistory from '../newCylinder/bindHistory';
	export default {
		name: 'cylinder',
		components: {
			cylInfo,
      bindHistory
		},
		data() {
			return {
				specList:[],
        bindBottleId:'',
        bindHistory:false,
        startTime:'',
        endTime:'',
        startCreateTime:'',
        endCreateTime:'',
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				factoryTime:[],
				recordTime:[],
				userData: (JSON.parse(this.$store.state.userData)),
				bottleCheckStatus: null,
				taskStatus: null,
				createPlace: '',
				bottleStatus: null,
				bottleSize: null,
				personLiableName: '',
				bottletag: '',
				bottleCode: '',
				recordStartTime: null,
				recordEndTime: null,
				factoryStartTime: null,
				factoryEndTime: null,
        bottleFactoryCode:null,
				tags: '',
				infoSee: false,
				loading: false,
				pageTotal: 0,
				pageNum: 1,
				pageSize: 10,
				createPlaceList: [
				],
				columns: [
//				{
//						type: 'selection',
//						width: 60,
//						align: 'center',
//						fixed: 'left'
//					},
					{
						title: '钢瓶条码',
						key: 'bottleCode',
						minWidth: 200,
						align: 'center',
						fixed:'left',
						render: (h, params) => {
							let that = this
							return h('span', {
								style: {
									color: '#1BA060',
									cursor: 'pointer'
								},
								on: {
									click() {
										that.infoSee = true
										that.tags = params.row.bottleCode
									}
								}
							}, params.row.bottleCode);
						},
					},
					{
						title: '电子标签编码',
						key: 'bottleNfcId',
						minWidth:200,
						align: 'center',
						render: (h, params) => {
							let that = this
							return h('span', {
								style: {
									color: '#EE6515',
									cursor: 'pointer'
								},
								on: {
									click() {
										that.infoSee = true
										that.tags = params.row.bottleNfcId
									}
								}
							}, params.row.bottleNfcId);
						},
					},

					{
						title: '出厂编号',
						key: 'bottleFactoryCode',
						minWidth: 200,
						align: 'center',

					},
					{
						title: '建档站点',
						key: 'createDeptName',
						minWidth: 300,
						align: 'center',
						tooltip: true,

					},
					{
						title: '厂家',
						key: 'bottleManufacturer',
						minWidth: 300,
						align: 'center',
						tooltip: true,
					},
					{
						title: '出厂时间',
						key: 'bottleFactoryTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '末次检验时间',
						key: 'bottleLastCheckTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '下次检验时间',
						key: 'bottleNextCheckTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '规格',
						key: 'bottleSpecification',
						minWidth: 120,
						align: 'center'
					},
					{
						title: '钢瓶状态',
						key: 'newStatus',
						minWidth: 120,
						align: 'center'
					},
					{
						title: '钢瓶检验状态',
						key: 'newCheckStatus',
						minWidth: 140,
						align: 'center'
					},
					{
						title: '上次充装时间',
						key: 'bottleLastFillingTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '钢瓶上次充装地点',
						key: 'bottleLastFillingLocation',
						minWidth: 300,
						align: 'center'
					},
					{
						title: '充装次数',
						key: 'bottleFillCount',
						minWidth: 110,
						align: 'center'
					},
					{
						title: '钢瓶创建时间',
						key: 'bottleCreateTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '当前业务状态',
						key: 'flowType',
						minWidth: 130,
						align: 'center'
					},
					{
						title: '建档人',
						key: 'bottleCreaterName',
						minWidth: 140,
						align: 'center'
					},
					{
						title: '责任人',
						key: 'bottlePersonLiableName',
						minWidth: 140,
						align: 'center'
					},
					{
						title: '电子标签绑定时间',
						key: 'bottleTagBindTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '电子标签解绑时间',
						key: 'bottleTagUnbindTime',
						minWidth: 180,
						align: 'center'
					},

					{
						title: '钢瓶修改时间',
						key: 'bottleUpdateTime',
						// fixed:'right',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '自有编号',
						key: 'ownNumber',
						minWidth: 150,
						align: 'center'
					},
					{
						title: '设备品种',
						key: 'equipmentVariety',
						minWidth: 160,
						align: 'center'
					},
					{
						title: '充装介质',
						key: 'fillingMedium',
						minWidth: 160,
						align: 'center'
					},
					{
						title: '报废时间',
						key: 'scrapDate',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '登记代码',
						key: 'registrationCode',
						minWidth: 160,
						align: 'center'
					},
					{
						title: '公称工作压力',
						key: 'nominalWorkingPressure',
						minWidth: 130,
						align: 'center'
					},
					{
						title: '钢瓶容积',
						key: 'cylinderVolume',
						minWidth: 130,
						align: 'center'
					},
					{
						title: '设计壁厚',
						key: 'designWallThickness',
						minWidth: 130,
						align: 'center'
					},
					{
						title: '钢瓶备注',
						key: 'remark',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '操作',
						slot: 'action',
						fixed: 'right',
						width: 345,
						align: 'center'
					}
				],
				dataList: []
			}
		},
		methods: {
      bindHistoryMethod(data){
        this.bindHistory=data;
      },
      //绑定历史
      handleBindHistory(id){
        this.bindBottleId=id;
        this.bindHistory=true;
      },
      //改变出厂结束时间
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
      //改变出厂起始时间
        changeStartTime(v){
            this.startTime=v;

        },
      //改变建档结束时间
        changeEndCreateTime(v){
        	if(v){
        		let ends=v.substring(v.length-8);
        		let starts=v.substring(0,11);
        		if(ends=='00:00:00'){
        			this.endCreateTime=starts+'23:59:59';
        		}else{
        			this.endCreateTime=v;
        		}
        	}
        },
      //改变建档起始时间
        changeStartCreateTime(v){
            this.startCreateTime=v;

        },
      //解绑
      handleUnbindClick(id){
          this.$Modal.confirm({
          	title: '电子标签解绑后自动作废不可重新绑定使用,请确认是否解绑？',
          	content: '',
          	onOk: () => {

          		_http.http2('post', `${pathUrls.unBindBottleTag}?bottleId=${id}`,

          		).then((res) => {
          			if(res.code == 0) {
          				this.$Message['success']({
          					background: true,
          					content: '解绑成功!'
          				});
          				this.getMessage()
          			}

          		})
          	},

          });
      },


			//删除
			deleteBottle(id){
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {

						_http.http2('post', pathUrls.platformBottleDel,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.getMessage()
							}

						})
					},
					onCancel: () => {}
				});
			},
			toNewFile(){
				this.$router.push('/cylinderManage/newCylinder');
			},
			//新增
			addClick(){
				this.$router.push('/cylinder/addCyl')
			},
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			changeCascader(value, selectedData) {
				if(value.length) {
					this.createPlace = value[value.length - 1]
				} else {
					this.createPlace = ''
				}

			},

			//查看钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},
			searchClick() {
				this.loading = true;
				this.pageNum = 1;

				this.getMessage();
			},
			handlePage(value) {
				this.loading = true;
				this.pageNum = value;
				this.getMessage();
			},
			handlePageSize(value) {
				this.loading = true;
				this.pageSize = value;
				this.getMessage();
			},
			edit(id) {
				this.$router.push('/cylinder/editCyl' + '/' + id)
			},
			remove(id) {
				this.$Modal.confirm({
					title: '是否注销？',
					content: '',
					onOk: () => {

						_http.http2('post', pathUrls.deptbottleDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '注销成功!'
								});
								this.getMessage()
							}

						})
					},
					onCancel: () => {}
				});
			},
			getMessage() {
				this.loading = true;
				_http.http1("post", pathUrls.deptbottleList, {
					page: this.pageNum,
					limit: this.pageSize,
					checkStatus:this.bottleCheckStatus,//钢瓶检测状态
					bottleFlowInformation:this.taskStatus,//当前业务状态
					createStation:this.createPlace,//建档站点
					bottleStatus:this.bottleStatus,//钢瓶状态
					bottleSpec:this.bottleSize,//规格
					bottlePersonLiable:this.personLiableName,//责任人
					nfcId:this.bottletag,//电子标签编码
					bottleCode:this.bottleCode,//钢瓶条码
					startCreateTime:this.startCreateTime?(this.common.conformatDat(this.startCreateTime,true)):'',//建档起始时间
					endCreateTime:this.endCreateTime?(this.common.conformatDat(this.endCreateTime,true)):'',//建档结束时间
					startTime:this.startTime?(this.common.conformatDat(this.startTime,true)):'',//出厂起始时间
					endTime:this.endTime?(this.common.conformatDat(this.endTime,true)):'',//出厂结束时间，
          bottleFactoryCode:this.bottleFactoryCode
				}, 'form').then((res) => {
					this.loading = false;
					if(res.code==0){
					this.dataList = res.data;
					this.pageTotal = res.count;
					if(this.dataList.length > 10) {
					    if(this.screeHeight>900){
					      this.tableHeight =this.screeHeight-290;
					    }else{
					      this.tableHeight =this.screeHeight-360;
					    }

					} else {
					    this.tableHeight = 'auto';
					}
					for(let item of this.dataList) {
						if(item.bottleFlowInformation == 1) {
							item.flowType = '在库';
						} else if(item.bottleFlowInformation == 2) {
							item.flowType = '在途';
						} else if(item.bottleFlowInformation == 3) {
							item.flowType = '在用';
						} else if(item.bottleFlowInformation == 4) {
							item.flowType = '在途';
						} else if(item.bottleFlowInformation == 5) {
							item.flowType = '在库';
						}
						switch(item.bottleStatus) {
							case -1:
								item.newStatus = "删除";
								break;
							case 1:
								item.newStatus = "正常";
								break;
							case 2:
								item.newStatus = "报废";
								break;
							case 3:
								item.newStatus = "注销";
								break;
							case 4:
								item.newStatus = "停用";
								break;
							case 5:
								item.newStatus = "转出";
								break;
							case 6:
								item.newStatus = "回退";
								break;
						}
						if(item.bottleCheckStatus == 1) {
							item.newCheckStatus = '超期待检'
						} else if(item.bottleCheckStatus == 2) {
							item.newCheckStatus = '送检'
						} else if(item.bottleCheckStatus == 3) {
							item.newCheckStatus = '检验合格'
						}else if(item.bottleCheckStatus == 4) {
							item.newCheckStatus = '即将到期'
						}else if(item.bottleCheckStatus == 5) {
							item.newCheckStatus = '检验不合格'
						}
            if(item.scrapDate){
               item.scrapDate=item.scrapDate.substring(0,7);
            }
            if(item.bottleFactoryTime){
              item.bottleFactoryTime=item.bottleFactoryTime.substring(0,7);
            }
            if(item.bottleLastCheckTime){
              item.bottleLastCheckTime=item.bottleLastCheckTime.substring(0,7);
            }
            if(item.bottleNextCheckTime){
              item.bottleNextCheckTime=item.bottleNextCheckTime.substring(0,7);
            }
					}
					}

				})
			}
		},
		activated() {
				this.getMessage()
      },
		mounted() {
			this.common.getDeptList(this.userData.deptId).then((res) => {
					this.createPlaceList = this.common.getConDept(res.data)
			})
			this.common.getBottleSpecList().then(res => {
				this.specList=res.data;
			})
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
  .mainContent>>>.ivu-table td {
    height: 40px;
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
