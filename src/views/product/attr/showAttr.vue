<template>
  <a-table :columns="columns" :dataSource="skus" :pagination="false" bordered>
    <template slot="cover" slot-scope="text, record">
      <img id="upload-img-param-finish" v-if="record.cover" :src="record.cover" alt="avatar" style="width:150px;height:150px" />
    </template>
  </a-table>
</template>
<script>
  export default {
    data () {
      return {
        columns: [
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
    },
    props: {
      skus: {
        type: Array,
        default: null
      }
    },
    created () {
      console.log(this.skus)
      this.changeTableColumns(this.skus[0].attrs)
    },
    methods: {
      // 动态变化表格的column
      changeTableColumns (val) {
        const newColum = []
        for (let i = 0; i < val.length; i++) {
          newColum.push({
            title: val[i].attrName,
            align: 'center',
            dataIndex: 'attrs[' + i + '].attrValueName',
            scopedSlots: { customRender: 'attrs[' + i + '].attrValueName' }
          })
        }
        this.columns = [...newColum, ...this.columns]
      }
    }
  }
</script>
