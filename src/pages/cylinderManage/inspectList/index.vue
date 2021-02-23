<template>
	<div class="main conMain">
		<div class='mainTop'>
			<Form :model="formSearch" inline :label-width="96">

				<FormItem label="电子标签编码">
					<Input v-model="bottleNfcId" style="width:170px" placeholder='电子标签编码' @on-keyup="bottleNfcId=bottleNfcId.replace(/\s+/g,'')"/>
				</FormItem>
				<FormItem label="钢瓶条码">
					<Input v-model="bottleCode" style="width:170px" placeholder='钢瓶条码' @on-keyup="bottleCode=bottleCode.replace(/\s+/g,'')"/>
				</FormItem>
				<!--<FormItem label="送检人">
					<Input v-model="sysUserName" style="width:170px" placeholder='送检人' />
				</FormItem>
				<FormItem label="检测站">
					<Input v-model="checkDeptName" style="width:170px" placeholder='检测站' />
				</FormItem>-->
				<FormItem label="送检开始时间">
					<DatePicker style='width: 170px;' type="datetime" placeholder="送检开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss" @on-change='changeStartTime'></DatePicker>
				</FormItem>
				<FormItem label="送检结束时间">
					<DatePicker style='width: 170px;' type="datetime" placeholder="送检结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss" @on-change='changeEndTime'></DatePicker>
				</FormItem>
				<FormItem>
					<Button type="primary" @click='handleSearch'>查询</Button>
					<Upload :action="fileUrl" style='display: inline-block;' :show-upload-list='false' :on-success='importSuccess'
					:headers="{'Authorization':'Bearer_'+token}" :on-error='importError'>
						<Button type="warning" v-has='"inspectList-import"' style="margin:0 20px;">导入</Button>
          </Upload>
          <Button type="success" @click='handleSave' v-has='"inspectList-save"'>新增</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading="loading" highlight-row :height='tableHeight'>

			</Table>
			<div class="pageMain">
				<Page  :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
			</div>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default {
		name: 'inspectList',
		components: {
			cylInfo,
		},
		data() {
			return {
				token:(this.$store.state.token),
        fileUrl: pathUrls.checkBottleBatchImport,
				checkDeptName: '',
				sysUserName: '',
				bottleCode: '',
				bottleNfcId: '',
				startTime: '',
				endTime: '',
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				tags: '',
				infoSee: false,
				sizeOpts: [10, 20, 50, 100, 200],
				pagesSize:10,
				curpage:1,
				count:0,
				dataList: [],
				loading: false,
				formSearch: {
					checkStatus: null
				},
				columns: [
          {
          	title: '钢瓶条码',
          	key: 'bottleCode',
          	align: 'center',
            minWidth: 200,
            fixed:'left',
          	render: (h, params) => {
          		let that = this
          		return h('span', {
          			style: {
          				color: '#1BA060',
          				cursor: 'pointer'
          			},
          			on: {
          				click() {
          					if(params.row.bottleNfcId) {
          						that.infoSee = true
          						that.tags = params.row.bottleNfcId
          					} else {
          						that.infoSee = true
          						that.tags = params.row.bottleCode
          					}

          				}
          			}
          		}, params.row.bottleCode);
          	},

          },
					{
						//						bottleNfcId
						title: '钢瓶电子标签码',
						key: 'bottleNfcId',
						align: 'center',
            minWidth: 200,

						render: (h, params) => {
							let that = this
							return h('span', {
								style: {
									color: '#EE6515',
									cursor: 'pointer'
								},
								on: {
									click() {
										that.infoSee = true
										that.tags = params.row.bottleNfcId
										//										console.log(that.tags)
									}
								}
							}, params.row.bottleNfcId);
						},

					},

          {
          	title: '出厂编号',
          	key: 'bottleFactoryCode',
          	minWidth: 200,
          	align: 'center',

          },

          {
          	title: '钢瓶规格',
          	key: 'bottleSpecification',
          	minWidth: 120,
          	align: 'center'
          },
          {
          	title: '检测状态',
          	key: 'newCheckStatus',
          	align: 'center',
          	minWidth:120
          },
          // {
          // 	title: '送检站点',
          // 	key: 'deptName',
          // 	align: 'center',
          // 	minWidth:300
          // },
          {
          	title: '送检时间',
          	key: 'checkTime',
            minWidth: 180,
          	align: 'center',
          },
					{
						title: '送检人',
						key: 'staffName',
						align: 'center',
            minWidth: 200,
					},
          {
          	title: '接收人',
          	key: 'receiverName',
          	align: 'center',
            minWidth: 200,
          },
          {
          	title: '接收人车牌号',
          	key: 'receiverCarNumber',
          	align: 'center',
            minWidth: 200,
          },
          {
          	title: '气站',
          	key: 'receiverStation',
          	align: 'center',
            minWidth:300,
          },

					{
						title: '创建时间',
						key: 'createTime',
						align: 'center',
            minWidth: 180,
					},

          // {
          // 		title: '检验状态',
          // 		key: 'checkStatusName',
          // 		align: 'center',
          // 		tooltip: true,
          // 		minWidth: 120,
          // 	},
            {
            	title: '下次检验日期',
            	key: 'bottleNextCheckTime',
            	minWidth: 180,
            	align: 'center'
            },
            {
            	title: '制造单位',
            	key: 'bottleManufacturer',
            	minWidth: 300,
            	align: 'center'
            },

            {
            	title: '制造年月',
            	key: 'bottleFactoryTime',
            	minWidth: 180,
            	align: 'center'
            },
				]

			}
		},
		methods: {
      importError(error, file, fileList){
        	this.$Message['warning']({
        		background: true,
        		content: error.msg,
        	});

      },
      //新增
      handleSave(){
          this.$router.push('/inspectList/bottleCheckAdd')
      },
      //导入
			importSuccess(response, file, fileList){

				if(response.code==0){
					this.$Message['success']({
						background: true,
						content: '导入成功!',
						onClose: (() => {
								this.getPlatformbottlechecklog()
							})
		  	});

			}
      if(response.code==500){
      		this.$Message['warning']({
      			background: true,
      			content:response.msg,
      	});

      }

      },
			handleSearch(){
        this.curpage=1;
				this.getPlatformbottlechecklog()
			},
			//改变结束时间
			changeEndTime(v) {
				if(v) {
					let ends = v.substring(v.length - 8);
					let starts = v.substring(0, 11);
					if(ends == '00:00:00') {
						this.endTime = starts + '23:59:59';
					} else {
						this.endTime = v;
					}
				}
			},
			//改变起始时间
			changeStartTime(v) {
				this.startTime = v;

			},
			getPlatformbottlechecklog() {
				this.loading = true
				this.dataList = [];
				// this.count = 0;
				_http.http1('post', pathUrls.platformbottlechecklist, {
					'pageSize': this.curpage,
					"pageNum": this.pagesSize,
					"startTime": this.startTime ? (this.common.conformatDat(this.startTime, true)) : '',
					"endTime": this.endTime ? (this.common.conformatDat(this.endTime, true)) : '',
					"bottleNfcId":this.bottleNfcId,
					"bottleCode":this.bottleCode
				},'form').then((res) => {
					this.loading = false;
					if(res.code == 0) {
						if(res.data.list) {
							for(let item of res.data.list) {
                if(item.checkStatus==1){
                  item.newCheckStatus='送检';
                }
                else if(item.checkStatus==2){
                  item.newCheckStatus='已检';
                }

								if(item.bottleCheckStatus == 1) {
									item.checkStatusName = '超期待检';
								} else if(item.bottleCheckStatus == 2) {
									item.checkStatusName = '送检';
								} else if(item.bottleCheckStatus == 4) {
									item.checkStatusName = '即将到期';
								}
							}
						}
            this.count = res.data.totalCount;
						this.dataList = res.data.list;


						if(this.dataList.length > 10) {
							this.tableHeight = this.screeHeight - 230;
						} else {
							this.tableHeight = 'auto'
						}
					}
				})
			},
			//查看钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},
			//页数改变
			pageChange(current) {
				this.curpage = current
				this.getPlatformbottlechecklog()

			},
			//条数改变
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
        this.curpage=1;
				this.getPlatformbottlechecklog();

			},
		},
    activated() {

    		this.getPlatformbottlechecklog();
      },
		mounted() {

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
		margin-bottom: 4px;
	}

	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 0 10px 20px;
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
</style>
