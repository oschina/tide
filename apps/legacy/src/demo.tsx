import { createEditor } from './index';
import { defaultContent } from './mock';

createEditor({
  el: document.getElementById('app')!,
  options: {
    fetchMemberMention: (query) => {
      return Promise.resolve([
        {
          label: 'demo',
          // desc: '',
          id: 'demo',
          attrs: {
            name: 'demo',
            username: 'demo',
            url: 'https://file.nancode.cn/1678359851942-284541675.jpg',
          },
        },
      ]);
    },
    imageUpload: (file: File, progressCallback: (progress: number) => void) => {
      return Promise.resolve(
        'https://file.nancode.cn/1678359851942-284541675.jpg'
      );
    },
    // readOnly: true,
    defaultValue: defaultContent,
    onFocus: () => {
      console.log('onFocus');
    },
    onBlur: () => {
      console.log('onBlur');
    },
    onChange: (e) => {
      console.log(JSON.stringify(e.getJSON()));
    },
  },
});
