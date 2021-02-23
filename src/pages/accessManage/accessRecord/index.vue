<template>
  <div class="main conMain">
    <div class='mainTop'>
      <Form :model="formSearch" inline :label-width="70">
        <FormItem label="所属组织">
          <Cascader :data="options" clearable change-on-select :render-format="format" style="width:180px" @on-change='changeCascader'></Cascader>
        </FormItem>
        <FormItem label="电子标签编码" class='types'>
          <Input v-model="formSearch.bottleTag" style="width:180px"></Input>
        </FormItem>
        <FormItem label="发生地点">
          <Input v-model="formSearch.address" style="width:180px"></Input>
        </FormItem>
        <FormItem label="绑定状态">
          <Select v-model="formSearch.bindStatus" style="width:180px" @on-change='changeStatus'>
            <Option :value="8">全部</Option>
            <Option :value="1">进瓶</Option>
            <Option :value="2">出瓶</Option>
            <!--<Option :value="3">疑似出瓶</Option>-->
            <!--<Option :value="4">回瓶</Option>-->
            <!--<Option :value="5">疑似进瓶</Option>-->
          </Select>
        </FormItem>
    
        <FormItem label="流转节点类型" class='types'>
          <Select v-model="formSearch.type" style="width:156px" clearable>
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
    <div class="pb">
      <div class="whole" v-for="item in tableData1" :key="item.terminalCode">
        <!--<span class="bt btName" :title='item.name'>{{item.name}}</span>-->
        <div><span class="bt" :title='item.title'>{{item.title}}</span></div>
        <div><span class="lt"></span><span class="ht">YSP35.5</span><span class="ht">YSP118</span></div>
        <div><span class="lt">进瓶：</span><span class="nr">{{item.bind15KG}}</span><span class="nr">{{item.bind50KG}}</span></div>
        <div><span class="lt">出瓶：</span><span class="nr">{{item.unbind15KG}}</span><span class="nr">{{item.unbind50KG}}</span></div>
        <div><span class="lt">库存：</span><span class="nr">{{item.reserve15KG}}</span><span class="nr">{{item.reserve50KG}}</span></div>
      </div>
    </div>

    <div class="mainContent">
      <Table border :columns="columns" :data="tableData" :loading='loading' highlight-row :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="tags">
          <Button type="warning" size="small" @click="getTagsInfo(row.newTags)">钢瓶标签</Button>
        </template>
        <template slot-scope="{ row, index }" slot="codes">
          <Button type="success" size="small" @click="getCodesInfo(row.newCodes)">钢瓶条码</Button>
        </template>

      </Table>
      <div class="pageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage'></Page>
        <div class='numBox'><span>进瓶数量: {{bindTotalNum}}</span> <span>出瓶数量: {{unBindTotalNum}}</span></div>
      </div>
    </div>
    <cylinderTag v-if='tagInfo' :conKeys='conKeys' @tagInfoSee='tagInfoSee' :newTags='newTags'></cylinderTag>
    <cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>
  </div>
</template>
<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	import cylinderTag from '@/pages/comComponent/cylinderTag.vue';
	import cylMap from '@/pages/comComponent/cylMaps';
	// import axios from 'axios';
	export default {
		name: 'accessRecord',
		components: {
			cylinderTag,
			cylMap
		},
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				conKeys: '钢瓶标签数',
				newTags: [],
				tagInfo: false,
				bindTotalNum: 0,
				unBindTotalNum: 0,
				langs: '',
				lats: '',
				addressInfo: false,
				tags: '',
//				infoSee: false,
				loading: false,
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch: {
					organize: '',
					bottleTag: '',
					bindStatus: null,
					address: '',
					dateTime: '',
					type: ''
				},
				defaultInfo: true,
				// tableDataTop: [],
				columns: [{
						title: '地图',
						key: 'carType',
						align: 'center',
						width: 75,
						fixed: 'left',
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
						minWidth: 320,
						tooltip: true,
					},

					{
						title: '发现时间',
						key: 'createTime',
						align: 'center',
						tooltip: true,
						minWidth: 240,
					},
					{
						title: '操作',
						key: 'newStatus',
						align: 'center',
						minWidth: 120
					}, {
						title: '气瓶总数',
						key: 'count',
						align: 'center',
						minWidth: 120
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
						minWidth: 300,

					},
					{
						title: '责任人',
						key: 'staffName',
						align: 'center',
						minWidth: 200,
            tooltip: true,
					},
//					{
//						title: '工号',
//						key: 'workCode',
//						align: 'center',
//						width: '160'
//					},
//					{
//						title: '车牌号',
//						key: 'carNumber',
//						width: 140,
//						align: 'center'
//					},

					{
						title: '来源或去向',
						key: 'sourceOrDestination',
						align: 'center',
						minWidth: 200,
						tooltip: true,
					},

					{
						title: '电子标签编码',
						slot: 'tags',
						align: 'center',
						minWidth: 160,

					},
					{
						title: '钢瓶条码',
						slot: 'codes',
						align: 'center',
						minWidth: 160,
						tooltip: true,
					},
					{
						title: '流转节点类型',
						key: 'newType',
						align: 'center',
						minWidth: 160,
						tooltip: true,
					},

				],
				tableData: [],
				tableData1: [],
				count: 0,
				curpage: 1,
				pagesSize: 10,
				startTime: null,
				endTime: null,
				newStatus: null
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
			tagInfoSee(data) {
				this.tagInfo = data;

			},
			//获取条码及详情
			getCodesInfo(codes) {
				if(codes) {
					this.tagInfo = true;
					this.newTags = codes;
					this.conKeys = '钢瓶条码数'
				} else {
					this.$Message['warning']({
						background: true,
						content: '暂无钢瓶条码!',
						duration: 0.7
					});
					return false
				}
			},
			//获取钢瓶标签及详情
			getTagsInfo(tags) {
				if(tags) {
					this.tagInfo = true;
					this.newTags = tags;
					this.conKeys = '钢瓶标签数'
				} else {
					this.$Message['warning']({
						background: true,
						content: '暂无电子标签!',
						duration: 0.7
					});
					return false
				}
			},
			//改变状态
			changeStatus(v) {
				if(v == 8) {
					this.newStatus = null;
				} else {
					this.newStatus = this.formSearch.bindStatus
				}
			},

			changeCascader(value, selectedData) {
				if(value.length) {
					this.formSearch.organize = value[value.length - 1]
				} else {
					this.formSearch.organize = ''
				}

			},
			//查看流转地图定位
			handleAdSee(data) {
				this.addressInfo = data
			},
			//查看钢瓶详情
//			handleSee(data) {
//				this.infoSee = data
//			},

			pageChange(current) {

				this.curpage = current;
				this.loading = true;
				this.getCardDetail()
			},
			pageSizeChange(pageSize) {

				this.pagesSize = pageSize;
				this.loading = true;
				this.getCardDetail()

			},
			handleSearch() {

				this.loading = true;
				this.curpage = 1;
				this.getCardData();
				setTimeout(()=>{
				  this.getCardDetail()
				},300)
			},
			getCardData() {
				this.tableData1 = [];
				_http.http3('get', pathUrls.archivesList, {
					page: 1,
					limit: 1000,
					bottleTag: this.formSearch.bottleTag,
					occurAddress: this.formSearch.address,
					terminalType: 5,
					startTime:this.startTime?(this.common.conformatDat(this.startTime,true)):null,
					endTime:this.endTime?(this.common.conformatDat(this.endTime,true)):null,
					bindStatus: this.newStatus,
					deptId: this.formSearch.organize
				}).then((res) => {
					this.bindTotalNum = res.data.bindTotalNum;
					this.unBindTotalNum = res.data.unBindTotalNum;
					this.tableData1 = res.data.list;
					//          console.log(this.tableData1)
				})
			},
			getCardDetail() {
				this.tableData = [];
				this.loading = true;
				_http.http3('get', pathUrls.bottleDetailList, {
					page: this.curpage,
					limit: this.pagesSize,
					bottleTag: this.formSearch.bottleTag,
					occurAddress: this.formSearch.address,
					terminalType: 5,
					startTime:this.startTime?(this.common.conformatDat(this.startTime,true)):null,
					endTime:this.endTime?(this.common.conformatDat(this.endTime,true)):null,
					bindStatus: this.newStatus,
					deptId: this.formSearch.organize,
					type:this.formSearch.type
				}).then((res) => {
					this.loading = false;
					for(let item of res.data) {
//						item.newStatus = item.bindStatus == 1 ? '进瓶' : '出瓶'
						item.carType = require('../../../../src/assets/images/ad.png');
						switch(item.bindStatus) {
								case 1:
								item.newStatus = "进瓶";
								break;
								case 2:
								item.newStatus = "出瓶";
								break;
								case 3:
								item.newStatus = "疑似出瓶";
								break;
								case 4:
								item.newStatus = "回瓶";
								break;
								case 5:
								item.newStatus = "疑似进瓶";
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
						if(item.bottleTag) {
							item.newTags = item.bottleTag.split(",");
						}
						//						item.bottleCode='7702,34561445'
						if(item.bottleCode) {
							item.newCodes = item.bottleCode.split(",");
						}
					}
					this.count = res.count;
					this.tableData = res.data;
					let lens=0;

					if(this.tableData.length > 6) {
							if(this.screeHeight > 1050) {
					    if(this.tableData1.length<6){
					      lens=120;
					    }
							this.tableHeight = 490+lens;
								} else if(this.screeHeight <= 1050 && this.screeHeight > 900) {
					        if(this.tableData1.length<6){
					          lens=120;
					        }else{
					          lens=0;
					        }
									this.tableHeight = 380+lens;
								} else if(this.screeHeight <= 900) {
					        if(this.tableData1.length<5){
					          lens=105;
					        }else{
					          lens=0;
					        }
									this.tableHeight = 260+lens;
					       
								}
								} else {
								this.tableHeight ='auto';

							}

				})
			},
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
		},
		mounted() {
      this.startTime=this.common.getDayDate(0,false)+' '+'00:00:00';
      this.endTime=this.common.getDayDate(0,false)+' '+'23:59:59';
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.getCardData();
      setTimeout(()=>{
        this.getCardDetail()
      },300)

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
    padding: 0 10px 0;
    width: 100%;
    text-align: left;
  }

  .types>>>label {
    width: 100px !important;
  }

  .types>>>.ivu-form-item-content {
    margin-left: 100px !important;
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
    margin-bottom: 8px;
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

  .pb {
    /* 弹性排版 */
    display: flex;
    flex-wrap: wrap;
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 5px;
  }

  .whole {
    width: 270px;
    height: 160px;
    background: #fff;
    box-shadow: 0 2px 12px 0 #40a9ff4a;
    border-radius: 5px;
    margin-right: 3px;
    margin-bottom: 6px;
    margin-left: 6px;
    padding: 0 10px;
    font-size: 12px;
  }

  .whole div {
    margin: 10px 0;
  }

  .whole span {
    text-align: center;
    width: 60px;
    display: inline-block;
  }

  .whole .bt {
    font-weight: 600;
    font-size: 12px;
    width: 230px;
    color: #13CE66;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .whole .btName {
    color: #51B5EA;
    width: 135px;
  }

  .lt {
    margin-right: 0px;
    font-weight: 600;
  }

  .ht {
    font-weight: 600;

  }

  .main>>>.ivu-table td {
    height: 32px;
  }

  .mainTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
  }
</style>
