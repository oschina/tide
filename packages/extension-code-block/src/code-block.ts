import {
  CodeBlockLowlight,
  CodeBlockLowlightOptions,
} from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight/lib/all';
import { ReactNodeViewRenderer } from '@test-pkgs/react';
import { CodeBlockNodeView } from './CodeBlockNodeView';

export type CodeBlockOptions = CodeBlockLowlightOptions;

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
        if (editor.isActive(this.name)) {
          this.editor.commands.insertContent('\t');
          return true;
        }
        return false;
      },
    };
  },
});
