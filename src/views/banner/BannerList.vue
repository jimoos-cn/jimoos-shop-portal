<!-- 广告栏页面 -->
<template>
  <page-header-wrapper>
    <template slot="title">
      <span>广告栏列表</span>
      <a-button @click="gotoAddBanner" style="margin-left: 40px" type="primary">添加</a-button>
    </template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="search.title" placeholder="请输入广告栏标题" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="search.status" placeholder="请输入订单状态">
                  <a-select-option :value="0">未上架</a-select-option>
                  <a-select-option :value="1">已上架</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="位置">
                  <a-select v-model="search.position" placeholder="请输入位置">
                    <a-select-option
                      v-for="item in position"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.desc }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <!-- 查询，重置 -->
            <a-col a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" icon="search" @click="query">查询</a-button>
                <a-button style="margin-left: 8px" icon="redo" @click="reset">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        :rowKey="(record) => record.id"
      >
        <div slot="imgUrl" slot-scope="text">
          <image-preview :img="text" :smallWidth="48" :bigWidth="400" :proportion="1" v-if="text"></image-preview>
        </div>
        <div slot="status" slot-scope="text">
          <a-badge status="success" v-if="text" text="已上架"></a-badge>
          <a-badge status="error" v-else text="未上架"></a-badge>
        </div>
        <div slot="createAt" slot-scope="record">
          {{ $dateFormat(record) }}
        </div>
        <span slot="action" slot-scope="text, record">
          <a @click="gotoBannerDetail(record)">详情</a>
          <a-popconfirm v-if="!record.status" title="确认上架" @confirm="upBanner(record)">
            <a style="margin-left: 10px">上架</a>
          </a-popconfirm>
          <a-popconfirm v-if="record.status" title="确认下架" @confirm="downBanner(record)">
            <a v-if="record.status" style="margin-left: 10px">下架</a>
          </a-popconfirm>
          <a-popconfirm title="确认删除广告栏" @confirm="deleteBanner(record)">
            <a style="color: red; margin-left: 10px">删除</a>
          </a-popconfirm>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import ImagePreview from '@/components/Image/ImagePreview'
  import { STable } from '@/components'
  import { getBannerPage, putOnBanner, deleteBanner, offShelfBanner } from '@/api/banner'
  import { BANNER_POSITION } from '@/views/banner/enum/BannerConstant'
  const columns = [
    {
      title: '广告栏Id',
      dataIndex: 'id',
      width: '100px'
    },
    {
      title: '广告栏标题',
      dataIndex: 'title'
    },
    {
      title: '广告图片',
      dataIndex: 'imgUrl',
      scopedSlots: {
        customRender: 'imgUrl'
      },
      width: '120px'
    },
    {
      title: '发布状态',
      dataIndex: 'status',
      scopedSlots: {
        customRender: 'status'
      },
      width: '120px'
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      scopedSlots: {
        customRender: 'createAt'
      }
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: '200px',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ]
  export default {
    components: {
      STable,
      ImagePreview
    },
    data () {
      this.columns = columns
      this.position = BANNER_POSITION
      return {
        canEdit: false,
        categoryList: [], // 分类列表
        advanced: false, // 高级搜索 展开/关闭
        // 查询条件参数
        search: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: (parameter) => {
          const requestParameters = Object.assign({}, parameter, this.search)
          console.log('loadData request parameters:', requestParameters)
          const params = {
            offset: (requestParameters.pageNo - 1) * requestParameters.pageSize,
            limit: requestParameters.pageSize,
            type: 0
          }
          Object.keys(this.search).forEach((key) => {
            if (this.search[key] !== undefined && this.search[key] != null && this.search[key] !== '') {
              params[key] = this.search[key]
            }
          })
          let dataTable = {}
          return this.queryData(params).then((res) => {
            console.log('表格获取数据', res)
            dataTable = {
              pageSize: requestParameters.pageSize,
              pageNo: requestParameters.pageNo,
              totalCount: res.total,
              data: res.list
            }
            return dataTable
          })
        }
      }
    },
    methods: {
      gotoAddBanner () {
        this.$router.push({
          name: 'bannerAdd'
        })
      },
      // async返回Promise对象
      async queryData (param) {
        return getBannerPage(param)
      },
      // 前往banner详细页面
      gotoBannerDetail (record) {
        this.$storage.set('banner', record)
        this.$router.push({
          name: 'bannerDetail'
        })
      },
      // 删除某banner
      async deleteBanner (record) {
        await deleteBanner(record)
        this.query()
      },
      // 上架
      async upBanner (record) {
        await putOnBanner(record)
        this.query()
      },
      // 下架
      async downBanner (record) {
        await offShelfBanner(record)
        this.query()
      },
      // 查询
      query () {
        this.$refs.table.refresh(true)
      },
      // 重置
      reset () {
        this.search = {}
        this.$refs.table.refresh(true)
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      }
    }
  }
</script>
