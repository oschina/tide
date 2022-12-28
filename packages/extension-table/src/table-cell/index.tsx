import React from 'react';
import ReactDOM from 'react-dom';
import {
  TableCell as TTableCell,
  TableCellOptions as TTableCellOptions,
} from '@tiptap/extension-table-cell';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { addRowAfter } from '@tiptap/prosemirror-tables';
import {
  getCellsInColumn,
  isRowSelected,
  isTableSelected,
  selectRow,
  selectTable,
} from '../utilities';

export const TableCell = TTableCell.extend<TTableCellOptions>({
  addStorage() {
    return {
      clearCallbacks: [],
    };
  },

  onDestroy() {
    this.storage.clearCallbacks.forEach((cb) => cb());
    this.storage.clearCallbacks.length = 0;
  },

  addProseMirrorPlugins() {
    const { isEditable } = this.editor;
    return [
      new Plugin({
        key: new PluginKey('table-cell-control'),
        props: {
          decorations: (state) => {
            if (!isEditable) {
              return DecorationSet.empty;
            }
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            const cells = getCellsInColumn(0)(selection);
            if (cells) {
              this.storage.clearCallbacks.forEach((cb) => cb());
              this.storage.clearCallbacks.length = 0;

              cells.forEach(({ pos }, index) => {
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
                    const rowSelected = isRowSelected(index)(selection);
                    let className = 'grip-row';
                    if (rowSelected) {
                      className += ' selected';
                    }
                    if (index === 0) {
                      className += ' first';
                    }
                    if (index === cells.length - 1) {
                      className += ' last';
                    }
                    const grip = document.createElement('a');
                    ReactDOM.render(<span>+</span>, grip);
                    this.storage.clearCallbacks.push(() => {
                      ReactDOM.unmountComponentAtNode(grip);
                    });
                    grip.className = className;
                    grip.addEventListener(
                      'mousedown',
                      (event) => {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        if (event.target !== grip) {
                          addRowAfter(
                            this.editor.state,
                            this.editor.view.dispatch
                          );
                        } else {
                          this.editor.view.dispatch(
                            selectRow(index)(this.editor.state.tr)
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
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
