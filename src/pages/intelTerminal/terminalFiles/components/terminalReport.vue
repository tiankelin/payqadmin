<template>
	<div class="reportMain">
		<div class="reportContent">
			<div class="closeWrapper" @click='handleClose'><Icon type="md-close" /></div>
			<div class="reloadInfo" @click="reloadClick">
      			<img src="@/assets/images/reload.png" alt="" />
     		</div>
			<div>
				<h3 class="reportTitle">硬件上报页</h3>
				<div style="padding: 15px 10px;">
					<Table border :columns="reportColumns" :data="reportList"  highlight-row :loading='loading' :height="tableHeight">
						<template slot-scope="{ row, index }" slot="nfcid">
							<span
								v-for='item in row.nfcid'
								:key='item'
								v-if='item'
								style="color:#ee6515;cursor: pointer;margin: 0 8px;display: inline-block;"
								@click="getBottleInfo(item)">{{item}}</span>
						</template>
					</Table>
					<div style="margin-top: 10px;">
						<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage'></Page>
					</div>
				</div>
			</div>
		</div>
		<cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import cylInfo from '@/pages/comComponent/cylinderInfo';
	export default{
		name:'terminalReport',
		components:{
			cylInfo
		},
		props:{
			terId:String
		},
		data(){
			return{
        screeHeight: document.documentElement.clientHeight, // 屏幕高
				tags:'',
				infoSee:false,
				tableHeight:'auto',
				pagesSize:10,
				curpage:1,
				count:0,
				loading:false,
				reportList:[],
				reportColumns:[
					{
						title: '终端编号',
						key:'carId',
						align: 'center',
					},
					{
						title: '当前经度',
						key:'lon',
						align: 'center',
					},
					{
						title: '当前纬度',
						key:'lat',
						align: 'center',
					},
					{
						title: '上报时间',
						key:'time',
						align: 'center',
					},
					{
						title: '上报电子标签',
						key:'nfcid',
						align: 'center',
						minWidth:150,
						slot:'nfcid'
					},
				]
			}
		},
		methods:{
			handleSee(data){
				this.infoSee=data;
			},
			getBottleInfo(v){
				this.tags=v;
				this.infoSee=true;
			},
			//刷新
			reloadClick(){
				this.getReportList();
			},
			pageSizeChange(pagesSize){
				this.pagesSize=pagesSize;
				this.getReportList()
			},
			pageChange(current){
				this.curpage = current;
				this.getReportList()
			},
			getReportList(){
				this.loading= true;
				_http.http3('get', pathUrls.terminalReport, {
					'page': this.curpage,
					"limit": this.pagesSize,
					"terminalId": this.terId, //终端id
				}, 'form').then((res) => {
					if(res.code==0){
						this.loading=false;
						this.count=res.count;
						for(let item of res.data){
							if(item.command){
								item.nfcid=item.command.nfcid.split(',');

							}

						}
						this.reportList=res.data;
						if(this.reportList.length>5){
							this.tableHeight=this.screeHeight-200;
						}else{
							this.tableHeight='auto';
						}
					}

				})
			},
			//关闭
			handleClose(){
				this.$emit('closeReport',false);
			}
		},
		mounted(){
			this.getReportList()
		}
	}
</script>

<style type="text/css" scoped>
	.reportMain{
		background:rgb(41, 107, 126);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 100;

	}
	.reportContent{
		width:100%;
		height:100%;
		background: #fff;
		/* border-radius: 4px; */
    padding-top: 10px;
		/* padding: 10px; */
		/* margin: 10px; */
		position: relative;
		text-align: left;
	}
	.closeWrapper{
		position: absolute;
		right: 12px;
		top:0px;
		font-size: 32px;
		cursor: pointer;
		color:#1296db;
		font-weight: 600;
	}
	.reloadInfo{
		position: absolute;
		right:55px;
		top:12px;
		cursor: pointer;

	}
	.reloadInfo img{
		width: 22px;
		height: 22px;
	}
	.reportTitle{
		margin: 0 11px;
	}
</style>
