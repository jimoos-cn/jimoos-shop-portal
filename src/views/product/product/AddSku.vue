<template>
  <div>sku

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-space>
        <a-button type="default" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">提交</a-button>
      </a-space>
    </footer-tool-bar>
    </a-form>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'AddProduct',
  mixins: [baseMixin],
  components: {
    FooterToolBar
  },
  methods: {
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          console.log('表单 values', values)
          that.timer = setTimeout(function () {
            that.loading = false
            that.$emit('nextStep')
          }, 1500)
        } else {
          that.loading = false
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    }
  }
}
</script>

<style>
</style>
