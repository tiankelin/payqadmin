<template>
	<div class='main'>
		<div class='mainTop'>新增</div>
		<div class="mainContent">

		</div>
	</div>
</template>

<script>
	export default {
		name: 'addCirculate',
		data() {
			return {

			}
		},
		methods: {

		},
		mounted() {

		}
	}
</script>

<style type="text/css" scoped>
	.main {
		padding-right: 10px;
	}
	
	.mainTop {
		background: #fff;
		height: 44px;
		line-height: 44px;
		text-align: left;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
		margin-bottom: 10px;
	}
	
	.mainContent {
		background: #fff;
		/*height: 500px;*/
		border-radius: 4px;
		text-align: left;
		padding: 10px 20px 20px 0;
		overflow-y: auto;
		height: calc(100vh - 220px);
	}
</style>