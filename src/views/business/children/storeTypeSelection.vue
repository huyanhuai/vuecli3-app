<template>
  <div class="storeTypeSelection">
    <NavBar :title="title"></NavBar>
    <!-- <div class="twoCategories">
        <div class="oneSelect">
            <ul @click="selectOne">
                <li v-for="(item, index) in categoryList" :key="item.id" :class="{'active' : selectOneIndex==index}" :data-index="index">{{item.name}}</li>
            </ul>
        </div>
        <div class="twoSelect">
            <ul>
                <li v-for="(item, index) in categoryList[selectOneIndex].child" :key="item.id" @click="selectTwo(item.id, index)" :data-index="index">
                    <div>{{item.name}}</div>
                    <img v-if="selectTwoIndex == index" src="../../../assets/img/business/checked@2x.png" alt="">
                </li>
            </ul>
        </div>
    </div>
    <div class="btn">
        <div class="" @click="onNextStep">确认</div>
    </div> -->

    <div class="oneCategory">
        <ul @click="nextStep">
            <li v-for="(item, index) in categoryList" :key="item.id" :data-id="item.id" :data-index="index" type="li">
                {{item.name}}
                <img src="../../../assets/img/business/icon_more@2x.png" alt="">
            </li>
        </ul>
    </div>

  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
export default {
    name: 'storeTypeSelection',
    components: {
        NavBar
    },
    data () {
        return {
            title: '选择店铺类型',
            type: 3,
            id: '',
            categoryList: [],
            selectOneIndex: 0,
            selectTwoIndex: 0
        }
    },
    created () {
        let data = this.$route.query;
        this.type = data.type;
        let list = this.$store.state.businessCategoryList;
        this.categoryList = list.child;
    },
    methods: {
        // twoCategories
        selectOne(e) {
            this.selectOneIndex = e.target.dataset.index;
            this.selectTwoIndex = 0;
        },
        selectTwo(id,index) {
            console.log(id)
            this.id = id;
            this.selectTwoIndex = index;
        },
        onNextStep() {
            let storeType = this.id;
            if(this.categoryList[this.selectOneIndex].child[this.selectTwoIndex].special == '1'){
                this.$store.commit('updateSpecialQualifications', this.categoryList[this.selectOneIndex].child[this.selectTwoIndex].specialName);
            }else{
                this.$store.commit('updateSpecialQualifications', '');
            }
            this.$router.push({
                path: '/business/prepareData',
                query: {
                    type: this.type,
                    storeType: storeType
                }
            })
        },

        // oneCategory
        nextStep(e) {
            let name = e.target.type;
            if(name == 'li'){
                let storeType = e.target.dataset.id;
                console.log(storeType)
                let index = e.target.dataset.index;
                if(this.categoryList[index].special == '1'){
                    this.$store.commit('updateSpecialQualifications', this.categoryList[index].specialName);
                }else{
                    this.$store.commit('updateSpecialQualifications', '');
                }
                this.$router.push({
                    path: '/business/prepareData',
                    query: {
                        type: this.type,
                        storeType: storeType
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
.oneCategory{
    padding-top: 44px;
    width: 100%;
    ul{
        padding: 0 15px;
        li{
            margin-top: 8px;
            padding: 0 25px 0 12px;
            width: 100%;
            height: 52px;
            line-height: 52px;
            font-size: 15px;
            background: #FFFFFF;
            border-radius: 8px;
            position: relative;
            img{
                width: 8.6px;
                height: 10px;
                position: absolute;
                top: 50%;
                right: 12px;
                transform: translate(0, -50%);
                -webkit-transform: translate(0, -50%);
            }
        }
    }
}
.twoCategories{
    padding-top: 44px;
    padding-bottom: 50px;
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    font-size: 14px;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    .oneSelect{
        width: 100px;
        height: 100%;
        overflow-y: scroll;
        background: #F5F6FA;
        ul li{
            height: 48px;
            line-height: 48px;
            overflow: hidden;
            text-align: center;
            &.active{
                background: #FFD210;
            }
        }
    }
    .twoSelect{
        flex: 1;
        overflow-y: scroll;
        overflow-x: hidden;
        ul li{
            padding: 0 15px 0 32px;
            height: 48px;
            line-height: 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            div{
                flex: 1;
                padding-right: 5px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            img{
                width: 24px;
                height: 24px;
            }
        }
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
