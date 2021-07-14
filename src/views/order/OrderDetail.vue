<!-- 订单详细页面 -->
<template>
  <page-header-wrapper>
    <a-row>
      <a-card>
        <a-steps progress-dot :current="1">
          <a-step title="Start" description="订单创建" />
          <a-step title="Pay" description="订单支付" />
          <a-step title="In Progress" description="订单发货" />
          <a-step title="In Progress" description="订单确认" />
        </a-steps>
      </a-card>
    </a-row>
    <a-row>
      <a-card
        :bordered="false">
        <a-col :md="8" :sm="24">
          <a-row class="orderDetailTitle">
            <div>订单信息</div>
          </a-row>
          <a-row class="orderDetailContent">
            <div>收货地址</div>
            <div>留言</div>
            <div>订单编号</div>
            <div>商家</div>
          </a-row>
        </a-col>
        <a-col :md="16" :sm="24" class="orderLogistics">
          <div>订单物流及状态</div>
        </a-col>
      </a-card>
    </a-row>
    <a-row>
      <a-card>
        订单包含的商品
      </a-card>
    </a-row>
    <a-row>
      <a-card>
        订单总额 + 优惠信息
      </a-card>
    </a-row>
  </page-header-wrapper>
</template>

<script>
  export default {
    data () {
      return {
        data: []
      }
    },
    methods: {

    }
  }
</script>

<style scoped>
  .orderDetailTitle{
    padding-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #f0f2f5;
    font-weight: 700;
  }
  .orderDetailContent{
    padding-top: 10px;
    padding-left: 20px;
    background-color: #FBFBFB;
  }
  .orderDetailContent div{
    padding-bottom: 10px;
  }
  .orderLogistics{
    border:1px solid #DEDEDE;
    display: table-cell;
  }

</style>
