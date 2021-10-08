<!-- 多图片上传封装 -->
<template class="www">
  <div class="clearfix listUpload">
    <a-upload
      ref="upload"
      :list-type="listType"
      :fileList="fileList"
      :multiple="true"
      class="list-upload"
      @preview="handlePreview"
      @change="handleChange"
      :before-upload="beforeUpload"
      :customRequest="handleUpload"
      :remove="remove"
    >
      <template v-if="uploadType === 0">
        <div v-if="fileList.length < length" class="all-center flex-column">
          <a-icon type="plus" />
          <div class="ant-upload-text">
            <span v-html="uploadTip"></span>
          </div>
        </div>
      </template>
      <template v-else>
        <a-button v-if="fileList.length < length">
          <a-icon type="upload" />
          <span v-html="uploadTip"></span>
        </a-button>
      </template>
    </a-upload>
    <a-modal
      :maskStyle="{ 'z-index': '10002' }"
      :title="preName"
      :zIndex="10003"
      :visible="pre"
      :footer="null"
      @cancel="handleCancel"
      width="30%"
      class="modal"
      destroyOnClose
    >
      <img alt="example" :class="{ circle: this.circle }" v-if="uploadType === 0" style="width: 300px;height: 300px" :src="preImg" />
      <video
        class="video"
        alt="example"
        :class="{ circle: this.circle }"
        width="100%"
        controls
        v-if="uploadType === 1"
        :src="preImg" />
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
        preName: '',
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
        // 0 图文 1 视频 2 音频 3文件
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
      this.changeType2()
      if (this.uploadType === 3) {
        this.changeType3()
      }
    },
    watch: {
      urls: {
        handler (val) {
          const that = this
          // val传''则清空fileList
          if (val === '' || val === null) {
            that.fileList = []
          } else if (that.fileList.length <= 0) {
            if (val !== null && val !== '') {
              let uid = 1
              const urlList = val.split(',')
              urlList.forEach(item => {
                console.log(item)
                const re = new RegExp('[^/]+(?!.*\\/)')
                let name = item.match(re)[0]
                name = name.substr(1)
                console.log(name)
                const file = {
                  uid: uid++,
                  name: name,
                  status: 'done',
                  url: item
                }
                that.fileList.push(file)
              })
              this.$nextTick(() => {
                this.changeType2()
                if (this.uploadType === 1) {
                  that.fileList.forEach(item => {
                    this.setVideoCover(item, item.url)
                  })
                }
              })
            }
          }
        },
        immediate: true
      }
    },
    computed: {
      listType () {
        return this.uploadType === 0 ? 'picture-card' : this.uploadType === 1 ? 'picture' : 'text'
      }
    },
    methods: {
      // 动态改变大小
      changeType1 () {
        const dom = this.$refs.upload.$el
        const dom1 = dom.querySelector('.listUpload  .ant-upload')
        if (dom1 != null) {
          dom1.style.width = this.width + 'px'
          dom1.style.height = this.height + 'px'
        }
        if (this.circle) {
          const dom6 = dom.querySelector('.listUpload  .ant-upload.ant-upload-select-picture-card')
          dom6.style.borderRadius = '50%'
        }
      },
      changeType2 () {
        const dom = this.$refs.upload.$el
        const dom3 = dom.querySelectorAll('.listUpload .ant-upload-list-picture-card-container')
        const dom4 = dom.querySelectorAll('.listUpload .ant-upload-list-picture-card .ant-upload-list-item')
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
              item.style.borderRadius = '50%'
            }
          }
        })
        if (this.circle) {
          const dom5 = dom.querySelectorAll('.listUpload .ant-upload-list-picture-card .ant-upload-list-item-info')
          dom5.forEach(item => (item.style.borderRadius = '50%'))
        }
      },
      changeType3 () {
        const dom = this.$refs.upload.$el
        const dom1 = dom.querySelector('.listUpload .ant-upload-list')
        if (dom1 != null) {
          dom1.style.width = this.width + 'px'
          dom1.style.height = this.height + 'px'
        }
      },
      changeTip () {
        if (this.hint !== '') {
          this.uploadTip = this.hint
        } else {
          switch (this.uploadType) {
            case 0:
              this.uploadTip = '上传图片<br>支持png/jpg/gif格式<br>大小不超过2M'
              break
            case 1:
              this.uploadTip = '上传视频仅支持mp4格式，且大小不超过100MB'
              break
            case 2:
              this.uploadTip = '上传音频仅支持mp3格式，且大小不超过100MB'
              break
          }
        }
      },
      // 取消预览
      handleCancel () {
        this.pre = false
      },
      // 浏览
      async handlePreview (file) {
        if (this.uploadType === 3) {
          window.open(file.url)
        } else {
          if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj)
          }
          this.preImg = file.url || file.preview
          this.preName = file.name
          this.pre = true
        }
      },
      // 更新fileList
      handleChange ({ fileList }) {
        this.fileList = fileList
        this.$nextTick(() => {
          this.changeType2()
          if (this.uploadType === 3) {
            this.changeType3()
          }
        })
      },
      // 上传列表变动回调
      changeList () {
        console.log('fileList', this.fileList)
        const doneList = this.fileList.filter(item => item.status === 'done')
        console.log('doneList', doneList)
        let url = ''
        doneList.forEach(item => {
          if (url === '') {
            url = item.url
          } else {
            url += ',' + item.url
          }
        })
        this.$nextTick(() => {
          this.changeType2()
          if (this.uploadType === 3) {
            this.changeType3()
          }
        })
        this.$emit('input', url)
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
              throw new Error('图片仅支持png/jpg/gif格式')
            }
            const imgSizeLs2M = file.size / 1024 / 1024 < 2
            if (!imgSizeLs2M) {
              this.$message.error('图片大小必须小于 2MB!')
              throw new Error('图片大小必须小于 2MB!')
            }
            return isImg && imgSizeLs2M
          case 1:
            const isVideo = file.type === 'video/mp4'
            if (!isVideo) {
              this.$message.error('视频仅支持mp4格式')
              throw new Error('视频仅支持mp4格式')
            }
            const videoSizeLs100M = file.size / 1024 / 1024 < 100
            if (!videoSizeLs100M) {
              this.$message.error('视频大小必须小于 100MB!')
              throw new Error('视频大小必须小于 100MB!')
            }
            return isVideo && videoSizeLs100M
          case 2:
            const isAudio = file.type === 'audio/mp3' || file.type === 'audio/mpeg'
            if (!isAudio) {
              this.$message.error('音频仅支持mp3格式')
              throw new Error('音频仅支持mp3格式')
            }
            const audioSizeLs100M = file.size / 1024 / 1024 < 100
            if (!audioSizeLs100M) {
              this.$message.error('音频大小必须小于 100MB!')
              throw new Error('音频大小必须小于 100MB!')
            }
            return isAudio && audioSizeLs100M
        }
      },
      // 移除文件
      remove (file) {
        this.fileList.forEach(item => {
          if (item.uid === file.uid) {
            this.$set(item, 'status', 'removed')
          }
        })
        this.changeList()
      },
      // 视频上传成功后设置封面
      setVideoCover (file, url) {
        const fileList = [...this.fileList]
        const previewImg = document.createElement('img')
        this.getVideoCover(url).then(res => {
          console.log(res)
          previewImg.src = res.url
          this.$nextTick(() => {
            const dom = this.$refs.upload.$el
            const doms = dom.querySelectorAll('.ant-upload-list-picture .ant-upload-list-item-thumbnail')
            let target
            fileList.find((item, index) => {
              if (file.uid === item.uid) {
                target = index
              }
            })
            doms[target].insertHTML = ''
            doms[target].appendChild(previewImg)
            previewImg.style.width = res.width + 'px'
            previewImg.style.height = res.height + 'px'
            const nextDom = doms[target].nextElementSibling
            const preDom = previewImg.previousElementSibling
            nextDom.style.marginLeft = res.width - 46 + 'px'
            doms[target].removeChild(preDom)
          })
        })
      },
      // 根据视频url获取第一张截图
      getVideoCover (videoUrl) {
        return new Promise(resolve => {
          const video = document.createElement('video')
          video.setAttribute('crossOrigin', 'anonymous') // 处理跨域
          video.setAttribute('src', videoUrl)
          video.play()
          video.setAttribute('muted', true)
          video.addEventListener('canplay', () => {
            setTimeout(() => {
              video.setAttribute('width', video.videoWidth)
              video.setAttribute('height', video.videoHeight)
              const width = video.videoWidth
              const height = video.videoHeight
              const targetHeight = 48
              const scale = height / targetHeight
              console.log(video.videoHeight)
              const imgW = width / scale
              const imgH = height / scale
              const canvas = document.createElement('canvas')
              canvas.width = imgW
              canvas.height = imgH
              canvas.getContext('2d').drawImage(video, 0, 0, imgW, imgH) // 绘制canvas
              const dataURL = canvas.toDataURL('image/jpeg') // 转换为base64
              video.pause()
              const data = {
                url: dataURL,
                width: imgW,
                height: imgH
              }
              resolve(data)
            }, 100)
          })
        })
      },
      // 上传
      async handleUpload (option) {
        const { file } = option
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
          if (this.uploadType === 1) {
            this.setVideoCover(file, res)
            this.$nextTick(() => {
              this.clearIcon()
            })
          }
        })
        // 回调
        this.changeList()
      }
    }
  }
</script>

<style scoped>
  .circle {
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
  }
</style>
