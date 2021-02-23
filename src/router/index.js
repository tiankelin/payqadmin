import Vue from 'vue'
import Router from 'vue-router'
//const originalPush = Router.prototype.push
//Router.prototype.push = function push(location) {
//return originalPush.call(this, location).catch(err => err)
//}
const Login = () => import('@/pages/login/index');

const Main = () => import('@/pages/main/index');

const HomePage = () => import('@/pages/home/index');//地图首页
//钢瓶管理

const cylinder = () => import('@/pages/cylinderManage/cylinder/index');//钢瓶档案
const addCyl = () => import('@/pages/cylinderManage/cylinder/addCyl');//钢瓶新增
const editCyl = () => import('@/pages/cylinderManage/cylinder/editCyl');//钢瓶编辑
const cylinderCirculation = () => import('@/pages/cylinderManage/cylinderCirculation/index');//钢瓶流转
const newCylinder = () => import('@/pages/cylinderManage/newCylinder/index');//新钢瓶档案
const checkReminder = () => import('@/pages/cylinderManage/checkReminder/index');//检测提醒
const addNewCyl = () => import('@/pages/cylinderManage/newCylinder/addNewCyl');//新钢瓶新增
const editNewCyl = () => import('@/pages/cylinderManage/newCylinder/editNewCyl');//新钢瓶编辑
const inspectList = () => import('@/pages/cylinderManage/inspectList/index');//送检列表checkList
const checkList = () => import('@/pages/cylinderManage/checkList/index');//送检列表

const bindBottleRecord= () => import('@/pages/cylinderManage/bindBottleRecord/index');//绑瓶记录
const cylinderManufacturer= () => import('@/pages/cylinderManage/cylinderManufacturer/index');//钢瓶厂家
const manufacturerAdd= () => import('@/pages/cylinderManage/cylinderManufacturer/manufacturerAdd');//钢瓶厂家新增
const manufacturerEdit= () => import('@/pages/cylinderManage/cylinderManufacturer/manufacturerEdit');//钢瓶厂家修改
const circulationLack= () => import('@/pages/cylinderManage/circulationLack/index');//流转缺失
const inactiveCylinder= () => import('@/pages/cylinderManage/inactiveCylinder/index');//活跃钢瓶统计
const inventoryList= () => import('@/pages/cylinderManage/inventoryList/index');//检验清单列表
const bottleCheckAdd = () => import('@/pages/cylinderManage/inspectList/bottleCheckAdd');//送检列表新增
//充装管理
const fillRecord = () => import('@/pages/fillingManage/fillRecord/index');//充装记录
const fillError = () => import('@/pages/fillingManage/fillError/index');//充装异常
const preChargeInspection = () => import('@/pages/fillingManage/preChargeInspection/index');//充前检查
const inspectionAfterFilling = () => import('@/pages/fillingManage/inspectionAfterFilling/index');//充后检查
//系统配置
const organizManage = () => import('@/pages/systemConfig/organizManage/index');//组织管理
const addOrganize = () => import('@/pages/systemConfig/organizManage/addOrganize');//新增组织
const editOrganize = () => import('@/pages/systemConfig/organizManage/editOrganize');//编辑组织
const roleManage = () => import('@/pages/systemConfig/roleManage/index');//角色管理
const addRole = () => import('@/pages/systemConfig/roleManage/addRole');//角色新增
const editRole = () => import('@/pages/systemConfig/roleManage/editRole');//角色修改
const userManage = () => import('@/pages/systemConfig/userManage/index');//用户管理
const addUser = () => import('@/pages/systemConfig/userManage/addUser');//用户新增
const editUser = () => import('@/pages/systemConfig/userManage/editUser');//用户修改
const businessRuleConfiguration = () => import('@/pages/systemConfig/businessRuleConfiguration/index');//业务规则配置

//系统设置
const menuManage = () => import('@/pages/systemSetup/menuManage/index');//菜单管理
const addMenu= () =>import('@/pages/systemSetup/menuManage/addMenu');//菜单新增
const editMenu= () =>import('@/pages/systemSetup/menuManage/editMenu');//菜单编辑
const securityRules = () => import('@/pages/systemSetup/securityRules/index');//安检规则
const addRules = () => import('@/pages/systemSetup/securityRules/addRules');//安检规则新增
const editRules = () => import('@/pages/systemSetup/securityRules/editRules');//安检规则编辑
const orderAllocationRules = () => import('@/pages/systemSetup/orderAllocationRules/index');//订单分配规则列表
const allocationRulesEdit= () => import('@/pages/systemSetup/orderAllocationRules/allocationRulesEdit');//订单分配规则编辑
const businessRuleSet = () => import('@/pages/systemSetup/businessRuleSet/index');//业务规则设置
const businessRuleSetAdd = () => import('@/pages/systemSetup/businessRuleSet/businessRuleSetAdd');//业务规则设置新增
const businessRuleSetEdit = () => import('@/pages/systemSetup/businessRuleSet/businessRuleSetEdit');//业务规则设置编辑
const addAppMenu= () =>import('@/pages/systemSetup/menuManage/addAppMenu');//app菜单新增
const editAppMenu= () =>import('@/pages/systemSetup/menuManage/editAppMenu');//app菜单编辑

const vipUser = () => import('@/pages/systemSetup/vipUser/index');//安检规则vip用户
const messageSet = () => import('@/pages/systemSetup/messageSet/index');//消息设置
const messageAdd = () => import('@/pages/systemSetup/messageSet/messageAdd');//消息新增
const messageEdit = () => import('@/pages/systemSetup/messageSet/messageEdit');//消息编辑
const sysConfiguration = () => import('@/pages/systemSetup/sysConfiguration/index');//系统配置
const configAdd = () => import('@/pages/systemSetup/sysConfiguration/configAdd');//系统配置新增
const configEdit = () => import('@/pages/systemSetup/sysConfiguration/configEdit');//系统配置修改
//三轮车管理
const distributeFile = () => import('@/pages/tricycleManage/distributeFile/index');//配送车档案
const addFile = () => import('@/pages/tricycleManage/distributeFile/addFile');//配送车档案新增
const editFile = () => import('@/pages/tricycleManage/distributeFile/editFile');//配送车档案编辑
const tricycleRecord = () => import('@/pages/tricycleManage/tricycleRecord/index');//三轮车上下瓶记录
//危化车管理
const dangerousFile =()=>import('@/pages/dangerousManage/dangerousFile/index');//危化车档案
const addFileD=()=>import('@/pages/dangerousManage/dangerousFile/addFileD');//危化车档案新增
const editFileD=()=>import('@/pages/dangerousManage/dangerousFile/editFileD');//危化车档案编辑
const dangerousRecord=()=>import('@/pages/dangerousManage/dangerousRecord/index');//危化车上下瓶记录
const accountBook=()=>import('@/pages/dangerousManage/accountBook/index');//危化车账本
//门禁管理
const accessFile =()=>import('@/pages/accessManage/accessFile/index');//门禁档案
const addFileA=()=>import('@/pages/accessManage/accessFile/addFileA');//门禁档案新增
const editFileA=()=>import('@/pages/accessManage/accessFile/editFileA');//门禁档案编辑
const accessRecord=()=>import('@/pages/accessManage/accessRecord/index');//门禁进出瓶记录
//客户管理
const openAnAccount = () => import('@/pages/clientManage/openAnAccount/index');//开户
const customerInfo = () => import('@/pages/clientManage/customerInfo/index');//客户信息
const closeAnAccount = () => import('@/pages/clientManage/closeAnAccount/index');//销户
const editAccount = () => import('@/pages/clientManage/customerInfo/editAccount');//编辑
const seeAccount = () => import('@/pages/clientManage/customerInfo/seeAccount');//查看
const customerType = () => import('@/pages/clientManage/customerType/index');//客户类型
const occupyStatistics = () => import('@/pages/clientManage/occupyStatistics/index');//占用瓶统计
const intelligentPrediction = () => import('@/pages/clientManage/intelligentPrediction/index');//智能预测
const predictionAdd = () => import('@/pages/clientManage/intelligentPrediction/predictionAdd');//智能预测新增
const predictionEdit = () => import('@/pages/clientManage/intelligentPrediction/predictionEdit');//智能预测编辑
const activeUsers = () => import('@/pages/clientManage/activeUsers/index');//活跃用户统计
//智能终端
const terminalFiles = () => import('@/pages/intelTerminal/terminalFiles/index');//终端档案
const terminalType = () => import('@/pages/intelTerminal/terminalType/index');//终端类型
const terFileAdd = () => import('@/pages/intelTerminal/terminalFiles/terFileAdd');//终端档案新增
const terFileEdit = () => import('@/pages/intelTerminal/terminalFiles/terFileEdit');//终端档案编辑
const terTypeAdd = () => import('@/pages/intelTerminal/terminalType/terTypeAdd');//终端类型新增
const terTypeEdit = () => import('@/pages/intelTerminal/terminalType/terTypeEdit');//终端类型编辑
//智能用气卡
const gasCardFiles = () => import('@/pages/intelGasCard/gasCardFiles/index');//用气卡档案
const cardAdd = () => import('@/pages/intelGasCard/gasCardFiles/cardAdd');//用气卡档案新增
const cardEdit = () => import('@/pages/intelGasCard/gasCardFiles/cardEdit');//用气卡档案编辑
//移动人员管理
const personPost = () => import('@/pages/mobilePersonManage/personPost/index');//移动人员岗位
const addPost = () => import('@/pages/mobilePersonManage/personPost/addPost');//移动人员岗位新增
const editPost = () => import('@/pages/mobilePersonManage/personPost/editPost');//移动人员岗位编辑
const moduleAssign = () => import('@/pages/mobilePersonManage/personPost/moduleAssign');//模块分配
const mobilePerson = () => import('@/pages/mobilePersonManage/mobilePerson/index');//移动人员
const addPerson = () => import('@/pages/mobilePersonManage/mobilePerson/addPerson');//移动人员新增
const editPerson = () => import('@/pages/mobilePersonManage/mobilePerson/editPerson');//移动人员编辑
const roleConfig = () => import('@/pages/mobilePersonManage/mobilePerson/roleConfig');//角色配置
const dataAssign = () => import('@/pages/mobilePersonManage/personPost/dataAssign');//数据分配
//巡查管理
const inspectType = () => import('@/pages/inspectManage/inspectType/index');//巡查类型
const addInspect= () => import('@/pages/inspectManage/inspectType/addInspect');//巡查类型新增
const editInspect= () => import('@/pages/inspectManage/inspectType/editInspect');//巡查类型编辑
const inspectInfor = () => import('@/pages/inspectManage/inspectInfor/index');//巡查信息
const seeInfo = () => import('@/pages/inspectManage/inspectInfor/seeInfo');//巡查详情
const inspectionList = () => import('@/pages/inspectManage/inspectionList/index');//巡查单列表
const inspectionInfo = () => import('@/pages/inspectManage/inspectionList/inspectionInfo');//巡查单详情
//入户安检
const securityRecord = () => import('@/pages/householdCheck/securityRecord/index');//安检记录
const orderSecurityType = () => import('@/pages/householdCheck/orderSecurityType/index');//订单安检类型
const securityAdd = () => import('@/pages/householdCheck/orderSecurityType/securityAdd');//安检项新增
const securityEdit = () => import('@/pages/householdCheck/orderSecurityType/securityEdit');//安检项编辑
const securityInfo = () => import('@/pages/householdCheck/orderSecurityType/securityInfo');//安检项详情
const checkInfo = () => import('@/pages/householdCheck/securityRecord/checkInfo');//安检记录详情
const unCheckUser = () => import('@/pages/householdCheck/unCheckUser/index');//未安检客户
const unCheckAlarm = () => import('@/pages/householdCheck/unCheckAlarm/index');//未安检客户超期报警
const workOrderList = () => import('@/pages/householdCheck/workOrderList/index');//工单列表
const securitycheck = () => import('@/pages/householdCheck/securitycheck/index');//安检统计
//订单管理
const merchandiseOrder = () => import('@/pages/orderManage/merchandiseOrder/index');//商品订单
const orderAdd = () => import('@/pages/orderManage/merchandiseOrder/orderAdd');//商品订单新增
const orderInfo = () => import('@/pages/orderManage/merchandiseOrder/orderInfo');//商品订单详情
const helpList = () => import('@/pages/orderManage/helpList/index');//求助单
const helpInfo = () => import('@/pages/orderManage/helpList/helpInfo');//求助单详情
const helpType = () => import('@/pages/orderManage/helpType/index');//求助类型
const disExceptionInfo = () => import('@/pages/orderManage/disExceptionInfo/index');//配送异常信息

//系统监控
const systemLog = () => import('@/pages/systemMonitor/systemLog/index');//系统日志
//数据总览
const dataScreen = () => import('@/pages/dataScreen/index');//数据总览
const cylinderData = () => import('@/pages/cylinderData/index');//气瓶数据
//功能开发中
const unfinishedPage = () => import('@/pages/unfinishedPage/index');//功能开发中
//商品管理
const commodityInfo = () => import('@/pages/commodityManage/commodityInfo/index1');//商品信息
const commodityAdd = () => import('@/pages/commodityManage/commodityInfo/commodityAdd1');//商品信息新增
const commodityAllocate = () => import('@/pages/commodityManage/commodityInfo/commodityAllocate');//商品信息分配
const commodityEdit = () => import('@/pages/commodityManage/commodityInfo/commodityEdit1');//商品信息编辑
const regionalQuotation = () => import('@/pages/commodityManage/regionalQuotation/index');//商品区域报价
const priceList = () => import('@/pages/commodityManage/priceList/index');//商品价格表

//异常统计
const abnormalStatistics = () => import('@/pages/abnormalStatistics/index');//异常统计
//业绩统计
const order = () => import('@/pages/performanceStatistics/order/index');//订单统计
const distribute = () => import('@/pages/performanceStatistics/distribute/index');//配送统计
const check = () => import('@/pages/performanceStatistics/check/index');//安检统计
const inspect = () => import('@/pages/performanceStatistics/inspect/index');//巡查统计
const recovery = () => import('@/pages/performanceStatistics/recovery/index');//回收统计
//消息中心（更新公告）
const messageCenter = () => import('@/pages/messageCenter/index');//全部消息
const messageInfo = () => import('@/pages/messageCenter/messageInfo');//详情
//客服中心
const callCenter = () => import('@/pages/customerServiceCenter/callCenter/index');//呼叫中心
//账本管理
const issueAccount = () => import('@/pages/accountManage/issueAccount/index');//发出账本
//出入库管理
const salesReport = () => import('@/pages/inventoryManage/salesReport/index');//销售报表
const distributorInventory = () => import('@/pages/inventoryManage/distributorInventory/index');//配送员库存统计
//标签管理
const tagsList = () => import('@/pages/tagsManage/tagsList/index');//标签列表
const tagsAdd = () => import('@/pages/tagsManage/tagsList/tagsAdd');//标签列表新增
//押金单管理
const depositNoteInfo = () => import('@/pages/depositNoteMessage/depositNoteInfo/index');//押金单信息
const editNote = () => import('@/pages/depositNoteMessage/depositNoteInfo/editNote');//押金单信息编辑
const rentBreakdown = () => import('@/pages/depositNoteMessage/rentBreakdown/index');//退押信息
Vue.use(Router)


let _routes = [];
function handleRoute(route, pPath = '') {
  route.forEach((item) => {
    if (item.children && item.children.length) {
      let _path = (pPath ? `${pPath}/` : '')  + item.path;
      handleRoute(item.children, _path);
    } else {
      item.path = (pPath ? `${pPath}/` : '')  + item.path;
      _routes.push(item)
    }
  })
  return _routes;
}


const ContentRoute = [
  	//客服中心 呼叫中心
  {
    path: 'customerServiceCenter',
    children: [{
      path: 'callCenter',
      component: callCenter,
      meta:{pathName:'呼叫中心',keepAlive:true,hasMenu:true},
    },]
    },
  //消息中心
 {
   path: 'messageCenter/:id',
   component: messageCenter,
    meta:{pathName:'更新公告',keepAlive:true},
 },
 {

   path: 'messageCenter/messageInfo/:id',
   component: messageInfo,
    meta:{pathName:'更新公告'},
 },
//未完成提示
{
  path: 'unfinishedPage',
  component: unfinishedPage,
   meta:{pathName:'功能',keepAlive:true},
},
//首页
{
  path: 'home',
  component: HomePage,
   meta:{pathName:'基础数据',keepAlive:true,hasMenu:true},
},
//数据总览
{
  path: 'dataScreen',
  component: dataScreen,
   meta:{pathName:'数据总览',keepAlive:true,hasMenu:true},
},
//气瓶数据
{
  path: 'cylinderData',
  component: cylinderData,
   meta:{pathName:'气瓶数据',keepAlive:true,hasMenu:true},
},
//异常统计
{
  path: 'abnormalStatistics',
  component: abnormalStatistics,
   meta:{pathName:'异常统计',keepAlive:true,hasMenu:true},
},
//钢瓶管理
{
  path: 'cylinderManage',
  children: [{
    path: 'cylinderCirculation',
    component: cylinderCirculation,
    meta:{pathName:'钢瓶流转',keepAlive:true,hasMenu:true},
  },
   {
    path: 'cylinder',
    component: cylinder,
     meta:{pathName:'原钢瓶档案',keepAlive:true},
  }, {
    path: 'checkReminder',
    component: checkReminder,
     meta:{pathName:'检测提醒',keepAlive:true,hasMenu:true},
  }, {
    path: 'inspectList',
    component: inspectList,
     meta:{pathName:'送检列表',keepAlive:true,hasMenu:true},
  },  {
    path: 'bindBottleRecord',
    component: bindBottleRecord,
     meta:{pathName:'绑瓶记录',keepAlive:true,hasMenu:true},
  }, {
    path: 'cylinderManufacturer',
    component: cylinderManufacturer,
     meta:{pathName:'钢瓶厂家',keepAlive:true,hasMenu:true},
  },{
    path: 'circulationLack',
    component: circulationLack,
     meta:{pathName:'流转缺失',keepAlive:true,hasMenu:true},
  },{
    path: 'inactiveCylinder',
    component: inactiveCylinder,
     meta:{pathName:'沉睡钢瓶统计',keepAlive:true,hasMenu:true},
  },{
    path: 'inventoryList',
    component: inventoryList,
     meta:{pathName:'验收列表',keepAlive:true,hasMenu:true},
  },{
    path: 'checkList',
    component: checkList,
     meta:{pathName:'检验列表',keepAlive:true,hasMenu:true},
  },{
    path: 'newCylinder',
    component: newCylinder,
     meta:{pathName:'钢瓶档案',keepAlive:true,hasMenu:true},
  }]

},
//送检列表新增
{
  path: 'inspectList',
  children: [{
    path: 'bottleCheckAdd',
    component: bottleCheckAdd,
     meta:{pathName:'送检列表'},
  }]
},

//钢瓶新增  编辑
{
  path: 'cylinder',
  children: [{
    path: 'addCyl',
    component: addCyl,
     meta:{pathName:'原钢瓶档案'},
  },{
    path: 'editCyl/:id',
    component: editCyl,
     meta:{pathName:'原钢瓶档案'},
  }]
},

//新钢瓶新增  编辑
{
  path: 'newCylinder',
  children: [{
    path: 'addNewCyl',
    component: addNewCyl,
     meta:{pathName:'钢瓶档案'},
  },{
    path: 'editNewCyl/:id',
    component: editNewCyl,
     meta:{pathName:'钢瓶档案'},
  }]
},

//钢瓶厂家新增编辑
{
  path: 'cylinderManufacturer',
  children: [{
    path: 'manufacturerEdit/:id',
    component: manufacturerEdit,
     meta:{pathName:'钢瓶厂家'},
  },{
    path: 'manufacturerAdd',
    component: manufacturerAdd,
     meta:{pathName:'钢瓶厂家'},
  }]
},
//系统配置
{
  path: 'systemConfig',
  children: [{
    path: 'organizManage',
    component: organizManage,
     meta:{pathName:'组织管理',keepAlive:true,hasMenu:true},
  }, {
    path: 'roleManage',
    component: roleManage,
    meta:{pathName:'角色管理',keepAlive:true,hasMenu:true},
  }, {
    path: 'userManage',
    component: userManage,
    meta:{pathName:'用户管理',keepAlive:true,hasMenu:true},
  }, {
    path: 'businessRuleConfiguration',
    component: businessRuleConfiguration,
    meta:{pathName:'业务规则配置',keepAlive:true,hasMenu:true},
  }]
},
//组织新增 编辑
,{
  path: 'organizManage',
  children: [{
    path: 'addOrganize/:id',
    component: addOrganize,
     meta:{pathName:'组织管理'},
  },{
    path: 'editOrganize/:id',
    component: editOrganize,
     meta:{pathName:'组织管理'},
  }]
},

//角色新增 编辑
{
  path: 'roleManage',
  children: [{
    path: 'addRole',
    component: addRole,
     meta:{pathName:'角色管理'},
  },{
    path: 'editRole/:id',
    component: editRole,
     meta:{pathName:'角色管理'},
  }]
},

//用户新增 编辑
{
  path: 'userManage',
  children: [{
    path: 'addUser',
    component: addUser,
     meta:{pathName:'用户管理'},
  },{
    path: 'editUser/:id',
    component: editUser,
     meta:{pathName:'用户管理'},
  }]
},


//系统设置
{
  path: 'systemSetup',
  children: [{
    path: 'menuManage',
    component: menuManage,
    meta:{pathName:'菜单管理',keepAlive:true,hasMenu:true},
  },{
    path: 'securityRules',
    component: securityRules,
    meta:{pathName:'安检规则',keepAlive:true,hasMenu:true},
  },{
    path: 'vipUser',
    component: vipUser,
    meta:{pathName:'白名单用户',keepAlive:true,hasMenu:true},
  },{
    path: 'messageSet',
    component: messageSet,
    meta:{pathName:'消息设置',keepAlive:true,hasMenu:true},
  },{
    path: 'sysConfiguration',
    component: sysConfiguration,
    meta:{pathName:'系统配置',keepAlive:true,hasMenu:true},
  },{
    path: 'orderAllocationRules',
    component: orderAllocationRules,
    meta:{pathName:'订单分配规则',keepAlive:true,hasMenu:true},
  },{
    path: 'businessRuleSet',
    component: businessRuleSet,
    meta:{pathName:'规则条目配置',keepAlive:true,hasMenu:true},
  }
  ]
},
//业务规则设置新增、修改
{
  path: 'businessRuleSet',
  children: [{
    path: 'businessRuleSetAdd',
    component: businessRuleSetAdd,
     meta:{pathName:'规则条目配置'},
  },{
    path: 'businessRuleSetEdit/:id',
    component: businessRuleSetEdit,
     meta:{pathName:'规则条目配置'},
  }]
},
//订单分配规则编辑
{
  path: 'orderAllocationRules',
  children: [{
    path: 'allocationRulesEdit/:id',
    component: allocationRulesEdit,
     meta:{pathName:'订单分配规则'},
  }]
},
//系统设置-配置新增、修改
{
  path: 'sysConfiguration',
  children: [{
    path: 'configAdd',
    component: configAdd,
     meta:{pathName:'系统配置'},
  },{
    path: 'configEdit/:id',
    component: configEdit,
     meta:{pathName:'系统配置'},
  }]
},
//消息新增
{
  path: 'messageSet',
  children: [{
    path: 'messageAdd',
    component: messageAdd,
     meta:{pathName:'消息设置'},
  },{
    path: 'messageEdit/:id',
    component: messageEdit,
     meta:{pathName:'消息设置'},
  }]
},

//菜单新增  编辑
{
  path: 'menuManage',
  children: [{
    path: 'addMenu',
    component: addMenu,
     meta:{pathName:'菜单管理'},
  },{
    path: 'editMenu/:id',
    component: editMenu,
    meta:{pathName:'菜单管理'},
  },{
    path: 'addAppMenu/:module',
    component: addAppMenu,
    meta:{pathName:'app菜单管理'},
  },{
    path: 'editAppMenu/:module/:id',
    component: editAppMenu,
    meta:{pathName:'app菜单管理'},
  }]
},

//安检规则新增  编辑
{
  path: 'securityRules',
  children: [{
    path: 'addRules',
    component: addRules,
   	meta:{pathName:'安检规则'},
  },{
    path: 'editRules/:id',
    component: editRules,
    meta:{pathName:'安检规则'},
  }]
},
//三轮车管理
{
  path: 'tricycleManage',
  children: [{
    path: 'distributeFile',
    component: distributeFile,
    meta:{pathName:'配送车档案',keepAlive: true,hasMenu:true},
  },{
    path: 'tricycleRecord',
    component: tricycleRecord,
    meta:{pathName:'三轮车上下瓶记录',keepAlive:true,hasMenu:true},
  }]
},
//三轮车档案新增  编辑
{
  path: 'distributeFile',
  children: [{
    path: 'addFile',
    component: addFile,
    meta:{pathName:'配送车档案'},
  },{
    path: 'editFile/:id',
    component: editFile,
    meta:{pathName:'配送车档案'},
  }]
},

//客户管理
{
  path: 'clientManage',
  children: [{
    path: 'openAnAccount',
    component: openAnAccount,
    meta:{pathName:'客户信息'},
  },{
    path: 'customerInfo',
    component: customerInfo,
    meta:{pathName:'客户信息',keepAlive:true,hasMenu:true},
  },{
    path: 'closeAnAccount',
    component: closeAnAccount,
    meta:{pathName:'销户'},
  },{
    path: 'customerType',
    component: customerType,
    meta:{pathName:'客户类型',keepAlive:true,hasMenu:true},
  },{
    path: 'occupyStatistics',
    component: occupyStatistics,
    meta:{pathName:'占用瓶统计',keepAlive:true,hasMenu:true},
  },{
    path: 'intelligentPrediction',
    component: intelligentPrediction,
    meta:{pathName:'智能预测',keepAlive:true,hasMenu:true},
  },{
    path: 'activeUsers',
    component: activeUsers,
    meta:{pathName:'活跃用户统计',keepAlive:true,hasMenu:true},
  },]
},
{
  path: 'customerInfo',
  children: [{
    path: 'editAccount/:id',
    component: editAccount,
    meta:{pathName:'客户信息'},
  },{
    path: 'seeAccount/:id/:seeType',
    component: seeAccount,
    meta:{pathName:'客户信息'},
  }]
},
//智能预测新增编辑
{
  path: 'intelligentPrediction',
  children: [{
    path: 'predictionAdd',
    component: predictionAdd,
    meta:{pathName:'智能预测'},
  },{
    path: 'predictionEdit/:id',
    component: predictionEdit,
    meta:{pathName:'智能预测'},
  }]
},

//门禁管理
{
  path: 'accessManage',
  children: [{
    path: 'accessFile',
    component: accessFile,
    meta:{pathName:'门禁档案',keepAlive:true,hasMenu:true},
  },{
    path: 'accessRecord',
    component: accessRecord,
    meta:{pathName:'门禁进出瓶记录',keepAlive:true,hasMenu:true},
  }]
},
//门禁档案新增 编辑
{
  path: 'accessFile',
  children: [{
    path: 'addFileA',
    component: addFileA,
    meta:{pathName:'门禁档案'},
  },{
    path: 'editFileA/:id',
    component: editFileA,
    meta:{pathName:'门禁档案'},
  }]
},

//危化车管理
{
  path: 'dangerousManage',
  children: [{
    path: 'dangerousRecord',
    component: dangerousRecord,
    meta:{pathName:'危化车上下瓶记录',keepAlive:true,hasMenu:true},
  },{
    path: 'dangerousFile',
    component: dangerousFile,
    meta:{pathName:'危化车档案',keepAlive:true,hasMenu:true},
  },{
    path: 'accountBook',
    component: accountBook,
    meta:{pathName:'危化车账本',keepAlive:true,hasMenu:true},
  }]
},
//危化车档案新增  编辑
{
  path: 'dangerousFile',
  children: [{
    path: 'addFileD',
    component: addFileD,
    meta:{pathName:'危化车档案'},
  },{
    path: 'editFileD/:id',
    component: editFileD,
    meta:{pathName:'危化车档案'},
  }]
},




//智能终端
{
  path: 'intelTerminal',
  children: [{
    path: 'terminalFiles',
    component: terminalFiles,
    meta:{pathName:'终端档案',keepAlive:true,hasMenu:true},
  },{
    path: 'terminalType',
    component: terminalType,
    meta:{pathName:'终端类型',keepAlive:true,hasMenu:true},
  }]
},
//终端档案新增
{
  path: 'terminalFiles',
  children: [{
    path: 'terFileAdd',
    component: terFileAdd,
    meta:{pathName:'终端档案'},
  },{
    path: 'terFileEdit/:id',
    component: terFileEdit,
    meta:{pathName:'终端档案'},
  }]
},
//终端类型新增
{
  path: 'terminalType',
  children: [{
    path: 'terTypeAdd',
    component: terTypeAdd,
    meta:{pathName:'终端类型'},
  },{
    path: 'terTypeEdit/:id',
    component: terTypeEdit,
    meta:{pathName:'终端类型'},
  }]
},
//智能用气卡
{
  path: 'intelGasCard',
  children: [{
    path: 'gasCardFiles',
    component: gasCardFiles,
    meta:{pathName:'用气卡档案',keepAlive:true,hasMenu:true},
  }]
},
//智能用气卡档案新增  编辑
{
  path: 'gasCardFiles',
  children: [{
    path: 'cardAdd',
    component: cardAdd,
    meta:{pathName:'用气卡档案'},
  },{
    path: 'cardEdit/:id',
    component: cardEdit,
    meta:{pathName:'用气卡档案'},
  }]
},


//移动人员管理
{
  path: 'mobilePersonManage',
  children: [{
    path: 'personPost',
    component: personPost,
    meta:{pathName:'角色配置',keepAlive:true,hasMenu:true},
  },{
    path: 'mobilePerson',
    component: mobilePerson,
    meta:{pathName:'用户信息',keepAlive:true,hasMenu:true},
  }]
},
//移动人员新增  编辑
{
  path: 'mobilePerson',
  children: [{
    path: 'addPerson',
    component: addPerson,
    meta:{pathName:'用户信息'},
  },{
    path: 'editPerson/:id',
    component: editPerson,
    meta:{pathName:'用户信息'},
  },{
    path: 'roleConfig/:id/:staffName',
    component: roleConfig,
    meta:{pathName:'用户信息'},
  }]
},

//移动人员岗位新增   编辑
{
  path: 'personPost',
  children: [{
    path: 'addPost/:deptId',
    component: addPost,
    meta:{pathName:'角色配置'},
  },
    {path: 'editPost/:id',
    component: editPost,
    meta:{pathName:'角色配置'},
  },{
    path: 'moduleAssign/:id/:roleName',
    component: moduleAssign,
    meta:{pathName:'角色配置'},
  },{
    path: 'dataAssign/:id/:roleName/:positionDataScope',
    component: dataAssign,
    meta:{pathName:'角色配置'},
  }]
},

//巡查管理
{
  path: 'inspectManage',
  children: [{
    path: 'inspectType',
    component: inspectType,
    meta:{pathName:'巡查类型',keepAlive:true,hasMenu:true},
  },{
    path: 'inspectInfor',
    component: inspectInfor,
    meta:{pathName:'巡查信息',keepAlive:true,hasMenu:true},
  },{
    path: 'inspectionList',
    component: inspectionList,
    meta:{pathName:'区域自查',keepAlive:true,hasMenu:true},
  }]
},
//巡查类型新增  编辑
{
  path: 'inspectType',
  children: [{
    path: 'addInspect',
    component: addInspect,
    meta:{pathName:'巡查类型'},
  },{
    path: 'editInspect/:id',
    component: editInspect,
    meta:{pathName:'巡查类型'},
  }]
},

//巡查信息详情
{
  path: 'inspectInfor',
  children: [{
    path: 'seeInfo/:id',
    component: seeInfo,
    meta:{pathName:'巡查信息'},
  }]
},
//巡查单详情
{
  path: 'inspectionList',
  children: [{
    path: 'inspectionInfo/:id',
    component: inspectionInfo,
    meta:{pathName:'区域自查'},
  }]
},

//入户安检
{
  path: 'householdCheck',
  children: [{
    path: 'securityRecord',
    component: securityRecord,
    meta:{pathName:'安检记录',keepAlive:true,hasMenu:true},
  },{
    path: 'orderSecurityType',
    component: orderSecurityType,
    meta:{pathName:'订单安检类型',keepAlive:true,hasMenu:true},
  },{
    path: 'unCheckUser',
    component: unCheckUser,
    meta:{pathName:'未安检客户',keepAlive:true,hasMenu:true},
  },{
    path: 'unCheckAlarm',
    component: unCheckAlarm,
    meta:{pathName:'超期报警',keepAlive:true,hasMenu:true},
  },{
    path: 'workOrderList',
    component: workOrderList,
    meta:{pathName:'工单列表',keepAlive:true,hasMenu:true},
  },{
    path: 'securitycheck',
    component: securitycheck,
    meta:{pathName:'安检统计',keepAlive:true,hasMenu:true},
  }]
},
//安检项新增  编辑
{
  path: 'orderSecurityType',
  children: [{
    path: 'securityAdd',
    component: securityAdd,
    meta:{pathName:'订单安检类型'},
  },{
    path: 'securityEdit/:id',
    component: securityEdit,
    meta:{pathName:'订单安检类型'},
  },{
    path: 'securityInfo/:id',
    component: securityInfo,
    meta:{pathName:'订单安检类型'},
  }]
},

//安检记录详情
{
  path: 'securityRecord',
  children: [{
    path: 'checkInfo/:id/:type',
    component: checkInfo,
    meta:{pathName:'安检记录'},
  }]
},
//订单管理
{
  path: 'orderManage',
  children: [{
    path: 'merchandiseOrder',
    component: merchandiseOrder,
    meta:{pathName:'商品订单',keepAlive:true,hasMenu:true},
  },{
    path: 'helpList',
    component: helpList,
    meta:{pathName:'求助单',keepAlive:true,hasMenu:true},
  },{
    path: 'helpType',
    component: helpType,
    meta:{pathName:'求助类型',keepAlive:true,hasMenu:true},
  },{
    path: 'disExceptionInfo',
    component: disExceptionInfo,
    meta:{pathName:'配送异常信息',keepAlive:true,hasMenu:true},
  }]
},
//订单新增 详情
{
  path: 'merchandiseOrder',
  children: [{
    path: 'orderAdd',
    component: orderAdd,
    meta:{pathName:'商品订单'},
  },{
    path: 'orderInfo/:id/:type',
    component: orderInfo,
    meta:{pathName:'商品订单'},
  }]
},

//求助单详情
{
  path: 'helpList',
  children: [{
    path: 'helpInfo/:id',
    component: helpInfo,
    meta:{pathName:'求助单'},
  }]
},
//系统监控  系统日志
{
  path: 'systemMonitor',
  children: [{
    path: 'systemLog',
    component: systemLog,
    meta:{pathName:'系统日志',keepAlive:true,hasMenu:true},
  }]
},
//商品管理

{
  path: 'commodityManage',
  children: [{
    path: 'commodityInfo',
    component: commodityInfo,
    meta:{pathName:'商品信息',keepAlive:true,hasMenu:true},
  },{
    path: 'regionalQuotation',
    component: regionalQuotation,
    meta:{pathName:'区域报价',hasMenu:true},
  },{
    path: 'priceList',
    component: priceList,
    meta:{pathName:'商品价格表',keepAlive:true,hasMenu:true},
  }]
},
//商品信息新增
{
  path: 'commodityInfo',
  children: [{
    path: 'commodityAdd',
    component: commodityAdd,
    meta:{pathName:'商品信息'},
  },{
    path: 'commodityAllocate/:id',
    component: commodityAllocate,
    meta:{pathName:'商品信息'},
  },{
    path: 'commodityEdit/:id',
    component: commodityEdit,
    meta:{pathName:'商品信息'},
  }]
},

//业绩统计
{
  path: 'performanceStatistics',
  children: [{
    path: 'order',
    component: order,
    meta:{pathName:'订单统计',keepAlive:true,hasMenu:true},
  },{
    path: 'distribute',
    component: distribute,
    meta:{pathName:'配送统计',keepAlive:true,hasMenu:true},
  },{
    path: 'check',
    component: check,
    meta:{pathName:'安检统计',keepAlive:true,hasMenu:true},
  },{
    path: 'inspect',
    component: inspect,
    meta:{pathName:'巡查统计',keepAlive:true,hasMenu:true},
  },{
    path: 'recovery',
    component: recovery,
    meta:{pathName:'回收统计',keepAlive:true,hasMenu:true},
  }]
},
//充装管理
{
  path: 'fillingManage',
  children: [{
    path: 'fillRecord',
    component: fillRecord,
    meta:{pathName:'充装记录',keepAlive:true,hasMenu:true},
  },{
    path: 'fillError',
    component: fillError,
     meta:{pathName:'充装异常',keepAlive:true,hasMenu:true},
  },{
    path: 'preChargeInspection',
    component: preChargeInspection,
     meta:{pathName:'充前检查',keepAlive:true,hasMenu:true},
  },{
    path: 'inspectionAfterFilling',
    component: inspectionAfterFilling,
     meta:{pathName:'充后检查',keepAlive:true,hasMenu:true},
  },]
},
//账本管理
{
  path: 'accountManage',
  children: [{
    path: 'issueAccount',
    component: issueAccount,
    meta:{pathName:'发出账本',keepAlive:true,hasMenu:true},
  }]
},
//出入库管理
{
  path: 'inventoryManage',
  children: [{
    path: 'salesReport',
    component: salesReport,
    meta:{pathName:'销售报表',keepAlive:true,hasMenu:true},
  },{
    path: 'distributorInventory',
    component: distributorInventory,
    meta:{pathName:'配送员库存统计',keepAlive:true,hasMenu:true},
  }]
},
//标签管理tagsList
{
  path: 'tagsManage',
  children: [{
    path: 'tagsList',
    component: tagsList,
    meta:{pathName:'标签列表',keepAlive:true,hasMenu:true},
  }]
},
//标签新增编辑
{
  path: 'tagsList',
  children: [{
    path: 'tagsAdd',
    component: tagsAdd,
    meta:{pathName:'标签列表'},
  }]
},
//押金单管理
{
  path: 'depositNoteMessage',
  children: [{
    path: 'depositNoteInfo',
    component: depositNoteInfo,
    meta:{pathName:'押金单信息',keepAlive:true,hasMenu:true},
  },{
    path: 'rentBreakdown',
    component: rentBreakdown,
    meta:{pathName:'退押信息',keepAlive:true,hasMenu:true},
  }]
},
//押金单编辑
{
  path: 'depositNoteInfo',
  children: [{
    path: 'editNote/:id',
    component: editNote,
    meta:{pathName:'押金单信息'},
  }]
},
];



const routes = [{
    path: '/login',
    component: Login,
    meta:{pathName:'登录'},
  },
  {
    path: '/',
    redirect: "/home",
    component: Main,
    children: handleRoute(ContentRoute),
    meta:{pathName:'主页'},
  },
]

//console.log(routes);


export default new Router({
  routes
})
