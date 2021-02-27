<template>
	<div class="securityMain">
		<div class="securityContent">
			<div class="securityTitle">
				<span>安检项分类</span>
				<Button type="success" style="margin-left: 20px;" @click="handleAddTypeName">添加</Button>
			</div>
			<div class="closeWrapper" @click='handleClose'>
				<Icon type="md-close" />
			</div>
			<div style="margin-top: 10px;">
				<Table border :columns="columns" :data="dataList" :loading='loading' :height='infoHeight'>
					<template slot-scope="{ row, index }" slot="typeName">
						<span v-if='!row.isEdit'>{{row.typeName}}</span>
						<Input type="text" :value="row.typeName" v-else v-model='row.typeName' />
					</template>
					<template slot-scope="{ row, index }" slot="mustChoose">
						<span v-if='!row.isEdit' style="color:#2d8cf0;">{{row.newMustChoose}}</span>
						<i-switch v-model="row.mustChoose" size="large" false-color="#ff4949" :true-value='1' :false-value='0' v-else>
							<span slot="open">是</span>
							<span slot="close">否</span>
						</i-switch>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<Button type="info" size="small" style="margin-right:10px" @click="edit(row.id, index)" v-if='!row.isEdit'>编辑</Button>
						<Button type="error" size="small" @click="remove(row.id)" v-if='!row.isEdit'>删除</Button>
						<Button type="primary" size="small" v-if='row.isEdit' style="margin-right: 10px;" @click='handleSave(row, index)' :disabled="isDisabled">保存</Button>
						<Button type="warning" size="small" v-if='row.isEdit' @click='cancelClick(row.id,index)'>取消</Button>
					</template>
				</Table>
			</div>
		</div>

	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'securityName',
		data() {
			return {
				
				userData: (JSON.parse(this.$store.state.userData)),
				isDisabled: false,
				screeHeight: document.documentElement.clientHeight, // 屏幕高				
				infoHeight: 'auto',
				loading: false,
				dataList: [],
				columns: [{
						title: '序号',
						type: 'index',
						width: 100,
						align: 'center',
						key: 'newIndex',
					},
					{
						title: '安检项分类',
						align: 'center',
						key: 'typeName',
						slot: 'typeName'
					},
					{
						title: '是否必选',
						align: 'center',
						key: 'mustChoose',
						slot: 'mustChoose'
					},
					{
						title: '创建时间',
						align: 'center',
						key: 'createTime',

					},
					{
						title: '操作',
						slot: 'action',
						width: 150,
						align: 'center'
					}

				]
			}
		},
		methods: {
			//保存
			handleSave(row, index) {
				let fData = {
					"typeName": row.typeName,
					"mustChoose": row.mustChoose,
					"deptId": this.userData.deptId
				}
				if(fData.typeName == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入安检分类!',
						duration: 1
					});
					return false
				}
				if(fData.typeName.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '安检项分类过长!',
						duration: 1
					});
					return false
				}
				this.isDisabled = true;
				if(row.id) {
					fData.id = row.id;
					fData.createTime=row.createTime;
//					console.log(fData)
//					return false;
					_http.http2('post', pathUrls.securitychecktypeclassifyUpdate, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '修改成功!',
								onClose: (() => {
									this.getSecurityNameList();
									this.isDisabled = false;
								})
							});

						}
						if(res.code == 500) {
							this.$Message['warning']({
								background: true,
								content: res.msg,
							});
						}
						if(res.code != 0) {
							this.isDisabled = false;

						}
					}).catch(err => {
						this.isDisabled = false;
					})
				} else {
					//					console.log(fData)
					//					return false;
					_http.http2('post', pathUrls.securitychecktypeclassifySave, fData).then((res) => {
						if(res.code == 0) {
							this.$Message['success']({
								background: true,
								content: '添加成功!',
								onClose: (() => {
									this.getSecurityNameList();
									this.isDisabled = false;
								})
							});

						}
						if(res.code == 500) {
							this.$Message['warning']({
								background: true,
								content: res.msg,
							});
						}
						if(res.code != 0) {
							this.isDisabled = false;

						}
					}).catch(err => {
						this.isDisabled = false;
					})

				}

			},
			//删除
			remove(id) {
				this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.securitychecktypeclassifyDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!',
									onClose: (() => {
										this.getSecurityNameList();
									})
								});

							}

						})
					},

				});
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
			//添加
			handleAddTypeName() {
				this.dataList.push({
					typeName: '',
					isEdit: true,
					id: '',
					mustChoose: 0
				});
			},
			//关闭
			handleClose() {
				this.$emit('closeInfo', false);
			},
			//获取客户信息列表
			getSecurityNameList() {
				this.loading = true
				_http.http2('post', pathUrls.securitychecktypeclassifyList, {}).then((res) => {
					this.loading = false;
					for(let item of res.data) {
						item.isEdit = false;
						if(item.mustChoose == 1) {
							item.newMustChoose = '是'
						} else if(item.mustChoose == 0) {
							item.newMustChoose = '否'
						}
					}
					this.dataList = res.data;
					if(this.dataList.length < 12) {
						this.infoHeight = 'auto'
					} else {
						this.infoHeight = this.screeHeight - 170;
					}
				}).catch(() => {
					this.loading = false;
				})
			},

		},
		mounted() {
			this.getSecurityNameList()
		}
	}
</script>

<style type="text/css" scoped>
	.securityMain {
		background: rgb(41, 107, 126);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
	}
	
	.securityContent {
		width: calc(100% - 0px);
		height: calc(100% - 0px);
		background: #fff;
		/* border-radius: 4px; */
		padding: 10px;
		/*margin: 5px;*/
		position: relative;
		text-align: left;
	}
	
	.closeWrapper {
		position: absolute;
		right: 12px;
		top: 0px;
		font-size: 32px;
		cursor: pointer;
		color: #1296db;
		font-weight: 600;
	}
</style>