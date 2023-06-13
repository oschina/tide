import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Editor,
  EditorRender,
  EditorRenderProps,
  useEditor,
} from '@gitee/tide';
import { StarterKit } from '@gitee/tide-starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { MentionMember } from './extensions/mention-member';
import { mockFetchMemberMentionDebounced, mockImgUploader } from './utils';

import '@gitee/tide/dist/style.css';
import 'highlight.js/styles/default.css';

export type TideEditorProps = Omit<EditorRenderProps, 'editor'>;

export const TideEditor = forwardRef<Editor, TideEditorProps>(
  ({ ...props }, ref) => {
    const editor = useEditor({
      autofocus: true,
      extensions: [
        StarterKit.configure({
          textAlign: false,
          taskItem: {
            onReadOnlyChecked: () => true,
          },
          uploader: {
            image: {
              uploader: mockImgUploader,
            },
          },
        }),
        TextAlign.extend({
          addKeyboardShortcuts: () => ({}),
        }).configure({
          types: ['heading', 'paragraph'],
        }),
        MentionMember.configure({
          suggestion: {
            items: ({ query }) => mockFetchMemberMentionDebounced(query),
          },
        }),
      ],
      readOnlyEmptyView: (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <p>暂无内容（只读模式）</p>
        </div>
      ),
    });

    useImperativeHandle(ref, () => editor as Editor, [editor]);

    return <EditorRender editor={editor} {...props} />;
  }
);

TideEditor.displayName = 'TideEditor';
