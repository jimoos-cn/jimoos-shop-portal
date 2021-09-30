<!-- 订单列表 -->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="订单编号">
                <a-input v-model="search.orderNum" placeholder="请输入订单编号" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订单类型">
                <a-select v-model="search.orderType" placeholder="请选择订单状态">
                  <a-select-option value="PRODUCT">实体类</a-select-option>
                  <a-select-option value="VIRTUAL">虚拟类</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="订单时间">
                  <a-range-picker v-model="timeArray" @change="onChange"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="下单手机">
                  <a-input v-model="search.phone" placeholder="请输入用户下单的手机" />
                </a-form-item>
              </a-col>
            </template>
            <!-- 查询，重置 -->
            <a-col a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" icon="search" @click="query">查询</a-button>
                <a-button style="margin-left: 8px" icon="redo" @click="reset">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-tabs :default-active-key="-1" @change="tabkeyChange">
        <a-tab-pane :key="-1" tab="所有"> </a-tab-pane>
        <a-tab-pane :key="0" tab="待支付"> </a-tab-pane>
        <a-tab-pane :key="1" tab="待发货"> </a-tab-pane>
        <a-tab-pane :key="2" tab="已发货"> </a-tab-pane>
        <a-tab-pane :key="3" tab="已签收"> </a-tab-pane>
        <a-tab-pane :key="4" tab="已评价"> </a-tab-pane>
        <a-tab-pane :key="5" tab="已取消"> </a-tab-pane>
      </a-tabs>
      <a-list
        :key="orderList.id"
        :dataSource="orderList"
        class="card-list"
        :pagination="paginationProps"
      >
        <a-list-item slot="renderItem" slot-scope="item" style="border-bottom: none">
          <a-card>
            <template slot="title">
              <a-descriptions>
                <a-descriptions-item label="订单编号">
                  <a @click="gotoOrderDetails(item)">{{ item.orderNum }}</a>
                </a-descriptions-item>
                <a-descriptions-item label="订单类型">
                  {{ orderTypeDesc(item) }}
                </a-descriptions-item>
                <a-descriptions-item label="购买用户">
                  <a @click="gotoUserDetai(item)"> {{ item.nickname }} </a>
                </a-descriptions-item>
                <a-descriptions-item label="总价格">
                  <span style="color: #3e2828">￥{{ item.totalPrice }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="实际付款">
                  <span style="color: red">￥{{ item.realPay }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="备注">
                  <span v-if="item.comment">{{ item.comment }}</span>
                  <span v-else>无</span>
                </a-descriptions-item>
                <a-descriptions-item label="状态">
                  <a-badge v-if="item.status === 0" text="新订单" color="yellow"></a-badge>
                  <a-badge v-if="item.status === 1" text="已支付" status="processing"></a-badge>
                  <a-badge v-if="item.status=== 2" text="已发货" color="geekblue"></a-badge>
                  <a-badge v-if="item.status === 3" text="已签收" status="success"></a-badge>
                  <!--          <a-badge v-if="record === 4" text="已评价" status="success"></a-badge>-->
                  <a-badge v-if="item.status === -99" text="已取消" status="default"></a-badge>
                </a-descriptions-item>
                <a-descriptions-item label="下单时间">
                  {{ $dateFormat(item.createAt) }}
                </a-descriptions-item>
                <a-descriptions-item label="操作">
                  <a-button size="small" type="default" @click="gotoOrderDetails(item)">详情</a-button>

                  <a-row style="display: inline-block">
                    <a-button
                      size="small"
                      type="primary"
                      v-if="item.status === 1"
                      style="margin-left: 10px"
                      @click="openShipment(item)"
                    >
                      发货
                    </a-button>
                  </a-row>
                  <a-popconfirm title="确认取消订单" @confirm="cancelOrder(item)" v-if="item.status === 0">
                    <a-button size="small" type="danger" style="margin-left: 10px">取消订单</a-button>
                  </a-popconfirm>
                </a-descriptions-item>
              </a-descriptions>
            </template>
            <OrderItem :item="item.orderItems" :total-pay="item.realPay"></OrderItem>
          </a-card>
        </a-list-item>
      </a-list>
    </a-card>
    <OrderShip
      v-if="shipVisible"
      :visible="shipVisible"
      @ok="ok"
      @cancel="cancel"
      :loading="confirmLoading"
      :model="choose"
      ref="ship" />
  </page-header-wrapper>
</template>

<script>
  import OrderItem from '@/views/order/modules/OrderItem'
  import OrderShip from '@/views/order/OrderShip'
  import { cancelOrder, deliver, getOrderInfo } from '@/api/order'
  import { ORDER_TYPE } from '@/views/order/modules/order'
  export default {
    components: {
      OrderItem,
      OrderShip
    },
    data () {
      this.ORDER_TYPE = ORDER_TYPE
      return {
        timeArray: null,
        canEdit: false,
        advanced: false, // 高级搜索
        search: {}, // 查询条件参数
        orderList: [],
        total: 0,
        tableKey: -1,
        shipVisible: false,
        confirmLoading: false,
        choose: null
      }
    },
    created () {
      this.init()
    },
    computed: {
      paginationProps () {
        const that = this
        return {
          showQuickJumper: true,
          showSizeChanger: true,
          total: that.total,
          pageSize: that.search.limit,
          current: that.search.offset / that.search.limit + 1,
          onChange (page, pageSize) {
            const param = {
              offset: pageSize * (page - 1)
            }
            that.query(param)
          },
          onShowSizeChange (page, pageSize) {
            const param = {
              offset: 0,
              limit: pageSize
            }
            that.query(param)
          }
        }
      }
    },
    methods: {
      init () {
        this.query({
          offset: 0,
          limit: 10
        })
      },
      tabkeyChange (key) {
        this.tableKey = key
        switch (this.tableKey) {
          case -1:
            this.search.status = null
            break
          case 0:
            this.search.status = 0
            break
          case 1:
            this.search.status = 1
            break
          case 2:
            this.search.status = 2
            break
          case 3:
            this.search.status = 3
            break
          case 4:
            this.search.status = 4
            break
          case 5:
            this.search.status = -99
            break
        }
        this.query({
          offset: 0,
          limit: 10
        })
      },
      orderTypeDesc (val) {
        const type = ORDER_TYPE.filter(type => type.value === val.orderType)
        if (type.length <= 0) {
          return null
        }
        return type[0].desc
      },
      gotoOrderDetails (params) {
        this.$router.push({
          name: 'orderDetail',
          query: {
            id: params.id
          }
        })
      },
      gotoUserDetai (params) {
        this.$router.push({
          name: 'userDetail',
          query: {
            id: params.userId
          }
        })
      },
      // 获取订单信息
      query (option) {
        this.search = { ...this.search, ...option }
        this.loading = true
        getOrderInfo(this.search)
          .then((res) => {
            this.orderList = res.list
            this.total = res.total
            this.loading = false
          })
          .catch((err) => {
            this.$message.error(err)
          })
      },
      // 日期选择器
      onChange (date, dateString) {
        console.log(date, dateString)
        const start = dateString[0] + ' 00:00:00'
        const end = dateString[1] + ' 23:59:59'
        this.search.startTime = Date.parse(start)
        this.search.endTime = Date.parse(end)
      },
      // 重置
      reset () {
        this.search = {}
        this.timeArray = null
        this.query({
          limit: 10,
          offset: 0
        })
      },
      cancelOrder (order) {
        const param = {
          id: order.id
        }
        cancelOrder(param).then(res => {
          this.$message.success('取消成功')
          this.init()
        })
      },
      // ok回调
      ok () {
        const form = this.$refs.ship.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log(values)
            const param = {
              orderId: this.choose.id,
              shipCode: values.shipCode,
              express: values.express,
              expressCode: values.expressCode
            }
            deliver(param).then(res => {
              console.log('res', res)
              this.shipVisible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$message.success('发货成功')
              this.choose = {}
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
        this.choose = {}
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      openShipment (item) {
        this.choose = item
        this.shipVisible = true
      }
    }
  }
</script>
