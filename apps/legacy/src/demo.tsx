import { createEditor } from './index';
import { fetchMention } from './test/fetchMetion';
import { defaultContent, sleep } from './test/demo_mock';
import specifyResources from './test/specify_resources.json';

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
    readOnly: false,
    defaultValue: defaultVal,
    onReady: () => {
      console.log('onReady');
    },
    onFocus: () => {
      console.log('onFocus');
    },
    onBlur: () => {
      console.log('onBlur');
    },
    onChange: (e) => {
      localStorage.setItem('legacy-demo', JSON.stringify(e.getJSON()));
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
