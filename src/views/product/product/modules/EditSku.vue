<!-- 修改商品的modal -->
<template>
  <a-modal v-model="modelVisible" @ok="handleOk" @cancel="close" width="60%">
    <a-card style="margin-top: 20px" :bordered="false" title="修改商品规格">
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
  </a-modal>
</template>
<script>
  import FooterToolBar from '@/components/FooterToolbar'
  import { baseMixin } from '@/store/app-mixin'
  import SingleSkuTable from '../modules/SingleSkuTable'
  import AttrContainer from '../modules/AttrContainer'
  import MultiSkuTable from '../modules/MultiSkuTable'
  import { updateSku } from '@/api/product/sku'
  import { avliable } from '@/utils/data'

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
        modelVisible: false,
        skuType: 1,
        Sku: null, // 单 sku 是否有数据
        attrValuesList: [],
        skus: []
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      refresh: {
        type: Function,
        required: true
      },
      allSku: {
        type: Array,
        default: null
      },
      product: {
        type: Object,
        default: null
      }
    },
    watch: {
      visible (val) {
        if (val) {
          this.init()
        }
        this.modelVisible = val
      }
    },
    methods: {
      handleOk () {
        const that = this
        const param = []
        console.log(that.Sku)
        for (const i in that.Sku) {
          const data = {
            attrs: that.Sku[i].attrs,
            price: that.Sku[i].price,
            showPrice: that.Sku[i].showPrice,
            productId: that.product.id,
            cover: that.product.cover,
            attrValueIds: that.Sku[i].attrs[0].attrId
          }
          // 寻找修改项
          if (avliable(that.Sku[i].id)) {
            data.id = that.Sku[i].id
          }
          param.push(data)
        }
        console.log(param)
        updateSku(param)
        .then(res => {
          this.refresh()
          this.close()
        })
      },
      // 初始化
      init () {
        // 判断sku类别
        console.log(this.allSku)
        console.log(this.allSku[0].attrName)
        if (this.allSku.length > 1 || this.allSku[0].attrs[0].attrName !== '单品') {
          this.skuType = 2
          this.handleAttrValueChangeEvent(this.allSku)
        } else {
          this.skuType = 1
        }
      },
      close () {
        this.modelVisible = false
        this.$emit('update:visible', false)
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
