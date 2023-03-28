import { MentionItemDataType } from '@gitee/wysiwyg-editor-extension-mention';

export type MentionMemberAttributes = {
  name: string;
  username: string;
  avatar_url: string;
};

export type MentionMemberItemDataType =
  MentionItemDataType<MentionMemberAttributes>;
