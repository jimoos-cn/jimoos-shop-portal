<!-- 商品编辑 -->
<template>
  <page-header-wrapper :title="productDetail.name">
    <a-card class="base_page">
      <template slot="title">
        <strong style="color: black">商品信息</strong>
      </template>
      <a-descriptions size="middle" :column="2">
        <a-descriptions-item label="商品编号">{{ productDetail.id }}</a-descriptions-item>
        <a-descriptions-item label="商品分类">{{ productDetail.category.name }}</a-descriptions-item>
        <a-descriptions-item label="运营销量">{{ productDetail.fakeSales }}</a-descriptions-item>

        <a-descriptions-item label="商品价格">
          <span v-if="!productDetail.price" style="color:rgba(0,0,0,0.65);">未知</span>
          <span
            v-else-if="productDetail.price < productDetail.showPrice"
            style="color:rgba(0,0,0,0.65);"
          >￥{{ productDetail.price }}~￥{{ productDetail.showPrice }}</span
          >
          <span v-else-if="productDetail.price === productDetail.showPrice" style="color:rgba(0,0,0,0.65);">￥{{ productDetail.lowPrice }}</span>
        </a-descriptions-item>

        <a-descriptions-item label="商品状态">
          <a-badge status="error" v-if="productDetail.status === 0" text="未上架"></a-badge>
          <a-badge status="success" v-else text="已上架"></a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="商品标签">
          <a-tag v-for="tag in productDetail.tags" :key="tag.id" :color="tag.color">{{ tag.name }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ $dateFormat(productDetail.createAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card class="base_page" style="margin-top:24px">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="基本信息" key="1">
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
            <a-row type="flex" justify="start">
              <a-col :span="6">
                <a-form-item label="商品封面" :labelCol="{ lg: { span: 8 }, sm: { span: 8 } }" :wrapperCol="{ lg: { span: 16 }, sm: { span: 16 } }">
                  <sf-simple-upload
                    @input="updateCover"
                    :uploadType="0"
                    v-decorator="['cover', { rules: [{ required: true, message: '商品封面必须填写' }] }]"
                  ></sf-simple-upload>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="商品banner" :labelCol="{ lg: { span: 8 }, sm: { span: 8 } }" :wrapperCol="{ lg: { span: 16 }, sm: { span: 16 } }">
                  <sf-simple-upload
                    @input="updateBanner"
                    :uploadType="0"
                    v-decorator="['bannerUrls']"
                  ></sf-simple-upload>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="商品视频" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <sf-simple-upload @input="updateVideoUrl" :uploadType="1" v-decorator="['videoUrl']"></sf-simple-upload>
            </a-form-item>
            <a-form-item label="商品详情" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <WangEditorExt @change="changeWang" :value="productDetail.text" ref="editor"/>
              <WangEditorExt v-show="false" @change="changeWang" :value="productDetail.text" ref="editor" v-decorator="['text']"/>
            </a-form-item>
          </a-form>
          <!-- fixed footer toolbar -->
          <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
            <a-space>
              <a-button>取消</a-button>
              <a-button type="primary" @click="editProduct">修改</a-button>
            </a-space>
          </footer-tool-bar>
        </a-tab-pane>
        <a-tab-pane tab="产品参数" key="2">
          <edit-sku :product="productDetail" :allSku="skus" :visible="skuVisible"></edit-sku>
        </a-tab-pane>
      </a-tabs>
    </a-card>

  </page-header-wrapper>
</template>

<script>
  import storage from 'store'
  import ImagePreview from '@/components/Image/ImagePreview'
  import { getProductSkus, updateProductInfo } from '@/api/product/index'
  import DTag from '@/views/product/product/modules/DeleteTag'
  import AddTag from '@/views/product/product/modules/AddTag'
  import EditSku from '@/views/product/product/modules/EditSku'
  import WangEditorExt from '@/components/Editor/WangEditorExt'
  import { getProductCategoryPage } from '@/api/product/category'
  import showAttr from '@/views/product/attr/showAttr'
  import SfSimpleUpload from '@/components/Upload/SimpleUploadWrapper'
  import { getProductTagPage } from '@/api/product/tag'
  import { baseMixin } from '@/store/app-mixin'
  import FooterToolBar from '@/components/FooterToolbar'
  import pick from 'lodash.pick'
  // 表单字段
  // eslint-disable-next-line no-unused-vars
  const fields = ['name', 'categoryId', 'tagIds', 'fakeSales', 'sort', 'cover', 'bannerUrls', 'videoUrl', 'text']
  export default {
    mixins: [baseMixin],
    data () {
      return {
        labelCol: { lg: { span: 2 }, sm: { span: 2 } },
        wrapperCol: { lg: { span: 10 }, sm: { span: 10 } },
        form: this.$form.createForm(this),
        productDetail: {},
        productType: [],
        categoryList: [],
        dataTags: [],
        skuVisible: false,
        skus: []
      }
    },
    components: {
      storage,
      ImagePreview,
      DTag,
      AddTag,
      EditSku,
      WangEditorExt,
      showAttr,
      SfSimpleUpload,
      FooterToolBar
    },
    created () {
      this.init()
    },
    methods: {
      // 初始化
      init () {
        const params = {
          offset: 0,
          limit: 99999
        }
        this.getTags(params)
        this.getCategories(params)
        this.getSkus({ id: this.$route.query.id })
        this.getProductType(params)
        this.productDetail = storage.get('productDetail')
        this.$nextTick(() => {
          fields.forEach(v => this.form.getFieldDecorator(v))
          this.form.setFieldsValue(pick(this.productDetail, fields))
          const ids = []
          for (const i in this.productDetail.tags) {
            ids.push(this.productDetail.tags[i].id)
          }
          this.form.setFieldsValue({ tagIds: ids })
          this.form.setFieldsValue({ text: this.productDetail.text })
          console.log(this.productDetail.text)
        })
        console.log(this.form)
      },
      // 获取商品类别
      getProductType (params) {
        getProductCategoryPage(params).then(res => {
          this.productType = res['list']
        })
      },
      // 获取当前的skus
      getSkus (param) {
        getProductSkus(param)
          .then((res) => {
            this.skus = res
            this.skuVisible = true
          })
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
      updateCover (url) {
        this.form.setFieldsValue({ cover: url })
      },
      updateBanner (url) {
        this.form.setFieldsValue({ bannerUrls: url })
      },
      updateVideoUrl (url) {
        this.form.setFieldsValue({ videoUrl: url })
      },
      // 更新 wangEditor
      changeWang (val) {
        this.form.setFieldsValue({ text: val })
      },
      wtf () {
        console.log('wwww')
      },
      editProduct () {
        const {
          form: { validateFields }
        } = this
        validateFields((err, values) => {
          if (!err) {
            values.id = this.productDetail.id
            updateProductInfo(values)
              .then(res => {
                this.$message.success('修改成功')
                this.$router.push({
                  name: 'productList'
                })
              })
              .catch(err => {
                this.$message.error(err)
              })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .canbeClick{
    cursor:pointer;
    filter: grayscale(1);
  }
  .clickPrice{
    cursor:pointer;
    color: #909399;
  }
  .choosePrice{
    color: #ffffff;
    background: #1890ff;
  }
  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;
    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }
</style>
