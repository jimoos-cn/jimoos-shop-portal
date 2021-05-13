# Upload 上传封装

* 简单图片,视频，音频上传支持


## 引用方式

```javascript
import SfSimpleUpload from '@/components/Upload/SimpleUploadWrapper'

export default {
    components: {
        SfSimpleUpload
    }
}
```

## 代码使用

### v-model 模式

```html
        <sf-simple-upload
          v-model='cover'>
        </sf-simple-upload>
```

### 在 Form 中使用

```html
        <sf-simple-upload
          @input="updateCover"
          :uploadType="0"
          v-decorator="['cover', { rules: [{ required: true, message: '封面必须上传' }] }]"
        ></sf-simple-upload>
```

```js
    updateCover (url) {
      this.form.setFieldsValue({ cover: url })
    }
```

| prop       | des                     |
| ---------- | ----------------------- |
| value      | 地址 url                |
| uploadType | // 0 图文 1 视频 2 音频 |