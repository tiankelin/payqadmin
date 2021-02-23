<template>
	<div class="instructMain">
		<div class="instructContent">		
			<div class="closeWrapper" @click='handleClose'><Icon type="md-close" /></div>
			<div>
				<h3 class="instructTitle">指令下发页</h3>
				<div style="padding:20px 10px;">
					<div>
						<Input type="text"/>
					</div>
					<div style="text-align: center;margin-top: 20px;">
						<Button type="info">锁车</Button>
						<Button type="info" style="margin: 0 20px;">开锁</Button>
						<Button type="warning">tts播报</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'instructionIssue',
		props:{
			terId:String
		},
		data(){
			return{
				
			}
		},
		methods:{		
			//关闭
			handleClose(){
				this.$emit('closeInstruct',false);
			},
		},
		mounted(){
			
		}
	}
</script>

<style type="text/css" scoped>
	.instructMain{
		background:rgba(0,0,0,.5);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		
	}
	.instructContent{
		width:400px;
		height:200px;
		background: #fff;
		border-radius: 4px;
		padding: 10px;
		margin:150px auto 0;
		position: relative;
		text-align: left;
	}
	.closeWrapper{
		position: absolute;
		right: 12px;
		top:-3px;
		font-size: 28px;
		cursor: pointer;
		color:#1296db;
		font-weight: 600;
	}
	.instructTitle{
		margin: 0 11px;
	}
</style>