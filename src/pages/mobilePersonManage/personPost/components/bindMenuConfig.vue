<template>
	<div class="configMain">
		<div style="text-align: center;line-height: 30px;font-weight: 600;" class="configTitle">bang瓶侠</div>
		<div style="overflow-y:auto;height:calc( 100% - 80px );position: relative;">
			<el-tree :default-checked-keys='defaultCheckedKey'  :default-expanded-keys="['2']"   :data="data" show-checkbox  node-key="id" ref="tree" highlight-current :props="defaultProps">
			</el-tree>
			<Spin fix v-if='loading'></Spin>
		</div>
		
		<div style="text-align: center;position: absolute;bottom: 10px;left: 0;width: 100%;">
			<Button type="primary" @click='handleSave' :disabled="isDisabled">保存</Button>
		</div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		name: 'bindMenuConfig',
		data(){
			return{
				data: [],
				loading:false,
				defaultCheckedKey:[],
				isDisabled:false,
			}
		},
		methods:{
			//保存
			handleSave(){
				let checkData=[];
				checkData=checkData.concat(this.$refs.tree.getCheckedKeys(),this.$refs.tree.getHalfCheckedKeys());
//				console.log(checkData)
				this.isDisabled = true;
				let fData={
					positionId:this.$route.params.id,
					menuIds:checkData.toString(),
					type:2
				}
				_http.http2('post', pathUrls.changePositionMenuList, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '配置成功!',
							onClose: (() => {
								this.defaultCheckedKey=[];
								this.isDisabled = false;
								this.getMenuTree();
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						});
					}
					if(res.code != 0) {
						this.isDisabled = false;

					}
				}).catch(err => {
					this.isDisabled = false;
				})
			},
			//递归数组
			getMenus(menus) {
				
				return menus.map((menu) => {
					menu.children=menu.modules;
					if(menu.children.length > 0) {
						this.getMenus(menu.children);
					}
					if(menu.checked&&!menu.children.length){
						this.defaultCheckedKey.push(menu.moduleId);
					}
					menu.title = menu.moduleName;	
					menu.label = menu.moduleName;	
					menu.id = menu.moduleId;	
					
					return menu;
				})
			},
			//获取数据树
			getMenuTree(){
					this.loading=true;
				_http.http3('get', pathUrls.deptPositionTree,
					{
						positionId:this.$route.params.id,
						type:2
						
					}
				,'form').then((res) => {
					this.loading=false;
					this.data=this.getMenus(res.data);
									
					
				}).catch(()=>{
					this.loading=false;
				})
			},
		
		
		},
		mounted(){
			
			this.getMenuTree();
			
			
		}
	}
</script>

<style type="text/css" scoped>
	
</style>