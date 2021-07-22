<!-- 可关闭的标签带弹框确认 -->
<template>
  <a-tag
    :visible="visible"
    @close="preClose"
    v-bind="$props"
    closable>
    <slot name="showText"></slot>
  </a-tag>
</template>
<script>

  export default {
    name: 'DTag',
    data () {
      return {
       visible: true
      }
    },
    props: {
      index: {
        type: Number,
        default: 0
      },
      item: {
        type: Object,
        default: null
      },
      color: {
        type: String,
        default: ''
      },
      closeTag: {
        type: Function,
        required: true
      },
      refresh: {
        type: Function,
        required: true
      }
    },
    methods: {
      preClose (e) {
        e.preventDefault()
        const that = this
        this.$confirm({
          title: '确认提示',
          content: `是否去除此标签`,
          okType: 'danger',
          onOk () {
            that.closeTag(that.item)
            .then(res => {
              console.log(that.item)
              that.refresh()
              that.visible = false
            })
            .catch(err => {
              that.visible = true
              console.log(err)
            })
          }
        })
      }
    }
  }
</script>
