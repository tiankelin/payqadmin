<template>
  <div class="main conMain">
    <div class="mainTop">
      <Button type="success" @click='handleAdd' v-has='933'>新增</Button>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' ref="table" :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="typeName">
          <span v-if='!row.isEdit'>{{row.typeName}}</span>
          <Input type="text" :value="row.typeName" v-else v-model='row.typeName' placeholder="请输入客户类型" @on-keyup="row.typeName=row.typeName.replace(/^ +| +$/g,'')" />
        </template>
        <template slot-scope="{ row, index }" slot="detailType">
          <span v-if='!row.isEdit&&row.detailType==1' style="color:#2d8cf0;">{{row.newDetail}}</span>
          <span v-else-if='!row.isEdit&&row.detailType==2' style="color:#f90;">{{row.newDetail}}</span>
          <i-switch v-model="row.detailType" size="large" false-color="#ff4949" :true-value='1' :false-value='2' v-else
            style='width: 65px;' class='switchType'>
            <span slot="open">居民</span>
            <span slot="close">非居民</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="appOpening">
          <span v-if='!row.isEdit&&row.appOpening==1' style="color:#2d8cf0;">{{row.newOpen}}</span>
          <span v-else-if='!row.isEdit&&row.appOpening==0' style="color:#ff4949;">{{row.newOpen}}</span>
          <i-switch v-model="row.appOpening" size="large" false-color="#ff4949" :true-value='1' :false-value='0' v-else>
            <span slot="open">允许</span>
            <span slot="close">禁止</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="checkMaxOccupy">
          <span v-if='!row.isEdit&&row.checkMaxOccupy==1' style="color:#2d8cf0;">{{row.checkMaxOccupy==1?'开启':'关闭'}}</span>
          <span v-else-if='!row.isEdit&&row.checkMaxOccupy==0' style="color:#ff4949;">{{row.checkMaxOccupy==1?'开启':'关闭'}}</span>
          <i-switch v-model="row.checkMaxOccupy" size="large" false-color="#ff4949" :true-value='1' :false-value='0'
            v-else>
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="allowGoods">
          <Select @on-change='goodsChange(row, index)' v-if='row.isEdit' v-model="row.allowGoods" multiple style="text-align: left;"
            label-in-value :max-tag-count="3" placeholder='请选择允许钢瓶'>
            <Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
          </Select>
          <span v-else>{{row.allowGoodsName.toString()}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="occupyNum">
          <Button type="warning" style="background: #67c23a;border-color: #67c23a;" size='small' @click="setOccupyNum(row, index)"
            v-if='row.isEdit&&row.allowGoods.length'>设置</Button>
          <span v-else v-for='(item,itemIndex) in row.goodsOccupys'>{{item.number==0?'-':item.number}}<span v-if='itemIndex+1!=row.goodsOccupys.length'>，</span></span>
        </template>
        <template slot-scope="{ row, index }" slot="mould">
          <Select v-if='row.isEdit' v-model="row.mould" style="text-align: left;" label-in-value placeholder='请选择合同模板'>
            <Option v-for="item in mouldList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <span v-else>{{row.mouldName}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="info" size="small" style="margin-right:10px" @click="handleEdit(row,row.id,index)" v-show='!row.isEdit'
            v-has='934'>编辑</Button>
          <Button type="error" size="small" @click="remove(row.id)" v-show='!row.isEdit' v-has='935'>删除</Button>
          <Button type="primary" size="small" v-if='row.isEdit' style="margin-right: 10px;" @click='handleSave(row,index)'
            :disabled="isDisabled">保存</Button>
          <Button type="warning" size="small" v-if='row.isEdit' @click='cancelClick(row,row.id,index)'>取消</Button>
        </template>
      </Table>
    </div>
    <div v-if='occupyShows' class="occupyShowsBg">
      <div class="occupyShows">
        <div class="occupyTitle">最大占用瓶</div>
        <div class="occupyContent">
          <div style="margin: 10px;" v-for='item in allowGoodsName' :key='item.value'>
            <span style="display: inline-block;min-width: 100px;">{{item.label}}</span>
            <InputNumber style="width: 100px;margin-left: 5px;" :min='0' :max='100' v-model='item.occNum' />
          </div>

        </div>

        <div class="btnBox">
          <Button type="primary" @click='getNumClick'>确定</Button>
          <Button @click="handleBackClick">返回</Button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		name: 'customerType',
		data() {
			return {
        isDisabled: false,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				mouldList:[],
				copyData: [],
				isChange: false,
				rowContent: {},
				rowIndex: 0,
				allowGoodsName: [],
				occupyShows: false,
				newSizeList: [],
				loading: false,
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				dataList: [],
				columns: [{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center',
            fixed:'left'
					}, {
						title: '客户类型',
						key: 'typeName',
						align: 'center',
						slot: 'typeName',
            minWidth:140
					},
					{
						title: '是否为居民类型',
						key: 'detailType',
						align: 'center',
						slot: 'detailType',
             minWidth:150
					},
					{
						title: '是否允许app开户',
						key: 'appOpening',
						align: 'center',
						slot: 'appOpening',
						 minWidth:150
					},
          {
          	title: '核验最大占用瓶',
          	key: 'checkMaxOccupy',
          	align: 'center',
          	slot: 'checkMaxOccupy',
          	minWidth:150
          },
					{
						title: '允许使用钢瓶',
						key: 'allowGoods',
						align: 'center',
						slot: 'allowGoods',
						minWidth: 400,
						tooltip: true
					},
					{
						title: '最大占用瓶',
						key: 'occupyNum',
						align: 'center',
						slot: 'occupyNum',
						minWidth:200
					},
					{
						title: '合同模板',
						key: 'mould',
						align: 'center',
						slot: 'mould',
						minWidth:160
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
						width: 140,
						align: 'center',
            fixed:'right'
					}
				]
			}
		},
		methods: {
			getQueryContractTemplate(){
				_http.http1('get', pathUrls.queryContractTemplate + '?type=1', {}, 'form').then((res) => {
					this.mouldList=res.data;
				})
			},
			goodsChange(row, index) {
				this.copyRow = row;
				this.allowGoodsName = [];
				let newRowGoods = [];
				row.allowGoods.forEach(items => {
					for(let item of this.newSizeList) {
						if(item.goodsId == items) {
							this.allowGoodsName.push({
								value: item.goodsId,
								label: item.goodsName,
								occNum: 0
							})
						}
					}

				})
				if(row.allowedGoods) {
					let newGoods = JSON.parse(row.allowedGoods);
					this.allowGoodsName.forEach(item => {
						for(let items of newGoods) {
							if(item.value == items.goodsId) {
								item.occNum = items.number
							}
						}
					})
				}
				this.rowIndex = index;
				this.rowContent = row;
				this.rowContent.goodsOccupys = [];
				for(let item of this.allowGoodsName) {
					this.rowContent.goodsOccupys.push({
						goodsId: item.value,
						number: item.occNum
					})

				}
				this.dataList[this.rowIndex] = this.rowContent;

			},
			setOccupyNum(row, index) {
				this.occupyShows = true;
			},

			getNumClick() {
				this.rowContent.goodsOccupys = [];
				for(let item of this.allowGoodsName) {
					this.rowContent.goodsOccupys.push({
						goodsId: item.value,
						number: item.occNum
					})

				}
				this.dataList[this.rowIndex] = this.rowContent;
				this.occupyShows = false;

			},

			handleBackClick() {
				this.occupyShows = false;
			},

			//获取商品信息列表
			getGoodsList() {
				this.newSizeList = [];
				this.loading = true
				_http.http1('post', pathUrls.deptgoodsList, {
					'isGas': 2,
				}, 'form').then((res) => {

					this.newSizeList = res.data;
					this.getUserTypeList();
				})
			},
			//获取用户类型列表
			getUserTypeList() {
					this.copyData=[];
					this.dataList=[];
					this.loading = true
				_http.http1('post', pathUrls.usertypeList, {
					page: 1,
					limit: 10000
				}, 'form').then((res) => {
					this.loading = false;
					if(res.data) {
						for(let item of res.data) {
							item.mould=item.openingTempId;
							item.mouldName='';
							this.mouldList.forEach(mou=>{
								if(item.openingTempId==mou.id){
									item.mouldName=mou.name
								}
							})
							item.allowGoods = [];
							item.allowGoodsName = [];
							if(item.allowedGoods) {
								let newGoods = JSON.parse(item.allowedGoods);
								for(let alt of newGoods) {
									this.newSizeList.forEach((items) => {
										if(items.goodsId == alt.goodsId) {

											item.allowGoodsName.push(items.goodsName);
										}
									})
									item.allowGoods.push(alt.goodsId);
								}

								item.goodsOccupys = JSON.parse(item.allowedGoods);
							} else {
								item.goodsOccupys = [];
							}
							if(item.detailType) {

							} else {
								item.detailType = 2;
							}
							item.isEdit = false;
							item.appOpening = item.appOpening ? 1 : 0;
							item.newOpen = item.appOpening == 1 ? '允许' : '禁止';
							item.newDetail = item.detailType == 1 ? '居民' : '非居民';
						}
						this.dataList = res.data;
						this.copyData = res.data;
            if(this.dataList.length>10){
              this.tableHeight=this.screeHeight-145;
            }else{
              this.tableHeight='auto';
            }

					}

				})
			},
			organizeSelected() {

			},
			//新增
			handleAdd() {
				this.dataList.push({
					typeName: '',
					createTime: '',
					isEdit: true,
					id: '',
					orgId: '',
					appOpening: 1,
					detailType: 1,
					allowGoods: [],
					allowGoodsName: [],
					goodsOccupys: [],
					mould:'',
					mouldName:'',
          checkMaxOccupy:0
				})
			},
			//编辑
			handleEdit(row, id, index) {
					this.dataList[index].isEdit = true;
					this.rowContent.allowGoods=[];
				if(this.copyData[index].allowedGoods) {
					let newsGood=JSON.parse(this.copyData[index].allowedGoods);
					for(let item of newsGood){
						this.rowContent.allowGoods.push(item.goodsId);
					}

				}

			},
			//删除
			remove(id) {
				this.$Modal.confirm({
					title: '删除用户类型后，该类型对应的规则也会被删除，是否继续？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.usertypeDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getUserTypeList();
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
					typeName: row.typeName,
					orgId: this.userData.deptId,
					appOpening: row.appOpening,
					detailType: row.detailType,
					allowedGoods: JSON.stringify(row.goodsOccupys),
					openingTempId:row.mould,
          checkMaxOccupy:row.checkMaxOccupy
				}
//				console.log(fData);
//				return false;
				if(fData.typeName == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入客户类型!',
						duration: 1
					});
					return false
				}
				if(fData.typeName.length > 16) {
					this.$Message['warning']({
						background: true,
						content: '客户类型过长!',
						duration: 1
					});
					return false
				}
//				if(fData.openingTempId == '') {
//					this.$Message['warning']({
//						background: true,
//						content: '请选择合同模板!',
//						duration: 1
//					});
//					return false
//				}
  
				let nameArr = [];
				for(let item of this.dataList) {
					if(item.typeName == fData.typeName && item.detailType == fData.detailType && item.appOpening == fData.appOpening) {
						nameArr.push(item.id)

					}
				}
        this.isDisabled=true;
				if(!row.id) {
					if(nameArr.toString()) {
						this.$Modal.confirm({
							title: '该类型已存在，是否继续添加？',
							content: '',
							onOk: () => {
								_http.http2('post', pathUrls.usertypeSave, fData).then((res) => {
									if(res.code == 0) {
										this.$Message['success']({
											background: true,
											content: '添加成功!',
											onClose: (() => {
												this.getUserTypeList();
                        this.isDisabled=false;
											})
										});

									}
									if(res.code == 500) {
										this.$Message['warning']({
											background: true,
											content: res.msg,
										});
									}
                  if(res.code !=0) {
                  this.isDisabled=false;

                  }
								}).catch(err=>{
                    this.isDisabled=false;
				})
							},
              onCancel: () =>{
                  this.isDisabled=false;
              }

						});
					} else {
						_http.http2('post', pathUrls.usertypeSave, fData).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '添加成功!',
									onClose: (() => {
										this.getUserTypeList();
                    this.isDisabled=false;
									})
								});

							}
							if(res.code == 500) {
								this.$Message['warning']({
									background: true,
									content: res.msg,
								});
							}
              if(res.code !=0) {
              this.isDisabled=false;

              }
						}).catch(err=>{
                    this.isDisabled=false;
				})
					}

				} else {

					fData.createTime = row.createTime;
					fData.updateTime = row.updateTime;
					fData.id = row.id;

					if(nameArr.length && fData.id != nameArr[0]) {
						this.$Modal.confirm({
							title: '该类型已存在，是否继续修改？',
							content: '',
							onOk: () => {
								_http.http2('post', pathUrls.usertypeUpdate, fData).then((res) => {
									if(res.code == 0) {
										this.$Message['success']({
											background: true,
											content: '修改成功!',
											onClose: (() => {
												this.getUserTypeList();
                        this.isDisabled=false;
											})
										});

									}
									if(res.code == 500) {
										this.$Message['warning']({
											background: true,
											content: res.msg,
										});
									}
                  if(res.code !=0) {
                  this.isDisabled=false;

                  }

								}).catch(err=>{
                    this.isDisabled=false;
				})
							},
              onCancel: () =>{
                  this.isDisabled=false;
              }

						});
					} else {
						_http.http2('post', pathUrls.usertypeUpdate, fData).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '修改成功!',
									onClose: (() => {
										this.getUserTypeList();
                    this.isDisabled=false;
									})
								});

							}
							if(res.code == 500) {
								this.$Message['warning']({
									background: true,
									content: res.msg,
								});
							}
              if(res.code !=0) {
              this.isDisabled=false;

              }
						}).catch(err=>{
                    this.isDisabled=false;
				})
					}

				}
			},
			//取消
			cancelClick(row, id, index) {
				if(!id) {
					this.dataList.splice(index, 1);
				} else {
					if(this.copyData[index].allowedGoods) {
						this.rowContent.goodsOccupys = JSON.parse(this.copyData[index].allowedGoods);
					} else {
						this.rowContent.goodsOccupys = [];
					}
					this.dataList[index].isEdit = false;

				}

			}

		},
		mounted() {
			this.getGoodsList();
			this.getQueryContractTemplate();

		}
	}
</script>

<style type="text/css" scoped>
  .main {
    background: #fff;
    margin-right: 10px;
    min-height: calc(100% - 10px);
    padding: 0 10px 10px;
  }

  .mainTop {
    height: 48px;
    line-height: 48px;
    text-align: right;
    vertical-align: middle;
    padding-right: 20px;

  }

  .mainContent>>>td {
    height: 40px;
  }

  .mainContent>>>.ivu-table th {
    background: #E2EEFF;
    color: #51B5EA;
  }

  .mainContent>>>.ivu-input {
    height: 27px;
  }

  .mainContent>>>.el-input__inner {
    height: 27px;
    width: 100%;
  }

  .switchType>>>.ivu-switch-checked:after {
    left: 42px !important;
  }

  .mainContent>>>.ivu-table-wrapper {
    overflow: visible;
  }

  .mainContent>>>.ivu-input-number-input {
    height: 28px;
  }

  .occupyShowsBg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .4);
    z-index: 1000;
  }

  .occupyShows {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    min-height: 150px;
    max-height: 400px;
    background: #fff;
    text-align: left;
    margin-left: -150px;
    margin-top: -130px;
  }

  .occupyTitle {
    background: #2b85e4;
    height: 32px;
    line-height: 32px;
    color: #fff;
    text-align: center;
  }

  .occupyShows>>>.ivu-input-number-input {
    height: 30px;
    line-height: 30px;
  }

  .occupyContent {
    max-height: 330px;
    margin-bottom: 60px;
    overflow-y: auto;
  }

  .btnBox {
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    height: 50px;
  }

  .btnBox button {
    height: 28px;
    line-height: 28px;
    padding: 0 12px;
    margin: 10px 10px;
  }

  .main>>>.ivu-table-cell {
    padding: 0 2px;
  }
</style>
