import { MentionItemDataType } from '@gitee/wysiwyg-editor-extension-mention';

export interface IssueType {
  id: number;
  enterprise_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  serial: number;
  template: string;
  ident: string;
  is_system: boolean;
  color: string;
  category: string;
  description: string;
  state: number;
}

export type MentionIssueAttributes = {
  id: number;
  iid: number;
  ident: string;
  title: string;
  issue_type: Partial<IssueType>;
};

export type MentionIssueItemDataType =
  MentionItemDataType<MentionIssueAttributes>;
