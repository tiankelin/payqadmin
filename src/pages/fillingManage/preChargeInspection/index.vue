<template>
	<div class="main conMain">
		<div class='mainTop conMainTop'>
			<Form inline :label-width="100">

				<FormItem label="所属组织">
					<Cascader :data="options" placeholder="所属组织" style='width: 220px;' clearable change-on-select @on-change='changeCascader' :render-format="format"></Cascader>
				</FormItem>

				<FormItem class='conWrapper'>
					<Button type="primary" @click='handleSearch'>查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent conMainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>

			</Table>
			<div class="pageMain conPageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
			</div>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default {
		name: 'preChargeInspection',
		components: {
			cylInfo,
		},
		data() {
			return {

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
						title: '工序名称',
						key: 'operationName',
						minWidth: 160,
						align: 'center'
					},
					{
						title: '所属组织',
						key: 'deptName',
						minWidth: 300,
						align: 'center'
					},
					{
						title: '日期',
						key: 'createTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '钢瓶条码',
						key: 'bottleCode',
						minWidth: 200,
						align: 'center',
						render: (h, params) => {
							let that = this
							return h('span', {
								style: {
									color: '#1BA060',
									cursor: 'pointer'
								},
								on: {
									click() {
										that.infoSee = true
										that.tags = params.row.bottleCode
									}
								}
							}, params.row.bottleCode);
						},
					},
					{
						title: '电子标签编码',
						key: 'bottleTag',
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
										that.tags = params.row.bottleTag
									}
								}
							}, params.row.bottleTag);
						},
					},
					{
						title: '钢瓶规格',
						key: 'bottleSpec',
						minWidth: 120,
						align: 'center'
					},
					{
						title: '容积',
						key: 'volume',
						minWidth: 120,
						align: 'center'
					},
					{
						title: '温度',
						key: 'temperature',
						minWidth: 120,
						align: 'center'
					}, {
						title: '工号',
						key: 'jobNo',
						minWidth: 120,
						align: 'center'
					},
					{
						title: '操作员姓名',
						key: 'operator',
						minWidth: 140,
						align: 'center'
					},
					{
						title: '制造单位',
						key: 'bottleManufacturer',
						minWidth: 300,
						align: 'center'
					},
					{
						title: '出厂编号',
						key: 'bottleFactoryCode',
						minWidth: 200,
						align: 'center',

					},

					{
						title: '使用登记代码',
						key: 'registerCode',
						minWidth: 140,
						align: 'center'
					},
					{
						title: '充装介质',
						key: 'fillMedium',
						minWidth: 140,
						align: 'center'
					},
					{
						title: '末次检验时间',
						key: 'lastCheckTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '下次检验时间',
						key: 'nextCheckTime',
						minWidth: 180,
						align: 'center'
					},
					{
						title: '可疑气瓶',
						key: 'newSuspiciousBottle',
						minWidth: 100,
						align: 'center'
					},
					{
						title: '护罩损坏',
						key: 'newShieldDamage',
						minWidth: 100,
						align: 'center'
					},
					{
						title: '阀门损坏',
						key: 'newValveDamage',
						minWidth: 100,
						align: 'center'
					},
					{
						title: '瓶体裂纹',
						key: 'newBottleCrack',
						minWidth: 100,
						align: 'center'
					},
					{
						title: '瓶体焊疤',
						key: 'newBottleWeldingScar',
						minWidth: 100,
						align: 'center'
					},
					{
						title: '缺防震圈',
						key: 'newShockproofRing',
						minWidth: 100,
						align: 'center'
					},
					{
						title: '瓶体变形',
						key: 'newBottleDeformation',
						minWidth: 100,
						align: 'center'
					}, {
						title: '颜色不符',
						key: 'newColorMatch',
						minWidth: 100,
						align: 'center'
					}, {
						title: '瓶号不符',
						key: 'newBottleNumberMatch',
						minWidth: 100,
						align: 'center'
					}, {
						title: '介质不符',
						key: 'newMediumMatch',
						minWidth: 100,
						align: 'center'
					}, {
						title: '瓶体腐蚀',
						key: 'newBottleCorrode',
						minWidth: 100,
						align: 'center'
					},
					{
						title: '油脂污损',
						key: 'newGreaseStain',
						minWidth: 100,
						align: 'center'
					}, {
						title: '瓶体火烧',
						key: 'newBottleBurning',
						minWidth: 100,
						align: 'center'
					}, {
						title: '外观凹坑',
						key: 'newAppearancePit',
						minWidth: 100,
						align: 'center'
					}, {
						title: '阀门缺失',
						key: 'newValveMissing',
						minWidth: 100,
						align: 'center'
					}, {
						title: '瓶阀漏气',
						key: 'newBottleValveLeak',
						minWidth: 100,
						align: 'center'
					}, {
						title: '气体不纯',
						key: 'newImpureGas',
						minWidth: 100,
						align: 'center'
					}, {
						title: '瓶嘴损坏',
						key: 'newBottleMouthDamaged',
						minWidth: 100,
						align: 'center'
					},

				]
			}
		},
		methods: {

			getPrefillcheckList() {
				this.loading = true;
				_http.http1("post", pathUrls.prefillcheckList, {
					page: this.curpage,
					limit: this.pagesSize,
					deptId: this.organize,
				}, 'form').then((res) => {
					this.loading = false;
					if(res.code == 0) {
						for(let item of res.data) {
							item.newSuspiciousBottle = item.suspiciousBottle ? '√' : '×';
							item.newShieldDamage = item.shieldDamage ? '√' : '×';
							item.newValveDamage = item.valveDamage ? '√' : '×';

							item.newBottleCrack = item.bottleCrack ? '√' : '×';
							item.newBottleWeldingScar = item.bottleWeldingScar ? '√' : '×';
							item.newShockproofRing = item.shockproofRing ? '√' : '×';
							item.newBottleDeformation = item.bottleDeformation ? '√' : '×';
							item.newColorMatch = item.colorMatch ? '√' : '×';
							item.newBottleNumberMatch = item.bottleNumberMatch ? '√' : '×';
							item.newMediumMatch = item.mediumMatch ? '√' : '×';
							item.newBottleCorrode = item.bottleCorrode ? '√' : '×';
							item.newGreaseStain = item.greaseStain ? '√' : '×';
							item.newBottleBurning = item.bottleBurning ? '√' : '×';
							item.newAppearancePit = item.appearancePit ? '√' : '×';
							item.newValveMissing = item.valveMissing ? '√' : '×';
							item.newBottleValveLeak = item.bottleValveLeak ? '√' : '×';
							item.newImpureGas = item.impureGas ? '√' : '×';
							item.newBottleMouthDamaged = item.bottleMouthDamaged ? '√' : '×';
						}
						this.dataList = res.data;
						this.count = res.count;

						if(this.dataList.length > 10) {
							this.tableHeight = this.screeHeight - 200;
						} else {
							this.tableHeight = 'auto';
						}
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
				this.getPrefillcheckList();

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.curpage = 1;
				this.getPrefillcheckList();

			},

			//查询
			handleSearch() {
				this.curpage = 1;
				this.getPrefillcheckList();
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
			this.getPrefillcheckList();
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
		padding: 10px 10px 20px;
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