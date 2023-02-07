import { textblockTypeInputRule } from '@tiptap/core';
import {
  CodeBlockLowlight,
  CodeBlockLowlightOptions,
} from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight/lib/all';
import { isActive } from '@test-pkgs/common';
import { ReactNodeViewRenderer } from '@test-pkgs/react';
import { CodeBlockNodeView } from './CodeBlockNodeView';

export type CodeBlockOptions = CodeBlockLowlightOptions;

export const backtickInputRegex = /^[`·]{3}([a-z]+)?[\s\n]$/;
export const tildeInputRegex = /^[~～]{3}([a-z]+)?[\s\n]$/;

export const CodeBlock = CodeBlockLowlight.extend<CodeBlockOptions>({
  name: 'codeBlock',

  allowGapCursor: true,

  addOptions() {
    return {
      ...this.parent?.(),
      lowlight,
      defaultLanguage: 'plaintext',
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNodeView);
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: ({ editor }) => {
        const { state, view } = editor;
        // TODO: 代码块内输入 Tab 不生效
        if (isActive(state, this.name)) {
          view.dispatch(state.tr.insertText('    ').scrollIntoView());
          return true;
        }
        return false;
      },
    };
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: backtickInputRegex,
        type: this.type,
        getAttributes: (match) => ({
          language: (this.options.lowlight?.listLanguages?.() || []).includes(
            match[1]
          )
            ? match[1]
            : this.options.defaultLanguage,
        }),
      }),
      textblockTypeInputRule({
        find: tildeInputRegex,
        type: this.type,
        getAttributes: (match) => ({
          language: (this.options.lowlight?.listLanguages?.() || []).includes(
            match[1]
          )
            ? match[1]
            : this.options.defaultLanguage,
        }),
      }),
    ];
  },
});
