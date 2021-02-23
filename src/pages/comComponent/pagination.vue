<template>
  <div class="main">
		 <Page :total="100" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange'></Page>
  </div>

</template>
<script>
  import Bus from '@/public/bus'
    export default {
        name: 'pagination',
        props:{
//        pageSize:{
//          type:Number,
//          default:10
//        },
//        currentPage:{
//          type:Number,
//          default:1
//        }
        },
        data() {
            return {
               
            }
        },
        methods: {
          pageChange(current){	
          	console.log(current)
					
          },
          pageSizeChange(pageSize){
          	console.log(pageSize)
          }
        },
        mounted() {
     
        }
    }
</script>
<style scoped>
	.main{
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
	}
</style>
