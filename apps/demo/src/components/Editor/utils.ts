import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { UploaderFunc } from '@gitee/tide-extension-uploader';

export const mockImgUploader: UploaderFunc = async (file, progressCallBack) => {
  let src = '';
  const reader = new FileReader();
  reader.onload = () => {
    src = reader.result as string;
  };
  reader.readAsDataURL(file);
  return new Promise((resolve) => {
    let mockProgress = 1;
    const t = setInterval(() => {
      mockProgress++;
      progressCallBack(mockProgress * 10);
      if (mockProgress >= 10) {
        clearInterval(t);
        resolve(src);
      }
    }, 300);
  });
};

export const mockFetchMemberMention = (query: string) => {
  return ['Tide', 'Tiptap', 'ProseMirror']
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
