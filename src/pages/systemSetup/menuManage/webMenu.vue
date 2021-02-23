<template>
	<div>
		<div style="text-align: right;position: absolute;right:-6px;top:0;z-index: 100;">
			<Button type="success" @click='handleChangeAdd' v-has='15' style="margin-right: 46px;">新增</Button>
		</div>
		<vxe-table :loading="loading" :max-height='tableHeight' :radio-config="{labelField: 'name'}" border resizable show-overflow highlight-hover-row highlight-current-row row-key row-id="id" 
			:tree-config="{children: 'children',line: true,expandRowKeys: defaultExpandKeys}" :data="tableData">
			<!--<vxe-table-column type="radio" title="菜单名称" tree-node></vxe-table-column>-->
			<vxe-table-column field="name" title="菜单名称" tree-node></vxe-table-column>
			<vxe-table-column field="menuId" title="菜单ID" width="100" align='center'></vxe-table-column>
			<vxe-table-column field="type1" title="类型" align='center'></vxe-table-column>
			<vxe-table-column field="orderNum" title="排序号" width="70" align='center'></vxe-table-column>
			<vxe-table-column field="url" title="菜单URL" align='center'></vxe-table-column>
			<vxe-table-column field="perms" title="授权标识" align='center'></vxe-table-column>
			<vxe-table-column field="isHide" title="显示或隐藏" align='center' width="110"></vxe-table-column>
			<vxe-table-column title="操作" width="150" align='center'>
				<template v-slot="{ row }">
					<vxe-button @click='handleChangeEdit(row.menuId)' type="info" style='background-color:#2db7f5;border-color:#2db7f5;color: #fff;height: 24px;line-height: 20px;padding:0 8px;'>编辑</vxe-button>
					<vxe-button @click='handleChangeDelete(row.menuId)' type="info" style='background-color:#ed4014;border-color:#ed4014;color: #fff;height: 24px;line-height: 20px;padding:0 8px;'>删除</vxe-button>
				</template>
			</vxe-table-column>

		</vxe-table>
	</div>

</template>
<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';

	export default {
		name: 'menuManager',
		props: {
			tabsCheck: Number
		},
		data() {
			return {
				defaultExpandKeys: [],
				loading: false,
				tableHeight: 400,
				screeHeight: document.documentElement.clientHeight, // 屏幕高

				menuId: '',
				currentChoose: '',
				tableData: [],
				newTabs: null
			}
		},

		methods: {

			getTitle(menus) {

				return menus.map((menu) => {
					if(menu.children && menu.children.length > 0) {
						this.getTitle(menu.children);
					}

					if(menu.type == 0) {
						menu.type1 = '目录'
					} else if(menu.type == 1) {
						menu.type1 = '菜单'
					} else {
						menu.type1 = '按钮'
					}

					menu.id =menu.menuId;
					menu.isHide = menu.showHide == 1 ? '显示' : '隐藏'

					return menu;
				})
			},

			//获取菜单列表
			getMenuList() {
				this.loading = true;
				this.tableData = [];
				_http.http1('get', pathUrls.menuTree, {}, 'form').then((res) => {
					this.loading = false;
					this.defaultExpandKeys = [res.data[0].menuId]
					
			
					this.tableData = this.getTitle(res.data)
					
					this.tableHeight = this.screeHeight - 150;
				})
			},
			//添加
			handleChangeAdd() {
				this.$router.push({
					path: '/menuManage/addMenu'
				});
			},
			//编辑
			handleChangeEdit(id) {
				this.$router.push({
					path: '/menuManage/editMenu/' + id
				});

			},
			//删除
			handleChangeDelete(id) {
				//				if(this.menuId) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http1('post', pathUrls.menuDelete, {
							menuId: id
						}, 'form').then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getMenuList();
									})
								});
							}
							if(res.code == 500) {
								this.$Message['warning']({
									background: true,
									content: res.msg,
								});
							}

						}).catch((res) => {

						})
					},

				});

			},
		},
		watch: {
			'tabsCheck': {
				handler(newTabs, oldTabs) {　
					this.newTabs = newTabs;
					if(this.newTabs == 0) {
						this.getMenuList()
					}
				},
				deep: true,
				immediate: true
			}
		},
		activated() {
			if(this.newTabs == 0) {
				this.getMenuList()
			}
			//			this.tableData=[]

		},
		mounted() {
			//			this.getMenuList()
		}
	}
</script>
<style scoped>

</style>