const base = {

}
base.$apiServer = {
    // baseApi: process.env.VUE_APP_URL,
    // baseApi: 'http://192.168.0.8:9000',
    baseApi: 'http://192.168.0.23:14020'
}
base.$api = {
    login: `${base.$apiServer.baseApi}/mock/973ec681e817a650ec18f8fb17af90e8/user/login`,
    settled: `${base.$apiServer.baseApi}/vrjgd-business/storeExamine/addStoreExamine`,  //商家入驻
    businessSettledInfo: `${base.$apiServer.baseApi}/vrjgd-business/storeExamine/appGetExamineByUserId`,  //商家入驻回显
    businessStoreType: `${base.$apiServer.baseApi}/vrjgd-business/bStoreClassification/getList`, //商家入驻类型
    totalGenerationSettled: `${base.$apiServer.baseApi}/vrjgd-provider-authority/aEGeneralRepresentative/addExamine`,  //全国总代入驻
    totalGenerationUpdate: `${base.$apiServer.baseApi}/vrjgd-provider-authority/aEGeneralRepresentative/updateExamine`,  //全国总代编辑
    totalGenerationInfo: `${base.$apiServer.baseApi}/vrjgd-provider-authority/aEGeneralRepresentative/getExamineByUserId`,  //全国总代回显
    transportCompanySettled: `${base.$apiServer.baseApi}/vrjgd-provider-authority/aETransportCompany/addExamine`,  //运力公司入驻
    transportCompanyUpdate: `${base.$apiServer.baseApi}/vrjgd-provider-authority/aETransportCompany/updateExamine`,  //运力公司编辑
    transportCompanyInfo: `${base.$apiServer.baseApi}/vrjgd-provider-authority/aETransportCompany/getExamineByUserId`,  //运力公司回显
    localServiceCenterSettled: `${base.$apiServer.baseApi}/vrjgd-provider-authority/aEGroupServiceCenter/addExamine`,  //地服中心入驻
    localServiceCenterUpdate: `${base.$apiServer.baseApi}/vrjgd-provider-authority/aEGroupServiceCenter/updateExamine`,  //地服中心编辑
    localServiceCenterInfo: `${base.$apiServer.baseApi}/vrjgd-provider-authority/aEGroupServiceCenter/getExamineByUserId`,  //地服中心回显
    activityChooseGoods: `${base.$apiServer.baseApi}/activity/chooseGoods`,  //活动选择商品列表
    activityList:  `${base.$apiServer.baseApi}/activity/getList`,  //活动列表
    activityStartNow:  `${base.$apiServer.baseApi}/activity/startNow`,  //活动立即开始
    activityDelete:  `${base.$apiServer.baseApi}/activity/delete`,  //活动删除
    activityCreate:  `${base.$apiServer.baseApi}/activity/create`,  //活动创建
    activityUpdate:  `${base.$apiServer.baseApi}/activity/update`,  //活动编辑
    activityInfo:  `${base.$apiServer.baseApi}/activity/getOneActivity`,  //活动查看
    activityGoodsList:  `${base.$apiServer.baseApi}/activity/getBindGoodsList`,  //活动商品
    activityGoodsSet:  `${base.$apiServer.baseApi}/activity/setPrice`,  //活动商品设置
    activityGoodsDelete:  `${base.$apiServer.baseApi}/activity/deleteBindGoods`,  //活动商品删除
}
export {
    base
}
