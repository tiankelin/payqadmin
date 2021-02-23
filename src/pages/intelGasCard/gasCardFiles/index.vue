<template>
	<div class="main conMain">
		<div class='mainTop'>
			<Form :model="formSearch" inline :label-width="82">
        <FormItem label="所属组织">
        	<Cascader :data="options" clearable  change-on-select @on-change='changeCascader' :render-format="format" style="width:170px"></Cascader>
        </FormItem>
				<FormItem label="订气卡编号" class='cardNumber'>
					<Input v-model="formSearch.cardNumber" placeholder="请输入订气卡编号" style="width:170px" />
				</FormItem>
        <FormItem label="卡状态">
        	<Select v-model="formSearch.cardStatus" style="width:170px" clearable placeholder="请选择卡状态">
        		<Option :value='0'>未发放</Option>
        		<Option :value='1'>已发放</Option>
        		<Option :value='-1'>停用</Option>
        	</Select>
        </FormItem>

				<FormItem label="户号">
					<Input v-model="formSearch.houseHodeNumber" placeholder="请输入户号" style="width:170px" />
				</FormItem>
				<FormItem label="联系人">
					<Input v-model="formSearch.userName" placeholder="请输入联系人" style="width:170px" />
				</FormItem>

				<FormItem label="联系方式">
					<Input v-model="formSearch.phoneNumber" placeholder="请输入联系方式" style="width:170px" />
				</FormItem>
        <FormItem label="开始时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
				<!-- <FormItem label="时间">
					<Date-picker format="yyyy-MM-dd" v-model='formSearch.dateTime' type="daterange" placement="bottom-start" placeholder="选择日期" @on-change="timeChange" style="width:186px"></Date-picker>
				</FormItem> -->
			</form>
			<div class="btnWrapper" >
				<div class='numContent'><span>已发放:</span><span style="color:#19be6b">{{giveOut}}</span><span>未发放:</span><span style="color:rgb(241, 179, 12)">{{unissued}}</span><span>已停用:</span><span style="color:#f00">{{stopUse}}</span></div>
				<div>
				<!--<Button type="success" @click='handleFileImport' style="margin-right: 30px;">批量导入</Button>-->
				<Button type="warning" @click='handleFileEdit' style="margin-right: 30px;" v-has='620'>批量修改</Button>
				<Button type="success" @click='handleAdd' style="margin-right: 30px;" v-has='619'>新增</Button>
				<Button type="primary" @click='handleSearch'>查询</Button>
				</div>
			</div>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading' @on-selection-change='selectChange' highlight-row :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="action">
					<Button type="info" size="small" style="margin-right: 5px" @click="edit(row.cardId)" v-has='620'>编辑</Button>
					<Button type="error" size="small" @click="remove(row.cardId)" v-has='621'>删除</Button>
				</template>
			</Table>
			<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
			</div>
		</div>
		<div class='filEdit' v-if='showEdit'>
			<div class="filContent">
				<Form  :model="typeForm1"  :label-width="80">
					<FormItem label="所属组织" class='star organizeUnit'>
						<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }"  v-model="typeForm1.organizeUnit"   style="width: 250px;" @change='organizeSelected'></el-cascader>
					</FormItem>
					<FormItem label="卡状态" class='star'>
					<Select v-model="typeForm1.cardStatus" style="width:250px"  placeholder="请选择卡状态">
						<Option :value='0'>未发放</Option>
						<Option :value='1'>已发放</Option>
						<Option :value='-1'>停用</Option>
					</Select>
					</FormItem>
					<FormItem class='btnWrapper'>
						<Button type="primary" @click='enterClick' style='height: 28px;'>确定</Button>
						<Button style="margin-left: 8px;height: 28px;" @click='backClick' type="info">返回</Button>
					</FormItem>
				</Form>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'gasCardFiles',
		data() {
			return {
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				selectArr:[],
				showEdit:false,
				typeForm1:{
				organizeUnit:'',
				cardStatus:0,
				},
				giveOut:0,
				stopUse:0,
				unissued:0,
				count: 0,
				curpage: 1,
				pagesSize: 10,
				dataList: [{

				}],
				loading: false,
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch: {
					cardNumber: '',
					organize: '',
					houseHodeNumber: '',
					userName: '',
					cardStatus: '',
					phoneNumber: '',
					dateTime: ''
				},
				startTime: '',
				endTime: '',
				columns: [
				{
						type: 'selection',
						width: 100,
						align: 'center',
						fixed: 'left'
					},
					{
						title: '订气卡编号',
						key: 'cardCode',
						minWidth: 160,
						align: 'center',
						fixed:'left'
					},
					{
						title: '所属组织',
						key: 'cardDeptName',
						minWidth: 350,
						align: 'center',
            tooltip:true
					},
					{
						title: '户号',
						key: 'userAccountNumbers',
						minWidth: 160,
						align: 'center',
					},
					{
						title: '联系人',
						key: 'cardUserName',
						minWidth: 140,
						align: 'center',
					},
          {
          	title: '联系方式',
          	key: 'cardUserPhone',
          	minWidth: 140,
          	align: 'center',
          },
					{
						title: '求助对象',
						key: 'staffName',
						minWidth: 160,
						align: 'center',
					},

					{
						title: '用气类型',
						key: 'cardType',
						minWidth: 140,
						align: 'center',
					},
//					{
//						title: '5KG',
//						key: 'bottle5KG',
//						width: 80,
//						align: 'center',
//					},
//					{
//						title: '15KG',
//						key: 'bottle15KG',
//						width: 80,
//						align: 'center',
//					},
//					{
//						title: '50KG',
//						key: 'bottle50KG',
//						width: 80,
//						align: 'center',
//					},
					{
						title: '发放状态',
						key: 'newStatus',
						minWidth: 100,
						align: 'center',
					},
					{
						title: '生产厂家',
						key: 'cardManufacturer',
						minWidth: 300,
						align: 'center',
            tooltip:true
					},
					{
						title: '型号',
						key: 'cardModel',
						minWidth: 170,
						align: 'center',
					},
					{
						title: '建档时间',
						key: 'cardCreateTime',
						minWidth: 180,
						align: 'center',
					},
					{
						title: '发放时间',
						key: 'cardIssueTime',
						minWidth: 180,
						align: 'center',
					},
					{
						title: '修改时间',
						key: 'cardUpdateTime',
						minWidth: 180,
						align: 'center',
					},
					{
						title: '操作',
						slot: 'action',
						fixed: 'right',
						width: 150,
						align: 'center'
					}
				]
			}
		},
		methods: {
      //改变结束时间
        changeEndTime(v){
        	if(v){
        		let ends=v.substring(v.length-8);
        		let starts=v.substring(0,11);
        		if(ends=='00:00:00'){
        			this.endTime=starts+'23:59:59';
        		}else{
        			this.endTime=v;
        		}
        	}
        },
      //改变起始时间
        changeStartTime(v){
            this.startTime=v;

        },
			selectChange(selection) {
				this.selectArr = []
				if(selection) {
					for(let item of selection) {
						this.selectArr.push(item.cardId)
					}

				}
			},
			//删除
			remove(id){
			this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.deptcardDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getGasCardList()
									})
								});

							}

						})
					},

				});
			},
			//批量修改确定
			enterClick(){
			_http.http2('post', pathUrls.deptcardBatchUpdate, JSON.stringify({
					'ids': this.selectArr.toString(),
					'deptId': this.typeForm1.organizeUnit,
					'cardStatus': this.typeForm1.cardStatus,
				})).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {

								this.showEdit = false;
								this.typeForm1.organizeUnit =this.userData.deptId+'';
								this.typeForm1.cardStatus =0;
								this.getGasCardList()
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,

						});
					}
				})
			},
			//批量修改返回
			backClick(){
			this.showEdit=false;
			},
			//获取用气卡列表
			getGasCardList() {
				this.loading = true;
				this.selectArr=[];
				_http.http1('post', pathUrls.gasCardList, {
					'page': this.curpage,
					"limit": this.pagesSize,
					'cardCode':this.formSearch.cardNumber,
					'deptId':this.formSearch.organize,
					'userAccountNumbers':this.formSearch.houseHodeNumber,
					'userName':this.formSearch.userName,
					'userPhone':this.formSearch.phoneNumber,
					'cardState':this.formSearch.cardStatus,
			        'startCreateTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
			        'endCreateTime': this.endTime?(this.common.conformatDat(this.endTime,true)):'',
				}, 'form').then((res) => {
					this.loading = false;
					for(let item of res.data) {
						if(item.cardStatus == 0) {
							item.newStatus = '未发放'
						} else if(item.cardStatus == 1){
							item.newStatus = '已发放'
						}else if(item.cardStatus == -1){
							item.newStatus = '停用'
						}
						if(item.cardSpecification) {
							let newSpecification=JSON.parse(item.cardSpecification)
							item.bottle5KG = newSpecification.bottle5KG
							item.bottle15KG = newSpecification.bottle15KG
							item.bottle50KG = newSpecification.bottle50KG
						}else{
							item.bottle5KG =0
							item.bottle15KG =0
							item.bottle50KG =0
						}

					}
					this.giveOut=res.issueDetails.giveOut;
					this.stopUse=res.issueDetails.stopUse;
					this.unissued=res.issueDetails.unissued;
					this.dataList = res.data;
					this.count = res.count;
					if(this.dataList.length > 10) {
              this.tableHeight=this.screeHeight-310;
					} else {
              this.tableHeight = 'auto';
					}

				})
			},
			//改变时间选择器
			timeChange(v) {
				if(v.length) {
					this.startTime = v[0];
					this.endTime = v[1];
				} else {
					this.startTime = '';
					this.endTime = '';
				}

			},
			//批量导入
			handleFileImport() {

			},
			//批量修改
			handleFileEdit() {
				if(!this.selectArr.length) {
					this.$Message['warning']({
						background: true,
						content: '请选择修改项!',
						duration: 0.7
					});
					return false
				}else{
					this.showEdit=true;
				}

			},
			//批量修改选中组织下拉框
			organizeSelected(value) {
				if(value.length) {
					let id = value[value.length - 1];
					this.typeForm1.organizeUnit = id;

				}
			},
			//修改
			edit(id){
			this.$router.push('/gasCardFiles/cardEdit' + '/' + id)
			},
			//新增
			handleAdd() {
				this.$router.push('/gasCardFiles/cardAdd')
			},
			//查询
			handleSearch() {
				this.curpage = 1
				this.getGasCardList()
			},
			//改变页数
			pageChange(current) {
				this.curpage = current
				this.getGasCardList()

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize
				this.getGasCardList()

			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				//				console.log(labels, selectedData)
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			changeCascader(value, selectedData) {
				if(value.length) {
					this.formSearch.organize = value[value.length - 1]
				} else {
					this.formSearch.organize = ''
				}

			},
			organizeSelected(value){
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm1.organizeUnit = id
				}
			},
			
		},
		activated() {
				this.getGasCardList();
      },
		mounted() {
			this.common.getDeptList(this.userData.deptId).then((res) => {
			this.options = this.common.getConDept(res.data, 0, 0, 1)
		})
			this.typeForm1.organizeUnit=this.userData.deptId+'';
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



	.btnWrapper {
		display: flex;
		justify-content: space-between;
		/*text-align: right;*/
		padding:0 20px;
	}
	.numContent{
		line-height: 32px;
	}
	.numContent span{
		margin: 0 4px;
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
  .mainContent>>>.ivu-table td {
  	height: 40px;
  }
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	.filEdit{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background: rgba(0,0,0,.4);
		z-index: 1000;
	}
	.filContent{
		background: #FFFFFF;
		width: 380px;
		height: 200px;
		border-radius: 4px;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -190px;
		margin-top: -100px;
		padding:25px;
	}
	.filContent>>>.ivu-form-item{
		margin-bottom: 18px;
		text-align: left;
	}
	.btnWrapper>>>.ivu-form-item-content{
		margin-left: 0!important;
	}
	.main>>>.el-input__inner {
		height: 32px;
		line-height: 32px;
	}

	.mainContent>>>.el-input__icon {
		line-height: 32px;
	}
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	.mainTop>>>.ivu-cascader .ivu-cascader-menu{
		background: #fff!important;
	}
</style>
