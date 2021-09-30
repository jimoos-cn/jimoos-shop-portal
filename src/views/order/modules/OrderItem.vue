<!-- 订单商品表格 -->
<template>
  <a-table bordered :data-source="item" :pagination="false" :columns="columns">
    <template slot="product" slot-scope="record">
      <a-row>
        <a-col :sm="24" :md="4">
          <image-preview :img="record.productCover" :smallWidth="80" :bigWidth="400" :proportion="1" v-if="record.productCover" />
        </a-col>
        <a-col :sm="24" :md="20">
          <div style="text-align: left;font-weight: 600">{{ record.productName }}</div>
          <div>{{ record.skuName }}</div>
          <div style="color: red">数量 :{{ record.num }}</div>
          <div style="color: red">价格 :￥{{ record.productPrice }}</div>
        </a-col>
      </a-row>
    </template>
    <template slot="productPrice" slot-scope="record">
      <div>总金额 ￥ {{ record.price }}</div>
      <div>额外费用 ￥ {{ record.fee }}</div>
      <div>优惠 ￥ {{ record.discount }}</div>
    </template>
    <template slot="realPay" slot-scope="record">
      <div style="color: red">￥ {{ record }}</div>
      <div v-if="totalPay">(总订单合计￥ {{ totalPay }})</div>
    </template>
  </a-table>
</template>

<script>
  import { columns } from '@/views/order/modules/order'
  import ImagePreview from '@/components/Image/ImagePreview'
  export default {
    components: {
      ImagePreview
    },
    data () {
      this.columns = columns
      return {
        //
      }
    },
    props: {
      item: {
        type: Array,
        default: null
      },
      totalPay: {
        type: Number,
        default: null
      }
    }
  }
</script>
