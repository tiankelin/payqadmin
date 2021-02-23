<template>
    <div class="main">
    		<div class='mainTop'>编辑</div>
			<div class="mainContent">
				<Form :label-width="120">

					<FormItem label="所属组织" class='star'>
              <el-cascader :show-all-levels="false" style='width: 400px;' :options="options" :props="{ checkStrictly: true }" clearable v-model="organize" @change='organizeSelected' placeholder="请选择组织"></el-cascader>
					</FormItem>
					<FormItem label="商户名称" class='star'>
              <Input style="width: 400px;" type="text"  placeholder="请输入商户名称" v-model='userCompanyName'/>
					</FormItem>
          <FormItem label="用户姓名" class='star'>
              <Input style="width: 400px;" type="text"  placeholder="请输入用户姓名" v-model='userName'/>
          </FormItem>
          <FormItem label="规格" class='star'>
              <Select v-model="spec" style="width: 400px;" placeholder="请选择规格">
                  <Option value="YSP35.5">YSP35.5</Option>
                  <Option value="YSP118">YSP118</Option>
                  <Option value="YSP118-2">YSP118-2</Option>
              </Select>
          </FormItem>
          <FormItem label="每次起送量">
              <Input style="width: 400px;" type="text"  placeholder="请输入每次起送量" v-model='numUnit'/>
          </FormItem>
          <FormItem label="使用周期(天)">
              <Input style="width: 400px;" type="text"  placeholder="请输入使用周期" v-model='useCircle'/>
          </FormItem>
          <FormItem label="配送员">
              <Select v-model="staffName" style="width: 400px;" placeholder="请选择配送员">
                  <Option :value="item.staffId" v-for='item in staffList' :key='item.staffId'>{{item.staffName}}</Option>
              </Select>
            </FormItem>
          <FormItem label="是否启用" class='star'>
              <i-switch v-model="isActive" size="large" false-color="#ff4949" :true-value='1' :false-value='0'>
                  <span slot="open">启用</span>
                  <span slot="close">禁用</span>
              </i-switch>
          </FormItem>
					<FormItem>
						<Button type="primary" @click="handleSave">确定</Button>
						<Button style="margin-left: 8px" @click="handleBackClick">返回</Button>
					</FormItem>
				</Form>
			</div>
    </div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
    export default{
      name:'predictionEdit',
      data(){
        return{
            userData: (JSON.parse(this.$store.state.userData)),
            options:[],
            organize:'',
            userCompanyName:'',
            userName:'',
            spec:'',
            dailyNum:null,
            useCircle:'',
            staffName:'',
            isActive:1,
            staffList:[],
            numUnit:null,
            cardCode:null,

        }
      },
      methods:{
        //获取详情
        getOrdertaskInfo(){
          _http.http1('get', pathUrls.ordertaskInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
              let datas=res.orderTask;
              this.organize=datas.deptId+'';
              this.userCompanyName=datas.userCompanyName;
              this.userName=datas.userName;
              this.numUnit=datas.numUnit;
              this.isActive=datas.isActive;

              this.cardCode=datas.cardCode;
              this.dailyNum=datas.dailyNum;

          })
        },
        //选中建档站点的下拉框
      organizeSelected(value) {
        if(value.length) {
          let id = value[value.length - 1]
          this.organize = id
        } else {
          this.organize = ''
        }
      },
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//确定
			handleSave(){
				let fData = {
          deptId:''
				}

				if(!fData.deptId) {
					this.$Message['warning']({
						background: true,
						content: '请选择组织!',

					});
					return false
				}

				_http.http2('post', pathUrls.ordertaskUpdate, fData).then((res) => {
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
          this.common.getOrganizeList(this.userData.deptId).then((res)=>{
          	this.options=this.common.getLabel(res)
          })
          this.common.getQueryStaffList(this.userData.deptId).then((res)=>{
             this.staffList=res.data;
          })
          this.getOrdertaskInfo();
      }
    }
</script>

<style type="text/css" scoped>
    .main {
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
.mainContent>>>.el-input__inner {
		height: 32px;
		line-height: 32px;
	}

	.mainContent>>>.el-input__icon {
		line-height: 32px;
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
    .mainContent>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
</style>
