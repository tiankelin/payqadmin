<template>
	<div class="main">
		<div class="mainContent">
			<div class="contentTitle">功能权限</div>
			<div class="contentTree">
				<Tree :data="powerData" ref="tree1" @on-check-change="powerChoiceAll" show-checkbox> </Tree>
				<Spin size="large" v-if='SpinShow' fix></Spin>
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
	export default {
		name: 'powerTree',
		props: {
			menuIdLis: Array
		},
		data() {
			return {
				SpinShow:false,
				powerData: [],
				menuIdList: [],
				hasChildA: [],
				newA: []
			}
		},
		methods: {
			powerChoiceAll(data) {
				this.menuIdList = []
				const checkedNodes = this.$refs.tree1.getCheckedAndIndeterminateNodes();
				if(checkedNodes.length) {
					for(let item of checkedNodes) {
						this.menuIdList.push(item.menuId)
					}
				}
				//				console.log(this.menuIdList)

			},
			//递归数据
			getTitle(menus) {
				return menus.map((menu) => {
					if(menu.children&&menu.children.length > 0) {
						this.getTitle(menu.children);
					}
					if(this.menuIdLis) {
						for(let items of this.menuIdLis) {									
							if(menu.children){
								if(items == menu.menuId&&menu.children.length){
								menu.expand = true;									
							}
								if(items == menu.menuId&&!menu.children.length){
									menu.expand = true;
									menu.checked = true
								}
								
							}else{								
								if(items == menu.menuId){
									menu.expand = true;
									menu.checked = true
								}
							}
							
						}
					}

					menu.title = menu.name;
					return menu;
				})
			},
			//获取菜单列表
			getMenuList() {
				this.SpinShow=true;
				_http.http1('get', pathUrls.menuList, {}, 'form').then((res) => {
					this.SpinShow=false;
					this.powerData = this.getTitle(res.data);
				})
			},
			//返回
			backClick() {
				this.$emit('powerShowChange', false)
			},
			//确定
			enterClick() {
				this.$emit('menuChange', this.menuIdList);
				this.$emit('powerShowChange', false)
			}

		},
		created(){
			this.getMenuList();	
		},
		mounted() {
			this.menuIdList = this.menuIdLis;
			
		}
	}
</script>

<style scoped>
	.main {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		/*background: rgba(0, 0, 0, .2);*/
		background-color: rgba(55, 55, 55, .6);
		z-index: 1000;
		border-radius: 4px;
	}
	
	.mainContent {
		background: #fff;
		width: 380px;
		height: 520px;
		border-radius: 8px;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -190px;
		margin-top: -270px;
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
		height: 415px;
		overflow-y: auto;
		position: relative;
	}
	
	.butBox {
		margin-top: 20px;
		text-align: right;
		padding-right: 20px;
	}
</style>