<template>
	<div class="reportMain">
		<div class="reportContent">
			<div class="closeWrapper" @click='handleClose'><Icon type="md-close" /></div>
			<div class="reloadInfo" @click="reloadClick">
      			<img src="@/assets/images/reload.png" alt="" />
     		</div>
			<div>
				<h3 class="reportTitle">设备上报分析</h3>
        <div style="padding: 5px 20px 0;">
          <Form inline :label-width="96">
              <FormItem label="电子标签编码">
              	 <Input type='text' style='width: 200px;' placeholder='请输入电子标签编码' v-model='bottleNfcid'/>
              </FormItem>
              <FormItem label="日期">
                   <DatePicker type="date" placeholder="请选择日期" style="width: 220px" v-model='boottleDate' format="yyyy-MM-dd" @on-change='timeChange'></DatePicker>
              </FormItem>
              <FormItem>
                  <Button type='primary' @click='handleSearch'>查询</Button>
              </FormItem>
          </Form>

        </div>

				<div style="padding: 5px 10px;">
					<Table border :columns="reportColumns" :data="reportList"  highlight-row :loading='loading' :height="tableHeight">
						<template slot-scope="{ row, index }" slot="bottleNfcId">
							<span @click="getBottleInfo(row.bottleNfcId)" style="cursor: pointer;color:#ee6515;">{{row.bottleNfcId}}</span>
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
		name:'reportAnalysis',
		components:{
			cylInfo
		},
		data(){
			return{
        boottleDate:'',
        bottleNfcid:'',
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
          	title: '上报电子标签',
          	key:'bottleNfcId',
          	align: 'center',
          	slot:'bottleNfcId'
          },
					{
						title: '终端编号',
						key:'terminalCode',
						align: 'center',
					},
          {
          	title: '日期',
          	key:'date',
          	align: 'center',
          },
					{
						title: '上报开始时间',
						key:'beginTime',
						align: 'center',
					},
          {
          	title: '上报结束时间',
          	key:'endTime',
          	align: 'center',
          },
          {
          	title: '上报次数',
          	key:'num',
          	align: 'center',
          },


				]
			}
		},
		methods:{
      //改变时间
      timeChange(v){
        this.boottleDate=v;
      },
      //搜索
      handleSearch(){
        this.curpage=1;
        this.getReportAnalysisList();
      },

			handleSee(data){
				this.infoSee=data;
			},
			getBottleInfo(v){
				this.tags=v;
				this.infoSee=true;
			},
			//刷新
			reloadClick(){
				this.getReportAnalysisList();
			},
			pageSizeChange(pagesSize){
				this.pagesSize=pagesSize;
         this.curpage=1;
				this.getReportAnalysisList()
			},
			pageChange(current){
				this.curpage = current;
				this.getReportAnalysisList()
			},
			getReportAnalysisList(){
				this.loading= true;
				_http.http3('get', pathUrls.deviceLogList, {
					'page': this.curpage,
					"limit": this.pagesSize,
          "bottleNfcId":this.bottleNfcid,
          "date":this.boottleDate
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
						if(this.reportList.length>11){
							this.tableHeight=650;
						}else if(this.reportList.length&&this.reportList.length<=11){
							this.tableHeight=48 * this.reportList.length+40;
						}else{
							this.tableHeight=100;
						}
					}

				})
			},
			//关闭
			handleClose(){
				this.$emit('closeAnalysis',false);
			}
		},
		mounted(){
			this.getReportAnalysisList()
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
  .reportContent>>>.ivu-form-item {
  	margin-bottom: 8px;
  }
</style>
