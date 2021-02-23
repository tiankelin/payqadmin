<template>
	<div>
		<div v-for='item in entityList' :key='item.id' >
			<span class="labelName">商品名称：</span><span class='valueName'>{{item.goodsName}}</span>
			<span class="labelName ownName">规格：</span><span class='valueName'>{{item.spec}}</span>
			<span class="labelName ownName">数量：</span><span class='valueName ownName'>{{item.number}}</span>
			<span class="labelName">动作类型：</span><span class='valueName'>{{item.actionTypeName}}</span>
		</div>
		
	</div>
	
</template>

<script>
	export default {
        props: {
            entityList: Array,
           
        },
        data(){
        	return{
        		
        		
        	}
        },
        methods:{

        },
        mounted(){
     	  
        	 
        }
      
       }
</script>

<style type="text/css" scoped>
	.labelName{
		display: inline-block;
		min-width: 70px;
		font-weight: 600;
	}
	.valueName{
		display: inline-block;
		min-width: 95px;
		color: #0984f5;
	}
	.ownName{
		min-width: 50px;
		
	}
</style>