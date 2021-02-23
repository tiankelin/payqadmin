<template>
	<div class='vipMain'>
		<div class="vipContent">
			<Icon type="md-close" class='closeBtn' @click='closeClick' />
			<div style="margin-bottom: 8px;">
				<span class="vipUserName">{{vipUserName}}</span>
			</div>
			<div class="tableContent">
				<Tabs :animated="false" v-model='tabsCheck'>
					<TabPane label="安检规则">
						<vipRules :tabsCheck='tabsCheck' :vipUserId='vipUserId'></vipRules>
					</TabPane>
					<TabPane label=" 安检项  ">
						<vipContents :tabsCheck='tabsCheck' :vipUserId='vipUserId'></vipContents>
					</TabPane>
				</Tabs>
			</div>
		</div>

	</div>
</template>

<script>
	import vipRules from './vipRules';
	import vipContents from './vipContents';
	export default {
		name: 'vipIndex',
		props: {
			vipUserName: String,
			vipUserId: Number
		},
		components: {
			vipRules,
			vipContents
		},
		data() {
			return {
				tabsCheck:0
			}
		},
		methods: {
			closeClick() {
				this.$emit('rulesShow', false);
			}
		}
	}
</script>

<style type="text/css" scoped>
	.vipMain {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 1004;
	}
	
	.vipContent {
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
	
	.vipUserName {
		font-weight: 600;
		color: #E20CDB;
		font-size: 16px;
	}
	
	.vipMain>>>.ivu-tabs {
		overflow: visible;
	}
	
	.vipMain>>>.ivu-tabs-nav .ivu-tabs-tab {
		height: 32px;
		border-radius: 2px;
		background: #e3f8fbb5;
		color: #333;
	}
	
	.vipMain>>>.ivu-tabs-ink-bar {
		display: none;
	}
	
	.vipMain>>>.ivu-tabs-tab-active {
		background: #51B5EA!important;
		color: #fff!important;
		margin-bottom: 4px;
	}
	
	.vipMain>>>td {
		height: 40px;
	}
	
	.vipMain>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	
	.tableContent>>>.ivu-input-number-input {
		height: 28px;
	}
	.tableContent>>>.ivu-input {
		height: 28px;
	}
</style>