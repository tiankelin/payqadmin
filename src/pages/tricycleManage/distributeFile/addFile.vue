<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>新增</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="120">
				<FormItem label="所属组织" class='organize star'>
					<!--<Select v-model="typeForm.organize" style="width: 380px;">-->
					<!--<Option value="1" key="1">开发者</Option>-->
					<!--<Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>-->
					<!--</Select>-->
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organize" @change='organizeSelected'></el-cascader>
				</FormItem>

				<FormItem label="车牌号" class='carName star'>
					<Input v-model="typeForm.carName" placeholder="车牌号" />
				</FormItem>
				<!--<FormItem label="所属组织" class='star'>
					<el-cascader :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organizeOwn" @change='organizeSelected'></el-cascader>
				</FormItem>-->
				<FormItem label="生产厂家" class='factory star'>
					<Input v-model="typeForm.factory" placeholder="生产厂家" />
				</FormItem>
				<FormItem label="型号" class='disType star'>
					<Input v-model="typeForm.disType" placeholder="型号" />
				</FormItem>

				<FormItem label="智能终端" class='terminalCode'>
					<Select v-model="typeForm.terminalCode" style="width: 380px;" multiple>
						<!--<Option value="1" key="1">666</Option>
						<Option value="2" key="2">777</Option>
						<Option value="3" key="3">888</Option>-->
						<Option v-for="item in terList" :value="item.value" :key="item.value">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="购置时间" class='dateTime'>
					<DatePicker type="datetime" placeholder="请选择购置时间" style="width: 380px;" format="yyyy-MM-dd HH:mm:ss" v-model='typeForm.dateTime' @on-change="timeChange" :editable='false'></DatePicker>
				</FormItem>
				<FormItem label="是否启用" class='isActive'>
					<i-switch v-model="typeForm.isActive" size="large" false-color="#ff4949">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<FormItem label="电子围栏" class='eleFence'>
					<Button type="success" @click='addfileFuc'>添加围栏</Button>
				</FormItem>
			</Form>
			<div class="mainBodyButton">
				<Button type="primary" @click='addfileClick' :disabled="isDisabled">确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>
		</div>
		<eleMap v-if='eleShow' @eleShow='handleEleClick' @pathArrs='getPathArrs' :newPath='pathArrs'></eleMap>
	</div>
</template>

<script>
import eleMap from '@/pages/comComponent/eleMap';
import _http from '@/public/http';
import { pathUrls } from '@/public/path';
export default {
	name: 'addFile',
	components: {
		eleMap,

	},
	data() {
		return {
			isDisabled:false,
			userData: (JSON.parse(this.$store.state.userData)),
			eleShow: false,
			options: [],
			typeForm: {
				organize: '',
				carName: '',
				factory: '',
				disType: '',
				terminalCode: [],
				bottleCount: '',
				isActive: true,
				dateTime: ''

			},
			pathArrs: [],
			terList: []
		}
	},
	methods: {
		timeChange(v) {
			//				console.log(v)
			this.typeForm.dateTime = v
		},
		//获取智能终端
		getTerminals(deptId) {
			_http.http1('post', pathUrls.getTerminal, {
				deptId: deptId,
				terminalType: 4
			}, 'form').then((res) => {
				this.terList = res.data

			})
		},

		//选中组织下拉框
		organizeSelected(value) {
			if(value.length) {
				let id = value[value.length - 1]
				this.typeForm.organize = id
				this.getTerminals(id)
			}
		},
		//编辑围栏
		addfileFuc() {
			this.eleShow = true
		},
		//隐藏地图
		handleEleClick(data) {
			this.eleShow = false

		},
		//接收地图围栏数据
		getPathArrs(data) {
			if(data.length) {
				this.pathArrs = data
			}
		},
		//返回
		handleBackClick() {
			this.$router.go(-1)
		},
		//添加
		addfileClick() {
			let fData = {
				deptId: this.typeForm.organize, //所属平台id
				carNumber: this.typeForm.carName, //车牌号
				carFactory: this.typeForm.factory, //生产厂家
				carModel: this.typeForm.disType, //型号
				terminalCode: JSON.stringify(this.typeForm.terminalCode), //智能终端
				acquisitionTime: this.typeForm.dateTime, //购置时间
				isActive: this.typeForm.isActive == true ? 1 : 0, //是否启用
				status: this.typeForm.isActive == true ? 1 : 0, //是否启用
				vehicleType: 1, //车辆类型
				carRange: this.pathArrs.length ? JSON.stringify([this.pathArrs]) : JSON.stringify([
					[this.pathArrs]
				]) //围栏数组
			}

			if(fData.deptId == '') {
				this.$Message['warning']({
					background: true,
					content: '请选择所属组织!',
					duration: 1
				});
				return false
			}
			if(fData.carNumber == '') {
				this.$Message['warning']({
					background: true,
					content: '请填写车牌号!',
					duration: 1
				});
				return false
			}
			if(fData.carNumber.length > 8) {
				this.$Message['warning']({
					background: true,
					content: '车牌号过长!',
					duration: 1
				});
				return false
			}
			var regExp = /^[\u4E00-\u9FA5A-Za-z0-9-]+$/
			if(!regExp.test(fData.carNumber)) {
				this.$Message['warning']({
					background: true,
					content: '车牌号不能包含特殊字符!',
					duration: 1
				});
				return false;
			}
			if(fData.carFactory == '') {
				this.$Message['warning']({
					background: true,
					content: '请填写生产厂家!',
					duration: 1
				});
				return false
			}
			if(fData.carFactory.length > 35) {
				this.$Message['warning']({
					background: true,
					content: '生产厂家内容过长!',
					duration: 1
				});
				return false
			}
			if(fData.carModel == '') {
				this.$Message['warning']({
					background: true,
					content: '请填写型号',
					duration: 1
				});
				return false
			}
			if(fData.carModel.length > 35) {
				this.$Message['warning']({
					background: true,
					content: '型号内容过长!',
					duration: 1
				});
				return false
			}
			 this.isDisabled=true;
			_http.http2('post', pathUrls.carinfoSave, fData).then((res) => {
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
							content: res.msg
					});

				}
				if(res.code != 0) {
						this.isDisabled = false;
					}
			}).catch(err => {
					this.isDisabled = false;
				})

		}
},
mounted() {
	this.common.getDeptList(this.userData.deptId).then((res) => {
		this.options = this.common.getConDept(res.data, 0, 0, 1)
	})
}
}</script>

<style type="text/css" scoped>
	.ivu-form-item {
		margin-bottom: 10px;
		width: 500px;
	}
	
	.el-cascader {
		width: 380px;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
</style>