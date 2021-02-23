<template>
	<div class='mainDetail'>
		<div class='main'>
			<div class="topTitle">
				<h3>历史流转<span style="color: #E6A23C;margin-left: 5px;">(默认显示该钢瓶近10条记录)</span></h3>
			</div>
			<div class='detailTop'>
				<Form ref="formInline" :model="formInfo" inline :label-width="90">
					<FormItem label="钢瓶标签">
						<Input v-model="formInfo.cylTags" disabled/>
					</FormItem>
					<FormItem label="钢瓶条码">
						<Input v-model="formInfo.cylcodes" disabled/>
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
					<FormItem label="流转次数">
						<Input v-model="formInfo.cylCircle" disabled/>
					</FormItem>
					<FormItem label="流转状态">
						
						<Select v-model="formInfo.cylCircul" style="width: 150px;" clearable>
							<Option :value="1">在库</Option>
							<Option :value="2">在途</Option>
							<Option :value="3">在用</Option>
							<!--<Option :value="4">空瓶在途</Option>
							<Option :value="5">空瓶在库</Option>-->
						</Select>
					</FormItem>
					<FormItem label="时间" class='dateLabel'>
						<Date-picker format="yyyy-MM-dd HH:mm" v-model='formInfo.dateTime' type="datetimerange" placement="bottom-end" placeholder="选择日期" @on-change="timeChange" style="width:200px"></Date-picker>
					</FormItem>
					<FormItem class='searchForm'>
						<Button type="info" @click='handleSearch'>查询</Button>
					</FormItem>
				</Form>
			</div>
			
			<div  class='detailBottom'>
				<Table :columns="infoColumn" :data="infoData" :height="detailHeight" :loading='loading' highlight-row></Table>
			</div>
			
			<div class="closeBtn" @click='handleClose'><Icon type="md-close" /></div>
			
		</div>
		<cylMap v-if='addressInfo' :langs='langs' :lats='lats' @addressInfo='handleAdSee'></cylMap>
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
				loading:false,
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				detailHeight:'auto',
				bottleId:'',
				userData: (JSON.parse(this.$store.state.userData)),				
				infoData:[],								
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
					cylLiableName:''
				},
				startTime:null,
				endTime:null,						
				infoColumn: [{
						title: '流转类型',
						align: 'center',
						key: 'newFlow',
						tooltip: true,
					},
					{
						title: '流转时间',
						align: 'center',
						key: 'createTime',
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
			details: Object
		},
		methods: {
			handleSearch(){				
				this.getInfoSearch(this.bottleId)
			},
		
			//改变时间选择器
				timeChange(e) {
													
					if(e[1].length){
					let ends=e[1].substring(e[1].length-5)
					let wholes=e[1].substring(0,e[1].length-5)
				if(ends=='00:00'){
					wholes=wholes+''+'23:59';
					this.formInfo.dateTime=[e[0],wholes]
					this.endTime =wholes
				}else{
					this.endTime = e[1]
				}

				this.startTime = e[0]
				}
				else{

				this.startTime = e[0]
				this.endTime = e[1]
				}
					
					
				},
			showMapClick(item){
				this.langs = item.lng;
				this.lats =item.lat;
				this.addressInfo = true;
			},
			handleAdSee(data) {
				this.addressInfo = data
			},
			getInfoSearch(bottleId){
					this.loading=true;
					this.infoData=[];
				_http.http1('post', pathUrls.bottleflowinfoListAll, {
					bottleCode:bottleId,
					beginTime:this.startTime,
					endTime:this.endTime,
					flowType:this.formInfo.cylCircul,
				}, 'form').then((res) => {
					this.loading=false;
					if(res.code==0){
						if(res.data.length){
							for(let item of res.data) {
							switch(item.flowType) {
								case 1:
									item.newFlow = "在库";
									
									break;
								case 2:
									item.newFlow = "在途";
									
									break;
								case 3:
									item.newFlow = "在用";
									
									break;
								case 4:
									item.newFlow = "在途";
									
									break;
								case 5:
									item.newFlow = "在库";
									
									break;
							}
//							if(item.createTime){
//								item.newCreateTime=item.createTime.substring(0,16);
//							}else{
//								item.newCreateTime=null;
//							}
							if(item.lng){
							item.carType = require('../../../src/assets/images/ad.png');
						}else{
							item.carType='';
						}																													
							
						}
							
						}
						this.infoData =res.data;
						
						if(this.infoData.length<12){
							this.detailHeight='auto'
						}else{
							this.detailHeight=this.screeHeight-240;
						}
						this.formInfo.cylCircle=this.infoData.length;
					}
					
				})
			},

			handleClose() {
				this.$emit('detailInfo', false)
			}
		},
		mounted() {		
			if(this.details){
				this.bottleId=this.details.bottleCode;
				this.formInfo.cylTags=this.details.bottleNfcId;
				this.formInfo.cylcodes=this.details.bottleCode;
				this.formInfo.cylNumbers=this.details.bottleFactoryCode;
				this.formInfo.cylSites=this.details.createDeptName;
				this.formInfo.cylSpecs=this.details.bottleSpecification;
				
				this.getInfoSearch(this.bottleId)
			}
			
			
			
		}
	}
</script>

<style type="text/css" scoped>
	.mainDetail {
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
		margin: 0 0 20px 0;
		border-radius: 4px;
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
	
	.detailTop {
		text-align: left;
		padding-top: 10px;
	}
	
	
	.detailBottom>>>th
	{
		font-size: 12px;
		background: #51B5EA;
		color: #fff;
	}
	.detailBottom{
		margin-top: 10px;
		padding: 0 20px;
	}
	.detailBottom>>>td
	{
		font-size: 12px;
		height: 36px;
	}

	
	.main>>>.ivu-form-item {
		margin-bottom: 6px;
	}
	
	.main>>>.ivu-input {
		height: 28px;
	}
	
	.searchForm>>>label{
		width: 30px!important;
	}
	.searchForm>>>.ivu-form-item-content{
		margin-left: 30px!important;
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
</style>