<template>
  <div class="prepareData">
    <NavBar :title="title"></NavBar>
    <div class="content">
      <van-notice-bar color="#FA5741" background="#FFDAD8">
        以下材料在入驻过程中需要上传，请您提前准备
      </van-notice-bar>
      <div class="card">
        <p>1. 相关证件</p>
        <div class="card-info">
          <img src="../../../assets/img/business/yingyezhizhao@2x.png" alt="" />
          <div class="">
            <h4>营业执照</h4>
            <div>可用监管部门认可的具有营业执照同等法律效力的证件</div>
          </div>
        </div>
      </div>
      <div class="card" v-for="(item, index) in licenselist" :key="index">
        <p>{{index+2}}. 资质认证</p>
        <div class="card-info">
          <img src="../../../assets/img/business/yingyezhizhao@2x.png" alt="" />
          <div class="">
            <h4>{{item.specialName}}</h4>
            <div>可用监管部门认可的具有法律效力的证件</div>
          </div>
        </div>
      </div>

      <div class="card">
        <p>{{serialNum}}. 身份信息</p>
        <div class="card-info">
          <img src="../../../assets/img/business/IDcard_head@2x.png" alt="" />
          <div class="">
            <h4>身份证</h4>
            <div>法定代表人/经营者身份证（正反面）</div>
          </div>
        </div>
      </div>

      <div class="explain" @click="checkExplain">
        <img :src="explainImg" alt="" />
        我已阅读并同意 <span @click.stop="openExplain">《金戈多店铺开店说明》</span>
      </div>
    </div>

    <div class="btn">
      <div class="" @click="nextStep">我准备好了</div>
    </div>

    <van-action-sheet v-model="show">
      <div class="sheet-close" @click="closeExplain">
        <img src="../../../assets/img/icon_close@2x.png" alt="" />
      </div>
      <div class="sheet-content">
        <p>尊敬的商家：</p>
        <p>
          您好，如果您已经准备完成全部资料，并准备提交申请，在您提交申请前，请务必仔细阅读如下全部声明事项：
        </p>
        <div>1.您确认并知悉，您的申请需经过审核。</div>
        <div>
          2.您承诺您申请主体为依据中国法律合法成立并有效存续的法定代表人或其它商事主体，能够独立承担法律责任，并具备从事申请业务应具备的行政许可、合法授权或同意，及具有履行合作所需的一切权力、权利及能力。
        </div>
        <div>
          3.您承诺所提供的申请主体的证照等资质及其门店、经营者信息真实、合法、有效且不侵犯任何第三方合法权益。
        </div>
        <div>
          4.您承诺提交审核的证照等资质和信息应符合国家法律、法规、规章的规定，申请主体未伪造、变造、冒用或盗用他人证照等资质，未侵犯他人拥有合法权益的信息等；如因申请主体提供的证
          照等资质或信息造成用户及相关第三方损失或金戈多损失或承担责任的，申请主体存在质量和安全问题，由此造成的金戈多用户及相关第三方投诉、索赔、经济损失等相关后果均由申请主体予以承担。
        </div>
        <div>
          5.您承诺提供的商号、商标、图片等均具有发布和使用的充分权利或授权，否则因申请主体原因造成金戈多或第三方损失的，申请主体承担全部赔偿责任。如因申请主体原因造成金戈多被第三方要求赔偿或发生纠纷、行政处罚、诉讼的，申请主体影响
          金戈多全额赔偿损失，金戈多亦有权对申请主体提供的征兆等资质和信息进行删除、屏蔽及操作下线等处理。
        </div>
        <div>
          6.您同意并授权，为更好的向您提供服务，根据国家法律法规规定、产品相关协议约定或者使用金戈多服务之必要，我们将对您的账号进行身份的真实性认证。
        </div>
        <div>
          7.您提供的相关个人信息，将仅限于本产品中，用于对您账号的身份真实性认证。我们会采用行业领先的技术来保护您提供的个人信息，并使用加密、限权等方式避免其被用于其他用途。
        </div>
        <div>
          8.点击勾选“我已阅读并同意《美团外卖开店说明》“则表示您本人同意我们根据以上方式和目的收集、使用及存储您提供的本人身份材料、面部特征等信息用于身份认证。
        </div>
        <p>对于以上声明，您如果存在异议，请停止申请或与<span>【0571-87995086】</span>联系；如您继续填写并提交申请，则视为您理解上述声明，并确认遵守全部事项并在违反时承担责仟。</p>
      </div>
    </van-action-sheet>

  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { ActionSheet, Toast} from "vant";
export default {
  name: "prepareData",
  components: {
    NavBar,
    vanActionSheet: ActionSheet,
  },
  data() {
    return {
      title: "准备资料",
      show: false,
      isCheckExplain: true,
      explainImg: require("../../../assets/img/checked@2x.png"),
      licenselist: [],
      serialNum: 2
    };
  },
  created() {
    let data = this.$route.query;
    this.type = data.type;
    this.storeType = data.storeType;

    this.getList();
  },
  mounted() {
    let backPrepareData = this.$store.state.backPrepareData;
    console.log(backPrepareData)
    if(backPrepareData == '1'){
      this.isCheckExplain = true;
      this.explainImg = require("../../../assets/img/checked@2x.png");
      this.$store.commit('updateBackPrepareData','');
    }
  },
  activated() {
    this.getList();
  },
  methods: {
    getList() {
      let specialQualifications = this.$store.state.specialQualifications;
      console.log(specialQualifications);
      if(specialQualifications != ''){
        this.licenselist = specialQualifications;
        this.serialNum = this.licenselist.length + 2;
      }else{
        this.licenselist = []
      }
    },
    nextStep() {
        if(this.isCheckExplain){
            this.$router.push({
                path: '/business/businessSettled',
                query: {
                    type: this.type,
                    storeType: this.storeType
                }
            })
        }else{
            Toast('请勾选阅读说明');
        }
    },
    // 勾选
    checkExplain() {
        console.log(this.isCheckExplain)
        if(this.isCheckExplain){
            this.isCheckExplain = false;
            this.explainImg = require("../../../assets/img/check@2x.png");
        }else{
            this.isCheckExplain = true;
            this.explainImg = require("../../../assets/img/checked@2x.png");
        }
    },
    openExplain() {
        this.show = true;
    },
    closeExplain() {
        this.show = false;
    }
  }
  
};
</script>
<style scoped lang="less">
.van-notice-bar {
  font-size: 10px !important;
}
.content {
  padding-top: 44px;
  color: #333333;
  .card {
    margin-bottom: 10px;
    padding: 0 15px;
    width: 100%;
    background: #ffffff;
    p {
      height: 44px;
      line-height: 44px;
      font-size: 14px;
    }
    .card-info {
      height: 88px;
      box-shadow: 0px 1px 0px 0px #d8d8d8;
      overflow: hidden;
      display: flex;
      align-items: center;
      img {
        display: block;
        width: 80px;
      }
      div {
        font-size: 12px;
        h4 {
          padding-left: 12px;
          line-height: 40px;
          font-size: 14px;
        }
        div {
          padding-left: 12px;
          line-height: 17px;
          color: #999999;
        }
      }
    }
  }
  .explain {
    padding: 0 15px;
    width: 100%;
    font-size: 12px;
    display: flex;
    align-items: center;
    img {
      display: block;
      margin-right: 10px;
      width: 16px;
    }
    span {
      color: #ff3b30;
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
  max-height: 70vh;
  font-size: 12px;
  overflow-y: scroll;
  p {
    line-height: 17px;
    margin-bottom: 30px;
    font-size: 12px;
    font-weight: bold;
  }
  div {
    line-height: 17px;
    margin-bottom: 30px;
    span{
        color: #007AFF;
    }
  }
}
</style>
