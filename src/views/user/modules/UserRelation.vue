<!-- 用户分销 -->
<template>
  <div>
    <a-card :bordered="false" style="margin-top: 20px" title="分销统计">
      <a-descriptions size="small" :column="3">
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" title="下线列表" style="margin-top:20px">
      <a-tabs :defaultActiveKey="key" @change="callback">
        <a-tab-pane :key="1" tab="一级下线">
          <user-level1-down :userId="userId" ref="tab1"></user-level1-down>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="二级下线">
          <user-level2-down :userId="userId" ref="tab2"></user-level2-down>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
  export default {
    props: {
      userSplit: {
        type: Object,
        default: () => {}
      },
      // eslint-disable-next-line vue/require-default-prop
      userId: Number
    },
    data () {
      return {
        key: 1
      }
    },
    methods: {
      callback (key) {
        this.key = key
        this.refs[key].refresh()
      }
    }
  }
</script>
