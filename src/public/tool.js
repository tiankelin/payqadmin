import _http from '@/public/http';
import {
  pathUrls
} from '@/public/path';
export default {
  //获取组织列表
  getOrganizeList(id) {
    return _http.http1('post', pathUrls.organizationList, {
      deptId: id
    }, 'form')
  },
  //组织递归数据
  getLabel(menus) {

    return menus.map((menu) => {
      if (menu.children&&menu.children.length > 0) {
        this.getLabel(menu.children);
      }
      if (menu.children&&menu.children.length == 0) {
        delete menu.children;
      }
      menu.value = menu.deptId;
      menu.label = menu.name;
      menu.title = menu.name;
	  menu.id = menu.deptId;
      return menu;
    })
  },
  //获取人员列表
  getQueryStaffList(id) {
    return _http.http1('post', pathUrls.driverInfo, {
      deptId: id,
    }, "form")
  },
  //获取员工列表
  getStaffList(id) {
    return _http.http1('post', pathUrls.deptstaffListAll, {
      deptId: id,
    }, "form")
  },
  //获取员工列表1
  getStaffList1(id) {
    return _http.http1('post', pathUrls.staffList, {
      deptId: id,
    }, "form")
  },
  //身份证验证
  checkIDCard(idcode) {
    // 加权因子
    var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    var code = idcode + "";
    var last = idcode[17]; //最后一位

    var seventeen = code.substring(0, 17);

    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    var arr = seventeen.split("");
    var len = arr.length;
    var num = 0;
    for (var i = 0; i < len; i++) {
      num = num + arr[i] * weight_factor[i];
    }

    // 获取余数
    var resisue = num % 11;
    var last_no = check_code[resisue];

    // 格式的正则
    /*
	    第一位不可能是0
	    第二位到第六位可以是0-9
	    第七位到第十位是年份，所以七八位为19或者20
	    十一位和十二位是月份，这两位是01-12之间的数值
	    十三位和十四位是日期，是从01-31之间的数值
	    十五，十六，十七都是数字0-9
	    十八位可能是数字0-9，也可能是X
    */
    var idcard_patter =
      /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
    // 判断格式是否正确
    var format = idcard_patter.test(idcode);
    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return last === last_no && format ? true : false;
  },
  // 判断是否为手机号
  isPoneAvailable(pone) {
    //				var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    var myreg = /^((0\d{2,3}-?\d{7,8})|(1[123456789]\d{9}))$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
  },
   // 判断是否为手机号
  		isPoneAvailable1(pone) {
  				var myreg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
  				if(!myreg.test(pone)) {
  					return false;
  				} else {
  					return true;
  				}
  			},
  //格式化日期
  dateShowNormal(date) {
    let d = new Date(date);
    let m = d.getMonth() + 1;
    let s = d.getDate();
    if (Number(m) < 10) {
      m = '0' + m
    }
    if (Number(s) < 10) {
      s = '0' + s
    }
    return d.getFullYear() + '-' + m + '-' + s;
  },

  getHandledValue(num) {
    return num < 10 ? '0' + num : num
  },
  conformatDat(time = '', type,noDay) {

    let d;
    if (isNaN(Date.parse(time))) {
      d = new Date(Date.parse(time.replace(/-/g, '/').replace(/T/g, ' ')));
    } else {
      d = new Date(Date.parse(time));
    }
    let year = d.getFullYear()
    let month = this.getHandledValue(d.getMonth() + 1)
    let date = this.getHandledValue(d.getDate())
    let hours = this.getHandledValue(d.getHours())
    let minutes = this.getHandledValue(d.getMinutes())
    let second = this.getHandledValue(d.getSeconds())
    let resStr = ''
    if (type) {
      resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
    } else {
      resStr = year + '-' + month + '-' + date
    }
    if(noDay==1){
      resStr = year + '-' + month
    }
    return resStr
  },
  //获取用户类型
  getUserTypeList1(deptId) {
    return _http.http1('post', pathUrls.usertypeList, {
      page: 1,
      limit: 10000,
      deptId: deptId
    }, 'form')
  },
  getUserTypeList(deptId) {
    return _http.http1('post', pathUrls.usertypeQueryList, {
      page: 1,
      limit: 10000,
      deptId: deptId
    }, 'form')
  },
  //获取商品信息列表
  getGoodsList() {
    return _http.http1('post', pathUrls.deptgoodsList, {
      //			'isGas':1,
    }, 'form')
  },


  //获取当天年月日时分秒
  getStartEndTime(type) {
    const now = new Date(); //当前日期
    const nowDay = now.getDate(); //当前日
    const nowMonth = now.getMonth(); //当前月
    let nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0;
    let nowDate = new Date(nowYear, nowMonth, nowDay);
    let starts = '';
    let ends = '';
    if (type) {
      starts = ' 00:00:00';
      ends = ' 23:59:59';
    }
    return [this.conformatDat(nowDate) + starts, this.conformatDat(nowDate) + ends];
  },
  //获取本月日期
  getNowMonth() {
    const now = new Date(); //当前日期
    const nowDay = now.getDate(); //当前日
    const nowMonth = now.getMonth(); //当前月
    let nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    let monthStartDate = new Date(nowYear, nowMonth, 1);

    let monthEndDate = new Date(nowYear, nowMonth, nowDay);

    return [this.conformatDat(monthStartDate), this.conformatDat(monthEndDate)];
  },
  //获取某月最后一天
  getLastDay(d, num) {
    let current = new Date(d);
    let currentMonth = current.getMonth();
    let nextMonth = ++currentMonth;
    let nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1);
    let minusDate = 1000 * 60 * 60 * 24;
    let newNum;
    if (num) {
      newNum = num;
    } else {
      newNum = 0;
    }
    let lastDay = new Date(nextMonthDayOne.getTime() - minusDate);
    let lastDayYear = lastDay.getFullYear() + newNum;
    let lastDayMonth = lastDay.getMonth() + 1;
    let lastDayDate = lastDay.getDate();
    if (lastDayMonth < 10) {
      lastDayMonth = '0' + lastDayMonth;
    }
    let newDays = lastDayYear + "-" + lastDayMonth + "-" + lastDayDate;
    return newDays
  },
  // 判断是字母
  judgeZm(v) {
    var myreg = /^[a-zA-Z]+$/;
    if (!myreg.test(v)) {
      return false;
    } else {
      return true;
    }
  },
  //判断字母+数字
  judgeNumZm(v) {
    var myreg = /^[a-zA-Z0-9]+$/;
    if (!myreg.test(v)) {
      return false;
    } else {
      return true;
    }
  },
  // 判断是数字字母下划线
  judgeNum(v) {
    var myreg = /^[-a-zA-Z0-9]+$/;
    if (!myreg.test(v)) {
      return false;
    } else {
      return true;
    }
  },
  //判断中文数字字母下划线短线
  judgeMethod(v) {
    var reg = /^[-a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    if (!reg.test(v)) {
      return false;
    } else {
      return true;
    }
  },
  //判断是否输入表情包
  isEmojiCharacter(substring) {
    for (var i = 0; i < substring.length; i++) {
      var hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2B05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
          hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
          hs == 0x2b50) {
          return true;
        }
      }
    }
  },
  //获取省市区
  getAreaList(cCode) {
    return _http.http1('post', pathUrls.cityInfo, {
      'parentCode': cCode
    }, 'form')
  },
  //开户人
  getStaffName(c) {
    return _http.http1('post', pathUrls.deptStaff, {
      'deptId': c
    }, 'form')
  },
  //获取权限组织列表
  	getDeptList(id) {
  		return _http.http3('get', pathUrls.deptTree, {
  			deptId: id
  		})
  	},
  	//获取app菜单列表
  	getAppMenuTree(moduleId) {
  		return _http.http3('get', pathUrls.sysapplicationmoduleTree, {
  			moduleId:moduleId,
  			moduleType:moduleId
  		})
  	},
  	getMenus(menus) {

  				return menus.map((menu) => {
  						menu.children=menu.modules;
  					if(menu.children && menu.children.length > 0) {
  						this.getMenus(menu.children);
  					}
  					if(menu.children.length == 0) {
  					delete menu.children;
  					}
  					if(menu.moduleCategory == 1) {
  						menu.type1 = '功能模块'
  					} else if(menu.moduleCategory == 2) {
  						menu.type1 = '页面'
  					} else {
  						menu.type1 = '按钮'
  					}

  					menu.id = menu.moduleId;
  					menu.isHide = menu.showHide == 1 ? '显示' : '隐藏'
  					menu.value = menu.moduleId;
  					menu.label = menu.moduleName
  					return menu;
  				})
  			},
  	//组织权限递归(type=1一级组织展开,strict=1回显包含非全选状态,delChild=1删除空的children,sel默认选中)
  	getConDept(depts,type,strict,delChild,sel){
  		let userData=JSON.parse(sessionStorage.getItem('userData'));
  		return depts.map((dept) => {
					if(dept.children.length > 0) {
						this.getConDept(dept.children,type,strict,delChild,sel);
					}else{
						if(delChild==1){
							delete dept.children;
						}

					}
					if(dept.deptId ==userData.staffDeptId&&type==1) {
						dept.expand = true;

					}
					if(dept.deptId ==sel){
						dept.selected = true;
					}
					if(type==2){
						dept.expand = true;
					}
					if(dept.check&& !dept.children.length&&strict==1) {
					    dept.checked = true
					}
					//dept.checked=dept.check;
					dept.label = dept.name;
					dept.title = dept.name;
					dept.id = dept.deptId;
					dept.value = dept.deptId;
					return dept;
				})
  	},
  	//获取钢瓶规格
  getBottleSpecList() {
    return _http.http1('post', pathUrls.getBottleSpecList, {
    }, 'form')
  },
  //充装介质
  getBottleMediumList() {
    return _http.http1('post', pathUrls.getBottleMediumList, {
    }, 'form')
  },
  //获取多组织员工
  getStaffQueryByAuth(id) {
    return _http.http2('post', pathUrls.staffQueryByAuth,
      id
    )
  },
  //获取本组织移动人员
  getDeliveryStaff(c) {
    return _http.http1('post', pathUrls.deliveryStaff, {
      'deptId': c
    }, 'form')
  },
  //获取前几天、当天日期
  getDayDate(v,n){
    let val=24*60*60*1000*v;
    let time=(new Date).getTime()-val;
    let d=new Date(time);
    let year = this.getHandledValue(d.getFullYear());
    let month = this.getHandledValue(d.getMonth()+1);
    let date = this.getHandledValue(d.getDate());
    let hours = this.getHandledValue(d.getHours());
    let minutes = this.getHandledValue(d.getMinutes());
    let second = this.getHandledValue(d.getSeconds());
    let resStr = '';
    if (n) {
      resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
    } else {
      resStr = year + '-' + month + '-' + date
    }
    return resStr
  },
  //获取上月份
  getYearMonth(){
    const now = new Date(); //当前日期
    let nowMonth = now.getMonth(); //当前月
    let nowYear = now.getYear(); //当前年
        nowYear=nowMonth==0?(nowYear-1):nowYear;
    nowMonth = ((nowMonth==0)?(12):(nowMonth));
    nowYear += (nowYear < 2000) ? 1900 : 0; //
   return nowYear + '-' + nowMonth
  },
 //获取商品信息型号细分列表
  getGoodsModelList() {
    return _http.http1('post', pathUrls.goodsmodelList, {
    }, 'form')
  },
}
