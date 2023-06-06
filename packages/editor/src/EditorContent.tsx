import classNames from 'classnames';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import type { Plugin } from '@tiptap/pm/state';
import type { JSONContent, Extensions, FocusPosition } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import { Paragraph, ParagraphOptions } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { TextAlign, TextAlignOptions } from '@tiptap/extension-text-align';
import { Heading, HeadingOptions } from '@tiptap/extension-heading';
import { HardBreak, HardBreakOptions } from '@tiptap/extension-hard-break';
import { History, HistoryOptions } from '@tiptap/extension-history';
import { Dropcursor, DropcursorOptions } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import {
  Table,
  TableOptions,
  TableRow,
  TableRowOptions,
  TableCell,
  TableCellOptions,
} from '@gitee/tide-extension-table';
import { Link, LinkOptions } from '@gitee/tide-extension-link';
import { Image, ImageOptions } from '@gitee/tide-extension-image';
import {
  Indentation,
  IndentationOptions,
} from '@gitee/tide-extension-indentation';
import {
  ListsIndentation,
  ListsIndentationOptions,
} from '@gitee/tide-extension-lists-indentation';
import {
  BulletList,
  BulletListOptions,
} from '@gitee/tide-extension-bullet-list';
import {
  OrderedList,
  OrderedListOptions,
} from '@gitee/tide-extension-ordered-list';
import { ListItem, ListItemOptions } from '@gitee/tide-extension-list-item';
import { TaskList, TaskListOptions } from '@tiptap/extension-task-list';
import { TaskItem, TaskItemOptions } from '@gitee/tide-extension-task-item';
import {
  Blockquote,
  BlockquoteOptions,
} from '@gitee/tide-extension-blockquote';
import { Bold, BoldOptions } from '@gitee/tide-extension-bold';
import { Italic, ItalicOptions } from '@gitee/tide-extension-italic';
import { Strike, StrikeOptions } from '@gitee/tide-extension-strike';
import { Code, CodeOptions } from '@gitee/tide-extension-code';
import { CodeBlock, CodeBlockOptions } from '@gitee/tide-extension-code-block';
import {
  Emoji,
  EmojiOptions,
  suggestion as emojiSuggestion,
} from '@gitee/tide-extension-emoji';
import {
  HorizontalRule,
  HorizontalRuleOptions,
} from '@gitee/tide-extension-horizontal-rule';
import { Markdown, MarkdownOptions } from '@gitee/tide-extension-markdown';
import { Uploader, UploaderOptions } from '@gitee/tide-extension-uploader';
import {
  Commands,
  HighPriorityKeymap,
  LowPriorityKeymap,
} from '@gitee/tide-common';
import {
  Content,
  Editor,
  EditorOptions,
  EditorContent as TEditorContent,
  useEditor,
} from '@gitee/tide-react';
import './EditorContent.less';

export type ExtensionOptions = {
  commands: false;
  highPriorityKeymap: false;
  lowPriorityKeymap: false;
  document: false;
  paragraph: Partial<ParagraphOptions> | false;
  text: false;
  textAlign: Partial<TextAlignOptions> | false;
  bold: Partial<BoldOptions> | false;
  italic: Partial<ItalicOptions> | false;
  strike: Partial<StrikeOptions> | false;
  code: Partial<CodeOptions> | false;
  link: Partial<LinkOptions> | false;
  heading: Partial<HeadingOptions> | false;
  blockquote: Partial<BlockquoteOptions> | false;
  hardBreak: Partial<HardBreakOptions> | false;
  horizontalRule: Partial<HorizontalRuleOptions> | false;
  listsIndentation: Partial<ListsIndentationOptions> | false;
  indentation: Partial<IndentationOptions> | false;
  bulletList: Partial<BulletListOptions> | false;
  orderedList: Partial<OrderedListOptions> | false;
  listItem: Partial<ListItemOptions>;
  taskList: Partial<TaskListOptions> | false;
  taskItem: Partial<TaskItemOptions>;
  table: Partial<TableOptions> | false;
  tableRow: Partial<TableRowOptions>;
  tableCell: Partial<TableCellOptions>;
  codeBlock: Partial<CodeBlockOptions> | false;
  image: Partial<ImageOptions> | false;
  emoji: Partial<EmojiOptions> | false;
  history: Partial<HistoryOptions> | false;
  dropcursor: Partial<DropcursorOptions> | false;
  gapcursor: false;
  uploader: Partial<UploaderOptions> | false;
  markdown: Partial<MarkdownOptions> | false;
};

export type EditorContentProps = {
  className?: string;
  style?: React.CSSProperties;

  defaultValue?: Content;

  autoFocus?: FocusPosition;
  readOnly?: boolean;
  readOnlyEmptyView?: React.ReactNode;

  children?: React.ReactNode;

  onReady?: (editor: Editor) => void;
  onChange?: (doc: JSONContent, editor: Editor) => void;
  onFocus?: EditorOptions['onFocus'];
  onBlur?: EditorOptions['onBlur'];

  editorOptions?: Partial<EditorOptions>;
  extensionOptions?: Partial<ExtensionOptions>;
};

export const EditorContent: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<EditorContentProps> & React.RefAttributes<Editor>
> = forwardRef<Editor, EditorContentProps>(
  (
    {
      className,
      style,
      defaultValue,
      autoFocus,
      readOnly,
      readOnlyEmptyView,
      children,
      onChange,
      onFocus,
      onBlur,
      onReady,
      editorOptions = {} as EditorOptions,
      extensionOptions = {} as ExtensionOptions,
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

    const coreExtensions = useMemo(() => {
      const exts: Extensions = [];
      const tableCellContent: string[] = [];

      if (extensionOptions.commands !== false) {
        exts.push(Commands);
      }

      if (extensionOptions.highPriorityKeymap !== false) {
        exts.push(HighPriorityKeymap);
      }

      if (extensionOptions.lowPriorityKeymap !== false) {
        exts.push(LowPriorityKeymap);
      }

      if (extensionOptions.document !== false) {
        exts.push(Document);
      }

      if (extensionOptions.paragraph !== false) {
        exts.push(Paragraph.configure(extensionOptions.paragraph));
        tableCellContent.push('paragraph');
      }

      if (extensionOptions.text !== false) {
        exts.push(Text);
      }

      if (extensionOptions.textAlign !== false) {
        exts.push(TextAlign.configure(extensionOptions.textAlign));
      }

      if (extensionOptions.bold !== false) {
        exts.push(Bold.configure(extensionOptions.bold));
      }

      if (extensionOptions.italic !== false) {
        exts.push(Italic.configure(extensionOptions.italic));
      }

      if (extensionOptions.strike !== false) {
        exts.push(Strike.configure(extensionOptions.strike));
      }

      if (extensionOptions.code !== false) {
        exts.push(Code.configure(extensionOptions.code));
      }

      if (extensionOptions.link !== false) {
        exts.push(Link.configure(extensionOptions.link));
      }

      if (extensionOptions.heading !== false) {
        exts.push(Heading.configure(extensionOptions.heading));
        tableCellContent.push('heading');
      }

      if (extensionOptions.blockquote !== false) {
        exts.push(Blockquote.configure(extensionOptions.blockquote));
        tableCellContent.push('blockquote');
      }

      if (extensionOptions.hardBreak !== false) {
        exts.push(HardBreak.configure(extensionOptions.hardBreak));
      }

      if (extensionOptions.horizontalRule !== false) {
        exts.push(HorizontalRule.configure(extensionOptions.horizontalRule));
        tableCellContent.push('horizontalRule');
      }

      if (extensionOptions.listsIndentation !== false) {
        exts.push(
          ListsIndentation.configure(extensionOptions.listsIndentation)
        );
      }

      if (extensionOptions.indentation !== false) {
        exts.push(Indentation.configure(extensionOptions.indentation));
      }

      if (extensionOptions.bulletList !== false) {
        exts.push(BulletList.configure(extensionOptions.bulletList));
      }

      if (extensionOptions.orderedList !== false) {
        exts.push(OrderedList.configure(extensionOptions.orderedList));
      }

      if (
        extensionOptions.bulletList !== false ||
        extensionOptions.orderedList !== false
      ) {
        exts.push(ListItem.configure(extensionOptions.listItem));
      }

      if (extensionOptions.taskList !== false) {
        exts.push(TaskList.configure(extensionOptions.taskList));
        exts.push(TaskItem.configure(extensionOptions.taskItem));
      }

      if (
        extensionOptions.bulletList !== false ||
        extensionOptions.orderedList !== false ||
        extensionOptions.taskList !== false
      ) {
        tableCellContent.push('list');
      }

      if (extensionOptions.codeBlock !== false) {
        exts.push(CodeBlock.configure(extensionOptions.codeBlock));
        tableCellContent.push('codeBlock');
      }

      if (extensionOptions.image !== false) {
        // uploader extension is required
        if (extensionOptions.uploader !== false) {
          exts.push(Image.configure(extensionOptions.image));
          tableCellContent.push('image');
        } else {
          console.warn(
            'Uploader extension is required for image extension. Please enable uploader extension.'
          );
        }
      }

      if (extensionOptions.table !== false) {
        const TableCellExtension = TableCell.extend({
          content: `(${tableCellContent.join(' | ')})+`,
        });
        exts.push(Table.configure(extensionOptions.table));
        exts.push(TableRow.configure(extensionOptions.tableRow));
        exts.push(TableCellExtension.configure(extensionOptions.tableCell));
      }

      if (extensionOptions.emoji !== false) {
        exts.push(
          Emoji.configure({
            enableEmoticons: true,
            forceFallbackImages: false,
            suggestion: emojiSuggestion,
            ...extensionOptions.emoji,
          })
        );
      }

      if (extensionOptions.history !== false) {
        exts.push(History.configure(extensionOptions.history));
      }

      if (extensionOptions.dropcursor !== false) {
        exts.push(Dropcursor.configure(extensionOptions.dropcursor));
      }

      if (extensionOptions.gapcursor !== false) {
        exts.push(Gapcursor);
      }

      if (extensionOptions.uploader !== false) {
        exts.push(Uploader.configure(extensionOptions.uploader));
      }

      if (extensionOptions.markdown !== false) {
        exts.push(
          Markdown.configure({
            linkify: true,
            breaks: true,
            tightLists: true,
            paste: true,
            copy: false,
            ...extensionOptions.markdown,
          })
        );
      }

      return exts;
    }, [extensionOptions]);

    const { extensions = [], ...otherEditorOptions } = editorOptions;

    const editor = useEditor(
      Editor,
      {
        extensions: [...coreExtensions, ...extensions],
        content: defaultValue,
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
          onReadyRef.current?.(e as Editor);
        },
        onUpdate: ({ editor: e }) => {
          onChangeRef.current?.(e.getJSON(), e as Editor);
        },
        onFocus: (props) => {
          onFocusRef.current?.(props);
        },
        onBlur: (props) => {
          onBlurRef.current?.(props);
        },
        ...otherEditorOptions,
      },
      []
    );

    useEffect(() => {
      if (!editor || editor.isEditable === !readOnly) return;
      editor.setEditable(!readOnly);
    }, [readOnly]);

    useImperativeHandle(ref, () => editor, [editor]);

    const fullClassName = classNames('gwe-content', className);

    if (editor && editor.isEmpty && !editor.isEditable) {
      return (
        <div className={fullClassName} style={style}>
          {readOnlyEmptyView || null}
        </div>
      );
    }

    return (
      <TEditorContent className={fullClassName} style={style} editor={editor}>
        {children}
      </TEditorContent>
    );
  }
);

EditorContent.displayName = 'EditorContent';
