<template>
  <!-- 调查问卷界面 -->
  <div class="dcwj" style="display: block">
    <div class="dc-content">

      <!-- 问题部分 -->
      <div class="dc-header">
        <div>常见问题</div>
      </div>

      <div class="dc-items" v-for="(item,index)  in siteData.Qlist"  :key='index'>
        <div class="item-header" >
          {{item.header}}
        </div>

        <div class="items-content"  v-if='index == 0'>
          请确认按照<span @click="goToGuide" style="color: #5285ec">【流水下载指引】</span><span>{{ item.content }}</span>输入您本次使用承接提交的专属邮箱，<span @click="goToMailstart" style="color: #5285ec">【前去复制邮箱】</span>，确认成功发送
        </div>
        <div class="items-content"  v-else  v-html='item.content'></div>
      </div>

      <!-- 回答部分 -->
      <div class="solve">
        <div class="if-solve">
          <div class="solve-header">问题是否已解决？</div>

          <div v-for='(item,index) in siteData.Alist' :key='item.code' class="solve-item" @click='Acode = item.code'>
            <div class="solve-icon">
              <img v-if='Acode == item.code || (item.children && Acode != 10000)' :src="Gouxuan" alt="">
              <img v-else  :src="Kegouxuan" alt="">
            </div>
            <div class="solve-text">{{item.desc}}</div>
          </div>
        </div>

        <div class="solve-content" style="display: block" v-show="Acode != '10000'">
          <div class="solve-header">遇到什么问题？</div>
          <div v-for='(item,index) in siteData.Alist[1].children' :key='item.code' class="solve-item" @click='Acode = item.code'>
            <div class="solve-icon">
              <img v-if='Acode == item.code' :src="Gouxuan" alt="">
              <img v-else :src="Kegouxuan" alt="">
            </div>
            <div class="solve-text">
              {{item.desc}}
            </div>
          </div>

          
          <div class="textbox" style="display: flex" v-show="Acode  == 10010">
            <textarea name="" id="texts" wrap="soft" maxlength="300" rows="5" placeholder="请输入问题详情" v-model='textareaValue'></textarea>
          </div>
        </div>
      </div>
    </div>



    <div class="dc-foot">
      <div id="foot-left" @click="back">取消</div>
      <div id="foot-right" @click="feedbackPost">提交反馈</div>
    </div>
    <PhonePage :showSetPhone="showSetPhone" @closePhone="closePhone"></PhonePage>
  </div>
</template>

<script>
import unit from "../utils/unit";
import Gouxuan from "../assets/gouxuan.png";
import Kegouxuan from "../assets/kegouxuan.png";
import { feedbackFun } from "../api/index";
import { Toast } from "vant";
import { siteDes } from "../utils/beehiveDes";
import PhonePage from "../components/phone.vue";
export default {
  name: "app",

  components: {
    PhonePage,
  },
  data() {
    return {
      emailaddress: "XXXXXX1234@zdgzc.com",
      daId: "",
      vcode: "",
      site: "",
      bizScenario: "",
      appId: "",
      sign: "",
      accessWay: "",
      loginToken: "",
      type: "", //取数码类型digital  解压码类型decode

      Acode: 10000,


      Gouxuan: Gouxuan,
      Kegouxuan: Kegouxuan,


      showSetPhone: false,
      textareaValue:'',
    }
  },
  watch: {
    site(newVal, oldVal) {

    },
  },
  computed: { },
  created(){
    unit.initConfig();
    console.log("feedback-page");
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
    this.siteData = siteDes[this.site]
    console.log(this.siteData);

  },
  mounted() {


    // 调查问卷页面上报
    unit.walog("show_feedbackPage");

    if (this.accessWay == "sdk") {
      unit.sdkSetBackType("back");
    }
  },
  methods: {
    back() {
      // console.log(document.referrer);
      // 返回上一页
      // window.history.back();
      let url =  `./testcode.html${unit.splicingUrl()}`
      unit.locationJump(url,"back")
    },
    goToGuide() {
      unit.walog('click_goToGuide')
      let url = `./guide.html${unit.splicingUrl()}&backPage=feedback`
      unit.locationJump(url,"href")
    },
    goToMailstart() {
      // 点击返回邮箱页上报
      unit.walog("back_mailname");
      // 前往邮箱生成页面
      let url = `./mailstart.html${unit.splicingUrl()}`
      unit.locationJump(url,"replace")
    },
    feedbackPost() {
      // 将数据提交，然后格式化选项，关闭数据提交
      unit.walog("click_feedback");
      let that = this;
      let data = {
        v: "1.0.0",
        arg: {
          daId: this.daId,
          site: this.site,
          code: this.Acode,
          desc: "",
        },
        ts: new Date().getTime(),
      };

      if(this.Acode == 10010){
        data.arg.desc = this.textareaValue
      }else{
        this.siteData.Alist.forEach( item =>{ 
          if( item.children ){
            item.children.forEach( i =>{
              if( i.code == this.Acode ) data.arg.desc = i.desc
            })
          }else{
            if( item.code == this.Acode ) data.arg.desc = item.desc
          }
        })
      }

      console.log(data);
      feedbackFun(data)
        .then((res) => {
          if (res.errorCode == 0) {
            Toast({
              type: "success",
              message: "提交成功",
              onClose: () => {
                this.back()
              },
            });
          } else {
            let log = `beehive_error:feedback_error / ${res.errorCode} / ${res.errorMessage} /Time: ${new Date().getTime()}`
            unit.walog('feedback_fail',log)
            Toast(`提交失败，请稍后再试(${res.errorCode})`);
          }
        })
        .catch((e) => {
          console.log(e);
          // Toast.fail(`${e}`);
        });
    },
    setPhone() {
      this.showSetPhone = true;
    },
    closePhone(Boo) {
      this.showSetPhone = Boo;
    },
  },
};
</script>

<style>
html,body{
  width: 100%;
  height: 100%;
}

/* 调查问卷 */
.dcwj {

  width: 100%;

  padding: 24px 20px 34px;
  box-sizing: border-box;
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
#zhanwei {
  width: 100%;
  height: 60px;
}

.dc-content {
  width: 100%;
  min-height: calc(100vh - 60px - 58px);
  flex: 1;
}
.dc-header {
  font-size: 18px;
  line-height: 26px;
  font-weight: 500;
  margin-bottom: 24px;
  color: #262a32;
}
.dc-items {
  margin-bottom: 16px;
}

.dc-items .items-header {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: #262a32;
}
.dc-items .items-content {
  font-size: 14px;
  line-height: 22px;
  color: #525660;
  margin: 12px 0;
  text-align: justify;
}

/* 是否解决 */
.solve {
  font-size: 14px;
  line-height: 22px;
}
.solve-header {
  margin: 16px 0 8px;
}
.solve-item {
  display: flex;
  padding: 11px 0;
}
.solve-item .solve-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
.solve-item .solve-icon img {
  width: 100%;
  margin-top: 3px;
}

#texts {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: none;
  resize: none;
  outline: none;
}

.dc-foot {
  padding: 0 24px;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
}
#foot-right,
#foot-left {
  box-sizing: border-box;
  width: calc(50% - 6px);
  height: 44px;
  font-size: 16px;
  line-height: 44px;
  font-weight: 500;
  border-radius: 22px;
  text-align: center;
}
#foot-left {
  color: #3071f2;
  border: 1px solid #3071f2;
}
#foot-right {
  color: white;
  background-color: #3071f2;
}
</style>