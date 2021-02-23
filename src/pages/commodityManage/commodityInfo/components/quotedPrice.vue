<template>
	<div class='quotedMain'>
		<div class="quotedContent">
			<Icon type="md-close" class='closeBtn' @click='closeClick'/>
			<div  class='quotedTitle'>商品价格列表</div>
			<div  class='quotedInfo'>
				<div><span>所属组织：</span><span>萧燃燃气</span></div>
				<div><span>商品类型：</span><span>液化石油气</span></div>
				<div><span>商品名称：</span><span>15KG液化气</span></div>
			</div>
			<Table border :columns="columns" :data="quotedList" :loading='loading' ref="table">
				<template slot-scope="{ row, index }" slot="action">
					<Button type="info" size="small" @click="marketPriceMethod(row)">市场报价</Button>
					<Button type="warning" size="small" @click="quotedPriceMethod(row)" style="margin:0 10px;">区域报价</Button>
					<Button type="error" size="small" @click="quotedPriceRemove(row)">删除</Button>
				</template>
			</Table>
		</div>
		<setupPrice v-if='showSetup' @showSetup='showSetupMethods'></setupPrice>
		<marketPrice v-if='showMarket' @showMarket='showMarketMethods'></marketPrice>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import setupPrice from './setupPrice';	
	import marketPrice from './marketPrice';	
	export default {
		name: 'quotedPrice',
		props:{
			rowData:Object
		},
		components:{
			setupPrice,
			marketPrice
		},
		data() {
			return {
				showMarket:false,
				showSetup:false,
				quotedList:[{quotedStatus:1}],
				columns:[{
						title: '报价状态',
						key: 'quotedStatus',
						align: 'center',
				},
				{
						title: '名称',
						key: 'goodsName',
						align: 'center',
				},{
						title: '类型',
						key: 'goodsType',
						align: 'center',
				},{
						title: '单位',
						key: 'goodsUnit',
						align: 'center',
				},{
						title: '操作',
						slot: 'action',
						width: 260,
						align: 'center'
					}]
			}
		},
		methods: {
			//获取价格列表
			getOrggoodspriceList(){
				this.loading = true;
				_http.http1('post', pathUrls.orggoodspriceList, {				
				}, 'form').then((res) => {
					this.loading = false;			
					this.quotedList=res.data;
			})
			},
			//市场报价隐藏
			showMarketMethods(data){
				this.showMarket=false;
			},
			//市场报价显示
			marketPriceMethod(row){
				this.showMarket=true;
			},
			//区域报价隐藏
			showSetupMethods(data){
				this.showSetup=data;
			},
			//关闭价格列表
			closeClick(){			
				this.$emit('showPrice',false);
			},
			//区域报价显示
			quotedPriceMethod(row){
				this.showSetup=true;
			},
			//区域报价删除
			quotedPriceRemove(){
				
			}
		},
		mounted() {
//			this.getOrggoodspriceList()
		}
	}
</script>

<style type="text/css" scoped>
	.quotedMain {
		background: rgba(0, 0, 0, .4);
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 1000;
	}
	
	.quotedContent {
		position: relative;
		width: calc(100% - 210px);
		height: calc(100% - 86px);
		background: #fff;
		margin-top: 65px;
		margin-left: 200px;
		padding: 10px;
		text-align: left;
	}
	
	.closeBtn {
		position: absolute;
		right: 5px;
		top: 5px;
		font-size: 26px;
		cursor: pointer;
		color: #51b5ea;
	}
	.quotedTitle{
		color: #333;
		font-size: 16px;	
		
	}
	.quotedInfo{
		display: flex;	
		background: #B4E3FF;
		color: #333;		
		margin:5px 0 10px;
	}
	.quotedInfo div{
		margin:5px 20px;
	}
</style>