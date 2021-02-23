
let token=''
let menuData=[]
let userData={}
let pathName=''
let deps=null
let checkInfo={}
let menuArray=[]
let cylinderData=[]
let allCount=0
let toZero=false
let userSearchData={}
let homeMenu=[]
let cylAddInfo={}
let unReadCount=0
let mapUserInfo=[];
let phone='';
let waitCount='';
let countObject={};
let cancelTokenArr=[];
let hasStaff=1;
let urlArray=[];
let inspectSearch={};
try {
  if (sessionStorage.token) {
    token = sessionStorage.token
  }
} catch (e) {}
try {
  if (sessionStorage.menuData) {
    menuData = sessionStorage.menuData
  }
} catch (e) {}
try {
  if (sessionStorage.userData) {
    userData = sessionStorage.userData
  }
} catch (e) {}

try {
  if (sessionStorage.pathName) {
    pathName = sessionStorage.pathName
  }
} catch (e) {}
try {
  if (sessionStorage.deps) {
    deps = sessionStorage.deps
  }
} catch (e) {}
try {
  if (sessionStorage.checkInfo) {
    checkInfo = sessionStorage.checkInfo
  }
} catch (e) {}
try {
  if (sessionStorage.cylinderData) {
    cylinderData = sessionStorage.cylinderData
  }
} catch (e) {}
try {
  if (sessionStorage.allCount) {
    allCount = sessionStorage.allCount
  }
} catch (e) {}
try {
  if (sessionStorage.userSearchData) {
    userSearchData = sessionStorage.userSearchData
  }
} catch (e) {}
try {
  if (sessionStorage.homeMenu) {
    homeMenu = sessionStorage.homeMenu
  }
} catch (e) {}
try {
  if (sessionStorage.unReadCount) {
    unReadCount = sessionStorage.unReadCount
  }
} catch (e) {}
try {
  if (sessionStorage.mapUserInfo) {
    mapUserInfo = sessionStorage.mapUserInfo
  }
} catch (e) {}
try {
  if (sessionStorage.phone) {
    phone = sessionStorage.phone
  }
} catch (e) {}
try {
  if (sessionStorage.waitCount) {
    waitCount = sessionStorage.waitCount
  }
} catch (e) {}
try {
  if (sessionStorage.countObject) {
    countObject = sessionStorage.countObject
  }
} catch (e) {}
try {
  if (sessionStorage.hasStaff) {
    hasStaff = sessionStorage.hasStaff
  }
} catch (e) {}
try {
  if (sessionStorage.menuArray) {
    menuArray = sessionStorage.menuArray
  }
} catch (e) {}
try {
  if (sessionStorage.urlArray) {
    urlArray = sessionStorage.urlArray
  }
} catch (e) {}
try {
  if (sessionStorage.inspectSearch) {
    inspectSearch = sessionStorage.inspectSearch
  }
} catch (e) {}
export default {
  token: token,
  menuData:menuData,
  userData:userData,
  pathName:pathName,
  deps:deps,
  checkInfo:checkInfo,
  menuArray:menuArray,
  cylinderData:cylinderData,
  allCount:allCount,
  toZero:toZero,
  userSearchData:userSearchData,
  homeMenu:homeMenu,
  cylAddInfo:cylAddInfo,
  unReadCount:unReadCount,
  mapUserInfo:mapUserInfo,
  phone:phone,
  waitCount:waitCount,
  countObject:countObject,
  cancelTokenArr:cancelTokenArr,
  hasStaff:hasStaff,
  urlArray:urlArray,
  inspectSearch:inspectSearch
}

//let newArr=[{icon: "layui-icon-app",menuId: 879,name: "钢瓶管理",orderNum: 1,parentId: 0,type: 0,
//list:[{icon: "layui-icon-read",menuId: 809,name: "充装记录",orderNum: 1,
//parentId: 879,perms: "app:xkfillinfo:save",showHide: 1,type: 1,url: "modules/app/xkfillinfo.html"}]}]
