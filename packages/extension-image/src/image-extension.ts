import {
  Image as TImage,
  ImageOptions as TImageOptions,
} from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@test-pkgs/react';
import ImageNodeView from './NodeView/ImageNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Image: {
      updateImageAttr: (attributes: Record<string, any>) => ReturnType;
    };
  }
}

export type ImageOptions = TImageOptions;

export const Image = TImage.extend<ImageOptions>({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: true,
      HTMLAttributes: {},
    };
  },

  selectable: true,

  allowGapCursor() {
    return !this.options.inline;
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: 500,
      },
      height: {
        default: null,
      },
      align: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? 'img[src]'
          : 'img[src]:not([src^="data:"])',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),

      updateImageAttr:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
