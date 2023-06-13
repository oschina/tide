import { createEditor } from '../editor';

import { fetchMention, defaultContent, sleep } from './mock';
import specifyResources from './mock_specify_resources.json';

let defaultVal = undefined;
try {
  const str = localStorage.getItem('legacy-demo');
  if (str) {
    defaultVal = JSON.parse(str);
  } else {
    defaultVal = defaultContent;
  }
} catch (e) {
  console.log(e);
}

createEditor({
  el: document.getElementById('app')!,
  options: {
    editable: true,
    content: defaultVal,
    onReady: (e) => {
      console.log('onReady', e);
    },
    onFocus: () => {
      console.log('onFocus');
    },
    onBlur: () => {
      console.log('onBlur');
    },
    onChange: (e, editor) => {
      localStorage.setItem('legacy-demo', JSON.stringify(e));
    },
    onFullscreenChange: (bool) => {
      console.log('----onFullscreenChange-----', bool);
    },
    imageUpload: (file: File, progressCallback: (progress: number) => void) => {
      return Promise.resolve(
        'https://file.nancode.cn/1678359851942-284541675.jpg'
      );
    },
    fetchResources: async (query) => {
      await sleep(1000);
      return Promise.resolve(specifyResources) as any;
    },
    mention: {
      fetchMentionIssue: async (query) => {
        console.log('fetchMentionIssue', query);
        await sleep(1000);
        const res = await fetchMention('issues');
        const issue = res.map((i: any) => ({
          id: i.id,
          attrs: { ...i, url: `/${i.iid}` },
        }));
        return issue;
      },
      fetchMentionMember: async (query) => {
        console.log('fetchMentionIssue', query);
        await sleep(1000);
        const res = await fetchMention('members');
        return res.map((i: any) => ({
          id: i.username,
          attrs: {
            ...i,
            url: `/${i.username}`,
            avatar_url: 'https://file.nancode.cn/1678359851942-284541675.jpg',
          },
        }));
      },
      fetchMentionPR: async (query) => {
        console.log('fetchMentionIssue', query);
        await sleep(1000);
        const res = await fetchMention('pullRequests');
        return res.map((i: any) => ({
          id: i.id,
          attrs: { ...i, url: `/${i.id}` },
        }));
      },
    },
  },
});
