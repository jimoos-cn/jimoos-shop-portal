<template>
  <a-table :columns="columns" :dataSource="skus" :pagination="false" bordered>
    <template slot="cover" slot-scope="text, record">
      <img id="upload-img-param-finish" v-if="record.cover" :src="record.cover" alt="avatar" style="width:150px;height:150px" />
    </template>
  </a-table>
</template>
<script>
  export default {
    props: {
      skus: {
        type: Array,
        default: null
      }
    },
    created () {
      console.log(this.skus)
    },
    data () {
      return {
        columns: [
          {
            title: '属性值',
            dataIndex: 'attrs[0].attrValueName',
            key: 'attrs[0].attrValueName',
            scopedSlots: { customRender: 'attrs[0].attrValueName' }
          },
          {
            title: '价格(元)',
            dataIndex: 'price',
            key: 'price',
            scopedSlots: { customRender: 'price' }
          },
          {
            title: '展示价(元)',
            dataIndex: 'showPrice',
            key: 'showPrice',
            scopedSlots: { customRender: 'showPrice' }
          },
          {
            title: '图片',
            key: 'cover',
            dataIndex: 'cover',
            scopedSlots: { customRender: 'cover' }
          }
        ]
      }
    }
  }
</script>
