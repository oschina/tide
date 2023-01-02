import { mergeAttributes } from '@tiptap/core';
import {
  Table as TTable,
  TableOptions as TTableOptions,
} from '@tiptap/extension-table';
import { tableEditing } from '@tiptap/prosemirror-tables';
import { Node } from 'prosemirror-model';
import { NodeView } from 'prosemirror-view';
import { columnResizing } from './columnresizing';
import { TableView } from './TableView';

export const Table = TTable.extend<TTableOptions>({
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: false,
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
