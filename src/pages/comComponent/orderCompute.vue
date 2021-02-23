<template>
	<div class="bottleMain">
		<div class="bottleContent">
			<div class="topTitle">
				<h3>订单计算存瓶详情</h3>
			</div>
			<div class="closeBtn" @click='handleClose'>
				<Icon type="md-close" />
			</div>
			<div class="tableContent">
				<Table :columns="columns" :data="orderCountBottles" :height="tableHeight" :loading='loading' :rowClassName="rowClassName" highlight-row>

				</Table>
				<div class="colorMain">
					<div><span style="background:#21b921;" class="colorItem"></span><span>正常</span></div>
					<div><span style="background:#9c9c9c;" class="colorItem"></span><span>异常出库</span></div>
					<!--<div><span style="background:#F29100;" class="colorItem"></span><span>无档瓶配送</span></div>-->
					<div><span style="background:#f00;" class="colorItem"></span><span>异常入库</span></div>
				</div>
			</div>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
	</div>
</template>

<script>
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default {
		name: 'orderCompute',
		components: {
			cylInfo
		},
		props: {
			orderCountBottles: Array
		},
		data() {
			return {
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				tags: '',
				infoSee: false,
				tableHeight: 'auto',
				columns: [{
						title: '序号',
						key: 'index',
						type: 'index',
						width: 80,
						align: 'center',
						fixed: 'left'
					},
					{
						title: '电子标签编码',
						key: 'bottleTag',
						minWidth: 250,
						align: 'center',
						render: (h, params) => {
							let that = this
							return h('span', {
								style: {
//									color: '#EE6515',
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
//									color: '#1BA060',
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
						title: '钢瓶规格',
						key: 'bottleSpec',
						align: 'center',
						minWidth: 140
					},
					{
						title: '入库时间',
						key: 'createTime',
						align: 'center',
						minWidth: 180
					},

					{
						title: '异常发生时间',
						key: 'statusUpdateTime',
						align: 'center',
						minWidth: 180
					},
					
					{
						title: '异常内容',
						key: 'remarks',
						align: 'center',
						minWidth: 200
					},
					
					{
						title: '业务状态',
						key: 'businessStatusName',
						align: 'center',
						minWidth: 150,
						fixed: 'right'
					},

				]
			}
		},
		methods: {
			//添加行class
			rowClassName(row, index) {
				if(row.businessStatus == 1) {
					return 'greenClass'
				} else if(row.businessStatus == 2) {
					return 'greyClass'
				} else if(row.businessStatus == 3) {
					return 'orangeClass'
				} else if(row.businessStatus == 4) {
					return 'redClass'
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
			if(this.orderCountBottles.length > 10) {
				this.tableHeight = this.screeHeight - 150;
			} else {
				this.tableHeight = 'auto';
			}

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
		height: 40px;
		line-height: 40px;
	}
	
	.topTitle h3 {
		font-size: 14px;
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
	
	.tableContent {
		padding: 0 20px;
	}
	/*.tableContent>>>th {
		font-size: 12px;
		padding: 4px 0;
	}*/
	
	.tableContent>>>td {
		height: 40px;
		/*font-size: 12px;*/
	}
	
	.tableContent>>>.ivu-table .greenClass td {
		color: #21b921;
	}
	
	.tableContent>>>.ivu-table .greyClass td {
		color: #9c9c9c;
	}
	
	.tableContent>>>.ivu-table .orangeClass td {
		color: #F29100;
	}
	
	.tableContent>>>.ivu-table .redClass td {
		color: #f00;
	}
	
	.searchForm>>>.ivu-form-item-content {
		margin-left: 10px !important;
	}
	.colorMain{
		height: 26px;
		line-height: 26px;
		display: flex;
		justify-content: flex-end;
	}
	.colorMain div{
		margin: 0 15px;
	}
	.colorItem{
		width: 20px;
		height: 10px;
		display: inline-block;
		margin-right:5px;
	}
</style>