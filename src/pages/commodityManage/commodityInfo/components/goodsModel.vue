<template>
	<div class="modelContent">
		<div style="text-align: right;position: absolute;right: 24px;top:4px;z-index: 100;">
			<Button type="success" @click='handleAdd' style="height: 28px;line-height: 28px;" v-has='952'>型号新增</Button>
		</div>
		<Table border :columns="columns" :data="goodsModelList" :loading='loading' ref="table" :height='tableHeight'>
			<template slot-scope="{ row, index }" slot="goodsModel">
				<span v-if='!row.isEdit'>{{row.goodsModel}}</span>
				<Input type="text" v-else v-model="row.goodsModel" @on-keyup="row.goodsModel=row.goodsModel.replace(/^ +| +$/g,'')"/>

			</template>
			<template slot-scope="{ row, index }" slot="goodsSpecs">
				<span v-if='!row.isEdit'>{{row.goodsSpecName}}</span>
				<Select v-model="row.goodsSpec" style="height: 28px;line-height: 28px;" v-else>
					<Option :value='item.id' v-for='item in specList' :key='item.id'>{{item.goodsSpec}}</Option>
				</Select>
			</template>
			<template slot-scope="{ row, index }" slot="remarks">
				<span v-if='!row.isEdit'>{{row.remarks}}</span>
				<Input type="text" v-else v-model="row.remarks" @on-keyup="row.remarks=row.remarks.replace(/^ +| +$/g,'')"/>
			</template>

			<template slot-scope="{ row, index }" slot="action">
				<Button type="info" size="small" style="margin-right:10px" @click="handleEdit(row.id, index)" v-show='!row.isEdit' v-has='953'>编辑</Button>
				<Button type="error" size="small" @click="remove(row.id)" v-show='!row.isEdit' v-has='954'>删除</Button>
				<Button type="primary" size="small" style="margin-right:10px" @click="handleSave(row,index)" v-if='row.isEdit'>保存</Button>
				<Button type="warning" size="small" @click="cancel(row.id,index)" v-if='row.isEdit'>取消</Button>
			</template>
		</Table>
    <div class="descMain">
      <div style="font-weight: 600;line-height: 30px;font-size: 16px;">液化气钢瓶型号规格介绍(参考值)</div>
      <Table border :columns="columns1" :data="descList"></Table>
      <div style="text-align: right;padding-top: 5px;color: #E6A23C;">
      	<i>若有其他规格，请联系瓶安用气！</i>
      	<span style="margin-left: 10px;">联系方式：0571-85228770</span>
      </div>
    </div>

	</div>

</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import Bus from '@/public/bus';
	export default {
		name: 'goodsModel',
		props:{
			tabsCheck:Number
		},
		data() {
			return {
        descList:[{
          model:'YSP4.7',
          diameter:'200',
          volume:'4.7',
          fillingCapacity:'≤1.9',
          weight:'3.4',
          desc:''
        },{
          model:'YSP12',
          diameter:'244',
          volume:'12',
          fillingCapacity:'≤5',
          weight:'7',
          desc:''
        },{
          model:'YSP23.5',
          diameter:'314',
          volume:'23.5',
          fillingCapacity:'≤9.8',
          weight:'13',
          desc:''
        },{
          model:'YSP35.5',
          diameter:'314',
          volume:'35.5',
          fillingCapacity:'≤14.9',
          weight:'16.5',
          desc:''
        },{
          model:'YSP118',
          diameter:'400',
          volume:'118',
          fillingCapacity:'≤49.5',
          weight:'47',
          desc:'气相或液相'
        },{
          model:'YSP118-2',
          diameter:'400',
          volume:'118',
          fillingCapacity:'≤49.5',
          weight:'47',
          desc:'气液两相'
        }],
        tableHeight:'auto',
        screeHeight: document.documentElement.clientHeight, // 屏幕高
				specList: [],
				loading: false,
				goodsModelList: [],
				columns: [{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center'
					},

					{
						title: '型号细分',
						key: 'goodsModel',
						align: 'center',
						tooltip: true,
						slot: 'goodsModel'
					},
					{
						title: '选择钢瓶规格',
						key: 'goodsSpecs',
						align: 'center',
						tooltip: true,
						slot: 'goodsSpecs'
					},
					{
						title: '备注',
						key: 'remarks',
						align: 'center',
						tooltip: true,
						width: 300,
						slot: 'remarks'
					},
					//					{
					//						title: '创建时间',
					//						key: 'createTime',
					//						align: 'center',
					//					},
					//					{
					//						title: '更新时间',
					//						key: 'updateTime',
					//						align: 'center',
					//					},
					{
						title: '操作',
						slot: 'action',
						width: 150,
						align: 'center'
					}
				],
        columns1:[{
          title: '型号',
          key: 'model',
          align: 'center',
          tooltip: true,
        }
        // ,{
        //   title: '钢瓶内直径(mm)',
        //   key: 'diameter',
        //   align: 'center',
        //   tooltip: true,
        // }
        ,{
          title: '公称容积(L)',
          key: 'volume',
          align: 'center',
          tooltip: true,
        },{
          title: '最大充装量(kg)',
          key: 'fillingCapacity',
          align: 'center',
          tooltip: true,
        },{
          title: '钢瓶重量(kg)',
          key: 'weight',
          align: 'center',
          tooltip: true,
        },{
          title: '备注',
          key: 'desc',
          align: 'center',
          tooltip: true,
        }]
			}
		},
		methods: {
			//获取商品规格
			getGoodsSpecList() {
				_http.http1('post', pathUrls.goodsspecList, {}, 'form').then((res) => {
					this.specList = res.data;

				})
			},
			//获取商品型号
			getGoodsModelList() {
				_http.http1('post', pathUrls.goodsmodelList, {}, 'form').then((res) => {
					this.loading = false;
					for(let item of res.data) {
						item.isEdit = false;
					}
					this.goodsModelList = res.data;
          if(this.goodsModelList.length>10){
          	this.tableHeight=this.screeHeight -410;
          }else{
          	this.tableHeight='auto';
          }
				})
			},

			//删除
			remove(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.goodsmodelDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getGoodsModelList()
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
					goodsModel: row.goodsModel,
					goodsSpec: row.goodsSpec,
					remarks: row.remarks
				}
				if(!fData.goodsModel) {
					this.$Message['warning']({
						background: true,
						content: '请填写商品型号!',
					});
					return false
				}
				if(fData.goodsModel.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '商品型号过长!',
					});
					return false
				}
//				if(!fData.goodsSpec) {
//					this.$Message['warning']({
//						background: true,
//						content: '请选择商品规格!',
//					});
//					return false
//				}
				if(fData.remarks && fData.remarks.length > 100) {
					this.$Message['warning']({
						background: true,
						content: '备注内容过长!',
					});
					return false
				}

				let sameSpec = [];
				for(let item of this.goodsModelList) {
					if(fData.goodsModel == item.goodsModel && fData.goodsSpec == item.goodsSpec) {
						sameSpec.push(item.id)
					}
				}

				if(row.id) {
					fData.id = row.id;
					fData.createTime = row.createTime;
					fData.operator = row.operator;
					fData.orgId = row.orgId;

					if(sameSpec.length&&fData.id!=sameSpec[0]) {
						this.$Modal.confirm({
							title: '同一规格下已存在该型号名，是否继续修改？',
							content: '',
							onOk: () => {
								_http.http2('post', pathUrls.goodsmodelUpdate, fData).then((res) => {
									if(res.code == 0) {
										this.$Message['success']({
											background: true,
											content: '修改成功!',
											onClose: (() => {

												this.getGoodsModelList()
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
						_http.http2('post', pathUrls.goodsmodelUpdate, fData).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '修改成功!',
									onClose: (() => {

										this.getGoodsModelList()
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
					if(sameSpec.length) {
						this.$Modal.confirm({
							title: '同一规格下已存在该型号名，是否继续添加？',
							content: '',
							onOk: () => {
								_http.http2('post', pathUrls.goodsmodelSave, fData).then((res) => {
									if(res.code == 0) {
										this.$Message['success']({
											background: true,
											content: '添加成功!',
											onClose: (() => {
												this.getGoodsModelList()
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
						_http.http2('post', pathUrls.goodsmodelSave, fData).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '添加成功!',
									onClose: (() => {
										this.getGoodsModelList()
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
			//型号新增
			handleAdd() {
				this.goodsModelList.push({
					goodsSpec:null,
					goodsModel:null,
					id:null,
					isEdit: true,
				})
			},
			//取消
			cancel(id, index) {
				if(!id) {
					this.goodsModelList.splice(index, 1);
				} else {
					this.goodsModelList[index].isEdit = false;
				}
			},
			//编辑
			handleEdit(id, index) {
				this.goodsModelList[index].isEdit = true;
			}

		},
		watch:{
			'tabsCheck':{
				handler(newTabs, oldTabs) {　
					if(newTabs==1){
						this.getGoodsModelList()
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
	.modelContent>>>.ivu-select-single,
	.modelContent>>>.ivu-select-selection,
	.modelContent>>>.ivu-select-selected-value {
		height: 28px;
	}

	.modelContent>>>.ivu-table-wrapper {
		overflow: visible;
	}
  .descMain>>>.ivu-table th{
    background:#39bfaf;
    color: #fff;
    height: 24px;
    padding: 4px 0!important;
  }
  .descMain>>>.ivu-table td{
    height: 30px;
  }
</style>
