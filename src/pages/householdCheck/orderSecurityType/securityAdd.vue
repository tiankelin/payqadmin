<template>
	<div class="main">
		<div class='mainTop'>新增</div>
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
					<Tree :data="organizeList" ref="tree" @on-check-change="organizeChecked" show-checkbox check-strictly></Tree>
				</FormItem>
				<FormItem>
					<Button type="primary" @click='addSecurityFuc' :disabled="!showBtn">确定</Button>
					<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
				</FormItem>

			</Form>
		</div>
	</div>
</template>

<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default{
		name:'securityAdd',
		data(){
			return{
				userTypeList:[],
				showBtn:true,
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
			organizeChecked(data){
				this.organizeData=[]
				if(data.length){
					for(let item of data){
					this.organizeData.push(Number(item.deptId))	
					}
					
				}
			
			},
			//点击确定添加
			addSecurityFuc(){
				
				let fData={
					"typeId":null,
					"userType":this.typeForm.userType,
					"typeName":this.typeForm.securityName,
					 "typeContent":this.typeForm.securityInfo,
					 "isActive":this.typeForm.isAlive,				 
					 "depts":JSON.stringify(this.organizeData)
				}
				if(fData.userType == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择客户类型!',
						duration: 1
					});
					return false
				}
				if(fData.typeName == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入安检项名称!',
						duration: 1
					});
					return false
				}
				if(fData.typeName.length>32) {
					this.$Message['warning']({
						background: true,
						content: '安检项名称过长!',
						duration: 1
					});
					return false
				}
				if(fData.typeContent == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入安检项详情!',
						duration: 1
					});
					return false
				}
				if(fData.typeContent.length>64) {
					this.$Message['warning']({
						background: true,
						content: '安检项详情过长!',
						duration: 1
					});
					return false
				}
				this.showBtn=false;
			_http.http2('post', pathUrls.ordersecuritytypeSave, fData).then((res) => {
					if(res.code == 0) {
						this.showBtn=false;
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
								this.$router.go(-1)
							})
						});

					}else{
						this.showBtn=true;
					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						});
					}				
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
						this.getTitle(menu.children);
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
//							console.log(res[0])
							this.organizeList = that.getTitle(res[0].children);
						}
					})
			},
		},
		mounted(){
			this.common.getUserTypeList(this.userData.deptId).then((res)=>{
			this.userTypeList=res.data;
		})
			this.getOrganize()
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
		height: calc(100vh - 140px);
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