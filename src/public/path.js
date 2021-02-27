   let newPath='https://source.payq-iot.com:8089/';
// let newPath='https://sys.payq-iot.com:8089/';
// let newPath='http://test.payq-iot.com:7002/';
   // let newPath='http://127.0.0.1:8088/';
//    let newPath='http://192.168.0.142:8088/';
const pathUrl = {
	'login': 'api/login',//登录接口
	'convert': 'api/token/convert',//登录后获取菜单及用户信息
	'cityInfo': 'api/cityInfo/queryRegion',//省市区位置搜索
	'menuList': 'api/menu/list',//获取系统设置——菜单管理——菜单列表
	'menuSelect': 'api/menu/select',//菜单选择接口
	'menuSave': 'api/menu/save',//菜单保存接口
	'menuInfo': 'api/menu/info',//菜单详情接口
	'menuUpdate': 'api/menu/update',//菜单修改接口
	'menuDelete': 'api/menu/delete',//菜单删除接口
	'deptList': 'api/dept/list',//获取组织列表
	'deptInfo': 'api/dept/info',//获取组织详情
	'deptSave': 'api/dept/save',//新增组织
	'deptUpdate': 'api/dept/update',//修改组织
	'deptDelete': 'api/dept/delete',//删除组织
	'roleList': 'api/role/list',//获取角色列表
	'roleInfo': 'api/role/info',//获取角色详情
	'roleDelete': 'api/role/delete',//角色删除
	'roleSave': 'api/role/save',//角色新增
	'roleUpdate': 'api/role/update',//角色修改
	'userList': 'api/user/list',//用户列表
	'userInfo': 'api/user/info',//用户详情
	'roleSelect': 'api/role/select',//用户新增角色字段

	'userSave': 'api/sysuser/save',//用户新增
	'userUpdate':'api/sysuser/update',//用户修改
	'userDelete':'api/sysuser/delete',//用户删除
	'userResponsibl':'api/user/getResponsible',//获取部门责任人数据
	'userStatistical':'api/user/statistical',//获取地图全部汽车数据
	'carInfo':'api/carinfo/getDetails',//获取地图汽车详情数据
	'getTrajectory':'api/carinfo/getTrajectory',//获取地图汽车轨迹数据
	'deptstaffSelect':'api/deptstaff/select',//配送员姓名搜索
	'bottleStatistical':'api/deptbottle/queryBottleStatistical',//获取地图全部钢瓶数据
	'userBottle':'api/user/userStatistical',//获取地图全部用户
	'carinfoGetDetails':'api/V2/carinfo/getDetails',//获取车辆信息详情
	'deptbottleQueryVehicleBottle':'api/deptbottle/queryVehicleBottle',//获取轻重瓶信息（0：空，1：重瓶）
	'orderQueryOrdersByCarId':'api/order/queryOrdersByCarId',//获取车辆订单信息（1着急要气，2已完成订单）
	'flowInfoList':'api/bottleflowinfo/list',//钢瓶流转查询数据
	'userDept':'api/user/dept',//地图右上方组织搜索
	'getBottleDetail':'api/deptbottle/getBottleDetail',//钢瓶详情
	'organizationList':'api/dept/list',//区域组织接口
	  'cardCode':'api/deptcard/list',//送气卡号查询接口
	  'bottleSize':'api/deptbottle/webGetSepcList',//规格查询接口
	  'subType':'api/gassubtype/getSubTypeList',//用气子类型接口
	  'gasType':'api/user/webQueryUserType',//用气类型接口
	  'staffList':'api/staff/queryStaffList',//企业员工列表
	  'userQueryAcType':'api/user/queryAcType',//查询结算类型
	  'userQueryGasDevice':'api/user/queryGasDevice',//查询燃气设备
	  'userWebOpeningUser':'api/user/webOpeningUser',//开户接口
	  'carinfoList':'api/carinfo/list',//配送车档案
	   'driverInfo':'api/staff/queryStaff',//司机列表搜索
	   'archivesList':'api/bottlebindarchives/list',//获取上下瓶统计接口
	   'getTerminal':'api/deptterminal/getTerminals',//获取智能终端
	   'carinfoSave':'api/carinfo/save',//配送车档案新增
	   'accessAdd':'api/accessctrl/save',//门禁档案新增
	    'dangerousAdd':'api/carinfo/save',//危化车档案增加
	    'accessDelete':'api/accessctrl/delete',//门禁删除
	    'accessInfo':'api/accessctrl/info',//门禁档案显示
	    'accessUpdate':'api/accessctrl/update',//门禁档案更新
	     'getCarinfo':'api/carinfo/info',//配送车档案查看详情
	     'carinfoUpdate':'api/carinfo/update',//配送车档案编辑
	     'carinfoDelete':'api/carinfo/delete',//配送车档案删除
	     'accessShow':'api/accessctrl/list',//门禁档案列表
	  	'ruleList':'api/securitycheckrule/list',//安检规则列表
	  	'ruleInfo':'api/securitycheckrule/info',//安检规则详情
	  	'ruleSave':'api/securitycheckrule/save',//安检规则保存
	  	'ruleUpdate':'api/securitycheckrule/update',//安检规则编辑
	  	'ruleDelete':'api/securitycheckrule/delete',//安检规则删除
	  	'userListType':'api/user/queryUsersByListType',//安检规则用户列表
	  	'bottleDetailList':'api/bottlebindarchives/detailList',//三轮车上下瓶记录下侧列表
	  	'deptStaff':'api/staff/queryCurrentDeptStaff',//开户人
	  	'xkfillinfo':'api/xkfillinfo/list',//充装记录列表
	  	'deptbottleList':'api/deptbottle/list',//钢瓶查询列表
	  	'deptbottleSave':'api/deptbottle/save',//钢瓶新增
	  	'deptbottleInfo':'api/deptbottle/info',//钢瓶详情
	  	'deptbottleUpdate':'api/deptbottle/update',//钢瓶编辑
	  	'deptbottleDelete':'api/deptbottle/delete',//钢瓶注销
	  	'auditinfoList':'api/auditinfo/list',//稽查信息
	  	'audittypeList':'api/audittype/list',//稽查类型
	  	'audittypeSave':'api/audittype/save',//稽查类型新增
	  	'audittypeInfo':'api/audittype/info',//稽查类型详情
	  	'audittypeUpdate':'api/audittype/update',//稽查类型修改
	  	'manageStaffs':'api/staff/manageStaffs',//管理人员接口
	  	'auditStaffs':'api/staff/auditStaffs',//稽查人员接口
	  	'auditinfoCheck':'api/auditinfo/check',//稽查信息审核
	  	'checkAuditInfo':'api/auditinfo/checkAuditInfo',//稽查信息整改
	  	'gasCardList':'api/deptcard/cardList',//用气卡档案列表
	  	'terminaltypeList':'api/deptterminaltype/list',//终端类型
	  	'terminalList':'api/deptterminal/list',//终端档案
	  	'positionList':'api/deptPosition/list',//获取移动人员岗位
	  	'getBindBottle':'api/terminal/getBindBottle',//获取移动人员责任钢瓶
	  	'securitycheckList':'api/securitycheck/list',//获取安检记录列表
	  	'moduleChoose':'api/staffAppRole/moduleChoose',//获取移动人员岗位模块内容
	  	'applicationrole':'api/deptstaffapplicationrole/saveOrUpdate',//模块修改
	  	'updateAppRole':'api/deptstaffposition/updateAppRole',//送气侠bang瓶侠状态切换
	  	'sysApplication':'api/sysapplication/query',//获取app应用
	  	'deptstaffpositionSave':'api/deptstaffposition/save',//移动人员岗位新增
	  	'deptstaffpositionInfo':'api/deptstaffposition/info',//移动人员岗位详情
	  	'deptstaffpositionUpdate':'api/deptstaffposition/update',//移动人员岗位编辑
	  	'deptstaffpositionDelete':'api/deptstaffposition/delete',//移动人员岗位删除
	  	'deptstaffList':'api/deptstaff/list',//移动人员列表
	  	'deptstaffSave':'api/deptstaff/save',//移动人员新增
	  	'deptstaffUpdate':'api/deptstaff/update',//移动人员编辑
	  	'deptstaffInfo':'api/deptstaff/info',//移动人员详情
	  	'deptstaffDelete':'api/deptstaff/delete',//移动人员删除
	  	'deptstaffpositionTree':'api/deptstaffposition/queryTree',//获取员工岗位选择列表
	  	'deptstaffpositionQuery':'api/deptstaffposition/query',//获取岗位名称
	  	'getCarNumber':'api/deptterminal/getCarNumber',//获取配送车车牌号
	  	'queryEscortStaff':'api/staff/queryEscortStaff',//押运员接口
	  	'userBatchUpdate':'api/user/batchUpdate',//用户管理批量修改
	  	'userDelete1':'api/user/delete',//用户彻底删除
	  	'queryCurrentDeptStaff':'api/staff/queryCurrentDeptStaff',//获取当前组织配送员
	  	'querySecurityTypeList':'api/ordersecuritytype/querySecurityTypeList',//安检规则类型
	  	'ordersecuritytypeSave':'api/ordersecuritytype/save',//安检项新增
	  	'ordersecuritytypeUpdate':'api/ordersecuritytype/update',//安检项编辑
	  	'ordersecuritytypeInfo':'api/ordersecuritytype/info',//安检项详情
	  	'ordersecuritytypeDelete':'api/ordersecuritytype/delete',//安检项删除
	  	'userGasUserlist':'api/user/gasUserlist',//客户信息列表
	  	'userCancellation':'api/user/cancellation',//客户注销
	  	'userGetUserInfo':'api/user/getUserInfo',//客户详情
	  	'userGetUserUpdate':'api/user/webUpdateUser',//客户修改
	  	'deptcardSave':'api/deptcard/save',//用气卡档案新增
	  	'deptcardInfo':'api/deptcard/info',//用气卡档案详情
	  	'deptcardUpdate':'api/deptcard/update',//用气卡档案编辑
	  	'deptcardDelete':'api/deptcard/delete',//用气卡档案删除
	  	'deptcardBatchUpdate':'api/deptcard/batchUpdate',//用气卡档案批量修改
	  	'orderList':'api/order/list',//商品订单列表
	  	'userGetUsers':'api/user/getUsers',//商品订单新增里用户
	  	'orderInfo':'api/order/info',//商品订单详情
	  	'finishOrder':'api/order/finishOrder',//商品订单完成
	  	'orderCancel':'api/order/cancel',//商品订单取消
	  	'userhelpList':'api/userhelp/helpList',//求助单列表
	  	'userhelpInfo':'api/userhelp/info',//求助单详情
	  	'orderSave':'api/order/save',//商品订单新增
	  	'deptterminalSave':'app/deptterminal/save',//终端档案新增
	  	'deptterminalInfo':'app/deptterminal/info',//终端档案详情
	  	'deptterminalUpdate':'app/deptterminal/update',//终端档案编辑
	  	'deptterminalDelete':'app/deptterminal/delete',//终端档案删除
	  	'deptterminaltypeSave':'app/deptterminaltype/save',//终端类型添加
	  	'deptterminaltypeDelete':'app/deptterminaltype/delete',//终端类型删除
	  	'deptterminaltypeInfo':'app/deptterminaltype/info',//终端类型详情
	  	'deptterminaltypeUpdate':'app/deptterminaltype/update',//终端类型编辑
	  	'checkTypeList':'api/securitycheck/checkTypeList',//安检单记录详情
	  	'userAllocation':'api/user/allocation',//客户分配配送员
	  	'securitycheckReview':'api/securitycheck/review',//审批安检记录
	  	'sysLogList':'api/log/list',//系统日志列表
	  	'querySecurityNameList':'api/ordersecuritytype/querySecurityNameList',//安检项目名称
	  	'orderStatData':'api/orderstat/orderStatData',//订单统计
	  	'bottleNumStat':'api/orderstat/bottleNumStat',//配送统计
	  	'usertypeList':'api/usertype/list',//用户类型列表
	  	'usertypeSave':'api/usertype/save',//用户类型新增
	  	'usertypeInfo':'api/usertype/info',//用户类型详情
	  	'usertypeUpdate':'api/usertype/update',//用户类型编辑
	  	'usertypeDelete':'api/usertype/delete',//用户类型删除



	  	'deptgoodsList':'api/deptgoods/list',//商品信息列表
	  	'deptgoodsSave':'api/deptgoods/save',//商品信息添加
	  	'deptgoodsskuSave':'api/deptgoodssku/save',//商品信息分配
	  	'deptgoodsInfo':'api/deptgoods/info',//商品信息详情
	  	'deptgoodsUpdate':'api/deptgoods/update',//商品信息编辑
	  	'deptgoodsDelete':'api/deptgoods/delete',//商品信息删除

	  	'securitycheckInfo':'api/securitycheck/info',//安检详情
	  	'goodsSkuList':'api/deptgoodssku/goodsSkuList',//商品已分配区域列表
	  	'usertypeQueryList':'api/usertype/queryList',//用户类型
	  	'deptgoodsskuUpdate':'api/deptgoodssku/update',//分配价格编辑
	  	'deptgoodsskuDelete':'api/deptgoodssku/delete',//分配价格删除


	  	'goodstypeList':'api/goodstype/list',//商品类型列表
	  	'goodstypeSave':'api/goodstype/save',//商品类型新增
	  	'goodstypeUpdate':'api/goodstype/update',//商品类型编辑
	  	'goodstypeDelete':'api/goodstype/delete',//商品类型删除
	  	'goodstypeInfo':'api/goodstype/info',//商品类型详情

	  	'goodsspecList':'api/goodsspec/list',//商品规格列表
	  	'goodsspecSave':'api/goodsspec/save',//商品规格新增
	  	'goodsspecUpdate':'api/goodsspec/update',//商品规格编辑
	  	'goodsspecDelete':'api/goodsspec/delete',//商品规格删除
	  	'goodsspecInfo':'api/goodsspec/info',//商品规格详情

	  	'goodsmodelList':'api/goodsmodel/list',//商品型号列表
	  	'goodsmodelSave':'api/goodsmodel/save',//商品型号新增
	  	'goodsmodelUpdate':'api/goodsmodel/update',//商品型号编辑
	  	'goodsmodelDelete':'api/goodsmodel/delete',//商品型号删除
	  	'goodsmodelInfo':'api/goodsmodel/info',//商品型号详情

	  	'orggoodspriceList':'api/orggoodsprice/list',//商品价格列表
	  	'orggoodspriceAdd':'api/orggoodsprice/add',//商品价格新增
	  	'orggoodspriceUpdate':'api/orggoodsprice/update',//商品价格编辑
	  	'orggoodspriceDelete':'api/orggoodsprice/delete',//商品价格删除
	  	'orggoodspriceInfo':'api/orggoodsprice/info',//商品价格详情

	  	'batchSaveOrUpdate':'api/orggoodsprice/batchSaveOrUpdate',//商品价格保存修改



	  	//安检规则(vip用户)
	  	'vipusercheckruleList':'api/vipusercheckrule/list',//(入参燃气用户的userId)vip用户安检列表
	  	'vipusercheckruleInfo':'api/vipusercheckrule/info',//详情{id}
	  	'vipusercheckruleSave':'api/vipusercheckrule/save',//保存
	  	'vipusercheckruleUpdate':'api/vipusercheckrule/update',//编辑
	  	'vipusercheckruleDelete':'api/vipusercheckrule/delete',//删除
	  	//安检项(vip用户)
	  	'vipuserchecktypeList':'api/vipuserchecktype/list',//安检项列表(入参userId)
	  	'vipuserchecktypeInfo':'api/vipuserchecktype/info',//安检项详情{id}
	  	'vipuserchecktypeSave':'api/vipuserchecktype/save',//安检项保存
	  	'vipuserchecktypeUpdate':'api/vipuserchecktype/update',//安检项编辑
	  	'vipuserchecktypeDelete':'api/vipuserchecktype/delete',//安检项删除


	  	'getVipUserList':'api/user/getVipUserList',//vip用户列表
	  	'updateUserVipInfo':'api/user/updateUserVipInfo',//vip用户新增/删除

	  	'staffLocation':'api/staff/location',//员工位置
	  	'getStaffTrajectory':'api/staff/getTrajectory',//获取员工轨迹
	  	'errorinfoList':'api/errorinfo/list',//异常统计
	  	'staffStat':'api/orderstat/staffStat',//配送员配送统计(staffId,type[day，month])
	  	'queryOrgInfo':'api/dept/queryOrgInfo',//场站
	  	'webQueryUserInfo':'api/user/webQueryUserInfo',//客户详情上下页
	  	'webQueryCheckInfo':'api/securitycheck/webQueryCheckInfo',//安检详情上下页(checkId=&queryType=)

	  	'audittypeDelete':'api/audittype/delete',//稽查类型删除
	  	'checkUserInfo':'api/user/checkUserInfo',//用户完善信息审核
	  	'orderStatDetail':'api/order/statDetail',//订单统计详情
	  	'statAuditInfo':'api/auditinfo/statAuditInfo',//稽查统计

	  	'auditinfoInfo':'api/auditinfo/info',//稽查信息详情
		'queryContractTemplate':'api/dept/queryContractTemplate',//合同模板类型

		'auditPreNext':'api/auditinfo/info',//稽查信息上下条api/auditinfo/info/{type}/{id}
	  	'statisticOrder':'api/statistic/order',//订单详情
	  	'statisticBottle':'api/statistic/bottle',//配送详情
	  	'statisticAudit':'api/statistic/audit',//稽查详情
	  	'statisticSecurity':'api/statistic/security',//安检详情


	  	'helptypeSave':'api/helptype/save',//求助类型新增
	  	'helptypeList':'api/helptype/list',//求助类型列表
	  	'helptypeUpdate':'api/helptype/update',//求助类型编辑
	  	'helptypeDelete':'api/helptype/delete',//求助类型删除
		'helptypeInfo':'api/helptype/info',//求助类型详情

		'orggoodspriceGoodsPriceList':'api/orggoodsprice/goodsPriceList',//商品价格表
		'platformList':'api/platform/bottle/list',//新钢瓶档案列表
		'platformSave':'api/platform/bottle/save',//新钢瓶档案新增
		'platformUpdate':'api/platform/bottle/update',//新钢瓶档案编辑
		'platformInfo':'api/platform/bottle/info',//新钢瓶档案详情
		'platformDelete':'api/platform/bottle/delete',//新钢瓶档案注销

		'bottleflowinfoList':'api/bottleflowinfo/list',//流转列表
		'bottleGetBottleDetail':'api/platform/bottle/getBottleDetail',//流转详情
		'bottleflowinfoListAll':'api/bottleflowinfo/listAll',//流转详情搜索
		'ExpiringSoonBottleList':'api/platform/ExpiringSoonBottle/list',//到期提醒列表

		'helptypeQueryClassify':'api/helptype/queryClassify',//求助类型名称
		'auditinfoUpdate':'api/auditinfo/update',//稽查信息修改

		'depttagList':'api/depttag/list',//钢瓶标签
		'deptStationList':'api/dept/test_station/list',//检测站列表
		'bottlexkList':'api/dept/bottlexk/list',//充装异常

		'platformBottleCheck':'api/platform/bottle/check',//送检接口
		'platformbottlechecklog':'api/platformbottlechecklog/list',//送检列表

    'platformbottlechecklist':'api/platform/bottle/check/list2',//送检列表(新)


		'platformBottleDel':'api/platform/bottle/del',//钢瓶删除
		'deptstaffListAll':'api/deptstaff/listAll',//获取自身及下级组织员工

		'errorinfoList':'api/errorinfo/list',//配送异常信息
		'deptbottlebindlogList':'api/deptbottlebindlog/list',//绑瓶记录

		'deliveryRecyclingBottleNum':'api/statistic/deliveryRecyclingBottleNum',//配送回收瓶统计
		'noCheckList':'api/user/noCheck/list',//未安检客户

		'bottlemanufacturerSelect':'api/bottlemanufacturer/select',//钢瓶厂家
		'userAlarmList':'api/user/alarm/list',//超期报警

		'handoverarchivesList':'api/handoverarchives/list',//危化车账本
    'unBindBottleTag':'api/platform/bottle/unBindBottleTag',//标签解绑

     'messageinfoSave':'api/messageinfo/save',//消息新增(系统)
     'messageinfoList':'api/messageinfo/list',//消息列表(个人)
     'messageinfoMsgDel':'api/messageinfo/msgDel',//消息删除(系统)messageIds:[1,2,3]
     'messageinfoUpdate':'api/messageinfo/update',//消息修改(系统)
     'messageinfoInfo':'api/messageinfo/info',//消息详情(系统)
     'messageinfoDelete':'api/messageinfo/delete',//消息删除(个人)
     'messageinfoMsgRead':'api/messageinfo/msgRead',//消息已读(个人)
     'messageinfoQueryList':'api/messageinfo/queryList',//消息列表(系统)

     'deptterminalSave':'api/deptterminal/save',//终端档案新增
     'deptterminalInfo':'api/deptterminal/info',//终端档案详情
     'deptterminalUpdate':'api/deptterminal/update',//终端档案编辑
      'deptterminalDelete':'api/deptterminal/delete',//终端档案删除
     'terminalReport':'api/terminal/report',//终端档案上报
     'terminalUseInfo':'api/terminal/useInfo',//终端档案使用情况
     'deptterminalBatchUpdate':'api/deptterminal/batchUpdate',//终端档案批量修改


     'deptterminaltypeInfo':'api/deptterminaltype/info',//终端类型详情
     'deptterminaltypeSave':'api/deptterminaltype/save',//终端类型新增
     'deptterminaltypeUpdate':'api/deptterminaltype/update',//终端类型编辑
     'deptterminaltypeDelete':'api/deptterminaltype/delete',//终端类型删除

	 'sysconfigList':'api/sysconfig/list',//系统配置列表
	 'sysconfigInfo':'api/sysconfig/info',//系统配置详情
	 'sysconfigSave':'api/sysconfig/save',//系统配置新增
	 'sysconfigUpdate':'api/sysconfig/update',//系统配置修改
	 'sysconfigDelete':'api/sysconfig/delete',//系统配置删除

    'deviceLogList':'api/platform/bottle/deviceLog/list',//设备上报分析

    'ordertaskList':'api/ordertask/list',//智能预测列表
    'ordertaskSave':'api/ordertask/save',//智能预测新增
    'ordertaskUpdate':'api/ordertask/update',//智能预测修改
    'ordertaskInfo':'api/ordertask/info',//智能预测详情

     'orderrulesList':'api/orderrules/list',//订单分配规则列表
     'orderrulesInfo':'api/orderrules/info',//订单分配规则详情
     'orderrulesUpdate':'api/orderrules/update',//订单分配规则修改

    'bottlemanufacturerList':'api/bottlemanufacturer/list',//钢瓶厂家列表
    'bottlemanufacturerSave':'api/bottlemanufacturer/save',//钢瓶厂家新增
    'bottlemanufacturerUpdate':'api/bottlemanufacturer/update',//钢瓶厂家新增
    'bottlemanufacturerInfo':'api/bottlemanufacturer/info',//钢瓶厂家详情
    'userQueryOccUser':'api/user/queryOccUser',//占用瓶列表
     'flowLackBottles':'api/bottleflowinfo/flowLackBottles',//
     'userStatActiveUsers':'api/user/statActiveUsers',//活跃用户统计
     'bottleStatActiveBottle':'api/platform/bottle/statActiveBottle',//活跃钢瓶统计
     // 'getResponsible':'api/user/getResponsible',//钢瓶责任人在库状态
     'getLiabilityUsers':'api/user/getLiabilityUsers',//钢瓶责任人在用状态
    'queryOrderListByUserId':'api/order/queryOrderListByUserId',//购气次数
      'getTrajectories':'api/carinfo/getTrajectories',//多车轨迹
      'userQueryDept':'api/user/queryDept',//地图用户组织
      'acceptancelogList':'api/platformBottle/acceptancelog/list',//检验清点列表


      'bottleBatchUpdate':newPath+'file/bottle/batchUpdate',//钢瓶导入更新

      'bottleBatchImport':newPath+'file/bottle/batchImport',//钢瓶导入
    'bottleGetBottleDetail2':'api/platform/bottle/getBottleDetail2',//流转详情
		 'orderDetailExportList':'file/orderDetail/exportList',//订单导出
		 'checkBottleBatchImport':newPath+'file/checkBottle/batchImport',//送检列表导入



      'acceptancelogExportList':newPath+'file/acceptanceLog/exportList',//检验清点列表导出
		 'fileUpload': newPath+'file/upload',//上传头像


    'bindBottleLogExportList':newPath+'file/bindBottleLog/exportList',//绑瓶记录导出
    //呼叫中心
        'userFuzzyQueryUser':'api/user/fuzzyQueryUser',
        'orderWebCreateOrder':'api/order/webCreateOrder',
        'getGoodsByUserId':'api/deptgoods/getGoodsByUserId',//用户允许商品气-非气

        'userSaveUserAddMax':'api/user/saveUserAddMax',//临时用户
        'securitycheckWebReallocate':'api/securitycheck/webReallocate',  //安检审核不通过重新分配
        'securityWorkOrderList':'api/securitycheck/securityWorkOrderList',  //工单列表

    //检测站
        'teststationList':'api/dept/teststation/list',  //检测站
        'bottleCheckSave':'api/platform/bottle/check/webSave',  //送检列表新增
        'fileBottleBatchUpdate':newPath+'file/bottle/bottleBatchUpdateCheckInfo',//检验列表导入
    //充前检查、充后检查
        'prefillcheckList':'api/prefillcheck/list',  //充前检查
        'postfillcheckList':'api/postfillcheck/list',  //充后检查
        'checkQueryCheckBottleList':'api/platform/bottle/check/queryCheckBottleList',  //检测列表
        'queryDeptsByCheckDept':'api/dept/queryDeptsByCheckDept',  //检测列表气站搜索
        'deptQueryGasDept':'api/dept/queryGasDept',  //检测列表气站搜索
    //业务规则设置
        'deptrulesSave':'api/deptrules/save',  //业务规则设置保存
        'deptrulesList':'api/deptrules/list',  //业务规则设置列表
        'deptrulesInfo':'api/deptrules/info',  //业务规则设置详情
        'deptrulesUpdate':'api/deptrules/update',  //业务规则设置修改
    //业务规则配置
        'deptbusinessconfigList':'api/deptbusinessconfig/list',  //业务规则配置列表
        'deptbusinessconfigSave':'api/deptbusinessconfig/save',  //业务规则配置新增
        'deptbusinessconfigUpdate':'api/deptbusinessconfig/update',  //业务规则配置修改
       'deptbusinessconfigDelete':'api/deptbusinessconfig/delete',  //业务规则配置删除
		//数据权限
        	'parentDeptPositionList':'api/parent/deptPosition/list',//上级组织拥有角色
        	'deptPositionSave':'api/deptPosition/save',//移动角色新增
        	'deptPositionDelete':'api/deptPosition/delete',//移动角色新增
        	'deptPositionUpdate':'api/deptPosition/update',//移动角色修改
        	'deptPositionInfo':'api/deptPosition/info',//移动角色详情
    	    'deptTree':'api/dept/tree',//组织树形表
    		'menuTree':'api/menu/tree',//菜单树形表
    		'roleMenuTree':'api/role/menu/tree',//功能权限菜单树形表
    		'sysapplicationmoduleTree':'api/sysapplicationmodule/tree',//app功能权限菜单树形表
    		'sysapplicationmoduleSave':'api/sysapplicationmodule/save',//app功能权限菜单树新增
    		'sysapplicationmoduleInfo':'api/sysapplicationmodule/info',//app功能权限菜单树详情
    		'sysapplicationmoduleUpdate':'api/sysapplicationmodule/update',//app功能权限菜单树修改
    		'sysapplicationmoduleDelete':'api/sysapplicationmodule/delete',//app功能权限菜单树删除
    		'deptPositionTree':'api/deptPosition/tree',//功能权限树positionId,type:0,1,2
    		'changePositionMenuList':'api/deptPosition/changePositionMenuList',//功能权限树保存
    		'staffMenus':'api/staff/menus',//个人权限选择
    		'staffAssignRoles':'api/staff/assignRoles',//个人权限确定
    		'deptPositionDataTree':'api/deptPosition/dataTree',//数据权限树
    		'deptPositionDeptStaffList':'api/deptPosition/deptStaff/list',//数据权限员工数api/deptPosition/changePositionDeptList
    		'changePositionDeptList':'api/deptPosition/changePositionDeptList',//数据权限员工保存
    		'deptDataPermission':'api/staff/deptDataPermission',//用户分配数据权限
    		'changePositionDataPermission':'api/deptPosition/changePositionDataPermission',
    		'subDeptPositionTree':'api/deptPosition/subDeptPositionTree',
    		'dataPermissionSave':'api/dept/dataPermission/save',//自定义保存
    //组织
    		'staffGetResponsible':'api/staff/getResponsible',//组织责任人
			'deptPositionQueryTree':'api/deptPosition/queryTree',//获取员工岗位选择列表
	 //检验列表纠错
        'batchCorrection':'api/platform/bottle/check/batchCorrection',  //业务规则配置删除
    //验收列表批量修改
        'acceptancelogBatchUpdate':'api/platformBottle/acceptancelog/batchUpdate',  //验收列表批量修改
        'queryBindLogByBottleId':'api/platform/bottle/queryBindLogByBottleId',  //钢瓶标签绑定历史
        'apiDeptPositionQuery':'api/deptPosition/query',  //被稽查对象
        'getBottleSpecList':'api/platform/bottle/getBottleSpecList',  //钢瓶规格
        'getBottleMediumList':'api/deptmedium/getBottleMediumList',  //充装介质
        'goodsissuearchivesList':'api/goodsissuearchives/list',  //发出账本
        'updateStatus':'api/goodsissuearchives/updateStatus',  //接收取消
        'staffQueryByAuth':'api/staff/queryByAuth',  //获取多组织员工
        'webOrderTransfer':'api/order/webOrderTransfer',  //订单转派
        'accountingStatistics':'api/order/accountingStatistics',  //销售报表
        'deliveryStaff':'api/staff/deliveryStaff',  //获取本组织移动人员
        'queryBottleCheckList':'api/platform/bottle/check/queryBottleCheckList',//检验列表
        'webResetPwd':'api/staff/webResetPwd',//修改密码
        'securityOrderStat':'api/securitycheck/securityOrderStat',//安检统计
        'depTtestStationList':'api/dept/station/list',//检测站列表
        //标签新增
        'batchAddTag':'api/depttag/batchAddTag',//标签新增
        'depttagList':'api/depttag/list',//标签列表
        'depttagBatchUpdate':'api/depttag/batchUpdate',//标签列表批量修改
        //押金单管理
        'bottlePledgeReturnList':'api/dept/bottlePledgeReturn/list',//押金单列表
        'bottlePledgeReturnInfo':'api/dept/bottlePledgeReturn/info',//押金单详情
        'bottlePledgeReturnUpdate':'api/dept/bottlePledgeReturn/update',//押金单编辑
        'bottlePledgeReturnAudit':'api/dept/bottlePledgeReturn/audit',//审核
        'bottlePledgeReturnInfoDetail':'api/dept/bottlePledgeReturn/infoDetail',//押金单详情
        'bottlePledgeReturnAudit':'api/dept/bottlePledgeReturn/audit',//审核
        'userRecovery':'api/user/recovery',// 用户注销
        'queryNotCheckUsersByStatId':'api/securitycheck/queryNotCheckUsersByStatId',// 安检统计用户详情
        'orgPriceDelete':'api/orggoodsprice/orgPriceDelete',// 删除商品价格
        'securityCheckStatExport':newPath+'file/securityCheckStat/export',//安检统计导出
        'deptuserinspectionList':'api/deptuserinspection/list',// 巡查单列表
        'deptuserinspectionInfo':'api/deptuserinspection/info',// 巡查单详情
        'getLastOrNextInfo':'api/deptuserinspection/getLastOrNextInfo',// 巡查单详情上下条
        'queryBottlesByStaffId':'api/platform/bottle/queryBottlesByStaffId',// 首页员工责任瓶详情
        'activeUserExport':newPath+'file/activeUser/export',//活跃用户统计导出
        'securitycheckGetInfoByUserId':'api/securitycheck/getInfoByUserId',//安检统计未安检客户通过用户id跳转到安检详情
        'securitychecktypeclassifyList':'api/securitychecktypeclassify/list',// 安检项目名称列表
        'securitychecktypeclassifySave':'api/securitychecktypeclassify/save',// 安检项目名称新增
        'securitychecktypeclassifyDelete':'api/securitychecktypeclassify/delete',// 安检项目名称删除
        'securitychecktypeclassifyUpdate':'api/securitychecktypeclassify/update',// 安检项目名称更新
}
export const pathUrls = pathUrl;
