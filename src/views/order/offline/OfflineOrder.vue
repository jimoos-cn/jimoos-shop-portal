<!-- 用户提现审核 -->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-input-group compact>
                <a-select style="width: 40%" v-model="input.key" @change="changeInput">
                  <a-select-option :value="0">
                    订单Id
                  </a-select-option>
                </a-select>
                <a-input v-model="input.value" :allowClear="true" style="width: 60%" placeholder="请输入" @change="changeInput" />
              </a-input-group>
            </a-col>
            <!-- 查询，重置 -->
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" icon="search" @click="query">查询</a-button>
                <a-button style="margin-left: 8px" icon="redo" @click="redo">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-tabs :default-active-key="0" @change="tabkeyChange">
        <a-tab-pane :key="0" tab="待审核"> </a-tab-pane>
        <a-tab-pane :key="1" tab="已通过"> </a-tab-pane>
        <a-tab-pane :key="2" tab="未通过"> </a-tab-pane>
      </a-tabs>
      <a-table :columns="col" :data-source="dataList" :pagination="paginationProps" :loading="loading">
        <template slot="userId" slot-scope="text">
          <a @click="gotoUserDetail(text)">{{ text }}</a>
        </template>
        <template slot="money" slot-scope="text">
          <span style="color: red">￥{{ text }}</span>
        </template>
        <template slot="status" slot-scope="text">
          <a-badge v-if="text === 0" status="processing" text="待审核" />
          <a-badge v-else-if="text === 1" status="success" text="已通过" />
          <a-badge v-else status="default" text="未通过" />
        </template>
        <template slot="picture" slot-scope="record">
          <PreviewImg :img="record.picture" :small-height="40" :big-height="400" :proportion="1" v-if="record.picture" />
        </template>
        <template slot="createAt" slot-scope="text">
          {{ $dateFormat(text) }}
        </template>
        <template slot="updateAt" slot-scope="text">
          {{ $dateFormat(text) }}
        </template>
        <template slot="action" slot-scope="record">
          <a style="padding-right: 10px" @click="openDetail(record)">详情</a>
          <a-popconfirm v-if="record.status === 0 || record.status === -1" @confirm="confirmModal(record)" :title="'确认用户线下支付审核通过'">
            <a style="padding-right: 10px">通过</a>
          </a-popconfirm>
          <a v-if="record.status === 0" style="color: red" @click="notPass(record)">拒绝</a>
        </template>
      </a-table>
    </a-card>
    <a-drawer width="30%" :visible="checkVisible" v-if="payDetail" title="支付详情" @close="checkVisible = false">
      <a-row>
        <a-row type="flex">
          <a-col>提交者:</a-col>
          <a-col
            style="margin-left: 10px;width: 70%"
          ><a @click="gotoUserDetail(payDetail.userId)">{{ payDetail.nickname }}</a></a-col
          >
        </a-row>
        <a-row style="margin-top: 10px" type="flex">
          <a-col>凭证状态:</a-col>
          <a-col style="width: 70%;margin-left: 10px">
            <a-badge v-if="payDetail.voucher.status === 0" status="processing" text="待审核" />
            <a-badge v-else-if="payDetail.voucher.status === 1" status="success" text="已通过" />
            <a-badge v-else status="default" text="未通过" />
          </a-col>
        </a-row>
        <a-row style="margin-top: 10px" type="flex">
          <a-col>订单号:</a-col>
          <a-col style="margin-left: 10px;width: 70%">
            <a>{{ payDetail.orderNum }}</a>
          </a-col>
        </a-row>
        <a-row style="margin-top: 10px" type="flex">
          <a-col>应付金额:</a-col>
          <a-col style="margin-left: 10px;width: 70%">
            <span style="color: red">￥{{ payDetail.realPay }}</span>
          </a-col>
        </a-row>
        <a-row style="margin-top: 10px" type="flex">
          <a-col>支付标题:</a-col>
          <a-col style="margin-left: 10px;width: 70%">
            <span>{{ payDetail.subject }}</span>
          </a-col>
        </a-row>
      </a-row>
      <div class="layer11 flex-col"></div>
      <a-descriptions style="margin-top: 14px" layout="vertical">
        <a-descriptions-item label="凭证内容" :span="3">
          {{ payDetail.voucher.content }}
          <div style="display: flex;margin-left: -5px;margin-top: 5px">
            <PreviewImg :img="payDetail.voucher.picture" :small-height="40" :big-height="400" :proportion="1" v-if="payDetail.voucher.picture" />
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions style="margin-top: 14px">
        <a-descriptions-item label="凭证创建时间" :span="3">
          {{ $dateFormat(payDetail.voucher.createAt) }}
        </a-descriptions-item>
      </a-descriptions>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="checkVisible = false">
          取消
        </a-button>
        <a-button v-if="payDetail.voucher.status !== 1" :style="{ marginRight: '8px' }" type="primary" @click="confirmModal(payDetail.voucher)">
          通过
        </a-button>
        <a-button v-if="payDetail.voucher.status === 0" type="danger" @click="notPass(payDetail.voucher)">
          拒绝
        </a-button>
      </div>
    </a-drawer>
    <a-modal :visible="visible" title="确认用户不通过" @cancel="cancel" @ok="confirmNotPass">
      <a-textarea v-model="reason" placeholder="请输入原因" allow-clear style="padding-right: 50px;padding-left: 50px;" :rows="5"> </a-textarea>
    </a-modal>
  </page-header-wrapper>
</template>
<script>
  import { WITHDRAW_COLUMNS } from './index'
  import { getOfflineOne, getOfflinePage, offlineFail, offlinePass } from '@/api/order/offline'
  import PreviewImg from '@/components/Image/PreviewImg2'
  export default {
    data () {
      return {
        input: {
          key: 0,
          value: ''
        },
        col: WITHDRAW_COLUMNS,
        search: {},
        dataList: [],
        checkVisible: false,
        total: 0,
        loading: false,
        visible: false,
        payDetail: null,
        chooseRow: {},
        reason: '',
        tableKey: 0
      }
    },
    components: {
      PreviewImg
    },
    computed: {
      paginationProps () {
        const that = this
        return {
          showQuickJumper: true,
          showSizeChanger: true,
          total: that.total,
          pageSize: that.search.limit,
          current: that.search.offset / that.search.limit + 1,
          onChange (page, pageSize) {
            const param = {
              offset: pageSize * (page - 1)
            }
            that.query(param)
          },
          onShowSizeChange (page, pageSize) {
            const param = {
              offset: 0,
              limit: pageSize
            }
            that.query(param)
          }
        }
      }
    },
    created () {
      const userId = this.$route.query.userId
      if (this.$available(userId)) {
        this.search.userId = userId
        this.input.value = userId
      }
      this.init()
    },
    methods: {
      init () {
        const param = {
          offset: 0,
          limit: 10,
          status: 0
        }
        this.query(param)
      },
      confirmModal (record) {
        const that = this
        this.$confirm({
          title: '确认通过操作',
          content: '本操作不可逆',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            console.log('点击确认')
            that.pass(record)
          }
        })
      },
      tabkeyChange (key) {
        this.tableKey = key
        switch (this.tableKey) {
          case 0:
            this.search.status = 0
            break
          case 1:
            this.search.status = 1
            break
          case 2:
            this.search.status = -1
            break
        }
        this.query({
          offset: 0,
          limit: 10
        })
      },
      openDetail (record) {
        getOfflineOne({ id: record.id }).then(res => {
          this.payDetail = res
        })
        this.checkVisible = true
      },
      pass (record) {
        offlinePass({ id: record.id }).then(res => {
          this.$message.success('操作成功')
          this.query()
          if (this.checkVisible) {
            this.openDetail(record)
          }
        })
      },
      notPass (record) {
        this.chooseRow = record
        this.reason = ''
        this.visible = true
      },
      confirmNotPass () {
        offlineFail({ id: this.chooseRow.id }).then(res => {
          this.$message.success('操作成功')
          this.query()
          if (this.checkVisible) {
            this.openDetail(this.chooseRow)
          }
        })
      },
      changeInput () {
        this.search.userId = ''
        const value = this.input.value
        const key = this.input.key
        switch (key) {
          case 0:
            this.search.userId = value
            break
        }
      },
      query (option) {
        this.loading = true
        console.log(option)
        this.search = { ...this.search, ...option }
        getOfflinePage(this.search).then(res => {
            this.dataList = res.list
            this.total = res.total
            this.loading = false
        })
        switch (this.search.status) {
          case 0:
            const column1 = [
              {
                title: '操作',
                scopedSlots: {
                  customRender: 'action'
                },
                align: 'center'
              }
            ]
            this.col = [...WITHDRAW_COLUMNS, ...column1]
            break
          case 1:
            const column2 = [
              {
                title: '通过时间',
                key: 'updateAt',
                dataIndex: 'updateAt',
                scopedSlots: {
                  customRender: 'updateAt'
                },
                align: 'center'
              },
              {
                title: '操作',
                scopedSlots: {
                  customRender: 'action'
                },
                align: 'center'
              }
            ]
            this.col = [...WITHDRAW_COLUMNS, ...column2]
            break
          case -1:
            const column3 = [
              {
                title: '不通过时间',
                dataIndex: 'updateAt',
                scopedSlots: {
                  customRender: 'updateAt'
                },
                align: 'center'
              },
              {
                title: '原因',
                dataIndex: 'reason',
                scopedSlots: {
                  customRender: 'reason'
                },
                align: 'center'
              },
              {
                title: '操作',
                scopedSlots: {
                  customRender: 'action'
                },
                align: 'center'
              }
            ]
            this.col = [...WITHDRAW_COLUMNS, ...column3]
            break
        }
      },
      gotoUserDetail (id) {
        this.$router.push({
          name: 'user-managementListWrapper-details',
          query: {
            id: id
          }
        })
      },
      cancel () {
        this.visible = false
      },
      redo () {
        this.input.value = ''
        this.input.key = 0
        this.search.userId = ''
        this.search.limit = 10
        this.search.offset = 0
        this.query()
      }
    }
  }
</script>
<style scoped>
  .score {
    width: 25px;
    height: 22px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
  .content {
    font-size: 14px;
    margin-top: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    display: flex;
    justify-content: center;
    font-weight: 400;
    color: #1890ff;
    line-height: 22px;
  }
  .contentText {
    overflow: hidden;
    width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .layer11 {
    z-index: 606;
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
    align-self: center;
    margin-top: 14px;
  }
</style>
