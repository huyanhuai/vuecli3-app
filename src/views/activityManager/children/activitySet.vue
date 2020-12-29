<template>
  <div class="activitySet">
    <NavBar :title="title"></NavBar>
    <div v-if="status !== '已结束'" class="addIcon" @click="addGoods"><img src="../../../assets/img/icon_nav_add@2x.png" alt=""></div>

    <div class="content">
        <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="getGoodsList"
        >

            <div class="card" v-for="(item, index) in goodsList" :key="index">
                <div class="goods">
                    <div class="goods-img"><img :src="item.headIcon" alt=""></div>
                    <div class="goods-info">
                        <div class="name">{{item.title}}</div>
                        <div class="price activityPrice">活动价：¥<span>{{item.activityPrice}}</span></div>
                        <div class="price">销售价：¥<span>{{parseFloat(item.salesPrice)}}</span></div>
                    </div>
                </div>
                <div class="card-num">
                    <div>限购：{{item.goodsPurchaseLimits}}</div><div>可售数量：{{item.activityStock}}</div><div>已售数量：{{item.activitySales}}</div>
                </div>
                <div v-if="status !== '已结束'" class="card-btn" @click="onBtn">
                    <div data-type="edit" :data-index="index">编辑</div><div data-type="delete" :data-index="index">移除</div>
                </div>
            </div>

        </van-list>
    </div>

    <div class="btn" v-if="status !== '已结束'">
      <div class="" @click="submit">保存</div>
    </div>
    <div class="blank"></div>

    <!-- 活动价设置框 -->
    <van-action-sheet v-model="show">
        <div class="sku">
            <div v-show="singleSkuShow" class="singleSku">
                <div class="row">
                    <van-field type="number" label="销售价：" :placeholder="'¥' + sku.salesPrice" readonly/>
                </div>
                <div v-if="type != 1" class="row">
                    <van-field v-model="sku.activityPrice" type="number" label="活动价：" placeholder="请输入活动价" required/>
                </div>
                 <div v-if="type == 1" class="row row_custom row_custom-icon row_custom_padding">
                    <div class="row_custom-label ">活动价：</div>
                    <div class="row_custom-num row_custom-flex">
                        <div class="row_custom-limit"><input type="number" pattern="\.[0-9]*" v-model="sku.discount" placeholder="请输入折扣"> 折</div>
                        <div class="row_custom-price">¥{{sku.activityPrice}}</div>
                    </div>
                </div>
                <div class="row row_custom row_custom-icon">
                    <div class="row_custom-label ">限购：</div>
                    <div class="row_custom-num">
                        <div class="row_custom-limit"><input type="tel" v-model="sku.goodsPurchaseLimits" placeholder="请输入限购数量"> 件</div>
                        <div class="row_custom-text">相同买家从此活动可购买该商品件数，填0代表不限制</div>
                    </div>
                </div>
                <div class="row row_custom row_custom_padding" >
                    <div class="row_custom-label">可售数量：</div>
                    <div class="row_custom-flex">
                        <van-stepper v-model="sku.activityStock" :max="sku.stockNumber" integer input-width="52px"/>
                        <div class="row_custom-stock">库存数：{{sku.stockNumber}} 件</div>
                    </div>
                </div>
                <div class="row">
                    <van-field v-model="sku.soldQuantity" type="tel" label="已售数量：" :placeholder="sku.soldQuantity" readonly/>
                </div>

                
            </div>

            <div v-show="!singleSkuShow" class="moreSku">
                <div class="moreSku-title">多规格商品编辑
                    <div class="moreSku-batchSet" @click="volumeSet">批量设置</div>
                </div>
                <div class="table_th">
                    <div v-for="itemS in specifications" :key="itemS.title">{{itemS.title}}</div>
                    <div>操作</div>
                </div>
                <ul class="table" @click="switchSingle">
                    <li class="td" v-for="(item, index) in specificationList" :key="index">
                        <div v-for="itemS in item.specifications" :key="itemS.value">{{itemS.value}}</div>
                        <div :data-index="index">编辑 ></div>
                    </li>
                </ul>
                
            </div>

            <div class="singleSku-btn" @click="saveBtn">
                <div data-type="cancel">取消</div><div data-type="confirm">确认</div>
            </div>
        </div>
    </van-action-sheet>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import {ActionSheet, Stepper, Toast, Dialog } from 'vant';
import { clearKeepAlive } from "@/utils/index";
import { getActivityGoodsList, activityGoodsSet, activityGoodsDelete } from '@/api/index';
export default {
    name: 'activitySet',
    components: {
        NavBar,
        vanActionSheet: ActionSheet,
        vanStepper: Stepper
    },
    data () {
        return {
            title: '商品管理',
            status: '未开始',
            type: 0,
            show: false,
            singleSkuShow: true,
            sku: {
                activityPrice: '',
                salesPrice: '',
                discount: '',
                activityStock: 1,
                goodsPurchaseLimits: '',
                stockNumber: "",
                soldQuantity: '',
            },
            specificationList: [],
            specifications: [],
            activityCheckedGoods: [],
            goodsList: [],
            goodsIndex: 0,
            specificationIndex: 0,
            isVolumeSet: false,
            chooseGoods: [],
            loading: false,
            finished: false,
            pageNum: 0,
            goodsSum: 0
        }
    },
    watch: {
        'sku.discount'(val, oldVal) {
            console.log("inputVal = " + val + " , oldValue = " + oldVal);
            if(parseFloat(val) > 10){
                this.$set(this.sku, 'discount', 10)
            }
            this.$set(this.sku, 'activityPrice', (parseFloat(val)/10*parseFloat(this.sku.salesPrice)).toFixed(2));
        },
        'sku.activityPrice'(val, oldVal) {
            console.log("inputVal = " + val + " , oldValue = " + oldVal);
            if(parseFloat(val) > parseFloat(this.sku.salesPrice)){
                this.$set(this.sku, 'activityPrice', this.sku.salesPrice);
            }
        }
    },
    created () {
        
    },
    activated () {
        console.log('activitySet')
        if(this.$route.meta.isBack){
            let activityCheckedGoods = this.$store.state.activityCheckedGoods;
            if(activityCheckedGoods !== '') {
                for (let i = 0; i < this.chooseGoods.length; i++) {
                    for (let j = 0; j < activityCheckedGoods.length; j++) {
                        
                        if (activityCheckedGoods.length > 0) {
                            if (this.chooseGoods[i].goodsId == activityCheckedGoods[j].goodsId) {
                                activityCheckedGoods.splice(j, 1); //利用splice函数删除元素，从第i个位置，截取长度为1的元素
                            }
                        }
                    }
                } 

                console.log(activityCheckedGoods);
                this.chooseGoods.unshift.apply(this.chooseGoods, activityCheckedGoods);
                this.goodsList.unshift.apply(this.goodsList, activityCheckedGoods);    
            }
        }else{
            let data = this.$route.query;
            this.type = data.type;
            this.edit = data.edit;
            this.status = data.status;
            this.activityId = data.activityId;
            this.chooseGoods = [];
            this.goodsList = [];
            this.pageNum = 0;
            if(this.activityId){
                this.getGoodsList();
            }
        }
        this.$store.commit('updateActivityType', this.type);
        this.$route.meta.isBack = false;
    },
    methods: {
        // 添加商品
        addGoods() {
            let obj = {};
            if(this.activityId) {
                obj.activityId = this.activityId;
            }
            this.$router.push({
                path: '/activityManager/activityProducts',
                query: obj
            })
        },
        onBtn(e){
            let type = e.target.dataset.type;
            let index = e.target.dataset.index;
            if(type === "edit") return this.goodsEdit(index);
            if(type === "delete") {
                Dialog.confirm({
                    title: '',
                    message: '确定删除该商品？',
                    cancelButtonColor: '#FF3B30'
                })
                .then(() => {
                    // on confirm
                    this.goodsDelete(index);
                })
                .catch(() => {});
            }
        },

        // 打开编辑
        goodsEdit(index) {
            this.goodsIndex = index;
            this.specificationList = this.goodsList[index].specificationList;
            this.specifications = this.goodsList[index].specificationList[0].specifications;
            if(this.specificationList.length > 1) {
                this.singleSkuShow = false;
            }else{
                this.singleSkuShow = true;
                let specificationList = this.specificationList[0];
                this.sku = {
                    activityPrice: specificationList.activityPrice,
                    salesPrice: specificationList.price,
                    discount: specificationList.discount,
                    activityStock: specificationList.activityStock,
                    goodsPurchaseLimits: specificationList.goodsPurchaseLimits,
                    stockNumber: specificationList.stockNumber,
                    soldQuantity: '0',
                }
                if(specificationList.activityStock && specificationList.activityStock != ''){
                    this.sku.activityStock = specificationList.activityStock;
                }else{
                    this.sku.activityStock = 1;
                }
                if(specificationList.soldQuantity){
                    this.sku.soldQuantity = specificationList.soldQuantity.toString();
                }
            }
            this.show = true;
        },
        // 删除商品
        goodsDelete(index) {
            let goodsIds = this.goodsList[index].goodsId.toString();
            if(this.goodsList[index].isChange){
                activityGoodsDelete({activityId: this.activityId, goodsIds: goodsIds})
                .then(res => {
                    if(res.code == 200){
                        this.goodsSum = res.data;
                        this.goodsList.splice(index, 1);
                    }
                })
                .catch(err => {});

            }else{
                this.goodsList.splice(index, 1);
            }
        },

        // 切换到规格详情
        switchSingle(e) {
            let index = e.target.dataset.index;
            if(!index) return false;
            this.specificationIndex = index;
            let specificationList = this.specificationList[index];
            this.sku = {
                activityPrice: specificationList.activityPrice,
                salesPrice: specificationList.price,
                discount: specificationList.discount,
                activityStock: specificationList.activityStock,
                goodsPurchaseLimits: specificationList.goodsPurchaseLimits,
                stockNumber: specificationList.stockNumber,
                soldQuantity: '0',
            }
            if(specificationList.activityStock && specificationList.activityStock != ''){
                this.sku.activityStock = specificationList.activityStock;
            }else{
                this.sku.activityStock = 1;
            }
            if(specificationList.soldQuantity){
                this.sku.soldQuantity = specificationList.soldQuantity.toString();
            }
            this.singleSkuShow = true;
        },

        // 活动价设置框按钮
        saveBtn(e) {
            let type = e.target.dataset.type;
            if(type === "cancel") {
                if(this.specificationList.length > 1 && this.singleSkuShow){
                    this.singleSkuShow = !this.singleSkuShow;
                }else{
                    this.show = false;
                }
            } 
            if(type === "confirm") {
                if(this.specificationList.length > 1){
                    if(this.singleSkuShow){
                        this.saveSpecification() == true ? this.singleSkuShow = !this.singleSkuShow : '';
                    }else{
                        this.saveAllSpecification();
                    }
                    
                }else{
                    this.saveSpecification() == true ? this.saveAllSpecification() : '';
                    // this.show = false;
                }
            }
        },

        // 保存单规格
        saveSpecification() {
            if(this.type != 1 && (!this.sku.activityPrice || this.sku.activityPrice == '')) return Toast("请输入活动价");
            if(this.type == 1 && (!this.sku.discount || this.sku.discount == '')) return Toast("请输入折扣");
            if(!this.sku.goodsPurchaseLimits || this.sku.goodsPurchaseLimits == '') return Toast("请输入限购数");
            if(!this.sku.activityStock || this.sku.activityStock == '') return Toast("请输入可售数量");

            let data = this.goodsList[this.goodsIndex].specificationList[this.specificationIndex];
            data.activityPrice = this.sku.activityPrice;
            data.activityStock = this.sku.activityStock;
            data.goodsPurchaseLimits = this.sku.goodsPurchaseLimits;
            if(this.type == 1){
                data.discount = this.sku.discount;
            }

            if(this.isVolumeSet){
                let list = this.goodsList[this.goodsIndex].specificationList;
                for (let i = 0; i < list.length; i++) {
                    list[i].activityPrice = this.sku.activityPrice;
                    list[i].activityStock = this.sku.activityStock;
                    list[i].goodsPurchaseLimits = this.sku.goodsPurchaseLimits;
                    if(this.type == 1){
                        list[i].discount = this.sku.discount;
                    }
                    
                }
                this.isVolumeSet = false;
            }
            console.log(this.goodsList);
            return true;
        },

        // 提交保存多规格
        saveAllSpecification() {
            let data = this.goodsList[this.goodsIndex].specificationList;
            let specificationList = [], allLimits = 0, allActivityStock = 0;
            for (let i = 0; i < data.length; i++) {
                if(!data[i].activityPrice && data[i].activityPrice == '') return Toast("未设置活动价");
                let obj = {
                    specificId: data[i].specificId,
                    activityPrice: data[i].activityPrice,
                    goodsPurchaseLimits: data[i].goodsPurchaseLimits,
                    activityStock: data[i].activityStock,
                }
                if(this.type == 1){
                    obj.discount = data[i].discount;
                }
                specificationList.push(obj);
                allLimits = allLimits + parseFloat(data[i].goodsPurchaseLimits);
                allActivityStock = allActivityStock + data[i].activityStock;
            }

            if(this.edit === '1'){
                let params = {
                    activityId: this.activityId,
                    goodsId: this.goodsList[this.goodsIndex].goodsId,
                    specificationList:specificationList
                }
                activityGoodsSet(params)
                .then(res => {
                    console.log(res)
                    if(res.code == 200){
                        this.goodsSum = res.data;
                        this.goodsList[this.goodsIndex].isChange = true;
                        this.goodsList[this.goodsIndex].activityPrice = data[0].activityPrice;
                        this.goodsList[this.goodsIndex].goodsPurchaseLimits = allLimits;
                        this.goodsList[this.goodsIndex].activityStock = allActivityStock;
                        this.show = false;
                    }else{
                        Toast(res.msg);
                    }
                })
                .catch(err => {});
            }else{
                this.goodsList[this.goodsIndex].activityPrice = data[0].activityPrice;
                this.goodsList[this.goodsIndex].goodsPurchaseLimits = allLimits;
                this.goodsList[this.goodsIndex].activityStock = allActivityStock;
                this.show = false;
            }
        },

        // 批量设置
        volumeSet() {
            this.isVolumeSet = true;
            this.singleSkuShow = true;
            this.sku = {
                activityPrice: '',
                salesPrice: parseFloat(this.goodsList[this.goodsIndex].salesPrice),
                discount: '',
                activityStock: 1,
                goodsPurchaseLimits: '',
                stockNumber: this.goodsList[this.goodsIndex].specificationList[0].stockNumber,
                soldQuantity: this.goodsList[this.goodsIndex].activitySales.toString(),
            }
        },

        // 保存返回
        submit() {
            for (let i = 0; i < this.goodsList.length; i++) {
                if(!this.goodsList[i].activityPrice || this.goodsList[i].activityPrice == '') return Toast("商品未设置活动价");
            }
            this.goodsList[0].goodsSum = this.goodsSum;
            this.$store.commit('updateActivityGoods',this.goodsList);
            console.log(this.$store.state.activityGoods);
            this.$router.go(-1);
        },

        // 活动商品
        getGoodsList() {
            let params = {
                pageNum: this.pageNum++,
                pageSize: 10,
                activityId: this.activityId
            };
            getActivityGoodsList(params)
            .then(res => {
                // 加载状态结束
                this.loading = false;
                if(res.code == 200){
                    let list = res.data;
                    if(!list || list.length < 10){
                        this.finished = true;
                    }else{
                        this.finished = false;
                    }
                    for (let i = 0; i < list.length; i++) {
                        let specificationList = list[i].specificationList;
                        for (let j = 0; j < specificationList.length; j++) {
                            specificationList[j].specifications = JSON.parse(specificationList[j].specifications);
                            
                        }
                        specificationList.sort(function (a, b) { // 这是比较函数
                            return a.price - b.price;
                        })
                        list[i].specificationList = specificationList;
                    }
                    console.log(list)
                    this.goodsList.push.apply(this.goodsList, list);
                    
                }
            })
            .catch(err => {
                this.loading = false;
                console.log(err)
            })
        }
        
    },
    beforeRouteLeave(to, from, next) {
        if (to.meta.title == "创建活动" || to.meta.title == "活动管理") {
            to.meta.isBack = true;
            // clearKeepAlive(this);
        }
        next();
    }
}
</script>
<style scoped lang="less">
.addIcon{
    width: 50px;
    height: 44px;
    padding-right: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 101;
    img{
        width: 24px;
        height: 24px;
    }
}
.content{
    padding-top: 44px;
    .card{
        margin-top: 10px;
        width: 100%;
        background: #FFFFFF;
        .goods{
            padding: 10px 15px 0 15px;
            display: flex;
            .goods-img{
                width: 100px;
                height: 100px;
                overflow: hidden;
                img{
                    width: 100%;
                }
            }
            .goods-info{
                flex: 1;
                padding-left: 8px;
                .name{
                    line-height: 20px;
                    font-size: 14px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                }
                .price{
                    padding: 4px 0;
                    color: #FA5741;
                    font-size: 9px;
                    span{
                        font-size: 14px;
                        font-weight: bold;
                    }
                }
            }
        }
        .card-num{
            padding: 12px 15px;
            width: 100%;
            font-size: 12px;
            color: #999999;
            border-bottom: 1px solid #E5E5E5;
            display: flex;
            justify-content: space-between;
            align-items: center;
            div{
                flex: 1;
                &:last-child{
                    text-align: right;
                }
            }
        }
        .card-btn{
            width: 100%;
            height: 36px;
            line-height: 36px;
            display: flex;
            justify-content: space-between;
            div{
                flex: 1;
                height: 100%;
                font-size: 12px;
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

/deep/ .van-field__label{
    font-weight: bold;
}
/deep/ .van-stepper__minus, /deep/ .van-stepper__plus{
    background-color: #FFFFFF;
    border: 1px solid #D8D8D8;
}
/deep/ .van-stepper__input{
    margin: 0;
    background-color: #FFFFFF;
    border-top: 1px solid #D8D8D8;
    border-bottom: 1px solid #D8D8D8;
}
// 活动设置
.sku{
    padding: 0 0 20px 0;
    .singleSku{
        padding-top: 20px;
        .row{
            padding: 5px 0;
            position: relative;
            &:after{
                position: absolute;
                box-sizing: border-box;
                content: ' ';
                height: 1px;
                pointer-events: none;
                right: 16px;
                bottom: 0;
                left: 16px;
                border-bottom: 1px solid #E5E5E5;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
            }
        }
        .row_custom{
            padding: 10px 16px;
            display: flex;
            position: relative;
            .row_custom-label{
                width: 90px;
                font-size: 14px;
                font-weight: bold;
            }
            .row_custom-num{
                flex: 1;
                .row_custom-limit{
                    padding: 0 8px 0 12px;
                    width: 144px;
                    height: 24px;
                    line-height: 24px;
                    border-radius: 2px;
                    border: 1px solid #B0B2BF;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    input{
                        padding: 0;
                        width: 100px;
                        border: none;
                        &::-webkit-input-placeholder{
                            color: #999999;
                            font-size: 14px;
                        }
                    }
                }
                .row_custom-text{
                    line-height: 17px;
                    margin-top: 6px;
                    font-size: 12px;
                    color: #999999;
                }
            }
            .row_custom-flex{
                display: flex;
                align-items: center;
                .row_custom-price{
                    margin-left: 8px;
                    font-size: 14px;
                    color: #FA5741;
                }
                .row_custom-stock{
                    margin-left: 8px;
                    font-size: 12px;
                    color: #999999;
                }
            }
        }
        .row_custom-icon::before{
            position: absolute;
            left: 8px;
            color: #FF3B30;
            font-size: 14px;
            content: '*';
        }
        .row_custom_padding{
            padding: 15px 16px;
            align-items: center;
        }
    }

    .moreSku{
        .moreSku-title{
            width: 100%;
            height: 60px;
            line-height: 60px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            position: relative;
            .moreSku-batchSet{
                height: 60px;
                font-size: 14px;
                color: #3F9BFF;
                position: absolute;
                top: 0;
                right: 15px;
            }
        }
        .table_th{
            padding: 0 15px;
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            font-weight: bold;
            border-bottom: 1px solid #E5E5E5;
            display: flex;
            div{
                &:not(:last-child){
                    flex: 1;
                }
                &:last-child{
                    width: 52px;
                    text-align: center;
                }
            }
        }
        .table{
            padding: 0 15px;
            max-height: 60vh;
            overflow-y: scroll;
            .td{
                height: 40px;
                border-bottom: 1px solid #E5E5E5;
                font-size: 14px;
                display: flex;
                align-items: center;
                overflow: hidden;
                div{
                    line-height: 20px;
                    overflow: hidden;
                    &:not(:last-child){
                        flex: 1;
                    }
                    &:last-child{
                        width: 52px;
                        line-height: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: #3F9BFF;
                    }
                }
            }
        }
    }
    
    .singleSku-btn{
        width: 100%;
        margin-top: 30px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        div{
            width: 150px;
            height: 36px;
            line-height: 36px;
            border-radius: 20px;
            font-size: 16px;
            text-align: center;
            &:first-child{
                background: #EBECF0;
            }
            &:last-child{
                background: #FCC100;
            }
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
.blank{
    width: 100%;
    height: 60px;
}
</style>
