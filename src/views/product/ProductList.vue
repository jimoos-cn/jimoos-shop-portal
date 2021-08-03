<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="商品名称">
                <a-input v-model="search.name" placeholder="请输入商品名称" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品状态">
                <a-select v-model="search.status" placeholder="请选择商品状态">
                  <a-select-option :value="0">未上架</a-select-option>
                  <a-select-option :value="2">上架中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="商品分类">
                  <a-select v-model="search.categoryId" placeholder="请选择商品分类">
                    <a-select-option
                      v-for="(item, index) in categoryList"
                      :value="item.id"
                      :key="index"
                    >{{ item.name }}
                    </a-select-option>
                  </a-select>
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
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="addProduct">添加商品</a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        :rowKey="(record) => record.id"
      >
        <div slot="id" slot-scope="record">
          <a @click="gotoDetail(record)">{{ record.id }}</a>
        </div>
        <div slot="createAt" slot-scope="record">
          {{ $dateFormat(record) }}
        </div>
        <div slot="cover" slot-scope="text">
          <image-preview :img="text" :smallWidth="48" :bigWidth="400" :proportion="1" v-if="text"></image-preview>
        </div>
        <div slot="price" slot-scope="record">
          <span v-if="record.price < record.showPrice">￥{{ record.price }}~￥{{ record.showPrice }}</span>
          <span
            v-if="record.price === record.showPrice && record.price && record.showPrice"
          >￥{{ record.price }}</span
          >
          <span v-if="!record.price">未知</span>
        </div>
        <div slot="status" slot-scope="text">
          <a-badge status="error" v-if="text === 0" text="未上架"></a-badge>
          <a-badge status="success" v-else text="上架中"></a-badge>
        </div>
        <span slot="action" slot-scope="text, record">
          <a @click="gotoDetail(record)">详情</a>
          <a @click="gotoEdit(record)" style="margin-left: 10px">编辑</a>
          <a @click="upProduct(record)" v-if="record.status === 0" style="margin-left: 10px">上架</a>
          <a @click="downProduct(record)" v-if="record.status === 2" style="margin-left: 10px">下架</a>
          <a @click="removeProduct(record)" style="color: red; margin-left: 10px">删除</a>
        </span>
        <div slot="category" slot-scope="text">
          <a-tag color="blue">{{ text }}</a-tag>
        </div>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import ImagePreview from '@/components/Image/ImagePreview'
import { STable } from '@/components'
import storage from 'store'
import { getProductCategoryPage } from '@/api/product/category'
import { getProductPage, upProduct, downProduct, deleteProduct } from '@/api/product'

const columns = [
  {
    title: '商品编号',
    scopedSlots: {
      customRender: 'id'
    },
    width: '100px'
  },
  {
    title: '商品名称',
    dataIndex: 'name'
  },
  {
    title: '商品封面',
    dataIndex: 'cover',
    scopedSlots: {
      customRender: 'cover'
    },
    width: '120px'
  },
  {
    title: '商品分类',
    dataIndex: 'category.name',
    scopedSlots: {
      customRender: 'category'
    }
  },
  {
    title: '商品价格',
    scopedSlots: {
      customRender: 'price'
    },
    align: 'center',
    width: '120px'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: {
      customRender: 'status'
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
    fixed: 'right',
    width: '200px',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  components: {
    STable,
    ImagePreview
  },
  data () {
    this.columns = columns
    return {
      canEdit: false,
      categoryList: [], // 分类列表
      advanced: false, // 高级搜索 展开/关闭
      // 查询条件参数
      search: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
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
        return this.getList(params).then((res) => {
          console.log('表格获取数据', this.data)
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
  created () {
    const params = {
      offset: 0,
      limit: 9999
    }
    getProductCategoryPage(params).then((res) => {
      this.categoryList = res['list']
    })
  },
  methods: {
    getList (params) {
      return new Promise((resolve) => {
        getProductPage(params)
          .then((res) => {
            console.log(res)
            const pagination = {
              ...this.pagination
            }
            pagination.total = res['total']
            this.data = res['list']
            // this.data.forEach(item => {
            //   let skus = item.productSkus
            //   if (skus && skus.length > 0) {
            //     let sortBy = function(a, b) {
            //       var val1 = a.price
            //       var val2 = b.price
            //       if (val1 < val2) {
            //         return -1
            //       } else if (val1 > val2) {
            //         return 1
            //       } else {
            //         return 0
            //       }
            //     }
            //     let sorted_skus = skus.sort(sortBy)
            //     item.lowPrice = sorted_skus[0].price
            //     item.highPrice = sorted_skus[sorted_skus.length - 1].price
            //   }
            // })
            pagination.current = parseInt(params.offset / params.limit + '') + 1
            this.pagination = pagination
            resolve(this.data)
          })
          .catch((err) => {
            this.data = []
            this.$message.error('' + err)
          })
      })
    },
    gotoDetail (record) {
      storage.set('productDetail', record)
      this.$router.push({
        name: 'productDetail',
        query: {
          id: record.id
        }
      })
    },
    gotoEdit (record) {
      storage.set('productDetail', record)
      this.$router.push({
        name: 'productEdit',
        query: {
          id: record.id
        }
      })
    },
    // 添加商品
    addProduct () {
      this.$router.push({
        name: 'addProduct'
      })
    },
    // 删除商品
    removeProduct (record) {
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定要删除商品(' + record.name + ')?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          deleteProduct({ id: record.id })
            .then((res) => {
              _this.$refs.table.refresh()
              _this.$message.success('删除成功')
            })
            .catch((err) => {
              console.log(err)
              _this.$refs.table.refresh()
              _this.$message.error('删除失败')
            })
        }
      })
    },
    // 商品上架
    upProduct (record) {
      upProduct({ id: record.id })
        .then((res) => {
          this.$message.success('上架成功')
          this.$refs.table.refresh()
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('上架失败')
          this.$refs.table.refresh()
        })
    },
    // 商品下架
    downProduct (record) {
      downProduct({ id: record.id })
        .then((res) => {
          this.$message.success('下架成功')
          this.$refs.table.refresh()
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('下架失败')
          this.$refs.table.refresh()
        })
    },
    // 查询
    query () {
      this.$refs.table.refresh(true)
    },
    // 重置
    reset () {
      this.search = {}
      this.$refs.table.refresh(true)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
