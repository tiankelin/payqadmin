<template>
  <div class="main conMain">
    <div class='mainTop conMainTop'>
      <Form inline :label-width="80">

        <FormItem label="所属组织">
          <Cascader placeholder="全部" :data="options" clearable change-on-select @on-change='changeCascader'
            :render-format="format" style="width:178px"></Cascader>
        </FormItem>
        <!--<FormItem label="街道">
						<Select v-model="street" style="width:178px" clearable placeholder="请选择街道">
							<Option>西兴街道</Option>
							<Option>浦沿街道</Option>
						</Select>
					</FormItem>-->
        <FormItem label="配送员">
          <Select v-model="staffName" style="width:150px" clearable placeholder="全部" filterable>
            <Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
          </Select>
        </FormItem>

        <FormItem label="客户类型" class='userType'>
          <Select v-model="userType" style="width:150px" clearable placeholder="全部">
            <Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="街道" class='userType'>
          <Select v-model="userStreet" style="width:178px" clearable placeholder="全部">
            <Option v-for="item in streetList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <Form inline :label-width="148" style="overflow: hidden;">
        <!--<FormItem>

					<CheckboxGroup v-model="cylinderSpec" @on-change='checkBoxChange'>
				        <Checkbox :label="item.spec" v-for='item in checkBoxLabel' :key='item' style='margin:0 10px;' >
				        	<span style="margin-right: 10px;">{{item.spec}}</span>
				        	<Label>占用瓶数大于</Label>
				        	<InputNumber type="number" style="width: 70px;height: 28px;line-height: 28px;margin-right: 10px;" :min='0' v-model='item.num'/>
				        </Checkbox>
   				 	</CheckboxGroup>
				</FormItem>-->
        <FormItem label="YSP35.5 占用瓶数≥" class='userType'>
          <InputNumber type="number" style="width: 110px;height: 28px;line-height: 28px;" :min='0' v-model='ysp35' />
        </FormItem>
        <FormItem label="YSP118 占用瓶数≥" class='userType'>
          <InputNumber type="number" style="width: 81px;height: 28px;line-height: 28px;" :min='0' v-model='ysp118' />
        </FormItem>
        <FormItem label="YSP118-2 占用瓶数≥" class='userType'>
          <InputNumber type="number" style="width:83px;height: 28px;line-height: 28px;" :min='0' v-model='ysp1182' />
        </FormItem>
        <FormItem class='conWrapper' style='float: right;margin-right: 25px;'>
          <!--<Button type="warning" style="margin-right: 20px;">批量导出</Button>-->
          <Button type="primary" @click='handleSearch'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent conMainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="specLabel">
          <div v-if='row.specLabel.length'>
            <div style="margin: 4px 0;" v-for='(item,index) in row.specLabel' :key='item' :class='[index==0?"firstStyle":"",index==1?"secondStyle":"",index==2?"thirdStyle":""]'>{{item}}</div>
          </div>
          <div v-else>未占用</div>
        </template>
        <template slot-scope="{ row, index }" slot="specNum">
          <div v-if='row.specNum.length'>
            <div style="margin: 4px 0;" v-for='(item,index) in row.specNum' :key='item' :class='[index==0?"firstStyle":"",index==1?"secondStyle":"",index==2?"thirdStyle":""]'>{{item}}</div>
          </div>
          <div v-else>0</div>
        </template>
        <template slot-scope="{ row, index }" slot="staffName">
          <span style="display: inline-block;margin: 0 4px;max-width: 80px;" v-for='(item,index) in row.staffArr' v-if='index<3'
            :key='item'>{{item}}</span>
          <span v-if='row.staffArr.length>3'>...</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type='info' size='small' @click="handleSeeInfo(row.userIds)">查看详情</Button>
        </template>
      </Table>
      <div class="pageMain conPageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>

        <!--<div style="line-height: 28px;font-size: 13px;text-align: right;width: 55%;font-weight: 600;">
					<div>
						<span>合计：</span>
						<span style="display: inline-block;margin: 0 4px;">YSP35.5：【200户，共占用300瓶】</span>
						<span style="display: inline-block;margin: 0 4px;">YSP118：【100户，共占用200瓶】</span>
						<span style="display: inline-block;margin: 0 4px;">YSP118-2：【150户，共占用210瓶】</span>
						<span style="display: inline-block;margin: 0 4px;">其他：【150户，共占用210瓶】</span>
					</div>
				</div>-->
      </div>
    </div>
    <userInfo v-if='closeInfo' @closeInfo='closeInfoMethod' :userTypeList='userTypeList' :staffNameList='staffNameList'
      :userIds='userIds'></userInfo>
  </div>
</template>

<script>

  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import userInfo from './userInfo';
	export default{
		name:'occupyStatistics',
		components:{
			userInfo
		},
		data(){
			return{
        streetList:[],
        userStreet:'',
				userIds:'',
				ysp35:0,
				ysp118:0,
				ysp1182:0,
				closeInfo:false,
				pagesSize: 10,
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				sizeOpts: [10, 20, 50, 100, 200],
				curpage:1,
				count:0,
				loading:false,
				tableHeight:'auto',
				dataList:[],
				street:'',
				checkBoxLabel:[{spec:'YSP35.5',num:null},{spec:'YSP118',num:null},{spec:'YSP118-2',num:null}],
				options:[],
				userData: (JSON.parse(this.$store.state.userData)),
				cylinderSpec:[],
				organize:'',
				staffNameList:[],
				staffName:'',

				userTypeList:[],
				userType:'',
				columns:[
//				{
//						type: 'selection',
//						width: 60,
//						align: 'center',
//						slot: 'selection',
//						fixed: 'left'
//					},
					{
						title: '序号',
//						type: 'index',
						width: 100,
						align: 'center',
						key: 'newIndex',
						fixed: 'left'
					},
					{
						title: '气瓶规格',
						width: 140,
						align: 'center',
						slot:'specLabel'
					},{
						title: '占用瓶数量',
						width: 120,
						align: 'center',
						slot:'specNum'
					},{
						title: '所属组织',
						key: 'deptName',
						minWidth:250,
						align: 'center',
					},{
						title: '街道',
						key: 'streetName',
						minWidth: 250,
						align: 'center',
					},{
						title: '客户类型',
						key: 'typeName',
						width: 150,
						align: 'center',
					},{
						title: ' 客户数量',
						key: 'userCount',
						width: 120,
						align: 'center',
					},{
						title: ' 配送员',
						key: 'staffNames',
						width:300,
						align: 'center',
//						slot:'staffName',
						tooltip: true
					},{
						title: '操作',
						slot: 'action',
						fixed: 'right',
						width: 120,
						align: 'center'
					}]
			}
		},
		methods:{
			//获取占用瓶列表
			getOccupyStatistics(){
//				this.dataList=[];
//				this.count=0;
				this.loading = true;
				_http.http1('post', pathUrls.userQueryOccUser, {
					'page': this.curpage,
					"limit": this.pagesSize,
					'orgId': this.organize, //组织
					'userType': this.userType, //用户类型
					'ysp35'	:this.ysp35,
					'ysp118':this.ysp118,
					'ysp1182':this.ysp1182,
					'staffId':this.staffName,
          'streetCode':this.userStreet
				}, 'form').then((res) => {
					this.loading = false;
					if(res.data){
						for(let [item, index] of new Map(res.data.map((item, i) => [item, i]))) {
						if(item.occupiedNumber){
							let newOccNum=JSON.parse(item.occupiedNumber);
								item.specLabel=[];
								item.specNum=[];
								if(newOccNum.length){
									for(let items of newOccNum){
										if(items.spec&&items.spec!='null'&&items.number>0){
											item.specLabel.push(items.spec);
											item.specNum.push(items.number);
										}
								}
								}

						}
						item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);
					}
						this.dataList=res.data;
						this.count=res.count;
						if(this.dataList.length>5){
							this.tableHeight=this.screeHeight -260;
						}else{
							this.tableHeight='auto';
						}

					}


				})
			},
			//改变页数
			pageChange(current) {
				this.curpage = current
				this.getOccupyStatistics()

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
        this.curpage=1;
				this.getOccupyStatistics();

			},
			//查看详情
			handleSeeInfo(v){
				this.userIds=v;
				this.closeInfo=true;
//				this.$router.push('/clientManage/userInfo/'+v);
			},
			//关闭详情
			closeInfoMethod(data){
				this.closeInfo=data;
			},
			//改变多选框
			checkBoxChange(v){
				console.log(v)
			},

			//查询
			handleSearch(){
        this.curpage=1;
				this.getOccupyStatistics();
			},
			//改变组织
			changeCascader(value){
				if(value.length) {
					let id = value[value.length - 1];
					this.organize = id;
					this.common.getStaffName(id).then((res) => {
				this.staffNameList = res.data
			})
				}else{
					this.organize =null;
					this.common.getQueryStaffList(this.userData.deptId).then((res) => {
					this.staffNameList = res.data
			})
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
			this.getOccupyStatistics();
		},
		mounted(){

			this.common.getDeptList(this.userData.deptId).then((res) => {
			this.options = this.common.getConDept(res.data)
		})
			this.common.getQueryStaffList(this.userData.deptId).then((res) => {
				this.staffNameList = res.data
			})
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.userTypeList = res.data;
			})
      if(this.userData.dept){
        this.common.getAreaList(this.userData.dept.areaCode).then((res) => {
        	this.streetList = res.data;
        })
      }

		}
	}
</script>

<style type="text/css" scoped>
  .main{
    position: relative;
    margin-right: 10px;
    background: #FFFFFF;
    min-height: calc(100% - 10px);
  }
  .mainTop{
    padding: 10px 10px 0;
    width: 100%;
    text-align: left;
  }
  .mainTop>>>.ivu-form-item {
    margin-bottom: 8px;
  }
  
  .mainTop>>>.ivu-input-number-input {
    height: 28px;
    line-height: 28px;
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
		display: flex;
	}
  .conWrapper>>>.ivu-form-item-content {
    margin-left: 0px !important;
  }

  .mainTop>>>.ivu-input-number-handler-wrap {
    display: none;
  }

  .mainTop>>>.ivu-input::-webkit-input-placeholder {
    color: #515a6e !important;
  }

  .mainTop>>>.ivu-input::-moz-placeholder {
    color: #515a6e !important;
  }

  .mainTop>>>.ivu-input::-ms-input-placeholder {
    color: #515a6e !important;
  }

  .mainTop>>>.ivu-select-placeholder {
    color: #515a6e;
  }
</style>
