import { markInputRule, markPasteRule } from '@tiptap/core';
import {
  Strike as TStrike,
  StrikeOptions as TStrikeOptions,
} from '@tiptap/extension-strike';

export type StrikeOptions = TStrikeOptions;

export const inputRegex = /(?:^|\s)((?:[~～]{2})((?:[^~～]+))(?:[~～]{2}))$/;
export const pasteRegex = /(?:^|\s)((?:[~～]{2})((?:[^~～]+))(?:[~～]{2}))/g;

export const Strike = TStrike.extend<StrikeOptions>({
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
