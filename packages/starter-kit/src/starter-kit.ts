import { Extension, Extensions } from '@tiptap/core';
import {
  Commands,
  HighPriorityKeymap,
  LowPriorityKeymap,
} from '@gitee/tide-common';
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

export interface StarterKitOptions {
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
}

export const StarterKit = Extension.create<StarterKitOptions>({
  name: 'starterKit',

  addExtensions() {
    const extensions: Extensions = [];
    const tableCellContent: string[] = [];

    if (this.options.commands !== false) {
      extensions.push(Commands);
    }

    if (this.options.highPriorityKeymap !== false) {
      extensions.push(HighPriorityKeymap);
    }

    if (this.options.lowPriorityKeymap !== false) {
      extensions.push(LowPriorityKeymap);
    }

    if (this.options.document !== false) {
      extensions.push(Document);
    }

    if (this.options.paragraph !== false) {
      extensions.push(Paragraph.configure(this.options.paragraph));
      tableCellContent.push('paragraph');
    }

    if (this.options.text !== false) {
      extensions.push(Text);
    }

    if (this.options.textAlign !== false) {
      extensions.push(
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          ...this.options.textAlign,
        })
      );
    }

    if (this.options.bold !== false) {
      extensions.push(Bold.configure(this.options.bold));
    }

    if (this.options.italic !== false) {
      extensions.push(Italic.configure(this.options.italic));
    }

    if (this.options.strike !== false) {
      extensions.push(Strike.configure(this.options.strike));
    }

    if (this.options.code !== false) {
      extensions.push(Code.configure(this.options.code));
    }

    if (this.options.link !== false) {
      extensions.push(Link.configure(this.options.link));
    }

    if (this.options.heading !== false) {
      extensions.push(Heading.configure(this.options.heading));
      tableCellContent.push('heading');
    }

    if (this.options.blockquote !== false) {
      extensions.push(Blockquote.configure(this.options.blockquote));
      tableCellContent.push('blockquote');
    }

    if (this.options.hardBreak !== false) {
      extensions.push(HardBreak.configure(this.options.hardBreak));
    }

    if (this.options.horizontalRule !== false) {
      extensions.push(HorizontalRule.configure(this.options.horizontalRule));
      tableCellContent.push('horizontalRule');
    }

    if (this.options.listsIndentation !== false) {
      extensions.push(
        ListsIndentation.configure(this.options.listsIndentation)
      );
    }

    if (this.options.indentation !== false) {
      extensions.push(Indentation.configure(this.options.indentation));
    }

    if (this.options.bulletList !== false) {
      extensions.push(BulletList.configure(this.options.bulletList));
    }

    if (this.options.orderedList !== false) {
      extensions.push(OrderedList.configure(this.options.orderedList));
    }

    if (
      this.options.bulletList !== false ||
      this.options.orderedList !== false
    ) {
      extensions.push(ListItem.configure(this.options.listItem));
    }

    if (this.options.taskList !== false) {
      extensions.push(TaskList.configure(this.options.taskList));
      extensions.push(TaskItem.configure(this.options.taskItem));
    }

    if (
      this.options.bulletList !== false ||
      this.options.orderedList !== false ||
      this.options.taskList !== false
    ) {
      tableCellContent.push('list');
    }

    if (this.options.codeBlock !== false) {
      extensions.push(CodeBlock.configure(this.options.codeBlock));
      tableCellContent.push('codeBlock');
    }

    if (this.options.image !== false) {
      // uploader extension is required
      if (this.options.uploader !== false) {
        extensions.push(Image.configure(this.options.image));
        tableCellContent.push('image');
      } else {
        console.warn(
          'Uploader extension is required for image extension. Please enable uploader extension.'
        );
      }
    }

    if (this.options.table !== false) {
      const TableCellExtension = TableCell.extend({
        content: `(${tableCellContent.join(' | ')})+`,
      });
      extensions.push(Table.configure(this.options.table));
      extensions.push(TableRow.configure(this.options.tableRow));
      extensions.push(TableCellExtension.configure(this.options.tableCell));
    }

    if (this.options.emoji !== false) {
      extensions.push(
        Emoji.configure({
          enableEmoticons: true,
          forceFallbackImages: false,
          suggestion: emojiSuggestion,
          ...this.options.emoji,
        })
      );
    }

    if (this.options.history !== false) {
      extensions.push(History.configure(this.options.history));
    }

    if (this.options.dropcursor !== false) {
      extensions.push(Dropcursor.configure(this.options.dropcursor));
    }

    if (this.options.gapcursor !== false) {
      extensions.push(Gapcursor);
    }

    if (this.options.uploader !== false) {
      extensions.push(Uploader.configure(this.options.uploader));
    }

    if (this.options.markdown !== false) {
      extensions.push(
        Markdown.configure({
          linkify: true,
          breaks: true,
          tightLists: true,
          paste: true,
          copy: false,
          ...this.options.markdown,
        })
      );
    }

    return extensions;
  },
});
