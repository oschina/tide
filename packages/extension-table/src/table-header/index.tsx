import React from 'react';
import ReactDOM from 'react-dom';
import {
  TableHeader as TTableHeader,
  TableHeaderOptions as TTableHeaderOptions,
} from '@tiptap/extension-table-header';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { addColumnAfter } from '@tiptap/prosemirror-tables';
import { getCellsInRow, isColumnSelected, selectColumn } from '../utilities';

export const TableHeader = TTableHeader.extend<TTableHeaderOptions>({
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
          const value = colwidth ? [parseInt(colwidth, 10)] : null;
          return value;
        },
      },
    };
  },

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
        key: new PluginKey('tableHeaderControl'),
        props: {
          decorations: (state) => {
            if (!isEditable) {
              return DecorationSet.empty;
            }
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            const cells = getCellsInRow(0)(selection);
            if (cells) {
              this.storage.clearCallbacks.forEach((cb) => cb());
              this.storage.clearCallbacks.length = 0;

              cells.forEach(({ pos }, index) => {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const colSelected = isColumnSelected(index)(selection);
                    let className = 'grip-column';
                    if (colSelected) {
                      className += ' selected';
                    }
                    if (index === 0) {
                      className += ' first';
                    } else if (index === cells.length - 1) {
                      className += ' last';
                    }
                    const grip = document.createElement('a');
                    grip.className = className;
                    ReactDOM.render(<span className="add">+</span>, grip);
                    this.storage.clearCallbacks.push(() => {
                      ReactDOM.unmountComponentAtNode(grip);
                    });
                    grip.addEventListener('mousedown', (event) => {
                      event.preventDefault();
                      event.stopImmediatePropagation();
                      this.editor.view.dispatch(
                        selectColumn(index)(this.editor.state.tr)
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
