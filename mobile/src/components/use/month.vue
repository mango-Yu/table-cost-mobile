<template>
    <div>
      <x-button class="date" type="primary" plain @click.native="showPlugin">日期：{{month}}</x-button>
      <div class="remind-title">整月小结</div>
      <ul>
        <li >吃饭费用: {{eat}}&nbsp;<br/>早中晚: ({{form.breakfast}},{{form.lunch}},{{form.dinner}} )</li>
        <li >交通费用: {{form.traffic}}</li>
        <li >购物费用: {{form.buy}}</li>
        <li >食材超市费用: {{form.foods}}</li>
        <li >信用卡花呗费用(不计总费用): {{form.visa}}</li>
        <li >贷款费用: {{form.loans}}</li>
        <li >衣服费用: {{form.clothes}}</li>
        <li >化妆品费用: {{form.skin}}</li>
        <li >医疗费用: {{form.health}}</li>
        <li >保险费用: {{form.insure}}</li>
        <li >零食费用: {{form.sock}}</li>
        <li >其他费用: {{form.others}}</li>
        <li >旅游费用: {{form.play}}</li>
        <li >人情费用: {{form.gifts}}</li>
        <li >费用总计: {{count}}</li>
      </ul>
    </div>
</template>

<script>
  import store from '@/store/store'
  import {getSumByDate} from '@/assets/userapi'

    export default {
        name: "month",
      store,
      data:function () {
        return {
          month:"",
          count:0,
          now:"",
          form: {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
            traffic: 0,
            sock: 0,
            clothes: 0,
            play: 0,
            others: 0,
            buy: 0,
            gifts: 0,
            loans: 0,
            visa: 0,
            foods: 0,
            skin: 0,
            health: 0,
            insure: 0
          },
        }
      },
      mounted:function(){
        let date=new Date();
        let month=date.getMonth()+1
        let year=date.getFullYear()
        month=(month <10)?("0"+month):month
        this.month=year+'-'+month
        console.log(this.nextmonth)
        this.now=year+'-'+month;
        this.init();

      },
      computed: {
        name() {
          return this.$store.state.name
        },
        eat(){
          return (parseFloat(this.form.breakfast)+parseFloat(this.form.lunch)+parseFloat(this.form.dinner)).toFixed(2)
        },
        nextmonth(){
          let arr=this.month.split("-")
          let time=""
          if(parseInt(arr[1])==12){
            time= (parseInt(arr[0])+1)+'-01'
          }else {
            let m=(parseInt(arr[1])+1);
            time= arr[0]+'-'+((m<10)?('0'+m):m)
          }
          return time
        }
      },
      methods: {
        showPlugin(){
          let that=this
          this.$vux.datetime.show({
            cancelText: '取消',
            confirmText: '确定',
            format: 'YYYY-MM',
            value: this.month,
            onConfirm (val) {
              that.month=val
              console.log(that.nextmonth)
              if(that.month<'2018-05'){
                that.month='2018-05';
                that.$vux.toast.show({text: '2018-05是最早时间', type: 'warn', isShowMask: true});

              }
              if(that.month>that.now){
                that.month=that.now;
                that.$vux.toast.show({text: that.now+'是最晚时间', type: 'warn', isShowMask: true});

              }
              that.init()
            },
            onShow () {
              console.log('plugin show')
            },
            onHide () {
              console.log('plugin hide')
            }
          })
        },
        handleSelect(key, keyPath) {
          console.log(key, keyPath);
        },
        init(){
          let that=this;
          that.count=0;
          getSumByDate(this.month,this.nextmonth).then(function (data) {
            // console.log(data.data.data[0])
            let obj=data.data.data[0]
            let newObj={}
            for(let i in obj){
              if(obj[i]==null){
                that.count+=0;
                let str=i.split(')')[0].split('(')[1]
                that.form[str]=0
              }else{
                if (i.indexOf('visa') > 0) {
                  that.count+=0;
                }else {
                  that.count+=obj[i];
                }
                // console.log(obj[i])
                let str=i.split(')')[0].split('(')[1]

                that.form[str]=parseFloat(obj[i]).toFixed(2)
              }

            }
            that.count = parseFloat(that.count).toFixed(2)
          }).catch(function (data) {
            console.log(data)
          })
        },
        change(){

        },
        getTwo(val){
          return parseInt(val*100)/100.0
        }

      }
    }
</script>

<style scoped>
  .date{
    width: 80%;
    margin: 20px auto;
    display: block;
  }
  .remind-title{
    background: #fff;
    padding: 10px 15px;
    line-height: 1.41176471;
    font-size: 17px;
    border-bottom: 1px solid #ddd;
  }


  ul{
    margin: 0;
    padding: 0;
  }
  ul li{
    background: #fff;
    padding: 10px 15px;
    line-height: 1.41176471;
    font-size: 17px;
    list-style: none;
    border-bottom: 1px solid #ddd;
  }
</style>
