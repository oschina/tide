# @gitee/tide-extension-code

## 介绍

本扩展可为编辑器启用「行内代码」功能（类似于 HTML 标签 `<code>`）。

## 功能

本扩展基于 `@tiptap/extension-code` 修改了如下内容：

- 输入规则：输入 <code>\`code\`</code> 或 `·code·` 且在后面输入 <kbd>空格</kbd> 时，自动转换为行内代码
- 快捷键：当「行内代码」位于行首时，在它的左侧按下 <kbd>←</kbd> 可退出行内代码。
