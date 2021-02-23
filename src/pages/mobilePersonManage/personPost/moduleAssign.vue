<template>
	<div class=mainBorder>
		<div class='mainHeader'>
			功能配置 ——
			<span style="color: rgb(22, 194, 19);font-weight: 600;">{{$route.params.roleName}}</span>
			<Icon type="md-close" class='closeIcon' @click='moduleBack' />
		</div>
		<div class="mainBody">
			<div style="display: flex;height: 100%;">
				<webMenuConfig></webMenuConfig>	
				<sendMenuConfig></sendMenuConfig>
				<bindMenuConfig></bindMenuConfig>
			</div>

		</div>

	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import { Tree } from 'element-ui';
	import webMenuConfig from './components/webMenuConfig';
	import sendMenuConfig from './components/sendMenuConfig';
	import bindMenuConfig from './components/bindMenuConfig';
	Vue.component(Tree.name, Tree);
	export default {
		name: 'moduleAssign',
		components:{
			webMenuConfig,
			sendMenuConfig,
			bindMenuConfig
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
			}

		},
		methods: {
			//返回上一级
			moduleBack() {
				this.$router.go(-1)
			},

		},
		mounted() {

		}
	}
</script>

<style type="text/css" scoped>
	.mainBody {
		padding-left: 20px;
	}
	.configMain{
		width: 33%;
		height:100%;
		border: 1px solid #DCDEE2;
		margin: 0 1%;
		position: relative;
		border-radius: 6px;
		overflow: hidden;
	}
	.configTitle{
		text-align: center;
		line-height: 30px;
		font-weight: 600;
	}
</style>