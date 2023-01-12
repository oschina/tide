import { markInputRule, markPasteRule } from '@tiptap/core';
import {
  Bold as TBold,
  BoldOptions as TBoldOptions,
} from '@tiptap/extension-bold';

export type BoldOptions = TBoldOptions;

export const starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))\s$/;
export const starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g;
export const underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))\s$/;
export const underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g;

export const Bold = TBold.extend<BoldOptions>({
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
