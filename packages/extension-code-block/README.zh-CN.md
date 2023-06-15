# @gitee/tide-extension-code-block

## 介绍

本扩展可为编辑器启用「代码块」功能，一般用于输入多行代码。

## 功能

本扩展基于 `@tiptap/extension-code-block-lowlight` 修改了如下内容：

- 代码高亮
- 语言选择
- 自动换行
- 复制代码
- 选中多个段落文本后，可合并转换为一个代码块
- 在代码块内，可选中多行，通过 <kbd>Tab</kbd> 快捷键缩进
- 输入规则：输入 <code>\`\`\`</code>、`···`、`~~~`、`～～～` 且在后面输入 <kbd>空格</kbd> 或 <kbd>回车</kbd> 时，自动创建代码块。也可以在输入时指定语言，例如 <code>\`\`\`js</code> 将创建对应语言的代码块。

## 使用

本扩展使用 `highlight.js` 作为代码高亮库，因此需要安装 `highlight.js`，并引入其样式文件。

```bash
npm install --save @gitee/tide-extension-code-block highlight.js
# or
yarn add @gitee/tide-extension-code-block highlight.js
# or
pnpm add @gitee/tide-extension-code-block highlight.js
```

在编辑器中启用本扩展：

```tsx
import React, { useState } from 'react';
import { EditorRender, JSONContent } from '@gitee/tide';
import { CodeBlock } from '@gitee/tide-extension-code-block';

import '@gitee/tide/dist/style.css';
import 'highlight.js/styles/default.css';

function App() {
  const [value, setValue] = useState<JSONContent | null>(null);
  return (
    <EditorRender
      defaultValue={`\`\`\`js
console.log('Hello World!')
\`\`\``}
      onChange={(doc) => setValue(doc)}
      editorOptions={{
        extensions: [CodeBlockExtension],
      }}
    />
  );
}
```
