<!-- 订单详细页面 -->
<template>
  <page-header-wrapper
    :title="'单号：'+ orderDetail.orderNum"
    :tab-active-key="tabActiveKey"
    v-if="orderDetail"
  >
    <template v-slot:content>
      <a-descriptions size="small">
        <a-descriptions-item label="购买用户"> {{ orderDetail.nickname }} </a-descriptions-item>
        <a-descriptions-item label="订购产品">{{ orderDetail.subject }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ $dateFormat(orderDetail.createAt) }}</a-descriptions-item>
        <a-descriptions-item label="订单类型">{{ OrderTypeStr }}</a-descriptions-item>
        <a-descriptions-item label="评价" v-if="orderDetail.comment"> {{ orderDetail.comment }} </a-descriptions-item>
      </a-descriptions>
    </template>

    <template v-slot:extra>
      <a-button type="primary" v-if="orderDetail.status == ORDER_STATUS[1].value " @click="shipVisible = true">发货</a-button>
      <a-popconfirm title="确认取消订单" @confirm="cancelOrder">
        <a-button type="danger" v-if="orderDetail.status == ORDER_STATUS[0].value ">取消订单</a-button>
      </a-popconfirm>
    </template>

    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="12" :sm="12">
          <div class="text">状态</div>
          <div class="heading">{{ OrderStatusStr }}</div>
        </a-col>
        <a-col :xs="12" :sm="12">
          <div class="text">订单金额</div>
          <div class="heading">¥ {{ orderDetail.realPay }}</div>
        </a-col>
      </a-row>
    </template>

    <a-card title="订单状态" :bordered="false">
      <a-steps
        progressDot
        :current="orderDetail.status">
        <a-step
          v-for="item in ORDER_STATUS"
          :key="item.value"
          :title="item.desc"
          :initial="item.item"
          v-if="item.value !== -99 || orderDetail.status === -99"
        >
          <template v-slot:description v-if="item.value === 0">
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              创建时间
              <div>{{ $dateFormat(orderDetail.createAt) }}</div>
            </div>
          </template>
          <template v-slot:description v-else-if="item.value === orderDetail.status">
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              操作时间
              <div>{{ $dateFormat(orderDetail.updateAt) }}</div>
            </div>
          </template>
        </a-step>
      </a-steps>
    </a-card>

    <a-card>
      <a-table
        ref="table"
        size="default"
        :columns="columns"
        :data-source="orderDetail.orderItems"
        showPagination="auto"
        :rowKey="(record) => record.id"
      >
        <template slot="product" slot-scope="record">
          <a-row>
            <a-col :sm="24" :md="8">
              <image-preview :img="record.productCover" :smallWidth="48" :bigWidth="400" :proportion="1" v-if="record.productCover"/>
            </a-col>
            <a-col :sm="24" :md="16">
              <div style="text-align: left;font-weight: 600"> {{ record.productName }}</div>
              <div>{{ record.skuName }}</div>
            </a-col>
          </a-row>
        </template>
        <template slot="productPrice" slot-scope="record">
          <div>￥ {{ record }} </div>
        </template>
        <template slot="num" slot-scope="record">
          <div style="color: red"> {{ record }} </div>
        </template>
        <template slot="price" slot-scope="record">
          <div>￥ {{ record }} </div>
        </template>
        <template slot="discount" slot-scope="record">
          <div>￥ {{ record }} </div>
        </template>
        <template slot="realPay" slot-scope="record">
          <div style="color: red">￥ {{ record }} </div>
        </template>
      </a-table>
    </a-card>

    <a-card style="margin-top: 24px" :bordered="false" title="物流信息">
      <div class="no-data" v-if="!orderDetail.shipment"><a-icon type="frown-o"/>暂无数据</div>
      <a-row class="orderCard" v-else>
        <a-descriptions title="订单详细">
          <a-descriptions-item label="收货地址">{{ getReceiveAddr }}</a-descriptions-item>
          <a-descriptions-item label="订单编号">{{ orderDetail.shipment.outTradeNo }}</a-descriptions-item>
          <a-descriptions-item label="电话">{{ orderDetail.shipment.phone }}</a-descriptions-item>
          <a-descriptions-item label="留言" v-if="orderDetail.shipment.comment">{{ orderDetail.shipment.comment }}</a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin-bottom: 32px"/>
        <a-descriptions title="订单物流" v-if="orderDetail.shipment.expressCode || orderDetail.shipment.express || orderDetail.shipment.shipCode">
          <a-descriptions-item label="快递单号">{{ orderDetail.shipment.shipCode }}</a-descriptions-item>
          <a-descriptions-item label="快递名称">{{ orderDetail.shipment.express }}</a-descriptions-item>
          <a-descriptions-item label="快递编码">{{ orderDetail.shipment.expressCode }}</a-descriptions-item>
        </a-descriptions>
        <a-descriptions title="订单物流" v-else>
          <div>
            <div class="no-data"><a-icon type="frown-o"/>暂无数据</div>
          </div>
        </a-descriptions>
      </a-row>
    </a-card>
    <OrderShip
      :visible="shipVisible"
      @ok="ok"
      @cancel="cancel"
      :loading="confirmLoading"
      :model="orderDetail.shipment"
      ref="ship"
    >
    </OrderShip>
  </page-header-wrapper>
</template>

<script>
  import { cancelOrder, deliver, getOrderDetails } from '@/api/order'
  import ImagePreview from '@/components/Image/ImagePreview'
  import { ORDER_STATUS, columns, ORDER_TYPE } from '@/views/order/modules/order'
  import { available } from '@/utils/data'
  import OrderShip from '@/views/order/modules/OrderShip'
  export default {
    data () {
      this.columns = columns
      return {
        shipVisible: false,
        ORDER_STATUS: ORDER_STATUS,
        ORDER_TYPE: ORDER_TYPE,
        tabActiveKey: '1',
        search: {}, // 查询数据
        orderDetail: null, // 订单详细内容
        confirmLoading: false
      }
    },
    created () {
      this.search.id = this.$route.query.id
      this.init()
    },
    components: {
      ImagePreview,
      OrderShip
    },
    computed: {
      OrderTypeStr () {
        const type = ORDER_TYPE.filter(type => type.value === this.orderDetail.orderType)
        if (type.length <= 0) {
          return null
        }
        return type[0].desc
      },
      OrderStatusStr () {
        const status = ORDER_STATUS.filter(status => status.value === this.orderDetail.status)
        if (status.length <= 0) {
          return null
        }
        return status[0].desc
      },
      // 收货地址拼接
      getReceiveAddr () {
        let addr = ''
        const shipment = this.orderDetail.shipment
        if (available(shipment)) {
          if (available(shipment.province)) {
            addr += shipment.province
          }
          if (available(shipment.province)) {
            addr += shipment.city
          }
          if (available(shipment.area)) {
            addr += shipment.area
          }
          if (available(shipment.address)) {
            addr += shipment.address
          }
        }
        return addr
      }
    },
    methods: {
      init () {
        this.getOrderDetail(this.search)
      },
      cancelOrder () {
        const param = {
          id: this.orderDetail.id
        }
        cancelOrder(param)
        .then(res => {
          this.$message.success('取消成功')
          this.init()
        })
      },
      // 获取订单中的商品信息
      getOrderDetail (params) {
        getOrderDetails(params)
        .then((res) => {
          console.log('获得订单详细内容', res)
          this.orderDetail = res
        })
        .catch((err) => {
          this.$message.error(err)
        })
      },
      // ok回调
      ok () {
        const form = this.$refs.ship.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log(values)
            deliver(values)
            .then(res => {
              console.log('res', res)
              this.shipVisible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$message.success('发货成功')
              this.init()
            })
          } else {
            this.confirmLoading = false
          }
        })
      },
      // cancel回调
      cancel () {
        this.shipVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .orderDetailContent div{
    padding-bottom: 10px;
  }
  .ordersBottom .firstSpan{
    margin-right: 20px;
  }
  .detail-layout {
    margin-left: 44px;
  }
  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;
  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
  }

  .mobile {
  .detail-layout {
    margin-left: unset;
  }
  .text {

  }
  .status-list {
    text-align: left;
  }
  }
</style>
