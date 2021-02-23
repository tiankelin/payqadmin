<template>
	<div>
		<div style="text-align: right;position: absolute;right: 50px;top:0px;z-index: 100;">
			<Button type="warning" @click='handleContentsCheck' style="height: 28px;line-height: 28px;margin-right: 20px;">安检项选择</Button>
			<Button type="success" @click='handleContentsAdd' style="height: 28px;line-height: 28px;">安检项新增</Button>
		</div>
		<Table border :columns="columns" :data="contentsData" :loading="loading">
			<template slot-scope="{ row, index }" slot="typeName">
				<Input type="text" v-model='row.typeName' v-if='row.isEdit' style='height: 28px;line-height: 28px;' placeholder="请输入安检项名称" />
				<span v-else>{{row.typeName}}</span>
			</template>
			<template slot-scope="{ row, index }" slot="typeContent">
				<Input type="text" v-model='row.typeContent' v-if='row.isEdit' style='height: 28px;line-height: 28px;' placeholder="请输入安检项内容" />
				<span v-else>{{row.typeContent}}</span>
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
				<Button size="small" type="info" style="margin:0 5px;" @click='editClick(row.id, index)' v-if='!row.isEdit'>编辑</Button>
				<Button size="small" type="error" @click='deleteClick(row.id)' v-if='!row.isEdit'>删除</Button>
				<Button type="primary" size="small" v-if='row.isEdit' style="margin:0 5px;" @click='handleSave(row, index)' :disabled="isDisabled">保存</Button>
				<Button type="warning" size="small" v-if='row.isEdit' @click='cancelClick(row.id,index)'>取消</Button>
			</template>
		</Table>
		<checkContent v-if='contentsCheckShow' @contentCheck='contentCheckMethod' :vipUserId='vipUserId' @addSuc='addSucMethod'></checkContent>
	</div>

</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import checkContent from './checkContent';
	export default {
		name: 'vipContents',
		components:{
			checkContent
		},
		props: {
			vipUserId: Number,
			tabsCheck: Number
		},
		data() {
			return {
        isDisabled: false,
				contentsCheckShow:false,
				userData: (JSON.parse(this.$store.state.userData)),
				loading: false,
				contentsData: [],
				columns: [{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center',
					}, {
						title: '安检项名称',
						key: 'typeName',
						align: 'center',
						slot: 'typeName'
					}, {
						title: '安检项详情',
						key: 'typeContent',
						align: 'center',
						slot: 'typeContent',

					}, {
						title: '是否启用',
						key: 'newActive',
						align: 'center',
						width: 120,
						slot: 'newActive',
					},
//					{
//						title: '创建时间',
//						key: 'createTime',
//						align: 'center',
//						width: 170,
//					}, {
//						title: '修改时间',
//						key: 'updateTime',
//						//sortable: true,
//						align: 'center',
//						width: 170,
//					},

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
		watch: {
			'tabsCheck': {
				handler(newTabs, oldTabs) {　
					if(newTabs == 1) {
						this.getContentsList()
					}
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			addSucMethod(data){
				this.getContentsList();
			},
			contentCheckMethod(data){
				this.contentsCheckShow=data;

			},
			//安检项选择
			handleContentsCheck(){
				this.contentsCheckShow=true;
			},
			//保存
			handleSave(row, index) {
				let fData = {
					checkTypeList: [{
						userId: this.vipUserId,
						typeName: row.typeName,
						typeContent: row.typeContent,
						isActive: row.isActive,
						id: row.id
					}]

				}
				if(!row.typeName) {
					this.$Message['warning']({
						background: true,
						content: '请添加安检项名称!',
					});
					return false
				}
				if(row.typeName.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '安检项名称过长!',
					});
					return false
				}
				if(!row.typeContent) {
					this.$Message['warning']({
						background: true,
						content: '请添加安检项详情!',
					});
					return false
				}
				if(row.typeContent.length>64) {
					this.$Message['warning']({
						background: true,
						content: '安检项详情过长!',
					});
					return false
				}
        this.isDisabled=true;
				if(!row.id) {
					_http.http2('post', pathUrls.vipuserchecktypeSave, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '添加成功!',
								onClose: (() => {
									this.getContentsList();
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
					fData.checkTypeList[0].orgId = row.orgId;
					fData.checkTypeList[0].createTime = row.createTime;
					_http.http2('post', pathUrls.vipuserchecktypeUpdate, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '修改成功!',
								onClose: (() => {
									this.getContentsList();
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

			//获取安检项内容列表
			getContentsList() {
				this.contentsData = [];
				this.loading = true;
				_http.http1('post', pathUrls.vipuserchecktypeList, {
					userId: this.vipUserId
				}, 'form').then((res) => {
					this.loading = false;
					for(let item of res.data) {
						item.isEdit = false;
						if(item.isActive == 1) {
							item.newActive = '启用'
						} else if(item.isActive == 0) {
							item.newActive = '禁用'
						}
					}
					this.contentsData = res.data;
				})
			},
			//取消
			cancelClick(id, index) {
				if(!id) {
					this.contentsData.splice(index, 1);
				} else {
					this.contentsData[index].isEdit = false;
				}
			},
			//编辑
			editClick(id, index) {
				this.contentsData[index].isEdit = true;
			},
			//新增
			handleContentsAdd() {
				this.contentsData.push({
					typeName: null,
					typeContent: null,
					isEdit: true,
					id: null,
					isActive: 1
				})
			},
			//删除
			deleteClick(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.vipuserchecktypeDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.getContentsList()
							}

						})
					},

				});
			},

		},
		mounted() {
			//			this.getContentsList()
		}
	}
</script>

<style type="text/css" scoped>

</style>
