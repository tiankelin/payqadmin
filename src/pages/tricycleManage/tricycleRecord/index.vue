<template>
  <div class="main conMain">
    <div class='mainTop'>
      <Form :model="formSearch" inline :label-width="70">
        <FormItem label="所属组织">

          <Cascader :data="options" clearable change-on-select :render-format="format" @on-change='changeCascader'
            style="width:170px"></Cascader>
        </FormItem>
        <FormItem label="电子标签编码" class='types'>
          <Input v-model="formSearch.bottleTag" style="width:170px"></Input>
        </FormItem>
        <FormItem label="发生地点">
          <Input v-model="formSearch.address" style="width:170px"></Input>
        </FormItem>
        <FormItem label="绑定状态">
          <Select v-model="formSearch.bindStatus" style="width:170px" @on-change='changeStatus'>
            <Option :value="8">全部</Option>
            <Option :value="1">上车</Option>
            <Option :value="2">下车</Option>
            <!--<Option :value="3">疑似下车</Option>-->
            <!--<Option :value="4">回车</Option>-->
            <!--<Option :value="5">疑似上车</Option>-->
          </Select>
        </FormItem>
        <FormItem label="流转节点类型" class='types'>
          <Select v-model="formSearch.type" style="width:170px" clearable>
            <Option :value="1">充装站-车</Option>
            <Option :value="2">车—车</Option>
            <Option :value="3">车-人</Option>
            <Option :value="4">人-车</Option>
            <Option :value="5">车-充装站</Option>
            <Option :value="6">人-站</Option>
            <Option :value="7">站-站</Option>
            <Option :value="8">站-人</Option>
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

        <FormItem>
          <Button type="primary" @click='handleSearch'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class='defaultInfo' v-show='defaultInfo'>仅展示当天的记录，更多记录可通过选择时间查找。</div>
    <div class="mainContentTop">
      <Table border :columns="columnTop" :data="tableDataTop" :loading="loading" highlight-row :height='tableHeight'></Table>
      <div class="pageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage'></Page>
      </div>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="tableData" :loading="loading1" highlight-row :height='tableHeight1'>
        <template slot-scope="{ row, index }" slot="tags">
          <Button type="warning" size="small" @click="getTagsInfo(row.newTags)">钢瓶标签</Button>
        </template>
        <template slot-scope="{ row, index }" slot="codes">
          <Button type="success" size="small" @click="getCodesInfo(row.newCodes)">钢瓶条码</Button>
        </template>
      </Table>
      <div class="pageMain">
        <Page :total="count1" show-sizer show-total show-elevator size="small" @on-change='pageChange1'
          @on-page-size-change='pageSizeChange1' :current='curpage1'></Page>
        <div class='numBox'><span>上车数量: {{bindTotalNum}}</span> <span>下车数量: {{unBindTotalNum}}</span></div>
      </div>
    </div>
    <cylinderTag v-if='tagInfo' :conKeys='conKeys' @tagInfoSee='tagInfoSee' :newTags='newTags'></cylinderTag>
    <cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>
  </div>
</template>
<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylinderTag from '@/pages/comComponent/cylinderTag.vue';
	import cylMap from '@/pages/comComponent/cylMaps';
	export default {
		name: 'tricycleRecord',
		components: {
			cylinderTag,
			cylMap
		},
		data() {
			return {
				tableHeight: 'auto',
				tableHeight1: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				conKeys:'钢瓶标签数',
				newTags:[],
				tagInfo:false,
				bindTotalNum:0,
				unBindTotalNum:0,
				langs: '',
				lats: '',
				addressInfo: false,

				loading: false,
				loading1: false,
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch: {
					organize: '',
					bottleTag: '',
					bindStatus: null,
					address: '',
					dateTime:[],
					carNum: '',
					type:''
				},
				defaultInfo: true,
				columnTop: [
				{
						title: '车牌号',
						key: 'title',
						align: 'center',
						tooltip: true,
						minWidth:75
					},
					{
						title: '配送员',
						key: 'name',
						align: 'center',
						tooltip: true,
						minWidth:75
					},
					{
                title: '上车',
                align: 'center',
								children: [{
									title: 'YSP35.5',
									key: 'bind15KG',
									align: 'center',
								}, {
									title: 'YSP118',
									key: 'bind50KG',
									align: 'center',
								}]

					}, {
                title: '下车',
                align: 'center',
								children: [{
									title: 'YSP35.5',
									key: 'unbind15KG',
									align: 'center',
								}, {
									title: 'YSP118',
									key: 'unbind50KG',
									align: 'center',
								}]
							},
					 {
                title: '库存',
                align: 'center',
								children: [{
									title: 'YSP35.5',
									key: 'reserve15KG',
									align: 'center',
								}, {
									title: 'YSP118',
									key: 'reserve50KG',
									align: 'center',
								}]
							},

				],
				tableDataTop: [],
				columns: [{
						title: '地图',
						key: 'carType',
						align: 'center',
						width: 75,
						fixed:'left',
						render: (h, params) => {
							let that = this
							return h('img', {
								attrs: {
									src: params.row.carType
								},
								style: {
									cursor: 'pointer',
                  width:'24px',
                  height:'24px'
								},
								on: {
									click() {
										that.langs = params.row.lng
										that.lats = params.row.lat
										that.addressInfo = true
									}
								}
							}, params.row.carType);

						}

					},
					{
						title: '发现地点',
						key: 'address',
						align: 'center',
						tooltip: true,
						minWidth:320,
					},
				{
						title: '发现时间',
						key: 'createTime',
						align: 'center',
						tooltip: true,
						minWidth:240,
					},
					{
						title: '操作',
						key: 'newStatus',
						align: 'center',
						minWidth: 120
					},
					{
						title: '气瓶总数',
						key: 'count',
						align: 'center',
						minWidth:120
					},
					{
						title: '终端编码',
						key: 'terminalCode',
						align: 'center',
						minWidth:160
					},
					{
						title: '所属组织',
						key: 'deptName',
						align: 'center',
						minWidth:300,
					},
					{
						title: '员工姓名',
						key: 'staffName',
						align: 'center',
						width:140,
					},
					{
						title: '工号',
						key: 'workCode',
						align: 'center',
						minWidth: 160
					},
					{
						title: '车牌号',
						key: 'carNumber',
						minWidth:140,
						align: 'center'
					}, {
						title: '来源或去向',
						key: 'sourceOrDestination',
						align: 'center',
						minWidth:200,
						tooltip: true,
					},{
						title: '电子标签编码',
						slot: 'tags',
						align: 'center',
						minWidth:160,

					},
					{
						title: '钢瓶条码',
						slot: 'codes',
						align: 'center',
						minWidth:160,
						 tooltip: true,
					},
					{
						title: '流转节点类型',
						key: 'newType',
						align: 'center',
						minWidth:160,
						tooltip: true,

					},
				],
				tableData: [],
				count: 0,
				curpage: 1,
				pagesSize: 10,
				startTime:null,
				endTime:null,
				count1: 0,
				curpage1: 1,
				pagesSize1: 10,
				newStatus:null
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
			//改变状态
			changeStatus(v){
				if(v==8){
				this.newStatus=null;
				}else{
				this.newStatus=this.formSearch.bindStatus
				}
			},
			tagInfoSee(data){
				this.tagInfo=data;

			},
			//获取条码及详情
			getCodesInfo(codes){
			if(codes){
				this.tagInfo=true;
				this.newTags=codes;
				this.conKeys='钢瓶条码数'
			}else{
			this.$Message['warning']({
						background: true,
						content: '暂无钢瓶条码!',
						duration: 1
					});
					return false
			}
			},
			//获取钢瓶标签及详情
			getTagsInfo(tags){
			if(tags){
				this.tagInfo=true;
				this.newTags=tags;
				this.conKeys='钢瓶标签数'
			}else{
			this.$Message['warning']({
						background: true,
						content: '暂无电子标签!',
						duration: 1
					});
					return false
			}
			},

			//查看流转地图定位
			handleAdSee(data) {
				this.addressInfo = data
			},
			changeCascader(value, selectedData) {
				if(value.length) {
					this.formSearch.organize = value[value.length - 1]
				} else {
					this.formSearch.organize = ''
				}

			},
			//获取上下瓶统计接口数据上侧
			getDataSearch() {
				this.tableDataTop = []
				this.loading = true
				let that = this
				_http.http3('get', pathUrls.archivesList, {
						terminalType: 4,
						page: this.curpage,
						limit: this.pagesSize,
						deptId: this.formSearch.organize,
						bottleTag: this.formSearch.bottleTag,
						occurAddress: this.formSearch.address,
						bindStatus: this.newStatus,
						startTime:this.startTime?(this.common.conformatDat(this.startTime,true)):null,
						endTime:this.endTime?(this.common.conformatDat(this.endTime,true)):null,

					})
					.then((res)=>{
						this.loading = false;
						//成功的回调
						if(res) {
							this.bindTotalNum=res.data.bindTotalNum;
							this.unBindTotalNum=res.data.unBindTotalNum;
							this.count = res.data.total

							this.tableDataTop = res.data.list

							if(this.tableDataTop.length > 6) {
							if(this.screeHeight > 1050) {
							this.tableHeight = 400;
								} else if(this.screeHeight <= 1050 && this.screeHeight > 900) {
									this.tableHeight = 300;
								} else if(this.screeHeight <= 900) {
									this.tableHeight = 235;
								}
								} else {
								this.tableHeight = 32 * this.tableDataTop.length + 66;
								if(!this.tableDataTop.length){
									this.tableHeight=140

								}
							}
						}
					}).catch(()=>{
						this.loading = false;
					})
			},
			//获取上下瓶统计接口数据下侧
			getDetailList() {
				this.tableData = []
				this.loading1 = true
				let that = this
				_http.http3('get', pathUrls.bottleDetailList, {
						terminalType:4,
						page: this.curpage1,
						limit: this.pagesSize1,
						deptId: this.formSearch.organize,
						bottleTag: this.formSearch.bottleTag,
						occurAddress: this.formSearch.address,
						bindStatus: this.newStatus,
						startTime:this.startTime?(this.common.conformatDat(this.startTime,true)):null,
						endTime:this.endTime?(this.common.conformatDat(this.endTime,true)):null,
						type:this.formSearch.type
					})
					.then(res=> {
						this.loading1 = false;
						//成功的回调
						if(res) {
							for(let item of res.data) {
								item.carType = require('../../../../src/assets/images/ad.png');
								switch(item.bindStatus) {
								case 1:
								item.newStatus = "上车";
								break;
								case 2:
								item.newStatus = "下车";
								break;
								case 3:
								item.newStatus = "疑似下车";
								break;
								case 4:
								item.newStatus = "回车";
								break;
								case 5:
								item.newStatus = "疑似上车";
								break;
								}

								switch(item.type) {
							case 1:
								item.newType = "充装站-车";
								break;
							case 2:
								item.newType = "车-车";
								break;
							case 3:
								item.newType = "车-人";
								break;
							case 4:
								item.newType = "人-车";
								break;
							case 5:
								item.newType = "车-充装站";
								break;
              case 6:
                item.newType = "人-站";
                break;
              case 7:
                item.newType = "站-站";
                break;
              case 8:
                item.newType = "站-人";
                break;
						}
//								item.bottleTag='B702,34561445'
						if(item.bottleTag){
							item.newTags=item.bottleTag.split(",");
						}
//						item.bottleCode='7702,34561445'
						if(item.bottleCode){
							item.newCodes=item.bottleCode.split(",");
						}
							}
							that.count1 = res.count

							that.tableData = res.data

							if(this.tableData.length > 6) {
							if(this.screeHeight > 1050) {
                  this.tableHeight1 = 460;
								} else if(this.screeHeight <= 1050 && this.screeHeight > 900) {
									this.tableHeight1 = 340;
								} else if(this.screeHeight <= 900) {
									this.tableHeight1 = 240;
								}
								} else {
                  this.tableHeight1 = 'auto';
							}
						}
					}).catch(()=>{
						this.loading1 = false;
					})

			},
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},

			pageChange(current) {

				this.curpage = current;
				this.loading = true;
				this.getDataSearch();

			},
			pageChange1(current) {

				this.curpage1 = current;
				this.loading1 = true;
				this.getDetailList();

			},
			pageSizeChange(pageSize) {

				this.pagesSize = pageSize;
				this.loading = true;
				this.getDataSearch();

			},
			pageSizeChange1(pageSize) {

				this.loading1 = true;
				this.pagesSize1 = pageSize;
				this.getDetailList();

			},
			handleSearch() {

				this.curpage1 = 1;
				this.curpage = 1;
				this.loading = true;
				this.loading1 = true;
				this.getDataSearch();
				this.getDetailList();
			}
		},
		mounted() {
      this.startTime=this.common.getDayDate(0,false)+' '+'00:00:00';
      this.endTime=this.common.getDayDate(0,false)+' '+'23:59:59';
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.getDataSearch();
			this.getDetailList();
		}

	}
</script>
<style type="text/css" scoped>
  .main {
    margin-right: 10px;
    background: #fff;
    padding: 10px;
    min-height: calc(100% - 10px);
  }

  .mainTop {
    padding: 10px 10px 0;
    width: 100%;
    text-align: left;
  }

  .defaultInfo {
    width: 300px;
    text-align: left;
    padding-left: 5px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    margin: 0 0 5px 10px;
    background: #EF8920;
    color: #fff;
    box-shadow: 0px 2px 2px #c8c8c8;
  }

  .mainTop>>>.ivu-form-item {
    margin-bottom: 9px;
  }

  .types>>>label {
    width: 100px !important;
  }

  .types>>>.ivu-form-item-content {
    margin-left: 100px !important;
  }

  .pageMain {
    /*text-align: left;*/
    margin-top: 10px;
    padding: 0 20px 0 10px;
    display: flex;
    justify-content: space-between;
  }

  .numBox span {
    margin-right: 10px;
  }

  .main>>>.ivu-table th {
    background: #E2EEFF;
    color: #51B5EA;
    border-color: #f3f3f3;
    padding: 5px 0;
  }

  .main>>>.ivu-table td {
    height: 32px;
  }

  .mainContentTop {
    margin-bottom: 5px;
  }

  .mainContentTop>>>th .ivu-table-cell {
    padding: 0 9px;
  }

  .mainTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
  }
</style>
