import request from "../utils/request"

// 查询是否存在邮件 目前闲置作废
export function  checkFileExistFun(data){
    return request({
        url:"/mail/checkFileExist",
        method:"POST",
        data,
    })
}
// 邮件详情查询接口 
export function  queryMailInfoFun(data){
    return request({
        url:"/mail/queryMailInfo",
        method:"POST",
        data
    })
}

export function deleteFun(data){
    return request({
        url:"/mail/delete",
        method:"POST",
        data
    })
}
// 获取丰巢下载的url接口
export function downloadUrl(data){
    return request({
        // url:"/mail/downloadAttachment",
        url:"/mail/getDownloadUrl",
        method:"POST",
        data,
    })
}
// 1
export function endFun(data){
    return request({
        url:"/mail/end",
        method:"POST",
        data,
    })
}
// 反馈提交接口
export function feedbackFun(data){
    return request({
        url:"/mini-program/question-feedback",
        method:"POST",
        data,
    })
}
// https://testing-vdi.zdgzc.com/decs-ccfront/decs-cdacs/mini-program/start-vdi
// decs-ccfront/decs-cdacs/vdi/user-authorize
// 授权接口  1
export function authorizeFun(data){
    return request({
        url:"/vdi/user-authorize",
        method:"POST",
        data
    })
}

// https://staging-vdi.zdgzc.com/decs-ccfront/decs-cdacs/vdi/get-token
export function getTokenFun(data){
    return request({
        url:"/vdi/get-token",
        method:"POST",
        data
    })
}
// 告警接口
export function logsFun(data) {
    return request({
        url: "/vdi/report-log",
        method: "POST",
        data
    })
}

// 上报到报表统计
export function statFun(data) {
    return request({
        url: '/vdi/report-stat',
        method: 'POST',
        data
    })
}

// 文件下载的地址 
export function downloadFun(data){
    return request({
        url:"/mail/downloadAttachment",
        method:"POST",
        data
    })
}


export function queryMailAddr(data){
    return request({
        url:'/mail/queryMailAddr',
        method:'POST',
        data
    })
}


export default {
    checkFileExistFun,
    queryMailInfoFun,
    deleteFun,
    downloadUrl,
    endFun,
    feedbackFun,
    getTokenFun,
    logsFun,
    statFun,
    downloadFun,
    queryMailAddr
}