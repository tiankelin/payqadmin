<template>
	<div class="main conMain">
		<div class='mainTop conMainTop'>
			<Form inline :label-width="86">

				<FormItem label="所属组织">
					<Cascader :data="options" placeholder="所属组织" style='width: 220px;' clearable change-on-select @on-change='changeCascader' :render-format="format"></Cascader>
				</FormItem>
				<FormItem label="电子标签码">
					<Input v-model='tag' style='width: 170px;' @on-keyup="tag=tag.replace(/\s+/g,'')" placeholder="电子标签码" />
				</FormItem>
				<FormItem label="标签状态">
					<Select v-model='status' style='width: 170px;' clearable>
						<Option :value='0'>未绑定</Option>
						<Option :value='1'>绑定</Option>
						<Option :value='2'>销毁</Option>
					</Select>
				</FormItem>
				<FormItem class='conWrapper'>
					<Button type="primary" @click='handleSearch'>查询</Button>
					<Button type="success" @click='handleAdd' style="margin-left: 20px;" 
						v-has='"tagsList-add"'>新增</Button>
					<Button type="warning" @click='handleBatchUpdate' style="margin-left: 20px;" v-has='"tagsList-batchUpdate"'>批量修改</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent conMainContent">
			<Table @on-select="handleSelectRow" @on-select-cancel="handleCancelRow" @on-select-all="handleSelectAll" @on-select-all-cancel="handleSelectAll" ref="purchaseTable" border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="action">
					<Button size="small" type="info" style="margin-right: 10px;" @click='editClick(row.id)'>编辑</Button>
					<Button size="small" type="error" @click='deleteClick(row)'>删除</Button>
				</template>
			</Table>
			<div class="pageMain conPageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
			</div>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
		<batchUpdate v-if='batchShow' :selectIds='selectIds' @batch='batchMethod'></batchUpdate>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	import batchUpdate from './batchUpdate';
	export default {
		name: 'tagsList',
		components: {
			cylInfo,
			batchUpdate
		},
		data() {
			return {
				batchShow:false,
				selectIds: [],
				selectedSum: 0,
				selectedIds: new Set(), //选中的合并项的id
				status: '',
				tag: '',
				tags: '',
				infoSee: false,
				organize: '',
				pagesSize: 10,
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				sizeOpts: [10, 20, 50, 100, 200],
				curpage: 1,
				count: 0,
				loading: false,
				tableHeight: 'auto',
				dataList: [],
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				columns: [{
						type: 'selection',
						width: 80,
						align: 'center',
						fixed: 'left'
					}, {
						title: '电子标签编码',
						key: 'epc',
						minWidth: 200,
						align: 'center',
						render: (h, params) => {
							let that = this
							return h('span', {
								style: {
									color: '#EE6515',
									cursor: 'pointer'
								},
								on: {
									click() {
										that.infoSee = true
										that.tags = params.row.epc;
									}
								}
							}, params.row.epc);
						},
					}, {
						title: '所属组织',
						key: 'deptName',
						minWidth: 300,
						align: 'center'
					}, {
						title: '绑定时间',
						key: 'bindTime',
						minWidth: 170,
						align: 'center'
					}, {
						title: '创建时间',
						key: 'createTime',
						minWidth: 170,
						align: 'center'
					}, {
						title: '销毁时间',
						key: 'destoryTime',
						minWidth: 170,
						align: 'center'
					}, {
						title: '状态',
						key: 'newStatus',
						minWidth: 120,
						align: 'center'
					}
					//					,{
					//						title: '操作',
					//						key: 'action',
					//						width: 150,
					//						align: 'center',
					//						fixed: 'right',
					//						slot:'action',
					//					}

				]
			}
		},
		methods: {
		//批量修改
      handleBatchUpdate(){
        let newSelectedIds=[...this.selectedIds];
        this.selectIds=newSelectedIds;
        if(this.selectIds.length){
             this.batchShow=true;
        }else{
          this.$Message['warning']({
                background: true,
                content:"请先选择修改项!"
              });
        }
      },
      batchMethod(data){
        this.batchShow=false;
        if(data==2){
            this.getDepttagList();
            this.selectedIds.clear();
            this.selectedSum=0;
        }

      },
	// cy 全选和取消全选时触发
	handleSelectAll(selection) {
		// 取消全选 数组为空
		if(selection.length === 0) {
			// cy 若取消全选，删除保存在selectedIds里和当前table数据的id一致的数据，达到，当前页取消全选的效果
			// 当前页的table数据
			let data = this.$refs.purchaseTable.data

			data.forEach((item) => {
				if(this.selectedIds.has(item.id)) {
					this.selectedIds.delete(item.id)
				}
			})
		} else {
			selection.forEach(item => {
				this.selectedIds.add(item.id)
			})
		}
		//同步
		this.selectedSum = this.selectedIds.size
		// console.log(this.selectedIds)
	},

			//  选中某一行
			handleSelectRow(selection, row) {
				this.selectedIds.add(row.id)
				this.selectedSum = this.selectedIds.size
			},
			//  取消某一行
			handleCancelRow(selection, row) {
				this.selectedIds.delete(row.id)
				this.selectedSum = this.selectedIds.size
			},
			setChecked() {
				// 找到绑定的table的ref对应的dom，找到table的objData对象，objData保存的是当前页的数据
				let objData = this.$refs.purchaseTable.objData
				// console.log(objData)
				for(let index in objData) {
					// cy 设置审批状态为拒绝的采购单的默认勾选状态为 禁止
					// if (objData[index].bottleCode === '3057333334') {
					//   objData[index]._isDisabled = true
					// }
					if(this.selectedIds.has(objData[index].id)) {
						// console.log(index,objData[index].bottleCode)

						// cy 弊端 每次切换select都会触发table的on-select事件
						// this.$refs.purchaseTable.toggleSelect(index) // 在保存选中的ids的set合集里找与当前页数据id一样的行，使用toggleSelect（index），将这一行选中
						// cy 改进
						objData[index]._isChecked = true

					}
				}
			},
			
			//新增
			handleAdd() {
				this.$router.push('/tagsList/tagsAdd');
			},
			getDepttagList() {
				this.loading = true;
				_http.http1("post", pathUrls.depttagList, {
					page: this.curpage,
					limit: this.pagesSize,
					deptId: this.organize,
					tag: this.tag,
					status: this.status
				}, 'form').then((res) => {
					this.loading = false;
					if(res.code == 0) {
						for(let item of res.data) {
							if(item.tagStatus == 0) {
								item.newStatus = '未绑定';
							} else if(item.tagStatus == 1) {
								item.newStatus = '绑定';
							} else {
								item.newStatus = '销毁';
							}

						}
						this.dataList = res.data;
						this.count = res.count;

						if(this.dataList.length > 10) {
							this.tableHeight = this.screeHeight - 225;
						} else {
							this.tableHeight = 'auto';
						}
						setTimeout(() => {
							this.setChecked()
						}, 50)
					}

				}).catch(() => {
					this.loading = false;
				})
			},
			//关闭钢瓶详情
			handleSee(data) {
				this.infoSee = data
			},

			//改变页数
			pageChange(current) {
				this.curpage = current;
				this.getDepttagList();

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.curpage = 1;
				this.getDepttagList();

			},

			//查询
			handleSearch() {
				this.curpage = 1;
				this.getDepttagList();
			},
			//改变组织
			changeCascader(value) {
				if(value.length) {
					let id = value[value.length - 1];
					this.organize = id;

				} else {
					this.organize = null;

				}

			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
		},
		activated() {
			this.getDepttagList();
		},

		mounted() {

			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		min-height: calc(100% - 10px);
		background: #fff;
	}
	
	.mainTop>>>.ivu-cascader .ivu-cascader-menu {
		background: #fff !important;
	}
	
	.mainTop {
		padding: 10px 10px 0;
		width: 100%;
		text-align: left;
	}
	
	.mainTop>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 0 10px 20px;
	}
	
	.conWrapper>>>.ivu-form-item-content {
		margin-left: 10px !important;
	}
	
	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
		display: flex;
	}
</style>