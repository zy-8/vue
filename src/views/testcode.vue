<template>
  <div id="testcode_page">
    <div class="container">
      <div class="inputcontent">
        <div class="inputtcontent_header">
          <span class="contentText">{{ contentText }}</span>
        </div>
        <div class="inputcontent_items">
          <input type="text" id="inputcode"  v-model="digitalCode" :placeholder="inputcodevalue" />
        </div>
      </div>

      <button  class="confirmDigitalCode" :disabled="disabled"  @click="confirmButton">
        确定
      </button>
      <p class="again">
        <span class="contentText2" @click="goToFeedback">{{ contentText2 }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { queryMailInfoFun } from "../api/index";

import { Toast, Dialog } from "vant";

import { siteDes } from '../utils/beehiveDes.js'
import unit from "../utils/unit";

export default {
  data() {
    return {
      disabled: true,
      emailaddress: "",
      daId: "",
      vcode: "",
      site: "",
      bizScenario: "",
      appId: "",
      sign: "",
      accessWay: "",
      loginToken: "",
      digitalCode: "",
      type: "", //取数码类型digital  解压码类型decode

      contentText: "请输入短信中的取数码",
      contentText2: "未收到取数码？",
      inputcodevalue: "请输入取数码",
    };
  },
  watch: {
    type(newVal, oldVal) {
      switch (newVal) {
        case "decode":
          this.contentText = `请输入${siteDes[this.site]?.siteDsp ?? "目标APP"}的解压码`;
          this.inputcodevalue = "请输入解压码";
          this.contentText2 = "找不到解压码？";
          break;
        case "digital":
        default:
          this.contentText = "请输入短信中的取数码";
          this.inputcodevalue = "请输入取数码";
          this.contentText2 = "未收到取数码？";
          break;
      }
    },
    digitalCode(newVal, oldVal) {
      this.disabled = !newVal
    },
  },
  mounted() {
    unit.initConfig();
    console.log("testcode-page");

    this.emailaddress = unit.getQueryVariable("emailaddress");
    this.daId = unit.getQueryVariable("daId");
    this.vcode = unit.getQueryVariable("vcode");
    this.site = unit.getQueryVariable("site");
    this.bizScenario = unit.getQueryVariable("bizScenario");
    this.appId = unit.getQueryVariable("appId");
    this.sign = unit.getQueryVariable("sign");
    this.accessWay = unit.getQueryVariable("accessWay");
    this.loginToken = unit.getQueryVariable("loginToken");
    this.type = siteDes[this.site]?.type ?? "digital";
    console.log("loginToken", this.loginToken, !!this.loginToken);
    console.log(this._data);

    // 取数页曝光上报
    unit.walog("show_codepage");

    if (this.accessWay == "sdk") {
      unit.sdkSetBackType("back");
    }
  },
  methods: {
    confirmButton() {
      console.log("digitalCode=" + this.digitalCode);
      // 提交取数码上报 resolve_digitalCode
      unit.walog("resolve_digitalCode");
      unit.reportStat('vstarter_site_login')
      

      const infoData = {
        arg: {
          daId: this.daId,
          site: this.site,
          digitalCode: this.digitalCode,
          loginToken: this.loginToken,
        },
        ts: new Date().getTime(),
        v: "1.0.0",
      };
      console.log(infoData);
      this.disabled = true
      queryMailInfoFun(infoData)
        .then((res) => {
          this.disabled = false
          switch (res.errorCode) {
            case 0:
              // 解压码/取数码正确，前往邮件详情页
              localStorage.removeItem("mailInfo")
              localStorage.setItem("mailInfo", JSON.stringify(res.data))
              let url = `./maildetail.html${unit.splicingUrl()}&digitalCode=${this.digitalCode}`
              unit.locationJump(url,"replace")
              this.digitalCode = "";
              break;
            case -57101:
              // 查无用户信息
              Dialog.alert({
                message: `查无用户信息(${res.errorCode})`,
                confirmButtonColor: "#5285EC",
              }).then(() => {});
              break;
            case -57103:
              // 解压失败（可能代表解压码错误）
              Dialog.alert({
                message: `${this.type == "decode" ? "解压码错误" : "取数码错误"}(${res.errorCode})`,
                confirmButtonColor: "#5285EC",
              }).then(() => { });
              break;
            case -57102:
              // 查无邮件
              Dialog.alert({
                message: `暂未收到邮件，官方发送邮件时间可能略有延迟，若您确认发送成功，请稍后重试(${res.errorCode})`,
                confirmButtonColor: "#5285EC",
              }).then(() => { });
              break;
            case -57110:
              // 邮件非PDF，主要针对支付宝流水
              let text = `当前文件仅限个人对账使用，请重新开具【用作证明材料】的${siteDes[this.site]?.siteDsp
                }（PDF格式）`;
              Dialog.alert({
                message: text,
                confirmButtonColor: "#5285EC",
              }).then(() => { });
              break;
            case -57132:
              // 取证超时
              unit.vdiQuit(true,true,50)
              this.digitalCode = "";
              break;
            default:
              Dialog.alert({
                message: `${res.errorMessage}(${res.errorCode})`,
                confirmButtonColor: "#5285EC",
              }).then(() => { });
              break;
          }
        })
        .catch((e) => {
          this.disabled = false
          console.log(e);
        });
    },
    goToFeedback() {
      // 点击未收到取数码/解压码上报
      unit.walog("nocode");
      let url = `./feedback.html${unit.splicingUrl()}`
      unit.locationJump(url,"href")
      this.digitalCode = "";
    },
  },
};
</script>

<style>
/* scoped */
#testcode_page {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  font-size: 16px;
  font-family: "等线", "新宋", sans-serif;
  background-color: white;
}

.container {
  width: 100%;
  height: 100%;
}

.inputcontent {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
}
.inputtcontent_header {
  width: 100%;
  text-align: center;
  padding-top: 50px;
  padding-bottom: 34px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: #262a32;
}

.inputcontent .inputcontent_items {
  width: 100%;
  display: flex;
  align-items: center;
  height: 52px;
  border-radius: 26px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  box-sizing: border-box;
}
.inputcontent_items p {
  line-height: 24px;
  color: rgba(0, 0, 0, 0.65);
  margin-right: 16px;
}
.inputcontent_items input {
  outline: none;
  border: none;
  font-size: 16px;
  line-height: 24px;
  flex: 1;
}
.errorText {
  color: red;
  text-align: center;
  line-height: 30px;
  margin-bottom: 20px;
  height: 30px;
}

.confirmDigitalCode {
  width: 100%;
  height: 44px;
  margin: 0 auto;
  line-height: 44px;
  text-align: center;
  color: white;
  font-weight: 500;
  border-radius: 22px;
  margin-bottom: 25px;
  background-color: #3071f2;
  border:none;
}

.confirmDigitalCode[disabled]{
  background-color: #79A2F2;
}

.again {
  color: rgb(51, 113, 208);
  margin: 0 auto;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}
</style>