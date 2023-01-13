import { markInputRule, markPasteRule } from '@tiptap/core';
import {
  Code as TCode,
  CodeOptions as TCodeOptions,
} from '@tiptap/extension-code';

export type CodeOptions = TCodeOptions;

export const inputRegex = /(?:^|\s)((?:[`·])((?:[^`·]+))(?:[`·]))\s$/;
export const pasteRegex = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g;

export const Code = TCode.extend<CodeOptions>({
  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ];
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type,
      }),
    ];
  },
});
