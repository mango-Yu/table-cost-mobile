<template>
  <div class="register">
    <div class="title">
      注册
    </div>
    <div class="remind">这是一个简单的记账本<br>可以让你知道你的钱花在哪了</div>
    <group>
      <x-input  placeholder="用户名" v-model="form.name"></x-input>
      <x-input  placeholder="密码" v-model="form.passsword"></x-input>
      <x-input  placeholder="重复密码" v-model="form.repPasssword"></x-input>
      <x-input  placeholder="请输入手机号码" v-model="form.phoneNum"></x-input>
      <x-input  placeholder="请输入验证码" v-model="form.verifyNum">
        <x-button slot="right" type="primary" mini @click.native="sendSmsCode" >{{btnContent}}</x-button>
      </x-input>
    </group>
    <flexbox>
      <flexbox-item>
        <x-button type="primary" @click.native="onSubmit" >注册</x-button>
      </flexbox-item>
    </flexbox>

  </div>

</template>

<script>
  import {register, getSms} from '@/assets/userapi'
  import store from '@/store/store'
    export default {
        name: "register",
      store,
      data: function () {
        return {
          form: {
            name: '',
            passsword: '',
            repPasssword: "",
            phoneNum:"", //手机号
            verifyNum:"", //验证码
          },
          btnContent:"获取验证码", //获取验证码按钮内文字
          time:0, //发送验证码间隔时间
          disabled:false //按钮状态

        }
      },
      methods: {
        onSubmit() {
          if(this.form.name==''){
            this.$vux.toast.show({text: '请输入用户名', type: 'warn', isShowMask: true});
            // this.$vux.toast.error('请输入用户名');
            return
          }
          if(this.form.passsword==''){
            this.$vux.toast.show({text: '请输入密码', type: 'warn', isShowMask: true});
            return
          }
          if(this.form.passsword!=this.form.repPasssword){
            this.$vux.toast.show({text: '重复密码与密码不一致', type: 'warn', isShowMask: true});
            return
          }
          if(this.form.phoneNum==''){
            this.$vux.toast.show({text: '请输入手机号码', type: 'warn', isShowMask: true});
            return
          }
          if(this.form.verifyNum==''){
            this.$vux.toast.show({text: '请输入验证码', type: 'warn', isShowMask: true});
            return
          }
          var that=this
          this.$vux.loading.show({
            text: 'Loading'
          })
          register(this.form.name,this.form.passsword).then(function (data) {
            that.$vux.loading.hide()
            data=data.data
            if(data.code==1){
              that.$vux.toast.show('注册成功');
              let time=setTimeout(function () {
                that.$store.commit('changeName', that.form.name)
                sessionStorage.setItem("name", that.form.name);
                that.$router.push("main");
                clearTimeout(time)
              },2000)

            }else{

              that.$vux.toast.show({text: data.msg, type: 'warn', isShowMask: true});
            }

          }).catch(function (error) {
            console.log(error)
            that.$vux.loading.hide()
            that.$vux.toast.show({text: '注册失败', type: 'warn', isShowMask: true});
          })

        },
        // 获取验证码
        sendSmsCode(){
          let that = this;
          var reg=11&& /^((13|14|15|17|18)[0-9]{1}\d{8})$/;//手机号正则验证
          var phoneNum = that.form.phoneNum;
          if(!phoneNum){//未输入手机号
            that.$vux.toast.show({text: '请输入手机号码', type: 'warn', isShowMask: true});
            return;
          }
          if(!reg.test(phoneNum)){//手机号不合法
            that.$vux.toast.show({text: '您输入的手机号码不合法，请重新输入', type: 'warn', isShowMask: true});
          }
          this.time = 60;
          this.timer();
          // 获取验证码请求
          var obj = {"phoneNum":that.form.phoneNum};
          getSms(obj).then(function (data) {
            that.$vux.loading.hide()
            console.log(data)
            console.log(data.data.SendStatusSet)
            data=data.data.SendStatusSet[0];
            if(data.Code=="Ok"){
              that.$vux.toast.show('发送成功');
            }else{
              that.$vux.toast.show({text: data.msg, type: 'warn', isShowMask: true});
            }
          }).catch(function (error) {
            console.log(error)
            that.$vux.loading.hide()
            that.$vux.toast.show({text: '发送失败失败', type: 'warn', isShowMask: true});
          })

        },
        timer(){
          if(this.time>0){
            this.time--;
            this.btnContent = this.time+"s后重新获取";
            this.disabled = true;
            var timer = setTimeout(this.timer,1000);
          }else if(this.time == 0){
            this.btnContent = "获取验证码";
            clearTimeout(timer);
            this.disabled = false;
          }
        },
        // 验证验证码
        verificationCode(){
          var that = this;
          var phoneNum = that.form.phoneNum;//手机号
          var verifyNum = that.form.verifyNum;//验证码

          var  url = 'http://bosstan.asuscomm.com/api/common/verificationCode';
          this.$http.post(url,{
            username:phoneNum,
            code:verifyNum
          },{
            emulateJSON:true
          }).then((response)=>{
            console.log(response.body);
          });
        },
        fillContent(){
          // console.log("fillContent");
        }
      }
    }
</script>

<style scoped>
  .register{
    background: #fbf9fe;
    padding-top: 40px;
    height: 100%;
  }
  .title{
    font-size: 20px;
    margin-bottom: 20px;
  }
  .remind{
    font-size: 14px;
    color: #999;
    margin-bottom: 50px;
  }
  .vux-flexbox{

    width: 90%;
    margin:auto;
    margin-top: 20px;
  }
</style>
