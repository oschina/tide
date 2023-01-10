import { textblockTypeInputRule } from '@tiptap/core';
import {
  CodeBlockLowlight,
  CodeBlockLowlightOptions,
} from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight/lib/all';
import { isActive } from '@test-pkgs/helpers';
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
        // TODO: 代码块内输入 Tab 不生效
        if (isActive(editor.state, this.name)) {
          const sel = window.getSelection();
          const range = sel.getRangeAt(0);

          const tabNode = document.createTextNode('    ');
          range.insertNode(tabNode);

          // 以tabNode为基准，设置 Range 的起点和终点位置。
          range.setStartAfter(tabNode);
          range.setEndAfter(tabNode);

          sel.removeAllRanges();
          sel.addRange(range);
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
          language: match[1],
        }),
      }),
      textblockTypeInputRule({
        find: tildeInputRegex,
        type: this.type,
        getAttributes: (match) => ({
          language: match[1],
        }),
      }),
    ];
  },
});
