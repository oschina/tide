import { Plugin } from '@tiptap/pm/state';
import { Extension, findParentNode } from '@tiptap/core';
import {
  handleUploadImages,
  ImagePlaceholderPlugin,
} from './image/placeholder';
import { defaultImgUploader, getImageFileList } from './image/utils';
import { UploaderFunc } from './types';

export * from './image/utils';
export * from './types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    uploader: {
      uploadImage: (files: File[]) => ReturnType;
    };
  }
}

export interface UploaderOptions {
  image: {
    uploader: UploaderFunc;
  };
}

export const Uploader = Extension.create<UploaderOptions>({
  name: 'uploader',

  addOptions() {
    return {
      image: {
        uploader: defaultImgUploader,
        // accept: string,
        // maxSize: string,
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      ImagePlaceholderPlugin,
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const editable = this.editor.isEditable;
            if (!editable || !event.clipboardData) {
              return false;
            }

            // code block 不允许插入图片
            if (view.state.schema.nodes.codeBlock) {
              const predicate = (node) =>
                node.type === view.state.schema.nodes.codeBlock;
              const codeBlock = findParentNode(predicate)(view.state.selection);
              if (codeBlock) {
                return;
              }
            }

            // 图片
            if (view.state.schema.nodes.image) {
              const files = getImageFileList(event.clipboardData.files);
              if (files.length > 0) {
                const pos = view.state.selection.from;
                handleUploadImages(
                  view,
                  pos,
                  files,
                  this.options.image.uploader
                );
                return true;
              }
            }

            // 其他...

            return false;
          },
          handleDrop: (view, event) => {
            const editable = this.editor.isEditable;
            if (!editable || view.dragging || !event.dataTransfer) {
              return false;
            }

            // code block 不允许插入图片
            const predicate = (node) =>
              node.type === view.state.schema.nodes.codeBlock;
            const codeBlock = findParentNode(predicate)(view.state.selection);
            if (codeBlock) {
              return;
            }

            // 图片
            if (view.state.schema.nodes.image) {
              const files = getImageFileList(event.dataTransfer.files);
              if (files.length > 0) {
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });
                handleUploadImages(
                  view,
                  coordinates.pos,
                  files,
                  this.options.image.uploader
                );
                return true;
              }
            }

            // 其他...

            return false;
          },
        },
      }),
    ];
  },
  addCommands() {
    return {
      uploadImage:
        (files) =>
        ({ view }) => {
          const pos = view.state.selection.from;
          handleUploadImages(view, pos, files, this.options.image.uploader);
          return true;
        },
    };
  },
});
