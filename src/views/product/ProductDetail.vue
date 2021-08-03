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
          <a-descriptions title="商品图片">
            <a-descriptions-item span="4">
              <image-preview :img="defaultPic" :smallWidth="256" :bigWidth="400" :proportion="1" v-if="defaultPic"></image-preview>
            </a-descriptions-item >
            <a-descriptions-item>
              <span
                :key="index"
                v-for="(item,index) in Pic"
                :class="{'canbeClick':index != selectedIndex}"
                @click="changePre(index)">
                <img :src="item" width="64" height="64" alt="浏览">
              </span>
            </a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin-bottom: 32px"/>
          <a-descriptions title="商品视频">
            <a-descriptions-item v-if="productDetail.videoUrl">
              <video :src="productDetail.videoUrl" width="202px" height="202px" controls="controls" v-if="productDetail.videoUrl">
                <source :src="productDetail.videoUrl" type="video/mp4" />
                <source :src="productDetail.videoUrl" type="video/ogg" />
                您的浏览器不支持视频
              </video>
            </a-descriptions-item>
            <div>
              <div class="no-data"><a-icon type="frown-o"/>暂无数据</div>
            </div>
          </a-descriptions>
          <a-divider style="margin-bottom: 32px"/>
          <a-descriptions title="商品介绍">
            <a-descriptions-item v-if="productDetail.text">
              <div v-html="productDetail.text"></div>
            </a-descriptions-item>
            <div v-else>
              <div class="no-data"><a-icon type="frown-o"/>暂无数据</div>
            </div>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane tab="产品参数" key="2">
          <showAttr :skus="skus"></showAttr>
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
import { deleteBoundValue, queryBoundValue } from '@/api/product/tag'
import { deleteSku } from '@/api/product/sku'
import WangEditorExt from '@/components/Editor/WangEditorExt'
import { getProductCategoryPage } from '@/api/product/category'
import showAttr from '@/views/product/attr/showAttr'
export default {
  data () {
    return {
      productDetail: {},
      defaultPic: '',
      Pic: [], // 商品所有相关图片
      selectedIndex: 0, // 选中的图片
      skus: [],
      productType: []
    }
  },
  components: {
    storage,
    ImagePreview,
    DTag,
    AddTag,
    WangEditorExt,
    showAttr
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
    // 改变商品浏览的图片
    changePre (val) {
      this.selectedIndex = val
      this.defaultPic = this.Pic[val]
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
