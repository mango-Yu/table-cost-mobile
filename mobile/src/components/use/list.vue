<template>
  <div ref="list" class="warp-main">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <!--<el-col :span="24" class="toolbar">-->
        <!--<el-form :inline="true" :model="filters">-->
          <!--<el-form-item>-->
            <!--<el-input v-model="filters.number" placeholder="请输入任务编号" auto-complete="off" @keyup.enter.native="handleSearch"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button type="primary" size="medium" v-on:click="handleSearch">查询</el-button>-->
          <!--</el-form-item>-->
          <!--<el-form-item class="pull-right">-->
            <!--<el-button type="primary" size="medium" @click="showAddDialog" icon="el-icon-plus">新增</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</el-col>-->
      <!--表格数据-->
      <el-col class="table-wrapper" id="table-wrapper">
        <el-table :data="tableData" stripe style="width: 100%"
                  show-summary
                  :summary-method="getSummaries">
          <el-table-column align="center" prop="idIndex" v-if="idShow" label="ID" ></el-table-column>
          <el-table-column align="center" prop="date" label="日期" sortable width="100" >
            <template slot-scope="scope">
              {{scope.row.date  | formatDateTime}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="user" label="用户"></el-table-column>
          <el-table-column align="center" prop="breakfast" label="早餐"></el-table-column>
          <el-table-column align="center" prop="lunch" label="午餐" ></el-table-column>
          <el-table-column align="center" prop="dinner" label="晚餐" ></el-table-column>
          <el-table-column align="center" prop="traffic" label="交通" ></el-table-column>
          <el-table-column align="center" prop="sock" label="零食" ></el-table-column>
          <el-table-column align="center" prop="buy" label="购物" ></el-table-column>
          <el-table-column align="center" prop="buysRemind" label="购物费用备注" ></el-table-column>
          <el-table-column align="center" prop="foods" label="食材超市" ></el-table-column>
          <el-table-column align="center" prop="foodsRemind" label="食材超市费用备注" ></el-table-column>
          <el-table-column align="center" prop="visa" label="信用卡花呗" ></el-table-column>
          <el-table-column align="center" prop="visaRemind" label="信用卡花呗费用备注" ></el-table-column>
          <el-table-column align="center" prop="loans" label="贷款" ></el-table-column>
          <el-table-column align="center" prop="loansRemind" label="贷款费用备注" ></el-table-column>
          <el-table-column align="center" prop="clothes" label="服装" ></el-table-column>
          <el-table-column align="center" prop="clothesRemind" label="服装费用备注" ></el-table-column>
          <el-table-column align="center" prop="skin" label="化妆品" ></el-table-column>
          <el-table-column align="center" prop="skinRemind" label="化妆品费用备注" ></el-table-column>
          <el-table-column align="center" prop="health" label="医疗" ></el-table-column>
          <el-table-column align="center" prop="healthRemind" label="医疗费用备注" ></el-table-column>
          <el-table-column align="center" prop="insure" label="保险" ></el-table-column>
          <el-table-column align="center" prop="insureRemind" label="保险费用备注" ></el-table-column>
          <el-table-column align="center" prop="play" label="娱乐" ></el-table-column>
          <el-table-column align="center" prop="playRemind" label="旅游费用备注" ></el-table-column>
          <el-table-column align="center" prop="others" label="其他" ></el-table-column>
          <el-table-column align="center" prop="othersRemind" label="其他费用备注" ></el-table-column>
          <el-table-column align="center" prop="gifts" label="人情礼物" ></el-table-column>
          <el-table-column align="center" prop="giftsRemind" label="人情礼物费用备注" ></el-table-column>
          <el-table-column align="center" prop="work" label="是否上班" sortable>
            <template slot-scope="scope">
                {{scope.row.work == 1? "上班" : "不上班"}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sumCalc" label="总计￥" >

          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       @prev-click="handlePrevChange" @next-click="handleNextChange"
                       :current-page="currentPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
      </el-col>
      <el-col :span="24">
        <div id="chartColumn" style="width: 100%; height: 400px;"></div>
      </el-col>
      <el-col :span="24">
        <div id="chartBar" style="width: 100%; height: 400px;"></div>
      </el-col>
      <el-col :span="24">
        <div id="chartPie" style="width: 100%; height: 400px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import store from '@/store/store'
  import {formatDate} from '@/assets/js/tool'
  import {getAllSpending} from '@/assets/userapi'
  import echarts from 'echarts'
  export default {
    name: "list",
    store,
    data: function () {
      return {
        loading: false,
        idShow: true,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        objectData: [],
        detailId: 0, // 详情ID
        filters: { // 搜索表单
          number: ''
        },
        chartColumn: null,
        chartBar: null,
        dateArr: [],
        costArr: [],
        costTypeSumArr: []
      };
    },
    mounted: function () {
       // this.init()
    },
    computed:{

    },
    methods: {

      init(){
        console.log("child")
        var that=this
        getAllSpending().then(function (data) {
          data=data.data
          if(1 === data.code){
            if(data.data.length>0){
              that.dateArr=[];
              that.costArr=[];
              that.costTypeSumArr=[];
              that.objectData = data.data;
              that.objectData.sort(function(a,b) {
                return Date.parse((formatDate(new Date(b.date), "yyyy-MM-dd")).replace(/-/g,"/"))-Date.parse((formatDate(new Date(a.date), "yyyy-MM-dd")).replace(/-/g,"/"));
              });
              that.total = data.data.length;
              var breakfastSum = 0, lunchSum = 0, dinnerSum = 0, eatSum = 0, trafficSum = 0, sockSum = 0,
                  clothesSum = 0, playSum = 0, othersSum = 0, giftsSum = 0, buySum = 0, foodsSum = 0, visaSum = 0, loansSum = 0, skinSum = 0, healthSum = 0, insureSum = 0;
              that.objectData.forEach((item, index) => {
                item["idIndex"] = index+1;
                that.objectData[index].sumCalc = (parseFloat(item.breakfast)+parseFloat(item.lunch)+parseFloat(item.dinner)+
                  parseFloat(item.traffic)+parseFloat(item.sock)+parseFloat(item.clothes)+
                  parseFloat(item.play)+parseFloat(item.others)+parseFloat(item.gifts)+
                  parseFloat(item.buy)+parseFloat(item.foods)+parseFloat(item.visa)+parseFloat(item.loans)+parseFloat(item.skin)).toFixed(2);
                breakfastSum = parseFloat(item.breakfast)+breakfastSum;
                lunchSum = parseFloat(item.lunch)+lunchSum;
                dinnerSum = parseFloat(item.dinner)+dinnerSum;
                trafficSum = parseFloat(item.traffic)+trafficSum;
                sockSum = parseFloat(item.sock)+sockSum;
                clothesSum = parseFloat(item.clothes)+clothesSum;
                playSum = parseFloat(item.play)+playSum;
                othersSum = parseFloat(item.others)+othersSum;
                giftsSum = parseFloat(item.gifts)+giftsSum;
                buySum = parseFloat(item.buy)+buySum;
                foodsSum = parseFloat(item.foods)+foodsSum;
                visaSum = parseFloat(item.visa)+visaSum;
                loansSum = parseFloat(item.loans)+loansSum;
                skinSum = parseFloat(item.skin)+skinSum;
                healthSum = parseFloat(item.health)+healthSum;
                insureSum = parseFloat(item.insure)+insureSum;
                that.dateArr.push(formatDate(new Date(item.date), "yyyy-MM-dd"));
                that.costArr.push({"value":that.objectData[index].sumCalc,"name":formatDate(new Date(item.date), "yyyy-MM-dd")});

              });
              that.costTypeSumArr.push(
                {"value": breakfastSum.toFixed(2), "name": "早餐"},
                {"value": lunchSum.toFixed(2), "name": "午餐"},
                {"value": dinnerSum.toFixed(2), "name": "晚餐"},
                {"value": (breakfastSum+lunchSum+dinnerSum).toFixed(2),"name":"餐飲"},
                {"value": trafficSum.toFixed(2), "name": "交通"},
                {"value": sockSum.toFixed(2), "name": "零食"},
                {"value": buySum.toFixed(2), "name": "购物"},
                {"value": foodsSum.toFixed(2), "name": "食材超市"},
                {"value": visaSum.toFixed(2), "name": "信用卡花呗"},
                {"value": loansSum.toFixed(2), "name": "贷款"},
                {"value": clothesSum.toFixed(2), "name": "服装"},
                {"value": skinSum.toFixed(2), "name": "化妆品"},
                {"value": healthSum.toFixed(2), "name": "医疗"},
                {"value": insureSum.toFixed(2), "name": "保险"},
                {"value": playSum.toFixed(2), "name": "娱乐"},
                {"value": othersSum.toFixed(2), "name": "其他"},
                {"value": giftsSum.toFixed(2), "name": "人情"}
              );
              that.tableData= that.pagination(1,10,that.objectData);
              that.dateArr.reverse();
              that.costArr.reverse();
              that.drawShape();
            }else{

            }
          }else{
            that.$vux.toast.show({text: '系统异常', type: 'warn', isShowMask: true});
          }

        }).catch(function (error) {
          that.$vux.toast.show({text: '系统异常', type: 'warn', isShowMask: true});
        })
      },

      // 搜索
      handleSearch(){
        console.info(this.filters.number);
      },

      // 选择每页显示条数
      handleSizeChange(val){
        let that = this;
        that.pageSize = val;
        that.currentPage = 1;
        that.tableData = that.pagination(that.currentPage,that.pageSize,that.objectData);
      },
      handleCurrentChange(val) {
        let that = this;
        that.tableData = that.pagination(val,that.pageSize,that.objectData);
      },
      handlePrevChange(val) {
        let that = this;
        that.tableData = that.pagination(val,that.pageSize,that.objectData);
      },
      handleNextChange(val) {
        let that = this;
        that.tableData = that.pagination(val,that.pageSize,that.objectData);
      },
      getAllSpendings(){

      },
      pagination(pageNo, pageSize, array) {
          var offset = (pageNo - 1) * pageSize;
          return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
      },

      // 房间号的合计去掉
      getSummaries (param) {
        let that = this;
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计(￥)'
          } else if (index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 8
                    || index === 10 || index === 12 || index === 14 || index === 16 || index === 18
                    || index === 20 || index === 22 || index === 24 || index === 26 || index === 28
                    || index === 31) {
            const values = that.objectData.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = parseFloat(values.reduce((prev, curr) => {
                const value = parseFloat(curr).toFixed(2)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)).toFixed(2)
            }else {
              sums[index] = 'N/A'
            }
          } else {
            sums[index] = '--'
          }
        })
        return sums
      },
      drawShape(){
        var that = this;
        this.chartColumn = echarts.init(document.getElementById('chartColumn'));
        this.chartBar = echarts.init(document.getElementById('chartBar'));
        this.chartPie = echarts.init(document.getElementById('chartPie'));


        this.chartColumn.setOption({
          title: { text: '月度趋势图(￥)' },
          tooltip: {},
          xAxis: {
            type: 'category',
            data: that.dateArr
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: that.costArr,
            type: 'line',
            smooth:true,
            symbolSize: 8,//拐点大小
          }],
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 50,
              end: 100
            },
            {
              type: 'inside',
              realtime: true,
              start: 50,
              end: 100
            }
          ]
        });

        this.chartBar.setOption({
          title: { text: '日消费图(￥)' },
          color: ['#3398DB'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : that.dateArr,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'日消费',
              type:'bar',
              barWidth: '60%',
              data:that.costArr
            }
          ],
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 50,
              end: 100
            },
            {
              type: 'inside',
              realtime: true,
              start: 50,
              end: 100
            }
          ],
          grid: {
            top: 30,
            bottom: 60
          },
        });
        this.chartPie.setOption({
          title: {
            text: '类消费总计(￥)',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}元({d}%)'
          },
          legend: {
            orient: 'horizontal',
            left: '10',
            top: '30',
            data: ["早餐", "午餐", '晚餐', "餐飲", "交通", "购物", "食材超市", "信用花呗", "贷款", "零食", "服装", "化妆品", "医疗", "保险", "娱乐", "其他", "人情"]
          },
          series: [
            {
              name: '花销',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: that.costTypeSumArr,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      }
    }
  }
</script>

<style scoped>
  .detail-box {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 500px;
    height: 100%;
    overflow-y: auto;
    z-index: 2000;
    background-color: #fff;
  }
  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background-color: #000;
    opacity: .3;
  }



</style>
