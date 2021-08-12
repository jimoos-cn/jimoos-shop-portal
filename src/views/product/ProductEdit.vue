<!-- 修改商品基本信息 -->
<template>
  <page-header-wrapper :title="product.name" v-if="product">
    <a-card class="base_page">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="基本信息" key="1">
          <ProductBaseInfo :product="product" v-if="product"></ProductBaseInfo>
        </a-tab-pane>
        <a-tab-pane tab="产品参数" key="2">
          <ProductMore :allSku="product.productSkuVos" v-if="product"></ProductMore>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { getProduct } from '@/api/product'
  import ProductBaseInfo from './editStep/ProductBaseInfo'
  import ProductMore from './editStep/ProductMore'
  export default {
    data () {
      return {
        categoryList: [],
        dataTags: [],
        product: null,
        skuVisible: false,
        uid: 1
      }
    },
    components: {
      ProductBaseInfo,
      ProductMore
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.getProductDetail({ id: this.$route.query.id })
      },
      // 获取商品详情
      getProductDetail (param) {
        const that = this
        getProduct(param).then(res => {
          that.product = res
        })
      }
    }
  }
</script>

<style lang="less">
  .item-group-header {
    margin-left: 4%;
    margin-bottom: 20px;
  }
</style>
