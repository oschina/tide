import type { UploaderFn } from './uploader';

export const readFileAsBase64 = (
  file: File
): Promise<{ name: string; size: number; url: string; type: string }> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        resolve({
          name: file.name,
          size: file.size,
          url: reader.result as string,
          type: file.type,
        });
      },
      false
    );
    reader.readAsDataURL(file);
  });

export const defaultUploader: UploaderFn = async (files) => {
  return Promise.all(
    files.filter((file) => !!file).map((file) => readFileAsBase64(file))
  );
};
