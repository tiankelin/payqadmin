<template>
	<div>
		<div style="text-align: right;position: absolute;right:-6px;top:0;z-index: 100;">
			<Button type="success" @click='handleChangeAdd' v-has='15' style="margin-right: 46px;">新增</Button>
		</div>
		<vxe-table :loading="loading" :max-height='tableHeight' :radio-config="{labelField: 'name'}" border resizable show-overflow highlight-hover-row highlight-current-row row-key row-id="moduleId" :tree-config="{children: 'children',line: true,expandRowKeys: defaultExpandKeys}" :data="tableData1">
			<!--<vxe-table-column type="radio" title="菜单名称" tree-node></vxe-table-column>-->
			<vxe-table-column field="moduleName" title="菜单名称" tree-node></vxe-table-column>
			<vxe-table-column field="moduleId" title="菜单ID" align='center'></vxe-table-column>
			<vxe-table-column field="type1" title="模块类别" align='center'></vxe-table-column>
			<vxe-table-column field="moduleSeq" title="排序号" align='center'></vxe-table-column>

			<vxe-table-column title="操作" align='center' width="150">
				<template v-slot="{ row }">
					<vxe-button @click='handleChangeEdit(row.moduleId)' type="info" style='background-color:#2db7f5;border-color:#2db7f5;color: #fff;height: 24px;line-height: 20px;padding:0 8px;'>编辑</vxe-button>
					<vxe-button @click='handleChangeDelete(row.moduleId)' type="info" style='background-color:#ed4014;border-color:#ed4014;color: #fff;height: 24px;line-height: 20px;padding:0 8px;'>删除</vxe-button>
				</template>
			</vxe-table-column>

		</vxe-table>
	</div>

</template>
<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';

	export default {
		name: 'bindBottleMenu',
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
				tableData1: [],
				newTabs: null
			}
		},

		methods: {

			//获取bang瓶侠菜单列表
			getSysapplicationmoduleTree() {
				this.loading = true;
				this.tableData1 = [];
				this.common.getAppMenuTree(2).then((res) => {
					this.loading = false;
					this.defaultExpandKeys = [res.data[0].moduleId]
					this.tableData1 = this.common.getMenus(res.data)
					this.tableHeight = this.screeHeight - 150;
				})

			},
			//添加
			handleChangeAdd() {
				this.$router.push({
					path: '/menuManage/addAppMenu/2'
				});
			},
			//编辑
			handleChangeEdit(id) {
				this.$router.push({
					path: '/menuManage/editAppMenu/2/' + id
				});

			},
			//删除
			handleChangeDelete(id) {
				//				if(this.menuId) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http1('post', pathUrls.sysapplicationmoduleDelete, {
							moduleId: id
						}, 'form').then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getSysapplicationmoduleTree();
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
					if(this.newTabs == 2) {
						this.getSysapplicationmoduleTree()
					}
				},
				deep: true,
				immediate: true
			}
		},
		activated() {
			if(this.newTabs == 2) {
				this.getSysapplicationmoduleTree()
			}
			//			this.getSysapplicationmoduleTree()

		},
		mounted() {
			//			this.getSysapplicationmoduleTree()
		}
	}
</script>
<style scoped>

</style>