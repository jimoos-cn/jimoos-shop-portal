<template>
  <div class="account-settings-info-view">
    <a-list itemLayout="horizontal">
      <a-list-item>
        <a-list-item-meta>
          <template v-slot:title>
            <a>开发者模式</a>
          </template>
          <template v-slot:description>
            <span>
              开启开发者模式后，可以对商城应用进行开发设置。普通用户请勿开启。
            </span>
          </template>
        </a-list-item-meta>
        <template v-slot:actions>
          <a-switch
            @change="handleDebug"
            v-model="debugState"
            checked-children="开启"
            un-checked-children="关闭"
            v-decorator="['status', { initialValue: false, valuePropName: 'checked' }]"
          />
        </template>
      </a-list-item>
    </a-list>
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
