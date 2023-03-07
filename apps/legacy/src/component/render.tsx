import ReactDom from 'react-dom';
import { Editor, EditorContent, useEditor } from '@gitee/wysiwyg-editor-react';

import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { CodeBlock } from '@gitee/wysiwyg-editor-extension-code-block';

const defaultExtensions = [Document, Paragraph, Text, CodeBlock];

export function renderApp(opts: { el: HTMLElement; content?: string }) {
  function App() {
    const editor = useEditor(Editor, {
      extensions: defaultExtensions,
      content: opts.content || '',
    });

    if (!editor) {
      return null;
    }

    return (
      <div className="editor-demo">
        <EditorContent editor={editor} />
      </div>
    );
  }

  ReactDom.render(<App />, opts.el);
}
