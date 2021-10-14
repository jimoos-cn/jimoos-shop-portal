/**
 * attr 值选择
 * @author keepcleargas
 */
<template>
  <div v-if="attr">
    <div class="attr-row">
      <a-space>
        <b><span>规格名:</span></b>
        <span class="ant-form-text"> {{ attr.name }} </span>
        <a-popconfirm v-if="!editFlag" title="删除该销售规格？" ok-text="是" cancel-text="取消" @confirm="deleteAttr">
          <a style="color: red">删除</a>
        </a-popconfirm>
      </a-space>
    </div>
    <div class="attr-value-row">
      <a-space>
        <b><span>规格值:</span></b>
        <span>
          <a-tag v-for="item in attrValuesSelected" :key="item.id" closable @close="removeTag(item.id)">
            {{ item.name }}
          </a-tag>
        </span>
        <span>
          <a-popover placement="bottom" trigger="click" width="300px">
            <template slot="content">
              <a-select
                mode="tags"
                v-model="tempAttrValues"
                style="width: 200px"
                placeholder="选择属性值"
                @blur="handleLeave"
              >
                <a-select-option v-for="item in attrValues" :key="item.id.toString()">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </template>
            <a-button type="primary" icon="plus-circle" size="small" ghost></a-button>
          </a-popover>
        </span>
      </a-space>
    </div>
  </div>
</template>

<script>
import { addAttrValue, getProductAttrValues } from '@/api/product/attr'

export default {
  name: 'AttrItem',
  props: {
    attr: {
      type: Object,
      required: true
    },
    editFlag: {
      type: Boolean,
      default: false
    }
  },
  created () {
    console.log('attr id:' + this.attr.id)
    getProductAttrValues({ id: this.attr.id }).then((res) => {
      const attrValues = []
      res.forEach((item) => {
        attrValues.push({
          id: item.id,
          name: item.name
        })
      })
      this.attrValues = attrValues
      this.changeValue()
    })
  },
  data () {
    return {
      attrValues: [],
      attrValuesSelected: [],
      tempAttrValues: undefined
    }
  },
  methods: {
    changeValue () {
      if (this.attrValues.length > 0) {
        const names = []
        if (this.attrValuesSelected.length > 0) {
          this.attrValuesSelected.forEach(item => {
            names.push(item.name)
          })
        }
        this.attrValues = this.attrValues.filter(item => !names.includes(item.name))
      }
    },
    setContent (val) {
      this.attrValuesSelected = val
    },
    removeTag (key) {
      const that = this
      console.log('key:' + key)
      const attrValuesSelected = this.attrValuesSelected.filter((attrValue) => {
        if (attrValue.id === key) {
          that.attrValues.push(attrValue)
        }
        if (attrValue.id !== key) {
          return attrValue
        }
      })
      this.attrValuesSelected = attrValuesSelected
      this.pubChangeEvent()
    },
    deleteAttr () {
      this.$emit('deleteAttr', this.attr.id)
    },
    async handleLeave () {
      if (this.tempAttrValues) {
        const attrValueIds = this.tempAttrValues.toString().split(',')
        console.log('values' + attrValueIds)
        let flag = false
        await attrValueIds.forEach(async (item) => {
          console.log('item:' + item)
          if (!this.attrValuesSelected.some((e) => e.id.toString() === item)) {
            const attrValueObjects = this.attrValues.filter((attrValue) => attrValue.id.toString() === item)
            if (attrValueObjects && attrValueObjects.length > 0) {
              console.log('hashItem:' + attrValueObjects)
              this.attrValuesSelected.push(attrValueObjects[0])
              flag = true
            } else {
              if (item !== '') {
                // 添加 属性值添加
                await addAttrValue({
                  attrId: this.attr.id,
                  name: item,
                  description: '快速添加',
                  sort: 100
                }).then((res) => {
                  const item = {
                    id: res.id,
                    name: res.name
                  }
                  this.attrValuesSelected.push(item)
                  this.attrValues.push(item)
                  this.pubChangeEvent()
                })
              }
            }
          }
        })
        if (flag) {
          this.pubChangeEvent()
        }
        this.changeValue()
        console.log('selected:' + this.attrValuesSelected)
      }
      this.tempAttrValues = undefined
    },
    pubChangeEvent () {
      this.$emit('attrValuesChange', {
        id: this.attr.id,
        name: this.attr.name,
        leaf: this.attrValuesSelected
      })
    }
  }
}
</script>

<style>
.attr-row {
  margin-top: 10px;
}
.attr-value-row {
  margin-top: 10px;
}
</style>
