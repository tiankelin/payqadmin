<template>
	<div class='mainBox'>
		<div class="mainTag" >
			<div class='mainTitle'>{{conKeys}}:{{newTags.length}}</div>
			<div class="tagHeader">
        <span style="width: 60px;">序号</span>
				<span>电子标签编码</span>
				<span>钢瓶条码</span>
				<span>钢瓶规格</span>
        <span style="width: 60px;">状态</span>
			</div>
			<div class='tagContent'>
				<div :style='{color:item.bottleIsFull==1?"#089e36":"#f37f0b"}'  v-for="(item,index) in newTags" :key="item" @click='handleBottleInfo(item.bottleId,index)' class="tagItem" :class="{checkList:item.bottleId==clickId}">    <span style="width: 60px;">{{index+1}}</span>
					<span>{{item.bottleNfcId}}</span>
					<span>{{item.bottleCode}}</span>
					<span>{{item.bottleSpecification}}</span>
          <span style="width: 60px;">{{item.bottleIsFull==1?'重瓶':'空瓶'}}</span>
				</div>
			</div>
			<div class='closeWrapper' @click="closeClick">
				<!--<Button type="primary" @click="closeClick">关闭</Button>-->
				<Icon type="md-close" />
			</div>

		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee' :keyWord='keyWord'></cylInfo>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from './cylinderInfo';
	export default {
		name: 'cylinderTag',
		props: {
			conKeys: String,
			newTags: Array
		},
		components: {
			cylInfo,

		},
		data() {
			return {
				clickId:0,
				tags: '',
				infoSee: false,
				count: 0,
				bottleList: [],

			}
		},
		methods: {
			//查看钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},
			//点击钢瓶
			handleBottleInfo(bottleId,index) {
				this.clickId=bottleId;
				this.infoSee = true
				this.tags = bottleId
			},
			//点击关闭
			closeClick() {
				this.$emit('tagInfoSee', false)
			},
		},
		mounted() {

		}
	}
</script>

<style type="text/css" scoped>
.mainBox{
	position: absolute;
	left: 0;
	top:0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, .4);
	z-index: 1000;
}
	.mainTag {
		width:590px;
		min-height: 120px;
		max-height: 400px;
		overflow: hidden;
		background: #fff;
		position: absolute!important;
		left: 50%;
		top: 50%;
		margin-left: -440px;
		margin-top: -350px;
		padding: 10px 20px 20px;
    box-shadow: 0 2px 16px 0 #07b2f14d;

	}

	.closeWrapper {
		/*text-align: center;
		width: 100%;
		position: absolute;
		bottom: 10px;
		margin-left: -10px;
		background: #fff;
		height: 36px;
		line-height: 40px;	*/
		position: absolute;
	    right: 12px;
	    top:0px;
	    font-size: 26px;
	    cursor: pointer;
	    color:#1296db;
	    font-weight: 600;
	}

	.closeWrapper button {
		height: 28px;
	}

	.mainTitle {
		color: #ff6a00;
		font-weight: 600;
    font-size: 16px;
	}

	.tagContent {
		width:100%;
		max-height: 320px;
		overflow-y: auto;

	}
	.tagContent span{
		width: 130px;
		text-align: center;
		display: inline-block;

	}
	.tagContent .checkList{
		background: #0095FF;
		color: #fff!important;
	}
	/*.mainContent span {
		margin: 5px;
		background: rgb(238, 101, 21);
		padding: 0 6px;
		border-radius: 2px;
		color: #fff;
		cursor: pointer;
		display: inline-block;
	}*/
	.tagHeader{
		background: #E2EEFF;
    	color: #51B5EA;
    	line-height: 28px;
    	height: 28px;

	}
	.tagHeader span{
		width: 130px;
		text-align: center;
		display: inline-block;
		padding-right: 10px;
	}
	.tagItem{
      line-height: 28px;
    	height: 28px;
    	cursor: pointer;
    	color: #000;
      border-bottom: 1px solid #eee;

	}
	.tagItem:hover{
		background: #08b3f55c;

	}

</style>
