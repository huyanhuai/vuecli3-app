<template>
  <div class="franchiseFee">
    <NavBar :title="title"></NavBar>
    <div class="content">
        <h2 class="topTitle">加盟费：50，0000元</h2>
        <div class="card">
            <h3>收款方信息</h3>
            <div class="list">
                <p>您需汇款 1,000,000.00 元至以下账户，汇款成功后上传凭证信息，审核通过后到账</p>
                <div class="text">收款方户名：浙江金戈多能源科技有限公司</div>
                <div class="text">收款方开户行：xxxx银行</div>
                <div class="text">收款方账户：571907821710904 <span>复制</span></div>
            </div>
        </div>
        
        <div class="card">
            <h3>付款方信息</h3>
            <div class="form">
                <van-field v-model="userName" label="付款户名：" placeholder="请输入付款户名" :border="false" />
                <van-field v-model="userName" label="付款账号：" placeholder="请输入付款账号" :border="false"/>
                <van-field v-model="userName" label="汇款交易单号：" placeholder="请输入付款交易单号" :border="false"/>
                <van-field v-model="userName" label="付款时间：" placeholder="请选择付款时间" :border="false" readonly :right-icon="dateIcon"/>
            </div>
        </div>
    </div>

    <div class="btn">
      <div class="" @click="submit">提交</div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { Field, ActionSheet, Toast } from 'vant';
import { getBusinessStoreType } from '@/api/index';
export default {
    name: 'franchiseFee',
    components: {
        NavBar
    },
    data () {
        return {
            title: '缴纳加盟费',
            userName: '',
            dateIcon: require('../../../assets/img/icon_date@2x.png'),
        }
    },
    created () {
        
    },
    mounted () {
    //    this.getList();
    },
    methods: {
        submit(e) {
            let type = e.target.dataset.type;
            console.log(type);
            this.$router.push({
                path: '/businessPartner/businessPartnerSettled',
                query: {
                    type: type,
                }
            })

        },
        // 获取入驻分类
        getList() {
            getBusinessStoreType()
            .then(res => {
                console.log(res);
                if(res.code == 200){
                    let data = res.data;
                    this.list = data[0].child.concat(data[1].child);
                    console.log(this.list)
                    // this.$store.commit('updateBusinessSettledInfo',data);
                    
                }
            })
        }
    },
    beforeRouteLeave(to, from, next){
        console.log(to)
        console.log(from)
        if(to.meta.title == '合伙人'){
            apiClass.closeWebview();
        }else{
            next();
        }
        
    },
    
}
</script>
<style scoped lang="less">
.van-cell{
    padding: 6px 12px;
}
/deep/ .van-field .van-field__label{
    width: 100px;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    color: #333333;
}
/deep/ .van-field__body{
    padding-left: 12px;
    padding-right: 12px;
    height: 44px;
    border: 1px solid rgba(176, 178, 191, .8);
}
/deep/ .van-icon__image{
  width: 26px;
  height: 26px;
  display: block;
}
.content{
    width: 100%;
    padding-top: 44px;
    padding: 44px 15px 0 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    .topTitle{
        padding: 16px 0;
        line-height: 25px;
        font-size: 18px;
    }
    .card{
        margin-bottom: 10px;
        width: 100%;
        background: #FFFFFF;
        border-radius: 8px;
        overflow: hidden;
        h3{
            padding: 0 12px;
            height: 48px;
            line-height: 48px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            font-size: 14px;
        }
        .list{
            padding: 12px;
            p{
                line-height: 20px;
                font-size: 14px;
                font-weight: bold;
            }
            .text{
                margin-top: 8px;
                line-height: 20px;
                font-size: 14px;
                span{
                    padding: 0 6px;
                    color: #3F9BFF;
                }
            }
        }

        .form{
            padding: 6px 0;
        }
    }
    
    .bottom{
        padding: 16px 0 30px 0;
        img{
            display: block;
            margin: auto;
            width: 127px;
            height: 32px;
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
    text-align: center;
    border-radius: 20px;
    background: #fcc100;
  }
}
</style>
