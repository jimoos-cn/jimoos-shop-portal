<template>
  <page-header-wrapper>
    <!-- PageHeader 第二种使用方式 (v-slot) -->
    <template v-slot:content>
      1.填写商品信息 2.填写 SKU 名称，金额，图片 3 完成填写并提交。
    </template>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="填写商品信息" />
        <a-step title="选择商品参数" />
        <a-step title="完成" />
      </a-steps>
      <div class="content">
        <AddProductInfo v-if="currentTab === 0" @nextStep="nextStep"/>
        <!-- <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
        <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish"/> -->
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import AddProductInfo from './AddProductInfo'
// import Step2 from './Step2'
// import Step3 from './Step3'

export default {
  name: 'StepForm',
  components: {
    AddProductInfo
  },
  data () {
    return {
      currentTab: 0,
      // form
      form: null
    }
  },
  methods: {
    // handler
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    }
  }
}
</script>

<style lang="less" scoped>
  // .steps {
  //   max-width: 750px;
  //   margin: 16px auto;
  // }
</style>
