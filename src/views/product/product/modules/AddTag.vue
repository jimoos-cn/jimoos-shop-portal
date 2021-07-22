<!-- 添加标签的modal -->
<template>
  <a-modal v-model="modelVisible" title="添加标签" @ok="handleOk" @cancel="close">
    <a-row>
      <a-col
        :sm="8"
        :md="4"
        v-for="item in unChooseTagData"
        :key="item.id"
      >
        <a-tag :color="item.color" :class="{'canClick':true}" @click="clickTag(item)">
          {{ item.name }}
          <span v-if="item.choose">√</span>
        </a-tag>
      </a-col>
    </a-row>
    <a-row v-if="unChooseTagData.length === 0">
      <a-button type="primary" @click="createVisible = true">+ 添加自定义标签</a-button>
    </a-row>
    <!--新增对话框-->
    <a-modal :forceRender="true" v-model="createVisible" title="添加标签" on-ok="handleCreateOk">
      <a-form style="width: 100%">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标签颜色">
          <colorPicker v-model="color" />
          <div class="ant-form-explain">(点击颜色进行修改)</div>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="createVisible = false">取消</a-button>
        <a-button key="submit" type="primary" @click="handleCreateOk">提交</a-button>
      </template>
      <k-form-build ref="tagCreateTable" :value="createTable" />
    </a-modal>
  </a-modal>
</template>
<script>
  import { addBoundValue, createProductTag, queryUnBoundValue } from '@/api/product/tag'
  import tagCreateForm from '@/views/product/k-form/product-tag-create-form'
  export default {
    name: 'AddModel',
    data () {
      return {
        color: '#4091f7', // 标签颜色
        createVisible: false, // 新增对话框可见
        createLoad: false, // 新增按钮加载
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
        modelVisible: false,
        unChooseTag: [],
        addTag: [],
        createTable: tagCreateForm // 新增表单
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      productId: {
        type: Number,
        default: 0
      },
      refresh: {
        type: Function,
        required: true
      }
    },
    watch: {
      visible (val) {
        if (val) {
          this.init()
        }
        this.modelVisible = val
      }
    },
    computed: {
      unChooseTagData () {
        const data = this.unChooseTag
        for (const a of data) {
          a.choose = false
        }
        return data
      }
    },
    methods: {
      init () {
        this.getUnChooseTag()
      },
      // 获取未选择的Tag
      getUnChooseTag () {
        const param = { productId: this.productId }
        queryUnBoundValue(param)
          .then(res => {
            this.unChooseTag = res
          })
      },
      handleOk () {
        const that = this
        console.log('添加标签', that.addTag)
        // 有添加数据才调用接口
        if (that.addTag.length > 0) {
          const param = []
          for (const i in that.addTag) {
            param.push({
              tagId: that.addTag[i].id,
              productId: that.productId
            })
          }
          addBoundValue(param)
            .then(res => {
              that.refresh()
              that.close()
              that.addTag = []
            })
        }
      },
      close () {
        this.modelVisible = false
        this.$emit('update:visible', false)
      },
      clickTag (item) {
        this.$set(item, 'choose', !item.choose)
        this.$forceUpdate()
        if (item.choose) {
          // 添加元素
          console.log(this.addTag.filter(tag => tag.id === item.id))
          if (!this.addTag.filter(tag => tag.id === item.id).length > 0) {
            this.addTag.push(item)
          }
        } else {
          // 删除元素
          this.addTag = this.addTag.filter(tag => tag.id !== item.id)
        }
      },
      // 提交新增Tag
      handleCreateOk () {
        this.$refs.tagCreateTable.getData().then((values) => {
          this.createLoad = true
          const params = {
            name: values.name,
            color: this.color,
            type: 0
          }
          createProductTag(params)
            .then((res) => {
              this.$message.success('新增成功')
              this.createLoad = false
              this.createVisible = false
              this.getUnChooseTag()
            })
            .catch((err) => {
              console.log('create tag err:' + err)
              this.$message.error('新增失败')
              this.createLoad = false
              this.createVisible = false
            })
        })
      }
    }
  }
</script>
<style scoped>
  .canClick{
    cursor: pointer;
  }
</style>
