<template>
	<div class="main">
		<div class='mainTop'>新增</div>
		<div class="mainContent">
			<Form ref="typeForm" :model="typeForm" :label-width="120">
				<FormItem label="商品品类" class='goodsType star'>
					<Select v-model="typeForm.goodsType" style="width:380px"  placeholder="请选择商品品类">
						<Option :value='1'>液化石油气</Option>
						<Option :value='2'>其他</Option>
					</Select>
				</FormItem>
				<FormItem label="商品名称" class='goodsName star'>
					<Input v-model="typeForm.goodsName" placeholder="请输入商品名称" />
				</FormItem>
				<FormItem label="所属组织" class='star'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeOwn" @change='organizeSelected' style="width: 380px;"></el-cascader>
				</FormItem>
				<FormItem label="默认单价" class='unitPrice star'>
					<!--<Input v-model="typeForm.unitPrice" placeholder="请输入默认单价" />-->
					<InputNumber :min='0' :max='100000' v-model="typeForm.unitPrice" style="text-align: center;width: 380px;" placeholder="请输入默认单价" />
				</FormItem>
				<FormItem label="商品规格" class='goodsSpec star' v-if='typeForm.goodsType==1'>
					<Select v-model="typeForm.goodsSpec" style="width:380px"  placeholder="请选择商品规格">
						<Option value='YSP35.5'>YSP35.5</Option>
						<Option value='YPS118'>YPS118</Option>
						<Option value='YSP118-2'>YSP118-2</Option>
					</Select>
				</FormItem>
				<FormItem label="商品规格" class='goodsSpec stars' v-else>
					<Input v-model="typeForm.goodsSpec" placeholder="请输入商品规格" />
				</FormItem>
				<!--<FormItem label="商品图片" class='goodsPic'>
					<Upload :on-success='handleUploadSuccess' :show-upload-list="false" type="drag" :action="fileUrl">
						<div style="margin-top:25px">
							<Icon type="ios-cloud-upload" size="52" style="color: #3399ff;" v-if='!typeForm.goodsPic'></Icon>							
							<img :src="typeForm.goodsPic" alt="" style="width: 100px;height: 100px;position: absolute;left: 0;top:0" />
						</div>
					</Upload>
				</FormItem>-->
				<FormItem>
					<Button type="primary" @click='enterClick'>确定</Button>
					<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
				</FormItem>
			</Form>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'commodityAdd',
		data() {
			return {
				
//				fileUrl: 'https://sys.payq-iot.com:8089//file/upload',
				fileUrl: pathUrls.fileUpload,
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				typeForm: {
					goodsName: '',
					organizeOwn: '',
					unitPrice:null,
					goodsPic:'',
					goodsType:1,
					goodsSpec:''
				}
			}
		},
		methods: {
			
			//点击确定
			enterClick(){
				let fData={
					goodsType:this.typeForm.goodsType,
					goodsName:this.typeForm.goodsName,
					orgId:this.typeForm.organizeOwn,
					goodsPic:this.typeForm.goodsPic,
					unitPrice:this.typeForm.unitPrice,
					creater:this.userData.userId,
					spec:this.typeForm.goodsSpec,
					
				}
				if(fData.goodsType == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择商品类别!',						
					});
					return false
				}
				if(fData.goodsName == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入商品名称!',						
					});
					return false
				}
				if(fData.goodsName.length>20) {
					this.$Message['warning']({
						background: true,
						content: '商品名称过长!',						
					});
					return false
				}
				if(fData.orgId == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择所属组织!',						
					});
					return false
				}
				if(!fData.unitPrice) {
					this.$Message['warning']({
						background: true,
						content: '请输入默认单价!',						
					});
					return false
				}
				if(fData.goodsType ==1&&!fData.spec) {
					this.$Message['warning']({
						background: true,
						content: '请选择商品规格!',						
					});
					return false
				}
				if(fData.goodsType ==2&&fData.spec&&fData.spec.length>20) {
					this.$Message['warning']({
						background: true,
						content: '商品规格过长!',						
					});
					return false
				}
				_http.http2('post', pathUrls.deptgoodsSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
								this.$router.go(-1)
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
			//返回
			handleBackClick(){
				this.$router.go(-1);	
			},
			//改变组织
			organizeSelected(value) {
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.organizeOwn = id
				}
			},
			handleUploadSuccess(res, file) {
				this.typeForm.goodsPic = res.data.src
			},
		},
		mounted() {
		this.typeForm.organizeOwn=this.userData.deptId+''
		this.common.getDeptList(this.userData.deptId).then((res) => {
			this.options = this.common.getConDept(res.data, 0, 0, 1)
		})
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		overflow: hidden;
		padding-right: 10px;
	}
	
	.mainTop {
		background: #fff;
		height: 44px;
		line-height: 44px;
		text-align: left;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
		margin-bottom: 10px;
	}
	
	.mainContent {
		background: #fff;
		/*height: 500px;*/
		border-radius: 4px;
		text-align: left;
		padding: 10px 20px 20px 0;
		overflow-y: auto;
		height: calc(100vh - 130px);
	}
	
	.mainContent>>>.el-input__inner {
		height: 32px;
		line-height: 32px;
	}
	
	.mainContent>>>.el-input__icon {
		line-height: 32px;
	}
	
	.ivu-form-item {
		margin-bottom: 10px;
		width: 500px;
	}
	.mainContent>>>.ivu-upload {
		width: 100px;
		height: 100px;
		vertical-align: middle;
	}
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	.stars>>>.ivu-form-item-label:after {
		content: "*";
		color: #fff;
		padding-right: 2px;
	}
</style>