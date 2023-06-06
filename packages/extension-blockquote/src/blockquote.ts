import { PasteRule } from '@tiptap/core';
import {
  Blockquote as TBlockquote,
  BlockquoteOptions as TBlockquoteOptions,
} from '@tiptap/extension-blockquote';
import { wrappingInputRule } from '@gitee/tide-common';

export type BlockquoteOptions = TBlockquoteOptions;

export const inputRegex = /^\s*[>》]\s$/;
export const pasteRegex = /^\s*>\s(.*)$/g;

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
        joinBefore: () => false,
        joinAfter: () => false,
      }),
    ];
  },

  addPasteRules() {
    return [
      new PasteRule({
        find: pasteRegex,
        handler: ({ match, range, chain }) => {
          if (match[1]) {
            chain()
              .deleteRange(range)
              .insertContentAt(
                range.from,
                {
                  type: this.type.name,
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: match[1],
                        },
                      ],
                    },
                  ],
                },
                {
                  updateSelection: false,
                }
              )
              .run();
          }
        },
      }),
    ];
  },
});
