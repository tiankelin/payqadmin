<template>
	<div>
		<div style="text-align: right;position: absolute;right:45px;top:4px;z-index: 100;">
			<Button type="success" @click='handleAdd' style="height: 28px;line-height: 28px;" v-has='936'>商品新增</Button>
		</div>
		<Table border :columns="columns" :data="dataList" :loading='loading' ref="table" :height='tableHeight'>
			<template slot-scope="{ row, index }" slot="action">
				<!--<Button type="warning" size="small" @click="handleQuotedPrice(row)">报价</Button>-->
				<Button type="info" size="small" style="margin:0 10px" @click="handleEdit(row.goodsId)" v-has='937'>编辑</Button>
				<Button type="error" size="small" @click="remove(row.goodsId)" v-has='938'>删除</Button>
			</template>
		</Table>
		<!--<quotedPrice v-if='showPrice' @showPrice='showPriceClick' :rowData='rowData'></quotedPrice>-->
		<marketPrice v-if='showMarket' @showMarket='showMarketMethods' :rowData='rowData'></marketPrice>
	</div>

</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import quotedPrice from './quotedPrice';
	import marketPrice from './marketPrice';
	import Bus from '@/public/bus';
	export default {
		name: 'goodsList',
		components:{
			marketPrice
		},
		props:{
			tabsCheck:Number
		},
		data() {
			return {
        tableHeight:'auto',
        screeHeight: document.documentElement.clientHeight, // 屏幕高
				tabIndex:null,
				rowData:{},
				showMarket:false,
				loading: false,
				dataList: [],
				columns: [
					{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center'
					},
					{
						title: '商品名称',
						key: 'goodsName',
						align: 'center',
						tooltip: true
					},
//					{
//						title: '商品别名',
//						key: 'goodsAlias',
//						align: 'center',
//						tooltip: true
//					},
					{
						title: '商品分类',
						key: 'goodsTypeName',
						align: 'center',
						width: 120
					},
//					{
//						title: '商品规格',
//						key: 'goodsSpec',
//						align: 'center',
//						tooltip: true
//					},
					{
						title: '型号细分',
						key: 'goodsModelName',
						align: 'center',
						tooltip: true
					},
					{
						title: '营销渠道',
						key: 'newMarketChannel',
						align: 'center',
					},
					{
						title: '描述',
						key: 'goodsDesc',
						align: 'center',
					},

					{
						title: '操作',
						slot: 'action',
						width: 200,
						align: 'center'
					}
				],
				userData: (JSON.parse(this.$store.state.userData)),
			}
		},
		watch:{
			'tabsCheck':{
				handler(newTabs, oldTabs) {　
					this.tabIndex=newTabs;
					if(newTabs==2){
						this.getGoodsList()
					}
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			showMarketMethods(data){
				this.showMarket=data;

			},
			//报价
			handleQuotedPrice(row){
				this.showMarket=true;
				this.rowData=row;
			},
			//新增
			handleAdd() {
				this.$router.push('/commodityInfo/commodityAdd');
			},
			//编辑
			handleEdit(id) {
				this.$router.push('/commodityInfo/commodityEdit' + '/' + id);
			},
			//获取商品信息列表
			getGoodsList() {
					this.loading = true;
				_http.http1('post', pathUrls.deptgoodsList, {
				}, 'form').then((res) => {
					this.loading = false;
					if(res.code == 0) {
						for(let item of res.data){
							if(item.goodsAlias){
							item.newGoodsName=`${item.goodsName} (${item.goodsAlias})`;
							}else{
							item.newGoodsName=item.goodsName
							}
							if(item.marketChannel==1){
								item.newMarketChannel='呼叫中心'
							}
							else if(item.marketChannel==2){
								item.newMarketChannel='线上渠道'
							}

						}
						this.dataList = res.data;
            if(this.dataList.length>10){
            	this.tableHeight=this.screeHeight -160; 
            }else{
            	this.tableHeight='auto';
            }
					}

				})
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
										this.getGoodsList();
									})
								});

							}

						})
					},

				});
			},
		},
		activated() {
			if(this.tabIndex==2){
				this.getGoodsList()
			}

      },
		mounted() {


		}
	}
</script>

<style type="text/css" scoped>

</style>
