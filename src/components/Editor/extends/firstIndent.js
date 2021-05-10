import E from 'wangeditor'
const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E
class FirstIndent extends BtnMenu {
  constructor(editor) {
    const $elem = E.$(
      `<div class="w-e-menu">
                <svg t="1607675638946" style="color:#999;width:16px;height:16px" class="icon" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="580" width="200" height="200"><path d="M915.968 458.532571v-87.04l145.700571 164.864-145.700571 164.790858V604.818286H695.954286v-146.285715h220.013714zM36.790857 153.746286v-109.714286h1021.074286v109.714286H36.864z m-1.462857 314.221714v-109.714286h588.507429v109.714286H35.254857z m2.633143 213.430857v-109.714286h584.557714v109.714286H38.034286z m1.828571 310.710857v-109.714285H1062.765714v109.714285H39.789714z" fill="#333333" p-id="581"></path></svg>
            </div>`
    )
    super($elem, editor)
  }
  // 菜单点击事件
  clickHandler() {
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

export default FirstIndent
