<template>
  <div class="searchProducts">
    <NavBar :title="title" :border="true"></NavBar>
    <div class="search"><van-search v-model="keyword" placeholder="请输入搜索关键词" background="#FFFFFF"  @search="onSearch" @clear="onClear"/></div>

    <div class="content">
        <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="getList"
        >
            <ul class="list">

                <li class="goods" v-for="(item, index) in goodsList" :key="index" @click="checkGoods(index)">
                    <div class="check">
                        <img v-show="!item.ifParticipateActivity && !item.isCheck" src="../../../assets/img/icon_weixuanzhong@2x.png" alt="">
                        <img v-show="!item.ifParticipateActivity && item.isCheck" src="../../../assets/img/checked@2x.png" alt="">
                        <img v-show="item.ifParticipateActivity" src="../../../assets/img/icon_bunengxuan@2x.png" alt="">
                    </div>
                    <div class="goods-info">
                        <div v-if="item.ifParticipateActivity" class="goods-shade"></div>
                        <div class="goods-img"><img :src="item.headIcon" alt=""></div>
                        <div class="goods-detail">
                            <div class="goods-name">{{item.title}}</div>
                            <div class="goods-sku"><span v-for="(skuItem, skuIndex) in item.firstSpecificationList" :key="skuIndex">{{skuItem.value}}{{skuIndex == item.firstSpecificationList.length-1 ? '' : ';'}}</span></div>
                            <div v-if="item.ifParticipateActivity" class="goods-activity">
                                <img v-if="item.activityInfo.activityStatus == 2" src="../../../assets/img/activity/img_seckill@2x.png" alt="">
                                <img v-else-if="item.activityInfo.activityStatus == 7" src="../../../assets/img/activity/img_promotion@2x.png" alt="">
                                <div v-else-if="item.activityInfo.activityStatus == 3" class="goods-activity-discount">折扣</div>
                                <div class="goods-activity-text">同一时间已参加同类活动</div>
                            </div>
                            <div class="goods-price">¥ <span>{{item.salesPrice}}</span></div>
                        </div>
                    </div>
                </li>
            </ul>
        </van-list>
    </div>

    <div class="btn">
      <div class="check" @click="checkAllGoods">
        <img v-show="!checkAll" src="../../../assets/img/icon_weixuanzhong@2x.png" alt=""> 
        <img v-show="checkAll" src="../../../assets/img/checked@2x.png" alt=""> 
        <span>全选</span>（已选中{{checkNums}}件商品）
      </div>
      <div class="confirm" @click="save">确定</div>
    </div>
    <div class="blank"></div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { Search } from 'vant';
import { getActivityChooseGoods } from '@/api/index';
export default {
    name: 'searchProducts',
    components: {
        NavBar,
        vanSearch: Search
    },
    data () {
        return {
            title: '',
            status: '',
            loading: false,
            finished: false,
            goodsList: [],
            checkAll: false,
            timeArr: [],
            pageNum: 0,
            checkNums: 0,
            keyword: ''
        }
    },
    created () {
        let data = this.$route.query;
        this.activityId = data.activityId;

        let timeSlots = this.$store.state.timeSlots;
        if(timeSlots != ''){
            for (let i = 0; i < timeSlots.length; i++) {
                let startTime = timeSlots[i].startTime.replace(/\./g, '-') + ":00";
                let endTime = timeSlots[i].endTime.replace(/\./g, '-') + ":00";
                this.timeArr.push(startTime + '~' + endTime);
            }
        }
    },
    mounted () {
        
    },
    methods: {
        onSearch(e) {
            console.log(e);
            if(e == '') return false;
            this.keyword = e;
            this.finished = true;
            this.checkAll = false;
            this.checkNums = 0;
            this.pageNum = 0;
            this.goodsList = [];
            this.getList();
        },
        onClear(e) {
            this.keyword = '';
        },
        // 选择商品
        checkGoods(index) {
            if(this.goodsList[index].ifParticipateActivity) return false;
            let checked = this.goodsList[index].isCheck;
            this.$set(this.goodsList[index], 'isCheck', !checked);
            if(!checked) {
                this.checkNums++
            }else{
                this.checkNums--
            }

            let goodsList = this.goodsList, isCheckAll = true;
            for (let i = 0; i < goodsList.length; i++) {
                if(!goodsList[i].isCheck && !goodsList[i].ifParticipateActivity){
                    isCheckAll = false;
                    break;
                }
            }
            this.checkAll = isCheckAll;
        },
        // 全选
        checkAllGoods() {
            this.checkAll = !this.checkAll;
            let goodsList = this.goodsList;            
            this.checkNums = 0;
            for (let i = 0; i < goodsList.length; i++) {
                if(!goodsList[i].ifParticipateActivity){
                    goodsList[i].isCheck = this.checkAll;
                    this.checkNums++
                }
            }
            if(!this.checkAll) {
                this.checkNums = 0;
            }
        },
        // 保存
        save() {
            let list = [], goodsList = this.goodsList;
            if(this.checkAll){
                list = goodsList;
            }else{
                for (let i = 0; i < goodsList.length; i++) {
                    if(goodsList[i].isCheck){
                        list.push(goodsList[i]);
                    }
                }
            }
            let activityCheckedGoods = this.$store.state.activityCheckedGoods;
            this.$store.commit('updateActivityCheckedGoods',list);
            console.log(this.$store.state.activityCheckedGoods);
            this.$router.go(-2);
        },

        // 商品列表
        getList() {
            let params = {
                pageNum: this.pageNum++,
                pageSize: 10,
                keyword: this.keyword
            };
            if(this.activityId){
                params.activityId = this.activityId;
            }
            if(this.timeArr.length > 0){
                params.timeSlots = this.timeArr.join(",");
            }
            getActivityChooseGoods(params)
            .then(res => {
                // 加载状态结束
                this.loading = false;
                if(res.code == 200){
                    let list = res.data;
                    if(!list || list.length < 10){
                        this.finished = true;
                    }
                    this.checkAll = false;
                    for (let i = 0; i < list.length; i++) {
                        let specificationList = list[i].specificationList;
                        for (let j = 0; j < specificationList.length; j++) {
                            specificationList[j].specifications = JSON.parse(specificationList[j].specifications);
                            
                        }
                        specificationList.sort(function (a, b) { // 这是比较函数
                            return a.price - b.price;
                        })
                        list[i].specificationList = specificationList;
                        list[i].firstSpecificationList = specificationList[0].specifications;
                        list[i].isCheck = false;
                    }
                    console.log(list)
                    this.goodsList.push.apply(this.goodsList, list);
                }
            })
            .catch(err => {
                this.loading = false;
            })
            
        }
        
    },
    beforeRouteLeave(to, from, next) {
        if (to.meta.title == "商品管理") {
            to.meta.isBack = true;
        }
        next();
    }
}
</script>
<style scoped lang="less">
.searchProducts{
    background: #FFFFFF;
}
.van-search{
    padding: 0;
    height: 44px;
}
.van-search__content{
    border-radius: 20px;
}
.search{
    height: 44px;
    position: fixed;
    right: 40px;
    left: 40px;
    top: 0;
    z-index: 101;
}
.content{
    padding-top: 44px;
    .list{
        padding-right: 15px;
        .goods{
            margin-top: 10px;
            width: 100%;
            display: flex;
            .check{
                padding-left: 15px;
                width: 45px;
                height: 85px;
                display: flex;
                align-items: center;
                img{
                    width: 18px;
                }
            }
            .goods-info{
                flex: 1;
                display: flex;
                position: relative;
                .goods-img{
                    width: 85px;
                    height: 85px;
                    overflow: hidden;
                    img{
                        width: 100%;
                    }
                }
                .goods-detail{
                    padding-left: 8px;
                    flex: 1;
                    font-size: 14px;
                    .goods-name{
                        line-height: 20px;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                    .goods-sku{
                        margin-top: 4px;
                        font-size: 12px;
                        color: #999999;
                    }
                    .goods-price{
                        margin-top: 4px;
                        color: #FF3B30;
                        font-size: 9px;
                        span{
                            font-size: 14px;
                            font-weight: bold;
                        }
                    }
                    .goods-activity{
                        margin-top: 4px;
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        img{
                            width: 61px;
                        }
                        .goods-activity-discount{
                            padding: 0 7px;
                            height: 16px;
                            line-height: 16px;
                            border: 1px solid #FF3B30;
                            color: #FF3B30;
                        }
                        .goods-activity-text{
                            margin-left: 12px;
                            width: 148px;
                            height: 20px;
                            line-height: 20px;
                            background: #FFE7E4;
                            border-radius: 10px;
                            color: #FF3B30;
                            text-align: center;
                        }
                    }
                }
            }
            .goods-shade{
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.8);
                position: absolute;
            }
        }
    }
}

.btn {
  padding: 0 15px;
  width: 100%;
  height: 50px;
  background: #ffffff;
  border-top: 1px solid #E5E5E5;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .check{
      line-height: 50px;
      font-size: 14px;
      display: flex;
      align-items: center;
      color: #999999;
      img{
          width: 20px;
      }
      span{
        padding-left: 8px;
        color: #333333;
      }
  }
  .confirm{
      width: 76px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      font-size: 14px;
      background: #FFD210;
      border-radius: 14px;
  }
}
.blank{
    width: 100%;
    height: 60px;
}
</style>
