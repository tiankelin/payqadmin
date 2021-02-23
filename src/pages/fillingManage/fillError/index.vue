<template>
  <div class="main conMain">
    <div class="mainTop conMainTop">
      <Form inline :label-width="96">
        <FormItem label="电子标签编码">
          <Input v-model="bottleNfcId" style="width:170px" @on-keyup="bottleNfcId=bottleNfcId.replace(/\s+/g,'')"
            placeholder='电子标签编码' />
        </FormItem>
        <FormItem label="钢瓶条码">
          <Input v-model="bottleCode" style="width:170px" @on-keyup="bottleCode=bottleCode.replace(/\s+/g,'')"
            placeholder='钢瓶条码' />
        </FormItem>
        <FormItem label="异常原因">
          <Select v-model="errCode" style="width:220px" clearable placeholder="请选择异常原因">
            <Option :value="1">钢瓶在档案中不存在</Option>
            <Option :value="3">钢瓶为超期瓶</Option>
            <Option :value="30">钢瓶检验状态为超期待检</Option>
            <Option :value="31">钢瓶检验状态为检验不合格</Option>
            <Option :value="32">钢瓶检验状态为即将到期</Option>
            <Option :value="33">钢瓶检验状态为送检</Option>
            <Option :value="4">钢瓶24小时内无法多次充装</Option>
            <Option :value="5">强关联异常</Option>
            <Option :value="-1">钢瓶状态未知</Option>
            <Option :value="7">钢瓶为删除状态</Option>
            <Option :value="8">钢瓶为报废状态</Option>
            <Option :value="9">钢瓶为已注销状态</Option>
            <Option :value="10">钢瓶为已停用状态</Option>
            <Option :value="11">钢瓶为已转出状态</Option>
            <Option :value="12">钢瓶为已回退状态</Option>
          </Select>
        </FormItem>
        <FormItem label="上报开始时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="上报结束时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click='handleSearch' style="margin-right: 20px;">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading="loading" highlight-row :height='tableHeight'>

      </Table>
      <div class="pageMain">
        <Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange'
          @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
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
		name:'fillError',
		components: {
			cylInfo,
		},
		data(){
			return{
        endTime:'',
        startTime:'',
        bottleNfcId:'',
        bottleCode:'',
        errCode:null,
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				tags:'',
				infoSee: false,
				sizeOpts: [10, 20, 50, 100, 200],
				pagesSize: 10,
				curpage: 1,
				count: 0,
				dataList:[],
				loading:false,
				columns:[
          {
//						bottleTag
          title: '电子标签编码',
          key: 'bottleNfcId',
          fixed:'left',
          width:200,
          align: 'center',
          render: (h, params) => {
            let that=this
            return h('span', {
              style: {
                color: '#EE6515',
                cursor: 'pointer'
              },
              on:{
                click(){
                  that.infoSee=true
                  that.tags=params.row.bottleNfcId
//										console.log(that.tags)
                }
              }
            }, params.row.bottleNfcId);
          },

          },
					{
						title: '钢瓶条码',
						key: 'bottleCode',
						align: 'center',
						width:200,
						render: (h, params) => {
							let that=this
							return h('span', {
								style: {
									color: '#1BA060',
									cursor: 'pointer'
								},
									on:{
									click(){
										that.infoSee=true
										that.tags=params.row.bottleCode
									}
								}
							}, params.row.bottleCode);
						},

					},{
						title: '钢瓶规格',
						key: 'bottleSpecification',
						align: 'center',
						minWidth:140
						},
					{
						title: '上报时间',
						key: 'reportTime',
						align: 'center',
						minWidth:200
						},{
						title: '状态码',
						key: 'code',
						align: 'center',
						minWidth:120
						},{
						title: '原因',
						key: 'remark',
						align: 'center',
						tooltip:true,
            minWidth:350
						},{
						title: '记录时间',
						key: 'createTime',
						align: 'center',
						minWidth:200
						},
				]
			}
		},
		methods:{
      //改变结束时间
        changeEndTime(v){
        	if(v){
        		let ends=v.substring(v.length-8);
        		let starts=v.substring(0,11);
        		if(ends=='00:00:00'){
        			this.endTime=starts+'23:59:59';
        		}else{
        			this.endTime=v;
        		}
        	}
        },
      //改变起始时间
        changeStartTime(v){
            this.startTime=v;

        },
      handleSearch(){
        this.curpage =1;
        this.getBottlexkList();
      },
			getBottlexkList(){
				this.loading = true
				this.dataList=[];
				_http.http1('post', pathUrls.bottlexkList, {
					'page': this.curpage,
					"limit": this.pagesSize,
          "code":this.errCode,
          'startTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
          'endTime': this.endTime?(this.common.conformatDat(this.endTime,true)):'',
          'bottleNfcId':this.bottleNfcId,
          'bottleCode':this.bottleCode
				}, 'form').then((res) => {
					this.loading = false;
					if(res.code==0){
						this.dataList=res.data;
						this.count = res.count;
						if(this.dataList.length > 10) {
              this.tableHeight=this.screeHeight-240;

					} else {
						this.tableHeight ='auto';

					}
					}
				})
			},
			//查看钢瓶详情
			handleSee(data){
				this.infoSee = data;
			},
			//页数改变
			pageChange(current) {
				this.curpage = current;
				this.getBottlexkList();


			},
			//条数改变
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
        this.curpage =1;
				this.getBottlexkList();


			},
		},
		mounted(){
			this.getBottlexkList()
		}
	}
</script>

<style type="text/css" scoped>
  .main {
    margin-right: 10px;
    min-height: calc(100% - 10px);
    background: #fff;

  }

  .mainTop {
    padding: 10px 10px 0;
    width: 100%;
    text-align: left;
  }

  .mainTop>>>.ivu-form-item {
    margin-bottom: 8px;
  }

  .mainContent {
    background: #fff;
    border-radius: 4px;
    padding: 10px 10px 20px;
  }

  .pageMain {
    text-align: left;
    margin-top: 10px;
    padding-left: 10px;
  }

  .mainContent>>>.ivu-table th {
    background: #E2EEFF;
    color: #51B5EA;
  }
</style>
