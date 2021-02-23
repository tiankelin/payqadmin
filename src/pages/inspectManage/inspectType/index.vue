<template>
	<div class='main conMain'>
		<div class="mainTop">
			<Button type="success" @click='handleAdd' v-has='925'>新增</Button>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading="loading" :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="auditTypeName">
					<span v-if='!row.isEdit'>{{row.auditTypeName}}</span>					
					<Input type="text" :value="row.auditTypeName" v-else v-model='row.auditTypeName' @on-keyup="row.auditTypeName=row.auditTypeName.replace(/^ +| +$/g,'')"/>
				</template>
				<template slot-scope="{ row, index }" slot="roles">
					<Select @on-change='positionChange(row, index)' v-if='row.isEdit' v-model="row.newRoles" multiple style="text-align: left;" label-in-value  placeholder='请选择被巡查对象'>
						<Option v-for="item in positionList" :value="item.positionId" :key="item.positionId">{{ item.positionName }}</Option>
					</Select>
					<span v-else>{{row.positionTypeName.toString()}}</span>
				</template>
				<template slot-scope="{ row, index }" slot="action">
					<!--<Button type="info" size="small" style="margin-right: 5px" @click="edit(row.id)" v-has='926'>编辑</Button>
					<Button type="error" size="small" style="margin-right: 5px" @click="remove(row.id)" v-has='963'>删除</Button>-->
					
					<div style="display: inline-block;" v-has='926'>
						<Button type="info" size="small" style="margin-right:10px" @click="edit(row.id, index)" v-if='!row.isEdit' >编辑</Button>
					</div>
					<div style="display: inline-block;" v-has='963'>
						<Button type="error" size="small" @click="remove(row.id)" v-if='!row.isEdit' >删除</Button>
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
	export default {
		name: 'inspectType',
		data() {
			return {
				isDisabled: false,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				positionType:[],
				positionList:[],
				userData: (JSON.parse(this.$store.state.userData)),
				loading: false,
				dataList: [],
				columns: [{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center',
					},{
						title: '巡查项目',
						key: 'auditTypeName',
						align: 'center',
						slot:'auditTypeName',
						
					},{
						title: '被巡查对象',
						key: 'roles',
						align: 'center',
						slot:'roles',
						
					},
					{
						title: ' 创建时间',
						key: 'createTime',
						align: 'center',
						width: 170,
					},
					{
						title: '更新时间',
						key: 'updateTime',
						align: 'center',
						width: 170,
					},
					{
						title: '操作',
						key: 'action',
						width: 150,
						align: 'center',
						slot:'action',
					}
				]
			}
		},
		methods: {
			positionChange(row, index) {
				
			},
			//获取岗位名称
			getPositionName(id) {
				_http.http1('post', pathUrls.apiDeptPositionQuery, {
					deptId: id
				}, 'form').then((res) => {
					this.positionList = res.data;

				})
			},
			//取消
			cancelClick(id, index) {
				if(!id) {
					this.dataList.splice(index, 1);
				} else {
					this.dataList[index].isEdit = false;
				}

			},
			//保存
			handleSave(row, index){	
				
				let fData = {					
					auditTypeName: row.auditTypeName,					
					roles:JSON.stringify(row.newRoles),
				}
				if(fData.auditTypeName == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入巡查项目名称!',
						duration: 1
					});
					return false
				}
				if(fData.auditTypeName.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '巡查项目名称过长!',
						duration: 1
					});
					return false
				}
				if(!row.newRoles.length) {
					this.$Message['warning']({
						background: true,
						content: '请选择被巡查对象!',
						duration: 1
					});
					return false
				}
				this.isDisabled=true;
				if(row.id) {
					fData.deptId=row.deptId;
					fData.id=row.id;
					fData.createTime=row.createTime;
					_http.http2('post', pathUrls.audittypeUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.getInspectTypeList();
								this.isDisabled=false;
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg
						});

					}
					if(res.code !=0) {
					this.isDisabled=false;	

					}
				}).catch(err=>{
					this.isDisabled=false;
				})
					
					
				}else{
					_http.http2('post', pathUrls.audittypeSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
								this.getInspectTypeList();
								this.isDisabled=false;
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg
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
			remove(id){				
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.audittypeDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getInspectTypeList();
									})
								});

							}

						})
					},

				});
			},
			//编辑
			edit(id,index){
//			this.$router.push('/inspectType/editInspect' + '/' + id);
			this.dataList[index].isEdit = true;
			},
			//点击新增
			handleAdd(){
//				this.$router.push('/inspectType/addInspect');
				this.dataList.push({
					auditTypeName: '',
					positionTypeName:[],
					newRoles:[],
					isEdit: true,					
					id: ''
				});
			},
			//获取巡查类型列表
			getInspectTypeList() {
				this.loading = true
				_http.http1('post', pathUrls.audittypeList, {
				}, 'form').then((res) => {
					this.loading = false
					if(res.data){
						for(let item of res.data) {
						item.isEdit = false;						
						item.positionTypeName=[];
						item.newRoles=[];
						let roleData=[];
						if(item.roles){
							roleData=JSON.parse(item.roles);
						}
						
						if(roleData.length){
							for(let items of roleData){
								item.positionTypeName.push(items.positionName);
								item.newRoles.push(items.positionId+'');
							}
						}
					}
					this.dataList = res.data
					this.tableHeight=this.screeHeight-140;	
					}
					
					

})
	},

	},
	mounted() {
		this.getPositionName(this.userData.deptId)
		this.getInspectTypeList()
	}
	}</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		min-height: calc(100% - 10px);
		background: #fff;
		position: relative;
	}
	
	.mainTop {
		background: #fff;
		height: 48px;
		line-height: 48px;
		text-align: right;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
		margin-right:25px;
		
	}
	
	.mainTop button {
		margin-right: 10px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding:10px;
		min-height: 400px;
	}
	
	.mainContent>>>td {
		height: 40px;
	}	
	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
	}
	.mainContent>>>.ivu-table-wrapper{
		overflow: visible;
	}
</style>