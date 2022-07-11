<template>
  <div id="maildetail-page">
    <div id="mailBox">
      <div class="mailText">
        <div class="mailHeader mail_items" v-html="mailHeader">
          <!-- <span class="name">XXX</span>的支付宝业务凭证 -->
        </div>
        <p class="miniHeader mail_items">
          {{ miniHeader }}
        </p>
        <div class="mailcontent" v-html="mailcontent"></div>
      </div>
      <div id="fileRoom" v-show="showFile">
        <p class="attachmentNum">1个附件</p>
        <div class="fileBox">
          <img src="../assets/zip.png" alt="" />
          <div class="fileContent">
            <p class="fileName">{{ dispayAttachmentName | ZipFileName }}</p>
            <!-- <p class="ram">108.5k</p> -->
          </div>
        </div>
      </div>
    </div>

    <button  :disabled="disabled" class="download_but" @click="confirmDownload">下载</button>
    <div class="delete_but">
      <span class="showpopup" @click="deleteSure">不想提交，直接删除</span>
    </div>

    <LoadingPage :sceneType="loadingPage_type" :show="loadingPage_show"  :errorText="loadingPage_text" @closeLoading="closeLoading">
    </LoadingPage>
  </div>
</template>

<script>
import { deleteFun, downloadUrl, endFun } from "../api/index";
import dsBridge from "dsbridge";
import { Toast, Dialog } from "vant";
import wx from "weixin-js-sdk";
import LoadingPage from "../components/loadingPage.vue";
const { siteDes } = require("../utils/beehiveDes");
import unit from "../utils/unit";

export default {
  name: "app",
  components: {
    LoadingPage,
  },
  data() {
    return {
      disabled: false ,
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

      content: "",
      openId: "",
      siteDsp: "",
      consentMsg: "",
      // 附件zip名
      dispayAttachmentName: "",
      // pdf文件名
      filename: "1234567", //附件名
      mailcontent: "邮件内容",
      mailHeader: `<span class="name">XXX</span>的支付宝业务凭证`,
      miniHeader: "支付宝提醒",
      // sdk版本号
      sdk_version: "",

      // loading组件需要的参数
      loadingPage_show: true,
      loadingPage_type: 0, //0默认-加载中  1正在下载解压 2下载失败 3下载超时 4验证超时 5文件非PDF格式 6授权页  7自定义错误文案
      loadingPage_text: [], //自定义错误的文案

      sdkDownloadUrl: "",
      // 下载需要的headers
      downloadURL_EXT:"",
      showFile: true,
      // 下载超时定时器
      downloadTimeout:"",
      // 是否sdk15秒超时
      isTimeout:false,
      // 是否已经第二次请求过downloadUrl
      useGetUrl:false,
      // 是否收到sdk下载反馈
      sdkDWresponse: false,
      // post请求url的时间
      PT:0,
      // get到url的时间
      GT:0,
      // call通知sdk的时间
      CT:0,
      // return sdk返回下载结果时间
      RT:0,

      // 等待sdk下载的计时器
      awaitSDKTimeout:'',
    };
  },
  filters: {
    ZipFileName: function (value) {
      if (!value) return "";
      let L = value.length;
      if (L > 30) {
        return value.substring(0, 13) + "..." + value.substring(L - 17, L);
      } else {
        return value;
      }
    },
  },
  watch: {
    site(newVal, oldVal) {
      // 新site需要添加的地方
      if (newVal !== oldVal) {
        console.log("site newVal ", newVal);
        switch (newVal) {
          case "beehive-ewallet":
            this.miniHeader = `电子票夹`;
            break;
          case "beehive-wechatpay":
            this.miniHeader = `微信支付`;
            this.showFile = false;
            break;
          case "beehive-alipay":
            this.miniHeader = `支付宝提醒`;
            break;
          default:
            this.miniHeader = `${siteDes[newVal]?.appName}提醒`;
            break;
        }
      }
    },
  },
  mounted() {
    unit.initConfig();
    console.log("maildetail-page");

    this.emailaddress = unit.getQueryVariable("emailaddress");
    this.daId = unit.getQueryVariable("daId");
    this.vcode = unit.getQueryVariable("vcode");
    this.site = unit.getQueryVariable("site");
    this.bizScenario = unit.getQueryVariable("bizScenario");
    this.appId = unit.getQueryVariable("appId");
    this.sign = unit.getQueryVariable("sign");
    this.accessWay = unit.getQueryVariable("accessWay");
    this.digitalCode = unit.getQueryVariable("digitalCode");
    this.loginToken = unit.getQueryVariable("loginToken");
    console.log("loginToken", this.loginToken, !!this.loginToken);
    this.consentMsg = siteDes[this.site]?.siteDsp;
    console.log(this._data);

    this.startPost();

    if (this.accessWay == "sdk") {
      unit.sdkSetBackType("close");
      // 获取sdk当前版本
      this.getVersionInfo();
    }
  },
  methods: {
    getVersionInfo() {
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
        unit.walog('sdk_getVersionInfo_res',e)
        console.log(res);
        if (res.code == "0") {
          that.sdk_version = res.data.sdk_version;
          console.log(`sdk版本:${res.data.sdk_version}`);
        } else {
          unit.walog('sdk_getVersionInfo_fail',e)
          console.log(`sdk-getVersionInfo-fail/${res.code} ${res.msg}`);
          let logs = `beehive_logs:beehive_error/sdk_error_getVersionInfo/${res.code}/${res.msg}/Time:${new Date().getTime()}`
          unit.sendlog(logs,res.code,true)
        }
      });
    },
    startPost() {
      let mailInfo = JSON.parse(localStorage.getItem("mailInfo"))
      console.log("localStorage-mailInfo",!!mailInfo);
      this.loadingPage_show = false;
      // 邮件详情页面曝光上报
      unit.walog("show_detailpage");
      unit.reportStat('vstarter_page_after_login')

      this.content = mailInfo.content;
      this.openId = mailInfo.openId;
      this.siteDsp = mailInfo.siteDsp;
      this.filename = mailInfo.attachmentName;
      this.dispayAttachmentName = mailInfo.dispayAttachmentName;
      this.mailHeader = mailInfo.subject;
      this.mailcontent = mailInfo.content;
    },
    // 子组件调用 关闭loading页面的方法
    closeLoading(str) {
      console.log(str);
      this.loadingPage_show = false;
    },
    // 显示加载页面组件
    showLoading(type = 0, text) {
      // loadingPage_type:1,//0默认-加载中  1正在下载解压 2下载失败 3下载超时 4验证超时 5文件非PDF格式 6授权页
      this.loadingPage_show = true;
      this.loadingPage_type = type;
      this.loadingPage_text = text;
    },
    mailContentFun(str) {
      let innerStr = "";
      switch (this.site) {
        case "beehive-alipay":
          // 处理文件标题姓名
          let name = str
            .match(/\<title\>([\s\S]*?)\<\/title\>/g)[0]
            .replace("<title>", "")
            .replace("</title>", "");
          document.querySelector(".name").innerText = name;
          //  处理文件内容
          innerStr = str
            .match(/\<body\>([\s\S]*?)\<\/body\>/g)[0]
            .replace("width:680px;padding:0 10px;", "width:100%;");
          this.mailcontent = innerStr;

          // this.mailcontent = str
          break;
        case "beehive-ewallet":
          this.mailcontent = str;
          break;
        case "beehive-wechatpay":
          innerStr = str.substring(0, str.indexOf("<html>"));
          this.mailcontent = innerStr;

          // this.mailcontent = str;
          break;
      }
    },
    sdkSetConfig() {
      const setConfigData = {
        arg: {
          daId: this.daId, //取证的ID
          site: this.site,
          siteDsp: this.siteDsp,
          appId: this.appId,
          consentMsg: `已成功下载${this.consentMsg}，${unit.getAgencyDes()}`,
          // baseUrl: baseURL,
        },
        ts: new Date().getTime(),
      };
      console.log("setConfig参数", setConfigData);
      dsBridge.call("setConfig", setConfigData);
      unit.walog('sdk_setConfig',setConfigData)
    },
    //删除邮件
    deleteSure() {
      // 点击删除上报
      unit.walog("click_delete");

      let that = this;
      let accessway = unit.getQueryVariable("accessWay")
      Dialog.confirm({
        message: "该数据暂未提交，一旦删除无法撤销，确认删除该数据？",
        confirmButtonColor: "#5285EC",
      })
        .then(() => {
          // 确认删除上报
          unit.walog("resolve_delete");
          unit.endRequest(true).then(res => {
            console.log('delete/res', res);
            if (res.errorCode == '0') {
              Toast('删除成功')
              setTimeout(() => {
                unit.vdiQuit(true, false, 51, false)
              }, 500)
            } else if (res.errorCode == '-57132') {
              // 办理超时
              unit.vdiQuit(true, false, 50, false)
            } else {
              Toast(`删除失败（${res.errorCode}）`)
            }
          }).catch(e => {
            console.log('delete/e', e);
            Toast(`删除失败（-60307）`)
          })

        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    // 点击下载
    confirmDownload() {
      const that = this
      // 当邮件内容超出一屏时，回滚到顶部
      window.scrollTo(0, 0);
      // 点击下载上报
      unit.walog("click_download"); 
      unit.reportStat('vstarter_download_click')
      this.showLoading(1);

      this.sdkDWresponse = false
      this.isTimeout = false
      console.log(new Date().getTime());
      console.log("startDownloadTime")


      this.downloadTimeout=setTimeout(()=>{
        console.log("下载超时",new Date().getTime());
        // 下载超时
        this.showLoading(3)
        this.isTimeout = true
        this.useGetUrl = false

        unit.walog("download_timeout")

        // -60309 下载超时 
        let logs = `beehive_logs:beehive_error/download_timeout_error / ${-60309}/sdkDWresponse ${this.sdkDWresponse}/ Time:${new Date().getTime()}`
        unit.sendlog(logs,-60309)
        console.log("closeDownloadTime");
        clearTimeout(this.downloadTimeout)
      }, 30 * 1000)

      let accessway = this.accessWay

      // 请求附件下载的url地址
      let data = {
        arg: {
          daId: this.daId,
          loginToken: this.loginToken,
        },
      };

      // 03-29 丰巢小程序接入后，也需要先调用一下 download 接口 获取文件信息
      unit.walog('startGetDownloadUrl')
      this.PT = new Date().getTime()

      this.disabled = true 
      downloadUrl(data).then((res) => {
        this.disabled = false 

        unit.walog('endGetDownloadUrl',res)

        console.log(res);
        clearTimeout(this.downloadTimeout)
        console.log("closeDownloadTime");
        if (res.errorCode == "0") {
          this.GT = new Date().getTime()
          unit.walog('getDownloadUrl_success','getDownloadUrlTime',this.GT - this.PT)

          if(accessway == 'sdk'){
            // 5.23 因用户有可能由于网络问题下载文件耗时较久，改版为超过15秒后就默认下载完成
            this.awaitSDKTimeout = setTimeout(()=>{
              this.isTimeout = true
              this.showLoading(6);
              unit.walog('awaitSDKTimeout')
              clearTimeout(this.awaitSDKTimeout)
            }, 15 * 1000)
            
            this.sdkDownloadUrl = res.data.url;
            // 非加密时 ext字段不存在
            if(res.data.ext){
              this.downloadURL_EXT=res.data.ext
            }

            this.sdkDownloadFinished()
            this.sdkDownload();
            
          }

          if (accessway.includes('miniapp')) {
            // 关闭下载超时定时器
            // clearTimeout(this.downloadTimeout)
            // console.log("closeDownloadTime");
            // 如果超时弹窗未执行，则跳跳到小程序
            if(!this.isTimeout){
              //  下载成功上报  download_success
              unit.walog("download_success");
              // 如果是小程序，则直接跳转到小程序
              let url = `../vdiAuth/vdiAuth${unit.splicingUrl()}&digitalCode=${this.digitalCode}`          
              unit.jumpmini(url);
              console.log(url)
            }
          }

          if (accessway == 'h5') {
            unit.walog("download_success");
            that.showLoading(6);
          }
          
        } else if (res.errorCode == '-57134') {
          // 文件还未上传到cos,需要重试请求一次
          if(!this.useGetUrl){

            this.useGetUrl = true
            this.confirmDownload()  
          }else{
            Dialog.alert({
              message: `${res.errorMessage}(${res.errorCode})`,
              confirmButtonColor: "#5285EC",
              confirmButtonText: "重试",
            }).then(() => {
              this.loadingPage_show = false;
            });
          }
        } else if (res.errorCode == '-57132') {

          // 办理超时 token失效
          unit.vdiQuit(true,true,50)
        } else {

          // daId错误或loginToken错误
          Dialog.alert({
            message: `${res.errorMessage}(${res.errorCode})`,
            confirmButtonColor: "#5285EC",
            confirmButtonText: "重试",
          }).then(() => {
            this.loadingPage_show = false;
          });
        }
        if(res.errorCode  != 0){
          let log = `beehive_error:downloadUrl_error / ${res.errorCode} / ${res.errorMessage} /Time: ${new Date().getTime()}`
          unit.walog( 'download_fail', log )
        }
      })
      .catch((e) => {

        this.disabled = true

        let logs = `beehive_logs:beehive_ajax_error/downlaodurl/ -60305 / ${e} / Time:${new Date().getTime()}`
        unit.sendlog(logs,-60305)
        unit.walog( 'download_fail', logs )
        clearTimeout(this.downloadTimeout)
        console.log("closeDownloadTime");
        this.loadingPage_show = false;
      });

    },
    // 通知SDK执行下载
    sdkDownload() {
      let that = this
      let data = {
        arg: {
          daId: this.daId,
          // url: this.sdkDownloadUrl,
          // urls: [this.sdkDownloadUrl],
          loginToken: this.loginToken,
          // fileName: this.filename,
          // fileNames: [this.filename],
          "download-digitalCode": this.digitalCode,
        },
        ts: new Date().getTime(),
      };
      if(!!this.downloadURL_EXT){
        data.arg = Object.assign(data.arg,this.downloadURL_EXT)
      }
      unit.checkoutVersion('1.3.1').then(status =>{
        console.log(`checkoutVersion status =`,status);
        if(!status){
          data.arg.urls = [that.sdkDownloadUrl]
          data.arg.fileNames = [that.filename]
        }else{
          data.arg.url = that.sdkDownloadUrl
          data.arg.fileName = that.filename
        }

        console.log("sdk/startDownload", data);
        that.CT = new Date().getTime()
        dsBridge.call("startDownload", data)
        unit.walog('sdk_startDownload', data)
      })
    },
    // 接收sdk下载结果
    sdkDownloadFinished() {
      let that = this;
      dsBridge.register("onDownloadFinished", function (data) {
        clearTimeout(that.awaitSDKTimeout)


        that.RT = new Date().getTime()
        unit.walog('sdk_onDownloadFinished',"sdk_download_awaitTime",that.RT - that.CT)
        let res = "";
        if (typeof data == "string") {
          res = JSON.parse(data);
        } else {
          res = data;
        }
        console.log(res);

        that.sdkDWresponse = true

        if (res.arg.code == 0 && !this.isTimeout) {
          //  下载成功上报  download_success
          unit.walog("download_success",data);
          that.showLoading(6);
          
        } else {
          let logs = `beehive_logs:beehive_error/sdk_onDownloadFinished_error/${res.arg.code} /${res.arg.msg}/ Time:${new Date().getTime()}`
          unit.sendlog(logs,res.arg.code)

          // 下载失败上报 download_fail
          unit.walog("download_fail", data);
          
          if(!this.isTimeout){
            that.showLoading(7, [`下载解压失败（${res.arg.code}）`,'请稍后再试']);
          }
        }
      });
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
}

#maildetail-page {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  font-size: 15px;
  line-height: 26px;
}
#mailBox {
  min-height: 88%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/* 邮件预览 */
.mailText {
  height: calc(100% - 155px);
}

.mailHeader {
  font-size: 18px;
  font-weight: 700;
  line-height: 36px;
}

.mailcontent {
  padding: 15px;
  padding-right: 16px;
  box-sizing: border-box;
  width: 100%;
  text-align:justify;
}

.greet {
  font-weight: 600;
  margin-bottom: 7px;
}

.leaf {
  margin-bottom: 7px;
}

/* 文件名展示 */

#fileRoom {
}

.attachmentNum {
  height: 20px;
  font-size: 12px;
  line-height: 20px;
  padding: 0 16px;
}

.fileBox {
  height: 55px;
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.fileBox img {
  width: 24px;
  height: 28px;
  margin-right: 8px;
}

.fileContent {
  width: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.fileName {
  font-size: 13px;
  line-height: 17px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ram {
  color: #696969;
  font-size: 12px;
  line-height: 14px;
}

.download_but {
  width: 80%;
  height: 40px;
  margin: 0 10%;
  line-height: 40px;
  text-align: center;
  color: white;
  font-weight: 500;
  background-color: #3071F2;
  border-radius: 25px;
  border: none;
}

.download_but[disabled]{
  background-color: #79A2F2;
}

.delete_but {
  color: #3071F2;
  margin: 0 auto;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  margin: 10px 0;
}
</style>