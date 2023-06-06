# @gitee/tide-extension-blockquote

## 介绍

本扩展可为编辑器启用「块引用」功能（类似于 HTML 标签 `<blockquote>`），一般用于引用其他来源的内容或注释。

## 功能

本扩展基于 `@tiptap/extension-blockquote` 修改了如下内容：

- 快捷键：<kbd>Ctrl/Command</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> 插入或取消块引用
- 输入规则：在行首输入 `> ` 或 `》 ` 快速创建块引用
- 粘贴规则：粘贴 `> 引文` 格式的内容，自动转换为块引用
