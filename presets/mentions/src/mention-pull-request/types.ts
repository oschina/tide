import { MentionItemDataType } from '@gitee/wysiwyg-editor-extension-mention';

export type MentionPullRequestAttributes = {
  /** PR ID */
  id: string;
  /** PR IID */
  iid: string;
  /** PR 标题 */
  title: string;
  /** PR 链接 */
  url: string;
};

export type MentionPullRequestItemDataType =
  MentionItemDataType<MentionPullRequestAttributes>;
