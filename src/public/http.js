import axios from 'axios'
import qs from 'qs'
import store from '@/store/index';
import router from '@/router'
// const baseUrl = 'http://test.payq-iot.com:7002/';
   // const baseUrl = 'http://127.0.0.1:8088/';
//const baseUrl = 'http://47.111.185.198:8089/';
const baseUrl = 'https://source.payq-iot.com:8089/';
// const baseUrl = 'https://sys.payq-iot.com:8089/';
// const baseUrl = 'http://192.168.0.136:8088/';
// const baseUrl = 'http://192.168.0.142:8088/';
//const baseUrl = '/';

let headerType = {
	'json':{'Content-Type':'application/json'},
	'form':{'Content-Type':'application/x-www-form-urlencoded'}
};
axios.defaults.timeout = 60000
//http request 拦截器
axios.interceptors.request.use(
config => {
	const token = store.state.token;
	token && (config.headers.Authorization ='Bearer_'+token)
	config.cancelToken = new axios.CancelToken(function (cancel) {
		store.commit('pushToken', {cancelToken: cancel})
	  })
	return config;
},
err => {



	return Promise.reject(err)
})

// http response 拦截器
axios.interceptors.response.use(
response => {
	if (response.status === 200) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(response);
	}
},
//接口错误状态处理，也就是说无响应时的处理
error => {
		if (error.response.status===401){
			store.commit('changeToken','')
			sessionStorage.clear()
			router.push('/login');
			window.location.reload();
		}
	return Promise.reject(error.response) // 返回接口返回的错误信息
})

class _https {

	http1(methods, url, params, type="json")  {
		return new Promise((resolve, reject) => {
			axios[methods](baseUrl + url, params, {
				 headers:headerType[type],
				transformRequest: [function(params) {
					return qs.stringify(params);
				}]
			})
			.then(res => {
	if(res){
		resolve(res.data)
	}
			})
			.catch(err => {
				reject(err.data);
			})
		})
	}
	http2(methods, url, params, type="json"){
		return new Promise((resolve, reject) => {
			axios[methods](baseUrl + url, params, {
				 headers:headerType[type],
			})
			.then(res => {
	if(res){
		resolve(res.data)
	}
			})
			.catch(err => {
				reject(err.data);
			})
		})
	}
	http3(methods, url, params, type="json"){
		return new Promise((resolve, reject) => {
			axios[methods](baseUrl + url, {params:params}, {
				 headers:headerType[type],
			})
			.then(res => {

	if(res){
		resolve(res.data)
	}
			})
			.catch(err => {
				reject(err.data);
			})
		})
	}
		http4(methods, url, params, type="json"){
		return new Promise((resolve, reject) => {
			axios[methods](baseUrl + url, {data:params}, {
				 headers:headerType[type],
			})
			.then(res => {

	if(res){
		resolve(res.data)
	}
			})
			.catch(err => {
				reject(err.data);
			})
		})
	}
http5(methods, url, params){
  	return new Promise((resolve, reject) => {
  		axios[methods](baseUrl + url, {params:params,responseType: 'blob'}, {
  			 headers:'application/x-download',
  		})
  		.then(res => {

  if(res){
  	resolve(res.data)
  }
  		})
  		.catch(err => {
  			reject(err.data);
  		})
  	})
  }
}
export default  new _https();














//console.log(allHeaders)
   //http request 拦截器
//    axios.interceptors.request.use(
//     config => {
//         const token = store.state.token;
// 		token && (config.headers.Authorization ='Bearer_'+token)
//         return config;
//     },
//     err => {
//         return Promise.reject(err)
//     }),

// // http response 拦截器
//    axios.interceptors.response.use(
//     response => {
//        if (response.status === 200) {
//             return Promise.resolve(response);
//         } else {
//             return Promise.reject(response);
//         }
//     },
//     //接口错误状态处理，也就是说无响应时的处理
//     error => {
//     	 if (error.response.status==401){

//     	 }
//         return Promise.reject(error.response) // 返回接口返回的错误信息
//     })
// const service = {

// 	//get请求方法
// 	get(url, params, i) {
// //		let allHeaders=[{'Content-Type':'application/json','Authorization':'Bearer_'+store.state.token},{'Content-Type':'application/x-www-form-urlencoded','Authorization':'Bearer_'+store.state.token}]
// 		let allHeaders=[{'Content-Type':'application/json'},{'Content-Type':'application/x-www-form-urlencoded'}]
// 		return new Promise((resolve, reject) => {
// 			axios.get(url, {
// 					params: params,
// 					headers:allHeaders[i],
// 					transformRequest: [function(params) {
// 						return qs.stringify(params);
// 					}]
// 				})
// 				.then(res => {
// 					//console.log(jsonpChangeJson(res.data),456);
// 					if(res.data.code == 0) {

// 						resolve(res.data.result);
// 						store.commit('changeToken',res.data.token);
// 					}
// 				})
// 				.catch(err => {
// 					reject(err.data);
// 				})
// 		})
// 	},

// //post请求方法
// 	post(url, params, i) {
// 		return new Promise((resolve, reject) => {
// 			let allHeaders=[{'Content-Type':'application/json'},{'Content-Type':'application/x-www-form-urlencoded'}]
// 			axios.post(url, params, {
// 					headers:allHeaders[i],
// 					transformRequest: [function(params) {
// 						return qs.stringify(params);
// 					}]
// 				})
// 				.then(res => {
// 					if(res.data.code ==0) {
// 						resolve(res.data);
// 						store.commit('changeMenu',JSON.stringify(res.data.data.modules));
// 						store.commit('changeUserData',JSON.stringify(res.data.data.user));
// 					}
// 				})
// 				.catch(err => {
// 					reject(err.data);
// 				})
// 		})
// 	},
// 	//put请求方法
// 	put(url, params, i) {
// 		let allHeaders=[{'Content-Type':'application/json'},{'Content-Type':'application/x-www-form-urlencoded'}]
// 		return new Promise((resolve, reject) => {
// 			axios.put(url, params, {
// 					headers:allHeaders[i]
// 				})
// 				.then(function(response) {
// 					resolve(response.data)
// 				})
// 				.catch(function(err) {
// 					reject(err)
// 				});
// 		})
// 	},
// 	//delete请求方法
// 	delete(url, params, i) {
// 	let allHeaders=[{'Content-Type':'application/json'},{'Content-Type':'application/x-www-form-urlencoded'}]
// 		return new Promise((resolve, reject) => {
// 			axios.delete(url, {
// 					params: params,
// 					headers:allHeaders[i]
// 				})
// 				.then(function(response) {
// 					resolve(response.data)
// 				})
// 				.catch(function(err) {
// 					reject(err)
// 				});
// 		})
// 	},
// }

// export default service
