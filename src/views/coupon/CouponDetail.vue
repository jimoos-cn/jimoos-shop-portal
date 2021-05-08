<template>
  <page-header-wrapper>
    <template slot="title">
      名称:&nbsp;&nbsp;&nbsp;&nbsp;{{ data.des }}
    </template>
    <template v-slot:content>
      <a-descriptions size="small" :column="isMobile ? 1 : 3">
        <a-descriptions-item label="优惠码">{{ data.code?data.code:'-' }}</a-descriptions-item>
        <a-descriptions-item label="满减条件">¥{{ data.fullMoney }}</a-descriptions-item>
        <a-descriptions-item label="优惠金额金额">¥{{ data.reduceMoney }}</a-descriptions-item>
        <a-descriptions-item label="领取情况">{{ data.remainNum?data.remainNum:data.totalNum }} / {{ data.totalNum }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-badge status="error" v-if="data.stop" text="已下架"></a-badge>
          <a-badge status="success" v-else text="上架"></a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="有效时间">{{ data.validTime?data.validTime/(24*3600)+'天':'-' }}</a-descriptions-item>
        <a-descriptions-item label="领券时间">
          {{ $dateFormat(data.startTime) }} - {{ $dateFormat(data.endTime) }}
        </a-descriptions-item>
        <a-descriptions-item label="有效使用时间">
          {{ $dateFormat(data.effectiveStartTime) }} - {{ $dateFormat(data.effectiveEndTime) }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ data.createAt | dateFormat }}
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <a-card :bordered="false" title="用户领取记录">
      <CouponRecordTable :id="$route.query.id"></CouponRecordTable>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import { getCouponDetail } from '@/api/coupon'
import CouponRecordTable from '@/views/coupon/modules/CouponRecordTable'

export default {
  name: 'CouponDetail',
  mixins: [baseMixin],
  components: {
    CouponRecordTable
  },
  data () {
    return {
      data: {}
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      const params = {
        id: this.$route.query.id
      }
      getCouponDetail(params)
        .then(res => {
          this.data = res
        })
        .catch(err => {
          console.log('' + err)
        })
    }
  }
}
</script>
