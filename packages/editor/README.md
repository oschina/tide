# @gitee/tide

## Introduction

This package provides an easy-to-use editor component for React.

## Installation

> If you do not want to enable syntax highlighting for code blocks, you can choose not to install `highlight.js`.

```bash
npm install --save @gitee/tide @gitee/tide-starter-kit highlight.js
# or
yarn add @gitee/tide @gitee/tide-starter-kit highlight.js
# or
pnpm add @gitee/tide @gitee/tide-starter-kit highlight.js
```

## Usage

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

To customize the styles, you can refer to the CSS variables in `@gitee/tide-theme/dist/variable.less`.

## Configuration

### useEditor Options

| Option               | Description                                         | Type                                                     | Default |
| -------------------- | --------------------------------------------------- | -------------------------------------------------------- | ------- |
| content              | The content of the editor                           | `HTMLContent \| JSONContent \| JSONContent[] \| null`    | -       |
| autofocus            | Whether to focus automatically                      | `'start' \| 'end' \| 'all' \| number \| boolean \| null` | `false` |
| editable             | Whether to allow editing                            | `boolean`                                                | `true`  |
| fullscreen           | Whether to enable full-screen mode                  | `boolean`                                                | `false` |
| readOnlyEmptyView    | The view when there is no content in read-only mode | `ReactNode`                                              | `null`  |
| readOnlyShowMenu     | Whether to show the menu bar in read-only mode      | `boolean`                                                | `false` |
| menuEnableUndoRedo   | Whether to enable undo/redo in the menu bar         | `boolean`                                                | `true`  |
| menuEnableFullscreen | Whether to enable full-screen mode in the menu bar  | `boolean`                                                | `true`  |
| onFullscreenChange   | Callback function when full-screen mode changes     | `(fullscreen: boolean) => void`                          | -       |
| onReady              | Callback function after initialization is complete  | `(editor: TideEditor) => void`                           | -       |
| onChange             | Callback function when content changes              | `(doc: JSONContent, editor: TideEditor) => void`         | -       |

More options can be found in the interface definition of `TideEditorOptions`.

### EditorRenderProps

| Property         | Description                             | Type            | Default |
| ---------------- | --------------------------------------- | --------------- | ------- |
| className        | Custom `className` for the container    | `string`        | -       |
| style            | Custom `style` for the container        | `CSSProperties` | -       |
| menuClassName    | Custom `className` for the menu bar     | `string`        | -       |
| menuStyle        | Custom `style` for the menu bar         | `CSSProperties` | -       |
| contentClassName | Custom `className` for the content area | `string`        | -       |
| contentStyle     | Custom `style` for the content area     | `CSSProperties` | -       |
