<template>
  <page-header-wrapper>
    <!-- PageHeader 第二种使用方式 (v-slot) -->
    <template v-slot:content> 1.填写商品信息 2.填写 SKU 名称，金额，图片 3 完成填写并提交。 </template>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="填写商品信息" @click="tab(0)"/>
        <a-step title="选择商品参数" @click="tab(1)" />
        <a-step title="完成"/>
      </a-steps>
      <div class="content">
        <AddProductInfo v-show="currentTab === 0" @nextStep="nextStep" @change="setProductInfo" />
        <AddSku v-show="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" @change="setProductSkuInfo" />
        <AddProductSuccess v-show="currentTab === 2"/>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import AddProductInfo from './AddProductInfo'
import AddSku from './AddSku'
import AddProductSuccess from './AddProductSuccess'
import { createProduct } from '@/api/product'

export default {
  name: 'AddProduct',
  components: {
    AddProductInfo,
    AddSku,
    AddProductSuccess
  },
  data () {
    return {
      stepJug: {
        step1: false,
        step2: false
      },
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
    tab (val) {
      if (this.stepJug.step1) {
        this.currentTab = val
      }
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
      // 设置步骤成功
      this.stepJug.step1 = true
    },
    setProductSkuInfo (val) {
      console.log('sku info:' + JSON.stringify(val))
      this.form.skus = val
      this.stepJug.step2 = true
      // 第三步调用接口创建商品
      createProduct(this.form)
      .then((res) => {
        console.log(res)
      })
    }

  }
}
</script>
