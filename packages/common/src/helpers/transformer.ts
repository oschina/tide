import { Editor, Extension, getSchema, JSONContent } from '@tiptap/core';
import {
  Node as ProseMirrorNode,
  Schema,
  DOMParser,
  DOMSerializer,
  ParseOptions,
} from '@tiptap/pm/model';
import { parseHTML, createHTMLDocument, VHTMLDocument } from 'zeed-dom';

export class Transformer {
  schema: Schema;

  parser: DOMParser;

  serializer: DOMSerializer;

  constructor(schema: Schema) {
    this.schema = schema;
    this.parser = DOMParser.fromSchema(schema);
    this.serializer = DOMSerializer.fromSchema(schema);
  }

  // HTML to ProseMirror Node
  htmlToNode(html: string, options?: ParseOptions): ProseMirrorNode {
    const dom = parseHTML(html) as unknown as Node;
    return this.parser.parse(dom, options);
  }

  // ProseMirror Node to HTML
  nodeToHTML(node: ProseMirrorNode): string {
    const document = this.serializer.serializeFragment(node.content, {
      document: createHTMLDocument() as unknown as Document,
    }) as unknown as VHTMLDocument;

    return document.render();
  }

  // HTML to JSONContent
  htmlToJSON(html: string): JSONContent {
    return this.htmlToNode(html).toJSON();
  }

  // JSONContent to HTML
  jsonToHTML(doc: JSONContent): string {
    const contentNode = ProseMirrorNode.fromJSON(this.schema, doc);
    return this.nodeToHTML(contentNode);
  }

  // ProseMirror Node to JSONContent
  nodeToJSON(node: ProseMirrorNode): JSONContent {
    return node.toJSON();
  }

  // JSONContent to ProseMirror Node
  jsonToNode(doc: JSONContent): ProseMirrorNode {
    return ProseMirrorNode.fromJSON(this.schema, doc);
  }

  // Markdown to HTML
  markdownToHTML(markdown: string, editor: Editor): string {
    return editor.storage.markdown?.parser?.parse?.(markdown) || '';
  }

  // Markdown to ProseMirror Node
  markdownToNode(markdown: string, editor: Editor): ProseMirrorNode {
    return this.htmlToNode(this.markdownToHTML(markdown, editor));
  }

  // Markdown to JSONContent
  markdownToJSON(markdown: string, editor: Editor): JSONContent {
    return this.markdownToNode(markdown, editor).toJSON();
  }

  // ProseMirror Node to Markdown
  nodeToMarkdown(node: ProseMirrorNode, editor: Editor): string {
    return editor.storage.markdown?.getMarkdown?.(node) || '';
  }

  // JSONContent to Markdown
  jsonToMarkdown(doc: JSONContent, editor: Editor): string {
    return this.nodeToMarkdown(this.jsonToNode(doc), editor);
  }

  // HTML to Markdown
  htmlToMarkdown(html: string, editor: Editor): string {
    return this.nodeToMarkdown(this.htmlToNode(html), editor);
  }

  // Markdown to Markdown
  markdownToMarkdown(markdown: string, editor: Editor): string {
    return this.nodeToMarkdown(this.markdownToNode(markdown, editor), editor);
  }

  // HTML to HTML
  htmlToHTML(html: string): string {
    return this.nodeToHTML(this.htmlToNode(html));
  }

  static fromSchema(schema: Schema) {
    return new Transformer(schema);
  }

  static fromExtensions(extensions: Extension[]) {
    return new Transformer(getSchema(extensions));
  }
}
