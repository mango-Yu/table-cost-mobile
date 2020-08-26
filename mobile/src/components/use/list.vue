<template>
  <div ref="list" class="warp-main">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
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
          <el-table-column align="center" prop="visaRemind" label="信用卡花呗费用备注(不计总费用)" ></el-table-column>
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
          <el-table-column align="center" prop="house" label="房租" ></el-table-column>
          <el-table-column align="center" prop="work" label="是否上班" sortable>
            <template slot-scope="scope">
                {{scope.row.work == 1? "上班" : "不上班"}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sumCalc" label="总计￥" >

          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="toolbar" id="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       @prev-click="handlePrevChange" @next-click="handleNextChange" :pager-count="5"
                       :current-page="currentPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next" :total="total" small>
        </el-pagination>
      </el-col>
      <el-col :span="24">
        <div id="chartColumn" style="width: 100%; height: 400px;"></div>
      </el-col>
      <el-col :span="24">
        <div id="chartBar" style="width: 100%; height: 400px;"></div>
      </el-col>
      <el-col :span="24">
        <div id="chartPie" style="width: 100%; height: 480px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import store from '@/store/store'
  import {formatDate, is_Weixn, isMobile} from '@/assets/js/tool'
  import {getAllSpending, getSumByUser} from '@/assets/userapi'
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
        costTypeSumArr: [],
        allCostData:{},
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
          insure: 0,
          house: 0,
        },
      };
    },
    mounted: function () {

    },
    computed:{

    },
    methods: {

      init(){
        this.funcGetAllSpending(this.currentPage-1,this.pageSize);
        this.funcGetSumByUser();
      },
      funcGetAllSpending(start, pageSize){
        let that = this;
        getAllSpending({start: start * pageSize, pageSize: pageSize}).then(function (data) {
          data=data.data;
          if(1 === data.code){
            if(data.data.dataList.length>0){
              that.tableData = data.data.dataList;
              that.tableData.sort(function(a,b) {
                return Date.parse((formatDate(new Date(b.date), "yyyy-MM-dd")).replace(/-/g,"/"))-Date.parse((formatDate(new Date(a.date), "yyyy-MM-dd")).replace(/-/g,"/"));
              });
              that.total = data.data.total;
              that.tableData.forEach((item, index) => {
                item["idIndex"] = (index+1) + start * pageSize;
                that.tableData[index].sumCalc = (parseFloat(item.breakfast)+parseFloat(item.lunch)+parseFloat(item.dinner)+
                  parseFloat(item.traffic)+parseFloat(item.sock)+parseFloat(item.clothes)+
                  parseFloat(item.play)+parseFloat(item.others)+parseFloat(item.gifts)+
                  parseFloat(item.buy)+parseFloat(item.foods)+parseFloat(item.loans)+parseFloat(item.skin)+parseFloat(item.health)+parseFloat(item.insure)).toFixed(2);

              });
            }else{

            }
          }else{
            that.$vux.toast.show({text: '系统异常', type: 'warn', isShowMask: true});
          }

        }).catch(function (error) {
          that.$vux.toast.show({text: '系统异常', type: 'warn', isShowMask: true});
        })
      },
      funcGetSumByUser(){
        let that = this;
        getSumByUser().then(function (res) {
          let data = res.data.data;
          if (res.data.code === 1) {
            let objData = data.allCostSumList[0];
            if (objData) {
              objData.allCost = 0;
              for (let i in objData) {
                if (objData[i] == null) {
                  let str = i.split(')')[0].split('(')[1];
                  that.form[str] = 0
                  that.form.allCost = 0;
                } else {
                  let str = i.split(')')[0].split('(')[1];
                  that.form[str] = parseFloat(objData[i]).toFixed(2);
                  if (str === "visa" || str === "house") {
                    objData.allCost += 0;
                  } else {
                    objData.allCost += parseFloat(objData[i]);
                  }

                }
              }
              objData.allCost = (objData.allCost).toFixed(2);
              that.allCostData = objData
              that.costTypeSumArr.push(
                {"value": parseFloat(that.form.breakfast), "name": "早餐", "const": "const"},
                {"value": parseFloat(that.form.lunch), "name": "午餐", "const": "const"},
                {"value": parseFloat(that.form.dinner), "name": "晚餐", "const": "const"},
                {
                  "value": parseFloat(that.form.breakfast + that.form.lunch + that.form.dinner),
                  "name": "餐飲",
                  "const": "const"
                },
                {"value": parseFloat(that.form.traffic), "name": "交通", "const": "const"},
                {"value": parseFloat(that.form.sock), "name": "零食", "const": "const"},
                {"value": parseFloat(that.form.buy), "name": "购物", "const": "const"},
                {"value": parseFloat(that.form.foods), "name": "食材超市", "const": "const"},
                {"value": parseFloat(that.form.visa), "name": "信用花呗", "const": "const"},
                {"value": parseFloat(that.form.loans), "name": "贷款", "const": "const"},
                {"value": parseFloat(that.form.clothes), "name": "服装", "const": "const"},
                {"value": parseFloat(that.form.skin), "name": "化妆品", "const": "const"},
                {"value": parseFloat(that.form.health), "name": "医疗", "const": "const"},
                {"value": parseFloat(that.form.insure), "name": "保险", "const": "const"},
                {"value": parseFloat(that.form.play), "name": "娱乐", "const": "const"},
                {"value": parseFloat(that.form.others), "name": "其他", "const": "const"},
                {"value": parseFloat(that.form.gifts), "name": "人情", "const": "const"},
                {"value": parseFloat(that.form.house), "name": "房租", "const": "const"}
              );
            }
            if (data.allCostDataList.length > 0) {
              that.dateArr = [];
              that.costArr = [];
              that.objectData = data.allCostDataList;
              that.objectData.sort(function (a, b) {
                return Date.parse((formatDate(new Date(b.date), "yyyy-MM-dd")).replace(/-/g, "/")) - Date.parse((formatDate(new Date(a.date), "yyyy-MM-dd")).replace(/-/g, "/"));
              });
              that.objectData.forEach((item, index) => {
                item["idIndex"] = index + 1;
                that.objectData[index].date = formatDate(new Date(that.objectData[index].date), "yyyy-MM-dd");
                that.objectData[index].sumCalc = (parseFloat(item.breakfast) + parseFloat(item.lunch) + parseFloat(item.dinner) +
                  parseFloat(item.traffic) + parseFloat(item.sock) + parseFloat(item.clothes) +
                  parseFloat(item.play) + parseFloat(item.others) + parseFloat(item.gifts) +
                  parseFloat(item.buy) + parseFloat(item.foods) + parseFloat(item.loans) + parseFloat(item.skin) + parseFloat(item.health) + parseFloat(item.insure)).toFixed(2);
                that.dateArr.push(formatDate(new Date(item.date), "yyyy-MM-dd"));
                that.costArr.push({
                  "value": parseFloat(that.objectData[index].sumCalc),
                  "date": formatDate(new Date(item.date), "yyyy-MM-dd")
                });
              });
              that.dateArr.reverse();
              that.costArr.reverse();
              that.drawShape();
            }
          } else {
            console.log('系统异常')
            that.$vux.toast.show({text: '系统异常', type: 'warn', isShowMask: true});
          }
        }).catch(function (error) {
          console.log(error)
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
        that.funcGetAllSpending(this.currentPage-1,this.pageSize);
      },
      handleCurrentChange(val) {
        let that = this;
        that.funcGetAllSpending(val-1,this.pageSize);
      },
      handlePrevChange(val) {
        let that = this;
        that.funcGetAllSpending(val-1,this.pageSize);
      },
      handleNextChange(val) {
        let that = this;
        that.funcGetAllSpending(val-1,this.pageSize);
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
                    || index === 30 || index === 32) {
            // const values = that.allCostData.map(item => Number(item[column.property]))
            for (let i  in that.allCostData){
              let str = i.split(')')[0].split('(')[1];
              if (str === column.property){
                sums[index] = (that.allCostData[i]).toFixed(2)
              }else if (column.property === "sumCalc"){
                sums[index] = parseFloat(that.allCostData["allCost"]).toFixed(2)
              }
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
            top: '40',
            data: ["早餐", "午餐", '晚餐', "餐飲", "交通", "购物", "食材超市", "信用花呗", "贷款", "零食", "房租", "服装", "化妆品", "医疗", "保险", "娱乐", "其他", "人情"]
          },
          series: [
            {
              name: '花销',
              type: 'pie',
              radius: '55%',
              center: ['47%', '65%'],
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
  #toolbar .el-pagination.is-background .btn-next,#toolbar .el-pagination.is-background .btn-prev,#toolbar .el-pagination.is-background .el-pager li{
    margin: 0 1px;
  }
  .toolbar{
    padding: 10px 0;
  }

</style>
