<!-- 修改商品基本信息 -->
<template>
  <a-form :form="form" title="商品信息" style="margin: 40px auto 0">
    <h3 class="item-group-header">基本信息</h3>
    <a-form-item label="商品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input placeholder=" 请输入商品名称" v-decorator="['name', { rules: [{ required: true, message: '商品名称必须填写' }] }]"> </a-input>
    </a-form-item>
    <a-form-item label="商品分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
        v-decorator="['fakeSales', { initialValue: '0', rules: [{ required: true, message: '运营销量必须填写' }] }]"
        :max="9999999"
        :min="0"
        :default-value="0"
        placeholder="请输入运营销量"
        style="width:100%"
      />
    </a-form-item>
    <a-form-item label="商品排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input-number
        v-decorator="['sort', { initialValue: '100' }]"
        :max="9999999"
        :min="0"
        :default-value="100"
        placeholder="请输入商品排序"
        style="width:100%"
      />
    </a-form-item>
    <a-form-item label="商品属性" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-table :columns="columns" :dataSource="specification" :pagination="false" :loading="memberLoading">
        <template v-for="(col, i) in ['specKey', 'specValue', 'sort']" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            @change="e => handleChange(e.target.value, record.uid, col)"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.uid)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.uid)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.uid)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">添加</a-button>
    </a-form-item>
    <a-form-item label="商品封面" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <SimpleUploadWrapper
        @input="updateCover"
        :uploadType="0"
        v-decorator="['cover', { rules: [{ required: true, message: '商品封面必须填写' }] }]"
      ></SimpleUploadWrapper>
    </a-form-item>
    <a-form-item label="商品图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <list-upload-wrapper @input="updateBanner" ref="listUpload" :uploadType="0" :length="9" v-decorator="['bannerUrls']"></list-upload-wrapper>
    </a-form-item>
    <a-form-item label="商品视频" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <SimpleUploadWrapper @input="updateVideoUrl" :uploadType="1" v-decorator="['videoUrl']"></SimpleUploadWrapper>
    </a-form-item>
    <a-form-item label="商品详情" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <WangEditor @change="changeWang" ref="editor" v-decorator="['text', { rules: [{ required: true, message: '商品详情必须填写' }] }]" />
    </a-form-item>
    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button @click="cancelSaveProduct">取消</a-button>
      <a-button style="margin-left: 10px" type="primary" @click="nextStep">修改</a-button>
    </footer-tool-bar>
  </a-form>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import WangEditor from '@/components/Editor/WangEditorExt'
import SimpleUploadWrapper from '@/components/Upload/SimpleUploadWrapper'
import ListUploadWrapper from '@/components/Upload/ListUploadWrapper'
import { getProductCategoryPage } from '@/api/product/category'
import { getProductTagPage } from '@/api/product/tag'
import { updateProduct } from '@/api/product'
import pick from 'lodash.pick'
const fields = ['name', 'categoryId', 'tagIds', 'fakeSales', 'sort', 'cover', 'bannerUrls', 'videoUrl', 'text', 'id']
export default {
  name: 'AddProductInfo',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    WangEditor,
    SimpleUploadWrapper,
    ListUploadWrapper
  },
  props: {
    product: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      labelCol: { lg: { span: 2 }, sm: { span: 2 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 10 } },
      form: this.$form.createForm(this),
      categoryList: [],
      dataTags: [],
      memberLoading: false,
      uid: 1,
      columns: [
        {
          title: '属性名',
          dataIndex: 'specKey',
          key: 'specKey',
          width: '20%',
          scopedSlots: { customRender: 'specKey' }
        },
        {
          title: '属性值',
          dataIndex: 'specValue',
          key: 'specValue',
          width: '20%',
          scopedSlots: { customRender: 'specValue' }
        },
        {
          title: '排序',
          dataIndex: 'sort',
          key: 'sort',
          width: '40%',
          scopedSlots: { customRender: 'sort' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      specification: []
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
      this.initProduct()
    },
    handleChange (value, key, column) {
      const newData = [...this.specification]
      const target = newData.find(item => key === item.uid)
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    // 获取商品详情
    initProduct () {
      const that = this
      this.$nextTick(() => {
        // 初始化表单
        that.$refs.editor.setContent(that.product.text)
        that.$refs.listUpload.setContent(that.product.bannerUrls)
        fields.forEach(v => that.form.getFieldDecorator(v))
        that.form.setFieldsValue(pick(that.product, fields))
        const ids = []
        for (const i in that.product.tags) {
          ids.push(that.product.tags[i].id)
        }
        that.form.setFieldsValue({ tagIds: ids })
        // 设置属性值
        that.specification = that.product.specs
        that.specification.forEach(item => {
          item.uid = that.uid++
          that.$set(item, 'editable', false)
        })
      })
    },
    saveRow (record) {
      console.log(record)
      this.memberLoading = true
      const { specKey, specValue, sort, uid } = record
      if (!specKey || !specValue || !sort) {
        this.memberLoading = false
        this.$message.error('请填写完整成员信息。')
        return
      }
      const target = this.specification.find(item => item.uid === uid)
      target.editable = false
      this.memberLoading = false
    },
    newMember () {
      const newData = {
        uid: ++this.uid,
        specKey: '',
        specValue: '',
        sort: 100,
        editable: true
      }
      this.specification.push(newData)
    },
    remove (uid) {
      this.specification = this.specification.filter(item => item.uid !== uid)
    },
    toggle (uid) {
      const target = this.specification.find(item => item.uid === uid)
      console.log(target)
      target.editable = true
    },
    cancel (uid) {
      const target = this.specification.find(item => item.uid === uid)
      target.editable = false
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
      const that = this
      const {
        form: { validateFields }
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          // 校验无误 调用父类保存数据
          const specifications = this.specification.filter(item => item.editable === false && item.specKey !== '' && item.specValue !== '')
          values.specifications = specifications
          values.id = that.product.id
          Object.assign(this.product, values)
          updateProduct(this.product).then(res => {
            this.$message.success('修改成功')
            this.cancelSaveProduct()
          })
        }
      })
    },
    cancelSaveProduct () {
      this.$router.push({ name: 'product-management' })
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
