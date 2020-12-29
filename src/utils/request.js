// import axios from "axios";
import store from "../store";
import router from "../router";
import { Toast } from "vant";
// 创建axios实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_URL, // api 的 VUE_APP_URL
  timeout: 50000 // 请求超时时间(因为需要调试后台,所以设置得比较大)
});

service.defaults.headers.post['Content-Type'] = 'application/json' // post请求头的设置

// request拦截器,在请求之前做一些处理
service.interceptors.request.use(
  config => {
    let token = store.getters.token;
    if (token) {
      // 给请求头添加laohu-token
      // config.headers["token"] = token;
      config.headers["Authorization"] = token;
    }
    return config;
  },
  error => {
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器,数据返回后进行一些处理
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    // console.log(response)
    const res = response.data;
    if (response.status === 200) {
        return Promise.resolve(response.data)
    }else{
      console.log(response)
      return Promise.reject("网络异常");
    }
    // if (res.code == "666") {
    //   return res;
    // } else if (res.code == "603") {
    //   // code为603代表token已经失效,
    //   // 提示用户,然后跳转到登陆页面
    //   router.push("/login");
    // } else {
    //   Promise.reject(res);
    // }
  },
  error => {
    if (error.response) {
        console.log('error.response')
        console.log(error.response);
    } else if (error.request) {
        console.log(error.request)
        console.log('error.request')
        Toast("请求超时");
    } else {
        console.log('Error', error.message);
    }
    console.log(error)
    return Promise.reject("网络异常");
  }
);
export default service;
