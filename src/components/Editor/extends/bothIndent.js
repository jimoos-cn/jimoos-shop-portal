import E from 'wangeditor'
const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E
class BothIndent extends BtnMenu {
  constructor(editor) {
    const $elem = E.$(
      `<div class="w-e-menu">
            <svg t="1607675913897" class="icon" style="color:#999;width:16px;height:16px" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="758" width="200" height="200"><path d="M36.352 153.014857v-109.714286H1061.302857v109.714286H36.352z m222.061714 275.090286v-109.714286h583.753143v109.714286h-583.68z m0 290.377143v-109.714286h581.046857v109.714286H258.413714zM34.962286 999.350857v-109.714286h1024.292571v109.714286H34.962286zM34.084571 657.993143V375.296l164.571429 141.385143-164.571429 141.312z m1019.392-0.292572l-156.306285-142.262857 156.306285-142.189714v284.452571z" fill="#333333" p-id="759"></path></svg>
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

export default BothIndent
