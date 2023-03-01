import { InputRule, mergeAttributes } from '@tiptap/core';
import {
  createTable,
  Table as TTable,
  TableOptions as TTableOptions,
} from '@tiptap/extension-table';
import { tableEditing, TableMap } from '@tiptap/pm/tables';
import { AllSelection, TextSelection, Selection } from '@tiptap/pm/state';
import type { Node, NodeType } from '@tiptap/pm/model';
import { columnResizing } from './columnresizing';
import { TableView } from './TableView';
import { findCellClosestToPos } from '../utilities';

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
      // 在表格内选中文字后按向上/下键
      // prosemirror-tables 默认行为: 跳到左/右的单元格
      // 调整为 跳到上/下的单元格或表格外
      ArrowUp: () => {
        const { state, dispatch } = this.editor.view;
        const { tr, selection, doc } = state;
        if (selection instanceof TextSelection && !selection.empty) {
          const cell = findCellClosestToPos(selection.$from);
          if (!cell) {
            return false;
          }
          const $cell = doc.resolve(cell.pos);
          const table = $cell.node(-1);
          if (!table) {
            return false;
          }

          const cellChildIndex = selection.$from.index(
            cell.depth - selection.$from.depth
          );

          // 单元格内第一个子节点
          if (cellChildIndex === 0) {
            const map = TableMap.get(table);
            const tableStart = $cell.start(-1);
            const topCellPos = map.nextCell(cell.pos - tableStart, 'vert', -1);

            // 跳到表格前面 或者 跳到上面的单元格
            let newPos = tableStart - 2;
            if (topCellPos !== null) {
              newPos = topCellPos + tableStart;
            }

            tr.setSelection(Selection.near(state.doc.resolve(newPos)));
            dispatch(tr);
            return true;
          }
        }
        return false;
      },
      ArrowDown: () => {
        const { state, dispatch } = this.editor.view;
        const { tr, selection, doc } = state;
        if (selection instanceof TextSelection && !selection.empty) {
          const cell = findCellClosestToPos(selection.$from);
          if (!cell) {
            return false;
          }
          const $cell = doc.resolve(cell.pos);
          const table = $cell.node(-1);
          if (!table) {
            return false;
          }

          const cellChildIndex = selection.$from.index(
            cell.depth - selection.$from.depth
          );
          const cellChildCount = $cell.nodeAfter?.childCount || 0;

          // 单元格内最后一个子节点
          if (cellChildIndex === cellChildCount - 1) {
            const map = TableMap.get(table);
            const tableStart = $cell.start(-1);
            const bottomCellPos = map.nextCell(
              cell.pos - tableStart,
              'vert',
              1
            );

            // 跳到表格后面 或者 跳到下面的单元格
            let newPos = tableStart + table.nodeSize;
            if (bottomCellPos !== null) {
              newPos = bottomCellPos + tableStart;
            }

            tr.setSelection(Selection.near(state.doc.resolve(newPos)));
            dispatch(tr);
            return true;
          }
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
