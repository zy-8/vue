<template>
   <div id="loadingPage" v-show="show">
     <div class="items">
       <img class="items-img" :src="Icon" alt="">
       <div class="items-text">
         <p class="items-header">{{headerText}}</p>
          <p class="items-content">{{contentText}}</p>
       </div>
       <!-- 关闭loading视图 重试 -->
       <button class="items-but" v-if="['2','3','7'].indexOf(sceneType.toString()) !== -1"  :disabled="disabled"  @click="closeFun">{{butText}}</button>
       <!-- 返回结束取证 返回 -->
       <button class="items-but" v-if="sceneType==4" :disabled="disabled"  @click="confirmEnd">{{butText}}</button>
       <!-- 返回到mailstart page   返回-->
       <button class="items-but" v-if="sceneType==5" :disabled="disabled"  @click="backStart">{{butText}}</button>
       <!-- 提交 -->
       <button class="items-but" v-if="sceneType==6" :disabled="disabled"  @click="auth">{{butText}}</button>
       <!-- 办理结束界面，点击按钮结束取证流程 end -->
       <button class="items-but" v-if="sceneType==8" :disabled="disabled"  @click="confirmEnd">{{butText}}</button>

     </div>
     <div class="fileAdmin" v-show="sceneType == 6 && accessway == 'sdk'">
       <div @click="click_admin">查看下载文件</div>
     </div>
   </div>   
  
</template>

<script>
import unit from "../utils/unit"
import {siteDes}  from "../utils/beehiveDes"
import { authorizeFun } from '../api/index.js'
import { Dialog }  from  'vant'
export default {
  name:"loading-page",
  props:{
    sceneType:Number,
    show:Boolean,
    // consentMsg:String,
    errorText:Array,
  },
  data(){
    return {
      //0默认-加载中  1正在下载解压 2下载失败 3下载超时 4验证超时 5文件非PDF格式 6授权页  7自定义错误文案  8办理结束
      // sceneType:0,
      // show:false,
      // consentMsg:"支付宝交易流水"
      Icon:"",
      headerText:"头部标题内容",
      contentText:"文字内容",
      butText:"同意提交",
      // consentMsg:"",
      siteFullName:"",
      disabled: false,
    }
  },
  mounted(){
    // this.consentMsg = siteDes[unit.getQueryVariable("site")]?.siteDsp;
    this.accessway = unit.getQueryVariable('accessWay')
    let siteFullName = localStorage.getItem("siteFullName")
    console.log(siteFullName);
    console.log(siteFullName && siteFullName !=="null");
    if(siteFullName && siteFullName !=="null"){
      this.siteFullName = siteFullName
    }else{
      this.siteFullName = siteDes[unit.getQueryVariable("site")]?.siteDsp;
    }
    console.log(this.siteFullName);
    
    
    this.testType()

  
  },
  beforeUpdate(){
    this.testType()
  },
  methods:{
    testType(){
      this.errorList = {
        "0":["download_icon.gif","加载中","",""],
        "1":["download_icon.gif","正在下载&解压","",""],
        "2":["sysError.svg","下载解压失败","请稍后再试","重试"],
        "3":["timeout.png","下载超时","","重试"],
        "4":["timeout.png","验证超时","","返回"],
        "5":["sysError.svg","",`当前文件仅限个人对账使用，请重新开具【用作证明材料】的${this.siteFullName}（PDF格式）`,"返回重新开具"],
        "6":["account.svg","",`已成功下载${this.siteFullName}，${unit.getAgencyDes()}`,"同意提交"],
        // 自定义错误文案
        // "7":["sysError.svg",this.errorText[0],this.errorText[1],"重试"],
        "8":["sysError.svg","办理已结束","请返回并重新办理","确认"],
      }

      let errorWord = this.errorList[this.sceneType]
      if(this.sceneType == 7){
        errorWord = ['sysError.svg',this.errorText[0],this.errorText[1],'重试']
      }
      
      if(!errorWord){
        errorWord = this.errorList["0"]
      }

      console.log('errorWord',errorWord);
      // this.Icon = require(`../assets/${errorWord[0]}`)
      this.Icon = `./assets/${errorWord[0]}`
      this.headerText = errorWord[1]
      this.contentText = errorWord[2]
      this.butText = errorWord[3]
      
      if(this.sceneType == "1"){
        // 下载页上报  download_page
        unit.walog("download_page");
      }

      if(this.sceneType == '6'){
        // 授权页面上报
        unit.walog('auth_page')
      }
    },
    closeFun(){
      this.disabledBtn()
      this.$emit("closeLoading",'关闭loading视图')
    },
    backStart(){
      this.disabledBtn()
      unit.goToMailstart()
    },
    click_admin(){
      unit.adminBtn()
    },

    // 点击授权
    auth() {
      let that = this
      that.disabled = true
      // 用户点击授权次数 上报
      unit.walog("click_authorization")

      let daId = unit.getQueryVariable("daId")
      let loginToken = unit.getQueryVariable("loginToken")
      let appId = unit.getQueryVariable("appId")
      let site = unit.getQueryVariable("site")
      let openId = unit.getQueryVariable("openId")
      let accessway = unit.getQueryVariable("accessWay")
      unit.beehiveAuth().then(res => {
        that.disabled = false
        console.log(res);
        if (res.errorCode == '0') {

          unit.walog('authorization_success')
          unit.mailDel()
          if (accessway == 'h5') {
            let url = localStorage.getItem('resultUrl')
            if (url.includes('?')) {
              url += `&daStatus=10&daId=${daId}&site=${site}`
            } else {
              url += `?daStatus=10&daId=${daId}&site=${site}`
            }
            unit.walog('resuleUrl', url)
            setTimeout(() => {
              unit.locationJump(url, "replace")
            }, 100)
          }
          if (accessway == 'sdk') {
            let data = {
              arg: {
                daId: daId,
              },
              ts: new Date().getTime(),
            };
            dsBridge.call("commitFile", data)
            unit.walog('sdk_commitFile', data)
          }

        } else if (res.errorCode == '-57132') {
          //  办理超时
          unit.vdiQuit(true, true, 50)

        } else {
          // 授权失败上报
          unit.walog("authorization_fail")
          Dialog.alert({
            message: `提交失败(${res.errorCode} )`,
            confirmButtonColor: "#5285EC",
          }).then(() => { })

        }

      }).catch(e => {
        console.log(e);
        that.disabled = false
        unit.walog('authorization_fail')
      })
    },

    // 办理结束确认
    confirmEnd(){
      // 点击办理结束
      console.log("点击办理结束");
      this.disabledBtn()
      unit.vdiQuit(false,false,51)
    },

    disabledBtn(){
      this.disabled = true
      setTimeout(()=>{
        this.disabled = false
      },300)
    }
  }
}
</script>

<style>
*{
 padding:0;
 margin:0;
}
#loadingPage{
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
  background-color: white;
  display:flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items:center;
}
.items{
  padding-top:130px;
  width:100%;
}

.items,.items-text{
  display:flex;
  flex-direction: column;
  align-items:center;
}
.items-text{
  margin:30px 0;
  width:100%;
}
.items-img{
  width:124px;

}
.items-header{
  width:80%;
  font-weight:500;
  text-align:center;
  font-size:16px;
  line-height:24px;
  text-align:center;
}
.items-content{
  width:80%;
  font-weight:400;
  font-size:14px;
  line-height:22px;
  text-align:center;
  margin-top:16px;

}
.items-but{
  height:44px;
  background-color: #3071f2;
  /* background-color:#5285EC; */
  padding:0 50px;
  box-sizing:border-box;
  line-height:44px;
  border-radius:22px;
  color:white;
  border:none;
}


.items-but[disabled]{
  background-color: #79A2F2;
}


.fileAdmin{
  position:absolute;
  bottom:0;
  left:0;
  /* height:40px; */
  margin-bottom: 36px;
  background-color:white;
  width:100%;
  display:flex;
  justify-content: center;
  color:#5285EC;
}


</style>