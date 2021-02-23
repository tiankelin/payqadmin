<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>新增</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="120">
				<FormItem label="类型" prop="typeRadio">
					<RadioGroup v-model="typeForm.typeRadio">
						<Radio label="0">目录</Radio>
						<Radio label="1">菜单</Radio>
						<Radio label="2">按钮</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="菜单名称" class='star'>
					<Input v-model="typeForm.menuName" placeholder="请输入菜单名称" maxlength="16" show-word-limit style="width: 380px;" />
				</FormItem>
				<FormItem label="上级菜单" class='star'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.fatheId" @change='menuSelect' style="width: 380px;"></el-cascader>
				</FormItem>
				<FormItem label="菜单URL" v-show='typeForm.typeRadio=="1"' class='star'>
					<Input v-model="typeForm.menuUrl" placeholder="请输入菜单URL" style="width: 380px;"></Input>
				</FormItem>
				<FormItem label="授权标识" :class='[typeForm.typeRadio==2?"star":""]'>
					<Input v-model="typeForm.authoSign" placeholder="请输入授权标识" style="width: 380px;"></Input>
				</FormItem>
				<FormItem label="排序号" v-show='typeForm.typeRadio!="2"' class='stars'>
					<InputNumber v-model="typeForm.sortNum" placeholder="请输入排序号" style="width: 380px;" :min='0'/>
				</FormItem>
				<FormItem label="图标选择" v-show='typeForm.typeRadio=="0"' class='stars'>
					<div>
						<Select v-model="model1" style="width:380px" @on-change='selectIcon'>
							<Option v-for="item in iconList" :value="item.name" :key="item.name">
								{{item.name}}
								<Icon :type="item.name" class='iconSelect'></Icon>
							</Option>
						</Select>
						<Icon :type="icons"></Icon>
					</div>
				</FormItem>

			</Form>
			<div class="mainBodyButton">
				<Button type="primary" @click='enterClick' :disabled="isDisabled">确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>
		</div>

	</div>
</template>
<script>
	import Bus from '@/public/bus'
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'addMenu',

		data() {
			return {
				isDisabled: false,
				options: [],

				model1: '',
				icons: '',
				iconList: [{
						name: 'md-home',
					},
					{
						name: 'ios-calendar',
					}, {
						name: 'ios-medal',
					},
					{
						name: 'ios-medkit',
					},

					{
						name: 'md-basket',
					},
					{
						name: 'md-build',
					},
					{
						name: 'md-flower',
					},
					{
						name: 'md-cog',
					},
					{
						name: 'md-people',
					},
					{
						name: 'ios-locate',
					},
					{
						name: 'ios-color-filter-outline',
					},
					{
						name: 'ios-help-buoy-outline',
					},
					{
						name: 'md-exit',
					},
					{
						name: 'md-easel',
					},
					{
						name: 'ios-card',
					},
					{
						name: 'md-contacts',
					},
					{
						name: 'md-eye',
					},
					{
						name: 'md-star',
					},
		         	{
		          	name:'ios-call-outline'
		         	 },
		         	{
						name: 'ios-filing',
					},
					{
						name: 'ios-list-box-outline',
					},
					{
						name: 'md-compass',
					},
					{
						name: 'ios-list-box',
					},
					{
		          	name: 'ios-cog-outline',
		          },
		          {
		          	name: 'ios-book',
		          },{
		          	name: 'ios-folder',
		          },{
		          	name: 'ios-bookmark',
		          },{
		          	name: 'ios-pricetags',
		          },
				],
				typeForm: {
					typeRadio: '1',
					menuName: '',

					menuUrl: '',
					authoSign: '',
					sortNum:0,
					fatheId: '0'
				},
			}
		},
		methods: {
			//组织递归数据
			getTitle(menus) {

				return menus.map((menu) => {
					if(menu.children.length > 0) {
						this.getTitle(menu.children);
					}
					if(menu.children.length == 0) {
						delete menu.children;
					}
					menu.value = menu.menuId;
					menu.label = menu.name
					return menu;
				})
			},
			//获取上级菜单
			getFatherMenu() {

				_http.http1('get', pathUrls.menuSelect, {}, 'form').then((res) => {
					this.options = this.getTitle(res.data);
				}).catch((res) => {

				})

			},
			//改变上级菜单
			menuSelect(value) {
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.fatheId = id
				}
			},
			//新增菜单
			addMenuFuc() {
				let fData = {
					name: this.typeForm.menuName,
					parentId: this.typeForm.fatheId,
					//					parentName: this.typeForm.fatherMenu,
					showHide: 1,
					type: Number(this.typeForm.typeRadio),
					perms: this.typeForm.authoSign
				}

				if(this.typeForm.typeRadio == '0') {
					fData.orderNum = this.typeForm.sortNum;
					fData.icon = this.icons;
				} else if(this.typeForm.typeRadio == '1') {
					fData.orderNum = this.typeForm.sortNum;
					fData.url = this.typeForm.menuUrl;
				}
				
				if(fData.name== '') {
					this.$Message['warning']({
						background: true,
						content: '请输入菜单名称!'
					});
					return false
				}
				if(fData.parentId == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择上级菜单!'
					});
					return false
				}
				if(fData.type==1&&fData.url=='') {
					this.$Message['warning']({
						background: true,
						content: '请输入菜单URL!'
					});
					return false
				}
				if(fData.type==2&&fData.perms=='') {
					this.$Message['warning']({
						background: true,
						content: '请输入授权标识!'
					});
					return false
				}
				this.isDisabled = true;
				_http.http2('post', pathUrls.menuSave, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
								this.$router.go(-1);
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						});
					}
					if(res.code != 0) {
						this.isDisabled = false;

					}
				}).catch(err => {
					this.isDisabled = false;
				})

			},
			//改变图标
			selectIcon() {
				this.icons = this.model1
			},
			//返回
			handleBackClick() {
				this.$router.go(-1)
				
			},
			//点击保存
			enterClick() {
				this.addMenuFuc()
			}
		},
		mounted() {

			this.getFatherMenu()
		}
	}
</script>

<style scoped>
	.mainBody>>>.fatherMenu input {
		cursor: pointer;
		background: 0;
		color: #515a6e;
	}
	
	.mainBody>>>.iconSelect {
		position: absolute;
		right: 20px;
	}
	
	.orgaDev {
		position: absolute;
		left: 0;
		top: 0px;
		width: 100%;
		height: 32px;
		cursor: pointer;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	
	.stars>>>.ivu-form-item-label:after {
		content: "*";
		color: #fff;
		padding-right: 2px;
	}
	
</style>