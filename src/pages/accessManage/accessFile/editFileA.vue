<template>
	<div class="mainBorder">
		<div class='mainHeader'>
		    <span>编辑</span>
		    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="120">
				<FormItem label="所属组织" class='organize star'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="typeForm.organize" @change='changeCascader' style="width: 380px;"></el-cascader>
					<!-- <Cascader :data="options" clearable v-model="typeForm.organize" change-on-select @on-change='changeCascader' style="width:380px;" :render-format="format"></Cascader> -->
				</FormItem>
				<FormItem label="门禁名称" class='accessName star'>
					<Input v-model="typeForm.accessName" placeholder="门禁名称" />
				</FormItem>
				<FormItem label="生产厂家" class='factory star'>
					<Input v-model="typeForm.factory" placeholder="生产厂家" />
				</FormItem>
				<FormItem label="型号" class='disType star'>
					<Input v-model="typeForm.disType" placeholder="型号" />
				</FormItem>
				<FormItem label="购置时间" class='dateTime '>
					<DatePicker type="datetime" v-model="typeForm.buyTime" placeholder="请选择购置时间" style="width: 380px;" @on-change="timeChange" :editable='false'></DatePicker>
				</FormItem>
				<FormItem label="是否启用" class='isActive'>
					<i-switch v-model="typeForm.isActive" size="large" false-color="#ff4949">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<FormItem label="门禁状态" class='accessStatus '>
					<Select v-model="typeForm.accessStatus">
						<Option :value="1">只出</Option>
						<Option :value="2">只入</Option>
						<Option :value="3">出入</Option>
					</Select>
				</FormItem>
				<FormItem label="关联终端" class='terminalCode'>
					<Select v-model="typeForm.terminalCon" style="width: 380px;">
						<Option v-for="item in terminalList" :value="item.value" :key="item.value">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="责任人" class='dutyPerson'>
					<Input v-model="typeForm.dutyPerson" disabled placeholder="责任人" />
				</FormItem>
				<FormItem label="创建人" class='createPerson'>
					<Input v-model="typeForm.createPerson" disabled placeholder="创建人" />
				</FormItem>
				<FormItem label="创建时间" class='createTime'>
					<Input v-model="typeForm.createTime" disabled placeholder="创建人" />
				</FormItem>
				<FormItem label="修改时间" class='updateTime'>
					<Input v-model="typeForm.updateTime" disabled placeholder="" />
				</FormItem>
			</Form>
      <div class="mainBodyButton" v-has='916'>
          <Button type="primary" @click='editfileFuc' :disabled="isDisabled">确定</Button>
          <Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
      </div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'editFileA',
		data() {
			return {
				isDisabled:false,
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				typeForm: {
					organize: '',
					accessName: '',
					factory: '',
					disType: '',
					buyTime: '',
					isActive: true,
					accessStatus: null,
					terminalCon: null,
					dutyPerson: '',
					createPerson: '',
					createTime: '',
					updateTime: ''
				},
				terminalList: [],
				terminalName: '',
				personId: '',
				createrId: '',
				newDepid:'',
				newTerid:'',
				newDateTime:'',
				timeChanges:false
			}
		},
		methods: {
			timeChange(v) {
				this.typeForm.buyTime = v;
				this.timeChanges=true;
			},
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
			getTerminalDate(c) {
				_http.http1('post', pathUrls.getTerminal, {
					deptId: c,
					terminalType: 5
				}, 'form').then((res) => {
					this.terminalList = res.data;
					if(this.typeForm.terminalCon&&this.newDepid==c) {
						this.terminalList.push({
							'name': this.terminalName,
							'value': this.typeForm.terminalCon
						})
					}
				})
			},
			handleBackClick() {
				this.$router.go(-1)
			},
			changeCascader(value) {
				if(value.length) {
					let id = value[value.length - 1];
					if(id!=this.newDepid){
					this.typeForm.terminalCon=null
					}else{
						this.typeForm.terminalCon=this.newTerid
					}
					this.getTerminalDate(id);
					this.typeForm.organize = id;
				}
			},
			getAccessInfo() {
				_http.http1('get', pathUrls.accessInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					this.typeForm.organize = res.data.deptId + ''; //组织
					this.newDepid=res.data.deptId + '';
					this.typeForm.accessName = res.data.accessCtrlName; //门禁名称
					this.typeForm.factory = res.data.accessCtrlFactory; //生产厂家
					this.typeForm.disType = res.data.accessCtrlModel; //型号
					this.typeForm.buyTime = res.data.acquisitionTime; //购置时间
					this.newDateTime=res.data.acquisitionTime;
					this.typeForm.isActive = res.data.isActive == 1 ? true : false; //是否启用
					this.typeForm.accessStatus = res.data.accessCtrlStatus; //门禁状态
					this.typeForm.dutyPerson = res.data.personLiableName; //责任人
					this.typeForm.createPerson = res.data.createrName; //创建人
					this.typeForm.createTime = res.data.createTime; //创建时间
					this.typeForm.updateTime = res.data.updateTime; //更新时间
					this.typeForm.terminalCon = res.data.terminalId; //终端id
					this.newTerid=res.data.terminalId;
					this.terminalName = res.data.terminalCode; //终端名
					this.personId = res.data.personLiable;
					this.createrId = res.data.createrId;
					//          accessCType=res.data.accessCtrlType;
					//					accessCStatus = res.data.accessCtrlStatus;
					//					deptID = res.data.deptId;
					//					isActive2 = res.data.isActive;
					//					createrId = res.date.createrId;
					//					terminalCode = res.date.terminalCode;

					this.getTerminalDate(this.typeForm.organize)

				})
			},

			editfileFuc() {
				let fData = {
					id: this.$route.params.id,
					accessCtrlType: 1,
					deptId: this.typeForm.organize,
					accessCtrlName: this.typeForm.accessName,
					accessCtrlFactory: this.typeForm.factory,
					accessCtrlModel: this.typeForm.disType,
					acquisitionTime:this.timeChanges==true?this.typeForm.buyTime:this.newDateTime,
					isActive: this.typeForm.isActive == true ? 1 : 0,
					accessCtrlStatus: this.typeForm.accessStatus,
					personLiable: this.personId,
					createrId: this.createrId,
					createTime: this.typeForm.createTime,
					terminalId: this.typeForm.terminalCon
				}

				if(fData.deptId == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择所属组织!',
						duration: 1
					});
					return false
				}
				if(fData.accessCtrlName == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写门禁名称!',
						duration: 1
					});
					return false
				}
				if(fData.accessCtrlName.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '门禁名称内容过长!',
						duration: 1
					});
					return false
				}
				if(fData.accessCtrlFactory == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写生产厂家!',
						duration: 1
					});
					return false
				}
				if(fData.accessCtrlFactory.length > 128) {
					this.$Message['warning']({
						background: true,
						content: '生产厂家内容过长!',
						duration: 1
					});
					return false
				}
				if(fData.accessCtrlModel == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写型号!',
						duration: 1
					});
					return false
				}
				if(fData.accessCtrlModel.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '型号内容过长!',
						duration: 1
					});
					return false
				}

				 this.isDisabled = true;
				_http.http2('put', pathUrls.accessUpdate, fData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.$router.go(-1);
							})
						});

					}
					if(res.code ==500) {
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
			},

		},
		mounted() {
			this.getAccessInfo();
			this.common.getDeptList(this.userData.deptId).then((res) => {
			this.options = this.common.getConDept(res.data, 0, 0, 1)
		})
		}
	}
</script>

<style type="text/css" scoped>
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
