<template>
  <div>
    <s-table
      ref="table"
      :rowKey="record => record.id"
      size="default"
      :columns="columns"
      :data="loadData"
      :pagination="pagination">
      <div slot="useStatus" slot-scope="text">
        <a-badge status="error" v-if="!text" text="未使用"></a-badge>
        <a-badge status="success" v-else text="已使用"></a-badge>
      </div>
      <div slot="userId" slot-scope="text">
        <span v-if="text !== 0"> {{ text }}</span>
      </div>
      <!--时间-->
      <div slot="createAt" slot-scope="text">
        {{ text | dateFormat }}
      </div>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getCouponRecords } from '@/api/coupon'

const columns = [
  {
    title: '领取用户Id',
    dataIndex: 'userId',
    scopedSlots: {
      customRender: 'userId'
    },
    width: '100px',
    align: 'center'
  },
  {
    title: '领取用户昵称',
    dataIndex: 'user.nickname',
    width: '100px',
    align: 'center'
  },
  {
    title: '是否使用',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: {
      customRender: 'useStatus'
    },
    width: '150px'
  },
  {
    title: '领取时间',
    dataIndex: 'receivedAt',
    scopedSlots: {
      customRender: 'createAt'
    },
    align: 'center',
    width: '150px'
  },
  {
    title: '过期时间',
    dataIndex: 'expired',
    scopedSlots: {
      customRender: 'createAt'
    },
    align: 'center',
    width: '150px'
  }
]

export default {
  name: 'CouponRecordTable',
  props: {
    id: {
      required: true
    }
  },
  components: {
    STable
  },
  data () {
    this.columns = columns
    return {
      // model
      openModel: false,
      modelData: {},
      modelTitle: '',
      confirmLoading: false,
      editFlag: false,
      // 查询参数
      search: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let params = {
          offset: (parameter.pageNo - 1) * parameter.pageSize,
          limit: parameter.pageSize,
          id: this.id
        }
        params = Object.assign({}, params, this.search)
        return this.getList(params).then(res => {
          console.log('表格获取数据', res)
          return {
            pageSize: parameter.pageSize,
            pageNo: parameter.pageNo,
            totalCount: this.pagination.total,
            data: res
          }
        })
      },
      pagination: {
        showTotal: total => `共${total}条数据`
      }
    }
  },
  methods: {
    // 获取数据
    getList (params) {
      return new Promise(resolve => {
        getCouponRecords(params)
          .then(res => {
            this.pagination = {
              ...this.pagination,
              total: res['total'],
              current: parseInt(params.offset / params.limit + '') + 1
            }
            resolve(res['list'])
          })
          .catch(err => {
            this.loading = false
            console.log('', err)
          })
      })
    }
  }
}
</script>
