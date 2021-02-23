<template>
  <div class="userMain">
    <div class="mainContenter" :class="[expand?'mainContenter':'changeMainContainer']">
      <Spin fix v-if='spinShow'></Spin>
      <div id="userContainer"></div>
      <div class='drawBack' @click='changeDrawBack'>
        <img src="@/assets/images/right.png" alt="" v-if='expand' />
        <img src="@/assets/images/left.png" alt="" v-else />
      </div>
       <div class="countWrapper"><span>用户总数：</span>{{userCount}}</div>
    </div>
    <div class="stationUser" :class="[expand?'stationUser':'expandUser']">
      <div class="topTree">
        <Tree :data="userDeptData" ref="userDeptTree" :render="renderContent" @on-select-change='handleSelect'
          @on-toggle-expand='toggleExpand'></Tree>
      </div>

      <!--<div class="bottomTable">
  				<Table  :columns="searchColumn" :data="searchData" :rowClassName="rowClassName" @on-row-click='handleRowClick' highlight-row :loading="loading" height="400">
  				<template slot-scope="{ row, index }" slot="color">
  					<span style="width: 16px;height: 16px;display: inline-block;border-radius: 50%;" :style='{"background":row.color}'></span>
  				</template>
  			</Table>
  			</div>-->

    </div>

    <div class="backMap" @click="handleBackClick">
      <img src="@/assets/images/back.png" alt="" />
    </div>

  </div>

</template>

<script>
  import AMap from 'AMap'
  import Bus from '@/public/bus';
  import _http from '@/public/http';
  import {
    pathUrls
  } from '@/public/path';
  export default {
    name: "userMap",
    props: {
      tabsMap: String
    },
    data() {
      return {
        showIcon:{},
        spinShow:false,
        expand: true,
        deptid: '',
        userDeptData: [],
        userData: (JSON.parse(this.$store.state.userData)),
        userData: (JSON.parse(this.$store.state.userData)),
        userArr: [],
        userCount: 0,
        userData: (JSON.parse(this.$store.state.userData)),
        searchColumn: [{
          title: '颜色',
          key: 'color',
          align: 'center',
          width: 50,
          slot: 'color'

        }, {
          title: '客户名称',
          key: 'userRealName',
          align: 'center',
          width: 100,
          tooltip: true
        }, {
          title: '所属组织',
          key: 'userRealName',
          align: 'center',
          tooltip: true
        }],
        searchData: []
      }
    },
    components: {

    },
    methods: {
      //递归数据
      getDepts(depts) {

        return depts.map((dept) => {
          dept._showChildren = true;
          dept.expand = false;
          if (dept.deptId == this.userData.deptId) {
            dept.expand = true;

            //							setTimeout(()=>{
            //								this.offsetTops=this.$refs.searchContent.offsetTop-10;
            //							},300)

          }

          if (dept.children && dept.children.length > 0) {
            this.getDepts(dept.children);
          }
          if (dept.children && dept.children.length == 0) {
            delete dept.children;
          }
          dept.value = dept.deptId;
          dept.key = dept.deptId;
          dept.name = dept.deptName;
          if (this.deptid == Number(dept.deptId)) {
            dept.selected = true
          }
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
           width:'150px',
           display:'inline-block',
            cursor: "pointer",
            color:this.deptid==node.node.deptId? "#51B5EA" : "#515a6e", //根据选中状态设置样式
						background:this.deptid==node.node.deptId?'#d5e8fc':'',
          },
          on: {
            click: (e) => {
              this.deptid = data.deptId;
              this.getStatistical();
            }
          },
        }, [
          h('span', [
            h('span', {
              style: {
                marginRight: '8px',
                background: data.color ? data.color : '#1890ff',
                width: '12px',
                height: '12px',
                display: 'inline-block',
                borderRadius: '50%',


              }
            }),
            h('span', {

              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginBottom: '-6px',
                display: 'inline-block',
                width: '60%',
                // marginRight: '5px',
                fontSize: '12px'
              }
            }, data.deptName, ),
            h('span', `(${data.count})`),

          ]),

        ])

      },
      getUserQueryDept() {
        _http.http1('post', pathUrls.userQueryDept, {
          deptId: this.userData.deptId
        }, 'form').then((res) => {
          this.userDeptData = this.getDepts(res.data)
        }).catch((res) => {

        })
      },
      changeDrawBack() {
        this.expand = !this.expand;
      },
      handleBackClick() {
        this.deptid = this.userData.deptId;
        this.getStatistical();
        this.getUserQueryDept();
      },
      getUserInfo(id, name) {

        this.$router.push(`/customerInfo/seeAccount/${id}/2`);
      },

      //获取用户位置信息
      getStatistical() {
        this.spinShow=true;
        _http.http3('get', pathUrls.userBottle, {
          deptId: this.deptid
        }).then((res) => {
           this.spinShow=false;
          this.userArr = res.data.userPoint;
          this.showIcon=res.data.showIcon;

          this.userCount = res.data.userPoint.length
          //					console.log(this.userArr)
          this.loadmap()
        }).catch((res) => {
          this.spinShow=false;
        })

      },

      loadmap() {
        var map;
        let that = this;
        if (this.userData.lng) {
          map = new AMap.Map('userContainer', {
            zoom: 12,
            center: [this.userData.lng, this.userData.lat],
          });
        } else {
          map = new AMap.Map('userContainer', {
            zoom: 12,

          });
        }
        map.addControl(new AMap.ToolBar({
          liteStyle: true
        }))
        AMapUI.loadUI(['misc/PointSimplifier'], function(PointSimplifier) {

          if (!PointSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
            return;
          }
          //启动页面
          initPage(PointSimplifier);
        });

        function initPage(PointSimplifier) {
					var groupStyleMap = that.showIcon;
					for(let key in groupStyleMap) {
						groupStyleMap[key].pointStyle = {
							content: PointSimplifier.Render.Canvas.getImageContent(
								groupStyleMap[key].userIcon,
								function onload() {
									//图片加载成功，重新绘制一次
                  if(pointSimplifierIns&&pointSimplifierIns.renderLater){
                    pointSimplifierIns.renderLater();
                  }
									

								},
								function onerror(e) {
									alert('图片加载失败！');

								}
							),

						};
            // groupStyleMap[key].shadowPointStyle = {
            // 	content: PointSimplifier.Render.Canvas.getImageContent(
            // 		groupStyleMap[key].userIcon,
            // 		function onload() {
            // 			//图片加载成功，重新绘制一次
            // 			pointSimplifierIns.renderLater();

            // 		},
            // 		function onerror(e) {
            // 			alert('图片加载失败！');

            // 		}
            // 	),

            // }

					}
          var pointSimplifierIns = new PointSimplifier({
            map: map, //关联的map
            compareDataItem: function(a, b, aIndex, bIndex) {
              //数据源中靠后的元素优先，index大的排到前面去
              return aIndex > bIndex ? -1 : 1;
            },
            getPosition: function(dataItem) {
              //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
              //          console.log(dataItem)
              let position = [dataItem.location.lon, dataItem.location.lat]
              return position;
            },
            getHoverTitle: function(dataItem, idx) {
              // console.log([dataItem.location.lon, dataItem.location.lat])
              //返回数据项的Title信息，鼠标hover时显示
              // return '用户名: ' + dataItem.userRealName;
              // return  dataItem.userRealName
            },
            renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
            renderOptions: {
              //点的样式
              pointStyle: {
                fillStyle: '#1890ff',
                width: 20,
                height: 20
              },

              getGroupId: function(item, idx) {

                return item.userDeptId;
              },
              groupStyleOptions: function(gid) {

//              let newStyle = {
//                pointStyle: {
//
//                  //宽度
//                  width: 16,
//                  //高度
//                  height: 16,
//                  //定位点为中心
//                  offset: ['-50%', '-50%'],
//                  fillStyle: `${gid}`,
//                  // strokeStyle: null
//                }
//              }
                return groupStyleMap[gid];
              },
              // drawShadowPoint:true
//            drawQuadTree:true,

            },
            //		    maxChildrenOfQuadNode:1,
            autoSetFitView: false
          });
          var data = that.userArr;
          //设置数据源，data需要是一个数组
          pointSimplifierIns.setData(data);

          //监听事件
          pointSimplifierIns.on('pointClick', function(e, record) {
            let LngLat = [record.data.location.lon, record.data.location.lat];
            let info = '';
            info +=
              `<div style='cursor:pointer;color:#fb5100;padding:0 10px' onclick='getUserInfo(${record.data.userId},"${record.data.userName}")'>客户名称：${record.data.userName}</div>`
            var infoWindow = new AMap.InfoWindow({
              content: `${info}` //使用默认信息窗体框样式，显示信息内容
            });
            infoWindow.open(map, LngLat);
          });
        }


      }
    },
    mounted() {
      window.getUserInfo = this.getUserInfo;
      if (this.tabsMap.indexOf('用户') != -1) {
        this.deptid = this.userData.deptId;
        this.getStatistical();
        this.getUserQueryDept();
      }
    }
  }
</script>

<style scoped>
  .userMain {
    height: calc(100vh - 10px);
    width: 100%;
  }

  .mainContenter {
    position: relative;
    width: calc(100% - 320px);
    height: 100%;
    overflow: hidden;
    transition: all 0.5s ease;
  }

  .changeMainContainer {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  #userContainer {
    width: 100%;
    height: calc(100% - 60px);
  }

  .stationUser {
    position: absolute;
    right: 0;
    top: 36px;
    z-index: 400;
    background: #fff;
    width: 320px;
    height: 100%;
    padding: 5px 10px 10px;
    text-align: left;
    box-shadow: rgba(64, 169, 255, 0.29) 0px 2px 4px 0px;
    transition: all 0.5s ease;
  }

  .topTree {
    overflow: hidden;
    overflow-y: auto;
    height: calc(100% - 120px);
    /*background: #ccc;*/
  }

  .expandUser {
    width: 320px;
    right: -320px;
    /*transition: all 0.7s ease;*/
  }

  #userContainer>>>.amap-icon img {
    width: 10px;
    height: 10px;
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

  .backMap img {
    width: 23px;
    height: 23px;
  }

  .backMap {
    position: absolute;
    right: 25px;
    top: 5px;
    cursor: pointer;
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

  .bottomTable>>>.ivu-table-cell {
    padding: 0 6px;
  }
</style>
