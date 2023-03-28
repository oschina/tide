import { MentionItemDataType } from '@gitee/wysiwyg-editor-extension-mention';

export type MentionPullRequestAttributes = {
  id: number;
  iid: number;
  state: string;
  title: string;
  lightweight: boolean;
  project_id: number;
  project_path: string;
};

export type MentionPullRequestItemDataType =
  MentionItemDataType<MentionPullRequestAttributes>;
