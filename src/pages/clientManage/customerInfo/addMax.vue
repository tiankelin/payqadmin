<template>
  <div class="orderGoodsMain">
    <div class="orderGoodsContent">
      <div class="closeWrapper" @click='handleClose'>
        <Icon type="md-close" />
      </div>
      <div>
        <h3 class="instructTitle">临时增量</h3>
        <div style="padding:0 10px 20px;">
          <div>
            <Form :label-width="96">
              <FormItem label="临时增量状态">
                <i-switch v-model="isAddMax" size="large" @on-change="openLast" :true-value='1' :false-value='0'>
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </FormItem>
              <div v-if='isAddMax'>
                <FormItem label="商品">
                  <Button type="info" long @click="addGoods" icon="md-add" style="width: 200px;">添加</Button>
                </FormItem>
                <div class="formBox">
                  <FormItem label="商品名称" v-for='(formItem,index) in goodsForm' :key='index'>
                    <Select style="width: 220px;" @on-open-change='changeGoods(formItem.goodsId,index)' v-model='formItem.goodsId'>
                      <Option v-for='item in newGoods' :key='item.goodsId' :value='item.goodsId'>{{item.goodsName}}</Option>
                    </Select>
                    <InputNumber :min='0' :max='1000' style="width: 70px;" v-model='formItem.count' />
                    <Button type="warning" style="height: 30px;line-height: 30px;" @click='deleteGoods(index)' v-if='index!=0'>删除</Button>
                  </FormItem>

                </div>
                <FormItem label="过期时间">
                  <DatePicker :options="options3" style='width: 220px;' type="date" placeholder="过期时间" v-model='expireTime'
                    format="yyyy-MM-dd" @on-change='changeExpireTime'></DatePicker>
                </FormItem>
              </div>
            </Form>
          </div>
          <div style="text-align: center;margin-top: 20px;">
            <Button type="primary" @click='handleEnter'>确定</Button>
            <Button style="margin-left: 20px;" @click='handleClose'>返回</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'addMax',
		props: {
			userId: Number,
			goodsList: Array,
			isAddMax: Number,
			newsAllowGoods: Array,
			userAddMax: Object
		},
		data() {
			return {
        options3: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
				expireTime: '',
				goodsIndex: 1,
				goodsForm: [{
					index: 1,
					goodsId: null,
					count: 0
				}],
				newGoods: [],
				maxId:null
			}
		},
		methods: {
			changeExpireTime(v) {
				this.expireTime = v;
			},
			changeGoods(v, index) {
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
			deleteGoods(index) {
				this.goodsForm.splice(index, 1);
				this.goodsIndex--;
			},
			//添加商品
			addGoods() {
				let len = this.newGoods.length;
				if(this.goodsIndex < len) {
					this.goodsIndex++;
					this.goodsForm.push({
						yzoccindex: this.goodsIndex,
						goodsId: null,
						count: 0
					})
				} else {
					this.$Message['warning']({
						background: true,
						content: `最多添加${len}种商品!`,

					});
					return false
				}

			},
			handleEnter() {
				let addNumber = [];
				
				for(let item of this.goodsForm) {
					if(item.count > 0) {
						addNumber.push({
							goodsId: item.goodsId,
							number: item.count
						})
					}
				}
				if(this.isAddMax&&!addNumber.length) {
					this.$Message['warning']({
						background: true,
						content: '请添加商品及数量',
					});
					return false;
				}
				if(this.isAddMax&&!this.expireTime) {
					this.$Message['warning']({
						background: true,
						content: '请选择过期时间',
					});
					return false;
				}
				let fData = {
					userId: this.userId,
					addNumber: JSON.stringify(addNumber),
					expireTime:this.expireTime?(this.common.conformatDat(this.expireTime)):'',
					isAddMax: this.isAddMax,
					id:this.maxId
				}
				_http.http2('post', pathUrls.userSaveUserAddMax, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '设置成功!',
							onClose: (() => {
								this.$emit('addMaxInfo', 1);
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
			handleClose() {
				this.$emit('addMaxInfo', 2);
			}
		},
		mounted() {
			this.goodsList.forEach(item => {
				this.newsAllowGoods.forEach(items => {
					if(item.goodsId == items) {
						this.newGoods.push(item)
					}
				})
			})
			
			if(this.userAddMax) {
				this.goodsForm = [];
				let newAddNum=[]
				if(this.userAddMax.addNumber){
					newAddNum = JSON.parse(this.userAddMax.addNumber);
				}
				if(newAddNum.length) {
					this.goodsIndex = newAddNum.length;
					newAddNum.forEach((item, index) => {
						this.goodsForm.push({
							index: index + 1,
							goodsId: item.goodsId,
							count: item.number
						})

					})
				} else {
					this.goodsIndex = 1;
					this.goodsForm = [{
						index: 1,
						goodsId: null,
						count: 0
					}]
				}

				this.expireTime = this.userAddMax.expireTime;
				this.maxId=	this.userAddMax.id;
				
				
			}else{
				this.goodsIndex = 1;
				this.goodsForm = [{
					index: 1,
					goodsId: null,
					count: 0
				}]
				
			}
		}
	}
</script>

<style type="text/css" scoped>
  .orderGoodsMain {
    background: rgba(0, 0, 0, .5);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }

  .orderGoodsContent {
    width: 500px;
    min-height: 200px;
    background: #fff;
    border-radius: 4px;
    padding: 10px;
    margin: 150px auto 0;
    position: relative;
    text-align: left;
  }

  .closeWrapper {
    position: absolute;
    right: 12px;
    top: -3px;
    font-size: 28px;
    cursor: pointer;
    color: #1296db;
    font-weight: 600;
  }

  .orderGoodsContent>>>.ivu-form-item {
    margin-bottom: 12px;
  }
</style>
