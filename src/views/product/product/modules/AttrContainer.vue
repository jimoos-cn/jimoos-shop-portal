/**
 * 规格选择器
 * @author: keepcleargas
 */
<template>
  <div>
    <!-- <a-form-item label="规格选择">
      <a-select :size="20" default-value="a1" style="width: 200px">
        <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
          {{ (i + 9).toString(36) + i }}
        </a-select-option>
      </a-select>
    </a-form-item> -->

    <AttrItem v-for="item in attrList" :attr="item" :key="item.id" @deleteAttr="handleAttrRemove"> </AttrItem>
  </div>
</template>

<script>
import AttrItem from './AttrItem'
export default {
  name: 'AttrContainer',
  components: {
    AttrItem
  },
  data () {
    return {
      attrList: [
        {
          id: 16,
          name: '颜色卡'
        }
      ]
    }
  },
  methods: {
    handleAttrRemove (id) {
      console.log('remove attr id:' + id)
      const attrList = this.attrList.filter((attr) => attr.id !== id)
      this.attrList = attrList
    }
  }
}
</script>

<style>
</style>
