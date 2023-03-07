import axios from 'axios';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { UploaderFunc } from '@gitee/wysiwyg-editor-extension-uploader';

export const mockFetchMemberMention = (query: string) => {
  console.log('mockFetchMemberMention', query);
  const items = [
    'Gitee',
    'OSCHINA',
    '开源中国',
    '马建仓',
    'Tiptap',
    'Google',
    'Apple',
    'Lea Thompson',
    'Cyndi Lauper',
    'Tom Cruise',
    'Madonna',
    'Jerry Hall',
    'Joan Collins',
    'Winona Ryder',
    'Christina Applegate',
    'Alyssa Milano',
    'Molly Ringwald',
    'Ally Sheedy',
    'Debbie Harry',
    'Olivia Newton-John',
    'Elton John',
    'Michael J. Fox',
    'Axl Rose',
    'Emilio Estevez',
    'Ralph Macchio',
    'Rob Lowe',
    'Jennifer Grey',
    'Mickey Rourke',
    'John Cusack',
    'Matthew Broderick',
    'Justine Bateman',
    'Lisa Bonet',
  ]
    .map((label, index) => ({
      id: `${index + 1}`,
      label,
      desc: label.toLowerCase(),
      attrs: {
        name: label,
        username: label.toLowerCase(),
        url: `/members/${label.toLowerCase()}`,
      },
    }))
    .filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 5);
  return items;
};

export const mockFetchMemberMentionDebounced = AwesomeDebouncePromise(
  mockFetchMemberMention,
  300,
  {
    onlyResolvesLast: false,
  }
);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockAjaxImgUploader: UploaderFunc = async (
  file,
  progressCallBack
) => {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
    onUploadProgress: (event: any) => {
      progressCallBack(Math.round((event.loaded * 100) / event.total));
      console.log(
        `Current progress:`,
        Math.round((event.loaded * 100) / event.total)
      );
    },
  };

  const formData = new FormData();
  formData.set('file', file);
  const res = await axios.post(
    'https://nancode.cn/api/upload',
    // 'http://localhost:3000/api/upload',
    formData,
    config
  );
  await sleep(1000);

  // return `http://localhost:3000/upload/${res.data.name}`;
  return `https://file.nancode.cn/${res.data.name}`;
};
