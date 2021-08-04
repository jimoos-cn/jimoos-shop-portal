<!-- 用户收货地址 -->
<template>
  <a-card :bordered="false" style="margin-top:20px">
    <a-descriptions size="small" :column="2">
      <a-descriptions-item label="编号">{{ user.id }}</a-descriptions-item>
      <a-descriptions-item label="昵称">{{ user.nickname }}</a-descriptions-item>
      <a-descriptions-item label="头像"><a-avatar shape="square" icon="user" :src="user.avatar"/></a-descriptions-item>
      <a-descriptions-item label="性别">
        <span v-if="user.gender === 0">未知</span>
        <span v-else-if="user.gender === 1">女</span>
        <span v-else-if="user.gender === 2">男</span>
      </a-descriptions-item>
      <a-descriptions-item label="生日">
        <span v-if="user.birthday">{{ $dateFormat(user.birthday,'yyyy-MM-DD') }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="手机号">{{ user.phone }}</a-descriptions-item>
      <a-descriptions-item label="角色">
        <span v-if="user.role === 0">普通用户</span>
        <span v-else-if="user.role === 1">VIP用户</span>
      </a-descriptions-item>
      <a-descriptions-item label="邀请码">{{ user.inviteCode }}</a-descriptions-item>
      <a-descriptions-item label="居住地址">{{ liveAddress }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ $dateFormat(user.createAt) }}</a-descriptions-item>
    </a-descriptions>
    <a-divider style="margin-bottom: 24px" />
    <div class="title">收货地址</div>
    <a-table :columns="columns" :dataSource="userAddress" :pagination="false">
      <div slot="zipCode" slot-scope="text">
        <span v-if="text !== 'null'">{{ text }}</span>
      </div>
      <div slot="tag" slot-scope="text">
        <a-tag color="red" v-if="text === '0'">家</a-tag>
        <a-tag color="green" v-else-if="text === '1'">学校</a-tag>
        <a-tag color="blue" v-else-if="text === '2'">公司</a-tag>
      </div>
      <div slot="createAt" slot-scope="text">
        {{ $dateFormat(text) }}
      </div>
      <!--是否默认-->
      <div slot="defaultIn" slot-scope="text">
        <a-badge status="success" v-if="text" text="默认"></a-badge>
        <a-badge status="error" v-else text="非默认"></a-badge>
      </div>
    </a-table>
  </a-card>
</template>

<script>
  import { columns } from '@/views/user/modules/address'
  import { getUserAddress } from '@/api/user'

  export default {
    data () {
      return {
        columns: columns,
        userAddress: [], // 地址
        search: {} // 查询表单
      }
    },
    mounted () {
      this.init()
    },
    computed: {
      liveAddress () {
        let res = ''
        if (this.user.province != null) {
          res += this.user.province
        }
        if (this.user.city != null) {
          res += this.user.city
        }
        if (this.user.area != null) {
          res += this.user.area
        }
        if (res === '') {
          return '无信息'
        }
        return res
      }
    },
    props: {
      user: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      init () {
        this.getAddress()
      },
      // 获取用户地址
      getAddress () {
        this.search = {
          userId: this.user.id
        }
        console.log(this.search)
        getUserAddress(this.search)
          .then((res) => {
            this.userAddress = res
          })
      }
    }
  }
</script>

<style scoped>
  .addressRow{
    padding-bottom: 10px;
    border-bottom: 1px solid #e2e0e0;
    margin-top: 10px;
  }
  .title{
    padding-bottom: 10px;
    border-bottom: 1px solid #e5dfdf;
  }
  .titleContent{
    font-weight: 700;
    font-size: 20px;
  }
</style>
