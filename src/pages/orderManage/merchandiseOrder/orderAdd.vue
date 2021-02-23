<template>
	<div class="mainBorder">
		<div class='mainHeader'>
		    <span>新增</span>
		    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm"  :label-width="120">
				<FormItem label="组织" class='star'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeOwn" @change='organizeSelected' style="width: 380px;"></el-cascader>
				</FormItem>
				<FormItem label="联系人" class='star'>
					<Select v-model="typeForm.orderDeliveryUserId" filterable  placeholder="请选择联系人" @on-change='changeUser' label-in-value>
						<Option v-for="item in userList" :value="item.userId" :key="item.userId" :tag='{userPhoneNumber:item.userPhoneNumber,userAddress:item.userAddress}'>{{ item.userRealName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="联系方式">
					<Select v-model="typeForm.orderUserPhone" filterable  placeholder="请选择联系方式" @on-change='changePhone' label-in-value>
						<Option v-for="item in userList" :value="item.userPhoneNumber" :key="item.userId" :tag='{userId:item.userId,userAddress:item.userAddress}'>{{ item.userPhoneNumber }}</Option>
					</Select>
				</FormItem>
				<FormItem label="地址">
					<Input v-model="typeForm.orderAddress" placeholder="请输入地址" />
				</FormItem>
				<FormItem label="商品">
					<Button type="info" long @click="addGoods" icon="md-add" style="width: 104px;">添加</Button>
				</FormItem>
				<div>
					<FormItem label="商品名称" v-for='(formItem,index) in goodsForm' :key='index'>
						<Select style="width: 222px;" @on-open-change='changeGoods(formItem.goodsId,index)' v-model='formItem.goodsId'>
							<Option v-for='item in goodsList' :key='item.goodsId' :value='item.goodsId' >{{item.goodsName}}</Option>
						</Select>
						<InputNumber :min='0' :max='1000' style="width: 90px;" v-model='formItem.count'/>
						<Button type="warning" style="height: 30px;line-height: 30px;" @click='deleteGoods(index)' v-if='index!=0'>删除</Button>
					</FormItem>

				</div>

				<!--<FormItem label="5KG钢瓶数量">
					<InputNumber v-model="typeForm.bottle5KG" :min='0' :max='1000' style="width: 100%;"/>
				</FormItem>
				<FormItem label="15KG钢瓶数量">
					<InputNumber v-model="typeForm.bottle15KG" :min='0' :max='1000' style="width: 100%;"/>
				</FormItem>
				<FormItem label="50KG钢瓶数量">
					<InputNumber v-model="typeForm.bottle50KG" :min='0' :max='1000' style="width: 100%;" />
				</FormItem>-->
				<FormItem label="约定送达时间" class='star'>
					<DatePicker type="datetime" placeholder="请选择约定送达时间" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.dateTime' @on-change="timeChange"  style="width: 380px;"></DatePicker>
				</FormItem>
				<FormItem label="配送员" class='star'>
					<Select v-model="typeForm.deliveryUserId" filterable  placeholder="请选择配送员">
						<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
					</Select>
				</FormItem>
			</Form>
      <div class="mainBodyButton">
          <Button type="primary" @click='addOrderFuc'>核定并分配</Button>
          <Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
      </div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'orderAdd',
		data(){
			return{
			goodsIndex:1,
			goodsForm:[{
				index:1,
				goodsId:null,
				count:0
			}],
			goodsList:[],
			options:[],
			userData: (JSON.parse(this.$store.state.userData)),
			typeForm:{
				orderDeliveryUserId:'',
				orderUserPhone:'',
				orderAddress:'',
				bottle5KG:0,
				bottle15KG:0,
				bottle50KG:0,
				datetime:null,
				deliveryUserId:'',
				organizeOwn:''

			},
			userList:[],
			phoneList:[],
			staffNameList:[]
			}
		},
		methods:{
			//
			changeGoods(v,index){
				if(v) {
					this.goodsForm[index].goodsId = v;
					let lens = this.goodsForm.length;
					let newGoodsForm = this.goodsForm;
					for(let i = 0; i < lens; i++) {
						if(newGoodsForm[i].goodsId == v && i != index) {
							this.goodsForm[index].goodsId = null
							this.$Message['warning']({
								background: true,
								content: '商品重复，请重新选择!',

							});
							return false
						}
					}
				} else {
					this.goodsForm[index].goodsId = null;
				}
			},
			//删除商品
			deleteGoods(index){
				this.goodsForm.splice(index, 1);
				this.goodsIndex--;
			},
			//添加商品
			addGoods(){
				let len=this.goodsList.length;
				if(this.goodsIndex<len){
					this.goodsIndex++;
					this.goodsForm.push({
						yzoccindex:this.goodsIndex,
						goodsId:null,
						count:0
					})
				}else{
					this.$Message['warning']({
						background: true,
						content: `最多添加${len}种商品!`,

					});
					return false
				}

			},
		//改变组织
			organizeSelected(value){
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.organizeOwn = id

					this.getUsers(id)
					this.common.getQueryStaffList(id).then((res)=>{
						this.staffNameList=res.data
					})
				}else{
					this.typeForm.organizeOwn =null
					this.getUsers(this.userData.deptId)
					this.common.getQueryStaffList(this.userData.deptId).then((res)=>{
						this.staffNameList=res.data
					})
				}
			},
		changePhone(v){
		if(v){
			this.typeForm.orderDeliveryUserId=v.tag.userId;
			this.typeForm.orderAddress=v.tag.userAddress;
			}
		},
		changeUser(v){
			if(v){
			this.typeForm.orderUserPhone=v.tag.userPhoneNumber;
			this.typeForm.orderAddress=v.tag.userAddress;
			}
		},
		//返回
		handleBackClick(){
			this.$router.go(-1);
		},
		//添加
		addOrderFuc(){
			let orderBottleSpecification=[];
			let orderDetailsList=[];
			for(let item of this.goodsForm){
				orderBottleSpecification.push({
					'goodsId':item.goodsId,
					'number':item.count
				})
				orderDetailsList.push({
					'goodsId':item.goodsId,
					'goodsCount':item.count
				})
			}
			let fData={
				orderDetailsList:orderDetailsList,
				orderDeptId:this.typeForm.organizeOwn,//组织id
				orderStatus: 2,//订单状态
				orderUserId:this.typeForm.orderDeliveryUserId,//用户id
				orderUserPhone:this.typeForm.orderUserPhone,//联系方式
				orderAddress:this.typeForm.orderAddress,//地址
				orderBottleSpecification:JSON.stringify(orderBottleSpecification),//不同规格钢瓶数量
				orderExpectedDeliveryTime:this.common.conformatDat(this.typeForm.dateTime,true),//约定送达时间
				orderDeliveryUserId:this.typeForm.deliveryUserId,//配送员
				checkCode:null,
				checkRealName:null,
				orderAreaCode:null,
				orderBottleQuantity:0,
				orderCityCode:null,
				orderCode:null,
				orderCreateType:null,
				orderDeliveryUserName:null,
				orderId:null,
				orderPayType:null,
				orderProvinceCode:null,
				orderRemarks:null,
				orderStreetCode:null,
				orderUserCompanyName:null,
				orderUserName:null,
				orderUserSign:null
			}
			if(!fData.orderDeptId){
				this.$Message['warning']({
						background: true,
						content: '请选择组织!'
					});
					return false
			}
			if(!fData.orderUserId){
				this.$Message['warning']({
						background: true,
						content: '请选择联系人!'
					});
					return false
			}
			if(fData.orderAddress){
				if(fData.orderAddress.length>64){
					this.$Message['warning']({
						background: true,
						content: '地址过长!'
					});
					return false
				}
			}
			if(!this.typeForm.dateTime){
				this.$Message['warning']({
						background: true,
						content: '请选择送达时间!'
					});
					return false
			}

			if(!fData.orderDeliveryUserId){
				this.$Message['warning']({
						background: true,
						content: '请选择配送员!'
					});
					return false
			}
			_http.http2('post', pathUrls.orderSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
							this.$router.go(-1);
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
		//改变时间
			timeChange(v) {
				this.typeForm.dateTime = v;
			},
		//获取用户
		getUsers(id){
			_http.http3('get', pathUrls.userGetUsers, {
				deptId: id,

			}, "form").then((res)=>{
				this.userList=res.data
			})
		}
		},
		mounted(){
			//组织
			this.common.getDeptList(this.userData.deptId).then((res) => {
			this.options = this.common.getConDept(res.data, 0, 0, 1)
		})
			//配送员
			this.common.getQueryStaffList(this.userData.deptId).then((res)=>{
				this.staffNameList=res.data
			})
			//获取商品列表
			this.common.getGoodsList().then((res)=>{
				this.goodsList=res.data;
			})
			this.typeForm.organizeOwn=this.userData.deptId+'';
			this.getUsers(this.userData.deptId)

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
</style>
