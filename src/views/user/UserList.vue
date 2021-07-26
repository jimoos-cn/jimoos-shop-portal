<!-- 用户列表页面 -->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户昵称">
                <a-input v-model="search.nickname" placeholder="请输入用户昵称" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="用户状态">
                <a-select v-model="search.ban" placeholder="请选择用户状态">
                  <a-select-option :value="false">未禁止</a-select-option>
                  <a-select-option :value="true">已禁止</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="手机号">
                  <a-input v-model="search.phone" placeholder="请输入手机号">
                  </a-input>
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
        <div slot="id" slot-scope="record">
          <a @click="gotoUserDetails(record)">{{ record.id }}</a>
        </div>
        <div slot="avatar" slot-scope="text">
          <image-preview :img="text" :smallWidth="48" :bigWidth="400" :proportion="1" v-if="text"></image-preview>
        </div>
        <div slot="ban" slot-scope="text">
          <a-badge status="success" v-if="!text" text="未Ban"></a-badge>
          <a-badge status="error" v-else text="已Ban"></a-badge>
        </div>
        <div slot="createAt" slot-scope="record">
          {{ $dateFormat(record) }}
        </div>
        <span slot="action" slot-scope="text, record">
          <a @click="gotoUserDetails(record)">详情</a>
          <a-popconfirm v-if="!record.ban" title="确认Ban用户" @confirm="banUser(record)">
            <a style="margin-left: 10px">Ban</a>
          </a-popconfirm>
          <a-popconfirm v-if="record.ban" title="确认取消Ban" @confirm="cancelBanUser(record)">
            <a v-if="record.ban" style="margin-left: 10px">取消Ban</a>
          </a-popconfirm>
          <a-popconfirm title="确认重置密码" @confirm="resetPwd(record)">
            <a style="color: red; margin-left: 10px">重置</a>
          </a-popconfirm>
          <a-popconfirm title="确认删除用户" @confirm="deleteUser(record)">
            <a style="color: red; margin-left: 10px">删除</a>
          </a-popconfirm>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import ImagePreview from '@/components/Image/ImagePreview'
  import { STable } from '@/components'
  import { banUser, cancelBanUser, getUserInfo, deleteUser, resetUserPwd } from '@/api/user'
  const columns = [
    {
      title: '用户Id',
      scopedSlots: {
        customRender: 'id'
      },
      width: '100px'
    },
    {
      title: '昵称',
      dataIndex: 'nickname'
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      scopedSlots: {
        customRender: 'avatar'
      },
      width: '120px'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      scopedSlots: {
        customRender: 'phone'
      },
      width: '120px'
    },
    {
      title: '状态',
      dataIndex: 'ban',
      scopedSlots: {
        customRender: 'ban'
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
          return this.getUserInfo(params).then((res) => {
            console.log('表格获取数据', this.data)
            dataTable = {
              pageSize: requestParameters.pageSize,
              pageNo: requestParameters.pageNo,
              totalCount: this.pagination.total,
              totalPage: this.pagination.pageTotal,
              data: res
            }
            return dataTable
          })
        }
      }
    },
    methods: {
      // 跳转至用户详细页面
      gotoUserDetails (record) {
        this.$router.push({
          name: 'userDetail',
          query: {
            id: record.id
          }
        })
      },
      banUser (record) {
        banUser({ id: record.id })
          .then((res) => {
            this.$message.success('禁止用户成功')
            this.$refs.table.refresh()
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('禁止用户失败')
            this.$refs.table.refresh()
          })
      },
      cancelBanUser (record) {
        cancelBanUser({ id: record.id })
          .then((res) => {
            this.$message.success('取消禁止用户成功')
            this.$refs.table.refresh()
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('取消禁止用户失败')
          })
      },
      deleteUser (record) {
        deleteUser({ id: record.id })
          .then((res) => {
            this.$message.success('删除用户成功')
            this.$refs.table.refresh()
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('删除用户失败')
          })
      },
      getUserInfo (params) {
        return new Promise((resolve) => {
          getUserInfo(params)
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
              this.$message.error('' + err)
            })
        })
        //
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
      },
      // 重置密码
      resetPwd (record) {
        resetUserPwd({ userId: record.id })
        .then(res => {
          // 直接构建input
          const _input = document.createElement('input')
          // 设置内容
          _input.value = res
          // 添加临时实例
          document.body.appendChild(_input)
          // 选择实例内容
          _input.select()
          // 执行复制
          document.execCommand('Copy')
          document.body.removeChild(_input)
          this.$message.success('密码重置成功，新密码为:' + res + ',已自动复制')
        })
        .catch(err => {
          this.$message.error(err)
        })
      }
    }
  }
</script>
