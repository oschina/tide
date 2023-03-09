import { createEditor } from './index';
import { defaultContent } from './mock';

createEditor({
  el: document.getElementById('app')!,
  options: {
    readOnly: true,
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
