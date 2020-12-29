import { Toast } from 'vant';
import store from "@/store/index";

const loading = (flag) => {
    if (flag) {
        Toast.loading({
            mask: true,
            message: '加载中...'
        });
    } else {
        Toast.clear();
    }
}

// 判断Android还是ios
const appSource = () => {
    const u = navigator.userAgent;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isiOS) {
        return true;
    } else {
        return false;
    }
}

// 原生ios的方法
function invokeIos(obj){
    //传递的信息
    // let jsonStr = {"type":"skipNextWeb", "url":"weburl"};
    let jsonStr = obj;

    //UIWebView使用
    JGDIOSEventListeners(jsonStr);

    //WKWebView使用
    //使用下方方法,会报错,为使界面执行逻辑通畅,因此使用try-catch
    try {
        window.webkit.messageHandlers.JGDIOSEventListeners.postMessage(jsonStr)
    } catch(error) {
        console.log(error)
    }
}
function JGDIOSEventListeners(json){
    //空方法
}

//原生功能调用
const apiClass = {
    openWebview: function(url, method, jsonStr){  //新开Webview
        if(method){
            if(appSource()){
                invokeIos({type:"skipNextWeb", url: service.href+url, method: method, jsonStr: jsonStr});
            }else{
                window.android.startActivity(service.href + url,jsonStr); 
            }
        }else{
            if(appSource()){
                invokeIos({type:"skipNextWeb", url: service.href+url});
            }else{
                window.android.startActivity(service.href + url,null); 
            }
        }
    },
    closeWebview: function(fun,jsonStr){
        if(fun){
            if(appSource()){
                invokeIos({type:"closeWebview", method: fun, jsonStr: jsonStr});
            }else{
                window.android.backActivity(fun, jsonStr);
            }
        }else{
            if(appSource()){
                invokeIos({type:"closeWebview"});
            }else{
                window.android.back("close");
            }
        }
       
    },
    getParams: function (fun) {  //获取传参
        if(appSource()){
            invokeIos({type:"getPrePageInfo"});
        }else{
            window.android.getJson(fun);
        }
    },
    userinfo: function(id){   //获取用户信息
        if(appSource()){
            invokeIos({type:"userinfo", webId: id});
        }else{
            window.android.getLoginData(id);
        }
    },
    share: function(shareType,sharePlatform,data,imgType){  //分享
        if(appSource()){
            invokeIos({type:"share", shareType: shareType, sharePlatform: sharePlatform, content: data});
        }else{
            if(sharePlatform == "weixin"){
                if(imgType == 2){
                    window.android.sharePictureUrl(0,imgType,data.href,data.title,data.content,data.thumbs);
                }else if(imgType == 0){
                    window.android.sharePicture(0,data.imageUrl);
                }else{
                    window.android.sharePictureUrl(0,imgType,data.imageUrl,"","","");
                }
                
            }else if(sharePlatform == "moments"){
                if(imgType == 2){
                    window.android.sharePictureUrl(1,imgType,data.href,data.title,data.content,data.thumbs);
                }else if(imgType == 0){
                    window.android.sharePicture(1,data.imageUrl);
                }else{
                    window.android.sharePictureUrl(1,imgType,data.imageUrl,"","","");
                }

            }
            
        }
    },
    save: function (url,type) {  //保存图片
        if(appSource()){
            if(type == 0){
                invokeIos({type:"saveNetPhoto", webImageUrl: url});
            }else{
                invokeIos({type:"saveImage", webImageUrl: url});
            }
            
        }else{
            if(type == 0){
                window.android.sharePicture(2,url);
            }else{
                window.android.sharePictureUrl(2,type,url,"","","");
            }
        }
    },
    downloader: function (url) {
        if(appSource()){
            invokeIos({type:"saveNetPDF", webPDFUrl: url});
        }else{
            window.android.sharePictureUrl(2,2,url,"","","");
        }
    },
    pay: function (type,data) { //type 0支付宝/1微信 
        if(appSource()){
            invokeIos({type:"payBusinessVip", payType: type, payData: data});
        }else{
            window.android.merchantVipPayment(type,data); 
        }
    },
    uploader: function(){},
    login: function(){  //登录
        if(appSource()){ 
            invokeIos({type:"loginLose"});
        }else{
        }
    },
    open: function(){
        if(appSource()){
            invokeIos({type:"openInvitationList"});
        }else{
            window.android.skipInvitationList(); 
        }
    },
    openGoods: function(id){  //打开商品
        if(appSource()){
            invokeIos({type:"goToGoods", goodsId: id});
        }else{
            window.android.startGoodsDetails(id); 
        }
    },
    openStore: function(id){  //打开店铺
        if(appSource()){
            invokeIos({type:"goToStore", storeId: id});
        }else{
            window.android.startStoreDetails(id); 
        }
    },
    openVip: function(){
        if(appSource()){
            invokeIos({type:"openCashGoods"});
        }else{
            window.android.startCashGoods(); 
        }
    },
    richScan: function(){  //扫一扫
        if(appSource()){
            invokeIos({type:"openRichScan"});
        }else{
            window.android.startRichScan(); 
        }
    },
    callPhone: function(phone) {  //电话
        if(appSource()){
            invokeIos({type:"callPhone", phone: phone});
        }else{
            window.android.startCallPhone(phone); 
        }
    },
    getVRData: function(type) {  //VR场景数据
        if(appSource()){
            invokeIos({type:"getVRData", method: "onPlusReady"});
        }else{
            if(type == 'show'){
                window.android.getVRData(); 
            }else if(type == 'edit'){
                window.android.getUserVRData(); 
            }
            
        }
    },
    getHotGoodsList: function() { //热点商品列表
        if(appSource()){
        }else{
            window.android.startGoodsDetails(); 
        }
    },
    backVRData: function(data) { //VR传参
        if(appSource()){
        }else{
            window.android.backVRDataActivity(data); 
        }
    }

}

const nativeFunction = {
    openPhoto: (type, data) => {  //打开相册
        if(appSource()){
            invokeIos({type:"openAlbum ", webParams: type, 
                albumParams:{cropTool: data.isClip, photos: data.num}
            });
        }else{
            window.android.startPhotoTailor(type, data.isClip, data.num); 
        }
    },
    openMap: (type) => { //打开地图
        if(appSource()){
            invokeIos({type:"openMap ", webParams: type});
        }else{
            window.android.startMap(type); 
        }
    }
}

// 获取app传参
const getValueFromApp = (type, json) => {
    console.log(type);
    console.log(json);
    let data;
    if(typeof(json) == "string"){
        data = JSON.parse(json);
    }else{
        data = json;
    }

    const event = new CustomEvent("getValue",{
        detail: {
            type: type,
            data: data
        }
    });
    document.body.dispatchEvent(event);
}

// 获取用户信息
function getUserinfo(json,type){
    // alert(json)
    var data;
    if(typeof(json) == "string"){
        data = JSON.parse(json);
    }else{
        data = json;
    }
    console.log(data);

    store.commit("updateToken",data.token);
    store.commit("updateUserId",data.userId);
    store.commit("updateUserInfo",data);
    localStorage.setItem("token",data.token);
    localStorage.setItem("userId", data.userId);

    const event = new CustomEvent("getUser",{
        detail: {
            type: type,
            data: data
        }
    });
    document.body.dispatchEvent(event);
}

/**
 * @description: 
 * @param {*} that
 * @return {*}
 */
function clearKeepAlive(that){
    let vnode = that.$vnode
    let parentVnode = vnode.parent 
    console.log(parentVnode)
    if (parentVnode && parentVnode.componentInstance.cache) {
      var key = vnode.key == null
        ? vnode.componentOptions.Ctor.cid + (vnode.componentOptions.tag ? `::${vnode.componentOptions.tag}` : '')
        : vnode.key;
      var cache = parentVnode.componentInstance.cache;
      var keys  = parentVnode.componentInstance.keys;
        
      if (cache[key]) {
        if (keys.length) {
            var index = keys.indexOf(key)
            if (index > -1) {
                keys.splice(index, 1)
            }
        }
        delete cache[key]
      }
    }
}

export {
    loading,
    appSource,
    apiClass,
    nativeFunction,
    getUserinfo,
    getValueFromApp,
    clearKeepAlive
}