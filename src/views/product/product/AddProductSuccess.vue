<template>
  <div>
    <a-card style="margin-top: 24px; padding-bottom: 110px" :bordered="false" title="">
      <div style="width: 72px; height: 72px; margin: 112px auto 0">
        <img src="http://daole-home-1300066460.cos.ap-shanghai.myqcloud.com/1572924243419/success.png" />
      </div>
      <div style="text-align: center; margin-top: 20px">
        <span style="font-size: 24px; color: #000000; line-height: 32px">操作成功</span><br />
      </div>

      <div style="width: 185px; display: flex; justify-content: space-between; margin: 30px auto 0">
        <a-button type="primary" @click="$emit.push('reCreate')">继续添加</a-button>
        <a-button @click="$router.push({ name: 'productList' })">返回列表</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>
