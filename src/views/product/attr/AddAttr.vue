<template>
  <page-header-wrapper>
    <a-card class="card" :bordered="false">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item label="销售属性名称">
              <a-input
                placeholder="请输入销售属性名称"
                v-decorator="['name', { rules: [{ required: true, message: '请输入销售属性名称', whitespace: true }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="销售属性描述">
              <a-input
                placeholder="请输入销售属性描述"
                v-decorator="[
                  'description',
                  { rules: [{ required: true, message: '请输入销售属性描述', whitespace: true }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- table -->
      <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading">
        <template v-for="(col, i) in ['name', 'description', 'sort']" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            @change="(e) => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a-space>
                <a @click="saveRow(record)">添加</a>
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <a>删除</a>
                </a-popconfirm>
              </a-space>
            </span>
            <span v-else>
              <a-space>
                <a @click="saveRow(record)">保存</a>
                <a @click="cancel(record.key)">取消</a>
              </a-space>
            </span>
          </template>
          <span v-else>
            <a-space>
              <a @click="toggle(record.key)">编辑</a>
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </a-space>
          </span>
        </template>
      </a-table>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="newAttrValue"
      >新增属性值</a-button
      >
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <!-- <span class="popover-wrapper">
        <a-popover
          title="表单校验信息"
          overlayClassName="antd-pro-pages-forms-style-errorPopover"
          trigger="click"
          :getPopupContainer="(trigger) => trigger.parentNode"
        >
          <template slot="content">
            <li
              v-for="item in errors"
              :key="item.key"
              @click="scrollToField(item.key)"
              class="antd-pro-pages-forms-style-errorListItem"
            >
              <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />
              <div class="">{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">
            <a-icon type="exclamation-circle" />{{ errors.length }}
          </span>
        </a-popover>
      </span> -->
      <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'ProductAttrAdd',
  mixins: [baseMixin],
  components: {
    FooterToolBar
  },
  data () {
    return {
      attr: {},
      loading: false,
      memberLoading: false,
      // attr
      name: '',
      description: '',
      // table
      columns: [
        {
          title: '属性值',
          dataIndex: 'name',
          key: 'name',
          width: '20%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description',
          width: '40%',
          scopedSlots: { customRender: 'description' }
        },
        {
          title: '排序',
          dataIndex: 'sort',
          key: 'sort',
          width: '10%',
          scopedSlots: { customRender: 'sort' }
        },
        {
          title: '操作',
          key: 'action',
          width: '150px',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          key: '1',
          name: '小明',
          description: '001',
          editable: false,
          sort: '100'
        },
        {
          key: '2',
          name: '李莉',
          description: '002',
          editable: false,
          sort: '100'
        },
        {
          key: '3',
          name: '王小帅',
          description: '003',
          editable: false,
          sort: '100'
        }
      ],

      errors: []
    }
  },
  created () {},
  methods: {
    newAttrValue () {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        name: '',
        description: '默认描述',
        sort: '100',
        editable: true,
        isNew: true
      })
    },
    remove (key) {
      const newData = this.data.filter((item) => item.key !== key)
      this.data = newData
    },
    saveRow (record) {
      this.memberLoading = true
      const { key, name, description, sort } = record
      if (!name || !description || !sort) {
        this.memberLoading = false
        this.$message.error('请填写完整的属性值信息。')
        return
      }
      const target = this.data.find((item) => item.key === key)
      target.editable = false
      target.isNew = false
      this.memberLoading = false
    },
    toggle (key) {
      const target = this.data.find((item) => item.key === key)
      target._originalData = { ...target }
      target.editable = !target.editable
    },
    getRowByKey (key, newData) {
      const data = this.data
      return (newData || data).find((item) => item.key === key)
    },
    cancel (key) {
      const target = this.data.find((item) => item.key === key)
      Object.keys(target).forEach((key) => {
        target[key] = target._originalData[key]
      })
      target._originalData = undefined
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.find((item) => key === item.key)
      if (target) {
        target[column] = value
        this.data = newData
      }
    }
  }
}
</script>
