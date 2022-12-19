import { Plugin, PluginKey } from 'prosemirror-state';
import { Extension } from '@tiptap/core';
import type { JSONContent } from '@tiptap/core';
import { defaultUploader } from './defaultUploader';

export type UploadResult = {
  name: string;
  size: number;
  url: string;
  type: string;
};

export type UploaderFn = (files: File[]) => Promise<UploadResult[]>;

export type UploaderOptions = {
  uploader: UploaderFn;
};

export type UploaderStorage = {
  uploader: UploaderFn;
};

export const Uploader = Extension.create<UploaderOptions, UploaderStorage>({
  name: 'uploader',

  addOptions() {
    return {
      uploader: defaultUploader,
    };
  },

  addStorage() {
    return {
      uploader: this.options.uploader,
    };
  },

  addProseMirrorPlugins() {
    const upload = async (files: FileList) => {
      if (
        !files ||
        files.length === 0 ||
        typeof this.options.uploader !== 'function'
      ) {
        return;
      }
      const imageNodeType = this.editor.schema.nodes.image;
      const items = await this.storage.uploader(Array.from(files));
      const nodes: JSONContent[] = [];
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        // image node
        if (item.type.startsWith('image') && imageNodeType) {
          // get image size
          // const size = await getImageNaturalSize(item.url);
          nodes.push({
            type: imageNodeType.name,
            attrs: {
              src: item.url,
              alt: item.name,
            },
          });
        }
      }
      const paragraphNodeType = this.editor.schema.nodes.paragraph;
      if (nodes.length > 0 && paragraphNodeType) {
        this.editor
          .chain()
          .focus()
          .insertContent([
            ...nodes,
            { type: paragraphNodeType.name, content: '' },
          ])
          .run();
      }
    };
    return [
      new Plugin({
        key: new PluginKey('uploaderHandler'),
        props: {
          handlePaste: (_view, event) => {
            const editable = this.editor.isEditable;
            const { clipboardData } = event;
            if (
              !editable ||
              !clipboardData ||
              clipboardData.files.length === 0
            ) {
              return false;
            }
            upload(clipboardData.files);
            return true;
          },
          handleDrop: (_view, event) => {
            if (!(event instanceof DragEvent) || !this.editor.isEditable) {
              return false;
            }
            const { files } = event.dataTransfer ?? {};
            if (!files || files.length <= 0) {
              return false;
            }
            upload(files);
            return true;
          },
        },
      }),
    ];
  },
});
