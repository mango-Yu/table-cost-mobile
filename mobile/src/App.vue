<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import store from '@/store/store'
  // import {getUser} from '@/assets/userapi'

export default {
  name: 'App',
  store,
  beforeCreate:function(){
    let that=this

    /*getUser().then(function (data) {
      console.log(data.data)
      if(data.data.code==1){
        let name=data.data.data
        that.$store.commit('changeName', name)
        sessionStorage.setItem("name",name);
      }else{
        that.$store.commit('changeName', '')
        sessionStorage.removeItem("name");
        // that.$router.push("/")
      }

    }).catch(function (error) {
      console.log(error)
    })*/
  }
}
</script>

<style>
  body,html{
    margin: 0;
    padding: 0;
    height: 100%;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
height: 100%
}
  .toolbar .el-pagination .el-pagination__sizes,.toolbar .el-pagination .el-pagination__total{
    margin-right: 0 !important;
  }
  .el-pagination.is-background.el-pagination--small .btn-next, .el-pagination.is-background.el-pagination--small .btn-prev, .el-pagination.is-background.el-pagination--small .el-pager li{
    margin: 0 2px !important;
  }
  .el-table__header-wrapper{
    position: fixed;
    top: 44px;
    left: 0;
    z-index: 10;
    height: 40px;
  }
  .el-table--scrollable-x .el-table__body-wrapper{
    margin-top: 40px;
    border-top: 1px solid #EBEEF5;
  }
  .el-table th{
    vertical-align: top;
  }
  #chartColumn{
    z-index: 20;
    background: #fff;
  }
  #chartBar{
    z-index: 20;
    background: #fff;
  }
  #chartPie{
    z-index: 20;
    background: #fff;
  }
  .el-icon-more:before{
    content:'';

  }
  .el-icon-arrow-left:before{
    content:'';
  }
  .el-icon-arrow-right:before{
    content:'';
  }
  .el-icon-more{
    background-image: url("assets/images/more.png") !important;
    background-repeat: no-repeat;
    background-size: 100% !important
  }
  .btn-prev{
    background-image: url("assets/images/prev.png") !important;
    background-repeat: no-repeat;
  }
  .btn-next{
    background-image: url("assets/images/next.png")  !important;
    background-repeat: no-repeat;
  }
</style>
