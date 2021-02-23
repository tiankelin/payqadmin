<template>
	<div class=mainBorder>
		<div class='mainHeader'>
      功能配置 ——
      <span style="color: rgb(22, 194, 19);font-weight: 600;">{{$route.params.roleName}}</span>
      <Icon type="md-close"  class='closeIcon' @click='moduleBack'/>
      </div>
		<div class="mainBody">
			<Tabs :animated="false" @on-click='tabsChange' v-model='tabsValue'>
				<TabPane label="送气侠" v-if='this.$route.params.appStatus1 == 1'>
					<dragTreeTable :beforeDragOver="beforeDragOver" onlySameLevelCanDrag resize :data="treeData" :onDrag="onTreeDataChange"  hightRowChange></dragTreeTable>
				</TabPane>
				<TabPane label="bang瓶侠 " v-if='this.$route.params.appStatus2 == 1'>
					<dragTreeTable :beforeDragOver="beforeDragOver" onlySameLevelCanDrag resize :data="treeData1 " :onDrag="onTreeDataChange1 "  hightRowChange></dragTreeTable>
				</TabPane>
			</Tabs>
			<div class="mainBodyButton">
				<Button type="primary" @click='moduleEnter' style="margin-right: 30px;" :disabled="isDisabled">确定</Button>
				<Button type="" @click='moduleBack'>返回</Button>
			</div>
		</div>
		<div class='selectBg' v-if='selectShow'>
			<div class="selectWrapper">
				<Form inline :label-width="70">
					<FormItem label="下级页面">
						<Select v-model="pageSelect" style="width:186px;text-align: left;" placeholder="请选择下级页面">
							<Option v-for="item in pageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
					</FormItem>
					<FormItem label="传递参数" v-if='showParams'>
						<Input v-model="targetParams" placeholder="请输入传递参数"></Input>
					</FormItem>
					<FormItem style='margin-top: 15px;'>
						<Button type="success" @click='handleEnter' style="margin-right: 30px;height: 28px;" >确定</Button>
						<Button type="primary" @click='handleBack' style="height: 28px;">返回</Button>
					</FormItem>
				</Form>

			</div>
		</div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import dragTreeTable from 'drag-tree-table'
	export default {
		name: 'moduleAssign',
		components: {
			dragTreeTable
		},
		data() {
			return {
				isDisabled:false,
				showParamsList:['dev'],
				showParams:true,
				userData: (JSON.parse(this.$store.state.userData)),
				newSelect: [],
				newSelect1:[],
				tabsValue: 0,
				selectData: [],
				newCategory: '',
				newId: '',
				newFid:[],
				newFid1:[],
				newData: {},
				selectShow: false,
				pageSelect: '',
				targetParams: '',
				pageList: [],
				fid:[],

				treeData: {
					lists: [],
					custom_field: {
						lists: 'modules',
						id: 'moduleId',
						parent_id: 'moduleParentId',

					},
					columns: [{
							type: 'checkbox',
							width: 60,
							isContainChildren: true,
							align: 'center',
							onChange: (selectRows) => {

								this.newFid=[];
								let newRows=selectRows;
									for(let item of selectRows){
										this.treeData.lists.forEach(lis=>{
											if(item.moduleParentId==lis.moduleId){
												newRows.push(lis)
											}
											if(lis.modules.length){
												lis.modules.forEach(liss=>{
													if(item.moduleParentId==liss.moduleId){
														newRows.push(liss)
													}
													if(liss.modules.length){
														liss.modules.forEach(lisss=>{
															if(item.moduleParentId==lisss.moduleId){
																newRows.push(lisss)
															}
														})
													}
												})
											}
										})
									}


								let obj = {};
								let peon = newRows.reduce((cur,next) => {
								    obj[next.moduleId] ? "" : obj[next.moduleId] = true && cur.push(next);
								    return cur;
								},[])

//								for(let item of peon){
//									this.newFid.push(item.moduleId);
//								}
								this.newFid=peon;
								this.getNews(this.treeData.lists,this.newFid);
								this.getCheck(peon)


							},
						},
						{
							type: 'selection',
							title: '送气侠模块名称',
							field: 'moduleName',
							width: 300,
							align: 'left',

						},
						{
							title: '模块类别',
							field: 'newType',
							width: 200,
							align: 'center',

						},
						{
							title: '下级页面',
							type: 'action',
							width: 350,
							align: 'center',
							actions: [{
								text: '分配',
								onclick: this.onEdit,
								formatter: (item) => {
									if(item.moduleCategory != 2) {
										return '<i>分配</i>'
									}

								}
							}]
						},
					]
				},
				treeData1: {
					lists: [],
					custom_field: {
						lists: 'modules',
						id: 'moduleId',
						parent_id: 'moduleParentId'
					},
					columns: [{
							type: 'checkbox',
							width: 60,
							isContainChildren: true,
							align: 'center',
							onChange: (selectRows) => {
								this.newFid1=[];
								let newRows=selectRows;
								for(let item of selectRows){
									this.treeData1.lists.forEach(lis=>{
										if(item.moduleParentId==lis.moduleId){
											newRows.push(lis)
										}
										if(lis.modules.length){
											lis.modules.forEach(liss=>{
												if(item.moduleParentId==liss.moduleId){
													newRows.push(liss)
												}
												if(liss.modules.length){
													liss.modules.forEach(lisss=>{
														if(item.moduleParentId==lisss.moduleId){
															newRows.push(lisss)
														}
													})
												}
											})
										}
									})
								}


								let obj = {};
								let peon = newRows.reduce((cur,next) => {
								    obj[next.moduleId] ? "" : obj[next.moduleId] = true && cur.push(next);
								    return cur;
								},[])
								for(let item of peon){
									this.newFid1.push(item.moduleId);
								}
								this.getNews(this.treeData1.lists,this.newFid1);

								this.getCheck1(peon)

							}
						},
						{
							type: 'selection',
							title: 'bang瓶侠模块名称',
							field: 'moduleName',
							width: 300,
							align: 'center',

						},
						{
							title: '模块类别',
							field: 'newType',
							width: 200,
							align: 'center',

						},
						{
							title: '下级页面',
							type: 'action',
							width: 350,
							align: 'center',
							actions: [{
								text: '分配',
								onclick: this.onEdit,
								formatter: (item) => {
									if(item.moduleCategory != 2) {
										return '<i>分配</i>'
									}

								}
							}]
						},
					]
				},
			}
		},
		methods: {
			getNews(fas,fid){
//				console.log(fas)
				setTimeout(()=>{
					return fas.map((fa) => {
						fa.checked=false;

					fid.forEach(items=>{
						if(fa.moduleId===items.moduleId){
							fa.checked=true;
						}
						if(fa.modules.length > 0) {
						this.getNews(fa.modules,fid);
					}
					})

				})
				})



			},
			beforeDragOver(from, to, where) {
//				console.log(from)
				if(from.moduleCategory == 1){
					return true
				}
				else{
					return false
				}

			},
			//切换tabs
			tabsChange(v) {
				this.selectData = [];
				//				console.log(v)
			},
			//获取选中项
			getCheck1(selectData) {

				this.newSelect1 = []
				this.selectData = selectData
				if(this.selectData.length) {
					for(let item of this.selectData) {
						this.newSelect1.push({
							"roleModuleId": item.moduleId,
							"roleTarget": item.targets?item.targets:null,
							"roleTargetParams": item.targetsParams?item.targetsParams:null,
							//							'name':item.moduleName
						})
					}
				}
			},
			//获取选中项
			getCheck(selectData) {
//				console.log(selectData)
//				var returnedItem;
//				var findModule = ((arr, id) => {
//					arr.forEach((item) => {
//						if(item.moduleId == id) {
//							item.checked=true;
//							returnedItem = item;
//							return item;
//						} else if(item.modules.length > 0) {
//							findModule(item.modules, id);
//						}
//					})
//				})



//				this.getTitle(selectData)
//				console.log(selectData)
				this.newSelect = []
				this.selectData = selectData
				if(this.selectData.length) {
					for(let item of this.selectData) {

//						item.sec = findModule(this.treeData.lists, item.moduleParentId);
//						if(returnedItem.moduleParentId!=1&&returnedItem.moduleParentId!=2){
//						item.sec = findModule(this.treeData.lists,returnedItem.moduleParentId);
//						}
//						console.log(returnedItem)
						this.newSelect.push({
							"roleModuleId": item.moduleId,
							"roleTarget": item.targets?item.targets:null,
							"roleTargetParams": item.targetsParams?item.targetsParams:null,
							//							'name':item.moduleName
						})
					}

				}


			},
			//确定模块分配
			moduleEnter() {
			this.isDisabled = true;
			
//			console.log(this.newSelect)
//			console.log(this.newSelect1)
//			return false;
				_http.http2('post', pathUrls.applicationrole,
					[{'appCode':this.$route.params.appCode1,
					 'appStatus':this.$route.params.appStatus1,
					'positionId':this.$route.params.id,
					'deptStaffApplicationRoles':this.newSelect},{
					'appCode':this.$route.params.appCode2,
					'appStatus':this.$route.params.appStatus2,
					'positionId':this.$route.params.id,
					'deptStaffApplicationRoles':this.newSelect1
					}
					]
				).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '分配成功!',
							duration:0.8,
//							onClose: (() => {


//							})
						});
						this.$router.go(-1);

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg
						});

					}
					if(res.code != 0) {
						this.isDisabled = false;
					}
				}).catch(err=>{
					this.isDisabled = false;
				})

			},
			//返回上一级
			moduleBack() {
				this.$router.go(-1)
			},
			//确定
			handleEnter() {
				this.newData.targets = this.pageSelect
				this.newData.targetsParams = this.targetParams
				for(let item of this.newSelect) {
					if(item.roleModuleId == this.newData.moduleId) {
						item.roleTarget = this.pageSelect?this.pageSelect:null
						item.roleTargetParams = this.targetParams?this.targetParams:null
					}
				}
				this.selectShow = false

			},
			//返回
			handleBack() {
				this.selectShow = false
			},

			//编辑
			onEdit(v) {
				this.pageList = [];
				this.pageSelect =v.moduleTargetCode;
				this.targetParams =v.moduleTargetParam;
				this.newData = v;
				this.newId = v.moduleParentId;
				this.newCategory = v.moduleCategory;
				this.selectShow = true
				var returnedItem;
				var returnedItem1=v;
				if(this.newCategory == 3) {
					this.pageList.push({
						label: '首页',
						value: 'home'
					})
				}
				var findModule = ((arr, id) => {
					arr.forEach((item) => {
						if(item.moduleId == id) {
							returnedItem = item;
							return item;
						} else if(item.modules.length > 0) {
							findModule(item.modules, id);
						}
					})
				})
				if(this.newId == 1 || this.newId == 2) {
					returnedItem=v
				}

				var item = findModule(this.treeData.lists, this.newId);
				if(returnedItem.moduleCategory==2){
				var item1 = findModule(this.treeData.lists,returnedItem.moduleParentId);
				}
//				console.log(returnedItem)
				if(returnedItem) {
//					if(returnedItem.moduleCategory == 2) {
//						this.pageList.push({
//							label: returnedItem.moduleName,
//							value: returnedItem.moduleCode
//						})
//					}
					var getPageList = ((arr) => {
						arr.forEach((item) => {
							if(item.moduleCategory == 2) {
								this.pageList.push({
									label: item.moduleName,
									value: item.moduleCode
								})
								return item;
							}
//							else if(item.modules.length > 0) {
//								getPageList(item.modules);
//							}
						})
					})
					var items = getPageList(returnedItem.modules)
					if(returnedItem!=returnedItem1){
					var items3 = getPageList(returnedItem1.modules)
					}

//						console.log(this.pageList)
					//					console.log(this.pageList)
				}

			},
			//拖曳排序
			onTreeDataChange(lists) {
//				console.log(lists)
				this.newSelect=[]
//								console.log(lists)
//				this.treeData.lists = lists
				this.treeData.lists = this.getTitle(lists)
			},
			//拖曳排序
			onTreeDataChange1(lists) {
				this.newSelect1=[]
//								console.log(lists)
//				this.treeData1.lists = lists
				this.treeData1.lists = this.getTitle1(lists)
			},



			getTitle(menus) {

				return menus.map((menu) => {
					if(menu.modules.length > 0) {
						this.getTitle(menu.modules);
					}
					menu.key = menu.moduleId;
					menu.targets = menu.moduleTargetCode;
					menu.targetsParams = menu.moduleTargetParam;

					if(menu.moduleCategory == 1) {

						menu.newType = '功能模块'
					} else if(menu.moduleCategory == 2) {
						menu.newType = '页面'
					} else {
						menu.newType = '按钮'
					}
					if(menu.moduleChooseFlag == 1) {
						this.newSelect.push({
							"roleModuleId": menu.moduleId,
							"roleTarget": menu.targets?menu.targets:null,
							"roleTargetParams": menu.targetsParams?menu.targetsParams:null,
						})
					}

					menu.checked = menu.moduleChooseFlag == 1 ? true : false;

					return menu;
				})
			},
			getTitle1(menus) {

				return menus.map((menu) => {
					if(menu.modules.length > 0) {
						this.getTitle(menu.modules);
					}
					menu.key = menu.moduleId;
					menu.targets = menu.moduleTargetCode;
					menu.targetsParams = menu.moduleTargetParam;

					if(menu.moduleCategory == 1) {

						menu.newType = '功能模块'
					} else if(menu.moduleCategory == 2) {
						menu.newType = '页面'
					} else {
						menu.newType = '按钮'
					}
					if(menu.moduleChooseFlag == 1) {
						this.newSelect1.push({
							"roleModuleId": menu.moduleId,
							"roleTarget": menu.targets?menu.targets:null,
							"roleTargetParams": menu.targetsParams?menu.targetsParams:null,
						})
					}

					menu.checked = menu.moduleChooseFlag == 1 ? true : false;

					return menu;
				})
			},
			//获取送气侠模块内容
			getModuleChooseList1() {
				_http.http1('post', pathUrls.moduleChoose, {
					'positionId': this.$route.params.id,
					"appCode": this.$route.params.appCode1,
				}, 'form').then((res) => {
					this.treeData.lists = this.getTitle(res.data)

				})
			},
			//获取bang瓶侠模块内容
			getModuleChooseList2() {
				_http.http1('post', pathUrls.moduleChoose, {
					'positionId': this.$route.params.id,
					"appCode": this.$route.params.appCode2,
				}, 'form').then((res) => {
					this.treeData1.lists = this.getTitle1(res.data)
				})
			}
		},
		mounted() {
			if(this.$route.params.appStatus1 == 1) {
				this.getModuleChooseList1()
			}
			if(this.$route.params.appStatus2 == 1) {
				this.getModuleChooseList2()
			}
			if(this.showParamsList.indexOf(this.userData.username)!=-1){
				this.showParams=true
			}else{
				this.showParams=false
			}

		}
	}
</script>

<style type="text/css" scoped>

	.mainBorder>>>.ivu-tabs-bar {
		margin: 0;
	}

	.mainBorder>>>.drag-tree-table {
		margin: 0 0 20px;
	}

	.mainBorder>>>.tree-column {
		padding: 0 12px;
	}

	.mainBorder>>>.drag-tree-table-header {
		height: 40px;
		line-height: 40px;
		background: #E2EEFF;
		color: #51B5EA;
	}

	.selectBg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .4);
	}

	.selectWrapper {
		width: 300px;
		height: 170px;
		background: #fff;
		position: fixed;
		top: 50%;
		left: 50%;
		margin-left: -150px;
		margin-top: -85px;
		/*box-shadow: 0px 0px 5px #ccc;*/
		padding: 20px 10px 10px;
		border-radius: 4px;
	}

	.selectWrapper>>>.ivu-form-item {
		margin-bottom: 8px;
	}
</style>
