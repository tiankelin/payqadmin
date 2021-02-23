<template>
	<div class="main conMain">
		<div class="mainTop">
			<Button type="success" @click='handleAdd' v-has='797'>新增</Button>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="action">
					<Button type="info" size="small" style="margin-right: 5px" @click="handleEdit(row.typeId)" v-has='794'>编辑</Button>
					<Button type="error" size="small" @click="handleDelete(row.typeId)" v-has='783'>删除</Button>
				</template>
			</Table>
			<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'terminalType',
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				count: 0,
				curpage: 1,
				pagesSize: 10,
				loading: false,
				dataList: [],
				count: 0,
				curpage: 1,
				pagesSize: 10,
				userData: (JSON.parse(this.$store.state.userData)),
				columns: [{
						title: '类型名',
						key: 'typeName',
						align: 'center',
						tooltip:true
					},
					{
						title: '厂家',
						key: 'typeFactory',
						tooltip:true,
						align: 'center',
						minWidth:150
					},
					{
						title: '型号',
						key: 'typeModel',
						tooltip:true,
						align: 'center',
					},
					{
						title: '设备品类',
						key: 'newTypeCategory',

						align: 'center',
					},
					{
						title: '上行协议',
						key: 'typeUplinkProtocol',

						align: 'center',
					},
					{
						title: '下行协议',
						key: 'typeDownlinkProtocol',

						align: 'center',
					},
					{
						title: '操作',
						slot: 'action',
						width: '150',
						align: 'center'
					}

				]

			}
		},
		methods: {
			//删除
      	handleDelete(id){
      		this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {

						_http.http2('post', pathUrls.deptterminaltypeDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.getTerminalTypeList()
							}

						})
					},

				});
      	},
			//编辑
			handleEdit(id){
				this.$router.push('/terminalType/terTypeEdit/'+id);
			},
			//获取终端类型列表
			getTerminalTypeList() {
				this.loading = true
				_http.http1('post', pathUrls.terminaltypeList, {
					'page': this.curpage,
					"limit": this.pagesSize,
				}, 'form').then((res) => {
					this.loading = false
					for(let item of res.data){
						if(item.typeCategory=='4'){
							item.newTypeCategory='配送一体终端'
						}else if(item.typeCategory=='5'){
							item.newTypeCategory='门禁终端'
						}else if(item.typeCategory=='6'){
							item.newTypeCategory='危化车终端'
						}
					}
					this.dataList = res.data;
					this.count=res.count;
					if(this.dataList.length > 10) {
              this.tableHeight=this.screeHeight-200;
					} else {
              this.tableHeight='auto';

					}
				})
			},
			//新增
			handleAdd() {
				this.$router.push('/terminalType/terTypeAdd')
			},
			//改变页数
			pageChange(current) {
				this.curpage = current
				this.getTerminalTypeList()

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getTerminalTypeList()
			},
		},
		activated() {
				this.getTerminalTypeList()
      },
		mounted() {

		}
	}
</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		background: #fff;
		min-height: calc(100% - 10px);
	}

	.mainTop {
		background: #fff;
		height: 48px;
		line-height: 48px;
		text-align: left;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;

	}

	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;
	}

	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
	}

	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
</style>
