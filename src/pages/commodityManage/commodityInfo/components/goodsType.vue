<template>
	<div class='typeContent'>
				<div style="text-align: right;position: absolute;right:24px;top:4px;z-index: 100;">
					<Button type="success" @click='handleAddType' style="height: 28px;line-height: 28px;" v-has='949'>分类新增</Button>
				</div>
				<Table border :columns="columns" :data="goodsTypeList" :loading='loading' ref="table" :height='tableHeight'>
					<template slot-scope="{ row, index }" slot="goodsTypeName">
						<span v-if='!row.isEdit'>{{row.goodsTypeName}}</span>
						<Input type="text" v-else v-model="row.goodsTypeName" @on-keyup="row.goodsTypeName=row.goodsTypeName.replace(/^ +| +$/g,'')"/>
					</template>
					<template slot-scope="{ row, index }" slot="mainBusiness">
						<span v-if='!row.isEdit'>{{row.mainBusinessName}}</span>
						<Select v-model="row.mainBusiness" style="height: 28px;line-height: 28px;" v-else>
							<Option :value='1'>主营业务-液化气</Option>
							<Option :value='2'>主营业务-钢瓶</Option>
							<Option :value='3'>非主营业务</Option>
						</Select>
					</template>
					<template slot-scope="{ row, index }" slot="goodsType">
						<span v-if='!row.isEdit'>{{row.newTypeName}}</span>
						<Select v-model="row.goodsType" style="height: 28px;line-height: 28px;" v-else>
							<Option :value='1'>主销商品</Option>
							<Option :value='2'>其他</Option>
							<!--<Option :value='2'>微商城商品</Option>
							<Option :value='3'>营销活动商品</Option>
							<Option :value='4'>积分兑换商品</Option>-->
						</Select>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<Button type="info" size="small" style="margin-right:10px" @click="handleEdit(row.id, index)" v-show='!row.isEdit' v-has='950'>编辑</Button>
						<Button type="error" size="small" @click="remove(row.id)" v-show='!row.isEdit' v-has='951'>删除</Button>
						<Button type="primary" size="small" style="margin-right:10px" @click="handleSave(row,index)" v-if='row.isEdit'>保存</Button>
						<Button type="warning" size="small" @click="cancelClick(row.id,index)" v-if='row.isEdit'>取消</Button>
					</template>
				</Table>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import Bus from '@/public/bus';
	export default {
		name: 'goodsType',
		props:{
			tabsCheck:Number
		},
		data() {
			return {
        tableHeight:'auto',
        screeHeight: document.documentElement.clientHeight, // 屏幕高
				goodsTypeList: [],
				loading: false,
				columns: [{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center'
					}, {
						title: '分类名称',
						key: 'goodsTypeName',
						align: 'center',
						slot: 'goodsTypeName'
					},
					{
						title: '主营业务',
						key: 'mainBusiness',
						align: 'center',
						slot: 'mainBusiness'
					},
					{
						title: '商品类型',
						key: 'goodsType',
						align: 'center',
						slot: 'goodsType'
					},

					{
						title: '创建时间',
						key: 'createTime',
						align: 'center',
						width:170
					}, {
						title: '更新时间',
						key: 'updateTime',
						align: 'center',
						width:170
					}, {
						title: '操作',
						slot: 'action',
						width: 150,
						align: 'center'
					}
				]
			}
		},
		methods: {
			//获取商品类型
			getGoodsTypeList() {
				this.loading = true;
				_http.http1('post', pathUrls.goodstypeList, {}, 'form').then((res) => {
					this.loading = false;
					for(let item of res.data) {
						item.isEdit = false;
						if(item.mainBusiness==1){
							item.mainBusinessName='主营业务-液化气';
						}else if(item.mainBusiness==2){
							item.mainBusinessName='主营业务-钢瓶';
						}
						else if(item.mainBusiness==3){
							item.mainBusinessName='非主营业务';
						}
						if(item.goodsType==1){
							item.newTypeName='主销商品';
						}else if(item.goodsType==2){
							item.newTypeName='其他';
						}

					}
					this.goodsTypeList = res.data;
          if(this.goodsTypeList.length>10){
          	this.tableHeight=this.screeHeight -160;
          }else{
          	this.tableHeight='auto';
          }
				})
			},
			//新增类型
			handleAddType() {
				this.goodsTypeList.push({
					goodsTypeName: '',
					mainBusiness:'',
					mainBusinessName:'',
					newTypeName:'',
					goodsType:'',
					isEdit: true,
					id: ''
				})
			},
			//编辑
			handleEdit(id, index) {
				this.goodsTypeList[index].isEdit = true;
			},
			//删除
			remove(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.goodstypeDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										Bus.$emit('updateLis',true);
										this.getGoodsTypeList()
									})
								});

							}

						})
					},

				});
			},
			//保存
			handleSave(row, index) {
				let fData = {
					goodsTypeName: row.goodsTypeName,
					mainBusiness:row.mainBusiness,
					goodsType:row.goodsType
				}
				if(!fData.goodsTypeName) {
					this.$Message['warning']({
						background: true,
						content: '请填写分类名称!',
					});
					return false
				}
				if(fData.goodsTypeName.length > 10) {
					this.$Message['warning']({
						background: true,
						content: '分类名称过长!',
					});
					return false
				}
				if(!fData.mainBusiness) {
					this.$Message['warning']({
						background: true,
						content: '请选择主营业务!',
					});
					return false
				}
				if(!fData.goodsType) {
					this.$Message['warning']({
						background: true,
						content: '请选择商品类型!',
					});
					return false
				}
				let nameArr = [];
				for(let item of this.goodsTypeList) {
					if(fData.goodsTypeName == item.goodsTypeName&&fData.mainBusiness==item.mainBusiness&&fData.goodsType==item.goodsType) {

						nameArr.push(item.id);
					}
				}

				if(row.id) {
					fData.id = row.id;
					fData.createTime = row.createTime;
					fData.operator = row.operator;
					fData.orgId = row.orgId;

					if(nameArr.length&&fData.id!=nameArr[0]) {
						this.$Modal.confirm({
							title: '该分类已存在，是否继续修改？',
							content: '',
							onOk: () => {
								_http.http2('post', pathUrls.goodstypeUpdate, fData).then((res) => {
									if(res.code == 0) {
										this.$Message['success']({
											background: true,
											content: '修改成功!',
											onClose: (() => {
												Bus.$emit('updateLis',true)
												this.getGoodsTypeList()
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
					} else {
						_http.http2('post', pathUrls.goodstypeUpdate, fData).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '修改成功!',
									onClose: (() => {
										Bus.$emit('updateLis',true)
										this.getGoodsTypeList()
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
					}

				} else {
					if(nameArr.length) {
						this.$Modal.confirm({
							title: '该分类已存在，是否继续添加？',
							content: '',
							onOk: () => {
								_http.http2('post', pathUrls.goodstypeSave, fData).then((res) => {
									if(res.code == 0) {
										this.$Message['success']({
											background: true,
											content: '添加成功!',
											onClose: (() => {
												this.getGoodsTypeList()
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
					} else {
						_http.http2('post', pathUrls.goodstypeSave, fData).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '添加成功!',
									onClose: (() => {
										this.getGoodsTypeList()
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
					}

				}
			},
			//取消
			cancelClick(id, index) {
				if(!id) {
					this.goodsTypeList.splice(index, 1);
				} else {
					this.goodsTypeList[index].isEdit = false;
				}
			},
		},
		watch:{
			'tabsCheck':{
				handler(newTabs, oldTabs) {　
					if(newTabs==0){
						this.getGoodsTypeList()
					}
				},
				deep: true,
				immediate: true
			}
		},
		mounted() {
		}
	}
</script>

<style type="text/css" scoped>

	.typeContent>>>.ivu-table-wrapper {
		overflow: visible;
	}
	.typeContent>>>.ivu-select-single,
	.typeContent>>>.ivu-select-selection,
	.typeContent>>>.ivu-select-selected-value {
		height: 28px;
	}
</style>
