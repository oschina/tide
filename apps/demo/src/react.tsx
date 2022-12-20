import './style.less';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Editor, EditorContent, useEditor } from '@test-pkgs/react';
import {
  MarkdownEditor,
  MarkdownEditorOptions,
  createMarkdownEditor,
} from '@test-pkgs/markdown';
import Blockquote from '@tiptap/extension-blockquote';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

// custom extensions
import Link, { LinkBubbleMenu } from '@test-pkgs/extension-link';
import Image, { uploadImage } from '@test-pkgs/extension-image';
import Uploader from '@test-pkgs/extension-uploader';
import CodeBlock from '@test-pkgs/extension-code-block';
import Emoji, {
  suggestion as emojiSuggestion,
} from '@test-pkgs/extension-emoji';
import { Markdown } from '@test-pkgs/extension-markdown';
import DevtoolPanel from './components/DevtoolPanel';

const MarkdownEditorClass = createMarkdownEditor(Editor);

function App() {
  const editor = useEditor<MarkdownEditor, MarkdownEditorOptions>(
    MarkdownEditorClass,
    {
      markdown: {
        linkify: true,
        breaks: true,
        tightLists: true,
      },
      extensions: [
        Document,
        Paragraph,
        Text,
        Link,
        Image,
        Uploader,
        Blockquote,
        CodeBlock,
        Emoji.configure({
          enableEmoticons: true,
          forceFallbackImages: false,
          suggestion: emojiSuggestion,
        }),
        Markdown.configure({
          paste: true,
          copy: false,
        }),
      ],
      content: `
      <blockquote>
        Nothing is impossible, the word itself says “I’m possible!”
      </blockquote>
      <p>Audrey Hepburn</p>
    `,
    }
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="demo">
      <div className="demo-editor">
        <div className="demo-menu">
          <button onClick={() => uploadImage(editor)}>image</button>
          <button
            onClick={() =>
              editor?.chain().focus().toggleLink({ href: '' }).run()
            }
            className={editor.isActive('link') ? 'is-active' : ''}
          >
            link
          </button>
        </div>
        <EditorContent editor={editor as unknown as Editor}>
          {editor && <LinkBubbleMenu editor={editor} />}
        </EditorContent>
      </div>
      <DevtoolPanel editor={editor} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
