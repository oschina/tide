import { InputRule, mergeAttributes } from '@tiptap/core';
import {
  createTable,
  Table as TTable,
  TableOptions as TTableOptions,
} from '@tiptap/extension-table';
import { tableEditing } from '@tiptap/pm/tables';
import { AllSelection, TextSelection } from '@tiptap/pm/state';
import type { Node, NodeType } from '@tiptap/pm/model';
import { columnResizing } from './columnresizing';
import { TableView } from './TableView';

function findTableInLastChild(node: Node, type: NodeType): Node | null {
  if (!node) {
    return null;
  }
  if (node.type === type) {
    return node;
  }
  return findTableInLastChild(node.lastChild, type);
}

export const tableInputRegex = /^([|｜]{2,})\n$/;

export type TableOptions = Omit<TTableOptions, 'View'>;

export const Table = TTable.extend<TableOptions>({
  /**
   * 优先级
   *
   * 表格内的 Tab 快捷键优先级需要比 task-item, list-item 内的 Tab 快捷键低
   * tiptap 默认优先级 100
   */
  priority: 99,

  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: true,
      handleWidth: 5,
      cellMinWidth: 48,
      lastColumnResizable: true,
      allowTableNodeSelection: false,
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    let totalWidth = 0;
    let fixedWidth = true;
    const colwidthArr: string[] = [];

    try {
      const row = node.firstChild;
      for (let i = 0; i < row.childCount; i += 1) {
        const { colspan, colwidth } = row.child(i).attrs;

        for (let j = 0; j < colspan; j += 1) {
          const hasWidth = colwidth && colwidth[j];
          const cssWidth = hasWidth ? `${hasWidth}px` : '';

          totalWidth += hasWidth || this.options.cellMinWidth;

          if (!hasWidth) {
            fixedWidth = false;
          }

          colwidthArr.push(cssWidth);
        }
      }
    } catch (error) {
      fixedWidth = false;
    }

    const colgroupEls = colwidthArr.map((width) => [
      'col',
      width ? { style: width } : {},
    ]);

    if (fixedWidth) {
      HTMLAttributes.style = `width: ${totalWidth}px`;
    } else if (totalWidth) {
      HTMLAttributes.style = `min-width: ${totalWidth}px`;
    } else {
      HTMLAttributes.style = null;
    }

    return [
      'table',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['colgroup', {}, ...colgroupEls],
      ['tbody', 0],
    ];
  },

  addNodeView() {
    return ({ node }) => new TableView(node, this.options.cellMinWidth);
  },

  addCommands() {
    return {
      ...this.parent?.(),

      insertTable:
        ({ rows = 3, cols = 3, withHeaderRow = false } = {}) =>
        ({ tr, state, dispatch, editor }) => {
          const $start = state.doc.resolve(tr.selection.from);
          if (
            !$start
              .node(-1)
              ?.canReplaceWith(
                $start.index(-1),
                $start.indexAfter(-1),
                this.type
              )
          ) {
            return false;
          }

          const node = createTable(editor.schema, rows, cols, withHeaderRow);

          if (dispatch) {
            const offset = tr.selection.anchor + 1;

            tr.replaceSelectionWith(node)
              .scrollIntoView()
              .setSelection(TextSelection.near(tr.doc.resolve(offset)));
          }

          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      // When a table is the last node in the document and its last cell is empty,
      // Mod + A fails to select anything but the first node of the document.
      // @see https://github.com/ueberdosis/tiptap/issues/2401
      'Mod-a': () => {
        const { state, dispatch } = this.editor.view;
        const { tr, doc } = state;
        const tableNode = findTableInLastChild(doc, this.type);
        if (tableNode) {
          tr.setSelection(new AllSelection(tr.doc));
          dispatch(tr);
          return true;
        }
        return false;
      },
    };
  },

  addInputRules() {
    return [
      new InputRule({
        find: tableInputRegex,
        handler: ({ state, range, match }) => {
          const $start = state.doc.resolve(range.from);

          if (
            !$start
              .node(-1)
              ?.canReplaceWith(
                $start.index(-1),
                $start.indexAfter(-1),
                this.type
              )
          ) {
            return null;
          }

          const rows = 3;
          const cols = Math.max(1, match[1]?.length - 1 || 0);
          const withHeaderRow = false;
          const node = createTable(
            this.editor.schema,
            rows,
            cols,
            withHeaderRow
          );

          state.tr
            .replaceRangeWith(range.from, range.to, node)
            .scrollIntoView()
            .setSelection(
              TextSelection.near(state.tr.doc.resolve(range.from + 1))
            );
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      ...(this.options.resizable
        ? [
            columnResizing({
              editor: this.editor,
              handleWidth: this.options.handleWidth,
              cellMinWidth: this.options.cellMinWidth,
              lastColumnResizable: this.options.lastColumnResizable,
            }),
          ]
        : []),
      tableEditing({
        allowTableNodeSelection: this.options.allowTableNodeSelection,
      }),
    ];
  },
});
