import { MentionItemDataType } from '@gitee/wysiwyg-editor-extension-mention';

export type MentionMemberAttributes = {
  /** 姓名 */
  name: string;

  /** 用户名 */
  username: string;

  /** 链接 */
  url: string;
};

export type MentionMemberItemDataType =
  MentionItemDataType<MentionMemberAttributes>;
