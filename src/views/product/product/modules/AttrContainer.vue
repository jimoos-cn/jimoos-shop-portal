/**
 * 规格选择器
 * @author: keepcleargas
 */
<template>
  <div>
    <a-form-item label="规格选择">
      <a-select style="width: 200px" placeholder="请选择" @change="handleAttrSelect" label-in-value :disabled="editFlag">
        <a-select-option v-for="item in attrList" :key="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <AttrItem
      ref="attrItem"
      v-for="item in attrSelectedList"
      :attr="item"
      :key="item.id"
      @attrValuesChange="handleAttrValuesChange"
      @deleteAttr="handleAttrRemove"
      :edit-flag="editFlag"
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
  props: {
    editFlag: {
      type: Boolean,
      default: false
    }
  },
  created () {
    getProductAttrPage({
      offset: 0,
      limit: 9999
    }).then((res) => {
      this.attrList = res['list'].filter((attr) => attr.id !== 1)
      this.changeValue()
    })
  },
  methods: {
    changeValue () {
      if (this.attrList.length > 0) {
        const ids = []
        if (this.attrSelectedList.length > 0) {
          this.attrSelectedList.forEach(item => {
            ids.push(item.id)
          })
        }
        this.attrList = this.attrList.filter(item => !ids.includes(item.id))
      }
    },
    setContent (allSku) {
      const attrs = allSku[0].attrs
      // 保存leaf
      const map = new Map()
      attrs.forEach(item => {
        const one = {
          id: item.attrId,
          name: item.attrName
        }
        const list = []
        map.set(item.attrId, list)
        this.attrSelectedList.push(one)
      })
      allSku.forEach(item => {
        item.attrs.forEach(attr => {
          const list = map.get(attr.attrId)
          const param = {
            id: attr.attrValueId,
            name: attr.attrValueName
          }
          list.push(param)
        })
      })
      this.$nextTick(() => {
        const hash = {}
        this.attrSelectedList.forEach((item, index) => {
          let list = map.get(item.id)
          // 去重
          list = list.reduce((item, next) => {
            // eslint-disable-next-line no-unused-expressions
            hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
            return item
          }, [])
          this.$refs.attrItem[index].setContent(list)
          this.attrValuesList.push({
            id: item.id,
            name: item.name,
            leaf: list
          })
        })
      })
    },
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
          this.changeValue()
        }
      }
    },
    handleAttrRemove (id) {
      console.log('remove attr id:' + id)
      const that = this
      const attrSelectedList = this.attrSelectedList.filter((attr) => {
        if (attr.id === id) {
          that.attrList.push(attr)
        }
        if (attr.id !== id) {
          return attr
        }
      })
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
