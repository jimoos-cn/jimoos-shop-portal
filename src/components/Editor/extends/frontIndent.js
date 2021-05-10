import E from 'wangeditor'
const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E
class FrontIndent extends BtnMenu {
  constructor(editor) {
    const $elem = E.$(
      `<div class="w-e-menu">
            <svg t="1607676341824" class="icon" style="color:#999;width:16px;height:16px" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1214" width="200" height="200"><path d="M399.725714 225.133714L547.766857 15.872l148.041143 209.188571H399.725714zM37.302857 473.161143v-109.714286h1021.44v109.714286H37.376z m-2.925714 264.045714v-109.714286h1027.510857v109.714286H34.450286z m2.194286 260.608v-109.714286h1022.317714v109.714286H36.571429z" fill="#333333" p-id="1215"></path></svg>
            </div>`
    )
    super($elem, editor)
  }
  // 菜单点击事件
  clickHandler() {
    // 做任何你想做的事情
    // 可参考【常用 API】文档，来操作编辑器

    alert('hello world')
  }
  // 菜单是否被激活（如果不需要，这个函数可以空着）
  // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
  // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
  tryChangeActive() {
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

export default FrontIndent
