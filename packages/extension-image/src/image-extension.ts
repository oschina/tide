import {
  Image as TImage,
  ImageOptions as TImageOptions,
} from '@tiptap/extension-image';
import { mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@gitee/tide-react';
import ImageNodeView from './NodeView/ImageNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Image: {
      updateImageAttr: (attributes: Record<string, any>) => ReturnType;
    };
  }
}

export type ImageOptions = TImageOptions;

export const inputRegex =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))\s$/;

export const Image = TImage.extend<ImageOptions>({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: true,
      HTMLAttributes: null,
    };
  },

  atom: true,
  draggable: false,
  selectable: true,

  allowGapCursor() {
    return !this.options.inline;
  },

  addAttributes() {
    return {
      src: {
        default: '',
        parseHTML: (element) => `${element.getAttribute('src') ?? ''}`,
      },
      alt: {
        default: '',
      },
      title: {
        default: '',
      },
      width: {
        default: 350,
      },
      height: {
        default: 'auto',
      },
      align: {
        default: 'left',
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

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title] = match;

          return { src, alt, title };
        },
      }),
    ];
  },
});
