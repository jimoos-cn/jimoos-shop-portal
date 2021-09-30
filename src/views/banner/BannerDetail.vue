<!-- banner详细页面（包含修改） -->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :form="form">
        <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder=" 请输入广告栏标题"
            v-decorator="['title', { rules: [{ required: true, message: '广告栏标题必须填写' }] }]"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['sort',{initialValue:'100'}]"
            :max="9999999"
            :min="0"
            :default-value="100"
            placeholder="请输入广告栏排序"
            style="width:100%" />
        </a-form-item>
        <a-form-item label="位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder=" 请输入广告栏位置"
            v-decorator="['position', { rules: [{ required: true, message: '广告位置必须填写' }] }]"
          >
            <a-select-option
              v-for="item in position"
              :key="item.value"
              :value="item.value"
            >
              {{ item.desc }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="跳转类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="请输入跳转类型"
            v-decorator="['routeId', { rules: [{ required: true, message: '跳转类型必须填写' }] }]"
          >
            <a-select-option
              v-for="item in route"
              :key="item.id"
              :value="item.id"
            >
              {{ item.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="广告栏图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <sf-simple-upload
            @input="updateImgUrl"
            :uploadType="0"
            v-decorator="['imgUrl', { rules: [{ required: true, message: '广告栏图片必须填写' }] }]"
          ></sf-simple-upload>
        </a-form-item>
        <a-form-item label="跳转目标" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="跳转目标"
            v-decorator="['targetId']">
          </a-input>
        </a-form-item>
        <a-row type="flex" justify="start">
          <a-col :offset="2">
            <a-badge status="success" v-if="banner.status" text="已上架"></a-badge>
            <a-badge status="error" v-else text="未上架"></a-badge>
          </a-col>
          <a-col :offset="2" v-if="showPath">
            <span style="font-weight: 700">跳转路径:</span>
            {{ banner.paths }}
          </a-col>
          <a-col :offset="2">
            <a-form-item label="标签颜色" :labelCol="{ lg: { span: 8 }, sm: { span: 8 } }" :wrapperCol="{ lg: { span: 16 }, sm: { span: 16 } }">
              <colorPicker v-decorator="['color']" />
              <div class="ant-form-explain">(点击颜色进行修改)</div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
        <a-space>
          <a-button @click="gotoList">返回</a-button>
          <a-button type="primary" @click="submitEdit">修改</a-button>
        </a-space>
      </footer-tool-bar>
    </a-card>
  </page-header-wrapper>
</template>
<script>
  import ImagePreview from '@/components/Image/ImagePreview'
  import SfSimpleUpload from '@/components/Upload/SimpleUploadWrapper'
  import { baseMixin } from '@/store/app-mixin'
  import FooterToolBar from '@/components/FooterToolbar'
  import { BANNER_POSITION } from '@/views/banner/enum/BannerConstant'
  import { getRouteList } from '@/api/bannerRroute'
  import { editBanner } from '@/api/banner'
  export default {
    mixins: [baseMixin],
    components: {
      ImagePreview,
      SfSimpleUpload,
      FooterToolBar
    },
    data () {
      return {
        position: BANNER_POSITION,
        banner: {},
        form: this.$form.createForm(this),
        labelCol: { lg: { span: 2 }, sm: { span: 2 } },
        wrapperCol: { lg: { span: 10 }, sm: { span: 10 } },
        search: {},
        route: {}
      }
    },
    computed: {
      showPath () {
        return this.$available(this.banner.paths)
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.getRoute()
        this.banner = this.$storage.get('banner')
        let color
        if (this.banner.color == null) {
          color = '#000000'
        } else {
          color = this.banner.color
        }
        this.$nextTick(() => {
          this.form.setFieldsValue({
            title: this.banner.title,
            targetId: this.banner.targetId,
            sort: this.banner.sort,
            routeId: this.banner.routeId,
            position: this.banner.position,
            paths: this.banner.paths,
            imgUrl: this.banner.imgUrl,
            id: this.banner.id,
            description: this.banner.description,
            createAt: this.banner.createAt,
            color: color
          })
        })
      },
      getRoute () {
        getRouteList(this.search)
          .then(res => {
            console.log('获取route列表', res)
            this.route = res
          })
      },
      //
      gotoList () {
        this.$router.push({
          name: 'bannerList'
        })
      },
      submitEdit () {
        console.log(this.form)
        this.form.validateFields((err, values) => {
          if (!err) {
            values.id = this.banner.id
            editBanner(values)
              .then(res => {
                this.$message.success('修改成功,2秒后跳转至列表')
                setTimeout(this.gotoList, 2000)
              })
              .catch(err => {
                this.$message.error(err)
              })
          } else {
            console.log(err)
          }
        })
      },
      updateImgUrl (val) {
        this.form.setFieldsValue({ imgUrl: val })
      }
    }
  }
</script>
