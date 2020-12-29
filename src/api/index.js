import { get, post } from '@/utils/http.js'
import { base } from '@/api/base.js'

function login(params) {
    return post(base.$api.login, params)
}
const settledSubmit = (params) => {
    return post(base.$api.settled, params)
}
const getBusinessSettledInfo = (params) => {
    return get(base.$api.businessSettledInfo, params)
}
const getBusinessStoreType = (params) => {
    return get(base.$api.businessStoreType, params)
}
// 第三方入驻
const thirdPartySettled = (type, params) => {
    if(type === '0'){
        return post(base.$api.localServiceCenterSettled, params)
    }else if(type === '1'){
        return post(base.$api.totalGenerationSettled, params)
    }else if(type === '2'){
        return post(base.$api.transportCompanySettled, params)
    }
    
}
const thirdPartyUpdate = (type, params) => {
    if(type === '0'){
        return post(base.$api.localServiceCenterUpdate, params)
    }else if(type === '1'){
        return post(base.$api.totalGenerationUpdate, params)
    }else if(type === '2'){
        return post(base.$api.transportCompanyUpdate, params)
    }
}
const getThirdPartyInfo = (type, params) => {
    if(type === '0'){
        return post(base.$api.localServiceCenterInfo, params)
    }else if(type === '1'){
        return post(base.$api.totalGenerationInfo, params)
    }else if(type === '2'){
        return post(base.$api.transportCompanyInfo, params)
    }
}
// 活动管理
const getActivityList = (params) => {
    return get(base.$api.activityList, params)
}
const activityStartNow = (params) => {
    return post(base.$api.activityStartNow, params)
}
const activityDelete = (params) => {
    return post(base.$api.activityDelete, params)
}
const activityUpdate = (type, params) => {
    if(type === '0') return post(base.$api.activityCreate, params);
    if(type === '1') return post(base.$api.activityUpdate, params)
}
const getActivityInfo = (params) => {
    return get(base.$api.activityInfo, params)
}
const getActivityGoodsList = (params) => {
    return get(base.$api.activityGoodsList, params)
}
const activityGoodsSet = (params) => {
    return post(base.$api.activityGoodsSet, params)
}
const activityGoodsDelete = (params) => {
    return post(base.$api.activityGoodsDelete, params)
}
const getActivityChooseGoods = (params) => {
    return get(base.$api.activityChooseGoods, params)
}
// 
export {
    login,
    settledSubmit,
    getBusinessSettledInfo,
    getBusinessStoreType,
    thirdPartySettled,
    thirdPartyUpdate,
    getThirdPartyInfo,
    getActivityChooseGoods,
    getActivityList,
    activityStartNow,
    activityDelete,
    activityUpdate,
    getActivityInfo,
    getActivityGoodsList,
    activityGoodsSet,
    activityGoodsDelete
}
