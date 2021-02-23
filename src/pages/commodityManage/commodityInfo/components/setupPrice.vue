<template>
	<div class="setMain">
		<div class="setContent">
			<Icon type="md-close" class='closeBtn' @click='closeClick' />
			<div class='setTitle'>设置区域报价</div>
			<div class='setInfo'>
				
				<div><span>名称：</span><span>15KG液化气</span></div>
				<div><span>类型：</span><span>液化气</span></div>
			</div>
			<div>
				<div class='totalPriceTitle'>总公司定价</div>
				<div class="itemWrapper">
					<div style="background: #DDEBF1;" class='itemList'>
						<div class='priceTitle'>呼叫中心定价</div>
						<div style="text-align: left;">
							<div><span>挂牌价：</span>110元</div>
							<div><span>居民价：</span></div>
							<div><span>商业价：</span></div>
							<div><span>工业价：</span></div>
						</div>
					</div>
					<div style="background: #DDEBF1;" class='itemList'>
						<div class='priceTitle'>线上定价</div>
						<div style="text-align: left;">
							<div><span>挂牌价：</span>110元</div>
							<div><span>居民价：</span></div>
							<div><span>商业价：</span></div>
							<div><span>工业价：</span></div>
						</div>
					</div>
				</div>
				<div class="itemWrapper">
					<div style="background:#8CC5FF;" class='itemList'>
						<div class='priceTitle'>呼叫中心定价</div>
						<div style="text-align: left;">
							<Form inline :label-width="70" class='formList'>
								<FormItem label='挂牌价：'>
									<Input type="text" />元
								</FormItem>
								<FormItem label='居民价：'>
									<Input type="text" />元
								</FormItem>
								<FormItem label='商业价：'>
									<Input type="text" />元
								</FormItem>
								<FormItem label='工业价：'>
									<Input type="text" />元
								</FormItem>
							</Form>
						</div>
					</div>
					<div style=" background: #8CC5FF;" class='itemList'>
						<div class='priceTitle'>线上定价</div>
						<div style="text-align: left;">
							<Form inline :label-width="70" class='formList'>
								<FormItem label='挂牌价：'>
									<Input type="text" />元
								</FormItem>
								<FormItem label='居民价：'>
									<Input type="text" />元
								</FormItem>
								<FormItem label='商业价：'>
									<Input type="text" />元
								</FormItem>
								<FormItem label='工业价：'>
									<Input type="text" />元
								</FormItem>
							</Form>
						</div>
					</div>
				</div>
			</div>
			<div class='btnWrapper'>
				<Button type="primary">确定</Button>
				<Button @click='priceBackClick'>返回</Button>
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		name: 'setupPrice',
		props: {

		},
		data() {
			return {

			}
		},
		methods: {
			closeClick() {
				this.$emit('showSetup', false)
			},
			priceBackClick(){
				this.$emit('showSetup', false)
			}
		},
		mounted() {

		}
	}
</script>

<style type="text/css " scoped>
	.setMain {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .2);
		z-index: 1004;
	}
	
	.setContent {
		position: relative;
		width: calc(100% - 210px);
		height: calc(100% - 86px);
		background: #fff;
		margin-top: 65px;
		margin-left: 200px;
		padding: 10px;
		text-align: left;
	}
	
	.closeBtn {
		position: absolute;
		right: 5px;
		top: 5px;
		font-size: 26px;
		cursor: pointer;
		color: #51b5ea;
	}
	
	.setTitle {
		color: #333;
		font-size: 16px;
	}
	
	.setInfo {
		display: flex;
		background: #efdf207a;
		color: #333;
		margin: 5px 0 10px;
	}
	
	.setInfo div {
		margin: 5px 20px;
	}
	
	.itemWrapper {
		display: flex;
		justify-content: space-around;
		min-height: 250px;
		margin-bottom: 10px;
	}
	
	.priceTitle {
		color: #333;
		line-height: 20px;
		height: 30px;
		font-weight: 600;
		font-size: 16px;
	}
	
	.formList>>>.ivu-input-wrapper {
		width:auto;
	}
	
	.totalPriceTitle {
		color: #000;
		font-size: 18px;
	}
	
	.itemList {
		width: 48%;
		padding: 10px 20px;
	}
	.itemList span{
		padding-left: 10px;
	}
	.btnWrapper {
		text-align: right;
		padding-right:100px;
		margin-top: 20px;
	}
	
	.btnWrapper button {
		margin: 0 10px;
		
	}
</style>