<template>
  <page-header-wrapper>
    <!-- PageHeader 第二种使用方式 (v-slot) -->
    <template v-slot:content> 1.填写商品信息 2.填写 SKU 名称，金额，图片 3 完成填写并提交。 </template>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="填写商品信息" />
        <a-step title="选择商品参数" @click="tab1" />
        <a-step title="完成" @click="tab2"/>
      </a-steps>
      <div class="content">
        <AddProductInfo v-show="currentTab === 0" @nextStep="nextStep" @change="setProductInfo" />
        <AddSku v-show="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" />
        <AddProductSuccess v-show="currentTab === 2"/>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import AddProductInfo from './AddProductInfo'
import AddSku from './AddSku'
import AddProductSuccess from './AddProductSuccess'

export default {
  name: 'AddProduct',
  components: {
    AddProductInfo,
    AddSku,
    AddProductSuccess
  },
  data () {
    return {
      currentTab: 0,
      // form
      form: {},
      sku: []
    }
  },
  methods: {
    // handler
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    tab1 () {
      this.currentTab = 1
    },
    tab2 () {
      this.currentTab = 2
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    },
    setProductInfo (val) {
      console.log('product info:' + JSON.stringify(val))
      this.form = val
    }
  }
}
</script>
