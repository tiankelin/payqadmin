<template>
	<div class='mainBox' v-if='showMain'>
		<div class="main" >
			<div class='mainTitle'>钢瓶数:{{count}}</div>
			<div class='mainContent'>
				<span v-for="item in bottleList" :key="item" @click='handleBottleInfo(item)'>{{item}}</span>
			</div>
			<div class='closeWrapper' @click="closeClick">
				<!-- <Button type="primary" @click="closeClick">关闭</Button> -->
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
		name: 'resCylinder',
		props: {
			conKeys: String,
			keyWord: String
		},
		components: {
			cylInfo,

		},
		data() {
			return {
				tags: '',
				infoSee: false,
				showMain: false,
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
				this.$emit('bindBottleSee', false)
			},
			//获取绑定责任钢瓶
			getBindBottle(keyWord, id) {
				this.showMain = false
				_http.http1('get', pathUrls.getBindBottle + '?' + keyWord + '=' + id, {

				}, 'form').then((res) => {
					if(res.code == 0) {
						this.showMain = true
						this.bottleList = res.data

						this.count = res.data.length
					}

				})
			}
		},
		mounted() {
			this.getBindBottle(this.keyWord, this.conKeys)
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
	z-index: 100;
}
	.main {
		min-width: 200px;
		max-width: 600px;
		min-height: 100px;
		max-height: 400px;
		overflow: hidden;
		background: #fff;
		position: absolute!important;
		left: 50%;
		top: 50%;
		margin-left: -300px;
		margin-top: -200px;

		padding: 10px;
	}

	.closeWrapper {
		/* text-align: center;
		width: 100%;
		position: absolute;
		bottom: 10px;
		margin-left: -10px; */
    position: absolute;
    right: 12px;
    top:0px;
    font-size: 26px;
    cursor: pointer;
    color:#1296db;
    font-weight: 600;
	}

	/* .closeWrapper button {
		height: 28px;
	} */

	.mainTitle {
		color: #F00;
		font-weight: 600;
	}

	.mainContent {
		width: 100%;
		max-height: 370px;
		overflow-y: auto;
    padding-bottom: 10px;
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
