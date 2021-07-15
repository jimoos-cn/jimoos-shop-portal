<!-- 用户详细页 -->
<template>
  <page-header-wrapper>
    <a-row :gutter="24">
      <a-col :md="8" :sm="24">
        <a-card :bordered="false">
          <a-row
            type="flex"
            justify="center"
            class="leftTop">
            <a-avatar :size="100" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            <div>
              <div class="nickName">用户昵称</div>
              <div class="role">用户角色</div>
            </div>
          </a-row>
          <a-row class="leftSecondTop" style="margin-top: 10px" :gutter="[24,24]">
            <a-col :md="8" :sm="24"><span>性别</span></a-col>
            <a-col :md="8" :sm="24"><span>生日</span></a-col>
            <a-col :md="8" :sm="24"><a>收货地址</a></a-col>
            <a-col :md="8" :sm="24"><a>社交登陆</a></a-col>
            <a-col :md="8" :sm="24"><a>分销关系</a></a-col>
          </a-row>
          <a-row class="leftThirdTop" style="margin-top: 20px" :gutter="[24,24]">
            <div>最近订单</div>
            <s-table
              style="margin-top: 20px"
              :columns="columns"
              :data="loadData"
              :customRow="rowClick">
              <div slot="createAt" slot-scope="record">
                {{ $dateFormat(record) }}
              </div>
            </s-table>
          </a-row>
        </a-card>
      </a-col>
      <a-col :md="16" :sm="24">
        <a-card :bordered="false" style="">
          <a-row
            class="statistics"
            :gutter="[16,16]">
            <a-col :md="8" :sm="24" class="module">
              <a-col :md="8" class="leftPic" style="background: #31C7CB;">
                <a-icon type="check-circle" style="font-size: 24px;color: #ffffff" />
              </a-col>
              <a-col :md="16" class="rightContent">
                <a-row>￥ 1234</a-row>
                <a-row>今日支付订单</a-row>
              </a-col>
            </a-col>
            <a-col :md="8" :sm="24" class="module">
              <a-col :md="8" class="leftPic" style="background-color: #FFB980">
                <a-icon type="star" style="font-size: 24px;color: #ffffff" />
              </a-col>
              <a-col :md="16" class="rightContent">
                <a-row>￥ 1234</a-row>
                <a-row>今日收藏订单</a-row>
              </a-col>
            </a-col>
            <a-col :md="8" :sm="24" class="module">
              <a-col :md="8" class="leftPic" style="background-color:#59B1EF ">
                <a-icon type="undo" style="font-size: 24px;color: #ffffff" />
              </a-col>
              <a-col :md="16" class="rightContent">
                <a-row>￥ 1234</a-row>
                <a-row>今日未支付订单</a-row>
              </a-col>
            </a-col>
            <a-col :md="8" :sm="24" class="module">
              <a-col :md="8" class="leftPic" style="background: #31C7CB;">
                <a-icon type="check-circle" style="font-size: 24px;color: #ffffff" />
              </a-col>
              <a-col :md="16" class="rightContent">
                <a-row>￥ 1234</a-row>
                <a-row>本月支付订单</a-row>
              </a-col>
            </a-col>
            <a-col :md="8" :sm="24" class="module">
              <a-col :md="8" class="leftPic" style="background-color: #FFB980">
                <a-icon type="star" style="font-size: 24px;color: #ffffff" />
              </a-col>
              <a-col :md="16" class="rightContent">
                <a-row>￥ 1234</a-row>
                <a-row>本月收藏订单</a-row>
              </a-col>
            </a-col>
            <a-col :md="8" :sm="24" class="module">
              <a-col :md="8" class="leftPic" style="background-color:#59B1EF ">
                <a-icon type="undo" style="font-size: 24px;color: #ffffff" />
              </a-col>
              <a-col :md="16" class="rightContent">
                <a-row>￥ 1234</a-row>
                <a-row>本月未支付订单</a-row>
              </a-col>
            </a-col>
          </a-row>
          <a-row style="padding-right: 100px;padding-left: 100px;margin-top: 20px">
            <template>
              <div style="margin-bottom: 16px;">
                <a-input addon-before="邀请码" default-value="无" />
              </div>
            </template>
            <template>
              <div style="margin-bottom: 16px;">
                <a-input addon-before="填写地址" default-value="无" />
              </div>
            </template>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'
  import { getUserRecentOrder } from '@/api/order'
  import { getUserDetail } from '@/api/user'
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNum',
      scopedSlots: {
        customRender: 'orderNum'
      }
    },
    {
      title: '订单标题',
      dataIndex: 'subject',
      scopedSlots: {
        customRender: 'subject'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      scopedSlots: {
        customRender: 'createAt'
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
        search: {}, // 查询数据
        rowClick: (record, index) => ({ // 表格点击
          on: {
            click: () => {
              // 行点击
              console.log('点击行数据', record)
              this.gotoOrderDetail(record)
            }
          }
        }),
        loadData: (param) => { // 加载数据
          const requestParam = Object.assign({}, param, this.search)
          console.log('loadData request parameters:', requestParam)
          const params = {
            offset: (requestParam.pageNo - 1) * requestParam.pageSize,
            limit: requestParam.pageSize,
            type: 0
          }
          Object.keys(this.search).forEach((key) => {
            if (this.search[key] !== undefined && this.search[key] != null && this.search[key] !== '') {
              params[key] = this.search[key]
            }
          })
          let dataTable = {}
          return this.getUserRecentOrder(params)
          .then((res) => {
            console.log('表格获取数据', res)
            dataTable = {
              pageSize: requestParam.pageSize,
              pageNo: requestParam.pageNo,
              totalCount: this.pagination.total,
              totalPage: this.pagination.pageTotal,
              data: res
            }
            return dataTable
          })
        }
      }
    },
    created () {
      this.search.userId = this.$route.query.id // 赋予用户ID
      this.init()
    },
    methods: {
      // 初始化调用
      init () {
        this.getUserDetail(this.search)
      },
      // 获取用户详细数据
      getUserDetail (params) {
        getUserDetail(params)
        .then((res) => {
          console.log(res)
        })
      },
      // 跳转至订单详细页面
      gotoOrderDetail (param) {
        this.$router.push({
          name: 'orderDetail',
          query: {
            id: param.id
          }
        })
      },
      // 获取最近订单数据
      getUserRecentOrder (params) {
        return new Promise((resolve) => {
          getUserRecentOrder(params)
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
      }
    }
  }
</script>

<style scoped>
   .nickName {
     font-size: 22px;
     font-weight: 700;
     color: #000000;
     display: flex;
     align-items: center;
     margin-left: 10px;
     margin-top: 30px;
  }
   .role {
     font-size: 14px;
     display: flex;
     align-items: center;
     margin-left: 10px;
   }
  .leftTop {
    border-bottom: 1px solid #c9c4c4;
    padding-bottom: 20px;
    padding-left: 10px;
    padding-right: 10px;
  }
   .leftSecondTop {
     border-bottom: 1px solid #c9c4c4;
     padding-left: 10px;
     padding-right: 10px;
   }
   .leftThirdTop {
     padding-left: 10px;
     padding-right: 10px;
   }
   .statistics{
     border-bottom: 1px solid #c6c6c6
   }
   .statistics .module{
     height: 85px;
   }
   .statistics .module .leftPic{
     height: 100%;
     display: flex;
     justify-content: center;
     align-items: center;
   }
   .statistics .module .rightContent{
     background: #F0F2F5;
     height: 100%;
     display: flex;
     flex-flow: column;
     justify-content: center;
     align-items: center;
   }
</style>
