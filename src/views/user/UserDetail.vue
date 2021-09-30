<!-- 用户详细页 -->
<template>
  <page-header-wrapper v-if="userInfo" :title="userInfo.nickname" :tab-list="tabList" :tab-active-key="tabActiveKey" @tabChange="handleTabChange">
    <template v-slot:content>
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="编号">{{ userInfo.id }}</a-descriptions-item>
        <a-descriptions-item label="头像"><a-avatar shape="square" icon="user" :src="userInfo.avatar"/></a-descriptions-item>
        <a-descriptions-item label="手机号">{{ userInfo.phone }}</a-descriptions-item>
        <a-descriptions-item label="角色">
          <span v-if="userInfo.role === 0">普通用户</span>
          <span v-else-if="userInfo.role === 1">VIP用户</span>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ $dateFormat(userInfo.createAt) }}</a-descriptions-item>
      </a-descriptions>
    </template>
    <UserAddress :user="userInfo" v-if="tabActiveKey === '1'"></UserAddress>
    <UserRelation v-if="tabActiveKey === '2'"></UserRelation>
  </page-header-wrapper>
</template>

<script>
  import UserAddress from './modules/UserAddress'
  import UserRelation from './modules/UserRelation'
  import { STable } from '@/components'
  import { getUserRecentOrder } from '@/api/order'
  import { getUserDetail } from '@/api/user'
  export default {
    components: {
      STable,
      UserAddress,
      UserRelation
    },
    data () {
      return {
        tabList: [
          { key: '1', tab: '详情' }
        ],
        tabActiveKey: '1',
        userInfo: null, // 用户数据
        search: {}, // 查询数据
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
      handleTabChange (key) {
        this.tabActiveKey = key
      },
      // 获取用户详细数据
      getUserDetail (params) {
        getUserDetail(params)
        .then((res) => {
          console.log(res)
          this.userInfo = res
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
              console.log('用户最近订单', res)
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
