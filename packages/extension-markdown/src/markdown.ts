import { Plugin, PluginKey } from '@tiptap/pm/state';
import { DOMParser, Node, Slice } from '@tiptap/pm/model';
import { elementFromString } from '@tiptap/core';
import { Markdown as TiptapMarkdown } from 'tiptap-markdown';
import { isInCode, isMarkdown } from './utils';

export const ClipboardMarkdownHandlerPluginKey = new PluginKey(
  'clipboardMarkdownHandler'
);

export type MarkdownOptions = {
  html?: boolean;
  tightLists?: boolean;
  tightListClass?: string;
  bulletListMarker?: string;
  linkify?: boolean;
  breaks?: boolean;
  paste?: boolean;
  copy?: boolean;
};

export const Markdown = TiptapMarkdown.extend<MarkdownOptions>({
  name: 'markdown',

  addOptions() {
    return {
      ...this.parent?.(),
      paste: true,
      copy: true,
    };
  },

  onBeforeCreate() {
    this.parent?.();

    console.log('this.editor.storage.markdown', this.editor.storage.markdown);

    this.editor.storage.markdown.getMarkdown = (content?: Node) => {
      return this.editor.storage.markdown.serializer.serialize(
        content ?? this.editor.state.doc
      );
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
                  const html = this.editor.storage.markdown.parse(text, {
                    inline: false,
                  });
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
                return this.editor.storage.markdown.getMarkdown(doc);
              },
        },
      }),
    ];
  },
});
