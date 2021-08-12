<!-- 修改编辑Sku -->
<template>
  <a-card style="margin-top: 20px" :bordered="false" title="修改商品规格">
    <span>规格（必选）: </span>

    <a-radio-group @change="skuTypeChange" :value="skuType" disabled>
      <a-radio :value="1">单品</a-radio>
      <a-radio :value="2">非单品</a-radio>
    </a-radio-group>
    <SingleSkuTable v-if="skuType == '1'" @change="handleSingleSkuChange" :single="allSku"></SingleSkuTable>
    <template v-if="skuType == 2">
      <AttrContainer ref="attr" :edit-flag="true" @attrValueChangeEvent="handleAttrValueChangeEvent"></AttrContainer>
      <MultiSkuTable ref="multi" :edit-flag="true" @change="handleMultiSkuChange"></MultiSkuTable>
    </template>
    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button>取消</a-button>
      <a-button type="primary" @click="handleOk" style="margin-left: 10px">修改</a-button>
    </footer-tool-bar>
  </a-card>
</template>
<script>
import { baseMixin } from '@/store/app-mixin'
import SingleSkuTable from '@/views/product/product/modules/SingleSkuTable'
import AttrContainer from '@/views/product/product/modules/AttrContainer'
import MultiSkuTable from '@/views/product/product/modules/MultiSkuTable'
import FooterToolBar from '@/components/FooterToolbar'
import { batchProductSkus } from '@/api/product/sku'

export default {
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    SingleSkuTable,
    AttrContainer,
    MultiSkuTable
  },
  data () {
    return {
      modelVisible: false,
      skuType: 1,
      attrValuesList: [],
      skus: []
    }
  },
  props: {
    allSku: {
      type: Array,
      default: null
    }
  },
  created () {
    this.init()
  },
  methods: {
    handleOk () {
      const that = this
      const param = []
      // 提交前 先批量保存
      this.$refs.multi.batchSave()
      for (const i in that.skus) {
        const data = {
          attrs: that.skus[i].attrs,
          price: that.skus[i].price,
          showPrice: that.skus[i].showPrice,
          cover: that.skus[i].cover,
          quantity: that.skus[i].quantity
        }
        // 寻找修改项
        console.log(that.skus[i].id)
        if (that.skus[i].id !== undefined && that.skus[i].id !== '' && that.skus[i].id != null) {
          data.id = that.skus[i].id
        }
        param.push(data)
      }
      const from = {
        productId: this.$route.query.id,
        skuInputs: param
      }
      batchProductSkus(from).then(res => {
        console.log(res)
        this.$message.success('修改成功')
        this.$router.push({
          name: 'product-management'
        })
      })
    },
    // 初始化
    init () {
      if (this.allSku.length > 1 || this.allSku[0].attrs[0].attrName !== '单品') {
        const that = this
        that.skuType = 2
        that.$nextTick(() => {
          that.$refs.multi.changeTableColumns(that.allSku)
          that.$refs.multi.setContent(that.allSku)
          that.$refs.attr.setContent(that.allSku[0].attrs)
        })
      } else {
        this.skuType = 1
      }
    },
    skuTypeChange (e) {
      const that = this
      const attrs = that.allSku[0].attrs
      this.skuType = e.target.value
      if (e.target.value === 2 && this.allSku) {
        that.$nextTick(() => {
          that.$refs.multi.setContent(that.allSku)
          that.$refs.attr.setContent(attrs)
        })
      }
    },
    // 单品变化
    handleSingleSkuChange (val) {
      console.log('single sku:' + JSON.stringify(val))
      this.skus = [val]
    },
    // 非单品变化
    handleMultiSkuChange (val) {
      console.log('multi sku:' + JSON.stringify(val))
      this.skus = val
    },
    handleAttrValueChangeEvent (attrValuesList) {
      const attrs = this.allSku[0].attrs
      // 判断是否将所有
      this.attrValuesList = attrValuesList.filter(item => {
        const w = attrs.find(attr => attr.attrId === item.id)
        if (w) {
          return item
        }
      })
      // 当规格名全选择完后
      if (this.attrValuesList.length === attrs.length) {
        this.$refs.multi.updateAttrValues(attrValuesList)
      }
    }
  }
}
</script>
