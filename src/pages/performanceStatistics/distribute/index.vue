<template>
  <div class="main">
    <div class="mainTop">
      <Form :model="formSearch" inline :label-width="70">
        <FormItem label="所属组织">
          <Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format"
            style="width:220px"></Cascader>
        </FormItem>
        <!-- <FormItem label="时间">
          <DatePicker format="yyyy-MM-dd" v-model='dateTime' @on-change='changeDate' type="daterange" placement="bottom"
            placeholder="Select date" style="width: 220px"></DatePicker>
        </FormItem> -->
		<FormItem label="开始时间">
		  <DatePicker style='width: 170px;' type="date" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd"
		    @on-change='changeStartTime'></DatePicker>
		</FormItem>
		<FormItem label="结束时间">
		  <DatePicker style='width: 170px;' type="date" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd"
		    @on-change='changeEndTime'></DatePicker>
		</FormItem>
        <FormItem>
          <Button type="primary" @click='handleSearch' style="margin-right: 20px;">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading="loading" show-summary :summary-method="handleSummary"
        highlight-row :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="totalfYsp">
          <span style="font-weight: 600;">{{row.totalfYsp}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="totaleYsp">
          <span style="font-weight: 600;">{{row.totaleYsp}}</span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'newDistribute',
		data(){
			return{
        totalRecyclingRation:'',
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				startTime:'',
				endTime:'',
				dateTime:[],
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch:{
					organize:''
				},
				options:[],
				dataList:[],
				loading:false,
				columns:[{
						title: '序号',
						type: 'index',
						width: 65,
						align: 'center',
					},{
						title: '配送员姓名',
						minWidth:80,
						align: 'center',
						key: 'staffName',
					},{
						title: '配送员工号',
						minWidth:80,
						align: 'center',
						key: 'staffWorkCode',
					},{
						title: '所属组织',
						align: 'center',
						key: 'deptName',
						minWidth:120
					},{
						title: 'YSP35.5',
						key: 'ysp35',
						align: 'center',
						children:[{
							title: '配送',
							key: 'fullYSP35',
							align: 'center',
							width:70
						},{
							title: '回收',
							key: 'emptyYSP35',
							align: 'center',
							width:70
						}]
					}, {
						title: 'YSP118',
						align: 'center',
						key: 'ysp118',
						children:[{
							title: '配送',
							key: 'fullYSP118',
							align: 'center',
							width:70
						},{
							title: '回收',
							key: 'emptyYSP118',
							align: 'center',
							width:70
						}]
					}, {
						title: 'YSP118-2',
						align: 'center',
						key: 'ysp118',
						children:[{
							title: '配送',
							key: 'fullYSP1182',
							align: 'center',
							width:70
						},{
							title: '回收',
							key: 'emptyYSP1182',
							align: 'center',
							width:70
						}]
					},{
						title: '其他',
						align: 'center',
						key: 'other',
						children:[{
							title: '配送',
							key: 'fullOTHER',
							align: 'center',
							width:70
						},{
							title: '回收',
							key: 'emptyOTHER',
							align: 'center',
							width:70
						}]
					},{
						title: '合计',
						align: 'center',
						key: 'totalYsp',

						children:[{
							title: '配送',
							key: 'totalfYsp',
							align: 'center',
							slot:'totalfYsp',
							width:70
						},{
							title: '回收',
							key: 'totaleYsp',
							align: 'center',
							slot:'totaleYsp',
							width:70
						}]
					},{
						title: '回收率',
						align: 'center',
						key: 'recyclingRation',
						width:90
					}
     //      {
					// 	title: '参考比率',
					// 	align: 'center',
					// 	key: '',
					// 	children:[{
					// 		title: '配送',
					// 		key: 'totalYsp',
					// 		align: 'center',
					// 		width:60
					// 	},{
					// 		title: '回收',
					// 		key: 'totalYsp',
					// 		align: 'center',
					// 		width:60
					// 	}]
					// },{
					// 	title: '实际比率',
					// 	align: 'center',
					// 	key: '',
					// 	children:[{
					// 		title: '配送',
					// 		key: 'totalYsp',
					// 		align: 'center',
					// 		width:60
					// 	},{
					// 		title: '回收',
					// 		key: 'totalYsp',
					// 		align: 'center',
					// 		width:60
					// 	}]

					// },
          ]
			}
		},
		methods:{
			//改变起始时间
			  changeEndTime(v){
			      this.endTime=v;
			  },
			//改变结束时间
			  changeStartTime(v){
			      this.startTime=v;
			  },
			handleSummary ({ columns, data }) {
                const sums = {};
                columns.forEach((column, index) => {

                    const key = column.key;
                    if (index === 0) {
                        sums[key] = {
                            key,
                            value: '总计'
                        };
                        return;
                    }
                    if (index === 1||index === 2||index === 3) {
                        sums[key] = {
                            key,
                            value: ''
                        };
                        return;
                    }
                    if (index === 14) {
                        sums[key] = {
                            key,
                            value:this.totalRecyclingRation
                        };
                        return;
                    }
                    const values = data.map(item => Number(item[key]));
                    if (!values.every(value => isNaN(value))) {
                        const v = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[key] = {
                            key,
                            value: v
                        };
                    } else {
                        sums[key] = {
                            key,
                            value: ''
                        };
                    }
                });

                return sums;
            },
			getDeliveryRecyclingBottleNum(){
					this.loading = true
					this.dataList=[];


				_http.http1('post', pathUrls.deliveryRecyclingBottleNum, {
					// 'bottleType':1,
					'deptId':this.formSearch.organize,
					'startTime':this.startTime?(this.common.conformatDat(this.startTime)+' 00:00:00'):'',
					 'endTime': this.endTime?(this.common.conformatDat(this.endTime)+' 23:59:59'):'',
				}, 'form').then((res) => {
					this.loading=false;
					for(let item of res.data){
						item.totaleYsp=item.emptyYSP35+item.emptyYSP118+item.emptyYSP1182+item.emptyOTHER;
            item.totalfYsp=item.fullYSP35+item.fullYSP118+item.fullYSP1182+item.fullOTHER;
						// item.newxysp35=item.ysp35+'/'+item.xysp35;
						// item.newxysp118=item.ysp118+'/'+item.xysp118;
						// item.newxother=item.other+'/'+item.xother;
					}
          this.totalRecyclingRation=res.totalRecyclingRation;
					this.dataList=res.data;
					if(this.dataList.length){
						this.tableHeight=this.dataList.length*45<(this.screeHeight-190)?this.dataList.length*45+39:this.screeHeight-190;
					}else{
						this.tableHeight=0;
					}

				})
			},
			changeDate(v){
				if(v[0]){
					let newDates=[v[0]+' '+'00:00',v[1]+' '+'23:59']
					this.startTime=v[0]+' '+'00:00';
					this.endTime=v[1]+' '+'23:59';
				}else{

					this.startTime='';
					this.endTime='';
				}
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
					this.formSearch.organize = value[value.length - 1];

				} else {
					this.formSearch.organize = '';

				}

			},
			handleSearch(){
				this.getDeliveryRecyclingBottleNum();
			}
		},
		mounted(){

			this.dateTime=this.common.getStartEndTime();
			this.startTime=`${this.dateTime[0]}`;
			this.endTime=`${this.dateTime[1]}`;
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
			this.getDeliveryRecyclingBottleNum();
		}
	}
</script>

<style type="text/css" scoped>
  .main {
    margin-right: 10px;
    min-height: calc(100% - 10px);
    background: #fff;

  }

  .mainTop {
    padding: 10px;
    width: 100%;
    text-align: left;
  }

  .mainTop>>>.ivu-form-item {
    margin-bottom: 0px;
  }

  .mainContent {
    background: #fff;
    border-radius: 4px;
    padding: 0 10px 10px;
  }

  .mainContent>>>td {
    height: 45px;
    border-bottom: 1px solid #e8eaec !important;
  }

  .pageMain {
    text-align: left;
    margin-top: 10px;
    padding-left: 10px;
    display: flex;
  }

  .mainContent>>>.ivu-table th {
    background: #E2EEFF;
    color: #51B5EA;
    border-color: #f3f3f3;
  }

  .mainTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
  }

  .mainContent>>>th .ivu-table-cell {
    padding: 0 9px;
  }

  .mainContent>>>.ivu-table-summary {
    font-weight: 600 !important;
  }

  .mainContent>>>.ivu-table-cell {
    padding: 0 5px;
  }

  .mainContent>>>.ivu-table-with-summary div:nth-child(3) {
    margin-right: 16px;
  }
</style>
