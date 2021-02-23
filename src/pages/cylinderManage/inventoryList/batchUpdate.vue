<template>
    <div class="batchMain">
        <div class="batchContent">
            <div class="closeWrapper" @click='handleClose'><Icon type="md-close" /></div>
            <div style="width: 350px;">
                <Form :label-width="110">
                    <FormItem label='末次检验时间' class='star'>
                       <DatePicker type="month" placeholder="请选择末次检验时间" style="width: 220px;" format="yyyy-MM"
                       @on-change="lastCheckTimeChange" ></DatePicker>
                    </FormItem>
                    <FormItem label='下次检验时间' class='star'>
                       <DatePicker type="month" placeholder="请选择下次检验时间" style="width: 220px;" format="yyyy-MM" v-model='nextTime'
                       @on-change="nextCheckTimeChange" ></DatePicker>
                    </FormItem>
                </Form>
            </div>
            <div style="text-align: center;margin-top: 40px;">
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
    name:'batchUpdate',
    props:{
      selectIds:Array
    },
    data(){
      return{
          lastCheckTime:'',
          nextCheckTime:'',
          nextTime:''
      }
    },
    methods:{
      handleClose(){
        this.$emit('batch',1)
      },
      nextCheckTimeChange(v){
//    	console.log(v)
      	this.nextCheckTime=this.common.getLastDay(v);
      },
      lastCheckTimeChange(v){
        if(v){
          this.lastCheckTime= this.common.getLastDay(v);
          this.nextTime=this.common.getLastDay(v,4);
          this.nextCheckTime=this.common.getLastDay(this.nextTime);
        }else{
          this.lastCheckTime='';
          this.nextCheckTime='';
        }


      },
      handleSaveClick(){
        if(!this.lastCheckTime){
          this.$Message['warning']({
              background: true,
              content: '请选择末次检验时间!',
            });
            return false
        }
       if(!this.nextCheckTime){
         this.$Message['warning']({
             background: true,
             content: '请选择下次检验时间!',
           });
           return false
       }
       let fData={
              ids:JSON.stringify(this.selectIds),
              lastCheckTime:this.common.conformatDat(this.lastCheckTime)+' 00:00:00',
              nextCheckTime:this.common.conformatDat(this.nextCheckTime)+' 00:00:00'
       }
//        console.log(fData)
//        return false;
        _http.http1('post', pathUrls.acceptancelogBatchUpdate, fData,'form').then((res) => {
        					if(res.code == 0) {
        						this.$Message['success']({
        							background: true,
        							content: '修改成功!',
        							onClose: (() => {
        								this.$emit('batch',2)
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

    }
  }
</script>

<style type="text/css" scoped>
   .batchMain{
     position: absolute;
     left: 0;
     right:0;
     top: 0;
     bottom: 0;
     z-index: 100;
     background: rgba(0,0,0,.4);
   }
   .batchContent{
      width: 450px;
      height: 230px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -225px;
      margin-top: -150px;
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
