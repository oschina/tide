import {
  Commands,
  HighPriorityKeymap,
  LowPriorityKeymap,
} from '@gitee/wysiwyg-editor-common';
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
import { Uploader } from '@gitee/wysiwyg-editor-extension-uploader';
import { mockAjaxImgUploader } from './mock';

export const getExtensions = () => {
  return [
    Commands,
    HighPriorityKeymap,
    LowPriorityKeymap,
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
    // MentionMember.configure({
    //   suggestion: {
    //     items: ({ query }) => mockFetchMemberMentionDebounced(query),
    //   },
    // }),
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
        uploader: mockAjaxImgUploader,
      },
    }),
    Markdown.configure({
      paste: true,
      copy: false,
    }),
  ];
};