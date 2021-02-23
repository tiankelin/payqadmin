<template>
	<div class="mainBorder">
		<div class='mainHeader'>
		    <span>新增</span>
		    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="120">
				<FormItem label="账号" class='userName star'>
					<Input v-model="typeForm.userName" placeholder="请输入账号" />
				</FormItem>
				<FormItem label="联系方式" class='phone'>
					<Input v-model="typeForm.phone" placeholder="请输入联系方式" />
				</FormItem>
				<!--<FormItem label="邮箱" class='userEmail'>
					<Input v-model="typeForm.userEmail" placeholder="请输入邮箱" />
				</FormItem>-->
				<FormItem label="所属组织" class='star'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeOwn" @change='organizeSelected' style="width: 480px;"></el-cascader>
				</FormItem>
				<FormItem label="密码" class='passWord star'>
					<Input v-model="typeForm.passWord" placeholder="请输入密码" />
				</FormItem>
				<FormItem label="角色" class='userRole'>
					<Select v-model="typeForm.userRole" style="width: 480px;" multiple>
						<!--<Option value="1" key="1">开发者</Option>-->
						<Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="状态" class='userStatus'>
					<i-switch v-model="typeForm.userStatus" size="large" false-color="#ff4949">
						<span slot="open">正常</span>
						<span slot="close">禁用</span>
					</i-switch>
				</FormItem>
        <FormItem label="坐席号">
            <Input v-model="typeForm.seatCode" placeholder="坐席号" />
        </FormItem>
				<!--<FormItem label="头像" class='userPic'>
					<Upload :on-success='handleUploadSuccess' :show-upload-list="false" type="drag" :action="fileUrl">
						<div style="margin-top:50px">
							<Icon type="ios-cloud-upload" size="52" style="color: #3399ff" v-if='!typeForm.userPic'></Icon>
							<img :src="typeForm.userPic" alt="" style="width: 150px;height: 150px;position: absolute;left: 0;top:0" />
						</div>
					</Upload>
				</FormItem>-->

			</Form>
      <div class="mainBodyButton">
          <Button type="primary" @click='addUserFuc'>确定</Button>
          <Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
      </div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	import Bus from '@/public/bus';
	import { Cascader } from 'element-ui'
	export default {
		name: 'addRole',
		data() {
			return {
				fileUrl: pathUrls.fileUpload,
				userData: (JSON.parse(this.$store.state.userData)),
				typeForm: {
					userName: '',
					userEmail: '',
					organizeOwn:this.$store.state.deps,
					passWord: '',
					userRole:[],
					userStatus: true,
					userPic: '',
					phone:'',
          seatCode:''
				},
				options: [],
//				pUrls:'https://source.payq-iot.com:8089/file/upload',
//				pUrls:'https://sys.payq-iot.com:8089/file/upload',
//				pUrls:'/',
//				urlMe:pUrls+'file/upload',
				pUrls:pathUrls.fileUpload,
				roleList: []

			}
		},
		methods: {
			//上传图片成功
			handleUploadSuccess(res, file) {
//				console.log(res.data.src)
				this.typeForm.userPic = res.data.src
			},
			//获取角色下拉列表
			getRoleSelect() {
				_http.http1('post', pathUrls.roleSelect, {

				}, 'form').then((res) => {
					this.roleList = res.list
				}).catch((res) => {

				})
			},
			//递归数据
			getLabel(menus) {

				return menus.map((menu) => {
					if(menu.children.length > 0) {
						this.getLabel(menu.children);
					}
						if(menu.children.length==0){
						delete menu.children;
					}
					menu.value = menu.deptId;
					menu.label = menu.name
					return menu;
				})
			},
			//获取组织列表
			getOrganizeList() {
				_http.http1('post', pathUrls.deptList, {
					deptId: this.userData.deptId
				}, 'form').then((res) => {
					this.options = this.getLabel(res)

				}).catch((res) => {

				})

			},
			//点击添加
			addUserFuc() {

				let fData = {
					username: this.typeForm.userName,
					password: this.typeForm.passWord,
					avatar: this.typeForm.userPic,
					status: this.typeForm.userStatus == true ? 1 : 0,
					roleIdList:this.typeForm.userRole,
					deptId:this.typeForm.organizeOwn,
					mobile:this.typeForm.phone,
          seatCode:this.typeForm.seatCode
				}

				if(this.typeForm.userName == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写账号!'
					});
					return false
				}
				if(this.typeForm.userName.length>32) {
					this.$Message['warning']({
						background: true,
						content: '账号过长!'
					});
					return false
				}

				if(fData.mobile&&!this.common.isPoneAvailable(fData.mobile)) {
					this.$Message['warning']({
						background: true,
						content: '请输入正确的联系方式!'
					});
					return false
				}

					if(this.typeForm.organizeOwn == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择组织!'
					});
					return false
				}
					if(this.typeForm.passWord == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入密码!'
					});
					return false
				}

				_http.http2('post', pathUrls.userSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
							this.$router.go(-1)
						})
						});

					}
						if(res.code ==500){
							this.$Message['warning']({
							background: true,
							content:res.msg,
							onClose: (() => {
//								this.$router.go(-1)
							})
						});
					}
				})

			},
			//选中组织下拉框
			organizeSelected(value) {
				if(value.length){
					let id=value[value.length-1]
					this.typeForm.organizeOwn=id
				}
//				console.log(value)
			},
			handleBackClick() {
				this.$router.go(-1)
			}
		},
		mounted() {
			this.getOrganizeList()
			this.getRoleSelect()

		}

	}
</script>

<style scoped>
	.ivu-form-item {
		margin-bottom: 10px;
		width: 600px;
	}

	.mainBody>>>.ivu-upload {
		width: 150px;
		height: 150px;
		vertical-align: middle;
	}

	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}

</style>
