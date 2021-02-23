<template>
  <div class='main conMain'>
    <div class="mainTop">
      <Form :model="formSearch" inline :label-width="70">
        <FormItem label="所属组织">
          <Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format"
            style="width:170px"></Cascader>
        </FormItem>
        <FormItem label="姓名" class='personName'>
          <Input v-model="formSearch.personName" placeholder="请输入姓名" style="width:170px"></Input>
        </FormItem>
        <FormItem label="证件号码" class='personId'>
          <Input v-model="formSearch.personId" placeholder="请输入证件号码" style="width:170px"></Input>
        </FormItem>
        <FormItem label="联系方式" class='personPhone'>
          <Input v-model="formSearch.personPhone" placeholder="请输入联系方式" style="width:170px"></Input>
        </FormItem>
				<FormItem label="账号类型">
					<Select v-model="formSearch.staffType" style="width:170px;" clearable>
						<Option :value='1'>平台端</Option>
						<Option :value='2'>移动端</Option>
						<Option :value='3'>平台+移动端</Option>
					</Select>
				</FormItem>
        <FormItem label="在离线判定时间(分钟)" class='secondTime'>
          <Input v-model="secondTime" placeholder="分钟" style="width:110px"></Input>
        </FormItem>
      </Form>
      <div class="btnWrapper">
        <Button type="error" @click='handleSomeDelete' style="margin-right: 30px;" v-has='840'>批量删除</Button>
        <Button type="success" @click='handleAdd' style="margin-right: 30px;" v-has='945'>新增</Button>
        <Button type="primary" @click='handleSearch'>查询</Button>
      </div>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' @on-selection-change='selectChange'
        highlight-row :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="perCylinder">
          <Button type="success" size="small" @click="seeInfo(row.staffId)">责任钢瓶</Button>
        </template>
        <template slot-scope="{ row, index }" slot="carArr">
          <span v-if='row.carNumArr=="无"'>{{row.carNumArr}}</span>
          <span v-for='item in row.carNumArr' :key='item' v-else style="background:#e8f0fe;display: inline-block;margin: 0 3px;padding:0 2px;border-radius: 2px;">{{item}}</span>
        </template>

        <template slot-scope="{ row, index }" slot="newPost">
          <span v-for='item in row.newPost' :key='item' style="background:#e8f0fe;display: inline-block;margin: 0 3px;padding:0 2px;border-radius: 2px;">{{item}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
        	<Button type="warning" size="small" style="margin-right: 5px" @click="roleConfigClick(row.staffId,row.staffName)">分配角色</Button>
          <Button type="info" size="small" style="margin-right: 5px" @click="edit(row.staffId)" v-has='839'>编辑</Button>
          <Button type="error" size="small" @click="remove(row.staffId)" v-has='840'>删除</Button>
        </template>
      </Table>
      <div class="pageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage'></Page>
      </div>
    </div>
    <resCylinder v-if='bottleBindInfo' :conKeys='conKeys' @bindBottleSee='bindBottleSee' :keyWord='keyWord'></resCylinder>
    <cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>
  </div>
</template>

<script>
  import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import resCylinder from '@/pages/comComponent/responsibleCylinder.vue';
	import cylMap from '@/pages/comComponent/cylMaps';
	export default {
		name: 'mobilePerson',
		components: {
			resCylinder,
			cylMap
		},
		data() {
			return {
				options: [],
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				secondTime: 10,
				langs: '',
				lats: '',
				addressInfo: false,
				
				selectArr: [],
				keyWord: 'staffId',
				bottleBindInfo: false,
				conKeys: '',
				dataList: [],
				count: 0,
				curpage: 1,
				pagesSize: 10,
				loading: false,
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch: {
					personName: '',
					personPhone: '',
					personId: '',
					staffType:'',
					organize: ''
				},
				columns: [{
						title: '当前定位',
						key: 'carType',
						align: 'center',
						width: '95',
						fixed: 'left',
						render: (h, params) => {
							let that = this
							return h('img', {
								attrs: {
									src: params.row.carType
								},
								style: {
									cursor: 'pointer'
								},
								on: {
									click() {
										that.langs = params.row.lon
										that.lats = params.row.lat

										that.addressInfo = true;
									}
								}
							}, params.row.carType);

						}

					}, {
						type: 'selection',
						width: 60,
						align: 'center',

					}, {
						title: '序号',
						//						type: 'index',
						width: 100,
						align: 'center',
						key: 'newIndex',
						fixed: 'left'
					},
					{
						title: '所属组织',
						key: 'staffDeptName',
						minWidth: 350,
						align: 'center',
					},
					{
						title: '账号类型',
						key: 'staffTypeName',
						minWidth: 165,
						align: 'center',
					},
					{
						title: '姓名',
						key: 'staffName',
						minWidth: 160,
						align: 'center',
					},
					{
						title: '工号',
						key: 'staffWorkCode',
						minWidth: 165,
						align: 'center',
					},
					{
						title: '联系方式',
						key: 'staffAccount',
						minWidth: 160,
						align: 'center',
					},
					{
						title: '角色名称',
						key: 'staffIdentityName',
						minWidth: 250,
						align: 'center',
						slot: 'newPost'
					},
					{
						title: '责任钢瓶',
						slot: 'perCylinder',
						minWidth: 110,
						align: 'center',
					},
					{
						title: '车牌号',
						slot: 'carArr',
						minWidth: 240,
						align: 'center',
					},
					{
						title: '证件号码',
						key: 'staffIdCardNumber',
						minWidth: 200,
						align: 'center',
					},
					{
						title: '地址',
						key: 'staffAddress',
						minWidth: 300,
						align: 'center',
					},				
					{
						title: '移动设备信息',
						key: 'mobileEquipment',
						minWidth: 220,
						align: 'center',

					},
						
					{
						title: '建档时间',
						key: 'staffCreateTime',
						minWidth: 180,
						align: 'center',
					},
					{
						title: '工作状态',
						key: 'workStatus',
						minWidth: 140,
						align: 'center',
					}, {
						title: '操作',
						slot: 'action',
						fixed: 'right',
						width: 250,
						align: 'center'
					}
				]
			}
		},
		methods: {
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				//				console.log(labels, selectedData)
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			changeCascader(value, selectedData) {
				this.formSearch.organize = ''

				if(value.length) {
					this.formSearch.organize = value[value.length - 1]
				} else {
					this.formSearch.organize = ''
				}

			},
			//查看地图定位
			handleAdSee(data) {
				this.addressInfo = data
			},
			selectChange(selection) {
				this.selectArr = []
				if(selection) {
					for(let item of selection) {
						this.selectArr.push(item.staffId)
					}

				}
			},
			//删除
			remove(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.deptstaffDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getMobileList()
									})
								});

							}

						})
					},

				});
			},

			//获取移动人员列表
			getMobileList() {
				this.loading = true
				this.selectArr = []
				_http.http1('post', pathUrls.deptstaffList, {
					'staffDeptId': this.formSearch.organize,
					'page': this.curpage,
					"limit": this.pagesSize,
					'staffName': this.formSearch.personName,
					'phone': this.formSearch.personPhone,
					'idCard': this.formSearch.personId,
					'staffType':this.formSearch.staffType,
					'secondTime': this.secondTime || 10
				}, 'form').then((res) => {
					this.loading = false
					for(let [item, index] of new Map(res.data.list.map((item, i) => [item, i]))) {
						if(item.lon && item.staffOnDuty) {
							item.carType = require('../../../../src/assets/images/ad.png');
						} else if(item.lon && !item.staffOnDuty) {

							item.carType = require('../../../../src/assets/images/adhui.png');
						}
						if(item.carNumbers != '无') {
							item.carNumArr = item.carNumbers.split(",");
						} else {
							item.carNumArr = '无';
						}
						if(item.staffIdentityName) {
							item.newPost = item.staffIdentityName.split(",");
						} else {
							item.newPost = [];
						}
						if(item.staffType==1){
							item.staffTypeName='平台端'
						}else if(item.staffType==2){
							item.staffTypeName='移动端'
						}else{
							item.staffTypeName='平台+移动端'
						}
						item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);

					}
					//					console.log(res.data)
					this.dataList = res.data.list
					this.count = res.data.totalCount
					if(this.dataList.length > 10) {
						this.tableHeight=this.screeHeight-270;
					} else {
						this.tableHeight = 'auto';
					}

				})
			},
			roleConfigClick(id,staffName){
				
				this.$router.push('/mobilePerson/roleConfig' + '/' + id +'/'+staffName)
				
			},
			//点击编辑
			edit(id) {
				this.$router.push('/mobilePerson/editPerson' + '/' + id)
			},
			//关闭
			bindBottleSee(data) {
				this.bottleBindInfo = data
			},
			//查看责任钢瓶详情
			seeInfo(id) {
				this.bottleBindInfo = true
				this.conKeys = id

			},
			//批量删除
			handleSomeDelete() {
				if(!this.selectArr.length) {
					this.$Message['warning']({
						background: true,
						content: '请选择删除项!',
						duration: 1
					});
					return false
				} else {
					this.$Modal.confirm({
						title: '是否删除？',
						content: '',
						onOk: () => {
							_http.http2('post', pathUrls.deptstaffDelete,
								JSON.stringify(this.selectArr)
							).then((res) => {
								if(res.code == 0) {
									this.$Message['success']({
										background: true,
										content: '删除成功!',
										onClose: (() => {
											this.selectArr = []
											this.getMobileList()
										})
									});

								}

							})
						},

					});
				}
			},
			//新增
			handleAdd() {
				this.$router.push('/mobilePerson/addPerson')
			},
			//查询
			handleSearch() {
				this.curpage = 1
				this.getMobileList()
			},
			//改变页数
			pageChange(current) {
				this.curpage = current
				this.getMobileList()

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getMobileList()

			},

		},
		activated() {
			this.getMobileList();
		},
		mounted() {
			// this.getMobileList()

			this.common.getDeptList(this.userData.staffDeptId).then((res) => {
				this.options = this.common.getConDept(res.data)
			})
		}
	}
</script>

<style type="text/css" scoped>
  .main {
    margin-right: 10px;
    background: #FFFFFF;
    min-height: calc(100% - 10px);
  }

  .mainTop {
    padding: 10px 10px 0;
    width: 100%;
    text-align: left;
  }

  .mainTop>>>.ivu-form-item {
    margin-bottom: 8px;
  }

  .mainTop>>>.ivu-select-group-title {
    width: 188px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mainTop>>>.ivu-select-item {
    font-size: 12px !important;
    font-weight: 600;
  }

  .personName>>>label {
    width: 96px !important;
  }

  .secondTime>>>label {
    width: 156px !important;
  }

  .secondTime>>>.ivu-form-item-content {
    margin-left: 156px !important;
  }

  .personName>>>.ivu-form-item-content {
    margin-left: 96px !important;
  }

  .mainContent {
    background: #fff;
    border-radius: 4px;
    padding: 10px 10px 20px;
  }

  .btnWrapper {
    text-align: right;
    padding-right: 20px;
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

  .mainContent>>>.ivu-table td {
    height: 44px;
  }

  .mainTop>>>.ivu-select-dropdown {
    overflow-x: hidden !important;
  }

  .mainTop>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
  }

  .mainTop>>>.ivu-select-group-title {
    width: 160px !important;
  }
</style>
