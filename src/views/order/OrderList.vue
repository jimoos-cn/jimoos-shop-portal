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
      <a-radio-group v-model="search.status" :default-value="null" @change="changeTap">
        <a-radio-button :value="null">所有</a-radio-button>
        <a-radio-button :value="0">新订单</a-radio-button>
        <a-radio-button :value="1">已支付</a-radio-button>
        <a-radio-button :value="2">已发货</a-radio-button>
        <a-radio-button :value="3">已签收</a-radio-button>
        <a-radio-button :value="-99">已取消</a-radio-button>
      </a-radio-group>
      <a-list
        :key="orderList.id"
        :dataSource="orderList"
        class="card-list"
        :pagination="pagination"
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
              </a-descriptions>
            </template>
            <OrderItem :item="item.orderItems" :total-pay="item.realPay"></OrderItem>
          </a-card>
        </a-list-item>
      </a-list>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import OrderItem from '@/views/order/modules/OrderItem'
  import { getOrderInfo } from '@/api/order'
  import { ORDER_TYPE } from '@/views/order/modules/order'
  export default {
    components: {
      OrderItem
    },
    data () {
      this.ORDER_TYPE = ORDER_TYPE
      return {
        timeArray: null,
        canEdit: false,
        advanced: false, // 高级搜索
        search: {
          offset: 0,
          limit: 10
        }, // 查询条件参数
        orderList: [],
        pagination: {
          onChange: page => {
            this.handlerPage(page)
          },
          pageSize: 10,
          current: 1
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.getOrderInfo()
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
      getOrderInfo () {
        getOrderInfo(this.search)
          .then((res) => {
            this.orderList = res.list
            this.pagination.total = res.total
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
      // 查询
      query () {
        this.getOrderInfo()
      },
      changeTap () {
        this.handlerPage(1)
      },
      handlerPage (page) {
        this.pagination.current = page
        this.search.limit = this.pagination.pageSize
        this.search.offset = (page - 1) * this.pagination.pageSize
        this.getOrderInfo()
      },
      // 重置
      reset () {
        this.search = {}
        this.timeArray = null
        this.$refs.table.refresh(true)
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      }
    }
  }
</script>
