import type { HTMLContent, JSONContent } from '@tiptap/core';
import type { Node } from 'prosemirror-model';
import type {
  MarkdownEditor as CoreMarkdownEditor,
  MarkdownExtension,
} from 'tiptap-markdown';

export type {
  MarkdownEditorOptions,
  MarkdownExtension,
  MarkdownExtensionOptions,
} from 'tiptap-markdown';

export interface MarkdownEditor extends CoreMarkdownEditor {
  markdownExtensions: MarkdownExtension[];

  /**
   * Parse the markdown and return the HTML
   * @param content markdown content
   * @param options options
   */
  parseMarkdown(content: string, options?: { inline?: boolean }): string;

  /**
   * Get the document as markdown
   */
  getMarkdown(doc?: Node): string;
}

export type MarkdownContent = string;

export type Content = MarkdownContent | HTMLContent | JSONContent | null;
