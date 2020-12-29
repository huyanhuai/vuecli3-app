<template>
  <div class="businessPartnerType">
    <NavBar :title="title"></NavBar>
    <div class="content">
        <div class="banner">
            <img src="../../../assets/img/businessPartner/businessPartner_banner@2x.png" alt="">
        </div>
        <div class="box">
            <div class="card">
                <div class="card-title"><img src="../../../assets/img/businessPartner/businessPartner_title@2x.png" alt=""></div>
                <ul @click="nextStep">
                    <li><img data-type="0" src="../../../assets/img/businessPartner/businessPartner_serve@2x.png" alt=""></li>
                    <li><img data-type="1" src="../../../assets/img/businessPartner/ICCI@2x.png" alt=""></li>
                    <li><img data-type="2" src="../../../assets/img/businessPartner/ASK@2x.png" alt=""></li>
                </ul>
            </div>

            <div class="word">
                <p>Q1：如何入驻金戈多？ </p>
                <div class="text">答：目前有两种入驻方式。一是自主入驻，您可以自己填写入驻资料，审核通过后即完成入驻；二是业务员协助入驻，若您再自主入驻过程中出现无法解决的问题，请联系平台客服协助入驻。</div>
                <p>Q2：成为事业合伙人需要哪些条件？  </p>
                <div class="text">答：您需要上传身份证，银行卡号等相关资质</div>
                <p>Q3：入驻后什么时候审核完毕? 哪里可以看到审核结果?  </p>
                <div class="text">答：一般自主入驻是在3个工作日内审核完毕。审核结果可以在您提交资料页面查看。</div>
                <p>Q4：入驻后如何修改资料信息？  </p>
                <div class="text">答：由于部分资料属于认证信息。原则上不允许修改，您有特殊情况需修改，请联系平台客户协助。</div>
            </div>
        </div>

        <div class="bottom">
            <img src="../../../assets/img/businessPartner/icon_lianxiwomen@2x.png" alt="">
        </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { apiClass } from "@/utils/index";
import { getBusinessStoreType } from '@/api/index';
export default {
    name: 'businessPartnerType',
    components: {
        NavBar
    },
    data () {
        return {
            title: '入驻快速通道',
        }
    },
    created () {
        
    },
    mounted () {
    //    this.getList();
    },
    methods: {
        nextStep(e) {
            let type = e.target.dataset.type;
            console.log(type);
            // this.getInfo(type);
            this.$router.push({
                path: '/businessPartner/businessPartnerSettled',
                query: {
                    type: type,
                }
            })

        },
        // 获取审核信息
        getInfo(type) {
            getThirdPartyInfo(type)
            .then(res => {
                console.log(res);
                if(res.code == 200){
                    let data = res.data;
                    this.status = data.status;
                    // this.$store.commit('updateBusinessSettledInfo',data);
                    if(data.examining){
                        this.$router.push({
                            path: '/business/busindessPartnerStatus',
                            query: {
                                type: type,
                                status: data.status
                            }
                        })
                    }else{
                        this.$router.push({
                            path: '/business/businessPartnerSettled',
                            query: {
                                type: type
                            }
                        })
                        
                    }
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
.businessPartnerType{
    background: #49C3FF;
}
.content{
    width: 100%;
    padding-top: 44px;
    font-family: PingFangSC-Medium, PingFang SC;
    .banner{
        width: 100%;
        height: 150px;
        overflow: hidden;
        img{
            display: block;
            width: 100%;
        }
    }
    .box{
        padding: 0 15px;
        .card{
            width: 100%;
            height: 156px;
            background: #FFFFFF;
            border-radius: 12px;
            .card-title{
                padding: 12px 0;
                img{
                    display: block;
                    margin: auto;
                    width: 140px;
                }
            }
            ul{
                padding: 0 12px;
                display: flex;
                justify-content: space-between;
                li img{
                    display: block;
                    width: 100px;
                    height: 90px;
                }
            }
        }
        .word{
            margin-top: 12px;
            padding: 24px 12px 20px 12px;
            width: 100%;
            line-height: 22px;
            background: #FFFFFF;
            border-radius: 12px;
            font-size: 12px;
            p{
                margin-top: 32px;
                font-size: 14px;
                font-weight: bold;
                &:first-child{
                    margin-top: 0;
                }
            }
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
</style>
