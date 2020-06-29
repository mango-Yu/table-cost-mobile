<template>
  <div class="register">
    <div class="title">
      注册
    </div>
    <div class="remind">这是一个简单的记账本<br>可以让你知道你的钱花在哪了</div>
    <group>
      <x-input type="text" placeholder="用户名" v-model="form.name"></x-input>
      <x-input type="password" placeholder="密码" v-model="form.password"></x-input>
      <x-input type="password" placeholder="重复密码" v-model="form.repPassword"></x-input>
      <x-input type="number" placeholder="请输入手机号码" v-model="form.phoneNum"></x-input>
      <x-input type="number" placeholder="请输入验证码" v-model="form.verifyNum">
        <x-button slot="right" type="primary" mini @click.native="sendSmsCode" :disabled="disabled">{{btnContent}}
        </x-button>
      </x-input>
    </group>
    <group v-show="verifyImg" class="verifyImg_box">
      <slide-verify :l="42"
                    :r="10"
                    :w="310"
                    :h="155"
                    :imgs="imgsArr"
                    :accuracy="5"
                    slider-text="向右滑动"
                    @success="onSuccess"
                    @fail="onFail"
                    @refresh="onRefresh"
                    ref="slideblock"
      ></slide-verify>
    </group>
    <flexbox>
      <flexbox-item>
        <x-button type="primary" @click.native="onSubmit">注册</x-button>
      </flexbox-item>
    </flexbox>

  </div>

</template>

<script>
  import {register, getSms} from '@/assets/userapi'
  import store from '@/store/store'
  import img0 from '../assets/images/1.jpg';
  import img1 from '../assets/images/2.jpg';
  import img2 from '../assets/images/3.jpg';
  import img3 from '../assets/images/4.jpg';
  import img4 from '../assets/images/5.jpg';
  import img5 from '../assets/images/6.jpg';
  import img6 from '../assets/images/7.jpg';
  import img7 from '../assets/images/8.jpg';
  import img8 from '../assets/images/9.jpg';
  import img9 from '../assets/images/10.jpg';
  import img10 from '../assets/images/11.jpg';
  import img11 from '../assets/images/12.jpg';

  export default {
    name: "register",
    store,
    data: function () {
      return {
        form: {
          name: '',
          password: '',
          repPassword: "",
          phoneNum: "", //手机号
          verifyNum: "", //验证码
        },
        sessionId: '',//sessionId
        btnContent: "获取验证码", //获取验证码按钮内文字
        time: 0, //发送验证码间隔时间
        disabled: false, //按钮状态
        verifyImg: false,
        imgsArr: [img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11]
      }
    },
    methods: {
      onSubmit() {
        if (this.form.name == '') {
          this.$vux.toast.show({text: '请输入用户名', type: 'warn', isShowMask: true});
          // this.$vux.toast.error('请输入用户名');
          return
        }
        if (this.form.password == '') {
          this.$vux.toast.show({text: '请输入密码', type: 'warn', isShowMask: true});
          return
        }
        if (this.form.password != this.form.repPassword) {
          this.$vux.toast.show({text: '重复密码与密码不一致', type: 'warn', isShowMask: true});
          return
        }
        if (this.form.phoneNum == '') {
          this.$vux.toast.show({text: '请输入手机号码', type: 'warn', isShowMask: true});
          return
        }
        if (this.form.verifyNum == '') {
          this.$vux.toast.show({text: '请输入验证码', type: 'warn', isShowMask: true});
          return
        }
        var that = this
        this.$vux.loading.show({
          text: 'Loading'
        })
        let obj = {
          name: this.form.name,
          password: this.form.password,
          phoneNum: this.form.phoneNum,
          verifyNum: this.form.verifyNum,
          sessionId: this.sessionId
        }
        register(obj).then(function (data) {
          that.$vux.loading.hide()
          data = data.data
          if (data.code == 1) {
            that.$vux.toast.show('注册成功');
            let time = setTimeout(function () {
              that.$store.commit('changeName', that.form.name)
              sessionStorage.setItem("name", that.form.name);
              that.$router.push("main");
              clearTimeout(time)
            }, 2000)

          } else {

            that.$vux.toast.show({text: data.msg, type: 'warn', isShowMask: true});
          }

        }).catch(function (error) {
          console.log(error)
          that.$vux.loading.hide()
          that.$vux.toast.show({text: '注册失败', type: 'warn', isShowMask: true});
        })

      },
      // 获取验证码
      sendSmsCode() {
        let that = this;
        var reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;//手机号正则验证
        var phoneNum = that.form.phoneNum;
        if (!phoneNum) {//未输入手机号
          that.$vux.toast.show({text: '请输入手机号码', type: 'warn', isShowMask: true});
          return;
        }
        if (!reg.test(phoneNum)) {//手机号不合法
          that.$vux.toast.show({text: '您输入的手机号码不合法，请重新输入', type: 'warn', isShowMask: true});
          return;
        }
        that.verifyImg = true;

      },
      timer() {
        if (this.time > 0) {
          this.time--;
          this.btnContent = this.time + "s后重新获取";
          this.disabled = true;
          var timer = setTimeout(this.timer, 1000);
        } else if (this.time == 0) {
          this.btnContent = "获取验证码";
          clearTimeout(timer);
          this.disabled = false;
        }
      },
      onSuccess() {
        let that = this;
        that.$vux.toast.show('真棒拼对了哦!');
        this.time = 60;
        this.timer();
        // 获取验证码请求
        var obj = {"phoneNum": that.form.phoneNum};
        getSms(obj).then(function (data) {
          let object = data.data;
          that.$vux.loading.hide()
          console.log(data)
          console.log(data.data.SendStatusSet)
          data = data.data.SendStatusSet[0];
          if (data.Code == "Ok") {
            that.$vux.toast.show('发送成功');
            that.sessionId = object.sessionId;
            that.verifyImg = false;
            that.$refs.slideblock.reset();
          } else {
            that.$vux.toast.show({text: data.Message, type: 'warn', isShowMask: true});
            that.verifyImg = false;
            that.$refs.slideblock.reset();
          }
        }).catch(function (error) {
          console.log(error)
          that.$vux.loading.hide()
          that.$vux.toast.show({text: '发送失败失败', type: 'warn', isShowMask: true});
          that.verifyImg = false;
          that.$refs.slideblock.reset();
        })
      },
      onFail() {
        let that = this;
        that.$vux.toast.show({text: '验证码飞走了!', type: 'warn', isShowMask: true});
        that.verifyImg = false;
        that.$refs.slideblock.reset();
      },
      onRefresh() {

      }
    }
  }
</script>

<style scoped>
  .register {
    background: #fbf9fe;
    padding-top: 40px;
    height: 100%;
    position: relative;
  }

  .title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .remind {
    font-size: 14px;
    color: #999;
    margin-bottom: 50px;
  }

  .vux-flexbox {

    width: 90%;
    margin: auto;
    margin-top: 20px;
  }

  .verifyImg_box {
    position: absolute;
    top: 25%;
    background: #fff;
    width: 100%;
  }

  .verifyImg_box .weui-cells:before {
    border-top: none !important;
  }

  .slide-verify {
    margin: 0 auto !important;
  }
</style>
