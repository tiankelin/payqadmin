<template>
	<div class="main">
		<div class="mainContent">
			<div class="contentTitle">数据权限</div>
			<div class="contentTree">
				<Tree :data="baseData" ref="tree2" @on-check-change="baseChoiceAll" show-checkbox></Tree>
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
		name: 'baseTree',
		props: {
			deptIdLis: Array
		},
		data() {
			return {
				SpinShow:false,
				userData: (JSON.parse(this.$store.state.userData)),
				baseData: [],
				deptIdList: []
			}
		},
		methods: {
			//循环组织数据
			getTitle(depts) {
				return depts.map((dept) => {
					if(dept.children && dept.children.length > 0) {
						this.getTitle(dept.children);
					}
					if(this.deptIdLis) {
						for(let items of this.deptIdLis) {
							if(dept.children) {	
								dept.expand = true;
								if(items == dept.deptId && dept.children.length) {
									dept.expand = true;
								}
								if(items == dept.deptId && !dept.children.length) {									
									dept.checked = true
								}

							} else {
								if(items == dept.deptId) {									
									dept.checked = true
								}
							}
						}
					}
					dept.title = dept.name;
					return dept;
				})
			},
			//获取组织列表
			getOrganizeList1() {
				this.SpinShow=true;
				_http.http1('post', pathUrls.deptList, {
					deptId: this.userData.deptId
				}, 'form').then((res) => {
					this.SpinShow=false;
					this.baseData = this.getTitle(res);
				})
			},
			baseChoiceAll(data) {
				this.deptIdList = []
				const checkedNodes = this.$refs.tree2.getCheckedNodes();
				if(checkedNodes.length) {
					for(let item of checkedNodes) {
						this.deptIdList.push(item.deptId)
					}
				}				
			},

			//返回
			backClick() {
				this.$emit('baseShowChange', false)
			},
			//确定
			enterClick() {				
				this.$emit('deptChange', this.deptIdList);
				this.$emit('baseShowChange', false);

			}

		},
		created(){
			this.getOrganizeList1()
		},
		mounted() {
			this.deptIdList = this.deptIdLis;
			//			console.log(this.deptIdLis)
			
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
		margin-top: -290px;
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