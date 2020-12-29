<template>
  <div class="index">
    <NavBar :title="title"></NavBar>
    <div class="content">
        <van-tabs v-model="active" sticky :offset-top="navH" title-inactive-color="#333333" @click="changeTab">
            <van-tab v-for="item in titleArr" :key="item" :title="item">
                <div class="list">
                    <!-- <div class="card">
                        <div class="card-title">
                            <img class="icon" src="../../../assets/img/activity/shijian@2x.png" alt="">
                            <div class="name">活动名称</div>
                            <div class="countdown">剩余 <span>12:55:42</span></div>
                            <div class="status">未开始</div>
                        </div>
                        <div class="card-box">
                            <ul>
                                <li class="goods">
                                    <div class="goods-img"><img src="../../../assets/img/logo.png" alt=""></div>
                                    <div class="goods-price">¥889.99</div>
                                    <div class="goods-originalPrice">¥999.99</div>
                                </li>
                                <li class="more">查看更多</li>
                            </ul>
                        </div>
                        <div class="card-btn" @click.stop="onBtn">
                            <ul>
                                <li data-type="0" data-index="0">活动编辑</li><li data-type="1" data-index="0">商品管理</li>
                                <li data-type="2" data-index="0">立即开始</li><li data-type="3" data-index="0">删除</li>
                            </ul>
                        </div>
                    </div> -->

                    <div class="card" v-for="(itemA, index) in list" :key="index">
                        <div class="card-title">
                            <img class="icon" src="../../../assets/img/activity/shijian@2x.png" alt="">
                            <div class="name">{{itemA.name}}</div>
                            <div v-if="itemA.status === '进行中'" class="countdown">剩余 
                                <!-- <span>12:55:42</span>  -->
                                <van-count-down :time="itemA.endSecond*1000" format="HH:mm:ss">
                                    <!-- <template #default="timeData">
                                        <span>{{ timeData.hours }}:{{ timeData.minutes }}:{{ timeData.seconds }}</span> 
                                    </template> -->
                                </van-count-down>
                            </div>
                            <div class="status">{{itemA.status}}</div>
                        </div>
                        <div class="card-box">
                            <ul>
                                <li class="goods" v-for="(goods, goodsIndex) in itemA.goodsList" :key="goodsIndex">
                                    <div class="goods-img"><img :src="goods.headIcon" alt=""></div>
                                    <div class="goods-price">¥{{goods.activityPrice}}</div>
                                    <div class="goods-originalPrice">¥{{goods.price}}</div>
                                </li>
                                <li v-if="itemA.goodsList.length >= 8" class="more" @click.stop="onBtn" data-type="1" :data-index="index" :data-id="itemA.activityId">查看更多</li>
                            </ul>
                        </div>
                        <div class="card-btn" @click.stop="onBtn">
                            <ul>
                                <li data-type="0" :data-index="index" :data-id="itemA.activityId">{{itemA.status === "已结束" ? '活动详情' : '活动编辑'}}</li>
                                <li v-if="itemA.status !== '已结束'" data-type="1" :data-index="index" :data-id="itemA.activityId">商品管理</li>
                                <li v-if="itemA.status === '未开始'" data-type="2" :data-index="index" :data-id="itemA.activityId">立即开始</li>
                                <li v-if="itemA.status !== '进行中'" data-type="3" :data-index="index" :data-id="itemA.activityId">删除</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </van-tab>
            
        </van-tabs>

        <div class="blank"></div>
        <img class="add" @click="createActivity" src="../../../assets/img/activity/icon_tianjia@2x.png" alt="">
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { Dialog, Toast, List, CountDown } from 'vant';
import { apiClass, nativeFunction } from "@/utils/index";
import { getActivityList, activityStartNow, activityDelete } from '@/api/index';
export default {
    name: 'index',
    components: {
        NavBar,
        vanCountDown: CountDown
    },
    data () {
        return {
            title: '活动管理',
            active: 0,
            navH: '',
            titleArr: ['秒杀', '折扣', '促销活动'],
            list: [],
            pageNum: 0,
            loading: false,
            finished: false,
        }
    },
    created () {
        let arr = [[0, 1], [2, 3], [4,[5,6,7]]]
        const newArr = function(arr){
        return arr.reduce((pre,cur)=>pre.concat(Array.isArray(cur)?newArr(cur):cur),[])
        }
        console.log(newArr(arr));
    },
    mounted () {
        this.navH = this.$store.state.navH;
        let activityType = this.$store.state.activityType;
        this.changeTab(activityType);
        this.$store.commit('updateActivityType', 0);
        this.$store.commit('updateTimeSlots','');
        this.$store.commit('updateActivityCheckedGoods','');
        this.$store.commit('updateActivityGoods','');
    },
    methods: {
        // 切换活动
        changeTab(e) {
            console.log(e);
            this.active = e;
            this.list = [];
            this.getActivityList();
        },
        // 活动设置
        onBtn(e){
            let type = e.target.dataset.type;
            let index = e.target.dataset.index;
            let activityId = e.target.dataset.id;
            if(type === "0") {
                this.$router.push({
                    path: '/activityCreate',
                    query: {
                        type: this.active,
                        edit: '1',
                        status: this.list[index].status,
                        activityId: activityId
                    }
                })
            }
            if(type === "1") {
                this.$router.push({
                    path: '/activityManager/activitySet',
                    query: {
                        type: this.active,
                        edit: '1',
                        status: this.list[index].status,
                        activityId: activityId
                    }
                })
            }
            if(type === "2"){
                Dialog.confirm({
                    title: '立即开始',
                    message: '开始后，买家可以立即参加活动',
                    cancelButtonColor: '#FF3B30'
                })
                .then(() => {
                    // on confirm
                    this.startNow(activityId, index);
                })
                .catch(() => {});
            }
            if(type === "3"){
                Dialog.confirm({
                    title: '删除',
                    message: '确认删除活动？删除后，活动不可恢复。',
                    cancelButtonColor: '#FF3B30'
                })
                .then(() => {
                    // on confirm
                    this.deleteActivity(activityId, index);
                })
                .catch(() => {});
            }
        },
        // 立即开始
        startNow(activityId, index) {
            activityStartNow({activityId: activityId})
            .then(res => {
                if(res.code == 200){
                    this.$set(this.list[index], 'status', "进行中");
                    this.$set(this.list[index], 'endSecond', res.data);
                }
            })
        },
        // 删除活动
        deleteActivity(activityId, index) {
            activityDelete({activityIds: activityId})
            .then(res => {
                if(res.code == 200){
                    this.list.splice(index, 1);
                }
            })
        },

        // 创建活动
        createActivity() {
            this.$router.push({
                path: '/activityCreate',
                query: {
                    type: this.active,
                    edit: '0'
                }
            })
        },
        
        // 获取活动列表
        getActivityList(){
            let params = {
                activityStatus: 2
            };
            switch (this.active) {
                case 0:
                    params.activityStatus = 2;
                    break;
                case 1:
                    params.activityStatus = 3;
                    break;
                case 2:
                    params.activityStatus = 7;
                    break;
            }
            getActivityList(params)
            .then(res => {
                if(res.code == 200){
                    let data = res.data;
                    this.list = data;
                }
            
            })
        }
    }
}
</script>
<style scoped lang="less">
/deep/ .van-tab--active{
    font-size: 16px;
    font-weight: bold;
}
/deep/ .van-tabs__line{
    background-color: #FFD210;
    border-radius: 2px;
}
.van-count-down{
    display: inline-block;
    margin-left: 4px;
    margin-right: 12px;
    padding: 0 10px;
    height: 18px;
    line-height: 18px;
    background: #F5F6FA;
    border-radius: 10px;
    font-size: 12px;
    color: #FE2B21;
}
.content{
    padding-top: 44px;
    .list{
        padding: 0 15px;
        .card{
            margin-top: 10px;
            width: 100%;
            background: #FFFFFF;
            border-radius: 4px;
            .card-title{
                padding: 0 12px;
                height: 48px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                overflow: hidden;
                .icon{
                    display: block;
                    width: 16px;
                    height: 17px;
                }
                .name{
                    flex: 1;
                    padding: 0 8px;
                    font-size: 14px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .status{
                    font-size: 12px;
                    color: #FF9500;
                }
                .countdown{
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    span{
                        display: inline-block;
                        margin-left: 4px;
                        margin-right: 12px;
                        padding: 0 10px;
                        height: 18px;
                        line-height: 18px;
                        background: #F5F6FA;
                        border-radius: 10px;
                        font-size: 12px;
                        color: #FE2B21;
                    }
                }
            }
            .card-box{
                padding: 0 12px;
                ul{
                    padding-bottom: 12px;
                    width: 100%;
                    overflow-x: scroll;
                    display: flex;
                    .goods{
                        margin-right: 8px;
                        width: 72px;
                        .goods-img{
                            width: 100%;
                            img{
                                display: block;
                                width: 100%;
                            }
                        }
                        .goods-price{
                            padding: 4px 0;
                            font-size: 12px;
                            color: #FF3B30;
                            text-align: center;
                        }
                        .goods-originalPrice{
                            font-size: 10px;
                            color: #999999;
                            text-decoration: line-through;
                            text-align: center;
                        }
                    }
                    .more{
                        width: 30px;
                        padding: 21px 8px;
                        line-height: 16px;
                        font-size: 12px;
                        color: #999999;
                        background: #F5F6FA;
                        border-radius: 2px;
                    }
                }
            }
            .card-btn{
                border-top: 1px solid #E5E5E5;
                ul{
                    height: 44px;
                    line-height: 44px;
                    font-size: 12px;
                    color: #999999;
                    display: flex;
                    justify-content: flex-end;
                    li{
                        width: 25%;
                        text-align: center;
                        position: relative;
                        &:not(:last-child)::after{
                            content: '';
                            width: 1px;
                            height: 12px;
                            background: #D8D8D8;
                            position: absolute;
                            right: 0;
                            top: 50%;
                            transform: translate(0, -50%);
                            -webkit-transform: translate(0, -50%);
                        }
                    }
                }
            }
        }
    }
    .add{
        width: 60px;
        position: fixed;
        bottom: 34px;
        left: 50%;
        z-index: 100;
        transform: translate(-50%, 0);
        -webkit-transform: translate(-50%, 0);
    }
    .blank{
        width: 100%;
        height: 100px;
    }
}
</style>
