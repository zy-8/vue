<template>
  <div class="guide" style="display: flex">
    <div class="notice">
      <img class="guideimg" :src="guideimg" alt="" />
      <div class="notice_btn">
        <div :class="accessWay == 'sdk' ? 'notice_ok' : 'notice_goapp'" @click="back">
          确定
        </div>
        <div class="notice_goapp" v-show="accessWay == 'sdk'" @click="jumpApp">
          前往开具
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import unit from "../utils/unit";
import dsBridge from "dsbridge";
import { Dialog,Toast } from "vant";
import { siteDes } from "../utils/beehiveDes";

export default {
  name: "app",
  watch: {
    site(newVal, oldVal) {
      // 新site需要添加的地方-guide图
      this.viewText = `即将前往"${siteDes[newVal]?.appName ?? "第三方APP"}"`;
      this.guideimg = require(`../assets/guide_${newVal}.png`);
    },
  },
  data() {
    return {
      guideimg: "",
      viewText: "",
      mobile: "", //android


      // 新site需要添加的地方
      // scheme地址 ios
      // pathurl: {
      //   "android":{
      //     "beehive-wechatpay": "weixin://",
      //     "beehive-ewallet": "weixin://",
      //     "beehive-alipay": "alipays://platformapi/startapp?appId=20000003",
      //     "beehive-abc": "bankabc://",//农业
      //     "beehive-ccb": "ccbapp://main.ccb.com://",//建设
      //     "beehive-cmb": "cmbmobilebank://",//招商
      //     "beehive-spdb": "spdbbank://wap.spdb.com.cn://",//浦发
      //     "beehive-icbc": "com.icbc.androidclient://",//中国工商
      //     "beehive-gdb": "cgb://lua/openxml://",//广发银行
      //     "beehive-citicb": "wakeupciticmobilebank://splashActivity:8899/citicbank",//中信
      //     "beehive-pabc": "paesuperbank://",//平安银行 
      //     // "beehive-pabc": "com.pingan.paces.ccms://anydoor://",//平安银行  1加10 测试了需要先启动app才能跳
      //     'beehive-boc': 'boc://com.chinamworld.bocmbci/startWith'//中行
      //   },


 
      //   'ios':{
      //     "beehive-wechatpay": "weixin://",
      //     "beehive-ewallet": "weixin://",
      //     "beehive-alipay": "alipays://platformapi/startapp?appId=20000003",
      //     "beehive-abc": "bankabc://",//农业
      //     "beehive-ccb": "ccbapp://main.ccb.com://",//建设
      //     // "beehive-ccb": "ccbmobilebank://",//建设
      //     // "beehive-ccb": "wx2654d9155d70a468://",//建设
      //     "beehive-cmb": "cmbmobilebank://",//招商
      //     "beehive-spdb": "spdbbank://wap.spdb.com.cn://",//浦发
      //     // "beehive-spdb": "spdbbank://",//浦发
      //     "beehive-icbc": "com.icbc.iphoneclient://",//中国工商
      //     // "beehive-icbc": "wb19490884://",//中国工商
      //     "beehive-gdb": "cgb://lua/openxml://",//广发银行
      //     "beehive-citicb": "citicbankpay://unionPay:8899://",//中信
      //     "beehive-pabc": "paesuperbank://",//平安银行
      //     'beehive-boc': 'bocmbciphone://',//中行
      //   }
      // },


      emailaddress: "XXXXXX1234@zdgzc.com",
      daId: "",
      vcode: "",
      site: "",
      bizScenario: "",
      appId: "",
      sign: "",
      accessWay: "",
      loginToken: "",
      backPage: "",//"mailstart" "feedback"
    };
  },
  mounted() {
    unit.initConfig();
    console.log("guide-page");
    unit.walog('show_guide')

    this.emailaddress = unit.getQueryVariable("emailaddress");
    this.daId = unit.getQueryVariable("daId");
    this.vcode = unit.getQueryVariable("vcode");
    this.site = unit.getQueryVariable("site");
    this.bizScenario = unit.getQueryVariable("bizScenario");
    this.appId = unit.getQueryVariable("appId");
    this.sign = unit.getQueryVariable("sign");
    this.accessWay = unit.getQueryVariable("accessWay");
    this.loginToken = unit.getQueryVariable("loginToken");
    console.log("loginToken", this.loginToken, !!this.loginToken);
    console.log(this._data);


    this.backPage = unit.getQueryVariable("backPage")

    if (this.accessWay == "sdk") {
      unit.sdkSetBackType("back");
      this.sdkgetVersionInfo();
    }
  },
  methods: {
    back() {
      // console.log(document.referrer);
      console.log(this.backPage);
      let url = `./${this.backPage}.html${unit.splicingUrl()}`
      unit.locationJump(url,"back")
    },
    jumpApp() {
      // 前往app
      unit.walog("click_jumpApp");
      let that = this;
      Dialog.confirm({
        message: that.viewText,
        confirmButtonColor: "#5285EC",
      })
        .then(() => {
          console.log(that.mobile);
          // 确认跳转上报
          unit.walog("resolve_jumpApp");
          let data = {
            arg: {
              daId: this.daId, //取证的ID
              site: this.site,
              // path:this.pathurl[this.site],
              // packageName: this.packageUrl[this.site].packageName,
              // pageName: this.packageUrl[this.site].pageName,
            },
            ts: new Date().getTime(),
          };

          data.arg['path'] = siteDes[this.site]?.pathUrl[this.mobile]
          

          console.log("jumpTo", data);
          unit.walog('sdk_jumpTo', data)
          dsBridge.call("jumpTo", data, function (e) {
            let res = "";
            if (typeof e == "string") {
              res = JSON.parse(e);
            } else {
              res = e;
            }
            unit.walog('sdk_jumpTo_res',e)
            console.log(res); 
            if (res.code == "0") {
            } else {
              console.log("跳转失败");
              let text = ""
              if(that.site == "beehive-alipay"){
                text = "支付宝"
              }else if(that.site == "beehive-wechatpay" || that.site == "beehive-ewallet"){
                text = "微信"
              }else{
                text = "手机银行"
              }
              unit.walog('jump_fail', e)
              Toast(`跳转失败，请自行前往${text}APP端根据指引操作`);
            }
          });
        })
        .catch(() => { });
    },
    // 获取sdk设备信息
    sdkgetVersionInfo() {
      let that = this;
      let data = {
        arg: {},
        ts: new Date().getTime(),
      };
      dsBridge.call("getVersionInfo", data, function (e) {
        let res = "";
        if (typeof e == "string") {
          res = JSON.parse(e);
        } else {
          res = e;
        }
        console.log(res);
        unit.walog('sdk_getVersionInfo_res',e)
        if (res.code == "0") {
          
          that.mobile = res.data.os.toLowerCase();
          unit.walog(`sdk_mobile_${that.mobile}`)
          //  android
          console.log("mobile=", that.mobile);
        } else {
          unit.walog('sdk_getVersionInfo_fail',e)
          console.log(`sdk-getVersionInfo-fail/${res.code} ${res.msg}`);
          let logs = `beehive_logs:beehive_error/sdk_error_getVersionInfo/${res.code}/${res.msg}/Time:${new Date().getTime()}`
          unit.sendlog(logs,res.code,true)
        }
      });
    },
  },
};
</script>

<style>
/* 指导图 */
.guide {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
  left: 0;
  top: 0;
  background-color: white;
  padding: 16px;
  box-sizing: border-box;
}

.notice {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.notice img {
  width: 100%;
  margin-bottom: 132px;
}

.notice_btn {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  padding: 16px 16px 34px;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.notice_ok,
.notice_goapp {
  flex: 1;
  margin: 0 10px;
  height: 44px;
  line-height: 44px;
  box-sizing: border-box;
  text-align: center;
  font-weight: 500;
  border-radius: 25px;

  background-color: #3071F2;
  color: white;
}
.notice_ok {
  border: 1px solid #3071F2;
  background-color: white;
  color: #3071F2;
}
.notice_goapp {
  background-color: #3071F2;
  color: white;
}

.next {
  position: absolute;
  bottom: 46px;
  left: 10%;
  width: 80%;
  height: 40px;
  margin: 0 auto;
  line-height: 40px;
  text-align: center;
  color: white;
  font-weight: 500;
  background-color: #3071F2;
  border-radius: 25px;
}
</style>