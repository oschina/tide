import classNames from 'classnames';
import { isEqual } from 'lodash';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { Plugin } from 'prosemirror-state';
import type { JSONContent } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { Heading } from '@tiptap/extension-heading';
import { Blockquote } from '@tiptap/extension-blockquote';
import { HardBreak } from '@tiptap/extension-hard-break';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { ListItem } from '@tiptap/extension-list-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Bold } from '@tiptap/extension-bold';
import { Code } from '@tiptap/extension-code';
import { Italic } from '@tiptap/extension-italic';
import { Strike } from '@tiptap/extension-strike';
import { History } from '@tiptap/extension-history';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
// import { Placeholder } from '@tiptap/extension-placeholder';
import { TaskItem } from '@test-pkgs/extension-task-item';
import { Link } from '@test-pkgs/extension-link';
import { Image } from '@test-pkgs/extension-image';
import { CodeBlock } from '@test-pkgs/extension-code-block';
import { MentionMember } from './extensions/mention-member';
import {
  Emoji,
  suggestion as emojiSuggestion,
} from '@test-pkgs/extension-emoji';
import { Markdown } from '@test-pkgs/extension-markdown';
import { Uploader, defaultUploader } from '@test-pkgs/extension-uploader';
import { MarkdownEditor, createMarkdownEditor } from '@test-pkgs/markdown';
import type { MarkdownEditorOptions, Content } from '@test-pkgs/markdown';
import {
  Editor as TEditor,
  EditorContent as TEditorContent,
  useEditor,
} from '@test-pkgs/react';
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
      defaultValue = null,
      value: inputValue,
      autoFocus,
      readOnly,
      readOnlyEmptyView,
      children,
      onChange,
      onFocus,
      onBlur,
      onReady,
      onImageUploading,
    },
    ref
  ) => {
    const [value, setValue] = useState<Content>(
      (inputValue ?? defaultValue) || null
    );
    const inputValueRef = useRef(inputValue);
    inputValueRef.current = inputValue;

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onFocusRef = useRef(onFocus);
    onFocusRef.current = onFocus;
    const onBlurRef = useRef(onBlur);
    onBlurRef.current = onBlur;
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;
    const onImageUploadingRef = useRef(onImageUploading);
    onImageUploadingRef.current = onImageUploading;

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
          Heading,
          Blockquote,
          HardBreak,
          HorizontalRule,
          BulletList,
          OrderedList,
          ListItem,
          TaskList,
          TaskItem.configure({
            nested: true,
            onReadOnlyChecked: () => true,
          }),
          Table.configure({
            resizable: true,
          }),
          TableRow,
          TableCell,
          TableHeader,
          CodeBlock,
          Image,
          MentionMember.configure({
            suggestion: {
              items: ({ query }) => {
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
                      id: `${index + 1}`,
                      label,
                    },
                  }))
                  .filter((item) =>
                    item.label.toLowerCase().startsWith(query.toLowerCase())
                  )
                  .slice(0, 5);
                return items;
              },
            },
          }),
          Emoji.configure({
            enableEmoticons: true,
            forceFallbackImages: false,
            suggestion: emojiSuggestion,
          }),
          Bold,
          Code,
          Italic,
          Link,
          Strike,
          History,
          Dropcursor,
          Gapcursor,
          // Placeholder,
          Uploader.configure({
            uploader: async (files) => {
              onImageUploadingRef.current?.(true);
              const items = await defaultUploader(
                files.filter((file) => file.type.includes('image'))
              );
              onImageUploadingRef.current?.(false);
              return items;
            },
          }),
          Markdown.configure({
            paste: true,
            copy: false,
          }),
        ],
        content: value,
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
        onUpdate: ({ editor: e }) => {
          const json = e.getJSON();
          setValue(json);
          if (!isEqual(inputValueRef.current, json)) {
            onChangeRef.current?.(json, e as MarkdownEditor);
          }
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
      if (!editor || isEqual(inputValue, value)) return;
      try {
        editor.commands.setContent(inputValue || '');
      } catch (err) {
        editor.commands.setContent('');
        console.error(err);
      }
    }, [inputValue]);

    useEffect(() => {
      if (!editor || editor.isEditable === !readOnly) return;
      editor.setEditable(!readOnly);
    }, [readOnly]);

    useImperativeHandle(ref, () => editor as MarkdownEditor, [editor]);

    const fullClassName = classNames('ge-editor__editor-content', className);

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
