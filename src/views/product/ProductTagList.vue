<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="标签名">
                <a-input v-model="search.name" placeholder="请输入标签名" />
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
        <a-button type="primary" icon="plus" @click="createTag">添加标签</a-button>
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
          {{ text | dateFormat }}
        </div>
        <div slot="color" slot-scope="text">
          <div style="display: flex; justify-content: center">
            <span :style="{ backgroundColor: text }" style="width: 20px; height: 20px; border-radius: 50%"></span>
          </div>
        </div>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <a-space>
            <a @click="editTag(record)">编辑</a>
            <a-popconfirm title="删除该标签？" ok-text="是" cancel-text="取消" @confirm="deleteTag(record)">
              <a style="color: red">删除</a>
            </a-popconfirm>
          </a-space>
        </span>
      </s-table>
    </a-card>
    <!--新增对话框-->
    <a-modal :forceRender="true" v-model="createVisible" title="添加标签" on-ok="handleCreateOk">
      <a-form style="width: 100%">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标签颜色">
          <colorPicker v-model="color" />
          <div class="ant-form-explain">(点击颜色进行修改)</div>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="createVisible = false">取消</a-button>
        <a-button key="submit" type="primary" @click="handleCreateOk">提交</a-button>
      </template>
      <k-form-build ref="tagCreateTable" :value="createTable" />
    </a-modal>
    <!--编辑对话框-->
    <a-modal :forceRender="true" v-model="updateVisible" title="编辑标签" on-ok="handleUpdateOk">
      <a-form style="width: 100%">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标签颜色">
          <colorPicker v-model="color" />
          <div class="ant-form-explain">(点击颜色进行修改)</div>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="updateVisible = false">取消</a-button>
        <a-button key="submit" type="primary" :loading="updateLoad" @click="handleUpdateOk">提交</a-button>
      </template>
      <k-form-build ref="tagUpdateTable" :value="updateTable" />
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { createProductTag, updateProductTag, deleteProductTag, getProductTagPage } from '@/api/product/tag'
import tagCreateForm from '@/views/product/k-form/product-tag-create-form'

const columns = [
  {
    title: '标签编号',
    dataIndex: 'id',
    width: '80px'
  },
  {
    title: '标签名称',
    dataIndex: 'name',
    width: '80px'
  },
  {
    title: '主题颜色',
    dataIndex: 'color',
    scopedSlots: {
      customRender: 'color'
    },
    align: 'center',
    width: '80px'
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    width: '100px',
    scopedSlots: {
      customRender: 'createAt'
    }
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: '150px',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'ProductTagList',
  components: {
    STable
  },
  data () {
    this.columns = columns
    return {
      canEdit: false,
      color: '#4091f7', // 标签颜色
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      advanced: false, // 高级搜索 展开/关闭
      search: {}, // 查询参数
      createVisible: false, // 新增对话框可见
      createLoad: false, // 新增按钮加载
      createTable: tagCreateForm, // 新增表单
      updateVisible: false, // 新增对话框可见
      updateLoad: false, // 新增按钮加载
      updateTable: tagCreateForm, // 新增表单
      tagId: 0,
      pagination: {
        // 分页对象
        showSizeChanger: true, // 分页改变
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
    deleteTag (record) {
      const that = this
      deleteProductTag({ id: record.id })
        .then((res) => {
          that.$refs.table.refresh()
          that.$message.success('删除成功')
        })
        .catch((err) => {
          console.log(err)
          that.$message.error('删除失败')
        })
    },
    createTag () {
      this.createVisible = true
      this.$refs.tagCreateTable.reset()
    },
    // 提交新增
    handleCreateOk () {
      this.$refs.tagCreateTable.getData().then((values) => {
        this.createLoad = true
        const params = {
          name: values.name,
          color: this.color,
          type: 0
        }
        createProductTag(params)
          .then((res) => {
            this.$message.success('新增成功')
            this.createLoad = false
            this.createVisible = false
            this.$refs.table.refresh()
          })
          .catch((err) => {
            console.log('create tag err:' + err)
            this.$message.error('新增失败')
            this.createLoad = false
            this.createVisible = false
            this.$refs.table.refresh()
          })
      })
    },
    editTag (record) {
      console.log(record)
      this.updateVisible = true
      this.color = record.color
      this.tagId = record.id
      const dataIn = {}
      dataIn.name = record.name
      this.$refs.tagUpdateTable.setData(dataIn)
    },
    handleUpdateOk () {
      this.updateLoad = true
      this.$refs.tagUpdateTable.getData().then((values) => {
        const params = {
          name: values.name,
          color: this.color,
          id: this.tagId
        }
        updateProductTag(params)
          .then((res) => {
            this.$message.success('修改成功')
            this.$refs.table.refresh()
            this.updateVisible = false
            this.updateLoad = false
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('修改失败')
            this.$refs.table.refresh()
            this.updateVisible = false
            this.updateLoad = false
          })
      })
    },
    // 获取数据
    getList (params) {
      return new Promise((resolve) => {
        getProductTagPage(params)
          .then((res) => {
            this.loading = false
            const pagination = {
              ...this.pagination
            }
            pagination.total = res['total']
            this.data = res['list']
            pagination.current = parseInt(params.offset / params.limit + '') + 1
            this.pagination = pagination
            this.loading = false
            resolve(this.data)
          })
          .catch((err) => {
            this.loading = false
            this.data = []
            console.log('', err)
          })
      })
    },
    // 重置
    redo () {
      this.search = {}
      this.$refs.table.refresh(true)
    }
  }
}
</script>
