<!-- banner路由 -->
<template>
  <page-header-wrapper>
    <template slot="title">
      <span>广告栏路由</span>
      <a-button @click="openAdd" style="margin-left: 40px" type="primary">添加</a-button>
    </template>
    <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }" :data-source="routeList">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card :title="item.description">
          <template slot="extra">
            <a @click.prevent="openEdit(item)">修改</a>
            <a-popconfirm title="确认删除广告栏" @confirm="deleteRoute(item)">
              <a style="color: red; margin-left: 20px">删除</a>
            </a-popconfirm>
          </template>
          <template slot=""></template>
          <a-row> 跳转类型: {{ getType(item.type) }} </a-row>
          <a-row> 跳转路径: {{ item.route }} </a-row>
          <a-row> 创建时间: {{ $dateFormat(item.createAt) }} </a-row>
          <a-row> 更新时间: {{ $dateFormat(item.updateAt) }} </a-row>
        </a-card>
      </a-list-item>
    </a-list>
    <add-or-edit-route
      :title="title"
      :visible="visible"
      :data="toChildData"
      :addRoute="addRoute"
      :editRoute="editRoute"
      :close="close">
    </add-or-edit-route>
  </page-header-wrapper>
</template>
<script>
  import { addRoute, deleteRoute, editRoute, getRouteList } from '@/api/bannerRroute'
  import { BANNER_ROUTE_TYPE } from './enum/BannerConstant'
  import addOrEditRoute from '@/views/banner/modules/addOrEditRoute'
  export default {
    data () {
      return {
        type: BANNER_ROUTE_TYPE,
        visible: false,
        title: '',
        toChildData: null,
        routeList: [],
        search: { }
      }
    },
    components: {
      addOrEditRoute
    },
    created () {
      this.init()
    },
    methods: {
      // 初始化
      init () {
        // 获取banner—route表数据
        getRouteList(this.search)
        .then(res => {
          this.routeList = res
        })
        .catch(err => {
          this.$message.error(err)
        })
      },
      // 获取类型
      getType (typeId) {
        const filter = Object.keys(this.type).filter(one => this.type[one].value === typeId)
        return this.type[filter].desc
      },
      // 删除路由
      deleteRoute (item) {
        deleteRoute(item)
        .then(res => {
          this.$message.success('删除成功')
          this.init()
        })
        .catch(err => {
          this.$message.error(err)
        })
      },
      // 打开修改路由按钮
      openEdit (item) {
        this.title = '修改路由'
        this.toChildData = item
        this.visible = true
      },
      // 关闭模态框
      close () {
        this.visible = false
      },
      // 打开增加路由按钮
      openAdd () {
        this.toChildData = null
        this.title = '增加路由'
        this.visible = true
      },
      // 保存route
      addRoute (form, data) {
        form.validateFields((err, values) => {
          if (!err) {
            addRoute(values)
              .then(res => {
                this.$message.success('新增')
                this.close()
                this.init()
              })
              .catch(err => {
                this.$message.error(err)
              })
          } else {
            console.log(err)
          }
        })
      },
      // 修改route
      editRoute (form, data) {
        form.validateFields((err, values) => {
          if (!err) {
            values.id = data.id
            editRoute(values)
              .then(res => {
                this.$message.success('修改成功')
                this.close()
                this.init()
              })
              .catch(err => {
                this.$message.error(err)
              })
          } else {
            console.log(err)
          }
        })
      }
    }
  }
</script>
