<template>
  <div class="main conMain">
    <div class='mainTop'>
      <Form :model="formSearch" inline :label-width="82">
        <FormItem label="所属组织">
          <Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format"
            style="width:150px"></Cascader>
        </FormItem>
        <FormItem label="客户名称" class='address'>
          <Input v-model="formSearch.userCompanyName" placeholder="请输入客户名称"></Input>
        </FormItem>
        <FormItem label="联系人">
          <Input v-model="formSearch.userName" placeholder="请输入联系人"></Input>
        </FormItem>
        <FormItem label="户号">
          <Input v-model="formSearch.accountNumber" placeholder="请输入户号"></Input>
        </FormItem>
        <FormItem label="身份证号码">
          <Input v-model="formSearch.cardIdNumber" placeholder="请输入身份证号码"></Input>
        </FormItem>
        <FormItem label="联系方式" class='address'>
          <Input v-model="formSearch.userPhoneNumber" placeholder="请输入联系方式"></Input>
        </FormItem>
        <FormItem label="开户人">
          <Select v-model="formSearch.userOpen" filterable style="width:150px;" clearable>
            <Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="销售员">
          <Select v-model="formSearch.salesperson" filterable style="width:150px;" clearable>
            <Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="安检员">
          <Select v-model="formSearch.checker" filterable style="width:150px;" clearable>
            <Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="客户类型" class='userType'>
          <Select v-model="formSearch.userType" style="width:150px" clearable placeholder="请选择客户类型">
            <!--<Option value='居民用户'>居民用户</Option>
						<Option value='小微商户'>小微商户</Option>
						<Option value='商业用户'>商业用户</Option>
						<Option value='工业用户'>工业用户</Option>-->
            <Option v-for="item in gasTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="客户状态">
          <Select v-model="formSearch.userStatus" style="width:150px" clearable placeholder="请选择客户状态">
            <Option :value='1'>正常</Option>
            <Option :value='-1'>销户</Option>
            <!--<Option :value='0'>锁定</Option>-->
          </Select>
        </FormItem>

        <FormItem label="用气地址" class='address'>
          <Input v-model="formSearch.address" placeholder="请输入地址"></Input>
        </FormItem>
        <FormItem label="信息状态">
          <Select v-model="formSearch.userInfoIsPerfection" style="width:150px" clearable placeholder="信息状态" @on-change='PerfectionChange'>
            <!--<Option :value='0'>未完善</Option>
        		<Option :value='1'>已完善</Option>-->
            <Option :value='0'>待分配</Option>
            <Option :value='2'>待提交</Option>
            <Option :value='3'>待审核</Option>
            <Option :value='1'>已完善</Option>

          </Select>
        </FormItem>
        <FormItem label="用气卡编码" class='gasCardCode'>
          <Input v-model="formSearch.gasCardCode" placeholder="请输入用气卡编码"></Input>
        </FormItem>
        <FormItem label="用气卡发放状态" class='cardState'>
          <Select v-model="formSearch.cardState" style="width:150px" clearable placeholder="请选择用气卡发放状态">
            <Option :value='0'>未发放</Option>
            <Option :value='1'>使用中</Option>
            <Option :value='-1'>停用</Option>
          </Select>
        </FormItem>

        <!--<FormItem label="是否分配">
					<Select v-model="formSearch.isAllocation" style="width:150px" clearable placeholder="是否分配" @on-change='allocateChange'>
						<Option :value='0'>未分配</Option>
						<Option :value='1'>已分配</Option>

					</Select>
				</FormItem>-->


        <!-- <FormItem label="开户时间" class='dateLabel'>
          <Date-picker format="yyyy-MM-dd HH:mm" v-model='formSearch.dateTime' type="datetimerange" placement="bottom-start"
            placeholder="选择日期" @on-change="timeChange" style="width:186px"></Date-picker>
        </FormItem> -->
        <FormItem label="开户开始时间" class='cardState'>
          <DatePicker style='width: 150px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="开户结束时间" class='cardState'>
          <DatePicker style='width: 150px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click='handleSearch'>查询</Button>
          <Button type="info" @click='handleSomeEdit' style="margin:0 10px;" v-has='920'>批量修改</Button>
          <Button type="primary" @click='handleSomeAllocate' style="margin-right:10px;" v-has='923'>批量分配</Button>
          <Button type="success" @click='handleAdd' v-has='919' style="margin-right:10px;">开户</Button>
          <!--<Button type="warning" @click='handleExport'>导出</Button>-->
        </FormItem>
      </form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' @on-selection-change='getSelected'
        :rowClassName="rowClassName" highlight-row :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="occNum">
          <Button type="warning" size='small' @click="getBottleCount(row)" style="height: 20px;line-height: 20px;">{{row.bottleNum}}</Button>
          <!--<span v-else>{{row.bottleNum}}</span>-->
        </template>
        <template slot-scope="{ row, index }" slot="contractElc">
          <a v-if='row.contractUrl' :href="row.contractUrl" style="font-size: 24px;color:#f90;" target="_blank">
            <Icon type="ios-paper" style='color: #0000FF;' />
          </a>
        </template>
        <template slot-scope="{ row, index }" slot="historyContractUrl">
          <div>
            <a v-if='row.historyContractUrlArr.length' v-for='item in row.historyContractUrlArr' :href="item" style="font-size: 24px;color:#f90;margin:0 5px;"
              target="_blank">
              <Icon type="ios-paper" style='color:#ff2bee;' />
            </a>
          </div>

        </template>
        <template slot-scope="{ row, index }" slot="action">
          <!--<Button type="primary" size="small" @click="handleAllocation(row.userId,row.userDeptId)" style="margin-right: 10px;" v-show='!row.userInfoExecutor&&row.userInfoIsPerfection!=1' v-has='923'>分配</Button>-->
          <!--<Button type="primary" size="small" @click="handleAllocation(row.userId,row.userDeptId)" style="margin-right: 10px;" v-show='row.userInfoExecutor' v-has='923' >重新分配</Button>-->
          <Button type="info" size="small" @click="handleSee(row.userId,row.userInfoExecutor)" style="margin:0 4px;background:#68a949;border-color:#68a949;">详情</Button>
          <!--<Button type="info" size="small" @click="handleEdit(row.userId)" style="margin-right: 10px;" v-has='920'>编辑</Button>-->
          <div style="display: inline;" v-has='921'>
            <Button type="warning" size="small" @click="handleClose(row.userId)" v-if='row.userStatus!=-1' style='margin:0 4px;'>注销</Button>
          </div>
          <div style="display: inline;" v-has='"customerInfo-recovery"'>
            <Button type="success" size="small" @click="handleRecovery(row.userId)" v-if='row.userStatus==-1' style='margin:0 4px;'>恢复</Button>
          </div>
          <div style="display: inline;" v-has='922'>
            <Button type="error" size="small" @click="handleDelete(row.userId)" v-if='row.userStatus==-1' style='margin:0 4px;'>删除</Button>
          </div>
          <div style="display: inline;">
            <Button type="info" size="small" @click="handleOrderHistory(row.userId)"  v-has='1025' style='margin:0 4px;'>历史购气</Button>
          </div>

        </template>
      </Table>

      <div class="pageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
        <div style="height: 26px;line-height: 26px;display: flex;margin-left: 10px;">
          <div style="margin: 0 10px;"><span style="display: inline-block;width: 20px;height: 10px;background:#f00;"></span><span>已开户</span></div>
          <div style="margin: 0 10px;"><span style="display: inline-block;width: 20px;height: 10px;background:#00F;"></span><span>已分配配送员</span></div>
          <div style="margin: 0 10px;"><span style="display: inline-block;width: 20px;height: 10px;background:#f779ab;"></span><span>app已提交完善信息</span></div>
          <div style="margin: 0 10px;"><span style="display: inline-block;width: 20px;height: 10px;background:#000;"></span><span>信息已完善</span></div>
        </div>
      </div>
      <Modal v-model="modal1" title="
		        " @on-ok="reAllocate" okText='确定' @on-cancel="cancel">
        <p slot="header" style="color:#f60;text-align:left;font-size: 14px;height: 24px;">
          <Icon type="ios-information-circle"></Icon>
          <span>所选项包含以下已分配配送员的用户(勾选进行重新分配)</span>
          <!--<span style="display: block;">(勾选进行重新分配)</span>-->
        </p>
        <CheckboxGroup v-model="checkAllGroup">
          <Checkbox :label="item.userId" v-for='item in staffIdArr' :key='item.userId'>{{item.userRealName}}</Checkbox>
        </CheckboxGroup>
      </Modal>
    </div>
    <div class='editWrapper' v-if='showEditBox'>
      <div class=editContent>
        <Form :model="formEdit" inline :label-width="80">
          <FormItem label="所属组织" class='star'>
            <Cascader :data="options1" clearable v-model="formEdit.organize" change-on-select @on-change='changeCascader1'
              :render-format="format" style="width:200px"></Cascader>
          </FormItem>
          <FormItem label="开户人" class='star'>
            <Select v-model="formEdit.userOpen" filterable style="width:200px;">
              <Option v-for="item in staList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="销售员" class='star'>
            <Select v-model="formEdit.salesperson" filterable style="width:200px;">
              <Option v-for="item in staList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click='handleEnter'>确定</Button>
            <Button type="info" @click='handleCancel' style="margin-left: 10px;">取消</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class='allocation' v-if='allocateShow'>
      <div class='allocationContent'>
        <Form :model="formAllocate" inline :label-width="80">
          <FormItem label="配送员" class='star'>
            <Select v-model="formAllocate.staffName" filterable style="width:200px;">
              <Option v-for="item in staList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="完善内容" class='stars'>
            <Input type="textarea" style="width: 200px;" v-model='formAllocate.remarks' />
          </FormItem>
          <FormItem>
            <Button type="primary" @click='enterClick'>确定</Button>
            <Button type="info" @click='handleCancel' style="margin-left: 10px;">取消</Button>
          </FormItem>
        </Form>
      </div>
    </div>

    <!--<cylinderTag v-if='tagInfo' :conKeys='conKeys' @tagInfoSee='tagInfoSee' :newTags='newTags'></cylinderTag>-->
    <orderCompute @tagInfoSee='tagInfoSee' v-if='tagInfo' :orderCountBottles='orderCountBottles'></orderCompute>
    <orderHistory v-if='orderInfo' @orderInfo='orderInfoMethod' :userId='userId'></orderHistory>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import orderCompute from '@/pages/comComponent/orderCompute.vue';
  import orderHistory from '@/pages/comComponent/orderHistory.vue';
	export default {
		name: 'customerInfo',
		components: {
			orderCompute,
      orderHistory

		},
		data() {
			return {
				orderCountBottles:[],
        userId:'',
        orderInfo:false,
				startTime:null,
				endTime:null,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				sizeOpts: [10, 20, 50, 100, 200],
				nunStaffIdArr: [],
				checkAllGroup: [],
				modal1: false,
				allocateShow: false,
				formAllocate: {
					staffName: '',
					remarks: ''
				},
				conKeys: '占用瓶标签号',
				tagInfo: false,
				newTags: [],
				idArr: [],
				staffIdArr: [],
				showEditBox: false,
				staList: [],
				options1: [],
				formEdit: {
					organize: '',
					userOpen: '',
					salesperson: ''
				},
				count: 0,
				curpage: 1,
				pagesSize: 10,
				dataList: [{

				}],
				loading: false,
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch: {
					organize: '',
					userStatus: 1,
					userOpen: '',
					salesperson: "",
					checker: '',
					userType: '',
					cardState: '',
					accountNumber: '',
					userName: '',
					cardIdNumber: '',
					gasCardCode: '',
					address: '',
					isAllocation: '',
					userInfoIsPerfection: '',
					userCompanyName: '',
					userPhoneNumber: '',
					dateTime:[]
				},
				staffNameList: [],
				columns: [{
						type: 'selection',
						width: 60,
						align: 'center',
						slot: 'selection',
						fixed: 'left'
					},
					{
						title: '序号',
//						type: 'index',
						width: 100,
						align: 'center',
						key: 'newIndex',
						fixed: 'left'
					},{
						title: '所属组织',
						key: 'userDeptName',
						minWidth: 300,
						align: 'center',
					},
					{
						title: '客户名称',
						key: 'userNames',
						minWidth: 200,
						align: 'center',
					}, {
						title: '联系人',
						key: 'userRealName',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '户号',
						key: 'userAccountNumbers',
						minWidth: 160,
						align: 'center',
						//						resizable:true
					}, {
						title: '身份证号码',
						key: 'userIdCardNumber',
						minWidth: 180,
						align: 'center',
					},{
						title: '联系方式',
						key: 'userPhoneNumber',
						minWidth: 160,
						align: 'center',
					},{
						title: '用气地址',
						key: 'userAddress',
						minWidth: 400,
						align: 'center',
						tooltip: true
					},{
						title: '客户类型',
						key: 'userTypeName',
						minWidth: 140,
						align: 'center',
					},{
						title: '信息状态',
						key: 'newPerfection',
						minWidth: 140,
						align: 'center',
					}, {
						title: '订单计算存瓶数',
						key: 'occupiedNumber',
						minWidth: 140,
						slot: 'occNum',
						align: 'center',
					}, {
						title: '开户人',
						key: 'userOpeningStaffName',
						minWidth: 140,
						align: 'center',
					}, {
						title: '用气卡编号',
						key: 'cardCode',
						minWidth: 180,
						align: 'center',
					}, {
						title: '用气卡发放状态',
						key: 'newCardStatus',
						minWidth: 160,
						align: 'center',
					},
					{
						title: '开户合同号',
						key: 'userContractNumber',
						minWidth: 200,
						align: 'center',
						tooltip: true
					},
					{
						title: '电子合同',
						key: 'contractElc',
						minWidth: 110,
						align: 'center',
						slot: 'contractElc'
					},
          {
          	title: '历史合同',
          	key: 'historyContractUrl',
          	minWidth: 180,
          	align: 'center',
          	slot: 'historyContractUrl',
            resizable: true,
          },
					//					{
					//						title: '是否自提',
					//						key: 'userIsSelfExtract',
					//						width: 120,
					//						align: 'center',
					//					},
					{
						title: '销售员',
						key: 'userSalespersonName',
						minWidth: 140,
						align: 'center',
					}, {
						title: '上次安检时间',
						key: 'userLastCheckTime',
						minWidth: 180,
						align: 'center',
					}, {
						title: '安检员',
						key: 'userChecker',
						minWidth: 140,
						align: 'center',
					}, {
						title: '开户时间',
						key: 'userCreateTime',
						minWidth: 180,
						align: 'center',
					},
					{
						title: '客户状态',
						key: 'newStatus',
						minWidth: 120,
						align: 'center',

					},
					//					{
					//						title: '是否分配',
					//						key: 'isAllocation',
					//						width: 120,
					//						align: 'center',
					//					},
					{
						title: '被分配人',
						key: 'userInfoExecutorName',
						minWidth: 140,
						align: 'center',
					},

					{
						title: '提交时间',
						key: 'newCompletionTime',
						minWidth: 180,
						align: 'center',
					},
          {
          	title: '证件地址',
          	key: 'userCertAddress',
          	minWidth: 300,
          	align: 'center',
            tooltip: true
          },
//        {
//        	title: '有证无证',
//        	key: 'newhasCert',
//        	minWidth: 120,
//        	align: 'center',
//          tooltip: true
//        },
					{
						title: '操作',
						slot: 'action',
						fixed: 'right',
						width: 300,
						align: 'center'
					}
				]
			}
		},

		methods: {
      //恢复
      handleRecovery(id) {
      	this.$Modal.confirm({
      		title: '是否恢复？',
      		content: '',
      		onOk: () => {
      			_http.http1('post', pathUrls.userRecovery, {
      				'userId': id
      			}, 'form').then((res) => {
      				if(res.code == 0) {
      					this.$Message['success']({
      						background: true,
      						content: '恢复成功!',
      						onClose: (() => {
      							this.getUserList()
      						})
      					});

      				}
      				if(res.code === 500) {
      			this.$Message['warning']({
      				background: true,
      				content: res.msg,
      			})
      		}

      			})
      		},

      	});
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
      orderInfoMethod(data){
        this.orderInfo=data;
      },
      //历史购气
      handleOrderHistory(id){
        this.userId=id;
        this.orderInfo=true;
      },
			//改变时间选择器
				timeChange(e) {

					if(e[1].length){
					let ends=e[1].substring(e[1].length-5)
					let wholes=e[1].substring(0,e[1].length-5)
				if(ends=='00:00'){
					wholes=wholes+''+'23:59';
					this.formSearch.dateTime=[e[0],wholes]
					this.endTime =wholes
				}else{
					this.endTime = e[1]
				}

				this.startTime = e[0]
				}
				else{

				this.startTime = e[0]
				this.endTime = e[1]
				}


				},
			//导出
			handleExport() {

			},
			//改变完善搜索状态
			PerfectionChange() {
				this.curpage = 1;
				this.getUserList()
			},
			//改变分配搜索状态
			allocateChange() {
				this.curpage = 1;
				this.getUserList()
			},
			//添加行class
			rowClassName(row, index) {
				if(row.userInfoIsPerfection == 0) {
					return 'unAllocate'
				}
				if(row.userInfoIsPerfection == 2) {
					return 'unSubmitte'
				}
				if(row.userInfoIsPerfection == 3) {
					return 'unReview'
				}
				if(row.userInfoIsPerfection == 1) {
					return 'finished'
				}
				//              if(row.userInfoIsPerfection==1){
				//                  return 'finishedInfo';
				//              }
				//               if(row.userInfoExecutor&&!row.userInfoIsPerfection){
				//              	return 'allocatedUnfinished';
				//              }
				return '';
			},
			//点击批量的重新分配
			reAllocate() {
				//				console.log(this.checkAllGroup)
				if(this.checkAllGroup.length > 0) {
					for(let item of this.checkAllGroup) {
						this.nunStaffIdArr.push(item)
					}
				}
				if(this.nunStaffIdArr.length > 0) {
					this.allocateShow = true
					this.getEditQueryStaffList(this.formSearch.organize)
				}

			},

			tagInfoSee(data) {
				this.tagInfo = data;
			},
			getBottleCount(row) {				
				this.orderCountBottles=row.orderCountBottles;
				this.tagInfo = true;
			},

			//开户
			handleAdd() {
				this.$router.push('/clientManage/openAnAccount')
			},
			//获取选中项
			getSelected(v) {
				//				console.log(v)
				this.idArr = [];
				this.staffIdArr = [];
				this.nunStaffIdArr = [];
				//				console.log(v)
				if(v) {
					for(let item of v) {
						this.idArr.push(item.userId)
						if(item.userInfoExecutor) {
							this.staffIdArr.push({
								userId: item.userId,
								userRealName: item.userRealName,
								userInfoIsPerfection: item.userInfoIsPerfection
							})
						} else {
							this.nunStaffIdArr.push(item.userId)
						}

					}
				}
			},
			//确定分配
			enterClick() {
				//				console.log(this.nunStaffIdArr)
				if(!this.formAllocate.staffName) {
					this.$Message['warning']({
						background: true,
						content: '请选择配送员!',
						duration: 1
					});
					return false
				}
				this.getAllocation(this.nunStaffIdArr)
			},
			//批量分配
			handleSomeAllocate() {
				if(!this.formSearch.organize) {
					this.$Message['warning']({
						background: true,
						content: '请先完成组织筛选!',
						duration: 1
					});
					return false;
				}
				if(!this.idArr.length) {
					this.$Message['warning']({
						background: true,
						content: '请选择分配客户!',
						duration: 1
					});
					return false;
				} else if(this.idArr.length && this.staffIdArr.length) {
					this.modal1 = true;
					return false;
				} else if(this.idArr.length && !this.staffIdArr.length) {
					this.allocateShow = true
					this.getEditQueryStaffList(this.formSearch.organize)
				}

			},
			//分配
			handleAllocation(id, deptId) {
				this.allocateShow = true;
				this.idArr = [id];
				this.nunStaffIdArr = [id];
				this.getEditQueryStaffList(deptId)

			},
			//分配接口获取
			getAllocation(arr) {

				_http.http2('post', pathUrls.userAllocation, JSON.stringify({
					'ids': arr.toString(),
					'staffId': this.formAllocate.staffName,
					'remarks': this.formAllocate.remarks
				})).then((res) => {
					this.checkAllGroup = [];
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '分配成功!',
							onClose: (() => {
								this.allocateShow = false;
								this.formAllocate.staffName = '';
								this.getUserList();
								this.nunStaffIdArr = [];
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,

						});
					}
				})
			},
			//批量修改
			handleSomeEdit() {
				if(this.idArr.length) {
					this.showEditBox = true
				} else {
					this.$Message['warning']({
						background: true,
						content: '请选择修改客户!',
						duration: 1
					});
				}
			},
			//点击确定批量修改
			handleEnter() {
				//				let content=JSON.stringify({
				//					'ids':JSON.stringify(this.idArr),
				//					'deptId':this.formEdit.organize,
				//					'openStaffId':this.formEdit.userOpen,
				//					'salespersonId':this.formEdit.salesperson,
				//				})
				if(this.formEdit.organize == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择组织!'
					});
					return false
				}
				if(this.formEdit.userOpen == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择开户人!'
					});
					return false
				}
				if(this.formEdit.salesperson == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择销售员!'
					});
					return false
				}

				_http.http2('post', pathUrls.userBatchUpdate, JSON.stringify({
					'ids': this.idArr.toString(),
					'deptId': this.formEdit.organize,
					'openStaffId': this.formEdit.userOpen,
					'salespersonId': this.formEdit.salesperson,
				})).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.showEditBox = false;
								this.formEdit.organize = '';
								this.formEdit.userOpen = '';
								this.formEdit.salesperson = '';
								this.getUserList()
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,

						});
					}
				})
			},
			//点击取消
			handleCancel() {
				this.showEditBox = false;
				this.allocateShow = false;
			},
			//获取客户信息列表
			getUserList() {
				this.loading = true
				this.idArr = [];
        this.dataList =[];
//      this.count =0;
				_http.http1('post', pathUrls.userGasUserlist, {
					'userIdentity': 1,
					'page': this.curpage,
					"limit": this.pagesSize,
					'deptId': this.formSearch.organize, //组织
					'userStatus': this.formSearch.userStatus, //客户状态
					'opening': this.formSearch.userOpen, //开户人
					'salesperson': this.formSearch.salesperson, //销售员
					'checker': this.formSearch.checker, //安检员
					'userType': this.formSearch.userType, //用户类型
					'cardState': this.formSearch.cardState, //用气卡发放状态
					'accountNumber': this.formSearch.accountNumber, //户号
					'userName': this.formSearch.userName, //姓名
					'cardIdNumber': this.formSearch.cardIdNumber, //证件号
					'gasCardCode': this.formSearch.gasCardCode, //用气卡编码
					'address': this.formSearch.address, //地址
					'isAllocation': this.formSearch.isAllocation, //是否分配
					'userInfoIsPerfection': this.formSearch.userInfoIsPerfection, //是否完善
					'userCompanyName': this.formSearch.userCompanyName, //商户名称
					'userPhoneNumber': this.formSearch.userPhoneNumber, //联系电话
					'beginCreateTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
					'endCreateTime':this.endTime?(this.common.conformatDat(this.endTime,true)):'',
				}, 'form').then((res) => {
					this.loading = false
					for(let [item, index] of new Map(res.data.map((item, i) => [item, i]))) {
//						item.newTags = []
//						if(item.userExtendEntity) {
//							if(item.userExtendEntity.storageBottleDetails) {
//								let bottleDetail = JSON.parse(item.userExtendEntity.storageBottleDetails)
//								for(let items of bottleDetail) {
//									item.newTags.push(items.tag);
//								}
//							}
//						}
//						
//						if(item.newTags) {
//							item.bottleNum = item.newTags.length;
//						} else {
//							item.bottleNum = 0;
//						}
							if(item.userExtendEntity&&item.userExtendEntity.orderCountBottles){
								item.orderCountBottles=item.userExtendEntity.orderCountBottles.orderCountBottleList;
								item.bottleNum=item.userExtendEntity.orderCountBottles.count;
								for(let items of item.orderCountBottles){				
										if(items.businessStatus==1){
											items.newBusinessStatus='正常';
										}else if(items.businessStatus==2){
											items.newBusinessStatus='异常出库';
										}else if(items.businessStatus==3){
											items.newBusinessStatus='无档瓶配送';
										}else if(items.businessStatus==4){
											items.newBusinessStatus='异常入库';
										}
									}
							}else{
								item.orderCountBottles=[];
								item.bottleNum=0;
							}
//							item.bottleNum=item.orderCountBottles.length;
              item.userNames=item.userName?item.userName:item.userRealName;
            if(item.hasCert===0){
                item.newhasCert='无证';
            }
            else if(item.hasCert==1){
                item.newhasCert='有证';
            }else{
                 item.newUserName=item.userNames;
            }
						if(item.userStatus == 1) {
							item.newStatus = '正常'
						} else if(item.userStatus == 0) {
							item.newStatus = '锁定'
						} else if(item.userStatus == -1) {
							item.newStatus = '注销'
						}
						if(item.userExtendEntity) {

							item.occupiedNumber = item.userExtendEntity.occupiedNumber;
							item.userContractNumber = item.userExtendEntity.userContractNumber;
							let newSelf = item.userExtendEntity.userIsSelfExtract;
							if(newSelf == 0) {
								item.userIsSelfExtract = '否'
							} else if(newSelf == 1) {
								item.userIsSelfExtract = '是'
							}
							if(item.userExtendEntity.cardStatus == 0) {
								item.newCardStatus = '未发放'
							} else if(item.userExtendEntity.cardStatus == 1) {
								item.newCardStatus = '已发放'
							} else if(item.userExtendEntity.cardStatus == -1) {
								item.newCardStatus = '停用'
							}
							item.userSalespersonName = item.userExtendEntity.userSalespersonName;
							item.userLastCheckTime = item.userExtendEntity.userLastCheckTime;
							item.userChecker = item.userExtendEntity.userCheckerName;

						}
						if(item.userInfoIsPerfection == 1) {
							item.newPerfection = '已完善'
							item.newCompletionTime = item.checkTime;
						} else if(item.userInfoIsPerfection == 0) {
							item.newPerfection = '待分配'
							item.newCompletionTime = item.userCreateTime;
						} else if(item.userInfoIsPerfection == 2) {
							item.newPerfection = '待提交';
							item.newCompletionTime = item.allocationTime;
						} else if(item.userInfoIsPerfection == 3) {
							item.newPerfection = '待审核';
							item.newCompletionTime = item.completionTime;
						}
						if(item.userInfoExecutor) {
							item.isAllocation = '已分配'
						} else {
							item.isAllocation = '未分配'
						}
            item.historyContractUrlArr=[];
            if(item.historyContractUrl){
              item.historyContractUrlArr=item.historyContractUrl.split(',');
            }
						this.staffNameList.forEach(stas => {
							if(item.userInfoExecutor == stas.staffId) {
								item.userInfoExecutorName = stas.staffName;
							}
						})
						item.newName=item.userCompanyName?item.userCompanyName:item.userRealName;
						item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);
            item.userAddress=item.userProvinceName+item.userCityName+item.userAreaName+item.userStreetName+item.userAddress;
					}
					this.dataList = res.data;
					this.count = res.count;
					if(this.dataList.length > 10) {
              this.tableHeight=this.screeHeight-370;
					} else {
              this.tableHeight='auto';
					}
          if(this.screeHeight<600){
              this.tableHeight=this.screeHeight-470;
            }
				})
			},
			//获取人员列表driverInfo
			getQueryStaffList(id) {
				this.staffNameList = []
				_http.http1('post', pathUrls.deptStaff, {
						deptId:id,
					}, "form")
					.then((res) => {
						//成功的回调
						if(res) {
							this.staffNameList = res.data

						}
					})
			},
			//获取修改人员列表
			getEditQueryStaffList(id) {
				this.staList = []
				_http.http1('post', pathUrls.deptStaff, {
						deptId: id,
					}, "form")
					.then((res) => {
						//成功的回调
						if(res) {
							this.staList = res.data

						}
					})
			},
			//查询
			handleSearch() {
				this.curpage = 1;
				this.getUserList()

			},
			//编辑
			handleEdit(id) {
				this.$router.push('/customerInfo/editAccount' + '/' + id)
			},
			//查看
			handleSee(id, isAllocate) {
				let userSearchData = {
          'userCompanyName': this.formSearch.userCompanyName, //商户名称
					'userIdentity': 1,
					'page': this.curpage,
					"limit": this.pagesSize,
					'deptId': this.formSearch.organize, //组织
					'userStatus': this.formSearch.userStatus, //客户状态
					'opening': this.formSearch.userOpen, //开户人
					'salesperson': this.formSearch.salesperson, //销售员
					'checker': this.formSearch.checker, //安检员
					'userType': this.formSearch.userType, //用户类型
					'cardState': this.formSearch.cardState, //用气卡发放状态
					'accountNumber': this.formSearch.accountNumber, //户号
					'userName': this.formSearch.userName, //姓名
					'cardIdNumber': this.formSearch.cardIdNumber, //证件号
					'gasCardCode': this.formSearch.gasCardCode, //用气卡编码
					'address': this.formSearch.address, //地址
					'isAllocation': this.formSearch.isAllocation, //是否分配
					'userInfoIsPerfection': this.formSearch.userInfoIsPerfection, //是否完善
					'isAllocate': isAllocate ? true : false
				}
				this.$store.commit('changeUserSearchData', JSON.stringify(userSearchData))
				this.$router.push(`/customerInfo/seeAccount/${id}/1`)
			},
			//注销
			handleClose(id) {
				this.$Modal.confirm({
					title: '注销之后72小时内不能恢复，是否继续？',
					content: '',
					onOk: () => {
						_http.http1('post', pathUrls.userCancellation, {
							'userId': id
						}, 'form').then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '注销成功!',
									onClose: (() => {
										this.getUserList()
									})
								});

							}
							if(res.code === 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						})
					}

						})
					},

				});
			},
			//删除
			handleDelete(id) {
				this.$Modal.confirm({
					title: '删除后该用户的所有信息不可恢复，是否继续？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.userDelete1,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getUserList()
									})
								});

							}
							if(res.code === 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						})
					}

						})
					},

				});
			},
			//改变页数
			pageChange(current) {
				this.curpage = current
				this.getUserList()

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getUserList()

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
					this.getQueryStaffList(id);
				} else {
					this.formSearch.organize = '';
					this.getQueryStaffList(this.userData.deptId);
				}
				this.getUserList()
			},
			changeCascader1(value, selectedData) {
				this.formEdit.userOpen = '';
				this.formEdit.salesperson = '';
				if(value.length) {
					let id = value[value.length - 1];
					this.formEdit.organize = id;
					this.getEditQueryStaffList(id)
				} else {
					this.formEdit.organize = '';
				}

			},

		},
		created() {
			this.common.getQueryStaffList(this.userData.deptId).then((res) => {
				this.staffNameList = res.data
			})
		},
		activated() {
			this.getUserList()
		},
		//    beforeRouteEnter(to, from, next) {
		//			 to.meta.keepAlive = true;
		////      if (from.path=='/'||from.path.indexOf('openAnAccount')!=-1||from.path.indexOf('seeAccount')!=-1) {
		////
		////        to.meta.keepAlive = true;
		////
		////      } else {
		////        to.meta.keepAlive = false;
		////      }
		//      next();
		//    },

		mounted() {
			this.common.getDeptList(this.userData.deptId).then(res => {
							this.options = this.common.getConDept(res.data);
							this.options1 = this.options;
						})
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.gasTypeList = res.data;
			})

		}
	}
</script>

<style type="text/css" scoped>
  .main {
    margin-right: 10px;
    background: #FFFFFF;
    min-height: calc(100% - 10px);
    position: relative;
  }

  .mainTop {
    padding: 10px 10px 0;
    width: 100%;
    text-align: left;
  }

  .mainTop>>>.ivu-input-wrapper {
    width: 150px;
  }

  .mainTop>>>.ivu-form-item {
    margin-bottom: 8px;
  }

  .gasCardCode>>>label {
    width: 82px !important;
  }

  .gasCardCode>>>.ivu-form-item-content {
    margin-left: 82px !important;
  }

  .cardState>>>label {
    width: 110px !important;
  }

  .cardState>>>.ivu-form-item-content {
    margin-left: 110px !important;
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
.mainContent>>>.ivu-table td {
    height: 40px;
  }
  .mainContent>>>.ivu-table th {
    background: #E2EEFF;
    color: #51B5EA;
  }

  .editWrapper,
  .allocation {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .4);
    z-index: 1000;
  }

  .editContent,
  .allocationContent {
    width: 340px;
    height: 220px;
    background: #fff;
    position: absolute !important;
    left: 50%;
    top: 50%;
    margin-left: -170px;
    margin-top: -110px;
    padding: 20px;
    text-align: left;
    border-radius: 4px;
  }

  .allocationContent {
    height: 190px;
    margin-top: -100px;
  }

  .editContent>>>.ivu-form-item {
    margin-bottom: 15px;
  }

  .allocationContent>>>.ivu-form-item {
    margin-bottom: 15px;
  }

  .star>>>.ivu-form-item-label:after {
    content: "*";
    color: #f00;
    padding-right: 2px;
  }

  .stars>>>.ivu-form-item-label:after {
    content: "*";
    color: #fff;
    padding-right: 2px;
  }

  .main>>>.ivu-table .finishedInfo td {
    color: #13CE66;
  }

  .main>>>.ivu-table .allocatedUnfinished td {
    color: #00f;
  }

  .mainTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
  }

  .main>>>.ivu-table .unAllocate td {
    color: #F00;
  }

  .main>>>.ivu-table .unSubmitte td {
    color: #00F;
  }

  .main>>>.ivu-table .unReview td {
    color: #f779ab;
  }

  .main>>>.ivu-table .finished td {
    color: #000;
  }
</style>
