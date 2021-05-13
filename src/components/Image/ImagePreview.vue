<template>
  <div>
    <a-tooltip>
      <template slot="title">
        <p>点击图片放大预览</p>
      </template>
      <img
        :src="img"
        :style="{ width: smallWidth + 'px', height: smallWidth * proportion + 'px' }"
        @click="previewImg"/>
    </a-tooltip>
    <!--预览图片对话框-->
    <a-modal :footer="null" :visible="visible" :destroyOnClose="true" @cancel="visible = false" title="预览图片">
      <img
        :src="img"
        :style="{ width: bigWidth + 'px', height: bigWidth * proportion + 'px' }"/></a-modal>
  </div>
</template>

<script>
export default {
  name: 'PreviewImg',
  props: {
    proportion: {
      type: Number,
      default: 1
    },
    smallWidth: {
      type: Number,
      default: 0
    },
    bigWidth: {
      type: Number,
      default: 0
    },
    img: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    previewImg () {
      this.visible = true
    }
  }
}
</script>

<style scoped></style>
