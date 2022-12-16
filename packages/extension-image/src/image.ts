import {
  Image as TImage,
  ImageOptions as TImageOptions,
} from '@tiptap/extension-image';

export type ImageOptions = TImageOptions;

export const Image = TImage.extend<ImageOptions>({
  name: 'image',

  allowGapCursor() {
    return this.options.inline ? false : true;
  },
});
