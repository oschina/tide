export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const defaultContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { textAlign: 'left', indent: 0, level: 1 },
      content: [{ type: 'text', text: '123123' }],
    },
    { type: 'paragraph', attrs: { textAlign: 'left', indent: 0 } },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left', indent: 0 },
      content: [{ type: 'text', text: '123' }],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left', indent: 0 },
      content: [{ type: 'text', text: '123' }],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left', indent: 0 },
      content: [{ type: 'text', text: '13' }],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left', indent: 0 },
      content: [{ type: 'text', text: '1# ' }],
    },
    {
      type: 'image',
      attrs: {
        src: 'https://file.nancode.cn/1678359851942-284541675.jpg',
        alt: '',
        title: '',
        width: 350,
        height: 'auto',
        align: 'left',
      },
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left', indent: 0 },
      content: [{ type: 'text', text: '12312' }],
    },
    {
      type: 'codeBlock',
      attrs: { language: 'javascript' },
      content: [{ type: 'text', text: 'console.log(1123' }],
    },
    {
      type: 'codeBlock',
      attrs: { language: 'javascript' },
      content: [{ type: 'text', text: ')' }],
    },
  ],
};
