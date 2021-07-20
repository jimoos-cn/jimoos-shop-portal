/**
 * 多个sku 的商品
 */
<template>
  <a-table style="margin-top: 20px" :columns="columns" :dataSource="skus" :pagination="false" bordered>
    <template slot="price" slot-scope="text, record">
      <a-input-number
        v-if="record.editable"
        style="width: 100%"
        v-model="record.price"
        :max="99999999"
        :min="0.01"
        :precision="2"
      />
      <template v-else>{{ record.price }}</template>
    </template>
    <template slot="showPrice" slot-scope="text, record">
      <a-input-number
        v-if="record.editable"
        style="width: 100%"
        v-model="record.showPrice"
        :max="99999999"
        :min="0.01"
        :precision="2"
      />
      <template v-else>{{ record.showPrice }}</template>
    </template>
    <template slot="operation" slot-scope="text, record">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => saveMulti(record)">保存</a>
          <a @click="() => cancelMulti(record)" style="margin-left: 10px">取消</a>
        </span>
        <span v-else>
          <a @click="() => editMulti(record)">编辑</a>
        </span>
      </div>
    </template>
  </a-table>
</template>

<script>
import SfSimpleUpload from '@/components/Upload/SimpleUploadWrapper'
import { updateSkus, flatten } from './utils'
const naiveColumns = [
  {
    title: '规格',
    dataIndex: 'attrs[0].attrValueName',
    width: '16%',
    scopedSlots: { customRender: 'attrs[0].attrValueName' }
  },
  {
    title: '价格(元)',
    width: '25%',
    align: 'center',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '展示价(元)',
    dataIndex: 'showPrice',
    width: '25%',
    align: 'center',
    scopedSlots: { customRender: 'showPrice' }
  },
  {
    title: '操作',
    width: '15%',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'MultiSkuTable',
  props: {
    attrValues: {
      type: Array,
      required: true
    }
  },
  components: {
    SfSimpleUpload
  },
  data () {
    return {
      skus: [],
      navieAttrSkus: [],
      columns: naiveColumns
    }
  },
  watch: {
    attrValues: {
      handler (newVal, oldVal) {
        console.log('watch更新', newVal)
        const navieAttrSkus = flatten(newVal, this.navieAttrSkus, { optionValue: 'id', optionText: 'name' })
        this.navieAttrSkus = navieAttrSkus
        this.skus = updateSkus(this.skus, navieAttrSkus, '')
        console.log('new Data list:' + JSON.stringify(this.skus))
      },
      deep: true
    }

  },
  methods: {
    saveMulti (record) {
      if (!record.price || record.price === '') {
        this.$message.error('请填写价格')
        return
      }
      if (!record.showPrice || record.showPrice === '') {
        this.$message.error('请填写展示价')
        return
      }

      if (record.showPrice < record.price) {
        this.$message.error('展示价不能低于实际价格')
        return
      }
      const newData = [...this.skus]
      const target = newData.filter((item) => record.attrs[0].attrValueId === item.attrs[0].attrValueId)[0]
      if (typeof target.price === 'number') {
        target.price = target.price.toFixed(2)
      }
      if (typeof target.showPrice === 'number') {
        target.showPrice = target.showPrice.toFixed(2)
      }
      if (target) {
        this.$set(target, 'editable', false)
        this.$delete(target, '_originalData')
        this.skus = newData
      }
      console.log('newData!!!!!!!!!!', newData)
      this.$emit('change', this.skus)
    },
    editMulti (record) {
      record._originalData = { ...record }
      this.$set(record, 'editable', true)
    },
    cancelMulti (record) {
      if (record.price) {
        record.price = record._originalData.price
        record.showPrice = record._originalData.showPrice
      }
      record.editable = false
      record._originalData = undefined
    }
  }
}
</script>

<style>
</style>
