import { fileOpen } from 'browser-fs-access';
import { Image as ImageExtension } from './image-extension';
import type { Editor, JSONContent } from '@tiptap/core';
import type { UploaderStorage } from '@test-pkgs/extension-uploader';

export type ImageSize = { width: number; height: number; aspectRatio: number };

export function getImageNaturalSize(url: string): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      });
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = url;
  });
}

export async function uploadImage(
  editor: Editor,
  multiple?: boolean
): Promise<void> {
  const file = await fileOpen({
    mimeTypes: ['image/*'],
    multiple,
  });
  const uploader = (editor.storage.uploader as UploaderStorage)?.uploader;
  if (typeof uploader !== 'function') {
    throw new Error('uploader is not defined');
  }
  const items = await uploader(Array.isArray(file) ? file : [file]);
  if (!items || items.length === 0) {
    throw new Error('upload image failed');
  }
  const nodes: JSONContent[] = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    // get image size
    // const size = await getImageNaturalSize(item.url);
    nodes.push({
      type: ImageExtension.name,
      attrs: {
        src: item.url,
        alt: item.name,
      },
    });
  }
  const paragraphNodeType = editor.schema.nodes.paragraph;
  if (nodes.length > 0 && paragraphNodeType) {
    editor
      .chain()
      .focus()
      .insertContent([...nodes, { type: paragraphNodeType.name, content: '' }])
      .run();
  }
}
