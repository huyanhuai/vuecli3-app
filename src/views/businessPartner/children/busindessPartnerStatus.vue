<template>
  <div class="busindessPartnerStatus">
    <NavBar :title="title"></NavBar>
    <div class="content">
        <div class="auditImg">
            <img src="../../../assets/img/businessPartner/audit@2x.png" alt="">
        </div>
        <p>{{statusName}}</p>
        <div class="audit-text">我们将会在审核完成后以短信的形式通知您审核结果</div>
        <div class="audit-fail">我们将会在审核完成后以短信的形式通知您审核结果</div>

        <div v-if="status !== '1' && status !== ''" class="btn">
            <div class="btn-enter" @click="nextStep(0)">重新入驻</div>
            <div v-if="status === '3'" class="btn-enter" @click="nextStep(1)">已认证，缴纳加盟费</div>
        </div>

    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { apiClass } from "@/utils/index";
export default {
    name: 'busindessPartnerStatus',
    components: {
        NavBar
    },
    data () {
        return {
            title: '',
            status: '',
            statusName: '我们正在加快审核中，请耐心等待~',
            remark: ''
        }
    },
    created () {
        let data = this.$route.query;
        this.status = data.status;
        let type = data.type.toString();

        switch (data.status) {
            case '0':
                this.statusName = '待审核'
                break;
            case '1':
                this.statusName = '我们正在加快审核中，请耐心等待~'
                break;
            case '2':
                this.statusName = '审核成功'
                break;
            case '3':
                this.statusName = '审核失败'
                break;
            default:
                break;
        }
    },
    mounted () {
        this.businessSettledInfo = this.$store.state.businessSettledInfo;
        if(this.status == '3'){
          this.remark = this.businessSettledInfo.remark;
        }
        
    },
    methods: {
        nextStep(index) {
            if(index == 0){
                let storeType = this.businessSettledInfo.classificationId;
                let id = this.businessSettledInfo.classificationTypeId;
                this.$router.push({
                    path: '/business/businessPartnerSettled',
                    query: {
                        type: type
                    }
                })
            }else{
                this.$router.push({
                    path: '/businessPartner/franchiseFee',
                    query: {}
                })
            }
            

        }
    },
    beforeRouteLeave(to, from, next){
        console.log(to)
        console.log(from)
        if(to.meta.title == '合伙人' || (to.meta.title == '入驻' && this.status != '3')){
            apiClass.closeWebview();
        }else{
            next();
        }
    },
    
}
</script>
<style scoped lang="less">
.content{
    padding-top: 44px;
    width: 100%;
    height: 100%;
    background: #F5F6FA;
    overflow: hidden;
    .auditImg{
        padding-top: 60px;
        img{
            display: block;
            margin: auto;
            width: 120px;
            height: 120px;
        }
    }
    p{
        font-size: 14px;
        color: #666666;
        text-align: center;
    }
    .audit-text{
        margin-top: 8px;
        font-size: 12px;
        color: #999999;
        text-align: center;
    }
    .audit-fail{
        margin-top: 8px;
        padding: 0 28px;
        line-height: 20px;
        font-size: 14px;
        color: #FF3B30;
        text-align: center;
    }

    .btn{
        margin-top: 50px;
        padding: 0 15px;
        div{
            margin: auto;
            width: 300px;
            height: 36px;
            line-height: 36px;
            font-size: 16px;
            text-align: center;
            border-radius: 20px;
        }
        .btn-enter{
            background: linear-gradient(180deg, #FFD210 0%, #FCC100 100%);
        }
    }
}
</style>
