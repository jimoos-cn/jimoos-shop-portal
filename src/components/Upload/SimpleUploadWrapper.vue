/**
 * 简单的图片上传封装
 * @author: 陈启声
*/
<template>
  <div>
    <a-upload
      name="avatar"
      list-type="picture-card"
      class="simple-upload"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :customRequest="handleUpload"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="value">
        <img :src="value" style="width: 200px; height: 200px" v-if="uploadType === 0" />
        <video :src="value" controls="controls" style="width: 202px" v-if="uploadType === 1">
          您的浏览器不支持播放视频。
        </video>
        <audio :src="value" controls="controls" style="width: 202px" v-if="uploadType === 2">
          您的浏览器不支持播放音频。
        </audio>
      </div>
      <div v-else>
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">
          <span v-html="uploadTip"></span>
        </div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { uploadFile, UploadType } from '@/api/obs'
// import ImagePreview from '@/components/Image/ImagePreview'

export default {
  name: 'SfSimpleUpload',
  props: {
    value: {
      type: String,
      default: undefined
    },
    uploadType: {
      // 0 图文 1 视频 2 音频
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      uploadTip: '上传图片<br>支持png/jpg/gif格式<br>大小不超过1M',
      loading: false,
      previewVisible: false,
      previewImage: ''
    }
  },
  created () {
    this.changeTip()
  },
  methods: {
    init: (option) => {
      if (option) {
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
    handlePreview () {
      this.previewImage = this.value
      this.previewVisible = true
    },
    handlePreviewCancel () {
      this.previewVisible = false
    },
    beforeUpload (file) {},
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
      }
    },
    handleUpload ({ file }) {
      const blob = {
        name: file.name,
        type: this.uploadType === 0 ? UploadType.IMG : UploadType.MEDIA
      }

      const blobs = []
      blobs.push(blob)
      const params = {
        blobs: blobs
      }
      // 处理上传
      uploadFile(params, file).then((res) => {
        this.loading = false
        this.$emit('input', res)
      })
    }
  }
}
</script>

<style lang="less">
.simple-upload > .ant-upload {
  width: 200px;
  height: 200px;
}
</style>
