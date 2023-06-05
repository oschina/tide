import { UploaderFunc } from '@gitee/wysiwyg-editor-extension-uploader';
import axios, { AxiosRequestConfig } from 'axios';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const ajaxImgUploader: UploaderFunc = async (file, progressCallBack) => {
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
