import { MentionItemDataType } from '@gitee/wysiwyg-editor-extension-mention';

export type MentionIssueAttributes = {
  /** 任务 Ident */
  ident: string;
  /** 任务标题 */
  title: string;
  /** 任务链接 */
  url: string;
};

export type MentionIssueItemDataType =
  MentionItemDataType<MentionIssueAttributes>;
