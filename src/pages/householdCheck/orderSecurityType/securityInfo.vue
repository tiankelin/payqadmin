<template>
	<div class="main">
		<div class='mainTop'>详情</div>
		<div class="mainContent">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="120">
				<FormItem label="客户类型" class='userType star'>
					<Select v-model="typeForm.userType" style="width:380px" clearable placeholder="请选择客户类型">
						<!--<Option value='居民用户'>居民用户</Option>
						<Option value='小微商户'>小微商户</Option>
						<Option value='商业用户'>商业用户</Option>
						<Option value='工业用户'>工业用户</Option>-->
						<Option v-for="item in userTypeList" :value="item.typeName" :key="item.id">{{ item.typeName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="安检项名称" class='securityName star'>
					<Input v-model="typeForm.securityName" placeholder="请输入安检项名称" />
				</FormItem>
				<FormItem label="安检项详情 " class='star'>
					<Input v-model="typeForm.securityInfo" placeholder="请输入安检项详情"></Input>
				</FormItem>
				<FormItem label="是否启用" class='isAlive'>
					<i-switch v-model="typeForm.isAlive" size="large" false-color="#ff4949" :true-value='1' :false-value='0'>
						<span slot="open">启用</span>
						<span slot="close">禁用</span>
					</i-switch>
				</FormItem>
				<FormItem label="分配启用组织" class='organize'>
					<Tree :data="organizeList" ref="tree" show-checkbox check-strictly></Tree>
				</FormItem>
				<FormItem>					
					<Button @click='handleBackClick'>返回</Button>
				</FormItem>

			</Form>
		</div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default{
		name:'securityInfo',
		data(){
			return{
				userTypeList:[],
				organizeData:[],
				userData: (JSON.parse(this.$store.state.userData)),
				organizeList:[],
				typeForm:{
					userType:'',
					securityName:'',
					securityInfo:'',
					isAlive:1,										
				}
			}
		},
		methods:{
			//获取详情
			getInfo(){
			_http.http1('get', pathUrls.ordersecuritytypeInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					this.typeForm.userType = res.orderSecurityType.userType; //用户类型
					this.typeForm.securityName = res.orderSecurityType.typeName+''; //安检项名称
					this.typeForm.securityInfo = res.orderSecurityType.typeContent; //安检项详情
					this.typeForm.isAlive = res.orderSecurityType.isActive; //是否启用		
					this.organizeData=JSON.parse(res.orderSecurityType.depts)//启用组织
					this.getOrganize()
				})	
			},
			//返回
			handleBackClick(){
				
				this.$router.go(-1)
			},
			//递归数据
			getTitle(menus) {
				
				return menus.map((menu) => {
					if(menu.children.length > 0) {
						menu.expand = true;
						this.getTitle(menu.children);
					}
					for(let items of this.organizeData) {
						if(items == menu.deptId) {
							menu.expand = true;
							menu.checked = true
						}
					}
					menu.title = menu.name;
					return menu;
				})
			},
			//获取区域组织函数
			getOrganize() {
				let that = this;
				_http.http2('get', pathUrls.organizationList + '?deptId=' + this.userData.deptId, {}, "form")
					.then((res)=> {
						if(res) {
							this.organizeList = that.getTitle(res[0].children);
						}
					})
			},
		},
		mounted(){
			
			this.getInfo()
			this.common.getUserTypeList(this.userData.deptId).then((res)=>{
			this.userTypeList=res.data;
		})
			
		}
		
	}
</script>

<style type="text/css" scoped>
.main {
		overflow: hidden;
		padding-right: 10px;
	}
	
	.mainTop {
		background: #fff;
		height: 44px;
		line-height: 44px;
		text-align: left;
		vertical-align: middle;
		padding-left: 20px;
		border-radius: 4px;
		margin-bottom: 10px;
	}
	
	.mainContent {
		background: #fff;
		/*height: 500px;*/
		border-radius: 4px;
		text-align: left;
		padding: 10px 20px 20px 0;
		overflow-y: auto;
		height: calc(100vh - 130px);
	}
	
	.mainContent>>>.el-input__inner {
		height: 32px;
		line-height: 32px;
		padding: 4px 7px;
	}
	
	.mainContent>>>.el-input__icon {
		line-height: 32px;
	}
	
	.ivu-form-item {
		margin-bottom: 10px;
		width: 500px;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}	
</style>