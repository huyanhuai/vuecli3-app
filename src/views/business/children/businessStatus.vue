<template>
  <div class="businessStatus">
    <NavBar :title="title"></NavBar>
    <div class="content">
        <h2>{{statusName}}</h2>
        <p v-if="status === '3'">您申请成为 源头企业 的资料审核失败：</p>
        <div v-if="status === '3'" class="text" v-html="remark">
        </div>

        <div v-if="status === '1'" class="text">
            您申请成为<span>{{name}}</span>的资料已提交至后台，我们将会尽快告知您审核结果
        </div>

        <div v-if="status === '0'" class="text">
            您申请成为<span>{{name}}</span>的资料已提交至后台，我们将会在3-5个工作日内告知审核结果
        </div>
        

        <div v-if="status !== '1' && status !== ''" class="btn">
            <div class="btn-enter" @click="nextStep(0)">重新入驻</div>
            <div v-if="status === '3'" class="btn-change" @click="nextStep(1)">修改资料</div>
        </div>

        <div class="question">入驻遇到问题？</div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { apiClass } from "@/utils/index";
export default {
    name: 'businessStatus',
    components: {
        NavBar
    },
    data () {
        return {
            title: '',
            status: '',
            statusName: '',
            name: '',
            remark: ''
        }
    },
    created () {
        let data = this.$route.query;
        this.status = data.status;
        let type = data.id.toString();
        switch (type) {
            case '4':
                this.name = '生鲜店主';
                break;
            case '5':
                this.name = '便利商超';
                break;
            case '3':
                this.name = '零售商';
                break;
            case '6':
                this.name = '源头企业';
                break;
            case '7':
                this.name = '批发商';
                break;
            default:
                break;
        }
        switch (data.status) {
            case '0':
                this.statusName = '资料待审核'
                break;
            case '1':
                this.statusName = '资料审核中'
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
            if(index == 1){
                let storeType = this.businessSettledInfo.classificationId;
                let id = this.businessSettledInfo.classificationTypeId;
                this.$router.push({
                    path: '/business/businessSettled',
                    query: {
                        type: id,
                        edit: index,
                        storeType: storeType
                    }
                })
            }else{
                this.$router.push({
                    path: '/business/businessType',
                    query: {}
                })
            }
            

        }
    },
    beforeRouteLeave(to, from, next){
        console.log(to)
        console.log(from)
        if(to.meta.title == '首页' || (to.meta.title == '入驻' && this.status != '3')){
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
    background: #FFFFFF;
    overflow: hidden;
    h2{
        margin: 50px 0 30px 0;
        padding-left: 30px;
        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
    }
    p{
        padding: 0 30px;
        line-height: 20px;
        font-size: 14px;
        font-weight: bold;
    }
    .text{
        min-height: 140px;
        margin-top: 9px;
        padding: 0 30px;
        line-height: 20px;
        font-size: 14px;
        span{
            color: #3F9BFF;
        }
    }
    .btn{
        margin-top: 50px;
        padding: 0 15px;
        div{
            margin-bottom: 20px;
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            text-align: center;
            border-radius: 20px;
        }
        .btn-enter{
            background: linear-gradient(180deg, #FFD210 0%, #FCC100 100%);
            color: #FFFFFF;
            font-weight: bold;
        }
        .btn-change{
            background: #F2F3F6;
            border: 1px solid #E5E5E5;
        }
    }
    .question{
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translate(-50%, 0);
        font-size: 12px;
        color: #999999;
        text-decoration: underline;
    }
}
</style>
