import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex);
const config = {
    plugins: [createPersistedState()],
    state: {
        isLogin: false,
        username: '',
        token: localStorage.getItem('token') || '',
        userId: localStorage.getItem('userId') || '',
        userInfo: '',
        businessSettledInfo: '',
        businessCategoryList: '',
        specialQualifications: '',
        backPrepareData: '',
        navH: '',
        activityCheckedGoods: '',
        timeSlots: '',
        activityGoods: '',
        activityType: 0
    },
    getters: {
        isLogin: state => state.isLogin,
        token: state => state.token,
        username: state => state.username,
        userId: state => state.userId,
        userInfo: state => state.userInfo,
        businessSettledInfo: state => state.businessSettledInfo,
        businessCategoryList: state => state.businessCategoryList,
        specialQualifications: state => state.specialQualifications,
        backPrepareData: state => state.backPrepareData
    },
    mutations: {
        updateNavH(state, payload) {
            state.navH = payload;
        },
        updateLogin(state, payload) {
            state.isLogin = payload;
        },
        updateToken(state, payload) {
            state.token = payload;
        },
        updateUsername(state, payload) {
            state.username = payload;
        },
        updateUserId(state, payload) {
            state.userId = payload;
        },
        updateUserInfo(state, payload) {
            state.userInfo = payload;
        },
        updateBusinessSettledInfo(state, payload) {
            state.businessSettledInfo = payload;
        },
        updateBusinessCategoryList(state, payload) {
            state.businessCategoryList = payload;
        },
        updateSpecialQualifications(state, payload) {
            state.specialQualifications = payload;
        },
        updateBackPrepareData(state, payload) {
            state.backPrepareData = payload;
        },
        updateActivityCheckedGoods(state, payload) {
            state.activityCheckedGoods = payload;
        },
        updateTimeSlots(state, payload) {
            state.timeSlots = payload;
        },
        updateActivityGoods(state, payload) {
            state.activityGoods = payload;
        },
        updateActivityType(state, payload) {
            state.activityType = payload;
        }
    },
    actions: {}
}
const store = new Vuex.Store(config);
export default store;