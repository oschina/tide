import type { HTMLContent, JSONContent } from '@tiptap/core';

export type MarkdownContent = string;

export type Content = MarkdownContent | HTMLContent | JSONContent | null;
