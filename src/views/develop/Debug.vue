<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical">
          <a-form-item label="是否开启开发者配置">
            <a-switch
              @change="handleDebug"
              v-model="debugState"
              checked-children="开启"
              un-checked-children="关闭"
              v-decorator="['status', { initialValue: false, valuePropName: 'checked' }]"
            />
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  mounted () {
    this.getDebugState().then((res) => {
      this.debugState = res
    })
  },
  data () {
    return {
      debugState: false
    }
  },
  methods: {
    ...mapActions(['getDebugState', 'setDebugState']),
    handleDebug (checked) {
      this.setDebugState(checked).then(() => {
        window.location.reload()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.setting-description {
  padding: 0 20px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
