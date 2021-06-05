/**
 * 规格选择器
 * @author: keepcleargas
 */
<template>
  <div>
    <a-form-item label="规格选择">
      <a-select style="width: 200px" placeholder="请选择" @change="handleAttrSelect" label-in-value>
        <a-select-option v-for="item in attrList" :key="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <AttrItem
      v-for="item in attrSelectedList"
      :attr="item"
      :key="item.id"
      @attrValuesChange="handleAttrValuesChange"
      @deleteAttr="handleAttrRemove"
    >
    </AttrItem>
  </div>
</template>

<script>
import AttrItem from './AttrItem'
import { getProductAttrPage } from '@/api/product/attr'

export default {
  name: 'AttrContainer',
  components: {
    AttrItem
  },
  data () {
    return {
      attrList: [],
      attrSelectedList: [],
      attrValuesList: []
    }
  },
  created () {
    getProductAttrPage({
      offset: 0,
      limit: 9999
    }).then((res) => {
      this.attrList = res['list'].filter((attr) => attr.id !== 1)
    })
  },
  methods: {
    handleAttrSelect (val) {
      console.log('attr selected:' + JSON.stringify(val))
      if (!this.attrSelectedList.some((e) => e.id.toString() === val.key.toString())) {
        if (this.attrSelectedList.length === 3) {
          this.$message.warning('最多只能选择3个规格属性')
        } else {
          this.attrSelectedList.push({
            id: val.key,
            name: val.label
          })
        }
      }
    },
    handleAttrRemove (id) {
      console.log('remove attr id:' + id)
      const attrSelectedList = this.attrSelectedList.filter((attr) => attr.id !== id)
      this.attrSelectedList = attrSelectedList
      const attrValuesList = this.attrValuesList.filter((attr) => attr.id !== id)
      this.attrValuesList = attrValuesList
      this.emitAttrChangeEvent()
    },
    handleAttrValuesChange (val) {
      console.log('attr values change:' + JSON.stringify(val))
      this.updateAttrValuesByKey(val.id, val)
      this.emitAttrChangeEvent()
    },
    emitAttrChangeEvent () {
      this.$emit('attrValueChangeEvent',
        this.attrValuesList)
    },
    updateAttrValuesByKey (id, object) {
      let flag = false
      for (const i in this.attrValuesList) {
        if (this.attrValuesList[i].id === id) {
          flag = true
          this.attrValuesList[i] = object
          break // Stop this loop, we found it!
        }
      }

      if (!flag) {
        this.attrValuesList.push(object)
      }
    }
  }
}
</script>

<style>
</style>
