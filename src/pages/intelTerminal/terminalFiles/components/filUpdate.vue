<template>
  <div class="instructMain">
    <div class="instructContent">
      <div class="closeWrapper" @click='handleClose'>
        <Icon type="md-close" />
      </div>
      <div>
        <h3 class="instructTitle">批量修改</h3>
        <div style="padding:20px 10px;">
          <div>
            <Form :label-width="80">
              <FormItem label="所属组织">
                  <Cascader :data="options" clearable  change-on-select @on-change='organizeSelected' :render-format="format" style="width:260px"></Cascader>
              </FormItem>

            </Form>
          </div>
          <div style="text-align: center;margin-top: 20px;">
            <Button type="primary" @click='handleEnter'>确定</Button>
            <Button style="margin-left: 20px;" @click='handleBack'>返回</Button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'filUpdate',
		props:{
			terArray:Array
		},
		data(){
			return{
				options:[],
				organize:'',
				userData: (JSON.parse(this.$store.state.userData)),
			}
		},
		methods:{
      //自定义组织输入框显示内容
      format(labels, selectedData) {
      	//				console.log(labels, selectedData)
      	const index = labels.length - 1;
      	const data = selectedData[index] || false;
      	return labels[index];
      },
			//确定
			handleEnter(){
				if(!this.organize){
					this.$Message['warning']({
							background: true,
							content: '请选择组织!',
						});
				}else{
					
					_http.http2('post', pathUrls.deptterminalBatchUpdate, JSON.stringify({
					'ids': this.terArray.toString(),
					'deptId':this.organize
				})).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.$emit('closeFil',1);
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
			//关闭
			handleClose(){
				this.$emit('closeFil',2);
			},
			//关闭
			handleBack(){
				this.$emit('closeFil',2);
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
		},
		mounted(){

			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
			})
		}
	}
</script>

<style type="text/css" scoped>
  .instructMain {
    background: rgba(0, 0, 0, .5);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;

  }

  .instructContent {
    width: 400px;
    height: 200px;
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

  .instructTitle {
    margin: 0 11px;
  }

  .instructContent>>>.el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  .instructContent>>>.el-input__icon {
    line-height: 32px;
  }
  .instructContent>>>.ivu-cascader .ivu-cascader-menu{
  	background: #fff!important;
  }
</style>
