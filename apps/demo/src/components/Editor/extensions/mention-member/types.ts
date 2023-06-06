import { MentionItemDataType } from '@gitee/tide-extension-mention';

export type MentionMemberAttributes = {
  /** 姓名 */
  name: string;

  /** 用户名 */
  username: string;

  /** 链接 */
  url: string;
};

export type MentionMemberItemDataType =
  MentionItemDataType<MentionMemberAttributes> & {
    label: string;
    desc?: string;
  };
