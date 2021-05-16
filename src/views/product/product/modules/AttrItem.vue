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
        <a-popconfirm title="删除该销售规格？" ok-text="是" cancel-text="取消" @confirm="deleteAttr">
          <a style="color: red">删除</a>
        </a-popconfirm>
      </a-space>
    </div>
    <div class="attr-value-row">
      <a-space>
        <b><span>规格值:</span></b>
        <span>
          <a-tag v-for="item in attrValues" :key="item.id" closable @close="removeTag(item.id)">
            {{ item.name }}
          </a-tag>
        </span>
        <span>
          <a-popover placement="bottom" trigger="click">
            <template slot="content">
              <a-select mode="tags" style="width: 100%" placeholder="Tags Mode" @change="handleChange">
                <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                  {{ (i + 9).toString(36) + i }}
                </a-select-option>
              </a-select>
            </template>
            <a-button>Right</a-button>
          </a-popover>
        </span>
      </a-space>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttrItem',
  props: {
    attr: {
      type: Object,
      required: true
    }
  },
  created () {
    console.log('attr:' + JSON.stringify(this.attr))
  },
  data () {
    return {
      attrValues: [
        {
          id: 1,
          name: 'xl'
        }
      ]
    }
  },
  methods: {
    removeTag (key) {
      console.log('key:' + key)
      const attrValues = this.attrValues.filter((attrValue) => attrValue.id !== key)
      this.attrValues = attrValues
    },
    deleteAttr () {
      this.$emit('deleteAttr', this.attr.id)
    },
    handleChange (value) {
      console.log(`selected ${value}`)
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
