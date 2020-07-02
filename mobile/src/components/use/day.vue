<template>

  <div>
    <x-button class="date" type="primary" plain @click.native="showPlugin">日期：{{form.date}}</x-button>
    <group :title="eat">
      <x-input text-align="right" type="number" title="早餐" placeholder="0" v-model="form.breakfast"
               @on-blur="blurInput('breakfast')"></x-input>
      <x-input text-align="right" title="中餐" type="number" placeholder="0" v-model="form.lunch" @on-blur="blurInput('lunch')"></x-input>
      <x-input text-align="right" title="晚餐" type="number" placeholder="0" v-model="form.dinner"
               @on-blur="blurInput('dinner')"></x-input>
      <span style="margin-left: 10px;">总计：{{eat}}</span>
    </group>
    <group>
      <x-input text-align="right" title="交通费用" type="number" placeholder="0" v-model="form.traffic"
               @on-blur="blurInput('traffic')"></x-input>
    </group>
    <group>
      <x-input text-align="right" title="零食费用" type="number" placeholder="0" v-model="form.sock" @on-blur="blurInput('sock')"></x-input>
      <span style="margin-left: 10px;">包含饮料，零食，肯德基麦当劳等各种小吃</span>
    </group>
    <group>
      <x-switch text-align="right" title="今天上班" :value-map="[0, 1]" v-model="form.work"></x-switch>
    </group>
    <group>
      <x-input text-align="right" title="网购费用" type="number" placeholder="0" v-model="form.buy" @on-blur="blurInput('buy')"></x-input>
      <x-textarea placeholder="网购费用备注" v-model="form.buysRemind"></x-textarea>
    </group>
    <group>
      <x-input text-align="right" title="食材超市费用" type="number" placeholder="0" v-model="form.foods" @on-blur="blurInput('foods')"></x-input>
      <x-textarea placeholder="食材超市费用备注" v-model="form.foodsRemind"></x-textarea>
    </group>
    <group>
      <x-input text-align="right" title="贷款费用" type="number" placeholder="0" v-model="form.loans" @on-blur="blurInput('loans')"></x-input>
      <x-textarea placeholder="贷款费用备注" v-model="form.loansRemind"></x-textarea>
    </group>
    <group>
      <x-input text-align="right" title="信用卡花呗费用" type="number" placeholder="0" v-model="form.visa" @on-blur="blurInput('visa')"></x-input>
      <x-textarea placeholder="信用卡花呗费用备注" v-model="form.visaRemind"></x-textarea>
    </group>
    <group>
      <x-input text-align="right" title="服装费用" type="number" placeholder="0" v-model="form.clothes" @on-blur="blurInput('clothes')"></x-input>
      <x-textarea placeholder="服装费用备注" v-model="form.clothesRemind"></x-textarea>
    </group>
    <group>
      <x-input text-align="right" title="化妆品费用" type="number" placeholder="0" v-model="form.skin" @on-blur="blurInput('skin')"></x-input>
      <x-textarea placeholder="化妆品费用备注" v-model="form.skinRemind"></x-textarea>
    </group>
    <group>
      <x-input text-align="right" title="医疗费用" type="number" placeholder="0" v-model="form.health" @on-blur="blurInput('health')"></x-input>
      <x-textarea placeholder="医疗费用备注" v-model="form.healthRemind"></x-textarea>
    </group>
    <group>
      <x-input text-align="right" title="保险费用" type="number" placeholder="0" v-model="form.insure" @on-blur="blurInput('insure')"></x-input>
      <x-textarea placeholder="保险费用备注" v-model="form.insureRemind"></x-textarea>
    </group>

    <group>
      <x-input text-align="right" title="旅游费用" type="number" placeholder="0" v-model="form.play" @on-blur="blurInput('play')"></x-input>
      <x-textarea placeholder="旅游费用备注" v-model="form.playRemind"></x-textarea>
    </group>
    <group>
      <x-input text-align="right" title="其他费用" type="number" placeholder="0" v-model="form.others" @on-blur="blurInput('others')"></x-input>
      <x-textarea placeholder="其他费用备注" v-model="form.othersRemind"></x-textarea>
    </group>
    <group>
      <x-input text-align="right" title="人情费用" type="number" placeholder="0" v-model="form.gifts" @on-blur="blurInput('gifts')"></x-input>
      <x-textarea placeholder="人情费用备注" v-model="form.giftsRemind"></x-textarea>
    </group>
    <group>
      <div class="zongji"> 总计：{{all}}</div>
    </group>
    <x-button style="width: 80%;margin: 20px auto;display: block;" type="primary" @click.native="gosubmit">提交</x-button>
  </div>
</template>

<script>
  import store from '@/store/store'
  import {formatDate} from '@/assets/js/tool'
  import {subSpending, getSpending, login} from '@/assets/userapi'

  export default {
    name: "day",
    store,
    data() {
      return {
        form: {
          date: '',
          breakfast: '',
          lunch: '',
          dinner: '',
          traffic: '',
          sock: '',
          work: 1,
          clothes: '',
          clothesRemind: "",
          play: '',
          playRemind: "",
          others: '',
          othersRemind: "",
          gifts: '',
          giftsRemind: "",
          buy: '',
          buysRemind: "",
          loans: '',
          loansRemind: "",
          visa: '',
          visaRemind: "",
          foods: '',
          foodsRemind: "",
          skin: '',
          skinRemind: "",
          health: '',
          healthRemind: "",
          insure: '',
          insureRemind: "",
          user: ""
        },
        now: "",
      }
    },
    mounted: function () {
      let date = new Date()
      this.now = this.form.date = formatDate(date, "yyyy-MM-dd")
      this.form.user = this.$store.state.name
      console.log(this.form.user)
      this.init()
    },
    computed: {
      eat() {
        let eatSum = (this.funcDealNull(this.form.breakfast) + this.funcDealNull(this.form.lunch) + this.funcDealNull(this.form.dinner));
        let eatTotal = isNaN(eatSum) ? 0 : eatSum.toFixed(2);
        return '吃饭费用（总计：' + eatTotal + '）'
      },
      all() {
       let allSpend = (this.funcDealNull(this.form.breakfast) + this.funcDealNull(this.form.lunch) + this.funcDealNull(this.form.dinner)
                      + this.funcDealNull(this.form.traffic) + this.funcDealNull(this.form.sock) + this.funcDealNull(this.form.clothes) + this.funcDealNull(this.form.play)
                      + this.funcDealNull(this.form.others) + this.funcDealNull(this.form.gifts) + this.funcDealNull(this.form.buy) + this.funcDealNull(this.form.foods)
                      + this.funcDealNull(this.form.visa) + this.funcDealNull(this.form.loans) + this.funcDealNull(this.form.skin) + this.funcDealNull(this.form.health) + this.funcDealNull(this.form.insure));
        return isNaN(allSpend) ? 0 : allSpend.toFixed(2);
      }
    },
    methods: {
      funcDealNull(attr){
        let that = this;
        if (that.isNull(attr)){
          return 0;
        }else {
          return parseFloat(attr);
        }
      },
      isNull(str) {
        if (str === '') {
          return true;
        }
      },
      gosubmit() {
        const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
        console.log("asdasdas")
        this.$vux.confirm.show({
          // 组件除show外的属性
          content: "确认提交？",
          onCancel() {
            console.log(this) // 非当前 vm
            console.log(_this) // 当前 vm
          },
          onConfirm() {
            _this.onSubmit()
          }
        })
      },
      showPlugin() {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.form.date,
          onConfirm(val) {
            // console.log(that.form.date)
            that.form.date = val
            if (that.form.date < '2018-05-29') {
              that.form.date = '2018-05-29';
              that.$vux.toast.show({text: '2018-05-29是最早时间', type: 'warn', isShowMask: true});

            }
            if (that.form.date > that.now) {
              that.form.date = that.now;
              that.$vux.toast.show({text: that.now + '是最晚时间', type: 'warn', isShowMask: true});

            }
            that.init()
          },
          onShow() {
            console.log('plugin show')
          },
          onHide() {
            console.log('plugin hide')
          }
        })
      },
      onSubmit() {
        var obj = this.form;
        let flag = 1;
        let error = ""
        for (let i in obj) {
          if (!(i == "playRemind" || i == "clothesRemind" || i == "othersRemind" || i == "giftsRemind" ||
                i == "buysRemind" || i == "loansRemind" || i == "visaRemind" || i == "foodsRemind" || i == "skinRemind" || i == "healthRemind"|| i == "insureRemind"
                || i == "date" || i == 'user')) {
            // console.log((obj[i]))
            if ((obj[i] + "") == "") {
              // flag = 0;
              // error = i + '没填'
              // break
              obj[i] = isNaN(parseFloat(obj[i])) ? 0 : parseFloat(obj[i])
            }
            // obj[i] = parseFloat(obj[i])
            // console.log((obj[i]))
          }
        }
        if (flag == 0) {
          this.$vux.toast.show({text: error, type: 'warn', isShowMask: true});
          return
        }
        var that = this;
        console.log(obj)
        subSpending(obj).then(function (data) {
          data = data.data
          if (data.code == 1) {
            that.$vux.toast.show("提交成功")
            that.$emit('goinit')
          } else {
            console.log(error)
            that.$vux.toast.show({text: '提交失败', type: 'warn', isShowMask: true});
          }
        }).catch(function (error) {
          that.$vux.toast.show({text: '提交失败', type: 'warn', isShowMask: true});
          console.log(error);
        });

      },
      init() {
        var that = this
        getSpending(this.form.date).then(function (data) {
          // console.log(data)
          data = data.data
          if (data.code == 1) {
            if (data.data.length > 0) {
              data.data[0].date = formatDate(new Date(data.data[0].date), "yyyy-MM-dd")
              that.form = data.data[0]
            } else {
              for (let i in that.form) {
                // console.log(i)
                if (!(i == "playRemind" || i == "clothesRemind" || i == "giftsRemind" || i == "othersRemind" ||
                      i == "buysRemind" || i == "loansRemind" || i == "visaRemind" || i == "foodsRemind" || i == "skinRemind" || i == "healthRemind"|| i == "insureRemind"
                      || i == "date" || i == 'user')) {
                  that.form[i] = ''
                } else {
                  if (i != "date" && i != "user") {
                    that.form[i] = ""
                  }
                }

              }
            }
          } else {
            that.$vux.toast.show({text: '系统异常', type: 'warn', isShowMask: true});
          }

        }).catch(function (error) {
          console.log(error)
          that.$vux.toast.show({text: '系统异常', type: 'warn', isShowMask: true});
        })
      },
      formatInput(val) {

      },
      blurInput(val) {
        // console.log(val)
        let that = this;
        let num = this.form[val] + "";
        // console.log(num)
        num = num.replace(/[^\-?\d.]/g, '');
        if (num == "" || num < 0) {
          num = 0
        }
        this.$set(that.form, val, num)

      }
    }
  }
</script>

<style scoped>
  .date {
    width: 80%;
    margin: 20px auto;
    display: block;
  }

  .zongji {
    padding: 10px;
  }
</style>
