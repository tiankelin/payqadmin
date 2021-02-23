<template>
	<div class="contentMain">
		 <Tabs :animated="false" name='tabMap' v-model='tabsMap'>
	        <Tab-pane :label="item" tab='tabMap'  :index='index+1' v-for='(item,index) in arrArray' :key='index' :name='item'>
	        	<carMap v-if='item=="车辆"' :tabsMap='arrArray'></carMap>
	        	<cylinderMap v-else-if='item=="占用瓶"' :tabsMap='arrArray'></cylinderMap>
	        	<userMap v-else-if='item=="用户"' :tabsMap='arrArray'></userMap>
	        	<personnelMap v-else-if='item=="员工"' :tabsMap='arrArray' ></personnelMap>
	        	<stationMap v-else :stations='item' :tabsMap='arrArray'></stationMap>
	     	</Tab-pane>

	       <!--<Tab-pane label="车辆" tab='tabMap'>
	        	<carMap></carMap>
	        </Tab-pane>
	       <Tab-pane label="占用瓶" tab='tabMap'>
	        	<cylinderMap></cylinderMap>
	        </Tab-pane>
	        <Tab-pane label="用户" tab='tabMap'>
	        	<userMap></userMap>
	        </Tab-pane>
	        <Tab-pane label="员工" tab='tabMap'>
	        	<personnelMap></personnelMap>
	        </Tab-pane>
	        <Tab-pane label="场站" tab='tabMap'>
	        	<stationMap></stationMap>
	        </Tab-pane>-->
   	   </Tabs>
	</div>
</template>

<script>
	import carMap from './carMap';
	import cylinderMap from './cylinderMap';
	import userMap from './userMap2';
	import personnelMap from './personnelMap1';
	import stationMap from './stationMap';
	export default {
		name: "home",
		components: {
			carMap,
			cylinderMap,
			userMap,
			personnelMap,
			stationMap,

		},
		data(){
			return{
				tabsMap:'车辆',
				arrArray:[],

//				carShow:false,
//				cylinderShow:false,
//				userShow:false,
//				personShow:false,
//				stationShow:false
			}
		},

		watch:{
			'$store.state.homeMenu': {
				handler(newItems, oldItems) {
					if(newItems.length){
						this.arrArray=JSON.parse(newItems);

					}
				},
				deep: true,
				immediate: true
			},
		},
		methods:{

		},

		mounted(){
			// 	history.pushState(null, null, document.URL);
			// 	window.addEventListener('popstate', function () {
			// 	history.pushState(null, null, document.URL);
			// });

		}
	}
</script>

<style type="text/css" scoped>
	.contentMain{
		width: 100%;
		height: 100%;
		background: #fff;
		overflow: hidden;
		/*padding:0 10px;*/
	}
	.contentMain>>>.ivu-tabs-bar{
		margin-bottom:0;
	}

</style>
