import { Editor } from '@tiptap/core';
import { fileOpen } from 'browser-fs-access';
import { UploaderFunc } from '../types';

// 模拟 ajax 上传
export const defaultImgUploader: UploaderFunc = async (
  file,
  progressCallBack
) => {
  const src = URL.createObjectURL(file);

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

export const getImageFileList = (files: FileList) =>
  Array.prototype.slice
    .call(files || '')
    .filter((file) => file.type.includes('image'));

export async function selectImageUpload(editor: Editor): Promise<void> {
  const files = await fileOpen({
    mimeTypes: ['image/*'],
    multiple: true,
  });
  editor.commands.uploadImage(files);
}
