# @gitee/tide-extension-code-block

## Introduction

This extension enables you to add fenced code blocks in the editor, which is generally used to input multiple lines of code.

## Features

This extension modifies the following features based on `@tiptap/extension-code-block-lowlight`:

- Code highlighting
- Language selection
- Automatic line wrapping
- Copy code
- Merge multiple selected paragraphs into one code block
- Indent multiple lines by pressing the <kbd>Tab</kbd> key within a code block
- Input rule: Automatically creates a code block when <code>\`\`\`</code>, `···`, `~~~`, or `～～～` is typed and <kbd>Space</kbd> or <kbd>Enter</kbd> is entered after it. You can also specify the language when typing, for example, <code>\`\`\`js</code> will create a code block for the corresponding language.

## Usage

This extension uses `highlight.js` as the code highlighting library, so you need to install `highlight.js` and import its style file.

```bash
npm install --save @gitee/tide-extension-code-block highlight.js
# or
yarn add @gitee/tide-extension-code-block highlight.js
# or
pnpm add @gitee/tide-extension-code-block highlight.js
```

Enable this extension in the editor:

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
