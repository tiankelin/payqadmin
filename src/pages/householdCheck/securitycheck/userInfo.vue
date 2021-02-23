<template>
  <div class="userMain">
    <div class="userContent">
      <div class="userTitle">
        未安检用户
      </div>
      <div class="closeWrapper" @click='handleClose'>
        <Icon type="md-close" />
      </div>
      <!-- <div class="userTop">
        <Form inline :label-width="70">
          <FormItem label="销售员">
            <Select v-model="staffName" style="width:178px" clearable placeholder="请选择配送员">
              <Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="地址">
            <Input type="text" placeholder="请输入地址" style="width: 178px;" v-model='userAddress' />
          </FormItem>
          <FormItem class='conWrapper'>
            <Button type="primary" @click='handleInfoSearch'>查询</Button>
          </FormItem>
        </Form>
      </div> -->
      <div style="margin-top: 10px;">
      	
        <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='infoHeight'>
        	<template slot-scope="{ row, index }" slot="userAccountNumbers">
            <div  @click="handleSee(row.userId,row.userInfoExecutor)" style="color: #0079fb;cursor: pointer;font-weight: 600;">{{row.userAccountNumbers}}</div>
          </template>
          <template slot-scope="{ row, index }" slot="action" v-if='row.userLastCheckTime'>
            <Button type="info" size="small" @click="handleInfo(row)" style="margin-right: 10px;background:#68a949;border-color:#68a949;">详情</Button>
          </template>
        </Table>
        <div style="margin-top: 10px;">
          <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
            @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{

		name:'userInfo',
		props:{
			infoId:String
		},
		data(){
			return{
        staffNameList:[],
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				userAddress:'',
				infoHeight:'auto',
				sizeOpts: [10, 20, 50, 100, 200],
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
					},{
						title: '户号',
						key: 'userAccountNumbers',
						minWidth: 160,
						align: 'center',
						slot:'userAccountNumbers'
					},{
						title: '联系方式',
						key: 'userPhoneNumber',
						minWidth: 160,
						align: 'center',
					},{
						title: '地址',
						key: 'userAddress',
						minWidth: 400,
						align: 'center',
						tooltip: true
					},
					{
						title: '末次安检时间',
						key: 'userLastCheckTime',
						width: 175,
						align: 'center',
					}, {
						title: '安检员',
						key: 'userChecker',
						minWidth: 140,
						align: 'center',
					},
          {
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
			//查看详情
			handleInfo(row) {
				let searchData = {			
					'userPhone':row.userPhoneNumber
				}
				this.$store.commit('changeCheckInfo', JSON.stringify(searchData))
				this.$router.push('/securityRecord/checkInfo' + '/' + row.userId+'/2')
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
				_http.http2('post', pathUrls.queryNotCheckUsersByStatId, {
					'page':this.curpage,
					"limit":this.pagesSize,
					"id":this.infoId
				}).then((res) => {
					this.loading = false
          if(res.data&&res.data.list){
            for(let [item, index] of new Map(res.data.list.map((item, i) => [item, i]))) {
            	if(item.userExtendEntity) {
            		let newSelf = item.userExtendEntity.userIsSelfExtract;
            		item.userSalespersonName = item.userExtendEntity.userSalespersonName;
            		item.userLastCheckTime = item.userExtendEntity.userLastCheckTime;
            		item.userChecker = item.userExtendEntity.userCheckerName;

            	}
            	item.newName=item.userName?item.userName:item.userRealName;
            	item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);
              item.preAdres=item.userProvinceName+item.userCityName+item.userAreaName+item.userStreetName;
              item.userAddress=item.preAdres?(item.preAdres+item.userAddress):item.userAddress;
            }
          }
					this.dataList = res.data.list;
					this.count = res.data.count;
					if(this.dataList.length<12){
						this.infoHeight='auto'
					}else{
						this.infoHeight =this.screeHeight -170;
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
