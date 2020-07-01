<template>
 <div class="form">
   <tab>
     <tab-item selected @on-item-click="onItemClick(0)">按日期</tab-item>
     <tab-item @on-item-click="onItemClick(1)">按月份</tab-item>
     <tab-item @on-item-click="onItemClick(2)">图表</tab-item>
   </tab>
     <day v-show="isShow == 0"></day>
     <month  v-show="isShow == 1" ref="initMon"></month>
     <list v-show="isShow == 2" ref="initList"></list>

   <div id="wrap">
     <div class="inner">
       <img src="../assets/nav/psw.png" @click="funSetShow(true)" alt="" />
       <img src="../assets/nav/exit.png" @click="logout" alt="" />
     </div>
     <div class="home" @click="homeEle()">
        {{name}}
     </div>
   </div>
   <x-dialog v-model="dialogVisible" class="dialog-demo">

     <group label-width="4.5em" label-margin-right="2em" label-align="right">
       <group-title slot="title" class="change-psw">修改密码</group-title>
       <x-input title="原来密码" placeholder="必填" v-model="passsword.origain"></x-input>
       <x-input title="新的密码" placeholder="必填" v-model="passsword.newword"></x-input>
       <x-input title="重复密码" placeholder="必填" v-model="passsword.remewword"></x-input>
     </group>
     <div style="padding:15px;">
       <x-button  @click.native="funSetShow(false)" type="default">取消</x-button>
       <x-button  @click.native="changePas" type="primary">修改</x-button>
     </div>
   </x-dialog>
 </div>
</template>

<script>
  import day from '@/components/use/day'
  import month from '@/components/use/month'
  import list from '@/components/use/list'
  import {changePassword} from '@/assets/userapi'
  import { XDialog, Group, GroupTitle } from 'vux'
export default {
  name: 'main',
  data () {
    return {
      msg: "",
      option1: '是',
      options1: ['是', '否'],
      isShow:0,
      flag: true,
      dialogVisible: false,
      passsword:{
        origain:"",
        newword:"",
        remewword:""
      },
    }
  },
  components:{
    day,
    month,
    list,
    Group,
    XDialog,
    GroupTitle
  },
  computed: {
    name() {
      return this.$store.state.name
    }
  },
  methods:{
    onItemClick(val){
      this.isShow=val
      if(val === 1){
        this.$refs.initMon.init()
      }else if (val === 2) {
        this.$refs.initList.init()
      }
    },
    funSetShow(show){
      let that = this;
      that.dialogVisible = show;
      that.passsword={
        origain:"",
          newword:"",
          remewword:""
      };
      if (!show) {
        that.flag = show;
        that.homeEle();
      }
    },
    homeEle() {
      let that = this;
      var homeEle = document.querySelector(".home");
      var imgs = document.querySelectorAll("#wrap > .inner > img");
      var c= 30;
      if(that.flag){
        homeEle.style.transform="rotate(-720deg)";
        for(var i=0;i<imgs.length;i++){
          imgs[i].style.transition="1s "+(i*0.1)+"s"
          imgs[i].style.transform="rotate(-720deg)";
          if (i === 0) {
            imgs[i].style.left = "10px";
            imgs[i].style.top = "-40px";
          }else if (i === 1){
            imgs[i].style.left = "-30px";
            imgs[i].style.top = "0";
          }
          // imgs[i].style.left = -that.getPoint(c,90*i/(imgs.length-1)).left+"px";
          // imgs[i].style.top = -that.getPoint(c,90*i/(imgs.length-1)).top+"px";
        }
      }else{
        homeEle.style.transform="rotate(0deg)";
        for(var i=0;i<imgs.length;i++){
          imgs[i].style.transition="1s "+((imgs.length-1-i)*0.1)+"s";
          imgs[i].style.transform="rotate(0deg)"
          imgs[i].style.left = 0+"px";
          imgs[i].style.top = 0+"px";
        }
      }
      that.flag=!that.flag;
    },
    //已知第三边 和 一个角
    getPoint(c,deg){
      var x =Math.round(c * Math.sin(deg*Math.PI/180));
      var y =Math.round(c * Math.cos(deg*Math.PI/180));
      return {left:x,top:y};
    },
    logout(){
      const _this = this
      this.$vux.confirm.show({
        // 组件除show外的属性
        content: "确认退出？",
        onCancel() {
          console.log(this) // 非当前 vm
          console.log(_this) // 当前 vm
          _this.flag = false;
          _this.homeEle();
        },
        onConfirm() {
          _this.out()
        }
      })
    },
    out(){
      sessionStorage.removeItem('name');
      this.$router.push('/')
    },
    changePas(){
      let that = this;
      if(this.passsword.origain==''){
        that.$vux.toast.show({text: '请输入原来的密码', type: 'warn', isShowMask: true});
        return
      }
      if(this.passsword.newword==''){
        that.$vux.toast.show({text: '请输入新的的密码', type: 'warn', isShowMask: true});
        return
      }
      if(this.passsword.remewword==''){
        that.$vux.toast.show({text: '重复密码', type: 'warn', isShowMask: true});
        return
      }
      if(this.passsword.remewword!=this.passsword.newword){
        that.$vux.toast.show({text: '新的的密码与重复密码不一致', type: 'warn', isShowMask: true});
        return
      }
      if (!that.CheckPassWord(this.passsword.newword, 1)) {
        this.$vux.toast.show({text: '密码必须为字母加数字且长度不小于6位', type: 'warn', isShowMask: true});
        return
      }
      changePassword(this.passsword.origain,this.passsword.newword).then(function (data) {
        console.log(data)
        let  newdata=data.data;
        if(newdata.code==1){
          that.$vux.toast.show('修改成功');
          that.dialogVisible=false
        }else{
          that.$message.error(newdata.msg);
        }
      }).catch(function (error) {
        console.log(error)
        that.$vux.toast.show({text: '未知异常', type: 'warn', isShowMask: true});
      })
    },
    CheckPassWord(password, type) {//必须为字母加数字且长度不小于6位
      var str = password;
      if (str != null) {
        if (str.length > 6 && type === 0) {
          return false;
        }else if (str.length < 6 && type === 1) {
          return false;
        }
      }else {
        return false;
      }
      var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
      if (!reg1.test(str)) {
        return false;
      }
      var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
      if (reg.test(str)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .form{
    text-align: left;
    background: #fbf9fe;
    padding-top: 15%;
  }
  .vux-tab-wrap{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
  .change-psw{
    font-size: 20px;
    font-weight: 700;
  }
  #wrap{
    position: fixed;
    right: 0;
    bottom: 0;
    width: 50px;
    height: 50px;
  }
  #wrap > .inner{
    height: 100%;

  }
  #wrap > .inner > img{
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    margin: 4px;
    border-radius: 50%;
  }
  #wrap > .home{
    position: absolute;
    left: 0;
    top: -10px;
    z-index: 1;
    width: 100%;
    height: 100%;
    background:#ffffff;
    border-radius: 50%;
    transition: 1s;
    background-size: 50%;
    text-align: center;
    line-height: 50px;
  }

</style>
