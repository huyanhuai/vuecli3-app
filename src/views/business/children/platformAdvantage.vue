<template>
  <div class="platformAdvantage">
    <NavBar :title="title" :border="border"></NavBar>
    <div class="content">
        <img v-if="type == 3 || type == 4 || type == 5" src="../../../assets/img/business/fresh.png" alt="">
        <img v-else src="../../../assets/img/business/company.png" alt="">
    </div>
    <div class="btn">
        <div class="" @click="nextStep">立即入驻</div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
export default {
    name: 'platformAdvantage',
    components: {
        NavBar
    },
    data () {
        return {
            border: true,
            title: '金戈多-',
            type: 3
        }
    },
    created () {
        let data = this.$route.query;
        this.title = '金戈多-' + data.title;
        this.type = data.type;
    },
    methods: {
        nextStep() {
            let businessCategoryList = this.$store.state.businessCategoryList;
            if(businessCategoryList.child.length == 0){
                if(businessCategoryList.special == '1'){
                    this.$store.commit('updateSpecialQualifications', businessCategoryList.specialName);
                }else{
                    this.$store.commit('updateSpecialQualifications', '');
                }
                this.$router.push({
                    path: '/business/prepareData',
                    query: {
                        type: this.type,
                        storeType: businessCategoryList.id
                    }
                })
            }else{
                this.$router.push({
                    path: '/business/storeTypeSelection',
                    query: {
                        type: this.type,
                    }
                }) 
            }
            

        }
    },
    mounted () {
        
    }
}
</script>
<style scoped lang="less">
.content{
    padding: 64px 15px 100px 15px;
    width: 100%;
    background: #FFFFFF;
    img{
        display: block;
        width: 100%;
    }
}
.btn{
    padding: 0 17px;
    width: 100%;
    height: 50px;
    background: #FFFFFF;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    div{
        margin-top: 7px;
        width: 100%;
        height: 36px;
        line-height: 36px;
        font-size: 18px;
        font-weight: bold;
        color: #FFFFFF;
        text-align: center;
        border-radius: 20px;
        background: #FCC100;
    }
}
</style>
