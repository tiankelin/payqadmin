<template>
  <div id="app" :class="[screeHeight>900?'lStyle':'sStyle']">
    <router-view/>
  </div>
</template>

<script>
Vue.directive("has",{inserted: function(el, binding){


    if(window.sessionStorage.getItem("menuArray")){
      if(!Vue.prototype.$_has(binding.value)&&el.parentNode) {
      	el.parentNode.removeChild(el);

      }
    }else{
      setTimeout(()=>{
        if(!Vue.prototype.$_has(binding.value)&&el.parentNode) {
        	el.parentNode.removeChild(el);

        }
      },100)
    }



		}
	})
//window.sessionStorage.setItem("menuArray",JSON.stringify([]))
	//权限检查方法
	Vue.prototype.$_has = function(value) {
//		console.log(value)
		let isExist = false;
		let buttonpermsStr =window.sessionStorage.getItem("menuArray");
		if(buttonpermsStr == undefined || buttonpermsStr == null) {
			return false;
		}
		let buttonperms = JSON.parse(buttonpermsStr);


//let buttonperms=[{perms:'920'},{perms:934}]
		for(let i = 0; i < buttonperms.length; i++) {
        
			if(buttonperms[i].menuId.indexOf(value) > -1) {
				isExist = true;
				break;
			}
			if(buttonperms[i].perms) {

				if(buttonperms[i].perms.indexOf(value) > -1){

					isExist = true;
					break;
				}

			}
		}


		return isExist;
	};
export default {
  name: 'App',
  data(){
    return{
      screeHeight: document.documentElement.clientHeight,
    }
  },
  mounted(){

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*background: linear-gradient(#2B6E80, #103A58);*/

}
.ivu-table th{
    background: #E2EEFF;
    color: #51B5EA;
  }
.lStyle .ivu-table td{
    /* height: 48px; */
  }
  .sStyle .ivu-table td{
      /* height: 40px; */
    }
.el-input__inner {
		height: 32px;
		line-height: 32px;
	}

.el-input__icon {
  line-height: 32px;
}
  .ivu-input[disabled]{
  	color:#515a6e!important;
  }
  .ivu-select-disabled,.ivu-select-selection{
  	color:#515a6e!important;
  }

</style>
