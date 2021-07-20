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
              {{ productDetail.name }}
            </a-descriptions-item>
            <a-descriptions-item label="商品类型">
              <a-tag color="green">
                {{ productDetail.category.name }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="运营销量">
              {{ productDetail.fakeSales }}
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              {{ $dateFormat(productDetail.createAt) }}
            </a-descriptions-item>
            <a-descriptions-item label="修改时间" :span="2">
              {{ $dateFormat(productDetail.updateAt) }}
            </a-descriptions-item>
            <a-descriptions-item label="商品状态" :span="3">
              <a-badge v-if="productDetail.status === 2" status="success" text="上架中" />
              <a-badge v-else-if="productDetail.status === 1" status="processing" text="未审核" />
              <a-badge v-else-if="productDetail.status === 3" status="warning" text="未通过" />
              <a-badge v-else status="error" text="下架"/>
            </a-descriptions-item>
            <a-descriptions-item label="标签" :span="3">
              <a-tag
                v-for="(item,index) in productDetail.tags"
                :key="index"
                :color="item.color">{{ item.name }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="规格" :span="3">
              <a-tag
                :class="{'clickPrice':index !== skusIndex,'choosePrice':index === skusIndex}"
                @click="chooseSku(index)"
                v-if="skus"
                v-for="(item,index) in skus"
                :key="index">{{ item.attrs[0].attrValueName }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="真实价格" :span="1.5">
              <div style="color: red">￥{{ skus[skusIndex].price }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="显示价格" :span="2">
              <div style="color: red">￥{{ skus[skusIndex].showPrice }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="商品介绍">
              <div v-html="productDetail.text"></div>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import storage from 'store'
import ImagePreview from '@/components/Image/ImagePreview'
import { getProductSkus } from '@/api/product/index'
export default {
  data () {
    return {
      productDetail: {},
      defaultPic: '',
      Pic: [], // 商品所有相关图片
      selectedIndex: 0, // 选中的图片
      skus: [],
      skusIndex: 0 // 选中的规格
    }
  },
  components: {
    storage,
    ImagePreview
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.getSkus({ id: this.$route.query.id })
      this.productDetail = storage.get('productDetail')
      const { cover, bannerUrls } = this.productDetail
      this.defaultPic = cover
      this.Pic.push(cover, bannerUrls)
    },
    // 获取当前的skus
    getSkus (param) {
      getProductSkus(param)
      .then((res) => {
        this.skus = res
      })
    },
    // 改变商品浏览的图片
    changePre (val) {
      this.selectedIndex = val
      this.defaultPic = this.Pic[val]
    },
    // 改变所选的规格
    chooseSku (val) {
      this.skusIndex = val
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
    color: #1890ff;
  }

</style>
