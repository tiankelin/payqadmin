<template>
	<div class="issueMain">
		<div class="issueContent">
			<div class="closeWrapper" @click='handleClose'>
				<Icon type="md-close" />
			</div>
			<div>
				<h3 class="issueTitle">交接信息</h3>
				<div style="overflow-y: auto;max-height: 400px;">
					<div v-for='item in issueInfoArray' :key='item' class="itemWrapper">
						<div style="width: 50%;float: left;">
							<span class="itemTitle">商品名称：</span>
							<span>{{item.goodsName}}</span>
						</div>
						<div style="width: 50%;float: left;">
							<span class="itemTitle">商品规格：</span>
							<span>{{item.goodsSpec}}</span>
						</div>
						<div>
							<span class="itemTitle" style="float: left;">钢瓶标识：</span>
							<span @click='getBottleInfo(items)' v-for='items in item.bottles' :key='items' class="itemBottle">{{items}}</span>							
						</div>
					</div>
				</div>

			</div>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
	</div>
</template>

<script>
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default {
		name: "issueInfo",
		components: {
			cylInfo,
		},
		props: {
			issueInfoArray: Array
		},		
		data() {
			return {
				tags: '',
				infoSee: false,
			}
		},
		methods: {
			//关闭钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},
			getBottleInfo(id){
				this.infoSee = true;
				this.tags =id;
			},
			//关闭
			handleClose() {
				this.$emit('closeInfo', false);
			},
		},
		mounted() {

		}
	}
</script>

<style type="text/css" scoped>
	.issueMain {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .3);
		z-index: 300;
	}
	
	.issueContent {
		min-width: 400px;
		max-width: 650px;
		max-height: 600px;
		min-height: 200px;
		background: #fff;
		border-radius: 4px;
		padding: 20px;
		margin: 120px auto 0;
		position: relative;
		text-align: left;
		overflow: hidden;
	}
	
	.closeWrapper {
		position: absolute;
		right: 12px;
		top: -3px;
		font-size: 28px;
		cursor: pointer;
		color: #1296db;
		font-weight: 600;
	}
	
	.itemWrapper{
		overflow: hidden;
	}
	.itemTitle{
		font-weight: 600;
		display: inline-block;
		width: 90px;
		text-align: right;
		margin-top: 4px;
	}
	.itemBottle{
		/*background:#ee6515;*/
		margin:4px 5px;
		/*padding: 2px 4px;*/
		color: #ee6515;
		cursor: pointer;
		border-radius: 2px;
		float: left;
		display: inline-block;
		font-weight:600 ;
	}
</style>