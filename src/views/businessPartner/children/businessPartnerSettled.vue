<template>
  <div class="businessPartnerSettled">
    <NavBar :title="title"></NavBar>
    <div class="content">
        <p class="title">基本信息</p>
        <div class="form">
          <div class="">
            <van-field v-if="type === '2'" v-model="companyName" label="公司名称" placeholder="请输入运力公司名称" />
            <van-field v-model="userName" label="法人姓名" placeholder="请填写真实法人姓名" />
            <van-field v-model="userPhone" type="tel" label="手机号" placeholder="请输入手机号" maxlength="11" :error-message="userPhoneErr" @blur="checkPhone(0)"/>
            <van-field v-model="email" label="E-mail" placeholder="请输入邮箱" />
            <div class="field_border">
              <van-field v-model="address" label="地址" type="textarea" rows="1" autosize placeholder="请选择地区" :right-icon="imgIcon" readonly @click="openAddress"/>
            </div>
            <van-field v-model="detailedAddress" label=" " type="textarea" rows="1" autosize placeholder="请填写详细地址" />
            <div v-if="type === '0'">
              <van-field v-model="inviterPhone" type="tel" label="邀请码" placeholder="请输入邀请码" maxlength="11" :error-message="inviterPhoneErr" @blur="checkPhone(1)"/>
              <van-field v-model="IDNumber" label="身份证" placeholder="请输入身份证号码" maxlength="18"/>
            </div>
            <van-field label="证件照片" disabled/>
          </div>
          <div class="row">
            <div class="label label_identity">正面照</div>
            <div class="img img_first" @click="openSheet(0, '正面照')">
              <div class="img-uploader"><img :src="uploadImg[0]" alt=""></div>
              <div class="img-text">
                <div>法人身份证头像面照片</div>
                <div>查看示例图</div>
              </div>
            </div>
          </div>
          <div class="row row_first">
            <div class="label label_identity">反面照</div>
            <div class="img img_first" @click="openSheet(1, '反面照')">
              <div class="img-uploader"><img :src="uploadImg[1]" alt=""></div>
              <div class="img-text">
                <div>法人身份证国徽面照片</div>
                <div>查看示例图</div>
              </div>
            </div>
          </div>
          <div v-if="type === '0'" class="arrowsHas">
            <van-field v-model="serviceArea" label="服务区域" placeholder="请选择服务区域" :right-icon="arrowsIcon"/>
          </div>
        </div>

        <div v-if="type === '2'">
          <p class="title">主体资质</p>
          <div class="form">
            <div >
              <div class="field_border">
                <van-field v-model="licenseName" label="证件类型" readonly/>
              </div>
              <div class="row row_second">
                <div class="label">证件照片</div>
                <div class="img" @click="openSheet(2, '营业执照')">
                  <div class="img-uploader"><img :src="uploadImg[2]" alt=""></div>
                  <div class="img-text">
                    <div>图片清晰，完整拍摄国徽和红章，文字清晰，无水印，复印件需加盖红章</div>
                    <div>查看示例图</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="arrowsHas">
              <van-field v-model="serviceArea" label="服务区域" placeholder="请选择服务区域" :right-icon="arrowsIcon"/>
              <van-field v-model="webmasterNumber" label="站长数量" type="digit" placeholder="请输入站点数量" />
              <van-field v-model="riderNumber" label="骑手数量" type="digit" placeholder="请输入骑手数量" />
            </div>
          </div>
        </div>
        
        <div v-if="type !== '0'">
          <p class="title">银行资质</p>
          <div class="form">       
            <div>
              <van-field v-model="bank.name" label="户名" placeholder="请输入真实法人姓名" />
              <van-field v-model="bank.bankName" label="开户银行" placeholder="请输入开户银行名称" />
              <van-field v-model="bank.cardNumber" label="银行卡号" type="digit" placeholder="请输入银行卡号" />
            </div>
          </div>
        </div>
        

        <div class="explain" @click="checkExplain">
          <img :src="explainImg" alt="" />
          我已确认法人信息真实有效，且授权平台代为填写信息
        </div>
    </div>

    <div style="width:100%;height:60px;"></div>
    <div class="btn">
      <div class="" @click="submit">提交审核</div>
    </div>

    <!-- 图片弹出框 -->
    <van-action-sheet v-model="show">
      <div class="sheet-close" @click="closeSheet">
        <img src="../../../assets/img/icon_close@2x.png" alt="" />
      </div>
      <div class="sheet-content">
        <div class="sheet-content-img">
          <img :src="sheetContentImg" alt="">
        </div>
        <p class="sheet-content-p">正确示例</p>
        <div class="sheet-content-text" v-text="sheetText.text1"></div>
        <div class="sheet-content-text" v-html="sheetText.text2"></div>
        <div class="sheet-content-btn">
          <div class="" @click="openPhoto">上传图片</div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { Field, ActionSheet, Toast } from 'vant';
import { nativeFunction, getValueFromApp } from "@/utils/index";
import { totalGenerationSettled, totalGenerationUpdate, getTotalGenerationInfo} from '@/api/index';
export default {
    name: 'businessPartnerSettled',
    components: {
        NavBar,
        vanActionSheet: ActionSheet,
    },
    data () {
        return {
            title: '',
            companyName: '',
            userName: '',
            userPhone: '',
            email: '',
            licenseName: '营业执照',
            address: '',
            detailedAddress: '',
            addressInfo: {
              latitude: '',
              longitude: '',
              areaId: ''
            },
            inviterPhone: '',
            IDNumber: '',
            userPhoneErr: '',
            inviterPhoneErr: '',
            imgIcon: require('../../../assets/img/dingwei@2x.png'),
            arrowsIcon: require('../../../assets/img/icon-test-14@2x.png'),
            show: false,
            uploadIndex: 0,
            uploadIndexArr: [],
            uploadImg: [
              require("../../../assets/img/zhanweitu@2x.png"),
              require("../../../assets/img/zhanweitu@2x.png"),
              require("../../../assets/img/zhanweitu@2x.png"),
            ],
            sheetContentImg: require("../../../assets/img/business/IDcard_head@2x.png"),
            sheetText: {
              text1: '',
              text2: ''
            },
            isCheckExplain: false,
            explainImg: require("../../../assets/img/check@2x.png"),
            edit: 0,  //0入驻/1编辑
            bank: {
              name: '',
              bankName: '',
              cardNumber: '' 
            },
            serviceArea: '',
            webmasterNumber: '',
            riderNumber: ''
        }
    },
    created () {
      let data = this.$route.query;
      this.type = data.type.toString();  //入驻类型
      this.edit = data.edit; //编辑状态 1
      
      switch (this.type) {
        case '0':
          this.title = '地服务中心入驻';
          break;
        case '1':
          this.title = '代理商入驻';
          break;
        case '2':
          this.title = '运力公司入驻';
          break;
        default:
          break;
      }
      
    },
    mounted () {
      //监听app传值
      document.body.addEventListener('getValue',this.getDetail);
      
      if(this.edit == 1){  //编辑
        this.getInfo();
      }
    },
    watch: {
      userName(val, oldVal) {
        console.log("inputVal = " + val + " , oldValue = " + oldVal)
      }
    },
    methods: {

      // 校验手机号
      checkPhone(type) {
        let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        let phone = this.userPhone;
        type == 0 ? phone=this.userPhone : phone=this.inviterPhone;
        console.log((reg.test(phone)))
        if(!(reg.test(phone))){
          type == 0 ? this.userPhoneErr = "手机号格式错误" : this.inviterPhoneErr = "手机号格式错误";
          return false
        }else{
          type == 0 ? this.userPhoneErr = "" : this.inviterPhoneErr = "";
          return true
        }
        
      },
      // 打开/关闭弹框
      openSheet(index, name) {
        this.uploadIndex = index;
        this.sheetText.text1 = '点击示例图片，可查看大图';
        this.sheetText.text2 = '图片要求：<br>1.照片需清晰，完整拍摄国徽和红色公章<br>2.文字清晰、无水印，复印件需加盖红色公章';
        console.log(name)
        switch (name) {
          case '正面照':
            this.sheetContentImg = require("../../../assets/img/business/IDcard_head@2x.png");
            this.sheetText.text1 = '正面照：点击示例图片，可查看大图';
            this.sheetText.text2 = '图片要求：<br>1.身份证信息拍摄完整，不可有遮挡<br>2.可使用临时身份证、护照、港澳台来往内地通行证、台胞证等';
            break;
          case '反面照':
            this.sheetContentImg = require("../../../assets/img/business/IDcard_tail@2x.png");
            this.sheetText.text1 = '反面照：点击示例图片，可查看大图';
            this.sheetText.text2 = '图片要求：<br>1.身份证信息拍摄完整，不可有遮挡<br>2.可使用临时身份证、护照、港澳台来往内地通行证、台胞证等';
            break;
          default:
            this.sheetContentImg = require("../../../assets/img/business/yingyezhizhao@2x.png");
            this.sheetText.text1 = '点击示例图片，可查看大图';
            this.sheetText.text2 = '图片要求：<br>1.照片需清晰，完整拍摄国徽和红色公章<br>2.文字清晰、无水印，复印件需加盖红色公章';
            break;
        }
        this.show = true;
      },
      closeSheet() {
        this.show = false;
      },
      // 勾选
      checkExplain() {
          if(this.isCheckExplain){
              this.isCheckExplain = false;
              this.explainImg = require("../../../assets/img/check@2x.png");
          }else{
              this.isCheckExplain = true;
              this.explainImg = require("../../../assets/img/checked@2x.png");
          }
          console.log(this.isCheckExplain)
      },

      getDetail(e) {
        let type = e.detail.type;
        let obj = e.detail.data;
        switch (type) {
          case "address":
            this.getAddress(obj);
            break;
          case "photo":
            this.getPhoto(obj);
            break;
          default:
            break;
        }
      },
      getPhoto(data){
        this.show = false;
        // var f = new FileReader()
        // f.readAsDataURL(data[0])
        // f.onload= () => {
        //     this.uploadImg[this.uploadIndex] = f.result;
        // }
        this.$set(this.uploadImg, this.uploadIndex, data[0])
        this.uploadIndexArr[this.uploadIndex] = this.uploadIndex;
      },
      getAddress(data) {
        console.log(data)
        this.address = data.address;
        this.detailedAddress = data.detailedAddress;
        this.addressInfo.latitude = data.latitude;
        this.addressInfo.longitude = data.longitude;
        this.addressInfo.areaId = data.areaId;
      },
      // 打开相册
      openPhoto() {
        nativeFunction.openPhoto("photo",{isClip: true, num: 1});
      },
      // 打开地址
      openAddress() {
        nativeFunction.openMap("address");
      },

      // 提交
      submit() {
        let type = this.type;
        let uploadIndexArr = this.uploadIndexArr;
        if(type === '2'){
          if(this.companyName == ''){
            Toast("请输入运力公司名称");
            return
          }
        }
        if(this.userName == ''){
          Toast("请填写法人姓名");
          return
        }
        if(this.userPhone == ''){
          Toast("请输入手机号");
          return
        }else{
          if(!this.checkPhone(0)){
            return
          }
        }
        if(this.email == ''){
          Toast("请输入邮箱");
          return
        }
        if(this.address == ''){
          Toast("请选择地区");
          return
        }
        if(this.detailedAddress == ''){
          Toast("请填写详细地址");
          return
        }

        if(uploadIndexArr.length > 0){
          for (let i = 0; i < uploadIndexArr.length; i++) {
            if(!uploadIndexArr[i]){
              Toast("请上传证件照片");
              return
            }
          }
        }else{
          Toast("请上传证件照片");
          return
        }

        if(type === '2'){
          if(this.webmasterNumber == ''){
            Toast("请输入站点数量");
            return
          }
          if(this.riderNumber == ''){
            Toast("请输入骑手数量");
            return
          }
        }

        if(type !== '0'){
          if(this.bank.name == ''){
            Toast("请填写户名");
            return
          }
          if(this.bank.bankName == ''){
            Toast("请填写开户银行名称");
            return
          }
          if(this.bank.cardNumber == ''){
            Toast("请输入银行卡号");
            return
          }
        }

        
        if(!this.isCheckExplain){
          Toast("请确认信息");
          return
        }
        
        if(this.inviterPhone != ''){
          if(this.checkPhone(1)){

          }else{
            return
          }
        }

        let data = {
          legalName: this.userName,
          tel: this.userPhone,
          idCardImgFront: this.uploadImg[0],
          idCardImgBack: this.uploadImg[1],
          mail: this.email,
          longitude: this.addressInfo.longitude,
          latitude: this.addressInfo.latitude,
          addrDetail:  this.detailedAddress,
          areaIdP: this.addressInfo.areaId,
          areaIdC: this.addressInfo.areaId,
          areaIdD: this.addressInfo.areaId,
          areaIdS: this.addressInfo.areaId,
        };

        if(type === '0'){ //地服

        }else if(type === '1'){ //全国总代

        }else if(type === '2'){ //运力
          data.companyName = this.companyName;
          data.companyName = this.webmasterNumber;
          data.companyName = this.riderNumber;
        }

        if(this.edit == 1){ //编辑
          data.examineId = this.examineId;
          // thirdPartyUpdate(this.type, data)
          // .then(res => {
          //   console.log(res);
          //   settledCallback(res);
            
          // })
        }
        console.log(data);
        return

        thirdPartySettled(this.type, data)
        .then(res => {
          console.log(res);
          settledCallback(res);
          
        })
      },

      settledCallback(res) {
        if(res.code == 200){
          this.$router.push({
              path: '/busindessPartner/busindessPartnerStatus',
              query: {
                status: '1',
                type: this.type
              }
          })
        }else{
          Toast(res.msg);
        }
      },

      // 获取回显信息
      getInfo() {
        this.isCheckExplain = true;
        
        let data = this.$store.state.businessSettledInfo;
        this.examineId = data.examineId;
        this.userName = data.legalName;
        this.userPhone = data.tel;
        this.email = data.mail;
        this.$set(this.uploadImg, 0, data.idCardImgFront);
        this.$set(this.uploadImg, 1, data.idCardImgBack);
        this.$set(this.uploadImg, 2, data.license);
        this.addressInfo.longitude = data.longitude;
        this.addressInfo.latitude = data.latitude;
        this.addressInfo.areaIdP = data.areaIdP;
        this.addressInfo.areaIdC = data.areaIdC;
        this.addressInfo.areaIdD = data.areaIdD;
        this.addressInfo.areaIdS = data.areaIdS;
        this.address = data.areaIdPName + data.areaIdCName + data.areaIdDName + data.areaIdSName;
        this.detailedAddress = data.addrDetail;
        
      }
    },
    beforeRouteLeave(to, from, next){
        console.log(to)
        console.log(from)
        if(to.meta.title == '准备资料'){
            this.$store.commit('updateBackPrepareData','1');
        }
        next();
        
    }
}
</script>
<style scoped lang="less">
.van-field{
  padding: 16px 14px;
}
/deep/ .van-field .van-field__label{
  font-size: 14px;
  font-weight: bold!important;
  color: #333333!important;
}
/deep/ .van-icon__image{
  width: 14px;
  height: 18px;
}
/deep/ .arrowsHas .van-icon__image{
  width: 7px;
  height: 12px;
}
/deep/ .van-field__error-message{
  color: #ee0a24;
}
.content{
    padding-top: 44px;
    .title{
        width: 100%;
        height: 46px;
        line-height: 46px;
        padding: 0 15px;
        font-size: 16px;
        font-weight: bold;
    }
    .explain {
      padding: 0 15px;
      width: 100%;
      height: 40px;
      font-size: 12px;
      color: #FF3B30;
      display: flex;
      align-items: center;
      img {
        display: block;
        margin-right: 10px;
        width: 16px;
      }
    }
}
.form{
  .field_border{
    position: relative;
    &:after{
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      height: 1px;
      pointer-events: none;
      right: 16px;
      bottom: 0;
      left: 118px;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
  .row{
    &.row_first{
      padding-top: 12px;
    }
    &.row_second{
      padding: 16px;
      position: relative;
      &:after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        height: 1px;
        pointer-events: none;
        right: 16px;
        bottom: 0;
        left: 16px;
        border-bottom: 1px solid #ebedf0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
    padding: 0 16px;
    font-size: 14px;
    color: #333333;
    background: #FFFFFF;
    display: flex;
    .label{
      width: 102px;
      line-height: 24px;
      padding-right: 12px;
      font-weight: bold;
      &.label_identity{
        font-size: 12px;
        font-weight: normal;
        text-align: right;
      }
    }
    .img{
      flex: 1;
      overflow: hidden;
      display: flex;
      &.img_first{
        padding-bottom: 12px;
        border-bottom: 1px solid #ebedf0;
      }
      .img-uploader{
        width: 80px;
        height: 64px;
        border-radius: 2px;
        overflow: hidden;
        img{
          display: block;
          width: 100%;
        }
      }
      .img-text{
        flex: 1;
        padding-left: 12px;
        font-size: 10px;
        div:first-child{
          height: 42px;
          line-height: 14px;
          color: #999999;
          overflow: hidden;
        }
        div:last-child{
          padding-top: 8px;
          color: #418BF2;
        }
      }
    }
  }
}

.btn {
  padding: 0 17px;
  width: 100%;
  height: 50px;
  background: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  div {
    margin-top: 7px;
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    border-radius: 20px;
    background: #fcc100;
  }
}

.van-action-sheet{
    max-height: 75% !important;
}
.sheet-close {
  float: right;
  width: 46px;
  height: 32px;
  display: flex;
  align-items: center;
  img {
    display: block;
    margin-left: 15px;
    width: 16px;
  }
}
.sheet-content {
  clear: both;
  padding: 0 15px;
  padding-bottom: 20px;
  width: 100%;
  max-height: 60%;
  font-size: 12px;
  overflow-y: scroll;
  .sheet-content-img{
    margin: 12px 0;
    img{
      display: block;
      margin: auto;
      width: 230px;
    }
  }
  .sheet-content-p{
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }
  .sheet-content-text{
    margin-bottom: 12px;
    line-height: 18px;
    color: #666666;
  }
  .sheet-content-btn{
    padding: 7px 0;
    width: 100%;
    height: 50px;
    background: #ffffff;
    div {
      width: 100%;
      height: 36px;
      line-height: 36px;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      border-radius: 20px;
      background: #fcc100;
    }
  }
}
</style>
