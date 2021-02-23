<template>
	<div class="mainBorder">
		<div class='mainHeader'>
		    <span>编辑</span>
		    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :label-width="120">
				<FormItem label="类型" class='goodsType star'>
					<Select v-model="typeForm.goodsType" style="width:380px" placeholder="请选择商品品类">
						<Option :value='item.id' v-for='item in typeList' :key='item.id'>{{item.goodsTypeName}}</Option>
					</Select>
				</FormItem>
				<FormItem label="商品名称" class='goodsName star'>
					<Input v-model="typeForm.goodsName" placeholder="请输入商品名称" />
				</FormItem>
				<FormItem label="型号" class='goodsModel star'>
					<Select v-model="typeForm.goodsModel" style="width:380px" placeholder="请选择型号" label-in-value @on-change='modelChange'>
						<Option :value='item.id' v-for='item in modelList' :key='item.id' :tag='item.goodsSpec'>{{item.goodsModel}}</Option>
					</Select>
				</FormItem>
				<FormItem label="关联钢瓶规格" class='goodsSpec stars'>
					<Select v-model="typeForm.goodsSpec" style="width:380px" disabled>
						<Option :value='item.id' v-for='item in specList' :key='item.id'>{{item.goodsSpec}}</Option>
					</Select>
				</FormItem>
				<FormItem label="别名" class='goodsAlias stars'>
					<Input v-model="typeForm.goodsAlias" placeholder="请输入商品别名" />
				</FormItem>
				<FormItem label="使用范围" class='stars'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeOwn" @change='organizeSelected' style="width: 380px;"></el-cascader>
				</FormItem>
				<FormItem label="单位" class='goodsUnit stars'>
					<Select v-model="typeForm.goodsUnit" style="width:380px" placeholder="请选择单位">
						<Option value='只'>只</Option>
						<Option value='公斤'>公斤</Option>
						<Option value='个'>个</Option>
						<Option value='立方'>立方</Option>
						<Option value='根'>根</Option>
						<Option value='米'>米</Option>
						<Option value='张'>张</Option>
						<Option value='把'>把</Option>
						<Option value='条'>条</Option>
					</Select>
				</FormItem>
				<FormItem label="体积" class='goodsVolume stars'>
					<InputNumber v-model="typeForm.goodsVolume" placeholder="请输入商品体积" :min='0' :max='1000' style="text-align: center;width: 380px;" />
				</FormItem>
				<FormItem label="重量" class='goodsWeight stars'>
					<InputNumber v-model="typeForm.goodsWeight" placeholder="请输入商品重量" :min='0' :max='1000' style="text-align: center;width: 380px;" />
				</FormItem>

				<FormItem label="计价方式" class='pricingMode stars'>
					<Select v-model="typeForm.pricingMode" style="width:380px" placeholder="请选择计价方式">
						<Option :value='1'>按包装计费</Option>
						<Option :value='2'>按单位计费</Option>
					</Select>
				</FormItem>
				<FormItem label="配送费" class='distributeCost stars'>
					<InputNumber :min='0' :max='99999' v-model="typeForm.distributeCost" style="text-align: center;width: 380px;" placeholder="请输入配送费用" />
				</FormItem>
				<FormItem label="上楼费" class='upstairsFee stars'>
					<InputNumber :min='0' :max='99999' v-model="typeForm.upstairsFee" style="text-align: center;width: 380px;" placeholder="请输入上楼费" />
				</FormItem>
				<FormItem label="押金" class='deposit stars'>
					<InputNumber :min='0' :max='99999' v-model="typeForm.deposit" style="text-align: center;width: 380px;" placeholder="请输入押金" />
				</FormItem>
				<FormItem label="商品状态" class='goodsStatus stars'>
					<Select v-model="typeForm.goodsStatus" style="width:380px" placeholder="请选择商品状态">
						<Option :value='1'>正常</Option>
					</Select>
				</FormItem>
				<FormItem label="商品性质" class='goodsNature stars'>
					<Select v-model="typeForm.goodsNature" style="width:380px" placeholder="请选择商品性质">
						<Option :value='1'>实物货品</Option>
						<Option :value='2'>实物货品-托管瓶</Option>
						<Option :value='3'>实物货品-现充瓶</Option>
						<Option :value='4'>虚拟货品-优惠券</Option>
						<Option :value='5'>虚拟货品-入会费</Option>
						<Option :value='6'>虚拟货品-预售卡</Option>

					</Select>
				</FormItem>
				<FormItem label="商品介质" class='stars'>
					<Select clearable style='width: 380px;' v-model='goodsMedium' placeholder="请选择商品介质">
						<Option v-for='item in fillMediumList' :key='item.id' :value='item.id'>{{item.name}}</Option>
					</Select>
				</FormItem>
				<FormItem label="营销渠道" class='marketingChannel stars'>
					<Select v-model="typeForm.marketingChannel" style="width:380px" placeholder="请选择营销渠道">
						<Option :value='1'>呼叫中心</Option>
						<Option :value='2'>线上渠道</Option>
					</Select>
				</FormItem>
				<FormItem label="其他" class='other stars'>
					<CheckboxGroup v-model="typeForm.other">
						<Checkbox label="1">不统计库存</Checkbox>
						<Checkbox label="2">启用轻重转换</Checkbox>
						<Checkbox label="3">无需扫码</Checkbox>
					</CheckboxGroup>
				</FormItem>
				<FormItem label="描述" class='goodsDesc stars'>
					<Input type="textarea" v-model="typeForm.goodsDesc" style="width:380px" placeholder="商品描述" />
				</FormItem>
			</Form>
			<div class='mainBodyButton' v-has='937'>
				<Button type="primary" @click='enterClick' >确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'commodityEdit1',
		data() {
			return {
				goodsMedium:'',
				fillMediumList:[],
				specList:[],
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				modelList: [],
				typeList: [],
				typeForm: {
					goodsSpec:null,
					goodsType: '',
					goodsName: '',
					goodsCode: '',
					goodsUnit: '',
					goodsVolume: '',
					goodsWeight: '',
					goodsModel: '',
					distributeCost: 0,
					deposit: 0,
					pricingMode: '',
					upstairsFee: 0,
					goodsStatus: '',
					goodsNature: '',
					marketingChannel: '',
					goodsAlias: '',
					goodsDesc: '',
					other: [],
					organizeOwn: ''
				},
				goodsId:'',
				updateTime:'',
				creater:'',
				createTime:''
			}
		},
		methods: {
			//改变型号
			modelChange(v){
				if(v){
					this.typeForm.goodsSpec=v.tag;
				}else{
					this.typeForm.goodsSpec=null;
				}
			},
			//获取商品规格
			getGoodsSpecList() {
				_http.http1('post', pathUrls.goodsspecList, {}, 'form').then((res) => {
					this.specList = res.data;
				})
			},
			//获取详情
			getDeptgoodsInfo() {
				_http.http1('get', pathUrls.deptgoodsInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					this.goodsMedium=res.deptGoods.goodsMedium; //商品介质
					this.typeForm.goodsType = res.deptGoods.goodsType; //类型
					this.typeForm.goodsName = res.deptGoods.goodsName; //名称
					this.typeForm.goodsSpec = res.deptGoods.goodsSpec; //规格
					this.typeForm.goodsAlias = res.deptGoods.goodsAlias; //别名
					this.typeForm.organizeOwn = res.deptGoods.orgId + ''; //使用范围
					this.typeForm.goodsUnit = res.deptGoods.goodsUnit; //单位
					this.typeForm.goodsVolume = res.deptGoods.goodsVolume; //体积
					this.typeForm.goodsWeight = res.deptGoods.goodsWeight; //重量
					this.typeForm.goodsModel = res.deptGoods.goodsModel; //型号
					this.typeForm.pricingMode = res.deptGoods.pricingMode; //计价方式
					this.typeForm.distributeCost = res.deptGoods.deliveryFee; //配送费
					this.typeForm.upstairsFee = res.deptGoods.upstairsFee; //上楼费
					this.typeForm.deposit = res.deptGoods.deposit; //押金
					this.typeForm.goodsStatus = res.deptGoods.goodsStatus; //商品状态
					this.typeForm.goodsNature = res.deptGoods.goodsNature; //商品性质
					this.typeForm.marketingChannel = res.deptGoods.marketChannel; //营销渠道
					if(res.deptGoods.other) {
						this.typeForm.other = (res.deptGoods.other + '').split(','); //其他
					}
					this.typeForm.goodsDesc = res.deptGoods.goodsDesc; //描述
					this.typeForm.goodsPic = res.deptGoods.goodsPic; //图片

					this.createTime = res.deptGoods.createTime;
					this.goodsId=res.deptGoods.goodsId;
					this.updateTime=res.deptGoods.updateTime;
					this.creater=res.deptGoods.creater;
					for(let item of this.modelList){
						if(item.id==res.deptGoods.goodsModel){
							
							this.typeForm.goodsSpec=item.goodsSpec;
						}
					}

				})
			},
			//获取商品型号
			getGoodsModelList() {
				_http.http1('post', pathUrls.goodsmodelList, {}, 'form').then((res) => {
					this.modelList = res.data;
					this.getDeptgoodsInfo()
				})
			},
			//获取商品类型
			getGoodsTypeList() {
				_http.http1('post', pathUrls.goodstypeList, {}, 'form').then((res) => {
					this.typeList = res.data;
				})
			},
			//改变组织
			organizeSelected(value) {
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.organizeOwn = id
				} else {
					this.typeForm.organizeOwn = null
				}
			},
			//确定
			enterClick(){
				let fData={
					creater:this.creater,
					goodsId:this.goodsId,
					createTime:this.createTime,
					updateTime:this.updateTime,
					goodsType:this.typeForm.goodsType,//类型
					goodsName:this.typeForm.goodsName,//名称
					goodsAlias:this.typeForm.goodsAlias,//别名
					orgId:this.typeForm.organizeOwn,//使用范围
					goodsUnit:this.typeForm.goodsUnit,//单位
					goodsVolume:this.typeForm.goodsVolume,//体积
					goodsWeight:this.typeForm.goodsWeight,//重量
					goodsModel:this.typeForm.goodsModel,//型号
					pricingMode:this.typeForm.pricingMode,//计价方式
					deliveryFee:this.typeForm.distributeCost,//配送费
					upstairsFee:this.typeForm.upstairsFee,//上楼费
					deposit:this.typeForm.deposit,//押金
					goodsStatus:this.typeForm.goodsStatus,//商品状态
					goodsNature:this.typeForm.goodsNature,//商品性质
					marketChannel:this.typeForm.marketingChannel,//营销渠道
					other:this.typeForm.other.toString(),//其他
					goodsDesc:this.typeForm.goodsDesc,//描述
					goodsPic:null,//图片
					goodsMedium:this.goodsMedium,
					goodsSpec:this.typeForm.goodsSpec
				}
				if(fData.goodsType == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择商品类型!',
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
				if(fData.goodsModel == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择型号!',
					});
					return false
				}
				if(fData.goodsAlias&&fData.goodsAlias.length>20) {
					this.$Message['warning']({
						background: true,
						content: '商品别名过长!',
					});
					return false
				}

				if(fData.goodsDesc&&fData.goodsDesc.length>128) {
					this.$Message['warning']({
						background: true,
						content: '描述内容过长!',
					});
					return false
				}
				_http.http2('post', pathUrls.deptgoodsUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '编辑成功!',
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
			handleBackClick() {
				this.$router.go(-1);
			}
		},
		created(){
			this.getGoodsTypeList()
			this.getGoodsModelList()
			this.getGoodsSpecList();
		},
		mounted() {
			
			this.common.getDeptList(this.userData.deptId).then((res) => {
			this.options = this.common.getConDept(res.data, 0, 0, 1)
		})
			this.common.getBottleMediumList().then(res => {
				this.fillMediumList = res.data;
			})
		}
	}
</script>

<style type="text/css" scoped>
	.ivu-form-item {
		margin-bottom: 10px;
		width: 500px;
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

	.mainBody>>>.ivu-select-disabled .ivu-select-selection{
		background: none;
		color:#515a6e;
	}
</style>
