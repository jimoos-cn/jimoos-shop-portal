<!-- 订单列表 -->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="订单状态">
                <a-select v-model="search.status" placeholder="请选择订单状态">
                  <a-select-option :value="0">新订单</a-select-option>
                  <a-select-option :value="1">已支付</a-select-option>
                  <a-select-option :value="2">已发货</a-select-option>
                  <a-select-option :value="3">已签收</a-select-option>
                  <a-select-option :value="4">已评价</a-select-option>
                  <a-select-option :value="-99">已取消</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
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
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        :rowKey="(record) => record.id"
      >
        <div slot="orderNum" slot-scope="record">
          <a @click="gotoOrderDetails(record)">{{ record.orderNum }}</a>
        </div>
        <div slot="status" slot-scope="record">
          <span v-if="record === 0">新订单</span>
          <span v-if="record === 1">已支付</span>
          <span v-if="record === 2">已发货</span>
          <span v-if="record === 3">已签收</span>
          <span v-if="record === 4">已评价</span>
          <span v-if="record === -99">已取消</span>
        </div>
        <div slot="totalProductPrice" slot-scope="record">
          ￥{{ record }}
        </div>
        <div slot="totalDiscount" slot-scope="record">
          ￥{{ record }}
        </div>
        <div slot="realPay" slot-scope="record">
          ￥{{ record }}
        </div>
        <div slot="createAt" slot-scope="record">
          {{ $dateFormat(record) }}
        </div>
        <span slot="action" slot-scope="text, record">
          <a @click="gotoOrderDetails(record)">详情</a>
          <a v-if="record.status === 1" @click="gotoOrderDetails(record)" style="margin-left: 10px;color: #4bc912">发货</a>
          <a @click="cancelOrder(record)" style="color: red; margin-left: 10px">订单取消</a>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'
  import { getOrderInfo } from '@/api/order'
  const columns = [
    {
      title: '订单编号',
      scopedSlots: {
        customRender: 'orderNum'
      },
      width: '100px'
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      scopedSlots: {
        customRender: 'status'
      },
      width: '100px'
    },
    {
      title: '总价',
      dataIndex: 'totalProductPrice',
      scopedSlots: {
        customRender: 'totalProductPrice'
      },
      width: '100px'
    },
    {
      title: '优惠额',
      dataIndex: 'totalDiscount',
      scopedSlots: {
        customRender: 'totalDiscount'
      },
      width: '100px'
    },
    {
      title: '实际支付',
      dataIndex: 'realPay',
      scopedSlots: {
        customRender: 'realPay'
      },
      width: '100px'
    },
    {
      title: '创建日期',
      dataIndex: 'createAt',
      scopedSlots: {
        customRender: 'createAt'
      },
      width: '100px'
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: '200px',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ]
  export default {
    components: {
      STable
    },
    data () {
      this.columns = columns
      return {
        timeArray: null,
        canEdit: false,
        advanced: false, // 高级搜索
        search: {}, // 查询条件参数
        loadData: (parameter) => { // 数据加载
          const requestParameters = Object.assign({}, parameter, this.search)
          console.log('loadData request parameters:', requestParameters)
          const params = {
            offset: (requestParameters.pageNo - 1) * requestParameters.pageSize,
            limit: requestParameters.pageSize,
            type: 0
          }
          Object.keys(this.search).forEach((key) => {
            if (this.search[key] !== undefined && this.search[key] != null && this.search[key] !== '') {
              params[key] = this.search[key]
            }
          })
          let dataTable = {}
          return this.getOrderInfo(params).then((res) => {
            dataTable = {
              pageSize: requestParameters.pageSize,
              pageNo: requestParameters.pageNo,
              totalCount: this.pagination.total,
              data: res
            }
            return dataTable
          })
        }
      }
    },
    methods: {
      // 订单取消
      cancelOrder (params) {
        //
      },
      // 订单详细页跳转
      gotoOrderDetails (params) {
        this.$router.push({
          name: 'orderDetail',
          query: {
            id: params.id
          }
        })
      },
      // 获取订单信息
      getOrderInfo (params) {
        return new Promise((resolve) => {
          getOrderInfo(params)
          .then((res) => {
            console.log(res)
            const pagination = {
              ...this.pagination
            }
            pagination.total = res['total']
            this.data = res['list']
            pagination.current = parseInt(params.offset / params.limit + '') + 1
            pagination.pageTotal = parseInt((pagination.total + params.limit - 1) / params.limit + '')
            this.pagination = pagination
            resolve(this.data)
          })
          .catch((err) => {
            this.data = []
            this.$message.error(err)
          })
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
        this.$refs.table.refresh(true)
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
