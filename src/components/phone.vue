<template>
  <div id="PhonePage" v-show="show">
    <div id="phoneContent">
      <img id="closeImg" src="../assets/close.png" alt="" @click="closeView" />
      <div class="phoneHeader">获取取数码</div>
      <img class="phoneImg" src="../assets/setPhone.png" alt="" />

      <div id="oldV" v-show="!isSetPhone">
        <div class="oldV_number">将向13312341234发送取数码</div>
        <div class="oldV_text" @click="setView">修改手机号></div>
      </div>
      <input
        v-show="isSetPhone"
        id="newV"
        type="text"
        placeholder="请输入手机号"
        v-model="phone"
      />

      <div id="confirmPhone" @click="confirmPhone">确认发送</div>
    </div>
  </div>
</template>

<script>
export default {
  name:"phone-page",
  props: {
    showSetPhone: Boolean,
  },
  data() {
    return {
      isSetPhone: false,
      phone: "",
      show: false,
    };
  },
  watch: {
    phone: function (newV, oldV) {
      console.log(newV);
    },
    showSetPhone:function(newV,oldV){
      this.show=newV
    }
  },
  mounted() {

  },
  beforeUpdate() {

  },
  methods: {
    setView() {
      this.isSetPhone = true;
    },
    confirmPhone() {
      // 确认修改
      console.log(this.phone);
    },
    closeView() {
      this.isSetPhone = false;
      this.phone = "";
      this.$emit("closePhone",false)
    },
  },
};
</script>

<style scoped>
#PhonePage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
#phoneContent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  background-color: pink;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border-radius: 8px;
}
#closeImg {
  position: fixed;
  right: 10px;
  top: 10px;
  width: 24px;
}
.phoneHeader {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #262a32;
  margin-top: 24px;
}
.phoneImg {
  width: 124px;
  margin: 12px 0 24px;
}
.oldV_number {
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #262a32;
}
.oldV_text {
  font-size: 15px;
  line-height: 24px;
  color: #5285ec;
  margin: 16px 0;
  text-align: center;
}

#newV {
  width: 80%;
  border: 1px solid #5285ec;
  box-sizing: border-box;
  border-radius: 26px;
  height: 44px;
  padding: 0 20px;
  margin-bottom: 34px;
}

#confirmPhone {
  width: 80%;
  height: 44px;
  margin-bottom: 30px;
  background: #5285ec;
  border-radius: 22px;
  text-align: center;
  font-size: 16px;
  line-height: 44px;
  color: white;
}
</style>