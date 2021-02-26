<template>
	<div class='mainBorder'>
		<div class='mainHeader'>
			<span>编辑</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>
		<div class="mainBody">
			<div class='titleContent'>基本信息</div>
			<Form ref="typeForm" :model="typeForm" :label-width="120" class='typeForm sameType' inline>
				<FormItem label="所属组织" class='organize star'>
					<el-cascader :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" v-model="typeForm.organize" @change='organizeSelected'></el-cascader>
				</FormItem>
				<FormItem label="客户类型" class='star'>
					<Select v-model="typeForm.gasType" @on-change='selectType' placeholder='请选择客户类型' label-in-value>
						<Option v-for="item in gasTypeList" :value="item.id" :key="item.id" :tag='item'>{{ item.typeName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="用气子类型" v-if='!isResident' class='star'>
					<Select v-model="typeForm.gasSubType" label-in-value @on-change='selectChildType' placeholder='请选择用气子类型'>
						<Option v-for="item in subType1List" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="企业/商户名称" class='star' v-if='!isResident'>
					<Input v-model="typeForm.businessName" placeholder='请输入企业/商户名称'></Input>
				</FormItem>
				<FormItem label="客户姓名" class='star'>
					<Input v-model="typeForm.clientName" placeholder='请输入客户姓名'></Input>
				</FormItem>
				<FormItem label="有证无证" v-if='!isResident'>
					<Select v-model="hasCert" clearable>
						<Option :value='0'>无证</Option>
						<Option :value='1'>有证</Option>
					</Select>
				</FormItem>
				<FormItem label="身份证号码" class='star'>
					<Input v-model="typeForm.idNum" placeholder='请输入身份证号码' clearable></Input>
				</FormItem>
				<FormItem label="证件地址">
					<Input v-model="typeForm.userCertAddress" placeholder='请输入证件地址'></Input>
				</FormItem>
				<FormItem label="联系方式" class='star'>
					<Input v-model="typeForm.telephoneNumber" placeholder='请输入联系方式'></Input>
				</FormItem>
				<FormItem label="详细地址" class='star' style='display: block;width: 100%;'>
					<div style="display: flex;width: 96.5%;">
						<Select v-model="typeForm.province" @on-change='selectProvince' label-in-value placeholder='请选择省份' style='width: 14%;margin-right: 1%;'>
							<Option v-for="item in provinceList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
						</Select>
						<Select v-model="typeForm.city" @on-change='selectCity' label-in-value placeholder='请选择城市' style='width: 14%;margin-right: 1%;'>
							<Option v-for="item in cityList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
						</Select>
						<Select v-model="typeForm.area" @on-change='selectArea' label-in-value placeholder='请选择县区' style='width: 14%;margin-right: 1%;'>
							<Option v-for="item in areaList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
						</Select>
						<Select v-model="typeForm.street" label-in-value @on-change='selectStreet' placeholder='请选择街道' style='width: 14%;margin-right: 1%;'>
							<Option v-for="item in streetList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
						</Select>
						<Input v-model="typeForm.detailAddress" placeholder='请输入详细地址' style='width: 40%;'></Input>
					</div>

				</FormItem>
				<!-- <FormItem label="所属市" class='star'>
					<Select v-model="typeForm.city" @on-change='selectCity' label-in-value placeholder='请选择城市'>
						<Option v-for="item in cityList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="所属区县" class='star'>
					<Select v-model="typeForm.area" @on-change='selectArea' label-in-value placeholder='请选择县区'>
						<Option v-for="item in areaList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="所属街道" class='star'>
					<Select v-model="typeForm.street" label-in-value @on-change='selectStreet' placeholder='请选择街道'>
						<Option v-for="item in streetList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="详细地址" class='star'>
					<Input v-model="typeForm.detailAddress" placeholder='请输入详细地址'></Input>
				</FormItem> -->
				<FormItem label="客户备注" v-if='isResident'>
					<CheckboxGroup v-model="typeForm.clientRemark" style="text-align: left;" @on-change="showOther">
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
			<div class='titleContent'>燃气销售信息</div>
			<Form ref="typeForm7" :label-width="120" class='typeForm7 sameType' inline>
				<FormItem label="销售员姓名" style='width:32%;'>
					<Select v-model="salesmanId" @on-change='saleSelect' label-in-value>
						<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
					</Select>
				</FormItem>
				</br>
				<!--<FormItem label="结算方式">
					<Select v-model="payWay" label-in-value @on-change='actypeSelect'>
						<Option v-for="item in acTypeList" :value="item.key" :key="item.key">{{ item.content }}</Option>
					</Select>
				</FormItem>-->

				<FormItem label="" style='width:32%'>
					<Button type="info" long @click="handleAdd2" icon="md-add" long>添加钢瓶</Button>
				</FormItem>
				<div v-for="(item, saleindex) in saleform.items" v-if="item.status" :key="saleindex">
					<FormItem label="允许使用钢瓶" style='width: 32%;' :class="[saleindex==0?'star':'']">
						<Select v-model="item.ssize" @on-open-change='changeSize1(item.ssize,saleindex)'>
							<Option v-for="item in goodsSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName}}</Option>
						</Select>
					</FormItem>
					<FormItem style='width:10%' class='removeFitem' v-if='saleindex!=0'>
						<Button @click="handleRemove2(saleindex)" type="warning" style="height: 28px;">删除</Button>
					</FormItem>
				</div>
			</Form>
			<div class='titleContent'>用气量核定</div>
			<Form class='typeForm2 sameType' inline>
				<FormItem label=" " class='btnForm difFitem'>
					<Button type="info" @click="handleAdd5" icon="md-add" long>添加用气量核定单</Button>
				</FormItem>
				<FormItem style='width: 100%;' v-for="(item, yqindex) in gasDefineform.items" v-if="item.status" :key="yqindex" :prop="'items.' + yqindex + '.value'" :rules="{required: false, message: 'Item ' + item.yqindex +' can not be empty', trigger: 'blur'}">
					<Form :label-width="120" class='typeForm3'>
						<FormItem label="用气规格" style='width: 32%;'>
							<Select v-model="item.size" clearable @on-open-change='changeSize(item.size,yqindex)'>
								<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
							</Select>
						</FormItem>
						<FormItem label="每次起送量" style='width: 26%;'>
							<InputNumber :min='0' :max='10' v-model="item.sqcount" style='width: 100%;' />
						</FormItem>
						<FormItem label="使用周期" style='width: 25%;'>
							<InputNumber :min='0' :max='365' v-model="item.sycount" style='width: 100%;' />
						</FormItem>
						<!--<FormItem label="最大占用瓶数" style='width: 16%;' class='star'>
							<InputNumber :min='0' :max='10000' v-model="item.maxcount" />
						</FormItem>-->
						<FormItem style='width: 10%;' class='removeFitem'>
							<Button @click="handleRemove5(yqindex)" type="warning" style="height: 28px;">删除</Button>
						</FormItem>
					</Form>
				</FormItem>
			</Form>
			<div class='titleContent'>用气卡信息</div>
			<Form ref="typeForm4" :model="typeForm4" :label-width="120" class='typeForm4 sameType' inline>
				<FormItem label="用气卡发放状态" class='difFitem'>
					<i-switch v-model="typeForm4.switch" size="large" @on-change="openLast" :true-value='1' :false-value='0'>
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>
				<div v-if='typeForm4.switch'>
					<FormItem label="用气卡号" style='width: 32%;' class='star'>
						<Select v-model="typeForm4.cardNumber" style="" filterable>
							<Option v-for="item in cardCodeList" :value="item.cardCode" :key="item.cardCode">{{ item.cardCode }}</Option>
						</Select>
					</FormItem>
					<FormItem label="默认订购钢瓶" style='width: 26%;' class='star'>
						<Select v-model="typeForm4.bookProduct" style="" clearable>
							<Option v-for="item in goodsSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
						</Select>
					</FormItem>
					<FormItem label="默认订购数量" style='width: 25%;' class='star'>
						<InputNumber :min='0' :max='100000' v-model="typeForm4.bookNumber" style="text-align: center;width: 100%;" />
					</FormItem>

				</div>
			</Form>
			<div class='titleContent'>开户详情</div>
			<Form ref="typeForm1" :model="typeForm1" :label-width="120" class='typeForm1 sameType' inline>
				<FormItem label="开户人" class='star '>
					<Select v-model="typeForm1.accountHolder" label-in-value @on-change='selectHolder'>
						<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
					</Select>
				</FormItem>
				<FormItem label="开户合同编号" class=' '>
					<Input v-model="typeForm1.contractNumber"></Input>
				</FormItem>
				<!--<FormItem label="最大占用瓶数" class='star'>
					<InputNumber :max="10" :min="1" v-model="typeForm1.maxCount"></InputNumber>
				</FormItem>-->
				<!--<FormItem label="押瓶/占用瓶数量" class=''>
					<InputNumber :max="100" :min="0" v-model="typeForm1.yzcount"></InputNumber>
				</FormItem>-->
				<!--<FormItem label="计算存瓶数量" class=' '>
					<Input v-model="saveBottleNum" disabled></Input>
				</FormItem>-->
				<FormItem label="用户签名" style='margin-bottom: 0;' v-if='userSign'>
					<img :src="userSign" alt="" style="width: 48px;height: 48px;cursor: pointer;display: inline-block;" @click='viewPic(userSign)' />
					<Modal title="用户签名图片" v-model="visible1" width='800' class-name="vertical-center-modal">
						<img :src="userSign" v-if="visible1" style="width:auto;height:auto;max-height: 550px;max-width: 768px;">
					</Modal>
				</FormItem>
				<!--<FormItem v-else></FormItem>-->
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
					<Upload v-show='uploadList.length==0' ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :before-upload="handleBeforeUpload" type="drag" :action="fileUrl" style="display: inline-block;width:48px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
						<div style="width: 48px;height:48px;line-height: 48px;">
							<Icon type="ios-camera" size="20"></Icon>
						</div>
					</Upload>
					<Modal title="开户合同图片" v-model="visible2" width='800' class-name="vertical-center-modal">
						<img :src="imgUrl" v-if="visible2" style="auto;height:auto;max-height:550px;max-width: 768px;">
					</Modal>
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
					<Upload v-show='storePicList.length==0' ref="storePic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessstore" :format="['jpg','jpeg','png']" :max-size="2048" :before-upload="handleBeforeUploadstore" type="drag" :action="fileUrl" style="display: inline-block;width:48px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
						<div style="width: 48px;height:48px;line-height: 48px;">
							<Icon type="ios-camera" size="20"></Icon>
						</div>
					</Upload>
					<Modal title="门头图片" v-model="visible3" width='800' class-name="vertical-center-modal">
						<img :src="imgUrl" v-if="visible3" style="auto;height:auto;max-height:550px;max-width: 768px;">
					</Modal>
				</FormItem>
				<FormItem label="最大占用瓶" class='sameFitem difFitem'>
					<Button type="info" long @click="addMaxOccupy" icon="md-add">添加</Button>
				</FormItem>
				<FormItem v-for="(occitem, occindex) in occupyNumList" :key="occitem" style='width: 32%;' class='occitem' label='钢瓶'>
					<Row>
						<Col span="24">
						<Select v-model="occitem.occSpec" class='occSpec' @on-open-change='changeOccSpec(occitem.occSpec,occindex)'>
							<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
						</Select>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<InputNumber :min='0' :max='occitem.maxNum' v-model="occitem.occNum" style="text-align: center;" placeholder='数量' @on-blur='occNumChange(occindex)' />
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<Button @click="removeMaxOccupy(occindex)" type="warning" style="height: 28px;">删除</Button>
						</Col>
					</Row>
				</FormItem>

				<FormItem label="开户时已押瓶" class='sameFitem difFitem'>
					<Button type="info" long @click="addPledge" icon="md-add">添加</Button>
				</FormItem>
				<FormItem v-for="(occitem, occindex) in pledgeList" :key="occitem" style='width: 32%;' class='occitem' label='钢瓶'>
					<Row>
						<Col span="24">
						<Select v-model="occitem.occSpec" class='occSpec' @on-open-change='changePledge(occitem.occSpec,occindex)'>
							<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
						</Select>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<InputNumber :min='1' :max='100' v-model="occitem.occNum" style="text-align: center;" placeholder='数量' @on-blur='pledgeChange(occindex)' />
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<Button @click="removePledge(occindex)" type="warning" style="height: 28px;">删除</Button>
						</Col>
					</Row>
				</FormItem>

				<FormItem label="开户时已占用瓶" class='sameFitem difFitem'>
					<Button type="info" long @click="addYzOccupy" icon="md-add">添加</Button>
				</FormItem>
				<FormItem v-for="(occitem, occindex) in yzNumList" :key="occitem" style='width: 32%;' class='occitem' label='钢瓶'>
					<Row>
						<Col span="24">
						<Select v-model="occitem.occSpec" class='occSpec' @on-open-change='changeyzOccSpec(occitem.occSpec,occindex)'>
							<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
						</Select>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<InputNumber :min='1' :max='100' v-model="occitem.occNum" style="text-align: center;" placeholder='数量' @on-blur='yzNumChange(occindex)' />
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<Button @click="removeyzOccupy(occindex)" type="warning" style="height: 28px;">删除</Button>
						</Col>
					</Row>
				</FormItem>

				<FormItem label="增加押瓶" class='sameFitem difFitem'>
					<Button type="info" long @click="handleAdd" icon="md-add">添加押金单</Button>
				</FormItem>
				<FormItem style='width: 32%;' v-for="(khitem, khindex) in depositform.items" v-if="khitem.status" :key="khindex" :label="'押金单号 ' + (khindex+1)" :rules="{required: false, message: 'Item ' + khitem.khindex +' can not be empty', trigger: 'blur'}">
					<Row>
						<Col span="24">
						<Input type="text" v-model="khitem.value1" disabled v-if='khitem.id' />
						<Input type="text" v-model="khitem.value1" placeholder="押金单号" v-else/>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<span style="position: absolute;left: -40px;top:0">钢瓶</span>
						<Select v-model="khitem.occSpec" class='occSpec' disabled v-if='khitem.id' style="margin: 6px 0;">
							<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
						</Select>
						<Select v-model="khitem.occSpec" class='occSpec' placeholder='请选择钢瓶' v-else style="margin: 6px 0;">
							<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
						</Select>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<span style="position: absolute;left: -69px;top:0">押金金额</span>
						<Input v-model="khitem.pledgePrice" placeholder="押金金额" disabled v-if='khitem.id' />
						<InputNumber :min='0' v-model="khitem.pledgePrice" placeholder="押金金额" v-else/>

						</Col>

					</Row>
					<Row>
						<Col span="24">

						<span style="position: absolute;left: -97px;top:5px">押瓶开始时间</span>
						<Input type="text" v-model="khitem.beginTime" disabled style='margin: 6px 0;' v-if='khitem.id' />
						<DatePicker style='margin: 6px 0;' type="date" placeholder="押瓶开始时间" v-model='khitem.beginTime' format="yyyy-MM-dd" v-else></DatePicker>

						</Col>

					</Row>
					<Row>
						<Col span="24">
						<span style="position: absolute;left: -69px;top:0">押瓶备注</span>
						<Input disabled type="textarea" :rows="2" v-model="khitem.remark" placeholder="押瓶备注" style="margin-bottom: 6px;" v-if='khitem.id' />
						<Input type="textarea" :rows="2" v-model="khitem.remark" placeholder="押瓶备注" style="margin-bottom: 6px;" v-else/>
						</Col>

					</Row>
					<Row>
						<Col span="24">
						<span style="position: absolute;left: -83px;top:0">押金单图片</span>
						<div class="demo-upload-list" v-for="(item,index) in khitem.depositPicList" :key="index" v-if='item.url'>
							<template v-if="item.status === 'finished'">
								<img :src="item.url">
								<div class="demo-upload-list-cover">
									<Icon type="ios-eye-outline" @click.native="handleViewPicform(item.url)"></Icon>
									<Icon type="ios-trash-outline" @click.native="handleRemovePicform(item,khindex)" v-show='!khitem.id'></Icon>
								</div>
							</template>
							<template v-else>
								<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
							</template>
						</div>
						<div v-else style="height: 20px;"></div>
						<Upload v-show='khitem.depositPicList.length<1' ref="depositPic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessForm" :format="['jpg','jpeg','png']" :max-size="2048" type="drag" :action="fileUrl" style="display: inline-block;width:48px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
							<div style="width: 48px;height:48px;line-height: 48px;" @click='getDepIndex(khindex)'>
								<Icon type="ios-camera" size="20"></Icon>
							</div>
						</Upload>
						<Modal title="押金单图片" v-model="visible4" width='800' class-name="vertical-center-modal">
							<img :src="imgUrl" v-if="visible4" style="auto;height:auto;max-height: 550px;max-width: 768px;">
						</Modal>

						</Col>
					</Row>
					<Row>
						<Col span="24">
						<Button @click="handleRemove(khindex)" type="warning" style="height: 28px;" v-if='!khitem.id'>删除</Button>
						<Button @click="handleEditNote(khitem.id)" type="error" style="height: 28px;margin-right: 10px;" v-if='khitem.id&&khitem.newStatus=="0"&&khitem.actionType=="0"'>撤销</Button>
						<Button @click="handleEditNote(khitem.id)" type="primary" style="height: 28px;" v-if='khitem.id&&khitem.newStatus=="0"&&khitem.actionType=="0"'>编辑</Button>
						</Col>
					</Row>
				</FormItem>
			</Form>
			<div class='titleContent'>统计详情</div>
			<Form :label-width="120" class='typeForm1 sameType' inline>
				<FormItem label="计算存瓶数量" style='width: 32%;'>
					<Input v-model="saveBottleNum" disabled></Input>
				</FormItem>
				<FormItem label="实际登记押瓶" class='sameFitem difFitem'>

				</FormItem>
				<FormItem v-for="(occitem, occindex) in pledgeList1" :key="occindex" style='width: 32%;' class='occitem' label='钢瓶'>
					<Row>
						<Col span="24">
						<Select v-model="occitem.occSpec" class='occSpec' disabled>
							<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
						</Select>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<InputNumber :min='0' :max='100' v-model="occitem.occNum" style="text-align: center;" placeholder='数量' disabled />
						</Col>
					</Row>
				</FormItem>
				<FormItem label="实际登记占用瓶" class='sameFitem difFitem'>

				</FormItem>
				<FormItem v-for="(occitem, occindex) in yzNumList1" :key="occindex" style='width: 32%;' class='occitem' label='钢瓶'>
					<Row>
						<Col span="24">
						<Select v-model="occitem.occSpec" class='occSpec' disabled>
							<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
						</Select>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<InputNumber :min='0' :max='100' v-model="occitem.occNum" style="text-align: center;" placeholder='数量' disabled />
						</Col>
					</Row>
				</FormItem>
			</Form>
			<div class='titleContent'>燃气安全责任人信息</div>
			<Form ref="typeForm5" :model="typeForm5" :label-width="120" class='typeForm5 sameType' inline>
				<FormItem label="姓名" class='star' style='width:32%'>
					<Input type="text" v-model="typeForm5.securityName"></Input>
				</FormItem>
				<FormItem label="联系方式" class='star' style='width:26%'>
					<Input type="text" v-model="typeForm5.securityPhone"></Input>
				</FormItem>
				<FormItem label="身份证号码" class='star' style='width:25%'>
					<Input type="text" v-model="typeForm5.securityIDNumber"></Input>
				</FormItem>
				<FormItem>
					<Checkbox style='margin-left: 0px;' @on-change='singleChange'>同户主</Checkbox>
				</FormItem>
			</Form>
			<div class='titleContent'>燃气接收人信息</div>
			<Form ref="typeForm6" :label-width="120" class='typeForm6 sameType' inline>
				<FormItem class='difFitem' style='width:32%'>
					<Button type="info" @click="handleAdd6" icon="md-add" long>添加燃气接收人</Button>
				</FormItem>
				<div v-for="(item, jsrindex) in jsrform.items" v-if="item.status" :key="jsrindex">
					<FormItem label='姓名' class='star' style='width:32%'>
						<Input type="text" v-model="item.jsrname" />
					</FormItem>
					<FormItem label='联系方式' class='star' style='width:26%'>
						<Input type="text" v-model="item.contactNumber" />
					</FormItem>
					<FormItem label='身份证号码' class='star' style='width:25%'>
						<Input type="text" v-model="item.IDNumber" />
					</FormItem>
					<FormItem class='removeFitem' style='width: 10%;'>
						<Button @click="handleRemove6(jsrindex)" type="warning" style="height: 28px;">删除</Button>
					</FormItem>
					<FormItem>
						<Checkbox @on-change='singleChange1' v-if='jsrindex==0'>同户主</Checkbox>
					</FormItem>
				</div>
			</Form>
			<div class='titleContent' v-if='!isResident'>营业执照信息</div>
			<Form :model="formLicense" :label-width="120" class='sameType typeForm' inline v-show='!isResident'>
				<FormItem label="营业执照编码">
					<Input type="text" v-model="formLicense.businessLicenseCode" placeholder="请输入营业执照编码" style="" />
				</FormItem>
				<FormItem label="商户名称">
					<Input type="text" v-model="formLicense.businessName" placeholder="请输入商户名称" style="" />
				</FormItem>
				<FormItem label="商户类型">
					<Input type="text" v-model="formLicense.businessType" placeholder="请输入商户类型" style="" />
				</FormItem>
				<FormItem label="法人">
					<Input type="text" v-model="formLicense.legalPerson" placeholder="请输入法人" style="" />
				</FormItem>
				<!--<FormItem label="成立日期" class='licenseDate'>
								<DatePicker type="datetime" placeholder="请选择成立日期" format="yyyy-MM-dd HH:mm:ss" v-model='formLicense.dateTime' style='width: 100%;'></DatePicker>
							</FormItem>-->
				<FormItem label="注册地址">
					<Input type="text" v-model="formLicense.businessAddredss" placeholder="请输入注册地址" style="" />
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
					<Upload v-show='licensePicList.length==0' ref="licensePic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessstoreLicense" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUploadstoreLicense" type="drag" :action="fileUrl" style="display: inline-block;width:48px;">
						<div style="width: 48px;height:48px;line-height: 48px;">
							<Icon type="ios-camera" size="20"></Icon>
						</div>
					</Upload>
					<Modal title="营业执照图片" v-model="visible5" width='800' class-name="vertical-center-modal">
						<img :src="imgUrl" v-if="visible5" style="auto;height:auto;max-height: 550px;max-width: 768px;">
					</Modal>
				</FormItem>
			</Form>
			<div class='titleContent'>燃气设备信息</div>
			<Form ref="typeForm8" :label-width="120" class='typeForm8 sameType'>
				<FormItem style='width:32%'>
					<Button type="info" @click="handleAdd3" icon="md-add" long>添加燃气设备</Button>
				</FormItem>
				<div v-for="(sbitem, sbindex) in gasAppliance.items" v-if="sbitem.status" :key="sbindex" class='divFitem'>
					<FormItem label="燃气设备种类" class=''>
						<Select v-model="sbitem.gasAppliancekind" @on-change="qtsb(sbindex)" clearable>
							<Option v-for="item in gasSlist" :value="item.key" :key="item.key">{{ item.content }}</Option>
							<Option value="0">其他</Option>
						</Select>
					</FormItem>
					<FormItem v-show="sbitem.kind">
						<Input type="text" v-model="sbitem.otherKind" placeholder="请填写种类名称"></Input>
					</FormItem>
					<FormItem label="规格型号" class=''>
						<Input type="text" v-model="sbitem.value" />
					</FormItem>
					<FormItem label="数量" class=''>
						<InputNumber :min='0' :max='100' v-model="sbitem.count" style='width: 100%;' />
					</FormItem>
					<FormItem label="附件">
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
						<Upload v-show='sbitem.gasAppPicList.length<5' ref="gasAppPic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessGas" :format="['jpg','jpeg','png']" :max-size="2048" type="drag" :action="fileUrl" style="display: inline-block;width:48px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
							<div style="width: 48px;height:48px;line-height:48px;" @click='getGasIndex(sbindex)'>
								<Icon type="ios-camera" size="20"></Icon>
							</div>
						</Upload>
						<Modal title="燃气设备图片" v-model="visible6" width='800' class-name="vertical-center-modal">
							<img :src="imgUrl" v-if="visible6" style="auto;height:auto;max-height: 550px;max-width: 768px;">
						</Modal>
					</FormItem>
					<FormItem style='width:10%'>
						<Button @click="handleRemove3(sbindex)" type="warning" style="height: 28px;">删除</Button>
					</FormItem>

				</div>
			</Form>
			<div class='titleContent'>燃气附属设备信息</div>
			<Form ref="typeForm1" :label-width="120" class='typeForm1 sameType'>
				<FormItem style='width:32%'>
					<Button type="info" @click="handleAdd4" icon="md-add" long>添加燃气附属设备</Button>
				</FormItem>
				<div v-for="(sbfitem, sbfsindex) in gasOtherAppliance.items" v-if="sbfitem.status" :key="sbfsindex" class='divFitem'>
					<FormItem label="燃气设备种类">
						<Select v-model="sbfitem.gasOtherAppliancekind" @on-change="qtfssb(sbfsindex)" clearable>
							<Option v-for="item in gasSlist1" :value="item.key" :key="item.key">{{ item.content }}</Option>
							<Option value="0">其他</Option>
						</Select>
					</FormItem>
					<FormItem v-show="sbfitem.fsKind">
						<Input type="text" v-model="sbfitem.otherfsKind" placeholder="请填写种类名称"></Input>
					</FormItem>
					<FormItem label="规格型号">
						<Input type="text" v-model="sbfitem.value" />
					</FormItem>
					<FormItem label="数量">
						<InputNumber :min='0' :max='100' v-model="sbfitem.count" type='number' style='width: 100%;' />
					</FormItem>
					<FormItem label="附件">
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
						<Upload v-show='sbfitem.gasSubAppPicList.length<5' ref="gasSubAppPic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessGasSub" :format="['jpg','jpeg','png']" :max-size="2048" type="drag" :action="fileUrl" style="display: inline-block;width:48px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
							<div style="width: ;height:;line-height: 48px;" @click='getSubIndex(sbfsindex)'>
								<Icon type="ios-camera" size="20"></Icon>
							</div>
						</Upload>
						<Modal title="燃气附属设备图片" v-model="visible7" width='800' class-name="vertical-center-modal">
							<img :src="imgUrl" v-if="visible7" style="auto;height:auto;max-height: 550px;max-width: 768px;">
						</Modal>
					</FormItem>
					<FormItem style='width:10%'>
						<Button @click="handleRemove4(sbfsindex)" type="warning" style="height: 28px;">删除</Button>
					</FormItem>

				</div>
			</Form>
			<div class='btnWrapper'>
				<Button type="primary" @click='editUserFuc'>确定</Button>
				<Button style="margin-left: 8px" @click='handleBackClick'>返回</Button>
			</div>
		</div>
	</div>
</template>
<!--https://source.payq-iot.com:8089/file/upload-->
<!--http://test.payq-iot.com:7002/file/upload-->
<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	export default {
		name: 'editAccount',
		data() {
			return {
				hasCert: '',
				userAddMax: {},
				isAddMax: null,
				occupyArray: [],
				allowsArray: [],
				newPledgeBottles: null,
				newOccupiedNumber: null,
				newAllows: [],
				newSizeList1: [],
				idCrad: '',
				licensePicList: [],
				formLicense: {
					businessLicenseCode: '',
					businessName: '',
					businessType: '',
					legalPerson: '',
					dateTime: '',
					businessAddredss: ''
				},
				yzoccindex: 1,
				yzNumList: [{
					yzoccindex: 1,
					status: 1,
					occSpec: '',
					occNum: 0,
				}],
				occindex: 1,
				occupyNumList: [{
					occindex: 1,
					status: 1,
					occSpec: '',
					occNum: 0,
					maxNum: 100

				}],
				isResident: false,
				userData: (JSON.parse(this.$store.state.userData)),
				visible: false,
				visible1: false,
				visible2: false,
				visible3: false,
				visible4: false,
				visible5: false,
				visible6: false,
				visible7: false,
				fileUrl: pathUrls.fileUpload,
				//				fileUrl: 'https://source.payq-iot.com:8089/file/upload',
				//				fileUrl: 'https://sys.payq-iot.com:8089/file/upload',
				//基本信息
				typeForm: {
					organize: '',
					gasType: '',
					gasSubType: '',
					businessName: '',
					clientName: '',
					idNum: '',
					telephoneNumber: '',
					province: null,
					city: null,
					area: null,
					street: null,
					detailAddress: null,
					clientRemark: [],
					userCertAddress: ''

				},
				options: [],
				gasTypeList: [],
				subType1List: [],
				gasChildTypeName: '',
				provinceList: [],
				cityList: [],
				areaList: [],
				streetList: [],
				detail: false,
				otherRemark: '',
				userRemarks: [],
				//开户信息
				typeForm1: {
					accountHolder: '',
					contractNumber: '',
					yzcount: 0,
					maxCount: 1,
				},
				staffNameList: [],
				uploadList: [],
				storePicList: [],
				khindex: 0,
				depositform: {
					items: []
				},
				//用气量核定
				yqindex: 1,
				gasDefineform: {
					items: [{
						yqindex: 1,
						status: 1,
						sqcount: 0,
						sycount: 0,
						size: '',
						//						maxcount: 0
					}]
				},

				//用气卡信息
				typeForm4: {
					switch: 0,
					cardNumber: '',
					bookProduct: '',
					bookNumber: 0
				},
				cardCodeList: [],
				sizeList: [],
				//燃气安全责任人信息
				typeForm5: {
					securityName: '',
					securityPhone: '',
					securityIDNumber: ''
				},
				//燃气接收人信息
				jsrindex: 1,
				jsrform: {
					items: [{
						contactNumber: '',
						jsrname: '',
						IDNumber: '',
						jsrindex: 1,
						status: 1
					}]
				},
				//燃气销售信息
				salesmanId: '',
				payWay: null,
				staffNameList: [],
				acTypeList: [],
				saleform: {
					items: [{
						saleindex: 1,
						status: 1,
						ssize: ''
					}]
				},
				saleindex: 1,
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
				gasSlist: [],
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
				gasSlist1: [],
				newDepId: '',
				newGasType: '',
				newOpener: '',
				newCardCode: '',
				newSalesmanId: '',
				newPayWay: '',
				userAccountNumbers: '',
				newSize: [],
				newSize1: [],
				newSizeList: [],
				saveBottleNum: 0,
				saveBottle: [],
				userSign: null,
				userInfoExecutor: null,
				userInfoExecutorName: null,
				userInfoIsPerfection: null,
				completionTime: null,
				ids: null,
				userStatus: null,
				allocationTime: null,
				userSign: null,
				goodsSizeList: [],
				contractId: '',
				pledgeindex: 1,
				pledgeList: [{
					pledgeindex: 1,
					status: 1,
					occSpec: '',
					occNum: 0,

				}],
				yzoccindex1: 1,
				yzNumList1: [{
					yzoccindex: 1,
					status: 1,
					occSpec: '',
					occNum: null,
				}],

			}
		},
		watch: {
			'saleform.items': {
				handler(newItems, oldItems) {

					// this.goodsSizeList = [];
					this.newSizeList.forEach(item => {
						for(let items of newItems) {
							if(item.goodsId == items.ssize) {
								// this.goodsSizeList.push(item);
							}
						}

					})　　
				},
				deep: true,
				immediate: true
			},
		},

		methods: {
			//			idNumFocus() {
			//				this.typeForm.idNum = null;
			//			},
			handleEditNote(id) {
				this.$router.push('/depositNoteInfo/editNote/' + id);
			},
			occNumChange(v) {
				if(!this.occupyNumList[v].occNum && this.occupyNumList[v].occSpec) {
					this.occupyNumList[v].occNum = 1;
				}
			},
			yzNumChange(v) {
				if(!this.yzNumList[v].occNum && this.yzNumList[v].occSpec) {
					this.yzNumList[v].occNum = 1;
				}
			},
			pledgeChange(v) {

				if(!this.pledgeList[v].occNum && this.pledgeList[v].occSpec) {
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

					this.pledgeList[index].occSpec = v;

					this.pledgeList[index].occNum = 1;

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

					this.pledgeList[index].occNum = 0;
				}
			},
			addPledge() {
				let len = this.newSizeList.length;
				let occLen = this.pledgeList.length;
				if(len > occLen) {
					this.occyzindex++;
					let newForms = [];
					newForms = this.newSizeList.filter(item => !this.pledgeList.some(ele => ele.occSpec === item.goodsId))
					this.pledgeList.push({
						pledgeindex: this.pledgeindex,
						status: 1,
						occSpec: newForms.length ? newForms[0].goodsId : '',
						occNum: newForms.length ? 1 : 0,

					})
				} else {
					this.$Message['warning']({
						background: true,
						content: `最多添加${len}种钢瓶!`,

					});
					return false
				}
			},
			//接收人人是否同户主
			singleChange1(v) {
				if(v) {
					this.jsrform.items[0].jsrname = this.typeForm.clientName;
					this.jsrform.items[0].contactNumber = this.typeForm.telephoneNumber;
					this.jsrform.items[0].IDNumber = this.typeForm.idNum;
				} else {
					this.jsrform.items[0].jsrname = '';
					this.jsrform.items[0].contactNumber = '';
					this.jsrform.items[0].IDNumber = '';
				}
			},
			//责任人是否同户主
			singleChange(v) {
				if(v) {
					this.typeForm5.securityName = this.typeForm.clientName;
					this.typeForm5.securityPhone = this.typeForm.telephoneNumber;
					this.typeForm5.securityIDNumber = this.typeForm.idNum;
				} else {
					this.typeForm5.securityName = '';
					this.typeForm5.securityPhone = '';
					this.typeForm5.securityIDNumber = '';
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
			//新增押瓶/占用瓶
			addYzOccupy() {
				let len = this.newSizeList.length;
				let occLen = this.yzNumList.length;
				if(len > occLen) {
					this.occyzindex++;
					let newForms = [];
					newForms = this.newSizeList.filter(item => !this.yzNumList.some(ele => ele.occSpec === item.goodsId))
					this.yzNumList.push({
						occindex: this.occyzindex,
						status: 1,
						occSpec: newForms.length ? newForms[0].goodsId : '',
						occNum: newForms.length ? 1 : 0,
					})
				} else {
					this.$Message['warning']({
						background: true,
						content: `最多添加${len}种钢瓶!`,

					});
					return false
				}
			},
			//删除押瓶/占用瓶
			removeyzOccupy(index) {
				this.yzNumList[index].status = 0;
				this.yzNumList.splice(index, 1)
				this.occyzindex--;
			},
			//改变押瓶占用瓶
			changeyzOccSpec(v, index) {
				if(v) {
					this.yzNumList[index].occSpec = v;

					this.yzNumList[index].occNum = 1;

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
					this.yzNumList[index].occNum = 0;
				}
			},
			//改变最大占用瓶
			changeOccSpec(v, index) {
				if(v) {
					this.newAllows.forEach(item => {
						if(item.goodsId == v) {

							this.occupyNumList[index].maxNum = item.number
							this.occupyNumList[index].occNum = item.number
						}
					})
					this.occupyNumList[index].occSpec = v;
					let lens = this.occupyNumList.length;
					let newOcc = this.occupyNumList;
					for(let i = 0; i < lens; i++) {
						if(newOcc[i].occSpec == v && i != index) {
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
					this.occupyNumList[index].occNum = 0;
				}
			},
			//删除最大占用瓶
			removeMaxOccupy(occindex) {
				this.occupyNumList[occindex].status = 0;
				this.occupyNumList.splice(occindex, 1)
				this.occindex--;
			},
			//添加最大占用瓶
			addMaxOccupy() {
				let len = this.newSizeList.length;
				let occLen = this.occupyNumList.length;
				if(len > occLen) {
					this.occindex++;
					let newForms = [];
					newForms = this.newSizeList1.filter(item => !this.occupyNumList.some(ele => ele.occSpec === item.goodsId))
					this.occupyNumList.push({
						occindex: this.occindex,
						status: 1,
						occSpec: newForms.length ? newForms[0].goodsId : '',
						occNum: 1,
						maxNum: 100,
					})

					this.occupyNumList.forEach(item => {
						this.newAllows.forEach(items => {
							if(item.occSpec == items.goodsId) {

								item.maxNum = items.number
							}
						})
					})

				} else {
					this.$Message['warning']({
						background: true,
						content: `最多添加${len}种钢瓶!`,

					});
					return false
				}

			},
			//查看用户签名
			viewPic(url) {
				this.visible1 = true;
				this.userSign = url;
			},
			//获取商品信息列表
			getGoodsList() {
				this.newSizeList = [];
				return _http.http1('post', pathUrls.deptgoodsList, {
					'isGas': 2
				}, 'form')
			},
			//用气卡状态改变
			openLast(v) {
				if(v == 1) {
					this.typeForm4.bookNumber = 1;
				} else {
					this.typeForm4.bookNumber = 0;
				}
			},
			//改变结算单规格
			changeSize1(v, index) {
				if(v) {
					this.saleform.items[index].ssize = v
					let lens = this.saleform.items.length;
					let newSale = this.saleform.items
					for(let i = 0; i < lens; i++) {
						if(newSale[i].ssize == v && i != index) {
							this.saleform.items[index].ssize = null
							this.$Message['warning']({
								background: true,
								content: '钢瓶重复，请重新选择!',

							});
							return false
						}
					}
				} else {
					this.saleform.items[index].ssize = null
				}

			},
			//改变用气量核定用气规格
			changeSize(v, index) {
				if(v) {
					this.gasDefineform.items[index].size = v
					let lens = this.gasDefineform.items.length;
					let newGas = this.gasDefineform.items
					for(let i = 0; i < lens; i++) {
						if(newGas[i].size == v && i != index) {
							this.gasDefineform.items[index].size = null
							this.$Message['warning']({
								background: true,
								content: '用气规格重复，请重新选择!',

							});
							return false
						}
					}
				} else {
					this.gasDefineform.items[index].size = null
				}

			},
			//燃气附属设备索引
			getSubIndex(index) {
				this.subIndex = index;
			},
			//燃气设备索引
			getGasIndex(index) {
				this.gasIndex = index;
			},
			//押瓶索引
			getDepIndex(index) {
				this.depIndex = index;
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
			//确定
			editUserFuc() {
				let userDepositNumber = []; //押瓶详情
				let taskList = []; //用气量信息
				let receiverList = []; //接收人信息
				let allowGoods = []; //销售商品
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
						let pic = []
						item.depositPicList.map((item1) => {
							pic.push(item1.url)

						})
						if(item.occSpec) {
							userDepositNumber.push({
								'depositNumber': item.value1,
								'depositPic': pic.toString(),
								'goodsId': item.occSpec,
								'pledgePrice': item.pledgePrice,
								'beginTime': item.beginTime ? this.common.conformatDat(item.beginTime) : '',
								'remark': item.remark,
							});
						}

					}
				}
				if(this.gasDefineform.items.length) {
					for(let item of this.gasDefineform.items) {
						//						let spec;
						//						if(item.size == '5KG') {
						//							spec = 5
						//						} else if(item.size == '15KG') {
						//							spec = 15
						//						} else if(item.size == '50KG') {
						//							spec = 50
						//						}
						taskList.push({
							'numUnit': item.sqcount,
							'spec': item.size,
							'dailyNum': item.sycount ? this.toDecimal(item.sqcount / item.sycount) : 0,
							//'maxOccupiedNumber': item.maxcount
						});
					}
				}

				if(this.jsrform.items.length) {

					for(let item of this.jsrform.items) {
						if(item.id) {
							receiverList.push({
								'receiverName': item.jsrname,
								'receiverPhone': item.contactNumber,
								'idCard': item.IDNumber,
								'id': item.id
							})
						} else {
							receiverList.push({
								'receiverName': item.jsrname,
								'receiverPhone': item.contactNumber,
								'idCard': item.IDNumber,
							})
						}

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
						//						if(item.gasSubAppPicList.length) {
						item.gasSubAppPicList.map((item1) => {
							pic.push(item1.url)
						})
						gasAuxDevice.push({
							'gasAuxDeviceType': item.gasOtherAppliancekind,
							'content': item.otherfsKind,
							'gasAuxDeviceSpec': item.value,
							'number': item.count,
							'pic': pic
						})
						//						}

					}
				}
				if(this.userRemarks) {
					for(let item of this.userRemarks) {
						if(item.remarksKey == '4') {
							item.remarksContent = this.otherRemark
						}
					}
				}

				let subData = {
					'hasCert': this.hasCert,
					'isAddMax': this.isAddMax,
					'userAddMax': this.userAddMax,
					'userCertAddress': this.typeForm.userCertAddress, //证件地址
					'contractId': this.contractId,
					'userSign': this.userSign,
					'allocationTime': this.allocationTime,
					'userStatus': this.userStatus,
					'completionTime': this.completionTime,
					'userInfoExecutor': this.userInfoExecutor,
					'userInfoExecutorName': this.userInfoExecutorName,
					'userInfoIsPerfection': this.userInfoIsPerfection,
					'userAccountNumbers': this.userAccountNumbers, //户号
					'userId': this.$route.params.id, //用户id
					'userDeptId': this.typeForm.organize, //组织id
					'userOrderType': this.typeForm.gasType, //用气类型
					'userGasSubType': this.typeForm.gasSubType, //用气子类型
					'userCompanyName': this.typeForm.businessName, //企业商户名称
					'userRealName': this.typeForm.clientName, //客户姓名
					'userIdCardNumber': this.typeForm.idNum, //身份证号码
					'userPhoneNumber': this.typeForm.telephoneNumber, //联系电话
					//地址
					'userProvinceCode': this.typeForm.province, //省份编码
					'userCityCode': this.typeForm.city, //城市编码
					'userAreaCode': this.typeForm.area, //区域编码
					'userStreetCode': this.typeForm.street, //街道编码
					'userAddress': this.typeForm.detailAddress, //详细地址
					'userOpeningStaff': this.typeForm1.accountHolder, //开户人
					'cardCode': this.typeForm4.cardNumber, //订气卡编号
					'doorPic': this.storePicList.length ? this.storePicList[0].url : '', //门头图片
					'countType': '1', //结算方式
					'taskList': taskList, //用气量信息
					'userExtendEntity': //拓展信息
					{
						'businessLicenseEntity': businessLicenseEntity, //营业执照相关信息
						'userId': this.$route.params.id, //用户id
						'id': this.ids,
						'userRemarks': JSON.stringify(this.userRemarks),
						//开户详情
						'userContractNumber': this.typeForm1.contractNumber, //开户合同编号
						'contractPic': this.uploadList.length ? this.uploadList[0].url : '', //开户合同图片
						'initStorageBottles': JSON.stringify(yzOccupy), //占用瓶数
						'maxOccupiedNumber': JSON.stringify(maxOccupy), //最大占用瓶数
						'userDepositNumber': JSON.stringify(userDepositNumber), //押瓶详情
						'initPledgeBottles': JSON.stringify(pledgeBottle), //开户时已押瓶
						//用气量用气卡信息
						'occupiedNumber': this.newOccupiedNumber,
						'pledgeBottles': this.newPledgeBottles,
						'safetyPerson': JSON.stringify({ //安全员信息
							'name': this.typeForm5.securityName,
							'phone': this.typeForm5.securityPhone,
							'idCard': this.typeForm5.securityIDNumber
						}),
						//默认订购信息
						'defaultOrderingGas': JSON.stringify({
							'goodsId': this.typeForm4.bookProduct,
							'number': this.typeForm4.bookNumber
						}),
						'cardStatus': this.typeForm4.switch,
						//燃气销售信息
						'receiverList': receiverList, //接收人信息
						'userSalesperson': this.salesmanId, //销售员id
						'allowGoods': JSON.stringify(allowGoods), //销售商品
						//燃气设备信息
						'facilitiesInfo': JSON.stringify({
							'gasDevice': gasDevice,
							'gasAuxDevice': gasAuxDevice
						})

					}, //用户备注

				}
				if(subData.userDeptId == '') {
					this.$Message['warning']({
						background: true,
						content: '请选择所属组织!',

					});
					return false
				}
				if(!subData.userOrderType) {
					this.$Message['warning']({
						background: true,
						content: '请选择客户类型!',

					});
					return false
				}
				if(!this.isResident && !subData.userGasSubType) {
					this.$Message['warning']({
						background: true,
						content: '请选择用气子类型!',
					});
					return false
				}
				if(!this.isResident && !subData.userCompanyName) {
					this.$Message['warning']({
						background: true,
						content: '请填写企业/商户名称!',
					});
					return false
				}
				if(!this.isResident && subData.userCompanyName.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '企业/商户名称内容过长!',

					});

					return false
				}

				if(subData.userRealName == '') {
					this.$Message['warning']({
						background: true,
						content: '请填写客户姓名!',

					});
					return false
				}
				if(subData.userRealName.length > 13) {
					this.$Message['warning']({
						background: true,
						content: '客户姓名过长!',

					});
					return false
				}
				if(!subData.userIdCardNumber) {
					this.$Message['warning']({
						background: true,
						content: '请输入客户身份证号码!',

					});
					return false
				}
				let strs = '';
				if(subData.userIdCardNumber && subData.userIdCardNumber.length > 9) {
					strs = subData.userIdCardNumber.substring(subData.userIdCardNumber.length - 9);
				}

				if(subData.userIdCardNumber && !this.common.checkIDCard(subData.userIdCardNumber) && strs != '*********') {
					this.$Message['warning']({
						background: true,
						content: '请输入正确的客户身份证号码!',

					});
					return false
				}

				// if(!this.isPoneAvailable(subData.userPhoneNumber)) {
				// 	this.$Message['warning']({
				// 		background: true,
				// 		content: '请填写正确的联系方式!',

				// 	});
				// 	return false
				// }

				if(subData.userCertAddress && this.common.isEmojiCharacter(subData.userCertAddress)) {
					this.$Message['warning']({
						background: true,
						content: '证件地址不合法!',

					});
					return false
				}
				if(!subData.userPhoneNumber) {
					this.$Message['warning']({
						background: true,
						content: '请填写联系方式!',

					});
					return false
				}
				if(subData.userPhoneNumber && subData.userPhoneNumber.length > 12) {
					this.$Message['warning']({
						background: true,
						content: '请填写正确的联系方式!',

					});
					return false
				}
				if(!subData.userProvinceCode) {
					this.$Message['warning']({
						background: true,
						content: '请选择所属省份!',

					});
					return false
				}
				if(!subData.userCityCode) {
					this.$Message['warning']({
						background: true,
						content: '请选择所属城市!',

					});
					return false
				}
				if(!subData.userAreaCode) {
					this.$Message['warning']({
						background: true,
						content: '请选择所属区县!',

					});
					return false
				}
				if(this.streetList.length && !subData.userStreetCode) {
					this.$Message['warning']({
						background: true,
						content: '请选择所属街道!',

					});
					return false
				}
				if(!subData.userAddress) {
					this.$Message['warning']({
						background: true,
						content: '请输入详细地址!',

					});
					return false
				}
				if(!this.saleform.items || (this.saleform.items && this.saleform.items.length && !this.saleform.items[0].ssize)) {
					this.$Message['warning']({
						background: true,
						content: '请选择允许使用钢瓶!',
					});
					return false
				}
				let gasObj = {};
				//				for(let item of this.gasDefineform.items) {
				//					if(!item.size) {
				//						this.$Message['warning']({
				//							background: true,
				//							content: '请选择用气规格!',
				//
				//						});
				//						return false
				//					}
				//
				//				}
				if(this.typeForm4.switch == 1) {
					if(!this.typeForm4.cardNumber) {
						this.$Message['warning']({
							background: true,
							content: '请选择用气卡号!',

						});
						return false
					}
					if(!this.typeForm4.bookProduct) {
						this.$Message['warning']({
							background: true,
							content: '请选择默认订购钢瓶!',

						});
						return false
					}
				}

				if(!subData.userOpeningStaff) {
					this.$Message['warning']({
						background: true,
						content: '请选择开户人!',

					});
					return false
				}

				if(this.typeForm1.contractNumber && this.typeForm1.contractNumber.length > 50) {
					this.$Message['warning']({
						background: true,
						content: '合同编号内容过长!',

					});
					return false
				}

				let regs = /^[-a-zA-Z0-9]+$/;
				let re = new RegExp(regs)

				for(let item of this.depositform.items) {
					if(!item.value1) {
						this.$Message['warning']({
							background: true,
							content: '押金单号不能为空!',

						});
						return false;
					}
					if(item.value1 && item.value1.length && !re.test(item.value1)) {
						this.$Message['warning']({
							background: true,
							content: '押金单号字符不合法!',

						});
						return false;
					}
					if(item.value1 && item.value1.length > 30) {
						this.$Message['warning']({
							background: true,
							content: '押金单号内容过长!',

						});
						return false;
					}
					if(!item.occSpec) {
						this.$Message['warning']({
							background: true,
							content: '押金单对应钢瓶不能为空!',

						});
						return false;
					}
				}

				if(!this.typeForm5.securityName) {
					this.$Message['warning']({
						background: true,
						content: '请填写燃气安全责任人!',

					});
					return false
				}
				if(this.typeForm5.securityName.length > 13) {
					this.$Message['warning']({
						background: true,
						content: '燃气安全责任人姓名过长!',

					});
					return false
				}

				// if(!this.isPoneAvailable(this.typeForm5.securityPhone)) {
				// 	this.$Message['warning']({
				// 		background: true,
				// 		content: '请填写正确的联系方式!',

				// 	});
				// 	return false
				// }

				if(!this.typeForm5.securityPhone) {
					this.$Message['warning']({
						background: true,
						content: '请填写联系方式!',

					});
					return false
				}
				if(this.typeForm5.securityPhone && this.typeForm5.securityPhone.length > 12) {
					this.$Message['warning']({
						background: true,
						content: '请填写正确的联系方式!',

					});
					return false
				}
				if(!this.typeForm5.securityIDNumber) {
					this.$Message['warning']({
						background: true,
						content: '请输入责任人身份证号码!',

					});
					return false
				}
				let idSr = '';
				if(this.typeForm5.securityIDNumber && this.typeForm5.securityIDNumber.length > 9) {
					idSr = this.typeForm5.securityIDNumber.substring(this.typeForm5.securityIDNumber.length - 9);
				}

				if(this.typeForm5.securityIDNumber && !this.common.checkIDCard(this.typeForm5.securityIDNumber) && idSr != '*********') {
					this.$Message['warning']({
						background: true,
						content: '请输入正确的责任人身份证号码!',

					});
					return false
				}
				let idObj = {};
				for(let item of this.jsrform.items) {

					if(item.jsrname == '') {
						this.$Message['warning']({
							background: true,
							content: '请填写接收人姓名!',

						});
						return false
					} else if(item.jsrname.length > 13) {
						this.$Message['warning']({
							background: true,
							content: '接收人姓名过长!',

						});
						return false
					}
					//      else if(!this.isPoneAvailable(item.contactNumber)) {
					// 	this.$Message['warning']({
					// 		background: true,
					// 		content: '请填写正确的联系方式',

					// 	});
					// 	return false
					// }
					else if(!item.contactNumber) {
						this.$Message['warning']({
							background: true,
							content: '请填写联系方式',

						});
						return false
					} else if(item.contactNumber && item.contactNumber.length > 12) {
						this.$Message['warning']({
							background: true,
							content: '请填写正确的联系方式',

						});
						return false
					}
					if(!item.IDNumber) {
						this.$Message['warning']({
							background: true,
							content: '请输入接收人身份证号码!',

						});
						return false
					}
					let srs = '';
					if(item.IDNumber && item.IDNumber.length > 9) {
						srs = item.IDNumber.substring(item.IDNumber.length - 9)
					}

					if(item.IDNumber && !this.common.checkIDCard(item.IDNumber) && srs != '*********') {
						this.$Message['warning']({
							background: true,
							content: '请输入正确的接收人身份证号码!',

						});
						return false
					}

					let idArray = idObj[item['IDNumber']] || []
					idArray.push(item)
					idObj[item['IDNumber']] = idArray

				}
				let newId = Object.values(idObj)
				for(let item of newId) {
					if(item.length > 1) {
						this.$Message['warning']({
							background: true,
							content: '接收人身份证号码重复!',
						});
						return false;
					}

				}

				if(this.formLicense.businessLicenseCode && this.formLicense.businessLicenseCode.length > 20) {
					this.$Message['warning']({
						background: true,
						content: '营业执照编码过长!',
					});
					return false;
				}
				if(this.formLicense.businessName && this.formLicense.businessName.length > 64) {
					this.$Message['warning']({
						background: true,
						content: '商户名称过长!',
					});
					return false;
				}
				if(this.formLicense.businessType && this.formLicense.businessType.length > 32) {
					this.$Message['warning']({
						background: true,
						content: '商户类型过长!',
					});
					return false;
				}
				if(this.formLicense.legalPerson && this.formLicense.legalPerson.length > 16) {
					this.$Message['warning']({
						background: true,
						content: '法人名称过长!',
					});
					return false;
				}
				if(this.formLicense.businessAddredss && this.formLicense.businessAddredss.length > 64) {
					this.$Message['warning']({
						background: true,
						content: '注册地址过长!',
					});
					return false;

				}
				for(let item of this.gasAppliance.items) {
					//					if(item.gasAppliancekind == '') {
					//						this.$Message['warning']({
					//							background: true,
					//							content: '请选择燃气设备种类',
					//
					//						});
					//						return false
					//					} else if(item.value == '') {
					//						this.$Message['warning']({
					//							background: true,
					//							content: '请选择规格型号',
					//
					//						});
					//						return false
					//					}
					if(item.value && item.value.length > 64) {
						this.$Message['warning']({
							background: true,
							content: '规格型号内容过长',

						});
						return false
					}
					//					else if(!item.gasAppPicList.length) {
					//						this.$Message['warning']({
					//							background: true,
					//							content: '请上传附件!',
					//							duration: 1
					//						});
					//						return false
					//					}
				}
				for(let item of this.gasOtherAppliance.items) {

					if(item.value.length > 64) {
						this.$Message['warning']({
							background: true,
							content: '规格型号内容过长',

						});
						return false
					}
				}
				//				console.log(subData)
				//				return false;
				_http.http2('post', pathUrls.userGetUserUpdate, subData).then((res) => {
					if(res.code == 0) {
						this.$Message['success']({
							background: true,
							content: '修改成功!',
							onClose: (() => {
								this.$router.go(-1)
							})
						});

					}
					if(res.code == 500) {
						this.$Message['warning']({
							background: true,
							content: res.msg,
							duration: 3
						});
					}
				})

			},
			//返回
			handleBackClick() {
				this.$router.go(-1)
			},
			//获取详情
			userGetUserInfo() {
				_http.http1('get', pathUrls.userGetUserInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {

					if(res) {
						this.getAreaInfo(0, 'provinceList');
						//基本信息
						this.hasCert = res.user.hasCert;
						this.idCrad = res.user.userIdCardNumber;
						this.userSign = res.user.userSign;
						this.allocationTime = res.user.allocationTime;
						this.userStatus = res.user.userStatus;
						this.completionTime = res.user.completionTime;
						this.userInfoExecutor = res.user.userInfoExecutor;
						this.userInfoExecutorName = res.user.userInfoExecutorName;
						this.userInfoIsPerfection = res.user.userInfoIsPerfection;
						this.userAccountNumbers = res.user.userAccountNumbers; //户号
						this.typeForm.organize = res.user.userDeptId + ''; //组织
						this.newDepId = res.user.userDeptId + '';

						this.typeForm.gasType = +res.user.userOrderType; //用气类型
						this.newGasType = res.user.userOrderType;
						this.goodsSizeList = [];
						this.common.getUserTypeList(this.userData.deptId).then((res) => {
							this.gasTypeList = res.data;
							for(let item of this.gasTypeList) {
								if(item.id == this.typeForm.gasType) {
									let allows = JSON.parse(item.allowedGoods);
									this.newAllows = allows;
									this.newSizeList1.forEach(item => {
										for(let items of allows) {
											if(item.goodsId == items.goodsId) {
												this.goodsSizeList.push(item);
											}
										}
									})

									if(item.detailType == 1) {
										this.isResident = true;
									} else {
										this.isResident = false;
									}
								}
							}
							if(extend && extend.maxOccupiedNumber) {
								let newOccupiedNum = JSON.parse(extend.maxOccupiedNumber);
								if(newOccupiedNum.length) {
									this.occupyArray = newOccupiedNum;
									this.occindex = newOccupiedNum.length;
									this.occupyNumList = [];

									newOccupiedNum.forEach((item, index) => {
										this.newSizeList1.forEach(items => {
											if(item.goodsId == items.goodsId) {
												this.occupyNumList.push({
													occindex: index + 1,
													status: 1,
													occSpec: +item.goodsId,
													occNum: item.number,
													maxNum: 100
												})
											}
										})

									})
									this.occupyNumList.forEach(item => {
										this.newAllows.forEach(items => {
											if(item.occSpec == items.goodsId) {
												item.maxNum = items.number;
											}
										})
									})

								}
							}

							if(extend && extend.allowGoods) {
								let newAllowGoods = JSON.parse(extend.allowGoods) //商品
								if(newAllowGoods.length) {
									this.saleform.items = [];
									this.saleindex = newAllowGoods.length;
									// this.goodsSizeList = [];
									// this.newSizeList=[];
									this.allowsArray = newAllowGoods;
									this.getGoodsList().then((lia) => {
										this.newSizeList1 = lia.data;
										this.newSizeList = lia.data;

									})

									for(let i = 0; i < newAllowGoods.length; i++) {
										this.saleform.items.push({
											saleindex: i + 1,
											status: 1,
											ssize: +newAllowGoods[i],

										})
									}
								}
							}

						})
						this.contractId = res.user.contractId; //合同id
						this.typeForm.gasSubType = res.user.userGasSubType; //用气子类型
						this.typeForm.businessName = res.user.userCompanyName; //企业商户名称

						this.typeForm.clientName = res.user.userRealName; //客户姓名
						this.typeForm.idNum = res.user.userIdCardNumber; //身份证号码
						this.typeForm.telephoneNumber = res.user.userPhoneNumber; //联系电话
						this.typeForm.province = Number(res.user.userProvinceCode); //所属省份
						this.typeForm.city = Number(res.user.userCityCode); //所属市
						this.typeForm.area = Number(res.user.userAreaCode); //所属区县
						this.typeForm.street = Number(res.user.userStreetCode); //所属街道
						this.typeForm.detailAddress = res.user.userAddress; //详细地址
						this.typeForm.userCertAddress = res.user.userCertAddress; //证件地址
						let extend = res.user.userExtendEntity;
						if(extend && extend.businessLicenseEntity) {
							let newLicense = extend.businessLicenseEntity;
							this.formLicense.businessLicenseCode = newLicense.businessLicenseCode;
							this.formLicense.businessName = newLicense.name;
							this.formLicense.businessType = newLicense.type;
							this.formLicense.legalPerson = newLicense.legalPerson;
							this.formLicense.businessAddredss = newLicense.businessAddredss;
							if(newLicense.businessLicensePic) {
								this.licensePicList.push({
									url: newLicense.businessLicensePic,
									showProgress: false,
									status: "finished"
								})
							}
						}
						if(extend && extend.id) {
							this.ids = extend.id;
						}
						if(extend && extend.userRemarks) {
							this.userRemarks = JSON.parse(extend.userRemarks);
						}

						if(this.userRemarks) {
							for(let item of this.userRemarks) {
								if(item.remarksKey == '4') {
									this.typeForm.clientRemark.push('其他')
									this.detail = true;
									this.otherRemark = item.remarksContent;
								} else {
									this.typeForm.clientRemark.push(item.remarksContent)
								}
							}
						}

						this.getAreaInfo(Number(res.user.userProvinceCode), "cityList");
						this.getAreaInfo(Number(res.user.userCityCode), 'areaList');
						this.getAreaInfo(Number(res.user.userAreaCode), 'streetList');

						this.getSubType1();

						//开户详情
						this.typeForm1.accountHolder = res.user.userOpeningStaff; //开户人
						this.newOpener = res.user.userOpeningStaff;
						if(extend) {
							this.typeForm1.contractNumber = extend.userContractNumber; //开户合同编号
							this.typeForm1.yzcount = extend.occupiedNumber; //押瓶/占用瓶数量
							this.typeForm1.maxCount = extend.maxOccupiedNumber; //最大占用瓶数量
							this.newOccupiedNumber = extend.occupiedNumber;
						}

						this.userSign = res.user.userSign; //用户签名
						//开户合同图片
						if(extend && extend.contractPic) {
							this.uploadList.push({
								url: extend.contractPic,
								showProgress: false,
								status: "finished"
							})
						}
						//门头图片
						if(res.user.doorPic) {
							this.storePicList.push({
								url: res.user.doorPic,
								showProgress: false,
								status: "finished"
							})
						}
						//押瓶情况
						if(extend && extend.userDepositNumber) {
							let newDepNum = JSON.parse(extend.userDepositNumber);
							if(newDepNum.length) {
								this.khindex = newDepNum.length;
								this.depositform.items = [];
								for(let i = 0; i < newDepNum.length; i++) {
									//									if(newDepNum[i].depositPic || newDepNum[i].depositNumber) {
									let defaultPic = []
									if(newDepNum[i].depositPic) {
										defaultPic = newDepNum[i].depositPic.split(",");
									} else {
										defaultPic = [];
									}
									let newPic = [];
									if(defaultPic.length) {
										defaultPic.map((item) => {
											newPic.push({
												url: item,
												showProgress: false,
												status: "finished",
												percentage: 100
											})

										})
									} else {
										newPic.push({
											url: '',
											showProgress: false,
											status: "finished",
											percentage: 100
										})

									}
									this.depositform.items.push({
										value1: newDepNum[i].depositNumber,
										khindex: i + 1,
										status: 1,
										depositPicList: newPic,
										occSpec: +newDepNum[i].goodsId,
										remark: newDepNum[i].remark,
										beginTime: newDepNum[i].beginTime,
										pledgePrice: newDepNum[i].pledgePrice,
										id: newDepNum[i].pledgeId,
										actionType: newDepNum[i].actionType,
										newStatus: newDepNum[i].status
									})
									//	console.log()								}

								}

							}
							setTimeout(() => {
								for(let i = 0; i < this.depositform.items.length; i++) {
									if(this.$refs.depositPic[i]) {
										this.$refs.depositPic[i].fileList = this.depositform.items[i].depositPicList
									}

								}
							}, 100)
						}

						if(extend && extend.initStorageBottles) {
							let newyzOccupiedNum = JSON.parse(extend.initStorageBottles);
							if(newyzOccupiedNum.length) {
								this.occyzindex = newyzOccupiedNum.length;
								this.yzNumList = [];
								newyzOccupiedNum.forEach((item, index) => {
									this.yzNumList.push({
										yzoccindex: index + 1,
										status: 1,
										occSpec: +item.goodsId,
										occNum: item.number,
									})
								})
							}
						}
						if(extend && extend.occupiedNumber) {
							let newyzOccupiedNum = JSON.parse(extend.occupiedNumber);
							if(newyzOccupiedNum.length) {
								this.occyzindex1 = newyzOccupiedNum.length;
								this.yzNumList1 = [];
								newyzOccupiedNum.forEach((item, index) => {
									this.yzNumList1.push({
										yzoccindex: index + 1,
										status: 1,
										occSpec: +item.goodsId,
										occNum: item.number < 0 ? 0 : item.number,
									})
								})
							}
						}

						if(extend && extend.initPledgeBottles) {
							let newyzOccupiedNum = JSON.parse(extend.initPledgeBottles);
							if(newyzOccupiedNum.length) {
								this.pledgeindex = newyzOccupiedNum.length;
								this.pledgeList = [];
								newyzOccupiedNum.forEach((item, index) => {
									this.pledgeList.push({
										pledgeindex: index + 1,
										status: 1,
										occSpec: +item.goodsId,
										occNum: item.number,
									})
								})
							}
						}
						if(extend && extend.pledgeBottles) {
							this.newPledgeBottles = extend.pledgeBottles;
							let newyzOccupiedNum = JSON.parse(extend.pledgeBottles);
							if(newyzOccupiedNum.length) {
								this.pledgeindex1 = newyzOccupiedNum.length;
								this.pledgeList1 = [];
								newyzOccupiedNum.forEach((item, index) => {
									this.pledgeList1.push({
										pledgeindex: index + 1,
										status: 1,
										occSpec: +item.goodsId,
										occNum: item.number,
									})
								})
							}
						}
						//
						//						if(extend && extend.storageBottleDetails) {
						//							let bottleDetail = JSON.parse(extend.storageBottleDetails)
						//							for(let item of bottleDetail) {
						//								this.saveBottle.push(item.tag);
						//							}
						//							this.saveBottleNum = this.saveBottle.length;
						//						}
						if(extend && extend.orderCountBottles) {
							//							this.saveBottleNum = extend.orderCountBottles.orderCountBottleList.length;
							this.saveBottleNum = extend.orderCountBottles.count;
						} else {
							this.saveBottleNum = 0;
						}
						//用气量核定
						let newTark = res.user.taskList;
						if(newTark.length) {
							this.yqindex = newTark.length;
							this.gasDefineform.items = [];
							for(let i = 0; i < newTark.length; i++) {
								this.gasDefineform.items.push({
									yqindex: i + 1,
									status: 1,
									size: +newTark[i].spec,
									sqcount: newTark[i].numUnit,
									sycount: newTark[i].dailyNum ? parseInt(newTark[i].numUnit / newTark[i].dailyNum) : 0

								})
							}
						}

						if(extend) {
							//用气卡信息
							if(extend.cardStatus) {
								this.typeForm4.switch = extend.cardStatus; //用气卡发放状态
							} else {
								this.typeForm4.switch = 0;
							}
							let defaultGas = JSON.parse(extend.defaultOrderingGas);
							if(defaultGas) {
								this.typeForm4.bookProduct = +defaultGas.goodsId;
								this.typeForm4.bookNumber = defaultGas.number;
							}
							//燃气安全责任人信息
							let newSafetyPerson = JSON.parse(extend.safetyPerson);
							if(newSafetyPerson) {
								this.typeForm5.securityName = newSafetyPerson.name;
								this.typeForm5.securityPhone = newSafetyPerson.phone;
								this.typeForm5.securityIDNumber = newSafetyPerson.idCard;
							}

							//燃气接收人信息
							let newReceiverInfo = extend.receiverList;

							if(newReceiverInfo) {
								this.jsrform.items = [];
								this.jsrindex = newReceiverInfo.length;
								for(let i = 0; i < newReceiverInfo.length; i++) {
									this.jsrform.items.push({
										contactNumber: newReceiverInfo[i].receiverPhone,
										jsrname: newReceiverInfo[i].receiverName,
										IDNumber: newReceiverInfo[i].idCard,
										jsrindex: i + 1,
										status: 1,
										id: newReceiverInfo[i].id,
										//										address:newReceiverInfo[i].address,
										//										createTime:newReceiverInfo[i].createTime,
										//										creater:newReceiverInfo[i].creater,
										//										id:newReceiverInfo[i].id,
										//										userId:newReceiverInfo[i].userId,
										//										updateTime:newReceiverInfo[i].updateTime,
									})
								}
							}
							//燃气销售信息
							this.salesmanId = extend.userSalesperson;
							this.newSalesmanId = extend.userSalesperson;
						}

						this.typeForm4.cardNumber = res.user.cardCode; //用气卡号
						this.newCardCode = res.user.cardCode;

						this.payWay = res.user.countType + '';
						this.newPayWay = res.user.countType + '';

						if(extend && extend.facilitiesInfo) {
							//燃气设备信息 附属设备信息
							let facInfo = JSON.parse(extend.facilitiesInfo);
							let newGasDevice = facInfo.gasDevice;
							let newGasAuxDevice = facInfo.gasAuxDevice;

							if(newGasDevice.length) {
								this.sbindex = newGasDevice.length;
								this.gasAppliance.items = [];
								for(let i = 0; i < newGasDevice.length; i++) {
									let newPic = [];
									if(newGasDevice[i].pic.length) {
										newGasDevice[i].pic.map((item) => {
											newPic.push({
												url: item,
												showProgress: false,
												status: "finished",
												percentage: 100
											})

										})
									}

									this.gasAppliance.items.push({
										value: newGasDevice[i].gasDeviceSpec,
										gasAppliancekind: newGasDevice[i].gasDeviceType,
										status: 1,
										otherKind: newGasDevice[i].content,
										gasAppName: newGasDevice[i].gasDeviceType == '0' ? newGasDevice[i].content : '',
										kind: newGasDevice[i].gasDeviceType == '0' ? true : false,
										sbindex: i + 1,
										count: newGasDevice[i].number,
										gasAppPicList: newPic
									})
								}
							}

							setTimeout(() => {
								for(let i = 0; i < this.gasAppliance.items.length; i++) {
									this.$refs.gasAppPic[i].fileList = this.gasAppliance.items[i].gasAppPicList
								}

							}, 100)

							if(newGasAuxDevice.length) {
								this.sbfsindex = newGasAuxDevice.length;
								this.gasOtherAppliance.items = [];
								for(let i = 0; i < newGasAuxDevice.length; i++) {
									let newPic1 = [];

									if(newGasAuxDevice[i].pic.length) {
										newGasAuxDevice[i].pic.map((item) => {
											//										console.log(item)
											newPic1.push({
												url: item,
												showProgress: false,
												status: "finished",
												percentage: 100
											})
										})
									}

									this.gasOtherAppliance.items.push({
										value: newGasAuxDevice[i].gasAuxDeviceSpec,
										sbfsindex: i + 1,
										status: 1,
										count: newGasAuxDevice[i].number,
										gasOtherAppliancekind: newGasAuxDevice[i].gasAuxDeviceType,
										otherfsKind: newGasAuxDevice[i].content,
										gasOtherAppName: newGasAuxDevice[i].gasAuxDeviceType == '0' ? newGasAuxDevice[i].content : '',
										fsKind: newGasAuxDevice[i].gasAuxDeviceType == '0' ? true : false,
										gasSubAppPicList: newPic1
									})

								}
							}
							setTimeout(() => {
								for(let i = 0; i < this.gasOtherAppliance.items.length; i++) {
									this.$refs.gasSubAppPic[i].fileList = this.gasOtherAppliance.items[i].gasSubAppPicList
								}

							}, 100)

						}

						this.getCardCode(this.typeForm.organize);
						this.getStaffName(this.typeForm.organize);
						this.getQueryAcType(this.typeForm.organize);
						this.getQueryGasDevice(this.typeForm.organize, 1, 'gasSlist') //查询燃气设备值
						this.getQueryGasDevice(this.typeForm.organize, 2, 'gasSlist1') //查询燃气附属设备
						//						this.getSize(this.typeForm.organize); //用气规格
						this.userAddMax = res.user.userAddMax;
						this.isAddMax = res.user.isAddMax;
					}
				})
			},
			//选中组织下拉框
			organizeSelected(value) {
				if(value.length) {
					let id = value[value.length - 1];
					this.typeForm.organize = id;
					if(id != this.newDepId) {
						this.typeForm.gasType = ''; //用气类型
						this.typeForm1.accountHolder = ''; //开户人
						this.typeForm4.cardNumber = ''; //用气卡号
						this.salesmanId = ''; //销售人
						this.payWay = ''; //结算方式
					} else {
						this.typeForm.gasType = this.newGasType; //用气类型
						this.typeForm1.accountHolder = this.newOpener; //开户人
						this.typeForm4.cardNumber = this.newCardCode; //用气卡号
						this.salesmanId = this.newSalesmanId; //销售人
						this.payWay = this.newPayWay; //结算方式

					}
					//					this.getGasType(id);
					this.getStaffName(id);
					this.getCardCode(id);
					this.getStaffName(id);
					this.getQueryAcType(id);
					this.getQueryGasDevice(id, 1, 'gasSlist') //查询燃气设备值
					this.getQueryGasDevice(id, 2, 'gasSlist1') //查询燃气附属设备
					//					this.getSize(id);
				}
			},

			//改变用气类型
			selectType(v) {
				if(v) {
					// this.newSizeList=[];

					if(v.tag.detailType == 1) {
						this.isResident = true;
						this.typeForm.gasSubType = null;
						this.typeForm.businessName = null;
						this.hasCert = null;
					} else {
						this.isResident = false;
						this.typeForm.clientRemark = [];
						this.otherRemark = null;
					}
					if(v.tag.allowedGoods && JSON.parse(v.tag.allowedGoods).length) {
						this.saleform.items = [];
						// this.occupyNumList=[];
						this.goodsSizeList = [];
						let allows = JSON.parse(v.tag.allowedGoods);
						this.newAllows = allows;

						this.newSizeList1.forEach(item => {
							allows.forEach((allowItem, index) => {
								if(item.goodsId == allowItem.goodsId) {

									this.goodsSizeList.push(item);
									if(this.allowsArray.indexOf(item.goodsId) != -1) {
										this.saleform.items.push({
											saleindex: index + 1,
											status: 1,
											ssize: item.goodsId,
											goodsName: item.goodsName
										})
									}
									this.occupyNumList.forEach(items => {
										if(items.occSpec == allowItem.goodsId) {
											items.maxNum = allowItem.number;
										} else {
											items.maxNum = 100;
										}
									})

									// this.occupyNumList.push({
									// 	occindex:index+1,
									// 	status: 1,
									// 	occSpec:allowItem.goodsId,
									// 	occNum:allowItem.number,

									//            maxNum:allowItem.number
									// })

								}

							})
							// this.occupyArray.forEach((items,newIndex)=>{
							//     if(items.goodsId==item.goodsId){
							//         this.occupyNumList.push({
							//         										occindex:newIndex+1,
							//         										status: 1,
							//         										occSpec:items.goodsId,
							//         										occNum:items.number,
							//                             maxNum:100
							//         									})
							//     }
							// })

						})
						this.occupyNumList.forEach(item => {
							allows.forEach(items => {
								if(item.occSpec == items.goodsId) {

									item.maxNum = items.number;
									// item.occNum=item.occNum<items.number?item.occNum:items.number;
								}
							})

						})
						if(this.saleform.items && this.saleform.items.length) {
							this.saleindex = this.saleform.items.length;
						} else {
							this.saleindex = 1;
							this.saleform.items = [{
								saleindex: 1,
								status: 1,
								ssize: '',
								goodsName: ''
							}]
						}

						// this.occindex=this.occupyNumList.length;

					} else {

						this.saleindex = 1;
						this.occindex = 1;
						this.saleform.items = [{
							saleindex: 1,
							status: 1,
							ssize: '',
							goodsName: ''
						}]
						this.occupyNumList = [{
							occindex: 1,
							status: 1,
							occSpec: '',
							occNum: 0,

						}]

					}

				} else {
					this.isResident = false;
				}
			},
			getSubType1() { //用气子类型（商业、小微商业）接口
				_http.http1('post', pathUrls.subType, {
					'userType': 0
				}, 'form').then((res) => {
					this.subType1List = res.data;
				})
			},
			//改变用气子类型
			selectChildType(v) {
				this.gasChildTypeName = v.label
			},
			getAreaInfo(cCode, areaLis) { //用气地址接口
				_http.http1('post', pathUrls.cityInfo, {
					'parentCode': cCode
				}, 'form').then((res) => {

					this[areaLis] = res.data;
				})
			},
			//改变省
			selectProvince(v) {
				//				if(v) {
				//					this.baseProvince = v.label
				//				}
				this.getAreaInfo(this.typeForm.province, "cityList");
				this.typeForm.city = '';
				this.typeForm.area = '';
				this.typeForm.street = '';
				this.typeForm.detailAddress = '';
			},
			//改变市
			selectCity(v) {
				//				if(v) {
				//					this.baseCity = v.label
				//				}

				this.getAreaInfo(this.typeForm.city, 'areaList');
				this.typeForm.area = '';
				this.typeForm.street = '';
				this.typeForm.detailAddress = '';
			},
			//改变区
			selectArea(v) {
				//				if(v) {
				//					this.baseArea = v.label
				//				}

				this.getAreaInfo(this.typeForm.area, 'streetList');
				this.typeForm.street = '';
				this.typeForm.detailAddress = '';
			},
			//改变街道
			selectStreet(v) {
				//				if(v) {
				//					this.baseStreet = v.label
				//				}
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
				if(v.indexOf('其他') != -1) {
					this.detail = true;
				} else {
					this.detail = false;
				}
			},
			//企业员工姓名接口
			getStaffName(c) {
				_http.http1('post', pathUrls.deptStaff, {
					'deptId': c
				}, 'form').then((res) => {
					this.staffNameList = res.data;
				})
			},
			//开户合同图片上传成功钩子
			handleSuccess(res, file) {
				//				console.log(this.uploadList);
				file.url = res.data.src;
				file.name = res.data.name;
			},
			//开户合同图片放大
			handleViewpic(url) {
				this.imgUrl = url;
				this.visible2 = true;
			},
			//删去开户合同图片
			handleRemovepic(file) {
				const fileList = this.$refs.upload.fileList;
				this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
			},
			//上传开户合同图片数量为1
			handleBeforeUpload() {
				const check = this.uploadList.length < 1;
				if(!check) {
					this.$Notice.warning({
						title: '只能上传一张图片.'
					});
				}
				return check;
			},
			//门头图片上传成功钩子
			handleSuccessstore(res, file) {
				file.url = res.data.src;
				file.name = res.data.name;
				//				console.log(this.$refs.storePic.fileList)
			},
			//门头照片放大
			handleViewstore(url) {
				this.imgUrl = url;
				this.visible3 = true;
			},
			//删去门头图片
			handleRemovestore(file) {
				const fileList = this.$refs.storePic.fileList;
				this.$refs.storePic.fileList.splice(fileList.indexOf(file), 1);
			},
			//上传门头图片数量为1
			handleBeforeUploadstore() {
				const check = this.storePicList.length < 1;
				if(!check) {
					this.$Notice.warning({
						title: '只能上传一张图片.'
					});
				}
				return check;
			},
			//删除表单项
			handleRemove(khindex) {
				this.depositform.items[khindex].status = 0;
				this.depositform.items.splice(khindex, 1)
				this.khindex--;
			},
			//增加表单项
			handleAdd() {
				this.khindex++;
				this.depositform.items.push({
					value1: '',
					khindex: this.khindex,
					status: 1,
					depositPicList: [],
					occSpec: this.goodsSizeList.length ? this.goodsSizeList[0].goodsId : '',
					pledgePrice: '',
					beginTime: '',
					remark: ''
				});
				//				}

			},
			//押瓶表单上传成功钩子
			handleSuccessForm(res, file, fileList) {
				this.depositform.items[this.depIndex].depositPicList = fileList;
				file.url = res.data.src;
				file.name = res.data.name;

			},
			//押瓶表单图片放大
			handleViewPicform(url) {

				this.visible4 = true;
				this.imgUrl = url;
			},
			//删去押瓶表单图片
			handleRemovePicform(file, index) {
				const fileList = this.depositform.items[index].depositPicList;
				fileList.splice(fileList.indexOf(file), 1);

			},
			//添加用气量核定单
			handleAdd5() {
				if(this.yqindex < this.newSizeList.length) {
					this.yqindex++;
					this.gasDefineform.items.push({
						yqindex: this.yqindex,
						status: 1,
						sqcount: 0,
						sycount: 0,
						//					maxcount: 0,
						size: '',

					});
				} else {
					this.$Message['warning']({
						background: true,
						content: `用气量核定单最多为${this.newSizeList.length}`,

					});
					return false
				}
			},
			//用气量核定单删除
			handleRemove5(yqindex) {
				this.gasDefineform.items[yqindex].status = 0;
				this.gasDefineform.items.splice(yqindex, 1)
				this.yqindex--;
			},
			//获取用气卡号
			getCardCode(Id) {
				_http.http1('post', pathUrls.cardCode, {
					'deptId': Id
				}, 'form').then((res) => {
					// console.log(res);

					this.cardCodeList = res.data;
					if(this.newCardCode && Id == this.newDepId) {
						this.cardCodeList.push({
							'cardCode': this.newCardCode,
							'cardId': ''
						})
					}
				})
			},
			//用气规格查询
			getSize(Id) {
				_http.http1('post', pathUrls.bottleSize, {
					'deptId': Id
				}, 'form').then((res) => {
					this.sizeList = res.data;
					this.newSize = res.data;
					this.newSize1 = res.data;
				})
			},
			//移除燃气接收人
			handleRemove6(jsrindex) {
				this.jsrform.items[jsrindex].status = 0;
				this.jsrform.items.splice(jsrindex, 1)
				this.jsrindex--;
			},
			//添加燃气接收人
			handleAdd6() {
				if(this.jsrindex < 5) {
					this.jsrindex++;
					this.jsrform.items.push({
						value: '',
						jsrindex: this.jsrindex,
						status: 1,
						jsrname: '',
						contactNumber: '',
						IDNumber: ''
					});
				} else {
					this.$Message['warning']({
						background: true,
						content: '接收人数量不能超过5个',

					});
					return false
				}

			},
			//企业员工姓名接口
			getStaffName(c) {
				_http.http1('post', pathUrls.deptStaff, {
					'deptId': c
				}, 'form').then((res) => {

					this.staffNameList = res.data;
				})
			},
			//查询结算类型
			getQueryAcType(c) {
				_http.http1('post', pathUrls.userQueryAcType, {
					'deptId': c
				}, 'form').then((res) => {

					this.acTypeList = res.data;
				})
			},
			//燃气销售删除结算单
			handleRemove2(saleindex) {
				this.saleform.items[saleindex].status = 0;
				let newSsize = this.saleform.items[saleindex].ssize;

				// this.occupyNumList.forEach((item,index)=>{
				// 	if(item.occSpec==newSsize||!item.occSpec){
				// 		this.occupyNumList.splice(index,1)
				// 	}
				// })
				// this.pledgeList.forEach((item,index)=>{
				// 	if(item.occSpec==newSsize||!item.occSpec){
				// 		this.pledgeList.splice(index,1)
				// 	}
				// })
				//     this.yzNumList.forEach((item,index)=>{
				//     	if(item.occSpec==newSsize||!item.occSpec){
				//     		this.yzNumList.splice(index,1)
				//     	}
				//     })
				// this.gasDefineform.items.forEach((item,index)=>{
				// 	if(item.size==newSsize||!item.size){
				// 	this.gasDefineform.items.splice(index,1)
				// 	}
				// })
				this.saleform.items.splice(saleindex, 1)
				this.saleindex--;
			},
			//燃气销售添加结算单
			handleAdd2() {
				if(this.saleindex < this.goodsSizeList.length) {
					this.saleindex++;

					let newForms = [];
					newForms = this.newAllows.filter(item => !this.saleform.items.some(ele => ele.ssize === item.goodsId))
					this.saleform.items.push({
						saleindex: this.saleindex,
						status: 1,
						ssize: newForms.length ? newForms[0].goodsId : ''
					});
				} else {
					this.$Message['warning']({
						background: true,
						content: `钢瓶数量最多为${this.goodsSizeList.length}`,

					});
					return false
				}

			},
			//燃气设备信息移除
			handleRemove3(sbindex) {
				this.gasAppliance.items[sbindex].status = 0;
				this.gasAppliance.items.splice(sbindex, 1)
				this.sbindex--;
			},
			//燃气设备信息添加
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
					otherKind: '',

				});
			},
			//燃气设备图片上传成功钩子
			handleSuccessGas(res, file, fileList) {
				this.gasAppliance.items[this.gasIndex].gasAppPicList = fileList;
				//				for(let i = 0; i < this.gasAppliance.items.length; i++) {
				//					this.gasAppliance.items[i].gasAppPicList = this.$refs.gasAppPic[i].fileList;
				//				}
				file.url = res.data.src;
				file.name = res.data.name;
			},
			//删去燃气设备图片
			handleRemoveGas(file, sbindex) {

				const fileList = this.gasAppliance.items[sbindex].gasAppPicList;
				fileList.splice(fileList.indexOf(file), 1);

			},
			handleViewGas(url) { //燃气设备图片放大
				this.imgUrl = url;
				this.visible6 = true;
			},

			//查询燃气设备
			getQueryGasDevice(c, queryType, Lis) {
				_http.http1('post', pathUrls.userQueryGasDevice, {
					'deptId': c,
					'queryType': queryType
				}, 'form').then((res) => {

					this[Lis] = res.data;
				})
			},
			//燃气设备种类改变
			qtsb(index) {

				//				for(let item of this.gasAppliance.items) {
				//					if(item.gasAppliancekind == '0') {
				//						item.kind = true;
				//						item.gasAppName = item.otherKind;
				//					} else {
				//						item.kind = false;
				//						item.gasAppName = '';
				//					}
				//
				//				}
				let newItem = this.gasAppliance.items[index];
				if(newItem.gasAppliancekind) {
					newItem.count = 1;
				} else {
					newItem.count = 0;
				}
				if(newItem.gasAppliancekind == '0') {
					newItem.kind = true;
					newItem.gasAppName = newItem.otherKind;
				} else {
					newItem.kind = false;
					newItem.gasAppName = '';
				}
			},
			//燃气附属设备
			qtfssb(index) {
				//				for(let item of this.gasOtherAppliance.items) {
				//					if(item.gasOtherAppliancekind == '0') {
				//						item.fsKind = true;
				//						item.gasOtherAppName = item.otherfsKind;
				//					} else {
				//						item.fsKind = false;
				//						item.gasOtherAppName = '';
				//					}
				//
				//				}

				let newItem = this.gasOtherAppliance.items[index];
				if(newItem.gasOtherAppliancekind) {
					newItem.count = 1;
				} else {
					newItem.count = 0;
				}
				if(newItem.gasOtherAppliancekind == '0') {
					newItem.fsKind = true;
					newItem.gasOtherAppName = newItem.otherfsKind;
				} else {
					newItem.fsKind = false;
					newItem.gasOtherAppName = '';
				}
			},
			//r燃气附属设备删除
			handleRemove4(sbfsindex) {
				this.gasOtherAppliance.items[sbfsindex].status = 0;
				this.gasOtherAppliance.items.splice(sbfsindex, 1)
				this.sbfsindex--;
			},
			//r燃气附属设备添加
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
					fsKind: false,
					otherfsKind: ''

				});
			},
			//燃气附属设备图片放大
			handleViewGasSub(url) {
				this.imgUrl = url;
				this.visible7 = true;
			},
			//删去燃气附属设备图片
			handleRemoveGasSub(file, sbfsindex) {
				const fileList = this.gasOtherAppliance.items[sbfsindex].gasSubAppPicList;
				fileList.splice(fileList.indexOf(file), 1);
			},

			handleSuccessGasSub(res, file, fileList) { //燃气附属设备图片上传成功钩子
				//				console.log(fileList)
				this.gasOtherAppliance.items[this.subIndex].gasSubAppPicList = fileList;
				//				for(let i = 0; i < this.gasOtherAppliance.items.length; i++) {
				//					this.gasOtherAppliance.items[i].gasSubAppPicList = this.$refs.gasSubAppPic[i].fileList;
				//				}

				file.url = res.data.src;
				file.name = res.data.name;
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
			// 判断是否为手机号
			isPoneAvailable(pone) {
				var myreg = /^((0\d{2,3}-?\d{7,8})|(1[123456789]\d{9}))$/;
				if(!myreg.test(pone)) {
					return false;
				} else {
					return true;
				}
			},

		},
		created() {
			this.getGoodsList().then((lia) => {
				this.newSizeList1 = lia.data;
				this.newSizeList = lia.data;
			})
		},
		mounted() {
			this.userGetUserInfo();
			this.common.getDeptList(this.userData.deptId).then((res) => {
				this.options = this.common.getConDept(res.data, 0, 0, 1)
			})
			this.getAreaInfo(0, 'provinceList'); //获得用气地址的省市区街道
			this.uploadList = this.$refs.upload.fileList;
			this.storePicList = this.$refs.storePic.fileList;
			this.licensePicList = this.$refs.licensePic.fileList;

		}
	}
</script>

<style type="text/css" scoped>
	.mainBorder>>>.el-cascader {
		width: 100%;
	}
	
	.sameType {
		margin-left: 30px;
	}
	
	.typeForm3>>>.ivu-form-item {
		margin: 0 10px 0 0;
	}
	
	.typeForm>>>.ivu-form-item,
	.typeForm1>>>.ivu-form-item,
	.typeForm7>>>.ivu-form-item {
		width: 48%;
	}
	
	.sameFitem {
		width: 32% !important;
	}
	
	.sameType>>>.ivu-form-item {
		margin-bottom: 9px;
	}
	
	.difFitem {
		display: block;
		width: 32%;
	}
	
	.difFitem>>>.ivu-form-item-content {
		margin-left: 120px !important;
	}
	
	.typeForm1>>>.ivu-input-number {
		width: 100% !important;
	}
	
	.typeForm1>>>.ivu-date-picker {
		width: 100% !important;
	}
	
	.typeForm3>>>.ivu-form-item-content {
		margin-left: 120px !important;
	}
	
	.typeForm6>>>.ivu-form-item {
		width: 28%;
	}
	
	.removeFitem>>>.ivu-form-item-content {
		margin-left: 10px !important;
	}
	
	.divFitem {
		width: 32%;
		display: inline-block;
	}
	
	.divFitem>>>.ivu-form-item {
		width: 100%;
	}
	
	.star>>>.ivu-form-item-label:after {
		content: "*";
		color: #f00;
		padding-right: 2px;
	}
	
	.titleContent {
		color: #000;
		margin-left: 20px;
	}
	
	.demo-upload-list {
		display: inline-block;
		width: 50px;
		height: 50px;
		text-align: center;
		line-height: 50px;
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
	
	.btnWrapper {
		padding: 10px;
		text-align: center;
		width: 170px;
		/*height: 40px;*/
		position: fixed;
		right: 150px;
		bottom: 100px;
		z-index: 1000;
		/*box-shadow: 0 2px 16px 0 #40a9ff75;*/
		background: #fff;
		border-radius: 4px;
		box-shadow: 0 2px 16px 0 #67c23a5c;
	}
	
	.mainBorder>>>.ivu-icon-ios-camera {
		color: #51B5EA;
	}
	
	.mainBorder>>>.el-input.is-disabled,
	.mainBorder>>>.el-input__inner,
	.mainBorder>>>.ivu-select-disabled,
	.mainBorder>>>.ivu-select-selection {
		/*background-color: #fff;*/
		color: #515a6e;
	}
	
	.mainBorder>>>.ivu-input[disabled],
	.mainBorder>>>fieldset[disabled] .ivu-input {
		/*background-color: #fff;*/
		color: #515a6e;
	}
	
	.mainBorder>>>.ivu-input-number-disabled,
	.mainBorder>>>.ivu-input-number-input {
		/*background-color: #fff;*/
		color: #515a6e;
	}
</style>