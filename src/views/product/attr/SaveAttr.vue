<template>
  <page-header-wrapper :title="title" content="新建商品的时候，需要用到销售属性。例如尺寸 XXL、XL、L、M、S">
    <a-card class="card" :bordered="false">
      <a-form ref="attr" :form="form" class="form">
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
              <a-input placeholder="请输入销售属性描述" v-decorator="['description']" />
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
      <a-space>
        <a-button @click="cancelSaveAttr">取消</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">提交</a-button>
      </a-space>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import { createProductAttr, updateProductAttr, getProductAttr } from '@/api/product/attr'

const fieldLabels = {
  name: '属性名',
  description: '属性名称'
}

export default {
  name: 'ProductAttrAdd',
  mixins: [baseMixin],
  components: {
    FooterToolBar
  },
  data () {
    return {
      title: '添加销售属性',
      id: 0,
      form: this.$form.createForm(this),
      loading: false,
      memberLoading: false,
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
          key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
          name: '',
          description: '默认描述',
          sort: '100',
          editable: true,
          isNew: true
        }
      ],

      errors: []
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.id && this.id > 0) {
      this.title = '更新销售属性'

      const params = {
        id: this.id
      }
      getProductAttr(params)
        .then((res) => {
          this.id = res.id
          this.form.setFieldsValue({
            name: res.name,
            description: res.description
          })
          const newData = []
          res.attrValues.forEach((item, index) => {
            newData.push({
              ...item,
              key: index,
              editable: false,
              isNew: false
            })
          })
          this.data = newData
        })
        .catch((err) => {
          console.log('销售属性找不到了:', err)
          this.$message.error('销售属性找不到了')
        })
    }
  },
  methods: {
    handleSubmit () {
      const {
        $refs: { attr }
      } = this
      this.errors = []
      let errorFlag = false
      let attrData = {}
      attr.form.validateFields((err, values) => {
        if (err) {
          const errors = Object.assign({}, attr.getFieldsError())
          const tmp = { ...errors }
          this.errorList(tmp)
          errorFlag = true
          return
        }
        attrData = { ...values }
        console.log(values)
      })
      if (errorFlag) {
        return
      }
      const x = [...this.data].filter((res) => res.editable)
      if (x.length !== 0) {
        this.$message.warning('请确定属性值已填写或已保存')
        return
      }
      if (this.data.length === 0) {
        this.$message.warning('销售属性必须有销售属性值')
      }
      const params = {
        name: attrData.name,
        description: attrData.description,
        attrValues: this.data,
        id: this.id
      }
      if (this.id && this.id > 0) {
        updateProductAttr(params)
          .then((res) => {
            this.$message.success('销售属性更新成功!返回列表')
            this.$router.go(-1)
          })
          .catch((err) => {
            console.log('销售属性更新失败:', err)
            this.$message.error('销售属性更新失败')
          })
      } else {
        createProductAttr(params)
          .then((res) => {
            this.$message.success('销售属性添加成功！继续添加')
            attr.form.resetFields()
            this.data = []
            this.data.push({
              key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
              name: '',
              description: '默认描述',
              sort: '100',
              editable: true,
              isNew: true
            })
            this.showSuccessFlag = true
          })
          .catch((err) => {
            console.log('销售属性添加失败:', err)
            this.$message.error('销售属性添加失败')
          })
      }
    },
    errorList (errors) {
      if (!errors || errors.length === 0) {
        return
      }
      this.errors = Object.keys(errors)
        .filter((key) => errors[key])
        .map((key) => ({
          key: key,
          message: errors[key][0],
          fieldLabel: fieldLabels[key]
        }))
    },
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
    },
    cancelSaveAttr () {
      this.$router.go(-1)
    }
  }
}
</script>
