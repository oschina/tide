import { wrappingInputRule } from '@tiptap/core';
import {
  Blockquote as TBlockquote,
  BlockquoteOptions as TBlockquoteOptions,
} from '@tiptap/extension-blockquote';

export type BlockquoteOptions = TBlockquoteOptions;

export const inputRegex = /^\s*[>》]\s$/;

export const Blockquote = TBlockquote.extend<BlockquoteOptions>({
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-.': () => this.editor.commands.toggleBlockquote(),
    };
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ];
  },
});
