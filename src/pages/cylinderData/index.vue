<template>
	<div class='main'>
		<div class='allCount'><span>气瓶总数：</span><span style="color: #f00;">{{$store.state.allCount}}</span><Button type="info" style="margin-left: 40px;height: 30px;line-height: 30px;" @click='goZero'>清零</Button></div>
		<div class='dataItem' v-for='item in JSON.parse(this.$store.state.cylinderData)' :key='item.name'>
			<div class='itemTitle'>{{item.name}}</div>
			<div class='dataCountLabel'><span>瓶数：</span><span class='dataCount'>{{item.count}}</span></div>
		</div>
		
	</div>
</template>

<script>
	export default {
		name: 'cylinderData',
		data() {
			return {
				
			}
		},
		methods: {
			goZero(){
				this.$store.commit('changeZero',true)
				let cylinderData=[
				{count: 0, name: "氧气",tagsArr:[]},
				{count: 0, name: "氮气",tagsArr:[]},
				{count: 0, name: "氯气",tagsArr:[]},
				{count: 0, name: "混合气",tagsArr:[]},				
				{count: 0, name: "二氧化碳",tagsArr:[]},
				{count: 0, name: "氦气",tagsArr:[]},
				{count: 0, name: "乙烯",tagsArr:[]},
				{count: 0, name: "医用氧",tagsArr:[]},
				{count: 0, name: "液氧",tagsArr:[]},
				{count: 0, name: "液氮",tagsArr:[]},
				{count: 0, name: "液氯",tagsArr:[]},
				{count: 0, name: "液二氧化碳",tagsArr:[]},
				{count: 0, name: "商品丙烷",tagsArr:[]},
				{count: 0, name: "高纯氧",tagsArr:[]},
				{count: 0, name: "高纯氯",tagsArr:[]},
				{count: 0, name: "高二化",tagsArr:[]},
				{count: 0, name: "高纯氮",tagsArr:[]},
				{count: 0, name: "干冰",tagsArr:[]},
//				{count: 0, name: "未知气体",tagsArr:[]},
				]
				this.$store.commit('changeAllCount',0)
				this.$store.commit('changeCyinderData', JSON.stringify(cylinderData));
			
			}
		},

		mounted() {
//			console.log(JSON.parse(this.$store.state.cylinderData))	
//			if(this.$store.state.cylinderData){
//			this.dataList=JSON.parse(this.$store.state.cylinderData)
//			this.datas=this.dataList
//			}
			
//			[{
//					name:'氧气',
//					count:10
//				},{
//					name:'二氧化碳',
//					count:14
//				},{
//					name:'液二氧化碳',
//					count:15
//				}]
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		background: #FFFFFF;
		height: 100%;
		padding: 20px;
		overflow-x: hidden;
		/*display: flex;
		flex-wrap:wrap;*/
	}
	
	.dataItem {
		width: 180px;
		height: 85px;
		background: #fff;
		padding: 0 5px 10px;
		font-size: 16px;
		box-shadow: 0 2px 12px 0 #40a9ff75;
		margin: 15px;
		float: left;
	}
	.allCount{
		margin-left: 15px;
		font-size: 20px;
		color: #0079FB;
		text-align: left;
	}
	.itemTitle {
		font-size: 20px;
		height: 40px;
		line-height: 40px;
		color: #000;
		border-radius: 4px;
	}
	.dataCountLabel{
		text-align: left;
		color: #2db7f5;
	}
	.dataCountLabel .dataCount{
		color: #f00;	
	}
</style>