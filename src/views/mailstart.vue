<template>
  <div id="mailstart-content">
    <div class="container">
      <div class="textshow">
        <p class="textshow_header">
          <!-- 成都市中大公证处已为您生成专属邮箱 -->
          {{siteData.orgFullName}}
          <img class="sm-icon" src="../assets/xinxishuoming.png" alt="" @click="explain = true" />
        </p>
        <span class="textshow_content">{{ siteData.handleIntroduce }}</span>
      </div>
      <div class="mailcontainer">
        <input type="text" class="inputbox" id="inputbox" :value="emailaddress" readonly />
        <div class="copytext" @click="copyMail">复制地址</div>
      </div>
      <div class="gettype">
        <span class="showguide" @click="goToGuide">查看流水获取方式</span>
      </div>
      <button class="next"  :disabled="disabled" style="display: blcok" @click="go_testcode">
        {{ nextText }}
      </button>
    </div>

    <!-- 详情弹窗 -->
    <div class="explain" v-show="explain">
      <div class="explaincontainer">
        <p>邮箱说明</p>
        <div class="explaintext">
          <p class="explaintext_P">
            1、该邮箱是成都市中大公证处为您定向生成的文件下载承接专属邮箱，不做他用，自开立起30天内有效，到期自动回收销毁，请在邮箱有效期内尽快完成操作。
          </p>
          <p class="explaintext_P">2、邮箱文件销毁说明:</p>
          <p class="explaintext_P">
            1）当您下载文件发送至本专用邮箱24小时内未及时提取使用时，系统会自动删除；
          </p>
          <p class="explaintext_P">
            2）当您成功完成文件提取递交后，系统会自动删除；
          </p>
          <p class="explaintext_P">
            3）当您在下载时主动取消递交并申请删除时，系统会立即删除对应文件；<br />请您放心使用。
          </p>
        </div>
        <div class="confirmButton" @click="explain = false">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import dsBridge from "dsbridge";
import { Toast, Dialog } from "vant";
import { getTokenFun, logsFun, queryMailAddr } from "../api/index";
import unit from "../utils/unit";
import { siteDes } from "../utils/beehiveDes";
const { baseURL,waUrl } = window.baseURL

export default {
  name: "app",
  data() {
    return {
      // 详细信息弹窗
      explain: false,
      disabled: false,

      emailaddress: "**************",
      daId: "",
      vcode: "",
      site: "",
      bizScenario: "",
      appId: "",
      sign: "",
      accessWay: "",
      loginToken: "",

      type: "", //取数码类型digital  解压码类型decode

      nextText: "已有取数码，前往取数",
      // 操作说明文案
      textshow_content: "",
    };
  },
  watch: {
    site(newVal, oldVal) {
      console.log('site newVal', newVal);
      // 新site需要添加的地方
      if(this.siteData.type == 'decode'){
        this.nextText = '已收到解压码'
      }else{
        this.nextText = '已有取数码，前往取数'
      }
    },
    explain(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        // 点击邮箱说明上报  open_explain
        unit.walog("open_explain");
      }
    },
  },
  created() { 
    unit.initConfig();

    // this.emailaddress = unit.getQueryVariable("emailaddress");
    this.daId = unit.getQueryVariable("daId");
    this.vcode = unit.getQueryVariable("vcode");
    this.site = unit.getQueryVariable("site");
    this.bizScenario = unit.getQueryVariable("bizScenario");
    this.appId = unit.getQueryVariable("appId");
    this.sign = unit.getQueryVariable("sign");
    this.accessWay = unit.getQueryVariable("accessWay");
    this.loginToken = unit.getQueryVariable("loginToken");
    this.siteData = siteDes[this.site]
    console.log('siteData',this.siteData);

    console.log(this._data);       
    // 邮箱名页面曝光上报
    unit.walog("show_mailname");
    unit.reportStat('vstarter_show_login')
  },
  mounted() {
    this.checkUrlData()
  },
  methods: {
    
    checkUrlData(){
      // 必要参数检查
      let dataNameList = ['emailaddress', 'daId', 'vcode','site', 'appId','sign', 'accessWay',]
      let dataError = ''
      let dataLost = false
      dataNameList.forEach(item =>{
        if(!unit.getQueryVariable(item) || unit.getQueryVariable(item) === 'undefined'){
          console.log('参数丢失',`${item} = ${unit.getQueryVariable(item)}`);
          dataLost = true
          dataError += ` ${item} = ${unit.getQueryVariable(item)} /`
        }
      })
      if(dataLost){
        let log =  `beehive_error: data lost -60308 / ${dataError} time :${new Date().getTime()} /url = ${window.location.href}`
        unit.sendlog(log,-60308,true)
        unit.walog('data_lost',log)
        Dialog.alert({
          message:`当前访问链接参数错误（-60308），请检查后再试。${dataError}`,
          confirmButtonColor: "#5285EC",

        }).then(()=>{
          unit.vdiQuit(true, true, 51, false)
        })
        return 
      } 

      if (this.accessWay == "sdk") {
        unit.sdkSetBackType("close");
      }

      console.log({
        'this.loginToken':this.loginToken,
        'local.loginToken':localStorage.getItem('loginToken'),
        'asLoginToken':this.loginToken === localStorage.getItem('loginToken'),
        'this.daId':this.daId,
        'local.vdiDaId':localStorage.getItem('vdiDaId'),
        'asDaId':this.daId === localStorage.getItem('vdiDaId'),
      });

      // 区别 首次进入 页面回退或刷新
      if(this.loginToken && this.loginToken !== 'undefined'){
        // 小程序模式
        if(this.daId === localStorage.getItem('vdiDaId')){
          console.log('url存在token,daId和缓存相同 === 页面回退或刷新');
        }else{
          console.log('url存在token,daId和缓存不同 === 首次进入');
        }
        this.localStorageInit()
        localStorage.setItem('vdiLoginToken',this.loginToken)
        localStorage.setItem('vdiDaId',this.daId)
        localStorage.setItem('originUrlData',window.location.search)
        this.checkEmailaddress(this.loginToken)

      }else{
        // sdk或h5模式
        let vdiLoginToken = localStorage.getItem('vdiLoginToken')
        let vdiDaId = localStorage.getItem('vdiDaId')
        if(vdiLoginToken &&  vdiLoginToken != null  && vdiDaId && vdiDaId == this.daId){
          console.log('token缓存存在，且daId相同 === 页面回退或刷新');
          this.loginToken = vdiLoginToken
          localStorage.removeItem('originUrlData')
          localStorage.setItem('originUrlData',`${window.location.search}&loginToken=${this.loginToken}`)
          this.checkEmailaddress(this.loginToken)
        }else{
          console.log('无token缓存或daid不同 === 首次进入');
          this.localStorageInit()
          this.getToken()
        }
      }
    },

    goToGuide() {
      unit.walog('to_guide')
      let url = `./guide.html${unit.splicingUrl()}&backPage=mailstart`
      unit.locationJump(url,"href")
    },
    go_testcode() {
      this.disabled = true 
      setTimeout( ()=>{
        this.disabled = false
      }, 300)
      // 前往取数页上报
      unit.walog("to_digitalCode");
      let url = `./testcode.html${unit.splicingUrl()}`
      unit.locationJump(url,"href")
    },
    copyMail() {
      // 复制的 兼容问题
      // 1.navigator.clipboard 部分机型不支持 （iphone 8）
      // 2.navigator.clipboard 支持的情况下  ， https安全会拦截复制api的功能
      // 3.navigator.clipboard 与 https安全都支持下 也有复制失败的例子 （1加10）
      // 4.document.execCommand('Copy') 下，部分机型 调不起 select() 方法，需要用setSelectionRange()替代 (iphone8 )

      let that = this
      var copybut = document.getElementById("inputbox");
      // 兼容问题1 和问题2   
      // navigator clipboard 需要https等安全上下文
      if(navigator.clipboard && window.isSecureContext ){
        navigator.clipboard.writeText(this.emailaddress)
        .then(function(){
          copybut.select(); // 选择对象
          console.log('clipboard.writeText copy success');
          // 点击复制上报 copy_mail
          unit.walog("copy_mail");
          Toast("复制成功");
        },function(){
          // 兼容问题3
          console.log(`clipboard.writeText copy fail`);
          that.execCommandCopy()
        })
      }else{
        this.execCommandCopy()
      }
    },
    execCommandCopy () {
      console.log('execCommandCopy  function');
      var copybut = document.getElementById("inputbox");

      copybut.focus()
      copybut.select()
      let result = document.execCommand('Copy')//成功返回true  失败false
      console.log(result);
      if(result){
        console.log('execCommand copy success');
        // 点击复制上报 copy_mail
        unit.walog("copy_mail");
        Toast("复制成功");
      }else{
        copybut.focus()
        copybut.setSelectionRange(0,this.emailaddress.length)
        let again = document.execCommand('Copy')//成功返回true  失败false
        console.log(again);
        if(again){
          console.log('execCommand copy success');
          // 点击复制上报 copy_mail
          unit.walog("copy_mail");
          Toast("复制成功");
        }else{
          console.log('execCommand copy fail');
          Toast('复制失败，请长按邮箱名称复制')
          unit.walog('copy_fail')
        }
      }
    },
    sdkSetLoginToken() {
      const data = {
        arg: {
          daId: this.daId,
          loginToken: this.loginToken,
        },
        ts: new Date().getTime(),
      };
      console.log("sdk/setLoginToken-data", data);
      const config = {
        arg: {
          daId: this.daId,
          site: this.site,
          appId: this.appId,
          consentMsg: `已成功下载${this.siteData.siteDsp}，${unit.getAgencyDes()}`,
          siteDsp: this.siteData.siteDsp,
          // baseUrl: baseURL,
          waUrl: waUrl,
        },
        ts: new Date().getTime(),
      };

      console.log("sdk/setConfig-data", config);
      unit.walog('sdk_setLoginToken',data)

      dsBridge.call("setLoginToken", data, function (e) {

        unit.walog('sdk_setLoginToken_res',e)

        dsBridge.call("setConfig", config);
        unit.walog('sdk_setCofig',config)

        let res = ''
        if (typeof e == "string") {
          res = JSON.parse(e);
        } else {
          res = e;
        }
        if(res.code && res.code != 0){
          console.log(`sdk-setLoginToken-fail/${res.code} ${res.msg}`);
          let logs = `beehive_logs:beehive_error/sdk_error_setLoginToken/${res.code}/${res.msg}/Time:${new Date().getTime()}`
          unit.sendlog(logs,res.code,true)
          unit.walog('sdk_setLoginToken_fail',e)
        }
      });
    },
    getToken() {
      console.log("开始请求Token");
      let that = this;
      let accessway = unit.getQueryVariable("accessWay")
      let data = {
        v: "1.0.0",
        arg: {
          vcode: unit.getQueryVariable("vcode"),
          daId: unit.getQueryVariable("daId"),
          //当邮箱开关切换时  因startVdi接口用的原site做秘钥签名，token接口暂时需要用原site来鉴权
          site: unit.getQueryVariable("site", true),
          sign: unit.getQueryVariable("sign"),
          bizScenario: unit.getQueryVariable("bizScenario"),
          appId: unit.getQueryVariable("appId"),
          url: window.location.href,
          accessWay: unit.getQueryVariable("accessWay"),
        },
        ts: new Date().getTime(),
      };
      console.log("getToken-data", data);
      getTokenFun(data)
        .then((res) => {
          console.log(res);

          if (res.errorCode == 0 || res.errorCode == -54206) {
            that.localStorageInit()
            localStorage.setItem("vdiLoginToken", res.data.loginToken);
            localStorage.setItem("vdiDaId", that.daId);
            localStorage.setItem("authorizationPageWord", res.data.authorizationPageWord);
            localStorage.setItem("originUrlData", `${window.location.search}&loginToken=${res.data.loginToken}`)
            localStorage.setItem("siteFullName",res.data.siteFullName)
            localStorage.setItem("dataSourceUrl",res.data.dataSourceUrl)
            localStorage.setItem("resultUrl",res.data.resultUrl)
            that.loginToken = res.data.loginToken;
            if (that.accessWay == "sdk") {
              that.sdkSetLoginToken();
            }
            that.checkEmailaddress(res.data.loginToken)

          } else if (res.errorCode == -45023) {
            //  vcode 超时

            let text = `当前链接不可用(${res.errorCode})`;
            Dialog.alert({
              message: text,
              confirmButtonColor: "#5285EC",
            }).then(() => {
              unit.vdiQuit(true, true, 50, false)
            });

            localStorage.removeItem("originUrlData")
            localStorage.setItem("originUrlData", window.location.search)
          } else if (res.errorCode == -50005) {
            let text = `当前链接不可用(${res.errorCode})`;
            Dialog.alert({
              message: text,
              confirmButtonColor: "#5285EC",
            }).then(() => {
              unit.vdiQuit(true, true, 51, false)
            });
            localStorage.removeItem("originUrlData")
            localStorage.setItem("originUrlData", window.location.search)

          } else {
            let text = `当前链接不可用(${res.errorCode})`;
            Dialog.alert({
              message: text,
              confirmButtonColor: "#5285EC",
            }).then(() => {
              unit.vdiQuit(true, true, 51, false)
            });
            localStorage.removeItem("originUrlData")
            localStorage.setItem("originUrlData", window.location.search)
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 浏览器缓存初始化
    localStorageInit(){
      localStorage.removeItem("vdiLoginToken");
      localStorage.removeItem("vdiDaId");
      localStorage.removeItem("authorizationPageWord");
      localStorage.removeItem("originUrlData")
      localStorage.removeItem("siteFullName")
      localStorage.removeItem("dataSourceUrl")
      localStorage.removeItem("resultUrl")
    },


    // 检查url邮箱名是否合法
    checkEmailaddress(loginToken) {

      console.log('checkEmail');
      let that = this
      let data = {
        v: "1.0.0",
        arg: {
          daId: unit.getQueryVariable("daId"),
          loginToken: loginToken
        },
        ts: new Date().getTime(),
      };
      queryMailAddr(data).then(res => {
        console.log(res);
        if (res.errorCode == '0') {
          if (unit.getQueryVariable('emailaddress') == res.data.mailAddress) {
            unit.walog('checkEmail_success')
            that.emailaddress = res.data.mailAddress

          } else {
            unit.walog('checkEmail_fail')
            let text = `当前链接不可用(emailaddress非法)`;
            Dialog.alert({
              message: text,
              confirmButtonColor: "#5285EC",
            }).then(() => {
              unit.vdiQuit(true, true, 51, false)
            });
          }
        } else {
          let text = `当前链接不可用(${res.errorCode})`;
          Dialog.alert({
            message: text,
            confirmButtonColor: "#5285EC",
          }).then(() => {
            unit.vdiQuit(true, true, 51, false)
          });
        }
      }).catch(e => {
        console.log(e);
        let text = `当前链接不可用(-60300)`;
        Dialog.alert({
          message: text,
          confirmButtonColor: "#5285EC",
        }).then(() => {
          unit.vdiQuit(true, true, 51, false)
        });
      })
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

#mailstart-content {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  font-size: 16px;
  font-family: "等线", "新宋", sans-serif;
}

.container {
  width: 100%;
  height: 100%;
}

.container {
  position: relative;
}

.textshow {
  width: 100%;
  margin-bottom: 24px;
  line-height: 24px;
  /* word-break:break-word */
}

.textshow_header {
  font-weight: normal;
  line-height: 24px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  font-size: 15px;
  margin: 16px 0;
}

.textshow_header img {
  width: 18px;
  height: 18px;
}

.textshow_content {
  display: inline-block;
  text-align: justify;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  color: #000000;
  opacity: 0.65;
}

.mailcontainer {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  border-radius: 4px;
  height: 44px;
  background-color: #f4f4f4;
}

.inputbox {
  border: none;
  background-color: #f4f4f4;
  font-size: 16px;
  flex: 1;
  line-height: 24px;
  margin-left: 12px;
  outline: none;
}

.long {
  font-size: 15px;
}

.short {
  font-size: 14px;
}

.copytext {
  color: #3071F2;
  margin: 0 12px;
  font-size: 16px;
  line-height: 24px;
}

.mailinput_icon {
  width: 24px;
  height: 24px;
  margin: 6px;
}

.mailinput_icon img {
  width: 100%;
  height: 100%;
}

/* 复制邮箱按钮 */
.copybut {
  width: 80%;
  height: 40px;
  margin: 0 auto;
  line-height: 40px;
  text-align: center;
  color: white;
  font-weight: 500;
  background-color: #3071F2;
  border-radius: 25px;
  margin-bottom: 40px;
}

.gettype {
  color: #3071F2;
  font-weight: 400;
  margin: 0 auto;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}

/* 详情弹窗 */
.explain {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.explaincontainer {
  background-color: white;
  position: relative;
  width: 80%;
  min-height: 260px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 24px 16px 50px;
}

.explaincontainer > p:first-child {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 16px;
  text-align: center;
  color: rgb(38, 42, 50);
}

.explaintext {
  /* line-height: 25px; */
  margin-bottom: 18px;
}

.explaintext_P {
  margin: 6px 0;
  line-height: 24px;
  font-size: 14px;
  font-weight: 400;
  color: rgb(82, 86, 96);
  text-align: justify;
}

.confirmButton {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 0%;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: white;
  font-weight: 500;
  color: rgba(51, 113, 208, 1);
}

.next {
  position: absolute;
  bottom: 34px;
  left: 10%;
  width: 80%;
  height: 44px;
  margin: 0 auto;
  line-height: 44px;
  text-align: center;
  color: white;
  font-weight: 500;
  background-color: #3071F2;
  border-radius: 25px;
  border: none;
}

.next[disabled]{
  background-color: #79A2F2;
}
</style>
