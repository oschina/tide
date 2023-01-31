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
import { mergeAttributes } from '@tiptap/core';

// TODO: tableHeaderHeight
export const tableHeaderHeight = 38;

export const TableHeader = TTableHeader.extend<TTableHeaderOptions>({
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

  renderHTML({ HTMLAttributes }) {
    const rowspan = Math.max(parseInt(HTMLAttributes.rowspan, 10), 1);
    return [
      'th',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        rowspan > 1
          ? {
              style: `height: ${rowspan * tableHeaderHeight}px`,
            }
          : {}
      ),
      0,
      // ['div', { style: 'overflow: hidden' }, 0],
    ];
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

              let columnIndex = 0;
              const cellColumnIndexMap: number[] = [];
              cells.forEach(({ node }) => {
                const colspan = node.attrs.colspan || 1;
                cellColumnIndexMap.push(columnIndex);
                columnIndex += colspan;
              });

              cells.forEach(({ pos }, index) => {
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
