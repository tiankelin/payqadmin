<template>
	<div class="main">
		<div class="mainContent">
			<div class="contentTitle">选择菜单</div>
			<div class="contentTree">
				<Tree :data="baseData" ref="tree" @on-select-change="choiceAll"></Tree>
			</div>
			<div class="butBox">
				<Button type="primary" @click='enterClick'>确定</Button>
				<Button style="margin-left: 8px" @click='backClick'>返回</Button>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import Bus from '@/public/bus'
	export default {
		name: 'fatherMenu',
		props: {
			fatheId:String
		},
		data() {
			return {
				fatherName:'',
				baseData: [],
				checkedData: []
			}
		},
		methods: {
			choiceAll(data) {
//				console.log(data)
				if(data.length) {
					this.checkedData = [{
						name: data[0].name,
						menuId: data[0].menuId
					}]
				} else {
					this.checkedData = [{
						name: "平台",
						menuId: "0"
					}]

				}

			},
			enterClick() {
				Bus.$emit('isShow', false)
				Bus.$emit('checkMenu', this.checkedData)

			},
			backClick() {
				//				this.checkedData=[{name:"平台",menuId: "0"}]
				Bus.$emit('isShow', false)
			},

			getTitle(menus) {					
				return menus.map((menu) => {
					if(menu.children.length > 0) {
						this.getTitle(menu.children);
					}
					if(this.fatheId==menu.menuId){
						this.fatherName=menu.name;
						menu.selected = true
						this.$emit('fatherName',this.fatherName)
					}
					menu.title = menu.name;
					
						if(menu.parent_id == '-1') {
						 menu.expand = true
					}
					
					
					return menu;
				})
			},

			getFatherMenu() {

				_http.http1('get', pathUrls.menuSelect, {}, 'form').then((res) => {
					this.baseData = (this.getTitle(res.data));
//					console.log(this.baseData)
				}).catch((res) => {

				})

			}
		},
		mounted() {
			this.getFatherMenu()
		}
	}
</script>

<style scoped>
	.main {
		position: fixed;
		left:0;
		right:0;
		top:0;
		bottom: 0px;
		background: rgba(0, 0, 0, .2);
		z-index: 1000;
		border-radius: 4px;
	}
	
	.mainContent {
		background: #fff;
		width: 320px;
		height: 450px;
		margin-left:-160px;
		margin-top: -235px;
		border-radius: 8px;
		position: absolute;
		left: 50%;
		top: 50%;
		
	}
	
	.contentTitle {
		text-align: center;
		line-height: 40px;
		height: 40px;
		color: #fff;
		background: #2b6e80;
	}
	
	.contentTree {
		text-align: left;
		padding-left: 20px;
		height: 340px;
		overflow-y: auto;
	}
	
	.butBox {
		margin-top: 25px;
		text-align: right;
		padding-right: 20px;
	}
</style>