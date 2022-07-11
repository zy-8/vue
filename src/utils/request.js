import axios from "axios"
import { Toast,Dialog } from "vant"
const { baseURL } = window.baseURL

import unit from "./unit"
const version = "/decs-ccfront/decs-cdacs"


// -60300	beehive 接口请求失败
// -60301	beehive /vdi/get-token接口请求异常(fail)
// -60302	beehive /mini-program/question-feedback接口请求异常(fail)
// -60303	beehive /mail/queryMailInfo接口请求异常(fail)
// -60304	beehive /mail/delete接口请求异常(fail)
// -60305	beehive /mail/getDownloadUrl接口请求异常(fail)
// -60306	beehive /vdi/user-authorize接口请求异常(fail)
// -60307	beehive /mail/end接口请求异常(fail)
// -60308	beehive  必要参数丢失

  //  下载超时
// -60309	beehive  下载超时 


const instance = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? version : `${baseURL + version}`,
    timeout: 10*1000,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "X-Requested-With": "XMLHttpRequest",
    }
})

// 请求拦截器
instance.interceptors.request.use(function (config) {
    // 因授权接口出现授权成功但接口超时告警，所以把授权接口请求超时延长为 30s
    if(config.url.includes("user-authorize")){
        config.timeout = 30*1000
    }
    // 3.21 当appId第三个位为字母时，为内部客户，在请求的url上加上 iapi=true
    let appId = unit.getQueryVariable("appId")
    if (appId && /[a-zA-Z]/.test(appId[2])) {
        config.url += config.url.includes("?") ? '&iapi=true' : '?iapi=true'
    }
    
    return config

}, function (error) {
    console.log("请求拦截fail", error);
    return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(function (response) {

    // 当errorCode 存在且不为0时，需要上报
    let errorCode = response.data.errorCode
    if (errorCode != undefined && errorCode != 0) {
        console.log(response);
        if (!response.config.url.includes("report-log")) {
            // 接口错误码统一上报
            let logs = `beehive_logs: beehive_error ${response.config.url}_error/${errorCode} / Time:${new Date().getTime()}`
            unit.walog('beehive_logs', logs)
            if([ -45026, -45023, -57102 ].indexOf(errorCode) != -1  || response.config.url.includes('report-stat')){
                // -45026 vcode已被使用， -45023 vcode使用超时，做计数   -57102查无邮件
                unit.sendlog(logs,errorCode,true)
            }else{
                unit.sendlog(logs,errorCode)
            }
        }
    }
    return response.data
}, function (error) {
    console.log("ajax-fail", error);
    console.log(error.config.url);
    let errorText = ""
    if (navigator.onLine) {
        
        // 接口请求失败统一上报
        const url = error.config.url
        let errorCode = ""
        if(!url.includes("report-log")){
            
            
            let noReport = false //是否计数
            if(url.includes("get-token")) errorCode = "-60301"
            if(url.includes("question-feedback")){
                errorCode = "-60302"
                // noReport = true
            } 
            if(url.includes("queryMailInfo")) errorCode = "-60303"
            if(url.includes("delete")){
                errorCode = "-60304"
                // noReport = true
            } 
            if(url.includes("getDownloadUrl")) errorCode = "-60305"
            if(url.includes("user-authorize")) errorCode = "-60306"
            if(url.includes("end")){
                errorCode = "-60307"
                noReport = true
            }
            if(!errorCode) errorCode = '-60300'
            let logs = `beehive_logs:beehive_ajax_error/${url}_error /${errorCode}/ ${error} / Time:${new Date().getTime()}`
            unit.sendlog(logs,errorCode,noReport)
            unit.walog('beehive_error', logs)
        }
        errorText = `${error}(${errorCode})`
    } else {
        errorText = "当前网络连接不稳定"
    }
    //接口请求同时跳转页面导致接口请求出错  /delete /end非主流程接口 不显示弹窗
    if(!error.config.url.includes('report-log')  && !error.config.url.includes('report-stat') && error.config.url.includes('delete') && error.config.url.includes('end') ){
        Dialog.alert({
            message: errorText,
            confirmButtonColor: "#5285EC",
            confirmButtonText: "确定"
        }).then(() => { })
    }
    return Promise.reject(error)

})


export default instance