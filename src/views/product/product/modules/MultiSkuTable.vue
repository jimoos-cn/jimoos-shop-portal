/**
 * 单个sku 的商品
 */
<template>
  <a-table style="margin-top: 20px" :columns="columns" :dataSource="data" :pagination="false" bordered>
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
          <a @click="() => saveSingle(record)">保存</a>
          <a @click="() => cancelSingle(record)" style="margin-left: 10px">取消</a>
        </span>
        <span v-else>
          <a @click="() => editSingle(record)">编辑</a>
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
    dataIndex: 'name',
    width: '16%',
    scopedSlots: { customRender: 'name' }
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
      data: [],
      sku: [],
      navieAttrSkus: [],
      columns: naiveColumns
    }
  },
  created () {
    this.data.push({
      key: 1,
      name: '单品',
      editable: true
    })
  },
  watch: {
    attrValues: function (newVal, oldVal) {
      console.log('new attrValueList:' + JSON.stringify(newVal))
      const navieAttrSkus = flatten(newVal, this.navieAttrSkus, { optionValue: 'id', optionText: 'name' })
      this.navieAttrSkus = navieAttrSkus
      this.skus = updateSkus(this.skus, navieAttrSkus)
      console.log('new Sku list:' + JSON.stringify(this.skus))
    }
  },
  methods: {
    saveSingle (record) {
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
      const newData = [...this.data]
      const target = newData.filter((item) => record.key === item.key)[0]
      if (typeof target.price === 'number') {
        target.price = target.price.toFixed(2)
      }
      if (typeof target.showPrice === 'number') {
        target.showPrice = target.showPrice.toFixed(2)
      }
      if (target) {
        target.editable = false
        this.data = newData
      }

      console.log('data:' + JSON.stringify(this.data))

      const { price, showPrice } = record
      this.$emit('change', {
        price,
        showPrice,
        attrs: [
          {
            attrId: 1,
            attrName: '单品',
            attrValueId: 1,
            attrValueName: '单品'
          }
        ]
      })
    },
    editSingle (record) {
      record._originalData = { ...record }
      record.editable = true
    },
    cancelSingle (record) {
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
