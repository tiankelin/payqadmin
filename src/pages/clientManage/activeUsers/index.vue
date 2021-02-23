<template>
	<div class="main">
		<div class='mainTop conMainTop'>
			<Form inline :label-width="80">
				<FormItem label="所属组织">
					<Cascader :data="options" clearable change-on-select @on-change='changeCascader' :render-format="format" style="width:178px"></Cascader>
				</FormItem>
				<FormItem label="客户类型">
					<Select v-model="userType" style="width:150px" clearable placeholder="请选择客户类型">
						<Option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
					</Select>
				</FormItem>

				<FormItem label="用气次数≥">
					<InputNumber type="number" style="width: 62px;height: 28px;line-height: 28px;" :min='1' v-model='useGasNumber' />
				</FormItem>
				<FormItem label="开始时间">
					<DatePicker style='width: 150px;' type="date" placeholder="开始时间" v-model='startTime' format="yyyy-MM-dd" @on-change='changeStartTime'></DatePicker>
				</FormItem>
				<FormItem label="结束时间">
					<DatePicker style='width: 150px;' type="date" placeholder="结束时间" v-model='endTime' format="yyyy-MM-dd" @on-change='changeEndTime'></DatePicker>
				</FormItem>
				<FormItem>
					<RadioGroup v-model="buttonDate" type="button" size='small' @on-change='monthClick'>
						<Radio :label="1">近一个月</Radio>
						<Radio :label="3">近三个月</Radio>
						<Radio :label="6">近半年</Radio>
						<Radio :label="12">近一年</Radio>
					</RadioGroup>
					<!-- <Button type='info' size='small' @click='monthClick(1)'>近一个月</Button>
              <Button type='info' size='small' @click='monthClick(3)'>近三个月</Button>
              <Button type='info' size='small' @click='monthClick(6)'>近半年</Button>
              <Button type='info' size='small' @click='monthClick(12)'>近一年</Button> -->

				</FormItem>
				<FormItem label="是否活跃">
					<Select v-model="isActive" style="width:150px" placeholder="是否活跃">
						<Option :value="1">活跃</Option>
						<Option :value="0">不活跃</Option>

					</Select>
				</FormItem>
				<FormItem class='conWrapper'>
					<Button type="primary" @click='handleSearch'>查询</Button>
					<Button type="warning" @click='handleExport' style="margin:0 20px;" v-has='"activeUsers-export"'>导出</Button>
				</FormItem>
			</Form>
		</div>
		<div class="mainContent conMainContent">
			<Table border :columns="columns" :data="dataList" :loading='loading' highlight-row :height='tableHeight'>
				<template slot-scope="{ row, index }" slot="action">
					<Button type="info" size="small" @click="handleSee(row.userId,row.userInfoExecutor)" style="margin-right: 10px;background:#68a949;border-color:#68a949;">详情</Button>
					<Button type="info" size="small" @click="handleOrderHistory(row.userId)" v-has='1025'>历史购气</Button>

				</template>
			</Table>
			<div class="pageMain conPageMain">
				<Page :total="count" show-sizer show-total show-elevator size="small" @on-change='pageChange' @on-page-size-change='pageSizeChange' :current='curpage' :page-size-opts='sizeOpts'></Page>
			</div>
		</div>
		<orderHistory v-if='orderInfo' @orderInfo='orderInfoMethod' :userId='userId'></orderHistory>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import orderHistory from '@/pages/comComponent/orderHistory.vue';
	export default {
		name: 'activeUsers',
		components: {
			orderHistory
		},
		data() {
			return {
				userType:'',
				isActive: 1,
				userId: '',
				orderInfo: false,
				buttonDate: 3,
				userTypeList: [],
				useGasNumber: 1,
				organize: '',
				startTime: '',
				endTime: '',
				pagesSize: 10,
				screeHeight: document.documentElement.clientHeight, // 屏幕高
				sizeOpts: [10, 20, 50, 100, 200],
				curpage: 1,
				count: 0,
				loading: false,
				tableHeight: 'auto',
				dataList: [],
				options: [],
				userData: (JSON.parse(this.$store.state.userData)),
				columns: [{
						title: '序号',
						//						type: 'index',
						width: 100,
						align: 'center',
						key: 'newIndex',
						fixed: 'left'
					},
					{
						title: '客户名称',
						key: 'userName',
						minWidth: 200,
						align: 'center',
					}, {
						title: '户号',
						key: 'userAccountNumbers',
						minWidth: 160,
						align: 'center',
					}, {
						title: '联系人',
						key: 'userRealName',
						minWidth: 140,
						align: 'center',
					}, {
						title: '联系方式',
						key: 'userPhoneNumber',
						minWidth: 160,
						align: 'center',
					},
					{
						title: '用气次数',
						key: 'countNumber',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '所属组织',
						key: 'userDeptName',
						minWidth: 250,
						align: 'center',
					}, {
						title: '客户类型',
						key: 'userTypeName',
						minWidth: 140,
						align: 'center',
					},
					{
						title: '用气地址',
						key: 'userAddress',
						minWidth: 300,
						align: 'center',
					},
					{
						title: '开户人',
						key: 'userOpeningStaffName',
						width: 140,
						align: 'center',
					},
					{
						title: '销售员',
						key: 'userSalespersonName',
						minWidth: 140,
						align: 'center',
					}, {
						title: '安检员',
						key: 'userCheckerName',
						minWidth: 140,
						align: 'center',
					}
					// ,{
					//   title: '最后配送时间',
					//   key: 'orderFinishTime',
					//   width: 170,
					//   align: 'center',
					// }
					, {
						title: '操作',
						slot: 'action',
						fixed: 'right',
						width: 180,
						align: 'center'
					}
				]
			}
		},
		methods: {
			handleExport() {
				//导出 
				let urlData = `deptId=${this.organize?this.organize:this.userData.deptId}&userType=${this.userType}&isActive=${this.isActive}
				&number=${this.useGasNumber?this.useGasNumber:1}&startTime=${this.startTime?(this.common.conformatDat(this.startTime)+' 00:00:00'):''}
				&endTime=${this.endTime?(this.common.conformatDat(this.endTime)+' 23:59:59'):''}`;
				window.location.href = `${pathUrls.activeUserExport}?${urlData}`;
			},
			orderInfoMethod(data) {
				this.orderInfo = data;
			},
			//历史购气
			handleOrderHistory(id) {
				this.userId = id;
				this.orderInfo = true;
			},
			//查看
			handleSee(id, isAllocate) {

				this.$router.push(`/customerInfo/seeAccount/${id}/2`)
			},
			monthClick(v) {
				const end = new Date();
				const start = new Date();
				this.endTime = end;
				if(v == 12) {
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
				} else {
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * v);
				}

				this.startTime = start;
			},

			changeEndTime(v) {
				this.endTime = v;
				this.buttonDate = 0;

			},
			changeStartTime(v) {
				this.startTime = v;
				this.buttonDate = 0;
			},
			//获取占用瓶列表
			getActiveUsersList() {
				this.loading = true;
				let fData = {
					'page': this.curpage,
					"limit": this.pagesSize,
					'deptId': this.organize,
					'userType': this.userType,
					"startTime": this.startTime ? (this.common.conformatDat(this.startTime) + ' 00:00:00') : '',
					"endTime": this.endTime ? (this.common.conformatDat(this.endTime) + ' 23:59:59') : '',
					"number": this.useGasNumber ? this.useGasNumber : 1,
					"isActive": this.isActive
				}
				_http.http1('post', pathUrls.userStatActiveUsers, fData, 'form').then((res) => {
					this.loading = false;
					if(res.data) {
						for(let [item, index] of new Map(res.data.map((item, i) => [item, i]))) {
							item.newName = item.userCompanyName ? item.userCompanyName : item.userRealName;
							item.newIndex = (this.curpage - 1) * this.pagesSize + (index + 1);

						}
						this.dataList = res.data;
						this.count = res.count;
						if(this.dataList.length > 10) {
							this.tableHeight = this.screeHeight - 240;
						} else {
							this.tableHeight = 'auto';
						}

					}

				}).catch(() => {
					this.loading = false;
				})
			},
			//改变页数
			pageChange(current) {
				this.curpage = current
				this.getActiveUsersList()

			},
			//改变条数
			pageSizeChange(pageSize) {
				this.pagesSize = pageSize;
				this.curpage = 1;
				this.getActiveUsersList();

			},

			//查询
			handleSearch() {
				this.curpage = 1;
				this.getActiveUsersList();
			},
			//改变组织
			changeCascader(value) {
				if(value.length) {
					let id = value[value.length - 1];
					this.organize = id;

				} else {
					this.organize = null;

				}

			},
			//自定义组织输入框显示内容
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
		},
		activated() {
			this.getActiveUsersList();
		},
		mounted() {
			const end = new Date();
			const start = new Date();
			this.endTime = end;
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3);

			this.startTime = start;
			this.common.getDeptList(this.userData.deptId).then((res) => {
				this.options = this.common.getConDept(res.data)
			})
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.userTypeList = res.data;
			})
		}
	}
</script>

<style type="text/css" scoped>
	.main {
		margin-right: 10px;
		min-height: calc(100% - 10px);
		background: #fff;
		position: relative;
	}
	
	.mainTop>>>.ivu-cascader .ivu-cascader-menu {
		background: #fff !important;
	}
	
	.mainTop {
		padding: 10px 10px 0;
		width: 100%;
		text-align: left;
	}
	
	.mainTop>>>.ivu-form-item {
		margin-bottom: 8px;
	}
	
	.mainTop>>>.ivu-input-number-input {
		height: 28px;
		line-height: 28px;
	}
	
	.mainContent {
		background: #fff;
		border-radius: 4px;
		padding: 10px 10px 20px;
	}
	
	.conWrapper>>>.ivu-form-item-content {
		margin-left: 10px !important;
	}
	
	.pageMain {
		text-align: left;
		margin-top: 10px;
		padding-left: 10px;
		display: flex;
	}
	
	.mainTop>>>.ivu-input-number-handler-wrap {
		display: none;
	}
</style>