<template>
	<div>
		<div style="text-align: right;position: absolute;right:24px;top:4px;z-index: 100;">
			<Button type="success" @click='handleAddSpec' style="height: 28px;line-height: 28px;" v-has='955'>规格新增</Button>
		</div>
		<Table border :columns="columns" :data="goodsSpecList" :loading='loading' ref="table" :height='tableHeight'>
			<template slot-scope="{ row, index }" slot="goodsSpec">
				<span v-if='!row.isEdit'>{{row.goodsSpec}}</span>
				<Input type="text" v-else v-model="row.goodsSpec" @on-keyup="row.goodsSpec=row.goodsSpec.replace(/^ +| +$/g,'')"/>
			</template>
			<template slot-scope="{ row, index }" slot="action">
				<Button type="info" size="small" style="margin-right:10px" @click="handleEdit(row.id, index)" v-show='!row.isEdit' v-has='956'>编辑</Button>
				<Button type="error" size="small" @click="remove(row.id)" v-show='!row.isEdit' v-has='957'>删除</Button>
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
		name: 'goodsSpecs',
		props:{
			tabsCheck:Number
		},
		data() {
			return {
        tableHeight:'auto',
        screeHeight: document.documentElement.clientHeight, // 屏幕高
				loading: false,
				goodsSpecList: [],
				columns: [{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center'
					},
					{
						title: '规格名称',
						key: 'goodsSpec',
						align: 'center',
						slot: 'goodsSpec'
					},
					{
						title: '创建时间',
						key: 'createTime',
						align: 'center',
					},
					{
						title: '更新时间',
						key: 'updateTime',
						align: 'center',
					},

					{
						title: '操作',
						slot: 'action',
						width:150,
						align: 'center'
					}
				],
			}
		},
		methods: {
			//获取商品规格
			getGoodsSpecList() {
				_http.http1('post', pathUrls.goodsspecList, {}, 'form').then((res) => {
					this.loading = false;
					for(let item of res.data) {
						item.isEdit = false;
					}
					this.goodsSpecList = res.data;
					if(this.goodsSpecList.length>10){
						this.tableHeight=this.screeHeight -160;
					}else{
						this.tableHeight='auto';
					}
				})
			},
			//新增规格
			handleAddSpec() {
				this.goodsSpecList.push({
					id: '',
					goodsSpec: '',
					isEdit: true,
				})
			},
			//保存
			handleSave(row, index) {
				let fData = {
					goodsSpec: row.goodsSpec
				}
				if(!fData.goodsSpec) {
					this.$Message['warning']({
						background: true,
						content: '请填写商品规格!',
					});
					return false
				}
				if(fData.goodsSpec.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '商品规格过长!',
					});
					return false
				}
				let nameArr = [];
				for(let item of this.goodsSpecList) {
					if(fData.goodsSpec == item.goodsSpec) {
						nameArr.push(item.id)
					}
				}
				if(row.id) {
					fData.id = row.id;
					fData.createTime = row.createTime;
					fData.operator = row.operator;
					fData.orgId = row.orgId;
					fData.spceStatus = row.spceStatus;

					if(nameArr.length&&fData.id!=nameArr[0]) {
						this.$Modal.confirm({
							title: '该规格名称已存在，是否继续修改？',
							content: '',
							onOk: () => {
								_http.http2('post', pathUrls.goodsspecUpdate, fData).then((res) => {
									if(res.code == 0) {
										this.$Message['success']({
											background: true,
											content: '修改成功!',
											onClose: (() => {

												this.getGoodsSpecList()
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
						_http.http2('post', pathUrls.goodsspecUpdate, fData).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '修改成功!',
									onClose: (() => {

										this.getGoodsSpecList()
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
							title: '该规格名称已存在，是否继续添加？',
							content: '',
							onOk: () => {
								_http.http2('post', pathUrls.goodsspecSave, fData).then((res) => {
									if(res.code == 0) {
										this.$Message['success']({
											background: true,
											content: '添加成功!',
											onClose: (() => {
												this.getGoodsSpecList()
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
						_http.http2('post', pathUrls.goodsspecSave, fData).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '添加成功!',
									onClose: (() => {
										this.getGoodsSpecList()
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
			//编辑
			handleEdit(id, index) {
				this.goodsSpecList[index].isEdit = true;
			},
			//取消
			cancelClick(id, index) {
				if(!id) {
					this.goodsSpecList.splice(index, 1);
				} else {
					this.goodsSpecList[index].isEdit = false;
				}
			},
			//删除
			remove(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.goodsspecDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {

										this.getGoodsSpecList()
									})
								});

							}

						})
					},

				});
			},
		},
		watch:{
			'tabsCheck':{
				handler(newTabs, oldTabs) {　
					if(newTabs==1){
						this.getGoodsSpecList()
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

</style>
