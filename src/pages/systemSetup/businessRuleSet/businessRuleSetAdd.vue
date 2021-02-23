<template>
  <div class="mainBorder">
    <div class='mainHeader'>
      <span>新增</span>
      <Icon type="md-close" class='closeIcon' @click='handleBackClick' />
    </div>
    <div class="mainBody">
      <Form :label-width="140">

        <FormItem label="规则名称" class='star'>
          <Input style="width:500px;" v-model='ruleName' placeholder="请输入规则名称" />
          <!-- <InputNumber style="width:400px;" v-model='configValue' placeholder="请输入配置值" :min='0' :max='100000' /> -->
        </FormItem>
        <FormItem label="模块类型" class='star'>
          <Select v-model='moduleType' style="width:500px;" placeholder="请选择模块类型" @on-change='moduleTypeChange'>
            <Option :value='0'>其他</Option>
            <Option :value='1'>web</Option>
            <Option :value='2'>app</Option>
          </Select>
        </FormItem>
        <FormItem label="模块名称" class='star' v-if='moduleType==1'>
            <el-cascader :show-all-levels="false" :options="webOptions" :props="{ checkStrictly: true }" clearable v-model="moduleId" @change='menuSelect' style="width: 500px;"></el-cascader>
        </FormItem>
        <FormItem label="配置编码" class='star'>
          <Input style="width:500px;" v-model='code' placeholder="请输入配置编码" />
        </FormItem>
       <!-- <FormItem label="配置描述" class='stars'>
          <Input style="width:500px;" v-model='ruleDesc' placeholder="请输入配置描述" type='textarea'/>
        </FormItem> -->
        <FormItem label="使用范围" class='star'>
          <Select v-model='scope' style="width:500px;" placeholder="请选择使用范围" @on-change='valueTypeChange'>
            <Option :value='0'>全局</Option>
            <Option :value='1'>用户类型</Option>
            <Option :value='2'>用户</Option>
          </Select>
        </FormItem>
        <FormItem label="数据类型" class='star'>
          <Select v-model='valueType' style="width:500px;" placeholder="请选择数据类型" @on-change='valueTypeChange'>
            <Option value='enum'>enum(枚举)</Option>
            <Option value='int'>int(数值)</Option>
            <Option value='jsonArr'>jsonArr(JSON数组)</Option>
            <Option value='string'>string(字符串)</Option>
            <Option value='double'>double(小数)</Option>
            <Option value='boolean'>boolean(布尔)</Option>
          </Select>
        </FormItem>
        <FormItem label="数据名称及内容" class='star' v-if='valueType'>
          <!-- enum(枚举) -->
          <div style='' class="enumValueName enumValueName1" v-if='valueType=="enum"'>
            <div>
              <div class="itemLabel">数据名称：</div>
              <div class="itemLabel">数据内容：</div>
            </div>
            <div style="display: flex;">
              <div v-for='(item,index) in valueNameList' :key='item' class="listItem">
                <div>
                  <Input type='text' style='width:80px;' v-model='item.valueName' :placeholder='"名称"+(index+1)' />
                </div>
                <div>
                  <Input type='text' style='width:80px;' v-model='item.value' :placeholder='"内容"+(index+1)' />
                </div>
                <Icon type="md-trash" class='deleteIcon' style='' @click='handleRemoveValueName(index)' />
              </div>

            </div>
            <Icon class="addIcon" type="ios-add-circle" @click='handleAddValueName' />
          </div>
          <!-- int(数值) double(小数)-->
          <div class="enumValueName enumValueName1" v-if='valueType=="int"||valueType=="double"'>
            <div>
              <div class="itemLabel">数据名称：</div>
              <div class="itemLabel">数据内容：</div>
            </div>
            <div style="display: flex;">
              <div v-for='(item,index) in valueNameList' :key='item' class="listItem">
                <div>
                  <span v-text='item.valueName' class="listItemSpan"></span>
                </div>
                <div v-if='valueType=="int"'>
                  <InputNumber :precision="0" style='width:80px;' v-model='item.value' :placeholder='item.placeholderValue' />
                </div>
                <div v-else>
                  <InputNumber style='width:80px;' v-model='item.value' :placeholder='item.placeholderValue' />
                </div>
              </div>

            </div>

          </div>
          <!-- string(字符串) -->
          <div class="enumValueName enumValueName1" v-if='valueType=="string"'>
            <div>
              <div class="itemLabel">数据名称：</div>
              <div class="itemLabel">数据内容：</div>
            </div>
            <div style="display: flex;">
              <div v-for='(item,index) in valueNameList' :key='item' class="listItem">
                <div>
                  <Input type='text' style='width:80px;' v-model='item.valueName' placeholder='名称' />
                </div>
                <div>
                  <Input type='text' style='width:80px;' v-model='item.value' placeholder='内容' />
                </div>
              </div>

            </div>

          </div>
          <!-- boolean(布尔)-->
          <div class="enumValueName enumValueName1" v-if='valueType=="boolean"'>
            <div>
              <div class="itemLabel">数据名称：</div>
              <div class="itemLabel">数据内容：</div>
            </div>
            <div style="display: flex;">
              <div v-for='(item,index) in valueNameList' :key='item' class="listItem">
                <div>
                  <Input type='text' style='width:80px;' v-model='item.valueName' :placeholder='item.placeholderName' />
                </div>
                <div>
                  <span v-text='item.value' class="listItemSpan"></span>
                </div>
              </div>

            </div>

          </div>
          <div class="enumValueName" v-if='valueType=="jsonArr"' style="display: block;">

            <div class="enumValueName1">
              <span>数据名称：</span>
              <Input style="width:215px;" placeholder="数据名称" v-model='jsonValueName'/>
            </div>
            <div style="line-height: 44px;">
              数据内容：
              <Button type='info' size='small' style='width: 215px;' @click='handleAddJsonList'>添加</Button>
              <!-- <span class="addIconJson">
                <Icon type="ios-add-circle" @click='handleAddValueName' /></span> -->
            </div>
            <Form v-if='valueType=="jsonArr"' class='stars jsonArrForm' :label-width="155">
              <div>
                <div v-for='(jsonItem,jsonIndex) in jsonList' :key='jsonItem'>
                  <FormItem :label='"规则名称"+(jsonIndex+1)'>
                    <Input style="width:345px;" v-model='jsonItem.detailName' placeholder="请输入规则名称" />
                  </FormItem>
                  <FormItem :label='"字段名称"+(jsonIndex+1)'>
                    <Input style="width:345px;" v-model='jsonItem.fieldName' placeholder="请输入字段名称" />
                  </FormItem>
                  <FormItem :label='"数据类型"+(jsonIndex+1)'>
                    <Select v-model='jsonItem.valueType' style="width:345px;" placeholder="请选择数据类型" @on-change='jsonValueTypeChange(jsonIndex,jsonItem.valueType)'>
                      <Option value='enum'>enum(枚举)</Option>
                      <Option value='int'>int(数值)</Option>
                      <!-- <Option value='jsonArr'>jsonArr(JSON数组)</Option> -->
                      <Option value='string'>string(字符串)</Option>
                      <Option value='double'>double(小数)</Option>
                      <Option value='boolean'>boolean(布尔)</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="数据名称及内容" class='star' v-if='jsonItem.valueType'>
                    <!-- enum(枚举) -->
                    <div style='' class="enumValueName enumValueName1" v-if='jsonItem.valueType=="enum"'>
                      <div>
                        <div class="itemLabel">数据名称：</div>
                        <div class="itemLabel">数据内容：</div>
                      </div>
                      <div style="display: flex;">
                        <div v-for='(item,index) in jsonItem.valueNameList' :key='item' class="listItem">
                          <div>
                            <Input type='text' style='width:75px;' v-model='item.valueName' :placeholder='"名称"+(index+1)' />
                          </div>
                          <div>
                            <Input type='text' style='width:75px;' v-model='item.value' :placeholder='"内容"+(index+1)' />
                          </div>
                          <Icon type="md-trash" class='deleteIcon' style='' @click='handleRemoveJsonItemValueName(jsonIndex,index)' />
                        </div>

                      </div>
                      <Icon class="addIcon" type="ios-add-circle" @click='handleAddJsonItemValueName(jsonIndex)' />
                    </div>
                    <!-- int(数值) double(小数)-->
                    <div class="enumValueName enumValueName1" v-if='jsonItem.valueType=="int"||jsonItem.valueType=="double"'>
                      <div>
                        <div class="itemLabel">数据名称：</div>
                        <div class="itemLabel">数据内容：</div>
                      </div>
                      <div style="display: flex;">
                        <div v-for='(item,index) in jsonItem.valueNameList' :key='item' class="listItem">
                          <div>
                            <span v-text='item.valueName' class="listItemSpan"></span>
                          </div>
                          <div v-if='jsonItem.valueType=="int"'>
                            <InputNumber :precision="0" style='width:80px;' v-model='item.value' :placeholder='item.placeholderValue' />
                          </div>
                          <div v-else>
                            <InputNumber style='width:80px;' v-model='item.value' :placeholder='item.placeholderValue' />
                          </div>
                        </div>

                      </div>

                    </div>
                    <!-- string(字符串) -->
                    <div class="enumValueName enumValueName1" v-if='jsonItem.valueType=="string"'>
                      <div>
                        <div class="itemLabel">数据名称：</div>
                        <div class="itemLabel">数据内容：</div>
                      </div>
                      <div style="display: flex;">
                        <div v-for='(item,index) in jsonItem.valueNameList' :key='item' class="listItem">
                          <div>
                            <Input type='text' style='width:80px;' v-model='item.valueName' placeholder='名称' />
                          </div>
                          <div>
                            <Input type='text' style='width:80px;' v-model='item.value' placeholder='内容' />
                          </div>
                        </div>

                      </div>

                    </div>
                    <!-- boolean(布尔)-->
                    <div class="enumValueName enumValueName1" v-if='jsonItem.valueType=="boolean"'>
                      <div>
                        <div class="itemLabel">数据名称：</div>
                        <div class="itemLabel">数据内容：</div>
                      </div>
                      <div style="display: flex;">
                        <div v-for='(item,index) in jsonItem.valueNameList' :key='item' class="listItem">
                          <div>
                            <Input type='text' style='width:80px;' v-model='item.valueName' :placeholder='item.placeholderName' />
                          </div>
                          <div>
                            <span v-text='item.value' class="listItemSpan"></span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </FormItem>
                  <FormItem>
                        <Button type='warning' size='small' style='width: 215px;margin-left: 74px;' @click='handleDeleteJsonList(jsonIndex)'>删除</Button>
                  </FormItem>
                </div>
              </div>
            </Form>



          </div>

        </FormItem>

      </Form>
      <div class="mainBodyButton">
        <Button type="primary" @click="handleSave" :disabled="isDisabled">确定</Button>
        <Button style="margin-left: 8px" @click="handleBackClick">返回</Button>
      </div>
    </div>
  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
	export default {
		name: 'businessRuleSetAdd',
		data() {
			return {
        scope:0,
        ruleDesc:'',
        jsonValueName:'',
        moduleId:'',
        webOptions:[],
				isDisabled: false,
				ruleName:'',
        valueType:'',
        valueNameList:[{
          valueName:'',
          value:''
        }],
        moduleType:'',
        moduleName:'',
        code:'',
        jsonList:[{
          detailName:'',
          fieldName:'',
          valueType:'',
          valueNameList:[{
          valueName:'',
          value:''
        }]
        }]

			}
		},
		methods: {
      //获取app菜单
      // getAppMenu(){
      //   _http.http1('get', pathUrls.menuSelect, {}, 'form').then((res) => {
      //             console.log(res.data)
      //   					this.webOptions = this.getMenus([res.data],'name','menuId');
      //   				}).catch((err) => {

      //   				})
      // },
      //获取web菜单
      getWebMenu(){
        _http.http1('get', pathUrls.menuSelect, {}, 'form').then((res) => {

        					this.webOptions = this.getMenus(res.data,'name','menuId');
        				}).catch((err) => {

        				})
      },

      //模块递归
      getMenus(menus, name, id) {
        return menus.map((menu) => {
          if(menu.children.length > 0) {
            this.getMenus(menu.children, name, id);
          }
          menu.title = menu[name];
          menu.label = menu[name];
          menu.id = menu[id];
          menu.value = menu[id];
          return menu;
        })
      },
      //改变模块名称
      menuSelect(value) {
      				if(value.length) {
      					let id = value[value.length - 1]
      					this.moduleId = id
      				}
      			},

      //模块类型改变
      moduleTypeChange(v){
          if(v==1){
            this.getWebMenu()
          }else{
            this.moduleId ='';
          }
      },
      //JSON类型枚举子类型删除
      handleRemoveJsonItemValueName(jsonIndex,index){
        this.jsonList[jsonIndex].valueNameList.splice(index,1);
      },
      //JSON类型枚举子类型新增
      handleAddJsonItemValueName(jsonIndex){
        this.jsonList[jsonIndex].valueNameList.push({
          valueName:'',
          value:''
        })
      },
      //JSON类型下删除数据
      handleDeleteJsonList(index){
          this.jsonList.splice(index,1);
      },
      //JSON类型下添加数据
      handleAddJsonList(){
          this.jsonList.push({
          detailName:'',
          fieldName:'',
          valueType:'',
          valueNameList:[{
          valueName:'',
          value:''
        }]
        })
      },
      //JSON类型下改变数据类型
      jsonValueTypeChange(index,v){

          if(v=='enum'||v=='string'){
              this.jsonList[index].valueNameList=[{
                  valueName:'',
                  value:''
              }]
          }
          if(v=='int'||v=='double'){
              this.jsonList[index].valueNameList=[{
                  valueName:'最小值',
                  value:'',
                  placeholderValue:"最小值",
              },{
                  valueName:'最大值',
                  value:'',
                  placeholderValue:"最大值",
              }]
          }
          if(v=='boolean'){
              this.jsonList[index].valueNameList=[{
                  valueName:'',
                  value:true,
                  placeholderName:"名称1",

              },{
                  valueName:'',
                  value:false,
                  placeholderName:"名称2",

              }]
          }
      },
      //改变主数据类型
      valueTypeChange(v){
          if(v=='enum'||v=='string'){
              this.valueNameList=[{
                  valueName:'',
                  value:''
              }]
          }
          if(v=='int'||v=='double'){
              this.valueNameList=[{
                  valueName:'最小值',
                  value:'',
                  placeholderValue:"最小值",
              },{
                  valueName:'最大值',
                  value:'',
                  placeholderValue:"最大值",
              }]
          }
          if(v=='boolean'){
              this.valueNameList=[{
                  valueName:'',
                  value:true,
                  placeholderName:"名称1",

              },{
                  valueName:'',
                  value:false,
                  placeholderName:"名称2",

              }]
          }

      },
      //枚举类型数据名称删除
      handleRemoveValueName(index){
          this.valueNameList.splice(index,1)

      },
      //枚举类型数据名称添加
      handleAddValueName(){
        this.valueNameList.push({
            valueName:'',
            value:''
        })
      },

			//点击返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//确定
			handleSave() {

        let newValueName=[];
        let newValue=[];
        let jsonValue=[];
        if(this.valueType!='jsonArr'){
          for(let item of this.valueNameList){
              if((item.value+'')!=''&&item.valueName!=''){
                 newValueName.push(item.valueName);
                 newValue.push(item.value);
              }
          }
        }else{
            for(let item of this.jsonList){
              let itemValueName=[];
              let itemValue=[];
                for(let items of item.valueNameList){
                    if((items.value+'')!=''&&items.valueName!=''){
                       itemValueName.push(items.valueName);
                       itemValue.push(items.value);
                    }
                }
                jsonValue.push({
                    detailName:item.detailName,
                    fieldName:item.fieldName,
                    valueType:item.valueType,
                    valueName:itemValueName.toString(),
                    value:itemValue.toString(),
                })
            }
        }


				let fData = {
           ruleName:this.ruleName,
           moduleType:this.moduleType,
           moduleId:this.moduleId,
           code:this.code,
           valueType:this.valueType,
           scope:this.scope
           // ruleDesc:this.ruleDesc
				}
          if(this.valueType!='jsonArr'){
            fData.valueName=newValueName.toString();
            fData.value=newValue.toString();
          }else{
            fData.valueName=this.jsonValueName;
            fData.value=JSON.stringify(jsonValue);
          }

          console.log(fData)
          if(!fData.ruleName){
            this.$Message['warning']({
                    background: true,
                    content: '请输入规则名称!'
                  });
                  return false
          }
          if(fData.moduleType===''){
            this.$Message['warning']({
                    background: true,
                    content: '请选择模块类型!'
                  });
                  return false
          }
          if(fData.moduleType==1){
            if(fData.moduleId==''){
              this.$Message['warning']({
                      background: true,
                      content: '请选择模块名称!'
                    });
                    return false
            }
          }
          if(fData.code==''){
            this.$Message['warning']({
                    background: true,
                    content: '请输入配置编码!'
                  });
                  return false
          }

          this.isDisabled = true;
				_http.http2('post', pathUrls.deptrulesSave, fData).then((res) => {
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
				}).catch((err) => {
					this.isDisabled = false;
				})
			}
		},
		mounted() {

		}
	}
</script>

<style type="text/css" scoped>
  .mainBody>>>.ivu-form-item {
    margin-bottom: 8px;
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

  .mainBody>>>.ivu-select-dropdown {
    max-height: 210px !important;
  }

  .enumValueName {
    position: relative;
    display: flex;
  }

  .enumValueName1>>>.ivu-input,
  .enumValueName1>>>.ivu-input-number {
    border: 0;
    border-bottom: 1px solid #dcdee2;
    border-radius: 0;
  }

  .enumValueName1>>>.ivu-input:focus,
  .enumValueName1>>>.ivu-input-number-focused {
    outline: none;
    border: none;
    box-shadow: 0 0 0 2px transparent;
    border-bottom: 1px solid #dcdee2;
  }

  .enumValueName>>>.ivu-input-number-handler-wrap {
    display: none;
  }

  .listItem {
    margin: 0 10px;
    position: relative;
  }

  .listItem .deleteIcon {
    display: none;
    color: #F53811;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }

  .listItem:hover .deleteIcon {
    display: block;
  }

  .itemLabel {
    height: 32px;
    line-height: 34px;
    width: 70px;
  }

  .addIcon {
    margin-left: 10px;
    font-size: 24px;
    cursor: pointer;
    line-height: 66px;
    color: #0079FB;
    margin-right: 5px;
    display: inline-block;
  }

  .listItemSpan {
    width: 80px;
    display: inline-block;
    border-bottom: 1px solid #dcdee2;
    padding-left: 10px;
  }

  .addIconJson {
    font-size: 24px;
    cursor: pointer;
    color: #0079FB;
    display: inline-block;
    width: 200px;
    text-align: center;
    /* border-bottom: 1px solid #dcdee2; */
  }
  .jsonArrForm>>>.ivu-form-item-content{
    /* width:300px; */
  }
</style>
