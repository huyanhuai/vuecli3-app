<template>
<div class="communityStatus">
    <div class="nav-bar">
        <div class="nav-bar-back" @click="$router.go(-1)">
            <img src="../../../assets/img/back_white@2x.png" alt="" />
        </div>
        <div class="nav-bar-title">{{ title }}</div>
    </div>

    <div class="content">
        <div class="backdrop">
            <div class="interests">
                <img src="../../../assets/img/community/interests2@2x.png" alt="" />
            </div>
        </div>

        <div class="container">
            <div class="card">
                <img class="card-title" src="../../../assets/img/community/title_1@2x.png" alt="" />
                <img class="card-img" src="../../../assets/img/community/bg1@2x.png" alt="" />
                <div>
                    <div class="card-text">
                        第一步：填写审核信息，然后我们将会审核您提交的信息。并在24小时之内通知您审核结果。
                    </div>
                    <div class="card-text">
                        第二步：审核成功后，您需要购买专属商品，并赠送给您专属社区团长权益。
                    </div>
                    <div class="card-text">
                        第三步：开启社区团队长躺赚之旅，撬动身边资源，赋能微创业。
                    </div>
                </div>
            </div>

            <div class="card">
                <img class="card-title" src="../../../assets/img/community/title_2@2x.png" alt="" />
                <img class="card-img" src="../../../assets/img/community/bg2@2x.png" alt="" />
            </div>

            <div class="card cardShow">
                <img class="card-title" src="../../../assets/img/community/title_3@2x.png" alt="" />
                <img class="card-img" src="../../../assets/img/community/bg3@2x.png" alt="" />
                <div>
                    <div class="card-text">
                        1.成为团长后，分享带有金主价的商品给好友，好友平台价购买后，金主奖励=商品平台价-金主价
                    </div>
                    <div class="card-text">2.分享商品赚差价，他人购物我赚钱</div>
                </div>
            </div>

            <div class="card cardShow">
                <img class="card-title" src="../../../assets/img/community/title_4@2x.png" alt="" />
                <img class="card-img" src="../../../assets/img/community/bg4@2x.png" alt="" />
                <div>
                    <div class="card-text">
                        1.团长独享邀请礼，团长邀请商家、团队长、消费者（金主）都能得到持续现金分红奖励，一次邀请终生有效，奖励上不封顶
                    </div>
                    <div class="card-text">
                        2.团长进阶，权益升级：团长可升级董事团队长、总裁团队长，尊享平台年度利润分红奖励
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom">
            <img src="../../../assets/img/businessPartner/icon_lianxiwomen@2x.png" alt="" />
        </div>
    </div>
</div>
</template>

<script>
import NavBar from "@/components/NavBar";
import {
    apiClass
} from "@/utils/index";
import {
    getBusinessStoreType
} from "@/api/index";
export default {
    name: "communityStatus",
    components: {
        NavBar,
    },
    data() {
        return {
            title: "",
        };
    },
    created() {},
    mounted() {
        //    this.getList();
    },
    methods: {
        nextStep(e) {
            let type = e.target.dataset.type;
            console.log(type);
            this.$router.push({
                path: "/businessPartner/businessPartnerSettled",
                query: {
                    type: type,
                },
            });
        },
        // 获取入驻分类
        getList() {
            getBusinessStoreType().then((res) => {
                console.log(res);
                if (res.code == 200) {
                    let data = res.data;
                    this.list = data[0].child.concat(data[1].child);
                    console.log(this.list);
                    // this.$store.commit('updateBusinessSettledInfo',data);
                }
            });
        },
    },
    beforeRouteLeave(to, from, next) {
        console.log(to);
        console.log(from);
        if (to.meta.title == "团长") {
            apiClass.closeWebview();
        } else {
            next();
        }
    },
};
</script>
<style scoped lang="less">
.nav-bar_border {
    box-shadow: 0px 1px 0px 0px #d8d8d8;
}

.nav-bar {
    padding-right: 40px;
    width: 100%;
    height: 44px;
    line-height: 44px;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;

    .nav-bar-back {
        width: 40px;
        display: flex;
        align-items: center;
        padding-left: 15px;
        img {
            width: 22px;
        }
    }

    .nav-bar-title {
        flex: 1;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
    }
}

.content {
    width: 100%;
    font-family: PingFangSC-Medium, PingFang SC;

    .backdrop {
        padding-top: 250px;
        width: 100%;
        background: url(../../../assets/img/community/bg@2x.png) no-repeat;
        background-size: 100% 350px;
    }

    .backdrop img {
        width: 100%;
    }

    .interests {
        padding: 0 15px;
        width: 100%;
    }

    .interests img {
        display: block;
        width: 100%;
    }

    .container {
        padding: 0 15px;
    }

    .card {
        margin-top: 10px;
        padding: 8px 10px 16px 10px;
        background: #ffffff;
        border-radius: 12px;
    }

    .card img {
        display: block;
    }

    .card-title {
        margin: auto;
        margin-top: 8px;
        width: 164px;
    }

    .card:first-child{
        .card-title {
            width: 257px;
        }
    }
    .card:last-child{
        .card-title {
            width: 178px;
        }
    }

    .card-img {
        margin-top: 12px;
        width: 100%;
    }

    .card-text {
        padding: 0 5px;
        margin-top: 8px;
        line-height: 17px;
        font-size: 12px;
    }

    .card-text:first-child {
        margin-top: 12px;
    }

    .cardShow {
        // display: none;
    }

    .bottom {
        padding: 16px 0 30px 0;

        img {
            display: block;
            margin: auto;
            width: 127px;
            height: 32px;
        }
    }
}
</style>