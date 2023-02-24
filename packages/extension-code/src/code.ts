import { markInputRule, markPasteRule } from '@tiptap/core';
import {
  Code as TCode,
  CodeOptions as TCodeOptions,
} from '@tiptap/extension-code';

export type CodeOptions = TCodeOptions;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    markLeftExit: {
      /**
       * Handle mark left exit.
       */
      markLeftExit: (markName: string) => ReturnType;
    };
  }
}

export const inputRegex = /(?:^|\s)((?:[`·])((?:[^`·]+))(?:[`·]))\s$/;
export const pasteRegex = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g;

export const Code = TCode.extend<CodeOptions>({
  exitable: true,

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

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      ArrowLeft: () => this.editor.commands.markLeftExit(this.name),
    };
  },
});
