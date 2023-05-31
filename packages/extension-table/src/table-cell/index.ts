import {
  TableCell as TTableCell,
  TableCellOptions as TTableCellOptions,
} from '@tiptap/extension-table-cell';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { addColumn, addRow, selectedRect } from '@tiptap/pm/tables';
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

export type TableCellOptions = TTableCellOptions;

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
                const rowspan = parseInt(node.attrs.rowspan) || 1;
                cellRowIndexMap.push(rowIndex);
                rowIndex += rowspan;
              });

              cellsInColumn.forEach(({ node, pos }, index) => {
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

                    const bar = document.createElement('span');
                    bar.className = 'bar';
                    grip.appendChild(bar);

                    let addBefore: HTMLSpanElement | null = null;
                    if (cellRowIndex === 0) {
                      addBefore = document.createElement('span');
                      addBefore.className = 'add before';
                      addBefore.textContent = '+';
                      grip.appendChild(addBefore);
                    }

                    const addAfter = document.createElement('span');
                    addAfter.className = 'add after';
                    addAfter.textContent = '+';
                    grip.appendChild(addAfter);

                    grip.addEventListener(
                      'mousedown',
                      (event) => {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        if (event.target === addAfter) {
                          const rect = selectedRect(state);
                          const rowspan = parseInt(node.attrs.rowspan) || 1;
                          this.editor.view.dispatch(
                            addRow(state.tr, rect, cellRowIndex + rowspan)
                          );
                        } else if (addBefore && event.target === addBefore) {
                          const rect = selectedRect(state);
                          this.editor.view.dispatch(
                            addRow(state.tr, rect, cellRowIndex)
                          );
                        } else if (event.target === bar) {
                          this.editor.view.dispatch(
                            selectRow(cellRowIndex)(this.editor.state.tr)
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
                const colspan = parseInt(node.attrs.colspan) || 1;
                cellColumnIndexMap.push(columnIndex);
                columnIndex += colspan;
              });

              cellsInRow.forEach(({ node, pos }, index) => {
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

                    const bar = document.createElement('span');
                    bar.className = 'bar';
                    grip.appendChild(bar);

                    let addBefore: HTMLSpanElement | null = null;
                    if (cellColumnIndex === 0) {
                      addBefore = document.createElement('span');
                      addBefore.className = 'add before';
                      addBefore.textContent = '+';
                      grip.appendChild(addBefore);
                    }

                    const addAfter = document.createElement('span');
                    addAfter.className = 'add after';
                    addAfter.textContent = '+';
                    grip.appendChild(addAfter);

                    grip.addEventListener('mousedown', (event) => {
                      event.preventDefault();
                      event.stopImmediatePropagation();
                      if (event.target === addAfter) {
                        const rect = selectedRect(state);
                        const colspan = parseInt(node.attrs.colspan) || 1;
                        this.editor.view.dispatch(
                          addColumn(state.tr, rect, cellColumnIndex + colspan)
                        );
                      } else if (addBefore && event.target === addBefore) {
                        const rect = selectedRect(state);
                        this.editor.view.dispatch(
                          addColumn(state.tr, rect, cellColumnIndex)
                        );
                      } else if (event.target === bar) {
                        this.editor.view.dispatch(
                          selectColumn(cellColumnIndex)(this.editor.state.tr)
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
