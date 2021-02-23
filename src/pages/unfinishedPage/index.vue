<template>
	<div class="main">
		<Spin fix>
                <!--<Icon type="ios-loading" size=40 class="demo-spin-icon-load"></Icon>-->
                <div style="font-size: 18px;margin-top: 10px;">暂无权限！</div>
            </Spin>
          	 <!--<img id="testImg" src="https://source.payq-iot.com/upload/image/202003231534357853.jpeg" alt=""/>
			<button class="downloadBtn" type="button" οnclick="downloadImg()">下载图片</button>-->
            
	</div>
</template>

<script>
	export default {
		name: 'unfinishedPage',
		data() {
			return {

			}
		},
		methods: {
		downloadImg(){
			
		}
		},
		mounted() {

		}
	}
</script>

<style type="text/css" scoped>
	.main {
		width: calc( 100% - 10px);
		height: calc( 100% - 10px);
		background: #fff;
		position: relative;
		/*margin-right: 10px;*/
	}
	
	.demo-spin-icon-load {
		animation: ani-demo-spin 1s linear infinite;
	}
</style>