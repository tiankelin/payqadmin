<template>
  <div class="main conMain">
    <div class='mainTop conMainTop'>
      <Form inline :label-width="70">
        <!--<div>-->
          <FormItem class='labelNone'>
            <Select style='width: 120px;' v-model='selectSearch' @on-change='changeSelectSearch'>
              <Option value='押金单号'>押金单号</Option>
              <Option value='联系方式'>联系方式</Option>
              <Option value='户号'>户号</Option>
              <Option value='客户名称'>客户名称</Option>
              <Option value='商品描述'>商品描述</Option>
              <!--<Option value='经办人'>收款人</Option>
              <Option value='退瓶人'>退押人</Option>-->
            </Select>
            <Input style='width:180px ;' :placeholder='selectSearch' v-model='inputSearch' @on-keyup="inputSearch=inputSearch.replace(/\s+/g,'')"/>
          </FormItem>
          <FormItem label="押瓶组织">
            <Cascader :data="options" placeholder="押瓶组织" style='width: 180px;' clearable change-on-select @on-change='changeCascader'
              :render-format="format"></Cascader>
          </FormItem>
          <FormItem label="客户类型">
            <Select v-model="userType" style="width:140px" clearable placeholder="请选择客户类型">
              <Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="图片">
            <Select  style="width:140px" clearable placeholder="有无押金单图片" v-model='hasImageUrl'>
              <Option :value='1'>有</Option>
              <Option :value='0'>无</Option>
            </Select>
          </FormItem>
        <!--</div>-->
        <!--<div>-->
          <FormItem class='labelNone'>
            <Select style='width: 120px;' v-model='selectDate'>
              <Option :value='1'>押金登记时间</Option>
              <Option :value='2'>开始时间</Option>
              <Option :value='3'>押瓶审核时间</Option>
              <Option :value='4'>退瓶审核时间</Option>
              <Option :value='5'>退押时间</Option>
            </Select>
            <DatePicker style='width: 180px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
             ></DatePicker>
            <span style="margin: 0 31px;">至</span>
            <DatePicker style='width: 180px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss" @on-change='changeEndTime'></DatePicker>

          </FormItem>
          <FormItem label="单据状态">
            <Select v-model="noteStatus" style="width:140px" clearable placeholder="请选择单据状态">
              <Option :value='1'>押瓶未审核</Option>
              <Option :value='2'>押瓶通过</Option>
              <Option :value='3'>押瓶不通过</Option>
              <Option :value='4'>退瓶未审核</Option>
              <Option :value='5'>退瓶通过</Option>
              <Option :value='6'>退瓶不通过</Option>
              <Option :value='-1'>撤销</Option>
            </Select>
          </FormItem>

          <FormItem class='conWrapper'>
            <Button type="primary" @click='handleSearch'>查询</Button>
          </FormItem>
        <!--</div>-->
      </Form>
    </div>
    <div class="mainContent conMainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight' :rowClassName="rowClassName">
      	<template slot-scope="{ row, index }" slot="depositPic">
      			<div>
      				<img @click='viewPic(item)' v-for='item in row.depositPicList' v-if='item' :key='item' :src="item" alt=""
      					style="height: 32px;width: auto;margin: 4px 10px 0 0;cursor: pointer;"/>
      			</div>
      	</template>
        <template slot-scope="{ row, index }" slot="action">
        	<Button type="info" size="small" style="margin:0 5px;background: #59a533;border-color: #59a533;" @click="handleInfo(row.id)" v-has='"depositNoteInfo-info"'>详情</Button>
          <!--<div style="display: inline;" v-has='"depositNoteInfo-update"'>
          	<Button type="info" size="small" style="margin:0 5px" @click="handleEdit(row.id)" v-if='row.statusCode==1'>编辑</Button>
          </div>-->

          <div style="display: inline;" v-has='"depositNoteInfo-chargingAudit"'>
          	<Button type="warning" size="small" @click="handleCheck(row.id,row.actionType)"
          	style="margin:0 5px;" v-if='row.statusCode==1'>押瓶审核</Button>
          </div>
          <div style="display: inline" v-has='"depositNoteInfo-withdrawalAudit"'>
          	<Button style="margin:0 5px;" type="warning" size="small" @click="handleCheck(row.id,row.actionType)" v-if='row.statusCode==2'>退瓶审核</Button>
          </div>

        </template>
      </Table>
      <div class="pageMain conPageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
      </div>
    </div>
		<refundReview v-if='reviewShow' @review='reviewMethod' :reviewType='reviewType' :noteId='noteId'></refundReview>
		<Modal title="押金单图片" v-model="visible" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>
			<div class="rotateModal" @click='handleRotate' title='旋转'>

			</div>
			<img :src="imgUrl" v-if="visible" ref='imgModal'  class="imgModal">
		</Modal>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import refundReview from './refundReview';
	export default {
		name: 'depositNoteInfo',
		components:{
			refundReview
		},
		data() {
			return {
				rotateIndex:0,
				noteId:null,
				endEndTime:'',
				startEndTime:'',
				endReturnCheckTime:'',
				startReturnCheckTime:'',
				endCheckTime:'',
				startCheckTime:'',
				endBeginTime:'',
				startBeginTime:'',
				endCreateTime:'',
				startCreateTime:'',
				hasImageUrl:null,
				goodsName:null,
				userName:null,
				userAccountNumbers:null,
				userPhone:null,
				inputSearch:null,
				depositNumber:null,
				actionType:null,
				status:null,
				imgUrl:'',
				visible:false,
				reviewType:null,
				reviewShow:false,
        noteStatus:null,
        selectDate:1,
        selectSearch:'押金单号',
        userTypeList:[],
        userType:null,
				endTime:'',
				startTime:'',
				organize: '',
				pagesSize: 10,
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				sizeOpts: [10, 20, 50, 100, 200],
				curpage: 1,
				count: 0,
				loading: false,
				tableHeight: 'auto',
				dataList: [],
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				columns: [
          {
          	title: '序号',
          	key: 'newIndex',
          	width: 100,
            fixed:'left',
          	align: 'center'
          },
          {
						title: '图片',
						key: 'picList',
						minWidth: 140,
						align: 'center',
						slot:'depositPic'
					},
          {
          	title: '押金单号',
          	key: 'depositNumber',
          	minWidth: 160,
          	align: 'center'
          },
//        {
//        	title: '终止质押',
//        	key: 'newEndPledge',
//        	minWidth: 120,
//        	align: 'center'
//        },
//        {
//        	title: '单据状态',
//        	key: 'newStatus',
//        	minWidth: 140,
//        	align: 'center'
//        },
          {
          	title: '户号',
          	key: 'userAccountNumbers',
          	minWidth: 160,
          	align: 'center'
          },
          {
          	title: '客户名称',
          	key: 'newUserName',
          	minWidth: 140,
          	align: 'center'
          },
					{
						title: '客户类型',
						key: 'userTypeName',
						minWidth: 140,
						align: 'center'
					},
          {
          	title: '联系方式',
          	key: 'userPhone',
          	minWidth: 140,
          	align: 'center'
          },
          {
          	title: '总数量',
          	key: 'goodsCount',
          	minWidth: 100,
          	align: 'center'
          },
          {
          	title: '商品描述',
          	key: 'goodsName',
          	minWidth: 160,
          	align: 'center'
          },
          {
          	title: '总押金',
          	key: 'pledgePrice',
          	minWidth: 120,
          	align: 'center'
          },
          {
          	title: '备注',
          	key: 'remark',
          	minWidth: 140,
          	align: 'center'
          },
          {
          	title: '押瓶组织',
          	key: 'deptName',
          	minWidth: 300,
          	align: 'center'
          },
          {
          	title: '押金登记时间',
          	key: 'createTime',
          	minWidth: 180,
          	align: 'center'
          },

          {
          	title: '押瓶审核人',
          	key: 'auditStaffName',
          	minWidth: 140,
          	align: 'center'
          },
          {
          	title: '押瓶审核时间',
          	key: 'checkTime',
          	minWidth: 180,
          	align: 'center'
          },
          {
          	title: '退瓶审核人',
          	key: 'returnAuditStaffName',
          	minWidth: 140,
          	align: 'center'
          },
          {
          	title: '退瓶审核时间',
          	key: 'returnCheckTime',
          	minWidth: 180,
          	align: 'center'
          },
          {
          	title: '押瓶经办人',
          	key: 'staffName',
          	minWidth: 140,
          	align: 'center'
          },

          {
          	title: '开始时间',
          	key: 'beginTime',
          	minWidth: 180,
          	align: 'center'
          },
//        {
//        	title: '收款人',
//        	key: 'moneyStaffName',
//        	minWidth: 140,
//        	align: 'center'
//        },

          {
          	title: '退押/撤销经办人',
          	key: 'returnStaffName',
          	minWidth: 150,
          	align: 'center'
          },
          {
          	title: '退押/撤销时间',
          	key: 'endTime',
          	minWidth: 180,
          	align: 'center'
          },
          {
          	title: '单据状态',
          	key: 'newStatus',
          	minWidth: 110,
          	align: 'center',
            fixed: 'right',
          },
          {
            title: '操作',
            slot: 'action',
            fixed: 'right',
            width: 190,
            align: 'center'
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
      //添加行class
      rowClassName(row, index) {
      	if(row.status ==-1) {
      		return 'revoke'
      	}
        if(row.status ==0&&row.actionType==0) {
        	return 'unchargingAudit'
        }

      	return '';
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
        	}else{
        		 this.endTime='';
        	}
        },
			changeSelectSearch(){
				this.inputSearch=null;
			},
			viewPic(src){
				this.imgUrl=src;
				this.visible=true;
			},
			reviewMethod(data){
				this.reviewShow=false;
				if(data==2){
					this.getNoteList()
				}
			},
      //审核
      handleCheck(id,type){
      	this.noteId=id;
      	this.reviewType=type;
				this.reviewShow=true;
      },
      //详情
      handleInfo(id){
      	this.$router.push('/depositNoteInfo/editNote/'+id);
      },
      //编辑
      handleEdit(id){
				this.$router.push('/depositNoteInfo/editNote/'+id);
      },

        getNoteList() {
          this.loading = true;
          if(this.noteStatus){
          	switch(this.noteStatus){
          	case 1:
          	  this.actionType=0;
          	  this.status=0;
          	  break;
          	case 2:
          	  this.actionType=0;
          	  this.status=1;
          	  break;
          	case 3:
          	  this.actionType=0;
          	  this.status=2;
          	  break;
          	case 4:
          	  this.actionType=1;
          	  this.status=0;
          	  break;
          	case 5:
          	  this.actionType=1;
          	  this.status=1;
          	  break;
          	case 6:
          	  this.actionType=1;
          	  this.status=2;
          	  break;
          	case -1:
          	  this.actionType=1;
          	  this.status=-1;
          	  break;
          }
          }else{
          		this.actionType=null;
          	  this.status=null;
          }
          if(this.selectSearch=='押金单号'){
						this.depositNumber=this.inputSearch;
					}else{
						this.depositNumber=null;
					}
          if(this.selectSearch=='联系方式'){
						this.userPhone=this.inputSearch;
					}else{
						this.userPhone=null;
					}
					if(this.selectSearch=='户号'){
						this.userAccountNumbers=this.inputSearch;
					}else{
						this.userAccountNumbers=null;
					}
					if(this.selectSearch=='客户名称'){
						this.userName=this.inputSearch;
					}else{
						this.userName=null;
					}
					if(this.selectSearch=='商品描述'){
						this.goodsName=this.inputSearch;
					}else{
						this.goodsName=null;
					}
					if(this.selectDate==1){
						this.startCreateTime=this.startTime;
						this.endCreateTime=this.endTime;
					}else{
						this.startCreateTime='';
						this.endCreateTime='';
					}
					if(this.selectDate==2){
						this.startBeginTime=this.startTime;
						this.endBeginTime=this.endTime;
					}else{
						this.startBeginTime='';
						this.endBeginTime='';
					}
					if(this.selectDate==3){
						this.startCheckTime=this.startTime;
						this.endCheckTime=this.endTime;
					}else{
						this.startCheckTime='';
						this.endCheckTime='';
					}
					if(this.selectDate==4){
						this.startReturnCheckTime=this.startTime;
						this.endReturnCheckTime=this.endTime;
					}else{
						this.startReturnCheckTime='';
						this.endReturnCheckTime='';
					}
					if(this.selectDate==5){
						this.startEndTime=this.startTime;
						this.endEndTime=this.endTime;
					}else{
						this.startEndTime='';
						this.endEndTime='';
					}


          _http.http2("post", pathUrls.bottlePledgeReturnList, {
              pageSize: this.curpage,
              pageNum: this.pagesSize,
              deptId: this.organize,
              status:this.status,
              actionType:this.actionType,
              depositNumber:this.depositNumber,
              userPhone:this.userPhone,
              userType:this.userType,
              userAccountNumbers:this.userAccountNumbers,
              userName:this.userName,
              goodsName:this.goodsName,
              hasImageUrl:this.hasImageUrl,
              startCreateTime:this.startCreateTime?this.common.conformatDat(this.startCreateTime,true):'',
              endCreateTime:this.endCreateTime?this.common.conformatDat(this.endCreateTime,true):'',
							startBeginTime:this.startBeginTime?this.common.conformatDat(this.startBeginTime,true):'',
							endBeginTime:this.endBeginTime?this.common.conformatDat(this.endBeginTime,true):'',
							startCheckTime:this.startCheckTime?this.common.conformatDat(this.startCheckTime,true):'',
							endCheckTime:this.endCheckTime?this.common.conformatDat(this.endCheckTime,true):'',
							startReturnCheckTime:this.startReturnCheckTime?this.common.conformatDat(this.startReturnCheckTime,true):'',
							endReturnCheckTime:this.endReturnCheckTime?this.common.conformatDat(this.endReturnCheckTime,true):'',
							startEndTime:this.startEndTime?this.common.conformatDat(this.startEndTime,true):'',
							endEndTime:this.endEndTime?this.common.conformatDat(this.endEndTime,true):'',
      }).then((res) => {
            this.loading = false;
        if(res.code == 0) {
          if(res.data&&res.data.list){

          	for(let [item, index] of new Map(res.data.list.map((item, i) => [item, i]))) {
//        			let entity=item.pledgeNoAuditLogEntity;
//								item.checkTime=entity.checkTime;
//								item.returnCheckTime=entity.returnCheckTime;
//								item.beginTime=entity.beginTime;
//								item.endTime=entity.endTime;
//								item.moneyStaffName=entity.moneyStaffName;
//								item.remark=entity.remark;
//								item.returnAuditStaffName=entity.returnAuditStaffName;
//								item.returnStaffName=entity.returnStaffName;
//								item.pledgePrice=entity.pledgePrice;
								item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);

								item.newStatus='';
								item.statusCode=null;
								item.newUserName=item.userName?item.userName:item.userRealName;
								item.newEndPledge=item.endPledge==1?'是':'否';

								if(item.actionType===0&&item.status===0){
										item.newStatus='押瓶未审核';
										item.statusCode=1;
								}else if(item.actionType===0&&item.status===1){
										item.newStatus='押瓶通过';
								}else if(item.actionType===0&&item.status===2){
										item.newStatus='押瓶不通过';
								}else if(item.actionType===1&&item.status===0){
										item.newStatus='退瓶未审核';
										item.statusCode=2;
								}else if(item.actionType===1&&item.status===1){
										item.newStatus='退瓶通过';
								}else if(item.actionType===1&&item.status===2){
										item.newStatus='退瓶不通过';
								}else if(item.status===-1){
										item.newStatus='撤销';
								}

								if(item.depositPic){
									 item.depositPicList=item.depositPic.split(',');
								}

						}

            this.dataList = res.data.list;
            this.count = res.data.totalCount;
             if(this.dataList.length > 10) {
            this.tableHeight = this.screeHeight - 230;
          } else {
            this.tableHeight = 'auto';
          }
          }



        }

      }).catch(() => {
        this.loading = false;
        this.dataList=[]
      })
    },


			//改变页数
			pageChange(current) {
				this.curpage = current;
				this.getNoteList();

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.curpage = 1;
				this.getNoteList();

			},

			//查询
			handleSearch() {
				this.curpage = 1;
				this.getNoteList();
			},
			//改变组织
			changeCascader(value) {
				if(value.length) {
					let id = value[value.length - 1];
					this.organize = id;

				} else {
					this.organize = null;

				}

			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
		},
		activated() {
			this.getNoteList();
		},

		mounted() {

      this.common.getUserTypeList(this.userData.deptId).then((res) => {
            	this.userTypeList = res.data;
            })
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
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

  .mainTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
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
    padding: 10px;
  }

  	.conWrapper>>>.ivu-form-item-content {
		margin-left:10px !important;
	}

  .pageMain {
    text-align: left;
    margin-top: 10px;
    padding-left: 10px;
    display: flex;
  }

  .labelNone>>>.ivu-form-item-content {
    margin-left: 0 !important;
  }
  .mainContent>>>.ivu-table .revoke td{
    color: #888;
  }
  .mainContent>>>.ivu-table .unchargingAudit td{
    color: #f00;
  }

</style>
