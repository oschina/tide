import issues from './issues.json';
import members from './members.json';
import pullRequests from './pull_requests.json';
import {
  MentionPullRequestAttributes,
  MentionMemberAttributes,
  MentionIssueAttributes,
} from '@gitee/wysiwyg-editor-presets-mentions';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type TypeMentionList = {
  issues: MentionIssueAttributes;
  members: MentionIssueAttributes;
  pullRequests: MentionIssueAttributes;
};

export async function fetchMention<
  T extends 'issues' | 'members' | 'pullRequests'
>(type: T): Promise<any> {
  await sleep(500);

  if (type === 'issues') {
    return issues as unknown as MentionIssueAttributes[];
  }

  if (type === 'members') {
    return members as unknown as MentionMemberAttributes[];
  }

  if (type === 'pullRequests') {
    return pullRequests as unknown as MentionPullRequestAttributes[];
  }

  return [];
}
