import { Node } from '@tiptap/pm/model';
import { Markdown as TiptapMarkdown } from 'tiptap-markdown';
import { MarkdownClipboardCopy } from './clipboardCopy';
import { MarkdownClipboardPaste } from './clipboardPaste';

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

  priority: 50,

  addOptions() {
    return {
      ...this.parent?.(),
      paste: true,
      copy: true,
    };
  },

  onBeforeCreate() {
    this.parent?.();

    this.editor.storage.markdown.getMarkdown = (content?: Node) => {
      return this.editor.storage.markdown.serializer.serialize(
        content ?? this.editor.state.doc
      );
    };
  },

  addExtensions() {
    return [
      ...(this.options.copy ? [MarkdownClipboardCopy] : []),
      ...(this.options.paste ? [MarkdownClipboardPaste] : []),
    ];
  },
});
