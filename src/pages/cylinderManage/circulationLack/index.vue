<template>
  <div class="main">
    <div class="mainTop">
      <Form inline :label-width="70">
        <!-- <FormItem label="时间">
          <DatePicker placement="bottom-start" type="datetimerange" style="width: 300px" @on-change="timeChange" format="yyyy-MM-dd HH:mm"
            v-model='dateTime'></DatePicker>
        </FormItem> -->
        <FormItem label="开始时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeStartTime'></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker style='width: 170px;' type="datetime" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd HH:mm:ss"
            @on-change='changeEndTime'></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click='handleInfoSearch'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mainContent">
      <Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>

      </Table>
    </div>

    <cylInfo v-if='infoSee' :tags=tags @infoSee='handleSee'></cylInfo>
  </div>
</template>

<script>
  import _http from '@/public/http';
    import { pathUrls } from '@/public/path';
    import cylInfo from '@/pages/comComponent/cylinderInfo';
    export default{
      name:'circulationLack',
      components:{
        cylInfo,
      },
      data(){
        return{
          screeHeight: document.documentElement.clientHeight, // 屏幕高
          tags: '',
          infoSee: false,
          columns:[{
						title: '电子标签编码',
						key: 'bottleTag',
						width: 170,
						align: 'center',
            render: (h, params) => {
            	let that = this
            	return h('span', {
            		style: {
            			color: '#EE6515',
            			cursor: 'pointer'
            		},
            		on: {
            			click() {
            				that.infoSee = true
            				that.tags = params.row.bottleTag
            				//										console.log(that.tags)
            			}
            		}
            	}, params.row.bottleTag);
            }
					},{
            title: '车牌号',
            key: 'carNumbers',
            width: 300,
            align: 'center',
            },
            {
              title: '充装时间',
              key: 'fillTime',
              width: 170,
              align: 'center',
              },
              {
                title: '入户时间',
                key: 'entryTime',
                width: 170,
                align: 'center',
                },
                {
                  title: '缺失内容',
                  key: 'errStr',
                  align: 'center',
                  },
          ],
          dataList:[],
          loading:false,
          tableHeight:'auto',
          endTime:'',
          startTime:'',
          dateTime:[]
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
        //查看钢瓶详情
        handleSee(data) {
        	this.infoSee = data
        },
        //改变时间选择器
        	timeChange(e) {
        		if(e[1].length){
        		let ends=e[1].substring(e[1].length-5)
        		let wholes=e[1].substring(0,e[1].length-5)
        	if(ends=='00:00'){
        		wholes=wholes+''+'23:59';
        		this.dateTime=[e[0],wholes]
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

        handleInfoSearch(){
           this.getFlowLackBottlesList()
        },
        getFlowLackBottlesList(){
              this.loading=true;
          _http.http1('post', pathUrls.flowLackBottles, {
          					'startTime':this.startTime?(this.common.conformatDat(this.startTime,true)):'',
          					'endTime': this.endTime?(this.common.conformatDat(this.endTime,true)):'',

          				}, 'form').then((res) => {
          					this.loading=false;
                    this.dataList=res.data;
                    this.tableHeight=this.screeHeight-175;
          				})
        }
      },
      mounted(){
          this.getFlowLackBottlesList()
      }
    }
</script>

<style type="text/css" scoped>
  .main {
    margin-right: 10px;
    background: #FFFFFF;
    min-height: calc(100% - 10px);
  }

  .mainTop {
    padding: 10px 10px 0;
    width: 100%;
    text-align: left;
  }

  .mainTop>>>.ivu-form-item {
    margin-bottom: 0px;
  }

  .mainContent {
    background: #fff;
    border-radius: 4px;
    padding: 10px 10px 20px;
  }

  .main>>>.ivu-table th {
    background: #E2EEFF;
    color: #51B5EA;
  }
</style>
