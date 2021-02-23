<template>
    <div class="mainBorder">
    	<div class='mainHeader'>
    	    <span>编辑</span>
    	    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
    	</div>
			<div class="mainBody">
				<Form :label-width="120">
					<FormItem label="类型名" class='star'>
						<Input style="width: 380px;" v-model='typeName' placeholder="请输入类型名"/>
					</FormItem>
					<FormItem label="所属组织" class='star'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="organize" @change='organizeSelected' style="width: 380px;"></el-cascader>
				</FormItem>

					<FormItem label="厂家" class='star'>
						<Input style="width: 380px;" v-model='typeFactory' placeholder="请输入厂家"/>
					</FormItem>
					<FormItem label="型号" class='star'>
						<Input style="width: 380px;" v-model='typeModel' placeholder="请输入型号"/>
					</FormItem>
					<FormItem label="上行协议" class='stars'>
						<Select style="width: 380px;" v-model='typeUplinkProtocol' placeholder='请选择上行协议' @on-change='typeChange' label-in-value>
							<Option value='TCP'>TCP</Option>
							<Option value='HTTP'>HTTP</Option>
						</Select>
					</FormItem>
					<FormItem label="下行协议" class='stars'>
						<Select style="width: 380px;" v-model='typeDownlinkProtocol' placeholder='请选择下行协议' @on-change='typeChange' label-in-value>
							<Option value='TCP'>TCP</Option>
							<Option value='HTTP'>HTTP</Option>
						</Select>
					</FormItem>
					<FormItem label="设备品类" class='stars'>
						<Select style="width: 380px;" v-model='typeCategory' placeholder='请选择设备品类' @on-change='typeChange' label-in-value>
							<!--<Option value='2'>车辆控制终端</Option>
							<Option value='3'>车载RFID读卡终端</Option>-->
							<Option value='4'>配送一体终端</Option>
							<Option value='5'>充装台终端</Option>
							<Option value='6'>危化车终端</Option>
						</Select>
					</FormItem>
				</Form>
        <div class="mainBodyButton" v-has='794'>
            <Button type="primary" @click="handleSave" :disabled="isDisabled">确定</Button>
            <Button style="margin-left: 8px" @click="handleBackClick">返回</Button>
        </div>
			</div>
    </div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
    export default{
      name:'terTypeEdit',
      data(){
        return{
        	isDisabled: false,
        	userData: (JSON.parse(this.$store.state.userData)),
        	options:[],
			typeName:'',
			organize:'',
			typeFactory:null,
			typeModel:'',
			typeUplinkProtocol:'',
			typeDownlinkProtocol:'',
			typeCategory:'',
			typeDeptName:'',
			typeId:''
        }
      },
      methods:{
 			getTerminalTypeInfo(){
 				_http.http1('get', pathUrls.deptterminaltypeInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
 						if(res){
 							let data=res.deptTerminalType;
 								this.typeName=data.typeName;
 								this.organize=data.typeDeptId+'';
 								this.typeFactory=data.typeFactory;
 								this.typeModel=data.typeModel;
 								this.typeUplinkProtocol=data.typeUplinkProtocol;
 								this.typeDownlinkProtocol=data.typeDownlinkProtocol;
 								this.typeCategory=data.typeCategory;
 								this.typeDeptName=data.typeDeptName;
 								this.typeId=data.typeId;

 						}
 				})
 			},
      	//改变组织
			organizeSelected(value){
				if(value.length) {
					let id = value[value.length - 1];
					this.organize = id;

				}else{
					this.organize =null;

				}

			},
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//确定
			handleSave(){
				let fData = {
					typeName:this.typeName,//类型名
					typeDeptId:this.organize,//组织
					typeFactory:this.typeFactory,//厂家
					typeModel:this.typeModel,//型号
					typeUplinkProtocol:this.typeUplinkProtocol,//上行协议
					typeDownlinkProtocol:this.typeDownlinkProtocol,//下行协议
					typeCategory:this.typeCategory,//设备品类
					typeId:this.typeId,
					typeDeptName:this.typeDeptName
				}
				if(!fData.typeName){
					this.$Message['warning']({
						background: true,
						content: '请输入类型名!'
					});
					return false
				}

				if(fData.typeName.length>32){
					this.$Message['warning']({
						background: true,
						content: '类型名过长!'
					});
					return false
				}
				if(!fData.typeDeptId){
					this.$Message['warning']({
						background: true,
						content: '请选择组织!'
					});
					return false
				}
				if(!fData.typeFactory){
					this.$Message['warning']({
						background: true,
						content: '请输入厂家!'
					});
					return false
				}
				if(fData.typeFactory.length>64){
					this.$Message['warning']({
						background: true,
						content: '厂家名称过长!'
					});
					return false
				}
				if(!fData.typeModel){
					this.$Message['warning']({
						background: true,
						content: '请输入型号!'
					});
					return false
				}
				if(fData.typeModel.length>32){
					this.$Message['warning']({
						background: true,
						content: '型号过长!'
					});
					return false
				}
				this.isDisabled = true;
				_http.http2('post', pathUrls.deptterminaltypeUpdate, fData).then((res) => {
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
					if(res.code != 0) {
						this.isDisabled = false;
					}
				}).catch(err => {
					this.isDisabled = false;
				})
			}
      },
      mounted(){
      		this.getTerminalTypeInfo()
			this.common.getDeptList(this.userData.deptId).then((res) => {
			this.options = this.common.getConDept(res.data, 0, 0, 1)
		})
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
	.stars>>>.ivu-form-item-label:after {
		content: "*";
		color: #fff;
		padding-right: 2px;
	}
	.mainBody>>>.ivu-input-group-prepend{
		background:0;
		color:#000;
	}
</style>
