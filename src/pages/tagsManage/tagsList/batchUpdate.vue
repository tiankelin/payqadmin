<template>
    <div class="batchMain">
        <div class="batchContent">
            <div class="closeWrapper" @click='handleClose'><Icon type="md-close" /></div>
            <div style="width: 350px;">
                <Form :label-width="110">
                    <FormItem label='组织' class='star'>
                      	<Cascader :data="options" placeholder="所属组织" style='width: 220px;' clearable change-on-select @on-change='changeCascader' :render-format="format"></Cascader>
                    </FormItem>
                    <FormItem label='标签状态' class='star'>
                       <Select v-model='status' style='width: 220px;' clearable>
							<Option :value='0'>重置</Option>
							<Option :value='2'>销毁</Option>
						</Select>
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
          options:[],
          organize:'',
          status:null,
          userData: (JSON.parse(this.$store.state.userData)),
      }
    },
    methods:{
	//改变组织
		changeCascader(value) {
			if(value.length) {
				let id = value[value.length - 1];
				this.organize = id;

			} else {
				this.organize = null;

			}

		},
		//自定义组织输入框显示内容
		format(labels, selectedData) {
			const index = labels.length - 1;
			const data = selectedData[index] || false;
			return labels[index];
		},
      handleClose(){
        this.$emit('batch',1)
      },

      handleSaveClick(){
        if(!this.organize){
          this.$Message['warning']({
              background: true,
              content: '请选择组织!',
            });
            return false
        }
       if(this.status==null){
         this.$Message['warning']({
             background: true,
             content: '请选择修改状态!',
           });
           return false
       }
       let fData={
              ids:this.selectIds,
              status:this.status,
              deptId:this.organize
       }

        _http.http2('post', pathUrls.depttagBatchUpdate, fData).then((res) => {
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
		this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
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
