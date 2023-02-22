import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Extension } from '@tiptap/core';

export function getDecorations(
  doc: ProseMirrorNode,
  listTypes: string[],
  listStyleTypesMap: Record<string, string[]>
) {
  const decorations: Decoration[] = [];

  // this stack keeps track of each (nested) list to calculate the indentation level
  const processedListsStack: {
    node: ProseMirrorNode;
    startPos: number;
  }[] = [];

  doc.nodesBetween(0, doc.content.size, (node, currentNodeStartPos) => {
    if (processedListsStack.length > 0) {
      let isOutsideLastList = true;
      while (isOutsideLastList && processedListsStack.length > 0) {
        const lastList = processedListsStack[processedListsStack.length - 1];
        const lastListEndPos = lastList.startPos + lastList.node.nodeSize;
        isOutsideLastList = currentNodeStartPos >= lastListEndPos;
        // once we finish iterating over each innermost list, pop the stack to
        // decrease the indent level attribute accordingly
        if (isOutsideLastList) {
          processedListsStack.pop();
        }
      }
    }

    if (node && node.type && listTypes.includes(node.type.name)) {
      processedListsStack.push({
        node,
        startPos: currentNodeStartPos,
      });
      const from = currentNodeStartPos;
      const to = currentNodeStartPos + node.nodeSize;
      const depth = processedListsStack.length;

      const attrs: Record<string, string> = {
        'data-list-indent-level': `${depth}`,
      };

      const listStyleTypes = listStyleTypesMap[node.type.name];
      if (listStyleTypes) {
        attrs['data-list-style-type'] =
          listStyleTypes[(depth - 1) % listStyleTypes.length];
      }

      decorations.push(Decoration.node(from, to, attrs));
    }
  });

  return DecorationSet.empty.add(doc, decorations);
}

export const ListsIndentationPluginKey = new PluginKey('listsIndentation');

export type ListsIndentationOptions = {
  listTypes: string[];
  listStyleTypesMap: Record<string, string[]>;
};

export const ListsIndentation = Extension.create<ListsIndentationOptions>({
  name: 'listsIndentation',

  addOptions() {
    return {
      listTypes: ['orderedList', 'bulletList', 'taskList'],
      listStyleTypesMap: {
        orderedList: ['decimal', 'lower-alpha', 'lower-roman'],
        bulletList: ['disc', 'circle', 'square'],
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: ListsIndentationPluginKey,
        state: {
          init: (_, { doc }) => {
            return getDecorations(
              doc,
              this.options.listTypes,
              this.options.listStyleTypesMap
            );
          },
          apply: (tr, decorationSet, _oldState, state) => {
            if (tr.docChanged) {
              return getDecorations(
                state.doc,
                this.options.listTypes,
                this.options.listStyleTypesMap
              );
            }
            return decorationSet;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
