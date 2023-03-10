import { createEditor } from './index';
import { defaultContent } from './demo_mock';

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
        return Promise.resolve([]);
      },
      fetchMentionPR: (query) => {
        return Promise.resolve([]);
      },
      fetchMentionMember: (query) => {
        return Promise.resolve([]);
      },
    },
  },
});
