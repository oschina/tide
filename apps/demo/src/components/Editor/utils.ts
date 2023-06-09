import axios, { AxiosRequestConfig } from 'axios';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { UploaderFunc } from '@gitee/tide-extension-uploader';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockImgUploader: UploaderFunc = async (file, progressCallBack) => {
  const config: AxiosRequestConfig = {
    headers: { 'content-type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      progressCallBack(Math.round((event.loaded * 100) / (event.total || 0)));
      console.log(
        `Current progress:`,
        Math.round((event.loaded * 100) / (event.total || 0))
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

export const mockFetchMemberMention = (query: string) => {
  return [
    'Gitee',
    'OSCHINA',
    '开源中国',
    '马建仓',
    'Tiptap',
    'Google',
    'Apple',
    'Microsoft',
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
};

export const mockFetchMemberMentionDebounced = AwesomeDebouncePromise(
  mockFetchMemberMention,
  300,
  {
    onlyResolvesLast: false,
  }
);
