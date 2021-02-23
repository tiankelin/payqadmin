<template>
    <div class="reviewMain">
        <div class="reviewContent">
            <div class="closeWrapper" @click='handleClose'><Icon type="md-close" /></div>
            <div style="width: 350px;">
                <Form :label-width="110">                  
                    <FormItem :label='labels' class='star'>
                       <Select v-model='status' style='width: 230px;'>
							<Option :value='1'>审核通过</Option>
							<Option :value='2'>审核不通过</Option>
						</Select>
                    </FormItem>
                    <FormItem label='原因描述' v-if='status==2'>
                    	<Input type="textarea" :rows="3" style='width: 230px;' v-model='notPassReason' placeholder="审核不通过原因描述"/>
                    </FormItem>	
                </Form>
            </div>
            <div style="text-align: center;margin-top: 10px;">
                <Button type='primary' style='margin-right: 20px;' @click='handleSaveClick'>确定</Button>
                <Button @click='handleClose'>返回</Button>
            </div>
        </div>
    </div>
</template>

<script>
  import _http from '@/public/http';
  import { pathUrls } from '@/public/path';
  export default{
    name:'refundReview',
    props:{
      reviewType:Number,
      noteId:Number
    },
    data(){
      return{
      	  labels:'押瓶审核状态',
          status:1,
          userData: (JSON.parse(this.$store.state.userData)),
          notPassReason:'',
      }
    },
    methods:{
	//关闭
      handleClose(){
        this.$emit('review',1)
      },
	//保存
      handleSaveClick(){

       if(this.status==null){
         this.$Message['warning']({
             background: true,
             content: '请选择修改状态!',
           });
           return false
       }
       let fData={              
              status:this.status,
              id:this.noteId,
              actionType:this.reviewType,
              notPassReason:this.status==2?this.notPassReason:''
       }
        _http.http2('post', pathUrls.bottlePledgeReturnAudit, fData).then((res) => {
			if(res.code == 0) {
				this.$Message['success']({
					background: true,
					content: '审核成功!',
					onClose: (() => {
						this.$emit('review',2)
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

    },
    mounted(){
		this.labels=this.reviewType===0?"押瓶审核状态":"退瓶审核状态";
    }
  }
</script>

<style type="text/css" scoped>
   .reviewMain{
     position: absolute;
     left: 0;
     right:0;
     top: 0;
     bottom: 0;
     z-index: 100;
     background: rgba(0,0,0,.4);
   }
   .reviewContent{
      width: 410px;
      min-height: 150px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -225px;
      margin-top: -200px;
      background: #fff;
      text-align: left;
      padding: 20px;
      border-radius:6px;
   }
   .closeWrapper{
   		position: absolute;
   		right: 12px;
   		top:0px;
   		font-size: 32px;
   		cursor: pointer;
   		color:#1296db;
   		font-weight: 600;
   	}
  .star>>>.ivu-form-item-label:after {
      content: "*";
      color: #f00;
      padding-right: 2px;
    }
</style>
