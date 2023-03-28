import issues from './issues.json';
import members from './members.json';
import pullRequests from './pull_requests.json';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchMention(
  type: 'issues' | 'members' | 'pullRequests'
): Promise<any> {
  await sleep(500);
  if (type === 'issues') {
    return issues;
  }

  if (type === 'members') {
    return members;
  }

  if (type === 'pullRequests') {
    return pullRequests;
  }

  return [];
}
