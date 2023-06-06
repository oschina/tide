import React, { forwardRef, useImperativeHandle, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { TextAlign } from '@tiptap/extension-text-align';
import { Editor, EditorRender, EditorRenderProps } from '@gitee/tide';
import { MentionMember } from './extensions/mention-member';
import { ajaxImgUploader } from './utils';
import '@gitee/tide/dist/style.css';
import 'highlight.js/styles/default.css';

export type TideEditorProps = Omit<
  EditorRenderProps,
  'editorOptions' | 'extensionOptions'
>;

export const TideEditor = forwardRef<Editor, TideEditorProps>(
  ({ ...props }, ref) => {
    const [editor, setEditor] = useState<Editor | null>(null);

    useImperativeHandle(ref, () => editor as Editor, [editor]);

    const mockFetchMemberMention = (query: string) => {
      return [
        'Gitee',
        'OSCHINA',
        '开源中国',
        '马建仓',
        'Tiptap',
        'Google',
        'Apple',
        'Microsoft',
      ]
        .map((label, index) => ({
          id: `${index + 1}`,
          label,
          desc: label.toLowerCase(),
          attrs: {
            name: label,
            username: label.toLowerCase(),
            url: `/members/${label.toLowerCase()}`,
          },
        }))
        .filter((item) =>
          item.label.toLowerCase().startsWith(query.toLowerCase())
        )
        .slice(0, 5);
    };

    const mockFetchMemberMentionDebounced = AwesomeDebouncePromise(
      mockFetchMemberMention,
      300,
      {
        onlyResolvesLast: false,
      }
    );

    const extensionOptions: EditorRenderProps['extensionOptions'] = {
      textAlign: false,
      taskItem: {
        onReadOnlyChecked: () => true,
      },
      uploader: {
        image: {
          uploader: ajaxImgUploader,
        },
      },
    };

    const editorOptions: EditorRenderProps['editorOptions'] = {
      extensions: [
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
      <EditorRender
        ref={setEditor}
        editorOptions={editorOptions}
        extensionOptions={extensionOptions}
        {...props}
      />
    );
  }
);

TideEditor.displayName = 'TideEditor';
