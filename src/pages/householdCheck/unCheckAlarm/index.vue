<template>
	<div class="main">

		<div class="mainContent">
			<Table border :columns="columns" :data="dataList" :loading="loading"  highlight-row :height='tableHeight'>

			</Table>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'unCheckAlarm',
		data(){
			return{
				tableHeight: 'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				userData: (JSON.parse(this.$store.state.userData)),
				dataList:[],
				loading:false,
				columns:[{
						title: '序号',
						type: 'index',
						width: 70,
						align: 'center',

					},{
						title: '所属组织',
						align: 'center',
						key: 'deptName',
					},{
						title: '客户类型',
						align: 'center',
						key: 'userOrderTypeName',
						width:140
					},{
						title: '户号',
						align: 'center',
						key: 'userAccountNumbers',
					},{
						title: '联系人',
						align: 'center',
						key: 'userRealName',
					},{
						title: '用气地址',
						align: 'center',
						key: 'userAddress',
					},{
						title: '联系方式',
						align: 'center',
						key: 'userPhoneNumber',
						width:140
					},{
						title: '最后安检时间',
						align: 'center',
						key: 'userLastCheckTime',
					},
				]
			}
		},
		methods:{

			//获取列表
			getNoCheckList(){
				this.loading = true
				this.dataList=[];
				_http.http1('post', pathUrls.userAlarmList, {
				}, 'form').then((res) => {
					this.loading=false;
					this.dataList=res.data;
          if(this.dataList.length>10){
            this.tableHeight=this.screeHeight-110;
          }else{
            this.tableHeight='auto';
          }

				})
			},


		},
		mounted(){

			this.getNoCheckList()
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		min-height: calc(100% - 10px);
		background: #fff;

	}
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding:20px 10px 10px;
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

</style>
