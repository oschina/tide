import { Plugin } from 'prosemirror-state';
import { Extension } from '@tiptap/core';
import {
  handleUploadImages,
  ImagePlaceholderPlugin,
} from './image/placeholder';
import { defaultImgUploader, getImageFileList } from './image/utils';

export * from './image/utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    uploader: {
      uploadImage: (files: File[]) => ReturnType;
    };
  }
}

export interface UploaderOptions {
  image: {
    uploader: (file, progressCallback) => void;
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

            // 图片
            const files = getImageFileList(event.clipboardData.files);
            if (files.length > 0) {
              const pos = view.state.selection.from;
              handleUploadImages(view, pos, files, this.options.image.uploader);
              return true;
            }

            // 其他...

            return false;
          },
          handleDrop: (view, event) => {
            const editable = this.editor.isEditable;
            if (!editable || view.dragging || !event.dataTransfer) {
              return false;
            }

            // 图片
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
