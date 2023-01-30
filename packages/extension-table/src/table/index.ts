import { InputRule, mergeAttributes } from '@tiptap/core';
import {
  createTable,
  Table as TTable,
  TableOptions as TTableOptions,
} from '@tiptap/extension-table';
import { tableEditing } from '@tiptap/prosemirror-tables';
import { AllSelection, TextSelection } from 'prosemirror-state';
import type { Node, NodeType } from 'prosemirror-model';
import type { NodeView } from 'prosemirror-view';
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

export const Table = TTable.extend<TTableOptions>({
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: true,
      handleWidth: 5,
      cellMinWidth: 48,
      View: TableView as unknown as NodeView,
      lastColumnResizable: true,
      allowTableNodeSelection: false,
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    let totalWidth = 0;
    let fixedWidth = true;
    const colwidthArr: number[] = [];

    try {
      const tr = node.firstChild;
      (tr.content as unknown as { content: Node[] }).content.forEach((td) => {
        if (td.attrs.colwidth) {
          td.attrs.colwidth.forEach((col: number) => {
            if (!col) {
              fixedWidth = false;
              totalWidth += this.options.cellMinWidth;
              colwidthArr.push(this.options.cellMinWidth);
            } else {
              totalWidth += col;
              colwidthArr.push(col);
            }
          });
        } else {
          fixedWidth = false;
          const colspan = td.attrs.colspan ? td.attrs.colspan : 1;
          totalWidth += this.options.cellMinWidth * colspan;
          colwidthArr.push(...Array(colspan).fill(this.options.cellMinWidth));
        }
      });
    } catch (error) {
      fixedWidth = false;
    }

    const colgroupEls = colwidthArr.map((x) => [
      'col',
      { style: `width: ${x}px` },
    ]);

    if (fixedWidth && totalWidth > 0) {
      HTMLAttributes.style = `width: ${totalWidth}px`;
    } else if (totalWidth && totalWidth > 0) {
      HTMLAttributes.style = `min-width: ${totalWidth}px`;
    } else {
      HTMLAttributes.style = null;
    }

    return [
      'div',
      { class: 'tableWrapper' },
      [
        'div',
        { class: 'scrollWrapper' },
        [
          'table',
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
          ['colgroup', {}, ...colgroupEls],
          ['tbody', 0],
        ],
      ],
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),

      insertTable:
        ({ rows = 3, cols = 3, withHeaderRow = true } = {}) =>
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
    const isResizable = this.options.resizable && this.editor.isEditable;
    return [
      ...(isResizable
        ? [
            columnResizing({
              handleWidth: this.options.handleWidth,
              cellMinWidth: this.options.cellMinWidth,
              View: this.options.View,
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
