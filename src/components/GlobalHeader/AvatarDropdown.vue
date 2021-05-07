<template>
  <di>
    <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
      <span class="ant-pro-account-avatar">
        <span>{{ currentUser.name }}</span>
      </span>
      <template v-slot:overlay>
        <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
          <a-menu-item v-if="menu" key="reset" @click="showModal">
            <a-icon type="user" />
            {{ $t('menu.admin.modifyPwd') }}
          </a-menu-item>
          <a-menu-divider v-if="menu" />
          <a-menu-item key="logout" @click="handleLogout">
            <a-icon type="logout" />
            {{ $t('menu.admin.logout') }}
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else>
      <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
    </span>
    <a-modal
      :title="Title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :destroyOnClose="true"
      @ok="handleOk"
      @cancel="visible = false">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="新密码">
          <a-input-password v-decorator="['pwd', { rules: [{ required: true, message: '请输入密码' }] }]" />
        </a-form-item>
        <a-form-item label="确认密码">
          <a-input-password v-decorator="['pwdRepeat', { rules: [{ required: true, message: '请输入密码' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </di>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { resetAdminPassword } from '@/api/admin'

export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      Title: '修改密码',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values)
          if (values.pwd !== values.pwdRepeat) {
            this.$message.error('两次密码输入不相同', 1)
            return
          }
          this.confirmLoading = true
          const data = {
            pwd: values.pwd
          }
          resetAdminPassword(data)
            .then(() => {
              this.$message.success('修改成功', 1)
              this.$store.dispatch('Logout').then(() => {
                location.replace('/')
              })
            }).catch(() => {
              this.$message.error('重置密码失败', 1)
            })
          this.visible = false
          this.confirmLoading = false
        }
      })
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
