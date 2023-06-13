# @gitee/tide

## 介绍

本包提供了 React 易于使用的编辑器组件。

## 安装

```bash
npm install --save @gitee/tide
# or
yarn add @gitee/tide
# or
pnpm add @gitee/tide
```

## 使用

> 默认只包含基础编辑功能，更多丰富功能请安装使用 @gitee/tide-starter-kit

```tsx
import React, { useState } from 'react';
import { EditorRender, useEditor } from '@gitee/tide';

import '@gitee/tide/dist/style.css';

function App() {
  const editor = useEditor({
    content: 'Hello World!',
    onChange: (doc) => console.log('onChange', doc),
  });

  // Update editor content
  // editor.setContent('Changed content');

  return <EditorRender editor={editor} />;
}
```

如需自定义样式，可参考 `@gitee/tide-theme/dist/variable.less` 中的 CSS Variables 进行覆盖。

## 配置

### useEditor Options

| 配置                 | 说明                     | 类型                                                     | 默认值  |
| -------------------- | ------------------------ | -------------------------------------------------------- | ------- |
| content              | 内容                     | `HTMLContent \| JSONContent \| JSONContent[] \| null`    | -       |
| autofocus            | 是否自动聚焦             | `'start' \| 'end' \| 'all' \| number \| boolean \| null` | `false` |
| editable             | 是否允许编辑             | `boolean`                                                | `true`  |
| fullscreen           | 是否全屏模式             | `boolean`                                                | `false` |
| readOnlyEmptyView    | 只读模式下无内容时的视图 | `ReactNode`                                              | `null`  |
| readOnlyShowMenu     | 只读模式下是否显示菜单栏 | `boolean`                                                | `false` |
| menuEnableUndoRedo   | 菜单栏是否启用撤销重做   | `boolean`                                                | `true`  |
| menuEnableFullscreen | 菜单栏是否启用全屏       | `boolean`                                                | `true`  |
| onFullscreenChange   | 全屏状态变更时的回调函数 | `(fullscreen: boolean) => void`                          | -       |
| onReady              | 初始化完成后的回调函数   | `(editor: TideEditor) => void`                           | -       |
| onChange             | 内容变更时的回调函数     | `(doc: JSONContent, editor: TideEditor) => void`         | -       |

更多配置可参考 `TideEditorOptions` 接口定义。

### EditorRenderProps

| 属性             | 说明                     | 类型            | 默认值 |
| ---------------- | ------------------------ | --------------- | ------ |
| className        | 容器自定义 `className`   | `string`        | -      |
| style            | 容器自定义 `style`       | `CSSProperties` | -      |
| menuClassName    | 菜单栏自定义 `className` | `string`        | -      |
| menuStyle        | 菜单栏自定义 `style`     | `CSSProperties` | -      |
| contentClassName | 内容区自定义 `className` | `string`        | -      |
| contentStyle     | 内容区自定义 `style`     | `CSSProperties` | -      |

## 配置 starter-kit 插件

### 安装

```bash
npm install --save @gitee/tide-starter-kit highlight.js
# or
yarn add @gitee/tide-starter-kit highlight.js
# or
pnpm add @gitee/tide-starter-kit highlight.js
```

### 使用

```tsx
import React, { useState } from 'react';
import { EditorRender, useEditor } from '@gitee/tide';
import { StarterKit } from '@gitee/tide-starter-kit';

import '@gitee/tide/dist/style.css';
import 'highlight.js/styles/default.css';

function App() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '# Hello World!',
    onChange: (doc) => console.log('onChange', doc),
  });

  // Update editor content
  // editor.setContent('Changed content');

  return <EditorRender editor={editor} />;
}
```
