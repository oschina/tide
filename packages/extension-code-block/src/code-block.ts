import {
  CodeBlockLowlight,
  CodeBlockLowlightOptions,
} from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight/lib/all';
import { TextSelection } from '@tiptap/pm/state';
import { isActive, textblockTypeInputRule } from '@gitee/wysiwyg-editor-common';
import { ReactNodeViewRenderer } from '@gitee/wysiwyg-editor-react';
import { CodeBlockNodeView } from './CodeBlockNodeView';
import { getSelectedLineRange } from './utils';
import { getLanguageByValueOrAlias } from './languages';

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
        if (!isActive(state, this.name)) {
          return false;
        }
        const { selection, tr } = state;
        const tab = '  ';
        if (selection.empty) {
          view.dispatch(tr.insertText(tab));
        } else {
          const { $from, from, to } = selection;
          const node = $from.node(); // code block node
          if (node.type !== this.type) {
            return false;
          }

          const { start: selectedLineStart, end: selectedLineEnd } =
            getSelectedLineRange(selection, node);
          if (
            selectedLineStart === undefined ||
            selectedLineEnd === undefined
          ) {
            view.dispatch(tr.replaceSelectionWith(state.schema.text(tab)));
            return true;
          }

          const text = node.textContent || '';
          const lines = text.split('\n');
          const newLines = lines.map((line, index) => {
            if (
              index >= selectedLineStart &&
              index <= selectedLineEnd &&
              line
            ) {
              return tab + line;
            }
            return line;
          });
          const codeBlockTextNode = $from.node(1);
          const codeBlockTextNodeStart = $from.start(1);
          tr.replaceWith(
            codeBlockTextNodeStart,
            codeBlockTextNodeStart + codeBlockTextNode.nodeSize - 2,
            state.schema.text(newLines.join('\n'))
          );
          tr.setSelection(
            TextSelection.between(
              tr.doc.resolve(from + tab.length),
              tr.doc.resolve(
                to + (selectedLineEnd - selectedLineStart + 1) * tab.length
              )
            )
          );
          view.dispatch(tr);
        }
        return true;
      },
    };
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: backtickInputRegex,
        type: this.type,
        getAttributes: (match) => ({
          language:
            getLanguageByValueOrAlias(match[1])?.value ||
            this.options.defaultLanguage,
        }),
        autoFocus: true,
      }),
      textblockTypeInputRule({
        find: tildeInputRegex,
        type: this.type,
        getAttributes: (match) => ({
          language:
            getLanguageByValueOrAlias(match[1])?.value ||
            this.options.defaultLanguage,
        }),
        autoFocus: true,
      }),
    ];
  },
});
