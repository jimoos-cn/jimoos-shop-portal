/**
 * 多个sku 的商品
 */
<template>
  <a-row style="margin-top: 20px">
    <a-row type="flex">
      <a-col :span="8">
        <a-input-group compact>
          <a-select :default-value="0" style="width: 30%" v-model="batchSet.type">
            <a-select-option :value="0">
              展示价
            </a-select-option>
            <a-select-option :value="1">
              价格
            </a-select-option>
            <a-select-option :value="2">
              库存
            </a-select-option>
          </a-select>
          <a-input-number
            placeholder="批量设置"
            style="width: 40%"
            :max="99999999"
            :min="0.01"
            :precision="2"
            v-model="batchSet.value">
          </a-input-number>
          <a-button style="background-color: #2fa82f;color: #ffffff;margin-left: 20px" @click="batchSetValue">批量设置</a-button>
        </a-input-group>
      </a-col>
      <a-col :span="12">
        <a-button style="background-color: #2fa82f;color: #ffffff" @click="batchSave">一键保存</a-button>
        <a-button v-if="!editFlag" style="background-color: red;color: #ffffff;margin-left: 20px" @click="batchDelete">一键清除</a-button>
      </a-col>
    </a-row>
    <a-table style="margin-top: 20px" :columns="columns" :dataSource="skus" :pagination="false" bordered>
      <template slot="showPrice" slot-scope="text, record">
        <a-input-number v-if="record.editable" style="width: 100%" v-model="record.showPrice" :max="99999999" :min="0.01" :precision="2" />
        <template v-else>{{ record.showPrice }}</template>
      </template>
      <template slot="price" slot-scope="text, record">
        <a-input-number v-if="record.editable" style="width: 100%" v-model="record.price" :max="99999999" :min="0.01" :precision="2" />
        <template v-else>{{ record.price }}</template>
      </template>
      <template slot="quantity" slot-scope="text, record">
        <a-input-number
          placeholder="不填写则默认为9999"
          v-if="record.editable"
          style="width: 100%"
          v-model="record.quantity"
          :max="99999999"
          :min="0"
          :precision="0"
          :defaultValue="0"
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
        <span v-if="record.editable">
          <a @click="() => saveMulti(record)">保存</a>
          <a @click="() => cancelMulti(record)" v-if="record._originalData" style="margin-left: 10px;color: red">取消</a>
        </span>
        <span v-else>
          <a @click="() => editMulti(record)">编辑</a>
          <a v-if="!editFlag || !record.orginFlag" style="margin-left: 10px;color: red" @click="() => deleteMulti(record)">删除</a>
        </span>
      </template>
    </a-table>
  </a-row>
</template>

<script>
import ListUploadWrapper from '@/components/Upload/ListUploadWrapper'
import { updateSkus, flatten, editSkus } from './utils'
const naiveColumns = [
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
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'MultiSkuTable',
  components: {
    ListUploadWrapper
  },
  data () {
    return {
      skus: [],
      navieAttrSkus: [],
      originalSku: [], //  保存修改规格时原始的skus
      columns: naiveColumns,
      batchSet: {
        value: '',
        type: 0
      }
    }
  },
  props: {
    // 修改标志
    editFlag: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    updateAttrValues (newVal) {
      const navieAttrSkus = flatten(newVal, this.navieAttrSkus, { optionValue: 'id', optionText: 'name' })
      this.navieAttrSkus = navieAttrSkus
      if (this.editFlag) {
        // 修改规格时调用另一个方法,并传的是原始sku数据
        this.skus = editSkus(this.originalSku, navieAttrSkus, '')
      } else {
        this.skus = updateSkus(this.skus, navieAttrSkus, '')
      }
      this.changeTableColumns(this.skus)
    },
    setContent (skus) {
      skus.forEach(item => {
        this.$set(item, 'editable', true)
        this.$set(item, 'orginFlag', true)
      })
      this.skus = skus
      this.originalSku = this.skus
      this.updateAttrValues(this.skus)
    },
    // 更新cover
    updateCover (record, url) {
      const target = this.skus.find(item => record.uid === item.uid)
      this.$set(target, 'cover', url)
    },
    // 变化
    change () {
      this.$emit('change', this.skus)
    },
    // 动态变化表格的column
    changeTableColumns (val) {
      if (Object.values(val)[0]) {
        val = Object.values(val)[0].attrs
        const newColum = []
        for (let i = 0; i < val.length; i++) {
          val[i].name = val[i].attrName
          newColum.push({
            title: val[i].attrName,
            align: 'center',
            dataIndex: 'attrs[' + i + '].attrValueName',
            scopedSlots: { customRender: 'attrs[' + i + '].attrValueName' }
          })
        }
        this.columns = [...newColum, ...naiveColumns]
      }
    },
    saveMulti (record) {
      if (!record.price || record.price === '') {
        this.$message.error('请填写价格')
        throw new Error('请填写价格')
      }
      if (!record.showPrice || record.showPrice === '') {
        this.$message.error('请填写展示价')
        throw new Error('请填写展示价')
      }
      record.price = record.price * 1
      record.showPrice = record.showPrice * 1
      console.log(record.quantity)
      if (!this.$available(record.quantity)) {
        record.quantity = 0
      }
      record.quantity = record.quantity * 1
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
      this.$set(record, 'editable', false)
      this.$delete(record, '_originalData')
      record.editable = false
      console.log(this.skus)
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
    batchSetValue () {
      if (this.batchSet.value != null && this.batchSet.value !== '') {
        switch (this.batchSet.type) {
          case 0:
            this.batchSetShowPrice()
            break
          case 1:
            this.batchSetPrice()
            break
          case 2:
            this.batchSetStock()
            break
        }
      }
    },
    batchSetPrice () {
      this.skus.filter(item => {
        item.price = this.batchSet.value
        // if (item.editable) {
        // }
      })
    },
    batchSetShowPrice () {
      this.skus.forEach(item => {
        item.showPrice = this.batchSet.value
        // if (item.editable) {
        // }
      })
    },
    batchSetStock () {
      if (typeof this.batchSet.value === 'number') {
        this.batchSet.value = this.batchSet.value.toFixed(0)
      }
      this.skus.forEach(item => {
        this.$set(item, 'quantity', this.batchSet.value)
        // if (item.editable) {
        //
        // }
      })
    },
    batchSave () {
      this.skus.forEach(item => {
        try {
          this.saveMulti(item)
        } catch (e) {
          throw new Error('批量保存出现错误')
        }
      })
    },
    batchDelete () {
      this.skus = []
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
