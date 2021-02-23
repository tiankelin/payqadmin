<template>
	<div class="main conMain">
		<div class="mainTop">
			<Button type="success" @click='handleAdd' v-has='936'>新增</Button>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading' ref="table">
				<template slot-scope="{ row, index }" slot="action">
					<Button type="primary" size="small" style="margin-right:10px" @click="handleAllocate(row.goodsId)" v-has='939'>分配</Button>
					<Button type="info" size="small" style="margin-right:10px" @click="handleEdit(row.goodsId)" v-has='937'>编辑</Button>
					<Button type="error" size="small" @click="remove(row.goodsId)" v-has='938'>删除</Button>
				</template>
			</Table>
			<!--<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
			</div>-->
		</div>	
		
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		name: 'commodityInfo',
		data() {
			return {					
				count: 0,
				curpage: 1,
				pagesSize: 10,
				loading: false,
				dataList: [],
				columns: [{
						title: '商品品类',
						key: 'newType',
						align: 'center',
						width:120
					},
					{
						title: '商品名称',
						key: 'goodsName',
						align: 'center',
						tooltip: true
					},
					{
						title: '商品规格',
						key: 'spec',
						align: 'center',
						tooltip: true
					},
					{
						title: '客户类型',
						key: 'userTypeName',
						align: 'center',						
					},
					{
						title: '默认单价',
						key: 'unitPrice',
						align: 'center',
						width: 95
					}, {
						title: '创建时间',
						key: 'createTime',
						align: 'center',
					}, {
						title: '更新时间',
						key: 'updateTime',
						align: 'center',

					}, {
						title: '操作',
						slot: 'action',
						width: 200,
						align: 'center'
					}
				]
			}
		},
		methods: {
			//分配
			handleAllocate(id) {
				this.$router.push('/commodityInfo/commodityAllocate' + '/' + id);
			},
			//获取商品信息列表
			getUserTypeList() {
				this.loading = true
				_http.http1('post', pathUrls.deptgoodsList, {
					page: 1,
					limit: 10000,					
				}, 'form').then((res) => {
					this.loading = false;

					if(res.code == 0) {
						let arrs = [];
						for(let item of res.data) {
							if(item.goodsType == 1) {
								item.newType = '液化石油气'
							} else if(item.goodsType == 2) {
								item.newType = '其他'
							}
							
							if(item.userTypeName) {
								arrs.push(item)
							}else{
								item.userTypeName='--'
							}
						}
						this.dataList = res.data;
						if(arrs.length == 0) {
							this.columns.splice(3, 1)
						}
						this.count = res.count;
					}

				})
			},
			//新增
			handleAdd() {
				this.$router.push('/commodityInfo/commodityAdd');
			},
			//编辑
			handleEdit(id) {
				this.$router.push('/commodityInfo/commodityEdit' + '/' + id);
			},
			//删除
			remove(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.deptgoodsDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getUserTypeList();
									})
								});

							}

						})
					},

				});
			},
			//改变页数
			pageChange(current) {
				this.curpage = current
				this.loading = true;
				this.getUserTypeList()
			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.loading = true;
				this.getUserTypeList()
			},
		},
		mounted() {
			this.getUserTypeList()
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		background: #fff;
		margin-right: 10px;
		min-height: calc(100% - 10px);
		padding: 0 10px 10px;
	}
	
	.mainTop {
		height: 48px;
		line-height: 48px;
		text-align: right;
		vertical-align: middle;
		padding-right: 50px;
		margin-bottom: 10px;
	}
	
	.mainContent>>>td {
		height: 40px;
	}
	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	
	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
	}
</style>