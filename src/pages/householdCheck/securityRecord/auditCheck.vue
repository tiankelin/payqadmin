<template>
	<div class='examWrapper'>
			<div class="examContent" v-if='itemShow'>
				<div class='contentTitle'>审核</div>
				<Form :model="formExam" :label-width="70" style="text-align: left;" class="formExam">
					<FormItem label="审核选项">
						<Select v-model="formExam.checkStatus" style="">
							<Option :value="2">审核通过</Option>
							<Option :value="1">审核不通过</Option>
						</Select>
					</FormItem>
					<FormItem label="备注" v-if='formExam.checkStatus==1'>
						<Input v-model="formExam.rejectReason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入审核不通过理由"></Input>
					</FormItem>
					<Form class="btnBox">
						<Button type="primary" @click='enterClick'>确定</Button>
						<Button @click='handleBackClick'>返回</Button>
					</Form>
				</Form>

			</div>
			<div class="examContent" v-else>
				<div class='contentTitle'>抽样复查</div>
				<Form :model="formExam" :label-width="70" style="text-align: left;" class="formExam">
					<FormItem label="复查选项">
						<Select v-model="formExam1.checkStatus" style="">
							<Option :value="3">抽样复查通过</Option>
							<Option :value="4">抽样复查驳回</Option>
						</Select>
					</FormItem>
					<FormItem label="备注" v-if='formExam1.checkStatus==4'>
						<Input v-model="formExam1.rejectReason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入驳回理由"></Input>
					</FormItem>
					<Form class="btnBox">
						<Button type="primary" @click='enterClick1'>确定</Button>
						<Button @click='handleBackClick'>返回</Button>
					</Form>
				</Form>

			</div>
		</div>
</template>

<script>
	import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default{
		name:'auditCheck',
		props:{
			itemShow:Boolean,
			examId:Number,
			checkNum:Number
		},
		data(){
			return{				
				formExam: {					
					checkStatus: 2,
					rejectReason:null
				},
				formExam1:{
				checkStatus: 3,
				rejectReason:null	
				},
			}
		},
		methods:{
			
			//点击一级审批确定
			enterClick(){
					if(this.formExam.checkStatus==1){
						if(!this.formExam.rejectReason){
							this.$Message['warning']({
							background: true,
							content: '请输入审核不通过理由',
							duration: 1
						});
						return false
						}
					}else{
						this.formExam.rejectReason=null;
					}
				_http.http2('post', `${pathUrls.securitycheckReview}/${this.examId}?reviewType=1`, {
					audit1Remark:this.formExam.rejectReason,
					audit2Remark: null,
					auditor1Id: null,
					auditor1Name: null,
					auditor2Id: null,
					auditor2Name: null,
					checkResult: null,
					id: this.examId,
					isCheck: this.formExam.checkStatus,
					otherIssue: null,
//					reviewType:1,
				}).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '审核操作成功!',
							onClose: (() => {
								this.examShow = false;
								this.formExam.checkStatus=2;
								this.formExam.rejectReason=null;
								this.$emit('examShow',false);
								this.$emit('uploadData',true);
							})
						});
					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg
						});

					}

				})
			},
			//点击二级审批确定`
			enterClick1(){
					if(this.formExam1.checkStatus==4){
						if(!this.formExam1.rejectReason){
							this.$Message['warning']({
							background: true,
							content: '请输入复查驳回理由',
							duration: 1
						});
						return false
						}
					}else{
						this.formExam1.rejectReason=null;
					}
				_http.http2('post', `${pathUrls.securitycheckReview}/${this.examId}?reviewType=2`, {
					audit1Remark:null,
					audit2Remark: this.formExam1.rejectReason,
					auditor1Id: null,
					auditor1Name: null,
					auditor2Id: null,
					auditor2Name: null,
					checkResult: null,
					id: this.examId,
					isCheck: this.formExam1.checkStatus,
					otherIssue: null,
//					reviewType:1,
				}).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '抽样复查操作成功!',
							onClose: (() => {
								this.examShow = false;
								this.formExam1.checkStatus=3;
								this.formExam1.rejectReason=null;
								this.$emit('examShow',false);
								this.$emit('uploadData',true);
							})
						});
					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg
						});

					}

				})
			},
			handleBackClick(){
				this.$emit('examShow',false)
			}
		},
		mounted(){
			
		}
	}
</script>

<style type="text/css" scoped>
	.examWrapper {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1000;
		background: rgba(0, 0, 0, .4);
		width: 100%;
		height: 100%;
	}
	
	.examContent {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 300px;
		height: 200px;
		margin-left: -150px;
		margin-top: -100px;
		background: #FFFFFF;
		border-radius: 4px;
		/*padding: 10px;*/
	}
	
	.contentTitle {
		background: #E2EEFF;
		color: #51B5EA;
		height: 30px;
		line-height: 30px;
	}
	.formExam {
		padding: 10px 15px;
	}
	
	.formExam>>>.ivu-form-item {
		margin-bottom: 15px;
	}
	.btnBox{
		text-align: center;
	}
	.btnBox button {
		margin: 0 4px;
		height: 30px;
		padding: 0 12px;
	}
</style>