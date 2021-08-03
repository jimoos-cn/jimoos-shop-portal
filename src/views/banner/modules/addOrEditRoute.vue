<template>
  <div>
    <a-drawer
      :title="title"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="close"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="路由描述">
              <a-input
                v-decorator="[
                  'description',
                  {
                    rules: [{ required: true, message: '请输入路由描述' }],
                  },
                ]"
                placeholder="请输入路由描述"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="路由类型">
              <a-select
                v-decorator="[
                  'type',
                  {
                    rules: [{ required: true, message: '请选择路由类型' }],
                  },
                ]"
                style="width: 100%"
                placeholder="请选择路由类型"
              >
                <a-select-option
                  v-for="item in type"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.desc }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="路由跳转路径">
              <a-textarea
                v-decorator="[
                  'route',
                  {
                    rules: [{ required: true, message: '请输入路由跳转路径' }],
                  },
                ]"
                :rows="4"
                placeholder="请输入路由跳转路径。其中%s代表通配符，targetId会依据%s进行替换"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="close">
          取消
        </a-button>
        <a-button v-if="title !== '修改路由'" type="primary" @click="addRoute(form,data)">
          保存
        </a-button>
        <a-button v-else type="primary" @click="editRoute(form,data)">
          修改
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
  import { BANNER_ROUTE_TYPE } from '../enum/BannerConstant'
  export default {
    data () {
      return {
        type: BANNER_ROUTE_TYPE,
        form: this.$form.createForm(this)
      }
    },
    props: {
      title: {
        type: String,
        default: '标题'
      },
      data: {
        type: Object,
        default: null
      },
      visible: {
        type: Boolean,
        default: false
      },
      close: {
        type: Function,
        required: true
      },
      addRoute: {
        type: Function,
        required: true
      },
      editRoute: {
        type: Function,
        required: true
      }
    },
    watch: {
      data: {
        handler (val) {
          if (val == null) {
            this.form.resetFields()
          }
          if (val) {
            this.$nextTick(() => {
              this.form.setFieldsValue({
                description: val.description,
                type: val.type,
                route: val.route
              })
            })
          }
        },
        deep: true,
        immediate: true
      }
    }
  }
</script>
