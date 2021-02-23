<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>编辑</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :label-width="120">

				<FormItem label="模块名称" class='star'>
					<Input v-model="typeForm.moduleName" placeholder="请输入模块名称" maxlength="16" show-word-limit style="width: 380px;" />
				</FormItem>
				<FormItem label="上级模块" class='star'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.moduleParentId" @change='menuSelect' style="width: 380px;"></el-cascader>
				</FormItem>
				<FormItem label="模块图标" class='stars'>
					<div class="demo-upload-list" v-if='typeForm.moduleIcon'>
						<template>
							<img :src="typeForm.moduleIcon">
							<div class="demo-upload-list-cover">
								<Icon type="ios-eye-outline" @click.native="handleView(typeForm.moduleIcon)"></Icon>
								<Icon type="ios-trash-outline" @click.native="handleRemove(typeForm.moduleIcon)"></Icon>
							</div>
						</template>						
					</div>
					<Upload v-else ref="upload" :show-upload-list="false"  :on-success="handleSuccess"  type="drag" :action="fileUrl" style="display: inline-block;width:58px;" >
						<div style="width: 58px;height:58px;line-height: 58px;">
							<Icon type="ios-camera" size="20"></Icon>
						</div>
					</Upload>
					<Modal title="图片" v-model="visible" width='800' class-name="vertical-center-modal">
						<img :src="imgUrl" v-if="visible" style="width: auto;height:auto;max-height: 500px;max-width: 768px;">
					</Modal>
				</FormItem>
				<FormItem label="模块类别" class='star'>
					<Select style="width: 380px;" v-model="typeForm.moduleCategory">
						<Option :value='1'>功能模块</Option>
						<Option :value='2'>页面</Option>
						<Option :value='3'>按钮</Option>
					</Select>
				</FormItem>
				<FormItem label="模块类型" class='star'>
					<Select style="width: 380px;" v-model="typeForm.moduleType">
						<Option :value='0'>基础功能</Option>
						<Option :value='1'>底部导航栏</Option>
						<Option :value='2'>配送员头部统计信息栏</Option>
						<Option :value='3'>库管头部统计信息栏</Option>
						<Option :value='4'>管理员头部信息统计栏</Option>
						<Option :value='5'>条幅模块</Option>
						<Option :value='6'>宫格模块</Option>
						<Option :value='7'>悬浮按钮</Option>
						<Option :value='8'>配送量统计</Option>
						<Option :value='9'>配送排行榜</Option>
						<Option :value='10'>用户分布</Option>
						<Option :value='11'>钢瓶分布</Option>
						<Option :value='12'>库存统计</Option>
						<Option :value='13'>个人信息</Option>
						<Option :value='14'>个人中心</Option>
						<Option :value='15'>退出登录</Option>
						<Option :value='16'>消息中心</Option>
						<Option :value='17'>9宫格模式</Option>
					</Select>
				</FormItem>

				<FormItem label="排序号" v-show='typeForm.typeRadio!="2"' class='star'>
					<InputNumber v-model="typeForm.moduleSeq" placeholder="请输入排序号" style="width: 380px;" min='0' max='1000' />
				</FormItem>
				<!--<FormItem label="模块参数" class='stars'>
					<Input v-model="typeForm.moduleTargetParam" placeholder="请输入模块参数" style="width: 380px;"></Input>
				</FormItem>-->

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
		name: 'editAppMenu',

		data() {
			return {
				fileUrl: pathUrls.fileUpload,								
				imgUrl: '',
				visible: false,
				
				isDisabled: false,
				options: [],

				typeForm: {
					moduleName: '',
					moduleParentId: '',
					moduleIcon: null,
					moduleCategory: '',
					moduleType: '',
					moduleSeq: null,
					moduleTargetParam: '',
					level:'',
					moduleApplicationCode:'',
					moduleCreateTime:'',
					moduleFlag:'',
					moduleId:'',
					moduleOpenTime:'',
					moduleStatus:'',
					moduleStopTime:'',
				},
				
			}
		},
		methods: {
			getMenuInfo(){
				_http.http1('get', pathUrls.sysapplicationmoduleInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					if(res.data) {
						let datas = res.data
						this.typeForm.level= datas.level;
						this.typeForm.moduleApplicationCode=datas.moduleApplicationCode;
						this.typeForm.moduleCategory=datas.moduleCategory;
						this.typeForm.moduleCreateTime=datas.moduleCreateTime;
						this.typeForm.moduleFlag=datas.moduleFlag;
						this.typeForm.moduleIcon=datas.moduleIcon;
						this.typeForm.moduleId=datas.moduleId;
						this.typeForm.moduleName=datas.moduleName;
						this.typeForm.moduleOpenTime=datas.moduleOpenTime;
						this.typeForm.moduleParentId=datas.moduleParentId;
						this.typeForm.moduleSeq=datas.moduleSeq;
						this.typeForm.moduleStatus=datas.moduleStatus;
						this.typeForm.moduleStopTime=datas.moduleStopTime;
						this.typeForm.moduleTargetParam=datas.moduleTargetParam;
						this.typeForm.moduleType=datas.moduleType;
						
					}

				})
			},
			handleView(url) {				
				this.visible = true;
				this.imgUrl = url;
			},
			handleRemove(file) {
				this.typeForm.moduleIcon=null;
			},
			handleSuccess(res) {
				this.typeForm.moduleIcon = res.data.src
				
			},
			
			menuSelect(value) {
				if(value.length) {
					let id = value[value.length - 1]
					this.typeForm.moduleParentId = id
				}
			},
			//新增菜单
			addMenuFuc() {
				let fData = {
					moduleId:this.typeForm.moduleId,
					moduleName: this.typeForm.moduleName,
					moduleParentId: this.typeForm.moduleParentId,
					moduleIcon: this.typeForm.moduleIcon,
					moduleCategory: this.typeForm.moduleCategory,
					moduleType: this.typeForm.moduleType,
					moduleSeq: this.typeForm.moduleSeq,
					moduleTargetParam: this.typeForm.moduleTargetParam,
					level:this.typeForm.level,
					moduleApplicationCode:this.typeForm.moduleApplicationCode,
					moduleCreateTime:this.typeForm.moduleCreateTime,
					moduleFlag:this.typeForm.moduleFlag,
					
					moduleOpenTime:this.typeForm.moduleOpenTime,
					moduleStatus:this.typeForm.moduleStatus,
					moduleStopTime:this.typeForm.moduleStopTime,
				}
				if(fData.moduleName == '') {
					this.$Message['warning']({
						background: true,
						content: '请输入模块名称!'
					});
					return false
				}
				if(fData.moduleParentId == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择上级模块!'
					});
					return false
				}
				if(fData.moduleCategory == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择模块类别!'
					});
					return false
				}
				
				if(fData.moduleType==null&&fData.moduleType!=0) {
					this.$Message['warning']({
						background: true,
						content: '请选择模块类型!'
					});
					return false
				}
				if(fData.moduleSeq<0) {
					this.$Message['warning']({
						background: true,
						content: '请输入排序号!'
					});
					return false
				}
				this.isDisabled = true;
				_http.http2('post', pathUrls.sysapplicationmoduleUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
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

			handleBackClick() {
				this.$router.go(-1)

			},
			enterClick() {
				this.addMenuFuc()
			}
		},
		mounted() {
			this.getMenuInfo();
			this.common.getAppMenuTree(this.$route.params.module).then((res) => {				
				this.options = this.common.getMenus(res.data)
			})

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
	.demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    margin: 0 2px;
  }
	
</style>