import {
  TableCell as TTableCell,
  TableCellOptions as TTableCellOptions,
} from '@tiptap/extension-table-cell';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { addColumnAfter, addRowAfter } from '@tiptap/prosemirror-tables';
import {
  getCellsInColumn,
  getCellsInRow,
  isColumnSelected,
  isRowSelected,
  isTableSelected,
  selectColumn,
  selectRow,
  selectTable,
} from '../utilities';
import { mergeAttributes } from '@tiptap/core';

// TODO: tableCellHeight
export const tableCellHeight = 38;

export const TableCell = TTableCell.extend<TTableCellOptions>({
  content:
    '(paragraph | heading | blockquote | list | codeBlock | image | horizontalRule)+',

  addAttributes() {
    return {
      colspan: {
        default: 1,
        parseHTML: (element) => {
          const colspan = element.getAttribute('colspan');
          const value = colspan ? parseInt(colspan, 10) : 1;
          return value;
        },
      },
      rowspan: {
        default: 1,
        parseHTML: (element) => {
          const rowspan = element.getAttribute('rowspan');
          const value = rowspan ? parseInt(rowspan, 10) : 1;
          return value;
        },
      },
      colwidth: {
        default: [100],
        parseHTML: (element) => {
          const colwidth = element.getAttribute('colwidth');
          const value = colwidth
            ? colwidth.split(',').map((item) => parseInt(item, 10))
            : null;
          return value;
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'td' }, { tag: 'th' }];
  },

  renderHTML({ HTMLAttributes }) {
    const rowspan = Math.max(parseInt(HTMLAttributes.rowspan, 10), 1);
    return [
      'td',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        rowspan > 1
          ? {
              style: `height: ${rowspan * tableCellHeight}px`,
            }
          : {}
      ),
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('tableCellControl'),
        props: {
          decorations: (state) => {
            if (!this.editor.isEditable) {
              return DecorationSet.empty;
            }
            const { doc, selection } = state;
            const decorations: Decoration[] = [];

            // first column
            const cellsInColumn = getCellsInColumn(0)(selection);
            if (cellsInColumn) {
              let rowIndex = 0;
              const cellRowIndexMap: number[] = [];
              cellsInColumn.forEach(({ node }) => {
                const rowspan = node.attrs.rowspan || 1;
                cellRowIndexMap.push(rowIndex);
                rowIndex += rowspan;
              });

              cellsInColumn.forEach(({ pos }, index) => {
                if (index === 0) {
                  decorations.push(
                    Decoration.widget(pos + 1, () => {
                      let className = 'grip-table';
                      const selected = isTableSelected(selection);
                      if (selected) {
                        className += ' selected';
                      }
                      const grip = document.createElement('a');
                      grip.className = className;
                      grip.addEventListener('mousedown', (event) => {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        this.editor.view.dispatch(
                          selectTable(this.editor.state.tr)
                        );
                      });
                      return grip;
                    })
                  );
                }

                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    let className = 'grip-row';
                    const cellRowIndex = cellRowIndexMap[index];
                    const rowSelected = isRowSelected(cellRowIndex)(selection);
                    if (rowSelected) {
                      className += ' selected';
                    }
                    if (index === 0) {
                      className += ' first';
                    }
                    if (index === cellsInColumn.length - 1) {
                      className += ' last';
                    }
                    const grip = document.createElement('a');
                    grip.className = className;
                    const addSpan = document.createElement('span');
                    addSpan.className = 'add';
                    addSpan.textContent = '+';
                    grip.appendChild(addSpan);
                    grip.addEventListener(
                      'mousedown',
                      (event) => {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        this.editor.view.dispatch(
                          selectRow(cellRowIndex)(this.editor.state.tr)
                        );
                        if (event.target !== grip) {
                          addRowAfter(
                            this.editor.state,
                            this.editor.view.dispatch
                          );
                        }
                      },
                      true
                    );
                    return grip;
                  })
                );
              });
            }

            // first row
            const cellsInRow = getCellsInRow(0)(selection);
            if (cellsInRow) {
              let columnIndex = 0;
              const cellColumnIndexMap: number[] = [];
              cellsInRow.forEach(({ node }) => {
                const colspan = node.attrs.colspan || 1;
                cellColumnIndexMap.push(columnIndex);
                columnIndex += colspan;
              });

              cellsInRow.forEach(({ pos }, index) => {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    let className = 'grip-column';
                    const cellColumnIndex = cellColumnIndexMap[index];
                    const colSelected =
                      isColumnSelected(cellColumnIndex)(selection);
                    if (colSelected) {
                      className += ' selected';
                    }
                    if (index === 0) {
                      className += ' first';
                    } else if (index === cellsInRow.length - 1) {
                      className += ' last';
                    }
                    const grip = document.createElement('a');
                    grip.className = className;
                    const addSpan = document.createElement('span');
                    addSpan.className = 'add';
                    addSpan.textContent = '+';
                    grip.appendChild(addSpan);
                    grip.addEventListener('mousedown', (event) => {
                      event.preventDefault();
                      event.stopImmediatePropagation();
                      this.editor.view.dispatch(
                        selectColumn(cellColumnIndex)(this.editor.state.tr)
                      );
                      if (event.target !== grip) {
                        addColumnAfter(
                          this.editor.state,
                          this.editor.view.dispatch
                        );
                      }
                    });
                    return grip;
                  })
                );
              });
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
