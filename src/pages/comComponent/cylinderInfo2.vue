<template>
	<div class='mainWrapper' v-if='bottleShow'>
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
						<!--<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }"  v-model="formInfo.cylSites" @change='organizeSelected' style="width: 186px;"></el-cascader>-->
					</FormItem>
					<FormItem label="钢瓶规格">
						<Input v-model="formInfo.cylSpecs" disabled/>
					</FormItem>
				<!-- 	<FormItem label="流转次数">
						<Input v-model="formInfo.cylCircle" disabled/>
					</FormItem> -->

					<FormItem label="流转状态">
						<Input v-model="formInfo.cylCirculName" disabled/>
						<!--<Select v-model="formInfo.cylCircul" style="width: 150px;" clearable>
							<Option :value="1">在库</Option>
							<Option :value="2">在途</Option>
							<Option :value="3">在用</Option>
							<Option :value="4">空瓶在途</Option>
							<Option :value="5">空瓶在库</Option>
						</Select>-->
					</FormItem>

				</Form>
			</div>
			<div class='contentMiddle'>
				<Table :columns="infoColumn" :data="infoData" height="250"></Table>
			</div>

			<div class='contentBottom1' style="position: relative;">
          <div style="position: absolute;left: 10px;top:0;font-weight: 600;color: #51B5EA;">流转详情</div>
				<div  class='comWrapper' :class="[flowInfoNum==1?'oneStyle':'',flowInfoNum==2?'twoStyle':'',flowInfoNum==3&&flowInfoNum1!=6?'threeStyle':'',
					flowInfoNum1==4?'fourStyle':'',flowInfoNum1==5?'fiveStyle':'',flowInfoNum1==6&&flowInfoNum==3?'sixStyle':'',
          flowInfoNum1==6&&flowInfoNum!=3?'sevenStyle':'']">

					<div class='startStep comStep' v-if='highNum!=1'>
            <div style="color: #000;margin-top: 50px;" v-if='!flowInfos.start.id'>充装站</div>
						<div >
							<span>{{flowInfos.start.flowInfo}}</span>
						</div>
						<div>{{flowInfos.start.personLiableName}}</div>

						<div>{{flowInfos.start.createTime?flowInfos.start.createTime.substring(0,16):''}}</div>
            <div>{{flowInfos.start.carNumber}}</div>

            <div @click='showMapClick(flowInfos.start)' class="mapWrapper newWrapper" :title='flowInfos.start.address'>
               <img src="../../../src/assets/images/ad.png" alt="" v-if='flowInfos.start.lng'/>
              <span>{{flowInfos.start.address}}</span>
            </div>
					</div>
					<div class='highStep startStep' v-if='highNum==1' style="top:80px">
						<div class='highStepCircle'>
							<div>
								<span>{{highStepData.flowInfo}}</span>

							</div>
							<div>{{highStepData.personLiableName}}</div>

							<div>{{highStepData.createTime?highStepData.createTime.substring(0,16):''}}</div>
               <div>{{highStepData.carNumber}}</div>
							<div @click='showMapClick(highStepData)' class="mapWrapper highMapWrapper" :title='highStepData.address'>
                  <img src="../../../src/assets/images/ad.png" alt="" v-if='highStepData.lng'/>
                  <span>{{highStepData.address}}</span>
              </div>

						</div>
					</div>
					<div class='startArrow comArrow' v-if='sNum==1'><img src="../../assets/images/arrow.png" alt=""/></div>

					<div class='firstStartMiddle comStep' v-if='flowInfos.firstStartMiddle&&highNum!=2'>
						<div>
							<span>{{flowInfos.firstStartMiddle.flowInfo}}</span>

						</div>
						<div>{{flowInfos.firstStartMiddle.personLiableName}}</div>

						<div>{{flowInfos.firstStartMiddle.createTime?flowInfos.firstStartMiddle.createTime.substring(0,16):''}}</div>
             <div>{{flowInfos.firstStartMiddle.carNumber}}</div>

             <div @click='showMapClick(flowInfos.firstStartMiddle)' class="mapWrapper newWrapper" :title='flowInfos.firstStartMiddle.address'>
                <img src="../../../src/assets/images/ad.png" alt="" v-if='flowInfos.firstStartMiddle.lng'/>
               <span>{{flowInfos.firstStartMiddle.address}}</span>
             </div>
					</div>



					<div class='highStep firstStartMiddle' v-if='highNum==2'>
						<div class='highStepCircle'>
							<div>
								<span>{{highStepData.flowInfo}}</span>

							</div>
							<div>{{highStepData.personLiableName}}</div>

							<div>{{highStepData.createTime?highStepData.createTime.substring(0,16):''}}</div>
						   <div>{{highStepData.carNumber}}</div>
							<div @click='showMapClick(highStepData)' class="mapWrapper highMapWrapper" :title='highStepData.address'>
						      <img src="../../../src/assets/images/ad.png" alt="" v-if='highStepData.lng'/>
						      <span>{{highStepData.address}}</span>
						  </div>

						</div>
					</div>



					<div class='firstStartMiddleArrow comArrow' v-if='sfNum==1'><img src="../../assets/images/arrow1.png" alt="" /></div>

					<div class='secondStartMiddle comStep' v-if='flowInfos.secondStartMiddle&&highNum!=3'>
						<div>
							<span>{{flowInfos.secondStartMiddle.flowInfo}}</span>
						</div>
						<div>{{flowInfos.secondStartMiddle.personLiableName}}</div>

						<div>{{flowInfos.secondStartMiddle.createTime?flowInfos.secondStartMiddle.createTime.substring(0,16):''}}</div>
             <div>{{flowInfos.secondStartMiddle.carNumber}}</div>
             <div @click='showMapClick(flowInfos.secondStartMiddle)' class="mapWrapper newWrapper" :title='flowInfos.secondStartMiddle.address'>
                <img src="../../../src/assets/images/ad.png" alt="" v-if='flowInfos.secondStartMiddle.lng'/>
               <span>{{flowInfos.secondStartMiddle.address}}</span>
             </div>
					</div>


					<div class='highStep secondStartMiddle' v-if='highNum==3'>
						<div class='highStepCircle'>
							<div>
								<span>{{highStepData.flowInfo}}</span>

							</div>
							<div>{{highStepData.personLiableName}}</div>

							<div>{{highStepData.createTime?highStepData.createTime.substring(0,16):''}}</div>
						   <div>{{highStepData.carNumber}}</div>
							<div @click='showMapClick(highStepData)' class="mapWrapper highMapWrapper" :title='highStepData.address'>
						      <img src="../../../src/assets/images/ad.png" alt="" v-if='highStepData.lng'/>
						      <span>{{highStepData.address}}</span>
						  </div>

						</div>
					</div>




					<div class='secondStartMiddleArrow comArrow' v-if='ssNum==1'><img src="../../assets/images/arrow.png" alt="" /></div>

					<div class='endStep comStep' v-if='highNum!=4'>
            <div style="color: #000;margin-top: 50px;" v-if='!flowInfos.end.id'>用户</div>
						<div>
							<span>{{flowInfos.end.flowInfo}}</span>
            </div>
						<div>{{flowInfos.end.personLiableName}}</div>

						<div>{{flowInfos.end.createTime?flowInfos.end.createTime.substring(0,16):''}}</div>
            <div>{{flowInfos.end.carNumber}}</div>
            <div @click='showMapClick(flowInfos.end)' class="mapWrapper newWrapper" :title='flowInfos.end.address'>
                <img src="../../../src/assets/images/ad.png" alt="" v-if='flowInfos.end.lng'/>
               <span>{{flowInfos.end.address}}</span>
            </div>

					</div>


					<div class='highStep endStep' v-if='highNum==4' style="top:80px">
						<div class='highStepCircle'>
							<div>
								<span>{{highStepData.flowInfo}}</span>

							</div>
							<div>{{highStepData.personLiableName}}</div>

							<div>{{highStepData.createTime?highStepData.createTime.substring(0,16):''}}</div>
						   <div>{{highStepData.carNumber}}</div>
							<div @click='showMapClick(highStepData)' class="mapWrapper highMapWrapper" :title='highStepData.address'>
						      <img src="../../../src/assets/images/ad.png" alt="" v-if='highStepData.lng'/>
						      <span>{{highStepData.address}}</span>
						  </div>

						</div>
					</div>




					<div class='endArrow comArrow' v-if='eNum==1'><img src="../../assets/images/arrow.png" alt="" /></div>


					<div class='firstEndMiddle comStep' v-if='flowInfos.firstEndMiddle&&highNum!=5'>
						<div>
							<span>{{flowInfos.firstEndMiddle.flowInfo}}</span>

						</div>
						<div>{{flowInfos.firstEndMiddle.personLiableName}}</div>

						<div>{{flowInfos.firstEndMiddle.createTime?flowInfos.firstEndMiddle.createTime.substring(0,16):''}}</div>
             <div>{{flowInfos.firstEndMiddle.carNumber}}</div>
             <div @click='showMapClick(flowInfos.firstEndMiddle)' class="mapWrapper newWrapper" :title='flowInfos.firstEndMiddle.address'>
                 <img src="../../../src/assets/images/ad.png" alt="" v-if='flowInfos.firstEndMiddle.lng'/>
                <span>{{flowInfos.firstEndMiddle.address}}</span>
             </div>
					</div>



					<div class='highStep firstEndMiddle' v-if='highNum==5'>
						<div class='highStepCircle'>
							<div>
								<span>{{highStepData.flowInfo}}</span>

							</div>
							<div>{{highStepData.personLiableName}}</div>

							<div>{{highStepData.createTime?highStepData.createTime.substring(0,16):''}}</div>
						   <div>{{highStepData.carNumber}}</div>
							<div @click='showMapClick(highStepData)' class="mapWrapper highMapWrapper" :title='highStepData.address'>
						      <img src="../../../src/assets/images/ad.png" alt="" v-if='highStepData.lng'/>
						      <span>{{highStepData.address}}</span>
						  </div>

						</div>
					</div>


					<div class='firstEndMiddleArrow comArrow' v-if='efNum==1'><img src="../../assets/images/arrow1.png" alt=""/></div>


					<div class='secondEndMiddle comStep' v-if='flowInfos.secondEndMiddle&&highNum!=6'>
						<div>
							<span>{{flowInfos.secondEndMiddle.flowInfo}}</span>

						</div>
						<div>{{flowInfos.secondEndMiddle.personLiableName}}</div>

						<div>{{flowInfos.secondEndMiddle.createTime?flowInfos.secondEndMiddle.createTime.substring(0,16):''}}</div>
            <div>{{flowInfos.secondEndMiddle.carNumber}}</div>
            <div @click='showMapClick(flowInfos.secondEndMiddle)' class="mapWrapper newWrapper" :title='flowInfos.secondEndMiddle.address'>
                <img src="../../../src/assets/images/ad.png" alt="" v-if='flowInfos.secondEndMiddle.lng'/>
               <span>{{flowInfos.secondEndMiddle.address}}</span>
            </div>
					</div>


					<div class='highStep secondEndMiddle' v-if='highNum==6'>
						<div class='highStepCircle'>
							<div>
								<span>{{highStepData.flowInfo}}</span>

							</div>
							<div>{{highStepData.personLiableName}}</div>

							<div>{{highStepData.createTime?highStepData.createTime.substring(0,16):''}}</div>
						   <div>{{highStepData.carNumber}}</div>
							<div @click='showMapClick(highStepData)' class="mapWrapper highMapWrapper" :title='highStepData.address'>
						      <img src="../../../src/assets/images/ad.png" alt="" v-if='highStepData.lng'/>
						      <span>{{highStepData.address}}</span>
						  </div>

						</div>
					</div>



					<div class='secondEndMiddleArrow comArrow' v-if='esNum==1'><img src="../../assets/images/arrow.png" alt="" /></div>


				</div>
			</div>




			<div class="closeBtn" @click='handleClose'>X</div>
      <div class="reloadInfo" @click="reloadClick">
      	<img src="@/assets/images/reload.png" alt="" />
      </div>
		</div>
		<cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee' ></cylMap>
	</div>

</template>

<script>
	import Bus from '@/public/bus';
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylMap from './cylMap';
	export default {
		name: 'cylinderInfo',
		components: {
			cylMap
		},
		data() {
			return {
        highNum2:0,
        esNum:0,
        efNum:0,
        eNum:0,
        ssNum:0,
        sfNum:0,
        sNum:0,
        highNum:0,
        highNum1:0,
				highNum:0,
				highStepData:{},
				flowInfoNum1:0,
				flowInfos:{},
				flowInfoNum:0,

				userData: (JSON.parse(this.$store.state.userData)),
//				arrs:[],
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
					{
						title: '使用天数',
						align: 'center',
						key: 'diff',
						width:90,

					},
					{
						title: '配送员姓名',
						align: 'center',
						key: 'orderDeliveryUserName',

						tooltip: true,
					},

				],
				infoData: [],
				infoColumn1: [{
						title: '流转类型',
						align: 'center',
						key: 'newFlow',
						tooltip: true,
					},
					{
						title: '流转时间',
						align: 'center',
						key: 'newCreateTime',
						tooltip: true,
						sortable: true,

					},
					{
						title: '责任人',
						align: 'center',
						key: 'personLiableName',
						tooltip: true,
					},
					{
						title: '车牌号',
						align: 'center',
						key: 'carNumber',
						tooltip: true,
					},
					{
						title: '流转地点',
						align: 'center',
						key: 'address',

						tooltip: true,
					}, {
						title: '地图',
						key: 'carType',
						align: 'center',
						width: '75',
						render: (h, params) => {
							let that = this
							return h('img', {
								attrs: {
									src: params.row.carType
								},
								style: {
									cursor: 'pointer'
								},
								on: {
									click() {
										that.langs = params.row.lng
										that.lats = params.row.lat
										that.addressInfo = true
									}
								}
							}, params.row.carType);

						}

					},
				],

			}
		},
		props: {
			tags: String
		},

		methods: {
      reloadClick(){
          this.highNum2=0;
          this.esNum=0;
          this.efNum=0;
          this.eNum=0;
          this.ssNum=0;
          this.sfNum=0;
          this.sNum=0;
          this.highNum=0;
          this.highNum1=0;
          this.highNum=0;
          this.highStepData={};
          this.flowInfoNum1=0;
  //			this.flowInfos={};
          this.flowInfoNum=0;
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

			getCylinderInfo(bottleCode) {
				// this.bottleShow=false;

				_http.http1('get', pathUrls.bottleGetBottleDetail2 +'?bottleCode='+bottleCode, {

				}, 'form').then((res) => {
					if(res.code === 0) {
						this.bottleShow=true
						if(res.bottleDetail.bottleInfo) {
							let infos = res.bottleDetail.bottleInfo;
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
						// 		createTime: "",
						// 		flowType: '',
						// 		lng: "",
						// 		lat: "",
						// 		address: "",
						// 		flowInfo:'',
						// 		id:2

						// 	},
						// 	firstStartMiddle:{
						// 		createTime: "2020-07-18 23:58 23",
						// 		flowType: '在库',
						// 		lng: "120.21714606547579",
						// 		lat: "30.18638558964864",
						// 		address: "浙江省杭州市滨江区春波路",
						// 		flowInfo:'在库',
						// 		carNumber:'浙A00098'
						// 	},
						// 	// secondStartMiddle:{
						// 	// 	createTime: "2020-07-18 23:58 23",
						// 	// 	flowType: '在库',
						// 	// 	lng: "120.21714606547579",
						// 	// 	lat: "30.18638558964864",
						// 	// 	address: "浙江省杭州市滨江区春波路",
						// 	// 	flowInfo:'在库',
						// 	// 	carNumber:'浙A00098'
						// 	// },
						// 		firstEndMiddle:{
						// 			createTime: "2020-07-18 23:58 23",
						// 			flowType: '在库',
						// 			lng: "120.21714606547579",
						// 			lat: "30.18638558964864",
						// 			address: "浙江省杭州市滨江区春波路",
						// 			flowInfo:'在库',
						// 			carNumber:'浙A00098'
						// 		},
						// 	secondEndMiddle:{
						// 			createTime: "2020-07-18 23:58 23",
						// 			flowType: '在库',
						// 			lng: "120.21714606547579",
						// 			lat: "30.18638558964864",
						// 			address: "浙江省杭州市滨江区春波路",
						// 			flowInfo:'在库',
						// 			carNumber:'浙A00098'
						// 	},
						// 	end:{
						// 			createTime: "2020-07-18 23:58 23",
						// 			flowType: '在库',
						// 			lng: "120.21714606547579",
						// 			lat: "30.18638558964864",
						// 			address: "浙江省杭州市滨江区春波路",
						// 			flowInfo:'在库',
						// 			carNumber:'浙A00098',
      //             id:'2'
						// 	},
						// 	highLightFlag:'end'
						// }
							if(flowInfos.highLightFlag=='start'){
								this.highNum=1
							}
							if(flowInfos.highLightFlag=='firstStartMiddle'){
								this.highNum=2
							}
							if(flowInfos.highLightFlag=='secondStartMiddle'){
								this.highNum=3
							}
							if(flowInfos.highLightFlag=='end'){
								this.highNum=4
							}
							if(flowInfos.highLightFlag=='firstEndMiddle'){
								this.highNum=5
							}
							if(flowInfos.highLightFlag=='secondEndMiddle'){
								this.highNum=6
							}
							// if(flowInfos.highLightFlag=='start'&&flowInfos.end.id){
							// 	this.highNum=7
							// }
              if(flowInfos.end.id){
                this.highNum1=1
              }else{
                this.highNum1=2
              }
              if(flowInfos.start.id){
                this.highNum2=1;
              }else{
                this.highNum2=2;
              }



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

						if(flowInfos.firstStartMiddle&&flowInfos.secondStartMiddle){
							this.flowInfoNum=1;
						}
						if((flowInfos.firstStartMiddle&&!flowInfos.secondStartMiddle)||
						(!flowInfos.firstStartMiddle&&flowInfos.secondStartMiddle)){
							this.flowInfoNum=2;
						}
						if(!flowInfos.firstStartMiddle&&!flowInfos.secondStartMiddle){
							this.flowInfoNum=3;
						}

						if(flowInfos.firstEndMiddle&&flowInfos.secondEndMiddle){
							this.flowInfoNum1=4;
						}
						if((flowInfos.firstEndMiddle&&!flowInfos.secondEndMiddle)||
						(!flowInfos.firstEndMiddle&&flowInfos.secondEndMiddle)){
							this.flowInfoNum1=5;
						}
						if(!flowInfos.firstEndMiddle&&!flowInfos.secondEndMiddle){
							this.flowInfoNum1=6;
						}
						// if(!flowInfos.firstStartMiddle&&!flowInfos.secondStartMiddle&&
						// 	!flowInfos.firstEndMiddle&&!flowInfos.secondEndMiddle){
						// 	this.flowInfoNum1=7;
						// }

            if(((this.highNum1==1&&this.highNum!=1)||(this.highNum==2||this.highNum==3))&&this.highNum2==1&&this.flowInfoNum!=3){
              this.sNum=1;
            }


             if((this.flowInfoNum==1&&this.highNum!=2)||(this.flowInfoNum==3&&this.highNum1==1&&this.highNum2==1&&this.highNum!=1)){
               this.sfNum=1;
             }





              if(this.flowInfoNum!=3&&this.highNum1==1&&((this.flowInfoNum==3&&this.highNum2==1&&this.highNum!=1)||(flowInfos.firstStartMiddle&&!flowInfos.secondStartMiddle&&this.highNum!=2)||(flowInfos.secondStartMiddle&&this.highNum!=3))){
                 this.ssNum=1;
              }


              if(this.flowInfoNum1!=6&&this.highNum1==1&&this.highNum!=4&&(flowInfos.firstEndMiddle||flowInfos.secondEndMiddle||this.highNum2==1)){
                this.eNum=1;
              }


              if((this.flowInfoNum1==4&&this.highNum!=5)||(this.flowInfoNum1==6&&this.highNum1==1&&this.highNum2==1&&this.highNum!=4)){
                this.efNum=1;
              }





              if(this.highNum2==1&&this.flowInfoNum1!=6){
                  if((flowInfos.secondEndMiddle&&this.highNum!=6)||(flowInfos.firstEndMiddle&&!flowInfos.secondEndMiddle&&this.highNum!=5)||(this.flowInfoNum1==6&&this.highNum1==1&&this.highNum!=4)){
                      this.esNum=1;
                  }
              }
						this.infoData2 =res.bottleDetail.flowInfos;
						this.formInfo.cylCircle=this.infoData2.length;
						for(let item of res.bottleDetail.orders) {
							item.diff = parseInt((new Date().getTime() - new Date(item.orderFinishTime)) / (1000 * 60 * 60 * 24));
						}
						this.infoData = res.bottleDetail.orders
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
		margin-left: 10px;
		margin-right: 10px;
		font-weight: 600;
		color: #51B5EA;
		border-bottom: 1px solid #51B5EA;
		padding: 0 10px;
	}

	.closeBtn {
		position: absolute;
		right: 35px;
		top: 1px;
		cursor: pointer;
		font-size: 20px;
		color: #1296db;
    font-weight: 600;
	}

	.contentTop {
		text-align: left;
		padding-top: 10px;
	}

	.contentMiddle {
		padding: 0 10px;
	}

	.contentBottom>>>th,
	.contentMiddle>>>th {
		font-size: 12px;
		background: #51B5EA;
		color: #fff;
	}
	.contentBottom{
		margin-top: 10px;
		padding: 0 10px;
	}
	.contentBottom>>>td,
	.contentMiddle>>>td {
		font-size: 12px;
		height: 36px;
	}

	.contentBottom1 {
		margin:10px 10px 0;

		overflow-x:auto ;

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
		width: 880px;
		height: 340px;
		margin: 0 auto;
		overflow:hidden;
	}
	.comStep{
		position: absolute;
		width: 130px;
		height: 130px;
		border-radius: 50%;
		color: #fff;
		font-weight: 600;
		padding: 5px 0;
		overflow: hidden;
    font-size: 12px;
	}
	.comStep img{
		width: 26px;
		height: 26px;
		margin-bottom: -4px;
	}

	.comArrow{
		position: absolute;
		background: #fff;
		width: 100px;
		height: 100px;
	}
	.comArrow img{
	}
	.comStep div{
		line-height: 20px;
    min-height: 10px;
	}


	.startStep{
		left: 0;
		top:105px;
		/*background: #fff url('~@/assets/images/gpgree.png') no-repeat center;*/
		background: #23b7b7;
	}
	/*完整流程*/
	.startArrow{
		left: 120px;
		top:0;


	}

	.startArrow img{
		width: 40px;
		height:80px;
		margin-top: 30px;
		transform: rotate(75deg);
	}
	.firstStartMiddle{
		left: 230px;
		top: 0;
		background:#e85a15;
	}
	.firstStartMiddleArrow{
		left: 390px;
		top:0;

	}
	.firstStartMiddleArrow img{
		width: 100px;
		height: 40px;
		margin-top: 40px;
	}
	.secondStartMiddle{
		right:230px;
		top: 0;
		background: #5ab32c;
	}
	.secondStartMiddleArrow{
		right: 120px;
		top:0;

	}
	.secondStartMiddleArrow img{
		width: 40px;
		height: 80px;
		margin-top: 35px;
		transform: rotate(125deg);
	}
	.endStep{
		right: 0;
		top:105px;
		background: #b79023;
	}
	.endArrow{
		right: 120px;
		bottom:0;

	}
	.endArrow img{
		width: 40px;
		height: 80px;
		margin-top: -10px;
		transform: rotate(-110deg);
	}
	.firstEndMiddle{
		right:230px;
		bottom: 0;
		background:  #5ab32c;
	}
	.firstEndMiddleArrow{
		left: 390px;
		bottom:0;

	}
	.firstEndMiddleArrow img{
		width: 100px;
		height: 40px;
		transform: rotate(180deg);
		margin-top: 20px;
	}
	.secondEndMiddle{
		left:230px;
		bottom: 0;
		background: #e85a15;
	}
	.secondEndMiddleArrow{
		left: 120px;
		bottom:0;

	}
	.secondEndMiddleArrow img{
		width: 40px;
		height: 80px;
		transform: rotate(-50deg);
		margin-top: -10px;
	}



	.twoStyle .firstStartMiddleArrow{
		display: none;
	}
	.twoStyle .firstStartMiddle{
		left:380px;
	}
	.twoStyle .startArrow{
		left: 170px;
	}
	.twoStyle .secondStartMiddleArrow{
		right: 170px;
	}
	.twoStyle .secondStartMiddleArrow img{
		transform:rotate(120deg);
	}
	.twoStyle .secondStartMiddle{
		right: 380px;
	}
	.fiveStyle .firstEndMiddleArrow{
		display: none;
	}
	.fiveStyle .firstEndMiddle{
		right: 380px;
	}
	.fiveStyle .endArrow{
		right: 170px;
	}
	.fiveStyle .secondEndMiddleArrow{
		left: 170px;
	}
	.fiveStyle .secondEndMiddleArrow img{
		transform:rotate(-60deg);
	}
	.fiveStyle .secondEndMiddle{
		left: 380px;
	}
	.sevenStyle .startArrow,.sevenStyle .secondStartMiddleArrow,
	.sevenStyle .endArrow,.sevenStyle .secondEndMiddleArrow,.sevenStyle .firstEndMiddleArrow{
		/*display: none;*/
	}
	/*.sevenStyle .firstStartMiddleArrow{
		margin-top: 120px;
	}*/
	.highStep{
		position: absolute;
		width: 130px;
		height: 180px;
		background: #fff url('~@/assets/images/qp002.png') no-repeat center;
		background-size: 130px 180px;
		z-index: 100;
		overflow: hidden;
	}
	.highStepCircle{
		width: 100px;
		height:100px;
		background: #fff;
		border-radius: 20px;
		padding-top:0;
		margin-top:53px;
		margin-left: 15px;
		font-size: 12px;

	}
  .highStepCircle div{
    min-height: 5px;
  }
	.highStepCircle img{
		width: 26px;
		height: 26px;
		margin-bottom: -4px;
	}

	.highStart{
		left: 0;
		top: 80px;
	}
	.highFirstStart{
		left: 0;
		top: 0;
	}
	.mapWrapper{
		cursor: pointer;
    height: 20px;
   overflow : hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
	}
  .mapWrapper img{
      width: 20px;
      height: 20px;
  }
  .threeStyle .firstStartMiddleArrow,.sixStyle .firstStartMiddleArrow{
      top:60px;
  }
 .sevenStyle .firstEndMiddleArrow,.sixStyle .firstEndMiddleArrow{
     bottom:60px;
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
</style>
