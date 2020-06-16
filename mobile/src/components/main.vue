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


 </div>
</template>

<script>
  import day from '@/components/use/day'
  import month from '@/components/use/month'
  import list from '@/components/use/list'
export default {
  name: 'main',
  data () {
    return {
      msg: "",
      option1: '是',
      options1: ['是', '否'],
      isShow:0
    }
  },
  components:{
    day,
    month,
    list
  },
  methods:{
    onItemClick(val){
      this.isShow=val
      if(val === 1){
        this.$refs.initMon.init()
      }else if (val === 2) {
        this.$refs.initList.init()
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
  }


</style>
