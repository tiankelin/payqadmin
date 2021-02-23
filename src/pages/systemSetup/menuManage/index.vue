<template>
	<div class="main">
		<div class="mainContent">
			<Tabs :animated="false" v-model='tabsCheck'>
				<TabPane label="平台端">
					<webMenu :tabsCheck='tabsCheck'></webMenu>
				</TabPane>
					
				<TabPane label="送气侠">
					<sendGasMenu :tabsCheck='tabsCheck'></sendGasMenu>
				</TabPane>
				<TabPane label="bang瓶侠">
					<bindBottleMenu :tabsCheck='tabsCheck'></bindBottleMenu>
				</TabPane>
			</Tabs>

		</div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import webMenu from './webMenu';
	import sendGasMenu from './sendGasMenu';
	import bindBottleMenu from './bindBottleMenu';
	import 'xe-utils';
	import VXETable from 'vxe-table';
	import 'vxe-table/lib/style.css';
	Vue.use(VXETable)

	export default {
		name: 'index',
		components: {
			webMenu,
			sendGasMenu,
			bindBottleMenu

		},
		data() {
			return {
				tabsCheck:0
			}
		},
		methods: {

		},
		beforeRouteEnter(to, from, next) {
			next(vm => { 
				let addPath =(from.path).indexOf('addMenu');
				let editPath =(from.path).indexOf('editMenu');
				let addSendAppPath=(from.path).indexOf('addAppMenu/1');
				let editSendAppPath=(from.path).indexOf('editAppMenu/1');
				let addBindAppPath=(from.path).indexOf('addAppMenu/2');
				let editBindAppPath=(from.path).indexOf('editAppMenu/2');
				if(addPath!=-1||editPath!=-1){
					vm.tabsCheck=0;
				}
				if(addSendAppPath!=-1||editSendAppPath!=-1){
					vm.tabsCheck=1;
				}
				if(addBindAppPath!=-1||editBindAppPath!=-1){
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
		margin-right: 10px;
		min-height: calc(100% - 10px);
		background: #fff;
	}
	
	.mainTop {
		background: #fff;
		height: 48px;
		line-height: 48px;
		text-align: right;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
	}
	
	.mainTop button {
		margin-right: 10px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding:10px;
		position: relative;
	}
	
	.mainContent>>>th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	.mainContent>>>tbody {
		height: 500px!important;
		overflow-y: auto;
	}
	.mainContent>>>.ivu-tabs-bar {
		margin-bottom:0;
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