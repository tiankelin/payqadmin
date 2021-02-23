<template>
	<div class='mainBorder userInfoMain'>
		<div class='mainHeader'>
			<span>详情</span>
			<Icon type="md-close" class='closeIcon' @click='handleBackClick' />
		</div>

		<div class="mainBody">
			<section ref="print">
				<div class='titleContent'>基本信息</div>
				<Form ref="typeForm" :model="typeForm" :label-width="120" class='typeForm sameType' inline>
					<FormItem label="所属组织" class='organize star'>
						<el-cascader disabled :show-all-levels="false" :options="options" :props="{ checkStrictly: true }" v-model="typeForm.organize"></el-cascader>
					</FormItem>
					<FormItem label="客户类型" class='star'>
						<Select v-model="typeForm.gasType" disabled>
							<Option v-for="item in gasTypeList" :value="item.id" :key="item.id" :tag='item.detailType'>{{ item.typeName }}</Option>
						</Select>
					</FormItem>
					<FormItem label="用气子类型" v-if='!isResident' class='star'>
						<Select v-model="typeForm.gasSubType" disabled>
							<Option v-for="item in subType1List" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
						</Select>
					</FormItem>
					<FormItem label="客户名称" class='star'>
						<Input v-model="userNames" disabled></Input>
					</FormItem>
					<FormItem label="有证无证" v-if='!isResident'>
						<Select v-model="hasCert" clearable>
							<Option :value='0'>无证</Option>
							<Option :value='1'>有证</Option>
						</Select>
					</FormItem>
					<FormItem label="联系人" class='star'>
						<Input v-model="typeForm.clientName" disabled></Input>
					</FormItem>
					<FormItem label="身份证号码" class='star' v-if='typeForm.idNum'>
						<Input v-model="typeForm.idNum" disabled></Input>
					</FormItem>
					<FormItem label="身份证号码" class='star unReal' v-else>
						<Input value='未实名认证' disabled/>
					</FormItem>
					<FormItem label="证件地址">
						<Input v-model="typeForm.userCertAddress" disabled></Input>
					</FormItem>
					<FormItem label="联系方式" class='star'>
						<Input v-model="typeForm.telephoneNumber" disabled></Input>
					</FormItem>
					<FormItem label="详细地址" class='star' style='display: block;width: 100%;'>
						<div style="display: flex;width: 96.5%;">
							<Select v-model="typeForm.province" disabled style='width: 14%;margin-right: 1%;'>
								<Option v-for="item in provinceList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
							</Select>
							<Select v-model="typeForm.city" disabled style='width: 14%;margin-right: 1%;'>
								<Option v-for="item in cityList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
							</Select>
							<Select v-model="typeForm.area" disabled style='width: 14%;margin-right: 1%;'>
								<Option v-for="item in areaList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
							</Select>

							<Select v-model="typeForm.street" disabled style='width: 14%;margin-right: 1%;'>
								<Option v-for="item in streetList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
							</Select>
							<Input v-model="typeForm.detailAddress" disabled style='width: 40%;'></Input>
						</div>

					</FormItem>
					<!-- 		<FormItem label="所属市" class='star'>
					<Select v-model="typeForm.city"  disabled>
						<Option v-for="item in cityList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
					</Select>

				</FormItem>
				<FormItem label="所属区县" class='star'>
					<Select v-model="typeForm.area"  disabled>
						<Option v-for="item in areaList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="所属街道" class='star'>
					<Select v-model="typeForm.street"  disabled>
						<Option v-for="item in streetList" :value="item.areaCode" :key="item.areaCode">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="详细地址" class='star'>
					<Input v-model="typeForm.detailAddress"  disabled></Input>
				</FormItem> -->
					<FormItem label="客户备注" v-if='isResident'>
						<CheckboxGroup v-model="typeForm.clientRemark" style="text-align: left;">
							<Checkbox label="特困户"></Checkbox>
							<Checkbox label="残障低保户"></Checkbox>
							<Checkbox label="老年人(70岁以上)"></Checkbox><br />
							<Checkbox label="其他"></Checkbox>
						</CheckboxGroup>
						<div v-show="detail">
							<Input v-model="otherRemark"></Input>
						</div>
					</FormItem>
				</Form>
				<div class='titleContent'>
					燃气销售信息
					<Button v-has='1025' type="info" @click="handleOrderHistory()" style='margin-left: 42px;margin-bottom: 4px;width:200px;height: 30px;'>历史购气</Button>
				</div>
				<Form ref="typeForm7" :label-width="120" class='typeForm7 sameType' inline>
					<FormItem label="销售员姓名" style='width:32%;position: relative;'>
						<Select v-model="salesmanId" disabled>
							<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
						</Select>

					</FormItem>
					</br>
					<div v-for="(item, saleindex) in saleform.items" v-if="item.status" :key="saleindex">
						<FormItem label="允许使用钢瓶" style='width: 32%;' :class="[saleindex==0?'star':'']">
							<Select v-model="item.ssize" disabled>
								<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName}}</Option>
							</Select>
						</FormItem>
					</div>
				</Form>
				<div class='titleContent'>用气量核定</div>
				<Form class='typeForm2 sameType' inline>
					<FormItem style='width: 100%;' v-for="(item, yqindex) in gasDefineform.items" v-if="item.status" :key="yqindex" :prop="'items.' + yqindex + '.value'" :rules="{required: false, message: 'Item ' + item.yqindex +' can not be empty', trigger: 'blur'}">
						<Form :label-width="120" class='typeForm3'>
							<FormItem label="用气规格" style='width: 32%;'>
								<Select v-model="item.size" disabled>
									<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
								</Select>
							</FormItem>
							<FormItem label="每次起送量" style='width: 32%;'>
								<InputNumber :min='0' :max='10' v-model="item.sqcount" style='width: 100%;' disabled />
							</FormItem>
							<FormItem label="使用周期" style='width: 31%;'>
								<InputNumber :min='0' :max='365' v-model="item.sycount" style='width: 100%;' disabled />
							</FormItem>
						</Form>
					</FormItem>
				</Form>
				<div class='titleContent'>用气卡信息</div>
				<Form ref="typeForm4" :model="typeForm4" :label-width="120" class='typeForm4 sameType' inline>
					<FormItem label="用气卡发放状态" class='difFitem'>
						<!-- <i-switch v-model="typeForm4.switch" size="large" :true-value='1' :false-value='0' disabled>
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch> -->
						<span>{{typeForm4.switch==1?'开启':'关闭'}}</span>
					</FormItem>
					<div v-if='typeForm4.switch'>
						<FormItem label="用气卡号" style='width: 32%;' class='star'>
							<Select v-model="typeForm4.cardNumber" style="" filterable disabled placeholder=''>
								<Option v-for="item in cardCodeList" :value="item.cardCode" :key="item.cardCode">{{ item.cardCode }}</Option>
							</Select>
						</FormItem>
						<FormItem label="默认订购钢瓶" style='width: 32%;' class='star'>
							<Select v-model="typeForm4.bookProduct" disabled placeholder=''>
								<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
							</Select>
						</FormItem>
						<FormItem label="默认订购数量" style='width: 31%;' class='star'>
							<InputNumber :min='0' :max='100000' v-model="typeForm4.bookNumber" style="text-align: center;width: 100%;" disabled />
						</FormItem>

					</div>
				</Form>
				<div class='titleContent'>开户详情</div>
				<Form ref="typeForm1" :model="typeForm1" :label-width="120" class='typeForm1 sameType' inline>
					<FormItem label="开户人" class='star '>
						<Select v-model="typeForm1.accountHolder" disabled>
							<Option v-for="item in staffNameList" :value="item.staffId" :key="item.staffId">{{ item.staffName }}</Option>
						</Select>
					</FormItem>
					<FormItem label="开户合同编号" class=' '>
						<Input v-model="typeForm1.contractNumber" disabled></Input>
					</FormItem>

					<!--<FormItem label="计算存瓶数量" class=' '>
					<Input v-model="saveBottleNum" disabled></Input>
				</FormItem>-->
					<FormItem label="用户签名" style='margin-bottom: 0;' v-if='userSign'>
						<img :src="userSign" alt="" style="width: 48px;height: 48px;cursor: pointer;display: inline-block;" @click='viewPic(userSign)' />
						<Modal title="用户签名图片" v-model="visible1" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>
							<div style="position: absolute;right:60px;top:10px;cursor: pointer;">
								<Icon type="md-sync" size='30' @click='handleRotate' />
							</div>
							<img :src="userSign" v-if="visible1" ref='imgModal' class="imgModal">
						</Modal>
					</FormItem>
					<!--<FormItem v-else></FormItem>-->
					<!--<FormItem label="本月配送钢瓶数" class='monthBottleClass' style='display: block;' v-if='monthBottleCount.length'>
					<div style="display: flex;">
						<div style="min-width: 100px;margin-right: 5px;" v-for='(item,index) in monthBottleCount' :key='index'>
							<div><span>规格：</span><span>{{item.spec}}</span></div>
							<div><span>数量：</span><span>{{item.monthCount}}</span></div>
						</div>

					</div>

				</FormItem>-->
					<FormItem label="开户合同">
						<a v-if='contractUrl' :href="contractUrl" style="font-size: 24px;color:#f90;" target="_blank">
							<Button style='' size='small' type='info'>电子合同</Button>
						</a>
						<div style="display: inline-block;">
							<a v-if='historyContractUrlArr.length' :href="item" v-for='(item,index) in historyContractUrlArr' style="font-size: 24px;color:#f90;margin: 0 5px;" target="_blank">
								<Button size='small'>历史合同{{index+1}}</Button>
							</a>
						</div>
					</FormItem>
					<FormItem label="开户合同图片" class="picShow">
						<div class="demo-upload-list" v-for="item in uploadList" :key="item.index">
							<template v-if="item.status === 'finished'">
								<img :src="item.url">
								<div class="demo-upload-list-cover">
									<Icon type="ios-eye-outline" @click.native="handleViewpic(item.url)"></Icon>

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
						<Modal title="开户合同图片" v-model="visible2" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>
							<div class="rotateModal" @click='handleRotate' title='旋转'>
							
							</div>
							<img :src="imgUrl" v-if="visible2" ref='imgModal' class="imgModal">

						</Modal>

					</FormItem>

					<FormItem label="门头图片" class="picShow">
						<div class="demo-upload-list" v-for="item in storePicList" :key="item.index">
							<template v-if="item.status === 'finished'">
								<img :src="item.url">
								<div class="demo-upload-list-cover">
									<Icon type="ios-eye-outline" @click.native="handleViewstore(item.url)"></Icon>

								</div>
							</template>
							<template v-else>
								<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
							</template>
						</div>
						<Upload v-show='storePicList.length<0' ref="storePic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessstore" :format="['jpg','jpeg','png']" :max-size="2048" :before-upload="handleBeforeUploadstore" type="drag" :action="fileUrl" style="display: inline-block;width:48px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
							<div style="width: 48px;height:48px;line-height: 48px;">
								<Icon type="ios-camera" size="20"></Icon>
							</div>
						</Upload>
						<Modal title="门头图片" v-model="visible3" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>
							<div class="rotateModal" @click='handleRotate' title='旋转'>

							</div>
							<img :src="imgUrl" v-if="visible3" ref='imgModal' class="imgModal">
						</Modal>

					</FormItem>
					<FormItem label="最大占用瓶" class='sameFitem difFitem'>

					</FormItem>
					<FormItem v-for="(occitem, occindex) in occupyNumList" :key="occitem" style='width: 32%;' class='occitem' label='钢瓶'>
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
					<FormItem label="临时增量" class='sameFitem difFitem' v-if='addMaxList.length'>

					</FormItem>
					<FormItem v-for="(occitem, occindex) in addMaxList" :key="occitem" style='width: 32%;' class='occitem' label='钢瓶' v-if='addMaxList.length'>
						<Row>
							<Col span="24">
							<Select v-model="occitem.goodsId" class='occSpec' disabled>
								<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
							</Select>
							</Col>
						</Row>
						<Row>
							<Col span="24">
							<InputNumber :min='0' :max='100' v-model="occitem.number" style="text-align: center;" placeholder='数量' disabled />
							</Col>
						</Row>

					</FormItem>
					<FormItem label="开户时已押瓶" class='sameFitem difFitem'>

					</FormItem>
					<FormItem v-for="(occitem, occindex) in pledgeList" :key="occitem" style='width: 32%;' class='occitem' label='钢瓶'>
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

					<FormItem label="开户时已占用瓶" class='sameFitem difFitem'>

					</FormItem>
					<FormItem v-for="(occitem, occindex) in yzNumList" :key="occitem" style='width: 32%;' class='occitem' label='钢瓶'>
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

					<div>
						<FormItem label="增加押瓶" class='sameFitem difFitem'>

						</FormItem>
						<FormItem class='occitem' style='width: 32%;' v-for="(khitem, khindex) in depositform.items" v-if="khitem.status" :key="khindex" :label="'押金单号 ' + (khindex+1)" :rules="{required: false, message: 'Item ' + khitem.khindex +' can not be empty', trigger: 'blur'}">
							<Row>
								<Col span="24">
								<Input type="text" v-model="khitem.value1" disabled></Input>
								</Col>
							</Row>
							<Row>
								<Col span="24">
								<span style="position: absolute;left: -40px;top:0">钢瓶</span>
								<Select v-model="khitem.occSpec" class='occSpec' disabled>
									<Option v-for="item in newSizeList" :value="item.goodsId" :key="item.goodsId">{{ item.goodsName }}</Option>
								</Select>
								</Col>
							</Row>
							<Row>
								<Col span="24">
								<span style="position: absolute;left: -69px;top:0">押金金额</span>
								<Input v-model="khitem.pledgePrice" placeholder="押金金额" disabled/>
								</Col>

							</Row>
							<Row>
								<Col span="24">
								<span style="position: absolute;left: -97px;top:5px">押瓶开始时间</span>
								<Input type="text" v-model="khitem.beginTime" disabled style='margin: 6px 0;' />
								</Col>

							</Row>
							<Row>
								<Col span="24">
								<span style="position: absolute;left: -69px;top:0">押瓶备注</span>
								<Input disabled type="textarea" :rows="2" v-model="khitem.remark" placeholder="押瓶备注" style="margin-bottom: 6px;" />
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

										</div>
									</template>
									<template v-else>
										<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
									</template>
								</div>
								<div v-else style="height: 20px;"></div>
								<Upload v-show='khitem.depositPicList.length<0' ref="depositPic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessForm" :format="['jpg','jpeg','png']" :max-size="2048" type="drag" :action="fileUrl" style="display: inline-block;width:48px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
									<div style="width: 48px;height:48px;line-height: 48px;" @click='getDepIndex(khindex)'>
										<Icon type="ios-camera" size="20"></Icon>
									</div>
								</Upload>
								<Modal title="押金单图片" v-model="visible4" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>

                  <div class="rotateModal" @click='handleRotate1(khindex)' title='旋转'>

                  </div>
									<img :src="imgUrl" v-if="visible4" ref='imgModal' class="imgModal">
								</Modal>

								</Col>
							</Row>
						</FormItem>
					</div>

				</Form>
				<div class='titleContent'>统计详情</div>
				<Form :label-width="124" class='typeForm1 sameType' inline>
					<FormItem label="订单计算存瓶数量" style='width: 32%;'>
						<Input v-model="saveBottleNum" disabled></Input>
					</FormItem>
					<FormItem label="本月配送钢瓶数" class='monthBottleClass' style='width: 32%;display: block;' v-if='monthBottleCount.length'>
						<div style="display: flex;">
							<div style="min-width: 100px;margin-right: 5px;" v-for='(item,index) in monthBottleCount' :key='index'>
								<div><span>规格：</span><span>{{item.spec}}</span></div>
								<div><span>数量：</span><span>{{item.monthCount}}</span></div>
							</div>

						</div>

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
					<FormItem v-for="(occitem, occindex) in yzNumList1" :key="occindex" style='width: 32%;overflow: hidden;' class='occitem' label='钢瓶'>
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
						<Input type="text" v-model="typeForm5.securityName" disabled></Input>
					</FormItem>
					<FormItem label="联系方式" class='star' style='width:32%'>
						<Input type="text" v-model="typeForm5.securityPhone" disabled></Input>
					</FormItem>
					<FormItem label="身份证号码" class='star' style='width:31%'>
						<Input type="text" v-model="typeForm5.securityIDNumber" disabled></Input>
					</FormItem>
				</Form>
				<div class='titleContent'>燃气接收人信息</div>
				<Form ref="typeForm6" :label-width="120" class='typeForm6 sameType' inline>
					<div v-for="(item, jsrindex) in jsrform.items" v-if="item.status" :key="jsrindex">
						<FormItem label='姓名' class='star' style='width:32%'>
							<Input type="text" v-model="item.jsrname" disabled />
						</FormItem>
						<FormItem label='联系方式' class='star' style='width:32%'>
							<Input type="text" v-model="item.contactNumber" disabled />
						</FormItem>
						<FormItem label='身份证号码' class='star' style='width:31%'>
							<Input type="text" v-model="item.IDNumber" disabled />
						</FormItem>
					</div>
				</Form>
				<div class='titleContent' v-if='!isResident'>营业执照信息</div>
				<Form :model="formLicense" :label-width="120" class='sameType typeForm' inline v-show='!isResident'>
					<FormItem label="营业执照编码">
						<Input type="text" v-model="formLicense.businessLicenseCode" disabled />
					</FormItem>
					<FormItem label="商户名称">
						<Input type="text" v-model="formLicense.businessName" disabled />
					</FormItem>
					<FormItem label="商户类型">
						<Input type="text" v-model="formLicense.businessType" disabled />
					</FormItem>
					<FormItem label="法人">
						<Input type="text" v-model="formLicense.legalPerson" disabled />
					</FormItem>
					<!--<FormItem label="成立日期" class='licenseDate'>
								<DatePicker type="datetime" placeholder="请选择成立日期" format="yyyy-MM-dd HH:mm:ss" v-model='formLicense.dateTime' style='width: 100%;'></DatePicker>
							</FormItem>-->
					<FormItem label="注册地址">
						<Input type="text" v-model="formLicense.businessAddredss" disabled />
					</FormItem>

					<FormItem label="营业执照图片" class="picShow">
						<div class="demo-upload-list" v-for="item in licensePicList" :key="item.index">
							<template v-if="item.status === 'finished'">
								<img :src="item.url">
								<div class="demo-upload-list-cover">
									<Icon type="ios-eye-outline" @click.native="handleViewstoreLicense(item.url)"></Icon>

								</div>
							</template>
							<template v-else>
								<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
							</template>
						</div>
						<Upload v-show='licensePicList.length<0' ref="licensePic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessstoreLicense" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUploadstoreLicense" type="drag" :action="fileUrl" style="display: inline-block;width:48px;">
							<div style="width: 48px;height:48px;line-height: 48px;">
								<Icon type="ios-camera" size="20"></Icon>
							</div>
						</Upload>
						<Modal title="营业执照图片" v-model="visible5" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>
							<div class="rotateModal" @click='handleRotate' title='旋转'>

							</div>
							<img :src="imgUrl" v-if="visible5" ref='imgModal' class="imgModal">
						</Modal>

					</FormItem>
				</Form>
				<div class='titleContent'>燃气设备信息</div>
				<Form ref="typeForm8" :label-width="120" class='typeForm8 sameType'>
					<div v-for="(sbitem, sbindex) in gasAppliance.items" v-if="sbitem.status" :key="sbindex" class='divFitem'>
						<FormItem label="燃气设备种类" class=''>
							<Select v-model="sbitem.gasAppliancekind" disabled placeholder=''>
								<Option v-for="item in gasSlist" :value="item.key" :key="item.key">{{ item.content }}</Option>
								<Option value="0">其他</Option>
							</Select>
						</FormItem>
						<FormItem v-show="sbitem.kind">
							<Input type="text" v-model="sbitem.otherKind" disabled></Input>
						</FormItem>
						<FormItem label="规格型号" class=''>
							<Input type="text" v-model="sbitem.value" disabled />
						</FormItem>
						<FormItem label="数量" class=''>
							<InputNumber :min='0' :max='100' v-model="sbitem.count" style='width: 100%;' disabled />
						</FormItem>
						<FormItem label="附件">
							<div class="demo-upload-list" v-for="item in sbitem.gasAppPicList" :key="item.index">
								<template v-if="item.status === 'finished'">
									<img :src="item.url">
									<div class="demo-upload-list-cover">
										<Icon type="ios-eye-outline" @click.native="handleViewGas(item.url)"></Icon>

									</div>
								</template>
								<template v-else>
									<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
								</template>
							</div>
							<Upload v-show='sbitem.gasAppPicList.length==0' ref="gasAppPic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessGas" :format="['jpg','jpeg','png']" :max-size="2048" type="drag" :action="fileUrl" style="display: inline-block;width:48px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
								<div style="width: 48px;height:48px;line-height:48px;" @click='getGasIndex(sbindex)'>
									<Icon type="ios-camera" size="20"></Icon>
								</div>
							</Upload>

							<Modal title="燃气设备图片" v-model="visible6" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>

                <div class="rotateModal" @click='handleRotate1(sbindex)' title='旋转'>

                </div>
								<img :src="imgUrl" v-if="visible6" ref='imgModal' class="imgModal">
							</Modal>

						</FormItem>

					</div>
				</Form>
				<div class='titleContent'>燃气附属设备信息</div>
				<Form ref="typeForm1" :label-width="120" class='typeForm1 sameType'>

					<div v-for="(sbfitem, sbfsindex) in gasOtherAppliance.items" v-if="sbfitem.status" :key="sbfsindex" class='divFitem'>
						<FormItem label="燃气设备种类">
							<Select v-model="sbfitem.gasOtherAppliancekind" disabled placeholder=''>
								<Option v-for="item in gasSlist1" :value="item.key" :key="item.key">{{ item.content }}</Option>
								<Option value="0">其他</Option>
							</Select>
						</FormItem>
						<FormItem v-show="sbfitem.fsKind">
							<Input type="text" v-model="sbfitem.otherfsKind" disabled></Input>
						</FormItem>
						<FormItem label="规格型号">
							<Input type="text" v-model="sbfitem.value" disabled />
						</FormItem>
						<FormItem label="数量">
							<InputNumber :min='0' :max='100' v-model="sbfitem.count" type='number' style='width: 100%;' disabled />
						</FormItem>
						<FormItem label="附件">
							<div class="demo-upload-list" v-for="item in sbfitem.gasSubAppPicList" :key="item.index">
								<template v-if="item.status === 'finished'">
									<img :src="item.url">
									<div class="demo-upload-list-cover">
										<Icon type="ios-eye-outline" @click.native="handleViewGasSub(item.url)"></Icon>

									</div>
								</template>
								<template v-else>
									<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
								</template>
							</div>
							<Upload v-show='sbfitem.gasSubAppPicList.length==0' ref="gasSubAppPic" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccessGasSub" :format="['jpg','jpeg','png']" :max-size="2048" type="drag" :action="fileUrl" style="display: inline-block;width:48px;" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
								<div style="width: ;height:;line-height: 48px;" @click='getSubIndex(sbfsindex)'>
									<Icon type="ios-camera" size="20"></Icon>
								</div>
							</Upload>
							<Modal title="燃气附属设备图片" v-model="visible7" width='800' class-name="vertical-center-modal" @on-cancel='handleCancel' footer-hide draggable>

                <div class="rotateModal" @click='handleRotate1(sbfsindex)' title='旋转'>

                </div>
								<img :src="imgUrl" v-if="visible7" ref='imgModal' class="imgModal">
							</Modal>

						</FormItem>

					</div>
				</Form>
			</section>
		</div>

		<div class='btnWrapper' v-if='$route.params.seeType==1'>
			<div>
				<Button @click='prePageClick' type="warning" style="margin: 0 5px;font-size: 24px;" title="上一条">
          <Icon type="md-arrow-back" /></Button>
				<Button @click='nextPageClick' type="warning" style="margin: 0 5px;font-size: 24px;" title='下一条'>
          <Icon type="md-arrow-forward" /></Button>
				<Button @click='handleBackClick' style="margin: 0 5px;font-size: 24px;background: #59a533;border-color: #59a533;" type="warning" title="返回">
          <Icon type="ios-redo" /></Button>
				<Button v-has='1027' @click="printIn" type="warning" title="导出" style="margin: 0 5px;font-size: 24px;background: #3ac2a9;border-color:#3ac2a9;">
          <Icon type="ios-print" /></Button>
			</div>
			<div style="margin-top: 10px;">
				<Button @click='handleEditClick' type="info" style="margin: 0 5px;" v-has='920'>编辑</Button>
				<Button @click='handleAllocateClick' type="primary" style="margin: 0 5px;" v-has='923' v-show='!isAllocate'>分配</Button>
				<Button @click='handleAllocateClick' type="primary" style="margin: 0 5px;" v-has='923' v-show='isAllocate'>重新分配</Button>
				<div style="display: inline-block;" v-has='1026'>
					<!--<Button @click='handleReviewClick' type="info" style="margin: 0 5px;background: #ab2ce4;border-color: #ab2ce4;" v-if='userInfoIsPerfection==3&&!isResident'>待审核</Button>-->
					<Button @click='handleReviewClick' type="info" style="margin: 0 5px;background: #ab2ce4;border-color: #ab2ce4;" v-if='userInfoIsPerfection!=1'>审核</Button>
					<!--<Button type="info" style="margin: 0 5px;background: #6e6473b5;border-color: #6e6473b5;" v-else-if='userInfoIsPerfection==0'>待分配</Button>-->
					<!--<Button type="info" style="margin: 0 5px;background: #6e6473b5;border-color: #6e6473b5;" v-else-if='userInfoIsPerfection==2'>待提交</Button>-->
					<Button type="info" style="margin: 0 5px;background: #6e6473b5;border-color: #6e6473b5;" v-else>已审核</Button>
				</div>
				<Button type="info" style="margin: 0 5px;background: #1534e6b5;border-color: #1534e6b5;" @click='addMaxClick' v-has='"customerInfo-addMax"'>临时增量</Button>

			</div>
		</div>
		<!-- <div v-else class="mainBodyButton">
          <Button @click='handleBackClick'>返回</Button>
      </div> -->
		<allocate :newDeps='newDeps' @allocateShow='allocateShowMethods' :newIds='newIds' v-if='allocateShow' @isSuccess='isSuccessMethods'></allocate>
		<orderHistory v-if='orderInfo' @orderInfo='orderInfoMethod' :userId='$route.params.id'></orderHistory>
		<addMax v-if='addMaxInfo' :userAddMax='userAddMax' @addMaxInfo='addMaxInfoMethod' :userId='$route.params.id' :newsAllowGoods='newsAllowGoods' :goodsList='newSizeList' :isAddMax='isAddMax'></addMax>
	</div>
</template>
<!--https://source.payq-iot.com:8089/file/upload-->
<!--http://test.payq-iot.com:7002/file/upload-->
<script>
	import { pathUrls } from '@/public/path';
	import _http from '@/public/http';
	import allocate from './allocate';
	import Print from '@/plugs/print';
	import orderHistory from '@/pages/comComponent/orderHistory.vue';
	import addMax from './addMax';
	Vue.use(Print)
	export default {
		name: 'seeAccount',
		components: {
			allocate,
			orderHistory,
			addMax
		},
		data() {
			return {
				rotateIndex: 0,
				userNames: "",
				hasCert: null,
				addMaxList: [],
				userAddMax: {},
				newsAllowGoods: [],
				isAddMax: null,
				addMaxInfo: false,
				historyContractUrlArr: [],
				orderInfo: false,
				contractUrl: null,
				userSearchData: {},
				newIds: null,
				newDeps: '',
				allocateShow: false,
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
					occNum: null,
				}],
				occindex: 1,
				occupyNumList: [{
					occindex: 1,
					status: 1,
					occSpec: '',
					occNum: null,

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
				khindex: 1,
				depositform: {
					items: [{
						value1: '',
						khindex: 1,
						status: 1,
						depositPicList: [],
						occSpec: '',
						pledgePrice: '',
						beginTime: '',
						remark: ''
					}]
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
				userInfoIsPerfection: 3,
				completionTime: null,
				ids: null,
				userStatus: null,
				allocationTime: null,
				userSign: null,
				isAllocate: false,
				monthBottleCount: [],
				pledgeindex: 1,
				pledgeList: [{
					pledgeindex: 1,
					status: 1,
					occSpec: '',
					occNum: 0,
					occSpecName: ''
				}],
				pledgeindex1: 1,
				pledgeList1: [{
					pledgeindex: 1,
					status: 1,
					occSpec: '',
					occNum: 0,
					occSpecName: ''
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
			'$route' (to, from) {
				if(to.params.id !== from.params.id) {
					this.userGetUserInfo();
				}
			}
		},
		created() {
			this.getGoodsList();
			if(this.$route.params.seeType == 1) {
				this.userSearchData = JSON.parse(this.$store.state.userSearchData);
				this.isAllocate = this.$store.state.userSearchData.isAllocate;
			}

			//			console.log(this.$store.state.userSearchData);
		},

		methods: {
			handleRotate1(index) {
				this.rotateIndex = this.rotateIndex + 1;
				this.$refs.imgModal[index].style.transform = 'rotate(' + 90 * this.rotateIndex + 'deg)';
			},
			handleCancel() {
				this.rotateIndex = 0;
			},
			handleRotate() {
				this.rotateIndex = this.rotateIndex + 1;
				this.$refs.imgModal.style.transform = 'rotate(' + 90 * this.rotateIndex + 'deg)';
			},
			addMaxClick() {
				this.addMaxInfo = true;
			},
			addMaxInfoMethod(data) {
				this.addMaxInfo = false;
				if(data == 1) {
					this.userGetUserInfo()
				}
			},
			orderInfoMethod(data) {
				this.orderInfo = data;
			},
			//历史购气
			handleOrderHistory() {
				this.orderInfo = true;
			},
			handleReviewClick() {
				this.$Modal.confirm({
					title: '是否确定审核？',
					content: '',
					onOk: () => {
						_http.http1('post', pathUrls.checkUserInfo, {
							'userId': this.newIds
						}, 'form').then((res) => {
							if(res.code == 0) {
								this.$Message['success']({
									background: true,
									content: '信息已完善!',
									onClose: (() => {
										this.userInfoIsPerfection = 1;
										//										this.userGetUserInfo()
									})
								});

							}

						})
					},

				});
			},
			printIn() {
				this.$print(this.$refs.print)
			},
			preNextInfo(type) {

				let fData = this.userSearchData;
				fData.queryType = type;
				fData.userId = this.newIds;
				if(fData.isAllocate) {
					delete fData.isAllocate;
				}
				_http.http1('post', pathUrls.webQueryUserInfo, fData, 'form').then((res) => {
					if(res.user) {
						let user = res.user.userId;
						this.newIds = res.user.userId;
						//						console.log(user)
						this.$router.replace('/customerInfo/seeAccount' + '/' + user + '/1')
					} else {
						let contents = '';
						if(type == 1) {
							contents = '已经到顶了!';
						} else {
							contents = '已经到底了!';
						}
						this.$Message['warning']({
							background: true,
							content: contents,
						});
						return false
					}
				})

			},
			nextPageClick() {
				this.preNextInfo(2);
			},
			prePageClick() {

				this.preNextInfo(1);
			},
			isSuccessMethods(data) {
				if(data) {
					this.userGetUserInfo();
				}
			},
			handleAllocateClick() {
				this.allocateShow = true;
				//				console.log(this.allocateShow)
			},
			allocateShowMethods(data) {
				this.allocateShow = data;
			},
			handleEditClick() {
				this.$router.push('/customerInfo/editAccount' + '/' + this.$route.params.id);
			},
			//营业执照图片
			handleViewstoreLicense(url) { //图片放大
				this.imgUrl = url;
				this.visible5 = true;
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

			//查看用户签名
			viewPic(url) {
				this.visible1 = true;
				this.userSign = url;
			},
			//获取商品信息列表
			getGoodsList() {
				this.newSizeList = [];
				_http.http1('post', pathUrls.deptgoodsList, {
					'isGas': 2
				}, 'form').then((res) => {
					this.newSizeList = res.data;
				})
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

			//返回
			handleBackClick() {
				// this.$router.push('/clientManage/customerInfo');
				this.$router.go(-1);

			},
			//获取详情
			userGetUserInfo() {
				this.userNames = '';
				this.hasCert = null;

				this.addMaxList = [];
				this.userAddMax = {};
				this.newsAllowGoods = [];
				this.historyContractUrlArr = [];
				this.contractUrl = null;
				this.monthBottleCount = [];
				this.userSign = null;
				this.allocationTime = null;
				this.userStatus = null;
				this.completionTime = null;
				this.userInfoExecutor = null;
				this.userInfoExecutorName = null;
				this.userInfoIsPerfection = 3;
				this.userAccountNumbers = null; //户号
				this.typeForm.organize = null; //组织
				this.newDepId = null;
				this.newDeps = null;
				this.newIds = null;
				this.typeForm.gasType = null; //用气类型
				this.newGasType = null;
				this.typeForm.gasSubType = null; //用气子类型
				this.typeForm.businessName = null; //企业商户名称
				this.typeForm.userCertAddress = null; //证件地址

				this.typeForm.clientName = null; //客户姓名
				this.typeForm.idNum = null; //身份证号码
				this.typeForm.telephoneNumber = null; //联系电话
				this.typeForm.province = null; //所属省份
				this.typeForm.city = null; //所属市
				this.typeForm.area = null; //所属区县
				this.typeForm.street = null; //所属街道
				this.typeForm.detailAddress = null; //详细地址
				this.formLicense.businessLicenseCode = null;
				this.formLicense.businessName = null;
				this.formLicense.businessType = null;
				this.formLicense.legalPerson = null;
				this.formLicense.businessAddredss = null;
				this.licensePicList = [];
				this.ids = null;
				this.userRemarks = null;
				this.typeForm1.accountHolder = null; //开户人
				this.newOpener = null;
				this.typeForm1.contractNumber = null; //开户合同编号
				this.typeForm1.yzcount = null; //押瓶/占用瓶数量
				this.typeForm1.maxCount = null; //最大占用瓶数量
				this.userSign = null; //用户签名

				this.uploadList = [];
				this.storePicList = [];
				this.khindex = 1;
				this.depositform.items = [];
				this.yzNumList = [{
					yzoccindex: 1,
					status: 1,
					occSpec: '',
					occNum: null,
				}];
				this.yzNumList1 = [{
					yzoccindex: 1,
					status: 1,
					occSpec: '',
					occNum: null,
				}];
				this.pledgeList = [{
					pledgeindex: 1,
					status: 1,
					occSpec: '',
					occNum: null,
				}];
				this.pledgeList1 = [{
					pledgeindex: 1,
					status: 1,
					occSpec: '',
					occNum: null,
				}];
				this.occyzindex = 1;
				this.occindex = 1;
				//						this.occupyNumList = [{
				//												occindex: 1,
				//												status: 1,
				//												occSpec: '',
				//												occNum: null,
				//											}];
				this.saveBottle = [];
				this.saveBottleNum = 0;
				this.yqindex = 1;
				this.gasDefineform.items = [{
					yqindex: 1,
					status: 1,
					sqcount: 0,
					sycount: 0,
					size: '',
				}];
				this.typeForm4.switch = 0;
				this.typeForm4.bookProduct = null;
				this.typeForm4.bookNumber = 0;
				this.typeForm5.securityName = null;
				this.typeForm5.securityPhone = null;
				this.typeForm5.securityIDNumber = null;
				this.jsrform.items = [{
					contactNumber: '',
					jsrname: '',
					IDNumber: '',
					jsrindex: 1,
					status: 1
				}];
				this.jsrindex = 1;
				this.typeForm4.cardNumber = null; //用气卡号
				this.newCardCode = null;
				this.payWay = null;
				this.newPayWay = null;
				this.saleform.items = [{
					saleindex: 1,
					status: 1,
					ssize: ''
				}];

				this.saleindex = 1;
				this.sbindex = 1;
				this.gasAppliance.items = [{
					value: '',
					sbindex: 1,
					status: 1,
					count: 0,
					gasAppliancekind: '',
					otherKind: '',
					gasAppPicList: [],
					gasAppName: '',
					kind: false,
				}];
				this.sbfsindex = 1;
				this.gasOtherAppliance.items = [{
					value: '',
					sbfsindex: 1,
					status: 1,
					count: 0,
					gasOtherAppliancekind: '',
					otherfsKind: '',
					gasSubAppPicList: [],
					gasOtherAppName: '',
					fsKind: false
				}];
				_http.http1('get', pathUrls.userGetUserInfo + '/' + this.$route.params.id, {}, 'form').then((res) => {
					if(res) {
						if(res.user.monthBottleCount) {
							let newCounts = JSON.parse(res.user.monthBottleCount);
							this.monthBottleCount = newCounts;
						}

						//基本信息
						if(res.user.historyContractUrl) {
							this.historyContractUrlArr = res.user.historyContractUrl.split(',');
						}
						this.hasCert = res.user.hasCert;
						this.userNames = res.user.userName ? res.user.userName : res.user.userRealName;

						this.isAddMax = res.user.isAddMax;
						this.contractUrl = res.user.contractUrl;
						this.typeForm.userCertAddress = res.user.userCertAddress; //证件地址
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
						this.newDeps = res.user.userDeptId + '';
						this.isAllocate = res.user.userInfoExecutor ? true : false;
						this.newIds = res.user.userId;
						this.typeForm.gasType = +res.user.userOrderType; //用气类型
						this.newGasType = res.user.userOrderType;
						this.common.getUserTypeList(this.userData.deptId).then((res) => {
							this.gasTypeList = res.data;
							for(let item of this.gasTypeList) {
								if(item.id == this.typeForm.gasType) {
									if(item.detailType == 1) {
										this.isResident = true;
									} else {
										this.isResident = false;
									}
								}
							}

						})

						this.typeForm.gasSubType = res.user.userGasSubType; //用气子类型
						this.typeForm.businessName = res.user.userName; //企业商户名称

						this.typeForm.clientName = res.user.userRealName; //客户姓名
						this.typeForm.idNum = res.user.userIdCardNumber; //身份证号码
						this.typeForm.telephoneNumber = res.user.userPhoneNumber; //联系电话
						this.typeForm.province = Number(res.user.userProvinceCode); //所属省份
						this.typeForm.city = Number(res.user.userCityCode); //所属市
						this.typeForm.area = Number(res.user.userAreaCode); //所属区县
						this.typeForm.street = Number(res.user.userStreetCode); //所属街道
						this.typeForm.detailAddress = res.user.userAddress; //详细地址
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

						//开户详情
						this.typeForm1.accountHolder = res.user.userOpeningStaff; //开户人
						this.newOpener = res.user.userOpeningStaff;
						if(extend) {
							this.typeForm1.contractNumber = extend.userContractNumber; //开户合同编号
							this.typeForm1.yzcount = extend.occupiedNumber; //押瓶/占用瓶数量
							this.typeForm1.maxCount = extend.maxOccupiedNumber; //最大占用瓶数量
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

							if(newDepNum.toString()) {

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
										pledgePrice: newDepNum[i].pledgePrice
									})
									//									}

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

						if(extend && extend.maxOccupiedNumber) {
							let newOccupiedNum = JSON.parse(extend.maxOccupiedNumber);

							if(newOccupiedNum.length) {
								this.occindex = newOccupiedNum.length;

								this.occupyNumList = [];
								//								return false;
								newOccupiedNum.forEach((item, index) => {
									this.occupyNumList.push({
										occindex: index + 1,
										status: 1,
										occSpec: +item.goodsId,
										occNum: item.number,
									})
								})
							}
						} else {
							this.occupyNumList = [{
								occindex: 1,
								status: 1,
								occSpec: '',
								occNum: null,
							}];
						}

//						if(extend && extend.storageBottleDetails) {
//							let bottleDetail = JSON.parse(extend.storageBottleDetails)
//							for(let item of bottleDetail) {
//								this.saveBottle.push(item.tag);
//							}
//							this.saveBottleNum = this.saveBottle.length;
//						}
						if(extend&&extend.orderCountBottles){
//							this.saveBottleNum = extend.orderCountBottles.orderCountBottleList.length;
							this.saveBottleNum = extend.orderCountBottles.count;
						}else{
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
										status: 1
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

						if(extend && extend.allowGoods) {
							let newAllowGoods = JSON.parse(extend.allowGoods) //商品
							this.newsAllowGoods = newAllowGoods;
							if(newAllowGoods.length) {
								this.saleform.items = [];
								this.saleindex = newAllowGoods.length;

								for(let i = 0; i < newAllowGoods.length; i++) {
									this.saleform.items.push({
										saleindex: i + 1,
										status: 1,
										ssize: +newAllowGoods[i],

									})
								}
							}
						}

						if(extend && extend.facilitiesInfo) {
							//燃气设备信息 附属设备信息
							let facInfo = JSON.parse(extend.facilitiesInfo);
							let newGasDevice = facInfo.gasDevice;
							let newGasAuxDevice = facInfo.gasAuxDevice;

							if(newGasDevice && newGasDevice.length) {
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

							if(newGasAuxDevice && newGasAuxDevice.length) {
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
						this.getQueryGasDevice(this.typeForm.organize, 1, 'gasSlist') //查询燃气设备值
						this.getQueryGasDevice(this.typeForm.organize, 2, 'gasSlist1') //查询燃气附属设备

						if(res.user.userAddMax) {
							this.userAddMax = res.user.userAddMax;
							if(res.user.userAddMax.addNumber) {

								let addNumber = JSON.parse(res.user.userAddMax.addNumber);
								this.addMaxList = addNumber;
							}
						} else {
							this.userAddMax = {};

						}
						//						this.getSize(this.typeForm.organize); //用气规格
					}
				})
			},

			getSubType1() { //用气子类型（商业、小微商业）接口
				_http.http1('post', pathUrls.subType, {
					'userType': 0
				}, 'form').then((res) => {
					this.subType1List = res.data;
				})
			},

			getAreaInfo(cCode, areaLis) { //用气地址接口
				_http.http1('post', pathUrls.cityInfo, {
					'parentCode': cCode
				}, 'form').then((res) => {

					this[areaLis] = res.data;
				})
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

			//企业员工姓名接口
			getStaffName(c) {
				_http.http1('post', pathUrls.deptStaff, {
					'deptId': c
				}, 'form').then((res) => {

					this.staffNameList = res.data;
				})
			},
			//查询结算类型
			//			getQueryAcType(c) {
			//				_http.http1('post', pathUrls.userQueryAcType, {
			//					'deptId': c
			//				}, 'form').then((res) => {
			//
			//					this.acTypeList = res.data;
			//				})
			//			},

			//燃气设备图片上传成功钩子
			handleSuccessGas(res, file, fileList) {
				this.gasAppliance.items[this.gasIndex].gasAppPicList = fileList;
				//				for(let i = 0; i < this.gasAppliance.items.length; i++) {
				//					this.gasAppliance.items[i].gasAppPicList = this.$refs.gasAppPic[i].fileList;
				//				}
				file.url = res.data.src;
				file.name = res.data.name;
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

			//燃气附属设备图片放大
			handleViewGasSub(url) {
				this.imgUrl = url;
				this.visible7 = true;
			},

			handleSuccessGasSub(res, file, fileList) { //燃气附属设备图片上传成功钩子
				this.gasOtherAppliance.items[this.subIndex].gasSubAppPicList = fileList;
				file.url = res.data.src;
				file.name = res.data.name;
			},

		},

		mounted() {

			this.common.getDeptList(this.userData.deptId).then((res) => {
				this.options = this.common.getConDept(res.data, 0, 0, 1)
			})
			this.getAreaInfo(0, 'provinceList'); //获得用气地址的省市区街道
			this.uploadList = this.$refs.upload.fileList;
			this.storePicList = this.$refs.storePic.fileList;
			this.licensePicList = this.$refs.licensePic.fileList;
			this.userGetUserInfo();
			this.getSubType1();

			//			this.getQueryAcType(this.typeForm.organize);
		}
	}
</script>

<style type="text/css" scoped>
	.mainBorder>>>.el-cascader {
		width: 100%;
	}

	.userInfoMain {
		/* position: relative; */
	}

	.mainBorder>>>.el-input__icon {
		line-height: 32px;
		display: none;
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
		padding: 10px 5px;
		text-align: center;
		min-width: 220px;
		/*height: 40px;*/
		position: fixed;
		right: 100px;
		bottom: 100px;
		z-index: 1000;
		/*box-shadow: 0 2px 16px 0 #40a9ff75;*/
		background: #fff;
		border-radius: 4px;
		box-shadow: 0 2px 16px 0 #67c23a5c;
	}

	.btnWrapper button {
		padding: 0 12px;
		height: 28px;
		line-height: 26px;
	}

	.mainBorder>>>.ivu-icon-ios-camera {
		color: #51B5EA;
	}

	.mainBorder>>>.el-input.is-disabled,
	.mainBorder>>>.el-input__inner,
	.mainBorder>>>.ivu-select-disabled,
	.mainBorder>>>.ivu-select-selection {
		background-color: #fff;
		color: #515a6e;
	}

	.mainBorder>>>.ivu-input[disabled],
	.mainBorder>>>fieldset[disabled] .ivu-input {
		background-color: #fff;
		color: #515a6e;
	}

	.mainBorder>>>.ivu-input-number-disabled,
	.mainBorder>>>.ivu-input-number-input {
		background-color: #fff;
		color: #515a6e;
	}
	/*.monthBottleClass>>>label{
		width: 200px!important;
	}
	.monthBottleClass>>>.ivu-form-item-content{
		margin-left: 200px!important;
	}*/

	.mainBorder>>>.ivu-select-disabled .ivu-select-selection .ivu-select-arrow {
		display: none;
	}

	.unReal>>>.ivu-input {
		color: #f00!important;
		font-weight: 600;
	}
</style>
