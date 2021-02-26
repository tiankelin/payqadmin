<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>新增</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Form :label-width="120" v-has='"tagsList-add"'>
				<FormItem label="所属组织" class='organize star'>					
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" clearable v-model="organize" @change='organizeSelected'></el-cascader>
				</FormItem>
				<FormItem label="标签前缀" class='star'>
					<Input maxlength="6" show-word-limit v-model='prefix' @on-change='prefixChange' @on-keyup="prefix=prefix.replace(/[^A-Z0-9]/g,'')" 
						placeholder="数字或大写字母(0-9A-F)"/>	
				</FormItem>	
				<FormItem label="起始标签号" class='star'>
					<Input v-model='startTag' :maxlength="8-prefix.length" show-word-limit @on-keyup="startTag=startTag.replace(/\D/g,'')"/>	
				</FormItem>	
				<FormItem label="数量" class='star'>
					<InputNumber v-model='numbers' :min='1' :max='maxStartTag'/>	
				</FormItem>	
			</Form>
			<div class="mainBodyButton" v-has='"tagsList-add"'>
				<Button type="primary" @click='addfileClick' :disabled="isDisabled">确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>
		</div>
		
	</div>
</template>

<script>
import _http from '@/public/http';
import { pathUrls } from '@/public/path';
export default {
	name: 'tagsAdd',	
	data() {
		return {
			isDisabled:false,
			userData: (JSON.parse(this.$store.state.userData)),			
			options: [],
			organize:'',
			prefix:'',
			startTag:1,
			numbers:1,
			maxStartTag:10000
		}
	},
	methods: {		
		prefixChange(){
			this.startTag=1;
			this.numbers=1;
			let len=8-this.prefix.length;
			let newSatrtTag='';
			for(let i=0;i<len;i++){
				newSatrtTag +='9';
			}
			this.maxStartTag=Number(newSatrtTag);
		},
		//选中组织下拉框
		organizeSelected(value) {
			if(value.length) {
				let id = value[value.length - 1]
				this.organize = id
			}
		},			
		//返回
		handleBackClick() {
			this.$router.go(-1)
		},
		//添加
		addfileClick() {
			let fData = {
				deptId: this.organize, //所属平台id
				prefix:this.prefix,
				startTag:this.startTag,
				number:this.numbers
			}

			if(fData.deptId == '') {
				this.$Message['warning']({
					background: true,
					content: '请选择所属组织!',
					duration: 1
				});
				return false
			}
			if(fData.prefix == '') {
				this.$Message['warning']({
					background: true,
					content: '请输入标签前缀!',
					duration: 1
				});
				return false
			}
			if(fData.prefix.length+fData.startTag.length!=8) {
				this.$Message['warning']({
					background: true,
					content: '电子标签码总长度为8!',
					duration: 1
				});
				return false
			}
			 this.isDisabled=true;
			_http.http2('post', pathUrls.batchAddTag, fData).then((res) => {
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
	.ivu-input-number{
		width: 380px;
	}
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
</style>