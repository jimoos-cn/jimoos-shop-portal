<template>
  <page-header-wrapper>
    <a-row v-if="statistic">
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px',paddingLeft: '12px',paddingRight: '12px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.total-sales')" :total="'￥'+ statistic.allSales">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px',paddingLeft: '12px',paddingRight: '12px' }">
        <chart-card :loading="loading" title="总订单数" :total="statistic.orderAllCount">
          <a-tooltip title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px',paddingLeft: '12px',paddingRight: '12px' }">
        <chart-card :loading="loading" title="总用户数" :total="statistic.userAllCount">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px',paddingLeft: '12px',paddingRight: '12px' }">
        <chart-card :loading="loading" title="今日销售额" :total="statistic.day7[0].sales">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px',paddingLeft: '12px',paddingRight: '12px' }">
        <chart-card :loading="loading" title="今日订单数" :total="statistic.day7[0].orderCount">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px',paddingLeft: '12px',paddingRight: '12px' }">
        <chart-card :loading="loading" title="今日新增用户" :total="statistic.day7[0].userCount">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}" v-if="statistic">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <a-tab-pane loading="true" tab="销售额" key="1">
            <a-row style="padding-right: 20px">
                <bar :data="barData1" title="销售额" />
            </a-row>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="订单数" key="2">
            <a-row style="padding-right: 20px">
              <bar :data="barData2" title="订单数" />
            </a-row>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="用户数" key="3">
            <a-row style="padding-right: 20px">
              <bar :data="barData3" title="用户数" />
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import ChartCard from '@/views/dashboard/modules/ChartCard'
  import Bar from '@/components/Charts/Bar'
  import { getStatistic } from '@/api/shopInfo'
export default {
  name: 'DashboardHome',
  components: {
    ChartCard,
    Bar
  },
  data () {
    return {
      loading: false,
      statistic: null,
      barData1: [],
      barData2: [],
      barData3: []
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      getStatistic().then(res => {
        this.statistic = res
        this.statistic.day7.forEach(item => {
          const time = this.$dateFormat(item.startTime, 'YYYY-MM-DD')
          this.barData1.push({
            x: time,
            y: item.sales
          })
          this.barData2.push({
            x: time,
            y: item.orderCount
          })
          this.barData3.push({
            x: time,
            y: item.userCount
          })
        })
        console.log('statistic', this.statistic)
        console.log('data1', this.barData1)
        console.log('data2', this.barData2)
        console.log('data3', this.barData3)
      })
    }
  }
}
</script>

<style scoped>

</style>
