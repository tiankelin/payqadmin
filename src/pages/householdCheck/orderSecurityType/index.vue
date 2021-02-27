<template>
  <div class='main conMain'>
    <div class="mainTop ">
      <Form :model="formSearch" inline :label-width="100">
        <FormItem label="客户类型">
          <Select v-model="formSearch.userType" style="width:170px" clearable placeholder="请选择客户类型" @on-change='typeChange'
            label-in-value>
            <!--<Option value='全部'>全部</Option>
						<Option value='居民用户'>居民用户</Option>
						<Option value='小微商户'>小微商户</Option>
						<Option value='商业用户'>商业用户</Option>
						<Option value='工业用户'>工业用户</Option>-->
            <Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="安检项分类">
          <Select v-model="formSearch.securityName" style="width:170px" clearable placeholder="请选择安检项分类" @on-change='nameChange'>
            <Option :value='item.id' v-for='(item,index) in nameList' :key='index'>{{item.typeName}}</Option>
          </Select>
        </FormItem>
        <!--<FormItem label="是否启用">
					<Select v-model="formSearch.isAlive" style="width:170px" clearable placeholder="是否启用">
						<Option value='1'>是</Option>
						<Option value='0'>否</Option>
					</Select>
				</FormItem>
				



				<FormItem label="安检项名称">
					<Input v-model="formSearch.securityName" placeholder="请输入安检项名称" style="width:170px"></Input>
				</FormItem>
				<FormItem label="安检项详情">
					<Input v-model="formSearch.securityInfo" placeholder="请输入安检项详情" style="width:170px"></Input>
				</FormItem>
				-->
        <FormItem>
          <Button type="primary" @click='handleSearch'>查询</Button>
          <!--<Button type="success" @click='handleAdd'>新增</Button>-->
          <Button type="success" @click='addNew' v-has='776'>添加</Button>
          <Button type="info" @click='handleChecktypeclassify'>新增安检项分类</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' ref="table" :height='tableHeight'>
        <template slot-scope="{ row, index }" slot="userType">
          <span v-if='!row.isEdit'>{{row.userTypeName}}</span>
          <span v-else-if='row.isEdit&&formSearch.userType&&!row.typeId'>{{userTypeName}}</span>
          <!--<Input type="text" :value="row.userType" v-else style="height: 28px;line-height: 28px;" v-model='row.userType'/>-->
          <Select v-model="row.userType" v-else style="height: 28px;line-height: 28px;">
            <Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
            <!--<Option value='居民用户'>居民用户</Option>
						<Option value='小微商户'>小微商户</Option>
						<Option value='商业用户'>商业用户</Option>
						<Option value='工业用户'>工业用户</Option>-->
          </Select>
        </template>
        <template slot-scope="{ row, index }" slot="typeName">
          <span v-if='!row.isEdit'>{{row.typeName}}</span>
          <span v-else-if='row.isEdit&&formSearch.securityName&&!row.typeId'>{{formSearch.securityName}}</span>
          <!--<Input type="text" :value="row.typeName" v-else v-model='row.typeName' />-->
          <Select v-model="row.classifyId" v-else style="height: 28px;line-height: 28px;">
          		<Option v-for="item in nameList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
          </Select>
        </template>
        <template slot-scope="{ row, index }" slot="typeContent">
          <span v-if='!row.isEdit'>{{row.typeContent}}</span>
          <Input type="text" :value="row.typeContent" v-else v-model='row.typeContent' />
        </template>
        <template slot-scope="{ row, index }" slot="newActive">
          <span v-if='!row.isEdit&&row.isActive==1' style="color:#2d8cf0;">{{row.newActive}}</span>
          <span v-else-if='!row.isEdit&&row.isActive==0' style="color:#ff4949;">{{row.newActive}}</span>
          <i-switch v-model="row.isActive" size="large" false-color="#ff4949" :true-value='1' :false-value='0' v-else>
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <!--<Button type="primary" size="small" @click="handleSee(row.typeId)" v-if='!row.isEdit'>查看</Button>-->
          <Button type="info" size="small" style="margin-right:10px" @click="edit(row.typeId, index)" v-if='!row.isEdit'
            v-has='777'>编辑</Button>
          <Button type="error" size="small" @click="remove(row.typeId)" v-if='!row.isEdit' v-has='778'>删除</Button>
          <Button type="primary" size="small" v-if='row.isEdit' style="margin-right: 10px;" @click='handleSave(row, index)' :disabled="isDisabled">保存</Button>
          <Button type="warning" size="small" v-if='row.isEdit' @click='cancelClick(row.typeId,index)'>取消</Button>
        </template>
      </Table>
      <!--<div class="pageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange'></Page>
			</div>-->

    </div>
    <securityName v-if='securityInfo' @closeInfo='closeInfoMethod'></securityName>
  </div>
</template>

<script>
  import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import securityName from './securityName';
	export default {
		name: 'orderSecurityType',
		components:{
			securityName
		},
		data() {
			return {
				securityInfo:false,
        isDisabled: false,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				userTypeList:[],
				nameList:[],
				userData: (JSON.parse(this.$store.state.userData)),
				
				formSearch: {
					userType:'',
					isAlive: '',
					securityName: '',
					securityInfo: ''
				},
				typeName: '',
				userTypeName:'',
				dataList: [],
				loading: false,
				columns: [
					{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center',
					}, {
						title: '客户类型',
						key: 'userType',
						width: 140,
						align: 'center',
						slot: 'userType'
					},
					{
						title: '安检项分类',
						key: 'typeName',
						width: 240,
						align: 'center',
						slot: 'typeName',
					}, {
						title: '安检项详情',
						key: 'typeContent',
						align: 'center',
						minWidth: 200,
						slot: 'typeContent'
					},
					{
						title: '是否启用',
						key: 'newActive',
						align: 'center',
						width: 100,
						slot: 'newActive',
						
					},
					{
						title: '操作',
						slot: 'action',
						width: 170,
						align: 'center'
					}
				]
			}
		},
		methods: {
			//查看安检项目名称
			handleChecktypeclassify(){
				this.securityInfo=true;
			},
			//关闭安检项目名称列表
			closeInfoMethod(data){
				this.securityInfo=false;
				this.getNameList();
				this.getSecurityTypeList();
			},
			//获取安检项目名称
			getNameList(){
			_http.http2('get', pathUrls.querySecurityNameList+'?deptId=' + this.userData.deptId, {
			}, "form").then((res)=> {
						if(res){
							this.nameList=res.data;
						}
					})
			},
			nameChange(){
			this.getSecurityTypeList()
			},
			typeChange(v){
				if(v){
					this.userTypeName=v.label;
				}

			this.getSecurityTypeList()
			},
			//保存
			handleSave(row, index) {
				let fData = {
					'typeDeptId':this.userData.deptId,
					"typeId": row.typeId,
					"userType": row.userType || this.formSearch.userType,
//					"typeName": row.typeName||this.formSearch.securityName,
					"typeContent": row.typeContent,
					"isActive": row.isActive,
					"classifyId":row.classifyId
				}
				if(fData.userType == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择客户类型!',
						duration: 1
					});
					return false
				}
				if(!fData.classifyId) {
					this.$Message['warning']({
						background: true,
						content: '请选择安检项分类!',
						duration: 1
					});
					return false
				}
				
				if(fData.typeContent == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入安检项详情!',
						duration: 1
					});
					return false
				}
				if(fData.typeContent.length > 64) {
					this.$Message['warning']({
						background: true,
						content: '安检项详情过长!',
						duration: 1
					});
					return false
				}
        this.isDisabled=true;
				if(row.typeId) {
					fData.depts=row.depts;
//					console.log(fData)
//					return false;
					_http.http2('post', pathUrls.ordersecuritytypeUpdate, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '修改成功!',
								onClose: (() => {
									this.getNameList();
									this.getSecurityTypeList();
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
				} else {
//					console.log(fData)
//					return false;
					_http.http2('post', pathUrls.ordersecuritytypeSave, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '添加成功!',
								onClose: (() => {
									this.getNameList();
									this.getSecurityTypeList();
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
			//编辑
			edit(id, index) {
				this.dataList[index].isEdit = true;

				//				this.$router.push('/orderSecurityType/securityEdit' + '/' + id)
			},
			//取消
			cancelClick(id, index) {
				if(!id) {
					this.dataList.splice(index, 1);
				} else {
					this.dataList[index].isEdit = false;
				}

			},
			//添加新的一条
			addNew() {
				this.dataList.push({
					typeName: '',
					typeContent: '',
					isEdit: true,
					userType: '',
					typeId: '',
					isActive: 1
				});
			},

			//获取列表
			getSecurityTypeList() {
				this.loading = true
				_http.http1('post', pathUrls.querySecurityTypeList, {
					userType: this.formSearch.userType,
					classifyId: this.formSearch.securityName,
					typeContent: this.formSearch.securityInfo,
					deptId: this.formSearch.organize,
					isActive: this.formSearch.isAlive,
				}, 'form').then((res) => {
					this.loading = false
					for(let item of res.data) {
						item.userType=+item.userType;
						item.isEdit = false;
						if(item.isActive == 1) {
							item.newActive = '启用'
						} else if(item.isActive == 0) {
							item.newActive = '禁用'
						}

					}
					this.dataList = res.data;
					this.tableHeight=this.screeHeight-140;
				}).catch(()=>{
					this.loading = false;
				})
			},
			//查询
			handleSearch() {
				this.getSecurityTypeList()
			},

			//删除
			remove(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.ordersecuritytypeDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getNameList();
										this.getSecurityTypeList();
									})
								});

							}

						})
					},

				});
			},
	},
		mounted() {
			this.getNameList();
//			this.getOrganize();
			this.loading=true;
			this.common.getUserTypeList(this.userData.deptId).then((res)=>{
				this.userTypeList=res.data;
				if(this.userTypeList.length){
					this.formSearch.userType=this.userTypeList[0].id;
          this.userTypeName=this.userTypeList[0].typeName;
          
				}
				this.getSecurityTypeList();
			})

		}
	}
</script>

<style type="text/css" scoped>
  .main {
    margin-right: 10px;
    background: #FFFFFF;
    min-height: calc(100% - 10px);
    position: relative;
  }

  .mainTop {
    padding: 10px 10px 0;
    width: 100%;
    text-align: left;
  }

  .mainTop>>>.ivu-select-selection {
    height: 30px;
  }

  .mainTop>>>.ivu-form-item {
    margin-bottom: 8px;
  }

  .mainTop button {
    margin-right: 40px;
  }

  .mainContent {
    background: #fff;
    border-radius: 4px;
    padding: 0 10px 10px;
    /*min-height: 400px;*/
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

  .mainContent>>>.ivu-select-single,
  .mainContent>>>.ivu-select-selection,
  .mainContent>>>.ivu-select-selected-value {
    height: 28px;
  }

  .mainContent>>>.ivu-table-wrapper {
    overflow: visible;
  }
</style>
