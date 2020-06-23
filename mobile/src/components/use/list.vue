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
          <el-table-column align="center" prop="id" v-if="idShow" label="ID" ></el-table-column>
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
          <el-table-column align="center" prop="clothes" label="服装" ></el-table-column>
          <el-table-column align="center" prop="clothesRemind" label="服装费用备注" ></el-table-column>
          <el-table-column align="center" prop="play" label="娱乐" ></el-table-column>
          <el-table-column align="center" prop="playRemind" label="游玩费用备注" ></el-table-column>
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
        idShow: false,
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
      // [{"id":1,"date":"2020-01-09T16:00:00.000Z","user":"syy","breakfast":"11","lunch":"0","dinner":"0","traffic":"1","buy":"0","sock":"1","clothes":"1","play":"11","others":"1","gifts":"0","playRemind":"","clothesRemind":"","othersRemind":"","giftsRemind":" ","buysRemind":"","work":1},{"id":2,"date":"2020-01-10T16:00:00.000Z","user":"syy","breakfast":"22","lunch":"0","dinner":"0","traffic":"5","buy":"0","sock":"11","clothes":"0","play":"0","others":"0","gifts":"0","playRemind":"","clothesRemind":"","othersRemind":"","giftsRemind":" ","buysRemind":"","work":0},{"id":4,"date":"2020-01-11T16:00:00.000Z","user":"syy","breakfast":"1","lunch":"1","dinner":"1","traffic":"12","buy":"0","sock":"12","clothes":"0","play":"0","others":"0","gifts":"0","playRemind":"","clothesRemind":"","othersRemind":"","giftsRemind":" ","buysRemind":"","work":0},{"id":5,"date":"2020-01-16T16:00:00.000Z","user":"syy","breakfast":"13","lunch":"20","dinner":"0","traffic":"10","buy":"0","sock":"0","clothes":"0","play":"0","others":"0","gifts":"1000","playRemind":"","clothesRemind":"","othersRemind":"","giftsRemind":"","buysRemind":"","work":1},{"id":6,"date":"2020-06-15T16:00:00.000Z","user":"syy","breakfast":"4","lunch":"19","dinner":"16","traffic":"7.2","buy":"0","sock":"0","clothes":"0","play":"0","others":"0","gifts":"0","playRemind":"æ— ","clothesRemind":"æ— ","othersRemind":"æ— ","giftsRemind":"wu ","buysRemind":"","work":1},{"id":7,"date":"2020-06-16T16:00:00.000Z","user":"syy","breakfast":"4.3","lunch":"23.2","dinner":"0","traffic":"3.2","buy":"0","sock":"0","clothes":"0","play":"0","others":"0","gifts":"0","playRemind":"","clothesRemind":"","othersRemind":"","giftsRemind":"","buysRemind":"","work":1},{"id":8,"date":"2020-06-17T16:00:00.000Z","user":"syy","breakfast":"4","lunch":"23.3","dinner":"0","traffic":"6.4","buy":"0","sock":"0","clothes":"0","play":"0","others":"88","gifts":"0","playRemind":"","clothesRemind":"","othersRemind":"é¼ æ ‡","giftsRemind":"","buysRemind":"","work":1},{"id":9,"date":"2020-06-18T16:00:00.000Z","user":"syy","breakfast":"4","lunch":"17","dinner":"0","traffic":"6.4","buy":"0","sock":"0","clothes":"0","play":"0","others":"486.18","gifts":"0","playRemind":"","clothesRemind":"","othersRemind":"ä¿é™©","giftsRemind":"","buysRemind":"","work":1},{"id":10,"date":"2020-06-19T16:00:00.000Z","user":"syy","breakfast":"6","lunch":"16","dinner":"0","traffic":"6.4","buy":"0","sock":"0","clothes":"0","play":"0","others":"0","gifts":"0","playRemind":"","clothesRemind":"","othersRemind":"","giftsRemind":"","buysRemind":"","work":1},{"id":11,"date":"2020-06-20T16:00:00.000Z","user":"syy","breakfast":"0","lunch":"0","dinner":"0","traffic":"0","buy":"0","sock":"0","clothes":"0","play":"0","others":"415.3","gifts":"0","playRemind":"","clothesRemind":"","othersRemind":"é£Ÿæ196.4ï¼Œä¿é™©10.75ï¼Œ62.65ï¼Œ85.5ï¼ŒåŸŸåç»­è´¹60","giftsRemind":"","buysRemind":"","work":0},{"id":12,"date":"2020-06-21T16:00:00.000Z","user":"syy","breakfast":"6","lunch":"23.58","dinner":"0","traffic":"6.4","buy":"0","sock":"0","clothes":"0","play":"0","others":"0","gifts":"0","playRemind":"","clothesRemind":"","othersRemind":"","giftsRemind":"","buysRemind":"","work":1},{"id":13,"date":"2020-06-22T16:00:00.000Z","user":"syy","breakfast":"6","lunch":"0","dinner":"0","traffic":"3.2","buy":"0","sock":"0","clothes":"0","play":"0","others":"0","gifts":"0","playRemind":"","clothesRemind":"","othersRemind":"","giftsRemind":"","buysRemind":"","work":1}]
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
              that.tableData= that.pagination(1,10,that.objectData);
              that.total = data.data.length;
              var breakfastSum = 0, lunchSum = 0, dinnerSum = 0, eatSum = 0, trafficSum = 0, sockSum = 0,
                  clothesSum = 0, playSum = 0, othersSum = 0, giftsSum = 0, buySum = 0;
              that.objectData.forEach((item, index) => {
                that.objectData[index].sumCalc = (parseFloat(item.breakfast)+parseFloat(item.lunch)+parseFloat(item.dinner)+
                  parseFloat(item.traffic)+parseFloat(item.sock)+parseFloat(item.clothes)+
                  parseFloat(item.play)+parseFloat(item.others)+parseFloat(item.gifts)).toFixed(2);
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
                {"value": clothesSum.toFixed(2), "name": "服装"},
                {"value": playSum.toFixed(2), "name": "娱乐"},
                {"value": othersSum.toFixed(2), "name": "其他"},
                {"value": giftsSum.toFixed(2), "name": "人情"}
              );
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
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计(￥)'
          } else if (index === 2 || index === 3 || index === 4 || index === 5
            || index === 6 || index === 7 || index === 9 || index === 11 || index === 13 || index === 15 || index === 18) {
            const values = data.map(item => Number(item[column.property]))
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
            type: 'line'
          }]
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
          ]
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
            orient: 'vertical',
            left: '10',
            top: '60',
            data: ["早餐", "午餐", '晚餐', "餐飲", "交通", "购物", "零食", "服装", "娱乐", "其他", "人情"]
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
