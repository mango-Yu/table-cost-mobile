<template>
  <div class="login">
    <div class="title">
        登陆
    </div>
    <div class="remind">这是一个简单的记账本<br>可以让你知道你的钱花在哪了</div>
   <group>
      <x-input type="text" placeholder="用户名" v-model="form.name"></x-input>
      <x-input  placeholder="密码" type="password" v-model="form.passsword"></x-input>
  </group>
  <flexbox>
    <flexbox-item>
      <x-button type="primary" @click.native="onSubmit" >登陆</x-button>
    </flexbox-item>
    <flexbox-item>
      <x-button type="default" @click.native="$router.push('register')">注册</x-button>
    </flexbox-item>
  </flexbox>

  </div>
</template>

<script>
  import {login} from '@/assets/userapi'
  import store from '@/store/store'

  export default {
        name: "login",
    store,
    data:function () {
      return{
        form: {
          name: '',
          passsword: ''
        }
      }
    },
    created() {
      let that = this;
      document.onkeypress = function(e) {
        var keycode = document.all ? event.keyCode : e.which;
        if (keycode == 13) {
          that.onSubmit();// 登录方法名
          return false;
        }
      };
    },
    methods:{
      onSubmit() {
        var that=this;
        var datas={name:this.form.name,password:this.form.passsword}
        this.$vux.loading.show({
          text: 'Loading'
        })
        login(this.form.name,this.form.passsword).then(function (data) {
          that.$vux.loading.hide()
          data=data.data
          if(data.code==1){
            that.$vux.toast.show('登陆成功');
          let time=setTimeout(function () {
              that.$store.commit('changeName', that.form.name)
              sessionStorage.setItem("name", that.form.name);
              that.$router.push("main");
              clearTimeout(time)
            },2000)

          }else{
            console.log('jjj')
            that.$vux.toast.show({text: data.msg, type: 'warn', isShowMask: true});
          }

        }).catch(function (error) {
          that.$vux.loading.hide()
          that.$vux.toast.show({text: '登陆失败', type: 'warn', isShowMask: true});
          console.log(error);
        });
      }
    }
    }
</script>

<style scoped>
  .login{
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
