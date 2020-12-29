<template>
  <div class="activityCreate">
    <NavBar :title="title"></NavBar>
    <div class="content">
        <div class="form">
            <h2>基本信息</h2>
            <div class="cell">
                <p>活动名称</p>
                <div class="inp"><div v-if="status === '已结束'" class="shade"></div> <van-field v-model="name" label="" placeholder="请输入活动名称" maxlength="6"/></div>
            </div>
            <div class="cell">
                <p>活动说明</p>
                <div class="inp"><div v-if="status === '已结束'" class="shade"></div> <van-field v-model="description" label="" type="textarea" rows="2" autosize placeholder="请输入活动说明" maxlength="30" show-word-limit/></div>
            </div>
            <div class="cell">
                <p>活动时间
                    <span v-if="status !== '已结束'" class="addTimes" @click="addTimes">添加时间段<img src="../../../assets/img/activity/icon_add@2x.png" alt=""></span>
                </p>
                <div class="cell-time" v-for="(item, index) in timeList" :key="index">
                    <div class="datetime" @click="openPicker(index, 'startTime')"><div v-if="status === '已结束' ||  status === '进行中'" class="shade"></div><span class="prompt" v-if="item.startTime == ''">开始时间</span> <span v-else>{{item.startTime}}</span><img src="../../../assets/img/activity/icon_date@2x.png" alt=""></div>
                    <div class="line"></div>
                    <div class="datetime" @click="openPicker(index, 'endTime')"><span class="prompt" v-if="item.endTime == ''">结束时间</span> <span v-else>{{item.endTime}}</span><img src="../../../assets/img/activity/icon_date@2x.png" alt=""></div>
                    <div class="delete" ><img v-if="index != 0 && status !== '已结束'" @click="deleteTimes(index)" src="../../../assets/img/activity/icon_ subtract@2x.png" alt=""></div>
                </div>
            </div>
        </div>

        <div class="form">
            <h2>活动规格</h2>
            <div class="optional">活动限制 <div class="optional-inp"><div v-if="status === '已结束'" class="shade"></div><input type="tel" v-model="activityPurchaseLimits" placeholder="请输入限购数量"></div></div>
            <div class="annotation">活动限购是指该活动每个用户允许以活动价购买的数量总和</div>
            <div class="optional" @click="checkPurchase">
                <img v-show="!ifPricePurchase && status !== '已结束'" src="../../../assets/img/icon_weixuanzhong@2x.png" alt="">
                <img v-show="ifPricePurchase && status !== '已结束'" src="../../../assets/img/checked@2x.png" alt="">
                <img v-show="status === '已结束'" src="../../../assets/img/icon_xuanzhong@2x.png" alt="">
                限购后是否原价购买
            </div>
        </div>

        <div class="form" @click="addGoods">
            <h2>活动商品  <span class="goodsIcon">{{goodsNum}} <img src="../../../assets/img/icon-test-14@2x.png" alt=""></span></h2>
        </div>
    </div>
    
    <div class="btn">
      <div class="" @click="submit">保存</div>
    </div>
    <div class="blank"></div>

    <!-- 时间选择框 -->
    <van-action-sheet v-model="datetimeShow">
        <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="选择完整时间"
        :min-date="minDate"
        @confirm="dateCallback"
        @cancel="dateCanel"
        />
    </van-action-sheet>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import {ActionSheet, DatetimePicker, Toast } from 'vant';
import { apiClass, nativeFunction, clearKeepAlive } from "@/utils/index";
import { activityUpdate, getActivityInfo } from '@/api/index';
export default {
    name: 'activityCreate',
    components: {
        NavBar,
        vanActionSheet: ActionSheet,
        vanDatetimePicker: DatetimePicker
    },
    data () {
        return {
            title: '新建活动',
            type: 0,
            activityStatus: 2,
            edit: '0',
            status: '未开始',
            name: '',
            description: '',
            activityPurchaseLimits: '',
            ifPricePurchase: false,
            datetimeShow: false,
            currentDate: new Date(),
            minDate: new Date(2020, 0, 1),
            timeList: [{
                startTime: '',
                endTime: ''
            }],
            timeIndex: 0,
            timeType: 'startTime',
            goodsNum: '添加商品'
        }
    },
    created () {
        let data = this.$route.query;
        this.type = data.type;
        this.edit = data.edit;
        this.status = data.status;
        this.activityId = data.activityId;
        switch (this.type) {
            case 0:
                this.activityStatus = 2;
                break;
            case 1:
                this.activityStatus = 3;
                break;
            case 2:
                this.activityStatus = 7;
                break;
        }
    },
    mounted () {
        this.$store.commit('updateActivityType', this.type);
        if(this.activityId){
            this.getActivity();
        }
    },
    activated () {
        console.log('activityCreate');
        if(this.$route.meta.isBack){
            let activityGoods = this.$store.state.activityGoods;
            if(activityGoods != ""){
                this.goodsNum = this.edit === '1' ? activityGoods[0].goodsSum : activityGoods.length;
            }
            
        }
        this.$route.meta.isBack = false;
    },
    methods: {
        // 打开时间选择
        openPicker(index, type) {
            if((this.status === '已结束' || this.status === '进行中') && type === 'startTime') return false;
            this.timeIndex = index;
            this.timeType = type;
            this.datetimeShow = true;
        },
        // 日期回调
        dateCallback(e) {
            console.log(e);
            let today = new Date().getTime();
            let datetime = new Date(e).Format("yyyy.MM.dd hh:mm");
            let chooseTime = new Date(e).getTime();
            if(chooseTime + (60*1000) < today) return Toast("不能小于当前时间");

            if(this.timeType === "endTime" && this.timeList[this.timeIndex].startTime !== ''){
                let indexStart = this.timeList[this.timeIndex].startTime.replace(/\./g, '/');
                indexStart =  new Date(indexStart).getTime();
                if(chooseTime <= indexStart) return Toast("不能小于开始时间");
            }

            // if(this.timeIndex > 0 && this.timeType === "startTime"){
            //     let last = this.timeList[this.timeIndex - 1].endTime.replace(/\./g, '/');
            //     last =  new Date(last).getTime();
            // }

            this.$set(this.timeList[this.timeIndex], this.timeType, datetime);
            this.datetimeShow = false;
        },
        dateCanel() {
            this.datetimeShow = false;
        },
        // 添加时间段
        addTimes() {
           this.timeList.push({startTime: '', endTime: ''});
        },
        // 删除时间段
        deleteTimes(index) {
            this.timeList.splice(index, 1);
        },

        // 是否原价购买
        checkPurchase() {
            if(this.status === '已结束') return false;
            this.ifPricePurchase = !this.ifPricePurchase;
        },

        // 添加商品
        addGoods() {
            let timeList = this.timeList;
            for (let i = 0; i < timeList.length; i++) {
                if(timeList[i].startTime === '') return Toast("请选择开始时间");
                if(timeList[i].endTime === '') return Toast("请选择结束时间");
            }
            this.$store.commit('updateTimeSlots',timeList);

            this.$router.push({
                path: '/activityManager/activitySet',
                query: {
                    type: this.type,
                    edit: this.edit,
                    status: this.status,
                    activityId: this.activityId
                }
            })
        },

        // 保存/编辑
        submit() {
            if(this.name === '') return Toast("请输入活动名称");
            let timeList = this.timeList, timeArr = [];
            for (let i = 0; i < timeList.length; i++) {
                if(timeList[i].startTime === '') return Toast("请选择开始时间");
                if(timeList[i].endTime === '') return Toast("请选择结束时间");

                let obj = {
                    startTime: timeList[i].startTime.replace(/\./g, '-') + ":00",
                    endTime: timeList[i].endTime.replace(/\./g, '-') + ":00"
                }
                timeArr.push(obj);
            }
            let currentTime = new Date().getTime();
            let firstTime = new Date(timeList[0].startTime.replace(/\./g, '/') + ":59").getTime();
            if(firstTime < currentTime) {
                timeList[0].startTime = new Date(currentTime).Format("yyyy.MM.dd hh:mm");
                timeArr[0].startTime = new Date(currentTime).Format("yyyy-MM-dd hh:mm") + ":00";
            }

            let activityPurchaseLimits = 0, ifActivityPurchaseLimits = false;
            if(this.activityPurchaseLimits !== ''){
                activityPurchaseLimits = this.activityPurchaseLimits;
                ifActivityPurchaseLimits = true;
            }
            let params = {
                activityStatus: this.activityStatus,
                name: this.name,
                description: this.description,
                timeSlotList: timeArr,
                ifPricePurchase: this.ifPricePurchase,
                ifActivityPurchaseLimits: ifActivityPurchaseLimits,
                activityPurchaseLimits: activityPurchaseLimits
            };
            console.log(params)

            if(this.edit === '0') {
                let activityGoods = this.$store.state.activityGoods;
                if(activityGoods == '' || activityGoods.length == 0) return Toast("未添加商品");
                let list = [];
                for (let i = 0; i < activityGoods.length; i++) {
                    let obj1 = {
                        goodsId: activityGoods[i].goodsId,
                        specificationList: []
                    }
                    let specificationList = activityGoods[i].specificationList;
                    for (let j = 0; j < specificationList.length; j++) {
                        let obj2 = {
                            specificId: specificationList[j].specificId,
                            activityPrice: specificationList[j].activityPrice,
                            goodsPurchaseLimits: specificationList[j].goodsPurchaseLimits,
                            activityStock: specificationList[j].activityStock,
                        }
                        if(this.type == 1){
                            obj2.discount = specificationList[j].discount;
                        }
                        obj1.specificationList.push(obj2);
                        
                    }
                    list.push(obj1);
                }
                params.goodsList = list;
            }
            if(this.edit === '1') {
                params.activityId = this.activityId;
            }

            activityUpdate(this.edit, params)
            .then(res => {
                if(res.code == 200){
                    this.$router.go(-1);
                }else{
                    Toast(res.msg);
                }
            })
            .catch(err => {});
        },
        
        // 活动信息
        getActivity() {
            getActivityInfo({activityId: this.activityId})
            .then(res => {
                if(res.code == 200){
                    let data = res.data;
                    this.name = data.name;
                    this.description = data.description;
                    this.activityPurchaseLimits = data.activityPurchaseLimits;
                    this.ifPricePurchase = data.ifPricePurchase;
                    this.goodsNum = data.goodsCount;
                    let timeSlotList = data.timeSlotList;
                    for (let i = 0; i < timeSlotList.length; i++) {
                        timeSlotList[i].startTime = timeSlotList[i].startTime.replace(/-/g, '.').substring(0,16);
                        timeSlotList[i].endTime = timeSlotList[i].endTime.replace(/-/g, '.').substring(0,16);
                    }
                    this.timeList = timeSlotList;
                }
            })
        }
    },
    beforeRouteLeave(to, from, next) {
        if (to.meta.title == "活动管理") {
            clearKeepAlive(this);
            // this.$destroy();           
        }
        next();
    }
}
</script>
<style scoped lang="less">
/deep/ .van-cell{
    min-height: 40px;
    line-height: normal;
}
/deep/ .van-field__word-limit{
    color: #999999;
}
.inp{
    border-radius: 2px;
    border: 1px solid #B0B2BF;
    overflow: hidden;
    position: relative;
}
.shade{
    width: 100%;
    height: 100%;
    background: #B0B2BF;
    opacity: 0.2;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
}
.content{
    padding-top: 44px;
    .form{
        margin-top: 10px;
        padding: 16px 15px;
        background: #FFFFFF;
        border-radius: 8px;
        h2{
            line-height: 21px;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            .goodsIcon{
                font-size: 14px;
                font-weight: normal;
                color: #999999;
                img{
                    width: 8px;
                    height: 10px;
                }
            }
        }
        .cell{
            margin-top: 16px;
            p{
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .addTimes{
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: #999999;
                    img{
                        margin-left: 4px;
                        width: 24px;
                    }
                }
            }
            .inp{
                margin-top: 8px;
            }
            .cell-time{
                margin-top: 8px;
                display: flex;
                align-items: center;
                .datetime{
                    flex: 1;
                    padding: 0 8px;
                    height: 40px;
                    border-radius: 2px;
                    border: 1px solid #B0B2BF;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    position: relative;
                    span{
                        display: inline-block;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .prompt{
                        color: #999999;
                    }
                    img{
                        width: 14px;
                    }
                }
                .line{
                    margin: 0 4px;
                    width: 14px;
                    height: 1px;
                    background: #B0B2BF;
                }
                .delete{
                    width: 24px;
                    height: 24px;
                    img{
                        width: 100%;
                    }
                }
            }
        }
        .optional{
            margin-top: 16px;
            font-size: 14px;
            display: flex;
            align-items: center;
            .optional-inp{
                margin-left: 12px;
                position: relative;
            }
            input{
                padding: 0 10px;
                width: 122px;
                height: 24px;
                border-radius: 2px;
                border: 1px solid #B0B2BF;
                &::-webkit-input-placeholder{
                    color: #999999;
                    font-size: 14px;
                }
            }
            img{
                margin-right: 12px;
                width: 18px;
                height: 18px;
            }
        }
        .annotation{
            margin-top: 4px;
            line-height: 17px;
            font-size: 12px;
            color: #999999;
        }
    }
}
.blank{
    width: 100%;
    height: 60px;
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
