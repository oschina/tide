import { Node as ProseMirrorNode } from 'prosemirror-model';
import { Editor } from '@tiptap/core';
import {
  createMarkdownEditor as createCoreMarkdownEditor,
  serialize,
} from 'tiptap-markdown';

export const createMarkdownEditor = (editor: typeof Editor) => {
  const MarkdownEditorClass = createCoreMarkdownEditor(editor);

  MarkdownEditorClass.prototype.getMarkdown = function getMarkdown(
    doc?: ProseMirrorNode
  ) {
    const { html, tightLists, bulletListMarker } = this.options.markdown || {};
    return serialize(this.schema, doc ?? this.state.doc, {
      extensions: this.markdownExtensions,
      html,
      tightLists,
      bulletListMarker,
    });
  };

  return MarkdownEditorClass;
};
