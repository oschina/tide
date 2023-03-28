import { createEditor } from './index';
import { fetchMention } from './test/fetchMetion';
import { defaultContent, sleep } from './test/demo_mock';

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
    onFocus: () => {
      console.log('onFocus');
    },
    onBlur: () => {
      console.log('onBlur');
    },
    onChange: (e) => {
      localStorage.setItem('legacy-demo', JSON.stringify(e.getJSON()));
    },
    imageUpload: (file: File, progressCallback: (progress: number) => void) => {
      return Promise.resolve(
        'https://file.nancode.cn/1678359851942-284541675.jpg'
      );
    },
    fetchResources: async (query) => {
      console.log('--------fetchResources------------------------', query);
      await sleep(50000);
      return Promise.resolve([]) as any;
    },
    mention: {
      fetchMentionIssue: async (query) => {
        const res = await fetchMention('issues');
        return res.map((i: any) => ({ id: i.id, attrs: { ...i } }));
      },
      fetchMentionMember: async (query) => {
        const res = await fetchMention('members');
        console.log(res);
        return res.map((i: any) => ({
          id: i.username,
          attrs: { ...i, url: `/${i.username}` },
        }));
      },
      fetchMentionPR: async (query) => {
        const res = await fetchMention('pullRequests');
        return res.map((i: any) => ({ id: i.id, attrs: { ...i } }));
      },
    },
  },
});
