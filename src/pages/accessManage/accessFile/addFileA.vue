<template>
	<div class="mainBorder">
		<div class='mainHeader'>
		    <span>新增</span>
		    <Icon type="md-close"  class='closeIcon' @click='handleBackClick'/>
		</div>
		<div class="mainBody">
			<Form ref="typeForm" :model="typeForm" :rules="typeForm" :label-width="120">
				<FormItem label="所属组织" class='organize star'>
					<Cascader :data="options" clearable  change-on-select @on-change='changeCascader' style="width:380px;" :render-format="format"></Cascader>
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
				<FormItem label="购置时间" class='dateTime'>
					<DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" v-model="typeForm.buyTime" placeholder="请选择购置时间" style="width: 380px;" @on-change="timeChange" :editable='false'></DatePicker>
				</FormItem>
				<FormItem label="启用" class='isActive'>
					<i-switch v-model="typeForm.isActive" size="large" false-color="#ff4949">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<FormItem label="门禁状态" class='accessStatus'>
					<Select v-model="typeForm.accessStatus" style="width:380px">
						<Option :value="1">只出</Option>
						<Option :value="2">只入</Option>
						<Option :value="3">出入</Option>
					</Select>
				</FormItem>
				<FormItem label="关联终端" class='terminalCode'>
					<Select v-model="typeForm.terminalCode" style="width: 380px;">
						<Option v-for="item in terminalList" :value="item.value" :key="item.value">{{ item.name }}</Option>
					</Select>
				</FormItem>
			</Form>
      <div class="mainBodyButton">
          <Button type="primary" @click='addfileFuc' :disabled="isDisabled">确定</Button>
          <Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
      </div>
		</div>
	</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'addFileA',
		data() {
			return {
				isDisabled:false,
				userData: (JSON.parse(this.$store.state.userData)),
				options: [],
				terminalList: [],
				typeForm: {
					organize: '',
					accessName: '',
					accessStatus: null,
					factory: '',
					disType: '',
					buyTime: '',
					isActive: true,
					terminalCode: ''
				}
			}
		},
		methods: {
			changeCascader(value, selectedData) {
				if(value.length) {
					let id = value[value.length - 1]
					this.getTerminalDate(id);
					this.typeForm.organize = id;
				}else{
          this.typeForm.organize='';
        }
			},
			
			timeChange(v) {
				this.typeForm.buyTime = v;
			},
			getTerminalDate(c) {
				_http.http1('post', pathUrls.getTerminal, {
					deptId: c,
					terminalType: 5
				}, 'form').then((res) => {
					this.terminalList = res.data;
				})
			},
			addfileFuc() {
				let fData = {
					accessCtrlType: 1,
					deptId: this.typeForm.organize,
					accessCtrlName: this.typeForm.accessName,
					accessCtrlFactory: this.typeForm.factory,
					accessCtrlModel: this.typeForm.disType,
					acquisitionTime: this.typeForm.buyTime,
					isActive: this.typeForm.isActive == true ? 1 : 0,
					accessCtrlStatus: this.typeForm.accessStatus,
					terminalId: this.typeForm.terminalCode
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
				_http.http2('post', pathUrls.accessAdd, fData).then((res) => {
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
			handleBackClick() {
				this.$router.go(-1)
			},
			format(labels, selectedData) {
				const index = labels.length - 1;
				const data = selectedData[index] || false;
				return labels[index];
			},
		},
		mounted() {
			this.common.getDeptList(this.userData.deptId).then(res => {
				this.options = this.common.getConDept(res.data)
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
