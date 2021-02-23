<template>
	<div class='main conMain'>
		<div class="mainTop">
			<Form :model="formSearch" inline :label-width="100">
				<FormItem label="求助类型名称">
					<Select v-model="formSearch.classify" style="width:240px" clearable placeholder="请选择求助类型名称" @on-change='nameChange'>
						<Option :value='item' v-for='(item,index) in nameList' :key='index'>{{item}}</Option>
					</Select>
				</FormItem>

				<FormItem>
					<Button type="success" @click='addHelpType' v-has='1029'>新增</Button>
				</FormItem>
			</Form>

		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading'  ref="table" :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="classify">
					<span v-if='!row.isEdit'>{{row.classify}}</span>
					<span v-else-if='row.isEdit&&formSearch.classify&&!row.id'>{{formSearch.classify}}</span>
					<Input type="text" :value="row.classify" v-else v-model='row.classify' @on-keyup="row.classify=row.classify.replace(/^ +| +$/g,'')"/>
				</template>
				<template slot-scope="{ row, index }" slot="typeName">
					<span v-if='!row.isEdit'>{{row.typeName}}</span>

					<Input type="text" :value="row.typeName" v-else v-model='row.typeName' @on-keyup="row.typeName=row.typeName.replace(/^ +| +$/g,'')"/>
				</template>

				<template slot-scope="{ row, index }" slot="action">
          <div style="display: inline-block;" v-has='1030'>
            <Button type="info" size="small" style="margin-right:10px" @click="edit(row.id, index)" v-if='!row.isEdit'>编辑</Button>
          </div>
					<div style="display: inline-block;" v-has='1032'>
              <Button type="error" size="small" @click="remove(row.id)" v-if='!row.isEdit'>删除</Button>
          </div>

					<Button type="primary" size="small" v-if='row.isEdit' style="margin-right: 10px;" @click='handleSave(row, index)' :disabled="isDisabled">保存</Button>
					<Button type="warning" size="small" v-if='row.isEdit' @click='cancelClick(row.id,index)'>取消</Button>
				</template>
			</Table>
		</div>
	</div>

</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default{
		name:'helpType',
		data(){
			return{
        isDisabled: false,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				formSearch:{
					classify:''
				},
				nameList:[],
				userData: (JSON.parse(this.$store.state.userData)),
				dataList: [],
				loading: false,
				columns:[{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center',
					},{
						title: '求助类型名称',
						key: 'classify',
						align: 'center',
						slot: 'classify',
					},
					{
						title: '求助类型详情',
						key: 'typeName',
						align: 'center',
						slot: 'typeName',
					},
					{
						title: '创建时间',
						key: 'createTime',
						align: 'center',
						width: 180,
					},{
						title: '更新时间',
						key: 'updateTime',
						align: 'center',
						width: 180,
					},{
						title: '操作',
						slot: 'action',
						width: 150,
						align: 'center'
					} ]
			}
		},
	methods:{
		//获取求助类型名称
			getNameList(){
			_http.http2('get', pathUrls.helptypeQueryClassify+'?deptId=' + this.userData.deptId, {
			}, "form").then((res)=> {
						if(res){
							this.nameList=res.data;
						}
					})
			},
		nameChange(){
			this.gethelpTypeList();
		},
		//编辑
			edit(id, index) {
				this.dataList[index].isEdit = true;
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
			addHelpType() {
				this.dataList.push({
					typeName: '',
					isEdit: true,
					id: '',
					classify:''
				});
			},
		//获取列表
			gethelpTypeList() {
				this.loading = true
				_http.http1('post', pathUrls.helptypeList, {
					classify:this.formSearch.classify
				}, 'form').then((res) => {
					this.loading = false
					for(let item of res.data) {
						item.isEdit = false;
					}
					this.dataList = res.data;
					this.tableHeight=this.screeHeight-140;

				})
			},
		//保存
		handleSave(row, index){
			let fData = {
					"typeName": row.typeName,
					'classify':row.classify||this.formSearch.classify
				}

				if(fData.classify == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入求助类型名称!',
						duration: 1
					});
					return false
				}
				if(fData.classify.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '求助类型名称过长!',
						duration: 1
					});
					return false
				}
				if(fData.typeName == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入求助类型详情!',
						duration: 1
					});
					return false
				}
				if(fData.typeName.length > 50) {
					this.$Message['warning']({
						background: true,
						content: '求助类型详情过长!',
						duration: 1
					});
					return false
				}
       this.isDisabled=true;
				if(row.id) {
					fData.id=row.id;
					fData.createTime=row.createTime,
					fData.orgId=row.orgId,
					fData.creator=row.creator,
					fData.reviser=row.reviser
					_http.http2('post', pathUrls.helptypeUpdate, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '修改成功!',
								onClose: (() => {
									this.gethelpTypeList();
									this.getNameList();
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
				_http.http2('post', pathUrls.helptypeSave, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '添加成功!',
								onClose: (() => {
									this.gethelpTypeList();
									this.getNameList();
                  this.isDisabled=false;
								})
							});

						} else {
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
		//删除
			remove(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.helptypeDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.gethelpTypeList();
										this.getNameList();
									})
								});

							}

						})
					},

				});
			},
	},
	mounted(){
		this.getNameList();
		this.gethelpTypeList();
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
		padding:10px 10px 0;
		width: 100%;
		text-align: left;

		padding-right: 35px;
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

	.mainContent>>>.ivu-select-single,.mainContent>>>.ivu-select-selection,.mainContent>>>.ivu-select-selected-value {
		height: 28px;
	}
	.mainContent>>>.ivu-table-wrapper{
		overflow: visible;
	}
	.mainTop>>>.ivu-form-item{
		margin-bottom: 12px;
	}
</style>
