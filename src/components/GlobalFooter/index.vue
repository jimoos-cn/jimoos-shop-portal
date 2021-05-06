<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://forum.jimoos.cn/" target="_blank">论坛支持</a>
      <a href="https://github.com/jimoos-cn/jimoos-shop-server" target="_blank">Github</a>
      <a href="https://github.com/keepcleargas" target="_blank">@keepcleargas</a>
    </template>
    <template v-slot:copyright>
      <a href="https://jimoos.cn" target="_blank">积墨开源</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
