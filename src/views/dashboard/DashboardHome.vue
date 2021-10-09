<template>
  <page-header-wrapper>
    <a-row>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px',paddingLeft: '12px',paddingRight: '12px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.total-sales')" total="￥126,560">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">{{ $t('dashboard.analysis.week') }}</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">{{ $t('dashboard.analysis.day') }}</span>
              11%
            </trend>
          </div>
          <template slot="footer">{{ $t('dashboard.analysis.day-sales') }}<span>￥ 234.56</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px',paddingLeft: '12px',paddingRight: '12px' }">
        <chart-card :loading="loading" title="总订单数" :total="6560 | NumberFormat">
          <a-tooltip title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">{{ $t('dashboard.analysis.conversion-rate') }} <span>60%</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px',paddingLeft: '12px',paddingRight: '12px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.payments')" :total="6560 | NumberFormat">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">{{ $t('dashboard.analysis.conversion-rate') }} <span>60%</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px',paddingLeft: '12px',paddingRight: '12px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.payments')" :total="6560 | NumberFormat">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">{{ $t('dashboard.analysis.conversion-rate') }} <span>60%</span></template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <a-tab-pane loading="true" :tab="$t('dashboard.analysis.sales')" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData" :title="$t('dashboard.analysis.sales-trend')" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :title="$t('dashboard.analysis.sales-ranking')" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import ChartCard from '@/views/dashboard/modules/ChartCard'
  import { getStatistic } from '@/api/shopInfo'
export default {
  name: 'DashboardHome',
  components: {
    ChartCard
  },
  data () {
    return {
      loading: false,
      statistic: null
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      getStatistic.then(res => {
        this.statistic = res
      })
    }
  }
}
</script>

<style scoped>

</style>
