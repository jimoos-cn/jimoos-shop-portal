<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="商品分类">
                <a-input v-model="search.name" placeholder="请输入分类名" />
              </a-form-item>
            </a-col>
            <!-- 查询，重置 -->
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" icon="redo" @click="redo">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="createCategory">添加分类</a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <div slot="createAt" slot-scope="text">
          {{ $dateFormat(text) }}
        </div>
        <div slot="updateAt" slot-scope="text">
          {{ $dateFormat(text) }}
        </div>
        <div slot="imgUrl" slot-scope="text">
          <image-preview
            :circle="true"
            :img="text"
            :smallWidth="48"
            :bigWidth="400"
            :proportion="1"
            v-if="text"></image-preview>
        </div>
        <span slot="action" slot-scope="text, record">
          <a-space>
            <a @click="editCategory(record)">编辑</a>
            <a @click="createSonCategory(record)" v-if="record.pid === 0">添加子分类</a>
            <a-popconfirm title="删除该分类？" ok-text="是" cancel-text="取消" @confirm="deleteCategory(record)">
              <a style="color: red">删除</a>
            </a-popconfirm>
          </a-space>
        </span>
      </s-table>
    </a-card>
    <!--新增对话框-->
    <a-modal :forceRender="true" v-model="createVisible" :title="addTitle" on-ok="handleCreateOk">
      <template slot="footer">
        <a-button key="back" @click="createVisible = false">取消</a-button>
        <a-button key="submit" type="primary" :loading="createLoad" @click="handleCreateOk">提交</a-button>
      </template>
      <k-form-build ref="CategoryCreateTable" :value="createTable" />
      <a-form-item label="图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <ListUploadWrapper
          hint="上传图片"
          :circle="true"
          :width="120"
          :height="120"
          @input="updateImgUrl"
          :uploadType="0"
          :length="1"
          :urls="imgUrl"> </ListUploadWrapper>
      </a-form-item>
    </a-modal>
    <!--编辑对话框-->
    <a-modal :forceRender="true" v-model="updateVisible" title="编辑分类" on-ok="handleUpdateOk">
      <template slot="footer">
        <a-button key="back" @click="updateVisible = false">取消</a-button>
        <a-button key="submit" type="primary" :loading="updateLoad" @click="handleUpdateOk">提交</a-button>
      </template>
      <k-form-build ref="CategoryUpdateTable" :value="updateTable" />
      <a-form-item label="图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <ListUploadWrapper
          :width="120"
          hint="上传图片"
          :circle="true"
          :height="120"
          @input="updateImgUrl2"
          :uploadType="0"
          :length="1"
          :urls="editUrl"> </ListUploadWrapper>
      </a-form-item>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import {
  getProductCategoryPage,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
} from '@/api/product/category'
import ListUploadWrapper from '@/components/Upload/ListUploadWrapper'
import ImagePreview from '@/components/Image/ImagePreview'
import categoryCreateForm from '@/views/product/k-form/product-category-create-form'

const columns = [
  {
    title: '分类名称',
    dataIndex: 'name'
  },
  {
    title: '分类图标',
    dataIndex: 'imgUrl',
    scopedSlots: {
      customRender: 'imgUrl'
    }
  },
  {
    title: '分类描述',
    dataIndex: 'description'
  },
  {
    title: '排序',
    dataIndex: 'sort'
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    scopedSlots: {
      customRender: 'createAt'
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updateAt',
    scopedSlots: {
      customRender: 'updateAt'
    }
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'ProductCategoryList',
  components: {
    STable,
    ListUploadWrapper,
    ImagePreview
  },
  data () {
    this.columns = columns
    return {
      addTitle: '添加分类',
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 13 }, sm: { span: 17 } },
      canEdit: false,
      imgUrl: '', // 图标
      editUrl: '',
      data: [], // 表格数据
      loading: false, // 表格加载
      advanced: false, // 高级搜索 展开/关闭
      search: {}, // 查询参数
      createVisible: false, // 新增对话框可见
      createLoad: false, // 新增按钮加载
      createTable: categoryCreateForm, // 新增表单
      updateVisible: false, // 新增对话框可见
      updateLoad: false, // 新增按钮加载
      updateTable: categoryCreateForm, // 新增表单
      categoryId: 0, // 分类Id
      pid: 0, // 父Id
      pagination: {
        // 分页对象
        showSizeChanger: false, // 分页改变
        pageSizeOptions: ['10', '15', '20', '25'], // 每页数据量选择
        pageSize: 10, // 当前数据量
        current: 1 // 当前页
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
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
    deleteCategory (record) {
      const that = this
      deleteProductCategory({ id: record.id })
        .then(() => {
          that.$refs.table.refresh()
          that.$message.success('删除成功')
        })
        .catch((err) => {
          that.$refs.table.refresh()
          that.$message.success('删除失败')
          console.log(err)
        })
    },
    createCategory () {
      this.createVisible = true
      this.pid = 0
      this.addTitle = '添加分类'
      this.$refs.CategoryCreateTable.reset()
    },
    // 添加子分类
    createSonCategory (record) {
      this.createVisible = true
      this.pid = record.id
      this.addTitle = '添加[' + record.name + ']子分类'
      this.$refs.CategoryCreateTable.reset()
    },
    // 提交新增
    handleCreateOk () {
      this.$refs.CategoryCreateTable.getData()
        .then((values) => {
          this.createLoad = true
          console.log(values)
          const params = {
            name: values.name,
            description: values.description,
            sort: values.sort,
            pid: this.pid,
            imgUrl: this.imgUrl
          }
          this.imgUrl = ''
          this.editUrl = ''
          createProductCategory(params)
            .then((res) => {
              this.$message.success('新增成功')
              this.createLoad = false
              this.createVisible = false
              this.$refs.table.refresh()
            })
            .catch((err) => {
              console.log('新增分类 err:' + err)
              this.$message.error('新增失败')
              this.createLoad = false
              this.createVisible = false
              this.$refs.table.refresh()
            })
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('参数缺失')
        })
    },
    editCategory (record) {
      this.updateVisible = true
      this.categoryId = record.id
      const dataIn = {}
      dataIn.name = record.name
      dataIn.description = record.description
      dataIn.sort = record.sort
      this.$refs.CategoryUpdateTable.setData(dataIn)
    },
    handleUpdateOk () {
      this.updateLoad = true
      this.$refs.CategoryUpdateTable.getData().then((values) => {
        const params = {
          name: values.name,
          description: values.description,
          sort: values.sort,
          id: this.categoryId,
          imgUrl: this.editUrl
        }
        this.imgUrl = ''
        this.editUrl = ''
        updateProductCategory(params)
          .then(() => {
            this.$message.success('修改成功')
            this.$refs.table.refresh()
            this.updateVisible = false
            this.updateLoad = false
          })
          .catch((err) => {
            this.$message.error('修改失败[' + err.response.data.message + ']')
            this.updateLoad = false
            this.$refs.table.refresh()
            this.updateVisible = false
          })
      })
    },
    // 获取数据
    getList (params) {
      return new Promise((resolve) => {
        getProductCategoryPage(params)
          .then((res) => {
            this.loading = false
            const pagination = {
              ...this.pagination
            }
            pagination.total = res['total']
            this.data = res['list']
            this.getTreeData()
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
    // 数据处理
    getTreeData () {
      const treeData = []
      this.data
        .filter((item) => item.pid === 0)
        .map((item) => {
          if (this.data.filter((tem) => tem.pid === item.id).length > 0) {
            item.children = this.data.filter((tem) => tem.pid === item.id)
          }
          treeData.push(item)
        })
      this.data = treeData
    },
    updateImgUrl (url) {
      this.imgUrl = url
    },
    updateImgUrl2 (url) {
      this.editUrl = url
    },
    cancel () {
      this.imgUrl = ''
      this.editUrl = ''
    },
    // 重置
    redo () {
      this.search = {}
      this.$refs.table.refresh(true)
    }
  }
}
</script>
