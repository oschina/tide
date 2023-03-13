import { createEditor } from './index';
import { defaultContent } from './demo_mock';
import testData from './demo_test.json';

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
    mention: {
      fetchMentionIssue: (query) => {
        const result = testData.issues
          .filter(
            (item) =>
              `${item.ident}${item.title}`
                .toLowerCase()
                .indexOf(query.toLowerCase()) > -1
          )
          .slice(0, 5)
          .map((item) => ({
            id: `${item.iid}`,
            attrs: {
              ident: item.ident,
              title: item.title,
              url: '',
            },
          }));
        return Promise.resolve(result);
      },
      fetchMentionPR: (query) => {
        const result = testData.pull_requests
          .filter(
            (item) =>
              `${item.iid}${item.title}`
                .toLowerCase()
                .indexOf(query.toLowerCase()) > -1
          )
          .slice(0, 5)
          .map((item) => ({
            id: `${item.iid}`,
            attrs: {
              id: `${item.iid}`,
              iid: `${item.iid}`,
              title: item.title,
              url: '',
            },
          }));
        return Promise.resolve(result);
      },
      fetchMentionMember: (query) => {
        const result = testData.members
          .filter(
            (item) =>
              `${item.name}${item.name_pinyin}${item.username}`
                .toLowerCase()
                .indexOf(query.toLowerCase()) > -1
          )
          .slice(0, 5)
          .map((item) => ({
            id: `${item.username}`,
            attrs: {
              name: item.name,
              username: item.username,
              url: '',
            },
          }));
        return Promise.resolve(result);
      },
    },
  },
});
