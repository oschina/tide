import { Plugin, PluginKey } from 'prosemirror-state';
import { DOMParser, Slice } from 'prosemirror-model';
import { elementFromString, Extension } from '@tiptap/core';
import { MarkdownEditor } from '@gitee/wysiwyg-editor-markdown';
import { isInCode, isMarkdown } from './utils';

export const ClipboardMarkdownHandlerPluginKey = new PluginKey(
  'clipboardMarkdownHandler'
);

export type MarkdownOptions = {
  paste?: boolean;
  copy?: boolean;
};

export const Markdown = Extension.create<MarkdownOptions>({
  name: 'markdown',

  addOptions() {
    return {
      paste: true,
      copy: true,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: ClipboardMarkdownHandlerPluginKey,
        props: {
          handlePaste: !this.options.paste
            ? undefined
            : (view, event) => {
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
                  const html = (this.editor as MarkdownEditor).parseMarkdown(
                    text,
                    {
                      inline: false,
                    }
                  );
                  if (!html || typeof html !== 'string') return false;
                  const parser = DOMParser.fromSchema(this.editor.schema);
                  const slice = parser.parse(
                    elementFromString(html),
                    {}
                  ).content;
                  const contentSlice = view.state.selection.content();
                  view.dispatch(
                    view.state.tr.replaceSelection(
                      new Slice(
                        slice,
                        contentSlice.openStart,
                        contentSlice.openEnd
                      )
                    )
                  );
                  return true;
                }

                return false;
              },
          clipboardTextSerializer: !this.options.copy
            ? undefined
            : (slice) => {
                const doc = this.editor.schema.topNodeType.createAndFill(
                  undefined,
                  slice.content
                );
                if (!doc) {
                  return '';
                }
                return (this.editor as MarkdownEditor).getMarkdown(doc);
              },
        },
      }),
    ];
  },
});
