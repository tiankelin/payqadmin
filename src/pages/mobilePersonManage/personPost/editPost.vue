<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>编辑</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form :label-width="170">
				<FormItem label="角色名称" class=' star'>

					<Input v-model='typeForm.positionName' placeholder="请输入角色名称" maxlength="32" show-word-limit style="width: 380px;" :disabled='typeForm.positionStatus' />
				</FormItem>

				<FormItem label="备注">
					<Input v-model="typeForm.positionRemark" placeholder="备注" style="width: 380px;" maxlength="128" show-word-limit></Input>
				</FormItem>
				<FormItem label="身份证号是否加密">
					<i-switch v-model="typeForm.positionIsEncryption" size="large" false-color="#ff4949">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<!--<FormItem label="排序号">
					<Input v-model="typeForm.sort" placeholder="请输入排序号" style="width: 380px;"></Input>
				</FormItem>-->
				<!--<FormItem label="角色类型">
					<Select v-model="typeForm.positionType" style="width: 380px;">
						<Option :value="1" key="1">配送</Option>
						<Option :value="2" key="2">库管</Option>
						<Option :value="3" key="3">管理</Option>
						<Option :value="4" key="4">充装</Option>
						<Option :value="5" key="5">稽查</Option>
						<Option :value="6" key="6">押运</Option>
						<Option :value="0" key="0">其他</Option>

					</Select>
				</FormItem>-->
				<FormItem label="是否为继承角色">
					<!--<i-switch v-model="typeForm.positionStatus" size="large" false-color="#ff4949" >
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>-->
					<span>{{typeForm.positionStatus?'是':'否'}}</span>
				</FormItem>
				
				<FormItem label="下级是否继承该角色" class='stars' :title='extendsTitle' v-if='!typeForm.positionStatus'>					
					<i-switch v-model="typeForm.positionExtends" size="large" false-color="#ff4949"  style='margin-top: 4px;'>
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<FormItem label="创建时间">
					<Input v-model="typeForm.creatTime" disabled style="width: 380px;" />
				</FormItem>
			</Form>
			<div style="display: flex;" v-if='typeForm.positionExtends'>
				<div style="width: 158px;text-align: right;margin-right: 5px;margin-top: 7px;" :title='title'>
					<span>下级组织</span>
					<span :title='title' class="explain">?</span></div>
					<Tree show-checkbox :data="treeData" node-key="id" ref="tree" highlight-current :props="defaultProps">
					</Tree>
				</div>
				
			</div>
			<div class="mainBodyButton">
				<Button type="primary" @click='editPostFuc' :disabled="isDisabled">确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'editPost',
		data() {
			return {
				extendsTitle:'下级组织是否有该角色 ',
				title:'勾选了哪个组织,哪个组织就有该角色,不勾选的组织没有这个角色',
				isDisabled: false,
				treeData: [],
				userData: (JSON.parse(this.$store.state.userData)),
				typeForm: {
					positionType: null,
					positionName: '',
					positionRemark: '',
					positionIsEncryption:true,
					sort: null,
					creatTime: '',
					positionExtends: true,
					positionStatus: true
				},
				positionDeptId:''

			}
		},
		methods: {

			//获取详情
			getPositionInfo() {
				_http.http1('get', pathUrls.deptPositionInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					let datas = res.data;
					this.typeForm.positionName = datas.positionName; //角色名称
					this.typeForm.positionRemark = datas.positionRemark; //备注
					this.typeForm.positionType = datas.positionType; //角色类型
					this.typeForm.creatTime = datas.positionCreateTime; //创建时间
					this.typeForm.positionIsEncryption = datas.positionIsEncryption; //是否加密
					this.typeForm.positionStatus = datas.positionStatus;
					this.typeForm.positionExtends = datas.positionExtends;
					this.positionDeptId=datas.positionDeptId;
					this.treeData = this.common.getConDept(datas.sysDeptLevelDtoList,1,1);
					
				})
			},

			//点击确定
			editPostFuc() {																			
				let fData = {
					positionId: this.$route.params.id,
					positionName: this.typeForm.positionName,
					positionRemark: this.typeForm.positionRemark,
					positionIsEncryption: this.typeForm.positionIsEncryption,
					//					sort:this.typeForm.sort,
					positionType: this.typeForm.positionType,
					positionCreateTime: this.typeForm.creatTime,
					positionStatus: this.typeForm.positionStatus,
					positionExtends: this.typeForm.positionExtends,
					
					positionDeptId:this.positionDeptId
				}
				if(this.typeForm.positionExtends){
					if(this.$refs.tree){
						let deptList=this.$refs.tree.getCheckedAndIndeterminateNodes();
						let deptIds=[];	
					for(let item of deptList){
						deptIds.push(item.deptId)
					}
				   fData.deptIds=deptIds;
					}
					
				}
				if(fData.positionName == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写角色名称',
						duration: 1
					});
					return false
				}

				this.isDisabled = true;
				_http.http2('post', pathUrls.deptPositionUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.$router.go(-1);
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg
						});

					}
					if(res.code != 0) {
						this.isDisabled = false;
					}
				}).catch(err => {
					this.isDisabled = false;
				})
			},
		//返回
			handleBackClick() {
				this.$router.go(-1)
			}
		},
		mounted() {
			this.getPositionInfo()
			
		}
	}
</script>

<style type="text/css" scoped>
	.ivu-form-item {
		margin-bottom: 10px;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	.explain{
		display: inline-block;
		width: 18px;
		height: 18px;
		border:1px solid #ccc;
		border-radius: 9px;
		text-align: center;
		font-size: 12px;
		color: #f00;
	}
	.stars>>>.ivu-form-item-label:after {
		content: "?";
		color: #f00;
		margin-left: 4px;
		width: 18px;
		height: 18px;
		border:1px solid #ccc;
		border-radius: 9px;
		text-align: center;
		font-size: 12px;
		display: inline-block;
		line-height: 18px;
	}
</style>