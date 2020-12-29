import Vue from "vue";
import Router from "vue-router";
import store from "../store/index";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  // base:  '/about/dist',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) { //如果savedPosition存在，滚动条会自动跳到记录的值的地方
      return savedPosition
    } else {
      return {x: 0, y: 0}//savedPosition也是一个记录x轴和y轴位置的对象
    }
  },
  routes: [
    {
      path: "/",
      redirect: "/businessPartner"
    },
    {
      path: "/index",
      component: () => import("@/views/index/index"),
      meta: {
        title: "每日生鲜",
        // 缓存首页
        keepAlive: true
      }
    },
    {
      path: "/cart",
      meta: {
        title: "购物车"
      },
      component: () => import("@/views/cart/index")
    },
    {
      path: "/my",
      component: () => import("@/views/my/index"),
      redirect: "/my/center",
      children: [
        {
          path: "center",
          meta: {
            title: "个人中心"
          },
          component: () => import("@/views/my/children/center")
        },
        {
          path: "set",
          meta: {
            title: "设置"
          },
          component: () => import("@/views/my/children/set")
        }
      ]
    },
    {
      path: "/login",
      component: () => import("@/views/login/index"),
      meta: {
        title: "登陆"
      }
    },
    {
      path: "/business",
      name:'business',
      component: () => import("@/views/business/index"),
      redirect: "/business/index",
      children: [
        {
          path: "index",
          meta: {
            title: "首页",
            index: 1
          },
          component: () => import("@/views/business/children/index")
        },
        {
          path: "businessSettled",
          meta: {
            title: "入驻",
            index: 6
          },
          component: () => import("@/views/business/children/businessSettled")
        },
        {
          path: "businessType",
          meta: {
            title: "招牌/合作",
            index: 2
          },
          component: () => import("@/views/business/children/businessType")
        },
        {
          path: "businessStatus",
          meta: {
            title: "审核",
            index: 7
          },
          component: () => import("@/views/business/children/businessStatus")
        },
        {
          path: "platformAdvantage",
          meta: {
            title: "平台优势",
            index: 3
          },
          component: () => import("@/views/business/children/platformAdvantage")
        },
        {
          path: "storeTypeSelection",
          meta: {
            title: "选择店铺类型",
            index: 4
          },
          component: () => import("@/views/business/children/storeTypeSelection")
        },
        {
          path: "prepareData",
          name:'prepareData',
          meta: {
            title: "准备资料",
            // keepAlive: true,
            index: 5
          },
          component: () => import("@/views/business/children/prepareData")
        }
      ]
    },
    {
      path: "/community",
      name:'community',
      component: () => import("@/views/community/index"),
      redirect: "/community/communityStatus",
      children: [
        {
          path: "index",
          meta: {
            title: "团长",
            index: 0
          },
          component: () => import("@/views/community/children/index")
        },
        {
          path: "communityStatus",
          meta: {
            title: "社区团长",
            index: 1
          },
          component: () => import("@/views/community/children/communityStatus")
        },
        {
          path: "communitySettled",
          meta: {
            title: "社区团长入驻",
            index: 2
          },
          component: () => import("@/views/community/children/communitySettled")
        }
        
      ]
    },
    {
      path: "/businessPartner",
      name:'businessPartner',
      component: () => import("@/views/businessPartner/index"),
      redirect: "/businessPartner/index",
      children: [
        {
          path: "index",
          meta: {
            title: "合伙人",
            index: 0
          },
          component: () => import("@/views/businessPartner/children/index")
        },
        {
          path: "businessPartnerType",
          meta: {
            title: "入驻快速通道",
            index: 1
          },
          component: () => import("@/views/businessPartner/children/businessPartnerType")
        },
        {
          path: "businessPartnerSettled",
          meta: {
            title: "入驻",
            index: 2
          },
          component: () => import("@/views/businessPartner/children/businessPartnerSettled")
        },
        {
          path: "busindessPartnerStatus",
          meta: {
            title: "审核",
            index: 3
          },
          component: () => import("@/views/businessPartner/children/busindessPartnerStatus")
        },
        {
          path: "franchiseFee",
          meta: {
            title: "缴纳加盟费",
            index: 4
          },
          component: () => import("@/views/businessPartner/children/franchiseFee")
        }
      ]
    },
    {
      path: "/activityManager",
      name:'activityManager',
      component: () => import("@/views/activityManager/index"),
      redirect: "/activityManager/index",
      children: [
        {
          path: "index",
          meta: {
            title: "首页"
          },
          component: () => import("@/views/activityManager/children/index")
        },
        {
          path: "activityManager",
          meta: {
            title: "活动管理",
          },
          component: () => import("@/views/activityManager/children/activityManager")
        },
        {
          path: "activitySet",
          name:'activitySet',
          meta: {
            title: "商品管理",
            keepAlive: true,
            isBack: false
          },
          component: () => import("@/views/activityManager/children/activitySet")
        },
        {
          path: "activityProducts",
          meta: {
            title: "添加商品"
          },
          component: () => import("@/views/activityManager/children/activityProducts")
        },
        {
          path: "searchProducts",
          meta: {
            title: "搜索商品"
          },
          component: () => import("@/views/activityManager/children/searchProducts")
        }
      ]
    },
    {
      path: "/activityCreate",
      name:'activityCreate',
      meta: {
        title: "创建活动",
        keepAlive: true,
        isBack: false
      },
      component: () => import("@/views/activityManager/children/activityCreate")
    },
    {
      path: "*",
      component: () => import("@/components/NotFound")
    }
  ]
});

router.beforeEach((to, from, next) => {
  let { title, needLogin } = to.meta;
  let { isLogin } = store.state;
  document.title = title;

  if (needLogin && !isLogin) {
    next({
      path: "/login"
    });
  } else {
    next();
  }
});

export default router;
