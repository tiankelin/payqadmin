<template>
	<div class="mainBorder">
		<div class='mainHeader'>
			<span>开户</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<Steps :current="current" style='padding-top:15px;position: relative;'>
				 <!--<div style="position: absolute;left: 0;top:0;width:12%;height:100%;cursor: pointer;z-index:100" @click='handleClick0'></div>
				<div style="position: absolute;left:18%;top:0;width:12%;height:100%;cursor: pointer;z-index:100" @click='handleClick1'></div>
				<div style="position: absolute;left:36%;top:0;width:16%;height:100%;cursor: pointer;z-index:100" @click='handleClick2'></div>
				<div style="position: absolute;left:55%;top:0;width:14%;height:100%;cursor: pointer;z-index:100" @click='handleClick3'></div>
				<div style="position: absolute;left:73%;top:0;width:14%;height:100%;cursor: pointer;z-index:100" @click='handleClick4'></div>
				<div style="position: absolute;left:93%;top:0;width:8%;height:100%;cursor: pointer;z-index:100" @click='handleClick5'></div> -->

				<Step title="基本信息" style='text-align: left;'>
				</Step>
				<Step title="用气量用气卡信息" style='text-align: left;'>
				</Step>
				<Step title="开户详情" style='text-align: left;' @click='handleClick'>
				</Step>
				<Step title="燃气销售信息" style='text-align: left;'>
				</Step>
				<Step title="燃气设备信息" style='text-align: left;'>
				</Step>
				<Step title="完成" style='text-align: right;'>
				</Step>

			</Steps>
			<!-- 基本信息 -->
			<div v-show="current===0">
				<p class="currentTitle">基本信息</p>
				<Row type="flex" justify="end" class="code-row-bg">
					<Col span="2">
					</Col>
					<Col span="13">
					<Form ref="formData1" :model="formValidate" :label-width="120" :rules="ruleValidate1">
						<FormItem label="所属组织/区域" prop="place" class='star'>
							<!--<Cascader :data="options" v-model="formValidate.place" change-on-select @on-change='changeCascader' :render-format="format"></Cascader>-->
							<el-cascader clearable ref="myCascader" :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" v-model="formValidate.place" @change='changeCascader'></el-cascader>
							<span class='depInfo errInfo'>{{warnInfo.depInfo}}</span>
						</FormItem>
						<FormItem label="客户类型" class='star'>
							<Select v-model="formValidate.gasType" @on-change='gasTypeChanged' label-in-value>
								<Option v-for="item in gasTypeList" :value="item.id" :key="item.id" :tag='item'>{{ item.typeName }}</Option>
							</Select>
							<span class='errInfo'>{{warnInfo.gasInfo}}</span>
						</FormItem>
						<FormItem label="用气子类型" class='star' v-if='!isResident' :key='"gasSubType"'>
							<Select v-model="formValidate.gasSubType" label-in-value @on-change='selectChildType'>
								<Option v-for="item in subType2List" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
							</Select>
							<span class='errInfo'>{{warnInfo.gasChiInfo}}</span>
						</FormItem>

						<FormItem label="企业/商户名称" prop="businessName" v-if='!isResident' :key='"businessName"'>
							<Input v-model="formValidate.businessName"></Input>
						</FormItem>
						<FormItem label="客户姓名" prop="clientName" :key='"clientName"'>
							<Input v-model="formValidate.clientName"></Input>
						</FormItem>
						<FormItem label="有证无证" v-if='!isResident'>
							<Select v-model="hasCert" clearable>
								<Option :value='0'>无证</Option>
								<Option :value='1'>有证</Option>
							</Select>
						</FormItem>
						<FormItem label="身份证号码" prop="ID">
							<Input v-model="formValidate.ID"></Input>
							<span class='errInfo'>{{warnInfo.idCardInfo}}</span>
						</FormItem>
						<FormItem label="证件地址">
							<Input v-model="formValidate.userCertAddress"></Input>
							<span class='errInfo'>{{warnInfo.certAddressInfo}}</span>
						</FormItem>
						<FormItem label="联系方式" prop="telephoneNumber">
							<Input v-model="formValidate.telephoneNumber"></Input>
							<span class='errInfo'>{{warnInfo.telInfo}}</span>
						</FormItem>
						<FormItem label="用气地址" class='star'>
							<Row style='margin-bottom: 10px;'>
								<Col span="12">
								<Select v-model="formValidate.province" style="width:200px" @on-change='selectProvince' prop="province" label-in-value placeholder='请选择省份'>
									<Option v-for="item in provinceList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
								</Select>
								</Col>

								<Col span="12">
								<Select v-model="formValidate.city" style="width:200px" @on-change='selectCity' prop="city" label-in-value placeholder='请选择城市'>
									<Option v-for="item in cityList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
								</Select>
								</Col>

							</Row>

							<Row style='margin-bottom: 10px;'>
								<Col span="12">
								<Select v-model="formValidate.area" style="width:200px" @on-change='selectArea' prop="area" label-in-value placeholder='请选择县区'>
									<Option v-for="item in areaList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
								</Select>
								</Col>

								<Col span="12">
								<Select v-model="formValidate.street" style="width:200px" prop="street" label-in-value @on-change='selectStreet' placeholder='请选择街道'>
									<Option v-for="item in streetList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
								</Select>
								</Col>

							</Row>
							<Row>
								<Input v-model="formValidate.detailAddress" placeholder="请输入详细地址,精确到门牌号" prop='address' />
								<span class='errInfo'>{{warnInfo.addressInfo}}</span>
							</Row>
						</FormItem>
						<FormItem label="客户备注" prop="clientRemark" v-show='isResident'>
							<CheckboxGroup v-model="formValidate.clientRemark" style="text-align: left;" @on-change="showOther">
								<Checkbox label="特困户"></Checkbox>
								<Checkbox label="残障低保户"></Checkbox>
								<Checkbox label="老年人(70岁以上)"></Checkbox><br />
								<Checkbox label="其他"></Checkbox>
							</CheckboxGroup>
							<div v-show="detail">
								<Input v-model="otherRemark" placeholder="请填写备注"></Input>
							</div>
						</FormItem>
					</Form>
					</Col>
					<Col span="9">
					</Col>
				</Row>
			</div>
			<!-- 用气量 -->
			<div v-show="current===1">

				<p class="currentTitle">燃气销售信息</p>
				<Row type="flex" justify="end" class="code-row-bg">
					<Col span="2">
					</Col>
					<Col span="22">
					<Form ref="formData7" :model="formItem" :label-width="120" :rules="ruleValidate">
						<FormItem label="销售员姓名" prop="salesmanName">
							<Select v-model="salesmanId" @on-change='saleSelect' label-in-value style="width: 350px;">
								<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
							</Select>
						</FormItem>
						<FormItem label="销售员工号" prop="salesmanCode">

							{{salesmanCode}}
						</FormItem>
						<FormItem label="">
							<Button type="info" long @click="handleAdd2" icon="md-add" style="width: 160px;">添加钢瓶</Button>
						</FormItem>
						<FormItem label="允许使用钢瓶" :class="[saleindex==0?'star':'']" v-for="(item, saleindex) in saleform.items" v-if="item&&item.status" :key="saleindex" :prop="'items.' + saleindex + '.value'" :rules="{required: false, message: 'Item ' + item.saleindex +' can not be empty', trigger: 'blur'} " style='margin: 6px 0;'>
							<Row>
								<!--<Col span="10"> 允许使用钢瓶
								</Col>-->
								<Select v-model="item.ssize" @on-open-change='changeSize1(item.ssize,saleindex)' style="width:350px;">
									<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
								</Select>
								<Button @click="handleRemove2(saleindex)" style="height: 28px;" type="warning" v-if='saleindex!=0'>删除</Button>
								<span v-else style='width: 60px;'></span>

							</Row>
						</FormItem>
						<FormItem>
							<span style="color:#ed4014;position: absolute;left: 0;">{{warnInfo.saleInfo}}</span>
						</FormItem>
					</Form>
					</Col>
					<!--<Col span="1">
					</Col>-->
					<!--<Col span="6">-->
					<!--<Form ref="formData8" :model="formItem" :label-width="120" :rules="ruleValidate">
						<FormItem label="销售员工号" prop="salesmanCode">

							{{salesmanCode}}
						</FormItem>
					</Form>-->
					<!--</Col>-->
					<!--<Col span="2">
					</Col>-->
				</Row>
				<p class="currentTitle" style="padding-top: 0;">用气量核定</p>
				<Row type="flex" justify="end" class="code-row-bg gasForm">
					<Col span="2">
					</Col>
					<Col span="22">
					<Form ref="formData4" :model="formItem1" :label-width="120" :rules="ruleValidate">
						<FormItem label="" class='btnForm' style='margin-left: 120px;'>
							<Button type="info" @click="handleAdd5" icon="md-add" style="width: 160px;">添加用气量核定单</Button>
						</FormItem>
						<FormItem v-for="(item, yqindex) in gasDefineform.items" v-if="item.status" :key="yqindex" :prop="'items.' + yqindex + '.value'" :rules="{required: false, message: 'Item ' + item.yqindex +' can not be empty', trigger: 'blur'}">
							<Row style='margin-bottom: 10px;'>
								<!--<Col span="10" class='stars'>用气规格

								</Col>-->
								<Col span="24">

								<span style="width: 100px;text-align: right;display: inline-block;margin-right: 14px;">用气规格</span>
								<!--<Select v-model="size">
								</Select>-->
								<Select v-model="item.size" style="width:350px" clearable @on-open-change='changeSize(item.size,yqindex)'>
									<Option v-for="items in goodsSizeList" :value="items.goodsId" :key="items.goodsId">{{ items.goodsName }}</Option>
								</Select>
								</Col>
							</Row>
							<Row style='margin-bottom: 10px;'>
								<Col span="24">
								<span style="width: 100px;text-align: right;display: inline-block;margin-right: 14px;">每次起送量</span>
								<!--<Button class="btnm" @click="sqbtnMinute(yqindex,item.sqcount)">-</Button>-->
								<InputNumber :min='0' :max='10' v-model="item.sqcount" style="text-align: center;width: 350px;" />
								<!--<Button class="btnm" @click="sqbtnAdd(yqindex,item.sqcount)">+</Button>-->
								</Col>
							</Row>
							<Row style='margin-bottom: 10px;'>
								<!--<Col span="10"> 使用周期
								</Col>-->
								<Col span="24">
								<span style="width: 100px;text-align: right;display: inline-block;margin-right: 14px;">使用周期</span>
								<!--<Button class="btnm" @click="sybtnMinute(yqindex,item.sycount)">-</Button>-->
								<InputNumber :min='0' :max='365' v-model="item.sycount" style="text-align: center;width: 350px;" />&nbsp天
								<!--<Button class="btnm" @click="sybtnAdd(yqindex,item.sycount)">+</Button>&nbsp天-->
								</Col>
							</Row>
							<Row style='padding-left: 40px;'>
								<Col span="10">
								<Button @click="handleRemove5(yqindex)" v-if='yqindex!=0' type="warning" style="height: 28px;">删除</Button>
								</Col>
							</Row>

						</FormItem>

					</Form>
					</Col>
					<!--<Col span="6">

					</Col>-->
				</Row>
				<p class="currentTitle">用气卡信息</p>
				<Row type="flex" justify="end" class="code-row-bg">
					<Col span="2">
					</Col>
					<Col span="22">
					<Form ref="formData5" :model="formItem" :label-width="120" :rules="ruleValidate">
						<FormItem label="用气卡发放状态" prop="cardStatus">
							<i-switch v-model="switch2" size="large" @on-change="openLast">
								<span slot="open">开启</span>
								<span slot="close">关闭</span>
							</i-switch>
						</FormItem>
						<div v-show="last">
							<FormItem label="用气卡号" prop="cardNumber" class='star'>
								<Select v-model="cardNumber" style="width:350px" filterable>
									<Option v-for="item in cardCodeList" :value="item.cardCode" :key="item.cardCode">{{ item.cardCode }}</Option>
								</Select>
							</FormItem>
							<FormItem label="默认订购钢瓶" prop="bookProduct" class='star'>
								<Select v-model="bookProduct" style="width:350px" clearable label-in-value @on-change='changeProduct'>
									<Option v-for="item in goodsSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
								</Select>
							</FormItem>
							<FormItem label="默认订购数量" prop="bookNumber" class='star'>
								<!--<Button class="btnm" @click="bookbtnMinute()">-</Button>-->
								<InputNumber :min='0' :max='100' v-model="bookNumber" style="text-align: center;width: 350px;" />
								<!--<Button class="btnm" @click="bookbtnAdd()">+</Button>-->
							</FormItem>

						</div>

					</Form>
					</Col>
					<!--<Col span="8">

					</Col>-->
				</Row>
				<Row>
					<Col>
					<span class='errInfo' style="position: static;margin-left: 10%;">{{warnInfo.useGasInfo}}</span>
					</Col>
				</Row>
			</div>

			<!-- 开户详情 -->
			<div v-show="current===2">
				<p class="currentTitle">开户详情</p>
				<Row type="flex" justify="end" class="code-row-bg">
					<Col span="2">
					</Col>
					<Col span="12">
					<Form ref="formData2" :model="formValidate2" :label-width="120" :rules="ruleValidate2">
						<FormItem label="开户人" class='star'>
							<Select v-model="formValidate2.accountHolder" label-in-value @on-change='selectHolder' style="width: 350px">
								<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
							</Select>
							<span class='errInfo' style="left:0px;top:30px">{{warnInfo.staNameInfo}}</span>
						</FormItem>
						<FormItem label="开户合同编号">
							<Input v-model="formValidate2.contractNumber" style="width: 350px"></Input>
							<span class='errInfo' style="left:0px;top:30px">{{warnInfo.contractInfo}}</span>
						</FormItem>
						<!--<FormItem label="商品名称">
							<Select v-model="formValidate2.goodsSpec">
								<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
							</Select>
							<span class='errInfo' style="left:0px;top:30px">{{warnInfo.goodsSpecInfo}}</span>
						</FormItem>-->
						<!--<FormItem label="最大占用瓶数" class='star'>
							<Button class="btnm" @click="maxbtnMinute">-</Button>
							<InputNumber :min='1' :max='10' v-model="maxCount" style="text-align: center;width: 100px;" />
							<Button class="btnm" @click="maxbtnAdd">+</Button>
							<span class='errInfo' style="left:0px;top:30px">{{warnInfo.maxInfo}}</span>
						</FormItem>-->
						<FormItem label="最大占用瓶" style='white-space: nowrap;'>
							<Button type="info" long @click="addMaxOccupy" icon="md-add" style="width: 160px;">添加</Button>
							<span style="font-size: 12px;color:#ff6100;font-style: italic;font-weight: 600;">
                公司最多允许这家用户放几个瓶！
               </span>
						</FormItem>
						<FormItem v-for="(occitem, occindex) in occupyNumList" :key="occitem" style='width: 100%;' class='occitem' v-if="occupyNumList.length!=0">
							<Form :label-width="120" style="width: 100%;">
								<FormItem label='钢瓶 '>
									<Select v-model="occitem.occSpec" class='occSpec' @on-open-change='changeOccSpec(occitem.occSpec,occindex)' style="width: 350px">
										<Option v-for="item in goodsSizeList" :value="item.goodsId" :key="item.goodsId" v-if='item'>{{ item.goodsName }}</Option>
									</Select>
								</FormItem>
								<FormItem label='数量'>
									<InputNumber :min='0' :max='occitem.maxNum' v-model="occitem.occNum" style="text-align: center;width:350px;" />
								</FormItem>
								<FormItem label=''>
									<Button @click="removeMaxOccupy(occindex)" type="warning" style="height: 28px;margin-left: 120px;margin-top: 5px;">删除</Button>
								</FormItem>
							</Form>

						</FormItem>

						<FormItem label="开户时已押瓶" style='white-space: nowrap;'>
							<Button type="info" long @click="addPledge" icon="md-add" style="width: 160px;">添加</Button>
							<span style="font-size: 12px;color:#ff6100;font-style: italic;font-weight: 600;">
                问一问、查一查用户家交过几个这种大小的瓶的押金！
              </span>
						</FormItem>
						<FormItem v-for="(occitem, occindex) in pledgeList" :key="occitem" style='width: 100%;' class='occitem' v-if="pledgeList.length!=0">
							<Form :label-width="120" style="width: 100%;">
								<FormItem label='钢瓶'>
									<Select v-model="occitem.occSpec" class='occSpec' @on-open-change='changePledge(occitem.occSpec,occindex)' style="width: 350px">
										<Option v-for="item in goodsSizeList" :value="item.goodsId" :key="item.goodsId" v-if='item'>{{ item.goodsName }}</Option>
									</Select>
								</FormItem>
								<FormItem label='数量'>
									<InputNumber :min='1' :max='100' v-model="occitem.occNum" style="text-align: center;width:350px;" @on-blur='pledgeChange(occindex)' />
								</FormItem>
								<FormItem label=''>
									<Button @click="removePledge(occindex)" type="warning" style="height: 28px;margin-left: 120px;margin-top: 5px;">删除</Button>
								</FormItem>
							</Form>
						</FormItem>

						<FormItem label="开户时已占用瓶" style='white-space: nowrap;'>
							<Button type="info" long @click="addYzOccupy" icon="md-add" style="width: 160px;">添加</Button>
							<span style="font-size: 12px;color:#ff6100;font-style: italic;font-weight: 600;">
                数一数用户家现在有几只这种大小的瓶！
              </span>
						</FormItem>
						<FormItem v-for="(occitem, occindex) in yzNumList" :key='occitem' style='width: 100%;' class='occitem' v-if="yzNumList.length!=0">
							<Form :label-width="120" style="width: 100%;">
								<FormItem label='钢瓶 '>
									<Select v-model="occitem.occSpec" class='occSpec' @on-open-change='changeyzOccSpec(occitem.occSpec,occindex)' style="width: 350px">
										<Option v-for="item in goodsSizeList" :value="item.goodsId" :key="item.goodsId" v-if='item'>{{ item.goodsName }}</Option>
									</Select>
								</FormItem>
								<FormItem label='数量'>
									<InputNumber :min='1' :max='100' v-model="occitem.occNum" style="text-align: center;width:350px;" @on-blur='yzNumChange(occindex)' />
								</FormItem>
								<FormItem label=''>
									<Button @click="removeyzOccupy(occindex)" type="warning" style="height: 28px;margin-left: 120px;margin-top: 5px;">删除</Button>
								</FormItem>
							</Form>
						</FormItem>
						<!--<FormItem label="押瓶/占用瓶数量" prop="occupyNumber">
							<InputNumber :min='0' :max='100' v-model="yzcount" style="text-align: center;width:350px;" />
							<span class='errInfo' style="left:0px;top:30px">{{warnInfo.yzInfo}}</span>
						</FormItem>-->
						<FormItem label="增加押瓶">
							<Button type="info" long @click="handleAdd" icon="md-add" style="width: 160px;">添加押金单</Button>
						</FormItem>
						<FormItem v-for="(khitem, khindex) in depositform.items" v-if="depositform.items.length!=0" :key="khindex" :label="'押金单号 ' + (khindex+1)" :rules="{required: false, message: 'Item ' + khitem.khindex +' can not be empty', trigger: 'blur'}">
							<Row>
								<Col span="18">
								<Input type="text" v-model="khitem.value1" placeholder="押金单号" style="width: 350px;"></Input>
								<!--<Button @click="handleRemove(khindex)" type="warning" style="height: 28px;">删除</Button>-->
								</Col>
								<Col span="4" offset="1">

								</Col>
							</Row>
							<Row>
								<!--<Col span="4">
									商品  {{khindex+1}}
								</Col>-->

								<Col span="18">
								<Select v-model="khitem.occSpec" class='occSpec' @on-change='changeOccSpec1(khitem.occSpec,khindex)'
									style="width: 350px;margin: 6px 0;" label-in-value placeholder='请选择钢瓶'>

									<Option v-for="item in goodsSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
								</Select>
								<!--<Input type="text" v-model="khitem.value1" placeholder="" style="width: 350px;"></Input>-->
								<!--<Button @click="handleRemove(khindex)" type="warning" style="height: 28px;">删除</Button>-->
								</Col>
								<Col span="4" offset="1">

								</Col>
							</Row>
							<Row>
								<Col span="18">
								<InputNumber :min='0' v-model="khitem.pledgePrice" placeholder="押金金额" style="width: 350px;"/>
								</Col>
								<Col span="4" offset="1">

								</Col>
							</Row>
							<Row>
								<Col span="18">
									<DatePicker style='width: 350px;margin: 6px 0;' type="date" placeholder="押瓶开始时间" v-model='khitem.beginTime'
										format="yyyy-MM-dd"></DatePicker>

								</Col>
								<Col span="4" offset="1">

								</Col>
							</Row>
							<Row>
							<Col span="18">
								<Input type="textarea" :rows="2" v-model="khitem.remark" placeholder="押瓶备注" style="width: 350px;margin-bottom: 6px;"/>
								</Col>
								<Col span="4" offset="1">

								</Col>
							</Row>
							<Row>
								<Col span="24">

								<div class="demo-upload-list" v-for="(item,index) in khitem.depositPicList" :key="index">
									<template v-if="item.status === 'finished'">
										<img :src="item.url">
										<div class="demo-upload-list-cover">
											<Icon type="ios-eye-outline" @click.native="handleViewPicform(item.url)"></Icon>
											<Icon type="ios-trash-outline" @click.native="handleRemovePicform(item,khindex)"></Icon>
										</div>
									</template>
									<template v-else>
										<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
									</template>
								</div>
								<Upload v-if='khitem.depositPicList.length<1' ref="depositPic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessForm" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" :action="fileUrl" style="display: inline-block;width:58px;">
									<div style="width: 58px;height:58px;line-height: 58px;" @click='getDepIndex(khindex)'>
										<Icon type="ios-camera" size="20"></Icon>
									</div>
								</Upload>
								<Modal title="押金单图片" v-model="visible4" width='800' class-name="vertical-center-modal">
									<img :src="imgUrl" v-if="visible4" style="width:auto;height:auto;max-height: 550px;max-width: 768px;">
								</Modal>

								</Col>
							</Row>
							<Row>
								<Col span="18">
								<Button @click="handleRemove(khindex)" type="warning" style="height: 28px;">删除</Button>
								</Col>
							</Row>
						</FormItem>
						<FormItem>
							<span style="color:#ed4014;position: absolute;left: 0;">{{warnInfo.yjdInfo}}</span>
						</FormItem>
					</Form>
					</Col>
					<Col span="2">
					</Col>
					<Col span="6">
					<Form ref="formData3" :model="formItem" :label-width="120">
						<FormItem label="开户合同图片" class="picShow">
							<div class="demo-upload-list" v-for="item in uploadList" :key="item.index">
								<template v-if="item.status === 'finished'">
									<img :src="item.url">
									<div class="demo-upload-list-cover">
										<Icon type="ios-eye-outline" @click.native="handleViewpic(item.url)"></Icon>
										<Icon type="ios-trash-outline" @click.native="handleRemovepic(item)"></Icon>
									</div>
								</template>
								<template v-else>
									<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
								</template>
							</div>
							<Upload v-show='uploadList.length==0' ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" type="drag" :action="fileUrl" style="display: inline-block;width:58px;">
								<div style="width: 58px;height:58px;line-height: 58px;">
									<Icon type="ios-camera" size="20"></Icon>
								</div>
							</Upload>
							<Modal title="开户合同图片" v-model="visible2" width='800' class-name="vertical-center-modal">
								<img :src="imgUrl" v-if="visible2" style="width:auto;height:auto;max-height: 550px;max-width: 768px;">
							</Modal>
							<span class='errInfo' style="left:-100px;top:58px">{{warnInfo.contracInfo}}</span>
						</FormItem>
						<FormItem label="门头图片" class="picShow">
							<div class="demo-upload-list" v-for="item in storePicList" :key="item.index">
								<template v-if="item.status === 'finished'">
									<img :src="item.url">
									<div class="demo-upload-list-cover">
										<Icon type="ios-eye-outline" @click.native="handleViewstore(item.url)"></Icon>
										<Icon type="ios-trash-outline" @click.native="handleRemovestore(item)"></Icon>
									</div>
								</template>
								<template v-else>
									<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
								</template>
							</div>
							<Upload v-show='storePicList.length==0' ref="storePic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessstore" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUploadstore" type="drag" :action="fileUrl" style="display: inline-block;width:58px;">
								<div style="width: 58px;height:58px;line-height: 58px;">
									<Icon type="ios-camera" size="20"></Icon>
								</div>
							</Upload>
							<Modal title="门头图片" v-model="visible3" width='800' class-name="vertical-center-modal">
								<img :src="imgUrl" v-if="visible3" style="width:auto;height:auto;max-height: 550px;max-width: 768px;">
							</Modal>
						</FormItem>
					</Form>
					</Col>
					<Col span="2">
					</Col>
				</Row>
			</div>

			<!-- 燃气销售、接收人信息 -->
			<div v-show="current===3">
				<p class="currentTitle">燃气安全责任人信息</p>
				<Row type="flex" justify="end" class="code-row-bg">
					<Col span="2">
					</Col>
					<Col span="8">
					<Form ref="formData11" :model="formItem2" :label-width="120" :rules="ruleValidate5">
						<FormItem label="姓名" class='star' prop='securityName'>
							<Input type="text" v-model="formItem2.securityName" v-if='single' readonly></Input>
							<Input type="text" v-model="formItem2.securityName" v-else></Input>
							<span class='errInfo'>{{warnInfo.secNameInfo}}</span>
						</FormItem>
						<FormItem label="联系方式" class='star'>
							<Input type="text" v-model="securityPhone" v-if='single' readonly></Input>
							<Input type="text" v-model="securityPhone" v-else></Input>
							<span class='errInfo' v-if='!single'>{{warnInfo.secTelInfo}}</span>
						</FormItem>
					</Form>
					</Col>
					<Col span="2">
					</Col>
					<Col span="8">
					<Form ref="formData12" :model="formItem" :label-width="120" class='star'>
						<FormItem label="身份证号码">
							<Input type="text" v-model="securityIDNumber" v-if='single' readonly></Input>
							<Input type="text" v-model="securityIDNumber" v-else></Input>
							<span class='errInfo' v-if='!single'>{{warnInfo.secIdInfo}}</span>
						</FormItem>
						<Checkbox v-model="single" style='margin-left: 37px;' @on-change='singleChange'>同户主</Checkbox>
					</Form>
					</Col>
					<Col span="4">

					</Col>
				</Row>
				<p class="currentTitle">燃气接收人信息</p>
				<Row type="flex" justify="end" class="code-row-bg gasForm">
					<Col span="2">
					</Col>
					<Col span="12">
					<Form ref="formData6" :model="formItem3" :label-width="120">
						<FormItem label="" style='margin-left: 120px;'>
							<Button type="info" @click="handleAdd6" icon="md-add" style="width: 160px;">添加燃气接收人</Button>
						</FormItem>
						<FormItem v-for="(item, jsrindex) in jsrform.items" v-if="item.status" :key="jsrindex" :prop="'items.' + jsrindex + '.value'" :rules="{required: false, message: '必填项不能为空', trigger: 'blur'}">
							<Row>
								<Col span="16" style="display: flex;">
								<span class='stars' style="display: inline-block;width: 155px;text-align: right;margin-right: 10px;">姓名</span>
								<Input type="text" v-model="item.jsrname" v-if='single1&&jsrindex==0' readonly></Input>
								<Input type="text" v-model="item.jsrname" v-else></Input>
								</Col>
							</Row>
							<Row style='margin:10px 0;'>
								<Col span="16" style="display: flex;">
								<span class='stars' style="display: inline-block;width: 155px;text-align: right;margin-right: 10px;">联系方式</span>
								<Input type="text" v-model="item.contactNumber" v-if='single1&&jsrindex==0' readonly></Input>
								<Input type="text" v-model="item.contactNumber" v-else></Input>
								</Col>
							</Row>
							<Row>
								<Col span="16" style="display: flex;">
								<span class='stars' style="display: inline-block;width: 155px;text-align: right;margin-right: 10px;">身份证号码</span>
								<Input type="text" v-model="item.IDNumber" v-if='single1&&jsrindex==0' readonly></Input>
								<Input type="text" v-model="item.IDNumber" v-else></Input>
								</Col>
							</Row>
							<Row>
								<Col span="10">
								<Checkbox v-model="single1" style='margin-left:39px;' @on-change='singleChange1' v-if='jsrindex==0'>同户主</Checkbox>
								</Col>
							</Row>
							<Row style='padding-left: 26px;'>
								<Col span="10">
								<Button @click="handleRemove6(jsrindex)" v-if='jsrindex!=0' type="warning" style="height: 28px;">删除</Button>
								</Col>
							</Row>
						</FormItem>
						<FormItem label="">
							<span style="color:#ed4014;position: absolute;left:107px;top:-30px">{{warnInfo.jsrInfo}}</span>
						</FormItem>
					</Form>
					</Col>
					<Col span="10">
					</Col>
				</Row>
				<p class="currentTitle" style="padding-top:0px;margin-top: -20px;" v-if='!isResident'>营业执照信息</p>
				<Row type="flex" justify="end" class="code-row-bg gasForm" v-show='!isResident'>
					<Col span="2">
					</Col>
					<Col span="12">
					<Form :model="formLicense" :label-width="120">
						<FormItem label="营业执照编码">
							<Input type="text" v-model="formLicense.businessLicenseCode" placeholder="请输入营业执照编码" style="width:300px;" />
						</FormItem>
						<FormItem label="商户名称">
							<Input type="text" v-model="formLicense.businessName" placeholder="请输入商户名称" style="width:300px;" />
						</FormItem>
						<FormItem label="商户类型">
							<Input type="text" v-model="formLicense.businessType" placeholder="请输入商户类型" style="width:300px;" />
						</FormItem>
						<FormItem label="法人">
							<Input type="text" v-model="formLicense.legalPerson" placeholder="请输入法人" style="width:300px;" />
						</FormItem>
						<!--<FormItem label="成立日期" class='licenseDate'>
								<DatePicker type="datetime" placeholder="请选择成立日期" format="yyyy-MM-dd HH:mm:ss" v-model='formLicense.dateTime' style='width: 300px;'></DatePicker>
							</FormItem>-->
						<FormItem label="注册地址">
							<Input type="text" v-model="formLicense.businessAddredss" placeholder="请输入注册地址" style="width:300px;" />
						</FormItem>

						<FormItem label="营业执照图片" class="picShow">
							<div class="demo-upload-list" v-for="item in licensePicList" :key="item.index">
								<template v-if="item.status === 'finished'">
									<img :src="item.url">
									<div class="demo-upload-list-cover">
										<Icon type="ios-eye-outline" @click.native="handleViewstoreLicense(item.url)"></Icon>
										<Icon type="ios-trash-outline" @click.native="handleRemovestoreLicense(item)"></Icon>
									</div>
								</template>
								<template v-else>
									<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
								</template>
							</div>
							<Upload v-show='licensePicList.length==0' ref="licensePic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessstoreLicense" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUploadstoreLicense" type="drag" :action="fileUrl" style="display: inline-block;width:58px;">
								<div style="width: 58px;height:58px;line-height: 58px;">
									<Icon type="ios-camera" size="20"></Icon>
								</div>
							</Upload>
							<Modal title="营业执照图片" v-model="visible5" width='800' class-name="vertical-center-modal">
								<img :src="imgUrl" v-if="visible5" style="width:auto;height:auto;max-height: 550px;max-width: 768px;">
							</Modal>
						</FormItem>
						<FormItem>
							<span style="color: #F00;position: fixed;right: 400px;bottom:100px">{{formLicense.warnInfo}}</span>
						</FormItem>
					</Form>
					</Col>
					<Col span="10">
					</Col>
				</Row>
			</div>

			<!-- 燃气设备信息 -->
			<div v-show="current===4">
				<p class="currentTitle">燃气设备信息</p>
				<Row type="flex" justify="end" class="code-row-bg">
					<Col span="2">
					</Col>
					<Col span="12">
					<Form ref="formData9" :model="formItem5" :label-width="120">
						<FormItem label="">
							<Button type="info" @click="handleAdd3" icon="md-add" style="width: 160px;">添加燃气设备</Button>
						</FormItem>
						<FormItem v-for="(sbitem, sbindex) in gasAppliance.items" v-if="sbitem.status" :key="sbindex" :prop="'items.' + sbindex + '.value'" :rules="{required: false, message: 'Item ' + sbitem.sbindex +' can not be empty', trigger: 'blur'}">
							<Row>
								<Col span="7" class=''> 燃气设备种类
								</Col>
								<Col span="17">
								<Select v-model="sbitem.gasAppliancekind" @on-change="qtsb(sbindex)" label-in-value clearable>

									<Option v-for="item in gasSlist" :value="item.key" :key="item.key">{{ item.content }}</Option>
									<Option value="0">其他</Option>
								</Select>
								<div v-show="sbitem.kind">
									<Input type="text" v-model="sbitem.otherKind" placeholder="请填写种类名称"></Input>
								</div>
								</Col>
							</Row>
							<Row>
								<Col span="7" class=''> 规格型号
								</Col>
								<Col span="17">
								<Input type="text" v-model="sbitem.value"></Input>
								<!--<Select v-model="sbitem.value">
									<Option v-for="item in sizeList" :value="item.content" :key="item.key">{{ item.content }}</Option>
								</Select>-->
								</Col>
							</Row>
							<Row>
								<Col span="7" class=''> 数量
								</Col>
								<Col span="17">
								<InputNumber v-model="sbitem.count" style='width: 100%;' :min='0' :max='100' />
								</Col>
							</Row>
							<Row>
								<Col span="7" class=''>附件
								</Col>
								<Col span="17">
								<div class="demo-upload-list" v-for="item in sbitem.gasAppPicList" :key="item.index">
									<template v-if="item.status === 'finished'">
										<img :src="item.url">
										<div class="demo-upload-list-cover">
											<Icon type="ios-eye-outline" @click.native="handleViewGas(item.url)"></Icon>
											<Icon type="ios-trash-outline" @click.native="handleRemoveGas(item,sbindex)"></Icon>
										</div>
									</template>
									<template v-else>
										<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
									</template>
								</div>
								<Upload v-if='sbitem.gasAppPicList.length<5' ref="gasAppPic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessGas" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" :action="fileUrl" style="display: inline-block;width:58px;">
									<div style="width: 58px;height:58px;line-height: 58px;" @click='getGasIndex(sbindex)'>
										<Icon type="ios-camera" size="20"></Icon>
									</div>
								</Upload>
								<Modal title="燃气设备图片" v-model="visible6" width='800' class-name="vertical-center-modal">
									<img :src="imgUrl" v-if="visible6" style="width:auto;height:auto;max-height: 550px;max-width: 768px;">
								</Modal>
								</Col>
							</Row>
							<Row>
								<Col span="10">
								<Button @click="handleRemove3(sbindex)" v-if='sbindex!=0' type="warning" style="height: 28px;">删除</Button>
								</Col>
							</Row>
						</FormItem>
						<FormItem label="">
							<span style="color:#ed4014;position: absolute;left: 0;">{{warnInfo.gasAppInfo}}</span>
						</FormItem>
					</Form>
					</Col>
					<Col span="10">
					</Col>
				</Row>
				<p class="currentTitle">燃气附属设备信息</p>
				<Row type="flex" justify="end" class="code-row-bg">
					<Col span="2">
					</Col>
					<Col span="12">
					<Form ref="formData10" :model="formItem" :label-width="120" :rules="ruleValidate">
						<FormItem label="">
							<Button type="info" @click="handleAdd4" icon="md-add" style="width: 160px;">添加燃气附属设备</Button>
						</FormItem>
						<FormItem v-for="(sbfitem, sbfsindex) in gasOtherAppliance.items" v-if="sbfitem.status" :key="sbfsindex" :prop="'items.' + sbfsindex + '.value'" :rules="{required: false, message: 'Item ' + sbfitem.sbfsindex +' can not be empty', trigger: 'blur'}">
							<Row>
								<Col span="7"> 燃气设备种类
								</Col>
								<Col span="17">

								<Select v-model="sbfitem.gasOtherAppliancekind" @on-change="qtfssb(sbfsindex)" label-in-value clearable>
									<Option v-for="item in gasSlist1" :value="item.key" :key="item.key">{{ item.content }}</Option>
									<Option value="0">其他</Option>
								</Select>
								<div v-show="sbfitem.fsKind">
									<Input type="text" v-model="sbfitem.otherfsKind" placeholder="请填写种类名称"></Input>
								</div>
								</Col>
							</Row>
							<Row>
								<Col span="7"> 规格型号
								</Col>
								<Col span="17">
								<Input type="text" v-model="sbfitem.value"></Input>
								<!--<Select v-model="sbfitem.value" >
									<Option v-for="item in sizeList" :value="item.content" :key="item.key">{{ item.content }}</Option>
								</Select>-->
								</Col>
							</Row>
							<Row>
								<Col span="7"> 数量
								</Col>
								<Col span="17">

								<InputNumber v-model="sbfitem.count" :min='0' :max='100' style='width: 100%;' />
								</Col>
							</Row>
							<Row>
								<Col span="7"> 附件
								</Col>
								<Col span="17">
								<div class="demo-upload-list" v-for="item in sbfitem.gasSubAppPicList" :key="item.index">
									<template v-if="item.status === 'finished'">
										<img :src="item.url">
										<div class="demo-upload-list-cover">
											<Icon type="ios-eye-outline" @click.native="handleViewGasSub(item.url)"></Icon>
											<Icon type="ios-trash-outline" @click.native="handleRemoveGasSub(item,sbfsindex)"></Icon>
										</div>
									</template>
									<template v-else>
										<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
									</template>
								</div>
								<Upload v-if='sbfitem.gasSubAppPicList.length<5' ref="gasSubAppPic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessGasSub" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" :action="fileUrl" style="display: inline-block;width:58px;">
									<div style="width: 58px;height:58px;line-height: 58px;" @click='getSubIndex(sbfsindex)'>
										<Icon type="ios-camera" size="20"></Icon>
									</div>
								</Upload>
								<Modal title="燃气附属设备图片" v-model="visible7" width='800' class-name="vertical-center-modal">
									<img :src="imgUrl" v-if="visible7" style="width:auto;height:auto;max-height: 550px;max-width: 768px;">
								</Modal>
								</Col>
							</Row>
							<Row>
								<Col span="10">
								<Button @click="handleRemove4(sbfsindex)" type="warning" style="height: 28px;">删除</Button>
								</Col>
							</Row>
						</FormItem>
						<FormItem label="">
							<span style="color:#ed4014;position: absolute;left: 0;">{{warnInfo.gasSubAppInfo}}</span>
						</FormItem>
					</Form>
					</Col>
					<Col span="10">
					</Col>
				</Row>
			</div>
			<section ref="print">
				<!-- 完成确认页面 -->
				<div v-show="current===5" class="finishPage" :class="[isprint?'bottomNone':'bottomSix']">
					<p class="currentTitle">基本信息</p>
					<Row type="flex" justify="end" class="code-row-bg">
						<Col span="2">
						</Col>
						<Col span="8">
						<p><span class="currentLabel">所属组织/区域：</span><span class="currentContent">{{deptName}}</span></p>
						<p><span class="currentLabel">客户类型：</span><span class="currentContent">{{gasTypeName}}</span></p>
						<p v-if='!isResident'><span class="currentLabel">用气子类型：</span><span class="currentContent">{{gasChildTypeName}}</span></p>
						<p v-if='!isResident'><span class="currentLabel">企业/商户名称：</span><span class="currentContent">{{formValidate.businessName}}</span></p>
						<p><span class="currentLabel">用气地址：</span><span class="currentContent">{{baseProvince}}{{baseCity}}{{baseArea}}{{baseStreet}}{{formValidate.detailAddress}}</span></p>
						</Col>
						<Col span="4">
						</Col>
						<Col span="8">
						<p><span class="currentLabel">客户姓名：</span><span class="currentContent">{{formValidate.clientName}}</span></p>
						<p v-if='(hasCert===0||hasCert===1)&&!isResident'>
							<span class="currentLabel">有证无证：</span>
							<span class="currentContent">{{hasCert===0?'无证':'有证'}}</span>
						</p>
						<p><span class="currentLabel">身份证号码：</span><span class="currentContent">{{formValidate.ID}}</span></p>
						<p><span class="currentLabel">证件地址：</span><span class="currentContent">{{formValidate.userCertAddress}}</span></p>
						<p><span class="currentLabel">联系方式：</span><span class="currentContent">{{formValidate.telephoneNumber}}</span></p>
						<!--<p><span class="currentContent">{{clientRemark}}</span></p>-->
						<Row type="flex" justify="end" class="code-row-bg">
							<Col span="7">
							<span style="display: inline-block;width:90px;color:#000">客户备注：</span>
							</Col>
							<Col span="17">
							<CheckboxGroup v-model="formValidate.clientRemark" style="text-align: left;" v-if='isResident'>
								<Checkbox label="特困户"></Checkbox><br />
								<Checkbox label="残障低保户"></Checkbox><br />
								<Checkbox label="老年人(70岁以上)"></Checkbox><br />
								<Checkbox label="其他"></Checkbox>{{otherRemark}}
							</CheckboxGroup>
							</Col>
						</Row>
						</Col>
						<Col span="2">
						</Col>
					</Row>
					<p class="currentTitle">燃气销售信息</p>
					<Row type="flex" justify="end" class="code-row-bg">
						<Col span="2">
						</Col>
						<Col span="11">
						<p><span class="currentLabel">销售员姓名：</span><span class="currentContent">{{saleName}}</span></p>
						<!--<p><span class="currentLabel">结算方式：</span><span class="currentContent">{{actypeName}}</span></p>
						<p><span class="currentLabel">结算单</span></p>-->
						<div>
							<div v-for='(item,index) in saleform.items' style="margin-right: 15px;">
								<p><span class="currentLabel">允许使用钢瓶{{item.saleindex}}：</span><span class="currentContent">{{item.goodsName}}</span></p>
								<!--<p><span class="currentLabel">结算单价：</span><span class="currentContent">{{item.value}}</span></p>-->
							</div>
						</div>
						</Col>
						<Col span="1">
						</Col>
						<Col span="8">
						<p><span class="currentLabel">销售员工号：</span><span class="currentContent">{{salesmanCode}}</span></p>
						</Col>
						<Col span="2">
						</Col>
					</Row>
					<p class="currentTitle">用气量核定</p>
					<Row type="flex" justify="end" class="code-row-bg">
						<Col span="2">
						</Col>
						<Col span="16">
						<div style="display: flex;justify-content:flex-start;">
							<div v-for='item in gasDefineform.items' style="margin-right: 20px;">
								<p><span class="currentLabel">用气规格：</span><span class="currentContent">{{item.sizeName}}</span></p>
								<p><span class="currentLabel">每次起送量：</span><span class="currentContent">{{item.sqcount}}瓶</span></p>
								<p><span class="currentLabel">使用周期：</span><span class="currentContent">{{item.sycount}}天</span></p>
								<!--<p><span class="lbq stars">最大占用瓶数：</span><span class="currentContent">{{item.maxcount}}瓶</span></p>-->
							</div>
						</div>
						</Col>
						<Col span="2">
						</Col>
						<Col span="2">
						</Col>
						<Col span="2">
						</Col>
					</Row>
					<p class="currentTitle">用气卡信息</p>
					<Row type="flex" justify="end" class="code-row-bg">
						<Col span="2">
						</Col>
						<Col span="8">
						<p><span class="currentLabel">用气卡发放状态：</span>

							<span>{{last?'开启':'关闭'}}</span>
						</p>
						<div v-show="last">
							<p><span class="currentLabel">用气卡号：</span><span class="currentContent">{{cardNumber}}</span></p>
							<p><span class="currentLabel">默认订购钢瓶：</span><span class="currentContent">{{bookProductName}}</span></p>
							<p><span class="currentLabel">默认订购数量：</span><span class="currentContent">{{bookNumber}}</span></p>
						</div>
						</Col>
						<Col span="14">
						</Col>
					</Row>
					<p class="currentTitle">开户详情</p>
					<Row type="flex" justify="end" class="code-row-bg">
						<Col span="2">
						</Col>
						<Col span="11" style='color: #000;'>
						<p><span class="currentLabel">开户人：</span><span class="currentContent">{{holderName}}</span></p>
						<p><span class="currentLabel">开户合同编号：</span><span class="currentContent">{{formValidate2.contractNumber}}</span></p>
						<p><span class="currentLabel">最大占用瓶：</span><br />
							<div style="overflow: hidden;">
								<div v-for='item in occupyNumList' style="margin-left:5px;float: left;">
									<div><span class="currentLabel">钢瓶：</span><span class="currentContent">{{item.occSpecName}}</span></div>
									<div><span class="currentLabel">数量：</span><span class="currentContent">{{item.occNum}}</span></div>
								</div>
							</div>
						</p>
						<p><span class="currentLabel">开户时已押瓶：</span><br />
							<div style="overflow: hidden;">
								<div v-for='item in pledgeList' style="margin-left:5px;float: left;">
									<div><span class="currentLabel">钢瓶：</span><span class="currentContent">{{item.occSpecName}}</span></div>
									<div><span class="currentLabel">数量：</span><span class="currentContent">{{item.occNum}}</span></div>
								</div>
							</div>
						</p>
						<p><span class="currentLabel">开户时已占用瓶：</span><br />
							<div style="overflow: hidden;">
								<div v-for='item in yzNumList' style="margin-left:5px;float: left;">
									<div><span class="currentLabel">钢瓶：</span><span class="currentContent">{{item.occSpecName}}</span></div>
									<div><span class="currentLabel">数量：</span><span class="currentContent">{{item.occNum}}</span></div>
								</div>
							</div>
						</p>
						<p><span class="currentLabel">增加押瓶：</span><br />
							<div>
								<div v-for='item in depositform.items' style="margin-left:5px">
									<div><span class="currentLabel">押金单号：</span><span class="currentContent">{{item.value1}}</span></div>
									<div><span class="currentLabel">钢瓶：</span><span class="currentContent">{{item.occSpecName}}</span></div>
									<div><span class="currentLabel">押金金额：</span><span class="currentContent">{{item.pledgePrice}}</span></div>
									<div><span class="currentLabel">押瓶开始时间：</span><span class="currentContent">
										{{item.beginTime?common.conformatDat(item.beginTime):''}}
									</span></div>
									<div><span class="currentLabel">押瓶备注：</span><span class="currentContent">{{item.remark}}</span></div>
									<div style="display: flex;margin-top: 5px;"><span class="currentLabel">押金单图片：</span>
										<div v-for='item1 in item.depositPicList'><img :src='item1.url' alt="" v-if='item1' /></div>
									</div>
								</div>
							</div>
						</p>
						</Col>
						<Col span="1">
						</Col>
						<Col span="8">
						<p><span class="currentLabel">开户合同图片：</span><img :src="uploadList[0].url" alt="" v-if='uploadList[0]' /></p>
						<p><span class="currentLabel" style="padding-right: 28px;">门头图片：</span><img :src="storePicList[0].url" alt="" v-if='storePicList[0]' /></p>
						</Col>
						<Col span="2">
						</Col>
					</Row>

					<p class="currentTitle">燃气安全责任人信息</p>
					<Row type="flex" justify="end" class="code-row-bg">
						<Col span="2">
						</Col>
						<Col span="8">
						<p><span class="currentLabel">姓名：</span><span class="currentContent">{{formItem2.securityName}}</span></p>
						<p><span class="currentLabel">联系方式：</span><span class="currentContent">{{securityPhone}}</span></p>
						</Col>
						<Col span="4">
						</Col>
						<Col span="8">
						<p><span class="currentLabel">身份证号码：</span><span class="currentContent">{{securityIDNumber}}</span></p>
						</Col>
						<Col span="2">
						</Col>
					</Row>
					<p class="currentTitle">燃气接收人信息</p>
					<Row type="flex" justify="end" class="code-row-bg">
						<Col span="2">
						</Col>
						<Col span="16">
						<div style="display: flex;">
							<div v-for='(item,index) in jsrform.items' style="margin-right: 20px;">
								<p><span class="currentLabel">接收人{{index+1}}</span></p>
								<p><span class="currentLabel">姓名：</span><span class="currentContent">{{item.jsrname}}</span></p>
								<p><span class="currentLabel">联系方式：</span><span class="currentContent">{{item.contactNumber}}</span></p>
								<p><span class="currentLabel">身份证号码：</span><span class="currentContent">{{item.IDNumber}}</span></p>
							</div>
						</div>
						</Col>
						<Col span="2">
						</Col>
						<Col span="2">
						</Col>
						<Col span="2">
						</Col>
					</Row>
					<p class="currentTitle" v-if='!isResident'>营业执照信息</p>
					<Row type="flex" justify="end" class="code-row-bg" v-if='!isResident'>
						<Col span="2">
						</Col>
						<Col span="12">
						<p><span class="currentLabel">营业执照编码：</span><span class="currentContent">{{formLicense.businessLicenseCode}}</span></p>
						<p><span class="currentLabel">商户名称：</span><span class="currentContent">{{formLicense.businessName}}</span></p>
						<p><span class="currentLabel">商户类型：</span><span class="currentContent">{{formLicense.businessType}}</span></p>
						<p><span class="currentLabel">法人：</span><span class="currentContent">{{formLicense.legalPerson}}</span></p>
						<p><span class="currentLabel">注册地址：</span><span class="currentContent">{{formLicense.businessAddredss}}</span></p>
						</Col>

						<Col span="10">
						<p><span class="currentLabel">营业执照图片：</span><img :src="licensePicList[0].url" alt="" v-if='licensePicList[0]' /></p>
						</Col>
					</Row>

					<p class="currentTitle">燃气设备信息</p>
					<Row type="flex" justify="end" class="code-row-bg">
						<Col span="2">
						</Col>
						<Col span="20">
						<div style="display: flex;">
							<div v-for='item in gasAppliance.items'>
								<p><span class="currentLabel">燃气设备种类：</span><span class="currentContent">{{item.gasAppName||item.otherKind}}</span></p>
								<p><span class="currentLabel">规格型号：</span><span class="currentContent">{{item.value}}</span></p>
								<p><span class="currentLabel">数量：</span><span class="currentContent">{{item.count}}</span></p>
								<div style="display: flex;"><span class="currentLabel">附件：</span>
									<div v-for='item1 in item.gasAppPicList'><img :src="item1.url" alt="" v-if='item1' /></div>
								</div>
							</div>
						</div>

						</Col>

						<Col span="2">
						</Col>
					</Row>
					<p class="currentTitle">燃气附属设备信息</p>
					<Row type="flex" justify="end" class="code-row-bg">
						<Col span="2">
						</Col>
						<Col span="20">
						<div style="display: flex;">
							<div v-for='item in gasOtherAppliance.items'>
								<p><span class="currentLabel">燃气附属设备种类：</span><span class="currentContent">{{item.gasOtherAppName||item.otherfsKind}}</span></p>
								<p><span class="currentLabel">规格型号：</span><span class="currentContent">{{item.value}}</span></p>
								<p><span class="currentLabel">数量：</span><span class="currentContent">{{item.count}}</span></p>
								<div style="display: flex;"><span class="currentLabel">附件：</span>
									<div v-for='item1 in item.gasSubAppPicList'><img :src="item1.url" alt="" v-if='item1' /></div>
								</div>
							</div>
						</div>
						</Col>
						<Col span="0">
						</Col>
						<Col span="0">
						</Col>
						<Col span="2">
						</Col>
					</Row>
				</div>

			</section>
			<div style="position: fixed;right: 150px;bottom: 100px;z-index: 1000;" v-has='919'>
				<Button @click="prev()" v-if="current>0">上一步</Button>
				<Button type="primary" @click="next()" v-if="current<5" style="margin: 0 20px;">下一步</Button>
				<Button type="primary" v-if="current===5" @click='printIn' style="margin-left:20px;">导出打印</Button>
				<Button type="primary" @click="next()" v-if="current===5" style="margin-left:20px;">确认提交</Button>
				<!--<Button @click="handleBackClick">返回</Button>-->
			</div>
		</div>
		<!-- <div style="position: fixed;top:62px;left: 205px;color: #51B5EA;font-size: 24px;z-index: 1000;cursor: pointer;" @click="handleBackClick">
			<Icon type="md-arrow-round-back" />
		</div> -->
	</div>
</template>
<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import Print from '@/plugs/print';
	Vue.use(Print)
	export default {
		data() {
			return {
				hasCert: '',
				newAllows: [],
				newSizeList1: [],
				licensePicList: [],
				formLicense: {
					businessLicenseCode: '',
					businessName: '',
					businessType: '',
					legalPerson: '',
					dateTime: '',
					businessAddredss: '',
					warnInfo: ''
				},
				yzoccindex: 1,
				yzNumList: [{
					yzoccindex: 1,
					status: 1,
					occSpec: '',
					occNum: 1,
					occSpecName: ''
				}],
				occindex: 1,
				occupyNumList: [{
					occindex: 1,
					status: 1,
					occSpec: '',
					occNum: 0,
					occSpecName: '',
					maxNum: 100
				}],
				isResident: false,
				//图片上传路径
				fileUrl: pathUrls.fileUpload,
				//				fileUrl: 'https://sys.payq-iot.com:8089/file/upload',
				//				fileUrl: 'https://source.payq-iot.com:8089/file/upload',
				//信息提示语
				warnInfo: {
					depInfo: '',
					gasInfo: '',
					gasChiInfo: '',
					idCardInfo: '',
					telInfo: '',
					addressInfo: '',
					contracInfo: '',
					useGasInfo: '',
					secNameInfo: '',
					secTelInfo: '',
					secIdInfo: '',
					jsrInfo: '',
					gasAppInfo: '',
					staNameInfo: '',
					yzInfo: '',
					yjdInfo: '',
					maxInfo: '',
					saleInfo: '',
					gasSubAppInfo: '',
					contractInfo: '',
					goodsSpecInfo: '',
					certAddressInfo: ''
				},

				//				baseUrl: 'test.payq-iot.com:7002/',
				userData: (JSON.parse(this.$store.state.userData)),
				// 基本信息
				options: [{
					value: '1',
					label: '平台'
				}],
				formValidate: {
					//基本信息
					place: '',
					gasType: '',
					gasSubType: '',
					subType1List: [],
					subType2List: [],
					gasTypeList: [],
					businessName: '',
					clientName: '',
					ID: '',
					telephoneNumber: '',
					province: null,
					city: null,
					area: null,
					street: null,
					clientRemark: [],
					detailAddress: null,
					userCertAddress: ''
				},
				//				ruleValidate2: {
				//					contractNumber: [{
				//						required: true,
				//						message: "请填写开户合同编号",
				//						trigger: 'blur'
				//					}, {
				//						type: 'string',
				//						max: 50,
				//						message: '合同编号不能超过50个字符',
				//						trigger: 'blur'
				//					}]
				//				},
				ruleValidate3: {
					size: [{
						required: true,
						message: "请填写用气规格",
						trigger: 'blur'
					}]
				},

				ruleValidate5: {
					securityName: [{
						required: true,
						message: '请填写安全责任人姓名',
						trigger: 'blur,change'
					}, {
						type: 'string',
						max: 13,
						message: '姓名不能超过13个字符',
						trigger: 'blur'
					}]
				},
				ruleValidate1: {
					//					place: [{
					//						required: true,
					//					}],
					gasType: [{
						required: true,
					}],
					gasSubType: [{
						required: true,
					}],

					businessName: [{
						required: true,
						message: '请填写企业商户名称',
						trigger: 'blur'
					}, {
						type: 'string',
						max: 32,
						message: '商户名称不能超过32个字符',
						trigger: 'blur'
					}],
					clientName: [{
						required: true,
						message: '请填写客户姓名',
						trigger: 'blur,change'
					}, {
						type: 'string',
						max: 10,
						message: '姓名不能超过10个字符',
						trigger: 'blur'
					}],
					ID: [{
						required: true,
						message: '请填写身份证号码',
						trigger: 'blur,change'
					}],
					userCertAddress: [{
						required: true,
						message: '请填写证件地址',
						trigger: 'blur,change'
					}],
					telephoneNumber: [{
						required: true,
						message: '请填写联系方式',
						trigger: 'blur'
					}],
					address: [{
						required: true,
					}],
				},
				ruleValidate: {
					contractNumber: [{
						required: true,
						message: '请填写合同编号',
						trigger: 'change'
					}]
				},
				provinceList: [],
				cityList: [],
				areaList: [],
				streetList: [],
				//开户详情
				//index: 1,
				khindex: 0,
				depositform: {
					items: []
				},
				formValidate2: {
					contractNumber: '',
					accountHolder: '',
					goodsSpec: ''
				},
				otherDetail: false,
				// defaultImages: [],
				// defaultList: [],
				imgName: '',
				imgUrl: '',
				visible: false,
				visible1: false,
				visible2: false,
				visible3: false,
				visible4: false,
				visible5: false,
				visible6: false,
				visible7: false,
				uploadList: [],
				depositPicList: [],
				storePicList: [],
				maxCount: 1,
				yzcount: 0,
				staffNameList: [],

				//用气量
				yqindex: 1,
				switch2: false,
				cardNumber: '',
				bookProduct: '',
				bookNumber: 0,
				cardCodeList: [],
				sizeList: [],
				// sqcount: 0,
				// sycount: 0,
				//				size: '',
				last: false,
				gasDefineform: {
					items: [{
						yqindex: 1,
						status: 1,
						sqcount: 0,
						sycount: 0,
						size: '',
						maxcount: 0,
						sizeName: ''
					}]
				},

				//燃气销售
				securityIDNumber: '',
				formItem2: {
					securityName: '',
				},
				securityPhone: '',
				saleform: {
					items: [{
						saleindex: 1,
						status: 1,
						ssize: '',
						goodsName: null,
						occNum: 1
					}]
				},
				saleindex: 1,
				jsrindex: 1,
				ssize: '',
				jsrform: {
					items: [{
						contactNumber: '',
						jsrname: '',
						IDNumber: '',
						jsrindex: 1,
						status: 1
					}]
				},

				//燃气设备
				gasAppliance: {
					items: [{
						value: '',
						sbindex: 1,
						status: 1,
						count: 0,
						gasAppliancekind: '',
						otherKind: '',
						gasAppPicList: [],
						gasAppName: '',
						kind: false,
					}]
				},
				gasAppPicList: [],
				sbindex: 1,
				//燃气附属设备
				gasOtherAppliance: {
					items: [{
						value: '',
						sbfsindex: 1,
						status: 1,
						count: 0,
						gasOtherAppliancekind: '',
						otherfsKind: '',
						gasSubAppPicList: [],
						gasOtherAppName: '',
						fsKind: false
					}]
				},
				gasSubAppPicList: [],
				sbfsindex: 1,
				//分页跳页
				success: 0,
				panelNum: 0,
				current: 0,
				switch3: true,
				//组织名
				deptName: '',
				deptid: '',
				//省市级街道
				baseProvince: '',
				baseCity: '',
				baseArea: '',
				baseStreet: '',
				//开户人姓名
				holderName: '',
				//销售员姓名
				saleName: '',
				salesmanId: '',
				//工号
				salesmanCode: '',
				//用气子类型名字
				gasChildTypeName: '',
				//客户备注
				userRemarks: [],
				acTypeList: [],
				gasSlist: [],
				gasSlist1: [],
				actypeName: '现结',
				otherRemark: '',
				newSize: [],
				newSize1: [],
				single: false,
				single1: false,
				gasTypeName: '',
				newSizeList: [],
				bookProductName: null,
				isprint: false,
				goodsSizeList: [],
				pledgeindex: 1,
				pledgeList: [{
					pledgeindex: 1,
					status: 1,
					occSpec: '',
					occNum: 1,
					occSpecName: ''
				}],

			}
		},
		watch: {
			'saleform.items': {
				handler(newItems, oldItems) {
					this.goodsSizeList = [];
					this.occupyNumList = [];
					this.pledgeList = [{
						pledgeindex: 1,
						status: 1,
						occSpec: '',
						occNum: 1,
						occSpecName: '',

					}];

					this.yzNumList = [{
						yzoccindex: 1,
						status: 1,
						occSpec: '',
						occNum: 1,
						occSpecName: '',
					}];

					this.gasDefineform.items = [{
						value: '',
						yqindex: 1,
						status: 1,
						sqcount: 0,
						sycount: 0,
						maxcount: 0,
						size: '',
						sizeName: ''
					}]

					this.occindex = 0;
					this.pledgeindex = 1;
					this.yzoccindex = 1;
					this.yqindex = 1;
					newItems.forEach((items, index) => {
						this.newSizeList.forEach(item => {
							if(items.ssize == item.goodsId) {
								this.goodsSizeList.push(item);
							}

						})
						//最大占用瓶
						this.occupyNumList.push({
							occindex: index + 1,
							status: 1,
							occSpec: items.ssize,
							occNum: items.occNum,
							occSpecName: items.goodsName,
							maxNum: items.occNum ? items.occNum : 100
						})
						//开户时已押瓶

					})
					this.occindex = newItems.length;

					if(this.goodsSizeList.length) {
						this.pledgeList[0].occSpec = this.goodsSizeList[0].goodsId;
						this.pledgeList[0].occSpecName = this.goodsSizeList[0].goodsName;
						this.yzNumList[0].occSpec = this.goodsSizeList[0].goodsId;
						this.yzNumList[0].occSpecName = this.goodsSizeList[0].goodsName;
					}　　
				},
				deep: true,
				immediate: true
			},

		},
		methods: {

			yzNumChange(v) {
				if(!this.yzNumList[v].occNum) {
					this.yzNumList[v].occNum = 1;
				}
			},
			pledgeChange(v) {

				if(!this.pledgeList[v].occNum) {
					this.pledgeList[v].occNum = 1;
				}

			},

			removePledge(occyzindex) {
				this.pledgeList[occyzindex].status = 0;
				this.pledgeList.splice(occyzindex, 1)
				this.pledgeindex--;
			},
			changePledge(v, index) {
				if(v) {
					for(let item of this.newSizeList) {
						if(v == item.goodsId) {
							this.pledgeList[index].occSpecName = item.goodsName;
						}
					}
					this.pledgeList[index].occSpec = v;
					let lens = this.pledgeList.length;
					let newOcc = this.pledgeList;
					for(let i = 0; i < lens; i++) {
						if(newOcc[i].occSpec == v && i != index) {
							this.pledgeList[index].occSpec = null;
							this.$Message['warning']({
								background: true,
								content: '钢瓶重复，请重新选择!',

							});
							return false
						}
					}
				} else {
					this.pledgeList[index].occSpec = null;
					this.pledgeList[index].occSpecName = null
				}
			},
			//添加开户时已押瓶
			addPledge() {
				let len = this.goodsSizeList.length;
				let occLen = this.pledgeList.length;
				if(len > occLen) {
					this.occyzindex++;
					let newForms = [];
					newForms = this.saleform.items.filter(item => !this.pledgeList.some(ele => ele.occSpec === item.ssize))
					this.pledgeList.push({
						pledgeindex: this.pledgeindex,
						status: 1,
						occSpec: newForms.length ? newForms[0].ssize : '',
						occNum: 1,
						occSpecName: newForms.length ? newForms[0].goodsName : '',
					})
				} else {
					this.$Message['warning']({
						background: true,
						content: `最多添加${len}种钢瓶!`,

					});
					return false
				}
			},
			//营业执照图片
			handleViewstoreLicense(url) { //图片放大
				this.imgUrl = url;
				this.visible5 = true;
			},
			handleRemovestoreLicense(file) { //删去营业执照图片
				const fileList = this.$refs.licensePic.fileList;
				this.$refs.licensePic.fileList.splice(fileList.indexOf(file), 1);
			},
			handleBeforeUploadstoreLicense() { //上传门头图片数量为1
				const check = this.licensePicList.length < 1;
				if(!check) {
					this.$Notice.warning({
						title: '只能上传一张图片.'
					});
				}
				return check;
			},
			handleSuccessstoreLicense(res, file) { //营业执照图片上传成功钩子
				//				console.log(res);
				file.url = res.data.src;
				file.name = res.data.name;
			},
			//删除押瓶/占用瓶
			removeyzOccupy(occyzindex) {
				this.yzNumList[occyzindex].status = 0;
				this.yzNumList.splice(occyzindex, 1)
				this.occyzindex--;
			},

			//改变押瓶/占用瓶钢瓶
			changeyzOccSpec(v, index) {
				if(v) {
					for(let item of this.newSizeList) {
						if(v == item.goodsId) {
							this.yzNumList[index].occSpecName = item.goodsName;
						}
					}
					this.yzNumList[index].occSpec = v;
					let lens = this.yzNumList.length;
					let newOcc = this.yzNumList;
					for(let i = 0; i < lens; i++) {
						if(newOcc[i].occSpec == v && i != index) {
							this.yzNumList[index].occSpec = null;
							this.$Message['warning']({
								background: true,
								content: '钢瓶重复，请重新选择!',

							});
							return false
						}
					}
				} else {
					this.yzNumList[index].occSpec = null;
					this.yzNumList[index].occSpecName = null
				}
			},
			//添加押占瓶数量
			addYzOccupy() {
				let len = this.goodsSizeList.length;
				let occLen = this.yzNumList.length;
				if(len > occLen) {
					this.occyzindex++;
					let newForms = [];
					newForms = this.saleform.items.filter(item => !this.yzNumList.some(ele => ele.occSpec === item.ssize))
					this.yzNumList.push({
						occindex: this.occyzindex,
						status: 1,
						occSpec: newForms.length ? newForms[0].ssize : '',
						occNum: 1,
						occSpecName: newForms.length ? newForms[0].goodsName : 0,
					})
				} else {
					this.$Message['warning']({
						background: true,
						content: `最多添加${len}种钢瓶!`,

					});
					return false
				}
			},
			//改变押金单商品规格
			changeOccSpec1(v, index) {
				if(v) {
					for(let item of this.newSizeList) {
						if(v == item.goodsId) {
							this.depositform.items[index].occSpecName = item.goodsName;
						}
					}
				} else {
					this.depositform.items[index].occSpec = null;
					this.depositform.items[index].occSpecName = null
				}
			},
			//改变最大占用瓶商品
			changeOccSpec(v, index) {
				if(v) {

					this.saleform.items.forEach(item => {
						if(item.ssize == v) {
							this.occupyNumList[index].occSpecName = item.goodsName;
							this.occupyNumList[index].maxNum = item.occNum
							this.occupyNumList[index].occNum = item.occNum
						}
					})

					this.occupyNumList[index].occSpec = v;
					let lens = this.occupyNumList.length;
					let newOcc = this.occupyNumList;
					for(let i = 0; i < lens; i++) {
						if(newOcc[i].occSpec == v && i != index) {
							this.occupyNumList[index].occSpecName = '';
							this.occupyNumList[index].maxNum = 100;
							this.occupyNumList[index].occNum = 0;
							this.occupyNumList[index].occSpec = null;
							this.$Message['warning']({
								background: true,
								content: '钢瓶重复，请重新选择!',

							});
							return false
						}
					}
				} else {
					this.occupyNumList[index].occSpec = null;
					this.occupyNumList[index].occSpecName = null
				}
			},
			//最大占用瓶删除
			removeMaxOccupy(occindex) {
				this.occupyNumList[occindex].status = 0;
				this.occupyNumList.splice(occindex, 1)
				this.occindex--;
			},
			//最大占用瓶添加
			addMaxOccupy() {

				let len = this.goodsSizeList.length;
				let occLen = this.occupyNumList.length;
				if(len > occLen) {
					this.occindex++;
					let newForms = [];
					newForms = this.saleform.items.filter(item => !this.occupyNumList.some(ele => ele.occSpec === item.ssize))

					this.occupyNumList.push({
						occindex: this.occindex,
						status: 1,
						occSpec: newForms.length ? newForms[0].ssize : '',
						occNum: newForms.length ? newForms[0].occNum : 0,
						occSpecName: newForms.length ? newForms[0].goodsName : 0,
						maxNum: newForms.length ? newForms[0].occNum : 100,
					})
				} else {
					this.$Message['warning']({
						background: true,
						content: `最多添加${len}种钢瓶!`,

					});
					return false
				}

			},
			changeProduct(v) {
				if(v) {
					this.bookProductName = v.label;
				} else {
					this.bookProductName = null;
				}
			},
			//获取商品信息列表
			getGoodsList() {
				this.newSizeList = [];
				_http.http1('post', pathUrls.deptgoodsList, {
					'isGas': 2,
				}, 'form').then((res) => {
					this.newSizeList1 = res.data;
				})
			},
			//责任人是否同户主
			singleChange(v) {
				if(v) {
					this.formItem2.securityName = this.formValidate.clientName;
					this.securityPhone = this.formValidate.telephoneNumber;
					this.securityIDNumber = this.formValidate.ID;
				} else {
					this.formItem2.securityName = '';
					this.securityPhone = '';
					this.securityIDNumber = '';
				}
			},
			//接收人人是否同户主
			singleChange1(v) {
				if(v) {
					this.jsrform.items[0].jsrname = this.formValidate.clientName;
					this.jsrform.items[0].contactNumber = this.formValidate.telephoneNumber;
					this.jsrform.items[0].IDNumber = this.formValidate.ID;
				} else {
					this.jsrform.items[0].jsrname = '';
					this.jsrform.items[0].contactNumber = '';
					this.jsrform.items[0].IDNumber = '';
				}
			},
			//改变结算单规格
			changeSize1(v, index) {
				if(v) {
					for(let item of this.newSizeList) {
						if(v == item.goodsId) {
							this.saleform.items[index].goodsName = item.goodsName;
						}
					}
					this.saleform.items[index].ssize = v
					let lens = this.saleform.items.length;
					let newSale = this.saleform.items
					for(let i = 0; i < lens; i++) {
						if(newSale[i].ssize == v && i != index) {
							this.saleform.items[index].ssize = null;
							this.$Message['warning']({
								background: true,
								content: '钢瓶重复，请重新选择!',

							});
							return false
						}
					}
				} else {
					this.saleform.items[index].ssize = null;
					this.saleform.items[index].goodsName = null
				}

			},
			//改变用气量核定用气规格
			changeSize(v, index) {
				if(v) {
					for(let item of this.newSizeList) {
						if(v == item.goodsId) {
							this.gasDefineform.items[index].sizeName = item.goodsName;
						}
					}

					let lens = this.gasDefineform.items.length;
					let newGas = this.gasDefineform.items
					for(let i = 0; i < lens; i++) {
						if(newGas[i].size == v && i != index) {
							this.gasDefineform.items[index].size = null;
							this.$Message['warning']({
								background: true,
								content: '用气规格重复，请重新选择!',

							});
							return false;

						}
					}
				} else {
					this.gasDefineform.items[index].size = null;
				}

			},
			//获取押占瓶索引
			getDepIndex(index) {
				this.depIndex = index;
			},
			//燃气设备索引
			getGasIndex(index) {
				this.gasIndex = index;
			},
			//燃气附属设备索引
			getSubIndex(index) {
				this.subIndex = index;
			},
			//改变用气类型
			gasTypeChanged(v) {
				if(v) {

					this.newSizeList = []
					if(v.tag.detailType == 1) {
						this.isResident = true;
						this.formValidate.gasSubType = null;
						this.formValidate.businessName = null;
						this.hasCert=null;

					} else {
						this.isResident = false;
						this.formValidate.clientRemark = [];
						this.otherRemark = null;
					}
					this.gasTypeName = v.label;
					//					this.getSize(this.deptid); //获得规格
					if(v.tag.allowedGoods && JSON.parse(v.tag.allowedGoods).length) {
						this.saleform.items = [];
						this.newAllows = [];
						let allows = JSON.parse(v.tag.allowedGoods);

						this.saleindex = allows.length;

						this.newSizeList1.forEach(item => {

							allows.forEach((allowItem, index) => {
								if(item.goodsId == allowItem.goodsId) {
									this.newSizeList.push(item);
									this.saleform.items.push({
										saleindex: index + 1,
										status: 1,
										ssize: allowItem.goodsId,
										goodsName: item.goodsName,
										occNum: allowItem.number
									})
									this.newAllows.push({
										saleindex: index + 1,
										status: 1,
										ssize: allowItem.goodsId,
										goodsName: item.goodsName,
										occNum: allowItem.number
									})

								}

							})

						})

					} else {

						this.saleindex = 1;
						this.occindex = 1;
						this.saleform.items = [{
							saleindex: 1,
							status: 1,
							ssize: '',
							goodsName: '',
							occNum: 1
						}]
						//						this.occupyNumList=[{
						//							occindex:1,
						//							status: 1,
						//							occSpec:'',
						//							occNum:1,
						//							occSpecName:''
						//						}]
						//						this.pledgeList=[{
						//										pledgeindex:1,
						//										status: 1,
						//										occSpec:'',
						//										occNum:1,
						//										occSpecName:''
						//									}]
						//						this.yzNumList=[{
						//											yzoccindex:1,
						//											status: 1,
						//											occSpec:'',
						//											occNum:1,
						//											occSpecName:'',
						//										}]
					}

				} else {
					this.isResident = false;
				}

			},
			handleBackClick() {
				this.$router.go(-1)
			},
			handleClick0() {
				this.current = 0
			},
			handleClick1() {
				this.current = 1
			},
			handleClick2() {
				this.current = 2
			},
			handleClick3() {
				this.current = 3
			},
			handleClick4() {
				this.current = 4
			},
			handleClick5() {
				this.current = 5
			},
			//改变用气子类型
			selectChildType(v) {
				this.gasChildTypeName = v.label
			},
			//保留两位小数
			toDecimal(x) {
				var f = parseFloat(x);
				if(isNaN(f)) {
					return;
				}
				f = Math.round(x * 100) / 100;
				return f;
			},
			//点击提交
			handleSubmit(v) {

				let userDepositNumber = []; //押瓶详情
				let taskList = []; //用气量信息
				let receiverList = []; //接收人
				let allowGoods = []; //销售信息
				let gasDevice = []; //燃气设备信息
				let gasAuxDevice = []; //燃气辅助设备信息
				let maxOccupy = []; //最大占用瓶
				let yzOccupy = []; //押占瓶
				let pledgeBottle = []; //开户时已押瓶
				let businessLicenseEntity;
				//营业执照信息
				if(!this.isResident) {
					businessLicenseEntity = {
						'businessLicenseCode': this.formLicense.businessLicenseCode, //营业执照编码
						'name': this.formLicense.businessName, //商户名称
						'type': this.formLicense.businessType, //商户类型
						'legalPerson': this.formLicense.legalPerson, //法人
						'businessLicensePic': this.licensePicList.length ? this.licensePicList[0].url : '', //营业执照图片
						'businessAddredss': this.formLicense.businessAddredss, //注册地址
					}
				} else {
					businessLicenseEntity = {
						'businessLicenseCode': null, //营业执照编码
						'name': null, //商户名称
						'type': null, //商户类型
						'legalPerson': null, //法人
						'businessLicensePic': null, //营业执照图片
						'businessAddredss': null, //注册地址
					}

				}

				if(this.yzNumList.length) {
					for(let item of this.yzNumList) {
						if(item.occSpec) {
							yzOccupy.push({
								'goodsId': item.occSpec,
								'number': item.occNum
							})
						}

					}
				}
				if(this.pledgeList.length) {
					for(let item of this.pledgeList) {
						if(item.occSpec) {
							pledgeBottle.push({
								'goodsId': item.occSpec,
								'number': item.occNum
							})
						}

					}
				}
				if(this.occupyNumList.length) {
					for(let item of this.occupyNumList) {
						if(item.occSpec) {
							maxOccupy.push({
								'goodsId': item.occSpec,
								'number': item.occNum
							})
						}

					}
				}
				if(this.depositform.items.length) {
					for(let item of this.depositform.items) {
						let pic = [];
						if(item.depositPicList.length) {
							item.depositPicList.map((item1) => {
								pic.push(item1.url)
							})
						}
						userDepositNumber.push({
							'depositNumber': item.value1,
							'depositPic': pic.toString(),
							'goodsId': item.occSpec,
							'pledgePrice':item.pledgePrice,
							'beginTime':item.beginTime?this.common.conformatDat(item.beginTime):'',
							'remark':item.remark,
						});
					}
				}
				if(this.gasDefineform.items.length) {
					for(let item of this.gasDefineform.items) {
						if(item.size) {
							taskList.push({
								'numUnit': item.sqcount,
								'spec': item.size,
								'dailyNum': item.sycount ? this.toDecimal(item.sqcount / item.sycount) : 0,
								//'maxOccupiedNumber': item.maxcount
							});
						}

					}
				}
				if(this.jsrform.items.length) {
					for(let item of this.jsrform.items) {
						receiverList.push({
							'receiverName': item.jsrname,
							'receiverPhone': item.contactNumber,
							'idCard': item.IDNumber
						})
					}
				}
				if(this.saleform.items.length) {
					for(let item of this.saleform.items) {
						allowGoods.push(item.ssize);
					}
				}
				if(this.gasAppliance.items.length) {
					for(let item of this.gasAppliance.items) {
						let pic = []
						item.gasAppPicList.map((item1) => {
							pic.push(item1.url)

						})
						gasDevice.push({
							'gasDeviceType': item.gasAppliancekind,
							'content': item.otherKind,
							'gasDeviceSpec': item.value,
							'number': item.count,
							'pic': pic
						})
					}
				}

				if(this.gasOtherAppliance.items.length) {
					for(let item of this.gasOtherAppliance.items) {
						let pic = []
						if(item.gasSubAppPicList.length) {
							item.gasSubAppPicList.map((item1) => {
								pic.push(item1.url)
							})
						}
						gasAuxDevice.push({
							'gasAuxDeviceType': item.gasOtherAppliancekind,
							'content': item.otherfsKind,
							'gasAuxDeviceSpec': item.value,
							'number': item.count,
							'pic': pic
						})

					}
				}
				//				console.log(this.gasOtherAppliance.items)
				//				return false;
				if(this.userRemarks.length) {
					for(let item of this.userRemarks) {
						if(item.remarksKey == '4') {
							item.remarksContent = this.otherRemark
						}
					}
				}
				let subData = {
					'hasCert': this.hasCert, //有证无证
					'userCertAddress': this.formValidate.userCertAddress, //身份证地址
					'userDeptId': this.deptid, //组织id
					'userOrderType': this.formValidate.gasType, //用气类型
					'userGasSubType': this.formValidate.gasSubType, //用气子类型
					'userCompanyName': this.formValidate.businessName, //企业商户名称
					'userRealName': this.formValidate.clientName, //客户姓名
					'userIdCardNumber': this.formValidate.ID, //身份证号码
					'userPhoneNumber': this.formValidate.telephoneNumber, //联系电话
					//地址
					'userProvinceCode': this.formValidate.province, //省份编码
					'userCityCode': this.formValidate.city, //城市编码
					'userAreaCode': this.formValidate.area, //区域编码
					'userStreetCode': this.formValidate.street, //街道编码
					'userAddress': this.formValidate.detailAddress, //详细地址
					'userOpeningStaff': this.formValidate2.accountHolder, //开户人
					'cardCode': this.cardNumber, //订气卡编号
					'doorPic': this.storePicList.length ? this.storePicList[0].url : '', //门头图片
					'countType': '1', //结算方式
					'taskList': taskList, //用气量信息
					'userExtendEntity': //拓展信息
					{
						'businessLicenseEntity': businessLicenseEntity, //营业执照相关信息
						'userRemarks': JSON.stringify(this.userRemarks), //用户备注
						//开户详情
						'userContractNumber': this.formValidate2.contractNumber, //开户合同编号
						'contractPic': this.uploadList.length ? this.uploadList[0].url : '', //开户合同图片
						'initStorageBottles': JSON.stringify(yzOccupy), //开户时已占用瓶数
						'maxOccupiedNumber': JSON.stringify(maxOccupy), //最大占用瓶数
						'userDepositNumber': JSON.stringify(userDepositNumber), //押瓶详情
						'initPledgeBottles': JSON.stringify(pledgeBottle), //开户时已押瓶
						//用气量用气卡信息

						'safetyPerson': JSON.stringify({ //安全员信息
							'name': this.formItem2.securityName,
							'phone': this.securityPhone,
							'idCard': this.securityIDNumber
						}),
						//默认订购信息
						'defaultOrderingGas': JSON.stringify({
							'goodsId': this.bookProduct,
							'number': this.bookNumber
						}),
						'cardStatus': this.switch2 == true ? 1 : 0,
						//燃气销售信息
						'receiverList': receiverList, //接收人信息
						'userSalesperson': this.salesmanId, //销售员id
						'allowGoods': JSON.stringify(allowGoods), //允许使用钢瓶
						//燃气设备信息
						'facilitiesInfo': JSON.stringify({
							'gasDevice': gasDevice,
							'gasAuxDevice': gasAuxDevice
						})

					},

				}
				//				console.log(subData)

				//	        console.log(subData)
				_http.http2('post', pathUrls.userWebOpeningUser, subData).then((res) => {
					if(res.code === 0) {
						this.$Message['success']({
							background: true,
							content: '添加成功!',
							onClose: (() => {
								if(v == 1) {
									this.$router.go(-1);
								}

							})
						});

					}
					if(res.code === 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
						})
					}
				})
			},
			//改变结算方式
			actypeSelect(v) {
				this.actypeName = v.label
			},
			//改变销售员姓名
			saleSelect(v) {
				for(let item of this.staffNameList) {
					if(item.staffId == v.value) {
						this.salesmanCode = item.staffWorkCode
					}
				}
				this.saleName = v.label

			},
			//改变开户人
			selectHolder(v) {

				this.holderName = v.label
			},
			//改变组织
			changeCascader(value) {
				if(value.length) {
					let selectedData = this.$refs.myCascader.getCheckedNodes()[0].pathLabels;
					this.deptName = selectedData[selectedData.length - 1];
					this.deptid = value[value.length - 1]
					//					this.deptName = selectedData[selectedData.length - 1].name
					//					this.getGasType(this.deptid, 'gasTypeList'); //获得用气类型
					this.getStaffName(this.deptid, 'staffNameList'); //获得企业员工名字
					//					this.getStaffLi(this.deptid,'staffNameLi');
					//					this.getQueryAcType(this.deptid, 'acTypeList') //查询结算类型
					this.getQueryGasDevice(this.deptid, 1, 'gasSlist') //查询燃气设备值
					this.getQueryGasDevice(this.deptid, 2, 'gasSlist1') //查询燃气附属设备
					this.getCardCode(this.deptid, 'cardCodeList'); //获得送气卡号
					this.payWay = '1';
				} else {
					this.deptid = ''
					this.deptName = ''
				}

			},

			//基本信息
			showOther(v) {
				this.userRemarks = [];
				//				console.log(v);
				if(v.length) {
					v.forEach((item) => {
						if(item == '特困户') {
							this.userRemarks.push({
								'remarksKey': '1',
								'remarksContent': item
							})
						} else if(item == '残障低保户') {
							this.userRemarks.push({
								'remarksKey': '2',
								'remarksContent': item
							})
						} else if(item == '老年人(70岁以上)') {
							this.userRemarks.push({
								'remarksKey': '3',
								'remarksContent': item
							})
						} else if(item == '其他') {
							this.userRemarks.push({
								'remarksKey': '4',
								'remarksContent': this.otherRemark
							})
						}
					})
				}
				//				console.log(JSON.stringify(this.userRemarks))
				if(v.indexOf('其他') != -1) {
					this.detail = true;
				}
				// console.log(v[0]);
				//				if(v[0] == "其他" || v[1] == "其他" || v[2] == "其他" || v[3] == "其他") {
				//					this.detail = true;
				//				}
				else {
					this.detail = false;
				}
			},
			//开户详情
			handleAdd() { //增加表单项

				this.khindex++;
				this.depositform.items.push({
					value1: '',
					khindex: this.khindex,
					status: 1,
					depositPicList: [],
					wars: false,
					occSpec: this.goodsSizeList.length ? this.goodsSizeList[0].goodsId : '',
					occSpecName: this.goodsSizeList.length ? this.goodsSizeList[0].goodsName : '',
					pledgePrice:'',
					beginTime:'',
					remark:''
				});
				//				}

			},
			handleRemove(khindex) { //删除表单项
				//				console.log(this.depositform.items[khindex]);

				this.depositform.items[khindex].status = 0;
				this.depositform.items.splice(khindex, 1)
				this.khindex--;

			},
			handleViewpic(url) { //开户合同图片放大
				this.imgUrl = url;
				this.visible2 = true;
			},
			handleRemovepic(file) { //删去开户合同图片
				const fileList = this.$refs.upload.fileList;
				this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
			},
			handleBeforeUpload() { //上传开户合同图片数量为1
				const check = this.uploadList.length < 1;
				if(!check) {
					this.$Notice.warning({
						title: '只能上传一张图片.'
					});
				}
				return check;
			},
			handleFormatError(file) { //限制图片格式
				this.$Notice.warning({
					title: '图片格式不正确',
					desc: '图片格式不正确, 请选择 jpg 或者 png.'
				});
			},
			handleMaxSize(file) { //限制图片尺寸
				this.$Notice.warning({
					title: '图片尺寸过大',
					desc: '上传图片过大, 不要超过2M.'
				});
			},
			handleSuccess(res, file) { //开户合同图片上传成功钩子
				//				console.log(res);
				file.url = res.data.src;
				file.name = res.data.name;
			},

			//，门头照片
			handleViewstore(url) { //图片放大
				this.imgUrl = url;
				this.visible3 = true;
			},
			handleRemovestore(file) { //删去门头图片
				const fileList = this.$refs.storePic.fileList;
				this.$refs.storePic.fileList.splice(fileList.indexOf(file), 1);
			},
			handleBeforeUploadstore() { //上传门头图片数量为1
				const check = this.storePicList.length < 1;
				if(!check) {
					this.$Notice.warning({
						title: '只能上传一张图片.'
					});
				}
				return check;
			},
			handleSuccessstore(res, file) { //门头图片上传成功钩子
				//				console.log(res);
				file.url = res.data.src;
				file.name = res.data.name;
			},

			//押瓶情况
			handleViewPicform(url) { //押瓶表单图片放大

				this.visible4 = true;
				this.imgUrl = url;
			},
			handleRemovePicform(file, index) { //删去押瓶表单图片
				//				console.log(file, index)
				const fileList = this.depositform.items[index].depositPicList;
				fileList.splice(fileList.indexOf(file), 1);
				//				this.depositform.items[this.depIndex].depositPicList.splice();
			},
			handleSuccessForm(res, file, fileList) { //押瓶表单上传成功钩子
				//				console.log(file, fileList)
				this.depositform.items[this.depIndex].depositPicList.push(file);
				//				for(let i = 0; i < this.depositform.items.length; i++) {
				//					//					let index = this.depositform.items[i].khindex - 1
				//					this.depositform.items[i].depositPicList = this.$refs.depositPic[i].fileList
				//				}
				file.url = res.data.src;
				file.name = res.data.name;

			},

			//用气量
			handleRemove5(yqindex) {
				this.gasDefineform.items[yqindex].status = 0;
				this.gasDefineform.items.splice(yqindex, 1)
				this.yqindex--;
			},
			handleAdd5() {
				if(this.yqindex < this.goodsSizeList.length) {
					this.yqindex++;
					this.gasDefineform.items.push({
						value: '',
						yqindex: this.yqindex,
						status: 1,
						sqcount: 0,
						sycount: 0,
						maxcount: 0,
						size: '',
						sizeName: ''

					});
				} else {
					this.$Message['warning']({
						background: true,
						content: `用气量核定单最多为${this.goodsSizeList.length}`,

					});
					return false
				}

			},
			btnAdd(yzcount) {
				this.yzcount++;
				//				if(this.yzcount < this.maxCount) {
				//
				//				} else {
				//					this.yzcount=this.maxCount;
				//					this.$Message['warning']({
				//						background: true,
				//						content: '押占瓶数量不能超过最大占用瓶数',
				//
				//					});
				//					return false
				//				}
			},
			btnMinute(yzcount) {
				if(this.yzcount >= 1) {
					this.yzcount--;
				}
			},
			sqbtnAdd(yqindex, sqcount) {
				//				console.log(yqindex, sqcount);
				if(sqcount < 10) {
					this.gasDefineform.items[yqindex].sqcount++;
				} else {
					this.$Message['warning']({
						background: true,
						content: '每次起送量不能超过10瓶',

					});
					return false
				}

			},
			sqbtnMinute(yqindex, sqcount) {
				if(sqcount >= 1) {
					this.gasDefineform.items[yqindex].sqcount--;
				}
			},
			sybtnAdd(yqindex, sycount) {
				this.gasDefineform.items[yqindex].sycount++;
			},
			sybtnMinute(yqindex, sycount) {
				if(sycount >= 1) {
					this.gasDefineform.items[yqindex].sycount--;
				}
			},
			bookbtnAdd(bookNumber) {
				if(this.bookNumber < 100) {
					this.bookNumber++;
				} else {
					this.$Message['warning']({
						background: true,
						content: '默认订购数量不大于100',

					});
					return false
				}

			},
			bookbtnMinute(bookNumber) {
				if(this.bookNumber >= 1) {
					this.bookNumber--;
				}
			},
			openLast(v) {
				if(v == true) {
					this.last = true;
					this.bookNumber = 1;
				} else {
					this.last = false;
					this.bookNumber = 0;
					this.cardNumber = null;
					this.bookProduct = null;
				}
			},

			//燃气销售
			handleRemove2(saleindex) {
				this.saleform.items[saleindex].status = 0;
				this.saleform.items.splice(saleindex, 1)
				this.saleindex--;
			},
			handleAdd2() {
				if(this.saleindex < this.newSizeList.length) {
					this.saleindex++;

					let newForms = [];
					newForms = this.newAllows.filter(item => !this.saleform.items.some(ele => ele.ssize === item.ssize))
					this.saleform.items.push({
						saleindex: this.saleindex,
						status: 1,
						ssize: newForms.length ? newForms[0].ssize : '',
						goodsName: newForms.length ? newForms[0].goodsName : '',
						occNum: newForms.length ? newForms[0].occNum : 1,
					});
				} else {
					this.$Message['warning']({
						background: true,
						content: `钢瓶数量最多为${this.newSizeList.length}`,

					});
					return false
				}

			},
			handleRemove6(jsrindex) {
				this.jsrform.items[jsrindex].status = 0;
				this.jsrform.items.splice(jsrindex, 1)
				this.jsrindex--;
			},
			handleAdd6() {

				if(this.jsrindex > 4) {
					this.$Message['warning']({
						background: true,
						content: '接收人数量不能超过5个',

					});
					return false
				} else {
					this.jsrindex++;
					this.jsrform.items.push({
						value: '',
						jsrindex: this.jsrindex,
						status: 1,
						jsrname: '',
						contactNumber: '',
						IDNumber: ''
					});
				}

			},
			//燃气设备

			qtsb(index) {
				//					for(let item of this.gasAppliance.items) {
				//
				//
				//					if(item.gasAppliancekind == '1') {
				//						item.gasAppName = '燃气灶'
				//						item.kind = false;
				//					} else if(item.gasAppliancekind == '2') {
				//						item.gasAppName = '热水器'
				//						item.kind = false;
				//					} else if(item.gasAppliancekind == '3') {
				//						item.gasAppName = '壁挂炉'
				//						item.kind = false;
				//					} else if(item.gasAppliancekind == '0') {
				//						item.kind = true;
				//						item.gasAppName = item.otherKind
				//					}
				//				}
				let newItem = this.gasAppliance.items[index];
				if(newItem.gasAppliancekind) {
					newItem.count = 1;
				} else {
					newItem.count = 0;
				}

				if(newItem.gasAppliancekind == '1') {
					newItem.gasAppName = '燃气灶'
					newItem.kind = false;
				} else if(newItem.gasAppliancekind == '2') {
					newItem.gasAppName = '热水器'
					newItem.kind = false;
				} else if(newItem.gasAppliancekind == '3') {
					newItem.gasAppName = '壁挂炉'
					newItem.kind = false;
				} else if(newItem.gasAppliancekind == '0') {
					newItem.kind = true;
					newItem.gasAppName = newItem.otherKind
				}

			},
			handleRemove3(sbindex) {
				this.gasAppliance.items[sbindex].status = 0;
				this.gasAppliance.items.splice(sbindex, 1)
				this.sbindex--;
			},
			handleAdd3() {
				this.sbindex++;
				this.gasAppliance.items.push({
					value: '',
					sbindex: this.sbindex,
					status: 1,
					gasAppliancekind: '',
					count: 0,
					gasAppPicList: [],
					gasAppName: '',
					kind: false,

				});
			},
			handleViewGas(url) { //燃气设备图片放大
				this.imgUrl = url;
				this.visible6 = true;
			},
			handleRemoveGas(file, sbindex) { //删去燃气设备图片
				//				const fileList = this.$refs.gasAppPic[sbindex].fileList;
				const fileList = this.gasAppliance.items[sbindex].gasAppPicList
				fileList.splice(fileList.indexOf(file), 1);
			},

			handleSuccessGas(res, file, fileList) { //燃气设备图片上传成功钩子
				//				console.log(fileList)
				this.gasAppliance.items[this.gasIndex].gasAppPicList.push(file)
				//				for(let i = 0; i < this.gasAppliance.items.length; i++) {
				//					this.gasAppliance.items[i].gasAppPicList = this.$refs.gasAppPic[i].fileList;
				//				}
				file.url = res.data.src;
				file.name = res.data.name;
			},

			//燃气附属设备
			qtfssb(index) {
				//				for(let item of this.gasOtherAppliance.items) {
				//
				//					if(item.gasOtherAppliancekind == '1') {
				//						item.gasOtherAppName = '燃气报警器'
				//						item.fsKind = false
				//					} else if(item.gasOtherAppliancekind == '2') {
				//						item.gasOtherAppName = '软管'
				//						item.fsKind = false
				//					} else if(item.gasOtherAppliancekind == '3') {
				//						item.gasOtherAppName = '减压阀'
				//						item.fsKind = false
				//					} else if(item.gasOtherAppliancekind == '0') {
				//						item.fsKind = true
				//						item.gasOtherAppName = item.otherfsKind
				//					}
				//				}

				let newItem = this.gasOtherAppliance.items[index];
				if(newItem.gasOtherAppliancekind) {
					newItem.count = 1;
				} else {
					newItem.count = 0;
				}
				if(newItem.gasOtherAppliancekind == '1') {
					newItem.gasOtherAppName = '燃气报警器'
					newItem.fsKind = false
				} else if(newItem.gasOtherAppliancekind == '2') {
					newItem.gasOtherAppName = '软管'
					newItem.fsKind = false
				} else if(newItem.gasOtherAppliancekind == '3') {
					newItem.gasOtherAppName = '减压阀'
					newItem.fsKind = false
				} else if(newItem.gasOtherAppliancekind == '0') {
					newItem.fsKind = true
					newItem.gasOtherAppName = newItem.otherfsKind
				}

			},
			handleRemove4(sbfsindex) {
				this.gasOtherAppliance.items[sbfsindex].status = 0;
				this.gasOtherAppliance.items.splice(sbfsindex, 1)
				this.sbfsindex--;
			},
			handleAdd4() {
				this.sbfsindex++;
				this.gasOtherAppliance.items.push({
					value: '',
					sbfsindex: this.sbfsindex,
					status: 1,
					gasOtherAppliancekind: '',
					count: 0,
					gasSubAppPicList: [],
					gasOtherAppName: '',
					fsKind: false

				});
			},
			handleViewGasSub(url) { //燃气附属设备图片放大
				this.imgUrl = url;
				this.visible7 = true;
			},
			handleRemoveGasSub(file, sbfsindex) { //删去燃气附属设备图片
				const fileList = this.gasOtherAppliance.items[sbfsindex].gasSubAppPicList;
				fileList.splice(fileList.indexOf(file), 1);
			},

			handleSuccessGasSub(res, file, fileList) { //燃气附属设备图片上传成功钩子
				this.gasOtherAppliance.items[this.subIndex].gasSubAppPicList.push(file);
				//				for(let i = 0; i < this.gasOtherAppliance.items.length; i++) {
				//					this.gasOtherAppliance.items[i].gasSubAppPicList = this.$refs.gasSubAppPic[i].fileList;
				//				}

				file.url = res.data.src;
				file.name = res.data.name;
			},

			//按钮上一步
			prev() {
				if(this.current > 0) {
					this.current--
				}
			},
			// 下一步
			next() {
				if(this.current === 0) {

					if(!this.deptid) {
						this.warnInfo.depInfo = '请选择所属组织';
						setTimeout(() => {
							this.warnInfo.depInfo = '';
						}, 1500)
						return false;
					}
					if(!this.formValidate.gasType) {
						this.warnInfo.gasInfo = '请选择客户类型';
						setTimeout(() => {
							this.warnInfo.gasInfo = '';
						}, 1500)
						return false;
					}
					if(!this.isResident && !this.formValidate.gasSubType) {
						this.warnInfo.gasChiInfo = '请选择用气子类型';
						setTimeout(() => {
							this.warnInfo.gasChiInfo = '';
						}, 1500)
						return false;
					}
          
					this.$refs['formData1'].validate(valid => {
						if(valid) {
             
							if(!this.common.checkIDCard(this.formValidate.ID)) {
								this.warnInfo.idCardInfo = '请输入正确的身份证号码';
								setTimeout(() => {
									this.warnInfo.idCardInfo = '';
								}, 1500)
								return false;

							}
							if(this.formValidate.userCertAddress && this.common.isEmojiCharacter(this.formValidate.userCertAddress)) {
								this.warnInfo.certAddressInfo = '证件地址不合法';
								setTimeout(() => {
									this.warnInfo.certAddressInfo = '';
								}, 1500)
								return false;
							}
							// if(!this.isPoneAvailable(this.formValidate.telephoneNumber)) {
							// 	this.warnInfo.telInfo = '请输入正确的联系电话';
							// 	setTimeout(() => {
							// 		this.warnInfo.telInfo = '';
							// 	}, 1500)
							// 	return false;

							// }
							if(!this.formValidate.telephoneNumber) {
								this.warnInfo.telInfo = '请输入联系方式';
								setTimeout(() => {
									this.warnInfo.telInfo = '';
								}, 1500)
								return false;

							}
							if(this.formValidate.telephoneNumber && this.formValidate.telephoneNumber.length > 12) {
								this.warnInfo.telInfo = '请输入正确的联系方式';
								setTimeout(() => {
									this.warnInfo.telInfo = '';
								}, 1500)
								return false;

							}
							if(!this.formValidate.province) {
								this.warnInfo.addressInfo = '请选择省份';
								setTimeout(() => {
									this.warnInfo.addressInfo = '';
								}, 1500)
								return false;
							}
							if(!this.formValidate.city) {
								this.warnInfo.addressInfo = '请选择城市';
								setTimeout(() => {
									this.warnInfo.addressInfo = '';
								}, 1500)
								return false;
							}
							if(!this.formValidate.area) {
								this.warnInfo.addressInfo = '请选择区县';
								setTimeout(() => {
									this.warnInfo.addressInfo = '';
								}, 1500)
								return false;
							}
							if(this.streetList.length && !this.formValidate.street) {
								this.warnInfo.addressInfo = '请选择街道';
								setTimeout(() => {
									this.warnInfo.addressInfo = '';
								}, 1500)
								return false;
							}
							if(!this.formValidate.detailAddress) {
								this.warnInfo.addressInfo = '请输入详细地址';
								setTimeout(() => {
									this.warnInfo.addressInfo = '';
								}, 1500)
								return false;
							}
             
							this.current++;
						}

					})

				} else if(this.current === 1) {
					if(!this.saleform.items[0].ssize) {
						this.warnInfo.saleInfo = '请选择允许使用钢瓶!';
						setTimeout(() => {
							this.warnInfo.saleInfo = '';
						}, 1500)
						return false;
					}
					//					for(let item of this.gasDefineform.items) {
					//						if(!item.size) {
					//							this.warnInfo.useGasInfo = '请选择用气规格!';
					//							setTimeout(() => {
					//								this.warnInfo.useGasInfo = '';
					//							}, 1500)
					//							return false;
					//						}
					//
					//					}

					if(this.switch2) {
						if(!this.cardNumber) {
							this.warnInfo.useGasInfo = '请选择用气卡号!';
							setTimeout(() => {
								this.warnInfo.useGasInfo = '';
							}, 1500)
							return false;
						}
						if(!this.bookProduct) {
							this.warnInfo.useGasInfo = '请选择默认订购钢瓶!';
							setTimeout(() => {
								this.warnInfo.useGasInfo = '';
							}, 1500)
							return false;
						}

					}

					this.current++

				} else if(this.current === 2) {

					if(this.formValidate2.accountHolder == '') {
						this.warnInfo.staNameInfo = '请选择开户人';
						setTimeout(() => {
							this.warnInfo.staNameInfo = '';
						}, 1500)
						return false;
					}
					if(this.formValidate2.contractNumber) {
						if(this.formValidate2.contractNumber.length > 50) {
							this.warnInfo.contractInfo = '合同编号不能超过50个字符';
							setTimeout(() => {
								this.warnInfo.contractInfo = '';
							}, 1500)
							return false;
						}
					}
					//					if(this.yzNumList.length < this.depositform.items.length) {
					//						this.$Message['warning']({
					//							background: true,
					//							content: '押金单数量不能超过押占瓶数量',
					//						});
					//						return false
					//					}
					let regs = /^[-a-zA-Z0-9]+$/;
					let re = new RegExp(regs)
					for(let item of this.depositform.items) {
						if(item.value1.length && !re.test(item.value1)) {
							this.warnInfo.yjdInfo = '押金单号字符不合法';
							setTimeout(() => {
								this.warnInfo.yjdInfo = '';
							}, 1500)
							return false;
						}
						if(item.value1.length > 30) {
							this.warnInfo.yjdInfo = '押金单号内容过长';
							setTimeout(() => {
								this.warnInfo.yjdInfo = '';
							}, 1500)
							return false;
						}
					}
					this.current++

				} else if(this.current === 3) {
					//					debugger;
					//					console.log(this.jsrform.items)
					this.$refs['formData11'].validate(valid => {
						if(valid) {
							if(!this.common.checkIDCard(this.securityIDNumber)) {
								this.warnInfo.secIdInfo = '请输入正确的身份证号码';
								setTimeout(() => {
									this.warnInfo.secIdInfo = '';
								}, 1500)
								return false;
							}
							// if(!this.isPoneAvailable(this.securityPhone)) {
							// 	this.warnInfo.secTelInfo = '请输入正确的联系电话';
							// 	setTimeout(() => {
							// 		this.warnInfo.secTelInfo = '';
							// 	}, 1500)
							// 	return false;
							// }
							if(!this.securityPhone) {
								this.warnInfo.secTelInfo = '请输入联系方式';
								setTimeout(() => {
									this.warnInfo.secTelInfo = '';
								}, 1500)
								return false;
							}
							if(this.securityPhone && this.securityPhone.length > 12) {
								this.warnInfo.secTelInfo = '请输入正确的联系方式';
								setTimeout(() => {
									this.warnInfo.secTelInfo = '';
								}, 1500)
								return false;
							}
							let idObj = {};
							for(let item of this.jsrform.items) {

								if(item.jsrname == '') {
									this.warnInfo.jsrInfo = '请输入接收人姓名';
									setTimeout(() => {
										this.warnInfo.jsrInfo = '';
									}, 1500)
									return false;
								} else if(item.jsrname.length > 13) {
									this.warnInfo.jsrInfo = '姓名不能超过13个字符';
									setTimeout(() => {
										this.warnInfo.jsrInfo = '';
									}, 1500)
									return false;
								}
								//          else if(!this.isPoneAvailable(item.contactNumber)) {
								// 	this.warnInfo.jsrInfo = '请输入联系电话';
								// 	setTimeout(() => {
								// 		this.warnInfo.jsrInfo = '';
								// 	}, 1500)
								// 	return false;
								// }
								else if(!item.contactNumber) {
									this.warnInfo.jsrInfo = '请输入联系方式';
									setTimeout(() => {
										this.warnInfo.jsrInfo = '';
									}, 1500)
									return false;
								} else if(item.contactNumber && item.contactNumber.length > 12) {
									this.warnInfo.jsrInfo = '请输入正确的联系方式';
									setTimeout(() => {
										this.warnInfo.jsrInfo = '';
									}, 1500)
									return false;
								} else if(!this.common.checkIDCard(item.IDNumber)) {
									this.warnInfo.jsrInfo = '请输入正确的身份证号码';
									setTimeout(() => {
										this.warnInfo.jsrInfo = '';
									}, 1500)
									return false;
								}
								let idArray = idObj[item['IDNumber']] || []
								idArray.push(item)
								idObj[item['IDNumber']] = idArray

							}
							let newId = Object.values(idObj)
							for(let item of newId) {
								if(item.length > 1) {
									this.warnInfo.jsrInfo = '接收人身份证号码重复';
									setTimeout(() => {
										this.warnInfo.jsrInfo = '';
									}, 1500)
									return false;
								}
							}
							if(this.formLicense.businessLicenseCode && this.formLicense.businessLicenseCode.length > 20) {
								this.formLicense.warnInfo = '营业执照编码过长!';
								setTimeout(() => {
									this.formLicense.warnInfo = '';
								}, 1500)
								return false;
							}
							if(this.formLicense.businessName && this.formLicense.businessName.length > 64) {
								this.formLicense.warnInfo = '商户名称过长!';
								setTimeout(() => {
									this.formLicense.warnInfo = '';
								}, 1500)
								return false;
							}
							if(this.formLicense.businessType && this.formLicense.businessType.length > 32) {
								this.formLicense.warnInfo = '商户类型过长!';
								setTimeout(() => {
									this.formLicense.warnInfo = '';
								}, 1500)
								return false;
							}
							if(this.formLicense.legalPerson && this.formLicense.legalPerson.length > 16) {
								this.formLicense.warnInfo = '法人名称过长!';
								setTimeout(() => {
									this.formLicense.warnInfo = '';
								}, 1500)
								return false;
							}
							if(this.formLicense.businessAddredss && this.formLicense.businessAddredss.length > 64) {
								this.formLicense.warnInfo = '注册地址过长!';
								setTimeout(() => {
									this.formLicense.warnInfo = '';
								}, 1500)
								return false;
							}

							//							'businessLicenseCode':this.formLicense.businessLicenseCode,//营业执照编码
							//							'name':this.formLicense.businessName,//商户名称
							//							'type':this.formLicense.businessType,//商户类型
							//							'legalPerson':this.formLicense.legalPerson,//法人
							//							'establishmentDate':this.formLicense.dateTime?this.common.conformatDat(this.formLicense.dateTime,true):null,//成立日期
							//							'businessLicensePic': this.licensePicList.length ? this.licensePicList[0].url : '', //营业执照图片
							//							'businessAddredss':this.formLicense.businessAddredss,//注册地址
							//							'businessScope':null,//经营范围
							//							 'regCapital':null,//注册资金
							//							 'businessTerm':null,//营业期限

							this.current++
						}
					})

				} else if(this.current === 4) {

					for(let item of this.gasAppliance.items) {
						//						if(item.gasAppliancekind == '') {
						//							this.warnInfo.gasAppInfo = '请选择燃气设备类型';
						//							setTimeout(() => {
						//								this.warnInfo.gasAppInfo = '';
						//							}, 1500)
						//							return false;
						//						}
						//						else if(item.value == '') {
						//							this.warnInfo.gasAppInfo = '请填写规格型号';
						//							setTimeout(() => {
						//								this.warnInfo.gasAppInfo = '';
						//							}, 1500)
						//							return false;
						//						}
						if(item.value && item.value.length > 64) {
							this.warnInfo.gasAppInfo = '规格型号内容过长';
							setTimeout(() => {
								this.warnInfo.gasAppInfo = '';
							}, 1500)
							return false;
						} else if(item.count < 0) {
							this.warnInfo.gasAppInfo = '数量不能小于0';
							setTimeout(() => {
								this.warnInfo.gasAppInfo = '';
							}, 1500)
							return false;
						}
						//						else if(!item.gasAppPicList.length) {
						//							this.warnInfo.gasAppInfo = '请上传附件';
						//							setTimeout(() => {
						//								this.warnInfo.gasAppInfo = '';
						//							}, 1500)
						//							return false;
						//						}
					}
					for(let item of this.gasOtherAppliance.items) {

						if(item.value.length > 64) {
							this.warnInfo.gasSubAppInfo = '规格型号内容过长';
							setTimeout(() => {
								this.warnInfo.gasSubAppInfo = '';
							}, 1500)
							return false;
						}
					}
					this.current++
				} else if(this.current === 5) {
					this.handleSubmit(1)
				}
			},
			maxbtnAdd(yqindex, maxcount) { //最大占用瓶数+
				//				this.gasDefineform.items[yqindex].maxcount++;
				if(this.maxCount < 10) {
					this.maxCount++;
				} else {
					this.$Message['warning']({
						background: true,
						content: '最大占用瓶数不能超过10',

					});
					return false
				}

			},
			maxbtnMinute() { //最大占用瓶数-
				if(this.maxCount >= 2) {
					//					this.gasDefineform.items[yqindex].maxcount--;
					this.maxCount--;
					if(this.maxCount < this.yzcount) {
						this.yzcount = this.maxCount;
					}
				}
			},
			getCardCode(Id, codeLis) { //用气卡号查询
				_http.http1('post', pathUrls.cardCode, {
					'deptId': Id
				}, 'form').then((res) => {
					// console.log(res);
					this[codeLis] = res.data;
				})
			},
			getSize(Id) { //用气规格查询
				_http.http1('post', pathUrls.bottleSize, {
					'deptId': Id
				}, 'form').then((res) => {
					// console.log(res);

					//					if(this.formValidate.gasType == 1 || this.formValidate.gasType == 13) {
					//						res.data.some((item, i) => {
					//							if(item.key == 'specFifty') {
					//								res.data.splice(i, 1);
					//								return true;
					//							}
					//						})
					//					}
					this.sizeList = res.data;
					this.newSize = res.data;
					this.newSize1 = res.data;

				})
			},

			//改变省
			selectProvince(v) {
				if(v) {
					this.baseProvince = v.label
				}
				if(this.formValidate.province) {
					this.getAreaInfo(this.formValidate.province, "cityList");
				}

				this.formValidate.city = '';
				this.formValidate.area = '';
				this.formValidate.street = '';
				this.formValidate.detailAddress = '';
			},
			//改变市
			selectCity(v) {
				if(v) {
					this.baseCity = v.label
				}
				if(this.formValidate.city) {
					this.getAreaInfo(this.formValidate.city, 'areaList');
				}

				this.formValidate.area = '';
				this.formValidate.street = '';
				this.formValidate.detailAddress = '';
			},
			//改变区
			selectArea(v) {
				if(v) {
					this.baseArea = v.label
				}
				if(this.formValidate.area) {
					this.getAreaInfo(this.formValidate.area, 'streetList');
				}
				this.formValidate.street = '';
				this.formValidate.detailAddress = '';
			},
			//改变街道
			selectStreet(v) {
				if(v) {
					this.baseStreet = v.label
				}
			},
			getAreaInfo(cCode, areaLis) { //用气地址接口
				_http.http1('post', pathUrls.cityInfo, {
					'parentCode': cCode
				}, 'form').then((res) => {
					this[areaLis] = res.data;
					for(let item of this[areaLis]) {
						if(this[areaLis] == this.provinceList) {
							if(item.areaCode == this.formValidate.province) {
								this.baseProvince = item.name;
							}
						}
						if(this[areaLis] == this.cityList) {
							if(item.areaCode == this.formValidate.city) {
								this.baseCity = item.name;
							}
						}
						if(this[areaLis] == this.areaList) {
							if(item.areaCode == this.formValidate.area) {
								this.baseArea = item.name;
							}
						}
						if(this[areaLis] == this.streetList) {
							if(item.areaCode == this.formValidate.street) {
								this.baseStreet = item.name;
							}
						}
					}

				})
			},
			getSubType1(c, areaLis) { //用气子类型（商业、小微商业）接口
				_http.http1('post', pathUrls.subType, {
					'userType': c
				}, 'form').then((res) => {

					this[areaLis] = res.data;
				})
			},

			getStaffName(c, areaLis) { //企业员工姓名接口
				_http.http1('post', pathUrls.deptStaff, {
					'deptId': c
				}, 'form').then((res) => {

					this[areaLis] = res.data;
				})
			},
			//			getStaffLi(c, areaLis) { //开户人接口
			//				_http.http1('post', pathUrls.deptStaff, {
			//					'deptId': c
			//				}, 'form').then((res) => {
			//
			//					this[areaLis] = res.data;
			//				})
			//			},
			//			getQueryAcType(c, Lis) { //查询结算类型
			//				_http.http1('post', pathUrls.userQueryAcType, {
			//					'deptId': c
			//				}, 'form').then((res) => {
			//
			//					this[Lis] = res.data;
			//				})
			//			},
			getQueryGasDevice(c, queryType, Lis) { //查询燃气设备
				_http.http1('post', pathUrls.userQueryGasDevice, {
					'deptId': c,
					'queryType': queryType
				}, 'form').then((res) => {

					this[Lis] = res.data;
				})
			},

			printIn() { //导出打印按钮
				this.handleSubmit(2)
				this.isprint = true
				setTimeout(() => {
					this.$print(this.$refs.print)
				}, 100)
				setTimeout(() => {
					this.isprint = false;
				}, 300)
			},

			// 判断是否为手机号
			isPoneAvailable(pone) {
				//				var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
				var myreg = /^((0\d{2,3}-?\d{7,8})|(1[123456789]\d{9}))$/;
				if(!myreg.test(pone)) {
					return false;
				} else {
					return true;
				}
			},
		},
		mounted() {
			this.common.getDeptList(this.userData.deptId).then((res) => {
				this.options = this.common.getConDept(res.data, 0, 0, 1)
			})
			this.formValidate.province = Number(this.userData.dept.provinceCode); //所属省份
			this.formValidate.city = Number(this.userData.dept.cityCode); //所属市
			this.formValidate.area = Number(this.userData.dept.areaCode); //所属区县
			//			this.formValidate.street = Number(this.userData.dept.streetCode); //所属街道
			//			this.formValidate.detailAddress = this.userData.dept.address; //详细地址
			this.getAreaInfo(0, 'provinceList'); //获得用气地址的省市区街道
			if(this.userData.dept.provinceCode) {
				this.getAreaInfo(Number(this.userData.dept.provinceCode), "cityList");
			}
			if(this.userData.dept.cityCode) {
				this.getAreaInfo(Number(this.userData.dept.cityCode), 'areaList');
			}
			if(this.userData.dept.areaCode) {
				this.getAreaInfo(Number(this.userData.dept.areaCode), 'streetList');
				//				console.log(this.streetList)
			}

			//			this.getSubType1(2, 'subType1List'); //获得商业、小微商业用气子类型
			this.getSubType1(0, 'subType2List'); //获得工业用气子类型
			this.uploadList = this.$refs.upload.fileList;
			this.storePicList = this.$refs.storePic.fileList;
			this.formValidate.place = this.userData.deptId + '';
			this.deptid = this.userData.deptId + '';
			this.deptName = this.userData.dept.name;
			//获得用气类型
			this.common.getUserTypeList(this.userData.deptId).then((res) => {
				this.gasTypeList = res.data;
			})
			this.getStaffName(this.userData.deptId, 'staffNameList'); //获得企业员工名字
			//			this.getQueryAcType(this.userData.deptId, 'acTypeList') //查询结算类型
			this.getQueryGasDevice(this.userData.deptId, 1, 'gasSlist') //查询燃气设备值
			this.getQueryGasDevice(this.userData.deptId, 2, 'gasSlist1') //查询燃气附属设备
			this.getCardCode(this.userData.deptId, 'cardCodeList'); //获得送气卡号
			//			console.log(this.formValidate.province)
			this.payWay = '1';
			this.getGoodsList();
			this.licensePicList = this.$refs.licensePic.fileList;

		}
	}
</script>

<style type="text/css" scoped>
	.mainBody {
		padding: 0 25px 20px;
	}

	.currentTitle {
		font-size: 18px;
		color: #000;
		line-height: 10px;
		padding: 12px 0;
		text-align: left;
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
		font-size: 20px;
		cursor: pointer;
		margin: 0 2px;
	}

	.currentLabel {
		/* text-align: left; */
		color: #000000;
		font-size: 14px;
		white-space: nowrap;
	}

	.currentContent {
		/* text-align: right; */
		color: 333;
		font-size: 14px;
		padding-right: 2px;
	}

	.mainBorder>>>.ivu-col {
		text-align: left;
	}

	img {
		width: 90px;
		height: 90px;
		display: inline;
		margin-right: 20px;
	}

	.star>>>.ivu-form-item-label:before,
	.stars:before {
		content: "*";
		color: #ed4014;
		padding-right: 2px;
		font-size: 14px;
		display: inline-block;
		font-family: SimSun;
	}

	.errInfo {
		position: absolute;
		left: 0;
		top: 32px;
		color: #ed4014;
	}

	.gasForm>>>.ivu-form-item-content {
		margin-left: 0!important;
		color: #515a6e;
	}

	.btnForm {
		margin-left: 10px;
	}

	.mainBorder>>>.ivu-input-number-handler-wrap {
		/*display: none;*/
	}

	.mainBorder>>>.el-cascader {
		width: 100%;
	}

	.mainBorder>>>.el-input__inner {
		height: 32px;
		line-height: 32px;
	}

	.mainBorder>>>.el-input__icon {
		line-height: 32px;
	}

	.finishPage p {
		/*margin-bottom: 3px;*/
		color: #000;
	}

	.finishPage>>>.ivu-checkbox-wrapper {
		color: #000;
	}

	.bottomNone p {
		margin-bottom: 0;
	}

	.bottomSix p {
		margin-bottom: 4px;
	}

	.occitem>>>.ivu-form-item-content {
		margin-left: 0!important;
	}

	.occitem>>>.ivu-input-number {
		width: auto;
	}

	.occSpec {
		width: 68%;
		margin-bottom: 5px;
	}

	.licenseDate>>>.ivu-input-suffix {
		/*right: 50px;*/
	}

	.mainBorder>>>.ivu-icon-ios-camera {
		color: #51B5EA;
	}
</style>
