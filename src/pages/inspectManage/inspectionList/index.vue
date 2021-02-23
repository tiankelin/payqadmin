<template>
  <div class='main conMain'>
    <div class="mainTop">
      <Form inline :label-width="96">

        <FormItem label="巡查人员组织">
          <Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format"
            style="width:170px"></Cascader>
        </FormItem>
        <FormItem label="巡查人员姓名">
          <Input type='text' style='width: 170px;' placeholder="巡查人员姓名" v-model='staffName' />
        </FormItem>

        <FormItem label="巡查开始时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="巡查结束时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
        <FormItem class='btnForm'>
          <Button type="primary" @click='handleSearch'>查询</Button>

        </FormItem>
      </Form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="tableData" :loading="loading" :rowClassName="rowClassName" highlight-row
        :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="sourceInfo">
          <div>
            <img @click='viewPic(item)' v-if='item&&item.substring(item.length-3)!="mp4"' :src="item" alt="" v-for='item in row.sourceArray' :key='item'
              style="height: 32px;width: auto;margin:6px 5px 0;cursor: pointer;">
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="realTimeInfo">
          <div>
            <img @click='viewPic(item)' v-if='item' :src="item" alt="" v-for='item in row.realTimeArray' :key='item'
              style="height: 32px;width: auto;margin:6px 5px 0;cursor: pointer;">
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
    <Modal title="图片" v-model="visible" width='800' @on-cancel='handleCancel' class-name="vertical-center-modal" footer-hide draggable>
      <div class="rotateModal" @click='handleRotate' title='旋转'>

      </div>
      <img :src="imgUrl" v-if="visible" class="imgModal" ref='imgModal'>
    </Modal>
  </div>
</template>

<script>
  import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import cylMap from '@/pages/comComponent/cylMaps';
	export default {
		name: 'inspectionList',
		components: {
			cylMap
		},
		data() {
			return {
        rotateIndex:0,
        imgUrl:'',
        visible:false,
        staffName:'',
        organize:'',
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

				startTime: '',
				endTime: '',
				columns: [{
						title: '定位地址',
						key: 'lngLat',
						align: 'center',
						width: '120',
						fixed: 'left',
						render: (h, params) => {
							let that = this
							return h('img', {
								attrs: {
									src: params.row.lngLat
								},
								style: {
									cursor: 'pointer'
								},
								on: {
									click() {
										that.langs = params.row.lng
										that.lats = params.row.lat

										that.addressInfo = true
									}
								}
							}, params.row.lngLat);

						}

					},{
						title: '客户名称',
						key: 'userName',
						align: 'center',
						minWidth: 350,
						tooltip: true
					}, {
						title: '客户地址',
						key: 'userAddress',
						align: 'center',
						minWidth: 350,
						tooltip: true
					},{
						title: '联系方式',
						key: 'userPhoneNumber',
						align: 'center',
						minWidth: 140,
						tooltip: true
					},{
						title: '客户末次服务人员',
						key: 'lastStaffName',
						align: 'center',
						minWidth: 160,
						tooltip: true
					},{
						title: '溯源信息',
						key: 'sourceInfo',
						align: 'center',
						minWidth: 350,
						slot:'sourceInfo'
					},{
						title: '实时图片',
						key: 'realTimeInfo',
						align: 'center',
						minWidth: 350,
						slot:'realTimeInfo'
					},{
						title: '结论',
						key: 'conclusion',
						align: 'center',
						minWidth: 350,

					},{
						title: '巡查人员姓名',
						key: 'inspectors',
						align: 'center',
						minWidth: 160,
						tooltip: true
					},{
						title: '巡查人员组织',
						key: 'deptName',
						align: 'center',
						minWidth: 350,
						tooltip: true
					},{
						title: '巡查时间',
						key: 'createTime',
						align: 'center',
						minWidth: 180,
						tooltip: true
					},{
						title: '审核人',
						key: 'reviewerName',
						align: 'center',
						minWidth: 160,
					},
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
      handleCancel(){
      	this.rotateIndex=0;
      },
      handleRotate(){
      	this.rotateIndex=this.rotateIndex+1;
      	this.$refs.imgModal.style.transform='rotate('+ 90*this.rotateIndex +'deg)';
      },
      viewPic(src){
      	this.imgUrl=src;
      	this.visible=true;
      },
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
        let inspectSearch={
          'deptId': this.organize,
           'page' : this.curpage,
           'limit': this.pagesSize,
           'staffName':this.staffName,
           'startTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
           'endTime': this.endTime?(this.common.conformatDat(this.endTime,true)):'',
        }
        this.$store.commit('changeInspectSearch', JSON.stringify(inspectSearch));
				this.$router.push('/inspectionList/inspectionInfo' + '/' + id);
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
					this.organize = value[value.length - 1]
				} else {
					this.organize = ''
				}

			},

			//查询
			handleSearch() {
				this.curpage = 1
				this.getDeptuserinspectionList()
			},

			//获取巡查单列表
			getDeptuserinspectionList() {
				this.loading = true
				_http.http1('post', pathUrls.deptuserinspectionList, {
					'deptId': this.organize, //所属组织id
					 'page' : this.curpage,
					 'limit': this.pagesSize,
           'staffName':this.staffName,
           'startTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
           'endTime': this.endTime?(this.common.conformatDat(this.endTime,true)):'',
				}, 'form').then((res) => {
					this.loading = false
					for(let item of res.data) {
						if(item.lng) {
							item.lngLat = require('../../../../src/assets/images/ad.png');
						} else {
							item.lngLat = '';
						}
            if(item.sourceInfo){
              item.sourceArray=JSON.parse(item.sourceInfo);
            }
            if(item.realTimeInfo){
              item.realTimeArray=JSON.parse(item.realTimeInfo);
            }
					}
					this.tableData = res.data

					this.count = res.count
					if(this.tableData.length > 10) {
						this.tableHeight = this.screeHeight - 235;
					} else {
						this.tableHeight = 'auto';
					}

				}).catch(()=>{
            this.loading = false
        })
			},

			pageChange(current) {
				this.curpage = current
				this.loading = true
				this.getDeptuserinspectionList()

			},
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.loading = true
				this.getDeptuserinspectionList()
			},
		},
		activated() {
			this.getDeptuserinspectionList();
		},
		mounted() {
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
  .btnForm>>>.ivu-form-item-content {
    margin-left: 20px !important;
  }
  /*.main>>>.ivu-table .checkConclusion td{
		color: #F00;
	}*/
</style>
