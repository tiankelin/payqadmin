<template>
	<div class="main">
		<div class="mainContent">
			<Tabs :animated="false" v-model='tabsCheck' @on-click='tabsCheckClick'>
				<TabPane label="商品分类">
					<goodsType :tabsCheck='tabsCheck'></goodsType>
				</TabPane>
				<!--<TabPane label="商品规格">
					<goodsSpecs :tabsCheck='tabsCheck'></goodsSpecs>
				</TabPane>-->
				<TabPane label="型号细分">
					<goodsModel :tabsCheck='tabsCheck'></goodsModel>
				</TabPane>
				<TabPane label="商品列表">
					<goodsList :tabsCheck='tabsCheck'></goodsList>
				</TabPane>
			</Tabs>

		</div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import goodsList from './components/goodsList';
	import goodsModel from './components/goodsModel';
	import goodsSpecs from './components/goodsSpecs';
	import goodsType from './components/goodsType';	
	export default {
		name: 'index1',
		components: {
			goodsList,
			goodsModel,
			goodsSpecs,
			goodsType

		},
		data() {
			return {
				tabsCheck:0
			}
		},
		methods: {
			tabsCheckClick(v){
        		this.tabsCheck=v;
      },
		},
		beforeRouteEnter(to, from, next) {
			next(vm => { 
				let addPath =(from.path).indexOf('commodityAdd');
				let editPath =(from.path).indexOf('commodityEdit');
				if(addPath!=-1||editPath!=-1){
					vm.tabsCheck=2;
				}

			})
		},
		mounted() {

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
	
	.mainContent {
		padding-top: 10px;
	}
	
	.mainContent>>>td {
		height: 40px;
	}
	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	
	.mainContent>>>.ivu-tabs-bar {
		/*border: 0;
		margin: 0;*/
		margin-bottom: 10px;
	}
	
	.mainContent>>>.ivu-tabs {
		overflow: visible;
	}
	.mainContent>>>.ivu-tabs-nav .ivu-tabs-tab{
		height: 32px;
		border-radius:2px;
		background:#e3f8fbb5;
		color: #333;
	}
	.mainContent>>>.ivu-tabs-ink-bar{
		display: none;
	}
	.mainContent>>>.ivu-tabs-tab-active{		
		background:#51B5EA!important;
		color: #fff!important;
		margin-bottom: 4px;
	}
</style>