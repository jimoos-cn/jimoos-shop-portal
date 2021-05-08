<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="优惠券名称">
                <a-input v-model="search.name" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <!-- 查询，重置 -->
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button
                  style="margin-left: 8px"
                  icon="redo"
                  @click="
                    () => {
                      this.search = {}
                      this.$refs.table.refresh(true)
                    }
                  "
                >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
          <div class="table-operator">
            <a-button type="primary" icon="plus" @click="openTheModal({}, false)">新增优惠券</a-button>
          </div>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
        :pagination="pagination"
      >
        <!-- 优惠券名称 -->
        <span slot="name" slot-scope="text, record">
          <a @click="goToDetail(record)">{{ text }}</a>
        </span>
        <!-- fullmoney -->
        <span slot="fullMoney" slot-scope="text, record">
          满 <b>{{ text }}</b> 减 <b>{{ record.reduceMoney }}</b>
        </span>
        <!--时间-->
        <div slot="createAt" slot-scope="text">
          {{ text | dateFormat }}
        </div>
        <div slot="status" slot-scope="text">
          <a-badge status="success" v-if="text" text="上架"></a-badge>
          <a-badge status="error" v-else text="已下架"></a-badge>
        </div>
        <!-- 操作 -->
        <div slot="action" slot-scope="text, record">
          <a-space>
            <a @click="goToDetail(record)">详情</a>
            <a v-if="!record.status" @click="handleUp(record)">上架</a>
            <a-popconfirm
              title="确定要下架优惠券吗？"
              ok-text="是"
              cancel-text="取消"
              @confirm="handleDown(record)"
              v-else
            >
              <a style="color: red">下架</a>
            </a-popconfirm>
          </a-space>
        </div>
      </s-table>
      <CouponModal
        :data="modelData"
        :open-model="openModel"
        :title="modelTitle"
        :confirm-loading="confirmLoading"
        :edit-flag="editFlag"
        :categories="categories"
        @cancel="openModel = false"
        @submit="submitModel"
      >
      </CouponModal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import CouponModal from '@/views/coupon/modules/CouponModal'
import { getCouponPage, createCoupon, downCoupon, upCoupon } from '@/api/coupon'

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    align: 'center',
    width: '80px'
  },
  {
    title: '优惠券名称',
    dataIndex: 'des',
    align: 'center',
    width: '150px'
  },
  {
    title: '满减金额',
    dataIndex: 'fullMoney',
    width: '200px',
    align: 'center',
    scopedSlots: {
      customRender: 'fullMoney'
    }
  },
  {
    title: '有效时间开始',
    dataIndex: 'effectiveStartTime',
    align: 'center',
    width: '150px',
    scopedSlots: {
      customRender: 'createAt'
    }
  },
  {
    title: '有效时间结束',
    dataIndex: 'effectiveEndTime',
    align: 'center',
    width: '150px',
    scopedSlots: {
      customRender: 'createAt'
    }
  },
  {
    title: '领券开始时间',
    dataIndex: 'startTime',
    align: 'center',
    width: '150px',
    scopedSlots: {
      customRender: 'createAt'
    }
  },
  {
    title: '领券截至时间',
    dataIndex: 'endTime',
    align: 'center',
    width: '150px',
    scopedSlots: {
      customRender: 'createAt'
    }
  },
  {
    title: '上架状态',
    dataIndex: 'status',
    align: 'center',
    width: '150px',
    scopedSlots: {
      customRender: 'status'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    align: 'center',
    width: '150px',
    scopedSlots: {
      customRender: 'createAt'
    }
  },
  {
    title: '操作',
    key: 'operation',
    width: '200px',
    scopedSlots: {
      customRender: 'action'
    },
    align: 'center'
  }
]
export default {
  name: 'CouponPage',
  components: {
    STable,
    CouponModal
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
      search: {},
      // 高级搜索 展开/关闭
      advanced: false,
      categories: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const params = {
          offset: (parameter.pageNo - 1) * parameter.pageSize,
          limit: parameter.pageSize
        }
        Object.keys(this.search).forEach((key) => {
          if (this.search[key] !== undefined && this.search[key] != null && this.search[key] !== '') {
            params[key] = this.search[key]
          }
        })
        return this.getList(params).then((res) => {
          console.log('表格获取数据', res)
          return {
            pageSize: this.pagination.pageSize,
            pageNo: parameter.pageNo,
            totalCount: this.pagination.total,
            data: res
          }
        })
      },
      pagination: {
        showTotal: (total) => `共${total}条数据`
      }
    }
  },
  methods: {
    // 获取数据
    getList (params) {
      return new Promise((resolve) => {
        getCouponPage(params)
          .then((res) => {
            this.pagination = {
              ...this.pagination,
              total: res['total'],
              current: parseInt(params.offset / params.limit + '') + 1
            }
            resolve(res['list'])
          })
          .catch((err) => {
            this.loading = false
            console.log('', err)
          })
      })
    },
    // 新增
    openTheModal (data, flag) {
      this.openModel = true
      this.editFlag = flag
      if (flag) {
        this.modelTitle = '编辑'
        this.modelData = data
      } else {
        this.modelTitle = '新增优惠券'
        this.modelData = {}
      }
    },
    // model的确认事件
    submitModel (data, flag) {
      this.confirmLoading = true
      if (flag) {
        // 修改
      } else {
        createCoupon(data)
          .then(() => {
            this.$message.success('添加成功！')
            this.$refs.table.refresh()
            this.confirmLoading = false
            this.openModel = false
          })
          .catch(() => {
            this.confirmLoading = false
            this.$message.error('添加失败')
          })
      }
    },
    goToDetail (record) {
      this.$router.push({
        name: 'coupon-detail',
        query: {
          id: record.id
        }
      })
    },
    // 下架优惠券
    handleDown (record) {
      const _this = this

      const data = {
        id: record.id
      }
      downCoupon(data)
        .then(() => {
          _this.$refs.table.refresh()
          _this.$message.success('下架成功!')
        })
        .catch(() => {
          _this.$message.success('操作失败')
        })
    },
    // 下架优惠券
    handleUp (record) {
      const _this = this
      const data = {
        id: record.id
      }
      upCoupon(data)
        .then(() => {
          _this.$refs.table.refresh()
          _this.$message.success('上架成功!')
        })
        .catch(() => {
          _this.$message.success('操作失败')
        })
    }
  }
}
</script>
