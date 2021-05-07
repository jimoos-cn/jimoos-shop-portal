<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="账号">
                <a-input v-model="search.name" placeholder="请输入账号" />
              </a-form-item>
            </a-col>
            <!-- 查询，重置 -->
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" icon="redo" @click="redo">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 新建 -->
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="createAdmin" v-if="adminEdit">添加管理员</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        :pagination="pagination">
        <!--时间-->
        <div slot="createAt" slot-scope="createAt">
          {{ $dateFormat(createAt) }}
        </div>
        <!-- 管理员状态 -->
        <div slot="ban" slot-scope="ban, record">
          <a-switch
            :checked="ban === 1"
            @click="handleBanChange(ban, record)"
            checkedChildren="封禁"
            unCheckedChildren="正常"
            :disabled="record.id === $store.state.user.info.id || record.id === 1"
          />
        </div>

        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <a @click="changePassword(record)" style="margin-left: 8px">修改密码</a>
          <a
            v-if="record.id !== $store.state.user.info.id && record.id !== 1"
            style="color: red;margin-left: 8px"
            @click="deleteUser(record)">删除</a>
        </span>
      </s-table>
    </a-card>
    <!--新增对话框-->
    <a-modal
      :forceRender="true"
      v-model="createVisible"
      title="添加管理员"
      on-ok="handleCreateOk"
      :keyboard="true"
      :confirmLoading="createLoad">
      <template slot="footer">
        <a-button key="back" @click="createVisible = false">取消</a-button>
        <a-button key="submit" type="primary" @click="handleCreateOk">提交</a-button>
      </template>
      <k-form-build ref="adminCreateTable" :value="createTable" />
    </a-modal>

    <!--新增对话框-->
    <a-modal
      :forceRender="true"
      v-model="resetVisible"
      title="修改密码"
      on-ok="handleCreateOk"
      :keyboard="true"
      :confirmLoading="resetLoad">
      <template slot="footer">
        <a-button key="back" @click="resetVisible = false">取消</a-button>
        <a-button key="submit" type="primary" @click="handleResetOk">提交</a-button>
      </template>
      <k-form-build ref="PwdChangeTable" :value="resetTable" />
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { deleteAdmin, getAdminPage, createAdmin, adminBanChange, resetPassword } from '@/api/admin/index'
import adminCreateForm from '@/views/admin/k-form/admin-create-form'
import adminResetForm from '@/views/admin/k-form/admin-reset-form'

const columns = [
  {
    title: '管理员编号',
    dataIndex: 'id',
    width: '150px',
    align: 'center'
  },
  {
    title: '管理员账号',
    dataIndex: 'username',
    align: 'center',
    width: '190px'
  },
  {
    title: '管理员状态',
    dataIndex: 'ban',
    align: 'center',
    scopedSlots: {
      customRender: 'ban'
    },
    width: '150px'
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    align: 'center',
    width: '190px',
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
  name: 'TableList',
  components: {
    STable
  },
  data () {
    this.columns = columns
    return {
      adminEdit: true,

      resetVisible: false, // 重置密码对话框可见
      resetLoad: false, // 重置按钮加载
      adminId: 0,
      resetTable: adminResetForm, // 重置表单

      // 配置角色
      openRoleModel: false,
      default_roleId: 0,
      confirmLoadingRole: false,
      admin_role: [], // 角色列表
      theRole: undefined,

      createVisible: false, // 新增对话框可见
      createLoad: false, // 新增按钮加载
      createTable: adminCreateForm, // 新增表单
      // 查询参数
      search: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let params = {
          offset: (parameter.pageNo - 1) * parameter.pageSize,
          limit: parameter.pageSize
        }
        params = Object.assign({}, params, this.search)
        console.log('loadData request parameters:', params)
        return this.getList(params).then(res => {
          console.log('表格获取数据', res)
          return {
            pageNo: parameter.pageNo,
            totalCount: this.pagination.total,
            pageSize: this.pagination.pageSize,
            data: res
          }
        })
      },
      pagination: {
        showTotal: total => `共<b>${total}</b>条数据`
      }
    }
  },
  methods: {
    // 管理员封禁
    handleBanChange (ban, record) {
      const params = {
        adminId: record.id,
        ban: ban === 1 ? 0 : 1
      }
      adminBanChange(params)
        .then(() => {
          if (ban === 0) {
            this.$message.success('封禁成功!')
          } else {
            this.$message.success('解禁成功!')
          }
          this.$refs.table.refresh()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('失败')
        })
    },
    // 删除管理员
    deleteUser (record) {
      const _this = this
      this.$confirm({
        title: '删除',
        content: `确定要删除( ${record.username} )吗?`,
        okText: '确定删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          const data = {
            toDeleteAdminId: record.id
          }
          deleteAdmin(data)
            .then(() => {
              _this.$refs.table.refresh()
              _this.$message.success('删除成功')
            })
            .catch(() => {
              _this.$message.success('删除失败')
            })
        },
        onCancel () {
          _this.$message.info('取消删除')
        }
      })
    },
    // 获取数据
    getList (params) {
      return new Promise(resolve => {
        getAdminPage(params)
          .then(res => {
            this.pagination = {
              ...this.pagination,
              total: res['total'],
              current: parseInt(params.offset / params.limit + '') + 1
            }
            resolve(res['list'])
          })
          .catch(err => {
            console.log('', err)
          })
      })
    },
    changePassword (record) {
      this.adminId = record.id
      this.resetVisible = true
      this.$refs.PwdChangeTable.reset()
    },
    // 提交新增
    handleResetOk () {
      this.$refs.PwdChangeTable.getData().then(values => {
        if (values.pwd !== values.pwdRepeat) {
          this.$message.error('密码不匹配')
          return
        }
        this.resetLoad = true
        console.log(values)
        values.id = this.adminId
        resetPassword(values)
          .then(() => {
            this.$message.success('修改成功!')
            this.resetLoad = false
            this.resetVisible = false
            this.$refs.PwdChangeTable.reset()
            this.$refs.table.refresh(true)
          })
          .catch(() => {
            this.$message.error('修改失败!')
            this.resetLoad = false
          })
      })
    },
    // 新增管理员
    createAdmin () {
      this.createVisible = true
      this.$refs.adminCreateTable.reset()
    },
    // 提交新增
    handleCreateOk () {
      this.$refs.adminCreateTable.getData().then(values => {
        if (values.pwd !== values.pwdRepeat) {
          this.$message.error('密码不匹配')
          return
        }
        this.createLoad = true
        createAdmin(values)
          .then(() => {
            this.$message.success('添加成功!')
            this.createLoad = false
            this.createVisible = false
            this.$refs.adminCreateTable.reset()
            this.$refs.table.refresh(true)
          })
          .catch(() => {
            this.$message.error('添加失败!')
            this.createLoad = false
          })
      })
    },
    // 查询重置
    redo () {
      this.search = {}
      this.$refs.table.refresh(true)
    }
  }
}
</script>
