<template>
	<div class="main conMain">
		<div class='mainTop'>
			<Form :model="formSearch" inline :label-width="75">
				<FormItem label="检测状态">
					<Select v-model="formSearch.checkStatus" style="width:186px" clearable placeholder="请选择钢瓶检测状态">
						<Option :value="1">超期待检</Option>
						<!--<Option :value="2">送检</Option>
						<Option :value="3">已检</Option>-->
						<Option :value="4">即将到期</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Button type="primary" @click='handleSearch' style="margin-right: 20px;">查询</Button>
					<Button type="warning"  style="margin-right: 20px;" @click='handSendInspect' v-has='996'>批量送检</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading="loading"  @on-select="handleSelectRow" @on-select-cancel="handleCancelRow"

			@on-select-all="handleSelectAll" @on-select-all-cancel="handleSelectAll" ref="purchaseTable" highlight-row :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="action">
					<Button type="warning" size='small' @click='handleSendEve(row)' v-has='996'>送检</Button>
				</template>
			</Table>
			<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
       			 <div style="line-height: 26px;margin-left: 20px;color: #0014ff;" v-if='selectedSum'>已选中<span style="color: #FF0000;font-weight: 600;">{{selectedSum}}</span>项</div>
      </div>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
		<cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>
		<sendInspection v-if='inspectShow' @inspectShow='inspectShowMethods' :inspectData='inspectData' @inspectShowUpdate='updateMethods'> </sendInspection>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	import cylMap from '@/pages/comComponent/cylMaps';
	import sendInspection from './sendInspection';
	export default{
		name:'checkReminder',
		components: {
			cylInfo,
			cylMap,
			sendInspection
		},
		data(){
			return{
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
		        selectedIds: new Set(),//选中的合并项的id
		        selectedSum: 0, //选中的总数量
				newSelectData:[],
				inspectData:[],
				inspectShow:false,
				sizeOpts: [10, 20, 50, 100, 200],
				formSearch:{
					checkStatus:null
				},
				pagesSize: 10,
				curpage: 1,
				count: 0,
				dataList:[],
				loading:false,
				langs:'',
				lats:'',
				addressInfo:false,
				tags:'',
				infoSee: false,
				columns:[
//				{
//						title: '位置',
//						key: 'carType',
//						align: 'center',
//						fixed:'left',
//						width: '75',
//						render: (h, params) => {
//							let that=this
//							return h('img', {
//								attrs: {
//									src: params.row.carType
//								},
//								style: {
//									cursor:'pointer'
//								},
//										on:{
//									click(){
//										that.langs=params.row.lng
//										that.lats=params.row.lat
//										that.addressInfo=true
//									}
//								}
//							}, params.row.carType);
//
//						}
//
//					},
					{
						type: 'selection',
						width: 60,
						align: 'center',
						slot: 'selection',
						
					},
					{
						title: '检测状态',
						key: 'checkStatusName',
						align: 'center',
						tooltip:true
					},
					{
//						bottleTag
						title: '电子标签编码',
						key: 'bottleNfcId',
						 width:140,
						align: 'center',
						render: (h, params) => {
							let that=this
							return h('span', {
								style: {
									color: '#EE6515',
									cursor: 'pointer'
								},
								on:{
									click(){
										that.infoSee=true
										that.tags=params.row.bottleNfcId
//										console.log(that.tags)
									}
								}
							}, params.row.bottleNfcId);
						},

					},
					{
						title: '钢瓶条码',
						key: 'bottleCode',
						align: 'center',
						render: (h, params) => {
							let that=this
							return h('span', {
								style: {
									color: '#1BA060',
									cursor: 'pointer'
								},
									on:{
									click(){
										if(params.row.bottleNfcId){
										that.infoSee=true
										that.tags=params.row.bottleNfcId
										}else{
										that.infoSee=true
										that.tags=params.row.bottleCode
										}


									}
								}
							}, params.row.bottleCode);
						},

					},
					{
						title: '责任人',
						key: 'personLiableName',
						align: 'center',
						tooltip:true

					},
					{
						title: '联系方式',
						key: 'phone',
						align: 'center',

					},
					{
						title: '当前地址',
						key: 'address',
						align: 'center',
						width: 220,
						tooltip:true
					},
					{
						title: '流转类型',
						key: 'flowTypeName',
						align: 'center',

					},
//					{
//						title: '操作',
//						slot: 'action',
//						fixed: 'right',
//						width: 120,
//						align: 'center'
//					}
				]

			}
		},
		methods:{
      // cy 全选和取消全选时触发
      handleSelectAll (selection) {
        // 取消全选 数组为空
        if (selection.length === 0) {
          // cy 若取消全选，删除保存在selectedIds里和当前table数据的id一致的数据，达到，当前页取消全选的效果
          // 当前页的table数据
          let data = this.$refs.purchaseTable.data

          data.forEach((item) => {
            if (this.selectedIds.has(item.bottleCode)) {
              this.selectedIds.delete(item.bottleCode)
            }
          })
        } else {
          selection.forEach(item => {
            this.selectedIds.add(item.bottleCode)
          })
        }
        //同步
        this.selectedSum = this.selectedIds.size
         // console.log(this.selectedIds)
      },

      //  选中某一行
      handleSelectRow (selection,row) {
        this.selectedIds.add(row.bottleCode)
         this.selectedSum = this.selectedIds.size
      },
      //  取消某一行
      handleCancelRow (selection,row) {
        this.selectedIds.delete(row.bottleCode)
         this.selectedSum = this.selectedIds.size
      },
      setChecked () {
        // 找到绑定的table的ref对应的dom，找到table的objData对象，objData保存的是当前页的数据
        let objData = this.$refs.purchaseTable.objData
        // console.log(objData)
        for (let index in objData) {
          // cy 设置审批状态为拒绝的采购单的默认勾选状态为 禁止
          // if (objData[index].bottleCode === '3057333334') {
          //   objData[index]._isDisabled = true
          // }
          if (this.selectedIds.has(objData[index].bottleCode)) {
            // console.log(index,objData[index].bottleCode)

            // cy 弊端 每次切换select都会触发table的on-select事件
            // this.$refs.purchaseTable.toggleSelect(index) // 在保存选中的ids的set合集里找与当前页数据id一样的行，使用toggleSelect（index），将这一行选中
            // cy 改进
            objData[index]._isChecked = true

          }
        }
      },
			updateMethods(data){
				this.inspectShow=false;
				this.getExpiringSoonBottleList();
		        this.selectedIds.clear();
		        this.selectedSum=0;
			},
			//单个送检
			handleSendEve(row){
				this.inspectData=[row.bottleCode];
				this.inspectShow=true;
			},
			//关闭分配弹窗
			inspectShowMethods(data){
				this.inspectShow=data;

			},
			//批量送检
			handSendInspect(){

        let newSelectedIds=[...this.selectedIds];
         // console.log(newSelectedIds)
				if(newSelectedIds.length){
					this.inspectData=newSelectedIds;
					this.inspectShow=true;
				}else{
					this.$Message['warning']({
							background: true,
							content:"请先选择送检钢瓶!"
						});
				}

			},
			//获取选中项
			getSelected(v) {
				this.inspectData=v;
				this.newSelectData=v;
			},
			//查询
			handleSearch(){
				this.curpage=1;
				this.getExpiringSoonBottleList()
			},
			//获取待检列表
			getExpiringSoonBottleList(){
				this.loading = true
				this.dataList=[];
				_http.http1('post', pathUrls.ExpiringSoonBottleList, {
					'bottleCheckStatus':this.formSearch.checkStatus,
					'page': this.curpage,
					"limit": this.pagesSize,
				}, 'form').then((res) => {
					this.loading = false;
					if(res.code==0){
						if(res.data.list){
							for(let item of res.data.list) {
						if(item.flowType == 1) {
							item.flowTypeName = '在库';
						} else if(item.flowType == 2) {
							item.flowTypeName = '在途';
						} else if(item.flowType == 3) {
							item.flowTypeName = '在用';
						} else if(item.flowType == 4) {
							item.flowTypeName = '在途';
						} else if(item.flowType == 5) {
							item.flowTypeName = '在库';
						}
						if(item.bottleCheckStatus==1){
							item.checkStatusName='超期待检';
						}else if(item.bottleCheckStatus==4){
							item.checkStatusName='即将到期';
						}
					}
						}

						this.dataList=res.data.list;
						this.count = res.data.totalCount;
						if(this.dataList.length > 10) {
						if(this.screeHeight > 1050) {
							this.tableHeight = 750;
						} else if(this.screeHeight <= 1050 && this.screeHeight > 900) {
							this.tableHeight = 650;
						} else if(this.screeHeight <= 900 && this.screeHeight > 850) {
							this.tableHeight = 536;
						} else if(this.screeHeight <= 850) {
							this.tableHeight = 460;
						}
					} else {

						this.tableHeight = 40 * this.dataList.length + 56;
						if(!this.dataList.length){
							this.tableHeight=100
						}
					}

            setTimeout(()=>{
              this.setChecked ()
            },50)
					}
				})
			},
			//页数改变
			pageChange(current) {
				this.curpage = current

				this.getExpiringSoonBottleList()

			},
			//条数改变
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize

				this.getExpiringSoonBottleList()

			},
			//查看流转地图定位
			handleAdSee(data){
				this.addressInfo=data
			},
		//查看钢瓶详情
			handleSee(data){
				this.infoSee = data
			},
		},
		mounted(){
			this.getExpiringSoonBottleList()
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
		padding:0 10px 20px;
	}

	.mainContent>>>td {
		height: 40px;
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
	}
</style>
