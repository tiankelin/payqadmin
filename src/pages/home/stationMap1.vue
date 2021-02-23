<template>
	<div class="stationMain">
		<div class="mainContenter" :class="[expand?'mainContenter':'changeMainContainer']">
			<div id="stationContainer">

			</div>
			<div class='drawBack' @click='changeDrawBack'><img src="@/assets/images/right.png" alt="" v-if='expand' /><img src="@/assets/images/left.png" alt="" v-else/></div>
		</div>
		<div class="stationPerson" :class="[expand?'stationPerson':'expandPerson']">
				<div  class='stationNmae'>场站名称</div>
				<div class="stationContent">
					<div v-for='(item,findex) in stationLabel' :value="item.typeName" :key='item.type'>
						<div style="color:#89811f;" class="typeName" v-if='item.type==1'>{{item.typeName}}</div>
						<div style="color:#3d64f9;" class="typeName" v-else-if='item.type==2'>{{item.typeName}}</div>
						<div style="color:#d94b8f;" class="typeName" v-else-if='item.type==3'>{{item.typeName}}</div>
						<div style="color:#3b8c43;" class="typeName" v-else-if='item.type==4'>{{item.typeName}}</div>
						<div style="color:#753abd;" class="typeName" v-else-if='item.type==5'>{{item.typeName}}</div>
						<div style="color:#40a9e1;" class="typeName" v-if='item.category==2'>{{item.typeName}}</div>
						<div class='itemList' :class="{checkList:items.deptId==clickId}" v-for="(items,cindex) in item.stationList" :key='items.deptId'  @click='stationItemClick(items,items.deptId)' :title='items.name'>{{items.name}}</div>
					</div>
				</div>
				<!--<Select ref="resetSelect" style="width: 260px;" v-model='stationId'  placeholder='场站' label-in-value clearable @on-change='stationChange' filterable>
					<Option-group v-for='item in stationLabel' :label="item.typeName" :key='item.type'>
						<Option v-for="items in item.stationList" :value="items.deptId" :key='items.deptId' :tag='{lnglat:[items.lng,items.lat]}'>{{ items.name }}</Option>
					</Option-group>
				</Select>-->

			</div>
			<div class="backMap" @click="handleBackClick">
				<img src="@/assets/images/back.png" alt="" />

			</div>
	</div>
</template>

<script>
	import AMap from 'AMap';
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'stationMap',
		props:{
			tabsMap:Array
		},

		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),
				stationList: [],
				stationLabel: [],
				expand:true,
				stationId: '',
				stationLng: null,
				stationLat: null,
				markCardArr: [],
				newLnglat: [],
				stationName: '',
				typeName: '',
				showWindow: false,
				stationAdress:'',
				copyPosition: [],
				clickId:0,
				category:1,
				stocks:''
			}
		},
		methods: {
			stationItemClick(lis,id){
				this.clickId=id;
				let arrs = [];
				if(id) {
					for(let item of this.stationList) {
						if(id == item.deptId) {
							arrs.push(item);
						}
					}

					if(arrs.length) {
						this.markCardArr = arrs;
						this.newLnglat = [arrs[0].lng, arrs[0].lat];
						this.stationName = arrs[0].name;

						if(arrs[0].type == 2) {
							this.typeName = '充装站';
						} else if(arrs[0].type == 3) {
							this.typeName = '供应站/中转站';
						}
						else if(arrs[0].type == 4) {
							this.typeName = '管理片区';
						}
						else if(arrs[0].type == 1) {
							this.typeName = '燃气公司';
						}
						else if(arrs[0].type == 5) {
							this.typeName = '门店';
						}
						if(arrs[0].category == 2){
							this.typeName = '检测站';
						}
						this.stationAdress = arrs[0].address;
						this.stocks=arrs[0].stock;
						this.stationLng = arrs[0].lng;
						this.stationLat = arrs[0].lat;
						this.showWindow = true;
						this.loadmap(16, arrs[0].lng, arrs[0].lat);
					} else {

						this.stationLng = null;
						this.markCardArr = this.copyPosition;

						this.$Message['warning']({
							background: true,
							content: '暂无该场站位置信息!',
							onClose: (() => {
								this.loadmap(12, this.userData.lng, this.userData.lat);
							})
						});
					}

				} else {
					this.stationId = null;
					this.stationLng = null;
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
				this.clickId=0;
				this.getQueryOrgInfo();

			},

			getQueryOrgInfo() {
				this.stationLabel = [];
				this.stationList = [];
				this.copyPosition = [];
				this.markCardArr = [];
				this.stationId = '';
//				if(this.expand) {
//					this.$refs.resetSelect.clearSingleSelect();
//				}

				_http.http2('post', pathUrls.queryOrgInfo, {}).then((res) => {
          this.stationLabel = [];
					this.stationList = res.data;
					this.copyPosition = res.data;
					this.markCardArr = res.data;
					let tempArr = [];
					let newData = [];
					if(res.data) {
						newData = res.data;
						for(let item of newData) {
							if(tempArr.indexOf(item.type) === -1||item.category == 2) {

								let typeName = '';
								if(item.type == 2) {
									typeName = '充装站'
								} else if(item.type == 3) {
									typeName = '供应站/中转站'
								}
								else if(item.type == 4) {
									typeName = '管理片区'
								}else if(item.type == 1) {
									typeName = '燃气公司'
								}else if(item.type == 5) {
									typeName = '门店'
								}
								if(item.category == 2){
									typeName = '检测站'
								}
								this.stationLabel.push({
									type: item.type,
									typeName: typeName,
									stationList: [item],
									category:item.category
								});
								tempArr.push(item.type)
							} else {
								this.stationLabel.forEach((labs) => {
									if(item.type == labs.type) {
										labs.stationList.push(item)
									}
								})
							}

						}
					}
          if(document.getElementById("stationContainer")){
              this.loadmap(12, this.userData.lng, this.userData.lat);
          }


				})
			},
			loadmap(zoom, lngg, latt) {
				var map;
				if(lngg){
					 map = new AMap.Map('stationContainer', {
							zoom: zoom,
							center: [lngg, latt],
				});
				}else{
					map = new AMap.Map('stationContainer', {
							zoom: zoom,
				});

				}
				if(this.markCardArr.length){
					let style = [{
					url: require('../../../src/assets/images/stationA.png'),
					anchor: new AMap.Pixel(10, 10),
					size: new AMap.Size(30, 30)
				}, {
					url: require('../../../src/assets/images/stationB.png'),
					anchor: new AMap.Pixel(10, 10),
					size: new AMap.Size(30, 30)
				}, {
					url: require('../../../src/assets/images/stationC.png'),
					anchor: new AMap.Pixel(10, 10),
					size: new AMap.Size(30, 30)
				},{
					url: require('../../../src/assets/images/stationD.png'),
					anchor: new AMap.Pixel(10, 10),
					size: new AMap.Size(30, 30)
				},{
					url: require('../../../src/assets/images/stationE.png'),
					anchor: new AMap.Pixel(10, 10),
					size: new AMap.Size(30, 30)
				},{
					url: require('../../../src/assets/images/stationF.png'),
					anchor: new AMap.Pixel(10, 10),
					size: new AMap.Size(30, 30)
				}];
				var massMarks = [];
				for(let i = 0; i < this.markCardArr.length; i++) {
					let sn;

					if(this.markCardArr[i].type == 2) {
						sn = 0;
						this.markCardArr[i].typeName = '充装站';
					} else if(this.markCardArr[i].type == 3) {
						sn = 1;
						this.markCardArr[i].typeName = '供应站/中转站';
					}
					else if(this.markCardArr[i].type == 4) {
						sn = 2;
						this.markCardArr[i].typeName = '管理片区';
					}
					else if(this.markCardArr[i].type == 1) {
						sn = 3;
						this.markCardArr[i].typeName = '燃气公司';
					}else if(this.markCardArr[i].type == 5) {
						sn = 4;
						this.markCardArr[i].typeName = '门店';
					}
					if(this.markCardArr[i].category==2){
						sn = 5;
						this.markCardArr[i].typeName = '检测站';
					}
					if(this.markCardArr[i].lng) {
						let points = {
							lnglat: [this.markCardArr[i].lng, this.markCardArr[i].lat],
							deptId: this.markCardArr[i].deptId,
							name: this.markCardArr[i].name,
							address: this.markCardArr[i].address,
							type: this.markCardArr[i].type,
							typeName: this.markCardArr[i].typeName,
							category:this.markCardArr[i].category,
							style: sn,
							stock:this.markCardArr[i].stock
						};
						massMarks.push(points)
					}

				}

				this.mass = new AMap.MassMarks(massMarks, {
					opacity:1,
					zIndex: 111,
					cursor: 'pointer',
					style: style
				});
				this.getInfos = () => {
					let contentInfo = '';
					let types = `<div style='height:22px;line-height:22px'>
									<span style='font-weight:600'>场站类型:</span>
									<span style='color:#1780ef'>${this.typeName}</span>
								</div>`;
					let names = `<div style='min-height:22px;line-height:22px'>
									<span style='font-weight:600'>场站名称:</span>
									<span style='color:#ef17de'>${this.stationName}</span>
								</div>`;

					let stock=JSON.parse(this.stocks);
					let stocks=	`<div style='min-height:22px;line-height:22px'>
									<span style='font-weight:600;width:52px;display:inline-block;text-align:right'>库存:</span>

									<span style='color:#25a53a'>${stock.count<0?0:stock.count}个</span>
								</div>`;
					let adresses = `<div style='min-height:22px;line-height:22px'>
									<span style='font-weight:600'>场站地址:</span>
									<span style='color:#ef7b17'>${this.stationAdress}</span>
								</div>`;
          let echartBox=`<div id='echartBox' style='width:296px;height:240px'></div>`
					contentInfo = `<div style='font-size:12px;'>${types}${names}${stocks}${adresses}${echartBox}</div>`
					this.infoWindow = new AMap.InfoWindow({
						content: contentInfo,
						offset: new AMap.Pixel(10, -10),

					});
					if(this.showWindow) {
						this.infoWindow.open(map, this.newLnglat);
            setTimeout(()=>{
                this.dayState()
            },500)
					}
				}
				if(this.stationLng) {
					this.getInfos();
				}
				this.mass.on('click', (e) => {

					this.showWindow = true;
					this.newLnglat = e.data.lnglat;
					this.stationId = e.data.deptId;
					this.clickId=e.data.deptId;
					this.stationName = e.data.name;
					this.typeName = e.data.typeName;
					this.stationAdress = e.data.address;
					this.stocks=e.data.stock;
					this.category=e.data.category;
					this.getInfos();
				})

				this.mass.setMap(map);


				}

			},
      dayState() {
      	let dayChart = echarts.init(document.getElementById('echartBox'),'light');
      	let option = {
      		title: {
      		        text: '充装量对比',
                  textStyle:{
                          //文字颜色
                          color:'#333',
                          //字体风格,'normal','italic','oblique'
                          fontStyle:'normal',
                          //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                          fontWeight:'bold',
                          //字体系列
                          fontFamily:'sans-serif',
                          //字体大小
                  　　　　 fontSize:14
                      }
      		        // subtext: '纯属虚构'
      		    },
      		    tooltip: {
      		        trigger: 'axis'
      		    },
      		    legend: {
                top: '10%',
                data: ['今年', '去年']
      		    },
      		    // toolbox: {
      		    //     show: true,
      		    //     feature: {
      		    //         dataZoom: {
      		    //             yAxisIndex: 'none'
      		    //         },
      		    //         dataView: {readOnly: false},
      		    //         magicType: {type: ['line', 'bar']},
      		    //         restore: {},
      		    //         saveAsImage: {}
      		    //     }
      		    // },
      		    xAxis: {
      		        type: 'category',
      		        boundaryGap: false,
      		        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月']
      		    },
      		    yAxis: {
      		        type: 'value',
      		        axisLabel: {
      		            formatter: '{value}'
      		        }
      		    },
      		    series: [
      		        {
      		            name: '今年',
      		            type: 'line',
      		            data: [11, 11, 15, 13, 12, 13, 10,14,15,26,24,17],
      		            // markPoint: {
      		            //     data: [
      		            //         {type: 'max', name: '最大值'},
      		            //         {type: 'min', name: '最小值'}
      		            //     ]
      		            // },
      		            // markLine: {
      		            //     data: [
      		            //         {type: 'average', name: '平均值'}
      		            //     ]
      		            // }
      		        },
      		        {
      		            name: '去年',
      		            type: 'line',
      		            data: [1, 5, 6, 5, 3, 2,6,11,6,10,13,4],
      		            // markPoint: {
      		            //     data: [
      		            //         {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
      		            //     ]
      		            // },
      		            // markLine: {
      		            //     data: [
      		            //         {type: 'average', name: '平均值'},
      		            //         [{
      		            //             symbol: 'none',
      		            //             x: '90%',
      		            //             yAxis: 'max'
      		            //         }, {
      		            //             symbol: 'circle',
      		            //             label: {
      		            //                 position: 'start',
      		            //                 formatter: '最大值'
      		            //             },
      		            //             type: 'max',
      		            //             name: '最高点'
      		            //         }]
      		            //     ]
      		            // }
      		        }
      		    ]
      	};
      	dayChart.setOption(option);
      },
		},

		mounted() {

		if(this.tabsMap.indexOf('场站')!=-1){

			this.getQueryOrgInfo();
		}
		}
	}
</script>

<style type="text/css" scoped>
	.stationMain {
		height: calc(100vh - 10px);
		width: 100%;
	}
	.mainContenter{
		position: relative;
		width: calc( 100% - 280px);
		height: 100%;
		overflow: hidden;
		transition: all 0.5s ease;
	}
	.changeMainContainer{
		position: relative;
		width: 100%;
		overflow: hidden;
	}
	#stationContainer {
		width: 100%;
		height: calc(100% - 60px);
    background: #fff;
	}



	#stationContainer>>>.amap-icon img {
		width: 10px;
		height: 10px;
	}
	/*点击标注点出现弹框*/

	#stationContainer>>>.amap-info-close {
		color: #51B5EA;
		right: 10px!important;
    font-size: 20px!important;

	}

	#stationContainer>>>.amap-info-content {
		/*min-height: 114px;*/
		width: 320px;
		padding: 12px 12px 10px;
		border-radius: 4px;
		height: auto;
	}

	.stationPerson {
		position: absolute;
		right: 0;
		top:36px;
		z-index: 400;
		background: #fff;
		width: 280px;
		height: 100%;
		padding: 5px 10px 10px;
		text-align: left;
		box-shadow: rgba(64, 169, 255, 0.29) 0px 2px 4px 0px;
		transition: all 0.5s ease;
	}

	.expandPerson {
		width: 280px;
		right:-280px;
		/*transition: all 0.7s ease;*/

	}

	.expandBtn {
		width: 20px;
		height: 20px;
		position: absolute;
		bottom: -15px;
		left: 100px;
		cursor: pointer;
	}

	.stationMain>>>.ivu-select-group-title,
	.stationMain>>>.ivu-select-item {
		/*width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;*/
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

	.stationMain>>>.ivu-select-dropdown {
		overflow-x: hidden!important;
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
	.itemList{
		padding-left: 25px;
		min-height: 26px;
		line-height:26px;
		cursor: pointer;
		margin:5px 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 240px;
	}
	.checkList{
		background: #2b85e4;
		color: #fff;
	}
	.stationContent{
		height: calc(100% - 147px );
		overflow-y:auto ;

	}
	.stationNmae{
		height: 30px;
		line-height: 30px;
		border-bottom: 1px solid #eee;
		font-weight: 600;
		color: #40C1FF;
	}
	.typeName{
		min-height: 24px;
		line-height: 24px;
		margin-left: 10px;
		font-weight: 600;
	}

</style>
