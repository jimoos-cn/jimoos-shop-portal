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
      <a-form-item label="商品分类" :labelCol="labelCol" :wrapperCol="wrapperCol" >
        <a-select placeholder="请选择商品分类" v-decorator="['categoryId', { rules: [{ required: true, message: '商品分类必须选择' }] }]">
          <a-select-option v-for="(item, index) in categoryList" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select placeholder="请选择商品标签" mode="multiple" optionFilterProp="children" v-decorator="['tagIds']">
          <a-select-option v-for="(item, index) in dataTags" :key="index" :value="item.id">
            <span :style="{ color: item.color }">{{ item.name }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="运营销量" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input-number
          v-decorator="['fakeSales', {initialValue:'0', rules: [{ required: true, message: '运营销量必须填写' }] }]"
          :max="9999999"
          :min="0"
          :default-value="0"
          placeholder="请输入运营销量"
          style="width:100%" />
      </a-form-item>
      <a-form-item label="商品排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input-number
          v-decorator="['sort',{initialValue:'100'}]"
          :max="9999999"
          :min="0"
          :default-value="100"
          placeholder="请输入商品排序"
          style="width:100%" />
      </a-form-item>
      <a-form-item label="商品封面" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <sf-simple-upload
          @input="updateCover"
          :uploadType="0"
          v-decorator="['cover', { rules: [{ required: true, message: '商品封面必须填写' }] }]"
        ></sf-simple-upload>
      </a-form-item>
      <a-form-item label="商品视频" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <sf-simple-upload @input="updateVideoUrl" :uploadType="1" v-decorator="['videoUrl']"></sf-simple-upload>
      </a-form-item>
      <a-form-item label="商品详情" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <WangEditorExt @change="changeWang" ref="editor" v-decorator="['text', { rules: [{ required: true, message: '商品详情必须填写' }] }]"/>
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
import { getProductCategoryPage } from '@/api/product/category'
import { getProductTagPage } from '@/api/product/tag'
import WangEditorExt from '@/components/Editor/WangEditorExt'

export default {
  name: 'AddProductInfo',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    SfSimpleUpload,
    WangEditorExt
  },
  data () {
    return {
      labelCol: { lg: { span: 2 }, sm: { span: 2 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 10 } },
      form: this.$form.createForm(this),
      categoryList: [],
      dataTags: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const params = {
        offset: 0,
        limit: 99999
      }
      this.getCategories(params)
      this.getTags(params)
    },
     getCategories (params) {
      getProductCategoryPage(params).then(res => {
        this.categoryList = res['list']
      })
    },
    getTags (params) {
      getProductTagPage(params).then(res => {
        this.dataTags = res['list']
      })
    },
    nextStep () {
      const {
        form: { validateFields }
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          console.log('values:' + JSON.stringify(values))
          // 校验无误 调用父类保存数据
          this.$emit('change', values)
          this.$emit('nextStep')
        }
      })
    },
    cancelSaveProduct () {
      this.$router.push({ name: 'productList' })
    },
    updateCover (url) {
      this.form.setFieldsValue({ cover: url })
    },
    updateVideoUrl (url) {
      this.form.setFieldsValue({ videoUrl: url })
    },
    // 更新 wangEditor
    changeWang (val) {
      this.form.setFieldsValue({ text: val })
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
