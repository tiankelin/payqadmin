<template>
	<div class="bottleMain">
		<div class="bottleContent">
			<div class="topTitle">
				<h3>员工责任瓶详情</h3>
			</div>
			<div class="closeBtn" @click='handleClose'>
				<Icon type="md-close" />
			</div>
			<div class='contentTop'>
				<Form inline :label-width="96">
					<FormItem label="员工所属组织">
						<el-cascader filterable v-model="organize" :show-all-levels="false" :options="options" placeholder="所属组织" style='width: 150px;' clearable :props="{ checkStrictly: true }" @change='changeCascader' ></el-cascader>
					</FormItem>
					<FormItem label="责任人">
						<Input style='width: 150px;' placeholder='责任人' v-model='staffName' clearable/>
					</FormItem>
					<FormItem label="联系方式">
						<Input style='width: 150px;' placeholder='联系方式' v-model='staffPhone' clearable/>
					</FormItem>
					<FormItem label="工号">
						<Input style='width: 150px;' placeholder='工号' v-model='staffWorkCode' clearable/>
					</FormItem>
					<FormItem label="状态" placeholder='状态'>
						<Select clearable v-model='bottleIsFull' style='width: 150px;'>
							<Option :value='1'>重瓶</Option>
							<Option :value='0'>空瓶</Option>
						</Select>
					</FormItem>
					<FormItem label="停留时长>=">
						<InputNumber style='width: 120px;' placeholder='停留时长' v-model='stopTime' :min='0' />
						<span>小时</span>
					</FormItem>
					<!-- <FormItem label="商品名称">
						<Select clearable v-model='goodsId' placeholder='商品名称' style='width: 150px;' filterable>
							<Option v-for='item in goodsList' :key='item.goodsId' :value='item.goodsId'>{{item.goodsName}}</Option>
						</Select>
					</FormItem>
					<FormItem label="型号细分">
						<Select clearable v-model='goodsModel' placeholder='型号细分' style='width: 150px;' filterable>
							<Option v-for='item in goodsModelList' :key='item.id' :value='item.goodsModel'>{{item.goodsModel}}</Option>
						</Select>
					</FormItem> -->
					<FormItem label="电子标签码">
						<Input style='width: 150px;' placeholder='电子标签码' v-model='bottleTag' />
					</FormItem>
					<FormItem label="钢瓶条码">
						<Input style='width: 150px;' placeholder='钢瓶条码' v-model='bottleCode' />
					</FormItem>
					<FormItem label="异常状态">
						<Select clearable v-model='errStatus' style='width: 150px;' placeholder='异常状态'>
							<Option :value='1'>停留时间过长</Option>
						</Select>
					</FormItem>
					<FormItem label="气瓶类型">
						<Select  v-model='bottleType' style='width: 150px;' placeholder='气瓶类型'>
							<Option :value='0'>全部</Option>
							<Option :value='1'>标签瓶</Option>
							<Option :value='2'>非标签瓶</Option>
						</Select>
					</FormItem>
					<FormItem class='searchForm'>
						<Button type="info" @click='handleSearch'>查询</Button>
					</FormItem>
				</Form>
			</div>
			<div class="searchResult">
				<div><span>责任瓶</span><span style="color:#42C1F2;margin-left: 20px;">{{count}}</span></div>
				<div><span>责任重瓶</span><span style="color:#44BE71;margin-left: 20px;">{{fullCount}}</span></div>
				<div><span>责任空瓶</span><span style="color:#ED823A;margin-left: 20px;">{{emptyCount}}</span></div>
				<div><span>异常瓶</span><span style="color: #f00;margin-left: 20px;">{{errCount}}</span></div>
			</div>
			<div class="tableContent">
				<Table :columns="columns" :data="dataList" :height="tableHeight" :loading='loading' :rowClassName="rowClassName" highlight-row>
					<!-- <template slot-scope="{ row, index }" slot="orderCode">

            </template> -->
				</Table>
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
		name: 'cylinderTag',
		components: {
			cylInfo
		},
		props: {
			staffId: Number,
			staffInfo:Object
		},
		data() {
			return {
				bottleType:0,
				errCount: 0,
				emptyCount: 0,
				fullCount: 0,
				count: 0,
				goodsModel: '',
				goodsModelList: [],
				goodsId: '',
				goodsList: [],
				errStatus: null,
				bottleCode: '',
				bottleTag: '',
				stopTime: 0,
				bottleIsFull: null,
				staffWorkCode: '',
				staffPhone: '',
				organize: '',
				staffName: '',
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				tags: '',
				infoSee: false,
				tableHeight: 'auto',
				loading: false,
				dataList: [],
				columns: [{
						title: '序号',
						key: 'index',
						type: 'index',
						width: 80,
						align: 'center',
						fixed:'left'
					},
					{
						title: '员工所属组织',
						key: 'deptName',
						align: 'center',
						minWidth: 240
					},
					{
						title: '责任人',
						key: 'staffName',
						align: 'center',
						minWidth: 140
					},
					{
						title: '联系方式',
						key: 'staffPhone',
						align: 'center',
						minWidth: 140
					},
					{
						title: '工号',
						key: 'staffWorkCode',
						align: 'center',
						minWidth: 140
					},
					{
						title: '状态',
						key: 'newBottleIsFull',
						align: 'center',
						minWidth: 80
					},
					{
						title: '停留时长',
						key: 'stopTime',
						align: 'center',
						minWidth: 150
					},
					// {
					// 	title: '商品名称',
					// 	key: 'goodsName',
					// 	align: 'center',
					// 	minWidth: 140
					// },
					// {
					// 	title: '型号细分',
					// 	key: 'goodsModel',
					// 	align: 'center',
					// 	minWidth: 120
					// },
					{
						title: '电子标签编码',
						key: 'bottleTag',
						minWidth: 250,
						align: 'center',
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
										that.tags = params.row.bottleTag
									}
								}
							}, params.row.bottleTag);
						},
					},
					{
						title: '钢瓶条码',
						key: 'bottleCode',
						minWidth: 140,
						align: 'center',

						render: (h, params) => {
							let that = this
							return h('span', {
								style: {
									color: '#1BA060',
									cursor: 'pointer'
								},
								on: {
									click() {
										that.infoSee = true
										that.tags = params.row.bottleCode
									}
								}
							}, params.row.bottleCode);
						},
					},

					{
						title: '异常状态',
						key: 'errStatus',
						align: 'center',
						minWidth: 140
					},
				]
			}
		},
		methods: {
			handleSearch() {
				this.getQueryBottlesByStaffId();
			},
			//改变组织
			changeCascader(value) {
				if(value.length) {
					let id = value[value.length - 1];
					this.organize = id;

				} else {
					this.organize = null;

				}
        this.staffName='';
        this.staffPhone='';
        this.staffWorkCode='';

			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			//获取详情
			getQueryBottlesByStaffId() {
				this.loading = true;
				let fData={
//					staffId: this.staffId,
					deptId: this.organize,
					staffName: this.staffName,
					staffPhone: this.staffPhone,
					staffWorkCode: this.staffWorkCode,
					stopTime: this.stopTime?this.stopTime:0,
					bottleIsFull: this.bottleIsFull,
					goodsId: this.goodsId,
					goodsModel: this.goodsModel,
					bottleTag: this.bottleTag,
					bottleCode: this.bottleCode,
					errStatus: this.errStatus,
					bottleType:this.bottleType
				}
				// if(!fData.staffName&&!fData.staffPhone&&!fData.staffWorkCode){
				// 	fData.staffId=this.staffId
				// }
				_http.http2('post', pathUrls.queryBottlesByStaffId,fData).then((res) => {
					this.loading = false;
					this.dataList=[];
					if(res.code == 0) {
						this.dataList = res.data.bottleArr;
						for(let item of this.dataList) {
							item.newBottleIsFull = item.bottleIsFull ? '重瓶' : '空瓶';

						}
						if(this.dataList.length > 8) {
							let clientWidth=document.documentElement.clientWidth;
							if(clientWidth<1370){
								this.tableHeight = this.screeHeight - 330;
							}else{
								this.tableHeight = this.screeHeight - 300;
							}
						} else {
							this.tableHeight = 'auto';
						}
						this.count = res.data.count;
						this.fullCount = res.data.fullCount;
						this.emptyCount = res.data.emptyCount;
						this.errCount = res.data.errCount;
					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg
						});

					}

				}).catch(() => {
					this.loading = false;
				})
			},
			//添加行class
			rowClassName(row, index) {
				if(row.bottleIsFull == 1) {
					return 'thirdClass'
				} else if(row.bottleIsFull == 0) {
					return 'secondClass'
				} else {
					return 'firstClass'
				}
			},
			//关闭详情
			handleSee(data) {
				this.infoSee = data;
			},
			//查看钢瓶详情
			getBottleInfo(v) {
				this.tags = v;
				this.infoSee = true;
			},

			//关闭
			handleClose() {
				this.$emit('tagInfoSee', false);
			}
		},
		mounted() {
      this.bottleIsFull=this.staffInfo.bottleIsFull;
			this.organize=this.staffInfo.staffDeptId;
			this.staffName=this.staffInfo.staffName;
			this.staffPhone=this.staffInfo.staffAccount;
			this.staffWorkCode=this.staffInfo.staffWorkCode;
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data, 0, 0, 1)
			})
			// this.common.getGoodsList().then(res => {
			// 	this.goodsList = res.data;
			// })
			// this.common.getGoodsModelList().then(res => {
			// 	this.goodsModelList = res.data;
			// })
			this.getQueryBottlesByStaffId()
		}
	}
</script>

<style type="text/css" scoped>
	.bottleMain {
		position: fixed;
		left: 200px;
		top: 65px;
		right: 0px;
		background: rgba(0, 0, 0, .5);
		z-index: 500;
		height: calc(100vh - 65px);
	}

	.bottleContent {
		width: calc(100% - 10px);
		height: calc(100% - 10px);
		background: #fff;
		position: relative;
		text-align: left;
	}

	.topTitle {
		text-align: left;
		height: 30px;
		line-height: 30px;
	}

	.topTitle h3 {
		font-size: 12px;
		margin: 0 20px;
		font-weight: 600;
		color: #51B5EA;
		border-bottom: 1px solid #51B5EA;
	}

	.closeBtn {
		position: absolute;
		right: 20px;
		top: -8px;
		cursor: pointer;
		font-size: 30px;
		color: #1296db;
		font-weight: 600;
	}

	.contentTop {
		margin: 10px 20px 0 20px;
		border-bottom: 1px solid #51B5EA;
	}

	.bottleMain>>>.ivu-form-item {
		margin-bottom: 6px;
	}

	.searchResult {
		display: flex;
		margin: 5px 20px;
		border-bottom: 1px solid #51B5EA;
	}

	.searchResult div {
		width: 25%;
		font-weight: 600;
	}

	.tableContent {
		padding: 0 20px;
	}

	.tableContent>>>th {
		font-size: 12px;
		padding: 4px 0;
	}

	.tableContent>>>td {
		height: 32px;
		font-size: 12px;
	}

	.tableContent>>>.ivu-table .firstClass td {
		color: #F00;
	}

	.tableContent>>>.ivu-table .secondClass td {
		color: #ED823A;
	}

	.tableContent>>>.ivu-table .thirdClass td {
		color: #44BE71;
	}
	 .searchForm>>>.ivu-form-item-content {
      margin-left: 10px !important;
    }
</style>
