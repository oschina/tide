import { markInputRule, markPasteRule } from '@tiptap/core';
import {
  Italic as TItalic,
  ItalicOptions as TItalicOptions,
} from '@tiptap/extension-italic';

export type ItalicOptions = TItalicOptions;

export const starInputRegex = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))\s$/;
export const starPasteRegex = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g;
export const underscoreInputRegex = /(?:^|\s)((?:_)((?:[^_]+))(?:_))\s$/;
export const underscorePasteRegex = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g;

export const Italic = TItalic.extend<ItalicOptions>({
  addInputRules() {
    return [
      markInputRule({
        find: starInputRegex,
        type: this.type,
      }),
      markInputRule({
        find: underscoreInputRegex,
        type: this.type,
      }),
    ];
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: starPasteRegex,
        type: this.type,
      }),
      markPasteRule({
        find: underscorePasteRegex,
        type: this.type,
      }),
    ];
  },
});
