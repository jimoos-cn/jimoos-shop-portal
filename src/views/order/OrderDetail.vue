<!-- 订单详细页面 -->
<template>
  <page-header-wrapper>
    <a-row>
      <a-card>
        <a-steps progress-dot :current="orderDetails.status">
          <a-step :initial="ORDER_STATUS.ORDER_NEW" title="NEW" description="新订单" />
          <a-step :initial="ORDER_STATUS.PAID" title="PAID" description="已支付" />
          <a-step :initial="ORDER_STATUS.DELIVERY" title="DELIVERY" description="已发货" />
          <a-step :initial="ORDER_STATUS.RECEIVE" title="RECEIVE" description="已签收" />
          <a-step :initial="ORDER_STATUS.RATED" title="RATED" description="已评价" />
          <a-step :initial="ORDER_STATUS.CANCEL" title="CANCEL" description="已取消" />
        </a-steps>
      </a-card>
    </a-row>
    <a-row>
      <a-card
        :bordered="false">
        <a-row class="orderCard">
          <a-col :md="8" :sm="24">
            <a-row class="orderDetailTitle">
              <div>订单信息</div>
            </a-row>
            <a-row class="orderDetailContent" v-if="loading">
              <div>收货地址 {{ getReceiveAddr }}</div>
              <div>订单编号 {{ orderDetails.shipment.outTradeNo }}</div>
              <div>电话 {{ orderDetails.shipment.phone }}</div>
              <div>留言 {{ orderDetails.shipment.comment }}</div>
            </a-row>
          </a-col>
          <a-col :md="16" :sm="24" class="orderLogistics">
            <div>订单物流及状态</div>
          </a-col>
        </a-row>
      </a-card>
    </a-row>
    <a-row>
      <a-card>
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="getOrderItems"
          showPagination="auto"
          :rowKey="(record) => record.id"
        >
          <template slot="product" slot-scope="record">
            <a-row>
              <a-col :sm="24" :md="8">
                <image-preview :img="record.productCover" :smallWidth="48" :bigWidth="400" :proportion="1" v-if="record.productCover"/>
              </a-col>
              <a-col :sm="24" :md="16">
                <div style="text-align: left "> {{ record.productName }}</div>
              </a-col>
            </a-row>
          </template>
          <template slot="price" slot-scope="record">
            <div>￥ {{ record.price }} </div>
          </template>
          <template slot="discount" slot-scope="record">
            <div>￥ {{ record.discount }} </div>
          </template>
        </s-table>
      </a-card>
    </a-row>
    <a-row>
      <a-card>
        <a-row class="ordersBottom" v-if="loading">
          <a-row>
            <div>
              <span class="firstSpan">商品总价</span>
              <span>￥{{ orderDetails.totalProductPrice }}</span>
            </div>
            <div>
              <span class="firstSpan">运费</span>
              <span>￥{{ orderDetails.totalFee }}</span>
            </div>
            <div>
              <span class="firstSpan">总优惠</span>
              <span>￥{{ orderDetails.totalDiscount }}</span>
            </div>
            <div>
              <span class="realPay firstSpan">实付款</span>
              <span class="realPaymomey">￥{{ orderDetails.realPay }}</span>
            </div>
          </a-row>
        </a-row>
      </a-card>
    </a-row>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'
  import { getOrderDetails } from '@/api/order'
  import { avliable } from '@/utils/data'
  import ImagePreview from '@/components/Image/ImagePreview'
  const ORDER_STATUS = {
    ORDER_NEW: 0,
    PAID: 1,
    DELIVERY: 2,
    RECEIVE: 3,
    RATED: 4,
    CANCEL: -99
  }
  const columns = [
    {
      title: '商品',
      scopedSlots: {
        customRender: 'product'
      },
      width: '100px'
    },
    {
      title: '单价',
      scopedSlots: {
        customRender: 'price'
      },
      width: '100px'
    },
    {
      title: '数量',
      dataIndex: 'num',
      scopedSlots: {
        customRender: 'num'
      },
      width: '100px'
    },
    {
      title: '优惠',
      scopedSlots: {
        customRender: 'discount'
      },
      width: '100px'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '100px'
    }
  ]
  export default {
    data () {
      this.columns = columns
      this.ORDER_STATUS = ORDER_STATUS
      return {
        loading: false, // 数据加载状态
        search: {}, // 查询数据
        orderDetails: {}, // 订单详细内容
        getOrderItems: (param) => {
          let dataTable = {}
          return this.getOrderDetails(this.search)
          .then((res) => {
            dataTable = {
              pageSize: param.pageSize,
              pageNo: param.pageNo,
              totalCount: 1,
              data: res
            }
            return dataTable
          })
        }
      }
    },
    created () {
      this.search.id = this.$route.query.id
    },
    components: {
      STable,
      ImagePreview
    },
    computed: {
      // 收货地址拼接
      getReceiveAddr () {
        let addr = ''
        const shipment = this.orderDetails.shipment
        if (avliable(shipment)) {
          if (avliable(shipment.province)) {
            addr += shipment.province
          }
          if (avliable(shipment.province)) {
            addr += shipment.city
          }
          if (avliable(shipment.area)) {
            addr += shipment.area
          }
          if (avliable(shipment.address)) {
            addr += shipment.address
          }
        }
        return addr
      }
    },
    methods: {
      // 获取订单中的商品信息
      getOrderDetails (params) {
        return new Promise((resolve) => {
          this.loading = false
          getOrderDetails(params)
          .then((res) => {
            console.log('获得订单详细内容', res)
            this.orderDetails = res
            this.loading = true
            resolve(this.orderDetails.orderItems)
          })
          .catch((err) => {
            this.data = []
            this.$message.error(err)
          })
        })
      }
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
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .orderCard{
    display: flex;
  }
  .ordersBottom{
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding-right: 50px;
  }
  .realPay{
    color: #333333;
    font-size: 14px;
    font-weight: 600;
  }
  .realPaymomey{
    color: #DD2727;
    font-size: 14px;
    font-weight: 600;
    width: 120px;
  }
  .ordersBottom .firstSpan{
    margin-right: 20px;
  }

</style>
