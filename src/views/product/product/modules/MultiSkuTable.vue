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
    <template slot="cover" slot-scope="text, record">
      <ListUploadWrapper
        class="listupload"
        @input="updateCover(record,$event)"
        :uploadType="0"
        :width="128"
        :height="128"
        :length="1"
        v-model="record.cover"
      ></ListUploadWrapper>
    </template>
    <template slot="operation" slot-scope="text, record">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => saveMulti(record)">保存</a>
          <a @click="() => cancelMulti(record)" style="margin-left: 10px">取消</a>
        </span>
        <span v-else>
          <a @click="() => editMulti(record)">编辑</a>
          <a style="margin-left: 10px" @click="() => deleteMulti(record)">删除</a>
        </span>
      </div>
    </template>
  </a-table>
</template>

<script>
import ListUploadWrapper from '@/components/Upload/ListUploadWrapper'
import { updateSkus, flatten } from './utils'
const naiveColumns = [
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
  {
    title: '参数封面',
    dataIndex: 'cover',
    width: '20%',
    align: 'center',
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
  name: 'MultiSkuTable',
  props: {
    attrValues: {
      type: Array,
      required: true
    }
  },
  components: {
    ListUploadWrapper
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
        console.log('nativesku', JSON.stringify(this.navieAttrSkus))
        this.changeTableColumns(newVal)
        this.skus = updateSkus(this.skus, navieAttrSkus, '')
        console.log('new Data list:' + JSON.stringify(this.skus))
      },
      deep: true
    }
  },
  created () {
    this.skus = this.attrValues
  },
  methods: {
    // 更新cover
    updateCover (record, url) {
      const target = this.skus.find(item => record.uid === item.uid)
      this.$set(target, 'cover', url)
    },
    // 动态变化表格的column
    changeTableColumns (val) {
      const newColum = []
      for (let i = 0; i < val.length; i++) {
        newColum.push({
          title: val[i].name,
          align: 'center',
          dataIndex: 'attrs[' + i + '].attrValueName',
          scopedSlots: { customRender: 'attrs[' + i + '].attrValueName' }
        })
      }
      this.columns = [ ...newColum, ...naiveColumns ]
    },
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

      if (record.cover == null || record.cover === '') {
        this.$message.error('参数图片不能为空')
        return
      }
      const target = this.skus.find(item => record.uid === item.uid)
      console.log(target)
      if (typeof target.price === 'number') {
        target.price = target.price.toFixed(2)
      }
      if (typeof target.showPrice === 'number') {
        target.showPrice = target.showPrice.toFixed(2)
      }
      this.$set(target, 'editable', false)
      this.$delete(target, '_originalData')
      this.change()
    },
    editMulti (record) {
      record._originalData = { ...record }
      this.$set(record, 'editable', true)
      this.change()
    },
    cancelMulti (record) {
      if (record.price) {
        record.price = record._originalData.price
        record.showPrice = record._originalData.showPrice
      }
      record.editable = false
      record._originalData = undefined
    },
    deleteMulti (record) {
      // 删除某项
      this.skus = this.skus.filter(value => value.uid !== record.uid)
      this.change()
    },
    change () {
      this.$emit('change', this.skus)
    }
  }
}
</script>

<style>
  .listupload .ant-upload-picture-card-wrapper {
    zoom: 1;
    display: flex;
    justify-content: center;
    width: 100%;
  }
</style>
