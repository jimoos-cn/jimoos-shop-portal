/**
 * 单个sku 的商品
 */
<template>
  <a-table style="margin-top: 20px" :columns="columnsSingle" :dataSource="dataSingle" :pagination="false" bordered>
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

const columns = [
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
  name: 'SingleSkuTable',
  components: {
    SfSimpleUpload
  },
  data () {
    return {
      dataSingle: [],
      columnsSingle: columns
    }
  },
  props: {
    single: {
      type: Array,
      default: null
    }
  },
  created () {
    if (this.single != null) {
      this.dataSingle.push({
        key: 1,
        name: '单品',
        editable: true,
        price: this.single[0].price,
        showPrice: this.single[0].showPrice
      })
    } else {
      this.dataSingle.push({
        key: 1,
        name: '单品',
        editable: true
      })
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
      const newData = [...this.dataSingle]
      const target = newData.filter((item) => record.key === item.key)[0]
      if (typeof target.price === 'number') {
        target.price = target.price.toFixed(2)
      }
      if (typeof target.showPrice === 'number') {
        target.showPrice = target.showPrice.toFixed(2)
      }
      if (target) {
        target.editable = false
        this.dataSingle = newData
      }

      console.log('dataSingle:' + JSON.stringify(this.dataSingle))

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
