<template>
	<div class='mainBox'>
		<div class="main" >
			<div class='mainTitle'>{{conKeys}}:{{newTags.length}}</div>
			<div class='mainContent'>
				<span v-for="item in newTags" :key="item" @click='handleBottleInfo(item)'>{{item}}</span>
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
			handleBottleInfo(bottleId) {
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
	.main {
		min-width: 200px;
		max-width: 600px;
		min-height: 120px;
		max-height: 400px;
		overflow: hidden;
		background: #fff;		
		position: absolute!important;
		left: 50%;
		top: 50%;
		margin-left: -300px;
		margin-top: -200px;		
		padding: 10px 10px 20px;
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
		color: #F00;
		font-weight: 600;
	}
	
	.mainContent {
		width: 100%;
		max-height: 320px;
		overflow-y: auto;
	}
	
	.mainContent span {
		margin: 5px;
		background: rgb(238, 101, 21);
		padding: 0 6px;
		border-radius: 2px;
		color: #fff;
		cursor: pointer;
		display: inline-block;
	}
</style>