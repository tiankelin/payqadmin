export default {
  changeToken(state,data){
    state.token = data;
    try {
      sessionStorage.token = data
    } catch (e) {}
  },
    changeMenu(state,data){
    state.menuData = data;
    try {
      sessionStorage.menuData = data
    } catch (e) {}
  },
      changeUserData(state,data){
    state.userData = data;
    try {
      sessionStorage.userData = data
    } catch (e) {}
  },
        changePathName(state,data){
    state.pathName = data;
    try {
      sessionStorage.pathName = data
    } catch (e) {}
  },
    changeDeps(state,data){
    state.deps = data;
    try {
      sessionStorage.deps = data
    } catch (e) {}
  },
     changeCheckInfo(state,data){
    state.checkInfo = data;
    try {
      sessionStorage.checkInfo = data
    } catch (e) {}
  },
  changeMenuId(state,data){
    state.menuArray = data;
    try {
      sessionStorage.menuArray = data
    } catch (e) {}
  },
   changeCyinderData(state,data){
    state.cylinderData = data;
    try {
      sessionStorage.cylinderData = data
    } catch (e) {}
  },
  changeAllCount(state,data){
    state.allCount = data;
    try {
      sessionStorage.allCount = data
    } catch (e) {}
  },
   changeZero(state,data){
    state.toZero = data;
    try {
      sessionStorage.toZero = data
    } catch (e) {}
  },
   changeUserSearchData(state,data){
    state.userSearchData = data;
    try {
      sessionStorage.userSearchData = data
    } catch (e) {}
  },
   changeHomeMenu(state,data){
    state.homeMenu = data;
    try {
      sessionStorage.homeMenu = data
    } catch (e) {}
  },
   changeCylInfo(state,data){
    state.cylAddInfo = data;
    try {
//    sessionStorage.cylAddInfo = data
    } catch (e) {}
  },
  changeUnReadCount(state,data){
    state.unReadCount = data;
    try {
      sessionStorage.unReadCount = data
    } catch (e) {}
  },
  changeMapUserInfo(state,data){
    state.mapUserInfo = data;
    try {
      sessionStorage.mapUserInfo = data
    } catch (e) {}
  },
  changePhone(state,data){
    state.phone = data;
    try {
      sessionStorage.phone = data
    } catch (e) {}
  },
  changeWaitCount(state,data){
    state.waitCount = data;
    try {
      sessionStorage.waitCount = data
    } catch (e) {}
  },
  changeCountObject(state,data){
    state.countObject = data;
    try {
      sessionStorage.countObject = data
    } catch (e) {}
  },
  pushToken (state, payload) {
    state.cancelTokenArr.push(payload.cancelToken)
  },
  clearToken ({ cancelTokenArr }) {
    cancelTokenArr.forEach(item => {
      item('路由跳转取消请求')
    })
    cancelTokenArr = []
  },
  changeHasStaff(state,data){
    state.hasStaff = data;
    try {
      sessionStorage.hasStaff = data
    } catch (e) {}
  },
  changeUrlArray(state,data){
    state.urlArray = data;
    try {
      sessionStorage.urlArray = data
    } catch (e) {}
  },
  changeInspectSearch(state,data){
    state.inspectSearch = data;
    try {
      sessionStorage.inspectSearch = data
    } catch (e) {}
  },
}
