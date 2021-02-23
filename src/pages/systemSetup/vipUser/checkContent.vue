<template>
	<div class='checkMain'>
		<div class="checkContents">
			<Icon type="md-close" class='closeBtn' @click='closeClick' />
			<div>
				<span style="color: #E20CDB;font-weight: 600;font-size: 16px;">安检项选择</span>
			</div>
			<Form :model="formSearch" inline :label-width="100">
				<FormItem label="客户类型">
					<Select v-model="formSearch.userType" style="width:170px" clearable placeholder="请选择客户类型" @on-change='typeChange'>
						<Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="安检项目名称">
					<Select v-model="formSearch.securityName" style="width:170px" clearable placeholder="请选择安检项目名称" @on-change='nameChange'>
						<Option :value='item' v-for='(item,index) in nameList' :key='index'>{{item}}</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Button type="warning" @click='handleSelect'>选择</Button>
				</FormItem>
			</Form>
			<Table border :columns="columns" :data="dataList" :loading='loading' ref="table" @on-selection-change='getSelected'>

			</Table>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'checkContent',
		props:{
			vipUserId:Number
		},
		data() {
			return {
				selectContent:[],
				loading: false,
				userTypeList: [],
				nameList: [],
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch: {
					userType: '',
					securityName: ''
				},
				dataList: [],
				columns: [{
						type: 'selection',
						width: 60,
						align: 'center',
					},
					//					{
					//						title: '序号',
					//						type: 'index',
					//						width: 70,
					//						align: 'center',
					//					}, 
					{
						title: '客户类型',
						key: 'userTypeName',
						width: 140,
						align: 'center',
					},
					{
						title: '安检项目名称',
						key: 'typeName',
						width: 240,
						align: 'center',
					}, {
						title: '安检项详情',
						key: 'typeContent',
						align: 'center',
						minWidth: 200,
					},
					{
						title: '状态',
						key: 'newActive',
						align: 'center',
						width: 100,
					},
				]
			}
		},
		methods: {
			//获取选中项
			getSelected(v){		
				this.selectContent=[]
				if(v.length){
					for(let item of v){
						this.selectContent.push({
							userId:this.vipUserId,
							typeName: item.typeName,
							typeContent: item.typeContent,
							isActive: item.isActive,							
						})
					}
				}else{
					this.selectContent=[];
				}
				
			},
			//选择安检项
			handleSelect() {
				if(this.selectContent.length==0){
					this.$Message['warning']({
						background: true,
						content: '请选择安检项!',
					});
					return false
				}else{
					let fData={
						checkTypeList:this.selectContent
					}
					this.$Modal.confirm({
					title: '是否添加所选安检项？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.vipuserchecktypeSave, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '添加成功!',
								onClose: (() => {
									this.$emit('addSuc',true);
									this.$emit('contentCheck', false);
									
//									this.getContentsList()
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

				});
				}
			},
			nameChange() {
				this.getSecurityTypeList()
			},
			typeChange() {
				this.getSecurityTypeList()
			},			
			//获取安检项
			getSecurityTypeList() {
				this.loading = true
				_http.http1('post', pathUrls.querySecurityTypeList, {
					userType: this.formSearch.userType,
					typeName: this.formSearch.securityName,
				}, 'form').then((res) => {
					this.loading = false
					for(let item of res.data) {
						item.userType = +item.userType;
						if(item.isActive == 1) {
							item.newActive = '启用'
						} else if(item.isActive == 0) {
							item.newActive = '禁用'
						}

					}
					this.dataList = res.data;

				})
			},
			//获取安检项目名称
			getNameList() {
				_http.http2('get', pathUrls.querySecurityNameList + '?deptId=' + this.userData.deptId, {}, "form").then((res) => {
					if(res) {
						this.nameList = res.data;
					}
				})
			},
			//关闭
			closeClick() {
				this.$emit('contentCheck', false)
			}
		},
		mounted() {
			this.loading = true;
			this.getNameList();
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.userTypeList = res.data;
				if(this.userTypeList.length) {
					this.formSearch.userType = this.userTypeList[0].id;
				}
				this.getSecurityTypeList();
			})
		}
	}
</script>

<style type="text/css" scoped>
	.checkMain {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 1004;
	}
	
	.checkContents {
		position: relative;
		width: calc(100% - 210px);
		height: calc(100% - 86px);
		background: #fff;
		margin-top: 65px;
		margin-left: 200px;
		padding: 10px;
		text-align: left;
	}
	
	.closeBtn {
		position: absolute;
		right: 5px;
		top: 5px;
		font-size: 26px;
		cursor: pointer;
		color: #51b5ea;
	}
	
	.checkMain>>>.ivu-form-item {
		margin-bottom: 8px;
	}
</style>