<template>
	<div>
		<div style="text-align: right;padding: 5px 52px 0 20px;height: 30px;">
			<span style="float: left;color: #f38009;font-weight: 600;">使用范围</span>
			<Button @click='addCirclePrice' type="warning" size='small' v-has='"priceList-c-add"'>添加</Button>
		</div>

		<div style="text-align: right;position: relative;" class="expandMain">

			<div v-for='(ite,iteIndex) in row.subArr' :key='iteIndex'>
				<div style="margin: 5px 0;display: flex;border-bottom:2px solid #eee;padding-left: 50px;" :style="{background:iteIndex %2 ==0?'rgba(0, 220, 255, 0.61)':'#10d53b8a'}">
					<div style="margin:auto 0; ">
						<!--<Input style="width: 160px;margin-right:15px;"/>-->

						<el-cascader placeholder='请选择使用范围' :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" v-model="ite.deptId" @change='organizeSelected' style="width: 160px;"></el-cascader>
					</div>
					<div style="width:calc(50% - 155px );padding: 0 16px">
						<div v-for='item in ite.goodsPriceArr[0].newPriceArr' :key='item.userTypeName' style="min-width: 100px;padding: 5px 0;float: left;min-height: 50px;line-height: 50px;">
							<span style="display: inline-block;width: 50px;margin-right: 4px;" :style="{color:item.userTypeName=='挂牌'?'rgb(0, 67, 255)':''}">{{item.userTypeName?item.userTypeName.slice(0,2):'未知'}}价:</span>
							<InputNumber v-model='item.centerPrice' style="width: 60px;margin:0 4px;" :min='0' />
						</div>
					</div>
					<div style="width:calc(50% - 155px );padding: 0 18px">
						<div v-for='item in ite.goodsPriceArr[0].newPriceArr' :key='item.userTypeName' style="min-width: 100px;padding: 5px 0;float: left;min-height: 50px;line-height: 50px;">
							<span style="display: inline-block;width: 50px;" :style="{color:item.userTypeName=='挂牌'?'rgb(0, 67, 255)':''}">{{item.userTypeName?item.userTypeName.slice(0,2):'未知'}}价:</span>
							<InputNumber v-model='item.otherPrice' style="width: 60px;margin:0 4px;" :min='0' />
						</div>
					</div>
					<div style="margin:auto 0;text-align: center;width: 150px;">
						<Button @click='handleEdit(ite)' type="info" size='small' style="margin:0 5px;" v-has='"priceList-c-add"'>保存</Button>
						<!--<Button @click='handleEdit(ite)' type="primary" size='small' style="margin:0 5px;" v-if='ite.ids'>保存</Button>-->
						<Button @click='handelDelete(iteIndex,ite)' type="error" size='small' v-if='ite.ids' style="">删除</Button>
						<div style="display: inline;" v-else>
							<Button @click='handelDelete(iteIndex,ite)' type="error" size='small' v-has='"priceList-c-delete"'>删除</Button>
						</div>

					</div>
				</div>
			</div>

		</div>
	</div>

</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		props: {
			row: Object,
			options: Array
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				organizeOwn: '',

			}
		},
		methods: {
			handleEdit(ite) {

				if(!ite.deptId.length) {
					this.$Message['warning']({
						background: true,
						content: '请选择使用范围',
					});
					return false;
				}

				let orgGoodsPriceList = [];
				let titles = '是否定价？';
				let contents = '定价成功！';
				ite.goodsPriceArr[0].newPriceArr.forEach(item => {

					let types = typeof(ite.deptId) == 'string';

					if((item.centerPrice || item.otherPrice) && item.orgPriceId) {
						titles = '是否修改？';
						contents = '修改成功！';
						orgGoodsPriceList.push({
							orgId: types ? ite.deptId : ite.deptId[ite.deptId.length - 1],
							goodsId: this.row.goodsId,
							userType: item.userType,
							centerPrice: item.centerPrice,
							otherPrice: item.otherPrice,
							id: item.orgPriceId
						})
					}
					if((item.centerPrice || item.otherPrice) && !item.orgPriceId) {
						titles = '是否定价？';
						contents = '定价成功！';
						orgGoodsPriceList.push({
							orgId: types ? ite.deptId : ite.deptId[ite.deptId.length - 1],
							goodsId: this.row.goodsId,
							userType: item.userType,
							centerPrice: item.centerPrice,
							otherPrice: item.otherPrice,
						})
					}

				})

				let fData = {
					orgGoodsPriceList: orgGoodsPriceList
				}
				//      		console.log(orgGoodsPriceList)
				this.$Modal.confirm({
					title: titles,
					content: '',
					onOk: () => {
						_http.http2('post', pathUrls.batchSaveOrUpdate, fData).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: contents,
									onClose: (() => {
										this.$emit('getVal', true)
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
				});

			},
			//改变组织
			organizeSelected(value) {

				if(value.length) {
					let id = value[value.length - 1];
					this.organizeOwn = id;
				}
			},
			//删除
			handelDelete(index, data) {
				let fData = {
					orgId: data.deptId,
					goodsId: this.row.goodsId
				}

				if(data.ids) {
					this.row.subArr.splice(index, 1);
				} else {

					this.$Modal.confirm({
						title: '是否删除？',
						content: '',
						onOk: () => {
							_http.http2('post', pathUrls.orgPriceDelete, fData).then((res) => {
								if(res.code == 0) {
									this.$Message['success']({
										background: true,
										content: '删除成功！',
										onClose: (() => {
											this.$emit('getVal', true)
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
					});
				}

			},
			addCirclePrice() {
				this.row.subArr.push({
					ids: true,
					deptId: '',
					deptName: "",
					goodsPriceArr: [{
						priceArr: this.row.defaultPriceArr,
						newPriceArr: this.row.defaultPriceArr
					}]
				});
			}
		},
		mounted() {

			this.organizeOwn = this.userData.deptId + '';

		}

	}
</script>

<style type="text/css" scoped>
	.expandMain>>>.el-cascader .el-input .el-input__inner {
		height: 28px;
	}
</style>