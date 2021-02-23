// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//import ViewUI from 'view-design'
import common from '@/public/tool.js'
//import 'view-design/dist/styles/iview.css';
import "@/public/global.css";
import 'babel-polyfill';
import store from './store';
//import { Table } from "ant-design-vue";
//import './assets/iconfont/iconfont.css';
// import 'ant-design-vue/lib/table/style/css';
import { Cascader } from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
//import 'default-passive-events';
Vue.prototype.common = common;
Vue.config.productionTip = false
Vue.use(router);

Vue.component(Cascader.name, Cascader);
router.beforeEach((to, from, next) => {

	store.commit('clearToken');
	let toPath = to.path;
	let urlArray=[];
	if(store.state.urlArray){
		urlArray=store.state.urlArray
	}
	if(to.meta.hasMenu) {
		if(urlArray.indexOf(toPath) == -1) {
			next('/unfinishedPage');
		} else {
			next();
		}
	}
	store.commit('changePathName', to.meta.pathName);
	store.commit('changeHasStaff', 1);
	if(toPath == '/login') {
		store.commit('changeToken', '');
		sessionStorage.clear();
	}
//	if(!to.meta.pathName) {
//		next('/unfinishedPage');
//	} else {
//		next();
//	}
	if(!sessionStorage.getItem('token') && toPath != '/login') {
		next('/login');
	} else {
		next();
	}
})
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
})