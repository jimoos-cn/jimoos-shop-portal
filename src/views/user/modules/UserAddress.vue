<!-- 用户收货地址查看 -->
<template>
  <a-drawer
    placement="right"
    :closable="false"
    :visible="visible"
    @close="onClose"
    width="500"
  >
    <a-row class="title">
      <a-col :sm="24" :md="12">
        <span class="titleContent">收货地址</span>
      </a-col>
      <a-col :sm="24" :md="6" :offset="6">
        <a-button type="primary" @click="childVisible = true">新增地址</a-button>
      </a-col>
    </a-row>
    <a-row
      class="addressRow"
      v-for="item in userAddress"
      :key="item.id"
      :class="{defaultIn:item.defaultIn}"
    >
      <a-col :sm="24" :md="12" :offset="2">
        收件人:{{ item.name }}
      </a-col>
      <a-col :sm="24" :md="10">
        电话:{{ item.phone }}
      </a-col>
      <a-col :sm="24" :md="24" :offset="8" style="margin-top: 20px">
        收货地址:{{ item.address }}
      </a-col>
      <a-col :sm="24" :md="12" :offset="2" style="margin-top: 20px">
        <a v-if="!item.defaultIn">设置默认地址</a>
        <a v-else>取消默认地址</a>
      </a-col>
      <a-col :sm="24" :md="8" :offset="2" style="margin-top: 20px">
        <a>删除地址</a>
      </a-col>
    </a-row>
    <a-drawer
      v-if="childVisible"
      title="新增收货地址"
      placement="right"
      :closable="false"
      :visible="childVisible"
      @close="onCloseChild"
      width="500"
    >
    </a-drawer>

  </a-drawer>
</template>

<script>
  export default {
    name: 'UserAddress',
    data () {
      return {
        visible: false, // 显隐
        childVisible: false, // 抽屉二层显隐
        userAddress: {} // 地址
      }
    },
    methods: {
      onClose () {
        this.visible = false
      },
      onCloseChild () {
        this.childVisible = false
      }
    }
  }
</script>

<style scoped>
  .addressRow{
    padding-bottom: 10px;
    border-bottom: 1px solid #e2e0e0;
    margin-top: 10px;
  }
  .title{
    padding-bottom: 10px;
    border-bottom: 1px solid #e5dfdf;
  }
  .titleContent{
    font-weight: 700;
    font-size: 20px;
  }
  /*
  * 默认样式(待写
  */
  .defaultIn{
    background: #001529;
    color: #ffffff;
  }
</style>
