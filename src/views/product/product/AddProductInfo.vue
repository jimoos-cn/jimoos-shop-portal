<template>
  <div>
    <a-form :form="form" title="商品信息" style="margin: 40px auto 0">
      <h3 class="item-group-header">基本信息</h3>
      <a-form-item label="商品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder=" 请输入商品名称"
          v-decorator="['name', { rules: [{ required: true, message: '商品名称必须填写' }] }]"
        >
        </a-input>
      </a-form-item>
      <!-- <a-form-item label="商品分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select placeholder="请选择商品分类">
          <a-select-option v-for="(item, index) in categoryList" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select placeholder="请选择商品标签" mode="multiple" optionFilterProp="children">
          <a-select-option v-for="(item, index) in dataTags" :key="index" :value="item.id">
            <span :style="{ color: item.color }">{{ item.name }}</span>
          </a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item label="商品封面" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <sf-simple-upload
          @input="updateCover"
          :uploadType="0"
          v-decorator="['cover', { rules: [{ required: true, message: '商品封面必须填写' }] }]"
        ></sf-simple-upload>
      </a-form-item>
      <!-- fixed footer toolbar -->
      <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
        <a-space>
          <a-button @click="cancelSaveProduct">取消</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-space>
      </footer-tool-bar>
    </a-form>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import SfSimpleUpload from '@/components/Upload/SimpleUploadWrapper'

export default {
  name: 'AddProductInfo',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    SfSimpleUpload
  },
  data () {
    return {
      labelCol: { lg: { span: 2 }, sm: { span: 2 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 10 } },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    nextStep () {
      const {
        form: { validateFields }
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          console.log('values:' + JSON.stringify(values))
          this.$emit('nextStep')
        }
      })
    },
    cancelSaveProduct () {
      this.$router.push({ name: 'productList' })
    },
    updateCover (url) {
      this.form.setFieldsValue({ cover: url })
    }
  }
}
</script>

<style lang="less">
.item-group-header {
  margin-left: 4%;
  margin-bottom: 20px;
}
</style>
