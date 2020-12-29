<template>
  <div class="businessType">
    <NavBar :title="title" :border="border"></NavBar>
    <div class="content">
        <div class="list">
            <p>商家入驻</p>
            <ul >
                <li @click="nextStep(0, 4)">
                    <div class="li-head"><img src="../../../assets/img/business/icon_shengxiancaichang@2x.png" alt=""></div>
                    <div class="li-content">
                        <div>生鲜菜场入驻</div>
                        <div>同城配送，抢鲜一步</div>
                    </div>
                    <div class="li-more"><img src="../../../assets/img/business/icon_more@2x.png" alt=""></div>
                </li>
                <li @click="nextStep(1, 5)">
                    <div class="li-head"><img src="../../../assets/img/business/icon_bianlishangchao@2x.png" alt=""></div>
                    <div class="li-content">
                        <div>超市入驻</div>
                        <div>同城配送，抢鲜一步</div>
                    </div>
                    <div class="li-more"><img src="../../../assets/img/business/icon_more@2x.png" alt=""></div>
                </li>
                <li @click="nextStep(2, 3)">
                    <div class="li-head"><img src="../../../assets/img/business/icon_zongheshangjia@2x.png" alt=""></div>
                    <div class="li-content">
                        <div>综合商家入驻</div>
                        <div>美食、服饰箱包、母婴儿童、美妆个护、家居百货药店、3C数码、出行车品、运动户外、鲜花礼品宠物用品、珠宝首饰、钟表/眼镜、图文音像</div>
                    </div>
                    <div class="li-more"><img src="../../../assets/img/business/icon_more@2x.png" alt=""></div>
                </li>
            </ul>
        </div>
        <div class="list" style="margin-top:10px;">
            <p>供应商入驻</p>
            <ul>
                <li @click="nextStep(3, 6)">
                    <div class="li-head"><img src="../../../assets/img/business/icon_qiye@2x.png" alt=""></div>
                    <div class="li-content">
                        <div>企业入驻</div>
                        <div>线上线下融合，发现更多商机</div>
                    </div>
                    <div class="li-more"><img src="../../../assets/img/business/icon_more@2x.png" alt=""></div>
                </li>
                <li @click="nextStep(4, 7)">
                    <div class="li-head"><img src="../../../assets/img/business/icon_wholesale@3x.png" alt=""></div>
                    <div class="li-content">
                        <div>批发入驻</div>
                        <div>线上线下融合，发现更多商机</div>
                    </div>
                    <div class="li-more"><img src="../../../assets/img/business/icon_more@2x.png" alt=""></div>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { apiClass } from "@/utils/index";
import { getBusinessStoreType } from '@/api/index';
export default {
    name: 'businessType',
    components: {
        NavBar
    },
    data () {
        return {
            title: '招牌/合作',
            border: true,
            nameArr:['生鲜菜场入驻','超市入驻','综合商家入驻','企业入驻','批发入驻'],
            list: [],
            categoryList: []
        }
    },
    created () {
        
    },
    mounted () {
       this.getList();
    },
    methods: {
        nextStep(e, id) {
            let type = e;
            let list = this.list;
            for (let i = 0; i < list.length; i++) {
                if(id == list[i].id){
                    this.categoryList = list[i];
                }
            }
            
            this.$store.commit('updateBusinessCategoryList',this.categoryList);
            this.$router.push({
                path: '/business/platformAdvantage',
                query: {
                    title: this.nameArr[type],
                    type: id,
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
        if(to.meta.title == '首页'){
            apiClass.closeWebview();
        }else{
            next();
        }
        
    },
    
}
</script>
<style scoped lang="less">
.content{
    width: 100%;
    padding-top: 44px;
    font-family: PingFangSC-Medium, PingFang SC;
    .list{
        padding: 0 15px;
        background: #FFFFFF;
        p{
            width: 100%;
            height: 44px;
            line-height: 44px;
            font-size: 16px;
            font-weight: bold;
            color: #333333;
        }
        ul{
            padding-bottom: 12px;
        }
        ul li{
            display: flex;
            padding: 4px 0;
            margin-top: 12px;
            .li-head{
                width: 48px;
                height: 48px;
                overflow: hidden;
                img{
                    display: block;
                    width: 100%;
                }
            }
            .li-content{
                flex: 1;
                padding: 0 12px;
                font-size: 16px;
                div:first-child{
                    height: 22px;
                    line-height: 22px;
                }
                div:last-child{
                    margin-top: 4px;
                    line-height: 20px;
                    font-size: 14px;
                    color: #999999;
                }
            }
            .li-more{
                img{
                    margin-top: 10px;
                    width: 8.6px;
                    height: 10px;
                }
            }
        }
    }
}
</style>
