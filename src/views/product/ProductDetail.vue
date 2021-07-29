<template>
  <page-header-wrapper>
    <a-row>
      <a-col :sm="24" :md="8">
        <a-card>
          <a-row type="flex" justify="center">
            <span class="hendline">商品图片</span>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 10px">
            <image-preview :img="productDetail.cover" :smallWidth="256" :bigWidth="400" :proportion="1" v-if="defaultPic"></image-preview>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-col
              :sm="12"
              :md="6"
              :key="index"
              v-for="(item,index) in Pic">
              <a-card :class="{'canbeClick':index != selectedIndex}" @click="changePre(index)">
                <img :src="item" width="64" height="64" alt="浏览">
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="16">
        <a-card>
          <a-descriptions title="详细" bordered>
            <a-descriptions-item label="商品名">
              <div @click="editProductNameMe" v-if="editList.chooseType !== 'Name' ">{{ productDetail.name }}</div>
              <div v-else>
                <a-input style="width: 160px" v-model="editList.editContent" @blur="blurProductName"></a-input>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="商品类型">
              <a-tag @click="editProductTypeMe" v-if="editList.chooseType !== 'Type'" color="green">
                {{ productDetail.category.name }}
              </a-tag>
              <div v-else>
                <a-select v-model="editList.editContent">
                  <a-select-option
                    v-for="item in productType"
                    :key="item.id"
                    :value="item.id"
                    @blur="blurProductType(item)">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
                <a-button @click="blurProductType" type="primary" style="margin-left: 5px" size="small" shape="circle">√</a-button>
                <a-button @click="editList.chooseType = ''" style="margin-left: 5px" size="small" shape="circle">×</a-button>
              </div>

            </a-descriptions-item>
            <a-descriptions-item label="运营销量">
              <div @click="editProductNumMe" v-if="editList.chooseType !== 'Num'">{{ productDetail.fakeSales }}</div>
              <div v-else>
                <a-input type="number" style="width: 60px" v-model="editList.editContent" @blur="blurProductfakeSales"></a-input>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              {{ $dateFormat(productDetail.createAt) }}
            </a-descriptions-item>
            <a-descriptions-item label="修改时间" :span="2">
              <span v-if="productDetail.updateAt != 0">
                {{ $dateFormat(productDetail.updateAt) }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="商品状态" :span="3">
              <a-badge v-if="productDetail.status === 2" status="success" text="上架中" />
              <a-badge v-else-if="productDetail.status === 1" status="processing" text="未审核" />
              <a-badge v-else-if="productDetail.status === 3" status="warning" text="未通过" />
              <a-badge v-else status="error" text="下架"/>
            </a-descriptions-item>
            <a-descriptions-item label="标签" :span="3">
              <d-tag
                v-for="(item,index) in productDetail.tags"
                :key="item.id"
                :item="item"
                :index="index"
                :color="item.color"
                :closeTag="closeProductTag"
                :refresh="refreshTag"
              >
                <template slot="showText"> {{ item.name }} </template>
              </d-tag>
              <a-button size="small" shape="circle" type="primary" @click="addVisible = true">+</a-button>
            </a-descriptions-item>
            <a-descriptions-item label="规格" :span="3">
              <d-tag
                v-for="(item,index) in skus"
                :key="item.id"
                :item="item"
                :index="index"
                :closeTag="closeProductAttr"
                :refresh="refreshAttr"
                :class="{'clickPrice':index !== skusIndex,'choosePrice':index === skusIndex}"
                @click.native="chooseSku(index)"
                v-if="skus"
              >
                <template slot="showText"> {{ item.attrs[0].attrValueName }} </template>
              </d-tag>
              <a-button size="small" shape="circle" type="primary" @click="editSkuVisible = true"><a-icon type="more" /></a-button>
            </a-descriptions-item>
            <a-descriptions-item label="真实价格" :span="1.5" v-if="skus.length > 0">
              <div style="color: red">￥{{ skus[skusIndex].price }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="显示价格" :span="2" v-if="skus.length > 0">
              <div style="color: red">￥{{ skus[skusIndex].showPrice }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="商品介绍">
              <div v-if="editList.chooseType !== 'Desciption' " v-html="productDetail.text" @click="editList.chooseType = 'Desciption'"></div>
              <div v-else>
                <WangEditorExt @change="changeWang" ref="editor" :value="productDetail.text" v-decorator="['text']"/>
                <a-row type="flex" justify="end">
                  <a-button style="margin-right: 10px" @click="editList.chooseType = ''">取消</a-button>
                  <a-button type="primary" @click="confirm">确认</a-button>
                </a-row>
              </div>
            </a-descriptions-item>
          </a-descriptions>
          <a-row v-if="editList.editFlag" type="flex" justify="end">
            <a-button style="margin-top: 10px;color: #ffffff;background: #4bc912" @click="saveProductEdit">保存修改</a-button>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <add-tag :visible.sync="addVisible" :productId="productDetail.id" :refresh="refreshTag"></add-tag>
    <edit-sku :visible.sync="editSkuVisible" :product="productDetail" :all-sku="skus" :refresh="refreshAttr"></edit-sku>
  </page-header-wrapper>
</template>

<script>
import storage from 'store'
import ImagePreview from '@/components/Image/ImagePreview'
// eslint-disable-next-line no-unused-vars
import { getProductSkus, updateProductInfo } from '@/api/product/index'
import DTag from '@/views/product/product/modules/DeleteTag'
import AddTag from '@/views/product/product/modules/AddTag'
import EditSku from '@/views/product/product/modules/EditSku'
import { deleteBoundValue, queryBoundValue } from '@/api/product/tag'
import { deleteSku } from '@/api/product/sku'
import WangEditorExt from '@/components/Editor/WangEditorExt'
import { getProductCategoryPage } from '@/api/product/category'
export default {
  data () {
    return {
      productDetail: {},
      defaultPic: '',
      Pic: [], // 商品所有相关图片
      selectedIndex: 0, // 选中的图片
      skus: [],
      skusIndex: 0, // 选中的规格
      addVisible: false, // tag添加model的显隐
      editSkuVisible: false, // 修改sku表的显隐
      editList: { // 商品编辑项目
        chooseType: '', // Desciption, Name, Type, Num
        editContent: null, // 修改的内容
        editFlag: false // 整体保存的按钮显隐
      },
      productType: []
    }
  },
  components: {
    storage,
    ImagePreview,
    DTag,
    AddTag,
    EditSku,
    WangEditorExt
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
      this.getSkus({ id: this.$route.query.id })
      this.productDetail = storage.get('productDetail')
      const { cover, bannerUrls } = this.productDetail
      this.defaultPic = cover
      this.Pic.push(cover, bannerUrls)
      this.getProductType(params)
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
      })
    },
    // Tag删除
    async closeProductTag (tag) {
      const param = Object.assign({}, { tagId: tag.id }, { productId: tag.productId })
      return deleteBoundValue(param)
    },
    // 刷新tag
    refreshTag () {
      const that = this
      queryBoundValue({ productId: that.productDetail.id })
      .then(res => {
        that.$set(that.productDetail, 'tags', res)
        storage.set('productDetail', that.productDetail)
        storage.set('product', that.productDetail)
      })
    },
    // Attr删除
    async closeProductAttr (attr) {
      const param = Object.assign({}, { id: attr.id })
      return deleteSku(param)
    },
    // 刷新Attr
    refreshAttr () {
      const that = this
      getProductSkus({ id: that.productDetail.id })
        .then(res => {
          that.skus = []
          that.skusIndex = 0
          console.log(res)
          that.skus = res
        })
      that.$forceUpdate()
    },
    // 改变商品浏览的图片
    changePre (val) {
      this.selectedIndex = val
      this.defaultPic = this.Pic[val]
    },
    // 改变所选的规格
    chooseSku (val) {
      this.skusIndex = val
    },
    // 文本内容改变
    changeWang (val) {
      this.editList.editContent = val
    },
    confirm () {
      if (this.productDetail.text !== this.editContent) {
        this.editFlag = true
      }
      this.productDetail.text = this.editList.editContent
      this.editList.chooseType = ''
    },
    editProductNameMe () {
      this.editList.chooseType = 'Name'
      this.editList.editContent = this.productDetail.name
    },
    blurProductName () {
      if (this.productDetail.name !== this.editList.editContent) {
        this.editList.editFlag = true
      }
      this.productDetail.name = this.editList.editContent
      this.editList.chooseType = ''
    },
    editProductNumMe () {
      this.editList.chooseType = 'Num'
      this.editList.editContent = this.productDetail.fakeSales
    },
    blurProductfakeSales () {
      if (this.productDetail.fakeSales !== this.editList.editContent) {
        this.editList.editFlag = true
      }
      this.productDetail.fakeSales = this.editList.editContent
      this.editList.chooseType = ''
    },
    editProductTypeMe () {
      this.editList.chooseType = 'Type'
      this.editList.editContent = this.productDetail.category.id
    },
    blurProductType () {
      if (this.productDetail.category.id !== this.editList.editContent) {
        this.editList.editFlag = true
      }
      this.productDetail.category = this.productType.filter(type => type.id === this.editList.editContent)[0]
      this.productDetail.categoryId = this.productDetail.category.id
      this.editList.chooseType = ''
    },
    saveProductEdit () {
      const param = JSON.parse(JSON.stringify(this.productDetail))
      param.tagIds = []
      for (const item of param.tags) {
        param.tagIds.push(item.id)
      }
      param.tags = null
      param.category = null
      console.log(param)
      updateProductInfo(param)
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
  }
}
</script>

<style scoped>
  .hendline{
    margin-bottom: 0;
    padding-right: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
  }
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

</style>
