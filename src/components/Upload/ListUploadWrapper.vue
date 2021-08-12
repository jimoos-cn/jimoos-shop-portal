<!-- 多图片上传封装 -->
<template>
  <div class="clearfix listUpload">
    <a-upload
      ref="upload"
      list-type="picture-card"
      :fileList="fileList"
      :multiple="true"
      class="list-upload"
      @preview="handlePreview"
      @change="handleChange"
      :before-upload="beforeUpload"
      :customRequest="handleUpload"
      :remove="remove"
    >
      <div v-if="fileList.length < length">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          <span v-html="uploadTip"></span>
        </div>
      </div>
    </a-upload>
    <a-modal :visible="pre" :footer="null" @cancel="handleCancel">
      <img alt="example" :class="{ circle: this.circle }" style="width: 100%" :src="preImg" />
    </a-modal>
  </div>
</template>
<script>
  import { uploadFile, UploadType } from '@/api/obs'

  export default {
    data () {
      return {
        uploadTip: '上传图片<br>支持png/jpg/gif格式<br>大小不超过1M',
        // 多文件
        fileList: [],
        // 显示的图片
        preImg: '',
        pre: false
      }
    },
    props: {
      // 暂时不用
      value: {
        type: String,
        default: ''
      },
      // 图片的urls
      urls: {
        type: String,
        default: ''
      },
      uploadType: {
        // 0 图文 1 视频 2 音频
        type: Number,
        default: 0
      },
      length: {
        // 上传个数
        type: Number,
        default: 1
      },
      width: {
        type: Number,
        default: 200
      },
      height: {
        type: Number,
        default: 200
      },
      // 圆形图标
      circle: {
        type: Boolean,
        default: false
      },
      // 自定义提示
      hint: {
        type: String,
        default: ''
      }
    },
    created () {
      this.changeTip()
    },
    mounted () {
      this.changeType1()
    },
    watch: {
      urls: {
        handler (val) {
          const that = this
          if (that.fileList.length <= 0) {
            if (val !== '') {
              let uid = 1
              const urlList = val.split(',')
              urlList.forEach(item => {
                that.fileList.push({
                  uid: uid++,
                  name: 'image.png',
                  status: 'done',
                  url: item
                })
              })
              this.$nextTick(() => {
                this.changeType2()
              })
            }
          }
          // val传''则清空fileList
          if (val === '') {
            that.fileList = []
          }
        },
        immediate: true
      }
    },
    methods: {
      setContent (urls) {
        let uid = 1
        const that = this
        const banner = urls.split(',')
        banner.forEach(item => {
          that.fileList.push({
            uid: uid++,
            name: 'image.png',
            status: 'done',
            url: item
          })
        })
        this.changeList()
      },
      // 动态改变大小
      changeType1 () {
        const dom = this.$refs.upload.$el
        const dom1 = dom.querySelector('.list-upload .ant-upload')
        const dom2 = dom.querySelector('.list-upload .ant-upload-list-item')
        if (dom1 != null) {
          dom1.style.width = this.width + 'px'
          dom1.style.height = this.height + 'px'
        }
        if (dom2 != null) {
          dom2.style.width = this.width + 'px'
          dom2.style.height = this.height + 'px'
        }
        if (this.circle) {
          const dom6 = dom.querySelector('.ant-upload.ant-upload-select-picture-card')
          dom6.classList.add('circle')
        }
      },
      changeType2 () {
        const dom = this.$refs.upload.$el
        const dom3 = dom.querySelectorAll('.list-upload .ant-upload-list-picture-card-container')
        const dom4 = dom.querySelectorAll('.list-upload .ant-upload-list-picture-card .ant-upload-list-item')
        dom3.forEach(item => {
          if (item.style != null) {
            item.style.width = this.width + 'px'
            item.style.height = this.height + 'px'
          }
        })
        dom4.forEach(item => {
          if (item.style != null) {
            item.style.width = this.width + 'px'
            item.style.height = this.height + 'px'
            if (this.circle) {
              item.classList.add('circle')
            }
          }
        })
        if (this.circle) {
          const dom5 = dom.querySelectorAll('.ant-upload-list-picture-card .ant-upload-list-item-info')
          dom5.forEach(item => item.classList.add('circle'))
        }
      },
      changeTip () {
        switch (this.uploadType) {
          case 0:
            this.uploadTip = '上传图片<br>支持png/jpg/gif格式<br>大小不超过1M'
            break
          case 1:
            this.uploadTip = '上传视频仅支持mp4格式，且大小不超过100MB'
            break
          case 2:
            this.uploadTip = '上传音频仅支持mp3格式，且大小不超过100MB'
            break
        }
      },
      // 取消预览
      handleCancel () {
        this.pre = false
      },
      // 浏览
      async handlePreview (file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj)
        }
        this.preImg = file.url || file.preview
        this.pre = true
      },
      // 更新fileList
      handleChange ({ fileList }) {
        this.fileList = fileList
      },
      // 上传列表变动回调
      changeList () {
        const doneList = this.fileList.filter(item => item.status === 'done')
        let url = ''
        doneList.forEach(item => {
          if (url === '') {
            url = item.url
          } else {
            url += ',' + item.url
          }
        })
        this.$emit('input', url)
        this.$nextTick(() => {
          this.changeType2()
        })
      },
      getBase64 (file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
      },
      // 上传前检测
      beforeUpload (file) {
        switch (this.uploadType) {
          case 0:
            const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
            if (!isImg) {
              this.$message.error('图片仅支持png/jpg/gif格式')
            }
            const imgSizeLs1M = file.size / 1024 / 1024 < 1
            if (!imgSizeLs1M) {
              this.$message.error('图片大小必须小于 1MB!')
            }
            return isImg && imgSizeLs1M
          case 1:
            const isVideo = file.type === 'video/mp4'
            if (!isVideo) {
              this.$message.error('视频仅支持mp4格式')
            }
            const videoSizeLs100M = file.size / 1024 / 1024 < 100
            if (!videoSizeLs100M) {
              this.$message.error('视频大小必须小于 100MB!')
            }
            return isVideo && videoSizeLs100M
          case 2:
            const isAudio = file.type === 'audio/mp3' || file.type === 'audio/mpeg'
            if (!isAudio) {
              this.$message.error('音频仅支持mp3格式')
            }
            const audioSizeLs100M = file.size / 1024 / 1024 < 100
            if (!audioSizeLs100M) {
              this.$message.error('音频大小必须小于 100MB!')
            }
            return isAudio && audioSizeLs100M
        }
      },
      // 移除文件
      remove (file) {
        console.log(file)
      },
      // 上传
      async handleUpload ({ file }) {
        const blob = {
          name: this.$specialStrFilter(file.name),
          type: this.uploadType === 0 ? UploadType.IMG : UploadType.MEDIA
        }
        const blobs = []
        blobs.push(blob)
        const params = {
          blobs: blobs
        }
        // 处理上传
        await uploadFile(params, file).then(res => {
          this.loading = false
          // 上传成功后更改状态
          console.log(this.fileList)
          this.fileList.find(item => {
            if (item.uid === file.uid) {
              item.status = 'done'
              this.$set(item, 'url', res)
            }
          })
        })
        // 回调
        this.changeList()
      }
    }
  }
</script>

<style>
  .listUpload .circle {
    border-radius: 50%;
  }
</style>
