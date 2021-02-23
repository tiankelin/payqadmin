<template>
  <div class="main conMain">
    <div class="mainContent">
      <div class="contentList">

        <div v-for='(dataItem,dataIndex) in dataList' :key='dataItem'>
          <div style="height: 36px;line-height: 36px;display: flex;justify-content: space-between;">
            <span style="margin-right: 15px;font-size: 14px;font-weight: 600;">{{dataItem.ruleName}}</span>
            <Button size='small' type='success' style='margin: 8px 17px 0 0;' @click='handleAddData(dataItem,dataIndex)'>添加</Button>
          </div>
          <div style="min-height: 40px;border: 1px solid #8CC5FF;border-radius: 4px;padding: 6px;">
            <Form inline label-position="top">
              <div v-for='(configItem,configIndex) in dataItem.businessConfigEntityList' :key='item' style="position: relative;">
                <div style="width: calc( 100% - 115px );">
                  <FormItem label="客户类型" v-if='dataItem.scope==1'>
                    <i-select clearable placeholder="全部" style='width: 170px;' v-model='configItem.userType'>
                      <i-option v-for="item in userTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</i-option>
                    </i-select>
                  </FormItem>
                  <FormItem label="用户" v-if='dataItem.scope==2'>
                    <Select @blur='selectBlur' :loading="loading1" v-model="configItem.userId" style="width:170px"
                      placeholder='全部' filterable remote :remote-method="remoteMethod" v-loadmore="loadMore" clearable>
                      <Option v-for="item in userList" :value="item.userId" :key="item.userId" :label="item.userRealName">
                      </Option>
                    </Select>
                    <!-- <Spin size="large" class='spinShow' v-if="spinShow"></Spin>
                    <div v-if="endShow" class='endShow'>用户已全部加载!</div> -->
                  </FormItem>
                  <FormItem label="配置说明">
                    <Input type='textarea' style='width: 170px;' rows='1' v-model='configItem.ruleDesc' maxlength="255"
                      show-word-limit />
                  </FormItem>
                  <FormItem :label="configItem.ruleName" v-if='configItem.valueType!="jsonArr"'>
                    <div style="width: 170px;">
                      <i-switch v-model="configItem.inputValue" size="large" false-color="#ff4949" v-if='configItem.valueType=="boolean"'>
                        <span slot="open">{{configItem.valueNames[0]}}</span>
                        <span slot="close">{{configItem.valueNames[1]}}</span>
                      </i-switch>
                      <InputNumber :precision="0" v-model='configItem.inputValue' :min='configItem.values[0]' :max='configItem.values[1]'
                        style='width: 170px;' v-if='configItem.valueType=="int"' />
                      <InputNumber v-model='configItem.inputValue' :min='configItem.values[0]' :max='configItem.values[1]'
                        style='width: 170px;' v-if='configItem.valueType=="double"' />
                      <Input v-model='configItem.inputValue' style='width: 170px;' v-if='configItem.valueType=="string"' />
                      <i-select clearable style='width: 170px;' v-if='configItem.valueType=="enum"' v-model='configItem.inputValue'>
                        <i-option v-for='(item,index) in configItem.valueNames' :value='configItem.values[index]' :key='configItem.values[index]'>{{item}}
                        </i-option>
                      </i-select>
                    </div>
                  </FormItem>
                  <FormItem :label="jsonItem.detailName" v-else v-for='(jsonItem,jsonIndex) in configItem.valueList'
                    :key='jsonItem'>
                    <div style="width: 170px;">
                      <i-switch size="large" false-color="#ff4949" v-if='jsonItem.valueType=="boolean"' v-model='jsonItem.inputValue'>
                        <span slot="open">{{jsonItem.valueNames[0]}}</span>
                        <span slot="close">{{jsonItem.valueNames[1]}}</span>
                      </i-switch>
                      <InputNumber :precision="0" v-model='jsonItem.inputValue' :min='jsonItem.values[0]' :max='jsonItem.values[1]'
                        style='width: 170px;' v-if='jsonItem.valueType=="int"' />
                      <InputNumber v-model='jsonItem.inputValue' :min='jsonItem.values[0]' :max='jsonItem.values[1]'
                        style='width: 170px;' v-if='jsonItem.valueType=="double"' />
                      <Input type='text' v-model='jsonItem.inputValue' style='width: 170px;' v-if='jsonItem.valueType=="string"' />
                      <i-select clearable style='width: 170px;' v-if='jsonItem.valueType=="enum"' v-model='jsonItem.inputValue'>
                        <i-option v-for='(item,index) in jsonItem.valueNames' :value='jsonItem.values[index]' :key='jsonItem.values[index]'>{{item}}
                        </i-option>
                      </i-select>
                    </div>
                  </FormItem>

                </div>
                <FormItem style='position: absolute;right:0;top:50% ;margin-top:-16px ;'>
                  <Button type='info' size='small' style='margin-right: 10px;' @click='handleSaveData(configItem)'
                    :disabled="configItem.isDisabled" v-if='configItem.id'>修改</Button>
                  <Button type='primary' size='small' style='margin-right: 10px;' @click='handleSaveData(configItem)'
                    :disabled="configItem.isDisabled" v-else>保存</Button>
                  <Button type='error' size='small' @click='handleDeleteData(dataItem,dataIndex,configIndex,configItem)'>删除</Button>
                </FormItem>

              </div>
            </Form>

          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import _http from '@/public/http';
	import { pathUrls } from '@/public/path';
  import { Select, Option } from 'element-ui';
  import directives from '@/public/directives';
	export default{
		name:'businessRuleConfiguration',
    components: {
    	Select,
    	Option
    },
		data(){
			return{
        isDisabled:false,
        userName:'',
        switchType:true,
        userData: (JSON.parse(this.$store.state.userData)),
        userTypeList:[],
				tableHeight:'auto',
				screeHeight: document.documentElement.clientHeight, // 屏幕高
          
        loading:false,
				dataList:[],
        loading1:false,
        spinShow: false,
        isLoad: true,
        pageSize:20,
        curpage:1,
        userList: [],
        conKey:0,
        copyList:[],
        endShow:false,
			}
		},
		methods:{
      //保存
      handleSaveData(data){
        // console.log(data);

        let fData={
          moduleId:data.moduleId,
          moduleType:data.moduleType,
          code:data.code,
          userId:data.userId,
          userType:data.userType?data.userType:0,
          ruleDesc:data.ruleDesc,
        }
        if(data.valueType=='enum'){
          fData.type=1
        }else if(data.valueType=='int'){
          fData.type=2
        } else if(data.valueType=='jsonArr'){
          fData.type=3
        }else if(data.valueType=='string'){
          fData.type=4
        }else if(data.valueType=='double'){
          fData.type=5
        }else if(data.valueType=='boolean'){
          fData.type=6
        }
         if(data.valueType!='jsonArr'){
            fData.value=data.inputValue;
          }else{
            // console.log(data.valueList)
            let newValue={};
            data.valueList.forEach((item,i)=>{
                newValue[item.fieldName]=item.inputValue;
            })
            fData.value=JSON.stringify(newValue);
          }
         // console.log(fData);

         // return false;
         if(data.id){
           this.$Modal.confirm({
           	title: '是否修改？',
           	content: '',
           	onOk: () => {
               data.isDisabled=true;
              fData.id=data.id;
              fData.deptId=data.deptId;
               _http.http2('post', pathUrls.deptbusinessconfigUpdate, fData).then((res) => {
               	if(res.code == 0) {
               		this.$Message['success']({
               			background: true,
               			content: '修改成功!',
               			onClose: (() => {
               				this.getDeptbusinessconfigList();

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
               		data.isDisabled = false;
               	}
               }).catch((err) => {
               	data.isDisabled = false;
               })
           	},

           });



         }else{
            data.isDisabled=true;
           _http.http2('post', pathUrls.deptbusinessconfigSave, fData).then((res) => {
           	if(res.code == 0) {
           		this.$Message['success']({
           			background: true,
           			content: '添加成功!',
           			onClose: (() => {
           				this.getDeptbusinessconfigList();


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
           		data.isDisabled = false;
           	}
           }).catch((err) => {
           	data.isDisabled = false;
           })
         }

      },
      //删除
      handleDeleteData(data,i,index,configItem){
        // console.log(configItem)
        if(configItem.id){
           this.$Modal.confirm({
           	title: '是否删除？',
           	content: '',
           	onOk: () => {
           		_http.http2('post', pathUrls.deptbusinessconfigDelete,
           			JSON.stringify([configItem.id])
           		).then((res) => {
           			if(res.code == 0) {
           				this.$Message['success']({
           					background: true,
           					content: '删除成功!',
                    onClose: (() => {
                        this.getDeptbusinessconfigList()
                    })
           				});


           			}

           		}).catch((res) => {

           		})
           	},

           });
        }else{
          this.dataList[i].businessConfigEntityList.splice(index,1)
        }

      },
      //添加规则
    handleAddData(data,i){
            let newValueList=[];
            data.valueList.forEach(item=>{
              newValueList.push({
                detailName:item.detailName,
                fieldName:item.fieldName,
                inputValue:item.valueType=="boolean"?false:'',
                valueNames:item.valueNames,
                values:item.values,
                valueType:item.valueType
              })
            })
          this.dataList[i].businessConfigEntityList.push({
            code:data.code,
            moduleId:data.moduleId,
            moduleName:data.moduleName,
            moduleType:data.moduleType,
            ruleName:data.ruleName,
            valueList:newValueList,
            valueNames:data.valueNames,
            valueType:data.valueType,
            values:data.values,
            inputValue:data.valueType=="boolean"?false:'',
            isDisabled:false
          })
          // console.log(this.dataList[i].businessConfigEntityList)
    },
    //获取客户信息列表
    getUserList() {
    	this.isLoad = true;
    	if(this.curpage != 1) {
    		this.spinShow = true;
    	}

    	_http.http1('post', pathUrls.userGasUserlist, {
    		'page': this.curpage,
    		"limit": this.pageSize,
    		'userIdentity': 1,
    		//					'userName':this.keyName

    	}, 'form').then((res) => {
    		this.spinShow = false;

    		if(res.data.length) {
    			for(let item of res.data) {
    				this.userList.push({
    					userId: item.userId,
    					userRealName: item.userRealName
    				})
    			}
    			let hash = {}; 
    			this.userList = this.userList.reduce((preVal, curVal) => {   
    				hash[curVal.userId] ? '' : hash[curVal.userId] = true && preVal.push(curVal);    
    				return preVal 
    			}, [])
    			this.copyList = this.userList;
    			if(res.data.length < 20) {
    				this.isLoad = false;

    			}
    		} else {
    			this.isLoad = false;
    		}
    	})
    },
    selectBlur() {
    	this.conKey = 0;
    	this.userList = this.copyList;
    },
    remoteMethod(query) {
    	this.keyName = query;
    	this.conKey = 0;
    	if(query.trim() !== '') {
    		this.loading1 = true;
    		//						if(asa.length == 0) {
    		this.curpage = 1;
    		_http.http1('post', pathUrls.userGasUserlist, {
    			'page': this.curpage,
    			"limit": 100,
    			'userIdentity': 1,
    			'userName': query
    		}, 'form').then((res) => {
    			this.conKey = 1;
    			this.loading1 = false;
    			this.userList = res.data;
    		})
    		//						}
    		//					}, 200);

    	} else {
    		this.userList = this.copyList;
    	}
    },
    loadMore() {
    	if(this.conKey == 0) {
    		if(this.isLoad) {
    			this.curpage++;
    			this.getUserList();

    		} else {

    			this.endShow = true;
    			setTimeout(() => {
    				this.endShow = false;
    			}, 1000)
    		}
    	}

    },

		//获取列表
		getDeptbusinessconfigList(){
  			this.loading=true;
  			this.dataList=[];
  			this.count=0;
  			_http.http1("post", pathUrls.deptbusinessconfigList, {

  			}, 'form').then((res) => {
  				this.loading=false;
          if(res.data){
            res.data.forEach((item,i)=>{
              item.values=[];
              item.valueNames=[];
              item.valueList=[];
              item.userId=null;
              item.userType=null;
              item.inputValue=item.valueType=='boolean'?false:'';
              if(item.valueType!='jsonArr'){
                if(item.value){
                  item.values=item.value.split(',');
                }
                if(item.valueName){
                  item.valueNames=item.valueName.split(',');
                }
              }else{
                if(item.value){
                  item.valueList=JSON.parse(item.value);
                  item.valueList.forEach(items=>{
                    items.values=[];
                    items.valueNames=[];
                    items.inputValue='';
                    if(items.value){
                      items.values=items.value.split(',');
                    }
                    if(items.valueName){
                      items.valueNames=items.valueName.split(',');
                    }
                  })
                }
              }
               if(item.businessConfigEntityList.length){
                  item.businessConfigEntityList.forEach((its,k)=>{
                    item.isDisabled=false;
                    if(its.type==6){
                      its.inputValue=its.value=='true'?true:false;
                    }
                    else if(its.type==3){
                          its.valueList=[];
                        let newValues=JSON.parse(its.value);
                        for(let n in newValues){
                            item.valueList.forEach(newItem=>{
                                  its.valueList
                                if(n==newItem.fieldName){
                                    its.valueList.push({
                                      inputValue:newValues[n],
                                      detailName:newItem.detailName,
                                      fieldName:newItem.fieldName,
                                      valueNames:newItem.valueNames,
                                      valueType:newItem.valueType,
                                      values:newItem.values
                                    })

                                }

                            })
                        }
                    }else{
                      its.inputValue=its.value;
                    }

                    its.valueNames=item.valueNames;
                    its.values=item.values;
                    its.valueType=item.valueType;
                    its.ruleName=item.ruleName;

                  })
                  // console.log(item.businessConfigEntityList)
               }

                    item.configList=[item];
            })
          }
  				this.dataList=res.data;
          // console.log(this.dataList)
  				this.count=res.count;
  				if(this.dataList.length > 3) {
                	this.tableHeight=this.screeHeight-200;
               } else {
                	this.tableHeight ='auto';
                }
  			}).catch(()=>{
            this.loading=false;
        })
		},
		//删除
      	handleDelete(v){
      		let id=v.configId;
      		this.$Modal.confirm({
					title: '是否删除？',
					content: '',
					onOk: () => {

						_http.http2('post', pathUrls.sysconfigDelete,
							JSON.stringify([id])
						).then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '删除成功!'
								});
								this.getDeptbusinessconfigList()
							}

						})
					},

				});
      	},

		//批量删除
		handleFilDelete(){

		}
		},
		activated() {
				this.getDeptbusinessconfigList()
      },
		mounted(){
      this.common.getUserTypeList(this.userData.deptId).then((res) => {
      	this.userTypeList = res.data;
      })
      this.getUserList();
		}
	}
</script>

<style type="text/css" scoped>
  .main {
    padding: 20px 10px 10px;
    height: calc(100% - 10px);
    background: #fff;
  }

  .mainContent {
    height: calc(100% - 10px);
    text-align: left;
  }

  .contentList {
    height: 100%;
    /* background: #B7EB8F; */
    padding: 0 10px 10px;
    overflow-y: auto;
    border: 1px solid #dcdee2;
    border-radius: 4px;
  }

  .contentList>>>.ivu-form-item {
    margin-bottom: 4px;
  }

  .contentList>>>.ivu-form-label-top .ivu-form-item-label {
    padding-bottom: 4px;
  }

  .endShow {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -85px;
    margin-top: 184px;
    width: 170px;
    height: 34px;
    background: #fff;
    z-index: 3000;
    line-height: 34px;
    font-size: 12px;
    text-align: left;
    padding-left: 22px;
    color: #E6A23C;
  }

  .spinShow {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding-left: 100px;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -85px;
    margin-top: 184px;
    width: 170px;
    height: 34px;
    background: #fff;
    z-index: 3000;
  }

  .contentList>>>.ivu-input-number-handler-wrap {
    display: none;
  }
</style>
