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
        :precision="2" />
      <template v-else>{{ record.price }}</template>
    </template>
    <template slot="showPrice" slot-scope="text, record">
      <a-input-number
        v-if="record.editable"
        style="width: 100%"
        v-model="record.showPrice"
        :max="99999999"
        :min="0.01"
        :precision="2" />
      <template v-else>{{ record.showPrice }}</template>
    </template>
    <template slot="quantity" slot-scope="text, record">
      <a-input-number
        placeholder="不填写则默认为9999"
        v-if="record.editable"
        style="width: 100%"
        v-model="record.quantity"
        :max="99999999"
        :min="0.01"
        :precision="2"
      />
      <template v-else>{{ record.quantity }}</template>
    </template>
    <template slot="cover" slot-scope="text, record">
      <ListUploadWrapper
        class="listupload"
        @input="updateCover(record, $event)"
        :uploadType="0"
        :width="128"
        :height="128"
        :length="1"
        :urls="record.cover"
      ></ListUploadWrapper>
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
import ListUploadWrapper from '@/components/Upload/ListUploadWrapper'

const columns = [
  {
    title: '规格',
    dataIndex: 'name',
    width: '16%',
    scopedSlots: { customRender: 'name' }
  },
  // 规格编码暂时不予与显示
  // {
  //   width: '25%',
  //   align: 'center',
  //   dataIndex: 'skuNo',
  //   slots: { title: 'customName' },
  //   scopedSlots: { customRender: 'skuNo' }
  // },
  {
    title: '价格(元)',
    width: '15%',
    align: 'center',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '展示价(元)',
    dataIndex: 'showPrice',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'showPrice' }
  },
  // {
  //   title: '库存',
  //   width: '15%',
  //   align: 'center',
  //   dataIndex: 'quantity',
  //   scopedSlots: { customRender: 'quantity' }
  // },
  {
    title: '图片',
    width: '15%',
    align: 'center',
    dataIndex: 'cover',
    scopedSlots: { customRender: 'cover' }
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
    ListUploadWrapper
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
        showPrice: this.single[0].showPrice,
        cover: this.single[0].cover
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
      record.price = record.price * 1
      record.showPrice = record.showPrice * 1
      if (!this.$available(record.quantity)) {
        record.quantity = 9999
      }
      record.quantity = record.quantity * 1
      if (record.showPrice < record.price) {
        this.$message.error('展示价不能低于实际价格')
        return
      }
      if (typeof record.price === 'number') {
        record.price = record.price.toFixed(2)
      }
      if (typeof record.showPrice === 'number') {
        record.showPrice = record.showPrice.toFixed(2)
      }
      if (typeof record.quantity === 'number') {
        record.quantity = record.quantity.toFixed(0)
      }
      if (record.showPrice * 100 < record.price * 100) {
        this.$message.error('展示价不能低于实际价格')
        throw new Error('展示价不能低于实际价格')
      }
      const newData = [...this.dataSingle]
      const target = newData.filter(item => record.key === item.key)[0]
      if (target) {
        target.editable = false
        this.dataSingle = newData
      }

      console.log('dataSingle:' + JSON.stringify(this.dataSingle))

      const { price, showPrice, cover, quantity } = record
      this.$emit('change', {
        price,
        showPrice,
        quantity,
        cover,
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
    updateCover (record, url) {
      record.cover = url
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
    },
    batchSave () {
      this.dataSingle.forEach(item => {
        try {
          this.saveSingle(item)
        } catch (e) {
          throw new Error('批量保存出现错误')
        }
      })
    }
  }
}
</script>

<style>
</style>
