import * as tiptapMarkdown from 'tiptap-markdown';
import type { Node, Schema } from 'prosemirror-model';
import type { Editor } from '@tiptap/core';
import type { MarkdownEditor, MarkdownExtension } from './types';

export function createMarkdownEditor(editor: typeof Editor): MarkdownEditor {
  const MarkdownEditorClass = tiptapMarkdown.createMarkdownEditor(editor);

  MarkdownEditorClass.prototype.getMarkdown = function getMarkdown(doc?: Node) {
    const { html, tightLists, bulletListMarker } = this.options.markdown || {};
    return serialize(this.schema, doc ?? this.state.doc, {
      extensions: this.markdownExtensions,
      html,
      tightLists,
      bulletListMarker,
    });
  };

  return MarkdownEditorClass as unknown as MarkdownEditor;
}

export function parse(
  schema: Schema,
  content: string,
  options: {
    extensions: MarkdownExtension[];
    html?: boolean;
    linkify?: boolean;
    inline?: boolean;
    breaks?: boolean;
  }
): string {
  return tiptapMarkdown.parse(schema, content, options);
}

export function serialize(
  schema: Schema,
  content: Node,
  options: {
    extensions: MarkdownExtension[];
    html?: boolean;
    tightLists?: boolean;
    bulletListMarker?: string;
  }
): string {
  return tiptapMarkdown.serialize(schema, content, options);
}
