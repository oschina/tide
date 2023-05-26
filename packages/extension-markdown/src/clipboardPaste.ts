import { Plugin, PluginKey } from '@tiptap/pm/state';
import { DOMParser, Slice } from '@tiptap/pm/model';
import { elementFromString, Extension } from '@tiptap/core';
import { isInCode, isMarkdown } from './utils';

export const MarkdownClipboardPaste = Extension.create({
  name: 'markdownClipboardPaste',

  priority: 50,

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('markdownClipboardPaste'),
        props: {
          handlePaste: (view, event) => {
            const editable = this.editor.isEditable;
            const { clipboardData } = event;
            if (
              !editable ||
              !clipboardData ||
              clipboardData.files.length !== 0
            ) {
              return false;
            }

            const text = clipboardData.getData('text/plain');
            const html = clipboardData.getData('text/html');
            if (html.length > 0) {
              return false;
            }

            if (isInCode(view.state)) {
              event.preventDefault();
              view.dispatch(view.state.tr.insertText(text));
              return true;
            }

            if (isMarkdown(text)) {
              const html = this.editor.storage.markdown?.parser?.parse?.(text, {
                inline: false,
              });
              if (!html || typeof html !== 'string') return false;
              const parser = DOMParser.fromSchema(this.editor.schema);
              const slice = parser.parse(elementFromString(html), {}).content;
              const contentSlice = view.state.selection.content();
              view.dispatch(
                view.state.tr.replaceSelection(
                  new Slice(slice, contentSlice.openStart, contentSlice.openEnd)
                )
              );
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});
