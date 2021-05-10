import E from 'wangeditor'
const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E
class BackIndent extends BtnMenu {
  constructor(editor) {
    const $elem = E.$(
      `<div class="w-e-menu">
            <svg t="1607676292864" class="icon" style="color:#999;width:16px;height:16px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1062" width="200" height="200"><path d="M35.293867 139.264V36.864h954.845866v102.4H35.293867zM36.864 418.474667v-102.4h955.528533v102.4H36.864z m0.477867 269.380266v-102.4h952.797866v102.4H37.341867z m334.848 107.451734h279.210666l-139.605333 200.4992-139.605333-200.4992z" fill="#333333" p-id="1063"></path></svg>
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

export default BackIndent
