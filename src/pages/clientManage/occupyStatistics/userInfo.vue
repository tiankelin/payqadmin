<template>
  <div class="userMain">
    <div class="userContent">
      <div class="userTitle">
        客户详情
      </div>
      <div class="closeWrapper" @click='handleClose'>
        <Icon type="md-close" />
      </div>
      <div class="userTop">
        <Form inline :label-width="70">
          <!--<FormItem label="客户类型" class='userType'>
						<Select v-model="userType" style="width:178px" clearable placeholder="请选择客户类型">
							<Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
						</Select>
					</FormItem>-->
          <FormItem label="销售员">
            <Select v-model="staffName" style="width:178px" clearable placeholder="请选择配送员">
              <Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="地址">
            <Input type="text" placeholder="请输入地址" style="width: 178px;" v-model='userAddress' />
          </FormItem>
          <!--<FormItem label="占用瓶大于" class='occupyNum'>
						<Input type="text" placeholder="占用瓶" style="width: 70px;"/>
					</FormItem>-->
          <FormItem class='conWrapper'>
            <Button type="primary" @click='handleInfoSearch'>查询</Button>
          </FormItem>
        </Form>
      </div>
      <div>
        <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='infoHeight'>
          <template slot-scope="{ row, index }" slot="occNum">
            <Button type="warning" size='small' @click="getBottleCount(row)" style="height: 20px;line-height: 20px;">{{row.bottleNum}}</Button>
          </template>
          <template slot-scope="{ row, index }" slot="contractElc">
            <a v-if='row.contractUrl' :href="row.contractUrl" style="font-size: 24px;color:#f90;" target="_blank">
              <Icon type="ios-paper" />
            </a>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="info" size="small" @click="handleSee(row.userId,row.userInfoExecutor)" style="margin-right: 10px;background:#68a949;border-color:#68a949;">详情</Button>
          </template>
        </Table>
        <div style="margin-top: 10px;">
          <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
            @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
        </div>

      </div>
    </div>
    <cylinderTag v-if='tagInfo' :conKeys='conKeys' @tagInfoSee='tagInfoSee' :newTags='newTags'></cylinderTag>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylinderTag from '@/pages/comComponent/cylinderTag.vue';
	export default{

		name:'userInfo',
		components:{
			cylinderTag
		},
		props:{
			userTypeList:Array,
			staffNameList:Array,
			userIds:String
		},
		data(){
			return{
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				userAddress:'',
				infoHeight:'auto',
				sizeOpts: [10, 20, 50, 100, 200],
				conKeys: '占用瓶标签号',
				tagInfo: false,
				count: 0,
				curpage: 1,
				pagesSize: 10,

				userType:'',
				staffName:'',
				loading:false,
				dataList:[],
				columns: [
					{
						title: '序号',
//						type: 'index',
						width: 100,
						align: 'center',
						key: 'newIndex',
						fixed: 'left'
					},
					{
						title: '客户名称',
						key: 'newName',
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
						title: '信息状态',
						key: 'newPerfection',
						minWidth: 140,
						align: 'center',
					}, {
						title: '所属组织',
						key: 'userDeptName',
						minWidth: 250,
						align: 'center',
					}, {
						title: '地址',
						key: 'userAddress',
						minWidth: 400,
						align: 'center',
						tooltip: true
					}, {
						title: '客户类型',
						key: 'userTypeName',
						minWidth: 140,
						align: 'center',
					},  {
						title: '身份证号码',
						key: 'userIdCardNumber',
						minWidth: 180,
						align: 'center',
					}, {
						title: '联系方式',
						key: 'userPhoneNumber',
						minWidth: 160,
						align: 'center',
					},
//					{
//						title: '占用瓶数',
//						key: 'occupiedNumber',
//						width: 120,
//						slot: 'occNum',
//						align: 'center',
//					},
					{
						title: '开户人',
						key: 'userOpeningStaffName',
						minWidth: 140,
						align: 'center',
					}, {
						title: '用气卡号',
						key: 'cardCode',
						width: 180,
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
						key: 'userContractNumber',
						minWidth: 110,
						align: 'center',
						slot: 'contractElc'
					},
					{
						title: '销售员',
						key: 'userSalespersonName',
						minWidth: 140,
						align: 'center',
					}, {
						title: '上次安检时间',
						key: 'userLastCheckTime',
						width: 175,
						align: 'center',
					}, {
						title: '安检员',
						key: 'userChecker',
						minWidth: 140,
						align: 'center',
					}, {
						title: '创建时间',
						key: 'userCreateTime',
						minWidth: 180,
						align: 'center',
					},
					{
						title: '用户状态',
						key: 'newStatus',
						minWidth: 120,
						align: 'center',

					},
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
					},{
              title: '操作',
              slot: 'action',
              fixed: 'right',
              width: 120,
              align: 'center'
                  }

				]
			}
		},
		methods:{
      //查看
      handleSee(id, isAllocate) {

      	this.$router.push(`/customerInfo/seeAccount/${id}/2`)
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
			getBottleCount(row) {
				this.newTags = row.newTags
				if(this.newTags) {
					this.tagInfo = true;
				} else {
					this.$Message['warning']({
						background: true,
						content: '瓶编号尚未录入!',
						duration: 1
					});
					return false
				}
			},
			tagInfoSee(data) {
				this.tagInfo = data;
			},
			//关闭
			handleClose(){
				this.$emit('closeInfo',false);
			},
			//查询
			handleInfoSearch(){
				this.getUserList();
			},
			//获取客户信息列表
			getUserList() {
				this.loading = true
				_http.http1('post', pathUrls.userGasUserlist, {
					'page':this.curpage,
					"limit":this.pagesSize,
					"address":this.userAddress,
					"salesperson":this.staffName,
					"userIds":this.userIds
				}, 'form').then((res) => {
					this.loading = false
					for(let [item, index] of new Map(res.data.map((item, i) => [item, i]))) {
						item.newTags = []
						if(item.userExtendEntity) {
							if(item.userExtendEntity.storageBottleDetails) {
								let bottleDetail = JSON.parse(item.userExtendEntity.storageBottleDetails)
								for(let items of bottleDetail) {
									item.newTags.push(items.tag);
								}
							}
						}
						if(item.newTags) {
							item.bottleNum = item.newTags.length;
						} else {
							item.bottleNum = 0;
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
					if(this.dataList.length<12){
						this.infoHeight='auto'
					}else{
						this.infoHeight =this.screeHeight -240;
					}
				})
			},

		},
		mounted(){
			this.getUserList()
		}
	}
</script>

<style type="text/css" scoped>
  .userMain {
    background: rgb(41, 107, 126);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;

  }
  .userTop{
    height: 48px;
  }
  .userContent {
    width: calc(100% - 0px);
    height: calc(100% - 0px);
    background: #fff;
    /* border-radius: 4px; */
    padding: 10px;
    /*margin: 5px;*/
    position: relative;
    text-align: left;
  }

  .closeWrapper {
    position: absolute;
    right: 12px;
    top: 0px;
    font-size: 32px;
    cursor: pointer;
    color: #1296db;
    font-weight: 600;
  }

  .occupyNum>>>.ivu-form-item-content {
    margin-left: 90px !important;
  }

  .occupyNum>>>.ivu-form-item-label {
    width: 90px !important;
  }

  .conWrapper>>>.ivu-form-item-content {
    margin-left: 40px !important;
  }

  .userTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
  }
</style>
