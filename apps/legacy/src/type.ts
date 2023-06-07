import { UploaderFunc } from '@gitee/tide-extension-uploader';
import type {
  MentionMemberItemDataType,
  MentionIssueItemDataType,
  MentionPullRequestItemDataType,
  BulkFetcherRequestFunc,
} from '@gitee/tide-presets-mentions';

export type MentionType = {
  fetchMentionMember: (
    query: string
  ) => Promise<MentionMemberItemDataType[] | []>;
  fetchMentionIssue: (
    query: string
  ) => Promise<MentionIssueItemDataType[] | []>;
  fetchMentionPR: (
    query: string
  ) => Promise<MentionPullRequestItemDataType[] | []>;
};

export type LegacyExtOpts = {
  mention: MentionType;
  imageUpload: UploaderFunc;
  fetchResources: BulkFetcherRequestFunc;
};
