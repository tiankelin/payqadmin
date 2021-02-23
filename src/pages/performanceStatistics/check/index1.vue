<template>
	<div class="main">
		<div class="mainTop">
			<Form :model="formSearch" inline :label-width="70">
				<FormItem label="所属组织">
					<Cascader :data="options" clearable v-model="formSearch.organize" change-on-select @on-change='changeCascader' :render-format="format" style="width:220px"></Cascader>
				</FormItem>
				<FormItem label="时间">
					<DatePicker format="yyyy-MM-dd" v-model='dateTime'  @on-change='changeDate' type="daterange"  placement="bottom" placeholder="Select date" style="width: 220px"></DatePicker>       				
	   			 </FormItem>
				<FormItem>
					<Button type="primary" @click='handleSearch' style="margin-right: 20px;">查询</Button>					
				</FormItem>
			</Form>
		</div>
		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading="loading" show-summary :summary-method="handleSummary" highlight-row :height='tableHeight'>
				
			</Table>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'newCheck',
		data(){
			return{
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				startTime:'',
				endTime:'',
				dateTime:[],
				userData: (JSON.parse(this.$store.state.userData)),
				formSearch:{
					organize:''
				},
				options:[],
				dataList:[],
				loading:false,
				columns:[{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center',											
					},{
						title: '配送员编号',						
						
						align: 'center',
						key: 'staffWorkCode',						
					},{
						title: '配送员姓名',						
						
						align: 'center',
						key: 'staffName',						
					},{
						title: '安检数',						
						
						align: 'center',
						key: 'ysp118',						
					}]
			}
		},
		methods:{
			handleSummary ({ columns, data }) {
                const sums = {};
                columns.forEach((column, index) => {
                    const key = column.key;
                    if (index === 0) {
                        sums[key] = {
                            key,
                            value: '总计'
                        };
                        return;
                    }
                    if (index === 1) {
                        sums[key] = {
                            key,
                            value: ''
                        };
                        return;
                    }
                    const values = data.map(item => Number(item[key]));
                    if (!values.every(value => isNaN(value))) {
                        const v = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[key] = {
                            key,
                            value: v
                        };
                    } else {
                        sums[key] = {
                            key,
                            value: ''
                        };
                    }
                });

                return sums;
            },
			getDeliveryRecyclingBottleNum(){
					this.loading = true
					this.dataList=[];
				_http.http1('post', pathUrls.deliveryRecyclingBottleNum, {
					'bottleType':2,	
					'deptId':this.formSearch.organize,
					'startTime':this.startTime,
					'endTime':this.endTime
				}, 'form').then((res) => {
					this.loading=false;
					this.dataList=res.data;
					if(this.dataList.length){
						this.tableHeight=this.dataList.length*45<(this.screeHeight-190)?this.dataList.length*45+39:this.screeHeight-190;
					}else{
						this.tableHeight=0;
					}
					
				})
			},
			changeDate(v){				
				if(v[0]){
					let newDates=[v[0]+' '+'00:00',v[1]+' '+'23:59']
					this.startTime=v[0]+' '+'00:00';
					this.endTime=v[1]+' '+'23:59';
				}else{
					
					this.startTime='';
					this.endTime='';
				}
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
					this.formSearch.organize = value[value.length - 1];

				} else {
					this.formSearch.organize = '';

				}				
			},
			handleSearch(){
				this.getDeliveryRecyclingBottleNum();
			}
		},
		mounted(){
			this.getDeliveryRecyclingBottleNum();
			this.dateTime=this.common.getNowMonth();
			this.startTime=`${this.dateTime[0]}`+' '+'00:00';
			this.endTime=`${this.dateTime[1]}`+' '+'23:59';	
			this.common.getOrganizeList(this.userData.deptId).then((res) => {
				this.options =this.common.getLabel(res);
			})
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
		padding: 10px;
		width: 100%;
		text-align: left;
	}

	.mainTop>>>.ivu-form-item {
		margin-bottom: 0px;
	}
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding:0 10px 10px;
	}

	.mainContent>>>td {
		height: 45px;
		border-bottom: 1px solid #e8eaec!important;
	}

	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
        display: flex;
	}

	.mainContent>>>.ivu-table th {
		background: #E2EEFF;
		color: #51B5EA;
		/*border-color: #f3f3f3;*/
	}
	.mainTop>>>.ivu-cascader .ivu-cascader-menu {
		background: #fff!important;
	}
</style>