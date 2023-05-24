import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Extension } from '@tiptap/core';

export const MarkdownClipboardCopy = Extension.create({
  name: 'markdownClipboardCopy',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('markdownClipboardCopy'),
        props: {
          clipboardTextSerializer: (slice) => {
            const doc = this.editor.schema.topNodeType.createAndFill(
              undefined,
              slice.content
            );
            if (!doc) {
              return '';
            }
            return this.editor.storage.markdown?.getMarkdown?.(doc) || '';
          },
        },
      }),
    ];
  },
});
