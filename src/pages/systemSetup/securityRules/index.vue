<template>
  <div class='main conMain'>
    <div class="mainTop">
      <Form :model="formSearch" inline :label-width="70">
        <FormItem label="组织">
          <Cascader :data="options" clearable v-model="formSearch.organize" change-on-select @on-change='changeCascader'
            :render-format="format" style="width:250px"></Cascader>
        </FormItem>
      </Form>
      <Button type="success" @click='handleAdd' v-has='878' style="position: absolute;right: 60px; top:8px">新增</Button>
      <!--<div class='defaultInfo'>如果不添加安检规则，则所有用户类型均为每单必检!</div>-->
      <!--<Button type="success" @click='handleAdd' v-has='878' style="float: right;margin: 8px 60px 0 0;">新增</Button>-->
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="tableData" :loading="loading" :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="userType">
          <span v-if='!row.isEdit'>{{row.userTypeName}}</span>
          <Select v-model="row.userType" style="height: 28px;line-height: 28px;" v-else>
            <Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
          </Select>
        </template>
        <template slot-scope="{ row, index }" slot="listType">
          <span v-if='!row.isEdit'>{{row.newListType}}</span>
          <Select v-model="row.listType" style="height: 28px;line-height: 28px;" v-else>
            <Option :value='0'>标准名单</Option>
            <!--<Option :value='1'>白名单</Option>-->
          </Select>
        </template>
        <template slot-scope="{ row, index }" slot="mustCheck">
          <span v-if='!row.isEdit'>{{row.newMustCheck}}</span>
          <i-switch v-model="row.mustCheck" false-color="#ff4949" :true-value='1' :false-value='0' v-else>
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="checkPeriod">
          <InputNumber v-model='row.checkPeriod' v-if='row.isEdit' :min='0' :max='365' style='height: 28px;line-height: 28px;width: 80%;' />
          <span v-else>{{row.checkPeriod}}</span>
          <!-- <span v-else>--</span> -->
        </template>
        <template slot-scope="{ row, index }" slot="alarmDayNum">
          <InputNumber v-model='row.alarmDayNum' v-if='row.isEdit' :min='0' :max='365' style='height: 28px;line-height: 28px;width: 80%;' />
          <span v-else>{{row.alarmDayNum}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="generateWorkOrder">
          <span v-if='!row.isEdit'>{{row.newGenerateWorkOrder}}</span>
          <i-switch v-model="row.generateWorkOrder" false-color="#ff4949" :true-value='1' :false-value='0' v-else>
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button size="small" type="info" style="margin:0 5px;" @click='editClick(row.id, index)' v-has='876' v-show='!row.isEdit'>编辑</Button>
          <Button size="small" type="error" @click='deleteClick(row.id)' v-has='877' v-show='!row.isEdit'>删除</Button>
          <Button type="primary" size="small" v-if='row.isEdit' style="margin:0 5px;" @click='handleSave(row, index)' :disabled="isDisabled">保存</Button>
          <!--<Button type='success' size="small" style="margin:0 5px;" v-if='row.isEdit&&row.listType==1' @click='userSelectClick(row, index)'>用户</Button>-->
          <Button type="warning" size="small" v-if='row.isEdit' @click='cancelClick(row.id,index)'>取消</Button>
        </template>
      </Table>
    </div>

  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'securityRules',
		data() {
			return {
        isDisabled: false,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				options:[],
				formSearch:{
					organize:''
				},
				userData: (JSON.parse(this.$store.state.userData)),
				userTypeList: [],
				loading: false,
				tableData: [],
				columns: [{
						title: '客户类型',
						key: 'userTypeName',
						align: 'center',
						slot: 'userType',
            minWidth:200
					},
					{
						title: '名单类型',
						key: 'newListType',
						align: 'center',
            minWidth:150,
						slot: 'listType'
					},
					{
						title: '每单必检',
						key: 'mustCheck',
						align: 'center',
						minWidth: 90,
						slot: 'mustCheck'
					},
					{
						title: '安检周期(天)',
						key: 'checkPeriod',
						align: 'center',
						minWidth: 100,
						slot: 'checkPeriod'
					},
					{
						title: '到期是否生成工单',
						key: 'generateWorkOrder',
						align: 'center',
						minWidth: 170,
						slot: 'generateWorkOrder'
					},
          {
          	title: '未安检提醒(天)',
          	key: 'alarmDayNum',
          	align: 'center',
          	minWidth: 120,
          	slot: 'alarmDayNum'
          },
					{
						title: '创建时间',
						key: 'createTime',
            minWidth:180,
						//						sortable: true,
						align: 'center'
					},
					{
						title: '修改时间',
						key: 'updateTime',
            minWidth:180,
						//						sortable: true,
						align: 'center'
					},

					{
						title: '操作',
						key: 'action',
						width: 200,
						align: 'center',
						slot: 'action'
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
				if(value.length) {
					this.formSearch.organize = value[value.length - 1]
				} else {
					this.formSearch.organize = ''
				}
				this.getRuleList()

			},
			//点击保存
			handleSave(row, index) {
				let fData = {
					deptId:row.deptId,
					id:row.id,
					mustCheck: row.mustCheck,
					listType: row.listType, //名单类型
					userType: row.userType, //用户类型
					checkPeriod:row.checkPeriod, //安检周期
					userIds: row.userIds, //用户数组
					alarmDayNum:row.alarmDayNum,
          generateWorkOrder:row.generateWorkOrder
				}
				if(!fData.userType) {
					this.$Message['warning']({
						background: true,
						content: '请选择客户类型!',
					});
					return false
				}

        this.isDisabled=true;
				if(row.id){
					fData.createTime=row.createTime;
					_http.http2('post', pathUrls.ruleUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.getRuleList();
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
				}else{
				_http.http2('post', pathUrls.ruleSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
								this.getRuleList();
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


			},



			//取消
			cancelClick(id, index) {
				if(!id) {
					this.tableData.splice(index, 1);
				} else {
					this.tableData[index].isEdit = false;
				}
			},
			//删除
			deleteClick(id) {
				this.handleOneDel(id)
			},
			//编辑
			editClick(id, index) {
				//				this.$router.push('/securityRules/editRules' + '/' + id)
				this.tableData[index].isEdit = true;
			},
			//新增
			handleAdd() {
				this.tableData.push({
					isEdit: true,
					id: '',
					userType: '',
					userTypeName: '',
					listType: 0,
					newListType: '',
					checkPeriod: 0,
					createTime: null,
					updateTime: null,
					mustCheck: 1,
					userIds: null,
					newMustCheck:'是',
					alarmDayNum:0,
          generateWorkOrder:1
				})
			},
			getRuleList() {
				this.tableData = []
				this.loading = true
				_http.http3('get', pathUrls.ruleList, {
					deptId:this.formSearch.organize,
          page:1,
          limit:10000
				}, 'form').then((res) => {
					this.loading = false
					for(let item of res.data) {
              if(!item.generateWorkOrder){
                item.generateWorkOrder=0;
                item.newGenerateWorkOrder='否';
              }else{
                item.newGenerateWorkOrder='是';
              }

						if(!item.mustCheck) {
							item.mustCheck = 0;
							item.newMustCheck = '否';
						}else{
							item.newMustCheck = '是';
						}
						item.isEdit = false;
						item.userIds = null;
						if(item.listType == 1) {
							item.newListType = '白名单'
						} else if(item.listType == 0) {
							item.newListType = '标准名单'
						}
						//						item.newListType = item.listType == 1 ? '白名单' : '黑名单'
					}
					this.tableData = res.data;
          if(this.tableData.length>10){
              this.tableHeight=this.screeHeight-140;
          }else{
              this.tableHeight='auto';
          }

				})
			},
			//删除
			handleOneDel(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.ruleDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.getRuleList()
							}

						})
					},

				});
			}
		},
		mounted() {
			this.getRuleList()
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.userTypeList = res.data;
			})
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

  .mainTop {
    background: #fff;
    height: 48px;
    line-height: 48px;
    text-align: left;
    vertical-align: middle;
    border-radius: 4px;
    position: relative;
    padding-top: 8px;
  }

  .mainContent {
    background: #fff;
    border-radius: 4px;
    padding: 5px 10px 10px;
  }

  .mainContent>>>td {
    height: 40px;
  }

  .mainContent>>>.ivu-table th {
    background: #E2EEFF;
    color: #51B5EA;
  }

  .defaultInfo {
    float: left;
    background: #EF8920;
    color: #fff;
    height: 24px;
    line-height: 24px;
    box-shadow: 0px 2px 2px #c8c8c8;
    margin-top: 12px;
    padding: 0 10px;
  }

  .mainContent>>>.ivu-select-single,
  .mainContent>>>.ivu-select-selection,
  .mainContent>>>.ivu-select-selected-value {
    height: 28px;
  }

  .mainContent>>>.ivu-input-number-input {
    height: 28px;
  }


  .mainContent>>>.ivu-table-wrapper {
    overflow: visible;
  }

  .mainContent>>>th .ivu-table-cell {
    padding: 0 9px;
  }
</style>
