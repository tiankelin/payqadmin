<template>
	<div class="main">
		<div class='mainTop'>分配</div>
		<div class="mainContent">
			<Form ref="typeForm" :model="typeForm" :label-width="90" class="formGoods">
				<FormItem label="商品名称" class='goodsName'>
					<Input v-model="typeForm.goodsName" readonly style="width: 380px;margin-right: 20px;" />
					<Button type="info" @click='handleAdd'>添加</Button>
				</FormItem>
			</Form>
			<div>
				<Form class='classList' :label-width="90"  v-for='(item,index) in formList' :key='index'>
					<FormItem label="客户类型" class='userType star'>
						<Select v-model="item.userType" style="width:220px" clearable placeholder="请选择客户类型">
							<Option v-for="items in userTypeList" :value="items.id" :key="items.id">{{ items.typeName }}</Option>
						</Select>
					</FormItem>
					<FormItem label="区域组织" class='star'>
						<el-cascader  :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="item.organizeOwn" @change='organizeSelected(item)' style="width: 220px;"></el-cascader>
					</FormItem>
					<FormItem label="分配单价" class='skuUnitPrice star'>
						<InputNumber :min='0' :max='100000' v-model="item.skuUnitPrice" style="text-align: center;width: 220px;" placeholder="请输入分配单价"  />
					</FormItem>
					<FormItem>
						<Button type="primary" @click='enterClick(item,index)'>确定</Button>
						<Button style="margin-left: 8px" @click='handleDelete(index,item)' type="error" v-if='item.isAble||index!=0'>删除</Button>
					</FormItem>
				</Form>
			</div>
		</div>
		<div style="position: absolute;top: 70px;right:32px;cursor: pointer;" @click='handleBackClick'>
			<Icon type="md-share-alt" style='color:#51B5EA;font-size: 34px;' />
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'commodityAllocate',
		data() {
			return {
				index: 1,
				formList: [{
					index: 1,
					userType: '',
					organizeOwn: '',
					skuUnitPrice: '',
					isAble:false,
					skuId:null
				}],
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				userTypeList: [],
				typeForm: {
					goodsName: '',
				},
				goodsId: '',
				updateTime: '',
				orgId: '',
				creater: '',
				createTime: ''
			}
		},
		methods: {
			//获取商品种类列表
			getGoodsSkuList() {
					this.formList = [],
					_http.http1('get', pathUrls.goodsSkuList + '?goodsId=' + this.$route.params.id, {}, 'form').then((res) => {
						if(res.data&&res.data.length) {
							res.data.forEach((item, index) => {
								this.index = res.data.length;
								this.formList.push({
									index: index + 1,
									userType: item.userType,
									organizeOwn: item.orgId + '',
									skuUnitPrice: item.skuUnitPrice,
									isAble:true,
									skuId:item.skuId
								})
							})

						} else {
							this.index=1;
							this.formList = [{
								index: 1,
								userType: '',
								organizeOwn: '',
								skuUnitPrice: '',
								isAble:false,
								skuId:null
							}];
						}
					})
			},
			//删除
			handleDelete(index,item) {
				if(item.isAble){
					let id=item.skuId;
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.deptgoodsskuDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getGoodsSkuList();
									})
								});

							}

						})
					},

				});	
					
				}else{
				this.formList.splice(index, 1);
				this.index--;	
				}
				
			},
			//添加
			handleAdd() {
				this.index++
					this.formList.push({
						index: this.index,
						userType: '',
						organizeOwn: this.userData.deptId + '',
						skuUnitPrice: '',
						isAble:false,
						skuId:null
					})
			},
			//返回
			handleBackClick() {
				this.$router.go(-1);
			},
			//点击确定
			enterClick(item, index) {				
				let fData = {
					goodsId: this.goodsId,
					userType: item.userType,
					unitPrice: item.skuUnitPrice,
					createTime: this.createTime,
					orgId: item.organizeOwn,
					updateTime: this.updateTime,
				}
				if(!fData.userType) {
					this.$Message['warning']({
						background: true,
						content: '请选择客户类型!',
					});
					return false
				}
				if(!fData.orgId) {
					this.$Message['warning']({
						background: true,
						content: '请选择区域组织!',
					});
					return false
				}
				if(!fData.unitPrice) {
					this.$Message['warning']({
						background: true,
						content: '请输入分配单价!',
					});
					return false
				}
				if(item.isAble){
					fData.skuId=item.skuId;	
					_http.http2('post', pathUrls.deptgoodsskuUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.getGoodsSkuList()
								//								this.$router.go(-1)
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
					
				}else{
				_http.http2('post', pathUrls.deptgoodsskuSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '分配成功!',
							onClose: (() => {
								this.getGoodsSkuList()
								//								this.$router.go(-1)
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
				
			},
			//改变组织
			organizeSelected(item) {
				if(item.organizeOwn.length) {
					let id = item.organizeOwn[item.organizeOwn.length - 1];
					this.formList[item.index - 1].organizeOwn = id;
				} else {
					this.formList[item.index - 1].organizeOwn = '';
				}
			},
			//获取详情
			getDeptgoodsInfo() {
				_http.http1('get', pathUrls.deptgoodsInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					this.typeForm.goodsName = res.deptGoods.goodsName;
					this.createTime = res.deptGoods.createTime;
					this.goodsId = res.deptGoods.goodsId;
					this.updateTime = res.deptGoods.updateTime;
					this.orgId = res.deptGoods.orgId;
					this.creater = res.deptGoods.creater;
				})
			},

		},
		mounted() {

			this.common.getOrganizeList(this.userData.deptId).then((res) => {
				this.options = this.common.getLabel(res)
			})
			//获得用户类型
			this.common.getUserTypeList(this.userData.deptId).then((res)=>{
			this.userTypeList = res.data;
		})
			this.formList[0].organizeOwn = this.userData.deptId + '';
			this.getDeptgoodsInfo();			
			this.getGoodsSkuList();
		}
	}
</script>
<style type="text/css" scoped>
	.main {
		overflow: hidden;
		padding-right: 10px;
	}
	
	.mainTop {
		background: #fff;
		height: 44px;
		line-height: 44px;
		text-align: left;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
		margin-bottom: 10px;
	}
	
	.mainContent {
		background: #fff;
		/*height: 500px;*/
		border-radius: 4px;
		text-align: left;
		padding: 15px 20px 20px 10px;
		overflow-y: auto;
		height: calc(100vh - 130px);
	}
	
	.mainContent>>>.el-input__inner {
		height: 32px;
		line-height: 32px;
	}
	
	.mainContent>>>.el-input__icon {
		line-height: 32px;
	}
	
	.ivu-form-item {
		margin-bottom: 10px;
		width: 320px;
	}
	
	.formGoods .ivu-form-item {
		width: 600px;
	}
	
	.mainContent>>>.ivu-upload {
		width: 100px;
		height: 100px;
		vertical-align: middle;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	.classList{
		padding:15px 5px 0 0;
		float: left;
		margin:0 15px 10px 20px ;	
		border-radius:4px;	
		box-shadow: 0 2px 10px 0 #40a9ff4a;	
	}
	.mainContent>>>.el-input.is-disabled .el-input__inner{
		background: #fff;
		color: #606266;
	}
	.mainContent>>>.ivu-select-disabled .ivu-select-selection{
		background: #fff;
		color: #606266;	
	}
	.mainContent>>>.ivu-input-number-disabled .ivu-input-number-input{
		background: #fff;
		color: #606266;	
	}
	.mainContent>>>.ivu-input-number-disabled .ivu-input-number-input{
		opacity: 1;
	}
</style>