<template>
  <div>
    <a-popover title="提示">
      <template slot="content">
        <p>点击图片放大预览</p>
      </template>
      <img
        :class="{ circle: this.circle }"
        :src="img"
        :style="{ width: smallHeight + 'px' }"
        @click="previewImg"
      />
    </a-popover>
    <!--预览图片对话框-->
    <a-modal :footer="null" :visible="visible" :destroyOnClose="true" @cancel="visible = false" title="预览图片">
      <img :class="{ circle: this.circle }" :src="img" :style="{ width: bigHeight + 'px'}" />
    </a-modal>
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
    smallHeight: {
      type: Number,
      default: 0
    },
    bigHeight: {
      type: Number,
      default: 0
    },
    img: {
      type: String,
      default: ''
    },
    circle: {
      type: Boolean,
      default: false
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

<style scoped>
.circle {
  border-radius: 50%;
}
</style>
