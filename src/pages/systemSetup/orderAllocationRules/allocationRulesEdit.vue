<template>
    <div class="main">
    		<div class='mainTop'>新增</div>
			<div class="mainContent">
				<Form :label-width="120">
					<FormItem label="客户类型">
              <Input style="width: 400px;" type="text" v-model='userType' readonly/>
					</FormItem>

          <FormItem label="是否自动分配" class='star'>
              <i-switch v-model="isAutoAllocation" size="large" false-color="#ff4949" :true-value='1' :false-value='0'>
                  <span slot="open">自动</span>
                  <span slot="close">手动</span>
              </i-switch>
          </FormItem>
          <FormItem label="创建时间">
              <Input style="width: 400px;" type="text" v-model='careteTime' readonly/>
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
      name:'predictionAdd',
      data(){
        return{
            userData: (JSON.parse(this.$store.state.userData)),
            options:[],
            userType:'',
            isAutoAllocation:1,
            careteTime:null,
            deptId:''
        }
      },
      methods:{
      //获取详情
      getRulesList(){
         _http.http1('get', pathUrls.orderrulesInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
              let datas=res.orderRules;
              this.userType=datas.userType;
              this.isAutoAllocation=datas.isAutoAllocation;
              this.careteTime=datas.careteTime;
              this.deptId=datas.deptId;
         })
      },
			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//确定
			handleSave(){
				let fData = {
          deptId:this.deptId,
          careteTime:this.careteTime,
          isAutoAllocation:this.isAutoAllocation,
          userType:this.userType,
          id:this.$route.params.id
				}
				_http.http2('post', pathUrls.orderrulesUpdate, fData).then((res) => {
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
        this.getRulesList()
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
