
const { baseURL, waEnv, waUrl} = window.baseURL
import wa from "@webank/wa-sdk"
import dsBridge from "dsbridge"
import { authorizeFun, logsFun, endFun, deleteFun, statFun } from "../api/index"
import { Dialog } from "vant"
import wx from "weixin-js-sdk"
import eruda from "eruda"



const unit = {
  // 统一初始配置
  initConfig() {

    // 开启移动端调试
    // eruda.init()

    let vdiAccessWay = unit.getQueryVariable('accessWay')
    let vdiAppId = unit.getQueryVariable('appId')

    if (vdiAccessWay == 'h5') {
      const title = unit.getQueryVariable('title')
      if (title && title != 'undefined') {
        document.title = title
      } else {
        // 兼容 wld h5接入title的显示
        if (['zdbizq8i', 'zdddjj1m'].indexOf(vdiAppId) != -1) {
          document.title = '成都市中大公证处'
        } else {
          document.title = '公证处可信取证平台'
        }
      }
    }

    console.log(window.location.href);
    console.log(window.location.search);


    // 断网处理
    // that.systemLine()
  },
  
  // 页面跳转的方法
  locationJump(url,type){
    // 当前有网络的情况下，执行逻辑方法
    console.log("currentNetWork",navigator.onLine );
    if(navigator.onLine){
      // 跳转的方式
      switch(type){
        case "replace":
          window.location.replace(url)
          break;
        case "back":
          //如果上一页的地址存在，则返回上一页
          //如果不存在 则用兜底url跳转
          //3.21 由于在sdk内document.referrer不生效，所以暂时无法做兜底处理
          // if(document.referrer){
          //   window.history.back()
          // }else{
          //   window.location.replace(url)
          // }
          window.history.back()
          break;
        case "href":
        default:
          window.location.href = url
          break;
      }
    }else{
      // 无网络的情况下，显示弹窗
      Dialog.alert({
        message: "当前网络连接不稳定",
        confirmButtonColor: "#5285EC",
        confirmButtonText: "重试"
      }).then(() => {})
    }
  },
  // 埋点上报
  walog(name, log, awaitTime) {
    wa.init({
      appId: "H002807350", //（必填）应用ID pv、uv上报查询依据，区分不同应用的上报数据，由后台分配；
      account: "h5_zdgzc", //（必填）应用标识  pv、uv上报查询依据，区分同一应用ID下的上报数据，可以理解为第二层级appId，由业务方自己定义；
      autoReport: false, //（非必填）是否开启自动上报，默认开启，仅用于页面进入时PV的自动上报；
      pageTime: false, //（非必填）是否统计页面加载时间，默认关闭
      errorCatch: true, //（非必填）是否开启错误自动捕获，默认开启
      env: waEnv, //（非必填）release为生产，test为测试，默认根据域名判断
      host:waUrl,
      //id: 0,  //（非必填）业务ID，非必须字段
      //pageId: 0, //页面唯一标识
      //openId:0,//用户唯一标识
      // host: `${baseURL}/wa`
    });
    wa.setParam("openId", this.getQueryVariable("daId"));
    wa.setParam("pageId", this.getQueryVariable("site"));
    wa.setParam('deviceInfo', navigator.userAgent)
    const info = {
      appId: this.getQueryVariable("appId"),
      accessway: this.getQueryVariable("accessWay"),
      site: this.getQueryVariable("site"),
      daId: this.getQueryVariable("daId"),
      time: new Date().getTime(),
      name: name,
    };
    if(!!log){
      if(typeof log == 'string'){
        info['log'] = log
      }else{
        info['log'] = JSON.stringify( log )
      }
    }
    if (!!awaitTime) {
      info["awaitTime"] = awaitTime;
    }
    for (let i in info) {
      switch (i) {
        case "appId":
          wa.setParam("field_y_0", info[i]);
          break;
        case "accessway":
          wa.setParam("field_y_1", info[i]);
          break;
        case "site":
          wa.setParam("field_y_2", info[i]);
          break;
        case "daId":
          wa.setParam("field_y_3", info[i]);
          break;
        case "time":
          wa.setParam("field_y_4", info[i]);
          break;
        case "name":
          wa.setParam("field_y_5", info[i]);
          break;
        case "awaitTime":
          wa.setParam("field_y_6", info[i]);
          break;
        default:
          wa.setParam("field_y_7", info[i]);
          break;
      }
    }
    console.log(name, info);
    wa.clickStat(name, 1, info);
  },
  // 前端日志上报
  sendlog(logs,errorCode,notReportError) {
    // let logs = `beehive-ajax-error: get-token ${res.errorCode} / ${res.errorMessage} / Time: ${new Date().getTime()}`
    // let logs = `beehive_authorization_error: user authorization error -60008 ${e} / Time: ${new Date().getTime()}`

    let that = this
    let data = {
      "v": "1.0.0",
      "ts": new Date().getTime(),
      "messageId": "",
      "arg": {
        "daId": that.getQueryVariable('daId'),
        "appId": that.getQueryVariable('appId'),
        "site": that.getQueryVariable("site"),
        "msg": logs,
        "alert": true,
        'errorCode':errorCode
      }
    }
    // alert 为true即告警，false 即计数
    if(notReportError){
      data.arg.alert = false
    }
    console.log( `logs= ${logs}`);
    logsFun(data).then(res => {
      // console.log(res);
    }).catch(e => {
      console.log(e);
    })
  },

  // 上报到报表统计
  reportStat( name ){
    let data = {
      "v": "1.0.0",
      "arg": {
        "loginToken": unit.getQueryVariable('loginToken'),
        "metric": name,
        "value": "1",
        "idNo": "",
        "daId": unit.getQueryVariable('daId'),
        "appId": unit.getQueryVariable('appId'),
        "site": unit.getQueryVariable('site'),
        "extStr": unit.getQueryVariable('accessWay'),
        "extLong": '',
      }
    }
    statFun(data).then(res => {
      if (res.errorCode != 0) {
        unit.walog('reportStat_error', res)
      }
    }).catch(e => {
      unit.walog('reportStat_fail', e)
    })
    // 报表对应的指标名
    // show_mailname 登录页曝光 vstarter_show_login
    // resolve_digitalCode 用户点击登录 vstarter_site_login 
    // show_detailpage  登录成功次数 vstarter_page_after_login
    // click_download 用户点击下载  vstarter_download_click
  },

  // 获取url中的参数
  getQueryVariable(name, proto) {
    var after = window.location.search.split("?")[1];
    if (after) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
      var r = after.match(reg);
      if (r != null) {
        let data = r[2]
        // qqmail 为前缀的 site 需要改为邮箱 beehive为前缀类型 2-10
        // 例如 qqmail-alipay -> beehive-alipay
        // 形参proto存在时，则不替换site
        if (!proto && data.indexOf('qqmail') != -1) {
          data = data.replace(/qqmail/, "beehive")
        }
        return decodeURIComponent(data)
      } else {
        return "";
      }
    }
  },
  sdkSetBackType(type="close") {
    // 通知sdk 已进入取证页面,设置返回为 close退出页面/vdi, back返回上一页(没有则退出sdk)
    let data = {
      arg: {
        type: type,
      },
      ts: new Date().getTime(),
    };
    console.log("sdk/setBackType", data);
    dsBridge.call("setBackType", data);
    unit.walog('sdk_setBackType', data)
  },
  goToMailstart() {
    let that = this
    let url = `./mailstart.html${that.splicingUrl()}`
    that.locationJump(url,"replace")
  },
  adminBtn() {
    // 点击查看下载文件上报
    this.walog("click_fileAdmin");
    let data = {
      arg: {
        daIdList: [this.getQueryVariable('daId')],
        // 只读模式，模式可编辑
        readMode: true,
      },
      ts: new Date().getTime(),
    };
    console.log("sdk/openFileManager", data);
    dsBridge.call("openFileManager", data);
    unit.walog('sdk_openFileManager', data)

  },
  // 点击授权
  beehiveAuth() {
    let that = this
    let daId = that.getQueryVariable("daId")
    let loginToken = that.getQueryVariable("loginToken")
    let appId = that.getQueryVariable("appId")
    let site = that.getQueryVariable("site")
    let openId = that.getQueryVariable("openId")
    let accessway = that.getQueryVariable("accessWay")
    let data = {
      'v': "1.0.0",
      'arg': {
        daId: daId,
        loginToken: loginToken,
        appId: appId,
        site: site,
        openId: openId,
        ext: {}
      }
    }
    return new Promise(function(resolve,reject){
      authorizeFun(data).then(res=>{
        resolve(res)
      }).catch(e=>{
        reject(e)
      })
    })
  },
  jumpmini(url) {
    // wx.miniProgram.reLaunch
    wx.miniProgram.navigateTo({
      url: url,
      complete: (res) => { },
      fail: (res) => { },
      success: (result) => { },
    });
  },
  // 判断sdk “获取版本”的接口是否存在及当前版本是否小于 vNum1.2.0
  checkoutVersion(vNum) {
    return new Promise((reslove, reject) => {
      const hasNativeMethod = dsBridge.hasNativeMethod('getVersionInfo')
      console.log('hasNativeMethod getVersionInfo', hasNativeMethod)
      // 判断接口是否存在
      if (hasNativeMethod) {
        console.log('method exit')
        // 如果存在则对比版本
        dsBridge.call('getVersionInfo', function (data) {
          let res = ''
          if (typeof data == 'string') {
            res = JSON.parse(data)
          } else {
            res = data
          }

          if (res.code == 0) {
            let version = String(res.data.sdk_version)
            let compare = unit.compareVersion(version,vNum)
            unit.walog(`sdk_version_${version}`, data)
            reslove(!compare)
            // if (version < vNum) {
            //   reslove(true)
            // } else {
            //   reslove(false)
            // }
          } else {
            let logs = `beehive_logs:beehive_error/sdk_getVersionInfo_error/${res.code} /${res.msg}/ Time:${new Date().getTime()}`
            unit.sendlog(logs,res.code)
            reslove(true)
          }
        })
      } else {
        console.log('method not exit')
        // 如果不存在则提示
        reslove(true)
      }
    })
  },

  compareVersion(v1, v2) {
    // v1当前版本
    // 判断两个版本大小，小返回false,大于或者等于返回true
    if (!v1) {
      return false
    }
    if (!v2) {
      return true
    }
    if (v1 == v2) {
      return true;
    }
    const vs1 = v1.split(".").map((a) => parseInt(a));
    const vs2 = v2.split(".").map((a) => parseInt(a));
    const length = Math.min(vs1.length, vs2.length);
    for (let i = 0; i < length; i++) {
      if (vs1[i] > vs2[i]) {
        return true;
      } else if (vs1[i] < vs2[i]) {
        return false;
      }
    }
    if (length == vs1.length) {
      return false;
    } else {
      return true;
    }
  },
  endPost(daStatus) {
    // 结束取证
    let that = this
    let accessway = that.getQueryVariable("accessWay")
    let daId = that.getQueryVariable("daId")
    let appId = that.getQueryVariable("appId")
    let site = that.getQueryVariable("site")
    let loginToken = localStorage.getItem("loginToken") || that.getQueryVariable("loginToken")

    let data = {
      arg: {
        daId: daId,
        site: site,
        loginToken: loginToken,
      },
      ts: new Date().getTime(),
      v: "1.0.0",
    };
    console.log("end", data);
    endFun(data).then(res => { })

    if (accessway == "sdk") {
      let sdkData = {
        "ts": new Date().getTime(),
        "arg": {
          "daId": daId
        }
      }
      console.log("sdk/closeWindow", sdkData);
      that.walog('sdk_closeWindow', sdkData)
      dsBridge.call("closeWindow", sdkData)
    }else{
      // h5 回到数据源列表页
      // window.location.replace(`../vdi/${localStorage.getItem('dataSourceUrl')}`)
      let url = localStorage.getItem('dataSourceUrl')

      if(/^[https|http|ftp|www]/.test(url)){
        // 用户侧
        if(url.includes("?")){
          url += `&daStatus=${daStatus}&daId=${daId}&site=${site}`
        }else{
          url += `?daStatus=${daStatus}&daId=${daId}&site=${site}`
        }

        that.walog('dataSourceUrl',url)
        setTimeout(()=>{
          window.location.replace(url)
        },100)
      }else{

        if(url.includes('?')){
          url += `&daStatus=${daStatus}&daId=${daId}&site=${site}`
        }else{
          url += `?daStatus=${daStatus}&daId=${daId}&site=${site}`
        }
        that.walog('dataSourceUrl',`../vdi/${url}`)
        setTimeout(()=>{
          window.location.replace(`../vdi/${url}`)
        },100)
        
      }

    }
  },

  // 删除邮件
  mailDel() {
    let that = this
    let accessway = that.getQueryVariable("accessWay")
    let daId = that.getQueryVariable("daId")
    let digitalCode = that.getQueryVariable("digitalCode")
    let site = that.getQueryVariable("site")
    let loginToken = that.getQueryVariable("loginToken")
    const data = {
      arg: {
        daId: daId,
        digitalCode: digitalCode,
        site: site,
        loginToken: loginToken
      },
      ts: new Date().getTime(),
      v: "1.0.0",
    };
    return new Promise(function(resolve,reject){
      deleteFun(data).then(res=>{
        resolve(res)
      }).catch(e=>{
        reject(e)
      })
    })
  },
  
  // 授权成功文案
  getAgencyDes() {
    const appId = this.getQueryVariable('appId')

    const authorizationPageWord = localStorage.getItem('authorizationPageWord')
    // 兼容现有客户但是没有配置授权文案的内容
    if (authorizationPageWord && authorizationPageWord != "null") {
      return authorizationPageWord
    } else {
      const baseStr = '是否同意提交该文件至'
      const description = {
        'xxxxx': 'xxxxxx使用',
      }
      if (description[appId]) {
        return baseStr + description[appId]
      } else {
        return '是否同意提交？'
      }
    }
  },
  // 获取site的配置文案
  getSiteDes() {
    // const vdiSite=this.getQueryVariable("site")

    // const siteDesInfo=JSON.parse(localStorage.getItem("siteDesInfo"))

  },
  // 网络连接情况
  systemLine() {
    let that = this
    // 断网时
    window.addEventListener("offline", function () {
      console.log("offline");
      localStorage.removeItem("isOffline")
      localStorage.setItem("isOffline", "true")
      that.checkLine()
    })
    // 联网时
    window.addEventListener("online", function () {
      console.log("online");
      localStorage.removeItem("isOffline")
      localStorage.setItem("isOffline", "false")
    })
  },
  checkLine() {
    let that = this
    Dialog.alert({
      message: "当前网络连接不稳定",
      confirmButtonColor: "#5285EC",
      confirmButtonText: "重试"
    }).then(() => {
      let isOffline = localStorage.getItem("isOffline")
      if (isOffline === "true") {
        setTimeout(() => {
          that.checkLine()
        }, 300)
      }
    })
  },
  // 拼接url参数
  splicingUrl(){
    let that = this
    let originUrlData = localStorage.getItem("originUrlData")
    // window.location.search
    if(originUrlData && originUrlData !== null){
      return originUrlData
    }else{
      let accessway = that.getQueryVariable("accessWay")
      let site = that.getQueryVariable("site")
      let vcode = that.getQueryVariable("vcode")
      let sign = that.getQueryVariable("sign")
      let appId = that.getQueryVariable("appId")
      let emailaddress = that.getQueryVariable("emailaddress")
      let daId = that.getQueryVariable("daId")
      let bizScenario = that.getQueryVariable("bizScenario")
      let loginToken = localStorage.getItem("loginToken") || that.getQueryVariable("loginToken")
      // digitalCode 取数码参数根据跳转的目标不同自行再拼接

      let url = `?accessWay=${accessway}&site=${site}&vcode=${vcode}&sign=${sign}&appId=${appId}&emailaddress=${emailaddress}&daId=${daId}&bizScenario=${bizScenario}&loginToken=${loginToken}`
      localStorage.removeItem("originUrlData")
      localStorage.setItem("originUrlData",url)
      return url    
    }
  },
  // 处理办理结束的方法  7.12此方法停用，新的调用vdiQuit方法
  // timeoutFun(daStatus){
  //   let that = this
  //   let accessway = that.getQueryVariable("accessWay")
  //   if(accessway.includes('miniapp')){
  //     // daStatus=25 办理已结束    20办理超时
  //     let url = `../vdiError/vdiError${that.splicingUrl()}&daStatus=${daStatus}`
  //     console.log(url);
  //     that.jumpmini(url)
  //   }else{
  //     // 非小程序的情况下，sdk和h5都跳转到error页面
  //     let url = `./error.html${that.splicingUrl()}&errorStatus=${daStatus}`
  //     that.locationJump(url,"replace")
  //   }
  // },

  // 统一退出处理
  async vdiQuit(errorPage, end, daStatus, deleteMail) {
    // errorPage 是否需要进入error页面
    // end  是否需要调用/end接口
    // deleteMail  调用/end时是否需要删除邮件

    console.log('vdi quit');
    
    
    let that = this 
    if (end) await that.endRequest(deleteMail)
    let accessway = that.getQueryVariable('accessWay')

    if (accessway && accessway.includes('miniapp')) {
      let url = `../vdiError/vdiError${that.splicingUrl}&daStatus=${daStatus}`

      that.jumpmini(url)
    } else {
      

      if (errorPage) {
        let url = `./error.html${that.splicingUrl()}&errorStatus=${daStatus}`
        that.locationJump(url, 'replace')
      } else {
        if (accessway == 'sdk') {
          that.sdkQuit()
        } else {
          // h5模式
          that.h5Quit(daStatus)
        }
      }

    }
    
  },


  endRequest(deleteMail) {
    console.log('end request');
    let that = this
    let daId = that.getQueryVariable('daId')
    let site = that.getQueryVariable('site')
    let loginToken = localStorage.getItem("loginToken") || that.getQueryVariable("loginToken")

    let data = {
      arg: {
        daId: daId,
        site: site,
        loginToken: loginToken,
        deleteMail: false,//是否需要后台调 删除邮件接口
      },
      ts: new Date().getTime(),
      v: "1.0.0",
    };
    if (deleteMail) data.arg.deleteMail = deleteMail

    console.log("end", data);
    return new Promise((resolve, reject) => {
      endFun(data).then(function (res) {
        console.log('endFun/res', res);
        resolve(res)
      }).catch(e => {
        console.log('endFun/e', e);
        reject(e)
      })
    })
  },


  // 统一封装H5接入方式的退出逻辑
  h5Quit(daStatus) {
    console.log('h5 quit');
    let that = this
    var url = localStorage.getItem('dataSourceUrl')
    let daId = that.getQueryVariable('daId')
    let site = that.getQueryVariable('site')
    that.walog('dataSourceUrl', url)

    if (url && url != null) {
      if (/^[https|http|ftp|www]/.test(url)) {
        // 用户侧
        if (url.includes("?")) {
          url += `&daStatus=${daStatus}&daId=${daId}&site=${site}`
        } else {
          url += `?daStatus=${daStatus}&daId=${daId}&site=${site}`
        }
      } else {

        if (url.includes('?')) {
          url += `&daStatus=${daStatus}&daId=${daId}&site=${site}`
        } else {
          url += `?daStatus=${daStatus}&daId=${daId}&site=${site}`
        }
        url = `../vdi/${url}`
      }

      setTimeout(() => {
        window.location.replace(url)
      }, 100)

    } else {
      console.log('dataSourceUrl_error', url);
      that.walog('dataSourceUrl_error', url)
      Dialog.alert({
        message: `dataSourceUrl错误，${url}`,
        confirmButtonColor: "#5285EC",
      }).then(() => {

      })
    }
  },

  // 统一封装sdk接入方式的退出逻辑
  sdkQuit() {
    console.log('sdk call close');
    const data = {
      arg: {
        daId: this.getQueryVariable('daId')
      },
      ts: new Date().getTime()
    }
    unit.walog('sdk_closeWindow', sdkData)
    dsBridge.call('closeWindow', data)
  },
  
}

export default unit 