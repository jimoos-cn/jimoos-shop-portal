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
        <a-row class="orderCard">
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
        </a-row>
      </a-card>
    </a-row>
    <a-row>
      <a-card>
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          showPagination="auto"
          :rowKey="(record) => record.id"
        >
        </s-table>
      </a-card>
    </a-row>
    <a-row>
      <a-card>
        <a-row class="ordersBottom">
          <a-row>
            <div>
              <span>商品总价</span>
              <span>￥111</span>
            </div>
            <div>
              <span>运费</span>
              <span>￥111</span>
            </div>
            <div>
              <span>运费险</span>
              <span>￥111</span>
            </div>
            <div>
              <span>实付款</span>
              <span>￥111</span>
            </div>
          </a-row>
        </a-row>
      </a-card>
    </a-row>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'
  const columns = [
    {
      title: '商品',
      dataIndex: 'product',
      scopedSlots: {
        customRender: 'product'
      },
      width: '100px'
    },
    {
      title: '单价',
      dataIndex: 'product',
      scopedSlots: {
        customRender: 'product'
      },
      width: '100px'
    },
    {
      title: '数量',
      dataIndex: 'product',
      scopedSlots: {
        customRender: 'product'
      },
      width: '100px'
    },
    {
      title: '优惠',
      dataIndex: 'product',
      scopedSlots: {
        customRender: 'product'
      },
      width: '100px'
    },
    {
      title: '状态',
      dataIndex: 'product',
      scopedSlots: {
        customRender: 'product'
      },
      width: '100px'
    }
  ]
  export default {
    data () {
      this.columns = columns
      return {
        search: {}, // 查询数据
        loadData: (paramters) => {
          const requestParamters = Object.assign({}, paramters, this.search)
          console.log('load params', requestParamters)
          const params = {
            offset: (requestParamters.pageNo - 1) * requestParamters.pageSize,
            limit: requestParamters.pageSize,
            type: 0
          }
          Object.keys(this.search).forEach((key) => {
            if (this.search[key] !== undefined && this.search[key] != null && this.search[key] !== '') {
              params[key] = this.search[key]
            }
          })
          let dataTable = {}
          return this.getOrderProduct(params)
          .then((res) => {
            console.log('获取数据', res)
            dataTable = {
              pageSize: requestParamters.pageSize,
              pageNo: requestParamters.pageNo,
              totalCount: this.pagination.total,
              totalPage: this.pagination.pageTotal,
              data: res
            }
            return dataTable
          })
        }
      }
    },
    components: {
      STable
    },
    methods: {
      // 获取订单中的商品信息
      getOrderProduct (params) {
        //
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
    padding-right: 50px;
  }

</style>
