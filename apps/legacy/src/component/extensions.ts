import {
  Commands,
  HighPriorityKeymap,
  LowPriorityKeymap,
} from '@gitee/tide-common';
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
import { Table, TableRow, TableCell } from '@gitee/tide-extension-table';
import { TaskItem } from '@gitee/tide-extension-task-item';
import { Link } from '@gitee/tide-extension-link';
import { Image } from '@gitee/tide-extension-image';
import { Indentation } from '@gitee/tide-extension-indentation';
import { ListsIndentation } from '@gitee/tide-extension-lists-indentation';
import { OrderedList } from '@gitee/tide-extension-ordered-list';
import { BulletList } from '@gitee/tide-extension-bullet-list';
import { ListItem } from '@gitee/tide-extension-list-item';
import { Strike } from '@gitee/tide-extension-strike';
import { Blockquote } from '@gitee/tide-extension-blockquote';
import { Bold } from '@gitee/tide-extension-bold';
import { Italic } from '@gitee/tide-extension-italic';
import { Code } from '@gitee/tide-extension-code';
import { CodeBlock } from '@gitee/tide-extension-code-block';
import {
  Emoji,
  suggestion as emojiSuggestion,
} from '@gitee/tide-extension-emoji';
import { HorizontalRule } from '@gitee/tide-extension-horizontal-rule';
import { Markdown } from '@gitee/tide-extension-markdown';
import { Uploader, UploaderFunc } from '@gitee/tide-extension-uploader';
import {
  MentionMember,
  MentionIssue,
  MentionPullRequest,
} from '@gitee/tide-presets-mentions';
import type {
  MentionMemberItemDataType,
  MentionIssueItemDataType,
  MentionPullRequestItemDataType,
} from '@gitee/tide-presets-mentions';
import { mockMention, mockAjaxImgUploader } from './default';
import { pulls, issues, members } from '../utils/mentionLink';

export type MentionType = {
  fetchMentionMember?: (
    query: string
  ) => Promise<MentionMemberItemDataType[] | []>;
  fetchMentionIssue?: (
    query: string
  ) => Promise<MentionIssueItemDataType[] | []>;
  fetchMentionPR?: (
    query: string
  ) => Promise<MentionPullRequestItemDataType[] | []>;
};

export type ExtensionsOpts = {
  mention?: MentionType;
  imageUpload?: UploaderFunc;
};

export const getExtensions = ({
  mention,
  imageUpload = mockAjaxImgUploader,
}: ExtensionsOpts) => {
  const {
    fetchMentionMember = mockMention,
    fetchMentionIssue = mockMention,
    fetchMentionPR = mockMention,
  } = mention || {};

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
    MentionMember.configure({
      suggestion: {
        items: ({ query }) => fetchMentionMember(query),
      },
      getLink: members.getLink,
    }),
    MentionIssue.configure({
      suggestion: {
        items: ({ query }) => fetchMentionIssue(query),
      },
      getLink: issues.getLink,
    }),
    MentionPullRequest.configure({
      suggestion: {
        items: ({ query }) => fetchMentionPR(query),
      },
      getLink: pulls.getLink,
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
        uploader: imageUpload,
      },
    }),
    Markdown.configure({
      linkify: true,
      breaks: true,
      tightLists: true,
      paste: true,
      copy: false,
    }),
  ];
};
