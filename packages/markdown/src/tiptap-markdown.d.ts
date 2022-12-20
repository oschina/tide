declare module 'tiptap-markdown' {
  import { Editor, EditorOptions, Node, Mark } from '@tiptap/core';
  import { MarkdownSerializerState } from 'prosemirror-markdown';
  import * as Prosemirror from 'prosemirror-model';
  import * as MarkdownIt from 'markdown-it';

  export type MarkdownEditorOptions = EditorOptions & {
    markdown?: {
      html?: boolean;
      tightLists?: boolean;
      tightListClass?: string;
      bulletListMarker?: string;
      linkify?: boolean;
      breaks?: boolean;
      extensions?: MarkdownExtension[];
    };
  };

  export type MarkdownExtension = {
    type: Node;
    serialize: MarkdownExtensionOptions['serialize'];
    parse: MarkdownExtensionOptions['parse'];
    extend: (options: MarkdownExtensionOptions) => MarkdownExtension;
  };

  export type MarkdownExtensionOptions = {
    parse?: {
      setup(markdownit: MarkdownIt): void;
      updateDOM(element: HTMLElement): void;
    };
    serialize: (
      state: MarkdownSerializerState,
      node: Prosemirror.Node,
      parent: Prosemirror.Node,
      index: number
    ) => void | {
      open:
        | string
        | ((
            state: MarkdownSerializerState,
            mark: Prosemirror.Mark,
            parent: Prosemirror.Node,
            index: number
          ) => string);
      close:
        | string
        | ((
            state: MarkdownSerializerState,
            mark: Prosemirror.Mark,
            parent: Prosemirror.Node,
            index: number
          ) => string);
      mixable?: boolean;
      expelEnclosingWhitespace?: boolean;
      escape?: boolean;
    };
  };

  export class MarkdownEditor extends Editor {
    options: MarkdownEditorOptions;

    markdownExtensions: MarkdownExtension[];

    constructor(options?: Partial<MarkdownEditorOptions>);

    /**
     * Parse the markdown and return the HTML
     * @param content markdown content
     * @param options options
     */
    parseMarkdown(content: string, options?: { inline?: boolean }): string;

    /**
     * Get the document as markdown
     */
    getMarkdown(): string;
  }

  export function createMarkdownEditor(
    editor: typeof Editor
  ): typeof MarkdownEditor;

  export function createMarkdownExtension(
    type: Node | Mark,
    options: MarkdownExtensionOptions
  ): MarkdownExtension;

  export function parse(
    schema: Prosemirror.Schema,
    content: string,
    options: {
      extensions: MarkdownExtension[];
      html?: boolean;
      linkify?: boolean;
      inline?: boolean;
      breaks?: boolean;
    }
  ): string;

  export function serialize(
    schema: Prosemirror.Schema,
    content: Prosemirror.Node,
    options: {
      extensions: MarkdownExtension[];
      html?: boolean;
      tightLists?: boolean;
      bulletListMarker?: string;
    }
  ): string;
}
