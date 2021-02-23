<template>
  <div class="main conMain">
    <div class='mainTop conMainTop'>
      <Form inline :label-width="70">

        <FormItem label="所属组织">
          <Cascader :data="options" placeholder="所属组织" style='width: 200px;' clearable change-on-select @on-change='changeCascader'
            :render-format="format"></Cascader>
        </FormItem>
        <!--<FormItem label="查询类型">
					<Select  style='width: 180px;' v-model='queryType'>
						<Option :value='1'>查询组织统计所有数据</Option>
						<Option :value='2'>查询员工统计所有数据</Option>
						<Option :value='3'>查询员工统计分页数据</Option>
					</Select>
				</FormItem>-->
        <FormItem class='switchForm'>
         <i-switch true-color="#13ce66" false-color="#ff4949" v-model='dateSwitch' @on-change='dateSwitchChange' :true-value='3' :false-value='4'>
            <span slot="open">月</span>
            <span slot="close">日</span>
        </i-switch>
        </FormItem>
        <FormItem label='安检月份' v-if='dateSwitch==3'>
          <DatePicker editable style='width: 220px;' type="month" placeholder="安检月份" v-model='statDate' format="yyyy-MM"
            @on-change='changeStatDate'></DatePicker>
        </FormItem>
        <FormItem label='安检日期' v-else>
          <DatePicker editable style='width: 220px;' type="date" placeholder="安检日期" v-model='statDate' format="yyyy-MM-dd"
            @on-change='changeStatDate'></DatePicker>
        </FormItem>
        <!--<FormItem label="结束时间">
					<DatePicker style='width: 200px;' type="date" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd" @on-change='changeEndTime'></DatePicker>
				</FormItem>-->
        <FormItem class='conWrapper'>
          <Button type="primary" @click='handleSearch'>查询</Button>
           <Button type="warning" @click='handleExport' style="margin:0 20px;" v-has='"securitycheck-export"'>导出</Button>
        </FormItem>
      </Form>
    </div>

    <div class="mainContent conMainContent">
      <div class='defaultInfo'>月统计默认统计上月份的数据，日统计默认统计昨天的数据。</div>
      <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="totalUsers">
          <div>
            <span>{{row.totalUsers}}</span>
            <Icon type="ios-arrow-round-up" v-if='row.usersWave==1' color='#f00' size='20'/>
            <Icon type="ios-arrow-round-down" v-if='row.usersWave==2' color='#1baf2e' size='20'/>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="notCheckNumber">
          <div @click="handleSeeInfo(row.id)" style="cursor: pointer;font-weight: 600;color: #2F54EB;" v-if='row.notCheckNumber>0'>
            <span>{{row.notCheckNumber}}</span>
          </div>
          <div style="font-weight: 600;color: #2F54EB;" v-else><span>{{row.notCheckNumber}}</span>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="checkRate">
          <div>
            <span>{{row.checkRate}}</span>
            <Icon type="ios-arrow-round-up" v-if='row.checkRateWave==1' color='#f00' size='20'/>
            <Icon type="ios-arrow-round-down" v-if='row.checkRateWave==2' color='#1baf2e' size='20'/>
          </div>
        </template>
      </Table>
      <div class="pageMain conPageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
      </div>
    </div>
    <userInfo v-if='closeInfo' @closeInfo='closeInfoMethod'
      :infoId='infoId'></userInfo>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
  import userInfo from './userInfo';
	export default {
		name: 'securitycheck',
    components:{
    	userInfo
    },
		data() {
			return {
        infoId:'',
        closeInfo:false,
        dateSwitch:3,
				endTime:'',
				startTime:'',
				queryType:3,
				statDate:'',
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
						title: '员工姓名',
						key: 'staffName',
						minWidth: 160,
						align: 'center'
					},
					{
						title: '安检数量',
						key: 'checkUsers',
						minWidth: 110,
						align: 'center'
					},

					{
						title: '未安检数量',
						key: 'notCheckNumber',
						minWidth: 110,
						align: 'center',
            slot:'notCheckNumber'
					},

					{
						title: '责任用户数',
						key: 'totalUsers',
						minWidth: 110,
						align: 'center',
            slot:'totalUsers',
            // sortable: true
					},
					{
						title: '安检率',
						key: 'checkRate',
						minWidth: 110,
						align: 'center',
            slot:'checkRate',
            // sortable: true
					},
					{
						title: '安检月份',
						key: 'statDate',
						minWidth: 120,
						align: 'center'
					},
				]
			}
		},
		methods: {
			 handleExport(){
        //导出 	 ?deptId=${this.userData.deptId}
      window.location.href=`${pathUrls.securityCheckStatExport}?deptId=${this.organize?this.organize:this.userData.deptId}&queryType=${this.dateSwitch}&statDate=${this.statDate}`;
      },
      //查看详情
      			handleSeeInfo(v){
      				this.infoId=v;
      				this.closeInfo=true;
      //				this.$router.push('/clientManage/userInfo/'+v);
      			},
      			//关闭详情
      			closeInfoMethod(data){
      				this.closeInfo=data;
      			},
        dateSwitchChange(v){
            this.statDate='';
            if(v==3){
              this.columns[this.columns.length-1].title='安检月份';
              this.statDate=this.common.getYearMonth();
            }else{
              this.columns[this.columns.length-1].title='安检日期';
              this.statDate=this.common.getDayDate(1,false);
            }
            this.curpage = 1;
            this.getSecurityOrderStat();
        },
	    //改变结束时间
	      changeStatDate(v) {
	      		this.statDate = v;
	      	},
	      	getSecurityOrderStat() {
	      		this.loading = true;
            if(this.dateSwitch==3){
              this.statDate=this.statDate?this.common.conformatDat(this.statDate,false,1):'';
            }else{
              this.statDate=this.statDate?this.common.conformatDat(this.statDate):'';
            }
	      		_http.http2("post", pathUrls.securityOrderStat, {
              page: this.curpage,
              limit: this.pagesSize,
              deptId: this.organize,
		       		queryType:this.dateSwitch,
		       		statDate:this.statDate
				}).then((res) => {
					this.loading = false;
					if(res.code == 0) {
						if(res.data&&res.data.list){
							for(let [item, index] of new Map(res.data.list.map((item, i) => [item, i]))) {
							item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);
						}
							this.dataList = res.data.list;
						}

						this.count = res.data.count;

						if(this.dataList.length >10) {
							this.tableHeight = this.screeHeight - 210;
						} else {
							this.tableHeight = 'auto';
						}
					}

				}).catch(() => {
					this.loading = false;
				})
			},


			//改变页数
			pageChange(current) {
				this.curpage = current;
				this.getSecurityOrderStat();

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.curpage = 1;
				this.getSecurityOrderStat();

			},

			//查询
			handleSearch() {
				this.curpage = 1;
				this.getSecurityOrderStat();
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
			this.getSecurityOrderStat();
		},

		mounted() {
      this.statDate=this.common.getYearMonth();
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
    position: relative;
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
    padding:0 10px 10px;
  }

  .conWrapper>>>.ivu-form-item-content {
    margin-left: 10px !important;
  }

  .pageMain {
    text-align: left;
    margin-top: 10px;
    padding-left: 10px;
    display: flex;
  }
  .switchForm>>>.ivu-form-item-content{
    margin-left: 10px!important;
  }
  .defaultInfo {
  		width: 330px;
  		text-align: left;
  		padding-left: 5px;
  		height: 24px;
  		line-height: 24px;
  		font-size: 12px;
  		background: #EF8920;
  		color: #fff;
  		box-shadow: 0px 2px 2px #c8c8c8;
      margin-bottom: 6px;
  	}
</style>
