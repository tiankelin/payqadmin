<template>
  <div class="personnelMain">
    <div class="mainContenter" :class="[expand?'mainContenter':'changeMainContainer']">
      <Spin fix v-if='loading' size="large"></Spin>
      <div id="personnelContainer">
      </div>
      <div class='drawBack' @click='changeDrawBack'><img src="@/assets/images/right.png" alt="" v-if='expand' /><img
          src="@/assets/images/left.png" alt="" v-else />
	 </div>
	 <div class="countWrapper"><span>员工总数：</span>{{staffCount}}</div>
    </div>
    <div class="searchPerson" :class="[expand?'searchPerson':'expandPerson']">

      <div>
        <div class="TreeDept">
          <Tree :data="options" ref="userDeptTree" :render="renderContent" @on-select-change='handleSelect'
            @on-toggle-expand='toggleExpand'>
          </Tree>
        </div>

        <div class="someTimes" style="background: #fff;">
          <Input type="text" style="width: 80px;" @on-blur='getSearch' v-model='secondTime' /><span>分钟未获取定位判定为离线</span></div>
        <div class="someTimes" style="color: #88900c;background: #fff;">
          <Input type="text" style="width: 80px;" @on-blur='getSearch' v-model='dayNum' /><span>天登录过判定为近日上线</span></div>
        <!--<Cascader :data="options" clearable v-model="organize" change-on-select @on-change='changeCascader'
          :render-format="format" style="width:250px;margin-bottom:5px;"></Cascader>-->

        <Input class='nameSearch' placeholder="员工姓名搜索" icon="ios-search" v-model="keyWords" @on-click='getSearch'
          @keyup.enter.native="getSearch" />
        <CheckboxGroup v-model="onlones" style='display: inline-block;margin-left: 5px;margin-bottom: 5px;' @on-change='checkChange'>        
          <Checkbox :label="1" style="color:#15c709;">在线({{onLineNum}})</Checkbox>
          <Checkbox :label="2" style="color:#88900c;">近日上线({{recentlyNum}})</Checkbox>
          <Checkbox :label="0" style="color: #f00;">离线({{offLineNum}})</Checkbox>
        </CheckboxGroup>
      </div>

      <div class="personnelContent" :style="{height:newHight}">

        <div style="width: 878px;height: 100%;">

          <div class="titleWrapper">
            <div style="width: 40px;">头像</div>
            <div style="width: 80px;">员工姓名</div>
            <div style="width:80px;">状态</div>
            <div style="width:58px;">责任钢瓶</div>
            <div style="width:43px;">重瓶数</div>
            <div style="width:43px;">空瓶数</div>
            <div style="width: 100px;">电话</div>
            <div style="width: 160px;">角色名称</div>
            <div style="width: 130px;">最后定位时间</div>
          </div>
          <div class="contentList" ref='searchContentList'>
            <Spin fix v-if='loading' size="large"></Spin>
            <div v-for='(item,index) in staffLabel' :key='index' class='itemList' :class="{checkList:item.staffId==clickId,onOutLineList:item.staffOnDuty==2,               onLineList:item.staffOnDuty==1,offLineList:!item.staffOnDuty,}"
              @click='personnelItemClick(item.staffId)'>
              <div style="width:40px;height: 24px;" class="itemsSel"><img v-if='item.staffFace' :src="item.staffFace"
                  alt="" style="height:24px;width:24px;display: inline-block;border-radius: 50%;" /></div>
              <div style="width: 80px;" class="itemsSel" :title='item.staffName'>{{item.staffName}}</div>
              <div class="pngWrapper " style="width:80px;">

                <img src="@/assets/images/persons.png" alt="" v-if='item.staffOnDuty==1' />
                <img src="@/assets/images/person03.png" alt="" v-else-if='item.staffOnDuty==2' />
                <img src="@/assets/images/personsr.png" alt="" v-else />

                <span v-if='item.staffOnDuty==1' style="margin-left: 6px;">在线</span>
                <span v-else-if='item.staffOnDuty==2'>近日上线</span>
                <span v-else style="margin-left: 6px;">离线</span>

              </div>
              <div style="width: 58px;color:#0d37d2;" class="itemsSel" :title='item.personLiableBottleNum' @click.stop='getPersonLiableBottle(item,null)'>
                {{item.personLiableBottleNum}}
              </div>
              <div style="width: 43px;color: #089e36;" class="itemsSel" :title='item.personLiableFullBottleNum'
                @click.stop='getPersonLiableBottle(item,1)'>
                {{item.personLiableFullBottleNum}}
              </div>
              <div style="width: 43px;color: #f37f0b;" class="itemsSel" :title='item.personLiableEmptyBottleNum'
                @click.stop='getPersonLiableBottle(item,0)'>
                {{item.personLiableEmptyBottleNum}}
              </div>
              <div style="width: 100px;" class="itemsSel" :title='item.staffAccount'>{{item.staffAccount}}</div>
              <div style="width: 160px;" class="itemsSel" :title='item.staffIdentityName'>{{item.staffIdentityName}}</div>
              <div style="width: 130px;" class="itemsSel" :title='item.staffCreateTime'>{{item.lastOnLineTime}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="backMap" @click="handleBackClick" title='返回'>
      <img src="@/assets/images/back.png" alt="" />
    </div>
    <personnelLocus :param=param v-if='locusShow' @locusShow='locusShowMethod'></personnelLocus>
    <cylinderTag v-if='tagInfo'  @tagInfoSee='tagInfoSee'  :staffId='staffId' :staffInfo='staffInfo'></cylinderTag>
  </div>
</template>

<script>
  import AMap from 'AMap';
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import personnelLocus from './personnelLocus';
	import cylinderTag from '@/pages/comComponent/cylinderTag2.vue';
	export default {
		name: 'personnelMap',
		components: {
			personnelLocus,
			cylinderTag
		},
		props: {
			tabsMap: Array,
			fromPath: String
		},
		data() {
			return {
				staffInfo:{},
				staffId:null,
				onLineNum:0,
				offLineNum:0,
				recentlyNum:0,
				staffCount:0,
        loading:false,
				isFromInfo: false,
				dayNum: 1,
				newTags: [],
				
				tagInfo: false,
				secondTime: 10,
				staffLabel: [],
				onlones: [2, 1, 0],
				newOrganized: '',
				options: [],
				organize: '',
				staffType: '',
				keyWords: '',
				checkLocus: false,
				locusShow: false,
				userData: (JSON.parse(this.$store.state.userData)),
				param: {},
				staffPosition: [],
				personnelId: null,
				expand: true,
				markPosition: [],
				userLng: null,
				userLat: null,
				markCardArr: [],
				newLnglat: [],
				staffName: '',
				staffAccount: '',
				staffWorkCode: '',
				newAdress: '',
				staffLng: null,
				staffLat: null,
				copyPosition: [],
				showWindow: false,
				clickId: 0,
				staffDeptName: '',
				staffTypesName: '',
				offsetTops:null,

				newHight:'calc(100% - 285px )'
			}
		},
		watch: {
      'offsetTops': {
        handler(newItems, oldItems) {
          if (newItems) {
            this.newHight = `calc(100% - ${newItems + 95+"px"} )`;
          } else {
            this.newHight =`calc(100% - 285px )`;
          }
//        console.log(this.newHight)
        },
        deep: true,
        immediate: true
      }
    },
		methods: {
			toggleExpand() {

        setTimeout(() => {
          this.offsetTops = this.$refs.searchContentList.offsetTop - 10;
        }, 300)

      },
			//递归数据
      getDepts(depts) {

        return depts.map((dept) => {
          dept._showChildren = true;
          dept.expand = false;
          if (dept.deptId == this.userData.deptId) {
//          dept.expand = true;
            setTimeout(() => {
              this.offsetTops = this.$refs.offsetTop - 10;
            }, 300)

          }


          if (dept.children && dept.children.length > 0) {
            this.getDepts(dept.children);
          }
          if (dept.children && dept.children.length == 0) {
            delete dept.children;
          }
           if (this.newOrganized == dept.deptId) {
            dept.selected = true
          }
          dept.value = dept.deptId;
          dept.key = dept.deptId;

          return dept;
        })
      },
			//自定义tree树形组件
			renderContent(h, {
				root,
				node,
				data
			}) {
				return h('span', {
					style: {

						display: 'inline-block',
						cursor: "pointer",						
						color:this.newOrganized==node.node.deptId? "#51B5EA" : "#515a6e", //根据选中状态设置样式
						background:this.newOrganized==node.node.deptId?'#d5e8fc':'',
					},
					on: {
						click: (e) => {
							this.newOrganized = data.deptId;
							this.getStaffLocation();
						}
					},
				}, [
					h('span', [
						h('Icon', {
							props: {
								type: 'md-home'
							},
							style: {
								marginRight: '8px',
								color: '#51B5EA'
							}
						}),
						h('span', {

							style: {
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								marginBottom: '-6px',
								display: 'inline-block',
								width: '100%',
								// marginRight: '5px',
								fontSize: '12px'
							}
						}, data.name, ), ,

					]),

				])

			},
			getPersonInfo(id) {

				this.$router.push('/mobilePerson/editPerson' + '/' + id);
			},
			tagInfoSee(data) {
				this.tagInfo = data;
			},
			getPersonLiableBottle(item,i) {								
				this.staffId=item.staffId;
				this.staffInfo={					
					staffDeptId:item.staffDeptId,
					staffName:item.staffName,
					staffWorkCode:item.staffWorkCode,
					staffAccount:item.staffAccount,
          bottleIsFull:i
				}
				this.tagInfo = true;
			},
			checkChange(v) {
				this.onlones = v;
				this.getSearch();
			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				//				console.log(labels, selectedData)
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			changeCascader(value, selectedData) {
				if(value.length) {
					this.newOrganized = value[value.length - 1];
				} else {
					this.newOrganized = '';
				}
				this.getSearch();

			},
			getSearch() {
				this.getStaffLocation();
			},

			//点击marker传递值
			getLocus(id, lns, lats, names, staffType) {

				this.locusShow = true;
				this.param = {
					id,
					lns,
					lats,
					names,
					staffType
				}
			},
			personnelItemClick(id) {
				this.clickId = id;
				let arrs = [];
				if(id) {
					for(let item of this.markPosition) {
						if(id == item.staffId) {
							arrs.push(item);
						}

					}
					if(arrs.length) {
						this.markCardArr = arrs;
						this.newLnglat = [arrs[0].lon, arrs[0].lat];
						this.personnelId = arrs[0].staffId;
						this.staffName = arrs[0].staffName;
						this.staffAccount = arrs[0].staffAccount;
						this.staffWorkCode = arrs[0].staffWorkCode;
						this.newAdress = arrs[0].newAdress;
						this.staffLng = arrs[0].lon;
						this.staffLat = arrs[0].lat;
						this.staffType = arrs[0].staffIdentityName;
						this.staffDeptName = arrs[0].staffDeptName;
						this.staffTypesName = arrs[0].staffIdentityName;
						if(!this.checkLocus) {
							this.showWindow = true;
							this.loadmap(16, arrs[0].lon, arrs[0].lat);
						} else {
							this.locusShow = true;
							this.param = {
								id: this.personnelId,
								lns: this.staffLng,
								lats: this.staffLat,
								names: this.staffName,
								staffType: this.staffType
							}
						}

					} else {
						this.staffLng = null;
						this.markCardArr = this.copyPosition;
						this.$Message['warning']({
							background: true,
							content: '暂无该员工位置信息!',
							onClose: (() => {
								this.personnelId = null;
								this.clickId = 0;
								if(this.checkLocus) {
									this.markCardArr = [];

								} else {
									this.markCardArr = this.copyPosition;
								}
								this.loadmap(12, this.userData.lng, this.userData.lat);
							})
						});

					}

				} else {
					this.staffLng = null;
					this.markCardArr = this.copyPosition;
					this.loadmap(12, this.userData.lng, this.userData.lat);
				}
			},
			changeDrawBack() {
				this.expand = !this.expand;
			},
			//刷新地图
			handleBackClick() {
				this.showWindow = false;
				this.checkLocus = false;
				this.personnelId = null;
				this.clickId = 0;
				this.isFromInfo = false;
				this.newOrganized = this.userData.deptId;
				this.getStaffLocation();

			},

			//显示轨迹地图
			locusShowMethod(data) {
				this.locusShow = data;
				this.showWindow = false;
				this.checkLocus = false;
				this.personnelId = null;
				this.clickId = 0;
				this.getStaffLocation();
			},
			//获取员工位置
			getStaffLocation() {
				this.markPosition = [];
				this.staffPosition = [];
				this.markCardArr = [];
				this.copyPosition = [];
				this.staffLabel = [];
				this.onLineNum=0;
				this.offLineNum=0;
				this.recentlyNum=0;
        this.loading=true;
				_http.http3('get', pathUrls.staffLocation, {
					staffName: this.keyWords,
					secondTime: this.secondTime || 10,
					orgId: this.newOrganized || this.userData.deptId,
					staffOnDuty: this.onlones.length != 0 ? this.onlones.toString() : '',
					dayNum: this.dayNum
				}).then((res) => {
          this.loading=false;
          this.onLineNum=0;
					this.offLineNum=0;
					this.recentlyNum=0;
					this.staffPosition = [];
					this.staffLabel = [];
					this.markCardArr = [];
					if(res.data && res.data.length) {
						this.staffCount=res.data.length;
						for(let item of res.data) {
							if(!item.staffIdentityName) {
								item.staffIdentityName = '角色未知';
							}
							switch(item.staffIdentityType) {
								case 0:
									item.positionTypeName = "其他";
									break;
								case 1:
									item.positionTypeName = "配送";
									break;
								case 2:
									item.positionTypeName = "库管";
									break;
								case 3:
									item.positionTypeName = "管理";
									break;
								case 4:
									item.positionTypeName = "充装";
									break;
								case 5:
									item.positionTypeName = "稽查";
									break;
								case 6:
									item.positionTypeName = "押运";
									break;
							}
							if(item.staffOnDuty==1){
									this.onLineNum++;
								}else if(item.staffOnDuty==2){
									this.recentlyNum++;
									
								}else{
									this.offLineNum++;
								}
							if(item.lon) {
								this.markPosition.push(item);
								this.staffPosition.push(item);
								
							}
						
						}
						this.staffLabel = res.data;
						this.markCardArr = this.markPosition;
						this.copyPosition = this.markPosition;

					} else {
						this.staffLng = null;
					}
					// setTimeout(() => {
					if(document.getElementById('personnelContainer')) {
						if(this.isFromInfo) {
							for(let item of this.markPosition) {
								if(this.clickId == item.staffId) {
									this.newLnglat = [item.lon, item.lat];
									this.personnelId = item.staffId;
									this.staffName = item.staffName;
									this.staffAccount = item.staffAccount;
									this.staffWorkCode = item.staffWorkCode;
									this.newAdress = item.newAdress;
									this.staffLng = item.lon;
									this.staffLat = item.lat;
									this.staffType = item.staffIdentityName;
									this.staffDeptName = item.staffDeptName;
									this.staffTypesName = item.staffIdentityName;
								}

							}

						}

						this.loadmap(12, this.userData.lng, this.userData.lat);
					}

					// }, 300)

				}).catch(()=>{
           this.loading=false;
        })
			},
			//逆地理编码
			regeocoder(lnglatXY, cb) {

				let that = this
				//逆地理编码
				var geocoder = new AMap.Geocoder({
					radius: 1000,
					extensions: "all"
				});
				geocoder.getAddress(lnglatXY, function(status, result) {
					if(status === 'complete' && result.info === 'OK') {
						var address = result.regeocode.formattedAddress; //返回地址描述

						that.newAdress = address;

						typeof cb == 'function' && cb();
					}
				});
			},
			//加载地图
			loadmap(zoom, lngg, latt) {
				var map;
				if(lngg) {
					map = new AMap.Map('personnelContainer', {
						zoom: zoom,
						center: [lngg, latt],
					});
				} else {
					map = new AMap.Map('personnelContainer', {
						zoom: zoom
					})
				}

				if(this.markCardArr.length) {
					let style = [{
						url: require('../../../src/assets/images/personsr.png'),
						anchor: new AMap.Pixel(10, 10),
						size: new AMap.Size(36, 36)
					}, {
						url: require('../../../src/assets/images/persons.png'),
						anchor: new AMap.Pixel(10, 10),
						size: new AMap.Size(36, 36)
					}, {
						url: require('../../../src/assets/images/person03.png'),
						anchor: new AMap.Pixel(10, 10),
						size: new AMap.Size(36, 36)
					}];
					var massMarks = [];
					for(let i = 0; i < this.markCardArr.length; i++) {
						let sn;
						if(this.markCardArr[i].lon) {
							var marker = new AMap.Marker({content: ' ', map: map});
							if(this.markCardArr[i].staffOnDuty == 1) {
								sn = 1;
							} else if(this.markCardArr[i].staffOnDuty == 0) {
								sn = 0;
							} else {
								sn = 2;
							}
							let points = {
								lnglat: [this.markCardArr[i].lon, this.markCardArr[i].lat],
								staffId: this.markCardArr[i].staffId,
								staffName: this.markCardArr[i].staffName,
								staffAccount: this.markCardArr[i].staffAccount,
								staffWorkCode: this.markCardArr[i].staffWorkCode,
								newAdress: this.markCardArr[i].newAdress,
								staffType: this.markCardArr[i].staffIdentityName,
								staffDeptName: this.markCardArr[i].staffDeptName,
								staffTypesName: this.markCardArr[i].staffIdentityName,
								style: sn
							};

							massMarks.push(points)
							marker.setPosition(points.lnglat);
							marker.setLabel({
								content: `${points.staffName}`,
								direction:'top',
								offset:new AMap.Pixel(18, 24),
								})


						}

					}

					this.mass = new AMap.MassMarks(massMarks, {
						opacity: 1,
						zIndex: 111,
						cursor: 'pointer',
						style: style
					});
					this.getInfos = () => {
						let lnglatXY = this.newLnglat;
						this.regeocoder(lnglatXY, () => {
							//						console.log(this.staffTypesName)
							let psy = require('../../../src/assets/images/psy.png');
							let gh = require('../../../src/assets/images/gh.png');
							let tel = require('../../../src/assets/images/tel.png');
							let mar = require('../../../src/assets/images/marke.png');
							let sszz = require('../../../src/assets/images/org.png');
							let juese = require('../../../src/assets/images/juese.png');
							let contentInfo = '';
							let staffDiv = `<div style='height:24px;font-size:12px;line-height:24px'>
										<img src='${psy}' class='staffImg'>
										<span>姓名:</span>
										<span style='color:#40a9ff;font-weight:600;cursor:pointer;font-size:14px' onclick='getPersonInfo(${this.personnelId})'>${this.staffName}</span>
									</div>`;
							let orgDiv = `<div style='min-height:24px;font-size:12px;line-height:24px'>
										<img src='${sszz}' class='staffImg'>
										<span>所属组织:</span>
										<span>${this.staffDeptName}</span>
									</div>`;
							let roleDiv = `<div style='min-height:24px;font-size:12px;line-height:24px'>
										<img src='${juese}' class='staffImg'>
										<span>角色名称:</span>
										<span>${this.staffTypesName}</span>
									</div>`;

							let telDiv = `<div style='height:24px;font-size:12px;line-height:24px'>
										<img src='${tel}' class='staffImg'>
										<span>联系方式:</span>
										<span>${this.staffAccount}</span>
								</div>`;
							let codeDiv = `<div style='height:24px;font-size:12px;line-height:24px'>
										<img src='${gh}' class='staffImg'>
										<span>工号:</span>
										<span>${this.staffWorkCode}</span>
								</div>`;
							let adressDiv = `<div style='line-height:18px;text-overflow: ellipsis;font-size:12px;display: -webkit-box;-webkit-box-orient: vertical;　-webkit-line-clamp:2;overflow: hidden;'>
										<img src='${mar}' class='staffImg'>
										<span>地址:</span><span title='${this.newAdress}'>${this.newAdress}</span>
									</div>`;
							let locusDiv = `<div style='text-align:center;font-weight:600;color:#fff;margin-top:4px;cursor:pointer' onclick='getLocus(${this.personnelId},${this.staffLng},${this.staffLat},"${this.staffName}","${this.staffType}")'>
										<span style='display:inline-block;width:44px;height:24px;line-height:24px;background:#f90;border-radius:4px'>轨迹</span>
								  </div>`
							contentInfo += `<div>${staffDiv}${orgDiv}${roleDiv}${telDiv}${codeDiv}${adressDiv}${locusDiv}</div>`

							this.infoWindow = new AMap.InfoWindow({
								content: contentInfo,
								offset: new AMap.Pixel(10, -10),

							});

							if(this.showWindow) {
								this.infoWindow.open(map, this.newLnglat);
								this.infoWindow.setContent(contentInfo)
							}
						})
					};

					if(this.staffLng) {
						this.getInfos();
					}
					this.mass.on('click', (e) => {

						this.showWindow = true;
						this.personnelId = e.data.staffId;
						this.clickId = e.data.staffId;
						this.newLnglat = e.data.lnglat;
						this.staffName = e.data.staffName;
						this.staffAccount = e.data.staffAccount;
						this.staffWorkCode = e.data.staffWorkCode;
						// this.newAdress = e.data.newAdress;
						this.staffLng = e.data.lnglat.lng;
						this.staffLat = e.data.lnglat.lat;
						this.staffType = e.data.staffType;
						this.staffDeptName = e.data.staffDeptName;
						this.staffTypesName = e.data.staffTypesName;
						this.getInfos();

						//					this.getLocus(e.data.staffId, e.data.lnglat.lng, e.data.lnglat.lat, e.data.staffName)

					})
					this.mass.setMap(map);
				}

			},
		},
		activated() {
			this.isFromInfo = true;
			if(this.tabsMap.indexOf('员工') != -1) {

				this.getStaffLocation();

			}
		},

		mounted() {
			if(this.tabsMap.indexOf('员工') != -1) {
				this.isFromInfo = false;
				this.newOrganized =this.userData.deptId;
				this.common.getDeptList(this.userData.deptId).then((res) => {
					this.options = this.getDepts(res.data)
				})
				window.getLocus = this.getLocus;
				window.getPersonInfo = this.getPersonInfo;
        if(this.$store.state.hasStaff==2){
//        this.getStaffLocation();
        }

				 this.offsetTops = this.$refs.searchContentList.offsetTop;
			}

		}
	}
</script>

<style type="text/css" scoped>
  .personnelMain {
    height: calc(100vh - 10px);
  }

  .mainContenter {
    position: relative;
    width: calc(100% - 340px);
    height: 100%;
    overflow: hidden;
    transition: all 0.7s ease;
  }

  .changeMainContainer {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  #personnelContainer {
    width: 100%;
    height: calc(100% - 60px);
  }

  #personnelContainer>>>.amap-icon img {
    width: 10px;
    height: 10px;
  }

  /*点击标注点出现弹框*/

  #personnelContainer>>>.amap-info-close {
    color: #51B5EA;
    right: 10px !important;
  }

  #personnelContainer>>>.amap-info-content {
    min-height: 144px;
    width: 200px;
    padding: 12px 12px 10px;
    border-radius: 4px;
  }

  #personnelContainer>>>.amap-info-sharp {
    /*margin-left: 40px;*/
  }

  #personnelContainer>>>.staffImg {
    width: 14px;
    height: 14px;
    margin-bottom: -2px;
    margin-right: 2px;
  }

  .searchPerson {
    position: absolute;
    right: 0;
    top: 36px;
    z-index: 400;
    background: #fff;
    width: 340px;
    height: 100%;
    padding: 5px 10px 10px;
    text-align: left;
    box-shadow: rgba(64, 169, 255, 0.29) 0px 2px 4px 0px;
    transition: all 0.7s ease;
  }

  .expandPerson {
    width: 340px;
    right: -340px;
  }

  .expandBtn {
    width: 20px;
    height: 20px;
    position: absolute;
    bottom: -15px;
    left: 100px;
    cursor: pointer;
  }

  .backMap img,
  .locusClick img {
    width: 23px;
    height: 23px;
  }

  .backMap,
  .locusClick {
    position: absolute;
    right: 25px;
    top: 5px;
    cursor: pointer;
  }

  .locusClick {
    right: 80px;
  }

  .drawBack {
    position: absolute;
    right: -12px;
    bottom: 400px;
    z-index: 190;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 0 2px 2px #efefef;
    width: 32px;
    height: 32px;
    line-height: 32px;
    padding-right: 5px;
    cursor: pointer;
  }

  .drawBack img {
    width: 20px;
    height: 20px;
    margin-top: 6px;
  }

  .itemList {
    min-height: 24px;
    line-height: 24px;
    cursor: pointer;
   /* margin: 4px 0; */
    border-bottom: 1px solid #eee;
  }

  .itemList div {
    display: inline-block;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 4px 5px 0;
  }

  .checkList {
    background: #2b85e4;
  }

  /*.checkList{
		color: #fff!important;
	}*/

  .checkList .itemsSel {
    color: #fff !important;
    text-align: center;
  }

  .personnelContent {

    overflow: hidden;
    overflow-x: auto;

  }

  .contentList {
    height: calc(100% - 20px);
    overflow-y: auto;
    padding-bottom: 10px;
    position: relative;
  }

  .contentTitle {
    color: #40C1FF;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
  }

  .contentTitle span {
    display: inline-block;
    text-align: center;
  }

  .mainContenter>>>.ivu-cascader .ivu-cascader-menu {
    background: #fff !important;
  }

  .someTimes {
    color: #f00;
    height: 28px;
    margin-bottom: 5px;
  }

  .someTimes>>>.ivu-input {
    height: 26px;
    line-height: 26px;
  }

  .titleWrapper {
    background: #E2EEFF;
    color: #51B5EA;
    font-weight: 600;
    height: 30px;
    line-height: 30px;
  }

  .titleWrapper div {
    display: inline-block;
    text-align: center;
    margin: 0 5px;
  }

  .pngWrapper {
    width: 85px;
    display: inline-block;
    text-align: left !important;
  }

  .pngWrapper img {
    width: 20px;
    height: 20px;
    margin-bottom: -3px;
    display: inline-block;
  }

  .offLineList {
    color: #f00;
  }

  .onLineList {
    color: #15c709;
  }

  .onOutLineList {
    color: #88900c;
  }

  .nameSearch {
    margin-bottom: 5px;
    cursor: pointer;
    width: 250px;
    height: 30px;
    line-height: 30px;
  }

  /*.personnelMain>>>.amap-marker-label{
		border-color:#1EBB23;
		padding: 5px;
	}*/
  .TreeDept {
    max-height: 200px;
    overflow: hidden;
    overflow-y: auto;
  }
  .countWrapper {
    position: absolute;
    left: 50%;
    top: 0;
    background: #1890ff;
    width: 150px;
    margin-left: -75px;
    box-shadow: 0px 3px 3px #c8c8c8;
    color: #fff;
    height: 28px;
    line-height: 28px;
  }
  #personnelContainer>>>.amap-marker-label{
    border-color:#2a9c28;
    color:#2665dd;
    font-weight: 600;
    
  }
</style>
