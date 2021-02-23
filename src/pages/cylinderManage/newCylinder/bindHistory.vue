<template>
    <div class="bindHistoryMain">
        <div class="bindHistoryContent">
            <div class="closeWrapper" @click='handleClose'><Icon type="md-close" /></div>
            <h3 class="bindHistoryTitle">绑定历史</h3>

            <div class="bindHistoryList">
                <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>

                </Table>
            </div>


        </div>
    </div>
</template>

<script>
  import _http from '@/public/http';
  import { pathUrls } from '@/public/path';
    export default{
      name:'bindHistory',
      props:{
        bottleId:String
      },
      data(){
        return{
          tableHeight:'auto',
          screeHeight: document.documentElement.clientHeight, // 屏幕高
          loading:false,
          dataList:[],
          columns:[{
            title: '电子标签编码',
            key: 'logBottleNfcId',
            align: 'center',
          },
          // {
          //   title: '钢瓶条码',
          //   key: 'logBottleThreeId',

          //   align: 'center',
          // },
          // {
          //   title: '所属组织',
          //   key: 'logDeptName',
          //   align: 'center',
          // },
          {
            title: '操作人',
            key: 'logStaffName',
            align: 'center',
          },{
            title: '创建时间',
            key: 'logCreateTime',
            align: 'center',
          }]
        }
      },
      methods:{
        //关闭
        handleClose(){
        	this.$emit('bindHistory',false);
        },
        //获取绑定历史列表
          getBindHistoryList(){
              this.loading=true;
              this.dataList=[];
            _http.http1("post", pathUrls.queryBindLogByBottleId, {
                bottleId:this.bottleId
            },'form').then((res)=>{
                this.loading=false;
                this.dataList=res.data;
                if(this.dataList.length > 10) {
                   this.tableHeight =this.screeHeight-150;

                } else {
                    this.tableHeight = 'auto';
                }
              }).catch((err)=>{
                this.loading=false;
              })
          }
      },
      mounted(){
        this.getBindHistoryList()
      }
    }
</script>

<style type="text/css" scoped>
 .bindHistoryMain{
   position: absolute;
   left: 0;
   top: 0;
   right: 0;
   bottom: 0;
   background:#fff;
   z-index: 300;

 }
 .bindHistoryContent{
   position: relative;
   text-align: left;
   padding: 10px 20px;

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
 .bindHistoryList{
    margin-top: 10px;
   }
</style>
