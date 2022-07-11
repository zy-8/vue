<template>
  <div id="loadingPage">
    <div class="items">
      <img class="items-img" :src="Icon" alt="" />
      <div class="items-text">
        <p class="items-header">{{ headerText }}</p>
        <p class="items-content">{{ contentText }}</p>
      </div>

      <!-- 办理结束界面，点击按钮结束取证流程 end -->
      <div class="items-but"  @click="backEnd">
        {{ butText }}
      </div>


    </div>
  </div>
</template>

<script>
import unit from "../utils/unit";
export default {
  data() {
    return {
      Icon: require("../assets/timeout.png"),
      headerText: "标题文案",
      contentText: "文字内容",
      butText: "按钮文案",
      errorPart: {
        '13': ["timeout.png",'系统异常(13)', '请返回并重新办理', "返回"],
        '14': ["timeout.png",'系统异常(14)', '请返回并重新办理', "返回"],
        '15': ["timeout.png",'系统异常(15)', '请返回并重新办理', "返回"],
        '20': ["timeout.png",'办理超时', '请返回并重新办理', "返回"],
        '21': ["timeout.png",'办理超时', '请返回并重新办理', "返回"],
        '25': ["timeout.png",'办理已结束', '请返回并重新办理', "返回"],
        '30': ["timeout.png",'系统异常(30)', '资源被回收，请稍后再试', "返回"],
        '35': ["timeout.png",'系统异常(35)', '资源被回收，请稍后再试', "返回"],
        // 丰巢取证超时
        '50': ["timeout.png",'办理超时', '请返回并重新办理', "返回"],
        // 丰巢用户主动结束取证
        '51': ["timeout.png",'办理已结束', '请返回并重新办理', "返回"],
        '100': ["timeout.png",'系统异常(100)', '系统异常，请稍后再试', "返回"],
        '301': ["sysError.svg",'下载失败(301)', '请稍后再试',"重试"],
        '302': ["timeout.png",'系统异常(302)', '系统异常，请稍后再试', "返回"],
      },

      errorStatus: "25",
    };
  },
  mounted() {
    unit.initConfig();
    console.log("error-page");

    let status = unit.getQueryVariable("errorStatus");
    if (!status || !(status in this.errorPart)) {
      // status不存在，不在errorPart中
      // 显示 办理已结束
      status = "25";
    }
    this.errorStatus = status;
    this.Icon = require(`../assets/${this.errorPart[status][0]}`);
    this.headerText = this.errorPart[status][1];
    this.contentText = this.errorPart[status][2];
    this.butText = this.errorPart[status][3];

    if(unit.getQueryVariable("accessWay") == "sdk"){
      unit.sdkSetBackType("close")
    }
  },
  beforeUpdate() { },
  methods: {
    // 返回上一页
    backFun() {
      let url = `./maildetail.html${unit.splicingUrl()}&digitalCode=${unit.getQueryVariable("digitalCode")}`
      unit.locationJump(url,"back")
    },
    //办理结束
    backEnd() {

      unit.vdiQuit(false,false,this.errorStatus)
    },
  },
};
// daStatus的可能取值

// 0初始状态
// 4收到邮件状态
// 5取证文件下载中
// 6第一个取证文件下载完成
// 8取证文件上传成功
// 10取证成功
// 13取证文件上传失败
// 14取证文件下载非法
// 15取证视频处理失败
// 20清洁环境使用超时
// 21vcode过期
// 24用户重入
// 25用户主动结束取证
// 30清洁环境异常
// 41数据源类型系统失败（无效操作）
// 42数据源类型系统失败（有效操作）
// 43数据源类型业务失败（无效操作）
// 44数据源类型业务失败（有效操作）
// 50丰巢取证超时
// 51丰巢用户主动结束取证
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
#loadingPage {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
}
.items {
  padding-top: 130px;
  width: 100%;
}

.items,
.items-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.items-text {
  margin: 30px 0;
  width: 100%;
}
.items-img {
  width: 124px;
}
.items-header {
  width: 80%;
  font-weight: 500;
  text-align: center;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}
.items-content {
  width: 80%;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  margin-top:16px;
}
.items-but {
  height: 44px;
  background-color: #5285ec;
  padding: 0 50px;
  box-sizing: border-box;
  line-height: 44px;
  border-radius: 22px;
  color: white;
}

.fileAdmin {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 40px;
  background-color: white;
  width: 100%;
  display: flex;
  justify-content: center;
  color: #5285ec;
}
</style>