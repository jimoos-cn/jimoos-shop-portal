<template>
  <div>
    <a-card style="margin-top: 20px" :bordered="false" title="选择商品规格">
      <span>规格（必选）: </span>

      <a-radio-group @change="skuTypeChange" :value="skuType">
        <a-radio :value="1">单品</a-radio>
        <a-radio :value="2">非单品</a-radio>
      </a-radio-group>
      <SingleSkuTable v-if="skuType == '1'" @change="handleSingleSkuChange"></SingleSkuTable>
      <template v-if="skuType == 2">
        <AttrContainer @attrValueChangeEvent="handleAttrValueChangeEvent"></AttrContainer>
        <MultiSkuTable :attrValues="attrValuesList" @change="handleMultiSkuChange"></MultiSkuTable>
      </template>
    </a-card>
    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-space>
        <a-button type="default" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">提交</a-button>
      </a-space>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import SingleSkuTable from './modules/SingleSkuTable'
import AttrContainer from './modules/AttrContainer'
import MultiSkuTable from './modules/MultiSkuTable'

export default {
  name: 'AddProduct',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    SingleSkuTable,
    AttrContainer,
    MultiSkuTable
  },
  data () {
    return {
      skuType: 1,
      Sku: null, // 单 sku 是否有数据
      attrValuesList: [],
      skus: []
    }
  },
  methods: {
    nextStep () {
      const that = this
      that.loading = true
      console.log('表单 values', that.Sku)
      that.timer = setTimeout(function () {
        that.loading = false
        that.$emit('change', that.Sku)
        that.$emit('nextStep')
      }, 1500)
    },
    prevStep () {
      this.$emit('prevStep')
    },
    skuTypeChange (e) {
      this.skuType = e.target.value
    },
    // 单品变化
    handleSingleSkuChange (val) {
      console.log('single sku:' + JSON.stringify(val))
      this.Sku = [val]
    },
    // 非单品变化
    handleMultiSkuChange (val) {
      console.log('multi sku:' + JSON.stringify(val))
      this.Sku = val
    },
    handleAttrValueChangeEvent (attrValuesList) {
      this.attrValuesList = attrValuesList
      console.log('改变', JSON.stringify(attrValuesList))
    }
  }
}
</script>

<style>
</style>
