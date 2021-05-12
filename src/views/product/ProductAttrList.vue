<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="销售属性名称">
                <a-input v-model="search.name" placeholder="请输入销售属性名称" />
              </a-form-item>
            </a-col>
            <!-- 查询，重置 -->
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" icon="redo" @click="reset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button type="primary" style="margin-right: 8px" @click="goToAttrAdd()" icon="plus">添加销售属性</a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        :rowKey="(record) => record.id"
      >
        <div slot="createAt" slot-scope="text">
          {{ $dateFormat(text) }}
        </div>
        <div slot="productAttrValues" slot-scope="text">
          <span v-if="text">{{ getValueStr(text) }}</span>
          <span v-else>-</span>
        </div>
        <div slot="action" slot-scope="text, record">
          <a-space>
            <a @click="editAttr(record)">编辑</a>
            <a-popconfirm
              v-if="record.name !== '单品'"
              title="删除该销售属性？"
              ok-text="是"
              cancel-text="取消"
              @confirm="removeAttr(record)"
            >
              <a style="color: red">删除</a>
            </a-popconfirm>
          </a-space>
        </div>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { getProductAttrPage, deleteProductAttr } from '@/api/product/attr'
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    width: '80px'
  },
  {
    title: '属性名称',
    dataIndex: 'name'
  },
  {
    title: '属性描述',
    dataIndex: 'description'
  },
  {
    title: '属性值',
    dataIndex: 'attrValues',
    scopedSlots: {
      customRender: 'productAttrValues'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    scopedSlots: {
      customRender: 'createAt'
    }
  },
  {
    title: '操作',
    key: 'operation',
    width: '120px',
    fixed: 'right',
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
      search: {}, // 查询参数
      canEdit: false,
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.search)
        const params = {
          offset: (requestParameters.pageNo - 1) * requestParameters.pageSize,
          limit: requestParameters.pageSize
        }
        Object.keys(this.search).forEach((key) => {
          if (this.search[key] !== undefined && this.search[key] != null && this.search[key] !== '') {
            params[key] = this.search[key]
          }
        })
        let dataTable = {}
        return this.getList(params).then((res) => {
          dataTable = {
            pageSize: 10,
            pageNo: requestParameters.pageNo,
            totalCount: this.pagination.total,
            totalPage: this.pagination.total,
            data: res
          }
          return dataTable
        })
      }
    }
  },
  methods: {
    getValueStr (values) {
      const names = []
      values.forEach((value) => {
        names.push(value.name)
      })
      if (names.length > 0) {
        return names.join(',')
      } else {
        return ''
      }
    },
    // 重置
    reset () {
      this.search = {}
      this.$refs.table.refresh(true)
    },
    // 获取数据
    getList (params) {
      return new Promise((resolve) => {
        getProductAttrPage(params)
          .then((res) => {
            this.loading = false
            const pagination = {
              ...this.pagination
            }
            pagination.total = res['total']
            this.data = res['list']
            pagination.current = parseInt(params.offset / params.limit + '') + 1
            this.pagination = pagination
            resolve(this.data)
          })
          .catch((err) => {
            this.loading = false
            this.data = []
            console.log('', err)
          })
      })
    },
    removeAttr (record) {
      const that = this
      deleteProductAttr({ id: record.id })
        .then((res) => {
          that.$refs.table.refresh()
          that.$message.success('删除成功')
        })
        .catch((err) => {
          console.log(err)
          that.$refs.table.refresh()
          that.$message.error('删除失败')
        })
    },
    goToAttrAdd () {
      this.$router.push({
        name: 'productAttrSave'
      })
    },
    editAttr (record) {
      console.log(record)
      this.$router.push({
        name: 'skuEdit',
        query: {
          attr: JSON.stringify(record)
        }
      })
    }
  }
}
</script>
