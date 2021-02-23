<template>
  <div class="mainBorder">
    <div class='mainHeader'>
      <span>新增</span>
      <Icon type="md-close" class='closeIcon' @click='handleBackClick' />
    </div>
    <div class="mainBody">
      <Form :label-width="120">
        <FormItem label='钢瓶条码' class='star'>
          <Input type='text' style="width: 380px;" v-model='bottleCode' placeholder='钢瓶条码'/>
        </FormItem>
        <FormItem label='电子标签编码'>
          <Input type='text' style="width: 380px;" v-model='bottleNfcId' placeholder='电子标签编码'/>
        </FormItem>
        <FormItem label="气站" class='star'>
        	<Select style="width: 380px;" filterable v-model='sourceDept' clearable>
        	    <Option v-for='item in sourceDeptList' :key='item.deptId' :value='item.deptId'>{{item.name}}</Option>
        	</Select>
        </FormItem>
        <FormItem label="操作人">
            <Select style="width: 380px;" filterable v-model='staffId'>
                <Option v-for='item in staffNameList' :key='item.staffId' :value='item.staffId'>{{item.staffName}}</Option>
            </Select>
        </FormItem>
        <FormItem label='接收人姓名'>
          <Input type='text' style="width: 380px;" v-model='receiverName' placeholder='接收人姓名'/>
        </FormItem>
        <FormItem label='接收人车牌号'>
          <Input type='text' style="width: 380px;" v-model='receiverCarNumber' placeholder='接收人车牌号'/>
        </FormItem>
        <FormItem label='送检时间'>
            <DatePicker style='width:380px;' type="datetime" placeholder="送检时间" v-model='checkTime' format="yyyy-MM-dd HH:mm:ss">
            </DatePicker>
         </FormItem>
         <FormItem label="检测站" class='star'>
             <Select style="width: 380px;" filterable v-model='checkDept'>
                 <Option v-for='item in checkDeptList' :key='item.deptId' :value='item.deptId'>{{item.name}}</Option>
             </Select>
         </FormItem>
      </Form>
      <div class="mainBodyButton" v-has='"inspectList-save"'>
        <Button type="primary" @click="handleSave" :disabled="isDisabled">确定</Button>
        <Button style="margin-left: 8px" @click="handleBackClick">返回</Button>
      </div>
    </div>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'bottleCheckAdd',
		data() {
			return {
        sourceDeptList:[],
        userData: (JSON.parse(this.$store.state.userData)),
				isDisabled:false,
        options:[],
        staffNameList:[],
        checkDeptList:[],
        bottleCode:'',
        sourceDept:'',
        staffId:'',
        bottleNfcId:'',
        receiverName:'',
        receiverCarNumber:'',
        checkTime:'',
        checkDept:''
			}
		},
		methods: {
      //获取气站
      getDeptQueryGasDept(){
          _http.http1('post', pathUrls.deptQueryGasDept, {

          },'form').then((res) => {
              this.sourceDeptList=res.data;
              })
      },
      //获取检测站
      getCheckDeptList(){
          _http.http1('post', pathUrls.teststationList, {

          },'form').then((res) => {
              this.checkDeptList=res.data;
              })
      },


			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//确定
			handleSave() {

				let fData = {
            bottleCode:this.bottleCode,
            bottleNfcId:this.bottleNfcId,
            deptId:this.sourceDept,
            staffId:this.staffId,
            receiverName:this.receiverName,
            receiverCarNumber:this.receiverCarNumber,
            checkTime:this.checkTime?this.common.conformatDat(this.checkTime,true):'',
            checkDeptId:this.checkDept
				}

				if(!fData.bottleCode) {
					this.$Message['warning']({
						background: true,
						content: '请输入钢瓶条码!',

					});
					return false
				}
        if(fData.bottleCode.length > 32) {
        	this.$Message['warning']({
        		background: true,
        		content: '钢瓶条码过长!',
        		duration: 1
        	});
        	return false
        }
        if(fData.bottleNfcId&&fData.bottleNfcId.length > 32) {
        	this.$Message['warning']({
        		background: true,
        		content: '电子标签编码过长!',
        		duration: 1
        	});
        	return false
        }
        if(!fData.deptId) {
        	this.$Message['warning']({
        		background: true,
        		content: '请选择组织!',

        	});
        	return false
        }
        if(fData.receiverName&&fData.receiverName.length >24) {
        	this.$Message['warning']({
        		background: true,
        		content: '接收人姓名过长!',
        		duration: 1
        	});
        	return false
        }
        if(fData.receiverCarNumber&&fData.receiverCarNumber.length >24) {
        	this.$Message['warning']({
        		background: true,
        		content: '接收人车牌号过长!',
        		duration: 1
        	});
        	return false
        }
        if(!fData.checkDeptId) {
        	this.$Message['warning']({
        		background: true,
        		content: '请选择检测站!',

        	});
        	return false
        }
				this.isDisabled=true;
				// console.log(fData)
				_http.http2('post', pathUrls.bottleCheckSave, fData).then((res) => {

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
          if(res.code != 0) {
          	this.isDisabled = false;
          }
				}).catch(err=>{
          this.isDisabled = false;
        })
			}
		},
		mounted() {

      //配送员
      this.common.getStaffList1(this.userData.deptId).then((res)=>{
      	this.staffNameList=res.data
      })
      this.getCheckDeptList()
      this.getDeptQueryGasDept()
		}
	}
</script>

<style type="text/css" scoped>
  .mainBody>>>.ivu-form-item {
    margin-bottom: 8px;
  }

  .star>>>.ivu-form-item-label:after {
    content: "*";
    color: #f00;
    padding-right: 2px;
  }
</style>
