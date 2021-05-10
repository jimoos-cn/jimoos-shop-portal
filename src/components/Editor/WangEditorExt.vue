<template>
  <div :class="prefixCls">
    <div ref="editor" class="editor-wrapper"></div>
  </div>
</template>

<script>
import E from 'wangeditor'
import { uploadFileToObs, UploadType } from '@/api/obs'

const { $, BtnMenu, DropListMenu } = E

class FirstIndent extends BtnMenu {
  constructor (editor) {
    const $elem = E.$(
      `<div class="w-e-menu">
                <svg t="1607675638946" style="fill:#999;width:16px;height:16px" id="first-icon" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="580" width="200" height="200"><path d="M915.968 458.532571v-87.04l145.700571 164.864-145.700571 164.790858V604.818286H695.954286v-146.285715h220.013714zM36.790857 153.746286v-109.714286h1021.074286v109.714286H36.864z m-1.462857 314.221714v-109.714286h588.507429v109.714286H35.254857z m2.633143 213.430857v-109.714286h584.557714v109.714286H38.034286z m1.828571 310.710857v-109.714285H1062.765714v109.714285H39.789714z" fill="#333333" p-id="581"></path></svg>
            </div>`
    )
    super($elem, editor)
  }

  // 菜单点击事件
  clickHandler () {
    console.log(this.editor.selection.getSelectionText())
    console.log(this.editor.selection.getSelectionContainerElem().elems[0])
    const elem = this.editor.selection.getSelectionContainerElem().elems[0]
    console.log(elem.style)
    console.log(document.getElementById('first-icon').style)
    const color = document.getElementById('first-icon').style.fill
    console.log(color)
    if (document.getElementById('first-icon').style.fill === 'rgb(153, 153, 153)') {
      document.getElementById('first-icon').style.fill = 'rgb(86, 143, 229)'
    } else {
      document.getElementById('first-icon').style.fill = 'rgb(153, 153, 153)'
    }
    if (elem.style.textIndent === '2em') {
      elem.style.textIndent = '0'
    } else {
      elem.style.textIndent = '2em'
    }
  }

  // 菜单是否被激活（如果不需要，这个函数可以空着）
  // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
  // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
  tryChangeActive () {
    // 激活菜单
    // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
    // 2. this.this.isActive === true
    this.active()

    // // 取消激活菜单
    // // 1. 菜单 DOM 节点会删掉 .w-e-active
    // // 2. this.this.isActive === false
    // this.unActive()
  }
}

class BothIndent extends DropListMenu {
  constructor (editor) {
    // 菜单栏中，标题菜单的 DOM 元素
    // 注意，这里的 $ 不是 jQuery ，是 E.$ （wangEditor 自带的 DOM 操作工具，类似于 jQuery）
    const $elem = $(
      '<div class="w-e-menu"><svg t="1607675913897" class="icon" style="color:#999;width:16px;height:16px" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="758" width="200" height="200"><path d="M36.352 153.014857v-109.714286H1061.302857v109.714286H36.352z m222.061714 275.090286v-109.714286h583.753143v109.714286h-583.68z m0 290.377143v-109.714286h581.046857v109.714286H258.413714zM34.962286 999.350857v-109.714286h1024.292571v109.714286H34.962286zM34.084571 657.993143V375.296l164.571429 141.385143-164.571429 141.312z m1019.392-0.292572l-156.306285-142.262857 156.306285-142.189714v284.452571z" fill="#333333" p-id="759"></path></svg></div>'
    )

    // droplist 配置
    const dropListConf = {
      width: 100,
      title: '两端缩进',
      type: 'list',
      list: [
        { $elem: $('<span>增加2</span>'), value: '2' },
        { $elem: $('<span>增加4</span>'), value: '4' },
        { $elem: $('<span>增加8</span>'), value: '8' },
        { $elem: $('<span>增加16</span>'), value: '16' },
        { $elem: $('<span>减少2</span>'), value: '-2' },
        { $elem: $('<span>减少4</span>'), value: '-4' },
        { $elem: $('<span>减少8</span>'), value: '-8' },
        { $elem: $('<span>减少16</span>'), value: '-16' }
      ],
      // droplist 每个 item 的点击事件
      clickHandler: (value) => {
        // value 参数即 dropListConf.list 中配置的 value
        this.command(value)
      }
    }

    super($elem, editor, dropListConf)
  }

  command (value) {
    // 设置标题
    this.editor.cmd.do('formatBlock', value)
    const elem = this.editor.selection.getSelectionContainerElem().elems[0]
    console.log(elem.style)
    let marginLeft, marginRight
    if (elem.style.marginLeft !== '') marginLeft = parseFloat(elem.style.marginLeft)
    else {
      marginLeft = 0
    }
    if (elem.style.marginRight !== '') marginRight = parseFloat(elem.style.marginRight)
    else {
      marginRight = 0
    }
    const finalLeft = marginLeft + parseInt(value) < 0 ? 0 : marginLeft + parseInt(value)
    const finalRight = marginRight + parseInt(value) < 0 ? 0 : marginRight + parseInt(value)
    elem.style.marginLeft = finalLeft + 'em'
    elem.style.marginRight = finalRight + 'em'
  }

  // 菜单是否需要激活
  tryChangeActive () {
    const reg = /^h/i
    const cmdValue = this.editor.cmd.queryCommandValue('formatBlock')
    if (reg.test(cmdValue)) {
      // 选区处于标题内，激活菜单
      this.active()
    } else {
      // 否则，取消激活
      this.unActive()
    }
  }
}

class FrontIndent extends DropListMenu {
  constructor (editor) {
    // 菜单栏中，标题菜单的 DOM 元素
    // 注意，这里的 $ 不是 jQuery ，是 E.$ （wangEditor 自带的 DOM 操作工具，类似于 jQuery）
    const $elem = E.$(
      `<div class="w-e-menu">
            <svg t="1607676341824" class="icon" style="color:#999;width:16px;height:16px" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1214" width="200" height="200"><path d="M399.725714 225.133714L547.766857 15.872l148.041143 209.188571H399.725714zM37.302857 473.161143v-109.714286h1021.44v109.714286H37.376z m-2.925714 264.045714v-109.714286h1027.510857v109.714286H34.450286z m2.194286 260.608v-109.714286h1022.317714v109.714286H36.571429z" fill="#333333" p-id="1215"></path></svg>
            </div>`
    )
    // droplist 配置
    const dropListConf = {
      width: 100,
      title: '段前缩进',
      type: 'list',
      list: [
        { $elem: $('<span>增加2</span>'), value: '2' },
        { $elem: $('<span>增加4</span>'), value: '4' },
        { $elem: $('<span>增加8</span>'), value: '8' },
        { $elem: $('<span>增加16</span>'), value: '16' },
        { $elem: $('<span>减少2</span>'), value: '-2' },
        { $elem: $('<span>减少4</span>'), value: '-4' },
        { $elem: $('<span>减少8</span>'), value: '-8' },
        { $elem: $('<span>减少16</span>'), value: '-16' }
      ],
      // droplist 每个 item 的点击事件
      clickHandler: (value) => {
        // value 参数即 dropListConf.list 中配置的 value
        this.command(value)
      }
    }

    super($elem, editor, dropListConf)
  }

  command (value) {
    // 设置标题
    this.editor.cmd.do('formatBlock', value)
    const elem = this.editor.selection.getSelectionContainerElem().elems[0]
    console.log(elem.style)
    let marginTop
    if (elem.style.marginTop !== '') marginTop = parseFloat(elem.style.marginTop)
    else {
      marginTop = 0
    }
    const finalTop = marginTop + parseInt(value) < 0 ? 0 : marginTop + parseInt(value)
    elem.style.marginTop = finalTop + 'em'
  }

  // 菜单是否需要激活
  tryChangeActive () {
    const reg = /^h/i
    const cmdValue = this.editor.cmd.queryCommandValue('formatBlock')
    if (reg.test(cmdValue)) {
      // 选区处于标题内，激活菜单
      this.active()
    } else {
      // 否则，取消激活
      this.unActive()
    }
  }
}

class BackIndent extends DropListMenu {
  constructor (editor) {
    // 菜单栏中，标题菜单的 DOM 元素
    // 注意，这里的 $ 不是 jQuery ，是 E.$ （wangEditor 自带的 DOM 操作工具，类似于 jQuery）
    const $elem = E.$(
      `<div class="w-e-menu">
            <svg t="1607676292864" class="icon" style="color:#999;width:16px;height:16px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1062" width="200" height="200"><path d="M35.293867 139.264V36.864h954.845866v102.4H35.293867zM36.864 418.474667v-102.4h955.528533v102.4H36.864z m0.477867 269.380266v-102.4h952.797866v102.4H37.341867z m334.848 107.451734h279.210666l-139.605333 200.4992-139.605333-200.4992z" fill="#333333" p-id="1063"></path></svg>
            </div>`
    )
    // droplist 配置
    const dropListConf = {
      width: 100,
      title: '段后缩进',
      type: 'list',
      list: [
        { $elem: $('<span>增加2</span>'), value: '2' },
        { $elem: $('<span>增加4</span>'), value: '4' },
        { $elem: $('<span>增加8</span>'), value: '8' },
        { $elem: $('<span>增加16</span>'), value: '16' },
        { $elem: $('<span>减少2</span>'), value: '-2' },
        { $elem: $('<span>减少4</span>'), value: '-4' },
        { $elem: $('<span>减少8</span>'), value: '-8' },
        { $elem: $('<span>减少16</span>'), value: '-16' }
      ],
      // droplist 每个 item 的点击事件
      clickHandler: (value) => {
        // value 参数即 dropListConf.list 中配置的 value
        this.command(value)
      }
    }

    super($elem, editor, dropListConf)
  }

  command (value) {
    // 设置标题
    this.editor.cmd.do('formatBlock', value)
    const elem = this.editor.selection.getSelectionContainerElem().elems[0]
    console.log(elem.style)
    let marginBottom
    if (elem.style.marginBottom !== '') marginBottom = parseFloat(elem.style.marginBottom)
    else {
      marginBottom = 0
    }
    const finalBottom = marginBottom + parseInt(value) < 0 ? 0 : marginBottom + parseInt(value)
    elem.style.marginBottom = finalBottom + 'em'
  }

  // 菜单是否需要激活
  tryChangeActive () {
    const reg = /^h/i
    const cmdValue = this.editor.cmd.queryCommandValue('formatBlock')
    if (reg.test(cmdValue)) {
      // 选区处于标题内，激活菜单
      this.active()
    } else {
      // 否则，取消激活
      this.unActive()
    }
  }
}

export default {
  name: 'WangEditorExt',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    // eslint-disable-next-line
    value: {
      type: String
    }
  },
  data () {
    return {
      editor: null,
      editorContent: null
    }
  },
  mounted () {
    this.initEditor()
    this.setContent(this.value)
  },
  methods: {
    disable () {
      this.editor.disable()
    },
    initEditor () {
      this.editor = new E(this.$refs.editor)
      // console.log(this.editor)
      this.editor.config.placeholder = '请输入内容'
      // 设置编辑区域高度为 500px
      this.editor.config.height = 500
      // 配置全屏功能按钮是否展示
      this.editor.config.showFullScreen = true
      const menuKey1 = 'FirstIndent'
      this.editor.menus.extend(menuKey1, FirstIndent)
      const menuKey2 = 'BothIndent'
      this.editor.menus.extend(menuKey2, BothIndent)
      const menuKey3 = 'FrontIndent'
      this.editor.menus.extend(menuKey3, FrontIndent)
      const menuKey4 = 'BackIndent'
      this.editor.menus.extend(menuKey4, BackIndent)
      this.editor.config.menus = [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        menuKey1,
        menuKey2,
        menuKey3,
        menuKey4,
        'lineHeight',
        'foreColor',
        'backColor',
        'link',
        'list',
        'justify',
        'quote',
        'image',
        'video',
        'code',
        'undo',
        'table',
        'splitLine'
      ]
      // 配置触发 onchange 的时间频率，默认为 200ms
      this.editor.config.onchangeTimeout = 500 // 修改为 500ms
      // 配置 onchange 回调函数
      this.editor.config.onchange = (newHtml) => {
        console.log('change 之后最新的 html', newHtml)
        this.editorContent = newHtml
        this.$emit('change', this.editorContent)
      }
      // 隐藏插入网络图片
      this.editor.config.showLinkImg = false
      // 图片上传配置
      this.editor.config.customUploadImg = function (files, addImg) {
        const blobs = []
        const blob = {
          name: files[0].name,
          type: UploadType.IMG
        }
        blobs.push(blob)
        const params = {
          blobs: blobs
        }
        uploadFileToObs(params, files[0]).then((res) => {
          addImg(res)
        })
      }
      // 隐藏插入网络视频的功能
      this.editor.config.showLinkVideo = false
      // 限制视频大小
      this.editor.config.uploadVideoMaxSize = 1 * 1024 * 1024 * 1024 // 1024m
      // 上传视频 v4.6.3 开始支持上传视频
      this.editor.config.customUploadVideo = function (files, addImg) {
        const blobs = []
        const blob = {
          name: files[0].name,
          type: UploadType.MEDIA
        }
        blobs.push(blob)
        const params = {
          blobs: blobs
        }
        uploadFileToObs(params, files[0]).then((res) => {
          addImg(res)
        })
      }
      this.editor.create()
    },
    setContent (html) {
      this.editor.txt.html(html)
    },
    clear () {
      this.editor.txt.html()
    }
  }
}
</script>
<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
}
</style>
