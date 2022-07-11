<template>
  <div class='rest_part'>
    <img src="../assets/dwSuccess.png" style='width:124px' alt="">
    <p class='errorTitle'>提交成功</p>
    <!-- <p class='errorText'>{{resDes}}</p> -->
    <button class='back_btn' @click='back'>返回</button>
  </div>
</template>
<style >
  html,
  body{
    height: 100%;
    font-size: 16px;
    margin: 0;
    font-family: "PingFang SC", -apple-system, "Helvetica Neue", STHeiti, sans-serif;
  }


  .rest_part{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .rest_part img{
    margin-top:20vh
  }
  .rest_part .errorTitle{
    font-size: 16px;
    font-weight: bold;
    margin-top: 34px;
  }
  .rest_part .errorText{
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    max-width: 310px;
    text-align: center;
  }

  .rest_part .back_btn{
    width: 150px;
    height: 44px;
    background: #3071f2;
    border-radius: 22px;
    color:#fff;
    border:0;
    outline: 0;
    margin-top:32px;
  }
</style>
<script>
import unit from '../utils/unit.js'
import { Dialog } from "vant"

export default {
  mounted() {
    unit.walog('submitPage')
    
    let dataNameList = ["daStatus", "site", "daId"];
    let dataError = "";
    let dataLost = false;
    dataNameList.forEach((item) => {
      if (!unit.getQueryVariable(item) || unit.getQueryVariable(item) === "undefined") {
        console.log(`参数丢失`, `${item} = ${unit.getQueryVariable(item)}`);
        dataLost = true;
        dataError += `${item}=${unit.getQueryVariable(item)} `;
      }
    });
    if (dataLost) {
      Dialog.alert({
        message: `参数丢失（${dataError}）`,
        confirmButtonColor: "#5285EC",
      }).then(() => { });
    }
  },

  methods: {
    back() {
      // dataSourceUrl   ./?app=de1tuknz&bizScenario=general
      let url = localStorage.getItem('dataSourceUrl')
      // 区分绝对地址 和相对地址 
      // 内部demo是相对地址， 因二级域名不同，丰巢是/beehive  需要添加 ../vdi
      if (/^[https|http|ftp|www]/.test(url)) {
        window.location.replace(url)
      } else {
        window.location.replace(`../vdi/${url}`)
      }
    }
  }
}
</script>