<template>
	<div class='mainWrapper' >
		<div class=main>
			<div class="topTitle">
				<h3>钢瓶详细信息</h3>
			</div>
			<div class='contentTop'>
				<Form ref="formInline" :model="formInfo" inline :label-width="90">
					<FormItem label="钢瓶标签">
						<Input v-model="formInfo.cylTags" disabled/>
					</FormItem>
					<FormItem label="钢瓶条码">
						<Input v-model="formInfo.cylcodes" disabled/>
					</FormItem>
			        <FormItem label="钢瓶ID">
			          	<Input v-model="formInfo.cylId" disabled/>
			        </FormItem>
					<FormItem label="出厂编号">
						<Input v-model="formInfo.cylNumbers" disabled/>
					</FormItem>
					<FormItem label="建档站点" class='cylSites'>
						<Input v-model="formInfo.cylSites" disabled/>

					</FormItem>
					<FormItem label="钢瓶规格">
						<Input v-model="formInfo.cylSpecs" disabled/>
					</FormItem>
					<FormItem label="流转状态">
						<Input v-model="formInfo.cylCirculName" disabled/>
					</FormItem>

				</Form>
			</div>
			<div class='contentMiddle'>
				<Table :columns="infoColumn" :data="infoData" :height="infoHeight" :loading='loading'>
					<template slot-scope="{ row, index }" slot="orderCode">
						<span class='orderCode'  :title='row.orderCode' @click='handleOrderInfo(row.orderCode)'>{{row.orderCode}}</span>
					</template>
				</Table>
			</div>
			<div class='contentMiddle'>
				<Table :columns="filColumn" :data="filData" style="margin-top: 5px;" :loading='loading'></Table>
			</div>
			<div class='contentBottom1' style="position: relative;">
          <div  class="flowTitle">流转详情</div>
          <div class="flowDetail" @click="handleDetail">更多<Icon type="ios-more" /></div>
          <div class="comWrapper" v-if='bottleShow'>
                <!-- <div style="position: absolute;left: 0;width: 100%;height: 210px;top:50%;margin-top: -105px;border-radius: 50%;border: 2px #008000 solid;"></div> -->
               <div style="position: absolute;left: 0px;top: 100px;">
                    <div  class="conStep startStep" :class="[flowInfos.highLightFlag=='start'?'point point-flicker':'']">
                        <div  class="conConcent">
                          <div style="color: #000;margin-top: 50px;" v-if='!flowInfos.start.id'>充装站</div>
                          <div>
                             <span>{{flowInfos.start.flowInfo}}</span>
                          </div>
                          <div>{{flowInfos.start.personLiableName}}</div>
                             <div>{{flowInfos.start.carNumber}}</div>
                          <div>{{flowInfos.start.createTime?flowInfos.start.createTime.substring(0,16):''}}</div>

                          <div @click='showMapClick(flowInfos.start)' :title='flowInfos.start.address' class="mapWrapper">
                              <img src="../../../src/assets/images/ad.png" alt="" v-if='flowInfos.start.lng'/>
                             <span>{{flowInfos.start.address}}</span>
                          </div>
                        </div>

                    </div>
                     <div class='' style="position: absolute;right:-35px;bottom: -30px;" v-if='flowInfos.start.hasArrow'>
                        <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(-150deg);margin-right:-17px;margin-bottom:0;" v-if='bottomCount==2'/>
                        <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(-155deg);margin-right:-125px;margin-bottom: 5px;" v-else-if='bottomCount==1'/>
                        <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(180deg);position: absolute;left:250px;bottom:60px;" v-else-if='bottomCount==0'/>
                        <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(-145deg);" v-else/>
                    </div>
                </div>

                <div style="position: absolute;right: 0px;top: 100px;" >

                    <div  class="conStep endStep" :class="[flowInfos.highLightFlag=='end'?'point point-flicker':'']">
                         <div  class="conConcent">
                           <div style="color: #000;margin-top: 50px;" v-if='!flowInfos.end.id'>用户</div>
                           <div>
                              <span>{{flowInfos.end.flowInfo}}</span>
                           </div>
                           <div>{{flowInfos.end.personLiableName}}</div>
                              <div>{{flowInfos.end.carNumber}}</div>
                           <div>{{flowInfos.end.createTime?flowInfos.end.createTime.substring(0,16):''}}</div>

                           <div @click='showMapClick(flowInfos.end)' :title='flowInfos.end.address' class="mapWrapper">
                               <img src="../../../src/assets/images/ad.png" alt="" v-if='flowInfos.end.lng'/>
                              <span>{{flowInfos.end.address}}</span>
                           </div>
                         </div>

                    </div>
                    <div class='' style="position: absolute;left: -37px;top: -15px;" v-if='flowInfos.end.hasArrow'>

                       <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(25deg);margin-top:15px;margin-left: -125px;" v-if="topCount==1"/>
                       <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(25deg);margin-top:5px;margin-left: -28px;" v-else-if="topCount==2"/>
                       <img src="../../assets/images/arrow1.png" alt="" style="position: absolute;right:250px;top:60px;" v-else-if='topCount==0'/>
                       <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(40deg);" v-else/>
                    </div>
                </div>

               <div style="display: flex;justify-content:center;position: absolute;left: 130px;right: 130px;top: 10px;">
                  <div style="display: flex;position: relative;" v-for='(item,index) in topArray' :key='item' :style="'width:'+ 100/topCount + '%'" v-if='topArray.length'>
                      <div class='' style="position: absolute;left: -25px;top:40px;" v-if='item.hasArrow'>
                         <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(-40deg);margin-top: 32px;margin-left: 18px;" v-if='topCount==3&&index==0'/>
                         <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(0deg);" v-else-if="topCount==3&&index!=0"/>
                         <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(-30deg);margin-top: 40px;margin-left: 36px;" v-else-if="topCount==2&&index==0"/>
                         <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(0deg);" v-else-if="topCount==2&&index!=0"/>
                         <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(-25deg);margin-top:40px;margin-left: 110px;" v-else-if="topCount==1"/>
                      </div>
                       <div  class="conStep topStep" :class="[item.step=='firstStartMiddle'?'danderStep':'',flowInfos.highLightFlag==item.step?'point point-flicker':'',item.flowType==6?'centerStep':'']">
                            <div  class="conConcent">

                              <div>
                                 <span>{{item.flowInfo}}</span>
                              </div>
                              <div>{{item.personLiableName}}</div>
                                 <div>{{item.carNumber}}</div>
                              <div>{{item.createTime?item.createTime.substring(0,16):''}}</div>

                              <div @click='showMapClick(item)' :title='item.address' class="mapWrapper">
                                  <img src="../../../src/assets/images/ad.png" alt="" v-if='item.lng'/>
                                 <span>{{item.address}}</span>
                              </div>
                            </div>

                       </div>
                  </div>


                </div>


               <div style="display: flex;justify-content:center;position: absolute;left: 130px;right: 130px;bottom: 10px;">
                  <div style="display: flex;position: relative;" v-for='(item,index) in bottomArray' :key='item' :style="'width:'+ 100/bottomCount + '%'" v-if='bottomArray.length'>
                       <div class='' style="position: absolute;right:-25px;bottom:25px;" v-if='item.hasArrow'>
                         <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(145deg);margin-bottom: 45px;margin-right: 14px;" v-if='bottomCount==3&&index==2'/>
                         <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(180deg);" v-else-if='bottomCount==3&&index!=2'/>
                         <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(150deg);margin-right: 45px;margin-bottom: 35px;" v-else-if='bottomCount==2&&index==1'/>
                         <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(180deg);" v-else-if='bottomCount==2&&index!=1'/>
                         <img src="../../assets/images/arrow1.png" alt="" style="transform: rotate(155deg);margin-bottom:40px;margin-right:110px;" v-else-if='bottomCount==1'/>
                       </div>
                       <div style="" class="conStep bottomStep" :class="[item.step=='thirdEndMiddle'?'danderStep':'',flowInfos.highLightFlag==item.step?'point point-flicker':'',item.flowType==6?'centerStep':'']">
                            <div  class="conConcent">

                              <div>
                                 <span>{{item.flowInfo}}</span>
                              </div>
                              <div>{{item.personLiableName}}</div>
                                 <div>{{item.carNumber}}</div>
                              <div>{{item.createTime?item.createTime.substring(0,16):''}}</div>

                              <div @click='showMapClick(item)' :title='item.address' class="mapWrapper">
                                  <img src="../../../src/assets/images/ad.png" alt="" v-if='item.lng'/>
                                 <span>{{item.address}}</span>
                              </div>
                            </div>
                       </div>

                  </div>


                </div>



          </div>


			</div>




		<div class="closeBtn" @click='handleClose'><Icon type="md-close" /></div>
	    <div class="reloadInfo" @click="reloadClick">
	       <img src="@/assets/images/reload.png" alt="" />
	    </div>
		</div>
		<cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee' ></cylMap>
		<cylinderDetail v-if='detailInfo' @detailInfo='detailInfoMethods' :details='details'></cylinderDetail>
	</div>

</template>

<script>
	import Bus from '@/public/bus';
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylMap from './cylMap';
	import cylinderDetail from './cylinderDetail1';
	export default {
		name: 'cylinderInfo',
		components: {
			cylMap,
			cylinderDetail
		},
		data() {
			return {
				loading:false,
				details:{},
				detailInfo:false,
				filData:[],
				infoHeight:'auto',
		        topArray:[],
		        bottomArray:[],
				flowInfos:{},
		        topCount:1,
		        bottomCount:1,
				userData: (JSON.parse(this.$store.state.userData)),
				switchs:true,
				infoData2:[],
				bottleShow:false,
				langs: '',
				lats: '',
				addressInfo: false,
				formInfo: {
					cylTags: '',
					cylcodes: '',
					cylNumbers: '',
					cylSites: "",
					cylSpecs: '',
					cylStatus: '',
					cylCircul: null,
					cylLiable: '',
					dateTime:[],
					cylCircle:0,
					cylCirculName:'',
					cylLiableName:'',
          			cylId:''
				},
				startTime:null,
				endTime:null,
				infoColumn: [

					{
						title: '订单编号',
						align: 'center',
						key: 'orderCode',
						tooltip: true,
						slot:'orderCode'
					},
					{
						title: '用户姓名',
						align: 'center',
						key: 'orderUserName',

						tooltip: true,
					},
					{
						title: '订单完结时间',
						align: 'center',
						key: 'orderFinishTime',
						tooltip: true,
					},
					{
						title: '地址',
						align: 'center',
						key: 'orderUserAddress',

						tooltip: true,
					},

					{
						title: '联系电话',
						align: 'center',
						key: 'orderUserPhone',
						width:120,
						tooltip: true,
					},
//					{
//						title: '使用天数',
//						align: 'center',
//						key: 'diff',
//						width:90,
//
//					},
					{
						title: '配送员姓名',
						align: 'center',
						key: 'orderDeliveryUserName',

						tooltip: true,
					},
          {
          	title: '操作',
          	align: 'center',
          	key: 'bottleDeliveryStatusName',
            width:100,
          	tooltip: true,
          },

				],
				infoData: [],

				filColumn:[
					{
						title: '充装单位代码',
						key: 'stationCode',
						width: 140,
						align: 'center'
					},
					{
						title: '充装单位名称',
						key: 'stationName',
						width: 280,
						align: 'center'
					},
					{
						title: '秤号',
						key: 'scaleNumber',
						width: 70,
						align: 'center'
					},

					{
						title: '充装开始时间',
						key: 'beginTime',
						width: 170,
						align: 'center',

					},
					{
						title: '充装结束时间',
						key: 'endTime',
						width: 170,
						align: 'center'
					},
//					{
//						title: '工号',
//						key: 'operatorCode',
//						width: 140,
//						align: 'center'
//					},
//					{
//						title: '操作工姓名',
//						key: 'operatorName',
//						// fixed:'right',
//						width: 140,
//						align: 'center'
//					},
					{
						title: '实际同步时间',
						key: 'actualTime',
						width: 170,
						align: 'center',
					},
					{
						title: '充装介质',
						key: 'fillMedium',
						width: 140,
						align: 'center',
					},
					{
						title: '实际充装量',
						key: 'realFill',
						width: 140,
						align: 'center',
					},
					{
						title: '停装模式',
						key: 'stopFillMode',
						width: 140,
						align: 'center',
					},
					{
						title: '充装模式',
						key: 'fillMode',
						width: 140,
						align: 'center',
					},
					{
						title: '设定量',
						key: 'setCapacity',
						width: 140,
						align: 'center',
					},
					{
						title: '充前量',
						key: 'beforeFill',
						width: 140,
						align: 'center',
					},
					{
						title: '充后量',
						key: 'afterFill',
						width: 140,
						align: 'center',
					},
					{
						title: '溢出量',
						key: 'overflow',
						width: 140,
						align: 'center',
					},
				]

			}
		},
		props: {
			tags: String
		},

		methods: {
      //订单详情跳转
      handleOrderInfo(v){
         let newPath=this.$route.path;
        if(newPath.indexOf('/merchandiseOrder/orderInfo')!=-1){
          this.$emit('infoSee', false)
        }
        this.$router.push('/merchandiseOrder/orderInfo' + '/' + v + '/1');


      },
      //查看更多
			handleDetail(){
			this.detailInfo=true;
			},
      //关闭更多
		  detailInfoMethods(data){
		  	this.detailInfo=data;
		  },
      //刷新
	      reloadClick(){

	          this.getCylinderInfo(this.tags)
	      },
	      //逆地理编码
	      regeocoder(lnglatXY,detail) {

	      	let that = this
	      	//逆地理编码
	      	var geocoder = new AMap.Geocoder({
	      		radius: 1000,
	      		extensions: "all"
	      	});
	      	geocoder.getAddress(lnglatXY, function(status, result) {
	      		if(status === 'complete' && result.info === 'OK') {
	      			var address = result.regeocode.formattedAddress; //返回地址描述
	            that.flowInfos[detail].address=address;
	            that.flowInfos[detail]=Object.assign({}, that.flowInfos[detail])

	      		}
	      	});
	      },
      //显示地图
			showMapClick(item){
				if(item.lng){
					this.langs = item.lng;
					this.lats =item.lat;

					this.addressInfo = true;
				}

			},
			handleAdSee(data) {
				this.addressInfo = data
			},
      //获取详情
			getCylinderInfo(bottleCode) {
				this.bottleShow=false;
		        this.topArray=[];
		        this.bottomArray=[];
		        this.filData=[];
		        this.infoData=[];
		        this.loading=true;
				_http.http1('get', pathUrls.bottleGetBottleDetail2 +'?bottleCode='+bottleCode, {

				}, 'form').then((res) => {
					  this.loading=false;
			          this.topArray=[];
			          this.bottomArray=[];
					if(res.code === 0) {
						this.bottleShow=true
						if(res.bottleDetail.bottleInfo) {

							let infos = res.bottleDetail.bottleInfo;
							this.details=res.bottleDetail.bottleInfo;
							this.formInfo.cylTags = infos.bottleNfcId;
							this.formInfo.cylcodes = infos.bottleCode;
							this.formInfo.cylNumbers = infos.bottleFactoryCode;
							this.formInfo.cylSites = infos.createDeptName;
							this.formInfo.cylSpecs = infos.bottleSpecification;
							this.formInfo.cylLiable = infos.bottlePersonLiableName;
							this.formInfo.cylCircul = infos.bottleFlowInformation;
							this.formInfo.cylLiableName= infos.bottlePersonLiableName;
              				this.formInfo.cylId= infos.bottleId;
							switch(infos.bottleStatus) {
								case -1:
									this.formInfo.cylStatus = "删除";
									break;
								case 1:
									this.formInfo.cylStatus = "正常";
									break;
								case 2:
									this.formInfo.cylStatus = "报废";
									break;
								case 3:
									this.formInfo.cylStatus = "注销";
									break;
								case 4:
									this.formInfo.cylStatus = "停用";
									break;
								case 5:
									this.formInfo.cylStatus = "转出";
									break;
								case 6:
									this.formInfo.cylStatus = "回退";
									break;
							}
							switch(infos.bottleFlowInformation) {
								case 1:
									this.formInfo.cylCirculName = "在库";


									break;
								case 2:
									this.formInfo.cylCirculName = "在途";

									break;
								case 3:
									this.formInfo.cylCirculName = "在用";

									break;
								case 4:
									this.formInfo.cylCirculName = "在途";

									break;
								case 5:
									this.formInfo.cylCirculName = "在库";

									break;
							}
						}
						let flowInfos=res.bottleDetail.flowInfos;



							if(!flowInfos.end){
								flowInfos.end={
									createTime: "",
									id:'',
									lng: null,
									lat: null,
									address: "",
									flowInfo:'',
									carNumber:'',
                  newAdress:''
								}
							}
							if(!flowInfos.start){
								flowInfos.start={
									createTime: "",
									id:'',
									lng: null,
									lat: null,
									address: "",
									flowInfo:'',
									carNumber:'',
                  newAdress:''
								}
							}
						// let flowInfos={
						// 	start:{
						// 		createTime: "2020-07-18 23:58 23",
						// 		flowType: '在库',
						// 		lng: "120.21714606547579",
						// 		lat: "30.18638558964864",
						// 		address: "浙江省杭州市滨江区春波路",
						// 		flowInfo:'在库',
      //           carNumber:'',
						// 		name:'firstStartMiddle',
						// 		personLiableName:'李白',
      //          id:23,
      //            hasArrow:true
						// 	},
						// 	firstStartMiddle:{
						// 		createTime: "2020-07-18 23:58 23",
						// 		flowType: '在库',
						// 		lng: "120.21714606547579",
						// 		lat: "30.18638558964864",
						// 		address: "浙江省杭州市滨江区春波路",
						// 		flowInfo:'在库',
						// 		carNumber:'浙A00098',
      //          name:'firstStartMiddle',
      //          personLiableName:'李白',
      //          hasArrow:true
						// 	},
						// 	secondStartMiddle:{
						// 		createTime: "2020-07-18 23:58 23",
						// 		flowType: '6',
						// 		lng: "120.21714606547579",
						// 		lat: "30.18638558964864",
						// 		address: "浙江省杭州市滨江区春波路",
						// 		flowInfo:'在库',
						// 		carNumber:'',
      //           name:'secondStartMiddle',
      //           personLiableName:'李白',
      //          hasArrow:true
						// 	},
      //         thirdStartMiddle:{
      //         	createTime: "2020-07-18 23:58 23",
      //         	flowType: '在库',
      //         	lng: "120.21714606547579",
      //         	lat: "30.18638558964864",
      //         	address: "浙江省杭州市滨江区春波路",
      //         	flowInfo:'在库',
      //         	carNumber:'浙A00098',
      //            name:'trirdStartMiddle',
      //            personLiableName:'李白',
      //             hasArrow:true
      //         },
						// 		firstEndMiddle:{
						// 			createTime: "2020-07-18 23:58 23",
						// 			flowType: '在库',
						// 			lng: "120.21714606547579",
						// 			lat: "30.18638558964864",
						// 			address: "浙江省杭州市滨江区春波路",
						// 			flowInfo:'在库',
						// 			carNumber:'浙A00098',
      //             name:'firstEndMiddle',
      //             personLiableName:'李白',
      //             hasArrow:true
						// 		},
						// 	secondEndMiddle:{
						// 			createTime: "2020-07-18 23:58 23",
						// 			flowType: '6',
						// 			lng: "120.21714606547579",
						// 			lat: "30.18638558964864",
						// 			address: "浙江省杭州市滨江区春波路",
						// 			flowInfo:'在库',
						// 			carNumber:'',
      //             name:'secondEndMiddle',
      //             personLiableName:'李白',
      //             hasArrow:true
						// 	},
      //         thirdEndMiddle:{
      //         		createTime: "2020-07-18 23:58 23",
      //         		flowType: '在库',
      //         		lng: "120.21714606547579",
      //         		lat: "30.18638558964864",
      //         		address: "浙江省杭州市滨江区春波路",
      //         		flowInfo:'在库',
      //         		carNumber:'浙A00098',
      //             name:'thirdEndMiddle',
      //             personLiableName:'李白',
      //             hasArrow:true
      //         },
						// 	end:{
						// 			createTime: "2020-07-18 23:58 23",
						// 			flowType: '在库',
						// 			lng: "120.21714606547579",
						// 			lat: "30.18638558964864",
						// 			address: "浙江省杭州市滨江区春波路",
						// 			flowInfo:'在库',
      //             carNumber:'',
      //             id:'2',
      //             personLiableName:'李白',
      //             hasArrow:true

						// 	},
						// 	highLightFlag:'end'
						// }
            if(flowInfos.firstStartMiddle){
                flowInfos.firstStartMiddle.step='firstStartMiddle'
                 this.topArray.push(flowInfos.firstStartMiddle)
            }
           if(flowInfos.secondStartMiddle){
             flowInfos.secondStartMiddle.step='secondStartMiddle'
                this.topArray.push(flowInfos.secondStartMiddle)
           }
           if(flowInfos.thirdStartMiddle){
             flowInfos.thirdStartMiddle.step='thirdStartMiddle'
                this.topArray.push(flowInfos.thirdStartMiddle)
           }
           this.topCount=this.topArray.length;
            if(flowInfos.thirdEndMiddle){
              flowInfos.thirdEndMiddle.step='thirdEndMiddle'
              this.bottomArray.push(flowInfos.thirdEndMiddle)
            }
            if(flowInfos.secondEndMiddle){
              flowInfos.secondEndMiddle.step='secondEndMiddle'
              this.bottomArray.push(flowInfos.secondEndMiddle)
            }
            if(flowInfos.firstEndMiddle){
               flowInfos.firstEndMiddle.step='firstEndMiddle'
              this.bottomArray.push(flowInfos.firstEndMiddle)
            }


            this.bottomCount=this.bottomArray.length;

						this.flowInfos=flowInfos;
              for(let item in this.flowInfos){

                  if(this.flowInfos[item].lng&&(!this.flowInfos[item].address||this.flowInfos[item].address=='未知区域')){
                      this.flowInfos[item].newAdress='';
                    let lnglatXY=[this.flowInfos[item].lng,this.flowInfos[item].lat]
                      this.regeocoder(lnglatXY,item)

                  }

              }
                setTimeout(()=>{
                    if(this.flowInfos.highLightFlag){
                      this.highStepData=this.flowInfos[this.flowInfos.highLightFlag]
                    }else{
                      this.highStepData={
                          createTime: "",
                          id:'',
                          lng: null,
                          lat: null,
                          address: "",
                          flowInfo:'',
                          carNumber:'',
                          newAdress:''
                      }
                    }
                },300)


						if(res.bottleDetail.xkFillInfoList){
							this.filData=res.bottleDetail.xkFillInfoList;
						}

//						this.infoData2 =res.bottleDetail.flowInfos;
//						this.formInfo.cylCircle=this.infoData2.length;
						for(let item of res.bottleDetail.orders) {
							item.diff = parseInt((new Date().getTime() - new Date(item.orderFinishTime)) / (1000 * 60 * 60 * 24));
              // item.bottleDeliveryStatusName=item.bottleDeliveryStatus==1?'配送':'回收';
              if(item.bottleDeliveryStatus==1){
                 item.bottleDeliveryStatusName='配送';
              }else if(item.bottleDeliveryStatus==2){
                 item.bottleDeliveryStatusName='回收';
              }
						}
						this.infoData = res.bottleDetail.orders;
						if(this.infoData.length<3){
							this.infoHeight='auto';
						}else{
							this.infoHeight=125;
						}

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
							onClose: (() => {
								this.$emit('infoSee', false)
							})
						});
					}
				})
			},
			handleClose() {
				this.$emit('infoSee', false)
			}
		},
    created(){
      this.getCylinderInfo(this.tags)
    },
		mounted() {

			this.bottleShow=false;





		}
	}
</script>

<style type="text/css" scoped>
	.mainWrapper {
		position: fixed;
		left: 200px;
		top: 65px;
		right: 0px;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1100;
		height: calc(100vh - 65px);
	}

	.main {
		background: #fff;
		width: calc(100% - 10px);
		height: calc(100% - 10px);
		/* margin: 0 0 20px 0; */
		border-radius: 4px;
    overflow-y: auto;
	}

	.topTitle {
		text-align: left;
		height: 30px;
		line-height: 30px;
	}

	.topTitle h3 {
		font-size: 12px;
		margin: 0 20px;
		font-weight: 600;
		color: #51B5EA;
		border-bottom: 1px solid #51B5EA;

	}

	.closeBtn {
		position: absolute;
		right: 35px;
		top: -8px;
		cursor: pointer;
		font-size: 30px;
		color: #1296db;
		font-weight: 600;
	}

	.contentTop {
		text-align: left;
		padding-top: 10px;
	}

	.contentMiddle {
		padding: 0 20px;
	}

	.contentBottom>>>th,
	.contentMiddle>>>th {
		font-size: 12px;
		background: #51B5EA;
		color: #fff;
		padding: 4px 0;
	}
	.contentBottom{
		margin-top: 10px;
		padding: 0 20px;
	}
	.contentBottom>>>td,
	.contentMiddle>>>td {
		font-size: 12px;
		height: 32px;
	}

	.contentBottom1 {
		margin:10px 20px 0;
   		min-height: 40px;
		/* overflow-x:auto ; */

	}

	.main>>>.ivu-form-item {
		margin-bottom: 6px;
	}

	.main>>>.ivu-input {
		height: 28px;
	}
	.circleCylinder{
		width: 220px;
		height: 220px;
		background: #fff url('~@/assets/images/qp02.png') no-repeat center;
		background-size: 220px 220px;
		padding:65px 50px;
		font-size: 12px;
		position: relative;
	}
	.circleCylinderGree{
		width: 220px;
		height: 220px;
		background: #fff url('~@/assets/images/gpgree.png') no-repeat center;
		background-size: 220px 220px;
		padding:65px 50px;
		font-size: 12px;
		position: relative;
	}
	.main .itemStyle1{
		color:rgb(69, 175, 34);
	}
	.main .itemStyle2{
		color:rgb(0, 149, 255);
	}
	.commonStyle{
		color:#cc1abe;
	}
	.searchForm>>>label{
		width: 30px!important;
	}
	.searchForm>>>.ivu-form-item-content{
		margin-left: 30px!important;
	}
	.cylSites>>>.el-cascader{
		line-height: 30px;
	}
	.cylSites>>>.el-input__inner{
		height: 30px;
		line-height: 30px;
	}
	.main>>>.ivu-input[disabled]{
		color:#515a6e;
	}
	.main>>>.ivu-input-wrapper{
		width: 150px;
	}
	.dateLabel>>>.ivu-input-wrapper{
		width: 200px;
	}



	.comWrapper{
		position: relative;
		width: 900px;
		height: 340px;
		margin: 0 auto;

    padding: 0 10px;
    /* background: #ccc; */

	}
  .comWrapper img{
    width: 55px;
    height: 40px;
  }
	.conConcent{
     line-height: 18px;
    font-size: 12px;
    padding: 6px 0;
    color: #000;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
    left: 0;
    top:0;
  }
  .comWrapper .conConcent img{
    width: 20px;
    height: 20px;
  }
    .mapWrapper{
      cursor: pointer;
       height: 24px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      width: 90%;
      padding-left: 5px;
    }

.reloadInfo{
  position: absolute;
  right: 75px;
  top: 5px;
  cursor: pointer;

}
.reloadInfo img{
  width: 20px;
  height: 20px;
}

.comWrapper .point {
   /* width: 130px;
    height: 130px; */
    background-color:#47f907;
    /* position: absolute;
    right:0px;
    top: 24px; */
    border-radius: 50%;
     /* box-shadow: 0 0 5px   rgba(0,0,0,0.4); */
  }

  /* 设置动画前颜色 */
 .comWrapper .point-flicker:after {
    background-color:#ff0;
  }

  /* 设置动画后颜色 */
  .point-flicker:before {
    background-color:#A0D911;
  }

  /* 设置动画 */
  .point-flicker:before,
  .point-flicker:after {
    content: '';
   width: 130px;
    height:130px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -65px;
    margin-top: -65px;
    border-radius: 50%;
    /* CSS3 animation 属性 网址 */
    /* https://www.w3school.com.cn/cssref/pr_animation.asp */
    animation: warn 1.5s ease-out 0s infinite;
  }

  /* @keyframes 规则用于创建动画。在 @keyframes 中规定某项 CSS 样式，就能创建由当前样式逐渐改为新样式的动画效果。 */
  @keyframes warn {
    0% {
      transform: scale(0.7);
      opacity: 1;
    }

    30% {
      opacity: 1;
    }

    100% {
      transform: scale(1.3);
      opacity: 0;
    }
    }
    .flowTitle{
      position: absolute;
      left: 10px;
      top:0;
      font-weight: 600;
      color: #51B5EA;
    }
    .conStep{
      width: 125px;
      height: 125px;
      box-shadow: 0 0 3px   rgba(0,0,0,0.3);
      border-radius: 50%;
      position: relative;
    }
    .startStep{
      background:#ADC6FF ;
      width: 140px;
      height: 140px;
    }
    .startStep .conConcent,.endStep .conConcent{
      min-height: 10px;
      line-height: 24px;
    }
    .endStep{
      background: #1cb0d278;
      width: 140px;
      height: 140px;
    }

    .topStep{
      background:#e6a41063;
      margin: 0 auto;

    }

    .bottomStep{
      background:#e6a41063;
      margin: 0 auto;

    }
    .centerStep{
      /* background: #0a12754d; */
      background:#a5e6f1;
      width: 105px;
      height: 105px;
      line-height: 20px;
      margin: auto;
    }
    .danderStep{
      width: 115px;
      height: 115px;
      margin: auto;
      background:#4de87d57;
    }
   .danderStep .mapWrapper{
     width: 88%;
     padding-left: 8px;
   }
   .flowDetail{
      position: absolute;
      right: 10px;
      top:0;
      font-weight: 600;
      color:#FF00FF;
      cursor: pointer;
      width: 60px;
      text-align: right;
      height: 40px;
    }
    .orderCode{
      cursor: pointer;
      color:#3aa72d;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      display: inline-block;
    }
</style>
