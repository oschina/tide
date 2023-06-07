import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Editor, EditorRender, EditorRenderProps } from '@gitee/tide';
import { StarterKit } from '@gitee/tide-starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { MentionMember } from './extensions/mention-member';
import { mockFetchMemberMentionDebounced, mockImgUploader } from './utils';

import '@gitee/tide/dist/style.css';
import 'highlight.js/styles/default.css';

export type TideEditorProps = Omit<EditorRenderProps, 'editorOptions'>;

export const TideEditor = forwardRef<Editor, TideEditorProps>(
  ({ ...props }, ref) => {
    const [editor, setEditor] = useState<Editor | null>(null);

    useImperativeHandle(ref, () => editor as Editor, [editor]);

    const editorOptions: EditorRenderProps['editorOptions'] = {
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
    };

    return (
      <EditorRender ref={setEditor} editorOptions={editorOptions} {...props} />
    );
  }
);

TideEditor.displayName = 'TideEditor';
