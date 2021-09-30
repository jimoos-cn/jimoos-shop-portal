<template>
  <a-table :columns="columns" :dataSource="skus" :pagination="false" bordered>
    <template slot="cover" slot-scope="text, record">
      <img id="upload-img-param-finish" v-if="record.cover" :src="record.cover" alt="avatar" style="width:150px;height:150px" />
    </template>
  </a-table>
</template>
<script>
  import { BASE_COLUMNS } from '@/views/product/skuTable/index'
  export default {
    data () {
      return {
        columns: BASE_COLUMNS
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
        this.columns = [...newColum, ...BASE_COLUMNS]
      }
    }
  }
</script>
