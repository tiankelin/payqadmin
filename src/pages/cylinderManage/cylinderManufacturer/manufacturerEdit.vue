<template>
    <div class="mainBorder">
    	<div class='mainHeader'>
    	    <span>编辑</span>
    	    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
    	</div>
			<div class="mainBody">
				<Form :label-width="120">
					<FormItem label='厂家名称' class='star'>
						<Input style="width: 400px;" v-model='bottleManufacturerName' placeholder="请输入厂家名称"/>
					</FormItem>
					<FormItem label='代号'>
						<Input style="width: 400px;" v-model='codeName' placeholder="请输入代号"/>
					</FormItem>
					<FormItem label='曾用名1'>
						<Input style="width: 400px;" v-model='oldNameOne' placeholder="请输入曾用名1"/>
					</FormItem>
					<FormItem label='曾用名2'>
						<Input style="width: 400px;" v-model='oldNameTwo' placeholder="请输入曾用名2"/>
					</FormItem>
					<FormItem label='国别'>
						<Input style="width: 400px;" v-model='country' placeholder="请输入国别"/>
					</FormItem>
					<FormItem label='许可证' >
						<Input style="width: 400px;" v-model='licence' placeholder="请输入许可证"/>
					</FormItem>
					<FormItem label='许可证级别' >
						<Input style="width: 400px;" v-model='licenceLevel' placeholder="请输入许可证级别"/>
					</FormItem>
					<FormItem label='创建时间'>
						<Input style="width: 400px;" v-model='createTime'  disabled/>
					</FormItem>
				</Form>
        <div class="mainBodyButton" v-has='1020'>
            <Button type="primary" @click="handleSave">确定</Button>
            <Button style="margin-left: 8px" @click="handleBackClick">返回</Button>
        </div>
			</div>
    </div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
    export default{
      name:'manufacturerEdit',
      data(){
        return{
			bottleManufacturerName:'',
			codeName:'',
			oldNameOne:'',
			oldNameTwo:'',
			country:'',
			licence:'',
			licenceLevel:'',
			createTime:'',
			creater:null
        }
      },
      methods:{
      	//获取详情
      		getManufacturerInfo(){
      		_http.http1('get', pathUrls.bottlemanufacturerInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
      				if(res.bottleManufacturer){
      					this.bottleManufacturerName=res.bottleManufacturer.bottleManufacturerName;
						this.codeName=res.bottleManufacturer.codeName;
						this.oldNameOne=res.bottleManufacturer.oldNameOne;
						this.oldNameTwo=res.bottleManufacturer.oldNameTwo;
						this.country=res.bottleManufacturer.country;
						this.licence=res.bottleManufacturer.licence;
						this.licenceLevel=res.bottleManufacturer.licenceLevel;
						this.createTime=res.bottleManufacturer.createTime;
						this.creater=res.bottleManufacturer.creater;
      				}
      		})
      		},
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//确定
			handleSave(){
				let fData = {
					bottleManufacturerName:this.bottleManufacturerName,
					licenceLevel:this.licenceLevel,
					codeName:this.codeName,
					oldNameOne:this.oldNameOne,
					oldNameTwo:this.oldNameTwo,
					country:this.country,
					licence:this.licence,
					id:this.$route.params.id,
					createTime:this.createTime,
					creater:this.creater
				}
				if(!fData.bottleManufacturerName) {
					this.$Message['warning']({
						background: true,
						content: '请输入厂家名称!',

					});
					return false
				}
				if(fData.bottleManufacturerName.length>100) {
					this.$Message['warning']({
						background: true,
						content: '厂家名称过长!',

					});
					return false
				}
				// if(!this.common.judgeMethod(fData.bottleManufacturerName)) {
				// 	this.$Message['warning']({
				// 		background: true,
				// 		content: '厂家名称字符不合法!',

				// 	});
				// 	return false
				// }

				if(fData.codeName&&fData.codeName.length>16) {
					this.$Message['warning']({
						background: true,
						content: '代号过长!',

					});
					return false
				}
				// if(fData.codeName&&!this.common.judgeMethod(fData.codeName)) {
				// 	this.$Message['warning']({
				// 		background: true,
				// 		content: '代号字符不合法!',

				// 	});
				// 	return false
				// }
				if(fData.oldNameOne&&fData.oldNameOne.length>64) {
					this.$Message['warning']({
						background: true,
						content: '曾用名1过长!',

					});
					return false
				}
				// if(fData.oldNameOne&&!this.common.judgeMethod(fData.oldNameOne)) {
				// 	this.$Message['warning']({
				// 		background: true,
				// 		content: '曾用名1字符不合法!',

				// 	});
				// 	return false
				// }
				if(fData.oldNameTwo&&fData.oldNameTwo.length>64) {
					this.$Message['warning']({
						background: true,
						content: '曾用名2过长!',

					});
					return false
				}
				// if(fData.oldNameTwo&&!this.common.judgeMethod(fData.oldNameTwo)) {
				// 	this.$Message['warning']({
				// 		background: true,
				// 		content: '曾用名2字符不合法!',

				// 	});
				// 	return false
				// }
				if(fData.country&&fData.country.length>64) {
					this.$Message['warning']({
						background: true,
						content: '国别过长!',

					});
					return false
				}
				// if(fData.country&&!this.common.judgeMethod(fData.country)) {
				// 	this.$Message['warning']({
				// 		background: true,
				// 		content: '国别字符不合法!',

				// 	});
				// 	return false
				// }
				if(fData.licence&&fData.licence.length>64) {
					this.$Message['warning']({
						background: true,
						content: '许可证过长!',

					});
					return false
				}
				// if(fData.licence&&!this.common.judgeMethod(fData.licence)) {
				// 	this.$Message['warning']({
				// 		background: true,
				// 		content: '许可证字符不合法!',

				// 	});
				// 	return false
				// }
				if(fData.licenceLevel&&fData.licenceLevel.length>64) {
					this.$Message['warning']({
						background: true,
						content: '许可证级别过长!',

					});
					return false
				}
				// if(fData.licenceLevel&&!this.common.judgeMethod(fData.licenceLevel)) {
				// 	this.$Message['warning']({
				// 		background: true,
				// 		content: '许可证级别字符不合法!',

				// 	});
				// 	return false
				// }

				// console.log(fData)
				_http.http2('post', pathUrls.bottlemanufacturerUpdate, fData).then((res) => {
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
							content: res.msg,
						});
					}
				})
			}
      },
      mounted(){
		this.getManufacturerInfo()
      }
    }
</script>
<style type="text/css" scoped>
  .mainBody>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	.mainBody>>>.ivu-switch-checked:after {
		left: 52px!important;
	}
  .star>>>.ivu-form-item-label:after {
  	content: "*";
  	color: #f00;
  	padding-right: 2px;
  }
</style>
