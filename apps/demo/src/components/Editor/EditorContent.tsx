import classNames from 'classnames';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import type { Plugin } from '@tiptap/pm/state';
import type { JSONContent } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { TextAlign } from '@tiptap/extension-text-align';
import { Heading } from '@tiptap/extension-heading';
import { HardBreak } from '@tiptap/extension-hard-break';
import { TaskList } from '@tiptap/extension-task-list';
import { History } from '@tiptap/extension-history';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import {
  Table,
  TableRow,
  TableCell,
} from '@gitee/wysiwyg-editor-extension-table';
import { TaskItem } from '@gitee/wysiwyg-editor-extension-task-item';
import { Link } from '@gitee/wysiwyg-editor-extension-link';
import { Image } from '@gitee/wysiwyg-editor-extension-image';
import { Indentation } from '@gitee/wysiwyg-editor-extension-indentation';
import { ListsIndentation } from '@gitee/wysiwyg-editor-extension-lists-indentation';
import { OrderedList } from '@gitee/wysiwyg-editor-extension-ordered-list';
import { BulletList } from '@gitee/wysiwyg-editor-extension-bullet-list';
import { ListItem } from '@gitee/wysiwyg-editor-extension-list-item';
import { Strike } from '@gitee/wysiwyg-editor-extension-strike';
import { Blockquote } from '@gitee/wysiwyg-editor-extension-blockquote';
import { Bold } from '@gitee/wysiwyg-editor-extension-bold';
import { Italic } from '@gitee/wysiwyg-editor-extension-italic';
import { Code } from '@gitee/wysiwyg-editor-extension-code';
import { CodeBlock } from '@gitee/wysiwyg-editor-extension-code-block';
import {
  Emoji,
  suggestion as emojiSuggestion,
} from '@gitee/wysiwyg-editor-extension-emoji';
import { HorizontalRule } from '@gitee/wysiwyg-editor-extension-horizontal-rule';
import { Markdown } from '@gitee/wysiwyg-editor-extension-markdown';
import {
  Uploader,
  defaultImgUploader,
} from '@gitee/wysiwyg-editor-extension-uploader';
import {
  MarkdownEditor,
  createMarkdownEditor,
} from '@gitee/wysiwyg-editor-markdown';
import type {
  MarkdownEditorOptions,
  Content,
} from '@gitee/wysiwyg-editor-markdown';
import { Commands, Keymap } from '@gitee/wysiwyg-editor-common';
import {
  Editor as TEditor,
  EditorContent as TEditorContent,
  useEditor,
} from '@gitee/wysiwyg-editor-react';
import { MentionMember } from './extensions/mention-member';
import './EditorContent.less';

export type EditorContentProps = {
  className?: string;
  style?: React.CSSProperties | undefined;
  defaultValue?: Content | undefined;
  value?: Content | undefined;
  autoFocus?: boolean;
  readOnly?: boolean;
  readOnlyEmptyView?: React.ReactNode;
  children?: React.ReactNode;
  onChange?: (doc: JSONContent, editor: MarkdownEditor) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onReady?: (editor: MarkdownEditor) => void;
  onImageUploading?: (isUploading: boolean) => void;
};

const MarkdownEditorClass = createMarkdownEditor(TEditor);

const EditorContent = forwardRef<MarkdownEditor, EditorContentProps>(
  (
    {
      className,
      style,
      autoFocus = false,
      readOnly,
      readOnlyEmptyView,
      children,
      onChange,
      onFocus,
      onBlur,
      onReady,
    },
    ref
  ) => {
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onFocusRef = useRef(onFocus);
    onFocusRef.current = onFocus;
    const onBlurRef = useRef(onBlur);
    onBlurRef.current = onBlur;
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    const mockFetchMemberMention = (query: string) => {
      console.log('mockFetchMemberMention', query);
      const items = [
        'Gitee',
        'OSCHINA',
        '开源中国',
        '马建仓',
        'Tiptap',
        'Google',
        'Apple',
        'Lea Thompson',
        'Cyndi Lauper',
        'Tom Cruise',
        'Madonna',
        'Jerry Hall',
        'Joan Collins',
        'Winona Ryder',
        'Christina Applegate',
        'Alyssa Milano',
        'Molly Ringwald',
        'Ally Sheedy',
        'Debbie Harry',
        'Olivia Newton-John',
        'Elton John',
        'Michael J. Fox',
        'Axl Rose',
        'Emilio Estevez',
        'Ralph Macchio',
        'Rob Lowe',
        'Jennifer Grey',
        'Mickey Rourke',
        'John Cusack',
        'Matthew Broderick',
        'Justine Bateman',
        'Lisa Bonet',
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
      return items;
    };

    const mockFetchMemberMentionDebounced = AwesomeDebouncePromise(
      mockFetchMemberMention,
      300,
      {
        onlyResolvesLast: false,
      }
    );

    const editor = useEditor<MarkdownEditor, MarkdownEditorOptions>(
      MarkdownEditorClass,
      {
        markdown: {
          linkify: true,
          breaks: true,
          tightLists: true,
        },
        extensions: [
          Commands,
          Keymap,
          Document,
          Paragraph,
          Text,
          TextAlign.extend({
            addKeyboardShortcuts: () => ({}),
          }).configure({
            types: ['heading', 'paragraph'],
          }),
          Bold,
          Italic,
          Strike,
          Code,
          Link,
          Heading,
          Blockquote,
          HardBreak,
          HorizontalRule,
          ListsIndentation,
          Indentation,
          BulletList,
          OrderedList,
          ListItem,
          TaskList,
          TaskItem.configure({
            onReadOnlyChecked: () => true,
          }),
          Table,
          TableRow,
          TableCell,
          CodeBlock,
          Image,
          MentionMember.configure({
            suggestion: {
              items: ({ query }) => mockFetchMemberMentionDebounced(query),
            },
          }),
          Emoji.configure({
            enableEmoticons: true,
            forceFallbackImages: false,
            suggestion: emojiSuggestion,
          }),
          History,
          Dropcursor,
          Gapcursor,
          Uploader.configure({
            image: {
              uploader: defaultImgUploader,
            },
          }),
          Markdown.configure({
            paste: true,
            copy: false,
          }),
        ],
        autofocus: autoFocus,
        editable: !readOnly,
        editorProps: {
          attributes: {
            spellCheck: 'false',
          },
        },
        onCreate: ({ editor: e }) => {
          const { state, view } = e;
          // 调整 suggestion 插件的优先级 (解决 # 与 heading input rule 冲突的问题)
          if (state.plugins.length > 0) {
            const restOfPlugins: Plugin[] = [];
            const suggestionPlugins: Plugin[] = [];
            state.plugins.forEach((plugin) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore: The `Plugin` type does not include `key`
              if ((plugin.key as string).includes('Suggestion')) {
                suggestionPlugins.push(plugin);
              } else {
                restOfPlugins.push(plugin);
              }
            });
            view.updateState(
              state.reconfigure({
                plugins: [...suggestionPlugins, ...restOfPlugins],
              })
            );
          }
          onReadyRef.current?.(e as MarkdownEditor);
        },
        onFocus: () => {
          onFocusRef.current?.();
        },
        onBlur: () => {
          onBlurRef.current?.();
        },
      },
      []
    );

    useEffect(() => {
      if (!editor || editor.isEditable === !readOnly) return;
      editor.setEditable(!readOnly);
    }, [readOnly]);

    useImperativeHandle(ref, () => editor as MarkdownEditor, [editor]);

    const fullClassName = classNames('gwe-content', className);

    if (editor && editor.isEmpty && !editor.isEditable) {
      return <div className={fullClassName}>{readOnlyEmptyView || null}</div>;
    }

    return (
      <TEditorContent
        className={fullClassName}
        style={style}
        editor={editor as unknown as TEditor}
      >
        {children}
      </TEditorContent>
    );
  }
);

EditorContent.displayName = 'EditorContent';

export default EditorContent;
