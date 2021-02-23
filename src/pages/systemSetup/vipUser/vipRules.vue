<template>
	<div>
		<div style="text-align: right;position: absolute;right: 50px;top:0px;z-index: 100;">
			<Button type="success" @click='handleRulesAdd' style="height: 28px;line-height: 28px;">规则新增</Button>
		</div>
		<Table border :columns="columns" :data="rulesData" :loading="loading">
			<template slot-scope="{ row, index }" slot="checkPeriod">
				<InputNumber v-model='row.checkPeriod' v-if='row.isEdit' :min='0' :max='360' style='height: 28px;line-height: 28px;width: 90%;' />
				<span v-else>{{row.checkPeriod}}</span>
			</template>
			<template slot-scope="{ row, index }" slot="action">
				<Button size="small" type="info" style="margin:0 5px;" @click='editClick(row.id, index)' v-if='!row.isEdit'>编辑</Button>
				<Button size="small" type="error" @click='deleteClick(row.id)' v-if='!row.isEdit'>删除</Button>
				<Button type="primary" size="small" v-if='row.isEdit' style="margin:0 5px;" @click='handleSave(row, index)' :disabled="isDisabled">保存</Button>
				<Button type="warning" size="small" v-if='row.isEdit' @click='cancelClick(row.id,index)'>取消</Button>
			</template>
		</Table>
	</div>

</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'vipRules',
		props: {
			vipUserId: Number,
			tabsCheck:Number
		},
		data() {
			return {
				isDisabled: false,
				userData: (JSON.parse(this.$store.state.userData)),
				loading: false,
				rulesData: [],
				columns: [{
					title: '序号',
					type: 'index',
					width: 70,
					align: 'center',
				}, {
					title: '安检周期(天)',
					key: 'checkPeriod',
					align: 'center',
					slot: 'checkPeriod'
				}, {
					title: '创建时间',
					key: 'createTime',
					align: 'center'
				}, {
					title: '修改时间',
					key: 'updateTime',
					//sortable: true,
					align: 'center'
				}, {
					title: '操作',
					key: 'action',
					width: 200,
					align: 'center',
					slot: 'action'
				}]
			}
		},
		watch:{
			'tabsCheck':{
				handler(newTabs, oldTabs) {　					
					if(newTabs==0){
						this.getVipRulesList()	
					}
				},
				deep: true,
				immediate: true	
			}
		},
		methods: {
			//获取安检规则列表
			getVipRulesList() {
				this.rulesData = [];
				this.loading = true;
				_http.http1('post', pathUrls.vipusercheckruleList, {
					userId: this.vipUserId
				}, 'form').then((res) => {
					this.loading = false;
					for(let item of res.data) {
						item.isEdit = false;
					}
					this.rulesData = res.data;
				})
			},
			//取消
			cancelClick(id, index) {
				if(!id) {
					this.rulesData.splice(index, 1);
				} else {
					this.rulesData[index].isEdit = false;
				}
			},
			//保存
			handleSave(row, index) {
				let fData = {
					id: row.id,
					checkPeriod: row.checkPeriod, //安检周期
					userId: this.vipUserId,
				}
				if(!fData.checkPeriod) {
					this.$Message['warning']({
						background: true,
						content: '请添加安检周期!',
					});
					return false
				}
				this.isDisabled=true;
				if(!row.id) {
					_http.http2('post', pathUrls.vipusercheckruleSave, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '添加成功!',
								onClose: (() => {
									this.getVipRulesList();
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
					fData.orgId = row.orgId;
					fData.createTime = row.createTime;
					_http.http2('post', pathUrls.vipusercheckruleUpdate, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '修改成功!',
								onClose: (() => {
									this.getVipRulesList();
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
			//删除
			deleteClick(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.vipusercheckruleDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.getVipRulesList()
							}

						})
					},

				});
			},
			//编辑
			editClick(id, index) {
				this.rulesData[index].isEdit = true;
			},
			//新增
			handleRulesAdd() {
				this.rulesData.push({
					checkPeriod: null,
					isEdit: true,
					id: null
				})
			},
		},
		mounted() {
//			this.getVipRulesList()
		}
	}
</script>

<style type="text/css" scoped>		
	
</style>